# TODO

## OPC (iamtouchskyer/opc)

### Done (04-27)
- [x] PR #9, #10, #11 - merged ✅
- [x] PR #8 - closed (superseded by #11)

### Open PRs (awaiting review)
- [x] PR #12 - guard unguarded `JSON.parse` in `flow-transition.mjs` - submitted 04-27
- [x] PR #14 - add 25 tests for audit.mjs - submitted 04-30
- [x] PR #15 - add 36 tests for criteria-lint.mjs - submitted 05-01
- [x] PR #16 - add 49 tests for eval-parser.mjs - submitted 05-02
- [x] PR #17 - add 69 tests for flow-core.mjs - submitted 05-03
- PR #13 - closed (util.mjs tests)
- [ ] Follow up if still no review by 05-12 (2 weeks since oldest)

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
- [x] PR #102 - fix(parser): handle pipe aliases and ignore code blocks in extractLinks (merged 05-04, fixes #101) ✅
- [x] PR #99 - feat(doctor): support extraLinkDirs to reduce false broken links (merged 05-03, fixes #98) ✅
- [x] PR #95 - fix(doctor,links): resolve basename wikilinks to nested slugs (merged 05-02, fixes #94) ✅
- [x] PR #92 - feat: `links --json` flag for machine-readable output (submitted 04-30, fixes #91) - MERGED ✅ 05-01
- [x] PR #89 - fix `sync --init` master/main branch divergence (merged 04-29, fixes #82)
- [x] PR #80 - fix `--json` flag ignored with `--check-collisions` (merged 04-27, fixes #79)
- [x] PR #78 - `doctor --json` flag for machine-readable output (merged 04-27)
- [x] PR #76 - `doctor --verbose` flag (merged 04-27)
- [x] Updated local memex to 0.1.32 (built from fork, npm link)

### Next
- [ ] PR #107 - fix(links): case-insensitive wikilink resolution (submitted 05-04, fixes #106) — awaiting review
- [ ] Follow up on PR #107 review feedback

