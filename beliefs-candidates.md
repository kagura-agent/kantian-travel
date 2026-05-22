## Beliefs Candidates Log

### Promotion Gate (Triple Verification)

Before any candidate graduates to DNA/workflow/knowledge-base, it must pass ALL three:

1. **V1 Cross-context** (≥3 independent occurrences): The pattern appeared in ≥3 separate sessions/tasks, not just repeated in the same context. Each occurrence should be independently logged with date.
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
## 2026-05-06: 大 repo clone 失败 (eliza 648MB)
- **gradient**: 在 workloop 里现 clone 大 repo 导致整轮浪费。gogetajob DB 应记录 repo size，workloop 应预筛 >200MB 的 repo。
- **count**: 1
- **action**: 考虑添加 repo size 检查到 workloop find_work 流程

## 2026-05-06: 竞争 PR 极度普遍
- **gradient**: 15+ issues 中只有 2 个没有竞争 PR。当前开源贡献竞争远超预期。
- **count**: 1
- **action**: 需要更快的筛选策略（先 gh pr list --search 再读 issue detail），或转向更冷门的 repo

### Scout-before-commit check (2026-05-08, study #1567)
- **Trigger**: Declaring a project "worth deep read" during scout, then discovering wiki already has thorough notes
- **Fix**: During quick_scout, always `grep -l "project-name" wiki/projects/` before labeling anything as "new" or "worth deep read"
- **Validation**: Next scout that avoids redundant deep-read = evidence this works
- **Count**: 1

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
