#!/usr/bin/env bash
# issue-funnel.sh — Population funnel for workloop issue selection.
# Smoke-screens multiple candidate issues cheaply in parallel, returning
# a ranked list of viable candidates. Kills bad options fast so you only
# invest study time in survivors.
#
# Usage:
#   echo "owner/repo#123
#   owner/repo#456
#   other/repo#789" | bash tools/issue-funnel.sh
#
# Or with arguments:
#   bash tools/issue-funnel.sh owner/repo#123 owner/repo#456 other/repo#789
#
# Output: Ranked list of VIABLE candidates (exit 0 if any survive, exit 1 if all blocked)
#
# Inspired by: scholar-loop population funnel — "explore wide, pay narrow"
# Philosophy: Bad ideas die cheaply (single quick check). Only confirmed survivors
# get expensive full study + implementation cycles.

set -euo pipefail

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m'

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Collect candidates from args or stdin
candidates=()
if [[ $# -gt 0 ]]; then
  candidates=("$@")
else
  while IFS= read -r line; do
    line="${line// /}"
    [[ -n "$line" ]] && candidates+=("$line")
  done
fi

if [[ ${#candidates[@]} -eq 0 ]]; then
  echo -e "${RED}ERROR: No candidates provided.${NC}"
  echo "Usage: echo 'owner/repo#123' | bash tools/issue-funnel.sh"
  exit 2
fi

echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${CYAN}🔬 Issue Funnel — ${#candidates[@]} candidates entering${NC}"
echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

# Results accumulator
declare -A results  # candidate -> status (PASS/FAIL)
declare -A reasons  # candidate -> failure reason
declare -A scores   # candidate -> quality score (higher = better)

check_candidate() {
  local candidate="$1"
  local repo issue_num

  # Parse owner/repo#number
  if [[ "$candidate" =~ ^([^#]+)#([0-9]+)$ ]]; then
    repo="${BASH_REMATCH[1]}"
    issue_num="${BASH_REMATCH[2]}"
  else
    results["$candidate"]="FAIL"
    reasons["$candidate"]="Invalid format (expected owner/repo#number)"
    return
  fi

  local score=50  # base score

  # === Gate 1: Issue state ===
  local state
  state=$(gh issue view "$issue_num" --repo "$repo" --json state --jq '.state' 2>/dev/null || echo "ERROR")
  if [[ "$state" != "OPEN" ]]; then
    results["$candidate"]="FAIL"
    reasons["$candidate"]="Issue state: $state (not OPEN)"
    return
  fi

  # === Gate 2: Already interacted (withdraw/claim) ===
  local my_comments
  my_comments=$(gh issue view "$issue_num" --repo "$repo" --json comments \
    --jq '.comments[] | select(.author.login=="kagura-agent") | .body' 2>/dev/null || echo "")
  if echo "$my_comments" | grep -qi "withdraw\|stepping back\|unassign\|giving up"; then
    results["$candidate"]="FAIL"
    reasons["$candidate"]="Already withdrawn from this issue"
    return
  fi
  if echo "$my_comments" | grep -qi "I.*d like to\|claim\|working on"; then
    results["$candidate"]="FAIL"
    reasons["$candidate"]="Already claimed this issue"
    return
  fi

  # === Gate 3: Previous closed PR ===
  local closed_prs
  closed_prs=$(gh pr list --repo "$repo" --author=kagura-agent --state=closed \
    --search "$issue_num" --json number -q 'length' 2>/dev/null || echo "0")
  if [[ "$closed_prs" -gt 0 ]]; then
    results["$candidate"]="FAIL"
    reasons["$candidate"]="Already had $closed_prs closed PR(s) for this issue"
    return
  fi

  # === Gate 4: Competing PRs ===
  if [[ -f "$SCRIPT_DIR/competing-pr-check.sh" ]]; then
    if ! bash "$SCRIPT_DIR/competing-pr-check.sh" "$repo" "$issue_num" >/dev/null 2>&1; then
      results["$candidate"]="FAIL"
      reasons["$candidate"]="Competing PR(s) detected"
      return
    fi
  fi

  # === Gate 5: Open PR count (per-repo cap) ===
  local open_prs
  open_prs=$(gh pr list --repo "$repo" --author=kagura-agent --state=open \
    --json number -q 'length' 2>/dev/null || echo "0")
  if [[ "$open_prs" -ge 5 ]]; then
    results["$candidate"]="FAIL"
    reasons["$candidate"]="Already have $open_prs open PRs in this repo (cap: 4)"
    return
  fi

  # === Gate 6: Repo activity (last 14 days) ===
  local last_push
  last_push=$(gh api "repos/$repo" --jq '.pushed_at' 2>/dev/null || echo "")
  if [[ -n "$last_push" ]]; then
    local push_epoch now_epoch diff_days
    push_epoch=$(date -d "$last_push" +%s 2>/dev/null || echo "0")
    now_epoch=$(date +%s)
    diff_days=$(( (now_epoch - push_epoch) / 86400 ))
    if [[ "$diff_days" -gt 14 ]]; then
      results["$candidate"]="FAIL"
      reasons["$candidate"]="Repo inactive: last push ${diff_days}d ago (cap: 14d)"
      return
    fi
    # Bonus for very active repos
    [[ "$diff_days" -le 1 ]] && score=$((score + 10))
    [[ "$diff_days" -le 3 ]] && score=$((score + 5))
  fi

  # === Quality signals (scoring) ===

  # Issue type bonus
  local issue_labels
  issue_labels=$(gh issue view "$issue_num" --repo "$repo" --json labels --jq '[.labels[].name] | join(",")' 2>/dev/null || echo "")
  if echo "$issue_labels" | grep -qi "bug"; then
    score=$((score + 20))  # bugs are highest value
  elif echo "$issue_labels" | grep -qi "test"; then
    score=$((score + 10))
  elif echo "$issue_labels" | grep -qi "good.first.issue\|help.wanted"; then
    score=$((score + 15))  # explicitly welcoming contributions
  fi

  # Repo star bonus (higher star = more impact)
  local stars
  stars=$(gh api "repos/$repo" --jq '.stargazers_count' 2>/dev/null || echo "0")
  if [[ "$stars" -gt 5000 ]]; then
    score=$((score + 15))
  elif [[ "$stars" -gt 1000 ]]; then
    score=$((score + 10))
  elif [[ "$stars" -gt 200 ]]; then
    score=$((score + 5))
  fi

  # Wiki notes bonus (familiarity = efficiency)
  local project_name
  project_name=$(echo "$repo" | sed 's|.*/||')
  if [[ -f "$HOME/.openclaw/workspace/wiki/projects/${project_name}.md" ]]; then
    score=$((score + 10))
  fi

  # Low open-PR count bonus (less competition for attention)
  [[ "$open_prs" -eq 0 ]] && score=$((score + 5))

  results["$candidate"]="PASS"
  scores["$candidate"]=$score
}

# Run checks for each candidate
for candidate in "${candidates[@]}"; do
  echo -e "  Checking ${YELLOW}${candidate}${NC}..."
  check_candidate "$candidate"
done

echo ""

# Separate survivors and failures
survivors=()
failures=()
for candidate in "${candidates[@]}"; do
  if [[ "${results[$candidate]}" == "PASS" ]]; then
    survivors+=("$candidate")
  else
    failures+=("$candidate")
  fi
done

# Report failures
if [[ ${#failures[@]} -gt 0 ]]; then
  echo -e "${RED}❌ BLOCKED (${#failures[@]}):${NC}"
  for f in "${failures[@]}"; do
    echo -e "   ${f} — ${reasons[$f]}"
  done
  echo ""
fi

# Report and rank survivors
if [[ ${#survivors[@]} -eq 0 ]]; then
  echo -e "${RED}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
  echo -e "${RED}🚫 ALL CANDIDATES BLOCKED — no viable issues in this batch${NC}"
  echo -e "${RED}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
  exit 1
fi

# Sort survivors by score (descending)
sorted_survivors=()
while IFS= read -r line; do
  sorted_survivors+=("$line")
done < <(
  for s in "${survivors[@]}"; do
    echo "${scores[$s]}|$s"
  done | sort -t'|' -k1 -rn | cut -d'|' -f2
)

echo -e "${GREEN}✅ SURVIVORS (${#survivors[@]}/${#candidates[@]}), ranked by quality:${NC}"
rank=1
for s in "${sorted_survivors[@]}"; do
  echo -e "   ${GREEN}#${rank}${NC} ${s} (score: ${scores[$s]})"
  rank=$((rank + 1))
done

echo ""
echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${CYAN}🎯 RECOMMENDATION: ${sorted_survivors[0]}${NC}"
echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

exit 0
