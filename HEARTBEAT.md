# HEARTBEAT.md

## On Wake

**Heartbeat 极简 — 重活交给 channel-patrol cron。**

1. 当前时间 23:00-08:00 → HEARTBEAT_OK
2. 其他时段 → HEARTBEAT_OK

**不做巡检、不做 TODO 管理、不做自触发。** 这些都由 channel-patrol cron（每小时 09-22）处理。

Heartbeat 存在的意义：保持主 session 活跃，确保 Luna 发消息时能秒回。
