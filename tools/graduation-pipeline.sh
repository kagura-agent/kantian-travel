#!/usr/bin/env bash
# graduation-pipeline.sh — Skill-to-skill orchestration: gradient-scan → evaluate-candidate
#
# Chains two existing tools into a pipeline:
# 1. gradient-scan.sh identifies patterns with sufficient cross-context evidence
# 2. evaluate-candidate.sh scores each V1-eligible pattern independently
# 3. Reports graduation-ready candidates
#
# This bridges the gap where gradient-scan finds evidence but nobody runs evaluate.
# Inspired by text-to-cad's skill-to-skill orchestration pattern.
#
# Usage: bash tools/graduation-pipeline.sh [--days N] [--threshold N] [--dry-run]
#   --days N       : scan window (default 14)
#   --threshold N  : minimum hit count to trigger evaluation (default 6)
#   --dry-run      : show what would be evaluated without running evaluate-candidate

set -uo pipefail

WORKSPACE="${HOME}/.openclaw/workspace"
DAYS=14
THRESHOLD=6
DRY_RUN=false

while [[ $# -gt 0 ]]; do
  case "$1" in
    --days) DAYS="$2"; shift 2 ;;
    --threshold) THRESHOLD="$2"; shift 2 ;;
    --dry-run) DRY_RUN=true; shift ;;
    *) echo "Unknown arg: $1"; exit 1 ;;
  esac
done

echo "🔬 Graduation Pipeline — scan(${DAYS}d) → evaluate(threshold≥${THRESHOLD})"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Stage 1: Run gradient-scan and capture output
echo "📡 Stage 1: Scanning for patterns with evidence..."
SCAN_OUTPUT=$(bash "${WORKSPACE}/tools/gradient-scan.sh" --days "$DAYS" 2>/dev/null || true)

# Parse patterns and their hit counts from scan output
# Format: "🔍 pattern:<tag> — <N> hits in <M> days"
BC_FILE="${WORKSPACE}/beliefs-candidates.md"
declare -A ELIGIBLE_PATTERNS  # tag -> hits
ELIGIBLE_COUNT=0
SKIPPED_GRADUATED=0
SKIPPED_NO_ENTRY=0

while IFS= read -r line; do
  if [[ "$line" =~ ^🔍[[:space:]]pattern:([^[:space:]]+)[[:space:]]—[[:space:]]([0-9]+)[[:space:]]hits ]]; then
    tag="${BASH_REMATCH[1]}"
    hits="${BASH_REMATCH[2]}"
    if [[ "$hits" -ge "$THRESHOLD" ]]; then
      # Filter 1: Skip already-graduated candidates
      if grep -qi "${tag}.*graduated\|graduated.*${tag}" "$BC_FILE" 2>/dev/null; then
        echo "   ⏭️  ${tag} (${hits} hits) — already graduated, skipping"
        SKIPPED_GRADUATED=$((SKIPPED_GRADUATED + 1))
        continue
      fi
      # Filter 2: Skip ghost patterns with no beliefs-candidates entry
      if ! grep -qi "${tag}\|${tag//-/ }" "$BC_FILE" 2>/dev/null; then
        echo "   👻 ${tag} (${hits} hits) — no beliefs-candidates entry, skipping"
        SKIPPED_NO_ENTRY=$((SKIPPED_NO_ENTRY + 1))
        continue
      fi
      ELIGIBLE_PATTERNS["$tag"]="$hits"
      ELIGIBLE_COUNT=$((ELIGIBLE_COUNT + 1))
    fi
  fi
done <<< "$SCAN_OUTPUT"

echo "   Found ${ELIGIBLE_COUNT} pattern(s) meeting threshold (≥${THRESHOLD} hits)"
if [[ $SKIPPED_GRADUATED -gt 0 || $SKIPPED_NO_ENTRY -gt 0 ]]; then
  echo "   Filtered: ${SKIPPED_GRADUATED} already graduated, ${SKIPPED_NO_ENTRY} ghost patterns"
fi
echo ""

if [[ $ELIGIBLE_COUNT -eq 0 ]]; then
  echo "✅ No patterns ready for graduation evaluation."
  echo ""
  echo "📊 Full scan output:"
  echo "$SCAN_OUTPUT" | grep -E "^🔍|^📊|^✅" | head -10
  exit 0
fi

# Stage 2: Surface each eligible pattern with context
echo "🎓 Stage 2: Surfacing ${ELIGIBLE_COUNT} graduation candidate(s)..."
echo ""

RESULTS=()

for tag in "${!ELIGIBLE_PATTERNS[@]}"; do
  hits="${ELIGIBLE_PATTERNS[$tag]}"

  # Map pattern tag to section header in beliefs-candidates.md
  HEADER=$(grep -i "$tag\|${tag//-/ }" "$BC_FILE" | grep '^###' | head -1 | sed 's/^### //')
  if [[ -z "$HEADER" ]]; then
    HEADER="$tag"
  fi

  # Extract the candidate text (up to next ### heading)
  CANDIDATE_TEXT=$(awk -v search="$tag" '
    BEGIN { found=0; printing=0 }
    /^###? / {
      if (printing) exit
      if (tolower($0) ~ tolower(search)) { printing=1 }
    }
    printing { print }
  ' "$BC_FILE" 2>/dev/null | head -20 || true)

  echo "  ┌─ ${tag} — ${hits} hits across 10+ days"
  echo "  │  Header: ${HEADER}"
  if [[ -n "$CANDIDATE_TEXT" ]]; then
    echo "  │  Content preview:"
    echo "$CANDIDATE_TEXT" | head -8 | sed 's/^/  │    /'
  fi
  echo "  │"
  echo "  │  Triple Verification checklist:"
  echo "  │    V1 Cross-context: ${hits} hits (≥3 needed) ✅"
  echo "  │    V2 Predictive Power: ? (needs agent evaluation)"
  echo "  │    V3 Non-obvious: ? (needs agent evaluation)"
  echo "  │"
  if $DRY_RUN; then
    echo "  │  [DRY RUN] Would evaluate"
  else
    echo "  │  ⚡ Ready for: bash scripts/evaluate-candidate.sh '$HEADER'"
  fi
  echo "  └─"
  echo ""
  RESULTS+=("🎯 ${tag} (${hits} hits) — V1 PASS, needs V2+V3")
done

# Stage 3: Summary report
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📋 Graduation Pipeline Report"
echo ""
for r in "${RESULTS[@]}"; do
  echo "  $r"
done
echo ""
echo "📊 Summary: ${ELIGIBLE_COUNT} candidate(s) pass V1 (cross-context), pending V2+V3 evaluation"
echo ""
echo "⚡ Next: Agent should evaluate V2 (predictive power) + V3 (non-obvious) for each."
echo "   PASS all 3 → graduate. Use: bash tools/add-gradient.sh --graduate '<pattern-name>'"
echo ""
echo "🔄 Retirement check: For each graduating candidate, answer:"
echo "   'What existing DNA rule does this retire or supersede?'"
echo "   If none: justify why accumulation is acceptable here."
