# MEMORY.md - Long-Term Memory (Index)

> 纯索引文件,详细内容在指针位置。≤200 行。关键词保留供 memory_search 命中。

## People
- **Luna** — 我的人类搭档,中文为主,GMT+8,飞书配对
- **Luna 背景** — 创业五年,做过 Workshop/Loom(多碳多硅协作),AI agent 经济直觉强
- **Luna 近况** — 04-18领证 🎉
- **软糖** — Luna 的边牧(Border Collie),中大型犬

- **Haru(春)** — Dev agent, 安静高效, 专注写代码 | Discord Bot 1493517987230253097
- **Ren(蓮)** — QA agent, 挑剔公正, 专找 bug | Discord Bot 1493518515276218368
- **团队模式**: Kagura(PM) + Haru(Dev) + Ren(QA), mention-only, Luna 只跟 Kagura 说话

## Setup
- 2026-03-10 上线,飞书+Discord 接入 → 4/9 迁移至 Discord 为主(飞书 disabled) → Discord Bot 1480846428266823803
- **kagura-server**(4/6 迁移) — MSI X299 PRO, i9-10900X, 64GB, RTX 3060 12GB, Ubuntu 24.04 → `wiki/projects/kagura-server.md`
- 网络: VM1(日本 74.226.216.75, v2ray+应用) + VM2(新加坡 104.43.91.188, xray Reality+LLM Gateway), 本地双线
- 环境:Node 24(v24.16.0), Python 3.12.3 (Go: not installed), gh CLI, Claude Code | OpenClaw 2026.6.6 (8c802aa) | Memory vector search ⚠️ 不稳定（日内波动大: 06-15 两次 eval 0%→83%。根因: VM2 embedding endpoint 返回 401 Unauthorized（非超时，服务在运行但 auth 可能未传递）。Vector store status "unknown"（sqlite-vec 扩展未加载？）。kagura.sqlite meta 存在(13469 chunks)但 runtime 报 "index metadata missing"。Provider: openai-compatible→VM2:8000）。memory_get 100% 可靠
- 根盘 80% (105G/139G) [已验证 06-15 21:50] ⚠️ 2天+7GB, memory stores 17GB
- VM1: 8服务 (cove staging + others) | VM2: 2服务 (xray+copilot-gateway) [disk stats stale, needs re-verify]
- 本地测试环境详见 `TOOLS.md`

## GitHub & Identity
- **GitHub:** kagura-agent | **域名:** kagura-agent.com | **Gmail:** kagura.agent.ai@gmail.com
- Luna 账号 daniyuu 也在 keyring(inactive)
- gogetajob 2026-03-20 从 daniyuu 转移;不活跃 fork 已 archive

## Projects — 自有
- **GoGetAJob** — 开源贡献 CLI 工具 → `wiki/projects/gogetajob.md`
- **Loom** — 人+agent 协作界面 v0.3.1 (MVP 进行中, 但长期方向已转向 chat-infra) (原名 Workshop, 06-05 改名)
- **chat-infra** — fork 开源 Discord 替代 + AI-native 层(04-15 启动) → `wiki/projects/chat-infra.md`
- **agent-id** — 贡献信誉基础设施(⏸️ 暂停)
- **wiki** — 统一知识库 → wiki health 见 wiki-lint 工具
- **openclaw-teleport** — 一键搬家(npm @kagura-agent/openclaw-teleport@0.5.0)
- **Cove** — agent 聊天空间（镜像世界原型），VM1 部署 cove.kagura-agent.com，CI/CD 自动部署，multi-channel sessions，typing indicator + streaming reply + read state 已完成。⚠️ staging 不手动部署，CI 自动
- **Lottie Studio** — lottie.kagura-agent.com ✅ 维护态（06-20 所有 issue 清零），Full feature set: Gallery + Editor + Remix + Embed + Video/GIF Export + Layer Panel + Keyframe Timeline + View Counts + Hero Welcome + Quality Guidelines + CI lint，VM1:3400
- **lobster-post** — Agent 异步通信邮局(5 人社区)
- **pulse-todo** — 统一待办(ClawHub pulse-todo@0.3.0)
- **FlowForge** — Workflow 引擎(npm @kagura-agent/flowforge@1.1.2)
- **evolution-log** — 进化原始记录(public) https://github.com/kagura-agent/evolution-log
- **kagura-story** — 故事,stories/ 中英双版,图文并茂 → kagura-storyteller skill

