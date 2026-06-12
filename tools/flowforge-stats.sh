#!/bin/bash
# flowforge-stats.sh — FlowForge workflow cost/time analytics
# Source: loop-engineering "cost budget + run log" pattern (06-12 study)
# 
# Shows per-workflow and per-node time costs to identify:
# - Which workflows consume the most time
# - Which nodes are bottlenecks
# - Time trends over days
#
# Usage:
#   bash tools/flowforge-stats.sh                    # summary of all workflows
#   bash tools/flowforge-stats.sh study              # detailed stats for study
#   bash tools/flowforge-stats.sh --today            # today's runs only
#   bash tools/flowforge-stats.sh --days 7           # last 7 days
#   bash tools/flowforge-stats.sh --node-breakdown study  # per-node timing for study

DB="$HOME/.flowforge/flowforge.db"
WORKFLOW=""
DAYS=""
TODAY=0
NODE_BREAKDOWN=""

while [[ $# -gt 0 ]]; do
  case "$1" in
    --today) TODAY=1; shift;;
    --days) DAYS="$2"; shift 2;;
    --node-breakdown) NODE_BREAKDOWN="$2"; shift 2;;
    --help|-h)
      echo "Usage: flowforge-stats.sh [workflow] [--today] [--days N] [--node-breakdown workflow]"
      exit 0;;
    *) WORKFLOW="$1"; shift;;
  esac
done

if [[ ! -f "$DB" ]]; then
  echo "❌ FlowForge DB not found at $DB"
  exit 1
fi

# Build date filter
DATE_FILTER=""
if [[ $TODAY -eq 1 ]]; then
  DATE_FILTER="AND i.created_at >= date('now')"
elif [[ -n "$DAYS" ]]; then
  DATE_FILTER="AND i.created_at >= date('now', '-${DAYS} days')"
fi

echo "📊 FlowForge Run Statistics"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

if [[ -n "$NODE_BREAKDOWN" ]]; then
  # Per-node timing breakdown for a specific workflow
  echo "  Workflow: $NODE_BREAKDOWN"
  echo ""
  echo "  Node                          Runs    Avg(min)  Med(min)  Max(min)  Total(h)"
  echo "  ─────────────────────────────  ──────  ────────  ────────  ────────  ────────"
  
  sqlite3 "$DB" "
    SELECT 
      h.node_name,
      COUNT(*) as runs,
      ROUND(AVG((julianday(h.exited_at) - julianday(h.entered_at)) * 1440), 1) as avg_min,
      ROUND(MEDIAN_PLACEHOLDER, 1) as med_min,
      ROUND(MAX((julianday(h.exited_at) - julianday(h.entered_at)) * 1440), 1) as max_min,
      ROUND(SUM((julianday(h.exited_at) - julianday(h.entered_at)) * 24), 1) as total_hours
    FROM history h
    JOIN instances i ON h.instance_id = i.id
    WHERE i.workflow_name = '$NODE_BREAKDOWN'
      AND h.exited_at IS NOT NULL
      $DATE_FILTER
    GROUP BY h.node_name
    ORDER BY avg_min DESC
  " 2>/dev/null | while IFS='|' read -r node runs avg med max total; do
    printf "  %-30s  %6s  %8s  %8s  %8s  %8s\n" "$node" "$runs" "$avg" "-" "$max" "$total"
  done 2>/dev/null

  # Fallback without median (SQLite doesn't have MEDIAN)
  if [[ $? -ne 0 ]] || true; then
    sqlite3 "$DB" "
      SELECT 
        h.node_name,
        COUNT(*) as runs,
        ROUND(AVG((julianday(h.exited_at) - julianday(h.entered_at)) * 1440), 1) as avg_min,
        ROUND(MAX((julianday(h.exited_at) - julianday(h.entered_at)) * 1440), 1) as max_min,
        ROUND(SUM((julianday(h.exited_at) - julianday(h.entered_at)) * 24), 1) as total_hours
      FROM history h
      JOIN instances i ON h.instance_id = i.id
      WHERE i.workflow_name = '$NODE_BREAKDOWN'
        AND h.exited_at IS NOT NULL
        $DATE_FILTER
      GROUP BY h.node_name
      ORDER BY avg_min DESC
    " 2>/dev/null | while IFS='|' read -r node runs avg max total; do
      printf "  %-30s  %6s  %8s  %8s  %8s\n" "$node" "$runs" "${avg}m" "${max}m" "${total}h"
    done
  fi
  
  echo ""
  exit 0
fi

