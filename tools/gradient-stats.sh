#!/usr/bin/env bash
# gradient-stats.sh — Gradient pipeline observability dashboard
# Answers: Is the gradient pipeline healthy? Are we producing self-generated gradients?
# Supports Issue #9 (reflect→gradient disconnect) monitoring.

set -euo pipefail

BELIEFS_FILE="${HOME}/.openclaw/workspace/beliefs-candidates.md"
GRADIENT_LOG="${HOME}/.openclaw/workspace/tools/.gradient-log.jsonl"
TODAY=$(date +%Y-%m-%d)

echo "📊 Gradient Pipeline Stats"
echo "━━━━━━━━━━━━━━━━━━━━━━━"

# Entry-type breakdown — gradient vs directive vs confirmation are DISTINCT.
# Only [gradient] entries flow through the graduation pipeline (pattern-counted).
# [directive] = one-time hard rules (not counted toward graduation).
# [confirmation] = product/design confirmations (not behavioral patterns).
gradients=$(grep -c "\[gradient\]" "$BELIEFS_FILE" 2>/dev/null || echo "0")
directives=$(grep -c "\[directive\]" "$BELIEFS_FILE" 2>/dev/null || echo "0")
confirmations=$(grep -c "\[confirmation\]" "$BELIEFS_FILE" 2>/dev/null || echo "0")
graduated=$(grep -c "graduated" "$BELIEFS_FILE" 2>/dev/null || echo "0")
retracted=$(grep -c "retracted" "$BELIEFS_FILE" 2>/dev/null || echo "0")
# Pipeline-eligible = gradients only (the graduation candidate pool)
total=$gradients

echo "  Gradients:      $gradients  (graduation-eligible pool)"
echo "  Directives:     $directives  (one-time rules, not counted)"
echo "  Confirmations:  $confirmations  (design confirmations, not counted)"
echo "  Graduated:      $graduated"
echo "  Retracted:      $retracted"
echo ""

# Source breakdown (from gradient log if available)
if [[ -f "$GRADIENT_LOG" ]]; then
  echo "📡 Source breakdown (from log):"
  grep -oP '"source":"[^"]*"' "$GRADIENT_LOG" | sort | uniq -c | sort -rn | while read -r count source; do
    source=$(echo "$source" | sed 's/"source":"//;s/"//')
    echo "  $source: $count"
  done
  echo ""
fi

# Source breakdown from beliefs file itself (Luna vs self)
# Scope to gradient entries only — directives are inherently Luna-sourced rules.
# Three detection paths (OR logic — any match = Luna-sourced):
# 1. New format: (Source: luna) inline on [gradient] line (from add-gradient.sh --source luna)
# 2. Old format: **Source**: Luna ... on detail lines (within 3 lines after a [gradient] entry)
# 3. Heuristic: Chinese quoted text ("...中文...") = Luna's verbatim feedback (29/32 accuracy validated 2026-05-31)
#    This catches pre-add-gradient.sh entries that lack source tags but are clearly Luna corrections.
luna_sourced_inline=$(grep "\[gradient\]" "$BELIEFS_FILE" 2>/dev/null | grep -ci "Source.*luna" || true)
luna_sourced_detail=$(grep -A 3 "\[gradient\]" "$BELIEFS_FILE" 2>/dev/null | grep -c "\*\*Source\*\*.*Luna" || true)
luna_sourced_heuristic=$(grep "\[gradient\]" "$BELIEFS_FILE" 2>/dev/null | grep -cP '"[^"]*[\x{4e00}-\x{9fff}][^"]*"' || true)
luna_sourced_inline=$(echo "${luna_sourced_inline:-0}" | head -1 | tr -dc '0-9'); luna_sourced_inline=${luna_sourced_inline:-0}
luna_sourced_detail=$(echo "${luna_sourced_detail:-0}" | head -1 | tr -dc '0-9'); luna_sourced_detail=${luna_sourced_detail:-0}
luna_sourced_heuristic=$(echo "${luna_sourced_heuristic:-0}" | head -1 | tr -dc '0-9'); luna_sourced_heuristic=${luna_sourced_heuristic:-0}
# Use max of all detection methods (they overlap — same entry may match multiple)
luna_sourced=$luna_sourced_heuristic
(( luna_sourced_inline > luna_sourced )) && luna_sourced=$luna_sourced_inline
(( luna_sourced_detail > luna_sourced )) && luna_sourced=$luna_sourced_detail
self_generated=$(( gradients - luna_sourced ))
(( self_generated < 0 )) && self_generated=0
echo "🔍 Source analysis (gradients only):"
echo "  Luna-sourced:     $luna_sourced  (tag:$luna_sourced_inline detail:$luna_sourced_detail heuristic:$luna_sourced_heuristic)"
echo "  Self-generated:   $self_generated"
  
# Also show JSONL log source breakdown (more reliable, but only for entries since 2026-05-23)
if [[ -f "$GRADIENT_LOG" ]] && [[ -s "$GRADIENT_LOG" ]]; then
  luna_from_log=$(grep -c '"source":"luna"' "$GRADIENT_LOG" || true)
  luna_from_log=$(echo "${luna_from_log:-0}" | head -1 | tr -dc '0-9'); luna_from_log=${luna_from_log:-0}
  if [[ $luna_from_log -gt 0 ]]; then
    echo "  (JSONL log: $luna_from_log Luna-sourced since log started)"
  fi
fi
echo ""

# Recency
echo "📅 Recency:"
latest_date=$(grep -oP '\d{4}-\d{2}-\d{2}' "$BELIEFS_FILE" | sort -r | head -1)
echo "  Latest gradient:  ${latest_date:-unknown}"

# Count today's
today_count=$(grep -c "$TODAY" "$BELIEFS_FILE" 2>/dev/null || true)
today_count=$(echo "${today_count:-0}" | head -1 | tr -dc '0-9'); today_count=${today_count:-0}
echo "  Today:            $today_count"

# Last 7 days
echo "  Last 7 days:"
for i in $(seq 0 6); do
  day=$(date -d "$TODAY - $i days" +%Y-%m-%d 2>/dev/null || date -v-${i}d +%Y-%m-%d 2>/dev/null)
  count=$(grep -c "$day" "$BELIEFS_FILE" 2>/dev/null || true)
  count=${count:-0}
  count=$(echo "$count" | head -1 | tr -d '[:space:]')
  if [[ "$count" -gt 0 ]]; then
    bar=$(printf '%*s' "$count" '' | tr ' ' '#')
  else
    bar=""
  fi
  echo "    $day: $count $bar"
done
echo ""

# Health assessment
echo "🏥 Pipeline Health:"
if [[ $today_count -eq 0 && $((10#$(date +%H))) -gt 12 ]]; then
  echo "  ⚠️  Zero gradients today (afternoon) — Issue #9 symptom?"
else
  echo "  ✅ Gradient production: normal"
fi

if [[ $luna_sourced -gt $((gradients / 2)) ]]; then
  echo "  ⚠️  >50% of gradients Luna-sourced — self-reflection not generating enough gradients"
else
  echo "  ✅ Source balance: healthy"
fi

# Count=1 stale candidates: gradient entries that never recurred (graduation-eligible only)
stale_count=$(grep "\[gradient\]" "$BELIEFS_FILE" 2>/dev/null | grep -c "第1次" || true)
stale_count=$(echo "${stale_count:-0}" | head -1 | tr -dc '0-9'); stale_count=${stale_count:-0}
if [[ $stale_count -gt 10 ]]; then
  echo "  ⚠️  $stale_count gradients at 第1次 — many candidates stuck without reoccurrence"
fi
