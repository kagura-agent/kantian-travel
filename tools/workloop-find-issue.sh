#!/usr/bin/env bash
# workloop-find-issue.sh — 扫描可做 issue，批量去重过滤，输出排名列表
# 输出: 存活的候选 issue 列表（已通过所有 gate）
# 用法: bash tools/workloop-find-issue.sh [--priority P1|P2|P3]

set -o pipefail
AUTHOR="kagura-agent"
WORKSPACE="$HOME/.openclaw/workspace"

echo "═══════════════════════════════════════════"
echo "  FIND WORK — $(date '+%Y-%m-%d %H:%M')"
echo "═══════════════════════════════════════════"

# ─── Scan all tracked repos ───────────────────────────────────────────
echo ""
echo "┌─ SCANNING TRACKED REPOS ───────────────────────────"
SCAN_OUT=$(cd "$WORKSPACE" && gogetajob scan --all 2>&1 | tail -5)
echo "$SCAN_OUT" | sed 's/^/│ /'
echo "└──────────────────────────────────────────────────"

# ─── Get feed (priority ordered) ─────────────────────────────────────
echo ""
echo "┌─ FETCHING ISSUE FEED ─────────────────────────────"
FEED=$(cd "$WORKSPACE" && gogetajob feed --json 2>/dev/null)
if [ $? -ne 0 ] || [ -z "$FEED" ]; then
  # Fallback: try without --json
  FEED_TEXT=$(cd "$WORKSPACE" && gogetajob feed 2>/dev/null | head -40)
  echo "$FEED_TEXT" | sed 's/^/│ /'
  echo "│"
  echo "│ ⚠️ JSON feed unavailable, showing text. Agent must parse manually."
  echo "└──────────────────────────────────────────────────"
  echo ""
  echo "═══════════════════════════════════════════"
  echo "  CANDIDATES (text mode — parse above)"
  echo "═══════════════════════════════════════════"
  exit 0
fi

TOTAL=$(echo "$FEED" | jq 'length' 2>/dev/null || echo "0")
echo "│ Total candidates from feed: $TOTAL"
echo "└──────────────────────────────────────────────────"

if [ "$TOTAL" = "0" ]; then
  echo ""
  echo "═══════════════════════════════════════════"
  echo "  NO CANDIDATES — recommend discover node"
  echo "═══════════════════════════════════════════"
  exit 0
fi

# ─── Batch filter candidates ─────────────────────────────────────────
echo ""
echo "┌─ FILTERING CANDIDATES ────────────────────────────"

SURVIVORS=""
SURVIVOR_COUNT=0
CHECKED=0
MAX_CHECK=15  # Don't check more than 15 to save API calls

while IFS= read -r line; do
  [ -z "$line" ] && continue
  [ $CHECKED -ge $MAX_CHECK ] && break
  CHECKED=$((CHECKED + 1))
  
  REPO=$(echo "$line" | jq -r '.repo // .repository // empty' 2>/dev/null)
  NUM=$(echo "$line" | jq -r '.number // empty' 2>/dev/null)
  TITLE=$(echo "$line" | jq -r '.title // empty' 2>/dev/null | head -c 60)
  
  [ -z "$REPO" ] || [ -z "$NUM" ] && continue
  
  # Gate 1: Issue still open?
  STATE=$(gh issue view "$NUM" --repo "$REPO" --json state --jq '.state' 2>/dev/null || echo "UNKNOWN")
  if [ "$STATE" != "OPEN" ]; then
    echo "│ ❌ $REPO#$NUM — not OPEN ($STATE)"
    continue
  fi
  
  # Gate 2: Already interacted? (withdraw = absolute no)
  MY_COMMENTS=$(gh issue view "$NUM" --repo "$REPO" --json comments --jq "[.comments[] | select(.author.login==\"$AUTHOR\")] | length" 2>/dev/null || echo "0")
  if [ "$MY_COMMENTS" != "0" ]; then
    # Check if withdraw
    HAS_WITHDRAW=$(gh issue view "$NUM" --repo "$REPO" --json comments --jq "[.comments[] | select(.author.login==\"$AUTHOR\" and (.body | test(\"withdraw|won't be able|unassign|放弃\";\"i\")))] | length" 2>/dev/null || echo "0")
    if [ "$HAS_WITHDRAW" != "0" ]; then
      echo "│ ❌ $REPO#$NUM — previously withdrawn"
      continue
    fi
    # Already claimed
    echo "│ ⏭️  $REPO#$NUM — already interacted (skip)"
    continue
  fi
  
  # Gate 3: Already have open PR for this issue?
  OPEN_PR=$(gh pr list --repo "$REPO" --author="$AUTHOR" --state=open --search "$NUM" --json number -q 'length' 2>/dev/null || echo "0")
  if [ "$OPEN_PR" != "0" ]; then
    echo "│ ❌ $REPO#$NUM — already have open PR"
    continue
  fi
  
  # Gate 4: Already have closed PR for this issue?
  CLOSED_PR=$(gh pr list --repo "$REPO" --author="$AUTHOR" --state=closed --search "$NUM" --json number -q 'length' 2>/dev/null || echo "0")
  if [ "$CLOSED_PR" != "0" ]; then
    echo "│ ❌ $REPO#$NUM — previously failed/closed PR"
    continue
  fi
  
  # Gate 5: Per-repo open PR count ≤ 4?
  REPO_PRS=$(gh pr list --repo "$REPO" --author="$AUTHOR" --state=open --json number -q 'length' 2>/dev/null || echo "0")
  if [ "$REPO_PRS" -ge 5 ] 2>/dev/null; then
    echo "│ ❌ $REPO#$NUM — repo at PR limit ($REPO_PRS open)"
    continue
  fi
  
  # Gate 6: Competing PR?
  if [ -f "$WORKSPACE/tools/competing-pr-check.sh" ]; then
    bash "$WORKSPACE/tools/competing-pr-check.sh" "$REPO" "$NUM" >/dev/null 2>&1
    if [ $? -ne 0 ]; then
      echo "│ ❌ $REPO#$NUM — competing PR exists"
      continue
    fi
  fi
  
  # Survived all gates!
  SURVIVOR_COUNT=$((SURVIVOR_COUNT + 1))
  echo "│ ✅ #$SURVIVOR_COUNT: $REPO#$NUM — $TITLE"
  SURVIVORS="$SURVIVORS|$REPO#$NUM:$TITLE"
  
  # Stop after finding 3 good candidates
  [ $SURVIVOR_COUNT -ge 3 ] && break
  
done < <(echo "$FEED" | jq -c '.[]')

echo "│"
echo "│ Checked: $CHECKED | Survived: $SURVIVOR_COUNT"
echo "└──────────────────────────────────────────────────"

# ─── Output ───────────────────────────────────────────────────────────
echo ""
echo "═══════════════════════════════════════════"
if [ $SURVIVOR_COUNT -eq 0 ]; then
  echo "  NO VIABLE ISSUES — recommend discover node"
  echo "  (All $CHECKED candidates filtered out)"
else
  echo "  RECOMMENDED ISSUES (pick #1 unless you have reason):"
  echo "$SURVIVORS" | tr '|' '\n' | grep -v '^$' | nl -w2 -s'. '
fi
echo "═══════════════════════════════════════════"
