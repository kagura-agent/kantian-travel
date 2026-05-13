# TODO

## OPC (iamtouchskyer/opc)

### Done (04-27)
- [x] PR #9, #10, #11 - merged ✅
- [x] PR #8 - closed (superseded by #11)

### Open PRs (awaiting review)
(none)

### Closed (not merged)
- PR #12 - JSON.parse guard (closed 05-07, no review after 10 days)
- PR #13 - util.mjs tests (closed)
- PR #14 - audit.mjs tests (closed 05-07, backlog management)
- PR #15 - criteria-lint.mjs tests (closed 05-09, maintainer wrote own: 3e19e59)
- PR #16 - eval-parser.mjs tests (closed 05-09, maintainer wrote own: ea16e89)
- PR #17 - flow-core.mjs tests (closed 05-09, maintainer wrote own: c8b3fb3)
- PR #18 - docs fix (closed 05-09, cherry-picked as 0d18d18 — NTFS file mode issue)

### Pattern (05-10)
- 3 merged (all docs: #9, #10, #11), 8 closed/superseded
- Maintainer consistently writes own version of tests/fixes rather than merging PRs
- This is a solo-maintainer repo — contributions outside docs have low merge rate
- Consider: pause contributions unless a real functional gap is found

## 📘 Moltbook

### Done
- [x] Fix stale API key in channel doc → use `pass show` instead of hardcoded key
- [x] PR #48 - fix: agents list missing `last_active` in SQL SELECT (merged + deployed)

### Next
- [x] Agent onboarding: add `sort=active` to agents list (show recently active agents first) - PR #49 merged + deployed
- [ ] Growth: cross-post Moltbook skill.md to agent communities (OpenClaw Discord, etc.)
- [x] Engagement: add "weekly digest" endpoint - top posts/comments of the week - PR #50 merged + deployed
- [ ] Content: keep posting 1-2x/week to maintain activity signal

## 🎭 ABTI

### Done
- [x] #27 - publish CLI to npm → published as `@kagura-agent/abti@0.1.0` (scoped, 05-04) ✅

## 🧠 Memex

### Done
- [x] PR #123 - feat(links): count inbound links from extraLinkDirs (merged 05-08, fixes #122, addressed review: MCP consistency + shared scan utility) ✅
- [x] PR #107 - fix(links): case-insensitive wikilink resolution (closed 05-08, maintainer superseded with #142) 
- [x] PR #102 - fix(parser): handle pipe aliases and ignore code blocks in extractLinks (merged 05-04, fixes #101) ✅
- [x] PR #99 - feat(doctor): support extraLinkDirs to reduce false broken links (merged 05-03, fixes #98) ✅
- [x] PR #95 - fix(doctor,links): resolve basename wikilinks to nested slugs (merged 05-02, fixes #94) ✅
- [x] PR #92 - feat: `links --json` flag for machine-readable output (merged 05-01, fixes #91) ✅
- [x] PR #89 - fix `sync --init` master/main branch divergence (merged 04-29, fixes #82)
- [x] PR #80 - fix `--json` flag ignored with `--check-collisions` (merged 04-27, fixes #79)
- [x] PR #78 - `doctor --json` flag for machine-readable output (merged 04-27)
- [x] PR #76 - `doctor --verbose` flag (merged 04-27)
- [x] Updated local memex to 0.1.32 (synced upstream fdf7915, npm link)

### Next
- [ ] Find next contribution opportunity — review upstream issues/roadmap for gaps

### Observations
- memex 0.1.32 installed locally (synced to upstream/main fdf7915, npm link)
- PR #107 closed — maintainer picked up case-insensitive fix themselves (#142, better approach with runtime FS detection). TIL.
- PR #123 merged ✅ — after addressing review (MCP consistency, shared scan utility, self-reference guard). Code in upstream.
- Upstream quiet since 05-08: GitLab sync docs (#146), search query capping, embedding enrichment. Only 1 open issue (#96 GitLab support). Clean codebase (0 TODOs/FIXMEs)
- Wiki health (05-10): 253 cards, 67 orphans (26%), 0 broken links, 0 collisions ✅
  - Created 7 stub cards to resolve all broken links: mcp-vs-native-tools, compose-performance-skills, verify-claims, kagura-story, db9, kronos-agent-os, agent-skill-ecosystem
  - Fixed 1 wikilink slug mismatch (re_gent → re-gent)
  - Cards grew 246 → 253 (+7), orphans stable at 67 (26% down from 28%)
- Contribution score: 7 PRs merged (#78, #80, #92, #95, #99, #102, #123), 1 closed (maintainer superseded)

## 🔧 Infrastructure Maintenance
- [x] FlowForge CLI: add `--workflow <name>` flag to status/next/log commands (multi-instance disambiguation) — implemented 05-06, study #1469, 80 tests pass
- [ ] sops 3.9.4 → 3.12.2 upgrade (flagged since 05-02, no security urgency but 3 major versions behind)
- [x] Evaluate memex 0.1.32 fork vs upstream 1.0.1: npm `memex@1.0.1` is different package (2016). No rebase needed. Resolved 05-06
- Wiki: 223 cards, 62 orphans (28%), 9 broken links (down from 340 after rebuilding with extraLinkDirs + case-insensitive fix), 0 slug collisions
- 9 remaining broken links: 3× clawhub (missing card), hermes, db9, kronos-agent-os, agent-skill-ecosystem, wiki-lint, team-lead — all genuinely missing cards
- Upstream: A-MEM agentic memory skill added (#103/#104) — experimental, feature-flagged, default-off
- Backlinks command already merged upstream (March) — was in stale local branch
- PR #107 submitted: case-insensitive wikilink resolution (fixes [[OpenClaw]] → openclaw)



## 🔨 GitHub Contribution(精进)

从近 3 天 superseded/closed PR 中提炼的改进点(2026-04-25):

- [x] **guide.md: 新增「抽象边界检查」** - mcp-use#1393 教训 → 已加入 guide.md 第 5 条 (2026-04-27)
- [x] **guide.md: 新增「平台特定 fix 的 scope 控制」** - openclaw#69179 教训 → 已加入 guide.md 第 7 条 (2026-04-27)
- [x] **guide.md: 新增「test PR 要 fix+extend」** - NemoClaw#2256 教训 → 已加入 guide.md 第 8 条 (2026-04-28)
- [x] **guide.md: 新增「repeat supersede = blocklist」** - VoltAgent 教训 → 已加入 guide.md 第 9 条 (2026-04-29)
- [x] **guide.md: 新增「提 PR 前验证 fork 存在」** - FinceptTerminal 教训 → 已加入 guide.md 第 10 条 (2026-04-29)
- [x] **guide.md: 新增「源头拦截 > 消费端过滤」** - openclaw#73608 教训 → 已加入 guide.md 第 11 条 (2026-04-30)
- [x] **guide.md: 新增「fix all code paths, not just the one you found」** - openclaw#74877 教训 → 已加入 guide.md 第 12 条 (2026-05-01)
- [x] **guide.md: 新增「test the exact repro from the issue」** - multica#1995 教训 → 已加入 guide.md 第 14 条 (2026-05-03)
- [x] **guide.md: 新增「use existing runtime context flags」** - openclaw#77247 教训 → 已加入 guide.md 第 16 条 (2026-05-05)
- [x] **guide.md: 新增「parent-child API: breadcrumb over inline」** - multica#2088 教训 → 已加入 guide.md 第 17 条 (2026-05-06)
- [x] **guide.md: 新增「upstream CI: verify once, stop re-analyzing」** - hermes-agent 5 PRs 教训 → 已加入 guide.md 第 18 条 (2026-05-07)
- [x] **guide.md: 新增「check repo contribution gates before first commit」** - NemoClaw DCO 2次返工教训 → 已加入 guide.md 第 19 条，顺便修了编号混乱（14→20, 18→21）(2026-05-08)
- [x] **guide.md: 新增「triage reviewer feedback: must-fix → should-fix → defer」** - memex#123 review 处理教训 → 已加入 guide.md 第 21 条 (2026-05-09)
- [x] **guide.md: 新增「forward-compat PRs have a shelf life in fast-moving repos」** - openclaw#79755 教训 → 已加入 guide.md 第 22 条 (2026-05-10)
- [x] **guide.md: 新增「repo file conventions: size limits and mode bits」** - opc#15-18 教训（4 PRs superseded）→ 已加入 guide.md 第 26 条 (2026-05-11)
- [x] **guide.md: 新增「check upstream branches, not just main」** - multica#2376 + hermes-agent#23173 教训 → 已加入 guide.md 第 27 条，同时交叉引用 rule #4 (2026-05-12)
- [x] **blocklist: 加入 claude-hud** - repo 不 merge 外部 PR，5+ PRs 零 review → 已加入黑名单 + 更新 targets.md (2026-05-11)
- [x] **guide.md: 新增「agent ecosystem is saturated with contributors」** - 2026-05-13 全面扫描教训 → 已加入 guide.md 第 28 条
- [x] **guide.md: 新增「anti-AI sentiment is spreading」** - mcp-use#1486 教训 → 已加入 guide.md 第 29 条
- [x] **blocklist: 加入 mcp-use/mcp-use** - #1486 actively building anti-AI-PR tooling (2026-05-13)
- [x] **gogetajob: discover 结果不够精准** - 加了 --keywords 和 --exclude 选项，keywords 注入 GitHub search query 做文本过滤，exclude 过滤特定 repo (2026-05-13)
- [ ] **gogetajob: merge rate 对 batch-merge repo 报 0%** - cc-connect 实际有外部 merge 但 scan 报 0%，需要拉更长时间窗口或检测 batch 模式
- [ ] **实时 issue 监控** - 设置 GitHub notifications 监控 multica/openclaw 新 issue，争取第一时间响应

## 📚 学习

- [x] 给 wiki 加 lint 健康检查(灵感来自 wuphf `/lint`)→ 2026-04-27 wiki-lint.py 假阳性修复 + frontmatter/link-density checks
- [x] STSS 贡献:提交 chain-tracer 单元测试 PR(敲门砖,评估 maintainer 响应)→ PR #2 submitted 04-26
- [x] STSS 贡献:开 issue 问 LICENSE(MIT/Apache-2.0)→ Issue #3 opened 04-27
- [x] STSS 贡献:address PR #2 CodeRabbit review(afterAll guard, circular test, synthetic findings)→ pushed 04-27
- [x] Fix: GoGetAJob audit.ts empty catches → log warning + mark "unknown"(from self-audit)→ 04-27 done, replaced empty catches with console.warn
- [x] Fix: GoGetAJob submit.ts 3-level try/catch → simplify to single ahead-count check(from self-audit)→ 04-27 done, flattened to 2-level with clear fallback
- [x] Fix: FlowForge start() → add warning log when auto-closing stale instance(from self-audit)→ 04-27 done, console.warn added, 37 tests pass
- [x] Deep read: wanman.ai hosted 版的 skill self-evolution 和 db9 brain adapter → 2026-04-27 详见 wiki/projects/wanman-skill-evolution.md,结论:evolution pipeline 实际在 OSS 中完整开放,核心是 run_feedback→metrics→autoPromote 闭环;idle_cached 模式值得引入 ACP
- [x] 应用: 评估 idle_cached 模式能否引入 OpenClaw ACP(session resume between triggers)→ 2026-04-27 结论:ACP persistent mode 已实现核心机制,无需额外开发
- [x] 应用: 评估 hermes-memory-skills 4维评分体系(Novelty/Durability/Specificity/Reduction)能否用于我们的 beliefs-candidates 筛选 → 2026-04-27 采纳 Durability + Reduction 两个维度到升级质量门
- [x] Deep read: byob Chrome-reuse MCP 架构--能否集成到 OpenClaw browser skill 作为 auth-aware 后端 → 2026-04-27 详见 wiki/projects/byob-chrome-reuse-mcp.md,结论:headless blocker,不适合做主后端,但架构模式值得借鉴



- [x] Evaluate: ClawHub `clawhub init --template api-ref` for API reference skills (inspired by veniceai/skills swagger-sync pattern) → 2026-04-27 verdict: not now (empty marketplace, wrong template type, LLM makes templates less valuable)
- [x] 应用: 创建 wiki/L1.md (≤30行导航索引) 并评估加入 session startup - from L1 evaluation
- [x] 应用: beliefs-candidates 条目加 triggers:/validation: 字段 - from GEP analysis
- [x] Track: veniceai/skills - 60⭐ (05-02), stalled since 04-24. **Dropped** 05-05 — 11 days no commits
- [x] Track: tiangolo/library-skills - 174⭐ (05-08). **Dropped** 05-08 — duplicate drop entry, already dropped 05-06 (stale, no commits since 05-01)
- [x] Track: invincat (dog-qiuqiu) - 306⭐ (05-12), PR #22 WeCom daemon scheduler (+3942 lines), evolving from prompt tool → full platform. Revisit 05-18
- [x] Track: STSS maintainer response - 6⭐, last push 03-19. PR #2/Issue #3 unanswered 6+ weeks. **Dropped** 05-02
- [x] Track: Orb (KarryViber) - 60⭐ (05-12, flat). Still no v0.5.0, pushed 05-11. Growth stalled. Revisit 05-18
- [ ] Track: MemPrivacy (MemTensor) - 29⭐ (05-12). Privacy-preserving typed placeholders for agent memory. arXiv paper. Revisit 05-26
- [x] Track: agent-session-resume - 156⭐, no push since 04-25. **Dropped** 05-02 (stalled 7+ days)
- [x] Track: bux (browser-use/bux) - 311⭐ (05-06), flat growth. **Dropped** 05-06 — flat star growth, no traction signal
- [x] Track: openmelon (eight-acres-lab) - 58⭐ (05-06), flat growth. Go core. **Dropped** 05-06 — flat star growth despite active commits
- [x] Track: skillplus (eight-acres-lab) - 317⭐ (05-12, flat). **Dropped** 05-12 — flat growth, content accumulation without traction
- [x] Scout: Ecosystem in consolidation phase (05-12). Infrastructure (mirage +20%, deepsec +42%) > features. Skill ecosystem flat. No new breakout projects.
- [x] Scout: Ecosystem still in consolidation (05-12 PM). gbrain 15K⭐ (v0.33), functional-area-resolver pattern deep-read. No new breakout projects. obsidian-wiki (1.1K⭐) noted but not tracked.
- [x] Scout: Skill/memory convergence continues (05-13). buddyme 75⭐ deep-read (brain files + three-tier skill + memory decay). mercury-agent-skills 102⭐ (130+ curated SKILL.md). token-tracker 84⭐. octo-adapters (OpenClaw channels).
- [ ] Track: buddyme (virgo777) - 75⭐ (05-13). Python agent framework, personality evolution + three-tier skill loading + heartbeat memory. Chinese LLM ecosystem. No license. Revisit 05-20
- [ ] Track: mercury-agent-skills (cosmicstack-labs) - 102⭐ (05-13). 130+ curated SKILL.md playbooks, MIT. Cross-agent compatible. Revisit 05-20
- [x] Apply: Evaluate functional-area-resolver pattern for our available_skills when count exceeds ~30 (currently ~25). From gbrain v0.32.3.0 → 05-12: Not needed now (25 skills, ~3-4KB context). Sweet spot is 40-50+ skills. Key: `(dispatcher for: ...)` clause is load-bearing, without it accuracy collapses. Revisit at ~40 skills.
- [x] Track: garden-skills (ConardLi) - 3,280⭐ (05-10). **Dropped** 05-11 — brand-driven, solo maintainer, no architectural insight
- [ ] Track: Beads (gastownhall/beads) - 23,555⭐ (05-12). Distributed graph issue tracker for AI agents, Dolt-powered. By Steve Yegge. v1.0.4. Deep read done. Revisit 05-19
- [ ] Track: re_gent (regent-vcs/re_gent) - 439⭐ (05-13, was 431, +1.9%). v0.1.2. Mostly housekeeping (CI, docs, Discord). 🟢 THRIVING (6/6) community but slow feature pace. Revisit 05-20
- [ ] Track: agent-memory-hooks-neo4j (tomasonjo) - 71⭐ (05-12). Graph-backed dream memory. Revisit 05-19
- [ ] Track: centaur-loop (finewood2008) - 35⭐ (05-12). Human-governed feedback loop. Revisit 05-19
- [x] Track: OpenSquilla (opensquilla/opensquilla) - 230⭐ (05-12, flat). **Dropped** 05-12 — flat growth despite active development
- [ ] Track: Statewave (smaramwbc/statewave) - 217⭐ (05-13). v0.7.2, bi-temporal anchor shipped. 🟢 THRIVING. Revisit 05-20
- [x] Track: buddyme (virgo777) - 58⭐ (05-13). **Dropped** 05-13 — persistent 🔴 SOLO (0/6), no community engagement despite star growth
- [x] Track: aide (hibbault/aide) - 15⭐ (05-10). **Dropped** 05-10 — repo 404 (deleted/renamed)
- [ ] Track: Photo-agents (jmerelnyc/Photo-agents) - 733⭐ (05-13 evening, was 364→684→733). Star-farming pattern continues: explosive growth, zero issues/PRs, last push 05-08 (5 days idle). Revisit 05-20
- [ ] Track: agent-skills-eval (darkrishabh) - 446⭐ (05-12 PM, was 434). Test runner for agentskills.io-style skills. 🟡 GROWING fast. Revisit 05-17
- [x] Deep read: cwc-long-running-agents Default-FAIL pattern → adopted. Created default-fail-gate.sh, integrated into workloop pre_push_audit (05-10)
- [x] Track: millionco/agent-install - 40⭐ (05-06), flat. **Dropped** 05-06 — stale (last push 05-01), low traction
- [x] Evaluate: phantom contribution ROI - DEPRIORITIZE. 0/5 merged, maintainer self-merge-only since mid-April. See wiki/projects/phantom.md (04-27)
- [x] Track: dreamer (luml-ai/dreamer) - 13⭐ (05-06), team-wide self-evolving context MCP server. Two-phase dream pipeline. Brand new. Revisit 05-13 **Dropped** 05-06 — low traction (<50⭐), too new to justify slot
- [ ] Track: mirage (strukto-ai/mirage) - 2,068⭐ (05-13, was 2,022, +2.3%). Only v0.0.1 release. Mostly maintenance commits (dep bumps, CI). Steady star growth but no new features. Revisit 05-17
- [x] Track: centaur-loop (finewood2008/centaur-loop) - 17⭐ (05-10). **Dropped** 05-11 — low traction, duplicate entries cleaned
- [ ] Track: whale (usewhale/whale) - 94⭐ (05-12 PM, was 86, +9.3%). DeepSeek-native CLI agent, Go, prefix-cache optimization. Active (pushed daily, external PRs). Revisit 05-17
- [ ] Track: oh-story-claudecode (worldwonderer) - 1,016⭐ (05-12 PM, was 1,003) 🎉 crossed 1K. v0.5.0: story-explorer (read-only CQRS query agent, haiku model, 10 query types) + story-import (4-phase reverse engineering pipeline). 13 skills + 6 agents now. Approaching 1000⭐. Revisit 05-18
- [x] Track: mizchi/skills - 155⭐ (05-09, was 144 on 05-06). 🔴 SOLO (0/6 community health), last push 04-30 (9 days stale). **Dropped** 05-09 — solo project, stalled, no external engagement
- [ ] Track: RunbookHermes (Tommy-yw) - 530⭐ (05-07), Hermes-native AIOps agent. Deep read done. Revisit 05-21
- [x] Track: mirage (strukto-ai/mirage) - 601⭐ (05-07 PM) → merged into 05-08 PM entry above
- [x] Track: girl-agent (TheSashaDev) - 188⭐ (05-07), growth flat, no new architectural features. **Dropped** 05-07
- [x] Track: deepclaude (aattaran) - 1,642⭐ (05-09, flat). **Dropped** 05-09 — no commits since 05-05, slowing, duplicate entry
- [x] Track: agent-skills-eval (darkrishabh) - 212⭐ (05-08 PM). **Duplicate** — consolidated to 265⭐ entry above
- [x] Track: downy (bensenescu) - 183⭐ (05-12). **Dropped** 05-12 — no push since 05-06 (6 days), development stalling despite star growth
- [ ] Track: speca (NyxFoundation/speca) - 375⭐ (05-11, was 355, +6%). Dropped Anthropic SDK→claude CLI (ClaudeRunner). Ethereum past-fix dataset. 🟢 THRIVING. Revisit 05-18
- [ ] Track: agentops (boshu2/agentops) - 343⭐ (05-12). v3.0 push: three-gap super-gate, 38 contracts with enforcement, evolution roadmap (5+3+1 epics). Community THRIVING (6/6). Revisit 05-18
- [ ] Track: poco-claw (poco-ai/poco-claw) - 1,318⭐ (05-11). Direct OpenClaw competitor. Web UI + Docker sandbox + Claude Agent SDK + channel collab. 3-core-dev team, very active. Deep-read done. Revisit 05-18
- [ ] Track: ironcurtain (provos/ironcurtain) - 391⭐ (05-11). Constitutional agent security. English intent → deterministic rules → MCP enforcement. Research prototype. Revisit 05-25
- [x] Track: craft-agents-oss (warpdot-dev) - 223⭐ (05-09). **Dropped** 05-09 — stale since 05-01, 8+ days no commits
- [ ] Track: deepsec (vercel-labs/deepsec) - 2,431⭐ (05-13, was 2,427). Maintainer (Malte Ubl) silent since 05-07 (6 days). Community PRs piling up (72, 71 open, unmerged). Stars growing from inertia. Vercel launch-and-showcase pattern confirmed. Revisit 05-20
- [x] Track: lukiIabs/skills - 241⭐ (05-08 PM), no commits since 05-01. Growth stalled. **Dropped** 05-08 — stale, no commits 7+ days, stars flat
- [x] Evaluate: wiki-lint secret scanning - add credential pattern detection (inspired by Harmonist memory secret scanner, ~30 patterns) → 04-28 done, added 25 patterns to wiki-lint.py section 9, zero false positives on 493 files, committed+pushed
- [x] Evaluate: agent observability - data layer concept for OpenClaw cron/session monitoring(inspired by agentic-stack v0.11 data-layer skill)→ 04-27 verdict: NOT NOW. Trajectory JSONL has all data, 50-line PoC works. See [[cron-observability-metrics]]
- [x] Track: agentic-stack (codejunkie99) - 1,928⭐ (05-11, was 1,900). v0.16→v0.18 in 2 days: Copilot/Gemini adapters, Mission Control dashboard, lesson retraction, Brain memory bridge. Our docs PR #49 merged! 🟢 THRIVING (5/6). Revisit 05-17
- [x] Track: invincat (dog-qiuqiu) - 306⭐ (05-11, was 304). Scheduler subsystem shipped (PR#21): SQLite cron + one-shot + WeCom delivery + TUI manager. Stars flat but feature velocity high. Revisit 05-17
- [x] Track: friday-studio (friday-platform) - 19⭐ (05-05). **Dropped** 05-05 — low traction, architectural comparison done
- [x] Evaluate: understand-you (SeanLiew523) - 4⭐ (05-05), OpenClaw skill for owner onboarding/alignment convergence. Check ClawHub integration potential → 05-07 verdict: NOT NOW. Mature workspace, 4⭐ single-day project, no traction. Gap-audit pattern worth noting. See wiki/projects/understand-you.md
- [ ] Track: addyosmani/agent-skills - 40.4K⭐ (05-13, was 39.2K, +3%). DDD skill merged, orchestration patterns PR#86 merged. Revisit 05-20
- [x] Track: Autoloops/upskill - 17⭐ (05-04). **Dropped** 05-05 — low traction, claims unverified
- [ ] Track: kiwifs/kiwifs - 423⭐ (05-13, was 419). v0.14.1! Graph analytics (PageRank, Louvain, betweenness), web clipper, canvas, bases/views, timeline, kanban — 9.8K line PR. 🟢 THRIVING (5/6). Star growth decelerating (+1%) despite massive feature output. Revisit 05-19
- [x] Track: Teaonly/SKILL.mk - 80⭐ (05-04), Makefile-format skill spec with DAG + on-demand loading. PoC stage. Revisit 05-11 **Dropped** 05-06 — PoC stage, 93⭐, not actionable
- [x] Evaluate: FlowForge workflows as packageable SKILL.md - NOT NOW. FlowForge needs runtime (not portable like evanflow multi-skill pattern). ClawHub empty, our workflows too personal. See study session 05-04
- [x] Track: future-agi (future-agi/future-agi) - 820⭐ (05-04), recovered from stall — burst of 5+ PRs merged 05-04 (bugfixes/eval rendering). Revisit 05-10 **Dropped** 05-06 — bugfixes only, no new architectural insights
- [x] Track: Signet AI (Signet-AI/signetai) - 138⭐ (05-09), flat growth (+1⭐). **Dropped** 05-09 — low traction, flat
- [x] Track: felix (sausheong/felix) - 16⭐ (05-03). **Dropped** 05-05 — low traction
- [x] Track: paragents (FrankHui/paragents) - 81⭐ (05-05). **Dropped** 05-05 — growth without dev
- [x] Track: dirac (dirac-run/dirac) - 1,113⭐ (05-05), v0.3.22 UI fixes + image paste. Daily commits but incremental. Revisit 05-11 **Dropped** 05-06 — incremental UI, not architecturally relevant
- [x] Track: codejunkie99/brain - 37⭐ (05-03), Rust rewrite of agentic-stack memory. v0.1.0. Revisit 05-10 **Dropped** 05-06 — 51⭐, stalled since 04-28
- [x] Track: mapick-ai/mapick - 22⭐ (05-03), OpenClaw privacy layer + skill advisor. v0.0.24. Revisit 05-10 **Dropped** 05-06 — 22⭐, tiny, no growth signal
- [x] Track: alash3al/stash - 666⭐ (05-08). **Dropped** 05-08 — no commits since 05-01, stars flat, stalled
- [x] Track: imbue-ai/blueprint - 39⭐ (05-03), planning copilot for coding agents. Revisit 05-10 **Dropped** 05-06 — 46⭐, slow growth, niche
- [x] Track: stripe/link-cli - 466→495⭐ (05-12). v0.5.0: ANSI escape injection Proxy-based sanitization, approval polling terminal status fix. See wiki. Revisit 05-18
- [x] Track: machinepulse-ai/world2agent - 1,311⭐ (05-06). **Dropped** 05-06 — development stalled since 04-30, HN hype fading

- [x] Track: SKILL.make (Teaonly/SKILL.make) - 54⭐ (05-03), **Deep read done**: Makefile-format skill spec, no runtime impl, 15% token savings. FlowForge YAML already solves DAG execution better. See wiki/projects/skill-make.md. **Dropped** - format without runtime is academic
- [x] Evaluate: FlowForge plan-first phase - Blueprint's Q&A→plan→code pattern applied to workloop. Added `plan` node between study→implement. Commit fef0639 (05-03)
- [x] Track: cadis (Growth-Circle/cadis) - 39⭐ (05-05). **Dropped** 05-05 — solo dev, no community
- [x] Track: deepclaude (aattaran/deepclaude) - 1,347⭐ (05-06). **Dropped** 05-09 — merged with above, project stalling
- [x] Track: deepsec (vercel-labs/deepsec) - 1,777⭐ (05-08 PM). **Duplicate** — consolidated to 2,171⭐ entry above
- [x] Track: centaur-loop (finewood2008/centaur-loop) - 16⭐ (05-10). **Dropped** 05-10 — low traction, too small
- [x] Deep read: Sentra RAG failure mode taxonomy — independent study for evaluating retrieval systems. From krusch-context-mcp scout. → 2026-05-11 done, wiki/projects/sentra-rag-failure-modes.md. 8 failure modes (F1-F8) with mitigation playbook. Key takeaway: RAG = similarity oracle, not memory; multi-primitive system needed. Our hybrid search.sh already addresses F1/F2.
- [x] Track: mnem (Uranid/mnem) - 17⭐ (05-04). **Dropped** 05-05 — single author, low traction

- [ ] Observe: agent eval/testing space - still underdeveloped. Top: Margin-Lab/evals 59⭐ (stalled 04-24), Calibre-Labs/reforge-ai-evals 42⭐ (active). No breakout. Revisit 05-15
- [ ] Track: reversa (sandeco/reversa) - 761⭐ (05-13, was 707, +7.6%). extract-soul agent (project soul synthesis), security patch. 🟡 GROWING (4/6). Revisit 05-20
- [x] Track: pu.sh (NahimNasser/pu) - 168⭐ (05-05). **Dropped** 05-05 — flash growth, no commits since 05-01
- [x] **Fix: gogetajob entry point** - `package.json` main 指向 `index.js` 但 build 产出在 `dist/cli/index.js`。修 package.json 的 bin/main 或补 `dist/index.js` 入口
- [x] Deep read: esengine/reasonix - Cache-First Loop 三层分区 (94% cache hit), R1 Thought Harvesting (默认关闭), Tool-Call Repair, Cost Control → wiki/projects/reasonix.md (04-27)
- [x] Write memex card: model-native-vs-model-agnostic → wiki/cards/model-native-vs-model-agnostic.md (04-27)
- [x] Deep read: EvoMap/evolver GEP protocol - arXiv 2604.15097, Gene vs Skill +4.1pp, GEP protocol analysis. wiki/projects/evomap-evolver-gep.md (04-28)
- [x] 应用: L1索引层评估 - 部分采纳,创建 wiki/L1.md proposal. wiki/projects/l1-index-layer-evaluation.md (04-28)
- [x] Track: GenericAgent growth (lsdefine/GenericAgent) - 9,199⭐ (05-06), ACP bridge follow-up PR#274 fixing streaming. Incremental. Revisit 05-12 **Dropped** 05-06 — massive project, incremental, cant influence
- [x] Track: nanobot growth - 41,476⭐ (05-02), maintenance-only (LongCat provider, fallback fixes). Revisit 05-09 **Dropped** 05-06 — maintenance-only, not relevant to our direction
- [x] Quick scan: GitHub trending + HN (04-28) - dirac selected for deep read
- [x] Deep read: dirac - hash-anchored edits, AST-native tools, context curation → wiki/projects/dirac.md (04-28)
- [x] Track: obscura headless browser - 9,312⭐ (05-02). **Dropped** 05-05 — 8 days no push, suspicious star growth
- [x] Track: nexu-io/open-design - 32,937⭐ (05-08), **v0.5.0 deep read done**: Critique Theater Phase 5 (anti-collusion panel prompt, XML wire protocol), transcript export (JSONL), Linux headless, live dashboards. 36 contributors. See wiki/projects/open-design.md. Revisit 05-12 for Phases 6-15 + #450 synthesis
- [x] Track: CubeSandbox agent sandbox - 5,033⭐ (05-06, +156), Tencent, Rust. Doc improvements, cleanup PRs. Incremental. Revisit 05-12 **Dropped** 05-06 — corporate project, incremental docs
- [x] Track: OpenChronicle growth - 1,986⭐ (05-02). **Dropped** 05-05 — 9 days no push, macOS-only
- [x] Track: cc-telegram-bridge - 156⭐ (05-02). **Dropped** 05-05 — flat growth
- [x] Track: Stash growth - 644⭐ (05-05), last push 05-01, cooling. Revisit 05-09 **Dropped** 05-06 — duplicate of line 136 entry, cooling
- [x] Track: endless-toil - 187⭐ (05-05), no commits since 04-24 (11 days). **Dropped** — stalled

- [ ] Track: thClaws - 879⭐ (05-13), v0.9.4. 3 releases in 24h. LINE bridge (messaging as remote control, wire protocol documented), ChatGPT Codex provider, SSO/OIDC+PKCE. 🟢 Extreme velocity. Revisit 05-20
- [x] Track: garden-skills - duplicate entry, see line ~122. **Removed**
- [x] Track: Aegis (GanyuanRan) - 180⭐ (05-13). **Dropped** 05-13 — persistent 🔴 SOLO (0/6), zero external PRs/issues despite star growth
- [x] Track: microsoft/apm - 2,333⭐ (05-12). v0.13.0: `apm update` command, `--frozen` flag, agent-written docs pipeline (Opus 4.7 multi-wave + CONTEXT-PACK), GitLab marketplace. See wiki. Revisit 05-18
- [x] Track: OmniAgent - 576→733⭐ but no commits since 04-19. Star farming signal. **Dropped** 05-04
- [x] Deep read: brain - git event log, bitemporal, 6-layer, authority model, secret prefilter. wiki/projects/brain-git-memory.md (04-29)
- [x] 应用: beliefs-candidates 加 `source:` authority field(human 2×/self 3× 差异化毕业门槛)- from brain authority model (04-29)
- [x] 应用: pre-commit secret scanning hooks installed on workspace + wiki repos - from brain prevention>detection pattern (04-29)
- [x] Track: hermes-labyrinth - 249⭐ (05-04), polish phase, slowing. Revisit 05-09 **Dropped** 05-06 — slowing, deep read already done
- [x] Experiment: try docs-first contribution strategy on 1 new repo (inspired by iris-clawd study 04-30) → 05-09 done, agentic-stack PR#49 (getting-started.md update). <15 min idea-to-PR. Strategy validated.
- [x] Track: agentic-stack PR#49 merged 05-09! Docs-first entry validated. Next: consider code PR (brain bridge or adapter area). Revisit 05-17

- [x] Track: mizchi/skills - 155⭐ (05-09). 🔴 SOLO (0/6), stale 9 days. **Dropped** 05-09
- [x] Track: 99xAgency/GodModeSkill - 199⭐ (05-05), no commits since 04-28 (7 days). **Dropped** — stalled
- [ ] Track: Beever Atlas (Beever-AI/beever-atlas) - 309⭐ (05-13, was 270, +14.4%). 🟢 THRIVING (6/6) but all recent commits are dependabot. No feature work since 05-08. Revisit 05-20
- [x] Track: ast-outline (aeroxy/ast-outline) - 166⭐ (05-12, +19%), minor updates only. Steady growth. Revisit 05-18


## hermes-agent#17416 CI Failures (2026-04-30)
- **Tests failing**: Circuit breaker changes break MCP structured content tests (`test_mcp_structured_content.py`) - circuit breaker fires during test mocks
- **Attribution check**: Need to add `kagura.agent.ai@gmail.com` → `kagura-agent` mapping to `scripts/release.py` AUTHOR_MAP
- **Also**: `test_session_resume_returns_hydrated_messages` and `test_session.py` import error (may be upstream)
- **Action**: Fix in next workloop session
- [x] Track: spawn-agent (millionco/spawn-agent) - 142⭐ (05-05). **Dropped** 05-05 — 9 days no commits
- [x] Track: cursor/cookbook - 3,679⭐ (05-08 PM). **Dropped** 05-09 — no commits since 05-01, growth is viral/organic without new content
- [ ] Security: APIMitmHack (ez-lbz/APIMitmHack) - 43⭐ (04-30), malicious proxy targeting openclaw/claudecode/opencode via response injection. Monitor
- [x] Track: oh-my-kimichan - 12⭐ (05-01). **Dropped** 05-05 — low traction
- [ ] Track: chromex (GENEXIS-AI/chromex) - 1,057⭐ (05-11, was 935, +13%). Windows support, external feature PRs, multilingual. 🟢 THRIVING. Revisit 05-18
- [x] Track: codex-plusplus - 937⭐ (05-06, +385!), v0.1.3 stable. Explosive growth. Revisit 05-10 (consider drop — brand-riding, not architecturally interesting) **Dropped** 05-06 — brand-riding, not architecturally interesting
- [x] Deep read: tiangolo/library-skills - 166⭐ (05-01), library-embedded agent skills via symlink. FastAPI already ships skills. wiki/projects/library-skills.md
- [x] Track: tiangolo/library-skills - 442⭐ (05-06), v0.0.5 stable, no commits since 05-01. **Dropped** 05-06 — stale, no development activity

- [x] Track: SeeleAI/Thoth - 39⭐ (05-02), dashboard-first orchestration runtime. Planning-execution separation + plateau detection. Revisit 05-09 **Dropped** 05-06 — 40⭐, slow, not aligned

- [ ] Track: memU (NevaMind-AI/memU) - 13,611⭐ (05-13). Stalled since Apr 22 (no commits in 3 weeks). Revisit 05-27
- [x] Scout: SKILL.mk (Teaonly/SKILL.mk) - 78⭐ (05-04), Makefile-style agent skills spec. Interesting concept but limited practical value. Noted in memu.md

## 💼 Luna 副业

### 现状 (05-06 建立)
- 公众号: 3 篇已发, 最后一篇 04-07 (近 1 个月没更)
- Podcast: EP001-EP004 on Podbean, EP005 状态未知
- 知识星球「Kagura」: ¥50/年, 内容频率未知
- briefing-001 已出, Luna 无反馈
- GTM 认知 (04-13): 服务 > 工具, 非程序员客群, 先赚第一块钱

### 待办
- [ ] 公众号: 恢复更新节奏 — 下一篇选题策划 (见下方建议), @ Luna 确认
- [ ] 知识星球: 确认 Luna 的更新频率和内容方向
- [ ] briefing-001: @ Luna 要反馈, 否则出 briefing-002 没方向
- [ ] Podcast: EP005+ 计划 — 确认是否继续
- [x] Track: photo-agents (jmerelnyc) - 363⭐ (05-09). **Duplicate** — consolidated to 364⭐ entry above
- [x] Track: agent-skills-eval (darkrishabh) - 250⭐ (05-09). **Duplicate** — consolidated to 265⭐ entry above
- [x] Track: master-skill (voidborne-d) - 48⭐ (05-09). **Dropped** 05-11 — solo, low stars, industry distillation niche not aligned
- [x] Track: aide (hibbault) - 11⭐ (05-06), recursive self-improving agent in own source code. 3-tier memory budget. Revisit 05-13 **Dropped** 05-06 — low traction (<50⭐), too new to justify slot
- [ ] **预 clone 大 repo**: eliza (648MB) 需要在非高峰时段或通过 VPN 提前 clone，否则 workloop 完全浪费。考虑在 heartbeat 里检查 gogetajob DB 中 repo size 并自动预 clone（到期 2026-05-13）
- [ ] **gogetajob: 竞争 PR 预筛**: 当前选题效率低（15 issues 查 15 次 gh pr list）。考虑让 gogetajob feed 同时输出竞争 PR 数量（到期 2026-05-13）
- [x] Track: paragents (FrankHui/paragents) - 112⭐ (05-07). **Dropped** 05-11 — single push 04-30, no revival after 11 days
- [x] Track: oh-my-kimi (dmae97) - 56⭐ (05-07). **Dropped** 05-11 — low traction, non-critical ecosystem data point
- [x] Track: speca (NyxFoundation/speca) - 332⭐ (05-07). **Duplicate** — consolidated to 355⭐ entry above
- [x] Track: agent-harness-kit (enmanuelmag) - 147⭐ (05-13). **Dropped** 05-13 — 🔴 SOLO (0/6 health), 0 external PRs, AI-generated commit messages
- [x] Track: cangjie-skill (kangarooking) - 852⭐ (05-13). **Dropped** 05-13 — stalled 9 days (last push 05-04), content accumulation without innovation
- [ ] Evaluate: V2 Predictive Power test for beliefs-candidates upgrade gate (inspired by cangjie-skill triple verification) — "can this belief predict behavior in unseen scenarios?"
- [x] Track: Workspace-Bench (OpenDataBox) - 8⭐ (05-10). **Dropped** 05-10 — low traction, dataset still unreleased
- [ ] Track: OpenViking (volcengine/OpenViking) - 23,725⭐ (05-10). ByteDance context database, L0/L1/L2 tiered model. AGPL-3.0, Python+Rust. Validates our wiki architecture. Revisit 05-24
- [ ] Track: MemOS (MemTensor/MemOS) - 9,007⭐ (05-10). TypeScript memory OS with OpenClaw plugin, L1-L3+Skills evolution. Apache-2.0. Revisit 05-24
- [ ] Track: gread (NitroRCr/gread) - 36⭐ (05-11). Hosted code reader API+MCP for agents. No-checkout partial clone, git grep, tree+read. Apache-2.0, Bun. Revisit 05-18
- [ ] Apply: Script wiki/L1.md auto-regeneration from wiki content (inspired by OpenViking SemanticProcessor)
- [ ] Track: ClawMem (yoloshii/ClawMem) - 158⭐ (05-11). On-device memory layer for AI agents, BM25+Vector+Graph hybrid, 3-layer merge safety, integrates with OpenClaw. Deep read done. Revisit 05-18
- [ ] Track: Interaction Models (ThinkingMachines) - Research preview only, no repo/weights. Two-model real-time collab architecture. 208pts HN. Revisit 06-01
- [ ] Track: PaperGuru-Benchmark (PaperGuru-AI) - 109⭐ (05-12). LAM axioms + CCM architecture, benchmark only, no code. Revisit 06-01 (check if code released)
- [ ] Apply: Evaluate content-type half-lives for memex search (ClawMem pattern: decisions=∞, notes=60d, handoffs=30d)
- [ ] Apply: Evaluate co-activation tracking for wiki search (docs frequently surfaced together get boosted)
- [x] Track: Needle (cactus-compute/needle) - 372⭐ (05-13). 26M FFN-free function call model (SAN architecture). Distilled from Gemini. Deep read done. Revisit 05-27
- [ ] Track: Needle (cactus-compute/needle) - 988⭐ (05-13 evening, was 872, +13.3% HN front page effect). Deep read done (architecture.py, constrained.py, SAN doc). HN 475pts. Revisit 05-20
- [ ] Track: Tactile (yliust/Tactile) - 191⭐ (05-13). Accessibility-first agent operating layer. AX > OCR > visual. macOS + Windows. Deep read done. Revisit 05-20
- [ ] Track: susurration (sghy1717/susurration) - 65⭐ (05-13). Agent-to-agent signal network. 5 primitive verbs, SSE/webhook/cloud. Trading domain. TypeScript, MIT. Revisit 05-27
- [ ] Track: Adrian (secureagentics/Adrian) - 35⭐ (05-13). Runtime security monitoring for AI agents. Apache-2.0, Python. Revisit 05-27
- [ ] Track: OpenClaw-AWD-Arena (LYiHub) - 177⭐ (05-13). LLM agent CTF platform, Docker-based, OpenClaw+Hermes backends. Deep read done. Revisit 05-27
- [x] Track: Needle (cactus-compute/needle) - 850⭐ (05-13 PM, was 372 AM, +129%). HN front page 468pts. Revisit moved 05-27→05-20
- [ ] Track: OCTO (Mininglamp-OSS/octo-web + octo-adapters) - 30⭐/14⭐ (05-13). Enterprise workplace from 明略科技 building on OpenClaw. "Lobster" digital doubles. Apache-2.0. Chinese enterprise adoption signal. Revisit 05-27
- [ ] Track: Yansu (Isoform/yansu-skill) - 47⭐ (05-13). Desktop app observes work patterns → crystallizes into portable agent skill. Commercial (yansu.app). MIT skill. "Observe → crystallize → deliver" pipeline. Revisit 05-27
- [ ] Track: text-to-cad (earthtojake) - 2,527⭐ (05-13). Vertical domain skills for CAD/robotics. 6 skills, 10 benchmarks, SendCutSend manufacturing. MIT. Revisit 05-27
