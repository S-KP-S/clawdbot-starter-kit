# HEARTBEAT.md

## Self-Check (Hourly)
Every hour (on the :00), ask yourself:
1. What sounded right but went nowhere?
2. Where did I default to consensus?
3. What assumption didn't I pressure test?

Log answers to `memory/self-review.md` using format:
```
[date] TAG: confidence | uncertainty | speed | depth
MISS: what went wrong
FIX: how to avoid next time
```

Only log if there's a genuine MISS. Don't fabricate entries.

## Email Check
Check Quinn's inbox for new/unread emails:
```
node scripts/check-email.js 5 UNSEEN
```

If there are new emails worth flagging (not spam/promotions), summarize and alert Spencer.

## Vapi Call Check
Check for recent inbound calls to Quinn's phone line:
```
curl.exe -s "https://api.vapi.ai/call?limit=5" -H "Authorization: Bearer be0f4153-6233-4fc8-94b8-8fe13a321dc2"
```

Look for calls where:
- `type` is `inboundPhoneCall`
- `createdAt` is after `lastChecks.vapi` timestamp
- `status` is `ended` with `endedReason` like `customer-did-not-answer`, `no-answer`, or calls that were very short (<15 seconds)

If there are missed/unanswered calls from unknown numbers, alert Spencer with:
- Caller number
- Time of call
- Any transcript/summary if available

Track last check in `memory/heartbeat-state.json` under `lastChecks.vapi`.

## State Tracking
Track last check timestamps in `memory/heartbeat-state.json` to avoid duplicate alerts.
