#!/usr/bin/env bash
# beliefs-auto-retract.sh — Auto-retract stale single-occurrence beliefs-candidates
#
# Pattern: auto-close-stale-entries (from LLM-Wiki paper Error Book)
# Rule: candidates with count=1 and AGE_THRESHOLD+ days since last occurrence → retract
#
# Usage:
#   bash tools/beliefs-auto-retract.sh [--dry-run] [--age-days N] [--file PATH]
#
# Options:
#   --dry-run     Show what would be retracted without modifying the file
#   --age-days N  Override default age threshold (default: 30)
#   --file PATH   Override beliefs-candidates.md path

set -euo pipefail

# Defaults
DRY_RUN=false
AGE_DAYS=30
BELIEFS_FILE="${HOME}/.openclaw/workspace/beliefs-candidates.md"
TODAY=$(date +%Y-%m-%d)
TODAY_EPOCH=$(date -d "$TODAY" +%s 2>/dev/null || date -j -f "%Y-%m-%d" "$TODAY" +%s 2>/dev/null)

# Parse args
while [[ $# -gt 0 ]]; do
  case "$1" in
    --dry-run) DRY_RUN=true; shift ;;
    --age-days) AGE_DAYS="$2"; shift 2 ;;
    --file) BELIEFS_FILE="$2"; shift 2 ;;
    *) echo "Unknown option: $1" >&2; exit 1 ;;
  esac
done

if [[ ! -f "$BELIEFS_FILE" ]]; then
  echo "❌ File not found: $BELIEFS_FILE" >&2
  exit 1
fi

# Find single-occurrence entries (第1次) that are old enough and not already retracted/graduated
retract_count=0
skip_count=0
candidates=()

while IFS= read -r line; do
  # Extract date
  entry_date=$(echo "$line" | grep -oP '^\- (\d{4}-\d{2}-\d{2})' | sed 's/^- //')
  if [[ -z "$entry_date" ]]; then continue; fi

  # Skip if already retracted or graduated
  if echo "$line" | grep -qiP 'retracted|graduated'; then
    skip_count=$((skip_count + 1))
    continue
  fi

  # Calculate age
  entry_epoch=$(date -d "$entry_date" +%s 2>/dev/null || date -j -f "%Y-%m-%d" "$entry_date" +%s 2>/dev/null)
  age_days=$(( (TODAY_EPOCH - entry_epoch) / 86400 ))

  if [[ $age_days -ge $AGE_DAYS ]]; then
    # Extract pattern name for reporting
    pattern=$(echo "$line" | grep -oP 'pattern: [^,)]+' | sed 's/pattern: //' || echo "unknown")
    candidates+=("$entry_date|$age_days|$pattern")
    retract_count=$((retract_count + 1))
  fi
done < <(grep '第1次' "$BELIEFS_FILE")

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📋 Beliefs Auto-Retract Report"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  File: $BELIEFS_FILE"
echo "  Age threshold: ${AGE_DAYS} days"
echo "  Today: $TODAY"
echo "  Skipped (already retracted/graduated): $skip_count"
echo "  Candidates for retraction: $retract_count"
echo ""

if [[ $retract_count -eq 0 ]]; then
  echo "✅ No stale entries found. Pipeline is clean."
  exit 0
fi

echo "📝 Stale entries (single occurrence, ${AGE_DAYS}+ days, no recurrence):"
echo ""
for c in "${candidates[@]}"; do
  IFS='|' read -r date age pattern <<< "$c"
  echo "  - $date ($age days) — pattern: $pattern"
done
echo ""

if [[ "$DRY_RUN" == "true" ]]; then
  echo "🔍 DRY RUN — no changes made. Run without --dry-run to apply."
  exit 0
fi

# Apply retractions: append retraction marker to matching lines
backup="${BELIEFS_FILE}.bak.$(date +%s)"
cp "$BELIEFS_FILE" "$backup"

applied=0
for c in "${candidates[@]}"; do
  IFS='|' read -r date age pattern <<< "$c"
  # Use sed to append retraction marker after the pattern tag on matching lines
  # Match: lines with the specific date AND pattern AND 第1次 AND not already retracted
  escaped_pattern=$(printf '%s' "$pattern" | sed 's/[[\.*^$()+?{|]/\\&/g')
  escaped_date=$(printf '%s' "$date" | sed 's/[[\.*^$()+?{|]/\\&/g')

  # Find the line and append retraction
  if sed -i "0,/^- ${escaped_date}:.*pattern: ${escaped_pattern}.*第1次/{s/\(第1次\)\(.*\)(Source: \([^)]*\))/\1\2(Source: \3) → **retracted ${TODAY}** (rationale: stale — single occurrence, no recurrence in ${age}+ days)/}" "$BELIEFS_FILE"; then
    applied=$((applied + 1))
  fi
done

echo "✅ Retracted $applied entries."
echo "  Backup: $backup"
echo ""

# Summary stats
total_entries=$(grep -c '^- [0-9]\{4\}-[0-9]\{2\}-[0-9]\{2\}:' "$BELIEFS_FILE" || echo 0)
total_retracted=$(grep -c 'retracted' "$BELIEFS_FILE" || echo 0)
total_graduated=$(grep -c 'graduated' "$BELIEFS_FILE" || echo 0)
active=$(( total_entries - total_retracted - total_graduated ))

echo "📊 Pipeline stats after retraction:"
echo "  Total entries: $total_entries"
echo "  Active: ~$active"
echo "  Graduated: $total_graduated"
echo "  Retracted: $total_retracted"
