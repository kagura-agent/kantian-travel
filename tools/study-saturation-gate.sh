#!/usr/bin/env bash
# study-saturation-gate.sh — Pre-check for study cron noise reduction
# Two-layer gate:
#   Layer 1: If today's memory already has ≥2 full-saturation skip entries → SATURATED
#   Layer 2: If all 4 modes are locked (scout≥3 + apply≥3 + followup≥4) → SATURATED
#            Also checks followup due items — if followup is only open mode but 0 due → effectively locked
# Usage: bash tools/study-saturation-gate.sh
# Exit 0 = proceed with study, Exit 1 = skip (already saturated today)
#
# Gradient: saturation-gate-mode-availability-check (2026-06-17)
# Before: gate only checked skip count, workflow ran full cycle just to discover all modes locked
# After: gate checks both skip count AND mode availability for early exit

set -uo pipefail

SCRIPT_DIR="$(dirname "$0")"
DATE=$(date +%Y-%m-%d)
MEMORY_FILE="$HOME/.openclaw/workspace/memory/${DATE}.md"
THRESHOLD=2
DEBUG_LOG="${SCRIPT_DIR}/.saturation-gate-debug.log"

# Debug: log every invocation so we can trace false-positives
echo "[$(date '+%Y-%m-%d %H:%M:%S')] gate invoked, DATE=$DATE, MEMORY_FILE=$MEMORY_FILE" >> "$DEBUG_LOG"

# --- Layer 0: Circuit breaker check ---
if ! bash "$SCRIPT_DIR/circuit-breaker.sh" check study >/dev/null 2>&1; then
  echo "🔴 CIRCUIT OPEN — study workflow halted (consecutive failures exceeded threshold)"
  echo "   Reset with: bash tools/circuit-breaker.sh reset study"
  echo "[$(date '+%H:%M:%S')] EXIT: circuit open" >> "$DEBUG_LOG"
  exit 1
fi

if [[ ! -f "$MEMORY_FILE" ]]; then
  echo "✅ OPEN — no memory file yet today"
  echo "[$(date '+%H:%M:%S')] EXIT: no memory file" >> "$DEBUG_LOG"
  exit 0
fi

# --- Layer 1: Skip count check ---
# Count full-saturation skip entries (line-start anchored to avoid matching
# inside quoted output, candidate lines, or grep results)
skip_count=$(grep -cE "^(## Study.*全模式饱和|Study 全模式饱和|Study saturation gate: skip)" "$MEMORY_FILE" 2>/dev/null || true)

if (( skip_count >= THRESHOLD )); then
  echo "⛔ SATURATED — $skip_count skip entries already today (threshold: $THRESHOLD)"
  echo "   Skipping study workflow to reduce memory noise."
  exit 1
fi

# --- Layer 2: Mode availability check ---
# Same counting logic as study-saturation.sh (single source of truth for thresholds)
QUICK_COUNT=$(grep -c "^## Study Quick" "$MEMORY_FILE" 2>/dev/null) || QUICK_COUNT=0
APPLY_COUNT=$(grep -c "^## Study Apply" "$MEMORY_FILE" 2>/dev/null) || APPLY_COUNT=0
FOLLOWUP_COUNT=$(grep -cE "^## Study Followup|^## Study Follow" "$MEMORY_FILE" 2>/dev/null) || FOLLOWUP_COUNT=0

# Recompute scout count properly (deep + quick)
DEEP_SCOUT=$(grep -c "^## Study Scout" "$MEMORY_FILE" 2>/dev/null) || DEEP_SCOUT=0
SCOUT_COUNT=$((DEEP_SCOUT + QUICK_COUNT))

# Check locks (same thresholds as study.yaml entry node)
SCOUT_LOCKED=false; (( SCOUT_COUNT >= 3 )) && SCOUT_LOCKED=true
QUICK_LOCKED=false; (( SCOUT_COUNT >= 3 || QUICK_COUNT >= 3 )) && QUICK_LOCKED=true
APPLY_LOCKED=false; (( APPLY_COUNT >= 3 )) && APPLY_LOCKED=true
# Auto-lock apply when backlog empty + prior empty outcome today
if ! $APPLY_LOCKED; then
  UNAPPLIED_FILE="$HOME/.openclaw/workspace/study/unapplied.md"
  APPLY_BACKLOG=0
  if [[ -f "$UNAPPLIED_FILE" ]]; then
    APPLY_BACKLOG=$(grep -c '^- \[ \]' "$UNAPPLIED_FILE" 2>/dev/null) || APPLY_BACKLOG=0
  fi
  if (( APPLY_BACKLOG == 0 )) && command -v jq &>/dev/null; then
    OUTCOME_LOG="$HOME/.openclaw/workspace/study/outcome-log.jsonl"
    if [[ -f "$OUTCOME_LOG" ]]; then
      EMPTY_APPLY=$(jq -r "select(.date == \"$DATE\" and .mode == \"apply\" and .outcome == \"empty\")" "$OUTCOME_LOG" 2>/dev/null | grep -c '"mode"' || true)
      EMPTY_APPLY=${EMPTY_APPLY:-0}
      (( EMPTY_APPLY >= 1 )) && APPLY_LOCKED=true
    fi
  fi
fi
FOLLOWUP_LOCKED=false; (( FOLLOWUP_COUNT >= 4 )) && FOLLOWUP_LOCKED=true

# If followup is the only unlocked mode, check if there are actually due items
FOLLOWUP_EFFECTIVELY_LOCKED=$FOLLOWUP_LOCKED
if ! $FOLLOWUP_LOCKED && $SCOUT_LOCKED && $APPLY_LOCKED; then
  # Followup is last resort — check if any items are actually due
  TARGETS_FILE="$HOME/.openclaw/workspace/study/targets.md"
  DUE_COUNT=0
  if [[ -f "$TARGETS_FILE" ]]; then
    # Count items with revisit date ≤ today
    DUE_COUNT=$(awk -v today="$DATE" '
      /^- / {
        if (match($0, /Revisit[: ]*([0-9]{4}-[0-9]{2}-[0-9]{2})/, m)) {
          if (m[1] <= today) due++
        }
      }
      END { print due+0 }
    ' "$TARGETS_FILE" 2>/dev/null || echo 0)
  fi
  if (( DUE_COUNT == 0 )); then
    FOLLOWUP_EFFECTIVELY_LOCKED=true
  fi
fi

# All modes locked?
if $SCOUT_LOCKED && $APPLY_LOCKED && $FOLLOWUP_EFFECTIVELY_LOCKED; then
  echo "⛔ SATURATED — all modes locked (scout ${SCOUT_COUNT}/3, apply ${APPLY_COUNT}/3, followup ${FOLLOWUP_COUNT}/4$( $FOLLOWUP_LOCKED || echo ' + 0 due'))"
  echo "   $skip_count prior skips + mode availability = no productive work available."
  exit 1
fi

# --- Both layers passed ---
OPEN_MODES=()
$SCOUT_LOCKED || OPEN_MODES+=("scout")
$QUICK_LOCKED || OPEN_MODES+=("quick")
$APPLY_LOCKED || OPEN_MODES+=("apply")
$FOLLOWUP_EFFECTIVELY_LOCKED || OPEN_MODES+=("followup")

echo "✅ OPEN — $skip_count/$THRESHOLD saturation skips, ${#OPEN_MODES[@]} modes available (${OPEN_MODES[*]})"
exit 0
