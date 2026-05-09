#!/usr/bin/env bash
# evaluate-candidate.sh — Independent scoring for beliefs-candidates promotion
# Spawns a subagent to evaluate a candidate against Triple Verification criteria.
# The evaluator has NO context about the candidate's origin — only the text.
#
# Usage: bash scripts/evaluate-candidate.sh "candidate text or section header"
# Output: PASS/FAIL + scores + reasoning
#
# Inspired by darwin-skill's independent scoring pattern:
# "评分者和修改者不是同一个 agent 上下文"

set -euo pipefail

CANDIDATES_FILE="$HOME/.openclaw/workspace/beliefs-candidates.md"
MEMORY_DIR="$HOME/.openclaw/workspace/memory"

if [ $# -lt 1 ]; then
  echo "Usage: $0 <candidate-search-term>"
  echo "Example: $0 'Code Review Failure'"
  exit 1
fi

SEARCH="$1"

# Extract the candidate section
CANDIDATE_TEXT=$(awk -v search="$SEARCH" '
  BEGIN { found=0; printing=0 }
  /^###? / {
    if (printing) exit
    if (index($0, search) > 0) { printing=1 }
  }
  printing { print }
' "$CANDIDATES_FILE")

if [ -z "$CANDIDATE_TEXT" ]; then
  echo "❌ No candidate found matching: $SEARCH"
  echo "Available candidates:"
  grep "^###" "$CANDIDATES_FILE" | grep -v "Promotion Gate\|Previous Gradients"
  exit 1
fi

# Count occurrences in memory files (V1 evidence)
OCCURRENCE_COUNT=$(grep -rl "$SEARCH" "$MEMORY_DIR"/*.md 2>/dev/null | wc -l)

echo "═══════════════════════════════════════════"
echo "🔍 Independent Candidate Evaluation"
echo "═══════════════════════════════════════════"
echo ""
echo "📋 Candidate:"
echo "$CANDIDATE_TEXT"
echo ""
echo "📊 Memory occurrences found: $OCCURRENCE_COUNT"
echo ""
echo "═══════════════════════════════════════════"
echo ""
echo "Generating evaluation prompt for independent subagent..."
echo ""

# The evaluation prompt — designed to be used with claude --print
cat <<EVAL_PROMPT
You are an INDEPENDENT EVALUATOR. You did NOT write or propose this candidate belief.
Your job is to score it objectively against three criteria. Be harsh — most candidates should FAIL.

## Candidate Under Review:
$CANDIDATE_TEXT

## Evidence from memory logs:
Occurrences in separate daily logs: $OCCURRENCE_COUNT

## Scoring Criteria (ALL must pass):

### V1: Cross-context (≥3 independent occurrences)
- The pattern must appear in ≥3 SEPARATE sessions/tasks
- Repeated mentions in one session = 1 occurrence, not 3
- Memory log count: $OCCURRENCE_COUNT (raw, may include duplicates)
- Score: PASS if genuinely ≥3 independent contexts, FAIL otherwise

### V2: Predictive Power
- Does this belief help in FUTURE scenarios not yet encountered?
- "If X happens, I'd do Y differently because of this belief"
- If it only describes what already happened, it's a NOTE not a BELIEF
- Score: PASS if you can construct a concrete future scenario, FAIL otherwise

### V3: Non-obvious
- Would a competent agent WITHOUT this belief make the same mistake?
- If any fresh agent would naturally avoid this, it's obvious and doesn't need encoding
- Score: PASS if a fresh agent would likely fail without it, FAIL otherwise

## Output Format:
V1_SCORE: PASS|FAIL
V1_REASONING: (one line)
V2_SCORE: PASS|FAIL
V2_REASONING: (one line)
V3_SCORE: PASS|FAIL
V3_REASONING: (one line)
OVERALL: PASS|FAIL
RECOMMENDATION: PROMOTE to [DNA|Workflow|Knowledge-base] at [specific location] | KEEP as candidate | DROP (explain why)
EVAL_PROMPT