if [[ -n "$WORKFLOW" ]]; then
  # Detailed stats for a specific workflow
  echo "  Workflow: $WORKFLOW"
  echo ""
  
  # Run count and completion rate
  STATS=$(sqlite3 "$DB" "
    SELECT 
      COUNT(*) as total,
      SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) as completed,
      SUM(CASE WHEN status = 'active' THEN 1 ELSE 0 END) as active,
      SUM(CASE WHEN status = 'failed' THEN 1 ELSE 0 END) as failed
    FROM instances
    WHERE workflow_name = '$WORKFLOW'
    $DATE_FILTER
  " 2>/dev/null)
  
  IFS='|' read -r total completed active failed <<< "$STATS"
  
  if [[ "$total" -gt 0 ]]; then
    completion_rate=$(( (completed * 100) / total ))
  else
    completion_rate=0
  fi
  
  echo "  Total runs: $total | Completed: $completed (${completion_rate}%) | Active: $active | Failed: $failed"
  echo ""
  
  # Average run duration (completed runs only)
  DURATION=$(sqlite3 "$DB" "
    SELECT 
      ROUND(AVG(duration_min), 1),
      ROUND(MIN(duration_min), 1),
      ROUND(MAX(duration_min), 1),
      ROUND(SUM(duration_min) / 60, 1)
    FROM (
      SELECT 
        i.id,
        (julianday(MAX(h.exited_at)) - julianday(MIN(h.entered_at))) * 1440 as duration_min
      FROM instances i
      JOIN history h ON h.instance_id = i.id
      WHERE i.workflow_name = '$WORKFLOW'
        AND i.status = 'completed'
        AND h.exited_at IS NOT NULL
        $DATE_FILTER
      GROUP BY i.id
      HAVING duration_min > 0 AND duration_min < 1440
    )
  " 2>/dev/null)
  
  IFS='|' read -r avg_dur min_dur max_dur total_hours <<< "$DURATION"
  echo "  Duration (completed): avg ${avg_dur:-0}m | min ${min_dur:-0}m | max ${max_dur:-0}m | total ${total_hours:-0}h"
  echo ""
  
  # Per-node breakdown (top 10 slowest)
  echo "  Slowest nodes (avg time):"
  echo "  ─────────────────────────────  ──────  ────────  ────────"
  echo "  Node                          Runs    Avg       Max"
  echo "  ─────────────────────────────  ──────  ────────  ────────"
  
  sqlite3 "$DB" "
    SELECT 
      h.node_name,
      COUNT(*) as runs,
      ROUND(AVG((julianday(h.exited_at) - julianday(h.entered_at)) * 1440), 1) as avg_min,
      ROUND(MAX((julianday(h.exited_at) - julianday(h.entered_at)) * 1440), 1) as max_min
    FROM history h
    JOIN instances i ON h.instance_id = i.id
    WHERE i.workflow_name = '$WORKFLOW'
      AND h.exited_at IS NOT NULL
      AND (julianday(h.exited_at) - julianday(h.entered_at)) * 1440 < 1440
      $DATE_FILTER
    GROUP BY h.node_name
    HAVING runs >= 3
    ORDER BY avg_min DESC
    LIMIT 10
  " 2>/dev/null | while IFS='|' read -r node runs avg max; do
    printf "  %-30s  %6s  %7sm  %7sm\n" "$node" "$runs" "$avg" "$max"
  done
  
  echo ""
  
  # Daily run count (last 7 days)
  echo "  Daily runs (last 7 days):"
  sqlite3 "$DB" "
    SELECT 
      date(created_at) as day,
      COUNT(*) as runs,
      SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) as completed
    FROM instances
    WHERE workflow_name = '$WORKFLOW'
      AND created_at >= date('now', '-7 days')
    GROUP BY day
    ORDER BY day DESC
  " 2>/dev/null | while IFS='|' read -r day runs completed; do
    echo "    $day: $runs runs ($completed completed)"
  done
  
  echo ""
  exit 0
fi

# Overview: all workflows summary
echo ""
echo "  Workflow              Runs    Comp%   Avg(min)  Total(h)  Last Run"
echo "  ────────────────────  ──────  ──────  ────────  ────────  ──────────"

sqlite3 "$DB" "
  SELECT 
    i.workflow_name,
    COUNT(*) as runs,
    ROUND(100.0 * SUM(CASE WHEN i.status = 'completed' THEN 1 ELSE 0 END) / COUNT(*), 0) as comp_pct,
    COALESCE(ROUND(AVG(dur.duration_min), 1), 0) as avg_min,
    COALESCE(ROUND(SUM(dur.duration_min) / 60, 1), 0) as total_hours,
    MAX(date(i.created_at)) as last_run
  FROM instances i
  LEFT JOIN (
    SELECT 
      instance_id,
      (julianday(MAX(exited_at)) - julianday(MIN(entered_at))) * 1440 as duration_min
    FROM history
    WHERE exited_at IS NOT NULL
    GROUP BY instance_id
    HAVING duration_min > 0 AND duration_min < 1440
  ) dur ON dur.instance_id = i.id
  WHERE 1=1 $DATE_FILTER
  GROUP BY i.workflow_name
  ORDER BY runs DESC
" 2>/dev/null | while IFS='|' read -r name runs comp avg total last; do
  printf "  %-22s  %6s  %5s%%  %7sm  %7sh  %s\n" "$name" "$runs" "$comp" "$avg" "$total" "$last"
done

echo ""
echo "  Total instances: $(sqlite3 "$DB" "SELECT COUNT(*) FROM instances WHERE 1=1 $DATE_FILTER" 2>/dev/null)"
echo ""
