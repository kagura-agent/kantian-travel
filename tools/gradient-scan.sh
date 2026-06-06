#!/usr/bin/env bash
# gradient-scan.sh — Scan recent memory for evidence matching existing beliefs-candidates patterns
# Inspired by Elephant Agent PR#43 "Signal Extraction" (pure code, no LLM)
#
# Usage: bash tools/gradient-scan.sh [--days N] [--verbose]
#
# Scans memory/YYYY-MM-DD.md files for keywords matching beliefs-candidates pattern tags.
# Reports which patterns have new evidence (potential count increments).
# Does NOT auto-modify beliefs-candidates.md — human/agent review required.

set -euo pipefail

WORKSPACE="${HOME}/.openclaw/workspace"
BC_FILE="${WORKSPACE}/beliefs-candidates.md"
MEMORY_DIR="${WORKSPACE}/memory"
DAYS=7
VERBOSE=false

while [[ $# -gt 0 ]]; do
  case "$1" in
    --days) DAYS="$2"; shift 2 ;;
    --verbose) VERBOSE=true; shift ;;
    *) echo "Unknown arg: $1"; exit 1 ;;
  esac
done

# Extract pattern tags and their keywords from beliefs-candidates.md
# Format: "pattern: <tag>, 第N次" or section headers with keywords
declare -A PATTERNS  # pattern_tag -> search_keywords
declare -A PATTERN_DATES  # pattern_tag -> dates already logged
declare -A PATTERN_STATUS  # pattern_tag -> graduated/retracted/candidate

# Extract patterns with their tags
while IFS= read -r line; do
  if [[ "$line" =~ pattern:\ ([a-zA-Z0-9_-]+) ]]; then
    tag="${BASH_REMATCH[1]}"
    PATTERNS["$tag"]="$tag"
    # Extract date
    if [[ "$line" =~ ^-\ ([0-9]{4}-[0-9]{2}-[0-9]{2}) ]]; then
      PATTERN_DATES["$tag"]="${PATTERN_DATES[$tag]:-} ${BASH_REMATCH[1]}"
    fi
    # Check status
    if [[ "$line" =~ graduated ]]; then
      PATTERN_STATUS["$tag"]="graduated"
    elif [[ "$line" =~ retracted ]]; then
      PATTERN_STATUS["$tag"]="retracted"
    else
      PATTERN_STATUS["$tag"]="candidate"
    fi
  fi
done < "$BC_FILE"

