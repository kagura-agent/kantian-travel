#!/bin/bash
# nudge-health.sh — Nudge plugin observability tool
# Source: nanobot Dream observability pattern + self-evolving-observations Issue (persistent nudge blind spot)
# Created: 2026-05-28
#
# Checks whether the nudge plugin is actually producing output by examining:
#   1. Plugin config (enabled, interval, mode)
#   2. Evidence of nudge output in recent memory (gradients, skill candidates, diary entries)
#   3. Expected vs observed firing rate estimation
#
# Usage: bash tools/nudge-health.sh [--days N] [--verbose]

WORKSPACE="$HOME/.openclaw/workspace"
CONFIG="$HOME/.openclaw/openclaw.json"
DAYS=3
VERBOSE=0

while [[ $# -gt 0 ]]; do
  case "$1" in
    --days) DAYS="$2"; shift 2;;
    --verbose) VERBOSE=1; shift;;
    *) shift;;
  esac
done

echo "🔔 Nudge Health Check"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# 1. Plugin config status
echo ""
echo "## Plugin Config"
if [[ ! -f "$CONFIG" ]]; then
  echo "  ❌ Config file not found: $CONFIG"
  exit 1
fi

NUDGE_ENABLED=$(python3 -c "
import json, sys
with open('$CONFIG') as f:
    d = json.load(f)
nudge = d.get('plugins', {}).get('entries', {}).get('nudge', {})
print(json.dumps(nudge, indent=2))
" 2>/dev/null)

if echo "$NUDGE_ENABLED" | grep -q '"enabled": true'; then
  echo "  ✅ Nudge plugin: enabled"
else
  echo "  ❌ Nudge plugin: disabled or missing"
  exit 1
fi

INTERVAL=$(echo "$NUDGE_ENABLED" | python3 -c "import json,sys; d=json.load(sys.stdin); print(d.get('config',{}).get('interval', '?'))" 2>/dev/null)
MODE=$(echo "$NUDGE_ENABLED" | python3 -c "import json,sys; d=json.load(sys.stdin); print(d.get('config',{}).get('mode', '?'))" 2>/dev/null)
SKIP=$(echo "$NUDGE_ENABLED" | python3 -c "import json,sys; d=json.load(sys.stdin); print(','.join(d.get('config',{}).get('skipTriggers', [])))" 2>/dev/null)
PROMPT_FILE=$(echo "$NUDGE_ENABLED" | python3 -c "import json,sys; d=json.load(sys.stdin); print(d.get('config',{}).get('promptFile', '?'))" 2>/dev/null)

echo "  Interval: every $INTERVAL agent turns"
echo "  Mode: $MODE"
echo "  Skip triggers: $SKIP"
echo "  Prompt file: $PROMPT_FILE"

# Check prompt file exists
if [[ -f "$WORKSPACE/$PROMPT_FILE" ]]; then
  echo "  ✅ Prompt file exists ($(wc -l < "$WORKSPACE/$PROMPT_FILE") lines)"
else
  echo "  ❌ Prompt file missing: $WORKSPACE/$PROMPT_FILE"
fi

# 2. Audit log (ground truth)
echo ""
echo "## Audit Log (.nudge-audit.log)"
AUDIT_LOG="$WORKSPACE/.nudge-audit.log"
if [[ -f "$AUDIT_LOG" ]]; then
  echo "  ✅ Audit log exists ($(wc -l < "$AUDIT_LOG") entries)"

  # Count triggers vs skips in the last N days
  AUDIT_TRIGGERS=0
  AUDIT_SKIPS=0
  AUDIT_ERRORS=0
  for i in $(seq 0 $((DAYS - 1))); do
    DAY=$(date -d "$i days ago" +%Y-%m-%d 2>/dev/null || date -v-${i}d +%Y-%m-%d 2>/dev/null)
    DAY_TRIGGERS=$(grep -c "^${DAY}.*Triggering reflection" "$AUDIT_LOG" 2>/dev/null); DAY_TRIGGERS=${DAY_TRIGGERS:-0}
    DAY_SKIPS=$(grep -c "^${DAY}.*Skipped" "$AUDIT_LOG" 2>/dev/null); DAY_SKIPS=${DAY_SKIPS:-0}
    DAY_ERRORS=$(grep -c "^${DAY}.*Error\|^${DAY}.*Failed\|^${DAY}.*error" "$AUDIT_LOG" 2>/dev/null); DAY_ERRORS=${DAY_ERRORS:-0}
    AUDIT_TRIGGERS=$((AUDIT_TRIGGERS + DAY_TRIGGERS))
    AUDIT_SKIPS=$((AUDIT_SKIPS + DAY_SKIPS))
    AUDIT_ERRORS=$((AUDIT_ERRORS + DAY_ERRORS))
    if [[ $VERBOSE -eq 1 ]]; then
      echo "    $DAY: triggers=$DAY_TRIGGERS skips=$DAY_SKIPS errors=$DAY_ERRORS"
    fi
  done

  AUDIT_SUCCESS=$(grep -c "enqueued successfully\|spawned successfully" "$AUDIT_LOG" 2>/dev/null || true)
  AUDIT_SUCCESS=${AUDIT_SUCCESS:-0}
  # Filter to recent days for success count
  AUDIT_SUCCESS_RECENT=0
  for i in $(seq 0 $((DAYS - 1))); do
    DAY=$(date -d "$i days ago" +%Y-%m-%d 2>/dev/null || date -v-${i}d +%Y-%m-%d 2>/dev/null)
    DAY_SUCCESS=$(grep "^${DAY}" "$AUDIT_LOG" 2>/dev/null | grep -c "enqueued successfully\|spawned successfully"); DAY_SUCCESS=${DAY_SUCCESS:-0}
    AUDIT_SUCCESS_RECENT=$((AUDIT_SUCCESS_RECENT + DAY_SUCCESS))
  done

  echo "  Triggers (${DAYS}d): $AUDIT_TRIGGERS"
  echo "  Successful deliveries (${DAYS}d): $AUDIT_SUCCESS_RECENT"
  echo "  Skipped (heartbeat/cron): $AUDIT_SKIPS"
  echo "  Errors: $AUDIT_ERRORS"
  echo ""
  echo "  Last 5 entries:"
  tail -5 "$AUDIT_LOG" | while read -r line; do echo "    $line"; done
else
  echo "  ❌ No audit log found — nudge plugin may be outdated (pre-audit-log version)"
fi

# 3. Evidence of nudge output in recent memory
echo ""
echo "## Nudge Output Evidence (last ${DAYS} days)"

GRADIENT_COUNT=0
SKILL_CANDIDATE_COUNT=0
DIARY_WRITES=0
NO_REPLY_ESTIMATE=0

for i in $(seq 0 $((DAYS - 1))); do
  DAY=$(date -d "$i days ago" +%Y-%m-%d 2>/dev/null || date -v-${i}d +%Y-%m-%d 2>/dev/null)
  MEMFILE="$WORKSPACE/memory/$DAY.md"
  [[ -f "$MEMFILE" ]] || continue

  # Gradients written by nudge (format: [gradient] or [confirmation] or [directive])
  DAY_GRADIENTS=$(grep -c '\[gradient\]\|\[confirmation\]\|\[directive\]' "$MEMFILE" 2>/dev/null)
  DAY_GRADIENTS=${DAY_GRADIENTS:-0}
  GRADIENT_COUNT=$((GRADIENT_COUNT + DAY_GRADIENTS))

  # Skill candidates
  DAY_SKILLS=$(grep -c '\[SKILL-CANDIDATE\]\|\[SKILL\]' "$MEMFILE" 2>/dev/null)
  DAY_SKILLS=${DAY_SKILLS:-0}
  SKILL_CANDIDATE_COUNT=$((SKILL_CANDIDATE_COUNT + DAY_SKILLS))

  # Memory writes that look like nudge output (short observations, corrections)
  DAY_DIARY=$(grep -c -E '^- .*(纠正|学到|记录|偏好|correction)' "$MEMFILE" 2>/dev/null)
  DAY_DIARY=${DAY_DIARY:-0}
  DIARY_WRITES=$((DIARY_WRITES + DAY_DIARY))

  if [[ $VERBOSE -eq 1 ]]; then
    echo "  $DAY: gradients=$DAY_GRADIENTS skills=$DAY_SKILLS diary=$DAY_DIARY"
  fi
done

# Check beliefs-candidates.md for recent entries
BC_FILE="$WORKSPACE/beliefs-candidates.md"
RECENT_BC=0
if [[ -f "$BC_FILE" ]]; then
  for i in $(seq 0 $((DAYS - 1))); do
    DAY=$(date -d "$i days ago" +%Y-%m-%d 2>/dev/null || date -v-${i}d +%Y-%m-%d 2>/dev/null)
    DAY_BC=$(grep -c "^- $DAY:" "$BC_FILE" 2>/dev/null)
    DAY_BC=${DAY_BC:-0}
    RECENT_BC=$((RECENT_BC + DAY_BC))
  done
fi

echo "  Gradient entries in memory: $GRADIENT_COUNT"
echo "  Beliefs-candidates entries: $RECENT_BC"
echo "  Skill candidates: $SKILL_CANDIDATE_COUNT"
echo "  Diary-style nudge writes: $DIARY_WRITES"

TOTAL_EVIDENCE=$((GRADIENT_COUNT + RECENT_BC + SKILL_CANDIDATE_COUNT + DIARY_WRITES))

# 4. Expected vs observed analysis
echo ""
echo "## Firing Rate Estimate"

# Count agent sessions/turns from memory (rough proxy: number of ## headers in memory files)
TURN_PROXY=0
for i in $(seq 0 $((DAYS - 1))); do
  DAY=$(date -d "$i days ago" +%Y-%m-%d 2>/dev/null || date -v-${i}d +%Y-%m-%d 2>/dev/null)
  MEMFILE="$WORKSPACE/memory/$DAY.md"
  [[ -f "$MEMFILE" ]] || continue
  # Each ## section roughly represents an agent turn/session
  DAY_TURNS=$(grep -c "^## " "$MEMFILE" 2>/dev/null || true)
  DAY_TURNS=${DAY_TURNS:-0}
  TURN_PROXY=$((TURN_PROXY + DAY_TURNS))
done

# Estimate: nudge fires every N turns, but skips heartbeat/cron
# Assume ~60% of turns are heartbeat/cron (based on typical usage)
ELIGIBLE_TURNS=$(( TURN_PROXY * 40 / 100 ))
EXPECTED_FIRES=$(( ELIGIBLE_TURNS / INTERVAL ))

echo "  Approximate agent sessions (${DAYS}d): $TURN_PROXY"
echo "  Estimated eligible turns (~40%): $ELIGIBLE_TURNS"
echo "  Expected nudge firings (÷$INTERVAL): ~$EXPECTED_FIRES"
echo "  Observed evidence total: $TOTAL_EVIDENCE"

# Most nudge firings result in NO_REPLY (nothing noteworthy), so evidence is a subset
# Healthy: at least 10-20% of expected firings produce some output
echo ""
echo "## Verdict"

# Use audit log as primary signal when available, fall back to memory evidence
if [[ -f "$AUDIT_LOG" && $AUDIT_TRIGGERS -gt 0 ]]; then
  echo "  📊 Primary signal: audit log (ground truth)"
  echo "  Nudge fired $AUDIT_TRIGGERS times in ${DAYS}d ($AUDIT_SUCCESS_RECENT successful)"
  if [[ $AUDIT_ERRORS -gt 0 ]]; then
    echo "  ⚠️  $AUDIT_ERRORS errors detected — check audit log for details"
  elif [[ $AUDIT_TRIGGERS -eq 0 && $AUDIT_SKIPS -gt 10 ]]; then
    echo "  🟡 All turns were skipped (heartbeat/cron). Nudge works but needs non-cron turns to fire."
  else
    echo "  🟢 HEALTHY — Nudge is firing and delivering successfully."
  fi
  if [[ $TOTAL_EVIDENCE -eq 0 ]]; then
    echo "  ℹ️  Note: Nudge fires but produces NO_REPLY (all trivial). This is normal for routine days."
  fi
elif [[ $EXPECTED_FIRES -eq 0 ]]; then
  echo "  ⚠️  Too few eligible turns to estimate. Check .nudge-audit.log or gateway logs."
elif [[ $TOTAL_EVIDENCE -eq 0 && $EXPECTED_FIRES -gt 5 ]]; then
  echo "  🔴 UNHEALTHY — Expected ~$EXPECTED_FIRES firings but ZERO evidence."
  echo "     Check .nudge-audit.log for ground truth, or:"
  echo "     1. journalctl -u openclaw --since '1 hour ago' | grep -i nudge"
  echo "     2. cat $WORKSPACE/.nudge-audit.log | tail -20"
elif [[ $TOTAL_EVIDENCE -gt 0 && $TOTAL_EVIDENCE -lt $(( EXPECTED_FIRES / 10 )) ]]; then
  echo "  🟡 LOW — Evidence exists ($TOTAL_EVIDENCE) but much less than expected (~$EXPECTED_FIRES firings)."
  echo "     This is likely normal if most sessions are routine/cron work."
else
  echo "  🟢 HEALTHY — Evidence ($TOTAL_EVIDENCE) consistent with expected nudge activity."
fi

# 5. Gateway log check (quick)
echo ""
echo "## Gateway Log (last 1h, nudge-related)"
NUDGE_LOGS=$(journalctl -u openclaw --since "1 hour ago" 2>/dev/null | grep -i "nudge\|plugin.*fire\|plugin.*trigger" | tail -5)
if [[ -n "$NUDGE_LOGS" ]]; then
  echo "$NUDGE_LOGS" | while read -r line; do echo "  $line"; done
else
  echo "  (no nudge-related log entries found — may be normal if verbose logging not enabled for plugins)"
fi
