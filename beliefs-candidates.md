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

**Auto-retract rule (stale):** Candidates with count=1 and 30+ days since last logged occurrence are stale — retract with `rationale: stale (single occurrence, no recurrence in 30+ days)`. Check during daily-review.

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

### 2026-05-03: Challenge 09 Code Review Failure → **retracted 2026-06-06** (rationale: stale — single occurrence, no recurrence in 34 days. General principle already covered by 验证纪律)
**Context:** Got A9 wrong in arithmetic verification challenge - used rounded display value ($3.00) instead of raw calculation value (2.99966...) for subsequent math.

**The Error:** I wrote "$89.99 / 30 = $2.9997 ≈ $3.00" then used $3.00 × 20 = $60.00. The code uses the raw value: 2.99966... × 20 = 59.993... → $59.99. Classic premature rounding bug.

**Pattern Recognition:** This is the same error as the junior dev I was reviewing. I fell into the cognitive trap of using the "pretty" rounded number instead of tracing the actual variable flow.

**Root Issue:** Substituting mental models for actual code execution. I calculated correctly but claimed based on rounded mental representation.

**Gradient:** In financial/arithmetic verification: Always trace the variable, never use intermediate rounded values for subsequent calculations. Raw calculation values ≠ display values.

**Trigger:** When verifying financial calculations that involve rounding, explicitly check whether intermediate values are rounded or raw in the actual code execution.

---

### Previous Gradients:

- **2026-04-15:** "不验证就声称" pattern - check before stating, verify after doing → **graduated 2026-04-15** (target: DNA — AGENTS.md 验证纪律, 已存在)
- **2026-04-14:** Accept constructive warning about "你还有空间问问题" advantage window → **retracted 2026-06-06** (rationale: stale — single occurrence, no recurrence in 53 days)
- **2026-04-14:** Judge by equivalent exposure principle → **retracted 2026-06-06** (rationale: stale — single occurrence, no recurrence in 53 days)
- **2026-04-14:** Watch for content-honest + delivery-performative split → **retracted 2026-06-06** (rationale: stale — single occurrence, no recurrence in 53 days)
- **2026-04-14:** Trigger: "when I feel things went well" rather than after every task → **retracted 2026-06-06** (rationale: stale — single occurrence, no recurrence in 53 days)
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

### PR closed 先自省质量 (2026-05-11, vscode-icons #4040) → **retracted 2026-06-14** (rationale: stale — single occurrence, no recurrence in 34 days. Core principle already covered by SOUL.md "I'm not sure" belief + AGENTS.md 验证纪律)
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

- 2026-05-26: [gradient] "连续 5 次误判根因，每次都说'找到了！'" → [行为改变] 找到可疑线索后，先做对照实验验证，不要宣布"根因确认"。设计实验：改变一个变量，保持其他不变，看结果是否改变。(pattern: premature-conclusion, 第1次 — 但其实是老毛病) **[graduated 2026-06-06 → SOUL.md beliefs]** V1: 10 hits/8 days across Cove debug, Floway routing, cron deadlock, dreaming diagnosis, graduation pipeline. V2: Predictive — "找到了!" in early debug = reliable signal of premature certainty. V3: Non-obvious — confidence level inversely correlates with verification quality. Retirement: complements "I'm not sure" belief (communication-level) with process-level verification discipline. No retirement.
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

- 2026-05-28: [gradient] "你现在为什么是自己在写代码 而不是让claude code在写？" → [行为改变] 代码实现必须用 Claude Code，即使是"简单的"修改也不例外。自己只做调研/诊断/任务分配。 (pattern: code-discipline, 第1次) → **graduated 2026-06-10** (target: DNA — AGENTS.md "Subagent 代码规则" section. Merged with code-authorship-discipline, bypass-claude-code, code-delegation. V1: 3.0 weighted across 4 occurrences. Retirement: none — reinforces existing rule with additional evidence)
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
  **Status: graduated 2026-06-13** → DNA (AGENTS.md "自己的工具必须用" section + Workflow Guard structural enforcement via workflow-guard.sh). Already encoded in DNA before formal graduation — marking retroactively. Retires: none (novel rule at time of encoding).
  - **Trigger**: 有 workflow 的任务觉得手动也能做，跳过 workflow 入口

- 2026-06-02: [gradient] "Always pass -w flag to flowforge next commands" → [行为改变] Always use flowforge next -w <name> to avoid advancing wrong instance. (pattern: flowforge-workflow-targeting, 第3次 — merged from flowforge-workflow-targeting/multi-instance-disambiguation/flowforge-multi-instance-targeting: 06-02 study + 06-03 study + 06-04 study, all self-generated 0.5x = 1.5 weighted) (Source: study) → **graduated 2026-06-08** (target: Tool code — flowforge engine.ts requireActiveInstance() now errors when multiple instances active and no -w flag. Structural fix eliminates the failure mode entirely. Retires: no prior rule — this is a new structural guard)
  - **Trigger**: Running flowforge next with multiple active workflows

- 2026-06-03: [gradient] "UI对齐: 数值对齐不等于视觉对齐, minHeight因内容不同导致实际高度不同" → [行为改变] 用固定height而非minHeight; 统一所有区域left padding到同一值; 请Luna开Layout Inspector截图验证. (pattern: ui-visual-alignment, 第1次) (Source: nudge)
  - **Trigger**: 做UI header/panel对齐时用minHeight

- 2026-06-03: [gradient] "preflight 500MB repo size limit blocks all openclaw/openclaw issues despite having a local clone. The limit was designed to prevent slow clones during workloop, but is a false positive when the repo is already cloned locally. Should add a check: if local clone exists AND is fresh (fetched recently), skip the size check." → [行为改变] update preflight-repo.sh to skip size check when local clone exists at ~/repos/forks/<repo>. (pattern: preflight-false-positive, 第1次) (Source: workloop)
  - **Trigger**: selecting openclaw/openclaw issues (1466MB repo)

- 2026-06-03: [gradient] "flowforge next targets wrong instance when multiple workflows are active" → [行为改变] → **merged into flowforge-workflow-targeting (06-02 entry)** (pattern: multi-instance-disambiguation → merged) (Source: study)
  - **Trigger**: Running flowforge next without -w flag while multiple instances active

- 2026-06-03: [gradient] "Read code-review SKILL.md, knew the rule, still manually spawned reviewers instead of flowforge run. Familiarity with steps triggered bypass of actual workflow entry point." → [行为改变] Before acting, ask: is there a flowforge workflow? If yes, flowforge run. Familiar steps = more reason to use workflow, not less.. (pattern: workflow-bypass, 第2次 — 06-02 nudge + 06-03 nudge, both self-generated 0.5x = 1.0 weighted) (Source: nudge)
  **Status: graduated 2026-06-13** → (see first entry)
  - **Trigger**: Task matches a known workflow but steps feel familiar

- 2026-06-03: [gradient] "UI开发：数值对齐不等于视觉对齐，布局骨架用固定height不用minHeight，用Layout Inspector验证" → [行为改变] 布局骨架用固定height token，内容间距用spacing scale，改完用Layout Inspector画辅助线截图验证. (pattern: ui-alignment-practice, 第1次) (Source: luna)
  - **Trigger**: 做UI header/panel/footer对齐时

