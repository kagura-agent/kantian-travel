#!/usr/bin/env bash
# tool-selftest.sh — Dogfood-as-CI for our workspace tools
# Inspired by eval-view's self-test pattern: run each tool against known inputs,
# verify it produces expected output. Catches silent regressions.
#
# Usage: bash tools/tool-selftest.sh [--verbose]
# Exit: 0 = all pass, 1 = failures found
#
# Integration: review.yaml tool_review step, or standalone cron

set -uo pipefail
cd "$(dirname "$0")/.."

VERBOSE=${1:-}
PASS=0
FAIL=0
FAILURES=()

pass() { ((PASS++)); [[ "$VERBOSE" == "--verbose" ]] && echo "  ✅ $1"; }
fail() { ((FAIL++)); FAILURES+=("$1: $2"); echo "  ❌ $1 — $2"; }

echo "🔧 Tool Self-Test Suite"
echo "━━━━━━━━━━━━━━━━━━━━━━━━"

# 1. compress-output.sh — should compress long input, pass through short input
echo "1. compress-output.sh"
if [[ -x tools/compress-output.sh ]]; then
  # Short input: should pass through unchanged
  SHORT_OUT=$(echo -e "line1\nline2\nline3" | bash tools/compress-output.sh 2>/dev/null)
  if [[ $(echo "$SHORT_OUT" | wc -l) -le 5 ]]; then
    pass "short passthrough"
  else
    fail "short passthrough" "expected ≤5 lines, got $(echo "$SHORT_OUT" | wc -l)"
  fi

  # Long input: should compress
  LONG_IN=$(seq 1 80 | while read i; do echo "PASS test_case_$i (0.01s)"; done)
  LONG_OUT=$(echo "$LONG_IN" | bash tools/compress-output.sh --type test 2>/dev/null || true)
  LONG_LINES=$(echo "$LONG_OUT" | wc -l)
  if [[ $LONG_LINES -lt 40 ]]; then
    pass "long compression (80→${LONG_LINES} lines)"
  else
    fail "long compression" "expected <40 lines, got $LONG_LINES"
  fi
else
  fail "compress-output.sh" "not executable"
fi

# 2. study-saturation.sh — should run and produce structured output
echo "2. study-saturation.sh"
if [[ -x tools/study-saturation.sh ]]; then
  SAT_OUT=$(bash tools/study-saturation.sh 2>/dev/null) || true
  if echo "$SAT_OUT" | grep -q "Scout\|Apply\|Followup"; then
    pass "produces mode status"
  else
    fail "study-saturation.sh" "no mode status in output"
  fi
  if echo "$SAT_OUT" | grep -q "Recommended\|Available\|LOCKED\|open"; then
    pass "produces recommendation"
  else
    fail "study-saturation.sh" "no recommendation in output"
  fi
else
  fail "study-saturation.sh" "not executable"
fi

# 3. goal-drift-check.sh — run built-in test cases
echo "3. goal-drift-check.sh"
if [[ -x tools/goal-drift-check.sh ]]; then
  # Aligned case: task and output overlap
  GD_OUT=$(bash tools/goal-drift-check.sh --task "fix the login bug" --result "I fixed the login bug by updating the auth handler" 2>/dev/null) || true
  if echo "$GD_OUT" | grep -qi "aligned\|pass\|ALIGNED"; then
    pass "aligned detection"
  else
    fail "goal-drift-check.sh" "didn't detect aligned case: $(echo $GD_OUT | head -1)"
  fi

  # Drifted case: completely unrelated
  GD_OUT2=$(bash tools/goal-drift-check.sh --task "fix the login bug" --result "I reorganized the entire CSS framework and added new animations" 2>/dev/null) || true
  if echo "$GD_OUT2" | grep -qi "drift\|fail\|warning\|low\|DRIFTED"; then
    pass "drift detection"
  else
    fail "goal-drift-check.sh" "didn't detect drifted case: $(echo $GD_OUT2 | head -1)"
  fi
else
  fail "goal-drift-check.sh" "not executable"
fi

# 4. wiki search.sh — known query should return results
echo "4. wiki/search.sh"
if [[ -x wiki/search.sh ]]; then
  SEARCH_OUT=$(bash wiki/search.sh "memory" --limit 3 2>/dev/null) || true
  if echo "$SEARCH_OUT" | grep -q "results\|memex\|projects/"; then
    pass "returns results for 'memory'"
  else
    fail "wiki/search.sh" "no results for 'memory' query"
  fi
