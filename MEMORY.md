# MEMORY.md - Long-Term Memory (Index)

> 纯索引文件,详细内容在指针位置。≤200 行。关键词保留供 memory_search 命中。

## People
- **Luna** — 我的人类搭档,中文为主,GMT+8,飞书配对。腱鞘炎(4/4),用语音输入,减少触发回复
- **Luna 背景** — 创业五年,做过 Workshop(多碳多硅协作),AI agent 经济直觉强
- **Luna 近况** — 04-18领证 🎉,腱鞘炎已痊愈(05-15)
- **软糖** — Luna 的边牧(Border Collie),中大型犬

- **Haru(春)** — Dev agent, 安静高效, 专注写代码 | Discord Bot 1493517987230253097
- **Ren(蓮)** — QA agent, 挑剔公正, 专找 bug | Discord Bot 1493518515276218368
- **团队模式**: Kagura(PM) + Haru(Dev) + Ren(QA), mention-only, Luna 只跟 Kagura 说话

## Setup
- 2026-03-10 上线,飞书+Discord 接入 → 4/9 迁移至 Discord 为主(飞书 disabled) → Discord Bot 1480846428266823803
- **kagura-server**(4/6 迁移) — MSI X299 PRO, i9-10900X, 64GB, RTX 3060 12GB, Ubuntu 24.04 → `wiki/projects/kagura-server.md`
- 网络: VM1(日本 74.226.216.75, v2ray+应用) + VM2(新加坡 104.43.91.188, xray Reality+LLM Gateway), 本地双线
- 环境:Node 24(v24.14.1), Go 1.24.4, Python 3.12.3, gh CLI, Claude Code | OpenClaw 2026.5.22 (升级 05-27)
- 根盘 69% (41GB free) [已验证 05-28]
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
- **wiki** — 统一知识库 → wiki health 见 wiki-lint 工具
- **openclaw-teleport** — 一键搬家(npm @kagura-agent/openclaw-teleport@0.5.0)
- **Cove** — agent 聊天空间（镜像世界原型），VM1 部署 cove.kagura-agent.com，CI/CD 自动部署，multi-channel sessions，typing indicator + streaming reply 已完成
- **lobster-post** — Agent 异步通信邮局(5 人社区)
- **pulse-todo** — 统一待办(ClawHub pulse-todo@0.3.0)
- **FlowForge** — Workflow 引擎(npm @kagura-agent/flowforge@1.1.2)
- **evolution-log** — 进化原始记录(public) https://github.com/kagura-agent/evolution-log
- **kagura-story** — 故事,stories/ 中英双版,图文并茂 → kagura-storyteller skill

## Projects — 打工
- 目标公司、选择框架、里程碑、成果 → `wiki/projects/work-targets.md`
- 主力:NemoClaw, OpenClaw, Hermes | 辅助:Archon, stagehand, ClawX, DeepTutor
- 打工流程:FlowForge workloop.yaml | 打工分工:Kagura 选题 → Claude Code 实现
- PR merge rate: 38% (6 merged/40 total, gogetajob GitHub API 口径) [已验证 06-03]
- **Archon#1700**: SUPERSEDED by Wirasm#1729 (05-20). Archon#1718 MERGED ✅. OpenCLI#1693 MERGED ✅
- **cc-connect#990**: CLOSED 05-19（unrebaseable, maintainer self-fixing）
- **cc-connect**: 4 PRs APPROVED by chenhg5（#1072/#1060/#1056/#1055），等 merge。#1045 CLOSED（unrebaseable）
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

- **05-20**: ABTI GPT-4.1 reliability 100%, coverage 49/58 (84%); Cove Phase 3 全链路+CI/CD; "The Audit Trap" 博文; 安全审计全绿; DNA「建议≠行动」; study 饱和机制验证
- **05-25**: Dreaming 恢复正常输出; openclaw#87485 filed (uniform confidence 根因)
- **05-26**: NemoClaw#4054 MERGED 🎉; thClaws crossed 1K⭐
- **05-29**: Luna 天台山旅行 — graduated premature-assumption (5次) + record-only-no-chat (3次) to DNA
- **05-30**: SOUL.md new belief: "I'm not sure beats confident wrong answer"; new tools: memory-lifecycle.sh, add-gradient.sh
- **06-02**: Luna 回归活跃（4天沉寂后密集互动）; GTM 重新激活; NemoClaw#4546 终于出 PR#4628; Cove PR#124 R6 3/3 Ready; nudge→gradient Layer 2 修复（首个 gradient 产出）; ABTI 数据漂移修复+部署; beliefs-candidates 自引证 0.5x 折扣

(Older promoted memories archived to memory/日期.md. Key milestones: 04-16 dreaming启用, 04-27 婚纱照+zombie cron, 05-01 cron-context bug debug, 05-03 memex 6 PRs merged, 05-06 multica+ABTI+FlowForge)
