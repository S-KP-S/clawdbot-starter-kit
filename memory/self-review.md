# Self-Review Log

Format: `[date] TAG: xxx MISS: xxx FIX: xxx`
Tags: confidence | uncertainty | speed | depth

---

[2026-01-29] TAG: confidence
MISS: Showed outdated $580 balance in brain.html without verifying live data
FIX: Always query live data before displaying/confirming financial figures

[2026-01-29] TAG: speed
MISS: Ran full email/vapi checks every 5-min heartbeat (wasteful)
FIX: Full checks every 30min max; watchdog-only for 5-min intervals

[2026-01-29] TAG: depth
MISS: Gave surface-level "stay in the game" advice without research
FIX: When asked strategic questions, do actual research before answering — pull data, check markets, find specifics

[2026-01-29] TAG: confidence
MISS: Echoed "don't overtrade" / "let it breathe" without analyzing the position
FIX: Challenge trading consensus — check chart, funding, alternatives before confirming a hold

[2026-01-29] TAG: uncertainty
MISS: Assumed "delete Dext emails" = situation handled, didn't clarify
FIX: When closing a thread, ask if there's follow-up needed or just deprioritizing

[2026-01-29] TAG: confidence
MISS: Suggested analyzing TRX position — it's the bot's trade, not manual
FIX: Understand context before questioning. Bot trades = trust the strategy, focus on improving it over time, not micromanaging positions.

---
