#!/usr/bin/env bash
# spam-filter.sh — Filter star-farmed/spam GitHub repos from search results
#
# Accepts GitHub API JSON (array of repo objects or search response) on stdin,
# outputs filtered results with spam annotations.
#
# Heuristics (from battle-tested observations 07-02, 07-03):
#   1. Star-farm: ⭐>80 + forks<3 + watchers<3 + created<14d → SPAM
#   2. Star-cluster: 3+ repos with stars within ±5 range → SUSPICIOUS
#   3. SEO keyword: year number in name/description + generic AI terms → FLAG
#   4. Crypto scam: Solana/pump.fun/token address in description → SPAM
#   5. Empty repo: 0 commits or size=0 with high stars → SPAM
#
# Usage:
#   cat github-results.json | bash tools/spam-filter.sh
#   bash tools/spam-filter.sh < github-results.json
#   bash tools/spam-filter.sh --json < results.json    # JSON output
#   bash tools/spam-filter.sh --stats-only < results.json  # Just counts
#
# Input format:
#   - GitHub search API response: {"items": [...]}
#   - Or plain array of repo objects: [...]
#   - Each repo needs: stargazers_count, forks_count, watchers_count,
#     created_at, full_name, description
#
# Exit codes:
#   0 = some repos passed filter
#   1 = ALL repos filtered as spam
#   2 = input error

set -uo pipefail

MODE="human"  # human | json | stats
while [[ $# -gt 0 ]]; do
  case "$1" in
    --json|-j) MODE="json"; shift ;;
    --stats-only|-s) MODE="stats"; shift ;;
    --help|-h)
      echo "Usage: <github-api-json> | bash tools/spam-filter.sh [--json|--stats-only]"
      exit 0
      ;;
    *) echo "Unknown arg: $1"; exit 2 ;;
  esac
done

INPUT=$(cat)

if [[ -z "$INPUT" ]]; then
  echo "❌ No input on stdin" >&2
  exit 2
fi

if ! command -v jq &>/dev/null; then
  echo "❌ jq required" >&2
  exit 2
fi

