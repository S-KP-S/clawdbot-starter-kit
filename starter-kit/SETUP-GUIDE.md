# Clawdbot Setup Guide

Complete setup guide for a fully-loaded Clawdbot installation with AI assistant capabilities.

---

## Phase 1: Core Infrastructure

### 1.1 Prerequisites
- [ ] **Node.js 20+** — https://nodejs.org or use `fnm`/`nvm`
- [ ] **Git** — https://git-scm.com
- [ ] **Python 3.10+** — For some tools/scripts
- [ ] **WSL2** (Windows only) — For QMD and Unix tools

### 1.2 Install OpenClaw
```bash
npm install -g openclaw
openclaw --version
```

### 1.3 Initialize Workspace
```bash
mkdir ~/clawd && cd ~/clawd
openclaw init
```

---

## Phase 2: Model Providers (Accounts)

### 2.1 Anthropic (Primary — Claude)
- [ ] Sign up: https://console.anthropic.com
- [ ] Get API key
- [ ] Add to OpenClaw config: `anthropic.apiKey`

### 2.2 OpenRouter (Fallback/Alternative Models)
- [ ] Sign up: https://openrouter.ai
- [ ] Get API key
- [ ] Add to config: `openrouter.apiKey`
- [ ] Useful for: Grok (Twitter data), cheaper models

### 2.3 Groq (Free Tier — Cost Savings)
- [ ] Sign up: https://console.groq.com
- [ ] Get API key
- [ ] Save to `.secrets/groq-api-key.txt`
- [ ] Use for: Heartbeats, quick queries, parallel processing
- [ ] Models: `llama-3.3-70b-versatile` (500+ tokens/sec)

---

## Phase 3: Communication Channels

### 3.1 Telegram Bot
- [ ] Message @BotFather on Telegram
- [ ] `/newbot` → Name your bot
- [ ] Copy bot token
- [ ] Add to config:
```yaml
channels:
  telegram:
    botToken: "YOUR_BOT_TOKEN"
    ownerIds: ["YOUR_TELEGRAM_USER_ID"]
```
- [ ] Start chat with your bot, send `/start`

### 3.2 Email (AgentMail)
- [ ] Sign up: https://agentmail.to
- [ ] Create inbox (e.g., `yourbot@agentmail.to`)
- [ ] Get API key
- [ ] Save to `.env`:
```
AGENTMAIL_API_KEY=am_xxxxx
AGENTMAIL_EMAIL=yourbot@agentmail.to
```
- [ ] Add send/check scripts (see `scripts/agentmail-send.js`)

### 3.3 Phone/Voice (Vapi) — Optional
- [ ] Sign up: https://vapi.ai
- [ ] Get API key + phone number
- [ ] Create assistant with system prompt
- [ ] Configure tools: calendar, transfer, knowledge base
- [ ] Add to TOOLS.md for reference

---

## Phase 4: Integrations

### 4.1 Google Calendar
- [ ] Create OAuth app: https://console.cloud.google.com
- [ ] Enable Calendar API
- [ ] Download `credentials.json`
- [ ] Run auth flow: `node scripts/gcal.js auth`
- [ ] Tokens saved to `~/.config/google-calendar/tokens.json`

### 4.2 Voice/TTS (ElevenLabs) — Optional
- [ ] Sign up: https://elevenlabs.io
- [ ] Get API key
- [ ] Clone or select a voice, get voice ID
- [ ] Add to TOOLS.md

---

## Phase 5: Coding Agents

### 5.1 Kimi CLI (Recommended)
```bash
# Install
curl -fsSL https://moonshotai.github.io/kimi-cli/install.sh | bash

# Or Windows: download from releases
# https://github.com/MoonshotAI/kimi-cli/releases

# Authenticate
kimi auth

# Usage
kimi -y -p "Your prompt here"
```

### 5.2 Kilo Code (Free Tier)
```bash
npm install -g kilocode

# Usage
kilocode --auto --yolo -m code "Build something"
```

### 5.3 Claude Code (Anthropic)
```bash
npm install -g @anthropic-ai/claude-code

# Usage
claude -p "Your prompt" --allowedTools Edit,Write,Bash
```

---

## Phase 6: Knowledge & Search

### 6.1 QMD (Second Brain Search)
```bash
# Install via WSL/Linux
curl -fsSL https://bun.sh/install | bash
bun install -g qmd

# Index your docs
qmd index ~/documents --collection docs

# Search
qmd query "search term" -n 10
```