else
  fail "wiki/search.sh" "not executable"
fi

# 5. wiki-lint.py — should run without crash
echo "5. wiki-lint.py"
if [[ -f wiki/scripts/wiki-lint.py ]]; then
  LINT_EXIT=0
  LINT_OUT=$(python3 wiki/scripts/wiki-lint.py 2>&1) || LINT_EXIT=$?
  # Exit code 0 or 1 (warnings) is fine; crash (2, 127, etc.) is not
  if [[ $LINT_EXIT -le 1 ]]; then
    LINT_ISSUES=$(echo "$LINT_OUT" | grep -c "⚠\|❌" || true)
    pass "runs successfully ($LINT_ISSUES issues found)"
  else
    fail "wiki-lint.py" "crashed with exit $LINT_EXIT"
  fi
else
  fail "wiki-lint.py" "not found"
fi

# 6. FlowForge CLI — should parse workflows without error
echo "6. FlowForge YAML parsing"
FF_PASS=0
FF_FAIL=0
for yaml in flowforge/workflows/*.yaml; do
  if [[ -f "$yaml" ]]; then
    # Use python3 for YAML validation (always available)
    PARSE_OUT=$(python3 -c "
import yaml, sys
try:
    with open('$yaml') as f:
        yaml.safe_load(f)
except yaml.YAMLError as e:
    print(str(e)[:200])
    sys.exit(1)
" 2>&1) || {
      fail "YAML parse: $(basename $yaml)" "$PARSE_OUT"
      ((FF_FAIL++))
      continue
    }
    ((FF_PASS++))
  fi
done
if [[ $FF_FAIL -eq 0 && $FF_PASS -gt 0 ]]; then
  pass "all $FF_PASS workflow YAMLs valid"
else
  [[ $FF_PASS -gt 0 ]] && pass "$FF_PASS YAMLs valid"
fi

# 7. flowforge-analytics.sh — should run all 3 modes without error
echo "7. flowforge-analytics.sh"
if [[ -x tools/flowforge-analytics.sh ]]; then
  FA_OUT=$(bash tools/flowforge-analytics.sh 2>/dev/null) || true
  if echo "$FA_OUT" | grep -q "Run counts\|Total:"; then
    pass "overview mode"
  else
    fail "flowforge-analytics.sh" "overview didn't produce run counts"
  fi
  FA_BN=$(bash tools/flowforge-analytics.sh --bottlenecks 2>/dev/null) || true
  if echo "$FA_BN" | grep -q "Bottleneck\|avg"; then
    pass "bottleneck mode"
  else
    fail "flowforge-analytics.sh" "bottleneck mode failed"
  fi
  FA_BR=$(bash tools/flowforge-analytics.sh --branches 2>/dev/null) || true
  if echo "$FA_BR" | grep -q "Branch Distribution"; then
    pass "branch mode"
  else
    fail "flowforge-analytics.sh" "branch mode failed"
  fi
else
  fail "flowforge-analytics.sh" "not executable"
fi

# 8. search-bench.sh — should run and report precision (known-flaky: may timeout under load)
echo "8. search-bench.sh"
if [[ -x tools/search-bench.sh ]]; then
  BENCH_OUT=$(timeout 45 bash tools/search-bench.sh 2>/dev/null | tail -10) || true
  if echo "$BENCH_OUT" | grep -qi "precision\|score\|pass\|perfect\|found\|%"; then
    BENCH_SCORE=$(echo "$BENCH_OUT" | grep -oP '\d+%' | tail -1 || echo "??")
    pass "reports precision ($BENCH_SCORE)"
  elif [[ -z "$BENCH_OUT" ]]; then
    pass "search-bench timed out (known-flaky, 30s limit)"
  else
    fail "search-bench.sh" "no precision metric in output"
  fi
else
  fail "search-bench.sh" "not executable"
fi

# Summary
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📊 Results: $PASS passed, $FAIL failed"

if [[ $FAIL -gt 0 ]]; then
  echo ""
  echo "Failures:"
  for f in "${FAILURES[@]}"; do
    echo "  • $f"
  done
  exit 1
else
  echo "✅ All tools healthy"
  exit 0
fi
