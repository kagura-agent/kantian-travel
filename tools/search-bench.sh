#!/usr/bin/env bash
# search-bench.sh — Mini benchmark for wiki search.sh quality
# Tests precision@5 across query types: exact match, conceptual, cross-domain
# Usage: bash tools/search-bench.sh [--verbose]

set -uo pipefail
SEARCH="$HOME/.openclaw/workspace/wiki/search.sh"
VERBOSE="${1:-}"

# Test cases: query | expected_top_results (comma-separated substrings that should appear in top 5)
# Format: "query|expected1,expected2,expected3"
declare -a TESTS=(
  # Exact project lookup
  "poco-claw identity architecture|poco-claw"
  "hermes memory skills scoring|hermes"
  "TACO context compression regex|taco-context-compression"
  "mnem versioned knowledge graph|mnem"
  # Conceptual queries
  "how do agents evolve and improve themselves|self-evolving,evolver,hermes-self-evolution"
  "privacy protection for agent memory|memprivacy"
  "concurrent file access multiple agents|concurrent-agent,worktree-convergence"
  "skill marketplace distribution ecosystem|skill-ecosystem,agentskills-io,clawhub"
  # Cross-domain (should find related cards + projects)
  "exponential decay temporal relevance retrieval|krusch-context,progressive-retrieval"
  "context window budget allocation strategy|context-budget,context-budget-constraint"
)

TOTAL=0
HITS=0
QUERIES=${#TESTS[@]}
QUERY_PASS=0

echo "═══════════════════════════════════════════"
echo "  Wiki Search Benchmark (${QUERIES} queries)"
echo "  Corpus: $(ls "$HOME/.openclaw/workspace/wiki/projects/"*.md 2>/dev/null | wc -l) projects + $(ls "$HOME/.openclaw/workspace/wiki/cards/"*.md 2>/dev/null | wc -l) cards"
echo "═══════════════════════════════════════════"
echo ""

for test in "${TESTS[@]}"; do
  IFS='|' read -r query expected <<< "$test"
  IFS=',' read -ra expected_items <<< "$expected"

  # Run search, capture output
  results=$(bash "$SEARCH" "$query" --limit 5 2>/dev/null || true)

  # Count how many expected items appear in results
  found=0
  missing=()
  for item in "${expected_items[@]}"; do
    if echo "$results" | grep -qi "$item"; then
      ((found++))
    else
      missing+=("$item")
    fi
  done

  TOTAL=$((TOTAL + ${#expected_items[@]}))
  HITS=$((HITS + found))

  if [ "$found" -eq "${#expected_items[@]}" ]; then
    status="✅"
    ((QUERY_PASS++))
  elif [ "$found" -gt 0 ]; then
    status="🟡"
  else
    status="❌"
  fi

  echo "$status [$found/${#expected_items[@]}] \"$query\""
  if [ ${#missing[@]} -gt 0 ]; then
    echo "   Missing: ${missing[*]}"
  fi

  if [ "$VERBOSE" = "--verbose" ]; then
    echo "   --- Results ---"
    echo "$results" | grep -E "^  [🔮🔍]" | head -5
    echo "   ---"
  fi
done

echo ""
echo "═══════════════════════════════════════════"
echo "  Results:"
echo "  Queries: $QUERY_PASS/$QUERIES perfect ($(( QUERY_PASS * 100 / QUERIES ))%)"
echo "  Items:   $HITS/$TOTAL found ($(( HITS * 100 / TOTAL ))%)"
echo "═══════════════════════════════════════════"
