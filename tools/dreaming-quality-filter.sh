#!/usr/bin/env bash
# dreaming-quality-filter.sh — Re-rank Light Sleep candidates by content quality
# Addresses Issue #6: uniform 0.58 confidence prevents any differentiation/promotion
#
# Usage: bash tools/dreaming-quality-filter.sh [date]
#   date defaults to today (YYYY-MM-DD)
#
# Output: ranked candidates with quality scores, top N recommended for promotion
# The upstream dreaming system assigns uniform confidence (0.58) to all candidates.
# This script provides LOCAL quality differentiation using keyword heuristics.

set -uo pipefail

DATE="${1:-$(date +%Y-%m-%d)}"
LIGHT_FILE="$HOME/.openclaw/workspace/memory/dreaming/light/${DATE}.md"
TOP_N=10

if [[ ! -f "$LIGHT_FILE" ]]; then
  echo "❌ No Light Sleep file for $DATE: $LIGHT_FILE"
  exit 1
fi

echo "🌙 Dreaming Quality Filter — $DATE"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Extract candidate texts (one per line, tab-separated index)
tmpfile=$(mktemp)
trap "rm -f $tmpfile" EXIT

# Parse: extract candidate text lines
grep "^- Candidate:" "$LIGHT_FILE" | sed 's/^- Candidate: //' > "$tmpfile"

total=$(wc -l < "$tmpfile")
echo "📊 Total candidates: $total"
echo ""

if [[ $total -eq 0 ]]; then
  echo "⚠️ No candidates found."
  exit 0
fi

# Score each candidate
declare -a scores=()
declare -a reasons=()
idx=0

while IFS= read -r text; do
  score=50
  reason=""

  # === HIGH VALUE indicators (boost) ===
  if [[ "$text" =~ ^User: ]]; then
    score=$((score + 25))
    reason+="user-msg "
  fi

  if echo "$text" | grep -qiE "lesson|insight|learn|realize|mistake|should.have|next.time|pattern|principle|gradient|belief" 2>/dev/null; then
    score=$((score + 20))
    reason+="insight "
  fi

  if echo "$text" | grep -qiE "decision|strategy|direction|north.?star|positioning|differentiator|architecture" 2>/dev/null; then
    score=$((score + 15))
    reason+="strategy "
  fi

  if echo "$text" | grep -qiE "root.?cause|because.*the|mechanism|why.*works|how.*works|discovered|finding" 2>/dev/null; then
    score=$((score + 15))
    reason+="technical "
  fi

  if echo "$text" | grep -qiE "feel|感觉|开心|frustrat|proud|excited|worried|happy|sad|怕|爽" 2>/dev/null; then
    score=$((score + 10))
    reason+="emotional "
  fi

  # === LOW VALUE indicators (penalize) ===
  if echo "$text" | grep -qiE "patrol|巡检|audit.*完成|审计完成|channel.?patrol|meme.*dogfood|memory.*eval" 2>/dev/null; then
    score=$((score - 30))
    reason+="patrol "
  fi

  if echo "$text" | grep -qE "\|.*\|.*\|.*\|" 2>/dev/null; then
    score=$((score - 15))
    reason+="table "
  fi

  if echo "$text" | grep -qiE "flowforge.next|node.*done|align.*node|workloop.*complete|instance.*found|advance.*node|saturation.*skip" 2>/dev/null; then
    score=$((score - 25))
    reason+="process-log "
  fi

  if echo "$text" | grep -qiE "MERGEABLE|waiting.*review|waiting.*merge|no.*reviews|CI.*green|CI.*pass|ball.*on.*their" 2>/dev/null; then
    score=$((score - 20))
    reason+="pr-status "
  fi

  if echo "$text" | grep -qiE "committed|pushed.to|git.push|commit.*done" 2>/dev/null; then
    score=$((score - 10))
    reason+="commit-noise "
  fi

  if echo "$text" | grep -qiE "saturated|saturation.*skip|all.*modes.*locked|study.*skip" 2>/dev/null; then
    score=$((score - 25))
    reason+="saturation "
  fi

  if echo "$text" | grep -qiE "cron.*trigger|heartbeat|HEARTBEAT_OK|rate.?limit|drip.?test" 2>/dev/null; then
    score=$((score - 20))
    reason+="bot-noise "
  fi

  if echo "$text" | grep -qiE "^Let me |^Now I |^Good, |^OK\. |checking\.\.\.|Let me check|Let me search|Let me look" 2>/dev/null; then
    score=$((score - 15))
    reason+="narration "
  fi

  # Clamp
  [[ $score -lt 0 ]] && score=0
  [[ $score -gt 100 ]] && score=100

  scores[$idx]=$score
  reasons[$idx]="${reason:-none}"
  ((idx++)) || true
done < "$tmpfile"

# Sort by score and display top N
echo "🏆 Top $TOP_N candidates (quality-ranked):"
echo ""

# Build score:index pairs and sort
sorted=$(for i in "${!scores[@]}"; do echo "${scores[$i]}:$i"; done | sort -t: -k1 -rn)

shown=0
while IFS=: read -r score idx_val; do
  if ((shown >= TOP_N)); then break; fi

  # Get text from file (line idx_val+1)
  line_num=$((idx_val + 1))
  text=$(sed -n "${line_num}p" "$tmpfile")
  reason="${reasons[$idx_val]}"

  # Truncate display
  display="${text:0:120}"
  [[ ${#text} -gt 120 ]] && display+="..."

  printf "  [%3d] %s\n" "$score" "$display"
  echo "       tags: $reason"
  echo ""
  ((shown++)) || true
done <<< "$sorted"

# Score distribution
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📊 Score Distribution:"
high=0; med=0; low=0; noise=0
for s in "${scores[@]}"; do
  if ((s >= 70)); then ((high++)) || true
  elif ((s >= 50)); then ((med++)) || true
  elif ((s >= 30)); then ((low++)) || true
  else ((noise++)) || true
  fi
done
echo "  🟢 High (≥70):    $high"
echo "  🟡 Medium (50-69): $med"
echo "  🟠 Low (30-49):    $low"
echo "  🔴 Noise (<30):    $noise"
echo ""

# Promotion recommendation
if ((high >= 1)); then
  echo "✅ Recommend promoting top $high high-quality candidates"
  echo "   These differentiate from the noise and deserve deep sleep consideration."
elif ((med >= 3)); then
  echo "🟡 No standout candidates. $med medium-quality entries."
  echo "   Dreaming would correctly promote nothing today — waiting for higher-signal content."
else
  echo "⚠️ Low-quality day. $noise/$total candidates are operational noise."
  echo "   Dreaming correctly promotes nothing."
fi