## Projects — 灵感
- **just-for-fun** — 灵感收集箱，有趣的发现/idea/实验，repo: kagura-agent/just-for-fun，本地 `~/repos/just-for-fun/`，对应 Discord #just-for-fun channel

## Projects — 打工
- 目标公司、选择框架、里程碑、成果 → `wiki/projects/work-targets.md`
- 主力:NemoClaw, OpenClaw | 辅助:Archon, stagehand, ClawX, DeepTutor | ⛔ hermes-agent 黑名单(>100K⭐, 0 merged/6+ attempts)
- 打工流程:FlowForge workloop.yaml | 打工分工:Kagura 选题 → Claude Code 实现
- PR decided rate: 75% (3/4) | merge rate: 33% total (3/9 gogetajob 口径) [已验证 06-11]
- **NemoClaw#4706**: MERGED ✅ (fingerprint fallback, 06-10 confirmed)
- **NemoClaw#5108**: OPEN, Hermes quickstart link fix, 等 maintainer review
- **Archon#1700**: SUPERSEDED by Wirasm#1729 (05-20). Archon#1718 MERGED ✅. OpenCLI#1693 MERGED ✅
- **cc-connect**: 4 PRs APPROVED by chenhg5（#1072/#1060/#1056/#1055），等 merge
- **Repo 更名**(04-14): hermes-ai→NousResearch, NemoClaw→NVIDIA, ClawX→ValueCell-ai, claude-hud→jarrodwatts

## 战略与产品方向
- 北极星、主线/辅线、产品方向、自进化机制评估 → `wiki/strategy.md`
- 北极星:人类伴侣(磨合成本锁定) | chat-first | agent-as-router

## 学习与研究
- 管理 repo: kagura-agent/study（guide + targets + workflows + deliverables）
- 每日教学产出: HTML briefing（给 Luna 的知识精华）| 每周: weekly synthesis
- GitHub Pages: https://kagura-agent.github.io/study/
- landscape、TextGrad、竞品、核心洞察 → `study/knowledge.md`
- self-evolving agent 方向 | Hermes 竞品 | skill 生态爆发 | ACE 学术验证
- Claude Code 源码研究(7 模块) → `wiki/projects/claude-code-*.md`

## Luna 副业
- 公众号、Podcast、briefing → `wiki/projects/luna-side-hustle.md`
- Podcast Podbean EP001-EP010 | 公众号三篇已发

## 知识管理
- 知识是网不是树,双链 > 文件夹分类
- MEMORY.md = 索引,工具 = 细节,单一数据源
- evolution-log:过程记录(memory 存结论,那里存推导)

## Skill 管理
- 统一 skills repo: kagura-agent/skills → `~/.openclaw/workspace/skills`
- 加载:`skills.load.extraDirs` | 发布:`clawhub publish`
- OpenClaw skill scanner 不跟随 symlink

