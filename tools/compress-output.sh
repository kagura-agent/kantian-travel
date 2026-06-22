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
            echo "$input" | grep -iE \
                'FAIL|ERROR|\berror\b|✗|✘|×|skip|todo|pending|Tests:|Test Suites:|passed|failed|Ran [0-9]|[0-9]+ (passing|failing)|assert|expect|RUNS' \
                | grep -vE '^\s*(PASS|✓|✔|√)\s' \
                || true
            ;;
        build)
            # Keep: errors, warnings (first 5), final status
            # Strip: individual file compilation lines (unless they contain error)
            echo "$input" | grep -E \
                'error|Error|ERROR|warning|Warning|WARN|Built|Success|Failed|Output|Bundle|chunk|entry' \
                | grep -vE '^\s*(Compiling|Building|Bundling)\s' \
                | head -n 30 \
                || true
            # Also keep compilation lines that mention errors
            echo "$input" | grep -E '^\s*(Compiling|Building|Bundling)\s' | grep -iE 'error' || true
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

# --- Signal preservation quality check (tokdiet shadow-eval pattern) ---
# Extracts critical signals from raw middle, checks how many survive compression.
# Proves quality preservation, doesn't just assert compression ratio.
signal_preservation_check() {
    local raw_middle="$1"
    local compressed_full="$2"
    local type="$3"

    local total=0
    local preserved=0

    # Critical signal categories:
    # 1. Error lines (most important — must never be lost)
    local error_lines
    error_lines=$(echo "$raw_middle" | grep -iE 'error|ERROR|Error|fatal|FATAL|exception|traceback|panicked' | head -n 20)
    if [[ -n "$error_lines" ]]; then
        while IFS= read -r line; do
            total=$((total + 1))
            # Check if key fragment (first 60 chars) appears in compressed output
            if echo "$compressed_full" | grep -qF "$(echo "$line" | head -c 60)"; then
                preserved=$((preserved + 1))
            fi
        done <<< "$error_lines"
    fi

    # 2. Warning lines (important but lower priority)
    local warn_lines
    warn_lines=$(echo "$raw_middle" | grep -iE '^.*\b(warn|WARN|warning|WARNING)\b' | head -n 10)
    if [[ -n "$warn_lines" ]]; then
        while IFS= read -r line; do
            total=$((total + 1))
            if echo "$compressed_full" | grep -qF "$(echo "$line" | head -c 60)"; then
                preserved=$((preserved + 1))
            fi
        done <<< "$warn_lines"
    fi

    # 3. Test failure names (for test type)
    if [[ "$type" == "test" ]]; then
        local fail_names
        fail_names=$(echo "$raw_middle" | grep -iE 'FAIL|✗|✘|×' | grep -oE '[a-zA-Z0-9_./-]+\.(test|spec)\.[a-z]+' | sort -u | head -n 10)
        if [[ -n "$fail_names" ]]; then
            while IFS= read -r name; do
                total=$((total + 1))
                if echo "$compressed_full" | grep -qF "$name"; then
                    preserved=$((preserved + 1))
                fi
            done <<< "$fail_names"
        fi
    fi

    # 4. Numeric summaries (aggregate counts only, not per-file test counts)
    local summary_nums
    summary_nums=$(echo "$raw_middle" | grep -oE '[0-9]+ (passed|failed|errors?|warnings?|skipped|pending)' | sort -u | head -n 5)
    if [[ -n "$summary_nums" ]]; then
        while IFS= read -r num; do
            total=$((total + 1))
            if echo "$compressed_full" | grep -qF "$num"; then
                preserved=$((preserved + 1))
            fi
        done <<< "$summary_nums"
    fi

    # Return: total signals, preserved count
    if [[ "$total" -eq 0 ]]; then
        echo "100.0 0 0"  # No signals to lose = perfect preservation
    else
        local pct
        pct=$(awk "BEGIN {printf \"%.1f\", ($preserved/$total) * 100}")
        echo "$pct $preserved $total"
    fi
}

# --- Compression metrics logging (MineEcho pattern + shadow-eval) ---
# Logs raw/compressed sizes AND signal preservation quality per invocation.
COMPRESS_LOG="${COMPRESS_METRICS_LOG:-$HOME/.openclaw/workspace/tools/compress-metrics.jsonl}"
if [[ "${COMPRESS_METRICS:-1}" == "1" ]]; then
    RAW_CHARS=$(wc -c < "$TMPFILE")
    # Compute compressed output size (head + marker + middle + tail)
    COMPRESSED_OUTPUT=""
    COMPRESSED_OUTPUT+="$HEAD"
    if [[ -n "$COMPRESSED_MIDDLE" ]]; then
        COMPRESSED_OUTPUT+=$'\n'"$COMPRESSED_MIDDLE"
    fi
    COMPRESSED_OUTPUT+=$'\n'"$COMPRESSED_TAIL"
    COMPRESSED_CHARS=${#COMPRESSED_OUTPUT}
    if [[ "$RAW_CHARS" -gt 0 ]]; then
        RATIO=$(awk "BEGIN {printf \"%.1f\", (1 - $COMPRESSED_CHARS/$RAW_CHARS) * 100}")
    else
        RATIO="0.0"
    fi

    # Shadow-eval: measure signal preservation quality
    QUALITY_RESULT=$(signal_preservation_check "$MIDDLE" "$COMPRESSED_OUTPUT" "$TYPE")
    SIGNAL_PCT=$(echo "$QUALITY_RESULT" | cut -d' ' -f1)
    SIGNAL_PRESERVED=$(echo "$QUALITY_RESULT" | cut -d' ' -f2)
    SIGNAL_TOTAL=$(echo "$QUALITY_RESULT" | cut -d' ' -f3)

    # Append JSONL with quality metrics (best-effort, never fail the script)
    printf '{"ts":"%s","type":"%s","raw_bytes":%d,"compressed_bytes":%d,"ratio_pct":%s,"lines_stripped":%d,"signal_preserved_pct":%s,"signals":%d,"signals_kept":%d}\n' \
        "$(date -u +%Y-%m-%dT%H:%M:%SZ)" "$TYPE" "$RAW_CHARS" "$COMPRESSED_CHARS" "$RATIO" "$STRIPPED" \
        "$SIGNAL_PCT" "$SIGNAL_TOTAL" "$SIGNAL_PRESERVED" \
        >> "$COMPRESS_LOG" 2>/dev/null || true

    # Emit warning to stderr if signal preservation drops below 80%
    if [[ -n "$SIGNAL_PCT" ]] && awk "BEGIN {exit !($SIGNAL_PCT < 80.0 && $SIGNAL_TOTAL > 0)}" 2>/dev/null; then
        echo "⚠️  compress-output: signal preservation ${SIGNAL_PCT}% ($SIGNAL_PRESERVED/$SIGNAL_TOTAL) — quality may be degraded" >&2
    fi
fi
