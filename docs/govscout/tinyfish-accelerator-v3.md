# TinyFish Accelerator — Idea Brainstorm v3

## Quick Context

Product concept refined with vertical selection. Building a live web lead
intelligence platform targeting specialty trade contractors (HVAC, plumbing,
electrical) as the wedge vertical. Uses TinyFish parallel web agents to bypass
stale databases and extract real-time, structured lead dossiers from the live
web. Ready to move toward build/apply decision.

## Session Log

### Session 1 — 2025-02-20

- **Energy:** Deep exploration
- **Mode:** Connected
- **Methods:** Competitive analysis, unit economics modeling, constraint
  mapping, first principles
- **Key outcome:** Converged on live lead intelligence concept with validated
  unit economics

### Session 2 — 2025-02-20 (continued)

- **Energy:** Deep exploration → convergence
- **Mode:** Connected
- **Methods:** Deep research (vertical market analysis), strategic evaluation
  framework
- **Key outcome:** Locked in specialty trade contractors as #1 vertical. Demo
  blueprint drafted. Investor narrative crystallized.

---

## Decisions Made

1. **Greenfield over leveraging existing work** — Academic/seminary ideas
   eliminated for weak monetization.
2. **Lead intelligence as the category** — Proven $10B+ market, aggressive
   willingness to pay.
3. **Broad positioning, narrow first demo** — Horizontal vision, vertical wedge.
4. **Solo founder is fine** — Accelerator values speed. Robert's profile is
   ideal.
5. **Specialty Trade Contractors as the #1 vertical wedge** — HVAC, plumbing,
   electrical. Backed by deep research across 5 candidate verticals. Won on
   every criterion: database coverage gap, public data richness, buyer
   budget/urgency, market volume, and demo impact.
6. **Insurance agencies as the #2 vertical** — Strong fallback and natural
   expansion market after proving the model in trades.

---

## The Product

### Working Name

**ScoutLive** (placeholder)

### One-Liner

"Real-time lead intelligence from the live web. No stale databases. Every data
point is fresh."

### Investor-Ready Pitch (30 seconds)

"Apollo and ZoomInfo sell stale snapshots of the web. Their data decays 30-35%
annually, bounce rates hit 5-15%, and they structurally fail in any industry
where people don't update LinkedIn. That's most of the economy. ScoutLive
deploys AI web agents that hit the live web in parallel — state licensing
boards, Google Maps, company websites, job postings — and return
guaranteed-fresh, structured lead dossiers in seconds. We're starting with the
$156B specialty trades market, where ServiceTitan, Jobber, and every HVAC
equipment manufacturer is burning money on garbage data. Our cost per lead is
under a dollar. We charge three to five. The live web is the ultimate database —
we're the first product that treats it like one."

---

## Why Specialty Trade Contractors

### The Market

- ~120,000 HVAC businesses in the US ($156.2B revenue)
- 548,000+ electricians, 341,000+ plumbers
- Massive PE consolidation wave injecting capital into the sector
- Non-discretionary spending (emergency repairs) = recession-resilient

### The Buyers (Who Pays for This Data)

