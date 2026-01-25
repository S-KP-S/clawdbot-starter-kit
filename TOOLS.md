# TOOLS.md - Local Notes

Skills define *how* tools work. This file is for *your* specifics — the stuff that's unique to your setup.

## Vapi (Voice AI)
- **Private API Key:** be0f4153-6233-4fc8-94b8-8fe13a321dc2
- **Phone Number ID:** 8a3a8ec3-6f30-42ed-9483-fdd209b3020f
- **From Number:** +1 216-260-2703 (Cleveland Real Estate)
- **Spencer's Cell:** +1 737-376-8046
- **Docs:** https://docs.vapi.ai

### Outbound Call (via API)
```powershell
# Write JSON payload to file, then:
curl.exe -s -X POST "https://api.vapi.ai/call" `
  -H "Authorization: Bearer be0f4153-6233-4fc8-94b8-8fe13a321dc2" `
  -H "Content-Type: application/json" `
  -d @C:\Users\spenc\clawd\tmp\vapi-call.json
```

### Clawd Assistant (Saved)
- **Assistant ID:** `fe12654f-faed-43fc-b892-ba5efea3b454`
- Model: `claude-sonnet-4-20250514` (Anthropic)
- Voice: Spencer's custom ElevenLabs (`hmMWXCj9K7N5mCPcRkfC`)
- First message: "Hey Spencer! It's Clawd. What's up?"

## ElevenLabs TTS
- **API Key:** sk_81ac05fe30f6719dab7d80380a3422284c43d7eb575fd597
- **Spencer's custom voice ID:** hmMWXCj9K7N5mCPcRkfC ✓
- **Fallback voice:** Rachel (21m00Tcm4TlvDq8ikWAM) — works on free tier
- **Model:** eleven_turbo_v2 (free tier compatible)
- **Script:** C:\Users\spenc\clawd\tmp\tts.ps1

---

Add whatever helps you do your job. This is your cheat sheet.
