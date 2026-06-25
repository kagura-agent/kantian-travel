#!/usr/bin/env bash
# competing-pr-check.sh — Check for competing PRs before investing implementation time.
# Usage: bash tools/competing-pr-check.sh <owner/repo> <issue-number>
# Exit 0 = no competing PRs, safe to proceed
# Exit 1 = competing PR(s) found, STOP
# Exit 2 = usage error or API failure

set -uo pipefail
# Note: intentionally NOT set -e. Gate scripts must handle errors explicitly
# to implement fail-open behavior (tokdiet pattern: internal error → passthrough).

if [[ $# -lt 2 ]]; then
  echo "Usage: $0 <owner/repo> <issue-number>"
  echo "Example: $0 NousResearch/hermes-agent 44640"
  exit 2
fi

REPO="$1"
ISSUE="$2"
STRICT=false
if [[ "${3:-}" == "--strict" ]]; then
  STRICT=true
fi

# Strip leading # if present
ISSUE="${ISSUE#\#}"

# --- Fail-open infrastructure tracking ---
# Track whether API calls succeed. If ALL calls fail → fail-open (exit 0 + warning).
# Pattern: tokdiet "fail-open everywhere" — never block work because your gate broke.
API_SUCCESSES=0
API_FAILURES=0

echo "🔍 Competing PR Check — ${REPO}#${ISSUE}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# 1. Search for PRs that reference this issue number (open)
echo ""
echo "Step 1: Searching for open PRs referencing #${ISSUE}..."
OPEN_PRS=$(gh pr list --repo "$REPO" --state open --search "$ISSUE" --json number,title,author,createdAt,url 2>&1)
if [[ $? -ne 0 ]] || ! echo "$OPEN_PRS" | jq empty 2>/dev/null; then
  echo "  ⚠️  API call failed (open PRs search)"
  OPEN_PRS="[]"
  API_FAILURES=$((API_FAILURES + 1))
else
  API_SUCCESSES=$((API_SUCCESSES + 1))
fi
OPEN_COUNT=$(echo "$OPEN_PRS" | jq 'length' 2>/dev/null || echo "0")

if [[ "$OPEN_COUNT" -gt 0 ]]; then
  echo "  ⚠️  Found ${OPEN_COUNT} open PR(s):"
  echo "$OPEN_PRS" | jq -r '.[] | "  - #\(.number) by @\(.author.login): \(.title) (\(.createdAt[:10]))"'
fi

# 2. Search for recently merged PRs that reference this issue (last 30 days)
echo ""
echo "Step 2: Searching for recently merged PRs referencing #${ISSUE}..."
MERGED_PRS=$(gh pr list --repo "$REPO" --state merged --search "$ISSUE" --json number,title,author,mergedAt,url 2>&1)
if [[ $? -ne 0 ]] || ! echo "$MERGED_PRS" | jq empty 2>/dev/null; then
  echo "  ⚠️  API call failed (merged PRs search)"
  MERGED_PRS="[]"
  API_FAILURES=$((API_FAILURES + 1))
else
  API_SUCCESSES=$((API_SUCCESSES + 1))
fi
MERGED_COUNT=$(echo "$MERGED_PRS" | jq 'length' 2>/dev/null || echo "0")

if [[ "$MERGED_COUNT" -gt 0 ]]; then
  echo "  ⚠️  Found ${MERGED_COUNT} merged PR(s):"
  echo "$MERGED_PRS" | jq -r '.[] | "  - #\(.number) by @\(.author.login): \(.title) (merged \(.mergedAt[:10]))"'
fi

# 3. Check for PRs by me that were closed (previous failed attempts)
echo ""
echo "Step 3: Checking my previous attempts..."
MY_CLOSED=$(gh pr list --repo "$REPO" --author kagura-agent --state closed --search "$ISSUE" --json number,title,closedAt 2>&1)
if [[ $? -ne 0 ]] || ! echo "$MY_CLOSED" | jq empty 2>/dev/null; then
  echo "  ⚠️  API call failed (my closed PRs)"
  MY_CLOSED="[]"
  API_FAILURES=$((API_FAILURES + 1))
else
  API_SUCCESSES=$((API_SUCCESSES + 1))
fi
MY_CLOSED_COUNT=$(echo "$MY_CLOSED" | jq 'length' 2>/dev/null || echo "0")

if [[ "$MY_CLOSED_COUNT" -gt 0 ]]; then
  echo "  🚫 Found ${MY_CLOSED_COUNT} previous closed PR(s) by me:"
  echo "$MY_CLOSED" | jq -r '.[] | "  - #\(.number): \(.title) (closed \(.closedAt[:10]))"'
fi

# 4. Check if issue is still open
echo ""
echo "Step 4: Verifying issue state..."
ISSUE_STATE=$(gh issue view "$ISSUE" --repo "$REPO" --json state --jq '.state' 2>&1)
if [[ $? -ne 0 ]] || [[ -z "$ISSUE_STATE" ]] || [[ "$ISSUE_STATE" == *"error"* ]] || [[ "$ISSUE_STATE" == *"Could not"* ]]; then
  echo "  ⚠️  API call failed (issue state verification)"
  ISSUE_STATE="UNKNOWN"
  API_FAILURES=$((API_FAILURES + 1))
else
  API_SUCCESSES=$((API_SUCCESSES + 1))
fi
echo "  Issue state: ${ISSUE_STATE}"

# --- Fail-open gate ---
# If ALL API calls failed, we have zero verified data. Don't block work.
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  API: ${API_SUCCESSES} succeeded, ${API_FAILURES} failed"

if [[ "$API_SUCCESSES" -eq 0 ]] && [[ "$API_FAILURES" -gt 0 ]]; then
  echo ""
  echo "⚠️  FAIL-OPEN — All API calls failed (network/rate-limit/auth issue)"
  echo "  Cannot verify competing PRs. Proceeding with caution."
  echo "  💡 Manually verify: gh issue view $ISSUE --repo $REPO"
  if $STRICT; then
    echo "  (--strict mode: blocking anyway)"
    exit 1
  fi
  exit 0
fi

# Verdict
BLOCK=0
REASONS=()

# Only block on issue state if we actually got a verified response
if [[ "$ISSUE_STATE" == "UNKNOWN" ]]; then
  # API failed for this specific check — don't block, just warn
  echo "  ⚠️  Could not verify issue state (API failed) — assuming open"
elif [[ "$ISSUE_STATE" != "OPEN" ]]; then
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
  echo ""
  echo "📋 Next Steps:"
  # Emit actionable next steps based on specific block reasons
  if [[ "$ISSUE_STATE" != "OPEN" ]]; then
    echo "  → Issue is closed/resolved. Pick a different issue from the repo."
    echo "    Run: gh issue list --repo $REPO --state open --label 'good first issue' --limit 5"
  fi
  if [[ "$MY_CLOSED_COUNT" -gt 0 ]]; then
    echo "  → You already tried this issue and failed. Skip it permanently."
    echo "    Add to exclusion list or pick a fundamentally different issue."
  fi
  if [[ "$MERGED_COUNT" -gt 0 ]]; then
    echo "  → Verify the merged PR actually fixes the issue:"
    echo "    Run: gh issue view $ISSUE --repo $REPO --comments | tail -20"
    echo "    If issue is still open despite merged PR, the fix may be incomplete — assess carefully."
  fi
  if $HAS_COMPETITOR 2>/dev/null; then
    echo "  → Other contributors are already working on this. Options:"
    echo "    1. Pick a different issue (preferred)"
    echo "    2. If competing PR is stale (>14d, no activity), comment asking status before starting"
    echo "    3. If your approach is fundamentally different, note it in issue comments first"
  fi
  exit 1
else
  echo "✅ CLEAR — No competing PRs found, safe to proceed"
  exit 0
fi
