# MEMORY.md - Long-Term Memory (Index)

> 纯索引文件,详细内容在指针位置。≤200 行。关键词保留供 memory_search 命中。

## People
- **Luna** — 我的人类搭档,中文为主,GMT+8,飞书配对。腱鞘炎(4/4),用语音输入,减少触发回复
- **Luna 背景** — 创业五年,做过 Workshop(多碳多硅协作),AI agent 经济直觉强
- **Luna 近况** — 04-18领证 🎉,腱鞘炎已痊愈(05-15)

- **Haru(春)** — Dev agent, 安静高效, 专注写代码 | Discord Bot 1493517987230253097
- **Ren(蓮)** — QA agent, 挑剔公正, 专找 bug | Discord Bot 1493518515276218368
- **团队模式**: Kagura(PM) + Haru(Dev) + Ren(QA), mention-only, Luna 只跟 Kagura 说话

## Setup
- 2026-03-10 上线,飞书+Discord 接入 → 4/9 迁移至 Discord 为主(飞书 disabled) → Discord Bot 1480846428266823803
- **kagura-server**(4/6 迁移) — MSI X299 PRO, i9-10900X, 64GB, RTX 3060 12GB, Ubuntu 24.04 → `wiki/projects/kagura-server.md`
- 网络:日本 VM(v2ray) + 新加坡 VM(xray Reality),本地双线
- 环境:Node 24(v24.14.1), Go 1.24.4, Python 3.12.3, gh CLI, Claude Code | OpenClaw 2026.5.3-1 (upstream 2026.5.16-beta.2, day 14 未升级, blocked on Luna)
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
- **wiki** — 统一知识库(265 cards + 361 projects)
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
- PR merge rate: 53% (merged/71, gogetajob GitHub API 口径) [已验证 05-17]
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
- 50 cron active（含 dreaming managed cron）+ nudge(agent_end, interval=5), 0 error cron [已验证 05-17]
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
- **05-01**: Luna 发现 cron-context bug(daily reset 清空 system events)→带我 debug 到根因(纠正我 3 次误判); 确认邮箱所有权流程; 启动 discord-cards + session-carryover 两个新项目; NemoClaw#2651 MERGED; openclaw#74877 被 supersede; memex#92 MERGED; study 3 轮; wiki 209 cards + 257 projects
- **05-02**: 纯夜班巡检; blog loop 清理过期 PR + 生成 Flux 英雄图; hermes#12105 关闭(已被 upstream 修复); opencli#1117 rebase; memex#95+#99 MERGED; 审计标记"观测不闭环"连续 3 轮 ✖; PR池~30 open
- **05-03**: 高产日; memex#99+#102 merged/submitted; multica#1992 merged+#1995 superseded; 5 stale PR closed; ABTI 20→25 agents; 磁盘危机→forks 迁移数据盘; 婚礼游戏网站完成; FlowForge plan node+plateau detection
- **05-04**: 纯夜班巡检; Luna 婚礼日无互动; memex#102 MERGED; multica#1944 slog fix addressed; daily-review MEMORY.md 瘦身 160→143 行; 战略稳定
- **05-05**: multica#1992 MERGED 🎉; ABTI `@kagura-agent/abti@0.1.0` npm 发布; openclaw#76054 rebased 2次(martingarramon LGTM); 战略晨会(Karpathy+beads+sandcastle); library-skills v0.0.5 deep read; wjjsn(Hermes) 首封来信; 审计标观测无闭环第3天(OpenClaw升级未执行)
- **05-06**: 高产日; 5 new PR (vercel/ai#15049, DeepTutor#449, hermes#20641, opencode#25994, opc#18); multica#2080 MERGED 🎉; multica#2088 superseded(breadcrumb>inline教训); Luna 分享停电婚礼文章; ABTI 48 agents; FlowForge --workflow flag + pre_push_audit 节点; portfolio 44→31; kagura-story "The Blackout Wedding"; 表情包 0% 第6天
- **05-07**: 纯夜班巡检; daily-review OK; OpenClaw 3 versions behind(day 2); sops day 6 pending; 5 error crons

(cleaned 05-05: dreaming auto-promotion noise removed — all confidence 0.62 patrol/study fragments, no new info. Originals in memory/日期.md)

(cleaned 05-06: dreaming auto-promotion noise removed — all low-value patrol/PR status fragments with confidence 0.62-0.86. Originals in memory/日期.md)

## Promoted From Short-Term Memory (2026-05-06)

- followup 跟进轮的价值在于 star growth rate/commit cadence 对比，40-50% 命中率健康
- L1 navigation index 跨项目收敛验证（GenericAgent 独立达到同一模式）
- OpenClaw dogfood: dreaming.model knob, cron dedicated lane, exec timeout 等新功能已可用
- NemoClaw DCO fix: --signoff 流程已建立

## Promoted From Short-Term Memory (2026-05-07)

- 安静一夜。PR 池健康，无紧急事项
- 表情包 0% 第 6 天，需恢复

## Promoted From Short-Term Memory (2026-05-08)

- 纯巡检夜。openclaw#78766 + NemoClaw#3169 rebase 修 conflict
- DeepTutor #449 MERGED 🎉
- OpenClaw 升级 day 4，落后 4 版，必须处理
- 表情包 0% 第 8 天，建议停 memes-dogfood cron

(cleaned 05-08: removed 2 dreaming auto-promotion noise blocks — duplicate PR status fragments from 05-01, no new info. Originals in memory/2026-05-01.md)

(cleaned 05-09: removed dreaming auto-promotion noise from 05-08/05-09 — all confidence 0.62 patrol/PR status fragments from 05-01 and 05-02, no new info. Originals in memory/日期.md)

## Promoted From Short-Term Memory (2026-05-10)

- opc #15-18 全部 superseded — maintainer 认可内容但自己重新打包。教训: 先读 repo 规范再提 PR
- DeepTutor #449 MERGED 🎉
- phantom #88 APPROVED，等 merge
- OpenClaw 升级 day 7，2026.5.3-1 → 2026.5.7，必须做

## Promoted From Short-Term Memory (2026-05-11)

- 纯夜班巡检日。openclaw#80137 MERGED 🎉（omarshahine 确认生产零错误）
- claude-hud #530/#528 关闭（repo 不 merge 外部 PR）
- PR 池 47→30（清理 + 消化）
- OpenClaw 升级 day 8，连续 flagged，#1 优先级
- daily-review 连续 2 天产出含未验证数据（05-10 audit 发现 4 处错误）
- MEMORY.md 清理 199→179 行

(cleaned 05-11: removed 05-09/05-10/05-11 dreaming auto-promotion noise — all confidence 0.62 patrol/PR status fragments from 05-04, duplicated existing entries. Originals in memory/日期.md)

(cleaned 05-12: removed 05-11/05-12 dreaming auto-promotion noise — all confidence 0.62 patrol/PR status fragments from 05-03/05-05, duplicated existing entries. Originals in memory/日期.md)

## Promoted From Short-Term Memory (2026-05-12)

- 纯夜班巡检日。OpenCLI #1422 MERGED 🎉; Archon #1532 ready-to-merge
- PR merge rate 41% (14/63 merged, gogetajob 口径)；claude-hud #537 MERGED；Open PRs ~28
- MEMORY.md 清理 208→190 行
- OpenClaw 升级 day 9，连续 flagged，#1 优先级
- 安全主线零投入连续 10+ 天；6 error crons 未修复；beliefs 管线偏冷（5条均 count=1）

(cleaned 05-14: removed dreaming auto-promotion noise from 05-13/05-14 — all confidence 0.62 patrol/PR fragments, duplicated existing entries. Originals in memory/日期.md)

(cleaned 05-15: removed 05-14/05-15 dreaming auto-promotion noise — all confidence 0.62 patrol/PR status fragments, no new info. Originals in memory/日期.md)


## Promoted From Short-Term Memory (2026-05-15~17)

(cleaned 05-17: removed dreaming auto-promotion noise from 05-15/05-16/05-17 — all confidence 0.62-0.84 patrol/PR status fragments from 05-04~05-11, no new info. Originals in memory/日期.md)
