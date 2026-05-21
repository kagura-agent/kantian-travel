#!/usr/bin/env bash
# goal-drift-check.sh — Detect when subagent output drifts from stated task
# Inspired by eval-view's goal_drift.py (Jaccard token overlap baseline)
#
# Usage:
#   goal-drift-check.sh --task "task description" --result "subagent output"
#   echo "subagent output" | goal-drift-check.sh --task "task description"
#   goal-drift-check.sh --task "task description" --result-file /path/to/output.txt
#
# Exit codes:
#   0 = aligned (overlap >= threshold)
#   1 = drifted (overlap < threshold)
#   2 = usage error

set -euo pipefail

THRESHOLD="${DRIFT_THRESHOLD:-0.15}"  # Conservative default (eval-view uses 0.2)
TASK=""
RESULT=""
RESULT_FILE=""
VERBOSE=false

usage() {
    echo "Usage: $0 --task <task_description> [--result <output> | --result-file <path>]"
    echo "  Reads from stdin if no --result/--result-file given"
    echo "  DRIFT_THRESHOLD env var overrides default (0.15)"
    exit 2
}

while [[ $# -gt 0 ]]; do
    case "$1" in
        --task) TASK="$2"; shift 2 ;;
        --result) RESULT="$2"; shift 2 ;;
        --result-file) RESULT_FILE="$2"; shift 2 ;;
        --threshold) THRESHOLD="$2"; shift 2 ;;
        --verbose|-v) VERBOSE=true; shift ;;
        *) usage ;;
    esac
done

[[ -z "$TASK" ]] && usage

# Get result text
if [[ -n "$RESULT_FILE" ]]; then
    RESULT=$(cat "$RESULT_FILE")
elif [[ -z "$RESULT" ]]; then
    RESULT=$(cat)
fi

[[ -z "$RESULT" ]] && { echo "❌ No result text provided"; exit 2; }

# Tokenize: lowercase, split on non-alpha, filter stopwords + short tokens
tokenize() {
    echo "$1" | tr '[:upper:]' '[:lower:]' | \
        tr -cs 'a-z0-9' '\n' | \
        grep -v -E '^(the|a|an|is|are|was|were|be|been|being|have|has|had|do|does|did|will|would|could|should|may|might|shall|can|to|of|in|for|on|with|at|by|from|as|into|through|during|before|after|above|below|between|out|off|over|under|again|further|then|once|here|there|when|where|why|how|all|both|each|few|more|most|other|some|such|no|nor|not|only|own|same|so|than|too|very|just|but|and|or|if|that|this|it|its|i|you|he|she|we|they|me|him|her|us|them|my|your|his|our|their|what|which|who|whom|these|those|am|about|up|also|been|because|go|get|got|make|made|new|check|look|find|see|use|using|used|run|page|front|back|read|write|show|try|keep)$' | \
        awk 'length >= 3' | \
        sort -u
}

TASK_TOKENS=$(tokenize "$TASK")
RESULT_TOKENS=$(tokenize "$RESULT")

# Count tokens
task_count=$(echo "$TASK_TOKENS" | grep -c . || true)
result_count=$(echo "$RESULT_TOKENS" | grep -c . || true)

# Edge case: very short task descriptions
if [[ $task_count -lt 3 ]]; then
    echo "⚠️ Task too short for meaningful drift detection ($task_count tokens)"
    exit 0
fi

# Jaccard intersection
intersection=$(comm -12 <(echo "$TASK_TOKENS") <(echo "$RESULT_TOKENS") | grep -c . || true)
union=$(comm <(echo "$TASK_TOKENS") <(echo "$RESULT_TOKENS") | tr -d '\t' | sort -u | grep -c . || true)

# Jaccard coefficient
if [[ $union -eq 0 ]]; then
    jaccard="0.00"
else
    jaccard=$(awk "BEGIN {printf \"%.2f\", $intersection / $union}")
fi

# Coverage: what fraction of task tokens appear in result
if [[ $task_count -eq 0 ]]; then
    coverage="0.00"
else
    coverage=$(awk "BEGIN {printf \"%.2f\", $intersection / $task_count}")
fi

# Verdict: pass if EITHER jaccard >= threshold OR task coverage >= 0.40
COVERAGE_THRESHOLD="0.40"
drifted=$(awk "BEGIN {print ($jaccard < $THRESHOLD && $coverage < $COVERAGE_THRESHOLD) ? 1 : 0}")

if $VERBOSE; then
    echo "📊 Goal-Drift Check"
    echo "  Task tokens:   $task_count"
    echo "  Result tokens:  $result_count"
    echo "  Intersection:   $intersection"
    echo "  Union:          $union"
    echo "  Jaccard:        $jaccard"
    echo "  Task coverage:  $coverage"
    echo "  Threshold:      $THRESHOLD"
    
    if [[ $drifted -eq 1 ]]; then
        echo ""
        echo "  ⚠️ DRIFT DETECTED — result may not address the stated task"
        echo "  Missing task terms:"
        comm -23 <(echo "$TASK_TOKENS") <(echo "$RESULT_TOKENS") | sed 's/^/    - /'
    else
        echo ""
        echo "  ✅ ALIGNED — result covers the stated task"
    fi
else
    if [[ $drifted -eq 1 ]]; then
        echo "⚠️ DRIFT (jaccard=$jaccard, coverage=$coverage, threshold=$THRESHOLD)"
    else
        echo "✅ ALIGNED (jaccard=$jaccard, coverage=$coverage)"
    fi
fi

exit $drifted
