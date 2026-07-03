#!/bin/bash
# study-saturation.sh — Check study mode saturation for today
# Usage: bash study-saturation.sh [YYYY-MM-DD]
# Returns: recommended modes, locked modes, and overall status

set -euo pipefail

DATE="${1:-$(date +%Y-%m-%d)}"
MEM_FILE="$HOME/.openclaw/workspace/memory/${DATE}.md"
DOW=$(date -d "$DATE" +%u 2>/dev/null || date -j -f "%Y-%m-%d" "$DATE" +%u 2>/dev/null || echo "?")

# Count occurrences — ONLY from ## Study section headers, not any line mentioning keywords
# Previous version matched any line with "Scout"/"scout" etc., causing massive false positives
# from dreaming candidates, summaries, and other non-study content.
if [[ -f "$MEM_FILE" ]]; then
    # Scout: ## Study Scout headers (deep scout sessions)
    DEEP_SCOUT=$(grep -c "^## Study Scout" "$MEM_FILE" 2>/dev/null) || DEEP_SCOUT=0
    # Quick scan: ## Study Quick headers
    QUICK_COUNT=$(grep -c "^## Study Quick" "$MEM_FILE" 2>/dev/null) || QUICK_COUNT=0
    # Total scout = deep scout + quick scan
    SCOUT_COUNT=$((DEEP_SCOUT + QUICK_COUNT))
    APPLY_COUNT=$(grep -c "^## Study Apply" "$MEM_FILE" 2>/dev/null) || APPLY_COUNT=0
    FOLLOWUP_COUNT=$(grep -c "^## Study Followup\|^## Study Follow" "$MEM_FILE" 2>/dev/null) || FOLLOWUP_COUNT=0
else
    SCOUT_COUNT=0
    QUICK_COUNT=0
    APPLY_COUNT=0
    FOLLOWUP_COUNT=0
fi

# Determine weekend
IS_WEEKEND=false
if [[ "$DOW" == "6" || "$DOW" == "7" ]]; then
    IS_WEEKEND=true
fi

# Check locks
SCOUT_LOCKED=false
QUICK_LOCKED=false
APPLY_LOCKED=false
FOLLOWUP_LOCKED=false
FOLLOWUP_EMPTY=false

if (( SCOUT_COUNT >= 3 )); then
    SCOUT_LOCKED=true
    QUICK_LOCKED=true
fi
if (( QUICK_COUNT >= 3 )); then
    QUICK_LOCKED=true
fi
if (( APPLY_COUNT >= 3 )); then
    APPLY_LOCKED=true
fi
if (( FOLLOWUP_COUNT >= 4 )); then
    FOLLOWUP_LOCKED=true
fi

# Pre-check: are there unapplied items in the backlog?
# Prevents recommending apply when there's nothing actionable in unapplied.md
# (though other sources like preflight gradients, observations may still exist)
APPLY_BACKLOG=0
APPLY_BACKLOG_EMPTY=false
if ! $APPLY_LOCKED; then
    UNAPPLIED_FILE="$HOME/.openclaw/workspace/study/unapplied.md"
    if [[ -f "$UNAPPLIED_FILE" ]]; then
        APPLY_BACKLOG=$(grep -c '^- \[ \]' "$UNAPPLIED_FILE" 2>/dev/null) || APPLY_BACKLOG=0
    fi
    if (( APPLY_BACKLOG == 0 )); then
        APPLY_BACKLOG_EMPTY=true
        # Auto-lock apply when backlog is empty AND today already has an empty apply outcome
        # Prevents repeated empty apply rounds (Godcoder outcome stats: 4/7 empty when backlog depleted)
        EMPTY_APPLY_TODAY=0
        if command -v jq &>/dev/null && [[ -f "$HOME/.openclaw/workspace/study/outcome-log.jsonl" ]]; then
            EMPTY_APPLY_TODAY=$(jq -r "select(.date == \"$DATE\" and .mode == \"apply\" and .outcome == \"empty\")" "$HOME/.openclaw/workspace/study/outcome-log.jsonl" 2>/dev/null | grep -c '"mode"' || true)
            EMPTY_APPLY_TODAY=${EMPTY_APPLY_TODAY:-0}
        fi
        if (( EMPTY_APPLY_TODAY >= 1 )); then
            APPLY_LOCKED=true
            APPLY_BACKLOG_EMPTY=true  # keep the flag for display
        fi
    fi
fi

