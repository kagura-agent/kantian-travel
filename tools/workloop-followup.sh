#!/usr/bin/env bash
# workloop-followup.sh — 结构化 PR/issue 跟进检查
# 输出结构化摘要，供 workloop followup 节点读取判断分支
# 设计原则：单个 API 失败不中断整体，错误记录但继续

set -o pipefail
AUTHOR="kagura-agent"
NOW_EPOCH=$(date +%s)
SEVEN_DAYS=$((7 * 86400))
FOURTEEN_DAYS=$((14 * 86400))
THREE_DAYS=$((3 * 86400))

echo "═══════════════════════════════════════════"
echo "  WORKLOOP FOLLOWUP — $(date '+%Y-%m-%d %H:%M')"
echo "═══════════════════════════════════════════"

# ─── Step 0: Assigned Issues ───────────────────────────────────────────
echo ""
echo "┌─ STEP 0: ASSIGNED ISSUES ─────────────────────────"

ASSIGNED_JSON=$(gh search issues --assignee="$AUTHOR" --state=open --json repository,number,title,updatedAt 2>/dev/null)
if [ $? -ne 0 ] || [ -z "$ASSIGNED_JSON" ]; then
  echo "│ ⚠️ gh search issues failed or empty"
  echo "│ ASSIGNED_COUNT=0"
  ASSIGNED_COUNT=0
else
  ASSIGNED_COUNT=$(echo "$ASSIGNED_JSON" | jq 'length')
  echo "│ Found $ASSIGNED_COUNT assigned issues"
  
  UNFULFILLED=""
  while IFS= read -r line; do
    REPO=$(echo "$line" | jq -r '.repository.nameWithOwner')
    NUM=$(echo "$line" | jq -r '.number')
    TITLE=$(echo "$line" | jq -r '.title')
    
    # Check if we have a PR for this issue
    HAS_PR=$(gh pr list --repo "$REPO" --author="$AUTHOR" --search "$NUM" --state=open --json number -q 'length' 2>/dev/null || echo "0")
    HAS_CLOSED_PR=$(gh pr list --repo "$REPO" --author="$AUTHOR" --search "$NUM" --state=closed --json number -q 'length' 2>/dev/null || echo "0")
    
    # Check if we commented
    HAS_COMMENT=$(gh issue view "$NUM" --repo "$REPO" --json comments --jq "[.comments[] | select(.author.login==\"$AUTHOR\")] | length" 2>/dev/null || echo "0")
    
    if [ "$HAS_PR" = "0" ] && [ "$HAS_CLOSED_PR" = "0" ] && [ "$HAS_COMMENT" = "0" ]; then
      echo "│ 🔴 UNFULFILLED: $REPO#$NUM — $TITLE"
      UNFULFILLED="$UNFULFILLED $REPO#$NUM"
    else
      echo "│ ✅ Fulfilled: $REPO#$NUM — $TITLE"
    fi
  done < <(echo "$ASSIGNED_JSON" | jq -c '.[]')
fi
echo "└──────────────────────────────────────────────────"

# ─── Step 1: Open PRs Status ──────────────────────────────────────────
echo ""
echo "┌─ STEP 1: OPEN PR STATUS ──────────────────────────"

# Get all open PRs via gh search (authoritative)
ALL_PRS=$(gh search prs --author="$AUTHOR" --state=open --json repository,number,title,updatedAt --limit 50 2>/dev/null)
if [ $? -ne 0 ] || [ -z "$ALL_PRS" ]; then
  echo "│ ⚠️ gh search prs failed"
  echo "│ PR_COUNT=unknown"
  PR_COUNT=0
  ALL_PRS="[]"
else
  PR_COUNT=$(echo "$ALL_PRS" | jq 'length')
  echo "│ Total open PRs: $PR_COUNT"
fi

