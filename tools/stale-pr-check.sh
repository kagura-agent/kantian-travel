#!/usr/bin/env bash
# stale-pr-check.sh — Detect if I already have a PR for this issue (stale workloop recovery).
# Usage: bash tools/stale-pr-check.sh <owner/repo> <issue-number>
#
# Exit codes:
#   0  = No existing PR from me → proceed with fresh implementation
#   10 = PR exists + CI green → FAST-PATH to pre_push_audit/submit
#   11 = PR exists + CI failing/pending → FIX mode (don't redo from scratch)
#   2  = Usage error or API failure
#
# Motivation: When a workloop instance gets stuck and resumes at implement node,
# it wastes hours re-implementing work that already exists as a PR. This script
# detects that situation and signals the appropriate recovery path.
# (gradient: stale-workloop-recovery, 2026-06-20)

set -euo pipefail

if [[ $# -lt 2 ]]; then
  echo "Usage: $0 <owner/repo> <issue-number>"
  echo "Example: $0 NousResearch/hermes-agent 44640"
  exit 2
fi

REPO="$1"
ISSUE="${2#\#}"  # Strip leading # if present

echo "⚡ Stale PR Recovery Check — ${REPO}#${ISSUE}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# 1. Check for my open PRs referencing this issue
MY_OPEN_PRS=$(gh pr list --repo "$REPO" --author kagura-agent --state open --search "$ISSUE" \
  --json number,title,headRefName,createdAt,statusCheckRollup 2>/dev/null || echo "[]")
MY_OPEN_COUNT=$(echo "$MY_OPEN_PRS" | jq 'length' 2>/dev/null || echo "0")

if [[ "$MY_OPEN_COUNT" -eq 0 ]]; then
  echo "  ✅ No existing PR from me for #${ISSUE}"
  echo ""
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  echo "✅ FRESH — Proceed with normal implementation"
  exit 0
fi

echo "  📌 Found ${MY_OPEN_COUNT} open PR(s) from me:"
echo "$MY_OPEN_PRS" | jq -r '.[] | "  - #\(.number): \(.title) (branch: \(.headRefName), created: \(.createdAt[:10]))"'

# 2. Check CI status of the most recent PR
LATEST_PR_NUM=$(echo "$MY_OPEN_PRS" | jq -r '.[0].number')
echo ""
echo "  Checking CI status for PR #${LATEST_PR_NUM}..."

# Get check status via gh pr checks
CI_OUTPUT=$(gh pr checks "$LATEST_PR_NUM" --repo "$REPO" 2>/dev/null || echo "UNKNOWN")

# Parse overall status
FAILING=0
PENDING=0
PASSING=0

if [[ "$CI_OUTPUT" == "UNKNOWN" ]]; then
  echo "  ⚠️  Could not retrieve CI status"
  PENDING=1
else
  # gh pr checks uses tab-separated: name\tstatus\ttime\turl
  # Status values: pass, fail, pending
  FAILING=$(echo "$CI_OUTPUT" | grep -cw "fail" || true)
  PENDING=$(echo "$CI_OUTPUT" | grep -cw "pending" || true)
  PASSING=$(echo "$CI_OUTPUT" | grep -cw "pass" || true)
  
  # Check for "no checks" case
  if echo "$CI_OUTPUT" | grep -q "no checks"; then
    PASSING=1
    PENDING=0
    FAILING=0
    echo "  ℹ️  No CI checks configured — treating as pass"
  else
    echo "  CI: ✅ ${PASSING} pass | ⏳ ${PENDING} pending | ❌ ${FAILING} fail"
  fi
fi

# 3. Determine exit path
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

if [[ "$FAILING" -gt 0 ]]; then
  echo "🔧 FIX MODE — PR #${LATEST_PR_NUM} exists but CI is failing"
  echo "  → Don't redo from scratch. Investigate CI failures and fix."
  echo "  → Check: gh pr checks ${LATEST_PR_NUM} --repo ${REPO}"
  echo "  → Then: git checkout <branch>, fix issues, push"
  exit 11
elif [[ "$PENDING" -gt 0 ]] && [[ "$PASSING" -eq 0 ]]; then
  echo "⏳ WAIT MODE — PR #${LATEST_PR_NUM} exists, CI still running"
  echo "  → Wait for CI to complete, then re-check"
  exit 11
else
  echo "⚡ FAST-PATH — PR #${LATEST_PR_NUM} exists and CI is green!"
  echo "  → Skip implementation entirely"
  echo "  → Go directly to pre_push_audit / submit verification"
  echo "  → PR URL: https://github.com/${REPO}/pull/${LATEST_PR_NUM}"
  exit 10
fi