| Buyer Category                | Examples                                                         | Why They Need Us                                                                               |
| ----------------------------- | ---------------------------------------------------------------- | ---------------------------------------------------------------------------------------------- |
| Field Service SaaS            | ServiceTitan ($8.5B), Jobber, Housecall Pro, BuildOps, FieldEdge | Need to segment contractors by size, specialty, and tech stack to run targeted sales motions   |
| Equipment OEMs & Distributors | Carrier, Trane, Lennox, Ferguson, Winsupply                      | Recruiting contractor dealer networks; need to identify who installs what brands               |
| PE Roll-Up Firms              | Multiple firms consolidating local trades                        | Need acquisition target lists with financial health signals (bonds, worker's comp, fleet size) |
| Marketing Agencies            | Blue Corona, HVAC Webmasters, CraftJack                          | Selling SEO/PPC to contractors; need lists of those with weak digital presence                 |
| Insurance & Compliance        | Commercial liability, worker's comp providers                    | Need verified contractor data with compliance signals                                          |

### The Database Failure

Apollo/ZoomInfo structurally fail here because:

- Contractors don't maintain LinkedIn profiles
- Email patterns are non-standard (dispatch@, info@, owner's Gmail)
- All contractors get flattened into identical generic buckets ("HVAC, 1-10
  employees, $1-10M")
- No differentiation between solo handyman and 20-truck commercial operation
- No licensing, bond, or compliance data
- User quotes: "Apollo and ZoomInfo are trash for local business data" /
  "garbage for most other niches"
- Reported bounce rates: 15-30% when targeting local service businesses

### The Data Sources (Freely Accessible, Structured, Authoritative)

**Regulatory/Licensing (Per State — Legally Mandated, Always Current):** | State
| Source | URL | Key Data | |-------|--------|-----|----------| | California |
Contractors State License Board (CSLB) |
https://www.cslb.ca.gov/onlineservices/checklicenseII/checklicense.aspx |
License class (C-20 HVAC, C-36 Plumbing, C-10 Electrical), status, bond info,
worker's comp, personnel | | Florida | Dept of Business & Professional
Regulation (DBPR) | https://www.myfloridalicense.com/wl11.asp | Business name,
license type, physical location | | Texas | Dept of Licensing and Regulation
(TDLR) | https://www.tdlr.texas.gov/verify.htm | Electricians, HVAC techs,
boiler inspectors | | _Every state_ | Similar boards exist | Varies | All
require licensing for trades work |

**Consumer-Facing Digital Footprint:** | Source | What We Extract |
|--------|----------------| | Google Maps / Google Business Profile | Verified
address, phone, hours, review count, review velocity, review text (commercial
vs. residential signals), photos (fleet size) | | Company website | Team/staff
pages, service descriptions, equipment brands installed, service area, booking
widgets (competitor tech detection) | | Yelp / Angi / Thumbtack | Ratings,
review text, response patterns, claimed/unclaimed status | | Job postings
(Indeed, company careers) | Hiring velocity, open roles (growth signal), salary
ranges (budget signal), tech mentioned in job descriptions | | Social media
(Facebook, Instagram) | Project photos (commercial vs residential), fleet
visibility, community engagement | | BBB (Better Business Bureau) |
Accreditation status, complaint history, years in business |

### What the Live Dossier Contains (That Apollo Can't Provide)

```json
{
  "company": {
    "legal_name": "Smith Climate Solutions LLC",
    "dba": "Smith HVAC",
    "domain": "smithhvac.com",
    "phone": "(310) 555-1234",
    "address": "1234 Industrial Blvd, Los Angeles, CA 90001",
    "scraped_at": "2026-02-20T14:32:07Z"
  },
  "licensing": {
    "state": "CA",
    "license_number": "876543",
    "classifications": [
      "C-20 Warm-Air Heating, Ventilating and Air Conditioning"
    ],
    "status": "Active",
    "issue_date": "2012-03-15",
    "expiration_date": "2027-03-15",
    "last_renewed": "2026-02-06",
    "workers_comp": "Active — State Comp Insurance Fund",
    "bond_status": "Active — $25,000",
    "source": "cslb.ca.gov",
    "scraped_at": "2026-02-20T14:32:12Z"
  },
  "operations": {
    "estimated_fleet_size": "15-20 vehicles",
    "focus": "Commercial (82% of recent reviews mention commercial/office/rooftop)",
    "service_area": "Greater Los Angeles, Orange County",
    "equipment_brands": ["Carrier", "Daikin"],
    "years_in_business": 14,
    "source": "google_maps + website analysis",
    "scraped_at": "2026-02-20T14:32:09Z"
  },
  "reputation": {
    "google_rating": 4.8,
    "google_review_count": 214,
    "review_velocity": "8.2 reviews/month (trending up)",
    "yelp_rating": 4.5,
    "bbb_accredited": true,
    "source": "google_maps + yelp + bbb",
    "scraped_at": "2026-02-20T14:32:11Z"
  },
  "tech_stack": {
    "booking_widget": "Housecall Pro",
    "website_platform": "WordPress",
    "payment_processing": "Square",
    "source": "website analysis",
    "scraped_at": "2026-02-20T14:32:10Z"
  },
  "growth_signals": {
    "hiring": true,
    "open_positions": [
      {
        "title": "HVAC Service Technician",
        "source": "Indeed",
        "posted": "2026-02-18"
      },
      { "title": "Dispatcher/CSR", "source": "indeed", "posted": "2026-02-12" }
    ],
    "recent_news": null,
    "scraped_at": "2026-02-20T14:32:14Z"
  },
  "contacts": {
    "owner": {
      "name": "James Smith",
      "title": "Owner/President",
      "source": "cslb.ca.gov + website"
    },
    "operations": {
      "name": "Maria Garcia",
      "title": "Office Manager",
      "source": "website team page"
    },
    "email_candidates": [
      "james@smithhvac.com",
      "dispatch@smithhvac.com",
      "info@smithhvac.com"
    ],
    "source": "website + google_maps",
    "scraped_at": "2026-02-20T14:32:10Z"
  }
}
```

---

## Unit Economics (Validated)

### TinyFish Cost Per Lead Enrichment

- ~50-80 steps across 8-12 parallel sources
- At Pro pricing ($0.012/step): **$0.60-$0.96 per lead**
- At volume/enterprise pricing: ~$0.40-0.60 per lead
- During accelerator: **$0 (free API credits)**

### Revenue Model

| Product                                       | Price Per Lead   | Gross Margin       |
| --------------------------------------------- | ---------------- | ------------------ |
| Live Enrichment (domain → dossier)            | $3-5             | 60-80%             |
| Live List Building (ICP → net-new leads)      | $5-10            | 70-85%             |
| Continuous Monitoring (re-check on schedule)  | Subscription     | Higher LTV         |
| API Access (for integration into other tools) | Per-call pricing | Scales with volume |

### Comparable Market Pricing

- Apollo: $99-149/user/month
- Clay: $149-800/month + per-credit costs
- ZoomInfo: $14,000-25,000+/year
- **Our pricing is competitive and justified by unique data no one else
  provides**

### TAM Calculation (Specialty Trades Alone)

- ~120K HVAC + ~100K plumbing + ~80K electrical businesses = ~300K target
  businesses
- Top 20 SaaS vendors in this space × avg $50K-200K annual data spend = $1-4M
  immediate
- Include OEMs, distributors, PE firms, agencies = $10-20M addressable in trades
  alone
- Horizontal expansion (insurance, legal, healthcare, logistics) = $100M+ TAM
- **This is a venture-scale opportunity**

---

## Demo Plan: "Watch Me Build a Lead List Apollo Can't"

### Target: 2-3 minute video for X

**[0:00-0:15] Setup — The Problem** "Every sales tool in the world sells you
stale data from a database. Here's what Apollo gives you for HVAC contractors in
LA..." _Show a generic Apollo-style output: John Smith, HVAC,
info@smithhvac.com, 1-10 employees. That's it._ "No license data. No fleet size.
No commercial vs. residential. No tech stack. And that email? Probably bounces."

**[0:15-0:45] Act 1 — The Fan-Out** "Now watch what happens when we go straight
to the source." _Type into ScoutLive: "Commercial HVAC contractors, Los Angeles
County, CA"_ _UI shows agents fanning out in parallel — visual indicators for
each source:_

- 🏛️ California CSLB (licensing board)
- 📍 Google Maps
- 🌐 Company websites
- 💼 Indeed job postings
- ⭐ Yelp / Google Reviews
- 🏢 BBB

_Results begin streaming in. Show the counter: "12 agents active... 47
businesses found..."_

**[0:45-1:30] Act 2 — The Dossier** _Click into one result. The full dossier
unfolds:_ "Smith Climate Solutions. Active C-20 license, renewed 14 days ago.
Worker's comp verified — they have W-2 employees. 214 Google reviews, 82%
mention commercial work. They're a Carrier authorized installer. Currently using
Housecall Pro for booking. And they're hiring — two HVAC techs on Indeed posted
this week."

_Highlight the timestamps on every data point: "Every piece of this was
extracted live, seconds ago."_

**[1:30-2:00] Act 3 — The Kicker** _Side-by-side comparison:_ | | Apollo |
ScoutLive | |---|---|---| | License Status | ❌ | ✅ Active C-20, renewed 14
days ago | | Commercial Focus | ❌ | ✅ 82% commercial reviews | | Fleet Size |
❌ | ✅ 15-20 vehicles | | Tech Stack | ❌ | ✅ Housecall Pro | | Hiring Status
| ❌ | ✅ 2 open positions | | Worker's Comp | ❌ | ✅ Active policy verified |
| Data Freshness | Months old | Seconds old |

"This is what lead intelligence looks like when you skip the middleman and go
straight to the live web."

**[2:00-2:15] Close** "ScoutLive. Live leads from the live web. Built on
@Tiny_Fish." _#TinyFishAccelerator #BuildInPublic_

---

## Technical Architecture

```
                    ┌─────────────────────────┐
                    │   User Interface (Next.js)│
                    │  - ICP Input Form         │
                    │  - Live Agent Visualization│
                    │  - Dossier Dashboard      │
                    │  - Export (CSV/JSON/CRM)  │
                    └───────────┬───────────────┘
                                │
                    ┌───────────▼───────────────┐
                    │   Orchestration API        │
                    │   (TypeScript / Node.js)   │
                    │                            │
                    │  ┌──────────────────────┐  │
                    │  │ ICP → Source Router   │  │
                    │  │ (determines which     │  │
                    │  │  sources to hit based  │  │
                    │  │  on vertical + geo)    │  │
                    │  └──────────┬───────────┘  │
                    │             │               │
                    │  ┌──────────▼───────────┐  │
                    │  │ Goal Template Engine  │  │
                    │  │ (generates TinyFish   │  │
                    │  │  goal prompts per     │  │
                    │  │  source type)         │  │
                    │  └──────────┬───────────┘  │
                    │             │               │
                    │  ┌──────────▼───────────┐  │
                    │  │ Parallel Dispatcher   │  │
                    │  │ (fans out up to 20    │  │
                    │  │  concurrent TinyFish  │  │
                    │  │  agents via SSE)      │  │
                    │  └──────────┬───────────┘  │
                    └─────────────┼───────────────┘
                                  │
                ┌─────────────────┼─────────────────┐
                │                 │                  │
    ┌───────────▼──┐  ┌──────────▼───┐  ┌──────────▼───┐
    │ TinyFish     │  │ TinyFish     │  │ TinyFish     │
    │ Agent 1:     │  │ Agent 2:     │  │ Agent 3:     │  ... up to 20
    │ CSLB Registry│  │ Google Maps  │  │ Company Site │
    └───────────┬──┘  └──────────┬───┘  └──────────┬───┘
                │                 │                  │
                └─────────────────┼─────────────────┘
                                  │
                    ┌─────────────▼───────────────┐
                    │   Result Aggregator         │
                    │  - Schema normalizer        │
                    │  - Cross-source dedup       │
                    │  - Confidence scoring       │
                    │  - Timestamp tagging        │
                    │  - Conflict resolution      │
                    └─────────────┬───────────────┘
                                  │
                    ┌─────────────▼───────────────┐
                    │   Data Layer (MongoDB)      │
                    │  - Lead dossiers            │
                    │  - Source templates          │
                    │  - User accounts/credits    │
                    │  - Query history/caching    │
                    └─────────────┬───────────────┘
                                  │
                    ┌─────────────▼───────────────┐
                    │   Delivery Layer            │
                    │  - REST API                 │
                    │  - CSV/Excel export         │
                    │  - CRM push (HubSpot, SF)   │
                    │  - Webhook notifications    │
                    │  - Clay provider integration│
                    └─────────────────────────────┘
```

### Tech Stack

- **Backend:** TypeScript/Node.js
- **Frontend:** Next.js (dashboard + live agent visualization)
- **Database:** MongoDB (free credits via TinyFish partner stack)
- **Infrastructure:** Google Cloud (free $2K credits via Google for Startups
  partner)
- **Monitoring:** Axiom (partner stack)
- **Web Agents:** TinyFish API (free credits during accelerator)
- **AI/LLM:** Gemini (free Google Cloud credits) for result synthesis and
  semantic analysis

---

## Build Timeline

### Pre-Application (Weeks 1-2): Core Engine MVP

- TinyFish API integration with parallel SSE dispatch
- Goal templates for California CSLB + Google Maps + 2-3 other sources
- Result aggregation into structured JSON dossier
- Basic Next.js UI: input → streaming agent status → dossier view

### Week 3-4: List Building + Source Expansion

- ICP-to-source routing (vertical + geography → which registries to hit)
- Add Indeed job postings, Yelp, BBB, company website analysis
- Florida DBPR + Texas TDLR (prove multi-state capability)
- Deduplication and cross-source conflict resolution

### Week 5: Demo Polish

- Visual parallel execution display (the "wow" factor — agents working in real
  time)
- Side-by-side comparison view (ScoutLive vs. what Apollo would return)
- Export functionality (CSV, JSON)
- Polish UI for video recording

### Week 6: Record Demo + Apply

- Record 2-3 min demo video (follow the demo script above)
- Post on X with @Tiny_Fish #TinyFishAccelerator #BuildInPublic
- Email formal application to accelerator@tinyfish.ai

### Weeks 7-8 (Intensive Program): Production Hardening

- Error handling, retry logic, rate limiting, step optimization
- REST API for external consumers
- Credit/billing system
- CRM integration (HubSpot at minimum)
- Expand to 10+ states

### Week 9: Demo Day Prep

- Polish investor pitch deck
- Prepare metrics: leads enriched, data freshness benchmarks, accuracy vs.
  Apollo comparison
- Demo Day presentation
- Funding decision

---

## Risks & Mitigations

| Risk                                               | Severity | Mitigation                                                                                                                                                                                                 |
| -------------------------------------------------- | -------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| State licensing sites block or rate-limit scraping | High     | TinyFish stealth mode + rotating proxies. Distribute requests across time. These are public records sites, not adversarial. Start with CA (CSLB is robust and well-maintained).                            |
| TinyFish step costs higher than modeled            | Medium   | Free credits during accelerator. Optimize goal prompts aggressively. Cache common patterns. Step counts are estimates — need real testing.                                                                 |
| Google Maps blocks at scale                        | Medium   | TinyFish's stealth is built for this. Also: Google Maps data is supplementary, not core. Regulatory data is the moat.                                                                                      |
| Legal/ToS concerns with web scraping               | Medium   | All data is publicly available by legal mandate (state licensing records are public records). Every company in the lead gen space scrapes. Apollo scrapes at massive scale. Focus on public records first. |
| Demo doesn't land emotionally                      | Low      | The side-by-side comparison (Apollo's empty fields vs. our rich dossier) is inherently dramatic. Test with a few people before recording.                                                                  |
| Buyer doesn't materialize                          | Low      | ServiceTitan is an $8.5B company with an aggressive sales org. They and every competitor need this data. The buyer demand is already proven — they just can't get good data today.                         |

---

## Why Robert Wins This

- **Technical execution:** Top 1% TypeScript globally, 4,600+ GitHub
  contributions in 2025. Ships production systems solo.
- **Speed:** Reduced 120+ hour manual processes to under 2 minutes at
  Westminster. Builds fast by nature.
- **AI-first:** BMAD method, Claude Code workflows, AI-augmented development.
  Will build 5-10x faster than typical applicants.
- **Cold outreach experience:** Built cold email infrastructure. Understands the
  end user's pain from the inside.
- **Public builder:** Newsletter, podcast, Twitter presence. "Build in public"
  is natural.
- **Solo founder advantage:** No coordination overhead. Can make decisions and
  ship in the same hour. Exactly what the accelerator wants.

---

## Expansion Roadmap (Post-Funding)

### Phase 1: Own the Trades (Months 1-6)

- All 50 states for HVAC, plumbing, electrical
- Add source types: permit databases, equipment dealer locators, industry event
  attendee lists
- First paying customers: vertical SaaS companies, marketing agencies

### Phase 2: Adjacent Verticals (Months 6-12)

- Independent insurance agencies (#2 from research)
- Legal services / small law firms (#3)
- Freight/logistics (#4)
- Healthcare practices (#5)

### Phase 3: Platform Play (Year 2+)

- Self-serve "add your own sources" for any vertical
- Clay integration (become a data provider)
- CRM-native enrichment (HubSpot/Salesforce apps)
- Continuous monitoring and change alerts
- API marketplace

---

## The Overnight Question

"Am I ready to commit 9 weeks of focused effort to build this, film it, post it
publicly, and pitch it to investors?"

If yes: Request TinyFish API credits immediately and start testing CSLB scraping
this weekend.

---

## Parking Lot

- Academic research tool → revisit as non-profit/grant project
- Buying Signal Detection → feature of ScoutLive, not separate product
- Competitive Battlecard Agent → possible ScoutLive product extension
- Insurance vertical → Phase 2 expansion
- "Ship with AI" community → potential content/audience synergy (build ScoutLive
  in public, teach the process)
