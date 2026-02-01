# Setup Checklist

Quick checklist for getting your assistant up and running.

## ✅ Essential (Do First)

- [ ] Install Clawdbot: `npm install -g clawdbot`
- [ ] Create workspace folder
- [ ] Copy `templates/*` to your workspace
- [ ] Rename `.env.example` to `.env`
- [ ] Run `clawdbot` and complete bootstrap conversation
- [ ] Connect Telegram (or your preferred channel)

## 📱 Connect a Channel

Pick one to start:

### Telegram (Recommended for beginners)
1. Message @BotFather on Telegram
2. Send `/newbot` and follow prompts
3. Copy the bot token
4. Run `clawdbot config telegram`
5. Paste token when prompted

### WhatsApp
1. Run `clawdbot config whatsapp`
2. Scan QR code with your phone
3. Your personal WhatsApp is now connected

### Discord
1. Create bot at discord.com/developers
2. Get bot token
3. Run `clawdbot config discord`

## 📅 Calendar Integration

1. Go to Google Cloud Console
2. Create project, enable Calendar API
3. Create OAuth credentials (Desktop app)
4. Download `credentials.json`
5. Run `node scripts/gcal.js auth`
6. Complete OAuth flow in browser

## 📧 Email Integration

1. Create a Gmail account for your assistant (recommended)
2. Enable 2FA on the account
3. Generate an App Password: Google Account → Security → App Passwords
4. Add to `.env`:
   ```
   EMAIL_USER=assistant@gmail.com
   EMAIL_PASS=your-app-password
   ```

## 🎙️ Voice (Advanced)

### Vapi (Phone Number)
1. Sign up at vapi.ai
2. Buy a phone number
3. Create an assistant
4. Add API key to `.env`

### ElevenLabs (TTS)
1. Sign up at elevenlabs.io
2. Get API key from profile
3. Pick or clone a voice
4. Add to `.env` and note voice ID in `TOOLS.md`

## 🔄 Heartbeats (Optional)

Set up cron to ping your assistant periodically:

```bash
# Every 15 minutes
*/15 * * * * clawdbot heartbeat
```

Or use Clawdbot's built-in cron:
```bash
clawdbot cron add --schedule "*/15 * * * *" --text "Check in"
```

---

## Troubleshooting

**Bot not responding on Telegram?**
- Check bot token is correct
- Make sure you started a chat with the bot
- Check `clawdbot status`

**Calendar not working?**
- Re-run `node scripts/gcal.js auth`
- Check credentials.json exists
- Delete tokens.json and re-auth

**Need help?**
- Docs: https://docs.clawd.bot
- Discord: https://discord.com/invite/clawd
