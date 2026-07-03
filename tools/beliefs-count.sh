#!/bin/bash
# beliefs-count.sh — Canonical counting for beliefs-candidates.md
# Use this in daily-review for consistent, verifiable numbers
# Created 2026-07-01 to fix recurring count discrepancies (3 days of audit issues)

BELIEFS_FILE="${1:-$HOME/.openclaw/workspace/beliefs-candidates.md}"

if [ ! -f "$BELIEFS_FILE" ]; then
  echo "Error: $BELIEFS_FILE not found" >&2
  exit 1
fi

# Count entries in beliefs-candidates.md
# An entry starts with "- " after the "---" separator (separates header from entries)
total=$(awk '/^---$/{found=1;next} found && /^- /{c++} END{print c}' "$BELIEFS_FILE")
graduated=$(grep -c '→ \*\*graduated' "$BELIEFS_FILE" 2>/dev/null || true)
graduated=${graduated:-0}
retracted=$(grep -c '→ \*\*retracted' "$BELIEFS_FILE" 2>/dev/null || true)
retracted=${retracted:-0}
active=$((total - graduated - retracted))

# Gradient-log (separate data source)
GRADIENT_LOG="$HOME/.openclaw/workspace/tools/.gradient-log.jsonl"
gradient_total=0
if [ -f "$GRADIENT_LOG" ]; then
  gradient_total=$(wc -l < "$GRADIENT_LOG")
fi

echo "📊 Beliefs Count (canonical)"
echo "  Source: beliefs-candidates.md"
echo "  Total entries: $total"
echo "  Active: $active"  
echo "  Graduated: $graduated"
echo "  Retracted: $retracted"
echo ""
echo "  Gradient-log.jsonl: $gradient_total lines (separate source, not interchangeable)"
