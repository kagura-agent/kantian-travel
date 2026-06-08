#!/usr/bin/env bash
# dna-preflight.sh — Surface recently-violated DNA rules before task execution
# Closes the "DNA→behavior transfer gap" (Day 47 observation: rules exist but aren't followed)
#
# Usage: bash tools/dna-preflight.sh [--days N] [--context workloop|study|code]
#
# How it works:
# 1. Reads recent gradients (last N days, default 7)
# 2. Finds which ones match existing AGENTS.md/SOUL.md rules (= rule was violated)
# 3. Surfaces the top 3 most relevant reminders for the current context
#
# This is NOT a lint tool. It's a behavioral reminder — "you forgot these recently."

set -euo pipefail

WORKSPACE="${HOME}/.openclaw/workspace"
BC_FILE="${WORKSPACE}/beliefs-candidates.md"
AGENTS_FILE="${WORKSPACE}/AGENTS.md"
SOUL_FILE="${WORKSPACE}/SOUL.md"
MEMORY_DIR="${WORKSPACE}/memory"
DAYS=7
CONTEXT=""

while [[ $# -gt 0 ]]; do
  case "$1" in
    --days) DAYS="$2"; shift 2 ;;
    --context) CONTEXT="$2"; shift 2 ;;
    *) echo "Unknown arg: $1"; exit 1 ;;
  esac
done

# Collect recent gradient patterns and their behavioral changes
declare -a RECENT_PATTERNS=()
declare -A PATTERN_BEHAVIOR=()
declare -A PATTERN_SOURCE=()
declare -A PATTERN_DATE=()
declare -A PATTERN_COUNT=()

# Regex patterns stored in variables (bash =~ can't handle literal parens inline)
re_gradient='\[gradient\].*pattern: ([a-zA-Z0-9_-]+)'
re_date='^- ([0-9]{4}-[0-9]{2}-[0-9]{2})'
re_behavior='\[行为改变\] (.+)\. \(pattern:'
re_source='\(Source: ([^)]+)\)'

while IFS= read -r line; do
  if [[ "$line" =~ $re_gradient ]]; then
    tag="${BASH_REMATCH[1]}"
    # Extract date
    if [[ "$line" =~ $re_date ]]; then
      date="${BASH_REMATCH[1]}"
      # Check if within window
      cutoff=$(date -d "-${DAYS} days" +%Y-%m-%d 2>/dev/null || date -v-${DAYS}d +%Y-%m-%d 2>/dev/null)
      if [[ "$date" > "$cutoff" || "$date" == "$cutoff" ]]; then
        RECENT_PATTERNS+=("$tag")
        PATTERN_DATE["$tag"]="$date"
        PATTERN_COUNT["$tag"]=$(( ${PATTERN_COUNT["$tag"]:-0} + 1 ))
        # Extract behavior change
        if [[ "$line" =~ $re_behavior ]]; then
          PATTERN_BEHAVIOR["$tag"]="${BASH_REMATCH[1]}"
        fi
        # Extract source
        if [[ "$line" =~ $re_source ]]; then
          PATTERN_SOURCE["$tag"]="${BASH_REMATCH[1]}"
        fi
      fi
    fi
  fi
done < "$BC_FILE"

