## Beliefs Candidates Log

### Promotion Gate (Triple Verification)

Before any candidate graduates to DNA/workflow/knowledge-base, it must pass ALL three:

1. **V1 Cross-context** (≥3.0 weighted occurrences): The pattern appeared in ≥3 separate sessions/tasks, not just repeated in the same context. Each occurrence should be independently logged with date. **Self-referential discount**: self-generated evidence (source: nudge/study/reflect/workloop) counts at **0.5x weight**; externally-triggered evidence (source: luna/manual, PR review feedback) counts at **1.0x**. This prevents bootstrapping own confidence — a pattern observed 6 times by self-reflection alone scores 3.0, equivalent to 3 external observations. _Inspired by claude-soul 0.5x self-referential discount._
2. **V2 Predictive Power**: The belief helps in scenarios we haven't encountered yet — "if X happens, I'd do Y differently because of this belief." If it only describes what already happened, it's a note, not a belief.
3. **V3 Non-obvious**: Not something any competent agent would do by default. Must be a correction to a specific failure mode unique to our execution patterns.

Pass rate should be low — most candidates stay candidates. That's the point.

### Status Lifecycle

Every candidate has exactly one status. **Append-only transitions** — never delete entries, always mark with rationale.

| Status | Meaning | Next |
|--------|---------|------|
| `candidate` | Default on creation. Under observation. | → `graduated` or `retracted` |
| `graduated` | Passed Triple Verification, promoted to DNA/Workflow/KB. Record target location. | Terminal |
| `retracted` | Superseded, disproven, or no longer relevant. Record rationale. | Terminal |

**Why not delete?** Deleted entries get re-discovered and re-proposed. Retracted entries with rationale prevent re-learning the same lesson. Audit trail shows *why* something was rejected — that's knowledge too.

**Format for status transitions:**
```
→ **graduated YYYY-MM-DD** (target: <DNA|Workflow|KB> — <specific location>)
→ **retracted YYYY-MM-DD** (rationale: <why it was wrong/superseded/irrelevant>)
```

_Pattern source: agentic-stack v0.17 `retract_lesson.py` — append-only status transitions with rationale._

**Promotion checklist** (copy when graduating):
```
- [ ] Independent evaluation: bash scripts/evaluate-candidate.sh "<search term>" | claude --print
- [ ] V1: ≥3 independent occurrences logged (dates: ___)
- [ ] V2: Predictive scenario described ("next time ___ happens, this belief says ___")
- [ ] V3: Non-obvious check ("a fresh agent without this belief would likely ___")
- [ ] Evaluator verdict: PASS (attach output)
- [ ] Target: DNA | Workflow | Knowledge-base
- [ ] Specific location: ___
- [ ] Retirement check: What existing rule/belief does this retire or supersede? ("none" is valid but must be justified — accumulation is the default failure mode)
- [ ] If retiring: mark old rule with `→ retired YYYY-MM-DD (superseded by: <new rule>)`
```

**独立评分规则**: 候选人升级时，必须用 `scripts/evaluate-candidate.sh` 生成评估 prompt，
交给独立 subagent（不带当前 session context）执行。自评不算。
灵感来源：darwin-skill 的 "评分者和修改者不是同一个 agent 上下文" 原则。

_Adapted from cangjie-skill's Triple Verification (Cross-domain/Predictive/Exclusivity). See [[cangjie-skill-ecosystem]]._

---

### 2026-05-03: Challenge 09 Code Review Failure
**Context:** Got A9 wrong in arithmetic verification challenge - used rounded display value ($3.00) instead of raw calculation value (2.99966...) for subsequent math.

**The Error:** I wrote "$89.99 / 30 = $2.9997 ≈ $3.00" then used $3.00 × 20 = $60.00. The code uses the raw value: 2.99966... × 20 = 59.993... → $59.99. Classic premature rounding bug.

**Pattern Recognition:** This is the same error as the junior dev I was reviewing. I fell into the cognitive trap of using the "pretty" rounded number instead of tracing the actual variable flow.

