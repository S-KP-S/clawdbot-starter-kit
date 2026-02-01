# 🦊 Clawdbot Starter Kit

A ready-to-use foundation for setting up your own AI assistant with [Clawdbot](https://github.com/clawdbot/clawdbot).

Built by Spencer Strandholt — battle-tested patterns from running a personal AI assistant daily.

---

## Quick Start

### 1. Install Clawdbot
```bash
npm install -g clawdbot
```

### 2. Set Up Your Workspace
```bash
# Create your workspace
mkdir ~/my-assistant
cd ~/my-assistant

# Copy the templates from this starter kit
cp -r /path/to/starter-kit/templates/* .

# Initialize git (recommended)
git init
```

### 3. First Run
```bash
clawdbot
```

Your assistant will read `BOOTSTRAP.md` and walk you through setup:
- Choosing a name and personality
- Connecting messaging (Telegram, WhatsApp, etc.)
- Setting up integrations

### 4. Connect a Channel
The easiest start is Telegram:
```bash
clawdbot config telegram
```

---

## What's Included

### Templates (`templates/`)
| File | Purpose |
|------|---------|
| `AGENTS.md` | Operating procedures — how the assistant behaves |
| `SOUL.md` | Personality template — customize your assistant's vibe |
| `USER.md` | About you — context your assistant needs |
| `BOOTSTRAP.md` | First-run setup conversation |
| `HEARTBEAT.md` | What to check when idle |
| `TOOLS.md` | Integration notes template |

### Scripts (`scripts/`)
- `gcal.js` — Google Calendar integration
- `send-email.js` — Send emails via Gmail
- `check-email.js` — Check inbox for unread

### Skills (`skills/`)
Custom skills for marketing, CRO, copywriting, and more.

---

## Recommended Integrations

### Voice (Vapi + ElevenLabs)
Give your assistant a phone number and voice:
1. Sign up at [vapi.ai](https://vapi.ai) — get a phone number
2. Sign up at [elevenlabs.io](https://elevenlabs.io) — clone or pick a voice
3. Connect them in Vapi dashboard
4. Add credentials to `TOOLS.md`

### Calendar (Google Calendar)
```bash
# Run the OAuth flow
node scripts/gcal.js auth
```

### Email (Gmail)
Create an App Password in Google Account settings, add to `.env`:
```
EMAIL_USER=your-assistant@gmail.com
EMAIL_PASS=your-app-password
```

---

## Directory Structure

After setup, your workspace should look like:
```
my-assistant/
├── AGENTS.md          # How to operate
├── SOUL.md            # Personality
├── USER.md            # About you
├── IDENTITY.md        # Assistant's identity (created during bootstrap)
├── TOOLS.md           # Integration notes
├── HEARTBEAT.md       # Proactive checks
├── MEMORY.md          # Long-term memory
├── memory/            # Daily logs
│   └── 2026-01-29.md
├── scripts/           # Utility scripts
├── skills/            # Custom skills
└── .env               # Secrets (gitignored)
```

---

## Tips

1. **Memory is everything** — Your assistant wakes up fresh each session. Files ARE their memory.

2. **Start simple** — Get Telegram working first, then add voice/calendar/email.

3. **Customize SOUL.md** — This shapes how your assistant talks. Make it yours.

4. **Use heartbeats** — Set up cron jobs to let your assistant check in proactively.

5. **Commit often** — Your assistant can (and should) commit their own changes.

---

## Support

- [Clawdbot Docs](https://docs.clawd.bot)
- [Discord Community](https://discord.com/invite/clawd)
- [GitHub Issues](https://github.com/clawdbot/clawdbot/issues)

---

*Made with 🐾 by Quinn & Spencer*