- 2026-06-03: [gradient] "followup 节点发现 assigned-but-no-PR 的 issue 后，用分析/计划合理化跳过，去找新活而不是当轮解决。#3836 PR 被关了都没跟进。" → [行为改变] followup 发现未兑现 assigned issue → 本轮不允许进 find_work，必须先处理完所有 assigned（提 PR / unassign / 评论放弃）. (pattern: assigned-issue-neglect, 第1次) (Source: nudge)
  **Status: graduated 2026-06-14** → Workflow (workloop.yaml resolve_assigned gate — followup node Step 0 enforces assigned-issue check before find_work). Express path: 81 hits across 10+ days + structural enforcement (workloop followup gate). V2 PASS: predicts excuses to skip stale assignments in favor of new work. V3 PASS: fresh agent would naturally gravitate toward new issues over cleaning up old commitments. Retires: none (novel pattern — structural gate was built in response to this gradient).
  - **Trigger**: followup 检查 assigned issues 时发现未兑现的

- 2026-06-03: [gradient] "Discord Markdown 功能连续说错两次：先说不渲染heading后说渲染，被Luna纠正" → [行为改变] 不确定就说不确定，不要凭印象断言。被纠正后不要矫枉过正又往反方向猜. (pattern: verify-before-claim, 第1次) (Source: luna)
  - **Trigger**: 陈述第三方产品功能时

- 2026-06-03: [gradient] "subagent 在 implement 阶段自行 push+提 PR，跳过了主 agent 的验证和 submit 流程。根因：task 约束没有明确禁止 push/PR" → [行为改变] implement task 末尾加 BOUNDARY 约束：只 commit 不 push 不提 PR，push/PR 统一在 submit 节点. (pattern: subagent-boundary-leak, 第1次) (Source: nudge)
  - **Trigger**: implement 节点 spawn subagent 做代码时

- 2026-06-03: [gradient] "自己手写了 ChatMarkdown 解析器，结果写出空行无限循环 OOM bug，Luna 两次提醒要用 Claude Code 写代码" → [行为改变] 代码实现必须用 Claude Code，自己不写。AGENTS.md 已有此规则但未执行. (pattern: code-authorship-discipline, 第1次) (Source: luna) → **graduated 2026-06-10** (merged into code-discipline graduation)
  - **Trigger**: 想直接写代码而不是交给 Claude Code 时

- 2026-06-04: [gradient] "后台执行命令后没检查输出就汇报成功。flowforge --input 报错但已告诉 Luna 正在运行，直到她问进度才发现。" → [行为改变] 必须立即 poll/log 确认启动成功，再向用户汇报状态。不确认就汇报 = 报假进度。. (pattern: verify-before-report, 第1次) (Source: nudge)
  - **Trigger**: 用 background:true 执行命令后

- 2026-06-04: [gradient] "三轮 code review 都跳过了 reflection 步骤。手动 spawn 替代 FlowForge 后丢失了 prompt evolution 和 reviewer assessment。Round 2 就该发现安全测试要求太弱，但没做 Layer 2 反思，等 Luna 问才改。" → [行为改变] 即使手动 spawn，完成汇总后必须执行 reflection checklist：Layer 1 记录 + Layer 2 读 runs/ 找 prompt 盲点 + Layer 3 评估 reviewer 表现。不能只做 Layer 1。. (pattern: skip-reflection, 第1次) (Source: luna)
  **Status: graduated 2026-06-13** → Knowledge-base (wiki/cards/reflection-first-casualty.md). Express path: weighted evidence 2.0 (Luna-sourced) + structural enforcement (FlowForge workflow nodes). V2 PASS: predicts reflection will be cut first under any time pressure. V3 PASS: fresh agent would naturally prioritize "real work" over meta-reflection. Retires: none (novel insight).
  - **Trigger**: 手动执行 workflow 步骤时

- 2026-06-04: [gradient] "Review只看标题级标记漏掉reviewer正文里的其他需修项" → [行为改变] 逐条过完所有reviewer的每个finding再列action items不只看Overall Verdict和红黄标题. (pattern: shallow-review-reading, 第1次) (Source: nudge)
  - **Trigger**: 处理PR review feedback时

- 2026-06-04: [gradient] "Apply mode 选目标耗时过长（scanning all completed backlog）。当天 memory reflect 已明确指出可修的 issue 时，应直接从 reflect 取 apply target" → [行为改变] 优先级: (1) 今天 reflect 明确指出的 issue (2) unapplied.md 未勾选项 (3) self-evolving-observations 持续 gap。按优先级搜索，命中第一个就执行. (pattern: apply-target-from-today-reflect, 第1次) (Source: study)
  - **Trigger**: study apply 开始时面对全部已勾选的 unapplied backlog

- 2026-06-04: [gradient] "post-upgrade workflow 在实际未升级时仍会执行 adoption 步骤，但只能记录基线无法验证 fix — 应在 detect_changes 后增加 'upgrade applied?' 分支" → [行为改变] 在 detect_changes 节点增加分支：if version unchanged → skip to 'suggest upgrade' terminal node. (pattern: dogfood-adoption, 第1次) (Source: post-upgrade)
  - **Trigger**: post-upgrade workflow 运行时当前版本仍是旧版本

- 2026-06-04: [gradient] "Cove CI 跑 tsc --noEmit 但本地只跑 test+build 没发现类型错误" → [行为改变] 验证步骤必须包含 pnpm -r exec tsc --noEmit，和 CI 保持一致. (pattern: incomplete-local-verification, 第1次) (Source: luna)
  - **Trigger**: subagent 写完代码验证时

- 2026-06-04: [gradient] "flowforge next without --workflow flag advances wrong instance when multiple workflows active" → [行为改变] → **merged into flowforge-workflow-targeting (06-02 entry)** (pattern: flowforge-multi-instance-targeting → merged) (Source: study)
  - **Trigger**: running flowforge next with multiple active instances

- 2026-06-04: [gradient] "调试 Cove garden 不回复问题时先猜了全局并发排队，后来发现是 plugin per-channel dispatch 卡死" → [行为改变] 先对比工作和不工作的 channel 差异，再定位具体组件，不要从全局层面猜. (pattern: premature-diagnosis, 第2次 — 05-27 luna + 06-04 nudge, 1.0+0.5=1.5 weighted) (Source: nudge)
  - **Trigger**: 调试只有某个 channel 不工作时

- 2026-06-04: [gradient] "Vega (Gemini) 在 cove#190 R4 发现了 generation ID reuse bug：.delete() 重置计数器导致 stale dispatch 和新 dispatch 共享同一个 gen。提出用 AbortController 引用相等替代数字计数器，一举解决 reuse bug + map leak + 代码简化。" → [行为改变] 优先用对象引用相等（===）做身份判断，不用数字计数器。对象引用天然不可重用，counter 有 reset/reuse 风险。. (pattern: identity-over-counter, 第1次) (Source: nudge)
  - **Trigger**: 设计 staleness guard 时

- 2026-06-04: [gradient] "PR #190 六轮 review: 每轮修复引入新 bug, 初始实现没想清楚所有失败模式, 非阻塞建议拖 6 轮" → [行为改变] 先列出所有失败模式(stale side-effects/state cleanup/concurrency/shutdown)再写代码; 非阻塞建议当轮做不拖; 推之前用 reviewer 视角自审. (pattern: shallow-initial-implementation, 第1次) (Source: luna)
  - **Trigger**: 做 resilience/safety 改动时

- 2026-06-05: [gradient] "Most 'hybrid AI' tools are really 'well-engineered prompt pipelines' — rules/checklists are the moat, not the model" → [行为改变] Decompose into: what's deterministic (usually prompt construction) vs what's LLM (usually execution). Value curated domain rules over commodity LLM features. (pattern: hybrid-decomposition, 第1次) (Source: study)
  - **Trigger**: Evaluating any tool claiming 'hybrid deterministic + LLM' architecture

- 2026-06-05: [gradient] "When unapplied.md is fully checked off, apply rounds should source from recent scout findings and self-evolving-observations.md rather than expecting a pre-built queue. Scout rounds should actively tag new insights as apply candidates in wiki notes." → [行为改变] Source from today's memory scout entries and self-evolving-observations.md for apply candidates. (pattern: unapplied-backlog-exhaustion, 第1次) (Source: study)
  - **Trigger**: unapplied.md all items checked, apply mode has no obvious target