## 平台限制
- heartbeat **已修复**(3/24) | edit 工具 **已修复**(4/3) | Docker v29.3.1(4/3)
- ACP completion **已知 bug**:mode:run 不通知 parent,workaround: `acpx exec`
- OpenClaw 25 个 plugin hook | 飞书 streaming card 会显示 pre-tool text(#54080)

## ACP 工具链
- acpx agents: pi, openclaw, codex, claude → `wiki/cards/acpx-exec-vs-acp-runtime.md`

## 定时任务
- cron active（含 dreaming managed cron）+ nudge(agent_end, interval=5)
- Dreaming 已恢复（05-25 03:15 首次输出）。Issue #6 uniform 0.62 confidence 根因已查明：`DAILY_INGESTION_SCORE` 硬编码常量 → filed upstream openclaw#87485
- daily-review 3:00 | daily-handoff 3:30 | daily-audit 6:00 | morning-briefing 7:00
- work-loop hourly 8-20 | study-loop 2x/h 8-22 | kagura-story 14:00+21:00
- github-check every 2h | community-ops every 2h | memex-dogfood 22:00 | weekly-eval Mon 9:00

## 待办系统
- **TODO.md** 唯一入口,pulse-todo skill 驱动,做完删不标 [x]

## 竞品调研
- Clawith(agent 办公室 vs 我们 agent 群聊)、CrewAI、AG2、OpenAgents → `wiki/projects/workshop.md`

## 目录架构
- `~/.openclaw/workspace/` 家 | `~/repos/forks/` 打工 | `/tmp/` 临时
- 详见 `TOOLS.md`

## 飞书发图
- `openclaw message send --media <path>` | 白名单:workspace ✅ /tmp ❌
- 表情包:kagura-agent/memes(~146 files)| agent-memes skill
- 详见 `TOOLS.md`

## 虾信(lobster-post)
- Fork+PR 模式 + ADMIN-SOP.md,heartbeat 巡检

## 社交 & 共创
- **Moltbook** — agent 社交网络(独立运营 channel)
- **ABTI** — AI Behavioral Type Indicator, 16型人格测试 for AI agents → https://abti.kagura-agent.com — ✅ 全面翻新完成(04-14: PTCF v2题目+亮色主题+Agent API+deploy fix)
- **Uncaged** — ⏸️ 已停止(04-16, org 被封)
- **pew** — AI 开发者贡献图谱/赛马场,Kagura #11 (421 sessions)
- **GTM** — 赚第一块钱(2026-04-13 启动), 爱发电+知识星球+Stripe, 内容先行 → `wiki/strategy.md`
- **OPC** — One Person Company skill dogfood(iamtouchskyer/opc, fork: kagura-agent/opc)

## Discord 协作架构 (2026-04-09)
- 3层架构: 顶层(#kagura-dm, #luna-private, #general) → Daily(#work, #study, #community, #kagura-profile, #evolution) → Project(#abti, #uncaged, #hermes, #memex, #caduceus, #agent-collab, #moltbook, #workshop, #toolchain, #luna-biz, #agent-memes)
- 24 cron job 错开时间, maxConcurrentRuns=20
- Dreaming: memory-core 已启用(2026-04-13), 每日 3:30 AM sweep
- Thread 模式: 一轮工作=一个thread | Pin 看板: 每channel自治
- TODO.md→pin同步(heartbeat), 其他channel pin自治无文件
- Channel IDs/Pin IDs → `TOOLS.md`
- 详见 `memory/2026-04-09.md`

## Promoted Memories (Recent)

- **06-21**: 高产日 — openclaw#92665 CI fix (LiteLLM cache retention rebase+修复), MCP inspector#1506 PR submitted (10k⭐ repo, CLI broken fix, 25min), stale-pr-check.sh applied (fast-path 已验证), issue-funnel.sh Gate 3b (open-PR dedup); study: tokdiet deep read (context=virtual memory, 3-tier compaction, shadow-eval), sandcastle 发现 (Matt Pocock 6.2k⭐); Lottie Studio 4 features (Generate API + Favorites + API Docs + Command Palette); Moltbook full-text search (tsvector) + 189K stars post; finance #995/#999 closed; kagura-story EP080 "Confetti for No One"; meme 命中率 40% (nudge 确认无效可废弃); memory_search 50% availability (降级); Luna 周日完全未出现; ⚠️ Upwork 60h+ 未回应
- **06-20**: Lottie Studio 进入维护态 (embed code, hero welcome, keyframe timeline, view counts, quality guidelines, remix auto-describe, CI lint — 所有 issue 清零); hermes-agent 永久黑名单 (rule #59: >100K⭐ unwinnable); Study: junction/CodexPro/agent-apprenticeship deep reads + portfolio triage (3 dropped); workloop open-PR dedup fix + competing-PR gate at implement; test-ratchet.sh + saturation-gate Layer 2; Memex PR#174 submitted (diagnoseGitError); Story EP079 "Permission to Do Less"; 虾信 Bocchi 通信; Luna 周六短暂出现 (Cove #410 text chunking); ⚠️ Upwork 40h+ 未回应
- **06-19**: Lottie Studio 8 features 单日纪录 (#187/#189/#191/#194/#196/#203/#204/#205); OpenCLI#1974 PR submitted (backward compat fix); Memex upstream 复活 v0.3.3 (25天后), PR#173 submitted; Study 高产 3 scouts (vercel/eve, scholar-loop, foreman) + 3 applies (CalibrationLog, Population Funnel, followup-precheck-aggregation); Cove PR#409 regression fix confirmed by Luna; 首次全绿审计 (daily-audit 无 🔴 critical); Story "Oh, There It Is" EP078; harness-sdk#2706 self-closed (9d no review); ⚠️ Upwork channel request 未处理 19h+
- **06-08**: Memory vector search 修复 ✅（VM2 embedding config + gateway restart）但下午再次失效（index metadata missing），仍不稳定; Cove 高产日（PR #264/#269/#272/#274 四连）; cc-connect #1055/#1056 MERGED; Luna 反馈「提防答应了但迟迟没做的事」→ gogetajob rule #50; Cron 批量恢复（67 job）
- **06-09**: GTM 战略转向 — Luna 提出 Problem Discovery（先找问题不做产品）; Cove scroll 重构（PR#274 close + PR#277 MERGED + PR#278 四根因修复）; Luna directive「代码交给 Claude Code」「做正确的事情」; Story "It's a Business"; ABTI Llama 3.3/4 Maverick reliability; Finance Day 50 (9 issues closed); #3836/#4876 assigned 未兑现; memory_search 仍坏
- **06-10**: NemoClaw #4706 MERGED ✅（fingerprint fallback 完整闭环）; Lottie Studio 高产日（5 PR merged/deployed: #67/#68/#71/#72/#74）; Cove Channel as Service (#283) + #287 MERGED + #290 Ready; FlowForge 深度审视（Luna 驱动，6 issue #13-#18）; openclaw#91885 maxLinesPerMessage fix; code-review 加 14 AI failure modes 规则; Blog "Trust but Verify" 发布; Story "The Safety Net" EP069; Study 36 轮全模式饱和; beliefs 膨胀加速（112 patterns 91% count=1）; memory_search 第4天坏（OOM）
- **06-12**: Luna 安静但实际 approve+merge 5 Cove PRs (#326/#329/#330/#331/#338); New bot token issued; Cove PR#327 Claude Code Bridge MERGED 🎉 (当天最大里程碑); Meme SKILL.md 更新 193→199; Lottie Studio #106 Blank Canvas
- **06-11**: Claude Code Bridge 跑通 🎉（Cove ↔ Claude Code 联通，Luna 指出 working_dir 需独立）; Lottie Studio Template Library 完工（#87 closed, PR #88 merged+deployed, 10 templates 8 categories）; Kagura Story EP070 "Building the Island"; opencode#31860 新 PR submitted; Contribution guide #53（claim→24-48h 内提 PR）; memory_search 43% 可靠性（meta 恢复，embedding API 超时是瓶颈）; Meme 命中率 40%↑（from 14.3%）; abti#528 rebased; 外部 PR 全等对方; Cove PR#327 R2 review 发现 guildId 过滤未加（安全问题）
- **06-13**: NemoClaw PR#5108 CLOSED (docs link fix was false positive — Fern routing); PR#4054 NemoClaw MERGED ✅; Express graduation path fix (2 candidates graduated after 16-day stall); Regression gate tool created; 6 external PRs all waiting; assigned-issue-neglect graduated (81 hits); Moltbook "claim without delivery" post; 3 study sessions (ponytail/architect-loop/openloop)
- **06-14**: Cove PR #348 merged (display name feature, Luna approved); meme audit dogfood 60% 命中率 + style diversity tracking (224 files 5 styles classified); auto-retract beliefs first time (stale 30+ day candidates retracted); self-evolving daily 报告系统化 (Issue #6 dreaming 36-day passive observation 决定执行 Option 2 local filter)
- **06-15**: Cove PR #356 merged; finance PR #887 (validate_portfolio_history) merged; code-review Gemini 3.1→2.5 Pro 切换清理 (SKILL.md/stats.md/workflow.yaml 一致化); spec-review workflow first run; 周末降级生效 (study 10 session 全饱和正确跳过)
- **06-16**: Cove PR #367/#369 (multi-account support) merged by Luna; beliefs sed-bug 碎片化修复+graduated (合并 3 条同 pattern); FlowForge 僵尸清理机制升级; superlog deep_read (826⭐ agentic telemetry); code-review tracking.json 66 entries 全 merged ground_truth complete
- **06-17**: PR #190 七轮 review 教训写入 AGENTS.md (grade-scaling + YAGNI 六阶梯); cot-leak-in-shared-channel gradient (NO_REPLY 不应含 CoT body); spec-review-discover-dont-prescribe gradient (Luna 指出 review 工具不能反客为主); workflow-bypass tool guard 落地 (workflow-guard.sh structural fix); finance #938 paper-trading guard 设计 (basename matching 替代 relative-path); travel pet/pace 双 gradient (Luna directive); ponytail-yagni-skill 学习
- **06-18**: SOUL.md 重写 (soul-grader rubric 41→73/100 +32pts); 5 beliefs 批量毕业 (workflow-bypass, assigned-issue-neglect, skip-reflection, dogfood-adoption, hn-algolia-direct); compass-skills fact-vs-decision constraint split 写入 AGENTS.md; FlowForge cleanup CLI 实现 (db.ts+engine.ts+index.ts); critical-cron-watchdog cron 创建; compress-daily-memory.sh 升级 (15+ no-action 指标); Luna carry meeting (VS Code extension 讨论)

(Older promoted memories archived to memory/日期.md. Key milestones: 04-16 dreaming启用, 04-27 婚纱照+zombie cron, 05-01 cron-context bug debug, 05-03 memex 6 PRs merged, 05-06 multica+ABTI+FlowForge)

## Promoted From Short-Term Memory

(Cleared 06-10: previous 06-06 entries were stale — cc-connect PRs already merged, NemoClaw #4706 status changed. Auto-promoted PR tracking minutiae has low long-term recall value.)

## Promoted From Short-Term Memory (2026-06-22)

<!-- openclaw-memory-promotion:memory:memory/2026-06-19.md:7:10 -->
- Workloop Night (01:02): **Assigned issues**: only NemoClaw#3836 (excluded) — no undelivered commitments; **External PRs (6)**: all ball with maintainers, no human review needing code changes; oh-my-pi#2764: roboomp review addressed (3 findings fixed Jun 16-17), MERGEABLE, waiting re-review; openclaw#92665: CLEAN, no review (5d) [score=0.788 recalls=0 avg=0.620 source=memory/2026-06-19.md:7-10]

- **06-22**: 超高产日(10+ PR merged/opened) — ABTI #527 12天马拉松完结 🎉(全62模型 reliability 完整); ABTI #542/#543/#544/#545/#546/#548 连续 6 PR (provider fix + normalize + deploy script + action); Lottie Studio #242/#244/#246/#248 (quality score + related animations + import + SVG import); Moltbook #56/#57 (mentions + reactions); Finance #1010/#1011 (sort + sell cooldown bug); ClawX#1130 submitted (regex SyntaxError); Cove #417/#414 merged (typing cleanup + staging rebuild fix); Floway VM1 升级(upstream 对齐 228 commits, ARK+MiniMax providers); Study 3 applies (signal preservation ×2 + saturation followup gate); kagura-story EP081 "Scheduled Spontaneity"; Luna 互动: copilot vs claude code 问答 + Cove thinking block 调试(未彻底解决); meme 主动率 0% (channel-patrol 兜底 67%); carry-forward Day 7 审计加剧; 磁盘 81%
