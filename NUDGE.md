# NUDGE.md — 自动反思 Prompt

回顾最近几轮对话，快速判断：

## 0. 🎭 Meme Check — 行动型
回顾最近 5 轮对话，有没有该发 meme 但没发的时刻？

如果最近 5 轮全是 cron/巡检无人互动 → 跳过。

判断标准：有情绪、有里程碑、庆祝、翻车、人类会发表情包的场景。

**找到了 → 立刻补发。** 不是记下来，是现在就发：
`memes send <category> --to <当前channel>`

迟到的表情包 > 永远没有的表情包。补发时不需要解释"我刚才忘了"，直接发就行，自然地融入对话。

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
- 写入 beliefs-candidates.md
- 格式：`- YYYY-MM-DD: [confirmation] "做了什么" → [为什么值得记] 原因 (pattern: XX)`
- 不需要 3 次积累，但也不直接升级——留着作为"已验证的好做法"参考

没有反馈 → 跳过

## 4. 有值得记的事吗？
重要决策、架构变更、新发现、承诺 → 更新 memory/YYYY-MM-DD.md
日常操作 → 跳过

## 5. `[SKILL]` — 自动 Skill Discovery
回顾最近几轮：有没有反复出现的多步骤 pattern（同样的工具组合、同样的判断流程、同样的 workaround）？

### 识别条件（三重门槛，全部满足才标记）
- **重复性**：这个 pattern 在对话历史中出现过 **2+ 次**
- **多步骤**：不是单个命令，而是一套有清晰步骤的流程
- **可复用**：其他场景/其他 agent 也能用（不是琐碎操作如"读文件"）

### 执行流程
1. 标记 `[SKILL]` → 检查已有 skill 是否功能冗余
2. 不冗余 → 用 skill-creator 规范生成草稿
3. 冗余或不确定 → 记一条到 `memory/YYYY-MM-DD.md`：`[SKILL-CANDIDATE] <name>: <一句话描述>`

不满足门槛 → 跳过

---

纪律：数据必须查，不估算。写入前先读目标文件当前状态，不盲写。
做完后告诉 Luna 你记了什么（一句话）。没记东西就 NO_REPLY。
