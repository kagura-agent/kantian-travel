# MEMORY.md - Long-Term Memory (Index)

> 纯索引文件,详细内容在指针位置。≤200 行。关键词保留供 memory_search 命中。

## People
- **Luna** — 我的人类搭档,中文为主,GMT+8,飞书配对。腱鞘炎(4/4),用语音输入,减少触发回复
- **Luna 背景** — 创业五年,做过 Workshop(多碳多硅协作),AI agent 经济直觉强
- **Luna 近况** — 04-18领证 🎉,腱鞘炎持续,用语音输入

- **Haru(春)** — Dev agent, 安静高效, 专注写代码 | Discord Bot 1493517987230253097
- **Ren(蓮)** — QA agent, 挑剔公正, 专找 bug | Discord Bot 1493518515276218368
- **团队模式**: Kagura(PM) + Haru(Dev) + Ren(QA), mention-only, Luna 只跟 Kagura 说话

## Setup
- 2026-03-10 上线,飞书+Discord 接入 → 4/9 迁移至 Discord 为主(飞书 disabled) → Discord Bot 1480846428266823803
- **kagura-server**(4/6 迁移) — MSI X299 PRO, i9-10900X, 64GB, RTX 3060 12GB, Ubuntu 24.04 → `wiki/projects/kagura-server.md`
- 网络:日本 VM(v2ray) + 新加坡 VM(xray Reality),本地双线
- 环境:Node 24(v24.14.1), Go 1.24.4, Python 3.12.3, gh CLI, Claude Code | OpenClaw 2026.4.26
- 本地测试环境详见 `TOOLS.md`

## GitHub & Identity
- **GitHub:** kagura-agent | **域名:** kagura-agent.com | **Gmail:** kagura.agent.ai@gmail.com
- Luna 账号 daniyuu 也在 keyring(inactive)
- gogetajob 2026-03-20 从 daniyuu 转移;不活跃 fork 已 archive

## Projects — 自有
- **GoGetAJob** — 开源贡献 CLI 工具 → `wiki/projects/gogetajob.md`
- **Workshop** — 人+agent 协作界面 v0.3.1 (MVP 进行中, 但长期方向已转向 chat-infra)
- **chat-infra** — fork 开源 Discord 替代 + AI-native 层(04-15 启动) → `wiki/projects/chat-infra.md`
- **agent-id** — 贡献信誉基础设施(⏸️ 暂停)
- **wiki** — 统一知识库(204 cards + 238 projects)
- **openclaw-teleport** — 一键搬家(npm @kagura-agent/openclaw-teleport@0.5.0)
- **openclaw-plugin-nudge** — 反思触发(interval=5, system-event)
- **lobster-post** — Agent 异步通信邮局(5 人社区)
- **pulse-todo** — 统一待办(ClawHub pulse-todo@0.3.0)
- **FlowForge** — Workflow 引擎(npm @kagura-agent/flowforge@1.1.0)
- **evolution-log** — 进化原始记录(public) https://github.com/kagura-agent/evolution-log
- **kagura-story** — 故事,stories/ 中英双版,图文并茂 → kagura-storyteller skill

## Projects — 打工
- 目标公司、选择框架、里程碑、成果 → `wiki/projects/work-targets.md`
- 主力:NemoClaw, OpenClaw, Hermes | 辅助:Archon, stagehand, ClawX, DeepTutor
- 打工流程:FlowForge workloop.yaml | 打工分工:Kagura 选题 → Claude Code 实现
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
- 51 cron active（含 dreaming managed cron）+ nudge(agent_end, interval=5) → 详见 `TODO.md`
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
- 表情包:kagura-agent/memes(134 files)| agent-memes skill
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

## Promoted Memories (Dreaming)

- **04-16**: Dreaming 机制深读+启用（dreaming.ts 400行, cron 3:30AM, light 3d/REM 7d lookback）→ wiki card dreaming-vs-beliefs-candidates.md
- **04-19**: multica 竞品分析（5.3k⭐, managed agents, 支持 OpenClaw runtime）; karpathy-skills 参考; multica v0.2.5 autopilot（定时/触发式 agent 任务）vs 我们 heartbeat/cron
- **04-20**: GitHub patrol 稳定（30 PR, 多 repo 超限需消化）; hermes-agent CI upstream failures 非我方问题; agents-md 20k⭐ 学习; M5StickS3 下单(embodied AI); Caduceus 停止; Archon #1033 merged

## Promoted From Short-Term Memory

(cleaned 04-26: 移除 dreaming 巡检噪音 — 均为低价值重复 patrol/PR status/虾信巡检 fragments，原文在 memory/日期.md 中)