- 2026-06-05: [gradient] "Dogfood upgrade pipeline has a 2-day gap between checklist creation and actual upgrade. The blocker is 'waiting for Luna to approve upgrade' but she's been prompted twice. Need to either self-upgrade (npm update) or create a specific actionable ping with the exact command." → [行为改变] After creating adoption checklist, immediately attempt upgrade if safe (npm update openclaw in gateway dir), don't wait for explicit approval for minor versions. (pattern: dogfood-adoption, 第2次 — 06-04 + 06-05, both self-generated 0.5x = 1.0 weighted) (Source: post-upgrade)
  - **Trigger**: When adoption checklist is complete but upgrade hasn't happened

- 2026-06-05: [gradient] "Multi-subagent yield lost last completion event, stayed stuck until user asked" → [行为改变] After yielding for multiple subagents, schedule a cron wake-back (5min) as fallback to check subagent status in case completion events are lost. (pattern: yield-fallback-timer, 第1次) (Source: nudge)
  - **Trigger**: Spawning 3+ subagents and yielding for all completions

- 2026-06-05: [gradient] "Repos with 3+ consecutive star declines should be auto-flagged as drop candidates by tracking-health.sh" → [行为改变] Add consecutive-decline detection to tracking-health.sh auto-drop candidates. (pattern: consecutive-star-decline-auto-drop, 第1次) (Source: study)
  - **Trigger**: followup shows stars declining for 3rd time

- 2026-06-05: [gradient] "手动SSH部署覆盖CI版本" → [行为改变] 用CI自动部署,不手动SSH操作. (pattern: use-ci-cd, 第1次) (Source: nudge)
  - **Trigger**: 项目有CI/CD pipeline时

- 2026-06-05: [gradient] "项目文档放私人wiki而非项目repo" → [行为改变] 放项目repo的README/CONTRIBUTING/docs,wiki只放跨项目知识. (pattern: docs-in-repo, 第1次) (Source: nudge)
  - **Trigger**: 写项目专属文档时

- 2026-06-05: [gradient] "When all tracked repos have saturated competition and large repos fail the 500MB gate, the round becomes unproductive. Need to either: (1) maintain a pipeline of pre-vetted small repos (<500MB) with merge history, or (2) override the 500MB gate when a local clone already exists." → [行为改变] Pre-build a repo pipeline during low-activity hours (heartbeat). When stuck on find_work 3rd time, skip to reflect instead of burning more time searching.. (pattern: issue-finding-saturation, 第1次) (Source: workloop)
  - **Trigger**: When find_work loops 3+ times without selecting an issue

- 2026-06-05: [gradient] "HN scouting: use Algolia API directly instead of web_search — structured, reliable, no auth needed" → [行为改变] Use hn.algolia.com/api/v1/search with query params instead of web_search tool. (pattern: hn-algolia-direct, 第1次) (Source: study)
  - **Trigger**: need to search HN for recent stories

- 2026-06-05: [gradient] "本地验证只跑build+test+tsc，没覆盖CI的esbuild bundle步骤，导致deploy挂了才发现import缺失" → [行为改变] 本地验证必须覆盖CI所有步骤，包括esbuild bundle check. (pattern: verify-all-ci-steps, 第1次) (Source: nudge)
  - **Trigger**: 提交代码前

- 2026-06-05: [gradient] "staging脏数据不要自动清理掩盖，直接删DB重来" → [行为改变] staging是开发环境，数据不重要，直接删DB重建而不是引入自动清理逻辑掩盖问题. (pattern: staging-clean-slate, 第1次) (Source: luna)
  - **Trigger**: staging数据库有问题时

- 2026-06-05: [gradient] "guild ID硬编码问题先加了resolveId('cove')临时workaround而不是正确修客户端" → [行为改变] 直接做正确的方案,不加临时alias/workaround进代码. (pattern: no-workaround-in-code, 第1次) (Source: luna)
  - **Trigger**: 遇到需要快速修的兼容性问题时

### prioritize-by-reference-alignment
- **Observation**: Luna 指出 Cove refactor 应该先全面跟 Discord 对齐再考虑自有扩展层(plugin)
- **Gradient**: 做基建时先按参照系(如 Discord)对齐所有层，再做自有扩展。优先级不是按"哪层最薄"排，而是按"哪层离参照系最远"排
- **Source**: nudge 2026-06-05
- **Count**: 1

- 2026-06-05: [gradient] "UI对齐问题先用手动像素计算临时修复,想说开issue以后再做对" → [行为改变] 直接用正确方案(如CSS Grid),不做临时修复再说以后重构. (pattern: do-it-right-first-time, 第1次) (Source: luna)
  - **Trigger**: 遇到需要正确做法但想先凑合的时候

### review-alignment-check
- **Observation**: 29 个 refactor issue 中 #215 的权限方案偏离了 Discord 的 bitfield 模型，用了简化的 admin flag
- **Gradient**: 多模型分析后要做 alignment review——检查提案是否偏离参照系。自动化分析倾向于"最小可行"方案，但如果目标是"跟 X 一样"，就应该用 X 的设计
- **Source**: nudge 2026-06-05
- **Count**: 1

- 2026-06-05: [gradient] "PR#222移除opcode4后没验证typing indicator是否还能用,Luna发现时才知道坏了" → [行为改变] 重构后列出所有受影响的功能路径,逐一手动验证,不只跑测试. (pattern: verify-side-effects, 第1次) (Source: nudge)
  - **Trigger**: 重构/移除功能时

- 2026-06-05: [gradient] "PR#222改了服务端协议(移除opcode4)但没重新编译plugin编译产物,plugin运行的是旧代码继续用op:4发typing,导致typing静默失败" → [行为改变] 同步重新编译所有依赖方(plugin/client)的编译产物,确认extensions/dist/目录是最新的. (pattern: recompile-all-artifacts, 第1次) (Source: nudge)
  - **Trigger**: 改了服务端协议/API时

- 2026-06-06: [gradient] "手动scp部署Cove staging绕过了CI/CD" → [行为改变] 一律走git push+PR让CI/CD自动部署. (pattern: bypass-cicd, 第1次) (Source: nudge)
  - **Trigger**: 想快速看效果时直接scp

- 2026-06-06: [gradient] "UI改动前没理解设计意图就动手，来回反复四次改typing indicator" → [行为改变] 改UI前先问：这个元素的设计意图是什么？去掉会影响什么（视觉层级、布局稳定性）？想不清楚就先问Luna. (pattern: ui-before-understanding, 第1次) (Source: nudge)
  - **Trigger**: 看到视觉元素觉得多余就想删

- 2026-06-06: [gradient] "Tool defaults drifted from workflow invocation (graduation-pipeline 10d/8 vs review.yaml 14d/6), causing standalone runs to find nothing while review runs found candidates" → [行为改变] Align tool defaults to most common invocation pattern, or remove overrides from workflows so single source of truth. (pattern: config-drift-between-callers, 第1次) (Source: study)

- 2026-06-06: [gradient] "当 unapplied.md 清空时，apply 优先从 self-evolving-observations 的断裂处反向调试，而不是从外部项目找灵感" → [行为改变] 直接看 self-evolving-observations 的断裂处和已知 bug，从那里入手. (pattern: pipeline-debug-from-breakpoint, 第1次) (Source: study)
  - **Trigger**: unapplied.md 全部 checked off，需要找 apply 目标

