#!/usr/bin/env bash
# dream-health.sh — Dreaming pipeline health diagnostic
# Usage: bash tools/dream-health.sh
# Exit: 0=healthy, 1=warnings, 2=broken
#
# v2 (2026-06-11): Migrated from JSON files to SQLite store.
# OpenClaw 2026.6+ stores dreaming state in plugin_state_entries table
# at ~/.openclaw/state/openclaw.sqlite. Old JSON files have .migrated suffix.

set -uo pipefail

DREAMS_DIR="${HOME}/.openclaw/workspace/memory/.dreams"
STATE_DB="${HOME}/.openclaw/state/openclaw.sqlite"
WORKSPACE_DIR="${HOME}/.openclaw/workspace"
EXIT_CODE=0
FLAGS=()

header() { printf "\n\033[1;36m═══ %s ═══\033[0m\n" "$1"; }
ok()     { printf "  \033[32m✓\033[0m %s\n" "$1"; }
warn()   { printf "  \033[33m⚠\033[0m %s\n" "$1"; }
err()    { printf "  \033[31m✗\033[0m %s\n" "$1"; }
info()   { printf "  %s\n" "$1"; }

flag_broken()  { FLAGS+=("🔴 $1"); [ "$EXIT_CODE" -lt 2 ] && EXIT_CODE=2; }
flag_warn()    { FLAGS+=("🟡 $1"); [ "$EXIT_CODE" -lt 1 ] && EXIT_CODE=1; }

# ── Check prerequisites ──
header "Prerequisites"

if ! command -v sqlite3 &>/dev/null; then
  err "sqlite3 not found — cannot query dreaming state"
  flag_broken "MISSING_SQLITE3"
  # Fall through to show what we can
fi

if [ -f "$STATE_DB" ]; then
  sz=$(du -h "$STATE_DB" | cut -f1)
  ok "State DB: $STATE_DB ($sz)"
else
  err "State DB not found: $STATE_DB"
  flag_broken "NO_STATE_DB"
fi

if [ -f "${DREAMS_DIR}/events.jsonl" ]; then
  sz=$(du -h "${DREAMS_DIR}/events.jsonl" | cut -f1)
  ok "events.jsonl ($sz)"
else
  warn "events.jsonl — MISSING"
fi

# Check for legacy files (informational)
legacy_count=0
for f in short-term-recall.json daily-ingestion.json session-ingestion.json phase-signals.json; do
  [ -f "${DREAMS_DIR}/${f}" ] && legacy_count=$((legacy_count + 1))
