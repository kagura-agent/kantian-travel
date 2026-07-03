#!/usr/bin/env bash
# prior-failure-check.sh — Check wiki knowledge for documented failure patterns
# before selecting an issue to work on. Surfaces past PR closures, supersedes,
# and approach-failure lessons from pr-superseded-lessons.md.
#
# Structural fix for repeat-failure-blindness (5-day recidivist):
# "Before selecting any issue for workloop: check wiki notes for prior PR
#  closures on same issue." — but also repo-level pattern awareness.
#
# Inspired by: Ornith-1.0 3-layer anti-gaming pattern
#   Layer 1: DNA red lines (immutable)
#   Layer 2: Mechanical gates (this script)
#   Layer 3: Agent judgment (informed by this script's output)
#
# Usage:
#   bash tools/prior-failure-check.sh owner/repo          # repo-level check
#   bash tools/prior-failure-check.sh owner/repo#123      # issue-specific check
#   bash tools/prior-failure-check.sh --all                # scan all documented repos
#
# Output: Documented failure patterns for the repo with lesson summaries.
# Exit: 0 = no patterns found, 1 = patterns found (informational), 2 = error

set -euo pipefail

RED='\033[0;31m'
YELLOW='\033[1;33m'
GREEN='\033[0;32m'
CYAN='\033[0;36m'
DIM='\033[2m'
NC='\033[0m'

WIKI_DIR="$HOME/.openclaw/workspace/wiki"
LESSONS_FILE="$WIKI_DIR/cards/pr-superseded-lessons.md"

if [[ ! -f "$LESSONS_FILE" ]]; then
  echo -e "${RED}ERROR: $LESSONS_FILE not found${NC}"
  exit 2
fi

