#!/usr/bin/env bash
# compress-output.sh — TACO-inspired exec output compression
# Reduces noisy terminal output to essential signal before injecting into context.
# Inspired by: TACO (multimodal-art-projection/TACO, arXiv:2604.19572)
#
# Usage: <command> 2>&1 | compress-output.sh [--type TYPE]
#   Types: npm, pip, git, test, build, auto (default: auto)
#
# Design: regex-based, zero LLM calls. Keeps errors, summaries, warnings.
# Always preserves: first 5 lines (command context), last 10 lines (final status).

set -euo pipefail

TYPE="auto"
while [[ $# -gt 0 ]]; do
    case "$1" in
        --type) TYPE="${2:-auto}"; shift 2 ;;
        *) shift ;;
    esac
done

# Byte-cap constants (protect against huge single lines / massive output)
# head -n alone is unsafe: one minified JSON line can be 10MB.
# Based on agents-md-context-patterns "byte-cap over line-cap" pattern.
MAX_INPUT_BYTES=524288   # 512KB total input cap
MAX_LINE_BYTES=4000      # 4KB per line (truncate longer lines)

# Use a temp file to avoid SIGPIPE with pipefail when piping large strings
# through head/tail (pre-existing bug: echo "$big" | head -n 5 → SIGPIPE)
TMPFILE=$(mktemp)
trap 'rm -f "$TMPFILE"' EXIT

# Read stdin with byte cap + line truncation in one pass
# head -c may SIGPIPE upstream; that's OK (we trap EXIT for cleanup)
head -c "$MAX_INPUT_BYTES" | awk -v max="$MAX_LINE_BYTES" '{print substr($0, 1, max)}' > "$TMPFILE" || true

TOTAL_LINES=$(wc -l < "$TMPFILE")

# Short output — pass through unchanged
if [[ "$TOTAL_LINES" -le 30 ]]; then
    cat "$TMPFILE"
    exit 0
fi

# Always keep first 5 and last 10 lines (file-based = no SIGPIPE)
HEAD=$(head -n 5 "$TMPFILE")
TAIL=$(tail -n 10 "$TMPFILE")
MIDDLE=$(tail -n +6 "$TMPFILE" | head -n $((TOTAL_LINES - 15)))
# Read full input for domain ID extraction
INPUT=$(cat "$TMPFILE")

# Extract domain-specific identifiers from middle before compression.
# Inspired by RunbookHermes EvidenceStack pattern: compression should preserve
# actionable references (IDs, paths, hashes) even when verbose lines are stripped.
extract_domain_ids() {
    local input="$1"
    local type="$2"
    local ids=""

    # PR/Issue references: #123, org/repo#123
    local pr_ids
    pr_ids=$(echo "$input" | grep -oE '([a-zA-Z0-9_.-]+/[a-zA-Z0-9_.-]+)?#[0-9]+' | sort -u | head -n 20)
    if [[ -n "$pr_ids" ]]; then
        ids="${ids} refs:$(echo "$pr_ids" | tr '\n' ',' | sed 's/,$//')"
    fi

    # File paths — for test type, only from error/fail lines (PASS files are noise)
    local paths
    if [[ "$type" == "test" ]]; then
        paths=$(echo "$input" | grep -iE 'FAIL|ERROR|error|✗|✘' \
            | grep -oE '[a-zA-Z0-9_./-]+\.[a-zA-Z]{1,6}(:[0-9]+)?' \
            | grep -E '/' | sort -u | head -n 15)
    else
        paths=$(echo "$input" | grep -oE '[a-zA-Z0-9_./-]+\.[a-zA-Z]{1,6}(:[0-9]+)?' \
            | grep -E '/' | grep -vE '^https?:|node_modules|\.git/' \
            | sort -u | head -n 15)
    fi
    if [[ -n "$paths" ]]; then
        ids="${ids} files:$(echo "$paths" | tr '\n' ',' | sed 's/,$//')"
    fi

    # Git short SHAs (7-12 hex chars) — skip for test type (hex in test names is noise)
    if [[ "$type" != "test" ]]; then
        local shas
        shas=$(echo "$input" | grep -oE '\b[0-9a-f]{7,12}\b' | sort -u | head -n 5)
        if [[ -n "$shas" ]]; then
            ids="${ids} shas:$(echo "$shas" | tr '\n' ',' | sed 's/,$//')"
        fi
    fi

    echo "$ids" | sed 's/^ //'
}

