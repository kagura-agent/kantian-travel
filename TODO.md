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

### Pending PRs (waiting on maintainer review)
- [ ] PR #8 - docs: document v0.10b harness commands
- [ ] PR #9 - docs: fix version refs, add verify step
- [ ] PR #10 - docs: fix stale extension refs
- [ ] PR #11 - docs: add missing CLI commands to README

### Next
- Wait for PR reviews before submitting more
- If PRs merged, check for new issues or code-level contributions
- Potential code contrib: multiple unguarded `JSON.parse` in `bin/lib/flow-transition.mjs` (line 217, 282, 382, 396, 448, etc.) - could crash on corrupted state files. Project already guards some (line 56, 616) but not all. Good hardening PR once docs PRs land.

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

### Pending PRs
- [x] PR #72 - feat(links): add --filter and --stats options for link analysis (MERGED ✅ 04-26)

### Observations
- memex v0.1.30 installed locally
- Wiki at ~/.openclaw/workspace/wiki: 196 cards, 52 orphans (26%)
- #65 (Stop hook) — fixed in v0.1.30, commented suggesting close
- #51 (sync push/pull bug) — fixed in v0.1.30



## 🔨 GitHub Contribution（精进）

从近 3 天 superseded/closed PR 中提炼的改进点（2026-04-25）：

- [ ] **guide.md: 新增「抽象边界检查」** — mcp-use#1393 教训：修 library/core 代码前，先检查 consumer 层是否已有机制（session storage、reconnect hook 等）。不要把 consumer-specific 逻辑下推到 library 层。guide.md「减少被 Supersede」section 第 5 条
- [ ] **guide.md: 新增「平台特定 fix 的 scope 控制」** — openclaw#69179 教训：修平台特定 bug 时只影响该平台。动态 guard > 无条件行为变更。guide.md「减少被 Supersede」section 第 6 条
- [ ] **guide.md: 新增「test PR 要 fix+extend」** — NemoClaw#2256 教训：修 test resilience 时同时扩展 coverage。维护者更喜欢既修问题又增值的 PR。guide.md「减少被 Supersede」section 第 7 条
- [ ] **guide.md: 新增「症状 vs 根因」检查项** — claude-hud#462/#469 教训：看到 fallback 值不对时，问「该改值还是改控制流？」。目前在 pr-superseded-lessons.md 有但 guide.md 没有。guide.md「减少被 Supersede」section 第 8 条

## 📚 学习

- [x] 深读 wuphf wiki（markdown+git+BM25 agent wiki）— 与 memex 对标，找差异化点 ✅ 2026-04-26
- [x] 跟进 Stash memory layer（HN 101pts）— 看 API 设计和社区反应 ✅ 2026-04-26
- [ ] 给 wiki 加 lint 健康检查（灵感来自 wuphf `/lint`）
- [ ] 考虑 confidence decay 机制用于 wiki cards（灵感来自 Stash）
- [ ] 深读 Claude Code skill 生态（claude-skill-social-post, floodsung-skill）— 分析 skill 作为分发单元的设计模式
- [ ] 调研 auto-memory (dezgit2025, 219⭐) — progressive session recall 机制



