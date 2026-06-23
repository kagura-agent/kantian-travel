#!/usr/bin/env bash
# Circuit Breaker for Subagent/Workflow Failures
# Prevents cascading failures by halting retries after N consecutive failures.
#
# Inspired by sofagent's circuit breaker pattern (KongFangXun/sofagent).
# States: CLOSED (healthy) → OPEN (tripped) → HALF_OPEN (probe)
#
# Usage:
#   circuit-breaker.sh check <key>           # Exit 0=CLOSED/HALF_OPEN, exit 1=OPEN
#   circuit-breaker.sh record-success <key>  # Record success → reset to CLOSED
#   circuit-breaker.sh record-failure <key>  # Record failure → may trip to OPEN
#   circuit-breaker.sh status [<key>]        # Show state (all or specific)
#   circuit-breaker.sh reset <key>           # Manual reset to CLOSED
#
# Environment:
#   CB_THRESHOLD=3      # Consecutive failures before tripping (default: 3)
#   CB_COOLDOWN_S=1800  # Seconds before OPEN → HALF_OPEN (default: 1800 = 30min)
#
# State files: tools/.circuit-state/<key>.json

set -uo pipefail

STATE_DIR="$(dirname "$0")/.circuit-state"
THRESHOLD="${CB_THRESHOLD:-3}"
COOLDOWN_S="${CB_COOLDOWN_S:-1800}"

mkdir -p "$STATE_DIR"

sanitize_key() {
  echo "$1" | tr '/' '_' | tr ' ' '_'
}

get_state_file() {
  echo "$STATE_DIR/$(sanitize_key "$1").json"
}

read_state() {
  local file
  file="$(get_state_file "$1")"
  if [[ -f "$file" ]]; then
    cat "$file"
  else
    echo '{"state":"CLOSED","failures":0}'
  fi
}

write_state() {
  local file
  file="$(get_state_file "$1")"
  echo "$2" > "$file"
}

now_iso() {
  date -u +"%Y-%m-%dT%H:%M:%SZ"
}

now_epoch() {
  date +%s
}

# Parse JSON fields (minimal, no jq dependency)
# Returns empty string if field not found (never fails)
json_field() {
  local val
  val="$(echo "$1" | grep -oP "\"$2\"\s*:\s*\"?[^,\"}]*\"?" | head -1 | sed -E "s/\"$2\"\s*:\s*\"?([^,\"}]*)\"?/\1/")" || true
  echo "$val"
}

json_int_field() {
  local val
  val="$(echo "$1" | grep -oP "\"$2\"\s*:\s*[0-9]+" | head -1 | sed -E "s/\"$2\"\s*:\s*([0-9]+)/\1/")" || true
  echo "$val"
}

cmd_check() {
  local key="$1"
  local data state failures tripped_at
  data="$(read_state "$key")"
  state="$(json_field "$data" state)"
  failures="$(json_int_field "$data" failures)"
  tripped_at="$(json_field "$data" tripped_at)"

  case "$state" in
    CLOSED)
      echo "✅ CLOSED — $key (failures: ${failures:-0}/${THRESHOLD})"
      exit 0
      ;;
    HALF_OPEN)
      echo "🟡 HALF_OPEN — $key (probing, 1 attempt allowed)"
      exit 0
      ;;
    OPEN)
      # Check if cooldown has elapsed → transition to HALF_OPEN
      if [[ -n "$tripped_at" ]]; then
        local tripped_epoch elapsed
        tripped_epoch=$(date -d "$tripped_at" +%s 2>/dev/null || echo 0)
        elapsed=$(( $(now_epoch) - tripped_epoch ))
        if (( elapsed >= COOLDOWN_S )); then
          write_state "$key" "{\"state\":\"HALF_OPEN\",\"failures\":${failures:-0},\"last_failure\":\"$(json_field "$data" last_failure)\",\"tripped_at\":\"$tripped_at\"}"
          echo "🟡 HALF_OPEN — $key (cooldown elapsed after ${elapsed}s, probe allowed)"
          exit 0
        else
          local remaining=$(( COOLDOWN_S - elapsed ))
          echo "🔴 OPEN — $key (tripped at $tripped_at, ${remaining}s until probe)"
          exit 1
        fi
      fi
      echo "🔴 OPEN — $key (no timestamp, manual reset needed)"
      exit 1
      ;;
    *)
      echo "⚠️  Unknown state '$state' for $key, treating as CLOSED"
      exit 0
      ;;
  esac
}

