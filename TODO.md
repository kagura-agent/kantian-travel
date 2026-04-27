# TODO

## NemoClaw (NVIDIA/NemoClaw)

### PR #2050 - fix(cli): add nemoclaw recover command
- [x] Rebase onto latest main (77 commits behind)
- [x] Fix indent regression in nemoclaw.ts
- [x] Add temp dir cleanup in tests
- [ ] Add proper typing to test file
- Reviewer: jyaunches - thorough review, positive tone
- Status: rebased + fixes pushed (04-25 12:21), waiting re-review

## OPC (iamtouchskyer/opc)

### Done (04-27)
- [x] PR #9, #10, #11 — merged ✅
- [x] PR #8 — closed (superseded by #11)

### Next
- [ ] Code contrib: multiple unguarded `JSON.parse` in `bin/lib/flow-transition.mjs` (line 217, 282, 382, 396, 448, etc.) — good hardening PR now that docs PRs landed

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
- [ ] PR #76 — `doctor --verbose` flag to show broken link & orphan details (submitted 04-27)

### Observations
- memex v0.1.30 installed locally (synced with upstream 1310ec7)
- Wiki at ~/.openclaw/workspace/wiki: 201 cards (480 files), 51 orphans (25%), 247 broken links
- New upstream features: `doctor` run-all (PR #74), `links --filter/--stats` (PR #72)



## 🔨 GitHub Contribution（精进）

从近 3 天 superseded/closed PR 中提炼的改进点（2026-04-25）：

- [ ] **guide.md: 新增「抽象边界检查」** — mcp-use#1393 教训：修 library/core 代码前，先检查 consumer 层是否已有机制（session storage、reconnect hook 等）。不要把 consumer-specific 逻辑下推到 library 层。guide.md「减少被 Supersede」section 第 5 条
- [ ] **guide.md: 新增「平台特定 fix 的 scope 控制」** — openclaw#69179 教训：修平台特定 bug 时只影响该平台。动态 guard > 无条件行为变更。guide.md「减少被 Supersede」section 第 6 条
- [ ] **guide.md: 新增「test PR 要 fix+extend」** — NemoClaw#2256 教训：修 test resilience 时同时扩展 coverage。维护者更喜欢既修问题又增值的 PR。guide.md「减少被 Supersede」section 第 7 条

## 📚 学习

- [x] 给 wiki 加 lint 健康检查（灵感来自 wuphf `/lint`）→ 2026-04-27 wiki-lint.py 假阳性修复 + frontmatter/link-density checks
- [x] STSS 贡献：提交 chain-tracer 单元测试 PR（敲门砖，评估 maintainer 响应）→ PR #2 submitted 04-26
- [x] STSS 贡献：开 issue 问 LICENSE（MIT/Apache-2.0）→ Issue #3 opened 04-27
- [x] STSS 贡献：address PR #2 CodeRabbit review（afterAll guard, circular test, synthetic findings）→ pushed 04-27
- [ ] Fix: GoGetAJob audit.ts empty catches → log warning + mark "unknown"（from self-audit）
- [ ] Fix: GoGetAJob submit.ts 3-level try/catch → simplify to single ahead-count check（from self-audit）
- [ ] Fix: FlowForge start() → add warning log when auto-closing stale instance（from self-audit）
- [ ] Deep read: wanman.ai hosted 版的 skill self-evolution 和 db9 brain adapter（从 OSS 看不到完整实现）
- [ ] 应用: 评估 idle_cached 模式能否引入 OpenClaw ACP（session resume between triggers）



