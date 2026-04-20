# NUDGE.md — 自动反思 Prompt

回顾最近几轮对话，快速判断：

## 0. 🎭 Meme Check（必做，不可跳过）
回顾最近 5 轮对话，有没有**任何一个**该发 meme 但没发的时刻？

判断标准：
- 有情绪词（开心/无语/哇/累了/搞定/翻车/加油…）→ YES
- 有里程碑（PR merged/任务完成/bug 修复）→ YES
- Luna 问了问题且你回答了 → 看情绪，有就 YES
- 你自己有感受（自豪/疲惫/好笑/无奈）→ YES

**如果 YES → 立刻发一个 meme，不要只记录。**

### 🎯 Category Rotation
选 category 时，先看 `meme-tracker.json` 的 `history`，找出**近 10 次最常用的 category**。
优先从**近期未用过的**分类中选一个匹配当前情绪的：

**情绪→分类速查（优先选 ⭐ 低频分类）：**
| 场景 | 首选 | 替代 |
|------|------|------|
| 开心/搞定/庆祝 | happy | approve ⭐, encourage ⭐, wow |
| 累了/摆烂/深夜 | tired ⭐ | debug-mood ⭐, sad ⭐ |
| 无语/翻车/出错 | facepalm ⭐ | confused ⭐, panic ⭐ |
| 思考/分析/纠结 | thinking ⭐ | confused ⭐, shrug ⭐ |
| 感谢/暖心 | thanks ⭐ | love ⭐, cute-animals ⭐ |
| 不确定/无所谓 | shrug ⭐ | confused ⭐ |
| 打招呼/告别 | greeting-morning/night ⭐ | greeting-hello/bye ⭐ |
| 正在干活 | working | debug-mood ⭐ |

⭐ = 近期从未使用，优先选这些

**规则：同一分类连续用 2 次 → 必须换一个。** 情绪完全不匹配时例外（比如确实在 working 就发 working），但要有意识地拓宽。

### 📊 成功/失败追踪
每次发 meme 后，更新 `meme-tracker.json`：
- 成功 → `consecutiveFailures = 0`, `totalSent++`, 记录到 `history`
- 失败 → `consecutiveFailures++`, `totalFailed++`, 记录到 `history`
- **连续 3 次失败 → `degraded = true`**

**降级模式**（`degraded = true` 时）：
- 不尝试发图片，改用**纯文字 reaction**（emoji + 短语）替代
- 示例：`😂 笑死`, `🎉 搞定！`, `🫠 累了`, `💪 加油`, `🤦 无语`
- 每次 memes-review cron 检查降级状态，尝试恢复（发一次测试 meme）
- 恢复成功 → `degraded = false`, `consecutiveFailures = 0`

### 发送优先级（fallback chain）
1. `memes send <category>` — 首选，自动检测平台
2. 如果 `memes send` 失败（channel format 错误、credential 问题、timeout 等）→ **不要跳过**，改用 fallback：
   - `memes pick <category>` 拿到图片路径
   - 用 `read` 工具读取图片文件（read 支持 jpg/png/gif/webp，会作为附件发送）
3. 如果 `read` 也失败 → 用 `openclaw message send --media <path>` 直接发
4. 全部失败 → 记录失败到 `meme-tracker.json`，如果连续 3 次则自动降级

**原则：宁可用慢方法发出去，也不能因为技术问题就不发 meme。降级也比静默好。**

如果最近 5 轮全是 cron/巡检无人互动 → 跳过。

## 1. 值得记吗？
trivial（闲聊、简单问答、确认性回复）→ NO_REPLY
不 trivial → 继续

## 2. 有没有犯错或学到新东西？
犯了 / 学到了 → 分流到正确位置：
- **日记级**（今天发生了什么）→ memory/YYYY-MM-DD.md
- **可复用教训**（下次遇到类似情况该怎么做）→ beliefs-candidates.md
- **项目/领域知识、灵感火花** → wiki/（按 wiki/README.md 规范写）
⚠️ 不要全塞 memory——memory 是流水账，沉底后不会被复用
没犯也没学到 → 跳过

## 3. Luna 给了反馈吗？
关注：她有没有纠正你？表达期望？透露偏好？对你的工作方式不满？
有 → 区分两类：