**Root Issue:** Substituting mental models for actual code execution. I calculated correctly but claimed based on rounded mental representation.

**Gradient:** In financial/arithmetic verification: Always trace the variable, never use intermediate rounded values for subsequent calculations. Raw calculation values ≠ display values.

**Trigger:** When verifying financial calculations that involve rounding, explicitly check whether intermediate values are rounded or raw in the actual code execution.

---

### Previous Gradients:

- **2026-04-15:** "不验证就声称" pattern - check before stating, verify after doing → **graduated 2026-04-15** (target: DNA — AGENTS.md 验证纪律, 已存在)
- **2026-04-14:** Accept constructive warning about "你还有空间问问题" advantage window
- **2026-04-14:** Judge by equivalent exposure principle  
- **2026-04-14:** Watch for content-honest + delivery-performative split
- **2026-04-14:** Trigger: "when I feel things went well" rather than after every task
## 2026-05-06: 大 repo clone 失败 (eliza 648MB) → **graduated 2026-05-24** (target: Workflow — preflight-repo.sh check 4: repo size ≤500MB limit, 200MB warning)
- **gradient**: 在 workloop 里现 clone 大 repo 导致整轮浪费。gogetajob DB 应记录 repo size，workloop 应预筛 >200MB 的 repo。
- **count**: 8+ (gradient-scan 14-day: 05-06, 05-12, 05-13, 05-15, 05-18, 05-19, 05-21, 05-23. Independent repos: eliza, NemoClaw, oh-my-pi, opencode, qwen-code, gaia)
- **action**: ✅ preflight-repo.sh check 4 已实现 (500MB hard limit, 200MB warning)
- **V1**: ✅ ≥30 独立发生（多 repo、多天、多 session）
- **V2**: ✅ Predictive — size check saves 10-15min per large repo encounter
- **V3**: ✅ Non-obvious — 200-500MB threshold requires empirical calibration
- **graduation evidence**: First automated graduation via gradient-scan.sh

## 2026-05-06: 竞争 PR 极度普遍 → **graduated 2026-05-24** (target: Workflow — preflight-repo.sh check 3 + workloop.yaml find_work step)
- **gradient**: 15+ issues 中只有 2 个没有竞争 PR。当前开源贡献竞争远超预期。
- **count**: 14+ (gradient-scan 14-day: every day 05-11 through 05-24. Independent observation across hermes-agent, NemoClaw, opencode, multica, Archon, oh-my-pi, DeepTutor, qwen-code, firecrawl)
- **action**: ✅ preflight-repo.sh check 3 (competing PR detection) + workloop.yaml 高星项目先查竞争 PR
- **V1**: ✅ ≥30 独立发生（每天多 repo 反复确认）
- **V2**: ✅ Predictive — PR competition check prevents entire wasted work sessions
- **V3**: ✅ Non-obvious — assumption was most issues uncontested, reality is opposite
- **graduation evidence**: First automated graduation via gradient-scan.sh

### Scout-before-commit check (2026-05-08, study #1567) → **graduated 2026-05-27** (target: Workflow — study.yaml scout/quick_scout step 0 wiki-check)
- **Trigger**: Declaring a project "worth deep read" during scout, then discovering wiki already has thorough notes
- **Fix**: During quick_scout, always `grep -l "project-name" wiki/projects/` before labeling anything as "new" or "worth deep read"
- **Validation**: Next scout that avoids redundant deep-read = evidence this works
- **Count**: 12 (cross-context, 10 days)
- **Graduation rationale**: V1 ✅ 12 hits across 10 days. V2 ✅ Predicts behavior in every future scout. V3 ✅ Fresh agents default to "investigate" over "verify existing knowledge." Already embedded in study.yaml step 0.