# Check each PR for actionable items
ACTION_NEEDED=""
while IFS= read -r line; do
  [ -z "$line" ] && continue
  REPO=$(echo "$line" | jq -r '.repository.nameWithOwner')
  NUM=$(echo "$line" | jq -r '.number')
  TITLE=$(echo "$line" | jq -r '.title' | head -c 60)
  UPDATED=$(echo "$line" | jq -r '.updatedAt')
  
  # Calculate age
  UPDATED_EPOCH=$(date -d "$UPDATED" +%s 2>/dev/null || date +%s)
  AGE_DAYS=$(( (NOW_EPOCH - UPDATED_EPOCH) / 86400 ))
  
  # Check review status
  REVIEW_STATE=$(gh pr view "$NUM" --repo "$REPO" --json reviews --jq '[.reviews[] | select(.author.login != "'"$AUTHOR"'")] | last | .state' 2>/dev/null || echo "NONE")
  
  # Check last commenter (ball ownership)
  LAST_COMMENTER=$(gh pr view "$NUM" --repo "$REPO" --json comments --jq '.comments[-1].author.login // "none"' 2>/dev/null || echo "unknown")
  
  # Check mergeable
  MERGEABLE=$(gh pr view "$NUM" --repo "$REPO" --json mergeable --jq '.mergeable' 2>/dev/null || echo "UNKNOWN")
  
  # Determine status
  STATUS="⏳ waiting"
  BALL="them"
  
  if [ "$REVIEW_STATE" = "CHANGES_REQUESTED" ]; then
    # Check if we pushed after the review
    LAST_COMMIT_DATE=$(gh pr view "$NUM" --repo "$REPO" --json commits --jq '.commits[-1].committedDate' 2>/dev/null || echo "")
    LAST_REVIEW_DATE=$(gh pr view "$NUM" --repo "$REPO" --json reviews --jq '[.reviews[] | select(.state=="CHANGES_REQUESTED")] | last | .submittedAt' 2>/dev/null || echo "")
    
    if [ -n "$LAST_COMMIT_DATE" ] && [ -n "$LAST_REVIEW_DATE" ] && [[ "$LAST_COMMIT_DATE" > "$LAST_REVIEW_DATE" ]]; then
      STATUS="⏳ pushed fix, waiting re-review"
      BALL="them"
    else
      STATUS="🔴 CHANGES_REQUESTED — must fix"
      BALL="us"
      ACTION_NEEDED="$ACTION_NEEDED CHANGES_REQUESTED:$REPO#$NUM"
    fi
  elif [ "$REVIEW_STATE" = "APPROVED" ]; then
    STATUS="✅ approved, waiting merge"
    BALL="them"
    if [ $AGE_DAYS -ge 14 ]; then
      STATUS="⚠️ approved but stale (${AGE_DAYS}d) — consider close"
      ACTION_NEEDED="$ACTION_NEEDED STALE_APPROVED:$REPO#$NUM"
    fi
  elif [ "$LAST_COMMENTER" != "$AUTHOR" ] && [ "$LAST_COMMENTER" != "none" ] && [ "$LAST_COMMENTER" != "unknown" ]; then
    STATUS="🟡 comment from $LAST_COMMENTER — check if actionable"
    BALL="us"
    ACTION_NEEDED="$ACTION_NEEDED COMMENT:$REPO#$NUM"
  fi
  
  # Age-based rules
  if [ $AGE_DAYS -ge 14 ] && [ "$REVIEW_STATE" != "APPROVED" ] && [ "$BALL" = "them" ]; then
    STATUS="🔴 >14d no review — HARD CLOSE"
    ACTION_NEEDED="$ACTION_NEEDED HARD_CLOSE:$REPO#$NUM"
  elif [ $AGE_DAYS -ge 7 ] && [ "$BALL" = "them" ] && [ "$REVIEW_STATE" = "NONE" ] || [ "$REVIEW_STATE" = "null" ]; then
    # Check if we already pinged in last 3 days
    RECENT_PING=$(gh pr view "$NUM" --repo "$REPO" --json comments --jq "[.comments[] | select(.author.login==\"$AUTHOR\" and (.createdAt | fromdateiso8601) > ($NOW_EPOCH - $THREE_DAYS))] | length" 2>/dev/null || echo "0")
    if [ "$RECENT_PING" = "0" ]; then
      STATUS="🟡 >7d no review — needs ping"
      ACTION_NEEDED="$ACTION_NEEDED NEEDS_PING:$REPO#$NUM"
    fi
  fi
  
  # Conflict check
  if [ "$MERGEABLE" = "CONFLICTING" ]; then
    STATUS="$STATUS | ⚠️ CONFLICT"
    ACTION_NEEDED="$ACTION_NEEDED CONFLICT:$REPO#$NUM"
  fi
  
  echo "│ $REPO#$NUM (${AGE_DAYS}d) [$BALL] $STATUS"
  echo "│   └─ $TITLE"
  
