# TODO

## OPC (iamtouchskyer/opc)

### Done (04-27)
- [x] PR #9, #10, #11 - merged ✅
- [x] PR #8 - closed (superseded by #11)

### Open PRs (awaiting review)
- PR #15 - add 36 tests for criteria-lint.mjs - submitted 05-01
- PR #16 - add 49 tests for eval-parser.mjs - submitted 05-02
- PR #17 - add 69 tests for flow-core.mjs - submitted 05-03
- PR #18 - docs: fix stale extension path references - submitted 05-06
- [ ] Follow up if still no review by 05-12 (2 weeks since oldest)

### Closed (not merged)
- PR #12 - JSON.parse guard (closed 05-07, no review after 10 days)
- PR #13 - util.mjs tests (closed)
- PR #14 - audit.mjs tests (closed 05-07, backlog management)

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
- [ ] PR #123 - feat(links): count inbound links from extraLinkDirs in orphan detection (submitted 05-07, fixes #122) — awaiting review
- [ ] Follow up on PR #107 review feedback

### Observations
- memex 0.1.32+case-fix+extralinks installed locally (built from fork with PR #107 + #123 merged locally, npm link)
- Case-insensitive fix validated via dogfood: 2 broken links (`→ OpenClaw`) resolved ✅
- Wiki health (05-07): 237 cards, 48 orphans (20%), 3 broken links, 0 collisions
  - Orphan improvement: 67 → 48 after extraLinkDirs inbound counting (PR #123)
  - 5 new orphan cards today (agent-budget-control, composable-prompt-assembly, llm-decision-layer-pattern, memory-complexity-pendulum, tiered-memory-retrieval) — all concept cards, will link naturally over time
- Remaining 3 broken: agent-skill-ecosystem, db9, kronos-agent-os (external concepts, low priority)
- Upstream quiet: last commit 05-04 (A-MEM skill), no new activity

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
- [x] Track: invincat (dog-qiuqiu) - 304⭐ (05-07), 3rd round simplification (-326 lines total). Prompt compression + decision order. Revisit 05-14
- [x] Track: STSS maintainer response - 6⭐, last push 03-19. PR #2/Issue #3 unanswered 6+ weeks. **Dropped** 05-02
- [x] Track: Orb (KarryViber) - 60⭐ (05-08, was 54, +11%). Still v0.4.0, no commits since 05-02 (6 days). Growth steady but dev paused. No v0.5.0 yet. Revisit 05-15
- [x] Track: agent-session-resume - 156⭐, no push since 04-25. **Dropped** 05-02 (stalled 7+ days)
- [x] Track: bux (browser-use/bux) - 311⭐ (05-06), flat growth. **Dropped** 05-06 — flat star growth, no traction signal
- [x] Track: openmelon (eight-acres-lab) - 58⭐ (05-06), flat growth. Go core. **Dropped** 05-06 — flat star growth despite active commits
- [ ] Track: skillplus (eight-acres-lab) - 469⭐ (05-08, was ~450 est). 8 skills now: food/travel/avatar realism + Douyin/Xiaohongshu/Weibo copywriting. Active daily commits (latest 05-07). Compilable skill packages → multi-target (OpenMelon/skill-md/prompt-bundle). Growing fast, CN social media content niche. Revisit 05-14
- [x] Track: millionco/agent-install - 40⭐ (05-06), flat. **Dropped** 05-06 — stale (last push 05-01), low traction
- [x] Evaluate: phantom contribution ROI - DEPRIORITIZE. 0/5 merged, maintainer self-merge-only since mid-April. See wiki/projects/phantom.md (04-27)
- [x] Track: dreamer (luml-ai/dreamer) - 13⭐ (05-06), team-wide self-evolving context MCP server. Two-phase dream pipeline. Brand new. Revisit 05-13 **Dropped** 05-06 — low traction (<50⭐), too new to justify slot
- [ ] Track: mirage (strukto-ai/mirage) - 1,286⭐ (05-08 late PM, was 1,105 earlier), unified VFS for AI agents. Explosive growth. Revisit 05-14
- [ ] Track: oh-story-claudecode (worldwonderer) - 831⭐ (05-07), steady growth. Revisit 05-13
- [ ] Track: RunbookHermes (Tommy-yw) - 530⭐ (05-07), Hermes-native AIOps agent. Deep read done. Revisit 05-21
- [x] Track: mirage (strukto-ai/mirage) - 601⭐ (05-07 PM) → merged into 05-08 PM entry above
- [x] Track: girl-agent (TheSashaDev) - 188⭐ (05-07), growth flat, no new architectural features. **Dropped** 05-07
- [ ] Track: deepclaude (aattaran) - 1,610⭐ (05-08 PM), healthy 5% growth. Thin wrapper pattern. Revisit 05-13
- [ ] Track: agent-skills-eval (darkrishabh) - 212⭐ (05-08 PM), test runner for agentskills.io skills. with/without A/B eval. TypeScript CLI. Revisit 05-14
- [ ] Track: downy (bensenescu) - 157⭐ (05-08), OpenClaw Alternative on Cloudflare DOs. Web-only, single-user. Created 04-30. Revisit 05-15
- [ ] Track: speca (NyxFoundation) - 355⭐ (05-08), spec-to-checklist agentic auditing. DeFi benchmarks. Active dev. Revisit 05-15
- [ ] Track: craft-agents-oss (warpdot-dev) - 212⭐ (05-06), Apache 2.0 agent desktop, direct competitor. Revisit 05-13
- [ ] Track: deepsec (vercel-labs/deepsec) - 1,757⭐ (05-08, +16%). Self-dogfooding, out-of-quota handling, sandbox for local agents. Maturing. Revisit 05-14
- [x] Track: lukiIabs/skills - 241⭐ (05-08 PM), no commits since 05-01. Growth stalled. **Dropped** 05-08 — stale, no commits 7+ days, stars flat
- [x] Evaluate: wiki-lint secret scanning - add credential pattern detection (inspired by Harmonist memory secret scanner, ~30 patterns) → 04-28 done, added 25 patterns to wiki-lint.py section 9, zero false positives on 493 files, committed+pushed
- [x] Evaluate: agent observability - data layer concept for OpenClaw cron/session monitoring(inspired by agentic-stack v0.11 data-layer skill)→ 04-27 verdict: NOT NOW. Trajectory JSONL has all data, 50-line PoC works. See [[cron-observability-metrics]]
- [ ] Track: agentic-stack (codejunkie99) - 1,888⭐ (05-08 PM), v0.15.0. Plateauing (<1% growth). Revisit 05-13
- [ ] Track: invincat (dog-qiuqiu) - 304⭐ (05-08 PM). Multi-model pivot: DeepSeek thinking support + model registration refactor. Continued prompt simplification. Revisit 05-14
- [x] Track: friday-studio (friday-platform) - 19⭐ (05-05). **Dropped** 05-05 — low traction, architectural comparison done
- [x] Evaluate: understand-you (SeanLiew523) - 4⭐ (05-05), OpenClaw skill for owner onboarding/alignment convergence. Check ClawHub integration potential → 05-07 verdict: NOT NOW. Mature workspace, 4⭐ single-day project, no traction. Gap-audit pattern worth noting. See wiki/projects/understand-you.md
- [ ] Track: addyosmani/agent-skills - 33.9K⭐ (05-08, was 32.1K, +6%). Still viral but growth decelerating. Only plugin.json fix since 05-05. Revisit 05-15
- [x] Track: Autoloops/upskill - 17⭐ (05-04). **Dropped** 05-05 — low traction, claims unverified
- [ ] Track: kiwifs/kiwifs - 421⭐ (05-07), v0.5.0 released. Agent self-modification of rules (PR#41 GuardPath allowlist). Dev velocity decelerating but architecture complete. Converging on "agent workspace server". Revisit 05-14
- [x] Track: Teaonly/SKILL.mk - 80⭐ (05-04), Makefile-format skill spec with DAG + on-demand loading. PoC stage. Revisit 05-11 **Dropped** 05-06 — PoC stage, 93⭐, not actionable
- [x] Evaluate: FlowForge workflows as packageable SKILL.md - NOT NOW. FlowForge needs runtime (not portable like evanflow multi-skill pattern). ClawHub empty, our workflows too personal. See study session 05-04
- [x] Track: future-agi (future-agi/future-agi) - 820⭐ (05-04), recovered from stall — burst of 5+ PRs merged 05-04 (bugfixes/eval rendering). Revisit 05-10 **Dropped** 05-06 — bugfixes only, no new architectural insights
- [ ] Track: Signet AI (Signet-AI/signetai) - 137⭐ (05-08 PM), flat growth. Still active (pushed today). Revisit 05-15
- [x] Track: felix (sausheong/felix) - 16⭐ (05-03). **Dropped** 05-05 — low traction
- [x] Track: paragents (FrankHui/paragents) - 81⭐ (05-05). **Dropped** 05-05 — growth without dev
- [x] Track: dirac (dirac-run/dirac) - 1,113⭐ (05-05), v0.3.22 UI fixes + image paste. Daily commits but incremental. Revisit 05-11 **Dropped** 05-06 — incremental UI, not architecturally relevant
- [x] Track: codejunkie99/brain - 37⭐ (05-03), Rust rewrite of agentic-stack memory. v0.1.0. Revisit 05-10 **Dropped** 05-06 — 51⭐, stalled since 04-28
- [x] Track: mapick-ai/mapick - 22⭐ (05-03), OpenClaw privacy layer + skill advisor. v0.0.24. Revisit 05-10 **Dropped** 05-06 — 22⭐, tiny, no growth signal
- [x] Track: alash3al/stash - 666⭐ (05-08). **Dropped** 05-08 — no commits since 05-01, stars flat, stalled
- [x] Track: imbue-ai/blueprint - 39⭐ (05-03), planning copilot for coding agents. Revisit 05-10 **Dropped** 05-06 — 46⭐, slow growth, niche
- [ ] Track: stripe/link-cli - 466⭐ (05-07), v0.4.3. Recent: credential-to-file output, claude plugin path fix, auth config 0o600 mode. Incremental. Revisit 05-14
- [x] Track: machinepulse-ai/world2agent - 1,311⭐ (05-06). **Dropped** 05-06 — development stalled since 04-30, HN hype fading

- [x] Track: SKILL.make (Teaonly/SKILL.make) - 54⭐ (05-03), **Deep read done**: Makefile-format skill spec, no runtime impl, 15% token savings. FlowForge YAML already solves DAG execution better. See wiki/projects/skill-make.md. **Dropped** - format without runtime is academic
- [x] Evaluate: FlowForge plan-first phase - Blueprint's Q&A→plan→code pattern applied to workloop. Added `plan` node between study→implement. Commit fef0639 (05-03)
- [x] Track: cadis (Growth-Circle/cadis) - 39⭐ (05-05). **Dropped** 05-05 — solo dev, no community
- [ ] Track: deepclaude (aattaran/deepclaude) - 1,347⭐ (05-06), Claude Code backend-swap proxy (DeepSeek 17x cheaper). 443-line proxy, thinking block stripping, live backend switch. Deep read done. Revisit 05-13
- [ ] Track: deepsec (vercel-labs/deepsec) - 1,777⭐ (05-08 PM), +1% incremental. Active. Revisit 05-15
- [x] Track: mnem (Uranid/mnem) - 17⭐ (05-04). **Dropped** 05-05 — single author, low traction

- [ ] Observe: agent eval/testing space - still underdeveloped. Top: Margin-Lab/evals 59⭐ (stalled 04-24), Calibre-Labs/reforge-ai-evals 42⭐ (active). No breakout. Revisit 05-15
- [ ] Track: reversa (sandeco/reversa) - 707⭐ (05-08 PM). v1.2.31-33 UI polish, no arch changes. Growth decelerating (+0.7%). Revisit 05-15
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

- [ ] Track: thClaws - 848⭐ (05-08, +5%), v0.8.4. Minor patches only since /goal deep read. Revisit 05-15
- [ ] Track: garden-skills - 2,396⭐ (05-06, +319 in 3d), multi-skill collection (ConardLi). Only 4 skills, brand-driven growth. Revisit 05-13
- [ ] Track: microsoft/apm - 2,290⭐ (05-08, was 2,232, +2.6%). v0.12.4 released. Triage-panel rewrite: search_issues replaces broken LLM pagination (DIFC filter + hallucination RCA). Governance bypass fix. Very active (13 PRs in 2 days). Revisit 05-14
- [x] Track: OmniAgent - 576→733⭐ but no commits since 04-19. Star farming signal. **Dropped** 05-04
- [x] Deep read: brain - git event log, bitemporal, 6-layer, authority model, secret prefilter. wiki/projects/brain-git-memory.md (04-29)
- [x] 应用: beliefs-candidates 加 `source:` authority field(human 2×/self 3× 差异化毕业门槛)- from brain authority model (04-29)
- [x] 应用: pre-commit secret scanning hooks installed on workspace + wiki repos - from brain prevention>detection pattern (04-29)
- [x] Track: hermes-labyrinth - 249⭐ (05-04), polish phase, slowing. Revisit 05-09 **Dropped** 05-06 — slowing, deep read already done
- [ ] Experiment: try docs-first contribution strategy on 1 new repo (inspired by iris-clawd study 04-30)

- [ ] Track: mizchi/skills - 144⭐ (05-06), steady growth, practical skills. Revisit 05-13
- [x] Track: 99xAgency/GodModeSkill - 199⭐ (05-05), no commits since 04-28 (7 days). **Dropped** — stalled
- [ ] Track: Beever Atlas (Beever-AI/beever-atlas) - 270⭐ (05-08 PM), +10% growth. Active dev. Revisit 05-15
- [x] Track: ast-outline (aeroxy/ast-outline) - 140⭐ (05-08, +22%), **v1.1.0**: incremental rebuild with tombstones, scope filters, compaction. Production maturity signal. Revisit 05-14


## hermes-agent#17416 CI Failures (2026-04-30)
- **Tests failing**: Circuit breaker changes break MCP structured content tests (`test_mcp_structured_content.py`) - circuit breaker fires during test mocks
- **Attribution check**: Need to add `kagura.agent.ai@gmail.com` → `kagura-agent` mapping to `scripts/release.py` AUTHOR_MAP
- **Also**: `test_session_resume_returns_hydrated_messages` and `test_session.py` import error (may be upstream)
- **Action**: Fix in next workloop session
- [x] Track: spawn-agent (millionco/spawn-agent) - 142⭐ (05-05). **Dropped** 05-05 — 9 days no commits
- [ ] Track: cursor/cookbook - 3,679⭐ (05-08 PM). No commits since 05-01. Organic/viral growth (+7.7%) without new content. Dev stalled. Revisit 05-15
- [ ] Security: APIMitmHack (ez-lbz/APIMitmHack) - 43⭐ (04-30), malicious proxy targeting openclaw/claudecode/opencode via response injection. Monitor
- [x] Track: oh-my-kimichan - 12⭐ (05-01). **Dropped** 05-05 — low traction
- [ ] Track: chromex (GENEXIS-AI/chromex) - 935⭐ (05-08 PM), v0.1.5. +12% growth on bug fixes only. Strong demand signal. Revisit 05-15
- [x] Track: codex-plusplus - 937⭐ (05-06, +385!), v0.1.3 stable. Explosive growth. Revisit 05-10 (consider drop — brand-riding, not architecturally interesting) **Dropped** 05-06 — brand-riding, not architecturally interesting
- [x] Deep read: tiangolo/library-skills - 166⭐ (05-01), library-embedded agent skills via symlink. FastAPI already ships skills. wiki/projects/library-skills.md
- [x] Track: tiangolo/library-skills - 442⭐ (05-06), v0.0.5 stable, no commits since 05-01. **Dropped** 05-06 — stale, no development activity

- [x] Track: SeeleAI/Thoth - 39⭐ (05-02), dashboard-first orchestration runtime. Planning-execution separation + plateau detection. Revisit 05-09 **Dropped** 05-06 — 40⭐, slow, not aligned

- [ ] Track: memU (NevaMind-AI/memU) - 13,520⭐ (05-04), deep read done. "Memory as File System" for 24/7 agents. Revisit 05-18 for v1.6.0
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
- [ ] Track: photo-agents (jmerelnyc) - 184⭐ (05-07), 3.6× growth. Commercial (API key gated). Vision-grounded layered memory. Revisit 05-14
- [ ] Track: master-skill (voidborne-d) - 33⭐ (05-06), industry distillation into agent skills. Meta-skill concept. Revisit 05-13
- [x] Track: aide (hibbault) - 11⭐ (05-06), recursive self-improving agent in own source code. 3-tier memory budget. Revisit 05-13 **Dropped** 05-06 — low traction (<50⭐), too new to justify slot
- [ ] **预 clone 大 repo**: eliza (648MB) 需要在非高峰时段或通过 VPN 提前 clone，否则 workloop 完全浪费。考虑在 heartbeat 里检查 gogetajob DB 中 repo size 并自动预 clone（到期 2026-05-13）
- [ ] **gogetajob: 竞争 PR 预筛**: 当前选题效率低（15 issues 查 15 次 gh pr list）。考虑让 gogetajob feed 同时输出竞争 PR 数量（到期 2026-05-13）
- [ ] Track: paragents (FrankHui/paragents) - 112⭐ (05-07), preflight conflict detection. Single push 04-30. Watch for revival. Revisit 05-14
- [ ] Track: oh-my-kimi (dmae97) - 56⭐ (05-07), Kimi Code CLI multi-agent harness. Non-Claude ecosystem data point. Revisit 05-14
- [ ] Track: speca (NyxFoundation/speca) - 332⭐ (05-07), spec-to-checklist agentic auditing. Python, MIT, actively pushed. Revisit 05-14
- [ ] Track: agent-harness-kit (enmanuelmag) - 124⭐ (05-08), MCP multi-agent harness with Lead/Explorer/Builder/Reviewer pipeline + SQLite state. Atomic task claiming. Revisit 05-15
