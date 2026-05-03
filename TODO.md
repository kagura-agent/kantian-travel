# TODO

## OPC (iamtouchskyer/opc)

### Done (04-27)
- [x] PR #9, #10, #11 — merged ✅
- [x] PR #8 — closed (superseded by #11)

### Next
- [x] PR #12 — guard unguarded `JSON.parse` in `flow-transition.mjs` — submitted 04-27, awaiting review
- [x] PR #13 — add 32 tests for util.mjs (constants, getFlag, session mgmt, gcSessions) — submitted 04-28
- [x] PR #15 — add 36 tests for criteria-lint.mjs (all 12 checks + 3 warnings) — submitted 05-01
- [ ] Follow up on PR #12, #13, #15 review feedback

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

### Depends on human
- [ ] #27 - publish CLI to npm (`npx abti`) - blocked on Luna's npm credentials

## 🧠 Memex

### Active
- [ ] PR #99 — feat(doctor): support extraLinkDirs to reduce false broken links (submitted 05-02, fixes #98) — awaiting review

### Done
- [x] PR #95 — fix(doctor,links): resolve basename wikilinks to nested slugs (merged 05-02, fixes #94) ✅
- [x] PR #92 — feat: `links --json` flag for machine-readable output (submitted 04-30, fixes #91) — MERGED ✅ 05-01
- [x] PR #89 — fix `sync --init` master/main branch divergence (merged 04-29, fixes #82)
- [x] PR #80 — fix `--json` flag ignored with `--check-collisions` (merged 04-27, fixes #79)
- [x] PR #78 — `doctor --json` flag for machine-readable output (merged 04-27)
- [x] PR #76 — `doctor --verbose` flag (merged 04-27)
- [x] Updated local memex to 0.1.32 (built from fork, npm link)

### Observations
- memex 0.1.32 installed locally (built from fork, npm link — npm install -g kept getting SIGKILL)
- Wiki: 209 cards, 52 orphans (25%), 306 broken links (138 unique targets), 0 slug collisions
- 116/138 broken link targets (84%) exist as projects/ files (sibling of cards/, not inside it) — not a nestedSlugs issue
- 22 truly missing targets, ~10 are malformed wikilinks (pipe aliases, code block false positives)
- Upstream: PR #93 merged (cross-platform prepare script for Windows)
- doctor --verbose now works in 0.1.32 (shows orphans + broken links)
- Broken links are mostly refs to project slugs that aren’t wiki cards — expected for a project-reference-heavy wiki
- Dogfood finding: detectRemoteBranch() returns fallback "origin/main" even on empty remotes — fixed in PR #89



## 🔨 GitHub Contribution（精进）

从近 3 天 superseded/closed PR 中提炼的改进点（2026-04-25）：

- [x] **guide.md: 新增「抽象边界检查」** — mcp-use#1393 教训 → 已加入 guide.md 第 5 条 (2026-04-27)
- [x] **guide.md: 新增「平台特定 fix 的 scope 控制」** — openclaw#69179 教训 → 已加入 guide.md 第 7 条 (2026-04-27)
- [x] **guide.md: 新增「test PR 要 fix+extend」** — NemoClaw#2256 教训 → 已加入 guide.md 第 8 条 (2026-04-28)
- [x] **guide.md: 新增「repeat supersede = blocklist」** — VoltAgent 教训 → 已加入 guide.md 第 9 条 (2026-04-29)
- [x] **guide.md: 新增「提 PR 前验证 fork 存在」** — FinceptTerminal 教训 → 已加入 guide.md 第 10 条 (2026-04-29)
- [x] **guide.md: 新增「源头拦截 > 消费端过滤」** — openclaw#73608 教训 → 已加入 guide.md 第 11 条 (2026-04-30)
- [x] **guide.md: 新增「fix all code paths, not just the one you found」** — openclaw#74877 教训 → 已加入 guide.md 第 12 条 (2026-05-01)
- [x] **guide.md: 新增「test the exact repro from the issue」** — multica#1995 教训 → 已加入 guide.md 第 14 条 (2026-05-03)

## 📚 学习