done
migrated_count=$(ls "${DREAMS_DIR}"/*.migrated 2>/dev/null | wc -l)
if [ "$migrated_count" -gt 0 ]; then
  info "Legacy files: $migrated_count migrated to SQLite ✓"
fi
if [ "$legacy_count" -gt 0 ]; then
  warn "Legacy JSON files still present: $legacy_count (expected: migrated)"
fi

# ── Candidate Stats (from SQLite) ──
header "Candidate Stats (short-term-recall)"

if [ -f "$STATE_DB" ] && command -v sqlite3 &>/dev/null; then
  CANDIDATE_STATS=$(sqlite3 "$STATE_DB" "
    SELECT
      COUNT(*) as total,
      COALESCE(MIN(CAST(json_extract(value_json, '\$.value.totalScore') AS REAL)), 0) as score_min,
      COALESCE(MAX(CAST(json_extract(value_json, '\$.value.totalScore') AS REAL)), 0) as score_max,
      COALESCE(AVG(CAST(json_extract(value_json, '\$.value.totalScore') AS REAL)), 0) as score_avg,
      COUNT(DISTINCT ROUND(CAST(json_extract(value_json, '\$.value.totalScore') AS REAL), 4)) as score_unique,
      SUM(CASE WHEN CAST(json_extract(value_json, '\$.value.recallCount') AS INTEGER) > 0 THEN 1 ELSE 0 END) as recalls_gt0,
      MAX(CAST(json_extract(value_json, '\$.value.recallCount') AS INTEGER)) as recall_max,
      SUM(CASE WHEN json_extract(value_json, '\$.value.groundedCount') IS NOT NULL AND CAST(json_extract(value_json, '\$.value.groundedCount') AS INTEGER) > 0 THEN 1 ELSE 0 END) as grounded_gt0,
      SUM(CASE WHEN json_extract(value_json, '\$.value.promotedAt') IS NOT NULL THEN 1 ELSE 0 END) as promoted,
      MIN(json_extract(value_json, '\$.value.firstRecalledAt')) as oldest_first,
      MAX(json_extract(value_json, '\$.value.lastRecalledAt')) as newest_last
    FROM plugin_state_entries
    WHERE namespace='short-term-recall'
      AND json_extract(value_json, '\$.workspaceDir') = '$WORKSPACE_DIR'
  " -separator '|' 2>/dev/null)

  IFS='|' read -r total score_min score_max score_avg score_unique recalls_gt0 recall_max grounded_gt0 promoted oldest_first newest_last <<< "$CANDIDATE_STATS"

  if [ "${total:-0}" = "0" ]; then
    err "No candidates found in SQLite store"
    flag_broken "NO_CANDIDATES"
  else
    info "Total candidates: $total"
    info "Score: min=$(printf '%.4f' "$score_min") max=$(printf '%.4f' "$score_max") avg=$(printf '%.4f' "$score_avg")"
    info "Unique score values: $score_unique"
    info "Recalls > 0: $recalls_gt0/$total (max: $recall_max)"
    info "Grounded > 0: $grounded_gt0/$total"
    info "Promoted: $promoted/$total"
    [ -n "$oldest_first" ] && [ "$oldest_first" != "" ] && info "Age range: $oldest_first → $newest_last"

    # Health flags
    if [ "$score_unique" -le 1 ] && [ "$total" -gt 10 ]; then
      flag_broken "UNIFORM_CONFIDENCE: all $total candidates have same totalScore"
    elif [ "$score_unique" -le 3 ] && [ "$total" -gt 50 ]; then
      flag_warn "LOW_SCORE_VARIANCE: only $score_unique unique scores across $total candidates"
    fi

    if [ "$recalls_gt0" = "0" ]; then
      flag_broken "ZERO_RECALLS: no candidates have been recalled"
    elif [ "$total" -gt 0 ]; then
      recall_pct=$((recalls_gt0 * 100 / total))
      if [ "$recall_pct" -lt 1 ] && [ "$recalls_gt0" -gt 0 ]; then
        flag_warn "LOW_RECALLS: only $recalls_gt0 of $total candidates recalled ($recall_pct%)"
      fi
    fi

    if [ "$promoted" = "0" ] && [ "$total" -gt 50 ]; then
      flag_warn "ZERO_PROMOTIONS: 0 candidates promoted despite $total candidates"
    fi

    if [ "$total" -lt 10 ]; then
      flag_warn "LOW_CANDIDATES: only $total candidates"
    fi
  fi

  # ── Promotion eligibility check ──
  header "Promotion Eligibility"
  
  # Deep dreaming defaults: minRecallCount=3, minUniqueQueries=3, minScore=0.8
  ELIGIBLE=$(sqlite3 "$STATE_DB" "
    SELECT COUNT(*) FROM plugin_state_entries
    WHERE namespace='short-term-recall'
      AND json_extract(value_json, '\$.workspaceDir') = '$WORKSPACE_DIR'
      AND (
        CAST(json_extract(value_json, '\$.value.recallCount') AS INTEGER) +
        CAST(json_extract(value_json, '\$.value.dailyCount') AS INTEGER) +
        COALESCE(CAST(json_extract(value_json, '\$.value.groundedCount') AS INTEGER), 0)
      ) >= 3
      AND json_array_length(json_extract(value_json, '\$.value.queryHashes')) >= 3
  " 2>/dev/null)

  NEAR_ELIGIBLE=$(sqlite3 "$STATE_DB" "
    SELECT COUNT(*) FROM plugin_state_entries
    WHERE namespace='short-term-recall'
      AND json_extract(value_json, '\$.workspaceDir') = '$WORKSPACE_DIR'
      AND (
        CAST(json_extract(value_json, '\$.value.recallCount') AS INTEGER) +
        CAST(json_extract(value_json, '\$.value.dailyCount') AS INTEGER) +
        COALESCE(CAST(json_extract(value_json, '\$.value.groundedCount') AS INTEGER), 0)
      ) >= 2
  " 2>/dev/null)

  info "Meet minRecallCount(3) + minUniqueQueries(3): $ELIGIBLE candidates"
  info "Near threshold (signal ≥ 2): $NEAR_ELIGIBLE candidates"

  if [ "${ELIGIBLE:-0}" = "0" ]; then
    flag_warn "NO_ELIGIBLE_CANDIDATES: 0 candidates meet deep promotion thresholds (need ≥3 signals + ≥3 unique queries)"
  fi
else
  err "Cannot query candidate stats (no sqlite3 or no state DB)"
fi

# ── Phase Signals (from SQLite) ──
header "Phase Signals"

if [ -f "$STATE_DB" ] && command -v sqlite3 &>/dev/null; then
  PHASE_STATS=$(sqlite3 "$STATE_DB" "
    SELECT
      COUNT(*) as total,
      SUM(CASE WHEN COALESCE(CAST(json_extract(value_json, '\$.value.lightHits') AS INTEGER), 0) > 0 THEN 1 ELSE 0 END) as light_gt0,
      SUM(CASE WHEN COALESCE(CAST(json_extract(value_json, '\$.value.remHits') AS INTEGER), 0) > 0 THEN 1 ELSE 0 END) as rem_gt0,
      MAX(COALESCE(CAST(json_extract(value_json, '\$.value.lightHits') AS INTEGER), 0)) as light_max,
      MAX(COALESCE(CAST(json_extract(value_json, '\$.value.remHits') AS INTEGER), 0)) as rem_max
    FROM plugin_state_entries
    WHERE namespace='short-term-phase-signals'
      AND json_extract(value_json, '\$.workspaceDir') = '$WORKSPACE_DIR'
  " -separator '|' 2>/dev/null)

  IFS='|' read -r ph_total ph_light_gt0 ph_rem_gt0 ph_light_max ph_rem_max <<< "$PHASE_STATS"

  if [ "${ph_total:-0}" -gt 0 ]; then
    info "Phase entries: $ph_total"
    info "Light hits > 0: $ph_light_gt0, REM hits > 0: $ph_rem_gt0"
    info "Max light: $ph_light_max, Max REM: $ph_rem_max"
  else
    info "No phase signal entries"
  fi
else
  warn "Cannot query phase signals"
fi

# ── Pipeline Activity ──
header "Pipeline Activity"

if [ -f "${DREAMS_DIR}/events.jsonl" ]; then
  EVENT_STATS=$(python3 << 'PYEOF'
import json, os
from datetime import datetime, timezone

events_file = os.path.expanduser("~/.openclaw/workspace/memory/.dreams/events.jsonl")
total = 0
last_event = None
type_counts = {}
last_dream = None

with open(events_file) as f:
    for line in f:
        line = line.strip()
        if not line:
            continue
        try:
            evt = json.loads(line)
            total += 1
            t = evt.get("type", "unknown")
            type_counts[t] = type_counts.get(t, 0) + 1
            last_event = evt
            if "dream" in t:
                last_dream = evt
        except:
            pass

print(f"total_events={total}")
if last_event:
    print(f"last_type={last_event.get('type', 'unknown')}")
    print(f"last_time={last_event.get('timestamp', 'unknown')}")

if last_dream:
    print(f"last_dream_type={last_dream.get('type', 'unknown')}")
    print(f"last_dream_time={last_dream.get('timestamp', 'unknown')}")

if last_event and "timestamp" in last_event:
    try:
        ts = last_event["timestamp"]
        last_dt = datetime.fromisoformat(ts.replace("Z", "+00:00"))
        now = datetime.now(timezone.utc)
        delta = (now - last_dt).total_seconds() / 86400
        print(f"days_since={delta:.1f}")
    except:
        pass

for t, c in sorted(type_counts.items(), key=lambda x: -x[1])[:8]:
    print(f"EVTYPE_{t}={c}")
PYEOF
  )

  declare -A E
  while IFS='=' read -r key val; do
    [[ "$key" =~ ^[a-zA-Z_0-9]+$ ]] && E["$key"]="$val" || true
  done <<< "$EVENT_STATS"

  EVTYPES=()
  while IFS='=' read -r key val; do
    if [[ "$key" == EVTYPE_* ]]; then
      tname="${key#EVTYPE_}"
      EVTYPES+=("    ${tname}: ${val}")
    fi
  done <<< "$EVENT_STATS"

  info "Total events: ${E[total_events]:-0}"
  info "Last event: ${E[last_type]:-?} @ ${E[last_time]:-?}"
  [ -n "${E[last_dream_type]:-}" ] && info "Last dream: ${E[last_dream_type]} @ ${E[last_dream_time]:-?}"
  info "Days since last activity: ${E[days_since]:-?}"

  if [ ${#EVTYPES[@]} -gt 0 ]; then
    info "Event types:"
    for line in "${EVTYPES[@]}"; do
      printf "  %s\n" "$line"
    done
  fi

  # Stale check
  if [ -n "${E[days_since]:-}" ]; then
    days_int=${E[days_since]%.*}
    if [ "$days_int" -ge 3 ]; then
      flag_warn "STALE_PIPELINE: no dreaming activity for ${E[days_since]} days"
    fi
  fi
else
  warn "events.jsonl missing"
fi

# ── Dreaming output files ──
header "Dreaming Output"

for phase in light deep rem; do
  dir="${HOME}/.openclaw/workspace/memory/dreaming/${phase}"
  if [ -d "$dir" ]; then
    count=$(ls "$dir"/*.md 2>/dev/null | wc -l)
    if [ "$count" -gt 0 ]; then
      latest=$(ls -t "$dir"/*.md 2>/dev/null | head -1)
      latest_name=$(basename "$latest")
      ok "$phase: $count reports (latest: $latest_name)"
    else
      info "$phase: no reports"
    fi
  else
    info "$phase: directory missing"
  fi
done

# ── Health Summary ──
header "Health Summary"

if [ ${#FLAGS[@]} -eq 0 ]; then
  FLAGS+=("🟢 HEALTHY")
fi

for flag in "${FLAGS[@]}"; do
  case "$flag" in
    🔴*) err "$flag" ;;
    🟡*) warn "$flag" ;;
    🟢*) ok "$flag" ;;
  esac
done

# One-line verdict
echo ""
if [ $EXIT_CODE -eq 2 ]; then
  broken=""
  for flag in "${FLAGS[@]}"; do
    [[ "$flag" == 🔴* ]] && broken="${broken}${flag#🔴 }; "
  done
  printf "\033[1;31m━━━ VERDICT: 🔴 BROKEN — %s\033[0m\n" "${broken%; }"
elif [ $EXIT_CODE -eq 1 ]; then
  warnings=""
  for flag in "${FLAGS[@]}"; do
    [[ "$flag" == 🟡* ]] && warnings="${warnings}${flag#🟡 }; "
  done
  printf "\033[1;33m━━━ VERDICT: 🟡 DEGRADED — %s\033[0m\n" "${warnings%; }"
else
  printf "\033[1;32m━━━ VERDICT: 🟢 HEALTHY — dreaming pipeline operational\033[0m\n"
fi
echo ""

exit $EXIT_CODE
