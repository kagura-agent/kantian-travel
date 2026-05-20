#!/bin/bash
# review-diff-check.sh — Pre-check for diff-scoped daily review
# Inspired by Dreamer's "Context Phase only touches what changed" principle
# Usage: bash review-diff-check.sh [hours_since_last_review]
#
# Output: Lists changed tool/config files since last review.
# If nothing changed, prints "NO_CHANGES" so the review can fast-path.

HOURS="${1:-24}"
WORKSPACE="${HOME}/.openclaw/workspace"

echo "=== Diff-Scoped Review Pre-Check (last ${HOURS}h) ==="
echo ""

# 1. Tool-related file changes in workspace
echo "📦 Tool files changed:"
TOOL_CHANGES=$(cd "$WORKSPACE" && git log --since="${HOURS} hours ago" --name-only --pretty=format: \
  -- TOOLS.md tools/ flowforge/ wiki/scripts/ 2>/dev/null | sort -u | grep -v '^$')

if [ -z "$TOOL_CHANGES" ]; then
  echo "  (none)"
  TOOLS_CHANGED=0
else
  echo "$TOOL_CHANGES" | sed 's/^/  /'
  TOOLS_CHANGED=$(echo "$TOOL_CHANGES" | wc -l)
fi
echo ""

# 2. DNA file changes
echo "🧬 DNA files changed:"
DNA_CHANGES=$(cd "$WORKSPACE" && git log --since="${HOURS} hours ago" --name-only --pretty=format: \
  -- SOUL.md AGENTS.md IDENTITY.md HEARTBEAT.md NUDGE.md beliefs-candidates.md 2>/dev/null | sort -u | grep -v '^$')

if [ -z "$DNA_CHANGES" ]; then
  echo "  (none)"
  DNA_CHANGED=0
else
  echo "$DNA_CHANGES" | sed 's/^/  /'
  DNA_CHANGED=$(echo "$DNA_CHANGES" | wc -l)
fi
echo ""

# 3. Cron/config changes (openclaw config)
echo "⏰ Cron errors (last ${HOURS}h):"
CRON_ERRORS=$(cd "$WORKSPACE" && grep -c "error\|fail\|Error\|FAIL" ../logs/cron-*.log 2>/dev/null | grep -v ':0$' | head -5)
if [ -z "$CRON_ERRORS" ]; then
  echo "  (none found or no logs)"
else
  echo "$CRON_ERRORS" | sed 's/^/  /'
fi
echo ""

# 4. Workflow changes
echo "🔄 Workflow files changed:"
WF_CHANGES=$(cd "$WORKSPACE" && git log --since="${HOURS} hours ago" --name-only --pretty=format: \
  -- flowforge/workflows/ 2>/dev/null | sort -u | grep -v '^$')

if [ -z "$WF_CHANGES" ]; then
  echo "  (none)"
else
  echo "$WF_CHANGES" | sed 's/^/  /'
fi
echo ""

# 5. Strategy changes
echo "📋 Strategy changed:"
STRAT_CHANGES=$(cd "$WORKSPACE" && git log --since="${HOURS} hours ago" --name-only --pretty=format: \
  -- wiki/strategy.md 2>/dev/null | sort -u | grep -v '^$')

if [ -z "$STRAT_CHANGES" ]; then
  echo "  (none)"
else
  echo "$STRAT_CHANGES" | sed 's/^/  /'
fi
echo ""

# Summary
TOTAL=$((TOOLS_CHANGED + DNA_CHANGED))
if [ "$TOTAL" -eq 0 ] && [ -z "$WF_CHANGES" ] && [ -z "$STRAT_CHANGES" ]; then
  echo "✅ NO_CHANGES — All tools/DNA/workflows/strategy unchanged. Fast-path review."
else
  echo "⚠️ ${TOTAL} file(s) changed — focus review on changed items."
fi