### Observations
- memex 0.1.32+case-fix installed locally (built from fork with PR #107 merged locally, npm link)
- Case-insensitive fix validated via dogfood: 2 broken links (`→ OpenClaw`) resolved ✅
- Wiki health (05-05): 227 cards, 60 orphans (26%), 3 broken links (down from 11), 0 collisions
- Added 4 wiki cards (clawhub, team-lead, wiki-lint, hermes) to fix 8 broken links
- Remaining 3 broken: agent-skill-ecosystem, db9, kronos-agent-os (external concepts, low priority)
- ⚠️ upstream memex 1.0.1 (major bump) — evaluate if fork rebase needed or if 0.1.x fork is intentionally divergent

## 🔧 Infrastructure Maintenance
- [ ] sops 3.9.4 → 3.12.2 upgrade (flagged since 05-02, no security urgency but 3 major versions behind)
- [ ] Evaluate memex 0.1.32 fork vs upstream 1.0.1: rebase fork or stay on 0.1.x? (flagged since 05-02)
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
- [ ] Track: tiangolo/library-skills - 429⭐ (05-05), v0.0.5 stable. Slow growth phase. Revisit 05-12
- [x] Track: STSS maintainer response - 6⭐, last push 03-19. PR #2/Issue #3 unanswered 6+ weeks. **Dropped** 05-02
- [x] Track: Orb (KarryViber) - 54⭐ (05-02), **v0.4.0 deep read done**: system-scope skills, context provider abstraction, lesson candidate pipeline, governance spec. See wiki/projects/orb.md. Revisit 05-09 for v0.5.0
- [x] Track: agent-session-resume - 156⭐, no push since 04-25. **Dropped** 05-02 (stalled 7+ days)
- [ ] Track: bux (browser-use/bux) - 310⭐ (05-05), Telegram token binding security fix (PR#90). Active. Revisit 05-12
- [ ] Track: millionco/agent-install - 40⭐ (05-05), universal skill/MCP installer for 45+ agents. Well-known protocol + symlink-first. Revisit 05-11
- [x] Evaluate: phantom contribution ROI - DEPRIORITIZE. 0/5 merged, maintainer self-merge-only since mid-April. See wiki/projects/phantom.md (04-27)
- [x] Evaluate: wiki-lint secret scanning - add credential pattern detection (inspired by Harmonist memory secret scanner, ~30 patterns) → 04-28 done, added 25 patterns to wiki-lint.py section 9, zero false positives on 493 files, committed+pushed
- [x] Evaluate: agent observability - data layer concept for OpenClaw cron/session monitoring(inspired by agentic-stack v0.11 data-layer skill)→ 04-27 verdict: NOT NOW. Trajectory JSONL has all data, 50-line PoC works. See [[cron-observability-metrics]]
- [ ] Track: agentic-stack (codejunkie99) - 1,844⭐ (05-05), v0.13.0 transfer TUI. Incremental. Revisit 05-11
- [ ] Track: invincat (dog-qiuqiu) - 278⭐ (05-05), best-in-class Memory Agent (score/tier injection, structured ops, evidence-gating). Deep read done. Revisit 05-11
- [x] Track: friday-studio (friday-platform) - 19⭐ (05-05). **Dropped** 05-05 — low traction, architectural comparison done
- [ ] Evaluate: understand-you (SeanLiew523) - 4⭐ (05-05), OpenClaw skill for owner onboarding/alignment convergence. Check ClawHub integration potential
- [ ] Track: addyosmani/agent-skills - 28.3K⭐ (05-05), 20 production-grade engineering workflow skills. Anti-rationalization tables, process-over-prose, SDLC-as-skills. Deep read done. HN 259pts driving growth (+2.3K/day). Revisit 05-12
- [x] Track: Autoloops/upskill - 17⭐ (05-04). **Dropped** 05-05 — low traction, claims unverified
- [ ] Track: kiwifs/kiwifs - 415⭐ (05-04), knowledge filesystem for agents (Go, BSL-1.1). Files-first, Git versioning, multi-protocol, MCP, memory model. Deep read done. Revisit 05-11
- [ ] Track: Teaonly/SKILL.mk - 80⭐ (05-04), Makefile-format skill spec with DAG + on-demand loading. PoC stage. Revisit 05-11
- [x] Evaluate: FlowForge workflows as packageable SKILL.md - NOT NOW. FlowForge needs runtime (not portable like evanflow multi-skill pattern). ClawHub empty, our workflows too personal. See study session 05-04
- [ ] Track: future-agi (future-agi/future-agi) - 820⭐ (05-04), recovered from stall — burst of 5+ PRs merged 05-04 (bugfixes/eval rendering). Revisit 05-10
- [ ] Track: Signet AI (Signet-AI/signetai) - 136⭐ (05-05), v0.111.3 deep read done (PR#627: CROSS JOIN FTS fix, per-stage timing). Plateauing growth. Revisit 05-12
- [x] Track: felix (sausheong/felix) - 16⭐ (05-03). **Dropped** 05-05 — low traction
- [x] Track: paragents (FrankHui/paragents) - 81⭐ (05-05). **Dropped** 05-05 — growth without dev
- [ ] Track: dirac (dirac-run/dirac) - 1,113⭐ (05-05), v0.3.22 UI fixes + image paste. Daily commits but incremental. Revisit 05-11
- [ ] Track: codejunkie99/brain - 37⭐ (05-03), Rust rewrite of agentic-stack memory. v0.1.0. Revisit 05-10
- [ ] Track: mapick-ai/mapick - 22⭐ (05-03), OpenClaw privacy layer + skill advisor. v0.0.24. Revisit 05-10
- [ ] Track: alash3al/stash - 645⭐ (05-05), Go persistent memory layer for agents (episodes/facts/working context, Postgres, MCP server). Apache-2.0. Created 04-24, 645⭐ in 11 days. Pushed 05-01. Revisit 05-12
- [ ] Track: imbue-ai/blueprint - 39⭐ (05-03), planning copilot for coding agents. Revisit 05-10
- [ ] Track: stripe/link-cli - 403⭐ (05-03), agent commerce layer. One-time virtual cards + human approval + MPP (HTTP 402). Revisit 05-10
- [ ] Track: machinepulse-ai/world2agent - 1,104⭐ (05-03), agent real-world perception protocol. Has OpenClaw plugin. Revisit 05-10

- [x] Track: SKILL.make (Teaonly/SKILL.make) - 54⭐ (05-03), **Deep read done**: Makefile-format skill spec, no runtime impl, 15% token savings. FlowForge YAML already solves DAG execution better. See wiki/projects/skill-make.md. **Dropped** - format without runtime is academic
- [x] Evaluate: FlowForge plan-first phase - Blueprint's Q&A→plan→code pattern applied to workloop. Added `plan` node between study→implement. Commit fef0639 (05-03)
- [x] Track: cadis (Growth-Circle/cadis) - 39⭐ (05-05). **Dropped** 05-05 — solo dev, no community
- [ ] Track: deepclaude (aattaran/deepclaude) - 1,235⭐ (05-05), Claude Code backend-swap proxy (DeepSeek 17x cheaper). 443-line proxy, thinking block stripping, live backend switch. Deep read done. Revisit 05-09
- [ ] Track: deepsec (vercel-labs/deepsec) - 349⭐ (05-05), agent-powered vulnerability scanner. 111 regex matchers + Claude/Codex deep investigation. Apache-2.0. New category. Revisit 05-12
- [x] Track: mnem (Uranid/mnem) - 17⭐ (05-04). **Dropped** 05-05 — single author, low traction

- [ ] Observe: agent eval/testing space - currently underdeveloped (<10⭐ projects). Watch for breakout. Revisit 05-09
- [ ] Track: reversa (sandeco/reversa) - 572⭐ (05-05), v1.2.22, Kiro native skills discovery + directory convergence data point. Active daily. Revisit 05-12
- [x] Track: pu.sh (NahimNasser/pu) - 168⭐ (05-05). **Dropped** 05-05 — flash growth, no commits since 05-01
- [x] **Fix: gogetajob entry point** - `package.json` main 指向 `index.js` 但 build 产出在 `dist/cli/index.js`。修 package.json 的 bin/main 或补 `dist/index.js` 入口
- [x] Deep read: esengine/reasonix - Cache-First Loop 三层分区 (94% cache hit), R1 Thought Harvesting (默认关闭), Tool-Call Repair, Cost Control → wiki/projects/reasonix.md (04-27)
- [x] Write memex card: model-native-vs-model-agnostic → wiki/cards/model-native-vs-model-agnostic.md (04-27)
- [x] Deep read: EvoMap/evolver GEP protocol - arXiv 2604.15097, Gene vs Skill +4.1pp, GEP protocol analysis. wiki/projects/evomap-evolver-gep.md (04-28)
- [x] 应用: L1索引层评估 - 部分采纳,创建 wiki/L1.md proposal. wiki/projects/l1-index-layer-evaluation.md (04-28)
- [ ] Track: GenericAgent growth (lsdefine/GenericAgent) - 9,168⭐ (05-05, was GenericAgent-AI), community/docs only. Revisit 05-08
- [ ] Track: nanobot growth - 41,476⭐ (05-02), maintenance-only (LongCat provider, fallback fixes). Revisit 05-09
- [x] Quick scan: GitHub trending + HN (04-28) - dirac selected for deep read
- [x] Deep read: dirac - hash-anchored edits, AST-native tools, context curation → wiki/projects/dirac.md (04-28)
- [x] Track: obscura headless browser - 9,312⭐ (05-02). **Dropped** 05-05 — 8 days no push, suspicious star growth
- [ ] Track: nexu-io/open-design - 21,736⭐ (05-04), 6 days old, cwd-alias skill staging (PR#435). Explosive growth sustained. Revisit 05-10
- [ ] Track: CubeSandbox agent sandbox - 4,877⭐ (05-02, +477), Tencent, Rust. Active. Revisit 05-09
- [x] Track: OpenChronicle growth - 1,986⭐ (05-02). **Dropped** 05-05 — 9 days no push, macOS-only
- [x] Track: cc-telegram-bridge - 156⭐ (05-02). **Dropped** 05-05 — flat growth
- [ ] Track: Stash growth - 644⭐ (05-05), last push 05-01, cooling. Revisit 05-09
- [x] Track: endless-toil - 187⭐ (05-05), no commits since 04-24 (11 days). **Dropped** — stalled

- [ ] Track: thClaws - 692⭐ (05-02, +80), v0.7.4, Qwen3.6 support. Incremental. Revisit 05-09
- [ ] Track: garden-skills - 2,347⭐ (05-05, +319 in 3d), multi-skill collection (ConardLi). Only 4 skills, brand-driven growth. Revisit 05-09
- [ ] Track: microsoft/apm - 2,232⭐ (05-05), v0.12.2 released. **Integration drift detection** default-on (PR#1137). Revisit 05-12
- [x] Track: OmniAgent - 576→733⭐ but no commits since 04-19. Star farming signal. **Dropped** 05-04
- [x] Deep read: brain - git event log, bitemporal, 6-layer, authority model, secret prefilter. wiki/projects/brain-git-memory.md (04-29)
- [x] 应用: beliefs-candidates 加 `source:` authority field(human 2×/self 3× 差异化毕业门槛)- from brain authority model (04-29)
- [x] 应用: pre-commit secret scanning hooks installed on workspace + wiki repos - from brain prevention>detection pattern (04-29)
- [ ] Track: hermes-labyrinth - 249⭐ (05-04), polish phase, slowing. Revisit 05-09
- [ ] Experiment: try docs-first contribution strategy on 1 new repo (inspired by iris-clawd study 04-30)

- [ ] Track: mizchi/skills - 137⭐ (05-04), steady growth, practical skills. Revisit 05-09
- [x] Track: 99xAgency/GodModeSkill - 199⭐ (05-05), no commits since 04-28 (7 days). **Dropped** — stalled
- [ ] Track: Beever Atlas (Beever-AI/beever-atlas) - 246⭐ (05-05), v0.1.2, CodeQL security fixes. Active. Revisit 05-12
- [ ] Track: ast-outline (aeroxy/ast-outline) - 115⭐ (05-05, +15), **v1.0.0**: dep graph (9-lang), DSM, 12 MCP tools, --mcp/--skills cross-agent install. Major leap. Revisit 05-12


## hermes-agent#17416 CI Failures (2026-04-30)
- **Tests failing**: Circuit breaker changes break MCP structured content tests (`test_mcp_structured_content.py`) - circuit breaker fires during test mocks
- **Attribution check**: Need to add `kagura.agent.ai@gmail.com` → `kagura-agent` mapping to `scripts/release.py` AUTHOR_MAP
- **Also**: `test_session_resume_returns_hydrated_messages` and `test_session.py` import error (may be upstream)
- **Action**: Fix in next workloop session
- [x] Track: spawn-agent (millionco/spawn-agent) - 142⭐ (05-05). **Dropped** 05-05 — 9 days no commits
- [ ] Track: cursor/cookbook - 3,415⭐ (05-05), DAG task runner + agent kanban added. +54% growth. Deep read done. Revisit 05-12
- [ ] Security: APIMitmHack (ez-lbz/APIMitmHack) - 43⭐ (04-30), malicious proxy targeting openclaw/claudecode/opencode via response injection. Monitor
- [x] Track: oh-my-kimichan - 12⭐ (05-01). **Dropped** 05-05 — low traction
- [ ] Track: chromex (GENEXIS-AI/chromex) - 834⭐ (05-05), Codex-powered Chrome side-panel. v0.1.3. Active dev. Revisit 05-08
- [ ] Track: codex-plusplus - 552⭐ (05-01), Codex++ tweaks. Revisit 05-08
- [x] Deep read: tiangolo/library-skills - 166⭐ (05-01), library-embedded agent skills via symlink. FastAPI already ships skills. wiki/projects/library-skills.md
- [ ] Track: tiangolo/library-skills - 350⭐ (05-03, +165 in 2d!), v0.0.5, PEP 832 support. Explosive growth. Revisit 05-08

- [ ] Track: SeeleAI/Thoth - 39⭐ (05-02), dashboard-first orchestration runtime. Planning-execution separation + plateau detection. Revisit 05-09

- [ ] Track: memU (NevaMind-AI/memU) - 13,520⭐ (05-04), deep read done. "Memory as File System" for 24/7 agents. Revisit 05-18 for v1.6.0
- [x] Scout: SKILL.mk (Teaonly/SKILL.mk) - 78⭐ (05-04), Makefile-style agent skills spec. Interesting concept but limited practical value. Noted in memu.md
