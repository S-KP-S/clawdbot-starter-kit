# TOOLS.md - Local Notes

Skills define *how* tools work. This file is for *your* specifics — the stuff that's unique to your setup.

## 🧠 QMD - Spencer's Second Brain (IMPORTANT)
QMD (Query Markup Documents) indexes Spencer's ChatGPT history, notes, and workspace for semantic search.

**How to query:**
```powershell
# Search (keyword - fast, works on all docs)
wsl -d Ubuntu -e sh -c 'export PATH=$PATH:$HOME/.bun/bin && qmd search "query" -n 10'

# Semantic search (meaning-based - requires embeddings)
wsl -d Ubuntu -e sh -c 'export PATH=$PATH:$HOME/.bun/bin && qmd vsearch "query" -n 10'

# Hybrid + reranking (best quality)
wsl -d Ubuntu -e sh -c 'export PATH=$PATH:$HOME/.bun/bin && qmd query "query" -n 10'

# Get full document by path
wsl -d Ubuntu -e sh -c 'export PATH=$PATH:$HOME/.bun/bin && qmd get "qmd://chatgpt/path/to/file.md"'

# Search specific collection
wsl -d Ubuntu -e sh -c 'export PATH=$PATH:$HOME/.bun/bin && qmd search "query" -c chatgpt -n 10'

# Check status
wsl -d Ubuntu -e sh -c 'export PATH=$PATH:$HOME/.bun/bin && qmd status'
```

**Collections:**
- `chatgpt` — Past ChatGPT conversations (1864 files)
- `clawd-memory` — Daily logs and personal notes (14 files)
- `clawd-workspace` — Clawd workspace markdown files (385 files)

**When to use:**
- Spencer asks "did I talk about X before?"
- Need context from past projects/decisions
- Looking for something Spencer discussed with ChatGPT
- Searching for notes or prior work

## Hyperliquid CLI (Trading)
- **Package:** `hyperliquid-cli` (npm)
- **Docs:** https://github.com/chrisling-dev/hyperliquid-cli
- **Skill:** `skills/hyperliquid-cli/SKILL.md`

**Auth configured via User env vars:**
- `HYPERLIQUID_PRIVATE_KEY` — API wallet private key
- `HYPERLIQUID_WALLET_ADDRESS` — Main wallet address

### Quick Commands
```powershell
# Portfolio & positions
hl account portfolio --json
hl account positions -w  # Watch mode

# Trading
hl trade order market buy 0.001 BTC
hl trade order limit sell 0.1 ETH 3500
hl trade cancel-all -y

# Prices
hl asset price HYPE --json
```

### PowerShell Note
Env vars need to be set in session (or use User env vars already configured):
```powershell
$env:HYPERLIQUID_PRIVATE_KEY = "0x..."
hl account portfolio
```

---

## Google Gemini CLI
- **Auth:** Logged in with Spencer's Google account (Google AI Pro)
- **Model:** Auto (Gemini 3) - latest model
- **Credentials:** Cached at `~/.config/@anthropic/gemini/credentials.json` (or similar)

### Usage
```powershell
# One-shot query (non-interactive)
gemini "Your prompt here"

# With specific model
gemini --model gemini-2.0-flash "Prompt"

# Output as JSON
gemini --output-format json "Return structured data"
```

### When to use Gemini
- Need Google's latest model capabilities
- Want a second opinion from a different AI
- Tasks where Gemini excels (multimodal, long context)
- Spencer's paid tier = higher rate limits

---

## GoHighLevel (GHL) CRM For TerraSol (Land Wholesaling)
- **Location ID:** Ky4b8wjuurnFCJfVb7Gl
- **API Key:** pit-e0f74906-ed71-4548-a6fc-18b54ecdba4c
- **Base URL (v2):** https://services.leadconnectorhq.com
- **Docs:** https://highlevel.stoplight.io/docs/integrations

