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
#   --days N       : scan window (default 10)
#   --threshold N  : minimum hit count to trigger evaluation (default 8)
#   --dry-run      : show what would be evaluated without running evaluate-candidate

set -uo pipefail

WORKSPACE="${HOME}/.openclaw/workspace"
DAYS=10
THRESHOLD=8
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
declare -A ELIGIBLE_PATTERNS  # tag -> hits
ELIGIBLE_COUNT=0

while IFS= read -r line; do
  if [[ "$line" =~ ^🔍[[:space:]]pattern:([^[:space:]]+)[[:space:]]—[[:space:]]([0-9]+)[[:space:]]hits ]]; then
    tag="${BASH_REMATCH[1]}"
    hits="${BASH_REMATCH[2]}"
    if [[ "$hits" -ge "$THRESHOLD" ]]; then
      ELIGIBLE_PATTERNS["$tag"]="$hits"
      ELIGIBLE_COUNT=$((ELIGIBLE_COUNT + 1))
    fi
  fi
done <<< "$SCAN_OUTPUT"

echo "   Found ${ELIGIBLE_COUNT} pattern(s) meeting threshold (≥${THRESHOLD} hits)"
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

BC_FILE="${WORKSPACE}/beliefs-candidates.md"
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