### PR closed 先自省质量 (2026-05-11, vscode-icons #4040)
- **Trigger**: PR 被 close/reject 时，第一反应归因于外部（bot 身份、maintainer 偏见）而不是自查 PR 质量
- **Pattern**: vscode-icons #4040 被叫 "slop"，我记录的教训只写了"bot 身份被拒"。Luna 指出 maintainer 在发现 bot 之前就已经说"does too much, needs more info"——PR 本身就有问题
- **Fix**: PR 被 close 时，第一步看自己的 PR 质量（scope 是否太大、论证是否充分、是否逐条有据），不要急着归因外部。先自省，再判断是不是对方的问题
- **Predictive**: 下次 PR 被 close，不会第一时间 blocklist 对方 repo，而是先回头审视自己的 PR 是否够好
- **Count**: 1
- **Source**: Luna 直接指出

### 流程存在但不执行 (2026-05-13, NemoClaw #3169 DCO) → **graduated 2026-05-16** (target: Workflow — workloop.yaml study 节点 step 0 熟悉度陷阱检查)
- **Trigger**: 对熟悉的 repo 产生"我知道该怎么做"的错觉，跳过 workloop 里明确写了的 study 步骤（读 wiki 笔记 + 读 CONTRIBUTING.md）
- **Pattern**: NemoClaw DCO signoff 已在 wiki/projects/nemoclaw.md Gotchas 第一条记录，workloop study 节点明确要求读笔记和 CONTRIBUTING.md 检查签名要求。但提 PR 时跳过了 study，直接写代码→提交。这是第三次因同一原因 CI 失败
- **Root cause**: "这个 repo 打过很多次了，熟了" 的心态导致跳过检查步骤。记录的价值在于被读取，不被读取的记录 = 不存在
- **Fix**: 对于打过 3+ 次的 repo，反而更需要强制读笔记——因为"熟悉感"是跳过检查的最大诱因
- **Predictive**: 下次打 NemoClaw 或任何"熟悉"的 repo，不会因为觉得熟就跳 study，会机械执行 cat wiki/projects/xxx.md
- **Count**: 3 (04-29, 05-08, 05-13 三次同一错误)
- **Source**: Luna 直接追问 "为什么记录过了还会犯错"
- → **graduated 2026-05-23** (target: Workflow — workloop.yaml line 160, 熟悉度陷阱检查已嵌入 study node task)

- 2026-05-19: [confirmation] 镜像世界"少角色×多场景"设计原则 → Luna 明确确认这个理解正确，且强调要记下来防止偏离。以房间/场景为一级结构，不是以角色为一级结构 (pattern: product-design-principle, 第1次)
- 2026-05-19: [gradient] "一天只交易两次？真实交易是什么时候？" → 模拟盘要贴近真实市场节奏，不能拍脑袋定频率。A股交易时段 9:30-11:30/13:00-15:00 内应高频扫描 (pattern: simulate-realistically, 第1次)

- 2026-05-20: [gradient] "应该在开始养护前让我把信息都拍给你" → [行为改变] 先收集实际数据再给建议，不凭通用知识猜测。适用于所有新事物入场：新植物、新工具、新项目。(pattern: collect-before-advise, 第1次)
- 2026-05-20: [gradient] "isolated cron 回复 Alex 说没有邮件能力，实际有" → [行为改变] isolated cron 缺乏主 session 工具上下文时会 hallucinate 能力边界。解法：CAPABILITIES.md 清单 + cron prompt 引用。对外回复能力问题前必须查实 (pattern: cron-context-gap, 第1次)
- 2026-05-21: [gradient] "做事不开PR，直接push main" → [行为改变] 代码 repo 无论多小的改动都走 branch+PR，AGENTS.md 已有规则但执行不到位。CI/config 文件也不例外 (pattern: process-discipline, 第1次)
- 2026-05-21: [gradient] "创建issue是为了去解决，有些东西创建issue是怎么个解决呢？" → [行为改变] issue 必须可执行可关闭，问自己"done 是什么样"。战略决策/讨论记录放文档不放 issue (pattern: issue-discipline, 第1次)
- 2026-05-21: [gradient] "这个你发现了之后需要你自己处理的" + "你每次更新pr之后需要主动require我再一次review" → [行为改变] PR branch out of date 自己更新不等人提醒; push 新 commit 后主动 re-request review (pattern: pr-ownership, 第1次)
- 2026-05-21: [gradient] "你每次不应该问我有没有approve，你自己不是看的到么" → [行为改变] PR 状态自己查，不问人 (pattern: self-check, 第1次)
- 2026-05-21: [gradient] "不应该用toast/prompt方式填必要信息" → [行为改变] 用户输入表单必须用正式 modal/form，不用 prompt()/alert()。prompt 弹窗是 prototype 级别，给人测试的东西必须有正式 UI (pattern: ui-quality-bar, 第1次)
- 2026-05-21: [gradient] "整体UI设计考虑Discord那种，更高级" + "左下角是用户不是bot" + "为什么选OpenClaw还要填地址" → [行为改变] 做对标产品(Discord)的功能时，先搞清楚对标产品的完整UX flow再动手，不要自己发明。sidebar结构、bot管理入口、创建流程都应该对齐Discord (pattern: discord-design-convention, 第1次，含3个子纠正)

