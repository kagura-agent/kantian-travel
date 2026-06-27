#!/usr/bin/env bash
# scout-precheck.sh — Check wiki coverage + novelty scoring before deep-read
#
# Usage:
#   bash tools/scout-precheck.sh "project-name-1" "project-name-2" ...
#   bash tools/scout-precheck.sh --desc "name:description" "name2:desc2" ...
#   echo "project1 project2" | bash tools/scout-precheck.sh --stdin
#
# Reports which candidates already have wiki notes (with depth/status/age),
# so the agent doesn't waste time re-reading already-studied projects.
#
# NEW in v2: Novelty scoring via "surprise inversion" (Graphenium pattern).
# Candidates that don't match known portfolio themes get flagged as high-novelty
# (prioritize for deep-read). Those matching well-covered themes are lower priority.
# Use --desc "name:one-line description" for better novelty detection.
#
# Exit codes:
#   0 = at least one candidate is NEW (worth studying)
#   1 = ALL candidates already have deep-dive notes (likely saturated)

set -euo pipefail

WIKI_DIR="${HOME}/.openclaw/workspace/wiki/projects"
TARGETS_FILE="${HOME}/.openclaw/workspace/study/targets.md"
THEMES_FILE="${HOME}/.openclaw/workspace/tools/portfolio-themes.txt"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
MAGENTA='\033[0;35m'
NC='\033[0m'

candidates=()
descriptions=()  # parallel array for --desc mode
desc_mode=false

if [[ "${1:-}" == "--stdin" ]]; then
  while IFS= read -r line; do
    for word in $line; do
      candidates+=("$word")
      descriptions+=("")
    done
  done
elif [[ "${1:-}" == "--desc" ]]; then
  desc_mode=true
  shift
