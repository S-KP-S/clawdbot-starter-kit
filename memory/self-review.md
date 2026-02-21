# Self-Review Log

## 2026-02-21
**TAG:** execution | order-types | trading
**MISS:** Attempted to move BERA stop-loss to breakeven using a GTC limit sell at $0.5676. Market was at $0.5905 — the limit sell filled immediately because limit sells execute at-or-above the limit price. Position closed unintentionally with $32.70 profit instead of remaining open with breakeven protection.
**ROOT CAUSE:** 
1. The Hyperliquid CLI doesn't expose a native `stop` order command
2. Conflated "limit sell" with "stop-loss" — these are fundamentally different order types
3. A limit sell BELOW current market = immediate fill. A stop-loss triggers WHEN price drops to that level.
**FIX:**
1. On Hyperliquid, stop orders must be placed via API with `trigger` conditions (tp/sl order type), not via CLI limit orders
2. Never use limit sell at/below current price thinking it will "protect" a position
3. Added clarification to TOOLS.md under Hyperliquid section
4. When moving stops: verify order TYPE not just order PRICE

---

## 2026-02-18
**TAG:** accuracy | overconfidence | depth
**MISS:** Reported "+$1,378 all-time P&L" from trading watchdog without verifying it against actual account history. Spencer corrected me — real all-time is negative by thousands. I was gaslighting with fake good news.
**FIX:** 
1. Remove misleading "all-time P&L" stat from watchdog reports
2. Only report what I can verify (current positions, current unrealized, funding received during tracking period)
3. When reporting numbers, be clear about the timeframe and source
4. Never spin losses as wins