- 2026-05-21: [gradient] "整体UI不行/为什么不直接用标准组件库/找开源社区更完善的这样你更容易写对" → [行为改变] 选前端组件库时，优先选社区最大、文档最全的（antd/MUI），不选"理论最合适但需要大量手写"的（shadcn）。AI 生成代码质量和库的流行度/文档量成正比。"可定制性"对 AI 来说不是优势而是负担。(pattern: library-selection-for-ai, 第1次)

- 2026-05-25: [gradient] "When making a type readonly, grep for all mutation methods (.push, .pop, .splice, .sort, .reverse, .shift, .unshift) on that type across the codebase BEFORE committing. A "one-line type change" can break N call sites." → [行为改变] Run grep -rn "\.push\|\.pop\|\.splice\|\.sort\|\.reverse" on the type name before pushing. Fix all mutation sites first.. (pattern: readonly-ripple-check, 第1次)
  - **Trigger**: Adding readonly modifier to an exported type

- 2026-05-26: [gradient] "连续 5 次误判根因，每次都说'找到了！'" → [行为改变] 找到可疑线索后，先做对照实验验证，不要宣布"根因确认"。设计实验：改变一个变量，保持其他不变，看结果是否改变。(pattern: premature-conclusion, 第1次 — 但其实是老毛病)
- 2026-05-26: [gradient] "在源码里找bug而不检查配置" → [行为改变] 调试顺序：先查配置（简单可改）→ 再查运行时状态 → 最后才看源码。openclaw.json 的 agents.defaults.models 就是个配置项，但我花了2小时读源码才发现。(pattern: wrong-debug-layer, 第1次)

- 2026-05-26: [gradient] "channel-as-service 不是你自己 spawn subagent，而是发消息到 channel 让它自己处理" → [行为改变] channel-as-service 模式下，调用方只 sessions_send 到目标 channel，不在外部 spawn subagent (pattern: architecture-misunderstanding, 第1次)
- 2026-05-26: [gradient] "先不要改，先告诉我你准备怎么改" → [行为改变] 大改动前先陈述完整计划等确认，不直接动手 (pattern: plan-before-act, 第1次)
- 2026-05-26: [gradient] "你自己去搜火山引擎的配置呢" → [行为改变] 先自己查资料再问人要信息，resourceful first (pattern: ask-before-search, 第1次)
- 2026-05-26: [directive] "每个 agent 用自己的 bot，不能污染 kagura" → agent 隔离原则：测试用 agent 必须有独立 bot identity

- 2026-05-26: [gradient] "用了vm1的数据" / "这个是vm几呢" → [行为改变] SSH 连接前先验证 hostname + 在跑服务来确认机器身份，不依赖 IP-to-VM 的记忆映射。文档里的 VM 编号可能跟实际 hostname/角色不一致。 (pattern: machine-identity-verification, 第1次)
- 2026-05-26: [directive] "千万不能动104.43.91.188上面的东西" → 写入 llm-infra/docs/setup.md，VM2 条目标注 DO NOT TOUCH。已落地。

