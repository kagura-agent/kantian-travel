#!/usr/bin/env bash
# followup-status.sh — Pre-mode-selection check for study followup
# Shows which tracked items are DUE (revisit date ≤ today)
# Run BEFORE choosing followup mode at study entry node.
#
# Usage: bash tools/followup-status.sh [--date YYYY-MM-DD]
#
# Output:
#   - List of due items with their revisit dates
#   - Summary count: "N items due" or "0 items due — don't pick followup"
#   - Activity hint from targets.md (active/quiet status if available)

set -euo pipefail

WORKSPACE="${WORKSPACE:-$HOME/.openclaw/workspace}"
TODO="$WORKSPACE/TODO.md"
TARGETS="$WORKSPACE/study/targets.md"

# Allow override for testing
if [[ "${1:-}" == "--date" && -n "${2:-}" ]]; then
  TODAY="$2"
else
  TODAY=$(date +%Y-%m-%d)
fi

# Extract month-day for comparison (handles both MM-DD and YYYY-MM-DD)
TODAY_MD=$(date -d "$TODAY" +%m-%d 2>/dev/null || date -j -f "%Y-%m-%d" "$TODAY" +%m-%d 2>/dev/null)
TODAY_YEAR=$(date -d "$TODAY" +%Y 2>/dev/null || date -j -f "%Y-%m-%d" "$TODAY" +%Y 2>/dev/null)

echo "📋 Followup Status — $TODAY"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

DUE_COUNT=0
DUE_ITEMS=()

# Scan TODO.md for unchecked tracking items with Revisit dates ≤ today
while IFS= read -r line; do
  # Extract revisit date (format: "Revisit MM-DD" or "Revisit YYYY-MM-DD")
  if [[ "$line" =~ Revisit[[:space:]]+([0-9]{2}-[0-9]{2}) ]]; then
    revisit_md="${BASH_REMATCH[1]}"
    
    # Compare month-day (assumes current year for MM-DD format)
    # Simple string comparison works for MM-DD format
    if [[ ! "$revisit_md" > "$TODAY_MD" ]]; then
      # Extract project name
      project_name=""
      if [[ "$line" =~ Track:[[:space:]]*([^-]+) ]]; then
        project_name=$(echo "${BASH_REMATCH[1]}" | sed 's/[[:space:]]*$//')
      elif [[ "$line" =~ Track:[[:space:]]*(.+)\( ]]; then
        project_name=$(echo "${BASH_REMATCH[1]}" | sed 's/[[:space:]]*$//')
      fi
      
      DUE_COUNT=$((DUE_COUNT + 1))
      DUE_ITEMS+=("  $DUE_COUNT. [$revisit_md] $project_name")
      
      # Check targets.md for activity status
      if [[ -f "$TARGETS" && -n "$project_name" ]]; then
        # Look for activity indicators
        short_name=$(echo "$project_name" | tr '[:upper:]' '[:lower:]' | sed 's/[[:space:]]*$//')
        activity=$(grep -i "$short_name" "$TARGETS" 2>/dev/null | grep -oP '(🟢 THRIVING|🟢 ACTIVE|🟡 MONITORING|QUIET|DROPPED|PLATEAU)' | head -1 || true)
        if [[ -n "$activity" ]]; then
          DUE_ITEMS[-1]="${DUE_ITEMS[-1]} — $activity"
        fi
      fi
    fi
  fi
done < <(grep "^\- \[ \].*Track:.*Revisit" "$TODO" 2>/dev/null || true)

# NOTE: targets.md secondary scan REMOVED (2026-06-24)
# Root cause of followup-saturation-data-discrepancy (3+ days):
# This script scanned targets.md (stale revisit dates) while saturation gate
# used study/followup-status.sh (TODO.md only). Divergent sources → conflicting
# "12 due" vs "0 due/LOCKED" signals. Fix: single source of truth = TODO.md.
# targets.md activity hints are still used above for enrichment (grep for status).

# Output results
if [[ $DUE_COUNT -eq 0 ]]; then
  echo "  ✅ 0 items due — don't pick followup"
  echo ""
  # Show next upcoming
  next_date=$(grep "^\- \[ \].*Track:.*Revisit" "$TODO" 2>/dev/null | grep -oP "Revisit \K[0-9]{2}-[0-9]{2}" | sort | awk -v today="$TODAY_MD" '$1 > today' | head -1 || true)
  if [[ -n "$next_date" ]]; then
    next_count=$(grep "^\- \[ \].*Track:.*Revisit $next_date" "$TODO" 2>/dev/null | wc -l)
    echo "  📅 Next due: $next_date ($next_count items)"
  fi
else
  echo "  📌 $DUE_COUNT items due (revisit ≤ $TODAY_MD):"
  echo ""
  for item in "${DUE_ITEMS[@]}"; do
    echo "$item"
  done
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Final verdict
if [[ $DUE_COUNT -eq 0 ]]; then
  echo "🚫 VERDICT: Do NOT choose followup mode"
  exit 1  # Non-zero = don't choose followup
else
  echo "✅ VERDICT: Followup mode appropriate ($DUE_COUNT items due)"
  exit 0  # Zero = followup is valid
fi