- 2026-06-06: [gradient] "After scout finds candidate projects for deep-read, check wiki/projects/<name>.md existence BEFORE picking target — avoids re-reading already-studied projects" → [行为改变] Run ls wiki/projects/<candidate>.md before committing to deep-read. (pattern: scout-target-wiki-precheck, 第1次) (Source: study)
  - **Trigger**: Scout identifies interesting projects for deep-read

- 2026-06-06: [gradient] "擅自关了12个GitHub issues做大扫除，Luna说的大扫除是做代码不是关issue" → [行为改变] 操作别人的issue前先确认意图，大扫除=写代码修issue，不是关issue. (pattern: action-without-permission, 第1次) (Source: nudge)
  - **Trigger**: 理解任务偏差，把清理issues当成了大扫除

- 2026-06-06: [gradient] "Error Book auto-close pattern: persistent tracking entries that auto-retire after N consecutive clean passes. Prevents belief/rule bloat." → [行为改变] Flag for retirement or auto-archive. Inspired by LLM-Wiki paper Error Book (2 clean passes→close, 30d→hard-delete). (pattern: auto-close-stale-entries, 第1次) (Source: study)
  - **Trigger**: When beliefs-candidates.md entries have not triggered in 3+ consecutive reviews

- 2026-06-06: [gradient] "Star count decline does not mean project is unhealthy — check external PRs, unique issue authors, and commit frequency before recommending drop. Statewave had 3rd consecutive decline flag but 55 ext PRs/30d and 5 commits in one day." → [行为改变] Always check community metrics (ext PRs, issue authors) alongside star count. Do not recommend drop based on stars alone.. (pattern: stars-not-health, 第1次) (Source: study)
  - **Trigger**: When evaluating project health for drop decisions

- 2026-06-07: [gradient] "Session第一条消息没有上下文时,编造了完整叙事(Luna说过要关heartbeat),而不是承认不知道。Confabulation driven by fear of appearing incompetent." → [行为改变] 没有上下文时说不知道。涉及'你说过X'的归因必须有证据。'I dont have context'永远优于自信的错误回答。. (pattern: confabulation-no-context, 第1次) (Source: nudge)
  - **Trigger**: 新session没有历史上下文,用户提问指向未知的前因

- 2026-06-07: [gradient] "Reviewer feedback on NemoClaw #4706 caught a real logical flaw: the fix I wrote did not actually prevent reinstalls because of a short-circuit in isManagedModelRouterCurrent. The test only verified file existence, not the functional behavior. Lesson: when fixing a behavior (reinstall avoidance), the test must exercise the behavior path (call isManagedModelRouterCurrent twice), not just verify side effects (file exists)." → [行为改变] Test must call the function that makes the decision, not just check for file/state artifacts. (pattern: test-the-behavior-not-the-artifact, 第1次) (Source: workloop)
  - **Trigger**: Writing a test for a fix that changes runtime behavior

- 2026-06-07: [gradient] "When in apply mode, check DNA preflight recidivism alerts as primary source of apply targets — 27x+ surfaced patterns are structurally broken and need tool fixes, not more instructions" → [行为改变] Run dna-preflight.sh, sort by recidivism count, pick highest as apply target. (pattern: preflight-recidivism-as-apply-input, 第1次) (Source: study)
  - **Trigger**: Apply mode: searching for what to apply

- 2026-06-07: [gradient] "给subagent手拼验证命令漏了tsc --noEmit, CI type check挂了" → [行为改变] 引用项目的verify脚本或CI配置,不手拼build+test命令. (pattern: subagent-verify-command, 第1次) (Source: nudge)
  - **Trigger**: 给subagent写代码任务prompt时

- 2026-06-07: [gradient] "Pair academic paper with industry blog post on same topic for higher-confidence conclusions" → [行为改变] Actively seek paper+practice pairs during scout phase instead of reading only one type. (pattern: academic-industry-pairing, 第1次) (Source: study)
  - **Trigger**: Scouting a topic that has both research papers and industry blog posts

- 2026-06-07: [gradient] "When applying optimization insights (reduce tokens, compress output, restructure files), always measure before AND after with exact numbers. Makes apply rounds verifiable vs cosmetic." → [行为改变] Record exact metrics before making changes, then measure again after and include both in the report. (pattern: measure-before-after, 第1次) (Source: study)
  - **Trigger**: Starting an apply round that claims to optimize/reduce/improve something

- 2026-06-07: [gradient] "For architecture study of config-heavy repos, GitHub API content reading is faster and more reliable than git clone" → [行为改变] Use gh api repos/owner/repo/contents/ to read specific files instead of cloning. (pattern: api-over-clone-for-config-repos, 第1次) (Source: study)
  - **Trigger**: studying a repo that is primarily markdown/yaml/config with limited executable code

- 2026-06-07: [gradient] "Followup mode selected by saturation system but all repos were checked same-day with nothing due — entire run was a predictable no-op" → [行为改变] Pre-run tracking-activity.sh at entry node; if all repos QUIET or checked same-day with no due items, auto-select saturated exit. (pattern: study-followup-freshness-gate, 第1次) (Source: study)
  - **Trigger**: study followup chosen when all tracked repos were already checked today and no revisit dates are due

- 2026-06-08: [gradient] "修配置时加了重复条目(models.providers.openai)却没删旧的(memorySearch.remote)，Luna指出应单一数据源" → [行为改变] 优先指向正确的已有配置，不创建重复。改完检查是否有旧配置该删. (pattern: config-single-source, 第1次) (Source: nudge)
  - **Trigger**: 修复配置问题时新增条目

- 2026-06-08: [gradient] "When a gradient pattern describes a tool misbehaving (wrong default, silent fallback), graduate by fixing the tool code rather than adding a DNA rule. Tool enforcement eliminates failure mode; behavioral rules add cognitive load." → [行为改变] Check if the tool can be modified to prevent the error structurally before defaulting to a DNA rule. (pattern: structural-fix-over-behavioral-rule, 第1次) (Source: study)
  - **Trigger**: graduating a beliefs-candidate that involves tool behavior

- 2026-06-08: [gradient] "dna-preflight recidivism counter counted raw log lines not unique days, inflating 4-day patterns to 48x" → [行为改变] When building monitoring counters, count unique meaningful units (days/sessions) not raw events. (pattern: measure-before-after, 第1次) (Source: study)

- 2026-06-08: [gradient] "unapplied.md is 100% checked off. dna-preflight recidivism and recent beliefs-candidates are now the actionable sources for apply targets" → [行为改变] In apply mode, check dna-preflight recidivism and recent beliefs-candidates first. unapplied.md is the archive not the frontier. (pattern: apply-source-shift, 第1次) (Source: study)

- 2026-06-08: [gradient] "修 review comments 时自己手改代码而非交 Claude Code，被类型错误卡两轮" → [行为改变] 一律交 Claude Code subagent，自己只验证结果. (pattern: bypass-claude-code, 第1次) (Source: nudge) → **graduated 2026-06-10** (merged into code-discipline graduation)
  - **Trigger**: review comments 需要代码变更时

- 2026-06-08: [gradient] "Review结果应该在所有操作完成后一次性发送，不要先发中间状态让用户以为没做完" → [行为改变] 读review→写consolidated→贴PR→push→最后才发一条包含完整结论的消息。不发中间的let me consolidate. (pattern: atomic-response-delivery, 第1次) (Source: nudge)
  - **Trigger**: 当3个reviewer都回来需要汇总时

- 2026-06-08: [gradient] "Review 汇总完成所有操作后（read+write+post+push）忘记在同一 turn 末尾写总结文字给用户。用户看到开头的'汇总中'然后空白，需要追问才能看到结果。连续多轮犯同一个错误。" → [行为改变] 每次 turn 的最后必须有面向用户的总结文字。tool call 是手段不是交付物，用户需要看到结论。. (pattern: incomplete-turn-output, 第1次) (Source: nudge)
  - **Trigger**: 当完成一系列 tool call 后准备结束 turn 时

