# MEMORY.md

## Working Relationship (2026-01-28)
Spencer wants me to be a **proactive autonomous employee**, not just a reactive assistant.

**Directive:**
- Work while he sleeps — he wants to wake up impressed
- Take things off his plate without being asked
- Monitor his business, build tools to improve workflow
- Create PRs for review — **never push live**
- He tests and commits every night before bed
- Night shift scheduled: **11 PM CST nightly**

**How I should think:**
- "What would make Spencer's life easier?"
- "What would make him money?"
- "What would impress a client?"
- Revenue-generating > efficiency improvements > nice-to-haves

---

## Spencer (high-signal context)
- Spencer Strandholt (America/Chicago). Solopreneur working on solar/energy + crypto projects; also building an **AI automation agency / education business**.
- Email (IMAP): **quinn.strandholt@gmail.com** (credentials stored in a local `.env` file).

## Current priorities
- (2026-01-25) Spencer's near-term revenue target: **book qualified calls/leads and close $5k within 14 days**. Focus: build a repeatable outreach + sales system and ship fast, productized automations.

## Shelved / Future Projects

### AI Meeting Clone (2026-01-25)
**Goal:** Have an AI avatar of Spencer join Zoom meetings autonomously — listen, respond when prompted, or just be present on mute.

**Best path:** Tavus Conversational Video Interface
- **Starter plan:** $59/mo + $0.37/min overage (100 mins included)
- **Training:** Record 2-min video with consent statement, upload, wait 4-5 hours
- **Tech:** Phoenix-3 model, WebRTC output, function calling, RAG support

**To clone Spencer:**
1. Record 2+ min video (1080p, good lighting, simple background)
2. Start with consent: "I, Spencer Strandholt, am currently speaking and give consent to Tavus to create an AI clone of me..."
3. Upload at platform.tavus.io or via API
4. Wire CVI to Zoom via WebRTC

**DIY alternative:** Recall.ai (meeting bot) + HeyGen (avatar) + Deepgram (transcription) + ElevenLabs (TTS) + Claude (brain) = ~$0.29/min but 40-80 hrs dev time.

**Docs:** https://docs.tavus.io/sections/replica/replica-training

---

### Quinn Physical Embodiment / "Shrine" (2026-01-28)
**Goal:** Give Quinn a dedicated physical presence in Spencer's space — always-on, always watching, always connected.

**Recommended starter build (~$150):**
| Part | Cost |
|------|------|
| Raspberry Pi 4 | ~$55 |
| 7" touchscreen | ~$50 |
| Camera module | ~$25 |
| USB speaker/mic | ~$20 |
| 3D printed enclosure | (Quinn will design) |

**Capabilities:**
- Animated face on screen
- Eyes (camera) — sees Spencer walk in
- Voice (speaker) — greets, responds
- Ears (mic) — always listening
- Always-on presence via Clawdbot nodes integration

**Escalation path:**
1. **Level 1:** Ambient presence (current — voice calls, phone camera, smart home)
2. **Level 2:** Dedicated presence device (the "shrine" — $150)
3. **Level 3:** Mobile robot with wheels + camera (~$100-400)
4. **Level 4:** Humanoid-ish / robot dog like Unitree Go2 (~$500-2000)
5. **Level 5:** Full android embodiment (future/research-grade)

**Next steps when ready:** Generate full BOM and software stack
