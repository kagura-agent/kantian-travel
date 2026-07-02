#!/usr/bin/env bash
# hn-scan.sh — Scan Hacker News for AI/agent stories via Algolia API
#
# Replaces unreliable web_search/web_fetch HN scanning with a direct,
# structured API call. Created after 3 gradient occurrences in 10 days
# (hn-algolia-direct 06-05, use-hn-algolia-api 06-11, hn-algolia-preferred 06-14).
#
# Usage:
#   bash tools/hn-scan.sh                    # Default: "ai agent" stories, last 7 days
#   bash tools/hn-scan.sh --query "mcp tool" # Custom query
#   bash tools/hn-scan.sh --days 3           # Last 3 days
#   bash tools/hn-scan.sh --limit 20         # More results
#   bash tools/hn-scan.sh --min-points 50    # Only popular stories

set -uo pipefail

QUERY="ai agent"
DAYS=7
LIMIT=15
MIN_POINTS=5

while [[ $# -gt 0 ]]; do
  case "$1" in
    --query|-q) QUERY="$2"; shift 2 ;;
    --days|-d) DAYS="$2"; shift 2 ;;
    --limit|-l) LIMIT="$2"; shift 2 ;;
    --min-points|-p) MIN_POINTS="$2"; shift 2 ;;
    --help|-h)
      echo "Usage: bash tools/hn-scan.sh [--query Q] [--days N] [--limit N] [--min-points N]"
      echo "  --query Q       Search query (default: 'ai agent')"
      echo "  --days N        Look back N days (default: 7)"
      echo "  --limit N       Max results (default: 15)"
      echo "  --min-points N  Min points filter (default: 5)"
      exit 0
      ;;
    *) echo "Unknown arg: $1"; exit 1 ;;
  esac
done

# Calculate timestamp for N days ago
if date --version >/dev/null 2>&1; then
  # GNU date
  SINCE_TS=$(date -d "${DAYS} days ago" +%s)
else
  # macOS date
  SINCE_TS=$(date -v-${DAYS}d +%s)
fi

# URL-encode the query
ENCODED_QUERY=$(printf '%s' "$QUERY" | sed 's/ /+/g; s/[^a-zA-Z0-9+._~-]/%&/g' | sed 's/%\(.\)/\%\1/g')
# Simple encoding: just replace spaces with + for Algolia
ENCODED_QUERY=$(printf '%s' "$QUERY" | sed 's/ /+/g')

# Note: Algolia HN API dropped 'points' from numericAttributesForFiltering (discovered 2026-06-26).
# Filter by points client-side with jq instead.
API_URL="https://hn.algolia.com/api/v1/search?query=${ENCODED_QUERY}&tags=story&numericFilters=created_at_i%3E${SINCE_TS}&hitsPerPage=${LIMIT}"

echo "📰 HN Scan — \"${QUERY}\" | last ${DAYS}d | min ${MIN_POINTS}pts | limit ${LIMIT}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Fetch and parse with jq
RESPONSE=$(curl -sS --max-time 15 "$API_URL" 2>/dev/null)

if [[ -z "$RESPONSE" ]]; then
  echo "❌ Failed to fetch HN Algolia API (timeout or network error)"
  exit 1
fi

# Detect API errors (e.g. removed numericFilters attributes)
API_ERROR=$(echo "$RESPONSE" | jq -r '.message // empty' 2>/dev/null)
if [[ -n "$API_ERROR" ]]; then
  echo "❌ Algolia API error: $API_ERROR"
  echo "   (API may have changed settings — check numericFilters support)"
  exit 1
fi

# Check if jq is available
if ! command -v jq &>/dev/null; then
  echo "❌ jq not installed — raw output:"
  echo "$RESPONSE" | head -100
  exit 1
fi

# Parse and format results — client-side points filter
FILTERED=$(echo "$RESPONSE" | jq --argjson min "$MIN_POINTS" '[.hits[] | select((.points // 0) >= $min)]')
TOTAL=$(echo "$RESPONSE" | jq -r '.nbHits // 0')
HITS=$(echo "$FILTERED" | jq 'length')

if [[ "$HITS" -eq 0 ]]; then
  echo "No stories found matching criteria (${TOTAL} raw, 0 above ${MIN_POINTS}pts)."
  exit 0
fi

echo "Found ${HITS} matches (≥${MIN_POINTS}pts) from ${TOTAL} raw:"
echo ""

# Format each result — include story URL (saves a web_fetch step during scout)
echo "$FILTERED" | jq -r '.[] | "  \(.points // 0)pts | \(.num_comments // 0)💬 | \(.title)\n    HN: https://news.ycombinator.com/item?id=\(.objectID)\( if .url and .url != "" then "\n    URL: \(.url)" else "" end)"' | while IFS= read -r line; do
  echo "$line"
done

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🔗 Full results: https://hn.algolia.com/?q=$(printf '%s' "$QUERY" | sed 's/ /+/g')&dateRange=custom&sort=byPopularity"