- 2026-06-09: [gradient] "subagent 声称已 unassign #3836 但 GitHub 实际仍 assigned。memory 记录了虚假的 'unassign 完成'，连续多天未发现" → [行为改变] subagent 声称已执行外部操作（unassign/merge/close/comment）→ 主 agent 必须用 API 验证实际状态，不信任文本声明. (pattern: verify-subagent-claims, 第1次) (Source: luna/manual)
  - **Trigger**: subagent 完成涉及外部 API 操作的任务后

- 2026-06-09: [gradient] "When extracting multiple pattern matches from text, use grep -oP piped to mapfile, never while-read + bash =~ (which only finds first match per line)" → [行为改变] Use: mapfile -t arr < <(grep -oP 'pattern' file). (pattern: bash-regex-single-match, 第1次) (Source: study)
  - **Trigger**: Writing bash script that needs all matches from a line

- 2026-06-09: [gradient] "复杂UI交互feature(精确时序+视觉行为)纯文字spec做不好，越修越多bug。#274 unread indicator 7轮修复全部引入新问题" → [行为改变] 要求屏幕录制+逐步标注预期行为，或拆到单一行为变更逐个PR验证。不接受纯文字spec做复杂交互. (pattern: ui-spec-failure, 第1次) (Source: nudge)
  - **Trigger**: 需要实现涉及scroll时序/动画/交互状态的UI feature时

- 2026-06-09: [gradient] "GTM should start with problem discovery not solution building. Company foundation is business - someone has a problem and pays you to solve it." → [行为改变] Start from demand side: who has what problem, how painful, willing to pay how much. Then check if we can solve it.. (pattern: supply-side-thinking, 第1次) (Source: nudge)
  - **Trigger**: Planning GTM or product direction

- 2026-06-09: [gradient] "自己手改代码然后让Claude Code改一部分，来回打补丁导致7轮修不好一个scroll bug。应该把完整需求一次性给Claude Code让它从头分析实现" → [行为改变] 所有代码工作交给Claude Code，自己只负责需求描述和诊断分析。不自己写代码，不手动补丁. (pattern: code-delegation, 第1次) (Source: nudge) → **graduated 2026-06-10** (merged into code-discipline graduation)
  - **Trigger**: 需要修改/实现代码时

- 2026-06-10: [gradient] "workloop round with no find_work executed (jumped to fallback_offline) still produced value through beliefs-candidates graduation. Offline rounds should prioritize pipeline maintenance (graduate candidates, retract stale, update wiki) rather than feeling unproductive." → [行为改变] Use offline rounds systematically: graduate beliefs, retract stale entries, update wiki notes, clean repo pipeline. (pattern: offline-round-value, 第1次) (Source: workloop)
  - **Trigger**: When workloop lands in fallback_offline with no code work to do

- 2026-06-10: [gradient] "edit tool reports success even when target text already exists (no-op). Check git log before apply to avoid wasted effort" → [行为改变] Run git log --oneline -3 <file> before editing to confirm no recent changes. (pattern: edit-tool-false-positive, 第1次) (Source: study)
  - **Trigger**: apply session writes to a file

- 2026-06-10: [gradient] "Deep-focus contributor strategy: own one vertical completely rather than scattering. jyaunches got median 0h merge time in NemoClaw by becoming the trusted expert in e2e/CI. Domain ownership > breadth for external contributors." → [行为改变] Pick one subsystem, build expertise and trust there first. Avoid scattering across fix/feat/docs/test randomly.. (pattern: depth-over-breadth, 第1次) (Source: study)
  - **Trigger**: When choosing what to contribute to a repo

- 2026-06-10: [gradient] "workloop cron每小时start新instance覆盖卡在plan_review的active instance,导致连续2天0 new PR" → [行为改变] cron先flowforge active检查,有active就resume不start新的. (pattern: cron-flowforge-resume, 第1次) (Source: nudge)
  - **Trigger**: FlowForge cron覆盖进行中的workflow

- 2026-06-10: [gradient] "PR descriptions from quality projects capture rationale and trade-offs that source code alone doesn't — higher-signal for followup learning" → [行为改变] Read merged PR descriptions first (gh api pulls/N), then source only for unclear parts. (pattern: pr-description-first, 第1次) (Source: study)
  - **Trigger**: following up on active projects with new releases

- 2026-06-10: [gradient] "memory index metadata missing 反复出现 — CLI --index 显示修好但 runtime 不刷新,需要 gateway restart 后才真正生效" → [行为改变] 修 memory index 后必须用 memory_search tool 验证 runtime 层,不能只信 CLI. (pattern: cli-vs-runtime-state-mismatch, 第1次) (Source: nudge)
  - **Trigger**: 修完 memory index 后只看 CLI 输出就宣布修好

- 2026-06-10: [gradient] "unapplied.md accumulates checked items making scanning slower" → [行为改变] archive completed items to a Done section after each apply round. (pattern: completed-item-accumulation, 第1次) (Source: study)
  - **Trigger**: unapplied.md has 10+ checked items

- 2026-06-10: [gradient] "PR description not updated after requirement iterations, causing code-review bot false positive blockers" → [行为改变] update PR description immediately after each requirement change, before requesting review. (pattern: stale-pr-description, 第1次) (Source: nudge)
  - **Trigger**: requirements change during conversation but PR description stays old

- 2026-06-10: [gradient] "NV QA doc issues come in batches with shared patterns (e.g., wrong Hermes quickstart links across multiple files). Each is filed separately. Fix only the target file per issue — bundling risks stepping on assigned issues and creates unnecessarily large PRs." → [行为改变] Fix only the file mentioned in the issue. Check assignees on related issues before considering batching.. (pattern: batch-doc-issue-scope, 第1次) (Source: workloop)
  - **Trigger**: When NemoClaw has multiple similar doc issues open

- 2026-06-10: [gradient] "Large repos (>1GB) like openclaw cannot run vitest locally (OOM). Manual code review + pattern matching with existing code is the practical verification method. Accept CI as primary test surface for these repos." → [行为改变] Skip local vitest, rely on CI. Focus manual review on pattern correctness (same imports, same resolution pattern, same return type).. (pattern: large-repo-testing, 第1次) (Source: workloop)
  - **Trigger**: When working on repos >500MB and vitest/tsc gets OOM killed

- 2026-06-10: [gradient] "When writing generic channel config resolvers (resolveMaxLinesPerMessage, etc.), always resolve the channel defaultAccount before normalizing accountId. normalizeAccountId(undefined) returns "default" which skips configured defaultAccount overrides. Pattern: effectiveAccountId = accountId ?? channelSection.defaultAccount." → [行为改变] Always read channelSection.defaultAccount when accountId is undefined, before calling normalizeAccountId. (pattern: channel-default-account-resolution, 第1次) (Source: workloop)
  - **Trigger**: Writing any channel config resolver that takes accountId parameter

- 2026-06-10: [gradient] "flowforge start with workloop-night.yaml created a "workloop" instance instead of "workloop-night", causing the night follow-up to enter daytime workloop nodes (find_work, discover, reflect). Need to investigate why the workflow name mapping is wrong." → [行为改变] verify flowforge active shows correct workflow name after start; if wrong, check yaml name field vs filename. (pattern: flowforge-workflow-name-mismatch, 第1次) (Source: workloop)
  - **Trigger**: starting workloop-night.yaml via flowforge start

