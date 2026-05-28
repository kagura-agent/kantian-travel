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

# 2. Evidence of nudge output in recent memory
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

# 3. Expected vs observed analysis
echo ""
echo "## Firing Rate Estimate"

# Count agent sessions/turns from memory (rough proxy: number of ## headers in memory files)
TURN_PROXY=0
for i in $(seq 0 $((DAYS - 1))); do
  DAY=$(date -d "$i days ago" +%Y-%m-%d 2>/dev/null || date -v-${i}d +%Y-%m-%d 2>/dev/null)
  MEMFILE="$WORKSPACE/memory/$DAY.md"
  [[ -f "$MEMFILE" ]] || continue
  # Each ## section roughly represents an agent turn/session
  DAY_TURNS=$(grep -c "^## " "$MEMFILE" 2>/dev/null || echo 0)
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

if [[ $EXPECTED_FIRES -eq 0 ]]; then
  echo "  ⚠️  Too few eligible turns to estimate. Check gateway logs directly."
elif [[ $TOTAL_EVIDENCE -eq 0 && $EXPECTED_FIRES -gt 5 ]]; then
  echo "  🔴 UNHEALTHY — Expected ~$EXPECTED_FIRES firings but ZERO evidence in memory."
  echo "     Possible causes:"
  echo "     - Nudge is firing but always returning NO_REPLY (all trivial)"
  echo "     - Nudge is not actually firing (plugin broken)"
  echo "     - Nudge output going to wrong location"
  echo ""
  echo "  Diagnostic steps:"
  echo "     1. Check gateway logs: journalctl -u openclaw --since '1 hour ago' | grep -i 'nudge\\|plugin'"
  echo "     2. Check if plugin process exists in gateway status"
  echo "     3. Run a manual test: have a non-trivial conversation and check if nudge fires after $INTERVAL turns"
elif [[ $TOTAL_EVIDENCE -gt 0 && $TOTAL_EVIDENCE -lt $(( EXPECTED_FIRES / 10 )) ]]; then
  echo "  🟡 LOW — Evidence exists ($TOTAL_EVIDENCE) but much less than expected (~$EXPECTED_FIRES firings)."
  echo "     This is likely normal if most sessions are routine/cron work."
  echo "     Monitor: if Luna correction sessions don't produce gradients, investigate."
else
  echo "  🟢 HEALTHY — Evidence ($TOTAL_EVIDENCE) consistent with expected nudge activity."
fi

# 4. Gateway log check (quick)
echo ""
echo "## Gateway Log (last 1h, nudge-related)"
NUDGE_LOGS=$(journalctl -u openclaw --since "1 hour ago" 2>/dev/null | grep -i "nudge\|plugin.*fire\|plugin.*trigger" | tail -5)
if [[ -n "$NUDGE_LOGS" ]]; then
  echo "$NUDGE_LOGS" | while read -r line; do echo "  $line"; done
else
  echo "  (no nudge-related log entries found — may be normal if verbose logging not enabled for plugins)"
fi