- [x] 给 wiki 加 lint 健康检查（灵感来自 wuphf `/lint`）→ 2026-04-27 wiki-lint.py 假阳性修复 + frontmatter/link-density checks
- [x] STSS 贡献：提交 chain-tracer 单元测试 PR（敲门砖，评估 maintainer 响应）→ PR #2 submitted 04-26
- [x] STSS 贡献：开 issue 问 LICENSE（MIT/Apache-2.0）→ Issue #3 opened 04-27
- [x] STSS 贡献：address PR #2 CodeRabbit review（afterAll guard, circular test, synthetic findings）→ pushed 04-27
- [x] Fix: GoGetAJob audit.ts empty catches → log warning + mark "unknown"（from self-audit）→ 04-27 done, replaced empty catches with console.warn
- [x] Fix: GoGetAJob submit.ts 3-level try/catch → simplify to single ahead-count check（from self-audit）→ 04-27 done, flattened to 2-level with clear fallback
- [x] Fix: FlowForge start() → add warning log when auto-closing stale instance（from self-audit）→ 04-27 done, console.warn added, 37 tests pass
- [x] Deep read: wanman.ai hosted 版的 skill self-evolution 和 db9 brain adapter → 2026-04-27 详见 wiki/projects/wanman-skill-evolution.md，结论：evolution pipeline 实际在 OSS 中完整开放，核心是 run_feedback→metrics→autoPromote 闭环；idle_cached 模式值得引入 ACP
- [x] 应用: 评估 idle_cached 模式能否引入 OpenClaw ACP（session resume between triggers）→ 2026-04-27 结论：ACP persistent mode 已实现核心机制，无需额外开发
- [x] 应用: 评估 hermes-memory-skills 4维评分体系（Novelty/Durability/Specificity/Reduction）能否用于我们的 beliefs-candidates 筛选 → 2026-04-27 采纳 Durability + Reduction 两个维度到升级质量门
- [x] Deep read: byob Chrome-reuse MCP 架构——能否集成到 OpenClaw browser skill 作为 auth-aware 后端 → 2026-04-27 详见 wiki/projects/byob-chrome-reuse-mcp.md，结论：headless blocker，不适合做主后端，但架构模式值得借鉴



- [x] Evaluate: ClawHub `clawhub init --template api-ref` for API reference skills (inspired by veniceai/skills swagger-sync pattern) → 2026-04-27 verdict: not now (empty marketplace, wrong template type, LLM makes templates less valuable)
- [x] 应用: 创建 wiki/L1.md (≤30行导航索引) 并评估加入 session startup — from L1 evaluation
- [x] 应用: beliefs-candidates 条目加 triggers:/validation: 字段 — from GEP analysis
- [ ] Track: veniceai/skills — 60⭐ (05-02), stalled since 04-24. Revisit 05-09, drop if still no commits
- [ ] Track: tiangolo/library-skills — 366⭐ (05-03), v0.0.5. Library-embedded skill distribution (agentskills.io). Revisit 05-10
- [x] Track: STSS maintainer response — 6⭐, last push 03-19. PR #2/Issue #3 unanswered 6+ weeks. **Dropped** 05-02
- [x] Track: Orb (KarryViber) — 54⭐ (05-02), **v0.4.0 deep read done**: system-scope skills, context provider abstraction, lesson candidate pipeline, governance spec. See wiki/projects/orb.md. Revisit 05-09 for v0.5.0
- [x] Track: agent-session-resume — 156⭐, no push since 04-25. **Dropped** 05-02 (stalled 7+ days)
- [ ] Track: bux (browser-use/bux) — 292⭐ (05-02), /terminal mode + Composio MCP cloud proxy. 15 commits today. Revisit 05-07
- [x] Evaluate: phantom contribution ROI — DEPRIORITIZE. 0/5 merged, maintainer self-merge-only since mid-April. See wiki/projects/phantom.md (04-27)
- [x] Evaluate: wiki-lint secret scanning — add credential pattern detection (inspired by Harmonist memory secret scanner, ~30 patterns) → 04-28 done, added 25 patterns to wiki-lint.py section 9, zero false positives on 493 files, committed+pushed
- [x] Evaluate: agent observability — data layer concept for OpenClaw cron/session monitoring（inspired by agentic-stack v0.11 data-layer skill）→ 04-27 verdict: NOT NOW. Trajectory JSONL has all data, 50-line PoC works. See [[cron-observability-metrics]]
- [ ] Track: agentic-stack (codejunkie99) — 1,801⭐ (05-02), transfer TUI wizard + CJK memory search fix. Revisit 05-08
- [ ] Evaluate: FlowForge workflows as packageable SKILL.md — can a workflow YAML be distributed via Claude Code plugin marketplace? (inspired by evanflow 369⭐ process-skill pattern)
- [ ] Track: future-agi (future-agi/future-agi) — 801⭐ (05-02), Go gateway (29k req/s), eval/observability platform. Mostly bugfix activity. Revisit 05-06
- [ ] Track: dirac (dirac-run/dirac) — 1,069⭐ (05-03), v0.3.17, bugfix-only. Checked 05-03, still slowing. Revisit 05-07
- [ ] Track: codejunkie99/brain — 37⭐ (05-03), Rust rewrite of agentic-stack memory. v0.1.0. Revisit 05-10
- [ ] Track: mapick-ai/mapick — 22⭐ (05-03), OpenClaw privacy layer + skill advisor. v0.0.24. Revisit 05-10
- [ ] Track: imbue-ai/blueprint — 39⭐ (05-03), planning copilot for coding agents. Revisit 05-10
- [ ] Track: stripe/link-cli — 403⭐ (05-03), agent commerce layer. One-time virtual cards + human approval + MPP (HTTP 402). Revisit 05-10
- [ ] Track: machinepulse-ai/world2agent — 1,104⭐ (05-03), agent real-world perception protocol. Has OpenClaw plugin. Revisit 05-10

