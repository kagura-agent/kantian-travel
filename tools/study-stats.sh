#!/bin/bash
# study-stats.sh — Report study mode effectiveness from outcome-log.jsonl
# Inspired by: Godcoder success_rate = (successes + 0.5 * partials) / total
#
# Usage: bash study-stats.sh [--days N] [--mode MODE]
#   --days N: look back N days (default 14)
#   --mode MODE: filter to specific mode
#
# Output: per-mode success_rate, total counts, trend indicators

set -euo pipefail

LOG_FILE="$HOME/.openclaw/workspace/study/outcome-log.jsonl"
DAYS=14
FILTER_MODE=""

while [[ $# -gt 0 ]]; do
    case "$1" in
        --days) DAYS="$2"; shift 2 ;;
        --mode) FILTER_MODE="$2"; shift 2 ;;
        *) echo "Unknown arg: $1"; exit 1 ;;
    esac
done

if [[ ! -f "$LOG_FILE" ]]; then
    echo "📊 Study Stats — No data yet"
    echo "   Start logging with: bash tools/study-outcome-log.sh --mode <mode> --outcome <outcome>"
    exit 0
fi

CUTOFF=$(date -d "$DAYS days ago" +%Y-%m-%d 2>/dev/null || date -v-${DAYS}d +%Y-%m-%d 2>/dev/null || echo "2000-01-01")

echo "📊 Study Outcome Stats (last ${DAYS}d, since $CUTOFF)"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "  Mode       | Signal | Partial | Empty | Total | Rate"
echo "  -----------|--------|---------|-------|-------|------"

# Process with jq if available
if command -v jq &>/dev/null; then
    MODES=("scout" "quick" "followup" "apply")
    
    TOTAL_ALL=0
    SIGNAL_ALL=0
    
    for MODE in "${MODES[@]}"; do
        [[ -n "$FILTER_MODE" && "$FILTER_MODE" != "$MODE" ]] && continue
        
        SIGNAL=$(jq -r "select(.date >= \"$CUTOFF\" and .mode == \"$MODE\" and .outcome == \"signal\") | .outcome" "$LOG_FILE" 2>/dev/null | wc -l)
        PARTIAL=$(jq -r "select(.date >= \"$CUTOFF\" and .mode == \"$MODE\" and .outcome == \"partial\") | .outcome" "$LOG_FILE" 2>/dev/null | wc -l)
        EMPTY=$(jq -r "select(.date >= \"$CUTOFF\" and .mode == \"$MODE\" and .outcome == \"empty\") | .outcome" "$LOG_FILE" 2>/dev/null | wc -l)
        TOTAL=$((SIGNAL + PARTIAL + EMPTY))
        
        if (( TOTAL > 0 )); then
            # Godcoder formula: (signal + 0.5*partial) / total
            RATE=$(echo "scale=0; ($SIGNAL * 100 + $PARTIAL * 50) / $TOTAL" | bc)
            RATE_STR="${RATE}%"
            
            # Trend indicator
            if (( RATE >= 70 )); then
                TREND="🟢"
            elif (( RATE >= 40 )); then
                TREND="🟡"
            else
                TREND="🔴"
            fi
        else
            RATE_STR="—"
            TREND="⚪"
        fi
        
        printf "  %-10s | %6d | %7d | %5d | %5d | %s %s\n" "$MODE" "$SIGNAL" "$PARTIAL" "$EMPTY" "$TOTAL" "$TREND" "$RATE_STR"
        
        TOTAL_ALL=$((TOTAL_ALL + TOTAL))
        SIGNAL_ALL=$((SIGNAL_ALL + SIGNAL))
    done
    
    echo ""
    echo "  Total sessions: $TOTAL_ALL | High-signal: $SIGNAL_ALL"
    
    # Top tags
    echo ""
    echo "  Top tags (by signal count):"
    TOP_TAGS=$(jq -r "select(.date >= \"$CUTOFF\" and .outcome == \"signal\" and .tag != null) | .tag" "$LOG_FILE" 2>/dev/null | sort | uniq -c | sort -rn | head -5)
    if [[ -n "$TOP_TAGS" ]]; then
        echo "$TOP_TAGS" | while read -r COUNT TAG; do
            echo "    ${COUNT}× $TAG"
        done
    else
        echo "    (no tagged signals yet)"
    fi
    
    # Recent trend (last 7 vs previous 7)
    if (( DAYS >= 14 )); then
        RECENT_CUT=$(date -d "7 days ago" +%Y-%m-%d 2>/dev/null || date -v-7d +%Y-%m-%d)
        RECENT_SIGNAL=$(jq -r "select(.date >= \"$RECENT_CUT\" and .outcome == \"signal\") | .outcome" "$LOG_FILE" 2>/dev/null | wc -l)
        RECENT_TOTAL=$(jq -r "select(.date >= \"$RECENT_CUT\") | .mode" "$LOG_FILE" 2>/dev/null | wc -l)
        OLDER_SIGNAL=$(jq -r "select(.date >= \"$CUTOFF\" and .date < \"$RECENT_CUT\" and .outcome == \"signal\") | .outcome" "$LOG_FILE" 2>/dev/null | wc -l)
        OLDER_TOTAL=$(jq -r "select(.date >= \"$CUTOFF\" and .date < \"$RECENT_CUT\") | .mode" "$LOG_FILE" 2>/dev/null | wc -l)
        
        if (( RECENT_TOTAL > 0 && OLDER_TOTAL > 0 )); then
            RECENT_RATE=$(echo "scale=0; $RECENT_SIGNAL * 100 / $RECENT_TOTAL" | bc)
            OLDER_RATE=$(echo "scale=0; $OLDER_SIGNAL * 100 / $OLDER_TOTAL" | bc)
            DIFF=$((RECENT_RATE - OLDER_RATE))
            if (( DIFF > 0 )); then
                echo ""
                echo "  📈 Trend: +${DIFF}pp signal rate (recent 7d vs prior 7d)"
            elif (( DIFF < 0 )); then
                echo ""
                echo "  📉 Trend: ${DIFF}pp signal rate (recent 7d vs prior 7d)"
            fi
        fi
    fi
else
    echo "  (install jq for detailed stats)"
    echo "  Total entries: $(wc -l < "$LOG_FILE")"
fi

echo ""
echo "  Formula: rate = (signal + 0.5×partial) / total × 100"
echo "  Source: Godcoder route-log-recall-optimize pattern"
