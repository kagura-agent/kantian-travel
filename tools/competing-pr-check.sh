#!/usr/bin/env bash
# competing-pr-check.sh — Check for competing PRs before investing implementation time.
# Usage: bash tools/competing-pr-check.sh <owner/repo> <issue-number>
# Exit 0 = no competing PRs, safe to proceed
# Exit 1 = competing PR(s) found, STOP
# Exit 2 = usage error or API failure

set -euo pipefail

if [[ $# -lt 2 ]]; then
  echo "Usage: $0 <owner/repo> <issue-number>"
  echo "Example: $0 NousResearch/hermes-agent 44640"
  exit 2
fi

REPO="$1"
ISSUE="$2"

# Strip leading # if present
ISSUE="${ISSUE#\#}"

echo "🔍 Competing PR Check — ${REPO}#${ISSUE}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# 1. Search for PRs that reference this issue number (open)
echo ""
echo "Step 1: Searching for open PRs referencing #${ISSUE}..."
OPEN_PRS=$(gh pr list --repo "$REPO" --state open --search "$ISSUE" --json number,title,author,createdAt,url 2>/dev/null || echo "[]")
OPEN_COUNT=$(echo "$OPEN_PRS" | jq 'length' 2>/dev/null || echo "0")

if [[ "$OPEN_COUNT" -gt 0 ]]; then
  echo "  ⚠️  Found ${OPEN_COUNT} open PR(s):"
  echo "$OPEN_PRS" | jq -r '.[] | "  - #\(.number) by @\(.author.login): \(.title) (\(.createdAt[:10]))"'
fi

# 2. Search for recently merged PRs that reference this issue (last 30 days)
echo ""
echo "Step 2: Searching for recently merged PRs referencing #${ISSUE}..."
MERGED_PRS=$(gh pr list --repo "$REPO" --state merged --search "$ISSUE" --json number,title,author,mergedAt,url 2>/dev/null || echo "[]")
MERGED_COUNT=$(echo "$MERGED_PRS" | jq 'length' 2>/dev/null || echo "0")

if [[ "$MERGED_COUNT" -gt 0 ]]; then
  echo "  ⚠️  Found ${MERGED_COUNT} merged PR(s):"
  echo "$MERGED_PRS" | jq -r '.[] | "  - #\(.number) by @\(.author.login): \(.title) (merged \(.mergedAt[:10]))"'
fi

# 3. Check for PRs by me that were closed (previous failed attempts)
echo ""
echo "Step 3: Checking my previous attempts..."
MY_CLOSED=$(gh pr list --repo "$REPO" --author kagura-agent --state closed --search "$ISSUE" --json number,title,closedAt 2>/dev/null || echo "[]")
MY_CLOSED_COUNT=$(echo "$MY_CLOSED" | jq 'length' 2>/dev/null || echo "0")

if [[ "$MY_CLOSED_COUNT" -gt 0 ]]; then
  echo "  🚫 Found ${MY_CLOSED_COUNT} previous closed PR(s) by me:"
  echo "$MY_CLOSED" | jq -r '.[] | "  - #\(.number): \(.title) (closed \(.closedAt[:10]))"'
fi

# 4. Check if issue is still open
echo ""
echo "Step 4: Verifying issue state..."
ISSUE_STATE=$(gh issue view "$ISSUE" --repo "$REPO" --json state --jq '.state' 2>/dev/null || echo "UNKNOWN")
echo "  Issue state: ${ISSUE_STATE}"

# Verdict
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

BLOCK=0
REASONS=()

if [[ "$ISSUE_STATE" != "OPEN" ]]; then
  REASONS+=("Issue is ${ISSUE_STATE} (not OPEN)")
  BLOCK=1
fi

if [[ "$MY_CLOSED_COUNT" -gt 0 ]]; then
  REASONS+=("Previous failed attempt(s) by me — do NOT retry same issue")
  BLOCK=1
fi

if [[ "$MERGED_COUNT" -gt 0 ]]; then
  REASONS+=("Already-merged PR(s) exist — issue may already be fixed")
  BLOCK=1
fi

if [[ "$OPEN_COUNT" -gt 0 ]]; then
  # Check if any open PR has CI passing (strong competitor)
  HAS_COMPETITOR=false
  for pr_num in $(echo "$OPEN_PRS" | jq -r '.[].number'); do
    PR_AUTHOR=$(echo "$OPEN_PRS" | jq -r ".[] | select(.number == $pr_num) | .author.login")
    if [[ "$PR_AUTHOR" == "kagura-agent" ]]; then
      echo "  ℹ️  PR #${pr_num} is mine — skipping competitor check"
      continue
    fi
    HAS_COMPETITOR=true
  done
  if $HAS_COMPETITOR; then
    REASONS+=("Open competing PR(s) from other contributors")
    BLOCK=1
  fi
fi

if [[ "$BLOCK" -eq 1 ]]; then
  echo "🚫 BLOCKED — Do not proceed with this issue:"
  for r in "${REASONS[@]}"; do
    echo "  • $r"
  done
  exit 1
else
  echo "✅ CLEAR — No competing PRs found, safe to proceed"
  exit 0
fi