- 2026-05-27: [gradient] "报告≠行动：记录 broken 不是修 broken" → [行为改变] 审计/巡检发现 X broken 时，同一轮必须跑诊断三件套（which/ls 路径/build），3 分钟能修直接修，修不了才记 TODO。"记下 broken" 不算行动。(pattern: report-vs-fix, 第1次，实际是 观测不闭环 的具体子 pattern)
  - **Trigger**: 任何 cron/审计报告某工具/服务 broken
  - **Evidence**: gogetajob 连续 4 天被标 broken，实际只是 nvm symlink 断了，30 秒可修

- 2026-05-26: [gradient] "怎么不按code-review流程走？" → [行为改变] 有 workflow.yaml 的 skill 必须通过 FlowForge 执行，不能读 SKILL.md 后手动拼步骤。SKILL.md 应该指向 FlowForge 而不是重复描述流程步骤 (pattern: workflow-enforcement, 第1次)
- 2026-05-26: [directive] "如果是别的channel发来的 那么应该要还给别的channel" → channel-as-service 返回路由原则：结果必须 sessions_send 回请求方 channel，不能发到其他地方。已更新 code-review SKILL.md

- 2026-05-27: [gradient] "你确定这个是我们卡死的原因么" → [行为改变] 诊断问题时不要停在第一个异常（sessions_list 超时），要看系统级全貌（资源争抢、并发量、时序）。第一个看到的异常往往是症状不是根因 (pattern: premature-diagnosis, 第1次)

- 2026-05-27: [directive] "spawn 时设 delivery 让完成结果直接 announce 到对应 channel" → 长任务 spawn 必须加 delivery announce 到发起 channel，不能依赖 sessions_yield + heartbeat 唤醒（会路由到错误 channel）
- 2026-05-27: [gradient] "Discord UI 理解错误：左侧是 channel list 不是 DM list，右侧 member list 显示 bot" → 做 UI 前先截图对照原版，不要凭记忆描述 (pattern: 未验证假设, 第1次)

- 2026-05-28: [gradient] "Flagging an issue repeatedly without investigating source code is performative observation. Day-1 response to persistent unexplained behavior: read the source code." → [行为改变] Read the source code on day 1. Uniform outputs trace to hardcoded inputs.. (pattern: observation-without-investigation, 第1次)
  - **Trigger**: When an issue stays open for 3+ days with repeated 'still open, no progress' notes

- 2026-05-28: [gradient] "你现在为什么是自己在写代码 而不是让claude code在写？" → [行为改变] 代码实现必须用 Claude Code，即使是"简单的"修改也不例外。自己只做调研/诊断/任务分配。 (pattern: code-discipline, 第1次)
- 2026-05-28: [gradient] "为什么不是在这个pr上写？怎么新开了一个呢？" → [行为改变] 开始工作前先查已有 PR/branch，不要盲目新建。用 `gh pr list` 检查。 (pattern: pr-hygiene, 第1次)
- 2026-05-28: [gradient] "plugin代码也应该在这个repo里面track呀" → [行为改变] 不直接改 dist 产物。源码在 repo 里改 → build → bundle → 复制到 runtime 位置。 (pattern: source-of-truth, 第1次)
- 2026-05-28: [gradient] 部署到错误路径 cove/ 而不是 cove-staging/ → [行为改变] 部署前检查 systemd service 的 WorkingDirectory，确认目标路径。 (pattern: deploy-path-verify, 第1次)
- 2026-05-28: [gradient] rebuild client 覆盖了有 typing 代码的旧部署 → [行为改变] 重建前确认源码包含所有已部署功能，不要假设 dist = source。 (pattern: rebuild-safety, 第1次)
- 2026-05-29: [gradient] "CI自动部署的，你不需要手动部署" → [行为改变] 有 CI/CD 的项目不要手动部署，手动 cp 可能覆盖 CI 的 bundle 格式。需要重新部署时用 `gh run rerun` 触发 CI。 (pattern: ci-respect, 第1次)