cmd_record_success() {
  local key="$1"
  write_state "$key" '{"state":"CLOSED","failures":0}'
  echo "✅ $key → CLOSED (success recorded, counter reset)"
}

cmd_record_failure() {
  local key="$1"
  local data state failures now
  data="$(read_state "$key")"
  state="$(json_field "$data" state)"
  failures="$(json_int_field "$data" failures)"
  failures=$(( ${failures:-0} + 1 ))
  now="$(now_iso)"

  if [[ "$state" == "HALF_OPEN" ]]; then
    # Probe failed → back to OPEN with fresh cooldown
    write_state "$key" "{\"state\":\"OPEN\",\"failures\":$failures,\"last_failure\":\"$now\",\"tripped_at\":\"$now\"}"
    echo "🔴 $key — HALF_OPEN probe failed → OPEN (failures: $failures, cooldown ${COOLDOWN_S}s)"
    return
  fi

  if (( failures >= THRESHOLD )); then
    write_state "$key" "{\"state\":\"OPEN\",\"failures\":$failures,\"last_failure\":\"$now\",\"tripped_at\":\"$now\"}"
    echo "🔴 $key — TRIPPED! ${failures} consecutive failures ≥ threshold ${THRESHOLD} → OPEN (cooldown ${COOLDOWN_S}s)"
  else
    write_state "$key" "{\"state\":\"CLOSED\",\"failures\":$failures,\"last_failure\":\"$now\"}"
    echo "⚠️  $key — failure ${failures}/${THRESHOLD} recorded (still CLOSED)"
  fi
}

cmd_status() {
  if [[ -n "${1:-}" ]]; then
    local data
    data="$(read_state "$1")"
    echo "Circuit: $1"
    echo "  State: $(json_field "$data" state)"
    echo "  Failures: $(json_int_field "$data" failures)/${THRESHOLD}"
    echo "  Last failure: $(json_field "$data" last_failure)"
    echo "  Tripped at: $(json_field "$data" tripped_at)"
    return
  fi

  echo "📊 Circuit Breaker Status (threshold=$THRESHOLD, cooldown=${COOLDOWN_S}s)"
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  local count=0
  shopt -s nullglob
  for f in "$STATE_DIR"/*.json; do
    [[ -f "$f" ]] || continue
    local key data state failures
    key="$(basename "$f" .json)"
    data="$(cat "$f")"
    state="$(json_field "$data" state)"
    failures="$(json_int_field "$data" failures)"
    local icon="✅"
    [[ "$state" == "OPEN" ]] && icon="🔴"
    [[ "$state" == "HALF_OPEN" ]] && icon="🟡"
    echo "  $icon $key — $state (failures: ${failures:-0})"
    count=$((count + 1))
  done
  shopt -u nullglob
  if (( count == 0 )); then
    echo "  (no circuits tracked yet)"
  fi
}

cmd_reset() {
  local key="$1"
  write_state "$key" '{"state":"CLOSED","failures":0}'
  echo "🔄 $key → CLOSED (manually reset)"
}

# Main dispatch
case "${1:-help}" in
  check)
    [[ -z "${2:-}" ]] && { echo "Usage: $0 check <key>"; exit 2; }
    cmd_check "$2"
    ;;
  record-success)
    [[ -z "${2:-}" ]] && { echo "Usage: $0 record-success <key>"; exit 2; }
    cmd_record_success "$2"
    ;;
  record-failure)
    [[ -z "${2:-}" ]] && { echo "Usage: $0 record-failure <key>"; exit 2; }
    cmd_record_failure "$2"
    ;;
  status)
    cmd_status "${2:-}"
    ;;
  reset)
    [[ -z "${2:-}" ]] && { echo "Usage: $0 reset <key>"; exit 2; }
    cmd_reset "$2"
    ;;
  help|--help|-h)
    echo "Circuit Breaker — prevent cascading subagent/workflow failures"
    echo ""
    echo "Usage:"
    echo "  $0 check <key>           # Exit 0 if allowed, exit 1 if OPEN"
    echo "  $0 record-success <key>  # Reset counter on success"
    echo "  $0 record-failure <key>  # Increment failure, may trip"
    echo "  $0 status [<key>]        # Show state"
    echo "  $0 reset <key>           # Manual reset"
    echo ""
    echo "Env: CB_THRESHOLD=$THRESHOLD CB_COOLDOWN_S=$COOLDOWN_S"
    ;;
  *)
    echo "Unknown command: $1. Use --help for usage."
    exit 2
    ;;
esac
