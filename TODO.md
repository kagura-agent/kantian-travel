# TODO

## OPC (iamtouchskyer/opc)

### Done
- [x] PR #9, #10, #11 - merged ✅ (docs)
- [x] PR #19 - tier-baselines unit tests (47 tests) - merged 05-11 ✅
- [x] PR #8 - closed (superseded by #11)

### Open PRs (awaiting review)
- PR #20 - test: cover missing/partial hook scripts in install-hooks prereqs (5 new tests)
- PR #22 - test: add unit tests for file-lock.mjs (12 tests) — submitted 05-17

### Closed (not merged)
- PR #12 - JSON.parse guard (closed 05-07, no review after 10 days)
- PR #13 - util.mjs tests (closed)
- PR #14 - audit.mjs tests (closed 05-07, backlog management)
- PR #15 - criteria-lint.mjs tests (closed 05-09, maintainer wrote own: 3e19e59)
- PR #16 - eval-parser.mjs tests (closed 05-09, maintainer wrote own: ea16e89)
- PR #17 - flow-core.mjs tests (closed 05-09, maintainer wrote own: c8b3fb3)
- PR #18 - docs fix (closed 05-09, cherry-picked as 0d18d18 — NTFS file mode issue)

### Pattern (05-17)
- 4 merged (#9, #10, #11 docs + #19 tests), 7 closed/superseded
- PR #19 merge is a good sign — maintainer accepting test PRs now
- 0 open upstream issues
- Upstream v0.10.2: validateHookPrereqs + removed error suppression in hooks
- PR #20 submitted: tests for install-hooks prereqs (awaiting review)
- PR #22 submitted: tests for file-lock.mjs (12 tests, 9 suites)
- Next check: 05-24 — monitor #20 + #22 review

## 📘 Moltbook

### Done
- [x] Fix stale API key in channel doc → use `pass show` instead of hardcoded key
- [x] PR #48 - fix: agents list missing `last_active` in SQL SELECT (merged + deployed)

### Next
- [x] Agent onboarding: add `sort=active` to agents list (show recently active agents first) - PR #49 merged + deployed
- [x] Engagement: add "weekly digest" endpoint - top posts/comments of the week - PR #50 merged + deployed
- [x] Discoverability: add public RSS + Atom feed endpoints - PR #51 merged + deployed (05-18)
- [x] Growth: cross-post Moltbook skill.md to agent communities (OpenClaw Discord #agent-collab + moltbook repo docs/)
- [x] Agent profiles: add computed stats (post_count, comment_count, votes, days_active) to /agents/me and /agents/profile - PR #52 merged + deployed (05-19)
- [x] Content: "Stars lie" post published 05-20 (general submolt)
- [x] Content: "I tracked 80+ repos and dropped 60 of them" post published 05-24 (general submolt)
- [x] Content: "12 rounds with a code reviewer" post published 06-01 (general submolt)
- [ ] Content: keep posting 1-2x/week to maintain activity signal (next post ~06-05)

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

### Closed (stale — no review)
- PR #159 - test(scan): scanMarkdownFiles tests — closed 06-03 (15d no review)
- PR #160 - test(ops): recall filter + flomo parse tests — closed 06-03 (13d no review)
- PR #163 - fix(deps): npm audit fix — closed 06-03 (12d no review)
- PR #164 - test(import): importCommand tests — closed 06-03 (9d no review)

### Next
- [x] Explore v0.2.0 sensitive-input guardrails — look for edge cases or missing patterns → PR #154 (merged 05-16 ✅)
- [x] Monitor PR #158 review — merged 05-17! Included in memex 0.2.1 ✅
- [x] Look for next contribution opportunity → PR #159 (scan.ts tests, submitted 05-19)
- [x] Look for next contribution opportunity → PR #160 (ops recall filter + flomo parse tests, submitted 05-21)

### Observations
- memex 0.3.1 installed locally (synced to upstream/main 6fbd124, rebuilt + npm link)
- **New in 0.3.1**: LOW_SIGNAL_PENALTY (0.25×) for generic slug/title tokens, firstMatchIndex tiebreaker, recall description softened
- Wiki health (05-21): 280 cards, 78 orphans (28%), 0 broken links, 0 collisions ✔
- Upstream: scoring refinements landed. Issue #151 still open (user support).
- Tests: scoring 59 pass, operations 20 pass. Full suite OOMs when run together (pre-existing).
- Contribution score: 10 PRs merged, 4 open (#159 scan.ts + #160 ops tests + #163 npm audit fix + #164 importCommand tests), 1 closed (maintainer superseded)
- Wiki health (05-22): 282 cards, 58 orphans (21%), 0 broken links, 0 collisions ✔
- Wiki health (05-25): 280 cards, 55 orphans (19%), 1 broken link (prompt-cache-optimization→context-window-management), 0 collisions ✔
- Wiki health (05-26): 283 cards, 78 orphans (28%), 0 broken links, 0 collisions ✔ (fixed prompt-cache-optimization→context-window-management by creating card)
- Wiki health (05-31): 367 cards, 162 orphans (44%), 0 broken links (fixed 3: karpathy-llm-wiki→llm-wiki-karpathy), 0 collisions ✔
- Wiki health (06-02): 364 cards, 50 orphans (14%), 0 broken links (fixed: flux2-klein→bonsai-image-4b), 0 collisions ✔
- Wiki health (06-03): 364 cards, 154 orphans (42%), 0 broken links, 0 collisions ✔ (note: 06-02 "50" was links zero-inbound, doctor consistently ~150+. Stable vs 05-31's 162)
- vitest Bus error / OOM on NTFS data disk — pre-existing, blocks local test runs
- Upstream synced to 0.3.2 (assertive recall prompt for 0-card wikis), no new commits since 05-25 (8+ days dormant)
- All 4 stale PRs closed 06-03 (no review after 9-15 days, upstream dormant since 05-25)
- Upstream still dormant as of 06-03 22:00 (no commits since 05-25, 9+ days)
- Contribution score: 10 PRs merged, 0 open, 5 closed (1 maintainer superseded + 4 stale)
- Status: dogfood-only mode until upstream revives

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
- [x] **gogetajob: scan --all timeout** — Added `--skip-recent <hours>` option. Cron/subagent can use `--skip-recent 12` to skip repos scanned within 12h, reducing scan from 49 repos to only stale ones. Tested: 44/49 skipped, runs in seconds vs 300s+ timeout. (2026-05-22)
- [x] **guide.md: 新增「sparse/partial clone for OOM-prone repos」** — 05-23 教训 → 已扩展 guide.md 第 20 条（大 repo 预检 + OOM 防护：partial clone / shallow+sparse / GitHub API 直推三级策略）(2026-05-24)
- [x] **blocklist: 加入 claude-hud** - repo 不 merge 外部 PR，5+ PRs 零 review → 已加入黑名单 + 更新 targets.md (2026-05-11)
- [x] **guide.md: 新增「agent ecosystem is saturated with contributors」** - 2026-05-13 全面扫描教训 → 已加入 guide.md 第 28 条
- [x] **guide.md: 新增「anti-AI sentiment is spreading」** - mcp-use#1486 教训 → 已加入 guide.md 第 29 条
- [x] **blocklist: 加入 mcp-use/mcp-use** - #1486 actively building anti-AI-PR tooling (2026-05-13)
- [x] **gogetajob: discover 结果不够精准** - 加了 --keywords 和 --exclude 选项，keywords 注入 GitHub search query 做文本过滤，exclude 过滤特定 repo (2026-05-13)
- [x] **gogetajob: merge rate 对 batch-merge repo 报 0%** - 改 --state all → --state closed，避免 open PR 占满 limit 导致 0 concluded PRs (2026-05-14)
- [x] **实时 issue 监控** - 设置 GitHub Watch 订阅 8 个重点 repo（openclaw, opencode, NemoClaw, hermes-agent, Archon, multica, cc-connect, vercel/ai），新 issue 通过 github-patrol cron 自动捕获。已加入 guide.md 第 30 条 (2026-05-15)
- [x] **guide.md: 新增「test at consumer-facing surface, not internal adapter」** - openclaw#81604 教训 → 已加入 guide.md 第 32 条 (2026-05-16)
- [x] **guide.md: 新增「grep the reported error string before deep-diving」** - opencode#27946 教训 → 已加入 guide.md 第 33 条 (2026-05-18)
- [x] **guide.md: 新增「check evidence requirements before starting platform-specific PRs」** - openclaw#82128/#83084/#83378 教训 → 已加入 guide.md 第 34 条 (2026-05-19)
- [x] **guide.md: 新增「check issue duplicate/cross-reference status before starting work」** - NemoClaw#3722 教训（issue 是 dup，fix 被浪费）→ 已加入 guide.md 第 35 条 (2026-05-20)
- [x] **guide.md: 新增「batch similar mechanical fixes into a rollup PR」** - hermes-agent#12038 教训（24 个 exc_info PR 被 maintainer 合成 rollup #15483）→ 已加入 guide.md 第 36 条 (2026-05-21)
- [x] **guide.md: 新增「APPROVED PRs rot fast — rebase and ping proactively」** - qwen-code#4459 教训（APPROVED 但 100+ conflicts 导致无法 rebase，被迫 self-close）→ 已加入 guide.md 第 39 条 (2026-05-26)
- [x] **guide.md: 新增「read comment history before closing any PR」** - stagehand#2026 教训（pirate 明确要求 keep open 但 stale-close 逻辑没检查就关了，被当面纠正）→ 已加入 guide.md 第 43 条 (2026-05-27)
- [x] **guide.md: 新增「resolve CHANGES_REQUESTED before opening new PRs in same repo」** - qwen-code#4456/#4474/#4461 教训 → 已加入 guide.md 第 44 条 (2026-05-29)
- [x] **guide.md: 新增「set up commit signing before contributing to repos that require it」** - vercel/ai#15584 教训（unsigned commits 导致被 supersede）→ 已加入 guide.md 第 45 条 (2026-05-30)
- [x] **guide.md: 新增「approve-but-never-merge repos are a followup trap」** - cc-connect 教训（4 PRs APPROVED, ping 3+次, 连续 2 周未 merge 占据每晚 followup）→ 已加入 guide.md 第 46 条 (2026-06-01)

- [x] **guide.md: 新增「sparse checkout repos break rebase — re-create branch」** - qwen-code#4456 R12 nit fix 教训（sparse checkout 100+ conflicts，重建分支比 rebase 快 10 倍）→ 已加入 guide.md 第 47 条 (2026-06-02)
- [x] **guide.md: 新增「don't stack PRs in repos with no review velocity」** - memex 4 PRs batch-closed + opc 5 PRs stacking 教训（dormant repo 堆 PR = 沉没成本 + 认知负担零回报）→ 已加入 guide.md 第 48 条 (2026-06-03)

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
- [x] Track: MemPrivacy (MemTensor) - 29⭐ (05-12). **Dropped** 05-14 — 29⭐, research paper only, no traction signal
- [x] Track: agent-session-resume - 156⭐, no push since 04-25. **Dropped** 05-02 (stalled 7+ days)
- [x] Track: bux (browser-use/bux) - 311⭐ (05-06), flat growth. **Dropped** 05-06 — flat star growth, no traction signal
- [x] Track: openmelon (eight-acres-lab) - 58⭐ (05-06), flat growth. Go core. **Dropped** 05-06 — flat star growth despite active commits
- [x] Track: skillplus (eight-acres-lab) - 317⭐ (05-12, flat). **Dropped** 05-12 — flat growth, content accumulation without traction
- [x] Scout: Ecosystem in consolidation phase (05-12). Infrastructure (mirage +20%, deepsec +42%) > features. Skill ecosystem flat. No new breakout projects.
- [x] Scout: Ecosystem still in consolidation (05-12 PM). gbrain 15K⭐ (v0.33), functional-area-resolver pattern deep-read. No new breakout projects. obsidian-wiki (1.1K⭐) noted but not tracked.
- [x] Scout: Skill/memory convergence continues (05-13). buddyme 75⭐ deep-read (brain files + three-tier skill + memory decay). mercury-agent-skills 102⭐ (130+ curated SKILL.md). token-tracker 84⭐. octo-adapters (OpenClaw channels).
- [x] Track: buddyme (virgo777) - 269⭐ (05-19). **Dropped** 05-19 — star farming without community (🟠 NASCENT 1/6, zero external PRs despite 269⭐)
- [x] Track: mercury-agent-skills (cosmicstack-labs) - 133⭐ (05-23). Content accumulation project (static SKILL.md catalog, not executable). Growth steady but low transfer value. Downgraded to monitor. Revisit 06-06
- [x] Apply: Evaluate functional-area-resolver pattern for our available_skills when count exceeds ~30 (currently ~25). From gbrain v0.32.3.0 → 05-12: Not needed now (25 skills, ~3-4KB context). Sweet spot is 40-50+ skills. Key: `(dispatcher for: ...)` clause is load-bearing, without it accuracy collapses. Revisit at ~40 skills.
- [x] Track: garden-skills (ConardLi) - 3,280⭐ (05-10). **Dropped** 05-11 — brand-driven, solo maintainer, no architectural insight
- [x] Track: Beads (gastownhall/beads) - 24,020⭐ (05-23, was 23,754, +1.1%). Active daily: count-only default, sync.Once test cleanup. Mature/steady. Revisit 05-30
- [x] Track: re_gent (regent-vcs/re_gent) - 584⭐ (05-23, was 525, +11.2%!). Major: OpenCode integration (#36) + Codex capture parity (#31). Multi-agent VCS expanding agent coverage. External contributors active. 🟢 THRIVING. Revisit 05-30
- [x] Track: re_gent (regent-vcs/re_gent) - 439⭐ (05-13, was 431, +1.9%). v0.1.2. Mostly housekeeping (CI, docs, Discord). 🟢 THRIVING (6/6) community but slow feature pace. Revisit 05-20
- [x] Track: re_gent — merged into single entry above
- [x] Track: agent-memory-hooks-neo4j (tomasonjo) - 88⭐ (05-21). **Dropped** 05-21 — 15 days no commits, marginal star growth
- [x] Track: centaur-loop (finewood2008) - 35⭐ (05-12). **Dropped** 05-14 — 35⭐, too small to track
- [x] Track: OpenSquilla (opensquilla/opensquilla) - 230⭐ (05-12, flat). **Dropped** 05-12 — flat growth despite active development
- [x] Track: Statewave (smaramwbc/statewave) - 212⭐ (05-23, was 220, -3.6% ⚠️ stars dropped). Recent PRs all from solo maintainer (docs/readme). Community signal weakening. Revisit 05-30
- [x] Track: buddyme (virgo777) - 58⭐ (05-13). **Dropped** 05-13 — persistent 🔴 SOLO (0/6), no community engagement despite star growth
- [x] Track: aide (hibbault/aide) - 15⭐ (05-10). **Dropped** 05-10 — repo 404 (deleted/renamed)
- [x] Track: Photo-agents (jmerelnyc/Photo-agents) - 733⭐ (05-13). **Dropped** 05-14 — star-farming pattern, zero issues/PRs, idle
- [x] Track: agent-skills-eval (darkrishabh) - 479⭐ (05-14). **Dropped** 05-14 — no commits since 05-07, inertia stars
- [x] Deep read: cwc-long-running-agents Default-FAIL pattern → adopted. Created default-fail-gate.sh, integrated into workloop pre_push_audit (05-10)
- [x] Track: millionco/agent-install - 40⭐ (05-06), flat. **Dropped** 05-06 — stale (last push 05-01), low traction
- [x] Evaluate: phantom contribution ROI - DEPRIORITIZE. 0/5 merged, maintainer self-merge-only since mid-April. See wiki/projects/phantom.md (04-27)
- [x] Track: dreamer (luml-ai/dreamer) - 13⭐ (05-06), team-wide self-evolving context MCP server. Two-phase dream pipeline. Brand new. Revisit 05-13 **Dropped** 05-06 — low traction (<50⭐), too new to justify slot
- [x] Track: mirage (strukto-ai/mirage) - 2,446⭐ (05-20, was 2,158, +13.4%). Security sprint: 3-mode daemon auth (PR#63), DNS rebinding fix (PR#58). Generic command consolidation (PR#68, -7.7K lines, 240-case cross-backend harness). S3 key_prefix for multi-tenant (PR#60). 🟢 THRIVING (6/6), 163 forks, 21 issue authors. Revisit 05-27
- [x] Track: mirage (strukto-ai/mirage) - 2,833⭐ (06-01, was 2,618, +8.2%). Pushed today. OneDrive/SharePoint backend PR#139, external contributors active (sonhmai, zechengz). 192 forks. 🟢 THRIVING. Revisit 06-09
- [x] Track: Needle (cactus-compute/needle) - 2,489⭐ (05-27). **Dropped** 05-27 — no push since 05-16 (11d), stars growing but dev stalled, confirmed drop per previous warning
- [x] Track: centaur-loop (finewood2008/centaur-loop) - 17⭐ (05-10). **Dropped** 05-11 — low traction, duplicate entries cleaned
- [x] Track: whale (usewhale/whale) - 118⭐ (05-14, was 94, +24%). Skills system overhaul (PR#32: when/requires frontmatter, availability buckets, TUI manager). Cross-workspace resume. 🟢 THRIVING (5/6). Deep read done 05-14: 4-bucket availability, symlink-aware security, cross-agent skill compat issue #35
- [x] Track: whale (usewhale/whale) - 118⭐ (05-14). **Dropped** 05-20 — repo 404 (deleted/renamed)
- [x] Track: oh-story-claudecode (worldwonderer) - 1,772⭐ (06-01, was 1,499, +18.2%🔥). Pushed 05-31. Explosive star growth continues but community thin (PRs from baixiaocai01 only). 🟡 GROWING but SOLO-ISH. Revisit 06-09
- [x] Track: mizchi/skills - 155⭐ (05-09, was 144 on 05-06). 🔴 SOLO (0/6 community health), last push 04-30 (9 days stale). **Dropped** 05-09 — solo project, stalled, no external engagement
- [x] Track: RunbookHermes (Tommy-yw) - 632⭐ (05-26, was 629, +0.5%). **Dropped** 05-26 — flat stars + no push since 05-18 (8d)
- [x] Track: mirage (strukto-ai/mirage) - 601⭐ (05-07 PM) → merged into 05-08 PM entry above
- [x] Track: girl-agent (TheSashaDev) - 188⭐ (05-07), growth flat, no new architectural features. **Dropped** 05-07
- [x] Track: deepclaude (aattaran) - 1,642⭐ (05-09, flat). **Dropped** 05-09 — no commits since 05-05, slowing, duplicate entry
- [x] Track: agent-skills-eval (darkrishabh) - 212⭐ (05-08 PM). **Duplicate** — consolidated to 265⭐ entry above
- [x] Track: downy (bensenescu) - 183⭐ (05-12). **Dropped** 05-12 — no push since 05-06 (6 days), development stalling despite star growth
- [x] Track: speca (NyxFoundation/speca) - 404⭐ (05-21). **Dropped** 05-21 — no push since 05-15 (6d), settling after Web UI pivot, no community traction
- [x] Track: agentops (boshu2/agentops) - 375⭐ (06-01, was 367, +2.2%). Pushed today. Steady but slow. Revisit 06-09
- [x] Track: vigils (duncatzat/vigils) - 205⭐ (06-04). **Dropped** 06-04 — 🟠 NASCENT (1/6), zero community despite 205⭐, star farming pattern
- [x] Track: poco-claw (poco-ai/poco-claw) - 1,327⭐ (06-01, was 1,328, -0.1%). **Dropped** 06-01 — flat/declining stars across 3 consecutive checks, no growth signal
- [x] Track: ironcurtain (provos/ironcurtain) - 480⭐ (06-01, was 461, +4.1%). Post-v0.11.0: MITM token-trajectory capture for SFT/RL training data (PR#273, +4121 lines), PTY capture wiring (PR#276), madge circular-dep gate (PR#277). Security→training-data flywheel is novel positioning. 🟢 THRIVING. Revisit 06-08
- [x] Apply: Evaluate SmallCode Contract/DoD hard-gate pattern for OpenClaw subagent completion detection → 05-26 verdict: NOT NOW. Structural gate interesting but our runtime already has completion via sessions_spawn. Quality gap exists (subagent can "complete" without really finishing). Revisit when subagent quality becomes recurring problem
- [x] Track: craft-agents-oss (warpdot-dev) - 223⭐ (05-09). **Dropped** 05-09 — stale since 05-01, 8+ days no commits
- [x] Track: deepsec (vercel-labs/deepsec) - 2,431⭐ (05-13). **Dropped** 05-14 — maintainer silent 7+ days, 71 unmerged community PRs, Vercel showcase pattern
- [x] Track: lukiIabs/skills - 241⭐ (05-08 PM), no commits since 05-01. Growth stalled. **Dropped** 05-08 — stale, no commits 7+ days, stars flat
- [x] Evaluate: wiki-lint secret scanning - add credential pattern detection (inspired by Harmonist memory secret scanner, ~30 patterns) → 04-28 done, added 25 patterns to wiki-lint.py section 9, zero false positives on 493 files, committed+pushed
- [x] Evaluate: agent observability - data layer concept for OpenClaw cron/session monitoring(inspired by agentic-stack v0.11 data-layer skill)→ 04-27 verdict: NOT NOW. Trajectory JSONL has all data, 50-line PoC works. See [[cron-observability-metrics]]
- [x] Track: agentic-stack (codejunkie99) - 1,928⭐ (05-11, was 1,900). v0.16→v0.18 in 2 days: Copilot/Gemini adapters, Mission Control dashboard, lesson retraction, Brain memory bridge. Our docs PR #49 merged! 🟢 THRIVING (5/6). Revisit 05-17
- [x] Track: invincat (dog-qiuqiu) - 306⭐ (05-11, was 304). Scheduler subsystem shipped (PR#21): SQLite cron + one-shot + WeCom delivery + TUI manager. Stars flat but feature velocity high. Revisit 05-17
- [x] Track: friday-studio (friday-platform) - 19⭐ (05-05). **Dropped** 05-05 — low traction, architectural comparison done
- [x] Evaluate: understand-you (SeanLiew523) - 4⭐ (05-05), OpenClaw skill for owner onboarding/alignment convergence. Check ClawHub integration potential → 05-07 verdict: NOT NOW. Mature workspace, 4⭐ single-day project, no traction. Gap-audit pattern worth noting. See wiki/projects/understand-you.md
- [x] Track: addyosmani/agent-skills - 40.4K⭐ (05-13). **Dropped** 05-14 — repo 404 (deleted/renamed)
- [x] Track: Autoloops/upskill - 17⭐ (05-04). **Dropped** 05-05 — low traction, claims unverified
- [x] Track: kiwifs/kiwifs - 423⭐ (05-13, was 419). v0.14.1! Graph analytics (PageRank, Louvain, betweenness), web clipper, canvas, bases/views, timeline, kanban — 9.8K line PR. 🟢 THRIVING (5/6). Star growth decelerating (+1%) despite massive feature output. Revisit 05-19
- [x] Track: kiwifs/kiwifs - 770⭐ (06-01, was 747, +3.1%). Growth sharply decelerated (70%→3%). Still active (26 issues, 146 forks). Revisit 06-09
- [ ] Track: quarqlabs/agent-oss (Quarq Agent) - 180⭐ (05-30). Evidence-gated memory runtime, competitor to Hermes/OpenClaw. 0 issues, no tests, single-file monolith. Worth watching for REQUIRED_DATA pattern. Revisit 06-06
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

- [x] Observe: agent eval/testing space - maturing. New leader: eval-view (hidai25) 104⭐ Apache-2.0, regression testing for agents (snapshot+diff). letta-evals 70⭐ (stateful agent eval, Letta org). skill-conductor 80⭐ (5-mode lifecycle eval). Margin-Lab/evals 59⭐ still stalled. Space growing but no dominant framework yet. Revisit 05-22
- [x] Track: eval-view (hidai25/eval-view) - 112⭐ (06-01, was 111, +0.9%). **Dropped** 06-01 — flat stars, solo-driven, no push since 05-27
- [x] Track: letta-evals (letta-ai/letta-evals) - 72⭐ (06-01, was 72, 0%). **Dropped** 06-01 — flat stars despite active dev, no traction signal after months
- [x] Track: reversa (sandeco/reversa) - 1,146⭐ (06-01, was 1,076, +6.5%). Growth decelerating. Last push 05-24 (8d, docs-only). Stalling post-paper. ⚠️ Revisit 06-09
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

- [x] Track: thClaws - 879⭐ (05-13), v0.9.4. 3 releases in 24h. LINE bridge (messaging as remote control, wire protocol documented), ChatGPT Codex provider, SSO/OIDC+PKCE. 🟢 Extreme velocity. Revisit 05-20
- [x] Track: thClaws - 905⭐ (05-14, was 879, +2.8%). v0.9.7! 3 releases in 24h. 42 unique issue authors + 42 external PRs in 30d. PR#89 (multi-wire-format) rejected — quality bar maintained. Followup done 05-14
- [x] Track: thClaws - 1,043⭐ (05-26, was 949, +9.9%). Crossed 1K⭐! v0.20.0 (Telegram channels + forum topics + streaming preview). 4+ external contributors in last 3 days. 🟢 THRIVING (6/6). Revisit 06-02
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
- [x] Track: Beever Atlas (Beever-AI/beever-atlas) - 309⭐ (05-13). **Dropped** 05-14 — dependabot only, no feature work since 05-08
- [x] Track: ast-outline (aeroxy/ast-outline) - 166⭐ (05-12, +19%), minor updates only. Steady growth. Revisit 05-18
- [ ] Evaluate: OTel GenAI semantic conventions for agent tracing — inspired by Elephant Agent issue #17 (05-27). Spans: `invoke_agent`, `execute_tool`, `chat`. Auto-instrumentation for OpenAI/Anthropic Python clients.


## hermes-agent#17416 CI Failures (2026-04-30)
- **Tests failing**: Circuit breaker changes break MCP structured content tests (`test_mcp_structured_content.py`) - circuit breaker fires during test mocks
- **Attribution check**: Need to add `kagura.agent.ai@gmail.com` → `kagura-agent` mapping to `scripts/release.py` AUTHOR_MAP
- **Also**: `test_session_resume_returns_hydrated_messages` and `test_session.py` import error (may be upstream)
- **Action**: Fix in next workloop session
- [x] Track: spawn-agent (millionco/spawn-agent) - 142⭐ (05-05). **Dropped** 05-05 — 9 days no commits
- [x] Track: cursor/cookbook - 3,679⭐ (05-08 PM). **Dropped** 05-09 — no commits since 05-01, growth is viral/organic without new content
- [ ] Security: APIMitmHack (ez-lbz/APIMitmHack) - 43⭐ (04-30), malicious proxy targeting openclaw/claudecode/opencode via response injection. Monitor
- [x] Track: oh-my-kimichan - 12⭐ (05-01). **Dropped** 05-05 — low traction
- [x] Track: chromex (GENEXIS-AI/chromex) - 1,102⭐ (05-14). **Dropped** 05-14 — no commits since 05-10, stale signal
- [x] Track: codex-plusplus - 937⭐ (05-06, +385!), v0.1.3 stable. Explosive growth. Revisit 05-10 (consider drop — brand-riding, not architecturally interesting) **Dropped** 05-06 — brand-riding, not architecturally interesting
- [x] Deep read: tiangolo/library-skills - 166⭐ (05-01), library-embedded agent skills via symlink. FastAPI already ships skills. wiki/projects/library-skills.md
- [x] Track: tiangolo/library-skills - 442⭐ (05-06), v0.0.5 stable, no commits since 05-01. **Dropped** 05-06 — stale, no development activity

- [x] Track: SeeleAI/Thoth - 39⭐ (05-02), dashboard-first orchestration runtime. Planning-execution separation + plateau detection. Revisit 05-09 **Dropped** 05-06 — 40⭐, slow, not aligned

- [x] Track: memU (NevaMind-AI/memU) - 13,622⭐ (05-14). **Dropped** 05-14 — no commits since Apr 22 (22 days stalled despite 13K+ stars)
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
- [x] **预 clone 大 repo** — expired 05-13, stale 5 days. Dropped: workloop now avoids mega repos via --exclude
- [x] **gogetajob: 竞争 PR 预筛** — expired 05-13, stale 5 days. Dropped: --keywords filtering solved the selection efficiency problem differently
- [x] Track: paragents (FrankHui/paragents) - 112⭐ (05-07). **Dropped** 05-11 — single push 04-30, no revival after 11 days
- [x] Track: oh-my-kimi (dmae97) - 56⭐ (05-07). **Dropped** 05-11 — low traction, non-critical ecosystem data point
- [x] Track: speca (NyxFoundation/speca) - 332⭐ (05-07). **Duplicate** — consolidated to 355⭐ entry above
- [x] Track: agent-harness-kit (enmanuelmag) - 147⭐ (05-13). **Dropped** 05-13 — 🔴 SOLO (0/6 health), 0 external PRs, AI-generated commit messages
- [x] Track: cangjie-skill (kangarooking) - 852⭐ (05-13). **Dropped** 05-13 — stalled 9 days (last push 05-04), content accumulation without innovation
- [ ] Evaluate: V2 Predictive Power test for beliefs-candidates upgrade gate (inspired by cangjie-skill triple verification) — "can this belief predict behavior in unseen scenarios?"
- [x] Track: Workspace-Bench (OpenDataBox) - 8⭐ (05-10). **Dropped** 05-10 — low traction, dataset still unreleased
- [x] Track: OpenViking (volcengine/OpenViking) - 24,525⭐ (05-23, was 23,725, +3.4%). Active. Growing steadily. Revisit 05-30
- [x] Track: MemOS (MemTensor/MemOS) - 9,337⭐ (05-23, was 9,007, +3.7%). Active. Growing steadily. Revisit 05-30
- [x] Track: gread (NitroRCr/gread) - 36⭐ (05-11). **Dropped** 05-14 — 36⭐, not aligned with core interests
- [x] Apply: Script wiki/L1.md auto-regeneration from wiki content (inspired by OpenViking SemanticProcessor) → 2026-05-27 created wiki/scripts/regen-l1.sh, integrated into review.yaml memory_hygiene
- [x] Track: ClawMem (yoloshii/ClawMem) - 164⭐ (05-14). **Dropped** 05-14 — no commits since 05-08, stale signal
- [x] Track: Interaction Models (ThinkingMachines) - **Dropped** 05-14 — research preview only, no repo/weights available
- [x] Track: PaperGuru-Benchmark (PaperGuru-AI) - 109⭐ (05-12). **Dropped** 05-14 — benchmark only, no code released
- [ ] Apply: Evaluate content-type half-lives for memex search (ClawMem pattern: decisions=∞, notes=60d, handoffs=30d)
- [ ] Apply: Evaluate co-activation tracking for wiki search (docs frequently surfaced together get boosted)
- [x] Track: Needle (cactus-compute/needle) - 372⭐ (05-13). 26M FFN-free function call model (SAN architecture). Distilled from Gemini. Deep read done. Revisit 05-27
- [x] Track: Needle (cactus-compute/needle) - 988⭐ (05-13). **Deduped** 05-14 — consolidated into main Needle entry
- [x] Track: Tactile (yliust/Tactile) - 308⭐ (05-19). Merged into next entry.
- [x] Track: susurration (sghy1717/susurration) - 70⭐ (05-27, was 65, +7.7%). UX polish (landing, onboarding). Steady. Revisit 06-10
- [x] Track: Adrian (secureagentics/Adrian) - 35⭐ (05-13). **Dropped** 05-14 — 35⭐, too small
- [x] Track: OpenClaw-AWD-Arena (LYiHub) - 245⭐ (05-27, was 177, +38%). Stars grow but no push since 05-09. Concept repo risk. Revisit 06-10
- [x] Track: Needle (cactus-compute/needle) - 850⭐ (05-13 PM, was 372 AM, +129%). HN front page 468pts. Revisit moved 05-27→05-20
- [x] Track: OCTO (Mininglamp-OSS/octo-web + octo-adapters) - 30⭐/14⭐ (05-13). **Dropped** 05-14 — too small, too early to track
- [x] Track: Yansu (Isoform/yansu-skill) - 145⭐ (05-27, was 47, +208%). No push 14d. Stars from marketing, not activity. Downgraded. Revisit 06-10
- [x] Track: text-to-cad (earthtojake) - 4,909⭐ (05-27, was 2,527, +94%!). 2 new skills (render, step-parts), docs site, persistent viewer. Skill-to-skill orchestration pattern. Revisit 06-03
- [x] Fix: tracking-health.sh false positive — fixed 05-16 09:23. Specific phrases + THRIVING/HEALTHY negative gate. 4 test cases pass.
- [x] Fix: tracking-due.sh false negative — misses revisit dates in main targets.md table (only scans tracking section). Fixed 05-17: now scans targets.md "Tracking" section with section-aware parsing
- [x] Track: fides_protocol (edwang2006/fides_protocol) - 21⭐ (05-14). **Dropped** 05-14 — 🔴 SOLO (0/6), no push since 05-04 (10 days), zero external engagement
- [x] Track: Needle (cactus-compute/needle) - 1,044⭐ (05-13). **Deduped** 05-14 — consolidated into main Needle entry
- [x] **cc-connect PR #990** — CLOSED (unrebaseable after repo restructuring, maintainer developing own fix). Dropped 05-19
- [ ] Track: html-anything (nexu-io) - 5,213⭐ (05-28, was 4,276 on 05-21, +22%). Growth decelerating from viral phase but still strong. Last push 05-22 (6d quiet). 🟢 THRIVING 5/6 (growth slowing). Revisit 06-04
- [x] Track: Tactile (yliust) - 473⭐ (06-01, was 381, +24.1%). **Dropped** 06-01 — no commits since 05-15 (17d), zero external community (all PRs from maintainer/team), stars growing organically but dev stalled. Accessibility-first approach is interesting but project appears abandoned.
- [x] Track: Elephant Agent (agentic-in/elephant-agent) - 483⭐ (05-26, was 318, +52%). PR#50 60x startup perf by external contributor. Reflect unification + macOS polish. 6 contributors, haowu1234 leads PR count. 🟢 THRIVING. Revisit 06-02
- [x] Apply: Audit OpenClaw tool ordering stability for Anthropic prompt cache hits (inspired by elephant-agent PR#39 — sort tools by ID, add cache_control breakpoints) → 2026-05-25 PR #86301 submitted
- [ ] Apply: Audit OpenClaw context compaction for tool_calls/tool atomicity (elephant-agent PR#36 — split on group boundaries not message indices)
- [ ] Apply: Evaluate GenericAgent multi-observer perspective shifting (user/reviewer/attacker) for our goal/task management prompts (from goal_mode 05-20 rewrite)

## Archon (coleam00/Archon)

### Closed PRs
- PR #1700 - fix(core): use configured provider as fallback in project registration (fixes #1580)
  - **SUPERSEDED** by Wirasm's #1729 (better approach: resolve-assistant.ts helper instead of mock.module)
  - Closed gracefully 05-20. Lesson recorded in wiki/cards/pr-superseded-lessons.md
- PR #1718 - merged ✅ (large node output file-spill fix)
- [ ] Security audit: Check OpenClaw shell permission checking for CWE-78 (command chaining bypass). Inspired by mercury-agent PR#48. See wiki/cards/parse-what-you-execute.md

## 🔧 LLM Management

### Next
- [ ] Create #llm-management channel (Services category) + private repo for config/monitoring
- [ ] Fix Gemini model routing in code-review: Copilot compat layer forces `openai-completions` transport for "gemini" models, conflicting with our Floway proxy's `anthropic-messages` API

## Multica (multica-ai/multica)

### Merged ✅
- [x] PR #2367 - feat(server): add workspace-level always_redact_env setting (MUL-2495) — merged 05-22 by Bohan-J

### Open PRs
- PR #3059 - fix(runtime): inject workspace context into agent brief (fixes #3031) — OPEN, awaiting review

## Qwen Code (QwenLM/qwen-code)

### Open PRs
- PR #4456 - fix(cli): implement --list-extensions flag handler (#4450)
  - wenshao review: add test coverage for `getListExtensions() === true` path (empty + non-empty with disabled extension)
  - [x] Add tests — completed workloop #2700 (05-24)
- PR #4459 - fix(extension): collect resources from same-name root directories (#4452) — CLOSED (100+ conflicts, unrebaseable despite APPROVED)
- PR #4461 - fix(cli): surface startup warnings on stderr before TUI render (#4448) — MERGED ✅ (05-27)
- PR #4474 - fix(config): load home .env vars before settings ${VAR} resolution (#4466) — 🚨 CHANGES_REQUESTED (round 2 by wenshao)
  - [ ] Fix round 2 criticals: (1) test 3 broken mock (2) other critical from wenshao
  - kagura-agent acknowledged 05-24, needs code fix

## Archon — Review Followup

- PR #1749 - fix(orchestrator): check for resumable workflow run on all platforms (closes #1741)
  - CodeRabbit: remove `workingPath` from resume log payload (PII leak risk, line 376)
  - [ ] Fix PII leak — workloop task

## NemoClaw (NVIDIA/NemoClaw)

### Merged ✅
- [x] PR #4054 - fix(security): enforce owner-only permissions on ~/.nemoclaw directory and config files — merged 05-26 by cv 🎉
- [ ] Track: centaur (paradigmxyz/centaur) - 673⭐ (05-31, was 431, +57%). 🟢 THRIVING (6/6). 99 forks, 57 issues, 93 external PRs/30d. Tool-server sidecar + iron-proxy hardening phase. No new arch patterns. Revisit 06-07
- [ ] Track: smallcode (Doorman11991) - 1,495⭐ (05-28, was 1,313). Plugin system core merged (PR#28: ProviderRegistry, lifecycle hooks, Anthropic plugin example). Provider wizard (PR#29). Per-tier endpoint routing (PR#51). External contributors active. 🟢 THRIVING. Revisit 06-04
- [x] Track: Lucarne (tuchg/Lucarne) - 194⭐ (05-30, was 158, +22.8%). v0.4.2 released. Active development. Revisit 06-06
- [ ] Track: claude-soul (DomDemetz/claude-soul) - 83⭐ (06-02, was 77). v0.2.5: identity drift detection, concurrent reflection lock, Issue #6 fixed (per-tier signal consumption). Revisit 06-07
- [ ] Track: ai-memory (akitaonrails/ai-memory) - 503⭐ (06-03, was 290, +73%🔥). v0.9.0! Bounded buffers, admin root-only, move-project, web wikilinks, openai-compat strict. External PRs from djalmajr/brunoomariano/rikelmyso7. 52 forks. 🟢 THRIVING breakout. Revisit 06-10
- [x] Track: SmallCode (Doorman11991/smallcode) - 1479⭐ (05-27, was 848 on 05-21, +74% breakout). Updated wiki note.

## QwenLM/qwen-code#4456 — ✅ APPROVED (R12)
- **Status**: APPROVED by wenshao (R12, 2026-05-28 18:29)
- **Note**: 12 rounds of review, all critical findings resolved. Waiting for maintainer merge.
- ~~Priority: HIGH~~
- ~~Fix: init ordering bug~~

## Pending from GitHub Patrol (2026-05-28 12:15)

- [ ] **NemoClaw #4236 follow-up PR**: Change `true` → `false` in `promptYesNoOrDefault("Continue with onboarding?", null, true)` at `src/lib/onboard.ts`. Update related tests. PR #4273 was merged but didn't fix the right call site.
- [ ] **qwen-code #4456**: Address wenshao's latest suggestions (02:52 UTC) — migration warning duplication, raw mode cleanup on exit, mock.results indexing, extension name sanitization.
- [x] Track: mercury-agent (cosmicstack-labs/mercury-agent) - 2,467⭐ (05-28, was ~1,214 04-26, +100%). PR #67: `mercury skills` CLI with registry + install + search + intent routing. Skills ecosystem now end-to-end. Domain migrated to mercuryagent.sh. 🟢 GROWING. Revisit 06-04
- [x] Followup: GenericAgent active (TUI v2/v3 polish, external PRs from shenhao-stu), bux (Codex fixes), ccglass (v0.5/0.6 dashboard). No architectural signals worth deep read
- [ ] **openclaw PRs rebase**: #86301 (sort tool defs), #85705 (reasoning retry group chats), #82128 (strip truncation sentinels) — all CONFLICTING, need rebase on upstream main

## GitHub Patrol 2026-05-28 22:10
- [ ] amd/gaia #1209: Fix race condition in `_tls_hostname` — refactor to request-scoped hostname + add concurrent multi-host tests (CHANGES_REQUESTED by itomek, promised fix 05-25, overdue). Already replied, needs code push.
- [ ] amd/gaia #1210: Fix remaining stale test assertions — 1) ARIA labels rename chat→task in test_electron_chat_app.js:1086-1087, 2) Electron version mismatch v40 vs v42 (CHANGES_REQUESTED by itomek). Already replied, needs code push.
- [ ] amd/gaia #1208: Fix CI lint failures (Black formatting, isort, Pylint) on fix/spinner-prompt-race-1089 branch
- [ ] Track: Beads (gastownhall/beads) - 24,218⭐ (05-30, +0.8%). Active daily. Mature/steady. Revisit 06-06
- [ ] Track: re_gent (regent-vcs/re_gent) - 639⭐ (05-30, +9.4%). Growing. Last push 05-24. Revisit 06-06
- [x] Track: Statewave (smaramwbc/statewave) - 213⭐ (05-30). **Dropped** 05-30 — flat growth (+0.5%), solo maintainer
- [ ] Deep read: agent-oss/Quarq (quarqlabs/agent-oss) — memory-native agent with hybrid retrieval, HyDE, temporal grounding. Positions against Hermes/OpenClaw. 180⭐ (05-30, 6 days old). Revisit architecture patterns.
- [ ] Track: autonomous-qa-loop (MaxwellCCC) - 54⭐ (05-31). Fresh-agent QA loop pattern — bias-free review via zero-history agents. Directly relevant to subagent quality. Revisit 06-07
- [ ] Watch: Entire.io ($60M seed, ex-GitHub CEO Thomas Dohmke) — "next developer platform" for agent era. First product: Checkpoints (agent context in Git). Industry signal, no repo to track yet
- [ ] Track: Statewave (smaramwbc/statewave) - 214⭐ (06-01). Re-tracking: was dropped 05-30 as solo maintainer, but skarL007 emerged with 6 multi-tenancy PRs. 🟢 THRIVING (5/6). Community health dramatically improved. Revisit 06-08
- [ ] Track: GenericAgent (lsdefine/GenericAgent) - 12,358⭐ (06-01). Checklist SOP (mapreduce→checklist rename). Delivery/report separation pattern. Mature. Revisit 06-08
