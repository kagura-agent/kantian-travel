#!/usr/bin/env bash
# compress-daily-memory.sh — Compress repetitive no-action patrol sections and dreaming noise in daily memory files
#
# Problem: Daily memory files bloat to 2000+ lines; ~40% are repetitive
# "no action needed" patrol sections (虾信巡检 ×6, GitHub Patrol ×8, Night Workloop ×5)
# + dreaming Light Sleep/REM Sleep sections (~500 lines of 0-promote noise).
#
# Solution: Merge consecutive no-action sections of the same category into one-line summaries.
# Compress dreaming sections (Light Sleep + REM Sleep) into one-line summaries.
# Sections with actual events/actions are preserved verbatim.
#
# Usage:
#   bash tools/compress-daily-memory.sh [YYYY-MM-DD]     # dry-run (default: yesterday)
#   bash tools/compress-daily-memory.sh --apply [DATE]    # apply in-place (creates .bak)
#   bash tools/compress-daily-memory.sh --stats [DATE]    # stats only

set -euo pipefail

MEMORY_DIR="$HOME/.openclaw/workspace/memory"
MODE="dry-run"
DATE=""

while [[ $# -gt 0 ]]; do
  case "$1" in
    --apply) MODE="apply"; shift ;;
    --stats) MODE="stats"; shift ;;
    --help|-h)
      echo "Usage: compress-daily-memory.sh [--apply|--stats] [YYYY-MM-DD]"
      exit 0
      ;;
    *) DATE="$1"; shift ;;
  esac
done

[[ -z "$DATE" ]] && DATE=$(date -d yesterday +%Y-%m-%d 2>/dev/null || date -v-1d +%Y-%m-%d)
FILE="$MEMORY_DIR/$DATE.md"

if [[ ! -f "$FILE" ]]; then
  echo "❌ File not found: $FILE"
  exit 1
fi

BEFORE_LINES=$(wc -l < "$FILE")
BEFORE_SIZE=$(stat -c%s "$FILE" 2>/dev/null || stat -f%z "$FILE")

TMPOUT=$(mktemp)
TMPSTATS=$(mktemp)
trap 'rm -f "$TMPOUT" "$TMPSTATS"' EXIT

# Single awk pass: classify sections, detect no-action, output compressed version + stats
awk '
BEGIN {
  # No-action indicators
  split("无待办|无需行动|无需操作|no action needed|nothing new|一切正常|无变化|all clear|全清|全部清净|全部清洁|无新|no code change|ball on|no action tonight|无需调整|all ball on", noact_pats, "|")
}

function classify(header) {
  h = tolower(header)
  if (h ~ /虾信巡检|lobster.*patrol|shrimp/) return "lobster-patrol"
  if (h ~ /github.*patrol|github.*巡检|gh.*patrol/) return "github-patrol"
  if (h ~ /workloop.*night|night.*workloop|workloop-night|打工.*night|夜间.*跟进|晚间.*跟进|night.*follow|打工夜间/) return "night-workloop"
  if (h ~ /channel.*patrol|channel.*activity|channel.*scan/) return "channel-patrol"
  if (h ~ /nightly.*backup|backup.*night/) return "nightly-backup"
  if (h ~ /light sleep/) return "light-sleep"
  if (h ~ /rem sleep/) return "rem-sleep"
  return "other"
}

function check_noaction(body) {
  b = tolower(body)
  for (i in noact_pats) {
    if (index(b, noact_pats[i]) > 0) return 1
  }
  return 0
}

function extract_time(header) {
  if (match(header, /[0-9][0-9]?:[0-9][0-9]/)) {
    return substr(header, RSTART, RLENGTH)
  }
  return ""
}

function count_dreaming_candidates(body) {
  n = split(body, lines, "\n")
  count = 0
  for (i = 1; i <= n; i++) {
    if (lines[i] ~ /^- Candidate:/) count++
  }
  return count
}