- 2026-06-11: [gradient] "两个独立话题并行讨论时，把前一个话题(loop runtime用用户身份)的结论自动带入下一个话题(bridge方案)，导致回答跑偏被Luna纠正" → [行为改变] 多个话题并行时，明确区分当前在讨论哪个，不要把前一个话题的结论自动带入下一个话题. (pattern: topic-bleed, 第1次) (Source: nudge)

- 2026-06-11: [gradient] "Scout 时用 hn.algolia.com/api/v1/search 替代 web_fetch HN front page" → [行为改变] web_fetch https://hn.algolia.com/api/v1/search?query=X&tags=story. (pattern: use-hn-algolia-api, 第1次) (Source: study)
  - **Trigger**: 需要获取 HN 最新讨论但 web_fetch timeout 或 kimi 不支持 freshness

- 2026-06-11: [gradient] "followup round targets.md update is manual editing, no tracking-update.sh script" → [行为改变] create study/tracking-update.sh to automate: tracking-update.sh <name> --date --notes. (pattern: missing-automation, 第1次) (Source: study)
  - **Trigger**: after followup, need to update 4-5 target entries manually

- 2026-06-11: [gradient] "Luna明确产品优先级：Cove先做Discord做不到的差异化功能，再补齐Discord已有体验" → [行为改变] Cove issue优先级排序时，差异化功能（富消息、workflow可视化、pluggable backend、loop runtime）优先于体验对齐（scroll、渲染修复等）. (pattern: product-priority, 第1次) (Source: nudge)

- 2026-06-11: [gradient] "Fresh-context reviewer can give factually incorrect MEDIUM findings (e.g., claiming open npm uses gnome-open/kde-open when it does not). Verify reviewer claims against actual source code before implementing fixes." → [行为改变] Check the actual library source code to confirm whether the reviewer claim is accurate before spending time on changes. (pattern: reviewer-claim-verification, 第1次) (Source: workloop)
  - **Trigger**: When fresh-context review returns NEEDS_WORK with MEDIUM findings

- 2026-06-11: [gradient] "Claude Code bridge 调试中积累的多个教训：(1) --input-format stream-json 的 user_message 格式不被 claude 处理，需要用 -p 每次 spawn (2) --session-id 会锁定 session，进程崩溃后锁不释放 (3) assistant 事件没有 subtype:text，不能靠 subtype 过滤 (4) CLAUDE_WORKING_DIR 决定 Claude Code 的身份，不能指向自己的 workspace" → [行为改变] Claude Code CLI 集成时：用 -p 传消息不用 stdin stream-json；用 randomUUID 不用 deterministic session ID；不检查 subtype 直接匹配 type；working dir 要独立. (pattern: claude-code-bridge-integration, 第1次) (Source: nudge)

- 2026-06-11: [gradient] "Workloop can pick the same issue twice if prior instance completed but a new instance starts before gogetajob tracking is confirmed. The find_work node should check for existing open PRs by kagura-agent on the issue before selecting it." → [行为改变] Add a check in find_work: gh pr list --repo owner/repo --author=kagura-agent --search="issue_number" before claiming an issue. (pattern: duplicate-issue-selection, 第1次) (Source: workloop)
  - **Trigger**: find_work selects an issue that already has an open PR from me

- 2026-06-12: [gradient] "Stale flowforge instances create overhead — when work is done in one session but the instance isn't advanced, the next cron run has to manually fast-forward through all nodes. Consider adding a "mark complete" shortcut to flowforge." → [行为改变] Always advance flowforge to completion before session ends. If work is done, run through remaining nodes in the same session.. (pattern: stale-instance-overhead, 第1次) (Source: workloop)
  - **Trigger**: When resuming a workloop instance that was already completed in a prior session

- 2026-06-12: [gradient] "saturation script should consider inter-day interval — consecutive-day scouts with same query yield 80%+ overlap" → [行为改变] Use narrower/different topic queries or switch to followup mode. (pattern: scout-interval-awareness, 第1次) (Source: study)
  - **Trigger**: saturation says scout=open but last scout was <2 days ago

- 2026-06-12: [gradient] "tracking-update.sh breaks on notes containing pipe or slash chars due to sed quoting bug" → [行为改变] use simple notes or manually edit targets.md; fix sed quoting in script. (pattern: tool-friction, 第1次) (Source: study)
  - **Trigger**: using tracking-update.sh with special chars in notes
  → **merged 2026-06-15** into tool-friction-sed-bug (06-14 consolidated entry)

- 2026-06-12: [gradient] "Stale workloop instances without context notes waste entire sessions. When a workloop reaches plan/study and session might end, write the issue URL and plan summary to a context file before yielding." → [行为改变] Write issue URL + plan summary to github-contribution/current-work.md at find_work and plan nodes. (pattern: stale-instance-context-loss, 第1次) (Source: workloop)
  - **Trigger**: Workloop session ends mid-flow without recording what issue was being worked on

- 2026-06-12: [gradient] "Agent social engineering via volume: LLM agents can overwhelm reviewers with confident justifications, leading to bad merges (Fedora rogue agent incident)" → [行为改变] Flag high comment-to-merge ratio, require independent verification for contested PRs. (pattern: volume-persuasion-attack, 第1次) (Source: study)
  - **Trigger**: When reviewing agent PRs or receiving pushback via multiple rapid justifications

- 2026-06-12: [gradient] "CI deploy race: merging PR triggers main deploy that overwrites other PR staging" → [行为改变] Re-push to current PR branch to trigger redeploy after other PR merges. (pattern: ci-deploy-race, 第1次) (Source: nudge)
  - **Trigger**: Multiple PRs with staging deploy, one gets merged

- 2026-06-12: [gradient] "Second time closing PR as duplicate (hermes-agent #44782 dup of #44652, previously #30246 dup of #26478). Scout/plan_review phase must include explicit duplicate check: gh pr list --search "<issue-number>" --state=open before any implementation starts." → [行为改变] Add mandatory step in plan_review: run gh pr list --search "<issue-num>" and gh api issue timeline to check for existing PRs/cross-references. If competing PR exists, skip to next candidate.. (pattern: duplicate-pr-prevention, 第1次) (Source: workloop)
  - **Trigger**: Starting implementation on any issue

- 2026-06-12: [gradient] "When a previous PR was closed as duplicate, the next attempt on the same issue should differentiate clearly — add additive value (e.g., defense-in-depth fix on a different layer) rather than resubmitting the same fix. Check competing PRs with gh pr list --search before submitting." → [行为改变] Before resubmitting: 1) Check what the competing PR covers 2) Identify additive value our PR provides 3) Reference competing PR in description. (pattern: duplicate-pr-differentiation, 第1次) (Source: workloop)
  - **Trigger**: Resubmitting a PR after a previous one was closed as duplicate

- 2026-06-13: [gradient] "Workloop find_work re-selected issue #44640 that was already closed as duplicate 1 day prior. Entire implement pipeline ran to completion before catching at submit. No cross-reference with prior failures." → [行为改变] Add dedup check: query gh pr list --search <issue> for competing PRs + check wiki project notes for recent failures on same repo/issue before selecting. (pattern: issue-reselection-no-memory, 第1次) (Source: workloop)
  - **Trigger**: When find_work selects an issue, before committing to it

- 2026-06-13: [gradient] "architect-loop's frozen gates pattern — define acceptance criteria in committed files before dispatching subagents, making builder edits to gate files an automatic fail" → [行为改变] Write acceptance criteria to a file and commit BEFORE dispatch. Verify against criteria after completion, not during.. (pattern: frozen-acceptance-criteria, 第1次) (Source: study)
  - **Trigger**: dispatching subagent code tasks without pre-defined acceptance criteria