### Common Endpoints (v2 API)
```powershell
# List contacts (paginated)
curl.exe -s "https://services.leadconnectorhq.com/contacts/?locationId=Ky4b8wjuurnFCJfVb7Gl&limit=20" `
  -H "Authorization: Bearer pit-e0f74906-ed71-4548-a6fc-18b54ecdba4c" `
  -H "Version: 2021-07-28"

# Get single contact
curl.exe -s "https://services.leadconnectorhq.com/contacts/{contactId}" `
  -H "Authorization: Bearer pit-e0f74906-ed71-4548-a6fc-18b54ecdba4c" `
  -H "Version: 2021-07-28"

# Update contact (add/replace tags)
curl.exe -X PUT "https://services.leadconnectorhq.com/contacts/{contactId}" `
  -H "Authorization: Bearer pit-e0f74906-ed71-4548-a6fc-18b54ecdba4c" `
  -H "Version: 2021-07-28" `
  -H "Content-Type: application/json" `
  -d '{"tags":["tag1","tag2"]}'

# Add tag to contact (without removing existing)
curl.exe -X POST "https://services.leadconnectorhq.com/contacts/{contactId}/tags" `
  -H "Authorization: Bearer pit-e0f74906-ed71-4548-a6fc-18b54ecdba4c" `
  -H "Version: 2021-07-28" `
  -H "Content-Type: application/json" `
  -d '{"tags":["new-tag"]}'

# Search contacts by email/phone
curl.exe -s "https://services.leadconnectorhq.com/contacts/?locationId=Ky4b8wjuurnFCJfVb7Gl&query=email@example.com" `
  -H "Authorization: Bearer pit-e0f74906-ed71-4548-a6fc-18b54ecdba4c" `
  -H "Version: 2021-07-28"
```

## 🤖 Coding Agent Hierarchy

**Spencer's Preference:** Use **OpenCode** (Kimi) for frontend work.

**Main Stack** (use in order, overflow on failure/limits):

| Priority | Agent | Model | Command |
|----------|-------|-------|---------|
| 1️⃣ | **Codex CLI** | OpenAI Codex | `codex -a auto "prompt"` |
| 2️⃣ | **OpenCode** | Kimi K2.5 (FREE) | `opencode run -m opencode/kimi-k2.5-free "prompt"` |
| 3️⃣ | **Kimi CLI** | Kimi K2.5 (paid) | `& "C:\Users\spenc\.local\bin\kimi" -y -p "prompt"` |
| 4️⃣ | **Claude Code** | Sonnet | `claude -p "prompt" --allowedTools Edit,Write,Bash` |
| 5️⃣ | **Claude Code** | **Opus 4.5** 🔥 | `claude -p "prompt" --model claude-opus-4-5-20251101 --allowedTools Edit,Write,Bash` |

**⚡ Speed Demon (Parallel Option):**
| Agent | Model | Use Case |
|-------|-------|----------|
| **Groq** | LLaMA 3.3 70B | Quick answers, fast explanations, "good enough" responses |

**Rules:**
- Start with Codex for coding tasks
- If Codex hits rate limits or fails → OpenCode (free Kimi)
- If OpenCode fails → Kimi CLI (paid)
- If errors persist → Claude Code (Sonnet) for debugging/recovery
- If all else fails → **Opus 4.5** (the beast) for nuclear option
- **Groq** → Use anytime for fast parallel answers or quick queries

---

## ⚡ Groq (Speed Demon - Parallel Option)
- **API Key:** Saved to `.secrets/groq-api-key.txt`
- **Models:** llama-3.3-70b-versatile (primary), mixtral-8x7b, gemma2-9b
- **Speed:** 500+ tokens/sec (10x faster than typical APIs)
- **Use for:** Quick answers, fast code explanations, batch processing, brainstorming

**When to use Groq:**
- Need a fast "good enough" answer
- Simple code questions ("what does this do?")
- Text processing, summarization
- Running parallel to main agent for speed comparison

```powershell
# Example curl call
$env:GROQ_API_KEY = Get-Content "C:\Users\spenc\clawd\.secrets\groq-api-key.txt"
curl.exe -s "https://api.groq.com/openai/v1/chat/completions" `
  -H "Authorization: Bearer $env:GROQ_API_KEY" `
  -H "Content-Type: application/json" `
  -d '{"model":"llama-3.3-70b-versatile","messages":[{"role":"user","content":"Hello"}]}'
```

---

## Kimi CLI (Moonshot AI Agent)
- **Path:** `C:\Users\spenc\.local\bin\kimi`
- **Model:** kimi-k2.5 (kimi-for-coding)
- **Docs:** https://moonshotai.github.io/kimi-cli/

### Usage
```powershell
# Interactive mode
& "C:\Users\spenc\.local\bin\kimi"

# One-shot with prompt (auto-approve)
& "C:\Users\spenc\.local\bin\kimi" -y -p "Your prompt here"

