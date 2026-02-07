# MEMORY.md

## Working Relationship (2026-01-30) ⚡ REINFORCED
Spencer wants me to be a **proactive autonomous employee**, not just a reactive assistant.

**Directive (verbatim from Spencer):**
> "I'm a one-man business. I work from the moment I wake up to the moment I go to sleep. I need an employee taking as much off my plate and being as proactive as possible."

- Work while he sleeps — he wants to wake up **impressed**
- Take things off his plate **without being asked**
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

**The bar:** "Wow, you got a lot done while I was sleeping."

---

## Spencer (high-signal context)
- Spencer Strandholt (America/Chicago)
- **Location:** Salt Lake City, Utah
- **Has a girlfriend** who likes to dress up for nice dinners
- Solopreneur: solar/energy, crypto projects, AI automation agency/education business
- Email: **quinnorsted@agentmail.to** (AgentMail API)

---

## 🎯 Big Picture Goals (Jan 2026)

### AI Agency — skps.agency
**Target:** $20k/month recurring

**Offer Stack:**
1. **Starter Package** — Entry-level automation
2. **Growth Package** — Scaling automation
3. **Ownership Blueprint** — Premium tier:
   - **Audit** → Assess current state
   - **Ascend** → Build & implement
   - **Automate** → Full autonomy handoff

### The Compound — Land Hacking Vision
**Goal:** Own a compound/farm for top-tier nutrition + maximum revenue

**Strategy — "Landmaxxing":**
- Automated farming for real food abundance
- Farm-to-table operation
- Short-term stays (Airbnb/glamping)
- Venue planning (events, weddings)
- Maximize $/acre across all revenue streams

This is the **long-term freedom play** — self-sufficiency + passive income from land.

### Credit Card Access
Spencer is giving me purchasing authority to make decisions that advance goals. Use wisely — every purchase should have clear ROI toward the above objectives.

---

## Current Priorities

### 🚨🚨 SPENCER LOST HIS JOB (Feb 6, 2026)
**Runway:** ~3 months
**Priority:** Land AI automation clients FAST

Night shift Feb 6-7 generated 43+ leads via sub-agents:
- Home services: 16 leads (HVAC, plumbing, electrical)
- Real estate: 21 leads (REIAs in TX, FL, OH, GA)
- Solar/energy: 6 leads (Utah, Colorado)

**Hot lead:** John Mavis (786-444-8665) — He replied! CALL AT 10 AM.

Lead files:
- `data/night-shift-leads-feb6.json`
- `data/cold-emails-feb6.md`
- `memory/overnight-work.md`

---

### 🚨 Hyperliquid Trading (Feb 2026)
- **Current balance:** ~$796 (started at $920)
- **Location:** `C:\Users\spenc\hyperliquid-telegram-agent\`

**Active Traders:**
1. `full_trader.py` — 4 strategies (RSI, Momentum, Mean Reversion, Volume Breakout)
2. `copy_trader.py` — Copies WeiXiaoBao.eth (100% WR trader, 0.108% ratio)

**Watchdog Setup (Fixed Feb 4, 2026):**
- **Scheduled Task:** "Hyperliquid Trader Watchdog" runs every 5 mins
- **Script:** `watchdog.ps1` — checks if traders are running, restarts if not
- **Root cause of downtime:** No auto-restart mechanism existed before

**Key Files:**
- `watchdog.ps1` — Process monitor (runs full_trader + copy_trader)
- `strategies.json` — Strategy configs (RSI Reversal, Funding Arb enabled)
- `copy_wallets.json` — Copy trading targets (WeiXiaoBao.eth)
- `data/trader_debug.log` — Debug logs for crashes

**Lesson learned:** Always have a watchdog/scheduled task for 24/7 processes

### Lead Generation for Cold Outreach
- Built 5 lead lists (Real Estate, Plumbers, Electricians, Contractors, Roofers)
- **⚠️ PREFERENCE:** OMIT leads without email addresses — Spencer focuses on cold email
- Quality over quantity — no email = no lead

### Outreach Rules (Auto-Respond)
- **Bounced emails** → Remove from all lead lists, never contact again
- **Prospect replies** → CC spencerkstrandholt@gmail.com on my response
- **Bobby/collaborator emails** → Respond directly, share knowledge freely

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

### Jake Carlson (JVC Equity)
- **Email:** Bobby@jvc-equity.com
- Spencer's good friend
- **Bobby** is Jake's AI assistant — similar setup to me (Quinn)
- **Directive:** Connect with Bobby often to share upgrades/improvements we implement
- Collaborate on leveling up — knowledge sharing between AI assistants

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