# For test output, also compress tail (remove PASS lines from last 10)
compress_tail() {
    local tail_input="$1"
    local type="$2"
    if [[ "$type" == "test" ]]; then
        echo "$tail_input" | grep -vE '^\s*(✓|✔|√|PASS)\s' || true
    else
        echo "$tail_input"
    fi
}

# Auto-detect type from content if not specified
if [[ "$TYPE" == "auto" ]]; then
    if echo "$HEAD" | grep -qiE 'npm (warn|err|install|test|run)|node_modules'; then
        TYPE="npm"
    elif echo "$HEAD" | grep -qiE 'pip install|collecting|requirement'; then
        TYPE="pip"
    elif echo "$HEAD" | grep -qiE 'git (clone|pull|push|fetch|log)'; then
        TYPE="git"
    elif echo "$HEAD" | grep -qiE 'PASS|FAIL|test|jest|vitest|pytest|mocha|✓|✗'; then
        TYPE="test"
    elif echo "$HEAD" | grep -qiE 'compil|build|tsc|webpack|vite|cargo'; then
        TYPE="build"
    fi
fi

compress_middle() {
    local input="$1"
    local type="$2"

    case "$type" in
        npm)
            # Keep: errors, warnings, added/removed summary, vulnerability info
            # Strip: individual package install lines, progress bars, timing per-package
            echo "$input" | grep -E \
                'ERR!|WARN|error|warn|added|removed|audited|found [0-9]|vulnerabilit|npm warn|up to date|packages in' \
                || true
            ;;
        pip)
            # Keep: errors, warnings, already satisfied, final install summary
            # Strip: download progress, collecting lines, using cached
            echo "$input" | grep -E \
                'ERROR|WARNING|error:|Successfully installed|already satisfied|Requirement|DEPRECATION' \
                | grep -vE 'Downloading|━|Using cached|Collecting(?!.*error)' \
                || true
            ;;
        git)
            # Keep: branch info, conflicts, errors, summary stats
            # Strip: individual object counting, delta resolution, receiving
            echo "$input" | grep -E \
                'branch|->|conflict|CONFLICT|error|fatal|warning|Already up|files changed|insertion|deletion|Fast-forward|merge|rebase' \
                | grep -vE 'Counting objects|Compressing objects|Receiving objects|Resolving deltas|remote: Enumerating' \
                || true
            ;;
        test)
            # Keep: FAIL lines, error details, summary line, skip reasons
            # Strip: individual PASS lines (keep count from summary)
            echo "$input" | grep -E \
                'FAIL|ERROR|error|✗|✘|×|skip|todo|pending|Tests:|Test Suites:|passed|failed|Ran [0-9]|[0-9]+ (passing|failing)|assert|expect|RUNS' \
                | grep -vE '^\s*(PASS|✓|✔|√)\s' \
                || true
            ;;
        build)
            # Keep: errors, warnings (first 5), final status
            # Strip: individual file compilation lines
            echo "$input" | grep -E \
                'error|Error|ERROR|warning|Warning|WARN|Built|Success|Failed|Output|Bundle|chunk|entry' \
                | grep -vE '^\s*(Compiling|Building|Bundling)\s(?!.*error)' \
                | head -n 30 \
                || true
            ;;
        *)
            # Generic: keep errors, warnings, summary-looking lines
            echo "$input" | grep -iE \
                'error|fail|warn|summary|total|result|complete|success|fatal|exception|traceback' \
                || true
            ;;
    esac
}

COMPRESSED_MIDDLE=$(compress_middle "$MIDDLE" "$TYPE")
COMPRESSED_LINES=$(echo "$COMPRESSED_MIDDLE" | wc -l)
STRIPPED=$((TOTAL_LINES - 15 - COMPRESSED_LINES))

# Extract preserved domain IDs from compressed-away content
DOMAIN_IDS=$(extract_domain_ids "$MIDDLE" "$TYPE")

echo "$HEAD"
if [[ "$STRIPPED" -gt 0 ]]; then
    if [[ -n "$DOMAIN_IDS" ]]; then
        echo "  [...$STRIPPED lines compressed (type=$TYPE) | preserved: $DOMAIN_IDS]"
    else
        echo "  [...$STRIPPED lines compressed (type=$TYPE)...]"
    fi
fi
if [[ -n "$COMPRESSED_MIDDLE" ]]; then
    echo "$COMPRESSED_MIDDLE"
fi
COMPRESSED_TAIL=$(compress_tail "$TAIL" "$TYPE")
echo "$COMPRESSED_TAIL"
