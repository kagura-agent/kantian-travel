#!/usr/bin/env bash
# regression-gate.sh — Baseline regression gate for workspace tools
#
# Concept from OpenLoop (thu-nmrc/openloop): when you change a tool, verify
# its benchmark still passes before committing. Prevents "fixed the feature,
# broke the precision."
#
# Usage:
#   bash tools/regression-gate.sh              # auto-detect from git diff
#   bash tools/regression-gate.sh --all        # run all benchmarks
#   bash tools/regression-gate.sh --check FILE # check what benchmarks a file triggers
#
# Exit codes: 0 = all pass, 1 = regression detected, 2 = no benchmarks needed

set -uo pipefail

WORKSPACE="${HOME}/.openclaw/workspace"
cd "$WORKSPACE"

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m'

# ── File → Benchmark mapping ──────────────────────────────────────────
# Each entry: "glob_pattern|benchmark_command|benchmark_name"
# Glob is matched against changed file paths (relative to workspace)
declare -a RULES=(
  # Wiki search engine changes → search precision benchmark
  "wiki/search.sh|bash tools/search-bench.sh|search-precision"
  "wiki/scripts/build-coactivation-index.py|bash tools/search-bench.sh|search-precision"
  
  # DNA rule changes → overhead check
  "AGENTS.md|bash tools/dna-overhead-check.sh|dna-overhead"
  "SOUL.md|bash tools/dna-overhead-check.sh|dna-overhead"
  
  # Compression tool changes → verify core patterns still work
  "tools/compress-output.sh|echo 'test line' > /tmp/rg-test && bash tools/compress-output.sh --type generic < /tmp/rg-test >/dev/null && rm -f /tmp/rg-test|compress-output"
  
  # Wiki lint changes → run lint on a sample
  "wiki/scripts/wiki-lint.py|bash wiki/scripts/wiki-lint.sh --summary 2>/dev/null|wiki-lint"
  "wiki/scripts/wiki-lint.sh|bash wiki/scripts/wiki-lint.sh --summary 2>/dev/null|wiki-lint"
  
  # Graduation pipeline changes → dry-run
  "tools/graduation-pipeline.sh|bash tools/graduation-pipeline.sh --dry-run 2>/dev/null|graduation-pipeline"
  "scripts/evaluate-candidate.sh|bash tools/graduation-pipeline.sh --dry-run 2>/dev/null|graduation-pipeline"
  
  # Study saturation changes → self-test
  "tools/study-saturation.sh|bash tools/study-saturation.sh|study-saturation"
  
  # Retire candidates changes → dry-run
  "wiki/scripts/retire-candidates.sh|bash wiki/scripts/retire-candidates.sh --dry-run 2>/dev/null|retire-candidates"
  
  # Test ratchet changes → self-test (detect + status)
  "tools/test-ratchet.sh|bash tools/test-ratchet.sh detect ~/repos/forks/cove 2>/dev/null|test-ratchet"
)

# ── Functions ─────────────────────────────────────────────────────────

matches_pattern() {
  local file="$1" pattern="$2"
  # Simple glob: if pattern is a plain path, exact match
  # If pattern contains *, use bash glob
  if [[ "$pattern" == *"*"* ]]; then
    [[ "$file" == $pattern ]]
  else
    [[ "$file" == "$pattern" ]]
  fi
}

get_benchmarks_for_files() {
  local -a files=("$@")
  local -A seen  # deduplicate by benchmark name
  
  for file in "${files[@]}"; do
    for rule in "${RULES[@]}"; do
      IFS='|' read -r pattern command name <<< "$rule"
      if matches_pattern "$file" "$pattern"; then
        if [[ -z "${seen[$name]:-}" ]]; then
          seen[$name]=1
          echo "${name}|${command}"
        fi
      fi
    done
  done
}

run_benchmark() {
  local name="$1" command="$2"
  printf "${CYAN}⏳ Running benchmark: %s${NC}\n" "$name"
  printf "   Command: %s\n" "$command"
  
  local output exit_code
  output=$(eval "$command" 2>&1) || true
  exit_code=${PIPESTATUS[0]:-$?}
  
  if [[ $exit_code -eq 0 ]]; then
    printf "${GREEN}✅ %s — PASS${NC}\n" "$name"
    # Show summary line if available
    local summary
    summary=$(echo "$output" | grep -iE "pass|score|precision|result|total" | tail -1)
    if [[ -n "$summary" ]]; then
      printf "   %s\n" "$summary"
    fi
    return 0
  else
    printf "${RED}❌ %s — FAIL (exit %d)${NC}\n" "$name" "$exit_code"
    # Show last 5 lines of output for debugging
    echo "$output" | tail -5 | sed 's/^/   /'
    return 1
  fi
}

