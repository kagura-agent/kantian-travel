#!/usr/bin/env bash
# workflow-guard.sh — Structural enforcement for workflow-bypass pattern
# Checks if a FlowForge instance is active for the given intent/workflow.
# Usage: workflow-guard.sh <intent-or-workflow-name>
# Exit 0 = active instance found (safe to proceed)
# Exit 1 = NO active instance (must start one first)
# Exit 2 = no matching workflow (intent not recognized, proceed freely)
#
# Intent mapping: keywords → workflow names
# This enforces the rule: "有 workflow 的任务必须走 workflow 入口命令"
# Graduated from: workflow-bypass (beliefs-candidates, 4-day recidivist)

set -euo pipefail

INTENT="${1:-}"

if [[ -z "$INTENT" ]]; then
  echo "Usage: workflow-guard.sh <intent>"
  echo "Intents: review, code-review, study, workloop, reflect, audit, evolve, refactor"
  exit 2
fi

# Map intents to workflow names
declare -A INTENT_MAP=(
  [review]="code-review"
  [code-review]="code-review"
  [pr-review]="code-review"
  [study]="study"
  [learn]="study"
  [research]="study"
  [workloop]="workloop"
  [work]="workloop"
  [contribute]="workloop"
  [打工]="workloop"
  [reflect]="reflect"
  [反思]="reflect"
  [audit]="daily-audit"
  [evolve]="evolve"
  [refactor]="code-refactor"
)

# Resolve intent to workflow name
WORKFLOW="${INTENT_MAP[$INTENT]:-$INTENT}"

# Check if this is a known workflow
if ! flowforge list 2>/dev/null | grep -qw "$WORKFLOW"; then
  # Not a known workflow — no guard needed
  exit 2
fi

# Check if there's an active instance
ACTIVE=$(flowforge active 2>/dev/null)
if echo "$ACTIVE" | grep -qw "$WORKFLOW"; then
  # Active instance found — good to go
  INSTANCE_LINE=$(echo "$ACTIVE" | grep -w "$WORKFLOW" | head -1)
  echo "✅ FlowForge instance active: $INSTANCE_LINE"
  exit 0
else
  echo "🚫 WORKFLOW BYPASS DETECTED"
  echo ""
  echo "Task matches workflow '$WORKFLOW' but no active FlowForge instance found."
  echo "You MUST start an instance before proceeding:"
  echo ""
  echo "  flowforge start $WORKFLOW"
  echo ""
  echo "Or use an existing workflow file:"
  YAML_PATH=$(find ~/.openclaw/workspace/flowforge/workflows -name "${WORKFLOW}*.yaml" 2>/dev/null | head -1)
  if [[ -n "$YAML_PATH" ]]; then
    echo "  flowforge start $YAML_PATH"
  fi
  echo ""
  echo "Pattern: workflow-bypass (4-day recidivist, structural enforcement)"
  echo "Rule: 有 workflow 的任务必须走 workflow 入口命令，不能手动替代"
  exit 1
fi