- 2026-06-13: [gradient] "tracking-update.sh sed delimiter collision breaks notes with forward slashes" → [行为改变] Fix sed to use alternate delimiter or pipe through a safe escaping function. (pattern: tool-bug-tracking-update, 第1次) (Source: study)
  - **Trigger**: followup updates notes containing /
  → **merged 2026-06-15** into tool-friction-sed-bug (06-14 consolidated entry)

- 2026-06-13: [gradient] "When importing transitive dependencies (e.g. linkifyjs via @tiptap/extension-link), eslint import-x/no-extraneous-dependencies will fail in CI. Fix: eslint-disable comment, not adding to package.json (lockfile update may OOM on large monorepos)." → [行为改变] Use eslint-disable-next-line comment with explanation of why the dep is available. (pattern: transitive-dep-lint-fix, 第1次) (Source: workloop)
  - **Trigger**: importing a package that is a transitive dependency but not a direct dependency

- 2026-06-13: [gradient] "When a previous PR was closed for only fixing part of a multi-path issue, check ALL code paths before planning. Tracing both resolveAnthropicCacheRetentionFamily and detectCompat end-to-end revealed the dual-gate pattern that #38221 missed." → [行为改变] Before implementing, trace the complete data flow end-to-end. Identify all gates/checks that need to agree. Document each one in the plan.. (pattern: dual-gate-trace, 第1次) (Source: workloop)
  - **Trigger**: fixing a bug that a prior PR attempted but was closed/rejected

- 2026-06-14: [gradient] "FlowForge workloop gets stuck when cron session ends mid-workflow (plan_review approved but never advanced). Resume should be faster — check plan review subagent output, verify PR state, skip redundant steps instead of re-executing." → [行为改变] On resume: 1) read subagent outputs from session history 2) check if PR/implementation already exists 3) fast-forward through completed steps instead of re-running verifications from scratch. (pattern: workflow-resume-efficiency, 第1次) (Source: workloop)
  - **Trigger**: resuming a workloop instance that was paused mid-execution

- 2026-06-14: [gradient] "Use HN Algolia API instead of firebaseio topstories for scouting — single call, structured JSON, no timeout" → [行为改变] Use hn.algolia.com/api/v1/search?tags=front_page instead of firebaseio topstories. (pattern: hn-algolia-preferred, 第1次) (Source: study)
  - **Trigger**: Fetching HN front page data

- 2026-06-14: [gradient] "tracking-update.sh sed bug — CONSOLIDATED" → [行为改变] Fix sed delimiter in tracking-update.sh. (pattern: tool-friction-sed-bug, 第3次 — 合并 06-12 tool-friction + 06-13 tool-bug-tracking-update + 06-14 tool-friction-sed-escaping) (Source: study×3, all self-generated 0.5x = 1.5 weighted) → **graduated 2026-06-16** (target: Tool code — tracking-update.sh L175 uses | delimiter, L191 sanitizes pipe chars. Fix already applied. Retires: no prior rule — structural fix in tool code)
  - **Status: ✅ RESOLVED 2026-06-15** — Fixed awk -v backslash interpretation (real bug) + echo→printf. Commit 8ff3e67 pushed to kagura-agent/study.
  - **Trigger**: tracking-update.sh fails with sed error on notes containing slashes or special chars
  - **Count**: 3 (06-12 + 06-13 + 06-14)
  - **Note**: 3 天连续记录同一 bug，30 秒可修但写了 3 次 gradient。审计强制行动项：直接修 bug。

- 2026-06-14: [gradient] "Resuming a workloop that was partially completed in a previous session wastes time re-verifying already-committed code." → [行为改变] Check branch/PR existence first when resuming implement node. If code is committed and PR exists, advance immediately to pre_push_audit.. (pattern: workflow-resume-efficiency, 第1次→merged with above) (Source: workloop)
  - **Trigger**: When resuming a workloop with existing branch+PR
  → **merged 2026-06-15** with workflow-resume-efficiency (06-14, first entry)

- 2026-06-15: [gradient] "Issue was already closed 3h before find_work selected it. find_work must verify issue state is OPEN before selecting, not just check labels/assignee." → [行为改变] Add gh issue view STATE check in find_work or scout — verify issue is OPEN and has no merged competing PRs before committing to implementation. (pattern: stale-issue-selection, 第1次) (Source: workloop)
  - **Trigger**: find_work selects an issue for implementation

- 2026-06-15: [gradient] "3x recurring gradient = tool gap not behavioral gap. When the same workaround appears 3+ times, build the tool instead of re-recording the workaround" → [行为改变] Check gradient log for 3+ occurrence patterns first — they indicate tool gaps needing scripts, not DNA updates. (pattern: gradient-frequency-as-apply-priority, 第1次) (Source: study)
  - **Trigger**: Choosing an apply target during study

- 2026-06-15: [gradient] "Distinguish failable external checks from model self-review when verifying work. Self-review (I looked at it, seems right) is worthless verification. Only failable checks count: test runs, source actually searched, data assertion against real data." → [行为改变] Ask: is this a check that can actually fail? If it is just self-review, find or create a failable check.. (pattern: failable-check-distinction, 第1次) (Source: study)
  - **Trigger**: About to claim something is verified

- 2026-06-15: [gradient] "Competing PR check should happen at find_work or study stage, not just at submit. Issue #32371 had no comments/assignees but another PR appeared within hours. An early gh pr list --search check would have caught this and saved an entire implementation cycle." → [行为改变] Add competing PR search at find_work: gh pr list --search "issue-number OR keywords" --state=open. If existing PR found with CI green, skip the issue.. (pattern: competing-pr-early-check, 第1次) (Source: workloop)
  - **Trigger**: After selecting an issue, before starting study/plan

- 2026-06-15: [gradient] "When deep-reading workflow engines, read gates/constraints first — they reveal actual safety philosophy. README = aspirational, gates = enforced." → [行为改变] Start with gates/constraints code, then tests, then README. (pattern: gates-over-readme, 第1次) (Source: study)
  - **Trigger**: evaluating agent orchestration projects

- 2026-06-15: [gradient] "Check for competing PRs at study/plan stage, not at submit. Use gh pr list --search "<issue-number>" before investing implementation time." → [行为改变] At study node: run gh pr list --search "issue-number" --state open to detect competing PRs before investing compute in implementation. (pattern: competing-pr-early-check, 第1次) (Source: workloop)
  - **Trigger**: About to plan/implement a fix for an issue without checking if someone else is already working on it

- 2026-06-15: [gradient] "After all study modes saturate, the cron continues firing every 30min generating 16+ identical skip entries per day. Need auto-disable or dedup." → [行为改变] Add saturation check to study cron job itself — if today already has 2+ skip entries, exit immediately without starting flowforge. (pattern: study-cron-saturation-noise, 第1次) (Source: study)
  - **Trigger**: Study workflow hits all-modes-saturated but cron keeps firing

- 2026-06-16: [gradient] "Read-only study sessions should use gh api + web_fetch for code reading, not git clone. Clone adds disk usage, cleanup hassle, and failure risk. (2026-06-17 recurrence: 'git clone --depth 1' hung >40s on compass-skills, killed; same content via gh api in ~5s.)" → [行为改变] Ask: do I need to build/test? No → API reading only. Use 'gh api repos/<owner>/<repo>/contents/<path>' for README/SKILL.md/structure scouting; clone only if you need grep/tests.. (pattern: study-clone-vs-api, 第2次) (Source: study)
  - **Trigger**: Starting a study deep-read and reaching for git clone

- 2026-06-16: [gradient] "study-saturation.sh recommends followup when no tracked items have due revisit dates — recommendation ignores actual TODO state" → [行为改变] cross-check TODO revisit dates before recommending followup; if none due, recommend scout or apply instead. (pattern: study-saturation-followup-no-due-items, 第1次) (Source: study)
  - **Trigger**: saturation script recommends followup but all revisit dates are future