elif [[ $# -eq 0 ]]; then
  echo "Usage: $0 <project-name> [project-name ...]"
  echo "       $0 --desc 'name:description' ['name2:desc2' ...]"
  echo "       echo 'proj1 proj2' | $0 --stdin"
  exit 2
fi

# Collect from args
for arg in "$@"; do
  [[ "$arg" == "--stdin" ]] && continue
  if [[ "$desc_mode" == true ]]; then
    # Format: "name:description text"
    name="${arg%%:*}"
    desc="${arg#*:}"
    candidates+=("$name")
    descriptions+=("$desc")
  else
    candidates+=("$arg")
    descriptions+=("")
  fi
done

if [[ ${#candidates[@]} -eq 0 ]]; then
  echo "No candidates provided."
  exit 2
fi

# ─── Novelty scoring functions (surprise inversion) ───
score_novelty() {
  local name="$1"
  local desc="$2"
  local text
  text=$(echo "${name} ${desc}" | tr '[:upper:]' '[:lower:]' | tr -- '-_/' '   ')
  
  local matched_themes=()
  local total_keyword_hits=0
  
  if [[ -f "$THEMES_FILE" ]]; then
    while IFS='|' read -r theme keywords; do
      [[ "$theme" =~ ^# ]] && continue
      [[ -z "$theme" ]] && continue
      local hits=0
      IFS=',' read -ra kws <<< "$keywords"
      for kw in "${kws[@]}"; do
        kw=$(echo "$kw" | tr -d ' ')
        if echo "$text" | grep -qw "$kw" 2>/dev/null; then
          hits=$((hits + 1))
        fi
      done
      if [[ $hits -ge 2 ]]; then
        matched_themes+=("$theme($hits)")
        total_keyword_hits=$((total_keyword_hits + hits))
      elif [[ $hits -eq 1 && ${#kws[@]} -le 3 ]]; then
        # Single match in small keyword list still counts
        matched_themes+=("$theme($hits)")
        total_keyword_hits=$((total_keyword_hits + hits))
      fi
    done < "$THEMES_FILE"
  fi
  
  # Output: novelty level + matched themes
  if [[ ${#matched_themes[@]} -eq 0 ]]; then
    echo "NOVEL|none"
  elif [[ $total_keyword_hits -le 2 ]]; then
    echo "MODERATE|${matched_themes[*]}"
  else
    echo "EXPECTED|${matched_themes[*]}"
  fi
}

new_count=0
existing_count=0
deep_count=0
novel_candidates=()

echo -e "\n${CYAN}🔍 Scout Pre-check — Wiki Coverage + Novelty Report${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

for idx in "${!candidates[@]}"; do
  name="${candidates[$idx]}"
  # Normalize: lowercase, strip github URL parts
  normalized=$(echo "$name" | sed 's|https://github.com/||' | sed 's|/$||' | tr '[:upper:]' '[:lower:]')
  # Try multiple slug patterns
  slug=$(echo "$normalized" | sed 's|.*/||')  # owner/repo -> repo

  # Search for matching wiki files
  found=""
  for pattern in "$slug" "${slug//-/_}" "${slug//_/-}"; do
    matches=$(find "$WIKI_DIR" -maxdepth 1 -iname "${pattern}*" -name "*.md" 2>/dev/null || true)
    if [[ -n "$matches" ]]; then
      found="$matches"
      break
    fi
  done

  # Also check targets.md for tracking entries
  in_targets=""
  if grep -qi "$slug" "$TARGETS_FILE" 2>/dev/null; then
    in_targets=$(grep -i "$slug" "$TARGETS_FILE" | head -1)
  fi

  if [[ -n "$found" ]]; then
    existing_count=$((existing_count + 1))
    # Extract frontmatter info
    file=$(echo "$found" | head -1)
    filename=$(basename "$file")
    
    # Get depth/status from frontmatter or content
    depth=$(grep -m1 "^depth:" "$file" 2>/dev/null | sed 's/depth: *//' || echo "")
    status=$(grep -m1 "^status:" "$file" 2>/dev/null | sed 's/status: *//' || echo "")
    
    # Get file age
    mtime=$(stat -c %Y "$file" 2>/dev/null || stat -f %m "$file" 2>/dev/null || echo 0)
    now=$(date +%s)
    age_days=$(( (now - mtime) / 86400 ))
    
    # Get line count as proxy for depth
    lines=$(wc -l < "$file")
    
    # Determine depth icon
    if [[ -n "$depth" ]]; then
      depth_icon="$depth"
    elif [[ $lines -gt 100 ]]; then
      depth_icon="🔬 deep (${lines}L)"
      deep_count=$((deep_count + 1))
    elif [[ $lines -gt 30 ]]; then
      depth_icon="👁️ following (${lines}L)"
    else
      depth_icon="🔭 scout (${lines}L)"
    fi
    
    echo -e "  ${YELLOW}⚠️  ${name}${NC} — already studied"
    echo -e "     📄 ${filename} | ${depth_icon} | ${age_days}d ago | ${status:-no-status}"
    if [[ -n "$in_targets" ]]; then
      echo -e "     📊 In targets.md: $(echo "$in_targets" | sed 's/^[| ]*//' | head -c 100)"
    fi
  else
    new_count=$((new_count + 1))
    
    # Novelty scoring for NEW candidates
    local_desc="${descriptions[$idx]:-}"
    novelty_result=$(score_novelty "$name" "$local_desc")
    novelty_level="${novelty_result%%|*}"
    novelty_themes="${novelty_result#*|}"
    
    case "$novelty_level" in
      NOVEL)
        echo -e "  ${GREEN}✅  ${name}${NC} — NEW ${MAGENTA}🆕 NOVEL${NC} (no portfolio theme match)"
        novel_candidates+=("$name")
        ;;
      MODERATE)
        echo -e "  ${GREEN}✅  ${name}${NC} — NEW ${CYAN}〰️ Moderate novelty${NC} (weak match: ${novelty_themes})"
        ;;
      EXPECTED)
        echo -e "  ${GREEN}✅  ${name}${NC} — NEW ${YELLOW}📂 Expected territory${NC} (themes: ${novelty_themes})"
        ;;
    esac
    
    if [[ -n "$in_targets" ]]; then
      echo -e "     📊 But tracked in targets.md: $(echo "$in_targets" | sed 's/^[| ]*//' | head -c 100)"
    fi
  fi
done

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo -e "📊 ${GREEN}${new_count} NEW${NC} | ${YELLOW}${existing_count} EXISTING${NC}"

# Surprise inversion recommendation
if [[ ${#novel_candidates[@]} -gt 0 ]]; then
  echo -e "\n${MAGENTA}🎯 Surprise Inversion → Deep-read priority:${NC}"
  for nc in "${novel_candidates[@]}"; do
    echo -e "   → ${nc} (outside known portfolio themes — highest information value)"
  done
  echo -e "   ${CYAN}Rationale: Uncertain/novel > confirmed/expected (Shannon entropy)${NC}"
fi

if [[ $new_count -eq 0 ]]; then
  echo -e "\n${RED}⛔ ALL candidates already studied. Consider:${NC}"
  echo "   1. Pick genuinely new projects instead"
  echo "   2. Switch to 'apply' mode (use existing knowledge)"
  echo "   3. Do a followup on stale notes (age > 14d)"
  exit 1
elif [[ $existing_count -gt 0 ]]; then
  echo -e "\n${YELLOW}💡 Focus deep-read on NEW candidates. For existing ones, check if there's new activity worth a followup.${NC}"
fi

exit 0