# Quiet mode (just final output)
& "C:\Users\spenc\.local\bin\kimi" --quiet -p "Your prompt here"

# With specific working directory
& "C:\Users\spenc\.local\bin\kimi" -w "C:\path\to\project" -y -p "Build something"
```

### Key Flags
| Flag | Effect |
|------|--------|
| `-y, --yolo` | Auto-approve all actions |
| `-p, --prompt` | Pass prompt directly |
| `--quiet` | Non-interactive, final message only |
| `-w, --work-dir` | Set working directory |
| `-C, --continue` | Continue previous session |
| `--thinking` | Enable thinking mode |

---

## OpenCode CLI (Free Kimi K2.5)
- **Model:** Kimi K2.5 (free via OpenCode)
- **Role:** First-pass coding work — React components, CSS, general dev tasks
- **Command:** `opencode run -m opencode/kimi-k2.5-free "prompt"`

### Usage
```powershell
# One-shot run (non-interactive)
opencode run -m opencode/kimi-k2.5-free "Build a React component for X"

# Continue last session
opencode run -c -m opencode/kimi-k2.5-free "Continue from where we left off"

# Attach files
opencode run -m opencode/kimi-k2.5-free -f ./src/App.tsx "Refactor this component"

# Interactive TUI mode
opencode
```

### Key Flags
| Flag | Effect |
|------|--------|
| `-m, --model` | Model in format provider/model |
| `-c, --continue` | Continue last session |
| `-s, --session` | Continue specific session ID |
| `-f, --file` | Attach file(s) to message |
| `--agent` | Agent to use |
| `--format` | Output format: default or json |

### Available Kimi Models
- `opencode/kimi-k2.5-free` — FREE tier ✓
- `kimi-for-coding/k2p5` — Kimi for Coding
- `moonshotai/kimi-k2.5` — Direct Moonshot API (paid)

### Notes
- Replaced Kilo Code (Kimi no longer free there)
- Good for: React components, CSS, general coding tasks
- Use `opencode models` to list all available models

## Twitter/X Queries (via Grok 4.1)
Use **OpenRouter Grok 4.1** for X/Twitter data.

### Usage
```powershell
@'
{
  "model": "x-ai/grok-4.1",
  "messages": [{"role": "user", "content": "What's trending on Twitter/X right now?"}]
}
'@ | Out-File -Encoding utf8 $env:TEMP\grok-request.json

curl.exe -s "https://openrouter.ai/api/v1/chat/completions" `
  -H "Authorization: Bearer $env:OPENROUTER_API_KEY" `
  -H "Content-Type: application/json" `
  -d "@$env:TEMP\grok-request.json"
```

### When Spencer asks about Twitter/X:
- Trending topics → Grok 4.1
- What's happening on X → Grok 4.1
- Sentiment on a topic → Grok 4.1
- Search Twitter for [topic] → Grok 4.1
- Fetch tweet content → Grok 4.1 (or ask Spencer to paste it)

---

## Kimi K2.5 for Heartbeats
Use **Kimi CLI** for heartbeat/background tasks when OpenRouter free models fail.

```powershell
& "C:\Users\spenc\.local\bin\kimi" -y -p "Your heartbeat task here"
```

---

## Vapi (Voice AI)
- **Private API Key:** be0f4153-6233-4fc8-94b8-8fe13a321dc2
- **Phone Number ID:** 8a3a8ec3-6f30-42ed-9483-fdd209b3020f
- **From Number:** +1 216-260-2703 (Cleveland Real Estate)
- **Spencer's Cell:** +1 737-376-8046
- **Docs:** https://docs.vapi.ai

### Default Model (Cheapest)
- **Provider:** OpenAI
- **Model:** GPT 4o Mini Cluster

### Outbound Call (via API)
```powershell
# Write JSON payload to file, then:
curl.exe -s -X POST "https://api.vapi.ai/call" `
  -H "Authorization: Bearer be0f4153-6233-4fc8-94b8-8fe13a321dc2" `
  -H "Content-Type: application/json" `
  -d @C:\Users\spenc\clawd\tmp\vapi-call.json