### 6.2 Web Search (Brave API) — Built into OpenClaw
- Already included via `web_search` tool
- No additional setup needed

---

## Phase 7: Local Tools

### 7.1 Whisper Transcription (Vibe)
- [ ] Download: https://thewh1teagle.github.io/vibe/
- [ ] Download model: `ggml-small.bin` or `ggml-medium.bin`
- [ ] Create transcription script (see `scripts/transcribe.ps1`)

### 7.2 Browser Extension
- [ ] Install from `send-to-openclaw/` directory
- [ ] Load unpacked extension in Chrome
- [ ] Use to send web content to your assistant

---

## Phase 8: Workspace Files

### 8.1 Create Core Files
```bash
touch AGENTS.md SOUL.md USER.md IDENTITY.md TOOLS.md MEMORY.md HEARTBEAT.md
mkdir memory skills scripts leads tmp
```

### 8.2 Configure .gitignore
```
# Secrets
.env
.secrets/
*.pem
*credentials*.json
tokens.json

# Personal data
MEMORY.md
TOOLS.md
memory/
leads/
tmp/
data/

# Models
models/
*.bin
```

### 8.3 Set Up AGENTS.md
Copy from `starter-kit/templates/AGENTS.md` — defines assistant behavior.

### 8.4 Set Up SOUL.md
Define personality, boundaries, and communication style.

### 8.5 Set Up USER.md
Document owner preferences, timezone, context.

---

## Phase 9: Skills Installation

### 9.1 Copy Starter Skills
```bash
cp -r starter-kit/skills/* skills/
```

### 9.2 Available Skills
| Skill | Description |
|-------|-------------|
| copywriting | Marketing copy for any page type |
| page-cro | Conversion rate optimization |
| email-sequence | Drip campaigns and lifecycle emails |
| seo-audit | Technical SEO review |
| pricing-strategy | Pricing and packaging decisions |
| ab-test-setup | Experiment design |
| analytics-tracking | GA4, GTM, conversion tracking |
| vercel-deploy | Deploy to Vercel |
| ... | 30+ more in starter-kit |

---

## Phase 10: Final Configuration

### 10.1 OpenClaw Config (`~/.openclaw/config.yaml`)
```yaml
agent:
  name: "YourBot"
  model: "anthropic/claude-sonnet-4-20250514"
  
providers:
  anthropic:
    apiKey: "sk-ant-xxxxx"
  openrouter:
    apiKey: "sk-or-xxxxx"
    
channels:
  telegram:
    botToken: "xxxxx"
    ownerIds: ["123456789"]
    
heartbeat:
  enabled: true
  intervalMs: 300000  # 5 minutes
  prompt: "Read HEARTBEAT.md if it exists..."
```

### 10.2 Start the Gateway
```bash
openclaw gateway start
```

### 10.3 Test
- Send a message to your Telegram bot
- Verify it responds
- Check `openclaw gateway logs` for issues

---

## Quick Reference: Account Checklist

| Service | Purpose | URL | Required |
|---------|---------|-----|----------|
| Anthropic | Claude models | console.anthropic.com | ✅ Yes |
| Telegram | Chat interface | t.me/BotFather | ✅ Yes |
| OpenRouter | Alt models | openrouter.ai | Recommended |
| Groq | Free fast LLM | console.groq.com | Recommended |
| AgentMail | Email | agentmail.to | Optional |
| Vapi | Phone/Voice | vapi.ai | Optional |
| ElevenLabs | TTS | elevenlabs.io | Optional |
| Google Cloud | Calendar | console.cloud.google.com | Optional |

---

## Troubleshooting

**Bot not responding:**
- Check `openclaw gateway status`
- Verify bot token in config
- Ensure you've started a chat with the bot

**API errors:**
- Verify API keys are correct
- Check provider status pages
- Review `openclaw gateway logs`

**Skills not loading:**
- Ensure `skills/` directory exists
- Check skill has `SKILL.md` file
- Verify skill is listed in available_skills

---

## Next Steps

1. Customize SOUL.md for your assistant's personality
2. Add owner-specific context to USER.md  
3. Document local tools/accounts in TOOLS.md
4. Set up HEARTBEAT.md for proactive behavior
5. Start building custom skills for your workflows

---

*Last updated: February 2026*