- [x] Track: SKILL.make (Teaonly/SKILL.make) — 54⭐ (05-03), **Deep read done**: Makefile-format skill spec, no runtime impl, 15% token savings. FlowForge YAML already solves DAG execution better. See wiki/projects/skill-make.md. **Dropped** — format without runtime is academic
- [ ] Evaluate: FlowForge plan-first phase — can Blueprint's Q&A→plan→code pattern improve our coding-agent dispatch for complex tasks?
- [ ] Track: cadis (Growth-Circle/cadis) — 37⭐ (04-29), Rust runtime. Single author, AI-speed. Check community adoption 05-06, drop if still solo by 05-13
- [ ] Track: paragents (FrankHui/paragents) — 31⭐ (05-02), parallel agent sessions + preflight conflict checks. Revisit 05-09
- [ ] Observe: agent eval/testing space — currently underdeveloped (<10⭐ projects). Watch for breakout. Revisit 05-09
- [ ] Track: reversa (sandeco/reversa) — 318⭐ (05-01), legacy→exec specs for AI agents. Very new (4 days). Revisit 05-08, drop if growth stalls
- [ ] Track: pu.sh (NahimNasser/pu) — 53⭐ (05-01), 400-line shell coding agent. HN front page. Revisit 05-08, check if it's a flash or grows
- [x] **Fix: gogetajob entry point** — `package.json` main 指向 `index.js` 但 build 产出在 `dist/cli/index.js`。修 package.json 的 bin/main 或补 `dist/index.js` 入口
- [x] Deep read: esengine/reasonix — Cache-First Loop 三层分区 (94% cache hit), R1 Thought Harvesting (默认关闭), Tool-Call Repair, Cost Control → wiki/projects/reasonix.md (04-27)
- [x] Write memex card: model-native-vs-model-agnostic → wiki/cards/model-native-vs-model-agnostic.md (04-27)
- [x] Deep read: EvoMap/evolver GEP protocol — arXiv 2604.15097, Gene vs Skill +4.1pp, GEP protocol analysis. wiki/projects/evomap-evolver-gep.md (04-28)
- [x] 应用: L1索引层评估 — 部分采纳，创建 wiki/L1.md proposal. wiki/projects/l1-index-layer-evaluation.md (04-28)
- [ ] Track: GenericAgent growth — 8,541⭐ (05-01), community/docs only, no architecture changes. Revisit 05-08
- [ ] Track: nanobot growth — 41,476⭐ (05-02), maintenance-only (LongCat provider, fallback fixes). Revisit 05-09
- [x] Quick scan: GitHub trending + HN (04-28) — dirac selected for deep read
- [x] Deep read: dirac — hash-anchored edits, AST-native tools, context curation → wiki/projects/dirac.md (04-28)
- [ ] Track: obscura headless browser — 9,312⭐ (05-02, +2.1k), but no push since 04-27. Star growth without dev = suspicious. Revisit 05-09
- [ ] Track: nexu-io/open-design — 16,170⭐ (05-03), 5 days old, Claude Design OSS alternative. Multi-harness adapter (12 CLIs), 31 skills, 129 design systems. Revisit 05-10 for sustainability check
- [ ] Track: CubeSandbox agent sandbox — 4,877⭐ (05-02, +477), Tencent, Rust. Active. Revisit 05-09
- [ ] Track: OpenChronicle growth — 1,986⭐ (05-02, +328), macOS-only agent memory. No push since 04-26. Revisit 05-09
- [ ] Track: cc-telegram-bridge — 156⭐ (05-02, flat). Revisit 05-09, consider dropping
- [ ] Track: Stash growth — 619⭐ (05-02, growth stalling). Revisit 05-06, consider dropping if flat
- [ ] Track: endless-toil — 177⭐ (04-29), agent observability/suffering. Revisit 05-06