```

### Quinn Assistant (Primary - Inbound & Outbound)
- **Assistant ID:** `a1a8c748-b206-44c2-971f-f31cccd99f35`
- **Model:** GPT-4o Mini (OpenAI) - cheapest
- **Voice:** Quinn ElevenLabs (`hmMWXCj9K7N5mCPcRkfC`)
- **First message (inbound):** "Hey, this is Quinn, Spencer's assistant. How can I help you?"
- **Tools:** Transfer call, End call, Google Calendar (check + create), Knowledge base query
- **Transfer to:** +1 737-376-8046
- **Booking hours:** 9 AM - 9 PM EST
- **Knowledge Base File IDs:** 
  - `96b30948-0122-4170-9c21-cb04307f13ca` (main KB)
  - `d9eb086e-c5b6-458d-989c-3b1002dc531b` (contacts.md)
- **Query Tool ID:** `f67375f2-e8f0-4bea-8797-6cb6790575e3`
- **Settings:** responseDelaySeconds=1, DTMF enabled, interruptionsEnabled=true

### Date/Time Awareness (IMPORTANT)
GPT-4o Mini hallucinates dates without help. Use Vapi's built-in dynamic variables:
- `{{"now" | date: "%A, %B %d, %Y", "America/Chicago"}}` → "Saturday, January 25, 2026"
- `{{"now" | date: "%I:%M %p", "America/Chicago"}}` → "1:40 PM"
- `{{year}}` → "2026"
- `{{customer.number}}` → caller's phone number
Docs: https://docs.vapi.ai/assistants/dynamic-variables

### Contacts (in Knowledge Base)
To add/update contacts, edit `C:\Users\spenc\clawd\tmp\contacts.md` then re-upload:
```powershell
curl.exe -s -X POST "https://api.vapi.ai/file" -H "Authorization: Bearer be0f4153-6233-4fc8-94b8-8fe13a321dc2" -F "file=@C:\Users\spenc\clawd\tmp\contacts.md;type=text/markdown"
```
Then update the KB tool with the new file ID.

**Current contacts:**
| Phone | Name | Email |
|-------|------|-------|
| +14166066891 | Ahsan | eslamiahsan@gmail.com |

### Outbound Call Template (Basic)
```json
{
  "phoneNumberId": "8a3a8ec3-6f30-42ed-9483-fdd209b3020f",
  "assistantId": "a1a8c748-b206-44c2-971f-f31cccd99f35",
  "assistantOverrides": {
    "firstMessage": "Hey [NAME]! This is Quinn, Spencer's assistant. He wanted me to reach out - got a minute?"
  },
  "customer": {
    "number": "+1XXXXXXXXXX",
    "name": "Contact Name"
  }
}
```

### Outbound Call - Restaurant Reservation Template
See `tmp/outbound-reservation-prompt.md` for full prompt.

**Key rules for outbound calls to businesses:**
1. **Voicemail detection** - if you hear "leave your name, phone, date..." = leave verbal message
2. **DTMF restraint** - ONLY press buttons when told "press X for Y"
3. **Speak don't press** - when asked for info (name, date, party size), speak it
4. **IVR escape** - say "operator" or "representative" if stuck
5. **Loop detection** - end call after 2 "incorrect" errors

```json
{
  "phoneNumberId": "8a3a8ec3-6f30-42ed-9483-fdd209b3020f",
  "assistantOverrides": {
    "firstMessage": "Hi! I'm hoping to make a dinner reservation for tonight if you have any availability.",
    "model": {
      "model": "gpt-4o-mini",
      "provider": "openai",
      "messages": [{
        "role": "system",
        "content": "[see tmp/outbound-reservation-prompt.md]"
      }]
    }
  },
  "customer": { "number": "+1XXXXXXXXXX", "name": "Restaurant Name" }
}
```

### Legacy Clawd Assistant
- **Assistant ID:** `fe12654f-faed-43fc-b892-ba5efea3b454`
- Model: `claude-sonnet-4-20250514` (Anthropic)
- Voice: Spencer's custom ElevenLabs (`hmMWXCj9K7N5mCPcRkfC`)
- First message: "Hey Spencer! It's Clawd. What's up?"

## Whisper Transcription (Local - FREE)
- **App:** Vibe (local Whisper)
- **Path:** C:\Users\spenc\AppData\Local\vibe\vibe.exe
- **Model:** C:\Users\spenc\clawd\models\ggml-small.bin (466MB)
- **Script:** C:\Users\spenc\clawd\scripts\transcribe.ps1

### Transcribe Audio
```powershell
powershell -ExecutionPolicy Bypass -File "C:\Users\spenc\clawd\scripts\transcribe.ps1" -AudioFile "path\to\audio.ogg"
```

## ElevenLabs TTS
- **API Key:** sk_81ac05fe30f6719dab7d80380a3422284c43d7eb575fd597
- **Quinn voice ID:** hmMWXCj9K7N5mCPcRkfC ✓ ← ALWAYS use this for Quinn
- **Quinn is male** — use he/him pronouns, "himself" etc.
- **Fallback voice:** Rachel (21m00Tcm4TlvDq8ikWAM) — works on free tier
- **Model:** eleven_turbo_v2 (free tier compatible)
- **Script:** C:\Users\spenc\clawd\tmp\tts.ps1

## Google Calendar
- **Script:** `node scripts/gcal.js`
- **Tokens:** `~/.config/google-calendar/tokens.json`
- **OAuth Client:** vigilant-card-485301-v2 (same as Drive)
- **Spencer's primary calendar:** spencerkstrandholt@gmail.com

### Commands
```powershell
# List calendars
node scripts/gcal.js calendars