# Pre-check: are there actually followup items due today?
# Uses study/followup-status.sh (same script the followup node uses as its gate)
# Prevents recommending followup when the node would immediately skip.
# Must run BEFORE display so output reflects correct state.
FOLLOWUP_DUE=0
FOLLOWUP_EMPTY=false
if ! $FOLLOWUP_LOCKED; then
    FOLLOWUP_OUTPUT=$(bash "$HOME/.openclaw/workspace/study/followup-status.sh" 2>/dev/null || true)
    if [[ -n "$FOLLOWUP_OUTPUT" ]]; then
        # study/followup-status.sh outputs "⏰ DUE ITEMS (N):" when items are due
        # or "✅ No items due today or overdue." when none
        FOLLOWUP_DUE=$(echo "$FOLLOWUP_OUTPUT" | grep -oP 'DUE ITEMS \(\K[0-9]+' || echo "0")
        if (( FOLLOWUP_DUE == 0 )); then
            FOLLOWUP_LOCKED=true
            FOLLOWUP_EMPTY=true
        fi
    fi
fi

# Check consecutive same-mode runs (GenericAgent "diminishing returns" pattern)
# "Same dimension improved 2 rounds with no J lift → saturated, switch direction"
# Extract the last 2 study mode headers from today's memory
CONSEC_WARN=""
if [[ -f "$MEM_FILE" ]]; then
    # Get last 3 study mode types (Scout/Quick/Apply/Followup) from section headers
    LAST_MODES=$(grep -o '^## Study [A-Za-z]*' "$MEM_FILE" 2>/dev/null | tail -3 | sed 's/^## Study //' | tr '[:upper:]' '[:lower:]' || true)
    LAST_MODES_ARR=()
    while IFS= read -r m; do [[ -n "$m" ]] && LAST_MODES_ARR+=("$m"); done <<< "$LAST_MODES"
    if (( ${#LAST_MODES_ARR[@]} >= 2 )); then
        LAST1="${LAST_MODES_ARR[-1]}"
        LAST2="${LAST_MODES_ARR[-2]}"
        if [[ "$LAST1" == "$LAST2" ]]; then
            CONSEC_WARN="$LAST1"
            # If 3 consecutive same mode, stronger warning
            if (( ${#LAST_MODES_ARR[@]} >= 3 )); then
                LAST3="${LAST_MODES_ARR[-3]}"
                [[ "$LAST1" == "$LAST3" ]] && CONSEC_WARN="${LAST1}:3"
            fi
        fi
    fi
fi

# Check consecutive-day quick scan (yesterday)
YESTERDAY=$(date -d "$DATE - 1 day" +%Y-%m-%d 2>/dev/null || date -j -v-1d -f "%Y-%m-%d" "$DATE" +%Y-%m-%d 2>/dev/null || echo "")
YESTERDAY_QUICK=0
if [[ -n "$YESTERDAY" && -f "$HOME/.openclaw/workspace/memory/${YESTERDAY}.md" ]]; then
    YESTERDAY_QUICK=$(grep -c "^## Study Quick" "$HOME/.openclaw/workspace/memory/${YESTERDAY}.md" 2>/dev/null) || YESTERDAY_QUICK=0
fi
QUICK_DEGRADED=false
if (( YESTERDAY_QUICK >= 3 && QUICK_COUNT >= 3 )); then
    QUICK_DEGRADED=true
fi

# Inter-day scout interval check (gradient: scout-interval-awareness)
# Guide says scout appropriate "≥3 days since last scout". If recent, warn.
SCOUT_DAYS_AGO=99
for i in 1 2; do
    CHECK_DATE=$(date -d "$DATE - $i day" +%Y-%m-%d 2>/dev/null || date -j -v-${i}d -f "%Y-%m-%d" "$DATE" +%Y-%m-%d 2>/dev/null || echo "")
    if [[ -n "$CHECK_DATE" && -f "$HOME/.openclaw/workspace/memory/${CHECK_DATE}.md" ]]; then
        if grep -q "^## Study Scout" "$HOME/.openclaw/workspace/memory/${CHECK_DATE}.md" 2>/dev/null; then
            (( i < SCOUT_DAYS_AGO )) && SCOUT_DAYS_AGO=$i
        fi
    fi
done
SCOUT_RECENT=false
if (( SCOUT_DAYS_AGO <= 2 )); then
    SCOUT_RECENT=true
fi

# Output
echo "📊 Study Saturation Check — $DATE"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
$IS_WEEKEND && echo "📅 Weekend mode active"
echo ""
echo "  Scout (all):   $SCOUT_COUNT/3  $( $SCOUT_LOCKED && echo '🔒 LOCKED' || echo '✅ open' )"
echo "  Quick scan:    $QUICK_COUNT/3  $( $QUICK_LOCKED && echo '🔒 LOCKED' || echo '✅ open' )"
echo "  Apply:         $APPLY_COUNT/3  $( $APPLY_LOCKED && echo '🔒 LOCKED' || echo '✅ open' )$( $APPLY_BACKLOG_EMPTY && ! $APPLY_LOCKED && echo ' (backlog empty)' || true )$( $APPLY_BACKLOG_EMPTY && $APPLY_LOCKED && (( APPLY_COUNT < 3 )) && echo ' (auto-locked: backlog empty + prior empty outcome)' || true )"
echo "  Followup:      $FOLLOWUP_COUNT/4 $( $FOLLOWUP_LOCKED && echo '🔒 LOCKED' || echo '✅ open' )$( $FOLLOWUP_EMPTY && echo ' (0 items due)' || true )"
# Show 7d success_rate if data exists
OUTCOME_LOG="$HOME/.openclaw/workspace/study/outcome-log.jsonl"
if [[ -f "$OUTCOME_LOG" ]] && command -v jq &>/dev/null; then
    WEEK_CUT=$(date -d "7 days ago" +%Y-%m-%d 2>/dev/null || date -v-7d +%Y-%m-%d 2>/dev/null || echo "")
    if [[ -n "$WEEK_CUT" ]]; then
        WEEK_TOTAL=$(jq -r "select(.date >= \"$WEEK_CUT\")" "$OUTCOME_LOG" 2>/dev/null | grep -c '"mode"' || true)
        WEEK_TOTAL=${WEEK_TOTAL:-0}
        WEEK_SIGNAL=$(jq -r "select(.date >= \"$WEEK_CUT\" and .outcome == \"signal\")" "$OUTCOME_LOG" 2>/dev/null | grep -c '"signal"' || true)
        WEEK_SIGNAL=${WEEK_SIGNAL:-0}
        if (( WEEK_TOTAL >= 3 )); then
            WEEK_RATE=$(echo "scale=0; $WEEK_SIGNAL * 100 / $WEEK_TOTAL" | bc)
            echo "  Signal rate:   ${WEEK_RATE}% (${WEEK_SIGNAL}/${WEEK_TOTAL} last 7d)"
        fi
    fi
fi
$QUICK_DEGRADED && echo "  ⚠️  2-day quick scan saturation — max 1/day"
$SCOUT_RECENT && echo "  ⚠️  Last deep scout ${SCOUT_DAYS_AGO}d ago (guide: ≥3d between scouts)"
if [[ -n "$CONSEC_WARN" ]]; then
    CONSEC_MODE="${CONSEC_WARN%%:*}"
    if [[ "$CONSEC_WARN" == *":3" ]]; then
        echo "  🔴 3 consecutive ${CONSEC_MODE} runs — diminishing returns, SWITCH mode"
    else
        echo "  🟡 2 consecutive ${CONSEC_MODE} runs — consider switching mode"
    fi
fi
echo ""

# Recommendations
AVAILABLE=()
$SCOUT_LOCKED || AVAILABLE+=("scout")
$QUICK_LOCKED || AVAILABLE+=("quick_scan")
$APPLY_LOCKED || AVAILABLE+=("apply")
$FOLLOWUP_LOCKED || AVAILABLE+=("followup")

if (( ${#AVAILABLE[@]} == 0 )); then
    echo "🛑 ALL MODES SATURATED — skip this study round"
    echo "   Record: 「Study 全模式饱和，跳过」"
    exit 0
fi

echo "Available modes: ${AVAILABLE[*]}"

# Smart recommendation
# If consecutive same-mode detected, deprioritize that mode
# If scout was recent (<3 days), deprioritize scout/quick_scan
CONSEC_MODE_LOWER=""
[[ -n "$CONSEC_WARN" ]] && CONSEC_MODE_LOWER="${CONSEC_WARN%%:*}"

RECOMMEND=""
if $IS_WEEKEND; then
    if ! $APPLY_LOCKED && ! $APPLY_BACKLOG_EMPTY && [[ "$CONSEC_MODE_LOWER" != "apply" ]]; then
        RECOMMEND="apply"
    elif ! $SCOUT_LOCKED && ! $SCOUT_RECENT && [[ "$CONSEC_MODE_LOWER" != "scout" && "$CONSEC_MODE_LOWER" != "quick" ]]; then
        RECOMMEND="scout"
    elif ! $FOLLOWUP_LOCKED && [[ "$CONSEC_MODE_LOWER" != "followup" && "$CONSEC_MODE_LOWER" != "follow" ]]; then
        RECOMMEND="followup"
    elif ! $APPLY_LOCKED && ! $APPLY_BACKLOG_EMPTY; then
        RECOMMEND="apply"
    # --- Modes-with-warnings tier (better than apply-with-empty-backlog) ---
    elif ! $SCOUT_LOCKED && [[ "$CONSEC_MODE_LOWER" != "scout" && "$CONSEC_MODE_LOWER" != "quick" ]]; then
        RECOMMEND="scout (recent, but better than empty-backlog apply)"
    elif ! $FOLLOWUP_LOCKED; then
        RECOMMEND="followup"
    elif ! $SCOUT_LOCKED; then
        RECOMMEND="scout"
    elif ! $APPLY_LOCKED; then
        RECOMMEND="apply (backlog empty — mine today's deep reads/observations for patterns, or skip)"
    fi
else
    # Weekday: balance based on counts, avoid consecutive same mode
    # Priority: apply-with-backlog > scout > followup > modes-with-warnings > apply-without-backlog
    # Key fix (06-26): apply-without-backlog should be LAST resort, not a mid-tier fallback.
    # Modes with yellow warnings (consecutive-2, recent-scout) are better than apply-with-nothing.
    if (( APPLY_COUNT == 0 )) && ! $APPLY_LOCKED && ! $APPLY_BACKLOG_EMPTY && [[ "$CONSEC_MODE_LOWER" != "apply" ]]; then
        RECOMMEND="apply"
    elif (( SCOUT_COUNT == 0 )) && ! $SCOUT_LOCKED && ! $SCOUT_RECENT && [[ "$CONSEC_MODE_LOWER" != "scout" && "$CONSEC_MODE_LOWER" != "quick" ]]; then
        RECOMMEND="scout"
    elif (( FOLLOWUP_COUNT == 0 )) && ! $FOLLOWUP_LOCKED && [[ "$CONSEC_MODE_LOWER" != "followup" && "$CONSEC_MODE_LOWER" != "follow" ]]; then
        RECOMMEND="followup"
    elif ! $APPLY_LOCKED && ! $APPLY_BACKLOG_EMPTY && [[ "$CONSEC_MODE_LOWER" != "apply" ]]; then
        RECOMMEND="apply"
    elif ! $FOLLOWUP_LOCKED && [[ "$CONSEC_MODE_LOWER" != "followup" && "$CONSEC_MODE_LOWER" != "follow" ]]; then
        RECOMMEND="followup"
    elif ! $SCOUT_LOCKED && ! $SCOUT_RECENT && [[ "$CONSEC_MODE_LOWER" != "scout" && "$CONSEC_MODE_LOWER" != "quick" ]]; then
        RECOMMEND="scout"
    elif ! $APPLY_LOCKED && ! $APPLY_BACKLOG_EMPTY; then
        RECOMMEND="apply"
    # --- Modes-with-warnings tier (better than apply-with-empty-backlog) ---
    elif ! $SCOUT_LOCKED && [[ "$CONSEC_MODE_LOWER" != "scout" && "$CONSEC_MODE_LOWER" != "quick" ]]; then
        # Scout is available but was recent (<3d) — still better than applying nothing
        RECOMMEND="scout (recent, but better than empty-backlog apply)"
    elif ! $QUICK_LOCKED; then
        # Quick scan with consecutive warning — still productive
        RECOMMEND="quick_scan (consecutive runs — try different sources)"
    elif ! $SCOUT_LOCKED; then
        RECOMMEND="scout"
    elif ! $FOLLOWUP_LOCKED; then
        RECOMMEND="followup"
    elif ! $APPLY_LOCKED; then
        # True last resort: backlog empty, all other modes locked or warned
        RECOMMEND="apply (backlog empty — mine today's deep reads/observations for patterns, or skip)"
    fi
fi

if [[ -n "$RECOMMEND" ]]; then
    echo "💡 Recommended: $RECOMMEND"
fi