# Parse input
if [[ $# -eq 0 ]]; then
  echo "Usage: bash tools/prior-failure-check.sh owner/repo[#issue_num]"
  exit 2
fi

if [[ "$1" == "--all" ]]; then
  # Extract all unique repos mentioned in lessons file
  echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
  echo -e "${CYAN}📚 All documented failure repos${NC}"
  echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

  # Extract repo names from headers like "### repo_name #1234" or "## owner/repo #1234"
  grep -oE '[A-Za-z0-9_-]+(/[A-Za-z0-9_-]+)? #[0-9]+' "$LESSONS_FILE" \
    | sed 's/ #[0-9]*//' | sort -u | while read -r repo; do
    count=$(grep -c "$repo" "$LESSONS_FILE" 2>/dev/null || true); count=${count:-0}
    echo -e "  ${YELLOW}${repo}${NC} — ${count} mentions"
  done
  exit 0
fi

repo=""
issue_num=""

if [[ "$1" =~ ^([^#]+)#([0-9]+)$ ]]; then
  repo="${BASH_REMATCH[1]}"
  issue_num="${BASH_REMATCH[2]}"
else
  repo="$1"
fi

# Extract repo short name (last component) for flexible matching
repo_short=$(echo "$repo" | sed 's|.*/||' | tr '[:upper:]' '[:lower:]')
# Also try full repo path for precise matching
repo_full=$(echo "$repo" | tr '[:upper:]' '[:lower:]')

echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${CYAN}🔍 Prior Failure Check: ${YELLOW}${repo}${NC}${issue_num:+ #$issue_num}"
echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

found_patterns=0
found_issues=()
pattern_summaries=()

# --- Check 1: pr-superseded-lessons.md for repo patterns ---
# Search case-insensitively for repo name in the lessons file
# Extract sections that mention this repo
matches=$(grep -in "$repo_short" "$LESSONS_FILE" 2>/dev/null || true)

if [[ -n "$matches" ]]; then
  # Count distinct PR/section entries (lines with "### " or "## " headers mentioning repo)
  header_count=$(echo "$matches" | grep -ciE "^[0-9]+:##" 2>/dev/null || echo "0")
  # Count pattern references (lines with **Pattern** or pattern:)
  pattern_count=$(grep -A5 -i "$repo_short" "$LESSONS_FILE" | grep -ciE '\*\*Pattern|pattern:' 2>/dev/null || echo "0")

  if [[ "$header_count" -gt 0 || "$pattern_count" -gt 0 ]]; then
    echo -e "${YELLOW}⚠️  WIKI KNOWLEDGE: ${header_count} documented PR(s), ${pattern_count} pattern(s) for ${repo_short}${NC}"
    echo ""

    # Extract specific lessons (Pattern lines and Lesson lines)
    grep -B2 -A3 -i "$repo_short" "$LESSONS_FILE" | grep -iE '\*\*Pattern\*\*|\*\*Lesson\*\*|\*\*教训\*\*|\*\*Pattern:' | head -10 | while read -r line; do
      echo -e "  ${DIM}${line}${NC}"
    done
    echo ""
    found_patterns=$((found_patterns + header_count))
  fi
fi

# --- Check 2: wiki/projects/ notes for repo ---
project_note=""
for f in "$WIKI_DIR/projects/${repo_short}"*.md; do
  [[ -f "$f" ]] && project_note="$f" && break
done

if [[ -n "$project_note" ]]; then
  # Check if the note mentions prior failures, closed PRs, or warnings
  failure_mentions=$(grep -ciE 'closed|superseded|rejected|failed|withdrawn|avoid|do not|⛔' "$project_note" 2>/dev/null || echo "0")
  if [[ "$failure_mentions" -gt 0 ]]; then
    echo -e "${YELLOW}📋 Wiki project note: ${project_note##*/} (${failure_mentions} failure-related mentions)${NC}"
    grep -iE 'closed|superseded|rejected|failed|withdrawn|avoid|do not|⛔' "$project_note" | head -5 | while read -r line; do
      echo -e "  ${DIM}${line}${NC}"
    done
    echo ""
    found_patterns=$((found_patterns + 1))
  fi
fi

# --- Check 3: GitHub closed PRs (if issue number provided) ---
if [[ -n "$issue_num" ]]; then
  closed_prs=$(gh pr list --repo "$repo" --author=kagura-agent --state=closed \
    --search "$issue_num" --json number,title --jq '.[] | "#\(.number) \(.title)"' 2>/dev/null || echo "")

  if [[ -n "$closed_prs" ]]; then
    closed_count=$(echo "$closed_prs" | wc -l)
    echo -e "${RED}🚫 GitHub: ${closed_count} closed PR(s) for issue #${issue_num}:${NC}"
    echo "$closed_prs" | while read -r pr; do
      echo -e "  ${RED}${pr}${NC}"
    done
    echo ""
    found_patterns=$((found_patterns + closed_count))
  fi
fi

# --- Check 4: Repo-level closed PR pattern (any closed PRs in this repo) ---
all_closed=$(gh pr list --repo "$repo" --author=kagura-agent --state=closed \
  --json number,title --jq 'length' 2>/dev/null || echo "0")

if [[ "$all_closed" -gt 0 ]]; then
  echo -e "${YELLOW}📊 Repo history: ${all_closed} total closed PR(s) by kagura-agent in ${repo}${NC}"

  # Show the most recent ones
  gh pr list --repo "$repo" --author=kagura-agent --state=closed \
    --json number,title,closedAt --jq '.[:5][] | "  #\(.number) \(.title) (closed \(.closedAt[:10]))"' 2>/dev/null || true
  echo ""
  found_patterns=$((found_patterns + 1))
fi

# --- Summary ---
echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
if [[ "$found_patterns" -eq 0 ]]; then
  echo -e "${GREEN}✅ CLEAR — no prior failure patterns found for ${repo}${NC}"
  echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
  exit 0
else
  echo -e "${YELLOW}⚠️  CAUTION — ${found_patterns} signal(s) found. Review patterns above before proceeding.${NC}"
  echo -e "${DIM}   If approaching the same issue/repo: document what's DIFFERENT this time.${NC}"
  echo -e "${DIM}   Same approach twice = guaranteed waste.${NC}"
  echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
  exit 1
fi
