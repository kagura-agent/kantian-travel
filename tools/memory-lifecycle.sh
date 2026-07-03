#!/usr/bin/env bash
# memory-lifecycle.sh — Detect stale/disappeared entries in MEMORY.md
# Applies "ongoing vs disappeared" lifecycle distinction from Salient Mining SOP (GenericAgent)
#
# Usage: bash tools/memory-lifecycle.sh [--days N] [--verbose]
#   --days N    : flag promoted memories older than N days (default: 14)
#   --verbose   : show all entries, not just flagged ones

set -euo pipefail

MEMORY_FILE="${HOME}/.openclaw/workspace/MEMORY.md"
MEMORY_DIR="${HOME}/.openclaw/workspace/memory"
DAYS_THRESHOLD=14
VERBOSE=false

while [[ $# -gt 0 ]]; do
  case "$1" in
    --days) DAYS_THRESHOLD="$2"; shift 2 ;;
    --verbose) VERBOSE=true; shift ;;
    *) echo "Unknown: $1"; exit 1 ;;
  esac
done

if [[ ! -f "$MEMORY_FILE" ]]; then
  echo "❌ MEMORY.md not found"
  exit 1
fi

TODAY=$(date +%Y-%m-%d)
TODAY_EPOCH=$(date -d "$TODAY" +%s 2>/dev/null || date -j -f "%Y-%m-%d" "$TODAY" +%s)
CUTOFF_EPOCH=$((TODAY_EPOCH - DAYS_THRESHOLD * 86400))

total_lines=$(wc -l < "$MEMORY_FILE")
echo "📋 MEMORY.md Lifecycle Report — $TODAY"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📏 Lines: $total_lines / 200 budget"
echo "📅 Staleness threshold: ${DAYS_THRESHOLD} days"
echo ""

# 1. Count promoted memory sections and entries
promoted_sections=$(grep -c "^## Promoted" "$MEMORY_FILE" 2>/dev/null || true); promoted_sections=${promoted_sections:-0}
promoted_entries=0
stale_promoted=0
stale_details=""

# Extract all date references from promoted sections
in_promoted=false
while IFS= read -r line; do
  if [[ "$line" =~ ^##\ Promoted ]]; then
    in_promoted=true
    continue
  fi
  if [[ "$line" =~ ^## ]] && ! [[ "$line" =~ ^##\ Promoted ]]; then
    in_promoted=false
    continue
  fi
  if $in_promoted && [[ "$line" =~ ^- ]]; then
    promoted_entries=$((promoted_entries + 1))
    # Extract date like "05-07" or "2026-05-07"
    if [[ "$line" =~ ([0-9]{4}-)?(0[0-9]|1[0-2])-([0-3][0-9]) ]]; then
      match="${BASH_REMATCH[0]}"
      # Normalize to YYYY-MM-DD
      if [[ ${#match} -le 5 ]]; then
        entry_date="2026-${match}"
      else
        entry_date="$match"
      fi
      entry_epoch=$(date -d "$entry_date" +%s 2>/dev/null || echo 0)
      if [[ $entry_epoch -gt 0 ]] && [[ $entry_epoch -lt $CUTOFF_EPOCH ]]; then
        stale_promoted=$((stale_promoted + 1))
        snippet="${line:0:80}"
        stale_details+="  ⏳ ${entry_date}: ${snippet}…\n"
      fi
    fi
  fi
done < "$MEMORY_FILE"

echo "📦 Promoted Memory Sections: $promoted_sections"
echo "   Entries: $promoted_entries"
echo "   Stale (>${DAYS_THRESHOLD}d): $stale_promoted"

if [[ $stale_promoted -gt 0 ]]; then
  echo ""
  echo "🔴 Stale promoted entries (candidates for archival):"
  echo -e "$stale_details"
fi

# 2. Check for date-tagged facts that might be stale
echo ""
echo "📊 Dated Facts Check:"
stale_facts=0
fact_details=""

# Look for entries with dates in non-promoted sections
in_promoted=false
while IFS= read -r line; do
  if [[ "$line" =~ ^##\ Promoted ]]; then
    in_promoted=true
    continue
  fi
  if [[ "$line" =~ ^## ]] && ! [[ "$line" =~ ^##\ Promoted ]]; then
    in_promoted=false
  fi
  if ! $in_promoted && [[ "$line" =~ ^- ]] && [[ "$line" =~ \[已验证\ ([0-9]{2}-[0-9]{2})\] ]]; then
    verify_date="2026-${BASH_REMATCH[1]}"
    verify_epoch=$(date -d "$verify_date" +%s 2>/dev/null || echo 0)
    if [[ $verify_epoch -gt 0 ]] && [[ $verify_epoch -lt $CUTOFF_EPOCH ]]; then
      stale_facts=$((stale_facts + 1))
      snippet="${line:0:80}"
      fact_details+="  ⏳ verified ${verify_date}: ${snippet}…\n"
    fi
  fi
done < "$MEMORY_FILE"

echo "   Stale verified facts (>${DAYS_THRESHOLD}d): $stale_facts"
if [[ $stale_facts -gt 0 ]]; then
  echo -e "$fact_details"
fi

# 3. Check for "ongoing" items that might have disappeared
echo ""
echo "🔄 Lifecycle Status:"

# Check specific ongoing markers
declare -A ongoing_checks=(
  ["腱鞘炎"]="health condition"
  ["⏸️"]="paused projects"
  ["暂停"]="paused items"
  ["blocked"]="blocked items"
  ["pending"]="pending items"
  ["TODO"]="todo items"
)

for keyword in "${!ongoing_checks[@]}"; do
  count=$(grep -c "$keyword" "$MEMORY_FILE" 2>/dev/null) || count=0
  if [[ $count -gt 0 ]]; then
    label="${ongoing_checks[$keyword]}"
    echo "   📌 ${label}: ${count} mention(s) — verify still current"
  fi
done

# 4. Recent activity cross-reference
echo ""
echo "🔍 Recent Memory Activity:"
recent_files=0
for i in $(seq 0 6); do
  check_date=$(date -d "$TODAY - $i days" +%Y-%m-%d 2>/dev/null || date -v-${i}d +%Y-%m-%d)
  if [[ -f "${MEMORY_DIR}/${check_date}.md" ]]; then
    recent_files=$((recent_files + 1))
  fi
done
echo "   Memory files (last 7 days): $recent_files/7"

# 5. Summary
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
issues=$((stale_promoted + stale_facts))
if [[ $issues -eq 0 ]]; then
  echo "✅ No lifecycle issues detected"
else
  echo "⚠️  $issues items need attention (stale promoted: $stale_promoted, stale facts: $stale_facts)"
  if [[ $stale_promoted -gt 5 ]]; then
    echo "💡 Suggestion: Archive promoted entries older than ${DAYS_THRESHOLD}d to free line budget"
  fi
fi

budget_pct=$((total_lines * 100 / 200))
if [[ $budget_pct -gt 85 ]]; then
  echo "🔴 Line budget at ${budget_pct}% — cleanup urgently needed"
elif [[ $budget_pct -gt 70 ]]; then
  echo "🟡 Line budget at ${budget_pct}% — consider cleanup"
else
  echo "🟢 Line budget at ${budget_pct}% — healthy"
fi
