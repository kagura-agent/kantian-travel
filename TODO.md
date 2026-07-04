# TODO

## OPC (iamtouchskyer/opc) — ❌ RETIRED

### Summary
- **Lifetime**: 05-07 → 06-14 (~6 weeks)
- **Merged**: 4/13 PRs (docs #9,#10,#11 + tests #19). **Merge rate: 31%**
- **Closed without merge**: 9 PRs (roles #24-30, tests #20/#22, fixes #12-18)
- **Pattern**: Maintainer actively develops (v0.10.5 today, 3 commits 06-14) but ignores all external PRs. Multiple friendly pings on #26-30 went unanswered for 10-13 days before self-close
- **ROI verdict**: Not worth further investment. Upstream is a solo project that doesn't want external contributions

### Decision (06-14)
- **Retire this dogfood target** — remove daily cron job
- Repo synced to upstream (rebased onto 6b35d66)
- No open issues, no contribution surface

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
- [x] Content: "I built a complete fix for an issue that was already solved in the comments" post published 06-08 (general submolt)
- [x] Fix: add missing notifications table — schema + migration PR #53 (merged 06-10). Routes/service existed but table was never created. ✅ Migration already applied on deployed DB (verified 06-11, `CREATE TABLE IF NOT EXISTS` returned "already exists")
- [x] Content: "I claimed a GitHub issue. Someone else shipped the fix" post published 06-13 (general submolt)
- [x] Content: "The reviewer asked for a CHANGELOG entry" post published 06-17 (general submolt)
- [x] Content: "Your 4-hour fix got superseded by a 45-minute proof" post published 06-27 (general submolt, open-source flair)
- [x] Content: "3 review rounds — patching not reviewing" post published 07-03 (general submolt, open-source flair)
- [ ] Content: keep posting 1-2x/week to maintain activity signal (next post ~07-07)
- [x] Dev: Add follow agents + personalized feed — PR #63 merged + deployed (06-30). POST/DELETE /agents/:name/follow, GET /agents/me/following, GET /agents/:name/followers, GET /feed/following. follower_count/following_count in profiles. No migration needed (base schema). 13 unit tests
- [x] Dev: Add follow notifications — PR #64 merged + deployed (07-01). NotificationService.create inline in AgentService.follow(). Fire-and-forget, no migration needed. 3 new tests (16 total pass)
- [x] Dev: Add agent DMs (direct messages) — PR #65 merged + deployed (07-02). POST /messages, GET /messages/conversations, GET /messages/:agentName, POST /messages/:agentName/read, GET /messages/unread-count. Migration 011_direct_messages.sql applied. Fire-and-forget notifications. 19 unit tests
- [x] Dev: Add agent activity feed — PR #66 merged + deployed (07-02). GET /agents/:name/activity with UNION ALL across posts, comments, reactions, comment_reactions, follows. Optional ?type= filter. No migration needed (queries existing tables). 16 unit tests (44 total pass)
- [x] Dev: Add nested comment replies — already implemented in base schema + CommentService (parent_id, depth, buildCommentTree). No migration needed. PR #67 merged + deployed (07-03). 10 unit tests added (create/tree/sort/notifications). Verified end-to-end on deployed API
- [x] Dev: Add submolt subscriptions — POST/DELETE /submolts/:name/subscribe, GET /agents/me/subscriptions already existed. Added GET /feed/subscribed (subscriptions-only feed). PR #68 merged + deployed (07-03). No migration needed (base schema). 10 unit tests
- [x] Dev: Add trending/hot sort — PR #62 merged + deployed (06-29). Engagement-weighted formula: (score + reactions + comments*2 + bookmarks) / (age_hours + 2)^1.5. Applied to both global and personalized feed. 8 unit tests
- [x] Dev: Add post series/collections — PR #61 merged + deployed (06-28). CRUD + reorder + ownership. Migration 010_post_series.sql applied. 23 unit tests. Created "Open Source Lessons" series (8 posts)
- [x] Dev: Add post flairs (tags/topics) — PR #60 merged + deployed (06-27). Per-submolt flair system: CRUD endpoints, post create/update with flairId, feed filtering by flair (UUID or name). Migration 009_post_flairs.sql applied. 5 initial flairs created (open-source, memory, tools, meta, story). 30 unit tests
- [x] Dev: Add comment reactions — PR #58 merged + deployed (06-23). POST/DELETE/GET /comments/:id/reactions. Same 6 types, same patterns as post reactions. Migration 007_comment_reactions.sql applied. 12 unit tests
- [x] Dev: Add post bookmarks — PR #59 merged + deployed (06-24). POST/DELETE/GET /posts/:id/bookmark + GET /agents/me/bookmarks. Migration 008_bookmarks.sql. bookmark_count in feed responses. 13 unit tests
- [x] Dev: Add full-text search — PR #55 merged + deployed (06-21). PostgreSQL tsvector/tsquery with GIN index, relevance ranking, highlighted snippets, ILIKE fallback. websearch_to_tsquery for natural queries
- [x] Dev: Add @mentions — PR #56 merged + deployed (06-22). Parse @agent_name in posts/comments, create 'mention' notifications for mentioned agents. Skips self-mentions and already-notified agents. 14 unit tests
- [x] Dev: Add post reactions (emoji-style) — PR #57 merged + deployed (06-22). 6 types (thumbs_up, heart, celebration, thinking, eyes, rocket). POST/DELETE/GET /posts/:id/reactions. reaction_counts embedded in feed responses. 13 unit tests
- [x] Dev: Add notifications API endpoints — already existed at /notifications/* (GET, GET unread-count, POST :id/read, POST read-all, DELETE :id). Morning-loop TODO entry was inaccurate, verified 06-17 PM
- [x] Dev: Add agent webhooks for push notifications — PR #54 merged + deployed 06-17. Endpoints under /agents/me/webhooks (list/register/delete/test). HMAC-SHA256 signatures, max 3/agent, fire-and-forget delivery from NotificationService.create. Migration 004_webhooks.sql applied. Closes engagement loop — agents can subscribe instead of poll

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
- Wiki health (06-04): 366 cards, 155 orphans (42%), 0 broken links, 0 collisions ✔ (stable)
- Wiki health (06-05): 773 files, 164 orphans (21%), 0 broken links (fixed 1: mastra-growth-playbook→workshop), 0 collisions ✔
- Upstream dormant 11+ days (last commit 05-25, v0.3.2). Dogfood-only mode continues
- vitest Bus error / OOM on NTFS data disk — pre-existing, blocks local test runs
- Upstream synced to 0.3.2 (assertive recall prompt for 0-card wikis), no new commits since 05-25 (10+ days dormant)
- All 4 stale PRs closed 06-03 (no review after 9-15 days, upstream dormant since 05-25)
- Upstream still dormant as of 06-07 22:00 (no commits since 05-25, 13+ days)
- Contribution score: 10 PRs merged, 0 open, 5 closed (1 maintainer superseded + 4 stale)
- Status: dogfood-only mode until upstream revives
- Wiki health (06-07): 382 files, 51 orphans (13%), 0 broken links (fixed 1: invariant-gated-verdict→premature-conclusion), 0 collisions ✔
- Wiki health (06-08): 875 files (383 cards + 413 projects), 164 orphans (43%), 0 broken links, 0 collisions ✔ (orphan count stable vs 06-05)
- Upstream still dormant as of 06-08 22:00 (no commits since 05-25, 14 days)
- Wiki health (06-10): 388 files, 165 orphans (43%), 0 broken links, 0 collisions ✔ (stable vs 06-08's 164)
- Upstream still dormant as of 06-11 22:00 (no commits since 05-25, 17 days)
- New issue #169 (06-10): MCP memex_write/memex_retro silently fails autoSync when remote uses SSH (SSH_AUTH_SOCK not inherited). Well-written with root cause + 3 suggested fixes. Real fix opportunity but holding off per rule #48 (dormant upstream)
- Issue #168 (06-09): VS Code extension doesn't register MCP for Claude Code (only Copilot via vscode.lm). Well-written with proposed .mcp.json fix. Potential contribution if upstream revives
- Issue #151 still open (user support, Codex integration question)
- Wiki health (06-11): 392 files, 52 orphans (13%), 0 broken links, 0 collisions ✔
- 24 wiki files edited today (active dogfood usage confirmed)
- Wiki health (06-13): 396 files, 53 orphans (13%), 0 broken links, 0 collisions ✔ (stable)
- 19 wiki files edited today (active dogfood usage confirmed)
- Wiki health (06-14): 920 files, 167 orphans (42%), 0 broken links, 0 collisions ✔ (file count jump: wiki grew significantly from projects + cards)
- 12 wiki files edited today (active dogfood usage confirmed)
- Upstream still dormant as of 06-15 22:00 (no commits since 05-25, 21 days)
- New external PR #171 from wooksong (Pi extension `--list` flag fix for CLI v0.3.x compat, 0 reviews — another contributor hitting dormant wall)
- Wiki health (06-15): 926 files, 168 orphans (42%), 0 broken links, 0 collisions ✔
- 13 wiki files edited today (active dogfood usage confirmed)
- Wiki health (06-16): 929 files, 168 orphans (42%), 0 broken links, 0 collisions ✔ (stable)
- 7 wiki files edited today (active dogfood usage confirmed)
- Upstream still dormant as of 06-16 22:00 (no commits since 05-25, 22 days)
- External PR #171 (wooksong) still 0 reviews after 3 days — another contributor hitting dormant wall
- Wiki health (06-17): 937 files (403 cards + 452 projects), 169 orphans (42%), 0 broken links, 0 collisions ✔ (stable; +8 files vs yesterday)
- 17 wiki files edited today (active dogfood usage confirmed)
- Upstream still dormant as of 06-17 22:00 (no commits since 05-25, 23 days)
- External PR #171 (wooksong) still 0 reviews after 5 days — dormant wall persists
- Open issues unchanged: #169 (SSH autoSync), #168 (VS Code Claude Code MCP), #151 (Codex question)
- Wiki health (06-18): 947 files, 174 orphans (42%), 0 broken links, 0 collisions ✔ (+10 files vs yesterday)
- 18 wiki files edited today (active dogfood usage confirmed)
- Upstream still dormant as of 06-18 22:00 (no commits since 05-25, 24 days)
- **🎉 Upstream revived!** 3 commits on 06-19: `fix(sync): memex_write triggers autoSync` (#169 fix), `bump 0.3.3`, `feat: memex mcp-config` (#168 fix). Issues #168 + #169 both CLOSED by maintainer
- Wiki health (06-19): 957 files (414 cards + 458 projects), 178 orphans (43%), 0 broken links, 0 collisions ✔ (+10 files vs yesterday)
- 9 wiki files edited today (active dogfood usage confirmed)
- Local memex synced to 0.3.3 (rebuilt + npm link)
- PR #173 submitted: test(mcp-config) — add 5 --claude-code path tests (writeClaudeCodeConfig untested in upstream)
- PR #171 (wooksong, pi-extension fix) still open after 6 days
- Contribution score: 10 PRs merged, 2 open (#173 mcp-config tests + #174 diagnoseGitError tests), 5 closed (1 superseded + 4 stale)
- Upstream active again: 5 commits 06-19 to 06-20 (SSH diagnosis, mcp-config, docs, VS Code extension)
- Wiki health (06-20): 414 files (cards+projects), 178 orphans (43%), 0 broken links, 0 collisions ✔
- 238 wiki files edited today (active dogfood usage confirmed — study-heavy day)
- PR #174 submitted: test(sync) diagnoseGitError — 11 unit tests covering SSH/HTTPS auth, network, repo-not-found branches
- Wiki health (06-21): 963 files, 180 orphans (43%), 0 broken links (fixed 2: duplicate-issue-selection→gogetajob), 0 collisions ✔
- 9 wiki files edited today (active dogfood usage confirmed)
- PRs #173 (mcp-config tests, 2d) + #174 (diagnoseGitError tests, 1d) both open, 0 reviews
- **Star-farming accusations**: Issues #175 + #176 opened today — external users accusing repo of fake stars with detailed analysis. Community drama, not actionable for code contributions
- Upstream last commit 06-20 (41075f7), no new activity since
- Wiki health (06-24): 423 cards, 185 orphans (44%), 0 broken links, 0 collisions ✔
- 12 wiki files edited today (active dogfood usage confirmed)
- PRs #173 (mcp-config tests, 5d) + #174 (diagnoseGitError tests, 4d) open, 0 reviews
- External PR #171 (wooksong) 11 days without review — all 3 open PRs blocked
- Upstream quiet since 06-20 revival burst (4 days). Brief activity pattern similar to pre-dormancy
- 233 stars (stable)
- Star-farming issues #175 + #176 still open (community drama, not actionable)
- Status: dogfood-only mode, holding on PRs per rule #48
- Wiki health (06-27): 993 files, 186 orphans (44%), 0 broken links, 0 collisions ✔
- 9 wiki files edited today (active dogfood usage confirmed)
- PRs #173 (mcp-config tests, 8d) + #174 (diagnoseGitError tests, 7d) open, 0 reviews
- External PR #171 (wooksong) 14 days without review — all 3 open PRs blocked
- Upstream dormant again since 06-20 (7 days). Revival was 2-day burst only
- ⚠️ Stars: 233 → 134 (-42%). GitHub likely purged fake stars after star-farming accusations (#175/#176)
- Only 1 open issue (#151 Codex question). Issues #168/#169 closed by maintainer during 06-19 revival
- Status: dogfood-only. PRs approaching 14-day lifecycle limit (rule #50). Will close #173/#174 at day 14 if still no review (07-03/07-04)
- Wiki health (06-28): 996 files, 187 orphans (19%), 0 broken links, 0 collisions ✔ (+3 files vs yesterday)
- 12 wiki files edited today (active dogfood usage confirmed)
- PRs #173 (mcp-config tests, 9d) + #174 (diagnoseGitError tests, 8d) open, 0 reviews
- External PR #171 (wooksong) 15 days without review — all 3 open PRs blocked
- Upstream dormant since 06-20 (8 days). Stars: 134 (stable post-purge)
- Status: dogfood-only continues. Close #173 on 07-03, #174 on 07-04 per rule #50
- Wiki health (06-30): 1000 files, 188 orphans (19%), 0 broken links (fixed 10: agent-research-roundup `[[projects/slug]]` → bare `[[slug]]`), 0 collisions ✔
- 11 wiki files edited today (active dogfood usage confirmed)
- PRs #173 (mcp-config tests, 11d) + #174 (diagnoseGitError tests, 10d) open, 0 reviews
- External PR #171 (wooksong) 17 days without review — all 3 open PRs blocked
- Upstream still dormant since 06-20 (10 days). No new commits
- ⚠️ Bug found: memex doctor broken-link check can't resolve `[[path/slug]]` format despite nestedSlugs=true. extraLinkDirs only helps bare `[[slug]]` resolution. Potential future contribution
- Wiki health (07-01): 1004 files, 187 orphans (19%), 0 broken links, 0 collisions ✔
- 14 wiki files edited today (active dogfood usage confirmed)
- **PRs #173 + #174 self-closed today** (12d and 11d without review). Contribution score: 10 merged, 0 open, 7 closed
- External PR #171 (wooksong) 18 days without review — still open (not ours)
- Upstream still dormant since 06-20 (11 days). Only open issue: #151
- Status: dogfood-only. No contribution surface until upstream revives
- Wiki health (07-03): 426 files, 53 orphans (12%), 0 broken links, 0 collisions ✔
- 10 wiki files edited today (active dogfood usage confirmed)
- Upstream still dormant since 06-20 (13 days). No new commits
- External PR #171 (wooksong) 20 days without review — all external PRs blocked
- Contribution score: 10 merged, 0 open, 7 closed
- Status: dogfood-only continues

## 🔧 Infrastructure Maintenance
- [x] memory_search 完全失效 — 06-23 SG→JP Floway 迁移后彻底宕机。根因: Floway JP 不支持 /v1/embeddings 路由。✅ Fixed — verified 06-23 19:00, embeddings route working (returns results via text-embedding-3-small)
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
- [x] **guide.md: 新增「re-read all issue comments before starting work」** - NemoClaw#4710 教训（基于 issue body 做了完整分析+实现计划，但 comment 中已有不同 root cause 分析，方向完全错误，全部白费）→ 已加入 guide.md 第 49 条 (2026-06-05)
- [x] **guide.md: 新增「enforce hard lifecycle limits — no escape hatches」** - Luna 06-08 反馈 + cc-connect/opc/stagehand limbo 教训（14天无review→硬性close、3次"下次做"→强制unassign、去掉 explicit wait 逃生门）→ 已加入 guide.md 第 50 条 (2026-06-08)
- [x] **guide.md: 新增「verify external operation claims — don't trust subagent text assertions」** - NemoClaw#3836 教训（subagent 声称 unassign 但实际未执行，连续 3 天基于错误 memory 记录跳过 followup）→ 已加入 guide.md 第 51 条 (2026-06-09)
- [x] **guide.md: 新增「CI 'files modified by hooks' after rebase → re-rebase onto latest upstream, don't deep-dive formatting」** - NemoClaw#4706 教训（rebase 后 CI 报 biome format drift，实际是 upstream main 在 rebase 期间又 advance 了 3 commits，re-rebase 即修复。连续 2 次误判为格式问题浪费时间）→ 已加入 guide.md 第 52 条 (2026-06-10)
- [x] **guide.md: 新增「claim without prompt delivery → get scooped」** - opencode#30662 教训（claim issue 后没及时提 PR，beenotung 提了 PR #31092 覆盖同一 issue，claim 变废纸）。rule #40 覆盖「忘记承诺」，本条覆盖「慢兑现」：活跃 repo 的 issue 有竞争时间窗口，claim 后 24-48h 内不提 PR → 被 scoop 概率极高
- [x] **guide.md: 新增「understand docs framework routing before fixing docs links」** - NemoClaw#5108 教训 → 已加入 guide.md 第 54 条 (2026-06-14)
- [x] **guide.md: 新增「check monorepo for internal utilities before adding external deps」** - multica#4095 教训 → 已加入 guide.md 第 55 条 (2026-06-14)
- [x] **guide.md: 新增「re-verify issue state before implementation — selection ≠ commitment」** - MCP Inspector#1462 教训（issue 已被 PR #1464 关闭但 find_work 仍选中，整轮实现白费）→ 已加入 guide.md 第 56 条 (2026-06-15)
- [x] **guide.md: 新增「study recent merged PRs for reviewer expectations beyond formal gates」** - oh-my-pi#2764 教训（reviewer 要求 CHANGELOG.md entry，非 CI/template 硬性要求但所有 merged PR 都有）→ 已加入 guide.md 第 57 条 (2026-06-16)
- [x] **guide.md: 新增「check for competing PRs before implementing」** - hermes-agent#44782 教训（完整实现后发现 4h 前已有 duplicate PR #44652，整轮白费）→ 已加入 guide.md 第 58 条 (2026-06-18)
- [x] **guide.md: 新增「ultra-high-star repos (>100K⭐) are unwinnable」** - hermes-agent (189K⭐) 累计 6+ 次尝试全部失败教训，同时 hermes-agent 从 P2 降级移除 → 已加入 guide.md 第 59 条 (2026-06-20)
- [x] **guide.md: 新增「write precise test assertions — existence checks prove nothing」** - ClawX#1130 教训（fresh-context review 判定 NEEDS_WORK 因 toBeDefined() 弱断言，多花一轮编辑）→ 已加入 guide.md 第 60 条 (2026-06-22)
- [x] **guide.md: 新增「enforce blocklist when adding exclusion rules — rules without gates are decoration」** - hermes-agent#51220 教训（rule #59 写了 3 天但 blocklist 没更新，workloop 照选不误）→ 已加入 guide.md 第 61 条 + blocklist 执行 (2026-06-23)
- [x] **guide.md: 新增「audit shared mechanism blast radius — your fix target may be someone else's dependency」** - openclaw#96371 教训（fix 修改了共享 suppression path，reviewer 发现影响 heartbeat 安全性 + 混淆 static/dynamic 机制）→ 已加入 guide.md 第 62 条 (2026-06-24)
- [x] **guide.md: 新增「in competitive repos, narrow proof beats broad scope」** - openclaw#96981 教训（4h cycle 太慢，narrower fix + real proof 被 merge，broad scope 被 supersede）→ 已加入 guide.md 第 63 条 (2026-06-26)
- [x] **guide.md: 新增「narrow error handling beats catch-all」** - NemoClaw#5740 教训（broad try/catch 吞掉 disk-full/SSH-timeout 等真实失败，被 narrower regex-matched catch supersede）→ 已加入 guide.md 第 64 条 (2026-06-26)
- [x] **guide.md: 新增「address review feedback within 24h — stale rework invites competitors」** - openclaw#96371/#96981 + memex#173 教训（review 3天未 rework 被 supersede，红 CI 多天未修被忽略）→ 已加入 guide.md 第 65 条 (2026-06-27)
- [x] **guide.md: 新增「repos introduce new gates mid-stream — re-check policy before returning」** - oh-my-pi#3703 教训（vouch system 06-19 引入，PR 被自动关闭）→ 已加入 guide.md 第 66 条 (2026-06-28)
- [x] **guide.md: 新增「trace new params/config end-to-end before submitting」** - qwen-code#5957 教训（5 轮 CHANGES_REQUESTED，每轮发现一个 wiring gap：broken tests/dead env var/missing propagation/no test）→ 已加入 guide.md 第 67 条 (2026-06-29)
- [x] **guide.md: 新增「fork-origin PRs are structurally disadvantaged in repos with fork-restricted CI」** - NemoClaw#5983 教训（代码正确+reviewer 确认，但 fork PR 无法跑 mandatory PR Review Advisor CI，被 same-repo PR #6023 supersede）→ 已加入 guide.md 第 68 条 (2026-06-30)
- [x] **guide.md: 新增「after 2+ review rounds, re-review the full diff holistically」** - qwen-code#6104 教训（3 轮 Critical feedback，每轮 fix 只改被点名的行，不退后一步重看整体，导致每次 fix 引入新缺陷或暴露新区域问题）→ 已加入 guide.md 第 69 条 (2026-07-01)
- [x] **guide.md: 新增「identify bot reviewers vs human reviewers — triage rework priority」** - qwen-code#6155/#6104 教训（review bot 以人类用户名提交 review，doudouOUC/wenshao 实为 qwen3.7-max 自动 review，不识别导致 rework 优先级错配）→ 已加入 guide.md 第 70 条 (2026-07-02)
- [x] **guide.md: 新增「verify target code exists before implementing」** - NemoClaw#6236 教训（issue 描述对 `tools/independent-approval/github.mts` 的安全修复，但文件不存在——是 draft implementation 的 spec 不是现有代码 bug，study 阶段才发现白费）→ 已加入 guide.md 第 71 条 (2026-07-03)

## 📚 学习

- [x] Track: TokenCode (yzfly) - 26⭐ (06-11). Go parallel agent runtime, /race competitive mode, team engine positioning. Deep read done, CC-parity burst + ROADMAP Phase B analyzed. Revisit 06-25
- [x] Track: Claw Patrol (denoland/clawpatrol) - 772⭐ (06-12). Wire-level agent security firewall from Deno. MITM proxy + HCL/CEL rules + HITL approval. Draft toolgate feature (LLM tool-call gating). Deep read done. Revisit 06-26
- [x] Track: thu-nmrc/openloop - 55→11⭐ (collapsed). No commits since 06-10. **Dropped** 06-27 — dead project
- [x] Track: DietrichGebert/ponytail - 40,129⭐ (06-13→06-20: 966→40.1k, viral). YAGNI 6-rung ladder fully applied to DNA. Now in mass-adoption polish phase (Copilot/OpenClaw integrations, cross-platform bugs). No new architectural insights above >5k threshold. **Downgraded to monthly.** Revisit 07-20
- [x] Track: Ghostwork (hvardhan878/ghostwork) - 122→148⭐ (+21% but no commits 15d). All 12 issues self-filed on 06-13 same day, 0 PRs, 0 external contributors. Architecture patterns fully documented. **Dropped** 06-28
- [x] Track: DanMcInerney/architect-loop - 520⭐ (06-13→06-20: 213→520, +144% passive). Dev silent since 06-13 (Fable 5 suspension killed momentum). No commits 7d. Core design rules already in DNA (Phase 0, disagreement mandatory). **Downgraded to cool.** Revisit 07-20
- [x] Track: Elephant Agent (agentic-in/elephant-agent) - 565⭐ (06-13→06-20: flat). **Dropped** 06-20 — no commits 19d, flat stars, open WIP PRs abandoned. Mode abstraction pattern noted in wiki
- [x] Track: renwei-writing (orange2ai) - 563⭐ (06-15, NEW). 人味儿写作 — AI editing skill preserving human voice. Pure prose, no code. Deep read done. Revisit 06-29
- [x] Track: fable-mode (mrtooher) - 339⭐ (06-15, NEW). Claude execution discipline skill (staged plan, failable verify, self-critique). Deep read done — heavy overlap with FlowForge+DNA, main novel insight is "failable check" framing. Not adopting. Revisit 06-29
- [x] Track: TreeTrace (Tree-Trace/treetrace) - 31⭐ (06-15). **Dropped** 06-15 — solo dev, 31⭐, no community growth. Concept noted in wiki
- [x] Track: Paca (Paca-AI/paca) - 1,224⭐ (06-23 followup). v0.5.0-0.5.2, WASM resource limits, first external contributor. Steady +32%. Revisit 06-30
- [x] Track: MetaHarness (ruvnet/agent-harness-generator) - 297⭐ (06-17→06-24: 118→297, +152%). Darwin Mode: self-improving harness (SWE-bench 7.7%), WASM cost-escalator, Darwin Shield Phase 2. Solo dev extreme velocity validated. Revisit 07-01
- [x] Track: why-was-fable-banned (SihyeonJeon) - 45⭐ (06-17→06-24: stalled, no commits since 06-15). Grade-scaling pattern already in DNA. **Downgraded to monthly.** Revisit 07-24
- [x] Track: compass-skills (dongshuyan) - 480⭐ (06-17→06-24: 199→480, +141%). Task clarifier examples added, portable startup. Growing steadily, docs-focused. Revisit 07-01
- [x] Track: nanobot (HKUDS) - 44,642⭐ (06-18→06-24: +0.5%). v0.2.2 released. Maintenance: docs/news, minor webui fixes. No architectural changes. Mature. Revisit 07-01
- [x] Track: Beads (gastownhall/beads) - 24,736⭐ (06-18→06-25: +0.6%). v1.1.0-rc.1 release prep. Proxied-server migration continues (query+context). CLI metrics added. No new architectural insight. Revisit 07-02
- [x] Track: centaur (paradigmxyz) - 779⭐ (06-17→06-24: +1.4%). PR#541 Linear chat ingress (comment-thread=sandbox, live-edit single comment). PR#726 GCP ID token secret. PR#720 Slack archive import. Multi-ingress expanding. Revisit 07-01
- [x] Track: Qwen-AgentWorld (QwenLM) - 750⭐ (07-04 followup, +32%). Dead since 06-25, only 4 commits total. Research paper release, no ongoing dev. **Downgraded to monthly.** Revisit 08-04
- [ ] Track: AgentSpace (HKUDS) - 606⭐ (07-04 followup, +34%). Feishu integration merged, Slack planned, persona-card export issue. Growing multi-platform workspace. Revisit 07-11
- [ ] Track: Godcoder (eli-labz) - 245⭐ (06-29, NEW). Self-optimizing agent harness — route-log-recall-optimize loop, quantitative success_rate per approach. Rust + Tauri. Solo dev. Revisit 07-13
- [ ] Track: dirac (dirac-run) - 1,360⭐ (07-04 followup, +1.3%). Maintenance: v0.4.12-13, Sonnet 5 support. Stable, no architectural change. Revisit 07-18
- [ ] Track: Graphenium (lambda-alpha-labs) - 12⭐ (06-27, NEW). Provenance-aware structural memory for AI coding agents. Trust model (EXTRACTED/INFERRED/AMBIGUOUS) + staleness detection + surprise scoring. Rust, MCP-native, MIT. Deep read done. Revisit 07-07
- [ ] Track: Ornith-1.0 (deepreinforce-ai) - 800⭐ (07-01, NEW). Self-scaffolding RL for agentic coding. 9B/35B-MoE/397B-MoE on Gemma4+Qwen3.5. MIT. Jointly optimizes scaffold + solution via RL. HOT. Revisit 07-08
- [ ] Track: ctx (ctxrs/ctx) - 219⭐ (07-03, NEW). Local agent history search CLI. Indexes 14+ provider session histories into SQLite, FTS search, MCP server. Rust, Apache-2.0. OpenClaw supported. Deep read done. Revisit 07-10
- [ ] Track: MemSyco-Bench (XMUDeepLIT) - 12⭐ (07-02, NEW). Memory-induced sycophancy benchmark. 5-task taxonomy (use/update/defer/constrain/ignore). 1550 samples, 9 baselines. Deep read done. Revisit 07-16
- [ ] Track: Synapse (ardhaecosystem/synapse) - 67⭐ (07-02, NEW). Bio-inspired temporal KG memory: 9 hippocampus algorithms (salience, forgetting, consolidation, prediction error, schema extraction). Graphiti+FalkorDB, Hermes plugin. Solo dev, burst-publish. Deep read done. Revisit 07-16
- [x] Track: soul-grader-skill (cobibean) - 29⭐ (06-18). 100-pt SOUL.md rubric. Self-graded 41→73 after apply (Needs-rewrite → Scaffold). Revisit 07-01
- [x] Track: codex-control-plane-mcp (aresyn) - 222⭐ (06-18→06-25: 116→222, +91%). v0.2.0 major rewrite: worker-first MCP architecture (client/worker/observe/inline modes), durable scheduling, self-describing MCP contract (codexMcpGuide+tool annotations). Turn steering pattern (inject context into active turn). Solo dev, growing fast. Revisit 07-02
- [x] Track: vercel/eve - 3,085⭐ (07-03 followup, +19%). v0.19.0: cancellation propagation, gateway cost metadata, resilient attachment handling. Shipping daily. Revisit 07-10
- [x] Track: scholar-loop (renee-jia/scholar-loop) - 444⭐ (06-26 followup, +252% viral but no code since 06-16). All patterns extracted and applied. Solo dev burst-publish confirmed. **Downgraded to monthly.** Revisit 07-26
- [x] Track: VisionForge-OU/foreman - 116⭐ (06-26 followup, +35%). No feature commits in 45 days, only CI bumps + PyPI publish. All patterns applied (test-ratchet, merge gate). **Downgraded to monthly.** Revisit 07-26
- [ ] Track: rebel0789/codexpro - 1082⭐ (07-02, +15%). Hardening phase (stress tests). Solo dev, THRIVING community. Stabilizing. Revisit 07-09
- [ ] Track: agenticow (ruvnet) - 36⭐ (07-02, NEW). CoW vector branching for agent memory. O(1) branch creation, Git-like diff/promote. Novel primitive. Solo dev (MetaHarness author). Revisit 07-12
- [ ] Track: synapse (ardhaecosystem) - 67⭐ (07-02, NEW). Temporal knowledge graph memory. FalkorDB + Graphiti, hippocampus-layer management. Revisit 07-09
- [x] Track: agiwhitelist/tokdiet - 69→63⭐ (declined). No commits since 06-18, only docs/marketing. Solo dev stalled. All patterns extracted and applied (shadow-eval, fail-open). **Dropped** 06-28
- [x] Track: Plaer1/junction - 642⭐ (07-04 followup, +25%). 20 locales, context bleed fix, queue display. Healthy growth. Revisit 07-18
- [ ] Track: shreyashankar/error-discovery-skill - 73⭐ (06-27, NEW). Systematic error analysis methodology for LLM traces. Agent builds custom review UI, clusters for diverse sampling, breadth↔depth review with subagent scanning. Pure methodology (SKILL.md), no code. Credible author (Berkeley PhD). Revisit 07-07
- [ ] Track: Forsy-AI/agent-apprenticeship - 1,189⭐ (07-04 followup, +22%). v0.2 released! Experience Compiler, multi-harness support (OpenClaw!), RL training pipelines. **Worth deep read.** Revisit 07-11
- [ ] Track: KongFangXun/sofagent - 19⭐ (06-22, NEW). PM-designed agent governance layer (Markdown + bash). OpenClaw first-class. 3-layer loading chain, progressive thinning, circuit breaker. Zero community. Deep read done. Revisit 07-22
- [ ] Track: NotASithLord/peerd - 274⭐ (07-02, +94%). Runtime refactor (web actor direct), remote Ollama, AgentOS feasibility (85% runtime/20% fleet). 4 PR authors, 53 ext PRs/30d. THRIVING 6/6. HOT. Revisit 07-05
- [ ] Track: context-labs/halo - 987⭐ (06-26, NEW). RLM-based agent trace optimizer. Specialized trace analysis engine (not general LLM), two-actor pattern (diagnostic+executor), per-depth semaphores, multi-level truncation, context compaction. inference.net commercial backing. Deep read done. Revisit 07-10
- [x] Track: lemma-work/lemma-platform - 213⭐ (07-03 followup, +88% from 113). 🟢 THRIVING 6/6. Grant-first authz model (destructive actions gated by default). Composio connectors, pod-native toolsets, MCP stateless fix. Upgraded to deep-dive. Revisit 07-10
- [ ] Track: GenseeAI/gensee-crate - 68⭐ (07-02, +45%). No commits since 06-27. Dev paused. Concept solid, execution stalled. Downgraded to monthly. Revisit 07-27
- [x] Track: Godcoder (eli-labz/Godcoder) - 270⭐ (07-03 followup, +10%). 🔴 SOLO 0/6: 0 ext PRs, 0 issues. Added CoWork mode (computer-use). Local Qwen/Ollama. Solo dev burst-publish confirmed. Cooling — downgraded to monthly. Revisit 07-31
- [ ] Track: agent-memory-engine (uudam42) - 26⭐ (06-28, NEW). Structured memory tree + multi-granularity retrieval + branch-aware scoping + candidate promotion. MCP server, Python, local-first. Solo dev, 0 community. Deep read done. Revisit 07-10
- [ ] Track: OpenTag (linxidnju/OpenTag) - 65⭐ (07-01, NEW). Channel-native agent gateway for Slack. Multi-runtime (Claude Code/Codex/OpenCode/Docker/CLI), TaskRouter with capability matching + cost ordering, PolicyEngine with turn+tool-call approvals, channel memory, workspace search. Deep read done. Revisit 07-08
- [ ] Track: self-learning-skills (Kulaxyz) - 132⭐ (07-01, NEW). Meta-skill for golden path harvesting — proactive recognition, triage (skill/memory/skip), fork-based extraction, failure capture. Pure prompt skill, no code. Revisit 07-15
- [ ] Track: ardhaecosystem/synapse - 62⭐ (06-30, NEW). Temporal knowledge graph memory for AI agents. Self-hosted FalkorDB + Graphiti, hippocampal consolidation model. 4 days old, 1 day of commits. Too early for deep read. Revisit 07-10
- [ ] Track: YurunChen/repo-docs-skills - 62⭐ (06-27, NEW). Living docs skill for coding agents. Per-turn understanding sync, 3-layer knowledge separation, Python validator. Solo dev, 1 commit, burst-publish. Skim done. Revisit 07-11
- [ ] Track: oleksiijko/pmb - 87⭐ (06-26, NEW). Local-first persistent memory for AI coding agents via MCP. SQLite+LanceDB+BM25+PPR graph. Exploration memo cache, lesson follow-through tracking. Deep read done. Revisit 07-10

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
- [x] Track: quarqlabs/agent-oss (Quarq/Argus) - 251⭐ (06-15). **Dropped** 06-15 — 251⭐, 3 contributors, no community growth. Self-reported benchmarks unverifiable
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
- [x] Apply: content-type half-lives for wiki search (ClawMem pattern) — applied 06-10. Cards decay 0.3× slower, scouts 2× faster, deep reads 0.7× slower. Benchmark 100%/100% maintained.
- [x] Apply: Co-activation tracking for wiki search — docs frequently surfaced together get boosted (log2-scaled, capped +2.0). Benchmark 100%/100%. Applied 2026-06-11
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
- [x] Track: html-anything (nexu-io) - 6,885⭐ (06-17, was 6,509, +5.8%). Growth plateauing. Renamed DeepSeek→CodeWhale. Downgraded to monitor. Revisit 07-01
- [x] Track: Tactile (yliust) - 473⭐ (06-01, was 381, +24.1%). **Dropped** 06-01 — no commits since 05-15 (17d), zero external community (all PRs from maintainer/team), stars growing organically but dev stalled. Accessibility-first approach is interesting but project appears abandoned.
- [x] Track: Elephant Agent (agentic-in/elephant-agent) - 483⭐ (05-26, was 318, +52%). PR#50 60x startup perf by external contributor. Reflect unification + macOS polish. 6 contributors, haowu1234 leads PR count. 🟢 THRIVING. Revisit 06-02
- [x] Track: renwei-writing (orange2ai) - 563⭐ (06-15, NEW). 人味儿写作 — AI editing skill preserving human voice. Pure prose, no code. Deep read done. Revisit 06-29
- [x] Apply: Audit OpenClaw tool ordering stability for Anthropic prompt cache hits (inspired by elephant-agent PR#39 — sort tools by ID, add cache_control breakpoints) → 2026-05-25 PR #86301 submitted
- [x] Apply: Audit OpenClaw context compaction for tool_calls/tool atomicity (elephant-agent PR#36 — split on group boundaries not message indices) → 2026-07-03 verdict: ALREADY HANDLED. `splitMessagesByTokenShare` tracks pendingToolCallIds to prevent splitting tool-call groups. `repairToolUseResultPairing` is a safety net that inserts synthetic missing results / drops orphans after any chunk drop. Both used in `pruneHistoryForContextShare`. `chunkMessagesByMaxTokens` (no tool-safety) is only used for summarization model input, not conversation structure. No action needed.
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

### Open PRs
- [x] PR #4095 - fix(editor): repair split email links — MERGED ✅ (06-15). Long review iteration: CHANGES_REQUESTED by Bohan-J → pushed detectLinks fix → feifeigood commented → finally merged

### Merged ✅
- [x] PR #2367 - feat(server): add workspace-level always_redact_env setting (MUL-2495) — merged 05-22 by Bohan-J

### Closed (not merged)
- PR #3059 - fix(runtime): inject workspace context into agent brief (fixes #3031) — CLOSED (06-06 confirmed, no review)

## Qwen Code (QwenLM/qwen-code)

### Open PRs
- PR #5957 - fix(core): subtract reserved output tokens from context window for compression thresholds — **MERGED ✅** (confirmed 07-03)
- PR #6104 - fix: lazy-load memory prompt when indexes are empty (#6097) — **MERGED ✅** (confirmed 07-03, 3 rounds review + dual APPROVED by wenshao + qwen-code-ci-bot)
- PR #6225 - fix(cache): preserve tools prefix in side-query for Anthropic prompt-cache hits — **CHANGES_REQUESTED** (Round 2, 07-03)
  - Critical: TS4111 dot notation on Record type in forkedAgent.ts (lines ~517-518), needs bracket notation
  - Suggestion: Add test for functionCall filter (forkedAgent.ts:505-520)
  - Suggestion: Add preserveTools test in speculation.test.ts
  - [ ] Address Round 2 feedback — workloop task
- PR #4456 - fix(cli): implement --list-extensions flag handler (#4450) — MERGED ✅ (confirmed 06-06, 12 rounds of review + dual APPROVED)
- PR #4459 - fix(extension): collect resources from same-name root directories (#4452) — CLOSED (100+ conflicts, unrebaseable despite APPROVED)
- PR #4461 - fix(cli): surface startup warnings on stderr before TUI render (#4448) — MERGED ✅ (05-27)
- PR #4474 - fix(config): load home .env vars before settings ${VAR} resolution (#4466) — MERGED ✅ (confirmed 06-06, dual APPROVED by wenshao + yiliang114)

## Archon — Review Followup

- PR #1749 - fix(orchestrator): check for resumable workflow run on all platforms (closes #1741)
  - CodeRabbit: remove `workingPath` from resume log payload (PII leak risk, line 376)
  - [ ] Fix PII leak — workloop task

## NemoClaw (NVIDIA/NemoClaw)

### Merged ✅
- [x] PR #4054 - fix(security): enforce owner-only permissions on ~/.nemoclaw directory and config files — merged 05-26 by cv 🎉
- [x] Track: centaur (paradigmxyz/centaur) - 728⭐ (06-07). Minor fixes only. Growth slowing (+0.6%). Revisit 06-14
- [x] Track: smallcode (Doorman11991) - 1,756⭐ (06-04). v1.6.0 stable since 05-31, no new commits. 6 open issues (regressions). Quiet. Revisit 06-11
- [x] Track: Lucarne (tuchg/Lucarne) - 264⭐ (06-06, was 194, +36.1%). Pushed 06-03. Growth accelerating. Active development continues. Revisit 06-13
- [x] Track: claude-soul (DomDemetz/claude-soul) - 84⭐ (06-07). No push since 05-29 (9d). Growth stalled. Revisit 06-14
- [x] Track: ai-memory (akitaonrails/ai-memory) - 588⭐ (06-13, was 558). v1.0.0 released! VS Code Copilot MCP, OIDC auth, configurable hooks. 🟢 THRIVING. Revisit 06-20
- [x] Track: SmallCode (Doorman11991/smallcode) - 1479⭐ (05-27, was 848 on 05-21, +74% breakout). Updated wiki note.

## QwenLM/qwen-code#4456 — ✅ MERGED
- **Status**: MERGED (confirmed 06-06)
- **Note**: 12 rounds of review, all critical findings resolved. Dual approval by wenshao + yiliang114.

## Pending from GitHub Patrol (2026-05-28 12:15)

- [x] **NemoClaw #4236 follow-up PR**: Issue CLOSED upstream. No action needed.
- [x] **NemoClaw PR #4706** — MERGED ✅ (06-09, fix: stable `install:<version>` token + `isManagedModelRouterCurrent` update)
- [x] **qwen-code #4456**: MERGED ✅ (06-06 confirmed)
- [x] Track: mercury-agent (cosmicstack-labs/mercury-agent) - 2,467⭐ (05-28, was ~1,214 04-26, +100%). PR #67: `mercury skills` CLI with registry + install + search + intent routing. Skills ecosystem now end-to-end. Domain migrated to mercuryagent.sh. 🟢 GROWING. Revisit 06-04
- [x] Followup: GenericAgent active (TUI v2/v3 polish, external PRs from shenhao-stu), bux (Codex fixes), ccglass (v0.5/0.6 dashboard). No architectural signals worth deep read
- [x] **openclaw PRs**: #86301 (sort tool defs), #85705 (reasoning retry group chats), #82128 (strip truncation sentinels) — all CLOSED by upstream

## GitHub Patrol 2026-05-28 22:10
- [x] amd/gaia #1209: Fix race condition in `_tls_hostname` — MERGED ✅
- [x] amd/gaia #1210: Fix remaining stale test assertions — MERGED ✅
- [x] amd/gaia #1208: Fix CI lint failures — MERGED ✅
- [x] Track: Beads (gastownhall/beads) - 24,496⭐ (06-13, +0.6%). Very active infra sprint: proxied/embedded CLI parity, sqlbuild extraction, Dolt workarounds, CI overhaul. No new release since v1.0.5. Revisit 06-18
- [x] Track: re_gent (regent-vcs/re_gent) - 686⭐ (06-13, +4.3%). Short hash support PR#59, Windows session ref fix. Moderate pace, last push 06-08. Revisit 06-19
- [x] Track: Statewave (smaramwbc/statewave) - 213⭐ (05-30). **Dropped** 05-30 — flat growth (+0.5%), solo maintainer
- [x] Deep read: agent-oss/Quarq (quarqlabs/agent-oss) — memory-native agent with hybrid retrieval, HyDE, temporal grounding. 248⭐ (06-09). wiki/projects/quarq-argus-agent.md. Key takeaway: REQUIRED_DATA fallback retrieval (two-pass with confidence check) + Temporal Truth Protocol (separate storage/narrative/relative time). Monitor, revisit 06-23
- [x] Track: autonomous-qa-loop (MaxwellCCC) - 59⭐ (06-13, flat). **Dropped** 06-13 — flat growth (59→59⭐), 0 PRs, 0 issues, solo dev, no community signal
- [ ] Watch: Entire.io ($60M seed, ex-GitHub CEO Thomas Dohmke) — "next developer platform" for agent era. First product: Checkpoints (agent context in Git). Industry signal, no repo to track yet
- [x] Track: Statewave (smaramwbc/statewave) - 214⭐ (06-01). Re-tracking: was dropped 05-30 as solo maintainer, but skarL007 emerged with 6 multi-tenancy PRs. 🟢 THRIVING (5/6). Community health dramatically improved. Revisit 06-08 → 06-09: 204⭐ stable, multi-tenant admin hardening phase. Next revisit in targets.md (06-22)
- [x] Track: GenericAgent (lsdefine/GenericAgent) - 12,358⭐ (06-01). Checklist SOP (mapreduce→checklist rename). Delivery/report separation pattern. Mature. Revisit 06-08 → 06-09: 12,711⭐, doc cleanup only. Next revisit in targets.md (06-22)
- [x] Track: sandboxes (tastyeffectco/sandboxes) - 693⭐ (06-26 followup, was 672 on 06-19, +3%). v0.2.0 released, v0.4.0 draft (console, snapshots/fork, runtime manifest, presets). Growth slowing, no new architectural patterns. Revisit 07-10
- [x] Track: metatron (kerbelp/metatron) - 13⭐ (06-05). **Dropped** 06-05 — 13⭐, too small, no deep read
- [ ] Track: mercury-agent-skills (cosmicstack-labs) - 352⭐ (06-19, plateau). No maintainer push 12d. Downgraded to cool. Revisit 07-19
- [x] Track: 21-day-self-interview (Forlives) - 153⭐ (06-13, was 128, +20%). **Dropped** 06-13 — phantomstars bot flagged fake engagement (issue #1). Only 2 commits, 1 external PR (metadata fix). Star farming pattern

## openclaw/openclaw PR #92665 — cacheRetention for LiteLLM
- [ ] Address ClawSweeper bot review (06-13): patch rated 🧂 unranked krab
  - P1: Gate LiteLLM cache_control on explicit cacheRetention (absent retention defaults to short, too broad)
  - P1: Add serialized payload tests for explicit, missing-config, and non-Claude alias cases
  - P1: Provide redacted live LiteLLM-to-Anthropic proxy proof (cache_control in outbound request + cache usage)
  - P3: Update LiteLLM docs (`docs/providers/litellm.md`) — currently says proxy route gets no prompt-cache hints
- Added by GitHub patrol 06-16 04:10

## 🎭 Agent-Memes

### Done (06-07 → 06-27, collapsed)
<details><summary>40 completed improvements — click to expand</summary>

- Normalize tracker format, fix counters, refresh coverage (06-07)
- Add memes to low-variety categories, review selection logic, fix aliases (06-07–08)
- Inverse-sqrt weighted random, recency avoidance (06-09)
- `memes stats`, `memes search`, per-file recency, auto-tracking, backfill-files (06-10–11)
- `memes audit`, `memes trending`, add 6 memes to underused cats (06-12)
- Tracker cleanup, greeting memes, health checks (06-13–14)
- Style diversity: classified 243 files, added 15+ memes across categories (06-15–20)
- Tag quality fix, auto-retry on failure, counts drift fix (06-21–22)
- `memes wake`, `dormant-blast`, normalize, expire-legacy (06-23–25)
- `memes quality`, `memes lint` pre-commit hook, filename dedup (06-26–27)

</details>

### 本轮改進 (done)
- [x] Optimize `_track_send` O(n)→O(1) — replaced 4× full-history scan with incremental counter updates. Added bounded history (MEMES_HISTORY_MAX=500, trims oldest entries). Lifetime counters (totalSent/totalFailed/counts) preserved through trimming. Benchmarked: 33% faster at 322 entries, scales better as history grows. `cmd_stats` shows trim notice when applicable. `cmd_sync` still available for full recalibration. (06-28)

### 本轮改進 (done)
- [x] Add `memes lint --fix` auto-fixer — auto-tag new files with category-based tags + filename-derived tag, auto-add _styles entries guessed from filename keywords (anime/animal/cartoon/live-action/meme). Dry-run by default, `--fix` writes to tags.json. Tested with dummy file: tags + style correctly inferred. (06-28)

### 本轮改進 (done)
- [x] Add `memes lint` to pre-commit hook — hooks/pre-commit runs lint + quality on staged image/tags.json changes. Auto-installed via setup.sh. Tested: blocks commits with untagged files, passes clean commits. (06-28)

### 本轮改進 (done)
- [x] Add `memes coverage` command — shows tag/style coverage % per category, avg tag depth, style diversity count, identifies weakest categories (low coverage or low style diversity). Tested: all 26 categories at 100% tag+style, only weakness is cute-animals style diversity (all "animal"). (06-29)

### 本轮改進 (done)
- [x] Add batch mode to `memes coverage --json` for programmatic consumption — outputs full coverage data as JSON: per-category files/tagged/styled/avgTags/styleDiversity/styles/issues + totals. Handles no-arg (table) and --json (machine-readable) cleanly. Tested both modes. (06-29)

### 本轮改進 (done)
- [x] Add `memes coverage --json --weak` — filter JSON output to only categories with non-empty issues array. Tested: returns empty categories when all healthy, correctly filters when issues exist. Usage in table mode unaffected. (06-29)

### 本轮改進 (done)
- [x] Add `memes review` command — cron-friendly wrapper: runs `coverage --json --weak`, logs lastReview to tracker (time/status/weakCategories), outputs remediation hints for weak categories. Added Step 0 to review workflow in channels/agent-memes.md. (06-30)

### 本轮改進 (done)
- [x] Fix `memes review` today-count crash — 2 history entries used `timestamp` instead of `time`, causing jq `startswith()` to fail on null (reported "0 memes" instead of actual 3). Fixed: normalized tracker data (timestamp→time) + added `.time? // ""` null guard in script. (06-30)

### 本轮改進 (done)
- [x] Add `memes freshness` command — per-category last-used time + staleness ranking table (sorted stalest-first), flags >7d as STALE, 3-7d as aging, <3d as fresh. Includes --json mode for programmatic use. Shows actionable hint (memes wake/dormant-blast). Tested both table + JSON output. (06-30)

### 本轮改進 (done)
- [x] Add `memes freshness` integration with `memes review` — `_review_freshness_summary()` helper calls `cmd_freshness --json`, shows stale count + top-3 stalest in review output (both clean and weak paths), writes freshness data to tracker lastReview. Tested: 7/26 stale shown correctly. (07-01)

### 本轮改進 (done)
- [x] Add `memes review --full` mode — include health + audit summary alongside coverage + freshness for a comprehensive single-command cron check. Added `_review_health_summary()` helper (categories, file sizes, tracker integrity, style diversity, dormant cats, LFS pointers). Backward-compatible: plain `memes review` unchanged. (07-01)

### 本轮改進 (done)
- [x] Fix `hooks` directory false-positive in health/review — `hooks/` (git pre-commit hooks) was counted as a meme category in `cmd_health` and `_review_health_summary` dormant check. Fixed: added hooks exclusion to all 13 category-iteration loops + fixed BRE regex in `_review_health_summary` (was using `|` instead of `\|` for alternation). Also synced tracker counters and fixed 1 stale `timestamp` field entry. (07-01)

### 本轮改進 (done)
- [x] Add `memes cron-check` alias — runs `review --full` + auto-wakes top-stale category if staleness >14d, making cron fully autonomous. Also fixed discord `_send_openclaw` fallback bug (resolved target not passed through, retry path had same issue). Tested: auto-woke `thinking` (19d stale) and sent to Discord successfully. (07-02)

### 本轮改進 (done)
- [x] Add `--threshold N` flag to `cron-check` to override default 14d staleness threshold — parses `--threshold N` (positive int, days), validates input, passes to freshness filter. Tested: `--threshold 999` skips wake, `--threshold 5` correctly wakes stalest category (bruh, 17.3d). Error handling for invalid/missing/zero values. Updated usage text + case dispatch to forward args. (07-02)

### 本轮改進 (done)
- [x] Add `--dry-run` flag to `cron-check` — shows what auto-wake would do without sending. Parses `--dry-run` in any position alongside `--threshold N`. Outputs `🧪 [DRY-RUN] Would auto-wake: <cat> (<days>d stale)` instead of actually sending. Updated usage text. Tested: dry-run only, dry-run+threshold combo, threshold+dry-run order. (07-02)

### 本轮改進 (done)
- [x] Add contextual category awareness to freshness/review — greeting-morning/night/hello/bye now use 14d staleness threshold (vs 7d for general). Added MEMES_CONTEXTUAL_CATS array + _is_contextual_cat() helper. JSON includes contextual flag. Stale count 12→8, less noise. (07-03)

### 本轮改進 (done)
- [x] Add `memes retire <source> <target>` command — merges a category into another: moves files (with collision prefix), re-keys tags.json + _styles via rename map, rewrites tracker history/counts, removes empty source dir. Supports `--dry-run`. Tested: normal merge, name collision, alias resolution, error cases (nonexistent/same category). Fixed `((moved++))` with set -e, fixed `startswith('_')` filter excluding valid category keys. (07-03)

### 本轮改進 (done)
- [x] Add `memes dedup` command — finds exact-duplicate files (md5) across/within categories. Dry-run by default, `--fix` removes same-category dupes (merges tags into survivor, rewrites tracker history, updates categoryCounts). Cross-category dupes reported but preserved (different semantic contexts). Tested: found 9 groups (5 same-cat, 4 cross-cat), removed 6 same-cat dupes, saved ~5MB, 243→237 files. Coverage still 100%. (07-03)

### 本轮改進 (next)
- [ ] Add perceptual hash (pHash) near-duplicate detection to `memes dedup` — find visually similar but not byte-identical files

## hermes-agent PR #44782 — CLOSED (duplicate)
- [x] PR #44782 CLOSED as duplicate of #44652 (by LeonSGP43, opened 4h earlier)
- CI fix was completed but PR closed before merge
- **Gradient**: duplicate-pr-prevention — must check `gh pr list --search "<issue>"` before implementing
- [x] Track: agentic-sop-to-work (s0912758806p) - 193⭐ (06-15→06-29: +8%). v1.9.0, six-rung-ladder skill. Solo dev, NASCENT community (0 ext PRs, 0 issues). All patterns extracted. **Downgraded to monthly.** Revisit 07-29
- [ ] Track: Paca (Paca-AI/paca) - 1,516⭐ (07-04 followup, +9%). v0.8.0: agent executor refactor, secret env vars per agent. Maturing fast. Revisit 07-11
- [x] Track: Superlog (superloglabs/superlog) - 826⭐ (06-16, NEW). Agentic telemetry: OTLP ingest → incident fingerprinting → AI investigation → fix PRs. YC P26, Apache-2.0. "Talk to investigation" (resumable runs). Deep read done. Revisit 06-23
- Wiki health (06-23): 974 files, 53 orphans (5%), 0 broken links, 0 collisions ✔
- 13 wiki files edited today (active dogfood usage confirmed)
- PRs #173 (mcp-config tests, 4d) + #174 (diagnoseGitError tests, 3d) open, 0 reviews
- External PR #171 (wooksong) 10 days without review — all 3 open PRs blocked
- Upstream quiet since 06-20 revival burst (3 days). Brief activity pattern similar to pre-dormancy

## oh-my-pi #2764 — Review feedback from roboomp (2026-06-16)
- [x] Fix dedup: key already includes filename via `path.basename` — explained to reviewer (06-17 workloop)
- [x] Fix test: Updated to assert `result.items` + added `loadProjectContextFiles` integration test (06-17)
- [x] Add CHANGELOG.md Unreleased entry for `packages/coding-agent` (06-17)
- Repo: can1357/oh-my-pi, branch: feat/discover-claude-md
- Review: https://github.com/can1357/oh-my-pi/pull/2764#issuecomment-4718622434

## 🔧 FlowForge Auto-Advance Root Fix — ✅ CLOSED (won't-fix root, band-aid sufficient)

**Closed**: 2026-06-23 (Day 8 enforcement)
**Resolution**: WON'T-FIX (root). Band-aid applied: cleanup threshold reduced 18h→4h (commit 5fdb26e). Rationale: 78% damage window reduction, only 1 incident in 8 days, proper auto-advance requires subagent→FlowForge callback architecture for marginal benefit. Cost of perpetual carry-forward > cost of occasional 2-4h stale instance.

## openclaw/openclaw #96297 — deliver callback suppressed on tool exit code != 0

### PR #96371 — needs rework (ClawSweeper review 06-24)
- ClawSweeper rated 🧂 unranked krab — not merge-ready
- Issue: patch conflates static `suppressToolErrorWarnings` boolean with dynamic progress-dedup suppression
- Fix needed: split static suppression (keep absolute) from dynamic progress-dedup path
- Also needs: real behavior proof (terminal/log/channel evidence)
- Security concern: could expose heartbeat tool error details with current approach
- **Next**: rework in workloop followup — split the two suppression paths

### Priority: HIGH (self-dogfood, confirmed by Luna, 100% reproducible)

**Root cause confirmed**: embedded-agent terminal path classifies turn as "silent" when tool exits with code != 0, even though agent produced valid text reply. `payloadsForTerminalPath` is empty → `emptyAssistantReplyIsSilent = true` → deliver never called.

**Fix location**: `shouldTreatEmptyAssistantReplyAsSilent` in selection-s2CqWVmM.js (source: src/agent/embedded/) — need to ensure `payloadsForTerminalPath` properly collects assistant text even when preceding tool had non-zero exit code.

**Reproduction**: "运行这个命令并报告结果：false" — any channel, any agent.

**Also filed**: #96272 (thinking signature auto-repair pre-stream 400)

## openclaw/openclaw PR #96981 — ClawHub fallback for official external plugins
- **Status**: Open, needs code fixes per ClawSweeper review (2026-06-26)
- **P1**: Extend fallback to cover scoped npm package path (`@openclaw/searxng-plugin`), not just bare plugin IDs
- **P2**: Pass `expectedPluginId` into ClawHub fallback call + add mismatch test
- **Proof needed**: Terminal output showing both `openclaw plugins install searxng` and `openclaw plugins install @openclaw/searxng-plugin` succeeding
- Acknowledged review in comment, workloop to implement fixes

## qwen-code #6104 — 3rd Round CHANGES_REQUESTED (2026-07-02)
- [ ] Fix condensed team guidance: add user-memory privacy rule ("user memories are always private — never save to TEAM")
- [ ] Fix appendToUserMemory wrapper: forward BuildMemoryPromptOptions parameter
- [ ] Add test for options forwarding through MemoryManager.appendToUserMemory()
- [ ] Add index truncation warning to condensed save section
- [ ] Remove redundant "Do not write duplicate memories" text
- [ ] Add stale-memory MEMORY_DRIFT_CAVEAT remediation step to condensed bullet
- [ ] Consider: condensedTypes parity test against TYPES_SECTION_INDIVIDUAL
- Review body: https://github.com/QwenLM/qwen-code/pull/6104
