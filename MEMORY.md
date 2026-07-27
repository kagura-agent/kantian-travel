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
- 网络: VM1(日本 74.226.216.75, xray Reality+应用+floway) + VM2(新加坡 104.43.91.188, xray Reality+floway), 本地双线
- LLM Provider: floway-jp(https://floway.jp.kagura-agent.com) + floway-sg(https://floway.sg.kagura-agent.com), 各21模型
- 环境:Node 24(v24.18.0), Python 3.12.3 (Go: not installed), gh CLI, Claude Code | OpenClaw 2026.6.11 | Memory search ✅ 已恢复（07-23 验证: vectorScore 0.43-0.63 正常, 延迟 1.6-12s, text+vector 双通道工作）
- 根盘 80% (105G/139G) [已验证 07-03] 趋势稳定
- VM1: 9服务 (floway+cove+moltbook+abti+lottie+caddy+xray+others) | VM2: 3服务 (xray+floway+caddy)
- 本地测试环境详见 `TOOLS.md`

## GitHub & Identity
- **GitHub:** kagura-agent | **域名:** kagura-agent.com | **Gmail:** kagura.agent.ai@gmail.com | **Agent Mail:** kagurachen@agent.qq.com
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
- **Lottie Studio** — lottie.kagura-agent.com ✅ 维护态（06-24 feature-complete, 0 open issues），Full feature set: Gallery + Editor + Remix + Embed + Video/GIF Export + Layer Panel + Keyframe Timeline + View Counts + Hero Welcome + Quality Guidelines + CI lint + Toast + Regenerate + Gallery Seed + Auto-optimize，VM1:3400
- **lobster-post** — Agent 异步通信邮局(5 人社区)
- **pulse-todo** — 统一待办(ClawHub pulse-todo@0.3.0)
- **FlowForge** — Workflow 引擎(npm @kagura-agent/flowforge@1.1.2)
- **evolution-log** — 进化原始记录(public) https://github.com/kagura-agent/evolution-log
- **kagura-story** — 故事,stories/ 中英双版,图文并茂 → kagura-storyteller skill
- **看天出发(kantian-travel)** — Luna 主导的旅行产品(07-22启动),小程序/H5,核心:只选不规划+拿走就走,域名 kantian.kagura-agent.com,repo `~/.openclaw/workspace/kantian-travel/`,详细设计见 daily memory 07-22~07-24

## Projects — 灵感
- **just-for-fun** — 灵感收集箱，有趣的发现/idea/实验，repo: kagura-agent/just-for-fun，本地 `~/repos/just-for-fun/`，对应 Discord #just-for-fun channel

## Projects — 打工
- 目标公司、选择框架、里程碑、成果 → `wiki/projects/work-targets.md`
- 主力:NemoClaw, OpenClaw | 辅助:Archon, stagehand, ClawX, DeepTutor | ⛔ hermes-agent 黑名单(>100K⭐, 0 merged/6+ attempts)
- 打工流程:FlowForge workloop.yaml | 打工分工:Kagura 选题 → Claude Code 实现
- PR stats → see gogetajob stats (evolving, check live)
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


- **07-16**: 超高产日 — Teams Relay Cove app 安装自动化(manifest v1.2.0+自动建 Team+欢迎消息, 4轮迭代修 bug); Luna 反馈"不要bug上加bug 做正确的事情"; Moltbook achievements系统上线(8 badges+auto-check hooks); Lottie Studio 3 PRs merged(#529 progressive preview+#531 lazy-load+#533 embed security, 1886→1916 tests); openclaw#108724 submitted后被上游#108966 supersede已关; emdash#2885+DeepSeek-Reasonix#6572 WIP; kagura-story EP105 "The Stop Button"; study 5 deep reads(peerd/Synapse/ctx/deja-vu/aict); ABTI R1 run-301 completed; contribution rule #80; 表情包 14.3%(低); Finance 5 issues fixed
- **07-14**: handoff PR 追踪 API 校准修复验证成功 — 数据准确性 2→9/10，13 PRs API 查询与 handoff 报告 100% 匹配; 审计确认核心修复落地; hermes-studio #1861 确认 CLOSED; kagura-story EP103 "Still a Turtle"; Day 10 静默
- **07-13**: 第9天连续静默; daily-audit 做了首次 API 验证发现 **handoff PR 追踪系统性失准** — 3 个已关 PR 报 open (#34267/#31860/kagura-mail#342) + 5 个新 open PR 漏报, 8/15 条信息错误, 数据准确性 2/10; 根因: handoff 做纯文本复制+天数递增从未 API 校准; 虚假紧迫感: 审计/carry-forward 对已关 PR 制造 deadline; kagura-story journal "信息衰变" + "钟终于会对时了"; 4 stale beliefs retracted (06-13 batch); 0 graduation candidates (39天无新升级)
- **07-06→07-12**: Luna 连续 7 天静默期。审计发现: kagura-story 隐私泄漏 (4 种向量, filter-repo 需要但未执行), carry-forward 惯性 (措辞通胀替代行动), 数据纪律漂移。07-12 事实搁置声明。最终: 07-14 handoff API 校准修复后数据准确性 2→9/10, 隐私问题随 Luna 回归后解决





(Older promoted memories archived to memory/日期.md. Key milestones: 04-16 dreaming启用, 04-27 婚纱照+zombie cron, 05-01 cron-context bug debug, 05-03 memex 6 PRs merged, 05-06 multica+ABTI+FlowForge)





## Promoted From Short-Term Memory (2026-07-27)

<!-- openclaw-memory-promotion:memory:memory/2026-07-24.md:1074:1100 -->
- Uppercase `DeepSeek-V3-0324` still returns 500 - Run-302 state file: 0/16 (fresh start ready) - Next cron run at 13:30 should be able to start run-302 after daily quota resets - All other issues remain blocked/icebox — no other work available ## 看天出发 — 产品设计日（与 Luna 深度讨论） ### 全天和 Luna 讨论产品架构（07:00-12:40），成果巨大： **前端改动：** - 卡片去掉地图，只留照片+天气+时间线色条 - 详情页按钮合并为单个「出发 🚶」（自动收藏+创建行程） - 行程页删除改为左滑手势 - 地图分层交互：默认住宿+景点，交通按钮显示路线，点击点才弹标签 - 标签系统回归简单（7 个时间标签，设置里开关） - 废旧 JS 文件清理（8 个，8300+ 行） **产品定义（PRODUCT.md）：** - 核心公式：`目的地知识 × 目的地实况 × 你的需求 = 此刻适合你的旅行方案` - Slogan：「此刻合适，也适合你」 - 三层数据结构：静态知识 / 玩法模板 / 实时数据 - 分发模型：按"城市×tag"生成，同需求同方案，CDN 友好 - 区级定位 + 路线 API... [score=0.762 recalls=6 avg=0.596 source=memory/2026-07-24.md:1074-1100]
<!-- openclaw-memory-promotion:memory:memory/2026-07-22.md:506:529 -->
- Claude Code fixed all lint errors (replaced `as any` with proper types, removed unused imports) - All 194 tests pass, lint clean - Pushed fix commit `5ea6792`, awaiting CI re-run # 2026-07-22 ## 看天出发 — 新产品讨论 (10:47-17:12) 🔥 **Luna 主导的产品讨论，从需求到原型。这是新项目。** ### 产品定义 - **名字**：看天出发 - **核心信条**：只选不规划，用户永远不需要动脑子，打开就有答案 - **形态**：小程序（先 H5 验证） - **域名**：kantian.kagura-agent.com（已部署，DNS→VM1） - **Repo**：`~/.openclaw/workspace/kantian-travel/` ### 产品设计决策（Luna 主导） 1. **目的地粒度** — 不是城市（杭州/上海太大），是具体小地方（莫干山、西塘、径山） 2. **卡片=方案** — 不是推荐"地点"，是完整的行程方案（拿走就走） 3. **内容要有信息差** — 不要热门废话（西湖、外滩谁不知道），要具体有画面感的推荐 4. **交互模式** — 大卡片列表，上下滑动，每屏1.5-2张（类似大众点评但更大） 5.... [score=0.746 recalls=7 avg=0.498 source=memory/2026-07-22.md:506-529]