# Normalize input: extract .items if search response, or use as-is if array
REPOS=$(echo "$INPUT" | jq '
  if type == "object" and has("items") then .items
  elif type == "array" then .
  else [.]
  end
' 2>/dev/null)

if [[ -z "$REPOS" || "$REPOS" == "null" ]]; then
  echo "❌ Could not parse input as GitHub repo data" >&2
  exit 2
fi

TOTAL=$(echo "$REPOS" | jq 'length')

if [[ "$TOTAL" -eq 0 ]]; then
  echo "No repos to filter."
  exit 0
fi

NOW_TS=$(date +%s)

# Main filtering logic in jq
RESULT=$(echo "$REPOS" | jq --argjson now "$NOW_TS" '
  # Helper: days since creation
  def age_days:
    (. | sub("T.*"; "") | strptime("%Y-%m-%d") | mktime) as $created
    | (($now - $created) / 86400 | floor);

  # Collect star counts for cluster detection
  [.[] | .stargazers_count // 0] as $all_stars |

  # Count repos in ±5 star range for each count
  ($all_stars | group_by(. / 5 | floor) |
    map(select(length >= 3)) |
    [.[][] ] | unique) as $cluster_stars |

  [.[] | . as $repo |
    # Extract fields with safe defaults
    (.stargazers_count // 0) as $stars |
    (.forks_count // .forks // 0) as $forks |
    (.watchers_count // .watchers // 0) as $watchers |
    (.created_at // "2020-01-01T00:00:00Z") as $created |
    (.full_name // .name // "unknown") as $name |
    (.description // "") as $desc |
    (.size // -1) as $size |
    ($created | age_days) as $age |

    # Heuristic checks
    [] |

    # 1. Star-farm: high stars, no forks/watchers, very new
    (if $stars > 80 and $forks < 3 and $watchers < 3 and $age < 14
     then . + ["STAR-FARM: \($stars)⭐ but \($forks) forks, \($watchers) watchers, \($age)d old"]
     else . end) |

    # 2. Star cluster detection
    (if ($cluster_stars | index($stars)) != null
     then . + ["STAR-CLUSTER: \($stars)⭐ matches \($cluster_stars | length) repos in ±5 range"]
     else . end) |

    # 3. SEO keyword stuffing (year + generic terms)
    (if ($name + " " + $desc) | test("202[4-9].*(?:best|top|ultimate|awesome|list|framework)|(?:best|top|ultimate).*202[4-9]"; "ix")
     then . + ["SEO-STUFF: year+generic keywords in name/description"]
     else . end) |

    # 4. Crypto/scam markers
    (if $desc | test("solana|pump\\.fun|token.*address|airdrop|0x[0-9a-f]{20,}|mint.*nft"; "ix")
     then . + ["CRYPTO-SCAM: suspicious keywords in description"]
     else . end) |

    # 5. Empty repo with high stars
    (if $size == 0 and $stars > 50
     then . + ["EMPTY-REPO: size=0 with \($stars)⭐"]
     else . end) |

    # 6. No-license no-community (supplementary signal, not standalone spam)
    # Only flag if stars > 100 and absolutely zero community signals
    (if $stars > 100 and $forks == 0 and $watchers == 0
     then . + ["NO-COMMUNITY: \($stars)⭐ with 0 forks, 0 watchers"]
     else . end) |

    # Verdict
    . as $flags |
    {
      repo: $name,
      stars: $stars,
      forks: $forks,
      watchers: $watchers,
      age_days: $age,
      description: ($desc | if length > 100 then .[:100] + "..." else . end),
      flags: $flags,
      verdict: (if ($flags | length) >= 2 then "SPAM"
                elif ($flags | length) == 1 then "SUSPICIOUS"
                else "CLEAN" end),
      flag_count: ($flags | length)
    }
  ] |

  # Sort: clean first, then suspicious, then spam
  sort_by(if .verdict == "CLEAN" then 0 elif .verdict == "SUSPICIOUS" then 1 else 2 end)
')

# Output based on mode
CLEAN=$(echo "$RESULT" | jq '[.[] | select(.verdict == "CLEAN")] | length')
SUSPICIOUS=$(echo "$RESULT" | jq '[.[] | select(.verdict == "SUSPICIOUS")] | length')
SPAM=$(echo "$RESULT" | jq '[.[] | select(.verdict == "SPAM")] | length')

case "$MODE" in
  json)
    echo "$RESULT"
    ;;
  stats)
    echo "📊 Spam Filter: ${TOTAL} repos → ${CLEAN} clean, ${SUSPICIOUS} suspicious, ${SPAM} spam"
    ;;
  human)
    echo "🛡️ Spam Filter Results"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "  Total: ${TOTAL} | ✅ Clean: ${CLEAN} | ⚠️ Suspicious: ${SUSPICIOUS} | 🚫 Spam: ${SPAM}"
    echo ""

    # Show clean repos
    if [[ "$CLEAN" -gt 0 ]]; then
      echo "✅ CLEAN:"
      echo "$RESULT" | jq -r '.[] | select(.verdict == "CLEAN") |
        "  \(.stars)⭐ \(.repo) (\(.age_days)d, \(.forks)🍴) — \(.description)"'
      echo ""
    fi

    # Show suspicious
    if [[ "$SUSPICIOUS" -gt 0 ]]; then
      echo "⚠️ SUSPICIOUS:"
      echo "$RESULT" | jq -r '.[] | select(.verdict == "SUSPICIOUS") |
        "  \(.stars)⭐ \(.repo) — \(.flags[0])"'
      echo ""
    fi

    # Show spam
    if [[ "$SPAM" -gt 0 ]]; then
      echo "🚫 SPAM (filtered out):"
      echo "$RESULT" | jq -r '.[] | select(.verdict == "SPAM") |
        "  \(.stars)⭐ \(.repo) — \(.flags | join("; "))"'
      echo ""
    fi
    ;;
esac

# Exit code: 1 if ALL repos are spam
if [[ "$CLEAN" -eq 0 && "$SUSPICIOUS" -eq 0 ]]; then
  exit 1
fi
exit 0