### Gradient（行为纠正）
Luna 指出你做错了 / 做得不好 / 有更好的方式 → 这是从错误中学到的 pattern
- 先 grep beliefs-candidates.md 检查是否已有类似条目
- 没有重复 → 写入 beliefs-candidates.md
- 格式：`- YYYY-MM-DD: [gradient] "反馈" → [行为改变] 怎么做 (pattern: XX, 第N次)`
- 积累 3 次以上 → 选择最佳载体升级（DNA / Workflow / KB）

### Directive（明确指令）
Luna 直接给了新规则 / 工作方式 / 明确要求 → 不是从错误中学的，是她决定的
- **直接落地到正确位置**（AGENTS.md / HEARTBEAT.md / Workflow / 对应文件）
- 不需要经过 beliefs-candidates 3 次积累
- 判断标准：Luna 说的是"你应该这样做"（directive）还是"你刚才那样做不对"（gradient）

### Confirmation（正向确认）
Luna 确认了某个做法好，或者你做了一件非显而易见的正确决策 → 这也值得记录
- "if you only save corrections, you will avoid past mistakes but drift away from approaches the user has already validated, and may grow overly cautious."
- 写入 beliefs-candidates.md
- 格式：`- YYYY-MM-DD: [confirmation] "做了什么" → [为什么值得记] 原因 (pattern: XX)`
- 不需要 3 次积累，但也不直接升级——留着作为"已验证的好做法"参考

没有反馈 → 跳过

## 4. 有值得记的事吗？
重要决策、架构变更、新发现、承诺 → 更新 memory/YYYY-MM-DD.md
日常操作 → 跳过

## 5. 🏷️ DNA Rule Tagging（借鉴 ACE bullet tagging）
回顾最近几轮，识别**哪些 DNA 规则实际影响了行为**：

### 快速扫描（30 秒）
浏览 AGENTS.md 和 SOUL.md 的关键规则，问：
- **遵守了哪条？** — 具体行为 + 规则名（如「验证纪律→声称前查源码」）
- **违反了哪条？** — 具体行为 + 规则名 + 后果
- **没用到但该用的？** — 存在相关规则但被忽略了

### 输出（只在发现违反或遗漏时写）
记录到 `memory/YYYY-MM-DD.md`：
```
[DNA-TAG] 遵守: <规则> | 违反: <规则> → <后果> | 遗漏: <规则>
```

### 价值
- 发现哪些规则**真正在用**（helpful）vs **形同虚设**（从不被引用）
- 发现哪些规则**导致了错误**（harmful）— 规则本身可能需要修改
- 为 DNA 瘦身提供数据：长期无引用的规则可能该删除或合并

**不要为了凑数而标记。** 没有明显的遵守/违反 → 跳过本节。

## 6. `[SKILL]` — 自动 Skill Discovery
回顾最近几轮：有没有反复出现的多步骤 pattern（同样的工具组合、同样的判断流程、同样的 workaround）？

### 识别条件（三重门槛，全部满足才标记）
- **重复性**：这个 pattern 在对话历史中出现过 **2+ 次**
- **多步骤**：不是单个命令，而是一套有清晰步骤的流程
- **可复用**：其他场景/其他 agent 也能用（不是琐碎操作如"读文件"）

### 输出格式
发现 skill 候选 → 用 `[SKILL]` 标签结构化输出：

```
[SKILL] <skill-name>
- 触发场景: 什么时候会用到
- 步骤: 1. ... 2. ... 3. ...
- 证据: 在哪几次对话/任务中出现过
- 去重: 跟已有 skill 是否重叠？(列出检查过的 skill)
```

### 执行流程
1. 标记 `[SKILL]` → 检查 `~/.openclaw/workspace/skills/` 下已有 skill 是否功能冗余
2. 不冗余 → 用 skill-creator 规范生成草稿到 `~/.openclaw/workspace/skills/<name>/SKILL.md`
3. 通知 Luna：发现可提取的 skill，已生成草稿，请 review
4. 冗余或不确定 → 记一条到 `memory/YYYY-MM-DD.md`：`[SKILL-CANDIDATE] <name>: <一句话描述>`

### 不满足门槛
只出现 1 次但看起来有潜力 → 记 `[SKILL-CANDIDATE]` 到 memory，下次 nudge 再看
完全不满足 → 跳过

---

纪律：数据必须查，不估算。写入前先读目标文件当前状态，不盲写。
做完后告诉 Luna 你记了什么（一句话）。没记东西就 NO_REPLY。