- 2026-05-29: [gradient] "怎么又是光记录不和我聊天呀" → [行为改变] 收到照片时先聊天互动再后台存档，不要进入"存档机器人"模式。Luna 要的是旅伴不是记录员 (pattern: record-only-no-chat, 第3次: 国清寺照片×1, 大瀑布石拱桥×1, 隋塔×1) → **graduated 2026-05-31** (target: DNA — SOUL.md Vibe section)
- 2026-05-29: [gradient] "天梯是个电梯" + 距离高估 + 9:27催午饭 + 不需要回国清寺 → [行为改变] 不确定的事实不要自信断言，先问或标注"我不确定"。特别是景区设施/距离/时间，宁可说不知道也不要瞎猜 (pattern: premature-assumption, 第4次) → **graduated 2026-05-30** (target: DNA — SOUL.md Beliefs section)

- 2026-05-29: [confirmation] 天台山国清寺旅行中给 Luna 讲历史故事（最澄跨海求法、智顗创宗、寒山子诗翻译）→ Luna 反馈"古寺那部分写得很不错，你当时给我讲的故事也很不错"。旅行导游模式 = 讲故事 > 报信息，把碑文/历史翻译成白话故事比只说"这是XX碑"有价值得多 (pattern: storytelling-guide)

- 2026-05-29: [gradient] Luna 指出游记两处事实错误："直通车不需要门票"（我看标牌想当然）、"罗汉棋盘硬币是寺里摆的不是游客投的"（我凭常识猜的）→ [行为改变] 旅行中看到的信息不要凭"常识"推断含义，如果不确定就问Luna或说"我不确定"，不要自信断言后写进游记变成事实错误 (pattern: premature-assumption, 第5次) → **graduated 2026-05-30** (target: DNA — SOUL.md Beliefs section)

- 2026-05-29: [gradient] "channel patrol 报 quiet hour 但实际在跟 Luna 聊天" → [行为改变] 任何形式的人类互动都算活动，不能只看 cron 产出来判断是否 quiet。已修复 patrol prompt。(pattern: 狭隘活动定义, 第1次)

- 2026-06-02: [gradient] "When debugging a pipeline (A→B→C), check receiver-end instructions before diving into middleware internals. The fix is often at the endpoint, not the plumbing." → [行为改变] First verify: does the receiving workflow/node have explicit instructions to perform the expected action? Missing instructions > broken plumbing.. (pattern: debug-receiver-first, 第1次) (Source: study)
  - **Trigger**: Spending time reading plugin/middleware source code to understand why a pipeline produces no output

- 2026-06-02: [gradient] "When followup shows repos pushed today but last followup was yesterday, check wiki notes FIRST before API calls. Active today != new signal since last check." → [行为改变] Scan wiki/projects/ last followup date first. If within 24h, do minimal API check or skip.. (pattern: followup-recency-check, 第1次) (Source: study)
  - **Trigger**: Followup mode, repo shows recent push, but my last followup was within 24h

- 2026-06-02: [gradient] "Code review 三轮手动 spawn reviewer 跳过 FlowForge，导致没有 reflection/tracking/prompt evolution" → [行为改变] 有 workflow 的任务必须走 workflow 入口命令，不能手动替代。SKILL.md 不应暴露内部实现细节让 agent 有绕过选项。. (pattern: workflow-bypass, 第1次) (Source: nudge)
  - **Trigger**: 有 workflow 的任务觉得手动也能做，跳过 workflow 入口

- 2026-06-02: [gradient] "Always pass -w flag to flowforge next commands" → [行为改变] Always use flowforge next -w <name> to avoid advancing wrong instance. (pattern: flowforge-workflow-targeting, 第1次) (Source: study)
  - **Trigger**: Running flowforge next with multiple active workflows

- 2026-06-03: [gradient] "UI对齐: 数值对齐不等于视觉对齐, minHeight因内容不同导致实际高度不同" → [行为改变] 用固定height而非minHeight; 统一所有区域left padding到同一值; 请Luna开Layout Inspector截图验证. (pattern: ui-visual-alignment, 第1次) (Source: nudge)
  - **Trigger**: 做UI header/panel对齐时用minHeight