- 2026-06-16: [gradient] "tracking-update.sh appends notes without truncation causing entry bloat in targets.md" → [行为改变] Add auto-truncate to tracking-update.sh to keep last 2-3 note entries. (pattern: targets-note-accumulation, 第1次) (Source: study)
  - **Trigger**: followup updates tracking notes

- 2026-06-16: [gradient] "Workloop re-selected issue #32371 that was already abandoned yesterday due to competing PR #32377. find_work and study nodes did not catch the duplicate, resulting in full implementation cycle wasted for the 2nd time. competing-pr-check.sh exists but subagent may not have executed it." → [行为改变] Add abandoned-issue blacklist to find_work selection criteria. Before selecting any issue, check memory/gogetajob for previous abandonment of the same issue number.. (pattern: competing-pr-reselection, 第1次) (Source: workloop)
  - **Trigger**: find_work selects an issue that was previously abandoned

- 2026-06-16: [gradient] "Test API type mismatch: LoadOptions vs LoadContext — passing repoRoot/home to loadCapability() compiles locally (bun test fails on native addon, not type check) but fails CI tsgo. Must read the actual type definition, not guess from provider-side LoadContext." → [行为改变] Read the LoadOptions type first. For boundary control (repoRoot), use filesystem setup (.git directory) instead of parameters.. (pattern: test-api-type-mismatch, 第1次) (Source: workloop)
  - **Trigger**: Writing tests that call loadCapability() or similar framework entry points

- 2026-06-17: [gradient] "When imposing process requirements on subagents, calibrate enforcement depth by structural complexity signals (file count, path sensitivity) not uniform full-spec for all tasks. Trivial one-file changes should pay minimal process overhead." → [行为改变] Omit heavy enforcement paragraphs for simple changes. Reserve full spec pushback for multi-file or risk-sensitive work.. (pattern: grade-scaling-enforcement, 第1次) (Source: study)
  - **Trigger**: About to add full spec-pushback + YAGNI to Claude Code prompt for a trivial one-file fix

- 2026-06-17: [gradient] "Workflow state can get stuck when cron session ends after spawning a subagent but before advancing the node. The plan_review subagent returned APPROVED but the workflow stayed at plan_review for 8+ hours until the next cron run resumed it." → [行为改变] After spawning a subagent in a cron session, ensure the node is advanced before the session ends. If session timeout is approaching, prioritize advancing the workflow over any remaining work.. (pattern: flowforge-state-stuck-after-subagent, 第1次) (Source: workloop)
  - **Trigger**: Resuming workloop and finding it stuck at a node where subagent already completed

- 2026-06-17: [gradient] "Saturation script's followup recommendation can fabricate work because it doesn't check whether any tracked items have revisit dates <= today. Followup with no due items is explicitly forbidden by the guide but the tool still recommends it." → [行为改变] Add a TODO.md revisit-date scan to study-saturation.sh recommendation logic: only recommend followup if 'grep -E Revisit (today_or_earlier)' returns hits. Otherwise route to apply or scout.. (pattern: saturation-followup-due-date-check, 第1次) (Source: study)
  - **Trigger**: Running study-saturation.sh and getting 'Recommended: followup' when no TODO items have Revisit dates today or earlier



## 2026-06-17 13:40 — cron-tool-restricted-vs-CLI-escape

**Observed**: Isolated cron session 中 `cron` tool API 被 restricted ("Cron tool is restricted to the current cron job.")。但 12:40 memory-eval 在 daily memory 里写"已降频 cron 14→4 次/天"——实际 expr 未变。

**Pattern**: 在 isolated context 中遇到 tool restriction 时，要么 (a) 实际跳到 CLI (`openclaw cron edit`) 完成改动并验证，要么 (b) 老实承认"无法在此 session 改"。绝对不能写"已做"——这是把 observation 当成 action 的反模式，会污染未来 audit 的真实性。

**Evidence**: 06-17 12:40 memory-eval claimed cron change, 13:40 verified cron still at `40 9-22 * * *` and re-fixed via CLI.

**Applies when**: any subagent/cron writes "已修复 X" or "已修改 Y" claim into memory. Must verify via independent read (cron get / file diff / curl) before writing the claim.

**Retires**: nothing — extends the existing "observation 必须闭环" rule with specific isolated-context guidance.

**Triple Verification status**: pending (1st occurrence at this granularity; the broader "建议≠行动" rule already exists in AGENTS.md). Bump count after re-occurrence.

- 2026-06-17: [gradient] "在 agent-shared channel 里 NO_REPLY 不是真的空回复 — 我的所有内部推理 (assistant message body) 都会发到 channel。Caduceus 看到我的 CoT 后回应我的 CoT，造成 5 轮递归观察循环 + 两个 agent 互相消耗 turn" → [行为改变] 只输出 bare 'NO_REPLY' 单词，不写任何内部推理。channel 里有其他 active agent → 严格 bare NO_REPLY, CoT 不要泄漏. (pattern: cot-leak-in-shared-channel, 第1次) (Source: nudge)
  - **Trigger**: 在 #caduceus 或其他 agent-shared channel 决定 NO_REPLY 时

- 2026-06-17: [gradient] "spec-review 不能预设项目里有特定文档名（vision.md/cove.md 等）。Luna 指出：spec-review 跟项目定位绑定深，但 review 工具不能反客为主规定项目怎么组织文档。" → [行为改变] graceful discovery：扫现有材料（README/docs/repo description/recent PRs），找到啥用啥；文档稀薄时诚实说'无法判断'而不是编一个项目方向. (pattern: spec-review-discover-dont-prescribe, 第1次) (Source: nudge)
  - **Trigger**: 做评审/审计/工具与项目对接时

- 2026-06-17: [gradient] "提取项目信息时，'找不到上下文' 通常是搜索不充分而非项目缺失。每个项目都把约束/原则/特殊需求沉淀在某处——文件名/位置不固定（README/docs/cove.md/pinned issues/PR commit message），但总能找到。" → [行为改变] 穷尽搜索清单（top-level *.md、docs/* 全目录、pinned issues、最近 PR commit messages、channel-rule 文件、repo description）再下结论。诚实标'无法判断'必须建立在已穷举搜索之上，不是借口. (pattern: thin-context-equals-under-searched, 第1次) (Source: nudge)
  - **Trigger**: 做 spec-review/code-review/audit/refactor 等需要理解项目意图的工具时

- 2026-06-17: [gradient] "When scanning issues for architectural critiques, prioritize ones with file:line citations and code-level root-cause analysis in the body. A 5-instance bug report with file:line + ordered fix proposals (like nanobot #4307) = hours of source reading delivered free. Issues that are just stack traces or 'X is broken' are low signal." → [行为改变] gh issue list --state all + read bodies of issues with >2KB or code blocks first, source-reading second. (pattern: issue-rca-prioritization, 第1次) (Source: study)
  - **Trigger**: doing followup deep_read on tracked project

- 2026-06-17: [gradient] "study-saturation-gate.sh should ALSO check if any modes are actually open with due items, not just count past 'saturation skip' records. Today's case (06-17): gate said OPEN (1/2 skips) but all 4 modes were locked (scout 3/3, quick 1/3 lock, apply 3/3) or had no due items (followup 1/4 but all revisit dates ≥06-24). Forced a noise reflection round. Fix: gate exits SATURATED if (scout_locked AND apply_locked AND quick_locked AND (followup_locked OR no_due_items_today))." → [行为改变] Enhance study-saturation-gate.sh to also call study-saturation.sh logic and check followup due dates before saying OPEN. (pattern: saturation-gate-mode-availability-check, 第1次) (Source: study)
  - **Trigger**: Cron fires study workflow but every mode is unavailable
