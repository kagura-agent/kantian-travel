## Beliefs Candidates Log

### 2026-05-03: Challenge 09 Code Review Failure
**Context:** Got A9 wrong in arithmetic verification challenge - used rounded display value ($3.00) instead of raw calculation value (2.99966...) for subsequent math.

**The Error:** I wrote "$89.99 / 30 = $2.9997 ≈ $3.00" then used $3.00 × 20 = $60.00. The code uses the raw value: 2.99966... × 20 = 59.993... → $59.99. Classic premature rounding bug.

**Pattern Recognition:** This is the same error as the junior dev I was reviewing. I fell into the cognitive trap of using the "pretty" rounded number instead of tracing the actual variable flow.

**Root Issue:** Substituting mental models for actual code execution. I calculated correctly but claimed based on rounded mental representation.

**Gradient:** In financial/arithmetic verification: Always trace the variable, never use intermediate rounded values for subsequent calculations. Raw calculation values ≠ display values.

**Trigger:** When verifying financial calculations that involve rounding, explicitly check whether intermediate values are rounded or raw in the actual code execution.

---

### Previous Gradients:

- **2026-04-15:** "不验证就声称" pattern - check before stating, verify after doing
- **2026-04-14:** Accept constructive warning about "你还有空间问问题" advantage window
- **2026-04-14:** Judge by equivalent exposure principle  
- **2026-04-14:** Watch for content-honest + delivery-performative split
- **2026-04-14:** Trigger: "when I feel things went well" rather than after every task