if [[ ${#RECENT_PATTERNS[@]} -eq 0 ]]; then
  echo "✅ No recent gradient violations (last ${DAYS} days). Clean slate!"
  exit 0
fi

# Deduplicate patterns
declare -A SEEN=()
UNIQUE_PATTERNS=()
for p in "${RECENT_PATTERNS[@]}"; do
  if [[ -z "${SEEN[$p]:-}" ]]; then
    SEEN["$p"]=1
    UNIQUE_PATTERNS+=("$p")
  fi
done

# Match patterns against AGENTS.md/SOUL.md to find DNA-rule violations
# (gradient about something already in DNA = rule exists but wasn't followed)
declare -A DNA_MATCH=()
AGENTS_CONTENT=$(cat "$AGENTS_FILE" "$SOUL_FILE" 2>/dev/null)

# Context-specific keyword mapping for relevance scoring
declare -A CONTEXT_KEYWORDS=(
  ["workloop"]="code|PR|push|test|subagent|Claude Code|implement|branch|issue|review"
  ["study"]="scout|followup|apply|wiki|track|insight|pattern"
  ["code"]="code|test|push|PR|Claude Code|implement|branch|review|write"
)

# Score each pattern for relevance
declare -A PATTERN_SCORE=()
for tag in "${UNIQUE_PATTERNS[@]}"; do
  score=1
  
  # Recurrence bonus: if this pattern appeared multiple times, it's more important
  count="${PATTERN_COUNT[$tag]:-1}"
  if [[ "$count" -ge 2 ]]; then
    score=$((score + 2))
  fi
  
  # Recency bonus: if from today or yesterday
  pdate="${PATTERN_DATE[$tag]:-}"
  today=$(date +%Y-%m-%d)
  yesterday=$(date -d "yesterday" +%Y-%m-%d 2>/dev/null || date -v-1d +%Y-%m-%d 2>/dev/null)
  if [[ "$pdate" == "$today" ]]; then
    score=$((score + 3))
  elif [[ "$pdate" == "$yesterday" ]]; then
    score=$((score + 2))
  fi
  
  # DNA-match bonus: if this matches an existing AGENTS.md rule, it's a repeat offense
  # Convert tag hyphens to spaces for fuzzy matching
  search_terms=$(echo "$tag" | tr '-' ' ')
  for term in $search_terms; do
    if [[ ${#term} -ge 4 ]] && echo "$AGENTS_CONTENT" | grep -qi "$term"; then
      DNA_MATCH["$tag"]="yes"
      score=$((score + 2))
      break
    fi
  done
  
  # Context relevance bonus
  if [[ -n "$CONTEXT" && -n "${CONTEXT_KEYWORDS[$CONTEXT]:-}" ]]; then
    behavior="${PATTERN_BEHAVIOR[$tag]:-}"
    if echo "$behavior" | grep -qiE "${CONTEXT_KEYWORDS[$CONTEXT]}"; then
      score=$((score + 2))
    fi
  fi
  
  # Source bonus: luna-sourced corrections are higher signal
  src="${PATTERN_SOURCE[$tag]:-}"
  if [[ "$src" == "luna" ]]; then
    score=$((score + 1))
  fi
  
  PATTERN_SCORE["$tag"]=$score
done

# Sort by score (descending), take top 3
sorted=$(for tag in "${UNIQUE_PATTERNS[@]}"; do
  echo "${PATTERN_SCORE[$tag]:-0} $tag"
done | sort -rn | head -3)

echo "⚡ DNA Preflight — Recent Behavioral Reminders"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
if [[ -n "$CONTEXT" ]]; then
  echo "  Context: $CONTEXT | Window: ${DAYS}d | Total recent violations: ${#UNIQUE_PATTERNS[@]}"
else
  echo "  Window: ${DAYS}d | Total recent violations: ${#UNIQUE_PATTERNS[@]}"
fi
echo ""

rank=0
while IFS= read -r line; do
  score=$(echo "$line" | awk '{print $1}')
  tag=$(echo "$line" | awk '{print $2}')
  rank=$((rank + 1))
  
  behavior="${PATTERN_BEHAVIOR[$tag]:-[no behavior change recorded]}"
  date="${PATTERN_DATE[$tag]:-unknown}"
  src="${PATTERN_SOURCE[$tag]:-self}"
  dna="${DNA_MATCH[$tag]:-no}"
  count="${PATTERN_COUNT[$tag]:-1}"
  
  # Truncate behavior to 120 chars for readability
  if [[ ${#behavior} -gt 120 ]]; then
    behavior="${behavior:0:117}..."
  fi
  
  # Warning level
  if [[ "$dna" == "yes" ]]; then
    level="🔴 DNA-RULE EXISTED"
  elif [[ "$count" -ge 2 ]]; then
    level="🟡 RECURRING"
  else
    level="🔵 RECENT"
  fi
  
  echo "  ${rank}. [${level}] ${tag} (${date}, via ${src})"
  echo "     → ${behavior}"
  echo ""
done <<< "$sorted"

# Summary line
dna_violations=0
for tag in "${UNIQUE_PATTERNS[@]}"; do
  if [[ "${DNA_MATCH[$tag]:-}" == "yes" ]]; then
    dna_violations=$((dna_violations + 1))
  fi
done

if [[ $dna_violations -gt 0 ]]; then
  echo "⚠️  ${dna_violations}/${#UNIQUE_PATTERNS[@]} violations were rules that ALREADY EXIST in DNA."
  echo "   The problem isn't knowing — it's doing."
fi

# === Feedback Loop: Log surfaced reminders + detect recidivism ===
# Inspired by metatron's "agent rates served priors" feedback mechanism.
# If the same pattern keeps appearing despite preflight warnings, the reminder
# isn't working — something structural needs to change.
PREFLIGHT_LOG="${WORKSPACE}/.preflight-log"

# Log this run's surfaced patterns
while IFS= read -r line; do
  tag=$(echo "$line" | awk '{print $2}')
  [[ -n "$tag" ]] && echo "$(date +%Y-%m-%dT%H:%M)|${CONTEXT:-any}|${tag}" >> "$PREFLIGHT_LOG"
done <<< "$sorted"

# Auto-close: prune graduated patterns + age-decay from preflight log
# Two mechanisms:
# 1. Remove entries for graduated patterns (structural fix = retire tracking)
# 2. Remove entries older than 14 days (prevents unbounded count inflation)
if [[ -f "$PREFLIGHT_LOG" ]]; then
  BEFORE=$(wc -l < "$PREFLIGHT_LOG")

  # 1. Find graduated patterns in beliefs-candidates
  GRADUATED_PATTERNS=$(grep -oP 'pattern: \K[a-zA-Z0-9_-]+' "$BC_FILE" | while read -r pat; do
    if grep -q "pattern: ${pat}.*graduated\|graduated.*pattern: ${pat}" "$BC_FILE" 2>/dev/null; then
      echo "$pat"
    fi
  done | sort -u)

  # 2. Age cutoff: 14 days
  AGE_CUTOFF=$(date -d "-14 days" +%Y-%m-%d 2>/dev/null || date -v-14d +%Y-%m-%d 2>/dev/null)

  # Apply both filters
  if [[ -n "$GRADUATED_PATTERNS" ]]; then
    PRUNE_RE=$(echo "$GRADUATED_PATTERNS" | paste -sd'|')
    awk -F'|' -v cutoff="$AGE_CUTOFF" -v prune_re="$PRUNE_RE" '
      BEGIN { n = split(prune_re, patterns, "|") }
      {
        date = substr($1, 1, 10)
        if (date < cutoff) next
        pat = $NF
        skip = 0
        for (i = 1; i <= n; i++) {
          if (pat == patterns[i]) { skip = 1; break }
        }
        if (!skip) print
      }
    ' "$PREFLIGHT_LOG" > "${PREFLIGHT_LOG}.tmp"
  else
    # Only age filter
    awk -F'|' -v cutoff="$AGE_CUTOFF" '
      { date = substr($1, 1, 10); if (date >= cutoff) print }
    ' "$PREFLIGHT_LOG" > "${PREFLIGHT_LOG}.tmp"
  fi

  mv "${PREFLIGHT_LOG}.tmp" "$PREFLIGHT_LOG"
  AFTER=$(wc -l < "$PREFLIGHT_LOG")
  PRUNED=$((BEFORE - AFTER))
  if [[ $PRUNED -gt 0 ]]; then
    echo ""
    echo "🧹 Auto-closed ${PRUNED} stale/graduated entries (14d age limit + graduated patterns)"
  fi
fi

# Recidivism detection: count unique DAYS a pattern was surfaced (not raw entries)
# This prevents inflation from multiple runs per day.
if [[ -f "$PREFLIGHT_LOG" ]]; then
  recidivists=$(awk -F'|' '{
    date = substr($1, 1, 10)
    pat = $NF
    key = pat "|" date
    if (!(key in seen)) { seen[key] = 1; count[pat]++ }
  } END {
    for (p in count) if (count[p] >= 3) print count[p], p
  }' "$PREFLIGHT_LOG" | sort -rn)
  if [[ -n "$recidivists" ]]; then
    echo ""
    echo "🔁 Recidivism Alert — patterns surfaced on 3+ unique days:"
    while IFS= read -r r; do
      count=$(echo "$r" | awk '{print $1}')
      pattern=$(echo "$r" | awk '{print $2}')
      echo "   ${pattern} (${count} days — preflight alone won't fix this; needs structural change)"
    done <<< "$recidivists"
  fi
fi