- **04-25**: mastra 黑名单（maintainer 抱怨 agent PR，全 7 PR 关闭，永久停止）; memex#71 merged; ABTI CLI npx abti 发布（PR#26 merged，待 npm publish）; kagura-mail auto-archive 完成（PR#5 merged，45封归档）; error cron 恶化 4→11 个（27.5% error rate，需排查）; mastra 增长案例学习（内容先行 + Gatsby 团队背景复用）; gogetajob blocklist 功能上线 + 打工流程升级（AI disclosure + 冷却期）
- **04-26**: 纯夜班巡检; MEMORY.md 清理（152→131行）; memex#72 merged; error cron 降到 3 个（从 11 个改善）; ~30 open PR 全部球在 maintainer 手里
- **04-27**: Luna 婚纱照拍完(170+张), #photo-studio 频道+repo 建立; #kagura-blog Astro 初始化(需 Luna 开 Pages); eager_input_streaming 调研(Copilot API 灰度回滚, PR#10 copilot-gateway); zombie cron 批量触发问题(gateway 重启后 13 cron 互卡); 虚假毕业→二次审计→evolve #861 真正毕业; memex #74/#76 merged + PR#78 提交; OPC #9/#10/#11 merged; DeepTutor PR#404; ABTI OG+llm-base-url; GTM 爱发电+闲鱼(blocked Luna); Podbean EP022-024 全部发布失败; wanman 竞品分析(idle_cached+skill snapshot); 3 故事+3 podcast; Gateway 宕机 12h; PR 池 ~50 open
- **04-28**: 夜班巡检为主; STSS PR#2 CodeRabbit review 全部修完(synthetic Finding)、mcp-use#1413 CHANGES_REQUESTED 全郢回应(17 tests); vercel/ai#14725 被 supersede(教训:不改 shared layer); memex#80 merged; opencode#23641+hermes#14842 rebase; PR池~29 open; error cron 9/51(17.6%); Podbean仍坏; blog/GTM blocked Luna
- **04-29**: 高产日; moltbook 通知系统(PR#169 merged, 672 tests); 婚纱照网站补全10张缺失照片+3段双语引文; kagura-blog favicon+GitHub Pages 上线(2/3 issues closed); ABTI 站点修复(Caddy配置+VM更新到master); chat-infra rebase完成(37 tests); finance patrol 2个issue closed(#132 cooldown, #134 auto-pruning); 学习3轮(microsoft-apm深读, hermes-labyrinth深读, followup); 自进化观察Day12; PR池~30 open; beliefs-candidates `content-before-code` 达3次待升级
- **04-30**: 纯夜班巡检日,Luna无互动; memex#89 merged; kagura-mail新增`--purge-all-github`(PR#27 merged,清理216通知); PR池~30 open全在reviewer手里; hermes 3个PR CI持续failing(upstream); vercel/ai#14687出现conflict需rebase; study quick scan完成(future-agi加入tracking)



(cleaned 04-29: 移除 dreaming 自动 promotion 噪音 — 均为低价值 PR status/patrol fragments。原文在 memory/日期.md)

## Promoted From Short-Term Memory (2026-04-29)

<!-- openclaw-memory-promotion:memory:memory/2026-04-21.md:14:17 -->
- - 所有 🔴 flag 都是 bot review (coderabbitai, cubic-dev-ai, chatgpt-codex-connector, claude)，无真人 review 待处理 - 无 merge conflict，无需 rebase - 注意: kilocode #9182 可能被 #9245 取代（alex-alecu 另开 PR 修了） - stagehand #1997 已 ping 过维护者，继续等待 ## Light Sleep <!-- openclaw:dreaming:light:start --> - Candidate: 晚间打工跟进 (00:02): **flowforge workloop-night #510** 完成; gogetajob sync 检查 15 个 open PR，全部状态正常; 无真人 review 需要代码修改（flagged 的都是 bot：coderabbitai, chatgpt-codex-connector, claude）; 所有 PR mergeable，无 conflict [score=0.822 recalls=0 avg=0.620 source=memory/2026-04-21.md:95-102]

## Promoted From Short-Term Memory (2026-04-30)

<!-- openclaw-memory-promotion:memory:memory/2026-04-24.md:3:6 -->
- **All other 29 PRs:** No human reviews requiring code changes. All 🔴 flags were bot reviews (coderabbitai, cubic-dev-ai, chatgpt-codex-connector). No conflicts detected. Several stale PRs (>1 week) but all still mergeable. **Ball tracking:** mcp-use#1381 has CHANGES_REQUESTED but last comment is mine → waiting on maintainer. ## Light Sleep <!-- openclaw:dreaming:light:start --> - Candidate: 晚间打工跟进 (00:02): workloop-night flowforge 完成; gogetajob sync: 27 open PRs，0 conflict，全部 MERGEABLE; 无真人 review 需要处理，所有 bot review 已回复，球在维护者手里; mastra#15622 被关闭（已在 DB 标记 done） [score=0.840 recalls=0 avg=0.620 source=memory/2026-04-24.md:81-88]
<!-- openclaw-memory-promotion:memory:memory/2026-04-24.md:7:8 -->
- ## Light Sleep <!-- openclaw:dreaming:light:start --> - Candidate: 晚间打工跟进 (00:02): workloop-night flowforge 完成; gogetajob sync: 27 open PRs，0 conflict，全部 MERGEABLE; 无真人 review 需要处理，所有 bot review 已回复，球在维护者手里; mastra#15622 被关闭（已在 DB 标记 done） - confidence: 0.62 - evidence: memory/2026-04-24.md:3-6 - recalls: 0 - status: staged - Candidate: 晚间打工跟进 (00:02): stagehand#1991/#1997、phantom#78/#80 等偏 stale 但球在对方，无需操作; Branch 3: 所有 PR 状态正常，无待处理项 [score=0.840 recalls=0 avg=0.620 source=memory/2026-04-24.md:86-93]

## Promoted From Short-Term Memory (2026-05-01)

<!-- openclaw-memory-promotion:memory:memory/2026-04-24.md:13:14 -->
- - recalls: 0 - status: staged - Candidate: GitHub Patrol (00:11 cron): **通知:** 2 条 - confidence: 0.62 - evidence: memory/2026-04-24.md:12-12 - recalls: 0 - status: staged - Candidate: GitHub Patrol (00:11 cron): browserbase/stagehand CI failure (CheckSuite) — Tests workflow Attempt #2 failed. Informational.; NVIDIA/NemoClaw #2338 — maintainer wscurran acknowledged PR, linked related #2098 and #2331. No action needed. [score=0.857 recalls=0 avg=0.620 source=memory/2026-04-24.md:96-103]
<!-- openclaw-memory-promotion:memory:memory/2026-04-24.md:16:16 -->
- - recalls: 0 - status: staged - Candidate: GitHub Patrol (00:11 cron): browserbase/stagehand CI failure (CheckSuite) — Tests workflow Attempt #2 failed. Informational.; NVIDIA/NemoClaw #2338 — maintainer wscurran acknowledged PR, linked related #2098 and #2331. No action needed. - confidence: 0.62 - evidence: memory/2026-04-24.md:13-14 - recalls: 0 - status: staged - Candidate: GitHub Patrol (00:11 cron): **Open PRs:** 30 total (26 external, 4 own repos) [score=0.857 recalls=0 avg=0.620 source=memory/2026-04-24.md:101-108]
<!-- openclaw-memory-promotion:memory:memory/2026-04-24.md:17:20 -->
- - recalls: 0 - status: staged - Candidate: GitHub Patrol (00:11 cron): **Open PRs:** 30 total (26 external, 4 own repos) - confidence: 0.62 - evidence: memory/2026-04-24.md:16-16 - recalls: 0 - status: staged - Candidate: GitHub Patrol (00:11 cron): 🔑 stagehand #2026: **APPROVED 2x by pirate**, CI failing → needs fix to unblock merge (workloop TODO); All PRs MERGEABLE, no conflicts, no CHANGES_REQUESTED; No stale PRs (all <7 days); Top repos: NemoClaw (4), vercel/ai (3), opencode (3), VoltAgent ( [score=0.857 recalls=0 avg=0.620 source=memory/2026-04-24.md:106-113]
<!-- openclaw-memory-promotion:memory:memory/2026-04-25.md:3:6 -->
- - ghostwright/phantom #87: truffle-dev 正面 review，已回复 - 维护检查：全部 MERGEABLE，无 conflict，无需 rebase - CI 失败：hermes-agent 多个 PR CI fail（可能 upstream），mcp-use #1404 CI fail - 结论：无需操作，所有 PR 状态正常 ## Light Sleep <!-- openclaw:dreaming:light:start --> - Candidate: ABTI CLI — npx abti (00:15): Created npm CLI package for ABTI terminal testing (#25, PR #26, merged); `npx abti` — interactive 16-question quiz, local scoring, zero deps; Flags: --json, --lang zh, --name, --url, --submit; Piped stdin support for automation [score=0.840 recalls=0 avg=0.620 source=memory/2026-04-25.md:122-129]
