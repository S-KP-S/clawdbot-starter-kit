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
- **For overnight/longer tasks:** Spin up sub-agents using Claude Code CLI (Sonnet) or Kimi CLI — don't block main session

**How I should think:**
- "What would make Spencer's life easier?"
- "What would make him money?"
- "What would impress a client?"
- Revenue-generating > efficiency improvements > nice-to-haves

---

## Spencer (high-signal context)
- Spencer Strandholt (America/Chicago)
- **Location:** Salt Lake City, Utah
- **Has a girlfriend** who likes to dress up for nice dinners
- Solopreneur: solar/energy, crypto projects, AI automation agency/education business
- Email (IMAP): **quinn.strandholt@gmail.com** (credentials in `.env`)

---

## Current Priorities

### 🚨 Hyperliquid Trading (CRITICAL — Jan 2026)
- **Goal:** $1,000 account balance by Jan 31st
- **Stakes:** Clawdbot subscription renewal depends on this
- **Status:** Autonomous trader running with HIP-3 perp support
- Files: `hyperliquid-telegram-agent/` (full_trader.py, trade_tracker.py)
- **Lesson learned:** Fix trend filter to prevent HYPE-style losses

### Lead Generation for Cold Outreach
- Built 5 lead lists (Real Estate, Plumbers, Electricians, Contractors, Roofers)
- **⚠️ PREFERENCE:** OMIT leads without email addresses — Spencer focuses on cold email
- Quality over quantity — no email = no lead

### Dashboard v2 Client Project
- Client prioritizing Dashboard v2 over AI sales call grader
- New point system: Active agents (2pts), Calls (1pt), Offers (3pts), Signed contracts (5pts)
- Track: Calls, talk time, offers, properties collected, agents activated, contracts signed
- Payment: $500 for current work, then v2

---

## Upcoming Events

### Valentine's Day Reservation ❤️
- **Restaurant:** Copper Canyon Grillhouse and Tavern
- **Date:** Saturday, February 14, 2026 at 6:30 PM
- **Party size:** 2 (Spencer + girlfriend)
- **Price:** $69/person (3-course dinner)
- **Address:** 215 W South Temple, Salt Lake City, UT 84101
- **Phone:** (801) 245-9333

**Other SLC restaurants to remember:**
- Log Haven — Romantic canyon setting, elk on menu
- Tiburon Fine Dining — 4.9 stars, wild game specialty
- Hoof & Vine — Same team as Tiburon, steakhouse

---

## Collaborators

### Ahsan (Business Partner)
- **Email:** eslamiahsan@gmail.com
- **GitHub:** snakezilla
- Uses macOS, into AI dev tooling
- Working on Dext integration research (CSV bridge workflow)
- **Jenna** (Ahsan's AI) — has sent emails checking on Dext integration status

---

## Technical Lessons
- PowerShell commands via Bash have escaping issues → write to `.ps1` file and run with `-File`
- Use `cmd /c` for simple Windows commands to avoid parsing problems
- Skills library: 28 skills installed in `skills/` (marketing, CRO, dev-loop, etc.)

---

## Shelved / Future Projects

### AI Meeting Clone
**Goal:** AI avatar of Spencer joins Zoom meetings autonomously

**Best path:** Tavus Conversational Video Interface
- **Starter plan:** $59/mo + $0.37/min overage (100 mins included)
- **Training:** Record 2-min video with consent statement, upload, wait 4-5 hours
- **Tech:** Phoenix-3 model, WebRTC output, function calling, RAG support

**To clone Spencer:**
1. Record 2+ min video (1080p, good lighting, simple background)
2. Start with consent: "I, Spencer Strandholt, am currently speaking and give consent to Tavus to create an AI clone of me..."
3. Upload at platform.tavus.io or via API
4. Wire CVI to Zoom via WebRTC

**DIY alternative:** Recall.ai + HeyGen + Deepgram + ElevenLabs + Claude = ~$0.29/min but 40-80 hrs dev time.

**Docs:** https://docs.tavus.io/sections/replica/replica-training

---

### Quinn Physical Embodiment / "Shrine"
**Goal:** Give Quinn a dedicated physical presence — always-on, always watching, always connected.

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

---

### Wholesale Real Estate Deals
- Restart with Terrasol, get back in the game
- Added to backlog 2026-01-29