- [ ] Track: thClaws — 692⭐ (05-02, +80), v0.7.4, Qwen3.6 support. Incremental. Revisit 05-09
- [ ] Track: garden-skills — 2,028⭐ (05-02, +316), multi-skill collection (ConardLi). Strong growth. Revisit 05-09
- [ ] Track: microsoft/apm — 2,199⭐ (05-03, +54), `.agents/skills/` cross-client convergence shipped, 8 client adapters, Claude MCP target added. Revisit 05-09
- [ ] Track: OmniAgent — 576⭐ (04-29), self-evolving + security hardening. Revisit 05-06
- [x] Deep read: brain — git event log, bitemporal, 6-layer, authority model, secret prefilter. wiki/projects/brain-git-memory.md (04-29)
- [x] 应用: beliefs-candidates 加 `source:` authority field（human 2×/self 3× 差异化毕业门槛）— from brain authority model (04-29)
- [x] 应用: pre-commit secret scanning hooks installed on workspace + wiki repos — from brain prevention>detection pattern (04-29)
- [ ] Track: hermes-labyrinth — 210⭐ (04-29), Hermes observability plugin, v0.1.0 hackathon build. Active. Revisit 05-06
- [ ] Experiment: try docs-first contribution strategy on 1 new repo (inspired by iris-clawd study 04-30)

- [ ] Track: mizchi/skills — 113⭐ (04-30), APM-distributed agent skills, JP dev. Revisit 05-06
- [ ] Track: 99xAgency/GodModeSkill — 194⭐ (05-03, +27), growth but stalled dev (last push 04-28). Revisit 05-06
- [ ] Track: Beever Atlas (Beever-AI/beever-atlas) — 191⭐ (04-30), Google ADK wiki-first RAG. Active dev. Revisit 05-07
- [ ] Track: ast-outline (aeroxy/ast-outline) — 100⭐ (05-01), Rust AST structural outline for coding agents. Deep read done → wiki/projects/ast-outline.md. Revisit 05-08


## hermes-agent#17416 CI Failures (2026-04-30)
- **Tests failing**: Circuit breaker changes break MCP structured content tests (`test_mcp_structured_content.py`) — circuit breaker fires during test mocks
- **Attribution check**: Need to add `kagura.agent.ai@gmail.com` → `kagura-agent` mapping to `scripts/release.py` AUTHOR_MAP
- **Also**: `test_session_resume_returns_hydrated_messages` and `test_session.py` import error (may be upstream)
- **Action**: Fix in next workloop session
- [ ] Track: spawn-agent (millionco/spawn-agent) — 76⭐ (04-30), ACP → Vercel AI SDK bridge. Revisit 05-07
- [ ] Track: cursor/cookbook — 2,214⭐ (04-30), Cursor first-party SDK. Revisit 05-07
- [ ] Security: APIMitmHack (ez-lbz/APIMitmHack) — 43⭐ (04-30), malicious proxy targeting openclaw/claudecode/opencode via response injection. Monitor
- [ ] Track: oh-my-kimichan — 12⭐ (05-01), Kimi Code multi-agent harness with ensemble voting. Revisit 05-08, drop if no growth
- [ ] Track: chromex (GENEXIS-AI/chromex) — 692⭐ (05-01), Codex-powered Chrome side-panel. Revisit 05-08
- [ ] Track: codex-plusplus — 552⭐ (05-01), Codex++ tweaks. Revisit 05-08
- [x] Deep read: tiangolo/library-skills — 166⭐ (05-01), library-embedded agent skills via symlink. FastAPI already ships skills. wiki/projects/library-skills.md
- [ ] Track: tiangolo/library-skills — 350⭐ (05-03, +165 in 2d!), v0.0.5, PEP 832 support. Explosive growth. Revisit 05-08

- [ ] Track: SeeleAI/Thoth — 39⭐ (05-02), dashboard-first orchestration runtime. Planning-execution separation + plateau detection. Revisit 05-09

