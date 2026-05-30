#!/usr/bin/env bash
# add-gradient.sh — Single entry point for all gradient writes to beliefs-candidates.md
#
# Applies Elephant Agent "single close path" pattern:
# All gradient writes go through this script with guaranteed side-effects:
#   1. Dedup check (fuzzy match against existing entries)
#   2. Formatted write with timestamp + source tag
#   3. Append to gradient log (observability for Issue #9)
#   4. Summary output for caller
#
# Usage:
#   add-gradient.sh --gradient "description" --pattern "pattern-name" [--source "luna|reflect|nudge|workloop"] [--trigger "when this happens"] [--fix "do this instead"]
#   add-gradient.sh --check "search term"  # dedup check only, no write

set -euo pipefail

BELIEFS_FILE="${HOME}/.openclaw/workspace/beliefs-candidates.md"
GRADIENT_LOG="${HOME}/.openclaw/workspace/tools/.gradient-log.jsonl"
TODAY=$(date +%Y-%m-%d)

# Parse args
GRADIENT=""
PATTERN=""
SOURCE="manual"
TRIGGER=""
FIX=""
CHECK_ONLY=""

while [[ $# -gt 0 ]]; do
  case "$1" in
    --gradient) GRADIENT="$2"; shift 2 ;;
    --pattern) PATTERN="$2"; shift 2 ;;
    --source) SOURCE="$2"; shift 2 ;;
    --trigger) TRIGGER="$2"; shift 2 ;;
    --fix) FIX="$2"; shift 2 ;;
    --check) CHECK_ONLY="$2"; shift 2 ;;
    *) echo "Unknown arg: $1"; exit 1 ;;
  esac
done

# --- Dedup check ---
dedup_check() {
  local search_term="$1"
  local matches=0
  local found_lines=""

  # Fuzzy match: extract key words (>3 chars) and check if 3+ match existing entries
  local keywords
  keywords=$(echo "$search_term" | tr '[:upper:]' '[:lower:]' | grep -oP '\b\w{4,}\b' | sort -u | head -8)
  
  while IFS= read -r keyword; do
    if grep -qi "$keyword" "$BELIEFS_FILE" 2>/dev/null; then
      matches=$((matches + 1))
      found_lines+="$(grep -ni "$keyword" "$BELIEFS_FILE" | head -2)\n"
    fi
  done <<< "$keywords"
  
  if [[ $matches -ge 3 ]]; then
    echo "⚠️  POSSIBLE DUPLICATE — $matches/$( echo "$keywords" | wc -l) keywords match existing entries:"
    echo -e "$found_lines" | sort -t: -k1 -n -u | head -5
    return 1
  fi
  return 0
}

# Check-only mode
if [[ -n "$CHECK_ONLY" ]]; then
  echo "🔍 Dedup check for: $CHECK_ONLY"
  if dedup_check "$CHECK_ONLY"; then
    echo "✅ No duplicates found"
  fi
  exit 0
fi

# Validate required args
if [[ -z "$GRADIENT" ]]; then
  echo "❌ --gradient is required"
  echo "Usage: add-gradient.sh --gradient \"desc\" --pattern \"name\" [--source luna|reflect|nudge|workloop] [--trigger \"...\"] [--fix \"...\"]"
  exit 1
fi

if [[ -z "$PATTERN" ]]; then
  # Auto-generate pattern name from gradient text
  PATTERN=$(echo "$GRADIENT" | tr '[:upper:]' '[:lower:]' | grep -oP '\b\w{4,}\b' | head -3 | tr '\n' '-' | sed 's/-$//')
  echo "ℹ️  Auto-generated pattern: $PATTERN"
fi

# --- Side-effect 1: Dedup check ---
echo "🔍 Checking for duplicates..."
if ! dedup_check "$GRADIENT"; then
  echo ""
  echo "⚠️  Potential duplicate detected. Proceeding anyway (may be legitimate count increment)."
  echo "   Review the entry manually and consider incrementing count instead of adding new."
  echo ""
fi

# --- Side-effect 2: Formatted write ---
{
  echo ""
  # Include source tag when not manual — enables gradient-stats.sh source detection
  source_tag=""
  if [[ "$SOURCE" != "manual" ]]; then
    source_tag=" (Source: ${SOURCE})"
  fi
  echo "- ${TODAY}: [gradient] \"${GRADIENT}\" → [行为改变] ${FIX:-pending analysis}. (pattern: ${PATTERN}, 第1次)${source_tag}"
  if [[ -n "$TRIGGER" ]]; then
    echo "  - **Trigger**: ${TRIGGER}"
  fi
} >> "$BELIEFS_FILE"

# --- Side-effect 3: Consistency check against gradient-scan.sh ---
GRADIENT_SCAN="${HOME}/.openclaw/workspace/tools/gradient-scan.sh"
if [[ -f "$GRADIENT_SCAN" ]]; then
  if ! grep -q "KEYWORDS\[\"${PATTERN}\"\]" "$GRADIENT_SCAN" 2>/dev/null; then
    echo "⚠️  KEYWORDS missing in gradient-scan.sh for pattern '${PATTERN}'"
    echo "   gradient-scan.sh won't detect future evidence for this pattern."
    echo "   Add: KEYWORDS[\"${PATTERN}\"]=\"keyword1|keyword2|keyword3\""
    echo ""
  fi
fi

# --- Side-effect 4: Gradient log (JSONL for observability) ---
mkdir -p "$(dirname "$GRADIENT_LOG")"
echo "{\"date\":\"${TODAY}\",\"pattern\":\"${PATTERN}\",\"source\":\"${SOURCE}\",\"gradient\":\"${GRADIENT}\"}" >> "$GRADIENT_LOG"

# --- Side-effect 5: Summary ---
TOTAL_GRADIENTS=$(grep -c "\[gradient\]" "$BELIEFS_FILE" 2>/dev/null || echo "0")
TOTAL_TODAY=$(grep -c "^- ${TODAY}:" "$BELIEFS_FILE" 2>/dev/null || echo "0")
LOG_TOTAL=$(wc -l < "$GRADIENT_LOG" 2>/dev/null || echo "0")

echo ""
echo "✅ Gradient added to beliefs-candidates.md"
echo "   Pattern: ${PATTERN}"
echo "   Source: ${SOURCE}"
echo "   Today's gradients: ${TOTAL_TODAY}"
echo "   Total gradients: ${TOTAL_GRADIENTS}"
echo "   Log entries: ${LOG_TOTAL}"
echo ""
echo "📋 Next: Review the entry, add --trigger and --fix if not provided."
