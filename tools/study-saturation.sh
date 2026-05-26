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

# Output
echo "📊 Study Saturation Check — $DATE"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
$IS_WEEKEND && echo "📅 Weekend mode active"
echo ""
echo "  Scout (all):   $SCOUT_COUNT/3  $( $SCOUT_LOCKED && echo '🔒 LOCKED' || echo '✅ open' )"
echo "  Quick scan:    $QUICK_COUNT/3  $( $QUICK_LOCKED && echo '🔒 LOCKED' || echo '✅ open' )"
echo "  Apply:         $APPLY_COUNT/3  $( $APPLY_LOCKED && echo '🔒 LOCKED' || echo '✅ open' )"
echo "  Followup:      $FOLLOWUP_COUNT/4 $( $FOLLOWUP_LOCKED && echo '🔒 LOCKED' || echo '✅ open' )"
$QUICK_DEGRADED && echo "  ⚠️  2-day quick scan saturation — max 1/day"
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
RECOMMEND=""
if $IS_WEEKEND; then
    if ! $APPLY_LOCKED; then
        RECOMMEND="apply"
    elif ! $SCOUT_LOCKED; then
        RECOMMEND="scout"
    elif ! $FOLLOWUP_LOCKED; then
        RECOMMEND="followup"
    fi
else
    # Weekday: balance based on counts
    if (( APPLY_COUNT == 0 )) && ! $APPLY_LOCKED; then
        RECOMMEND="apply"
    elif (( SCOUT_COUNT == 0 )) && ! $SCOUT_LOCKED; then
        RECOMMEND="scout"
    elif (( FOLLOWUP_COUNT == 0 )) && ! $FOLLOWUP_LOCKED; then
        RECOMMEND="followup"
    elif ! $APPLY_LOCKED; then
        RECOMMEND="apply"
    elif ! $FOLLOWUP_LOCKED; then
        RECOMMEND="followup"
    elif ! $SCOUT_LOCKED; then
        RECOMMEND="scout"
    fi
fi

if [[ -n "$RECOMMEND" ]]; then
    echo "💡 Recommended: $RECOMMEND"
fi