# List upcoming events
node scripts/gcal.js events [calendarId] [count]

# Create event (with optional Google Meet)
node scripts/gcal.js create '{"title":"Meeting","start":"2026-01-27T14:00:00","end":"2026-01-27T15:00:00","meet":true,"attendees":["email@example.com"],"notify":true}'

# Delete event
node scripts/gcal.js delete <eventId> [calendarId]
```

### Event Options
- `title` (required) — event name
- `start` / `end` (required) — ISO datetime strings
- `timezone` — defaults to America/Chicago
- `description` — event description
- `meet` — boolean, creates Google Meet link
- `attendees` — array of email addresses
- `notify` — boolean, sends invites to attendees
- `calendarId` — defaults to 'primary'

## Email (via AgentMail)
- **Account:** quinnorsted@agentmail.to
- **API Key:** In `.env` as `AGENTMAIL_API_KEY`
- **Docs:** https://docs.agentmail.to
- **From Name:** "Quinn - Personal Assistant"

### Send Email
```powershell
node scripts/agentmail-send.js <to> <subject> <body>
# Example:
node scripts/agentmail-send.js someone@example.com "Subject" "Body text here"
```

### Check Inbox
```powershell
node scripts/agentmail-check.js [limit]
# Example:
node scripts/agentmail-check.js 5
```

### Notes
- AgentMail is built for AI agents (no CAPTCHA/lockouts!)
- REST API: https://api.agentmail.to/v0
- Old Gmail (quinn.strandholt@gmail.com) was disabled by Google

---

## Summarize CLI (steipete/summarize)
- **Version:** 0.10.0
- **Path:** `C:\Users\spenc\AppData\Roaming\fnm\node-versions\v25.5.0\installation\summarize.ps1`
- **Docs:** https://github.com/steipete/summarize

**What it does:** Fast summaries from URLs, files, YouTube, podcasts, PDFs, audio/video.

### Usage
```powershell
# Extract content only (no LLM call)
& "C:\Users\spenc\AppData\Roaming\fnm\node-versions\v25.5.0\installation\summarize.ps1" "https://example.com" --extract

# Summarize with auto model selection
& "C:\Users\spenc\AppData\Roaming\fnm\node-versions\v25.5.0\installation\summarize.ps1" "https://example.com"

# Summarize YouTube video
& "C:\Users\spenc\AppData\Roaming\fnm\node-versions\v25.5.0\installation\summarize.ps1" "https://youtu.be/dQw4w9WgXcQ" --youtube auto

# Use free OpenRouter models
& "C:\Users\spenc\AppData\Roaming\fnm\node-versions\v25.5.0\installation\summarize.ps1" "https://example.com" --model free

# Extract slides from YouTube
& "C:\Users\spenc\AppData\Roaming\fnm\node-versions\v25.5.0\installation\summarize.ps1" "https://youtu.be/xyz" --slides
```

### Config
Config lives at `~/.summarize/config.json`. Uses existing API keys from env:
- `OPENROUTER_API_KEY` — for `--model free` or OpenRouter models
- `OPENAI_API_KEY` — for OpenAI models
- `ANTHROPIC_API_KEY` — for Claude models
- `GEMINI_API_KEY` — for Google models

### When to use
- Quick article/page summaries
- YouTube video digests
- Podcast transcription
- PDF extraction
- Research workflow

---

Add whatever helps you do your job. This is your cheat sheet.