# Also extract section-based candidates (## headers)
while IFS= read -r line; do
  if [[ "$line" =~ ^##\ [0-9]{4}-[0-9]{2}-[0-9]{2}:\ (.+) ]]; then
    title="${BASH_REMATCH[1]}"
    # Skip graduated/retracted
    if [[ "$line" =~ graduated|retracted ]]; then
      continue
    fi
  fi
done < "$BC_FILE"

# Build keyword map for each pattern
# Map pattern tags to grep-friendly search terms
declare -A KEYWORDS
# Tight keywords — each should match ONLY the specific behavioral pattern, not general context
# Rule: keyword should identify the BEHAVIOR/ERROR, not the domain
KEYWORDS["product-design-principle"]="少角色.*多场景|场景为一级结构|角色为一级结构"
KEYWORDS["simulate-realistically"]="拍脑袋定频率|贴近真实.*节奏|模拟.*不真实"
KEYWORDS["collect-before-advise"]="先收集.*数据.*再|先拍.*信息|collect.*data.*before.*advise"
KEYWORDS["cron-context-gap"]="isolated.*cron.*能力|cron.*hallucinate|CAPABILITIES.md.*cron"
KEYWORDS["process-discipline"]="直接.*push.*main|不开PR|没走.*branch|push.*main.*不该|推.*main|不走.*PR|skip.*PR|push.*without.*PR"
KEYWORDS["issue-discipline"]="issue.*可执行.*可关闭|issue.*done.*是什么|战略.*不放.*issue"
KEYWORDS["pr-ownership"]="out.of.date.*自己|re-request.*review|主动.*require.*review|branch.*behind.*自己"
KEYWORDS["self-check"]="不应该问.*有没有.*approve|自己.*看得到|PR.*状态.*自己查"
KEYWORDS["ui-quality-bar"]="prompt.*弹窗.*不该|toast.*填.*必要|prototype.*级别"
KEYWORDS["discord-design-convention"]="对标.*Discord.*UX|Discord.*完整.*flow|sidebar.*对齐.*Discord"
KEYWORDS["library-selection-for-ai"]="组件库.*流行度|AI.*生成.*质量.*库|shadcn.*手写"
KEYWORDS["大repo"]="clone.*OOM|clone.*失败|repo.*too.*large|sparse.*checkout.*OOM|clone.*大.*repo"
KEYWORDS["竞争PR"]="competing.*PR|已有.*competing|every.*issue.*competing|hyper-competitive|竞争.*极度"
KEYWORDS["code-review-rounding"]="premature.*round|rounded.*display.*value|raw.*calculation.*value"
KEYWORDS["scout-before-commit"]="wiki.*already.*has|already.*wiki.*notes|redundant.*deep.read"
KEYWORDS["pr-closed-self-reflect"]="PR.*close.*自省|PR.*reject.*先看.*质量|closed as.*slop|slop.*label.*PR"
KEYWORDS["familiarity-trap"]="熟悉.*跳过.*检查|skip.*because.*familiar|熟了.*跳过"
KEYWORDS["readonly-ripple-check"]="readonly.*break.*site|readonly.*mutation.*method|.push.*readonly.*type|.splice.*readonly.*array"
KEYWORDS["premature-conclusion"]="根因确认.*错|找到了.*但|premature.*conclusion|误判.*根因|false.*root.*cause|宣布.*根因.*太早|根因.*判断.*错|jumped.*conclusion|wrong.*diagnosis|误判|确认.*太快"
KEYWORDS["wrong-debug-layer"]="先查配置.*再查|调试顺序.*配置|debug.*config.*first|源码.*其实.*配置|应该查配置|配置问题.*不是.*代码|看源码.*其实.*配置|config.*not.*code"
KEYWORDS["architecture-misunderstanding"]="channel-as-service.*spawn|sessions_send.*不是.*spawn|架构.*理解.*错"
KEYWORDS["plan-before-act"]="先.*告诉.*准备.*怎么改|大改动.*先.*计划|plan.*before.*act|先陈述.*计划|直接动手.*没.*说|先说.*再改|没确认.*就改了|先确认.*再动手"
KEYWORDS["machine-identity-verification"]="SSH.*验证.*hostname|机器.*身份.*确认|VM.*编号.*不一致|IP.*VM.*映射"
KEYWORDS["workflow-enforcement"]="不按.*流程|workflow.*yaml.*手动|FlowForge.*执行.*不能|跳过.*workflow"
KEYWORDS["ask-before-search"]="自己.*搜.*查.*再问|先查资料.*再问|resourceful.*first|问人.*之前.*自己.*查|ask.*instead.*search"
KEYWORDS["code-discipline"]="自己.*写代码.*不是.*claude|为什么.*自己.*写|代码.*必须.*Claude.Code|自己写.*应该.*claude|手写代码.*不该"
KEYWORDS["deploy-path-verify"]="部署.*错误.*路径|deploy.*wrong.*path|WorkingDirectory.*确认|目标路径.*部署前|staging.*cove.*混"
KEYWORDS["observation-without-investigation"]="反复.*flag.*不.*investigat|performative.*observation|read.*source.*code.*day.1|open.*3.*days.*no.*progress|观测.*不.*查.*源码"
KEYWORDS["premature-diagnosis"]="第一个.*异常.*停|症状.*不是.*根因|系统级.*全貌|sessions_list.*超时.*不是|first.*anomaly.*not.*root"
KEYWORDS["pr-hygiene"]="新开.*PR.*已有|盲目.*新建.*branch|gh.pr.list.*检查|先查.*已有.*PR|duplicate.*PR.*existing"
KEYWORDS["rebuild-safety"]="rebuild.*覆盖|重建.*确认.*源码|dist.*source.*不一致|覆盖.*已部署|rebuild.*overwrite"
KEYWORDS["report-vs-fix"]="记录.*broken.*不是.*修|报告.*不等于.*行动|审计.*broken.*同一轮.*修|记下.*broken.*不算|report.*not.*fix"
KEYWORDS["source-of-truth"]="直接.*改.*dist.*产物|源码.*repo.*track|dist.*不是.*source|build.*bundle.*复制|modify.*dist.*not.*source"

# Cross-check: scan beliefs-candidates section by section for graduated/retracted status
# Handles cases where pattern: tag is on a line BELOW a graduated ## header
current_section_status=""
while IFS= read -r line; do
  if [[ "$line" =~ ^##\ [0-9]{4} ]]; then
    if [[ "$line" =~ graduated ]]; then
      current_section_status="graduated"
    elif [[ "$line" =~ retracted ]]; then
      current_section_status="retracted"
    else
      current_section_status="candidate"
    fi
  elif [[ "$line" == '###'* ]]; then
    # New subsection resets inherited status
    current_section_status=""
  fi
  if [[ -n "$current_section_status" ]] && [[ "$current_section_status" == "graduated" || "$current_section_status" == "retracted" ]]; then
    if [[ "$line" =~ pattern:\ ([a-zA-Z0-9_-]+) ]]; then
      PATTERN_STATUS["${BASH_REMATCH[1]}"]="$current_section_status"
    fi
  fi
done < "$BC_FILE"

# Hardcoded graduated patterns that use Chinese names in headers (no pattern: tag)
# These must be manually maintained when Chinese-named patterns graduate
PATTERN_STATUS["大repo"]="graduated"
PATTERN_STATUS["竞争PR"]="graduated"

# ── JSONL structured evidence (authoritative) ──
# Count explicit gradient logs from .gradient-log.jsonl within the scan window
JSONL_LOG="${WORKSPACE}/tools/.gradient-log.jsonl"
declare -A JSONL_COUNTS  # pattern_tag -> count within window
declare -A JSONL_DATES   # pattern_tag -> dates
if [[ -f "$JSONL_LOG" ]]; then
  CUTOFF_DATE=$(date -d "-${DAYS} days" +%Y-%m-%d 2>/dev/null || date -v-${DAYS}d +%Y-%m-%d 2>/dev/null)
  while IFS= read -r jline; do
    jdate=$(echo "$jline" | jq -r '.date // empty' 2>/dev/null || true)
    jpattern=$(echo "$jline" | jq -r '.pattern // empty' 2>/dev/null || true)
    [[ -z "$jdate" || -z "$jpattern" ]] && continue
    if [[ "$jdate" > "$CUTOFF_DATE" || "$jdate" == "$CUTOFF_DATE" ]]; then
      JSONL_COUNTS["$jpattern"]=$(( ${JSONL_COUNTS[$jpattern]:-0} + 1 ))
      if [[ "${JSONL_DATES[$jpattern]:-}" != *"$jdate"* ]]; then
        JSONL_DATES["$jpattern"]="${JSONL_DATES[$jpattern]:-} ${jdate}"
      fi
    fi
  done < "$JSONL_LOG"
fi

echo "📊 Gradient Scan — $(date +%Y-%m-%d)"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Scanning last ${DAYS} days of memory + JSONL log for pattern matches"
echo ""

# Build list of memory files to scan
MEMORY_FILES=()
for i in $(seq 0 $((DAYS - 1))); do
  d=$(date -d "-${i} days" +%Y-%m-%d 2>/dev/null || date -v-${i}d +%Y-%m-%d 2>/dev/null)
  f="${MEMORY_DIR}/${d}.md"
  [[ -f "$f" ]] && MEMORY_FILES+=("$f")
done

if [[ ${#MEMORY_FILES[@]} -eq 0 ]]; then
  echo "❌ No memory files found for the last ${DAYS} days"
  exit 0
fi

echo "📁 Files: ${#MEMORY_FILES[@]} memory files"
echo ""

FOUND=0
TOTAL_MATCHES=0

for tag in "${!KEYWORDS[@]}"; do
  status="${PATTERN_STATUS[$tag]:-candidate}"
  # Skip graduated/retracted
  if [[ "$status" == "graduated" || "$status" == "retracted" ]]; then
    continue
  fi

  keywords="${KEYWORDS[$tag]}"
  matches=0
  match_files=()
  match_lines=()

  for f in "${MEMORY_FILES[@]}"; do
    fname=$(basename "$f" .md)
    # Skip dates already logged for this pattern
    already_logged="${PATTERN_DATES[$tag]:-}"
    if [[ "$already_logged" == *"$fname"* ]]; then
      continue
    fi

    count=$(grep -Ei "$keywords" "$f" 2>/dev/null | grep -cvEi "gradient|beliefs.candidates|pattern:|gradient.scan|count=[0-9]|existing.*pattern|flags.*pattern|dedup" 2>/dev/null || true)
    if [[ "$count" -gt 0 ]]; then
      matches=$((matches + count))
      match_files+=("$fname")
      if $VERBOSE; then
        while IFS= read -r line; do
          match_lines+=("  [$fname] $line")
        done < <(grep -Ei "$keywords" "$f" 2>/dev/null | grep -vEi "gradient|beliefs.candidates|pattern:|gradient.scan|count=[0-9]|existing.*pattern|flags.*pattern|dedup" | head -3)
      fi
    fi
  done

  if [[ "$matches" -gt 0 ]]; then
    FOUND=$((FOUND + 1))
    TOTAL_MATCHES=$((TOTAL_MATCHES + matches))
    echo "🔍 pattern:${tag} — ${matches} hits in ${#match_files[@]} days"
    echo "   Status: ${status} | Dates with evidence: ${match_files[*]}"
    if $VERBOSE && [[ ${#match_lines[@]} -gt 0 ]]; then
      for ml in "${match_lines[@]}"; do
        echo "$ml"
      done
    fi
    echo ""
  fi
done

# ── JSONL-only patterns (not in KEYWORDS map but have explicit gradient logs) ──
JSONL_ONLY_FOUND=0
for jtag in "${!JSONL_COUNTS[@]}"; do
  # Skip if already reported via keyword scan
  [[ -n "${KEYWORDS[$jtag]:-}" ]] && continue
  # Skip graduated/retracted
  jstatus="${PATTERN_STATUS[$jtag]:-candidate}"
  [[ "$jstatus" == "graduated" || "$jstatus" == "retracted" ]] && continue
  
  jcount="${JSONL_COUNTS[$jtag]}"
  jdates="${JSONL_DATES[$jtag]}"
  JSONL_ONLY_FOUND=$((JSONL_ONLY_FOUND + 1))
  FOUND=$((FOUND + 1))
  TOTAL_MATCHES=$((TOTAL_MATCHES + jcount))
  echo "🔍 pattern:${jtag} — ${jcount} hits (JSONL only)"
  echo "   Status: ${jstatus} | Dates:${jdates}"
  if $VERBOSE; then
    # Show gradient text from JSONL
    while IFS= read -r jline; do
      jpattern=$(echo "$jline" | jq -r '.pattern // empty' 2>/dev/null || true)
      [[ "$jpattern" != "$jtag" ]] && continue
      jtext=$(echo "$jline" | jq -r '.gradient // empty' 2>/dev/null || true)
      jdate=$(echo "$jline" | jq -r '.date // empty' 2>/dev/null || true)
      echo "  [$jdate] $jtext"
    done < "$JSONL_LOG"
  fi
  echo ""
done

# ── Also augment keyword-matched patterns with JSONL counts ──
# (Already reported above but note if JSONL has additional evidence)

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📊 Summary: ${FOUND} patterns with new evidence, ${TOTAL_MATCHES} total hits"
if [[ $JSONL_ONLY_FOUND -gt 0 ]]; then
  echo "   📋 ${JSONL_ONLY_FOUND} patterns detected via JSONL log (no keyword scan needed)"
fi
if [[ $FOUND -eq 0 ]]; then
  echo "✅ No new pattern evidence found in last ${DAYS} days"
else
  echo "⚡ Review matches above — potential count increments for beliefs-candidates"
fi