done < <(echo "$ALL_PRS" | jq -c '.[]')
echo "└──────────────────────────────────────────────────"

# ─── Step 2: Per-repo Count ───────────────────────────────────────────
echo ""
echo "┌─ STEP 2: PER-REPO PR COUNT ───────────────────────"
echo "$ALL_PRS" | jq -r '[.[].repository.nameWithOwner] | group_by(.) | map({repo: .[0], count: length}) | sort_by(-.count) | .[] | "│ \(.repo): \(.count)"' 2>/dev/null || echo "│ ⚠️ count failed"
OVER_LIMIT=$(echo "$ALL_PRS" | jq '[.[].repository.nameWithOwner] | group_by(.) | map(select(length > 5)) | .[].[] ' 2>/dev/null | sort -u)
if [ -n "$OVER_LIMIT" ]; then
  echo "│ 🔴 OVER LIMIT (>5): $OVER_LIMIT"
fi
echo "└──────────────────────────────────────────────────"

# ─── Step 3: Notifications ────────────────────────────────────────────
echo ""
echo "┌─ STEP 3: GITHUB NOTIFICATIONS ────────────────────"
NOTIFS=$(gh api notifications --paginate --jq '.[].subject | "\(.type): \(.title)"' 2>/dev/null | head -20)
NOTIF_COUNT=$(echo "$NOTIFS" | grep -c . 2>/dev/null || echo "0")
if [ "$NOTIF_COUNT" = "0" ] || [ -z "$NOTIFS" ]; then
  echo "│ No unread notifications"
else
  echo "│ $NOTIF_COUNT unread notifications:"
  echo "$NOTIFS" | sed 's/^/│   /'
fi
echo "└──────────────────────────────────────────────────"

# ─── Summary & Recommended Branch ─────────────────────────────────────
echo ""
echo "═══════════════════════════════════════════"
echo "  SUMMARY"
echo "═══════════════════════════════════════════"
echo "  Assigned issues: $ASSIGNED_COUNT (unfulfilled: $(echo $UNFULFILLED | wc -w | tr -d ' '))"
echo "  Open PRs: $PR_COUNT"
echo "  Action needed: $(echo $ACTION_NEEDED | wc -w | tr -d ' ') items"

# Determine recommended branch
if [ -n "$UNFULFILLED" ]; then
  echo ""
  echo "  📌 RECOMMENDED BRANCH: resolve_assigned"
  echo "     Unfulfilled: $UNFULFILLED"
elif [ -n "$ACTION_NEEDED" ]; then
  echo ""
  echo "  📌 RECOMMENDED BRANCH: handle_feedback"
  echo "     Actions: $ACTION_NEEDED"
else
  echo ""
  echo "  📌 RECOMMENDED BRANCH: find_work"
  echo "     All PRs in normal wait state. Go find new work!"
fi
echo "═══════════════════════════════════════════"

# Mark notifications as read if we checked them
if [ "$NOTIF_COUNT" != "0" ] && [ -n "$NOTIFS" ]; then
  gh api -X PUT notifications --field read=true --field last_read_at="$(date -u +%Y-%m-%dT%H:%M:%SZ)" 2>/dev/null
fi
