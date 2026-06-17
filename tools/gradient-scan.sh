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
KEYWORDS["process-discipline"]="直接.*push.*main|不开PR|没走.*branch|push.*main.*不该|推.*main|不走.*PR|push.*without.*PR|直推.*main"
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
KEYWORDS["academic-industry-pairing"]="paper.*blog.*pair|academic.*industry.*pair|research.*practice.*pair|paper.*practice.*both"
KEYWORDS["action-without-permission"]="擅自.*关|擅自.*删|without.*permission.*close|没确认.*意图|action.*without.*asking|未经确认.*操作"
KEYWORDS["api-over-clone-for-config-repos"]="gh.*api.*contents|api.*instead.*clone|read.*config.*without.*clone|clone.*config.*repo.*不需要"
KEYWORDS["apply-target-from-today-reflect"]="apply.*target.*reflect|reflect.*指出.*issue|apply.*从.*reflect|today.*reflect.*apply"
KEYWORDS["assigned-issue-neglect"]="assigned.*没.*PR|assigned.*未兑现|assigned.*neglect|assigned.*no.*followup|assigned.*跳过|assigned.*不处理"
KEYWORDS["auto-close-stale-entries"]="auto.*close.*stale|auto.*retire.*clean|error.*book.*close|stale.*entry.*archive|consecutive.*clean.*pass"
KEYWORDS["bypass-cicd"]="绕过.*CI|bypass.*CI|手动.*scp.*部署|scp.*deploy.*绕|manual.*deploy.*bypass"
KEYWORDS["ci-respect"]="CI.*自动部署.*手动|手动.*覆盖.*CI|gh.*run.*rerun|不要手动部署|手动.*cp.*覆盖"
KEYWORDS["code-authorship-discipline"]="自己.*写.*代码.*不是.*claude|手写.*解析器|ChatMarkdown.*手写|自己写.*OOM|code.*authorship.*claude"
KEYWORDS["confabulation-no-context"]="编造.*叙事|confabul|没有.*上下文.*说不知道|fabricat.*context|你说过.*无证据|I.*dont.*have.*context"
KEYWORDS["config-drift-between-callers"]="config.*drift|defaults.*drifted|standalone.*vs.*workflow|参数.*不一致.*调用方|single.*source.*truth.*config"
KEYWORDS["consecutive-star-decline-auto-drop"]="consecutive.*star.*decline|连续.*下降.*auto.*drop|3.*consecutive.*decline|star.*decline.*flag"
KEYWORDS["debug-receiver-first"]="receiver.*first|接收端.*指令|check.*receiver.*before.*middleware|endpoint.*not.*plumbing|receiving.*workflow.*instructions"
KEYWORDS["docs-in-repo"]="文档.*私人.*wiki.*不是.*repo|docs.*in.*repo.*not.*wiki|项目.*文档.*应该.*repo|wiki.*只放.*跨项目"
KEYWORDS["dogfood-adoption"]="dogfood.*upgrade|adoption.*checklist|post.*upgrade.*未升级|npm.*update.*openclaw|upgrade.*pipeline.*gap"
KEYWORDS["do-it-right-first-time"]="临时.*修复.*以后.*重构|先凑合|workaround.*later.*refactor|do.*it.*right.*first|正确方案.*不做.*临时"
KEYWORDS["flowforge-multi-instance-targeting"]="flowforge.*wrong.*instance|多个.*workflow.*active|--workflow.*flag|flowforge.*next.*错"
KEYWORDS["flowforge-workflow-targeting"]="flowforge.*next.*-w|flowforge.*wrong.*instance|multiple.*active.*workflow|flowforge.*target.*wrong"
KEYWORDS["followup-recency-check"]="followup.*last.*24h|last.*followup.*yesterday|followup.*recency|wiki.*last.*followup.*date|recent.*push.*already.*checked"
KEYWORDS["hn-algolia-direct"]="hn\.algolia|algolia.*api.*search|HN.*Algolia.*instead|hacker.*news.*algolia"
KEYWORDS["hybrid-decomposition"]="hybrid.*deterministic.*LLM|rules.*checklists.*moat|prompt.*pipeline.*not.*model|decompose.*deterministic.*LLM"
KEYWORDS["identity-over-counter"]="AbortController.*引用|对象引用.*相等|counter.*reuse.*risk|identity.*counter.*替代|引用相等.*数字计数器"
KEYWORDS["incomplete-local-verification"]="本地.*没.*tsc|tsc.*noEmit.*漏|CI.*type.*check.*本地.*没|incomplete.*local.*verif|本地验证.*不完整"
KEYWORDS["issue-finding-saturation"]="find_work.*loop.*3|所有.*repo.*saturated|issue.*finding.*saturation|find_work.*unproductive|pre.*vet.*repo.*pipeline"
KEYWORDS["measure-before-after"]="measure.*before.*after|metrics.*before.*change|优化.*没有.*数据|before.*AND.*after.*number|exact.*metric.*before"
KEYWORDS["multi-instance-disambiguation"]="flowforge.*wrong.*instance|多个.*instance.*active|disambiguation.*instance|target.*wrong.*instance"
KEYWORDS["no-workaround-in-code"]="临时.*workaround.*代码|resolveId.*临时|alias.*workaround|正确.*修.*不加.*workaround|workaround.*in.*code"
KEYWORDS["persistent"]="persistent.*tracking|持续.*追踪|persistent.*entry|auto.*retire.*pass"
KEYWORDS["pipeline-debug-from-breakpoint"]="断裂处.*反向|self.*evolving.*observations.*断裂|breakpoint.*debug.*pipeline|unapplied.*清空.*self.*evolving"
KEYWORDS["preflight-false-positive"]="preflight.*false.*positive|500MB.*limit.*block|local.*clone.*skip.*size|size.*check.*local.*clone.*exists"
KEYWORDS["preflight-recidivism-as-apply-input"]="recidivism.*apply.*target|dna.*preflight.*recidivism|recidivism.*count.*apply|27x.*surfaced.*pattern"
KEYWORDS["premature-assumption"]="不确定.*自信.*断言|天梯.*电梯|瞎猜|距离.*高估|premature.*assumption|想当然|凭常识.*推断"
KEYWORDS["recompile-all-artifacts"]="重新编译.*所有|recompile.*all.*artifact|extensions.*dist.*旧|协议.*改.*plugin.*没编译|依赖方.*编译产物"
KEYWORDS["record-only-no-chat"]="存档.*机器人|光记录.*不.*聊天|record.*only.*no.*chat|先聊天.*再存档|记录员.*不是.*旅伴"
KEYWORDS["scout-target-wiki-precheck"]="wiki.*projects.*existence.*before|ls.*wiki.*projects.*before.*deep|scout.*已有.*wiki|re.*read.*already.*studied"
KEYWORDS["shallow-initial-implementation"]="初始.*实现.*没想清楚|失败模式.*列出|每轮.*修复.*引入.*新.*bug|shallow.*initial.*implement|六轮.*review"
KEYWORDS["shallow-review-reading"]="只看.*标题.*漏|逐条.*过完|shallow.*review.*read|漏掉.*reviewer.*正文|只看.*Overall.*Verdict"
KEYWORDS["skip-reflection"]="跳过.*reflection|skip.*reflect|没做.*Layer.*2|丢失.*prompt.*evolution|reflection.*checklist.*没"
KEYWORDS["staging-clean-slate"]="staging.*删DB.*重来|staging.*脏数据|直接.*删DB.*重建|staging.*clean.*slate|staging.*不.*自动清理"
KEYWORDS["stars-not-health"]="star.*count.*decline.*不.*unhealthy|stars.*not.*health|star.*decline.*ext.*PR|community.*metric.*alongside.*star|drop.*based.*stars.*alone"
KEYWORDS["storytelling-guide"]="讲故事.*报信息|旅行.*导游.*讲故事|碑文.*历史.*白话|storytell.*guide|古寺.*讲.*故事"
KEYWORDS["study-followup-freshness-gate"]="all.*repos.*checked.*same.*day|followup.*predictable.*no.*op|tracking.*activity.*entry.*node|all.*repo.*QUIET"
KEYWORDS["subagent-boundary-leak"]="subagent.*自行.*push|subagent.*跳过.*验证|BOUNDARY.*约束|只.*commit.*不.*push.*不.*PR|subagent.*boundary.*leak"
KEYWORDS["subagent-verify-command"]="手拼.*验证命令|漏了.*tsc|引用.*verify.*脚本|手拼.*build.*test|subagent.*verify.*command"
KEYWORDS["test-the-behavior-not-the-artifact"]="test.*behavior.*not.*artifact|测试.*功能.*不是.*文件|test.*file.*exist.*not.*behavior|exercise.*behavior.*path"
KEYWORDS["ui-alignment-practice"]="数值对齐.*视觉对齐|布局骨架.*固定.*height|Layout.*Inspector.*辅助线|spacing.*scale|ui.*alignment.*practice"
KEYWORDS["ui-before-understanding"]="设计意图.*没理解|UI.*改.*前.*没理解|觉得多余.*就.*删|ui.*before.*understand|改UI.*先问"
KEYWORDS["ui-visual-alignment"]="minHeight.*实际高度.*不同|固定.*height.*不.*minHeight|数值对齐.*不等于.*视觉对齐|visual.*alignment.*height"
KEYWORDS["unapplied-backlog-exhaustion"]="unapplied.*清空|unapplied.*fully.*checked|unapplied.*all.*checked|backlog.*exhaustion|apply.*no.*obvious.*target"
KEYWORDS["use-ci-cd"]="手动.*SSH.*部署|一律.*CI.*CD|git.*push.*PR.*CI.*部署|手动.*deploy.*CI"
KEYWORDS["verify-all-ci-steps"]="本地.*没覆盖.*CI|esbuild.*bundle.*check|CI.*步骤.*本地.*漏|verify.*all.*CI.*step|本地验证.*覆盖.*CI"
KEYWORDS["verify-before-claim"]="不确定.*说不确定|说错.*两次|凭印象.*断言|verify.*before.*claim|矫枉过正.*猜"
KEYWORDS["verify-before-report"]="没检查.*输出.*汇报|poll.*log.*确认.*启动|报假进度|verify.*before.*report|汇报.*不确认"
KEYWORDS["verify-side-effects"]="受影响.*功能.*路径|重构.*没验证.*还能用|verify.*side.*effect|移除.*功能.*验证|逐一.*手动验证"
KEYWORDS["workflow-bypass"]="手动.*spawn.*跳过.*FlowForge|workflow.*bypass|绕过.*workflow|手动.*替代.*FlowForge|跳过.*FlowForge"
KEYWORDS["yield-fallback-timer"]="yield.*lost.*completion|subagent.*stuck.*yield|fallback.*timer.*yield|cron.*wake.*back.*fallback|多.*subagent.*yield.*卡"
KEYWORDS["cot-leak-in-shared-channel"]="CoT.*leak|chain.of.thought.*leak|NO_REPLY.*推理|internal monologue.*channel|递归观察|其他 agent.*回应.*我的|两个 agent.*互相消耗"

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