function extract_dreaming_confidence(body) {
  if (match(body, /confidence: [0-9.]+/)) {
    s = substr(body, RSTART + 13, RLENGTH - 13)
    return s
  }
  return "?"
}

function count_dreaming_promotes(body) {
  n = split(body, lines, "\n")
  count = 0
  for (i = 1; i <= n; i++) {
    if (lines[i] ~ /status: promoted/) count++
  }
  return count
}

function extract_rem_themes(body) {
  n = split(body, lines, "\n")
  themes = ""
  for (i = 1; i <= n; i++) {
    if (lines[i] ~ /Theme:/) {
      if (match(lines[i], /`[^`]+`/)) {
        t = substr(lines[i], RSTART + 1, RLENGTH - 2)
        if (themes != "") themes = themes ", "
        themes = themes t
      }
    }
  }
  if (themes == "") themes = "none"
  return themes
}

function flush_section() {
  if (sec_header == "") return
  cat = classify(sec_header)
  is_noact = 0
  if (cat == "light-sleep" || cat == "rem-sleep") {
    # Dreaming sections are always compressible
    is_noact = 1
  } else if (cat != "other") {
    is_noact = check_noaction(sec_body)
  }
  
  # Track stats
  total[cat]++
  if (is_noact) {
    noact[cat]++
    t = extract_time(sec_header)
    if (!(cat in first_time)) first_time[cat] = t
    last_time[cat] = t
  }
  
  # Track dreaming-specific stats
  if (cat == "light-sleep") {
    light_candidates += count_dreaming_candidates(sec_body)
    light_confidence = extract_dreaming_confidence(sec_body)
    light_promotes += count_dreaming_promotes(sec_body)
    light_lines += split(sec_body, _tmp, "\n")
  }
  if (cat == "rem-sleep") {
    rem_themes = extract_rem_themes(sec_body)
    rem_lines += split(sec_body, _tmp, "\n")
  }
  
  # Store section data
  sec_idx++
  headers[sec_idx] = sec_header
  bodies[sec_idx] = sec_body
  cats[sec_idx] = cat
  is_noacts[sec_idx] = is_noact
}

/^## / {
  flush_section()
  sec_header = $0
  sec_body = ""
  next
}

{
  if (sec_header == "") {
    # Preamble before first section
    preamble = preamble $0 "\n"
  } else {
    sec_body = sec_body $0 "\n"
  }
}

END {
  flush_section()
  
  # Output stats to stderr
  for (cat in total) {
    na = (cat in noact) ? noact[cat] : 0
    ft = (cat in first_time) ? first_time[cat] : ""
    lt = (cat in last_time) ? last_time[cat] : ""
    printf "STAT|%s|%d|%d|%s|%s\n", cat, total[cat], na, ft, lt > "/dev/stderr"
  }
  
  # Output compressed content to stdout
  if (preamble != "") printf "%s", preamble
  
  for (i = 1; i <= sec_idx; i++) {
    cat = cats[i]
    na = is_noacts[i]
    
    if (cat != "other" && na) {
      na_total = noact[cat]
      # Dreaming sections: always compress (single section but 500+ lines of noise)
      if (cat == "light-sleep") {
        if (!(cat in summarized)) {
          summarized[cat] = 1
          printf "## Light Sleep \u2014 %d candidates @ %s confidence, %d promotes\n\n", light_candidates, light_confidence, light_promotes
        }
      } else if (cat == "rem-sleep") {
        if (!(cat in summarized)) {
          summarized[cat] = 1
          printf "## REM Sleep \u2014 themes: %s\n\n", rem_themes
        }
      } else if (na_total <= 1) {
        # Only one no-action — keep
        printf "%s\n%s", headers[i], bodies[i]
      } else if (!(cat in summarized)) {
        # First occurrence — write summary
        summarized[cat] = 1
        ft = first_time[cat]
        lt = last_time[cat]
        
        if (cat == "lobster-patrol")
          printf "## 🦞 虾信巡检 ×%d (%s–%s) — 全清，无待办\n\n", na_total, ft, lt
        else if (cat == "github-patrol")
          printf "## GitHub Patrol ×%d (%s–%s) — 无新通知/行动\n\n", na_total, ft, lt
        else if (cat == "night-workloop")
          printf "## 🌙 Night Workloop ×%d (%s–%s) — 全部球在对方，无代码修改\n\n", na_total, ft, lt
        else if (cat == "channel-patrol")
          printf "## Channel Patrol ×%d (%s–%s) — 无需回应\n\n", na_total, ft, lt
        else if (cat == "nightly-backup")
          printf "## Nightly Backup ×%d (%s–%s) — 正常\n\n", na_total, ft, lt
        else if (cat == "light-sleep")
          printf "## Light Sleep — %d candidates @ %s confidence, %d promotes\n\n", light_candidates, light_confidence, light_promotes
        else if (cat == "rem-sleep")
          printf "## REM Sleep — themes: %s\n\n", rem_themes
      }
      # else: skip (already summarized)
    } else {
      # Keep as-is
      printf "%s\n%s", headers[i], bodies[i]
    }
  }
}
' "$FILE" > "$TMPOUT" 2>"$TMPSTATS"

AFTER_LINES=$(wc -l < "$TMPOUT")
AFTER_SIZE=$(stat -c%s "$TMPOUT" 2>/dev/null || stat -f%z "$TMPOUT")

# Parse stats
compressed_sections=0
declare -A CAT_TOTAL=() CAT_NOACT=()

while IFS='|' read -r _ cat tot na ft lt; do
  CAT_TOTAL[$cat]=$tot
  CAT_NOACT[$cat]=$na
  [[ $na -gt 1 ]] && compressed_sections=$((compressed_sections + na - 1))
done < "$TMPSTATS"

echo "📊 Memory Compression — $DATE"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  Before: ${BEFORE_LINES} lines / $((BEFORE_SIZE / 1024))KB"
if [[ "$MODE" != "stats" ]]; then
  reduction=$((BEFORE_LINES > 0 ? 100 - AFTER_LINES * 100 / BEFORE_LINES : 0))
  echo "  After:  ${AFTER_LINES} lines / $((AFTER_SIZE / 1024))KB"
  echo "  Saved:  $((BEFORE_LINES - AFTER_LINES)) lines (${reduction}%)"
fi
echo "  Compressible: ${compressed_sections} redundant no-action sections"
echo ""

for cat in lobster-patrol github-patrol night-workloop channel-patrol nightly-backup light-sleep rem-sleep; do
  total=${CAT_TOTAL[$cat]:-0}
  noact=${CAT_NOACT[$cat]:-0}
  [[ $total -eq 0 ]] && continue
  action=$((total - noact))
  if [[ $cat == "light-sleep" || $cat == "rem-sleep" ]]; then
    # Dreaming sections: always compressed
    if [[ $noact -gt 0 ]]; then
      echo "  ✂️  $cat: compressed to 1-line summary"
    fi
  elif [[ $noact -gt 1 ]]; then
    echo "  ✂️  $cat: ${noact} no-action → 1 summary (kept $action with-action)"
  elif [[ $noact -eq 1 ]]; then
    echo "  📌 $cat: 1 no-action (kept as-is), $action with-action"
  else
    echo "  ✅ $cat: $total sections, all had actions (kept)"
  fi
done

if [[ "$MODE" == "apply" ]]; then
  echo ""
  cp "$FILE" "${FILE}.bak"
  cp "$TMPOUT" "$FILE"
  echo "  ✅ Applied! Backup: ${FILE}.bak"
elif [[ "$MODE" == "dry-run" ]]; then
  echo ""
  echo "  ℹ️  Dry-run. Use --apply to compress in-place."
fi