# ── Main ──────────────────────────────────────────────────────────────

MODE="auto"
CHECK_FILE=""

while [[ $# -gt 0 ]]; do
  case "$1" in
    --all) MODE="all"; shift ;;
    --check) MODE="check"; CHECK_FILE="$2"; shift 2 ;;
    -h|--help)
      echo "Usage: bash tools/regression-gate.sh [--all | --check FILE]"
      echo ""
      echo "Auto-detect changed files from git diff and run relevant benchmarks."
      echo "  --all     Run all registered benchmarks"
      echo "  --check   Show which benchmarks a file would trigger"
      exit 0
      ;;
    *) echo "Unknown arg: $1"; exit 1 ;;
  esac
done

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🔒 Regression Gate — Baseline Verification"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

if [[ "$MODE" == "check" ]]; then
  benchmarks=$(get_benchmarks_for_files "$CHECK_FILE")
  if [[ -z "$benchmarks" ]]; then
    echo "No benchmarks triggered by: $CHECK_FILE"
    exit 2
  fi
  echo "File: $CHECK_FILE"
  echo "Triggers:"
  while IFS='|' read -r name command; do
    printf "  • %s → %s\n" "$name" "$command"
  done <<< "$benchmarks"
  exit 0
fi

if [[ "$MODE" == "all" ]]; then
  echo "Mode: all benchmarks"
  echo ""
  
  # Collect unique benchmarks
  declare -A all_seen
  total=0 passed=0 failed=0
  
  for rule in "${RULES[@]}"; do
    IFS='|' read -r _ command name <<< "$rule"
    if [[ -z "${all_seen[$name]:-}" ]]; then
      all_seen[$name]=1
      ((total++))
      if run_benchmark "$name" "$command"; then
        ((passed++))
      else
        ((failed++))
      fi
      echo ""
    fi
  done
  
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  printf "Results: %d/%d passed" "$passed" "$total"
  [[ $failed -gt 0 ]] && printf " ${RED}(%d failed)${NC}" "$failed"
  echo ""
  
  [[ $failed -gt 0 ]] && exit 1
  exit 0
fi

# Auto mode: detect changed files from git
echo "Mode: auto (git diff detection)"

# Check both staged and unstaged changes
changed_files=()
while IFS= read -r f; do
  [[ -n "$f" ]] && changed_files+=("$f")
done < <(git diff --name-only HEAD 2>/dev/null; git diff --cached --name-only 2>/dev/null)

# Also check uncommitted changes in working directory
while IFS= read -r f; do
  [[ -n "$f" ]] && changed_files+=("$f")
done < <(git diff --name-only 2>/dev/null)

# Deduplicate
if [[ ${#changed_files[@]} -gt 0 ]]; then
  mapfile -t changed_files < <(printf '%s\n' "${changed_files[@]}" | sort -u)
fi

if [[ ${#changed_files[@]} -eq 0 ]]; then
  echo "No changed files detected (clean working tree)"
  exit 2
fi

printf "Changed files: %d\n" "${#changed_files[@]}"
for f in "${changed_files[@]}"; do
  printf "  • %s\n" "$f"
done
echo ""

# Find triggered benchmarks
benchmarks=$(get_benchmarks_for_files "${changed_files[@]}")

if [[ -z "$benchmarks" ]]; then
  printf "${GREEN}✅ No regression benchmarks needed for these changes${NC}\n"
  exit 2
fi

# Run triggered benchmarks
total=0 passed=0 failed=0
while IFS='|' read -r name command; do
  ((total++))
  if run_benchmark "$name" "$command"; then
    ((passed++))
  else
    ((failed++))
  fi
  echo ""
done <<< "$benchmarks"

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
printf "Results: %d/%d passed" "$passed" "$total"
[[ $failed -gt 0 ]] && printf " ${RED}(%d failed)${NC}" "$failed"
echo ""

[[ $failed -gt 0 ]] && exit 1
exit 0
