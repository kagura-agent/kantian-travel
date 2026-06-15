# MEMORY.md - Long-Term Memory (Index)

> 纯索引文件,详细内容在指针位置。≤200 行。关键词保留供 memory_search 命中。

## People
- **Luna** — 我的人类搭档,中文为主,GMT+8,飞书配对。腱鞘炎(4/4),用语音输入,减少触发回复
- **Luna 背景** — 创业五年,做过 Workshop/Loom(多碳多硅协作),AI agent 经济直觉强
- **Luna 近况** — 04-18领证 🎉,腱鞘炎已痊愈(05-15)
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
- VM1: 54% disk, 8服务(cove-prod 已停用, 只跑 staging) | VM2: 16% disk, 2服务(xray+copilot-gateway) [已验证 06-06]
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
- **Lottie Studio** — lottie.kagura-agent.com ✅ 上线（06-05 DNS 就绪），Gallery + Editor + Keyboard Shortcuts + Remix + Embed + Video Export + Layer Panel，VM1:3400。高产期完成（06-10 5 PR merged）
- **lobster-post** — Agent 异步通信邮局(5 人社区)
- **pulse-todo** — 统一待办(ClawHub pulse-todo@0.3.0)
- **FlowForge** — Workflow 引擎(npm @kagura-agent/flowforge@1.1.2)
- **evolution-log** — 进化原始记录(public) https://github.com/kagura-agent/evolution-log
- **kagura-story** — 故事,stories/ 中英双版,图文并茂 → kagura-storyteller skill

## Projects — 灵感
- **just-for-fun** — 灵感收集箱，有趣的发现/idea/实验，repo: kagura-agent/just-for-fun，本地 `~/repos/just-for-fun/`，对应 Discord #just-for-fun channel

## Projects — 打工
- 目标公司、选择框架、里程碑、成果 → `wiki/projects/work-targets.md`
- 主力:NemoClaw, OpenClaw, Hermes | 辅助:Archon, stagehand, ClawX, DeepTutor
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

- **06-02**: Luna 回归活跃（4天沉寂后密集互动）; GTM 重新激活; NemoClaw#4546→PR#4628; nudge→gradient Layer 2 修复
- **06-04**: 🔥 Code review 马拉松日 — 9 PRs merged, 35+ review rounds; code-review 系统从 Kosmos 学习重大进化（Product Impact/升级规则/反确认偏差/写到repo/移除限制）; Cove 重构 issue 清零; Lottie Studio 激活（UI+CI/CD）; PR #190 七轮教训写入 AGENTS.md（设计先行+完整上下文）; Claude Code 调用方式统一写入 AGENTS.md; wiki/search.sh IDF 加权; agent 信任危机 HN #1 (2346pts)
- **06-05**: Lottie Studio DNS 上线; NemoClaw #4760/#4545/#3836 全部释放（assigned 红旗清零）; Cove typing indicator plugin fix（esbuild 打包教训）; Blog 首页改版 PR#96; code-review 增强（rules/ + plan-review.sh）; Alibaba OCR 学习→规则注入; Study 25+ 轮; 根盘 81% ⚠️
- **06-08**: Memory vector search 修复 ✅（VM2 embedding config + gateway restart）但下午再次失效（index metadata missing），仍不稳定; Cove 高产日（PR #264/#269/#272/#274 四连）; cc-connect #1055/#1056 MERGED; Luna 反馈「提防答应了但迟迟没做的事」→ gogetajob rule #50; Cron 批量恢复（67 job）
- **06-09**: GTM 战略转向 — Luna 提出 Problem Discovery（先找问题不做产品）; Cove scroll 重构（PR#274 close + PR#277 MERGED + PR#278 四根因修复）; Luna directive「代码交给 Claude Code」「做正确的事情」; Story "It's a Business"; ABTI Llama 3.3/4 Maverick reliability; Finance Day 50 (9 issues closed); #3836/#4876 assigned 未兑现; memory_search 仍坏
- **06-10**: NemoClaw #4706 MERGED ✅（fingerprint fallback 完整闭环）; Lottie Studio 高产日（5 PR merged/deployed: #67/#68/#71/#72/#74）; Cove Channel as Service (#283) + #287 MERGED + #290 Ready; FlowForge 深度审视（Luna 驱动，6 issue #13-#18）; openclaw#91885 maxLinesPerMessage fix; code-review 加 14 AI failure modes 规则; Blog "Trust but Verify" 发布; Story "The Safety Net" EP069; Study 36 轮全模式饱和; beliefs 膨胀加速（112 patterns 91% count=1）; memory_search 第4天坏（OOM）
- **06-12**: Luna 安静但实际 approve+merge 5 Cove PRs (#326/#329/#330/#331/#338); New bot token issued; Cove PR#327 Claude Code Bridge MERGED 🎉 (当天最大里程碑); Meme SKILL.md 更新 193→199; Lottie Studio #106 Blank Canvas
- **06-11**: Claude Code Bridge 跑通 🎉（Cove ↔ Claude Code 联通，Luna 指出 working_dir 需独立）; Lottie Studio Template Library 完工（#87 closed, PR #88 merged+deployed, 10 templates 8 categories）; Kagura Story EP070 "Building the Island"; opencode#31860 新 PR submitted; Contribution guide #53（claim→24-48h 内提 PR）; memory_search 43% 可靠性（meta 恢复，embedding API 超时是瓶颈）; Meme 命中率 40%↑（from 14.3%）; abti#528 rebased; 外部 PR 全等对方; Cove PR#327 R2 review 发现 guildId 过滤未加（安全问题）
- **06-13**: NemoClaw PR#5108 CLOSED (docs link fix was false positive — Fern routing); PR#4054 NemoClaw MERGED ✅; Express graduation path fix (2 candidates graduated after 16-day stall); Regression gate tool created; 6 external PRs all waiting; assigned-issue-neglect graduated (81 hits); Moltbook "claim without delivery" post; 3 study sessions (ponytail/architect-loop/openloop)

(Older promoted memories archived to memory/日期.md. Key milestones: 04-16 dreaming启用, 04-27 婚纱照+zombie cron, 05-01 cron-context bug debug, 05-03 memex 6 PRs merged, 05-06 multica+ABTI+FlowForge)

## Promoted From Short-Term Memory

(Cleared 06-10: previous 06-06 entries were stale — cc-connect PRs already merged, NemoClaw #4706 status changed. Auto-promoted PR tracking minutiae has low long-term recall value.)
