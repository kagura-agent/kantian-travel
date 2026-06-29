#!/bin/bash
# study-outcome-log.sh — Log study session outcomes for quantitative tracking
# Inspired by: Godcoder route-log-recall-optimize pattern (quantitative success_rate per tag)
#
# Usage: bash study-outcome-log.sh --mode <mode> --outcome <outcome> [--tag <tag>] [--note <note>]
#   mode: scout | quick | followup | apply
#   outcome: signal (produced wiki card, gradient, or actionable insight)
#           | partial (some learning, no concrete artifact)
#           | empty (no useful output — saturation, phantom project, etc.)
#   tag: optional stable category (e.g. "deep-read", "hn-trending", "tool-change")
#   note: optional one-line explanation
#
# Data: study/outcome-log.jsonl (append-only)
# Report: bash study-stats.sh

set -euo pipefail

LOG_FILE="$HOME/.openclaw/workspace/study/outcome-log.jsonl"

# Parse args
MODE=""
OUTCOME=""
TAG=""
NOTE=""

while [[ $# -gt 0 ]]; do
    case "$1" in
        --mode) MODE="$2"; shift 2 ;;
        --outcome) OUTCOME="$2"; shift 2 ;;
        --tag) TAG="$2"; shift 2 ;;
        --note) NOTE="$2"; shift 2 ;;
        *) echo "Unknown arg: $1"; exit 1 ;;
    esac
done

# Validate required
if [[ -z "$MODE" || -z "$OUTCOME" ]]; then
    echo "❌ Required: --mode <scout|quick|followup|apply> --outcome <signal|partial|empty>"
    exit 1
fi

# Validate mode
case "$MODE" in
    scout|quick|followup|apply) ;;
    *) echo "❌ Invalid mode: $MODE (must be scout|quick|followup|apply)"; exit 1 ;;
esac

# Validate outcome
case "$OUTCOME" in
    signal|partial|empty) ;;
    *) echo "❌ Invalid outcome: $OUTCOME (must be signal|partial|empty)"; exit 1 ;;
esac

# Build JSON entry
TIMESTAMP=$(date -u +%Y-%m-%dT%H:%M:%SZ)
DATE=$(date +%Y-%m-%d)

# Use jq if available, otherwise manual JSON
if command -v jq &>/dev/null; then
    ENTRY=$(jq -nc \
        --arg ts "$TIMESTAMP" \
        --arg date "$DATE" \
        --arg mode "$MODE" \
        --arg outcome "$OUTCOME" \
        --arg tag "$TAG" \
        --arg note "$NOTE" \
        '{timestamp: $ts, date: $date, mode: $mode, outcome: $outcome, tag: (if $tag == "" then null else $tag end), note: (if $note == "" then null else $note end)}')
else
    # Fallback: manual JSON (no special chars expected in tag/note)
    TAG_JSON="null"
    NOTE_JSON="null"
    [[ -n "$TAG" ]] && TAG_JSON="\"$TAG\""
    [[ -n "$NOTE" ]] && NOTE_JSON="\"$NOTE\""
    ENTRY="{\"timestamp\":\"$TIMESTAMP\",\"date\":\"$DATE\",\"mode\":\"$MODE\",\"outcome\":\"$OUTCOME\",\"tag\":${TAG_JSON},\"note\":${NOTE_JSON}}"
fi

# Append
echo "$ENTRY" >> "$LOG_FILE"

# Emoji map
case "$OUTCOME" in
    signal) EMOJI="✅" ;;
    partial) EMOJI="🟡" ;;
    empty) EMOJI="⚪" ;;
esac

echo "$EMOJI Logged: $MODE → $OUTCOME${TAG:+ [$TAG]}${NOTE:+ ($NOTE)}"
