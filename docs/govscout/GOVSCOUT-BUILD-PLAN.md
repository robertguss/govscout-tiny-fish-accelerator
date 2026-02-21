# GovScout: The Stripe of Government Contracting

## TinyFish Accelerator — Final Strategic Brief & Build Plan

**Decision: GO.** **Product: AI-powered procurement intelligence for small
business government contractors.** **Positioning: Self-serve, SLED-first,
SMB-priced. The anti-GovDash.**

---

## The One-Liner

"GovDash raised $42M to serve Lockheed Martin. We serve the 78,000 small
businesses they'll never talk to."

---

## The 30-Second Pitch

There are 350,000 businesses registered on SAM.gov trying to win government
contracts. Only 78,000 succeed. The tools that exist either cost
$13,000-$119,000 a year or are free and broken. GovDash just raised $42M —
proving the market — but they're building an enterprise ERP for defense primes.
We're building the Stripe of government contracting: self-serve, AI-powered,
$49-199/month, covering the $1.5 trillion state and local market that nobody
aggregates well. Our AI agents index thousands of fragmented municipal
procurement portals in parallel, surfacing contracts that small businesses would
never find manually. 46% of eligible small contractors don't even use the
set-aside programs designed for them — because they can't find the
opportunities. We fix that.

---

## Why This Market, Why Now

### The Market

| Segment                          | Annual Spend      |
| -------------------------------- | ----------------- |
| Federal procurement              | $834B (FY2025)    |
| State & local (SLED) procurement | $1.5-2T estimated |
| **Total government procurement** | **$2.3-2.8T**     |

- 78,747 small businesses won $176B in federal contracts in FY2024
- 350,000-435,000 entities registered in SAM.gov (4-5x more than winners)
- 90,837 local government entities in the US (counties, municipalities, school
  districts, special districts)
- GovTech deal volume hit $20.5B in 2025 — 1.5x the previous record

### The Timing

**DOGE chaos is our tailwind.** Federal contract freezes, 8(a) program
suspensions, and sole-source contract reviews are hammering small federal
contractors right now. These businesses are actively looking for alternatives —
and SLED procurement (state, local, education) is immune to federal DOGE
mandates. A tool that redirects panicked federal contractors toward stable
municipal opportunities is a lifeboat at the exact moment they need one.

**Set-aside programs are expanding.** SDVOSB targets increased from 3% to 5% in
FY2024. SDB goals rose from 5% to 13%. But 46% of eligible small businesses
under $20M revenue don't even use these programs. The opportunity gap is
massive.

**AI web agents just became viable.** The SLED fragmentation problem (90,000+
entities, no standard portal, no unified API) was unsolvable for a solo
developer before 2025. Agentic web browsing changes the unit economics of data
aggregation by 100x compared to human data entry or brittle CSS-selector
scrapers.

---

## The Competitive Gap

### The Pricing Canyon

```
$119,000/yr ─── GovWin IQ (Deltek) ──── Legacy enterprise, 30-year incumbent
                                          Laying off 275+ employees, outdated UI
$100,000/yr ─── GovDash ──────────────── $42M raised, enterprise ERP, FedRAMP
                                          No self-serve, no public pricing
 $28,000/yr ─── Bloomberg Government ──── Policy intelligence, not BD tool
  $7,000/yr ─── GovWin entry tier ─────── Still requires annual contract + sales call

  ════════════════════════════════════════════════════════════════════
  ║                    THE CANYON                                   ║
  ║  No AI-native, self-serve, SLED-focused tool exists here       ║
  ════════════════════════════════════════════════════════════════════

  $6,000/yr ─── EZGovOpps ────────────── Proposal mgmt, limited SLED
  $5,000/yr ─── HigherGov ────────────── Best current SMB option
                                          Bootstrapped, pre-AI, 7K SLED agencies
  $1,200/yr ─── FedScout ─────────────── Mobile-first but federal only
  $1,200/yr ─── SamSearch ────────────── AI-native but unproven
    $360/yr ─── FindRFP ──────────────── Email alerts, archaic tech
     $0/yr  ─── SAM.gov ──────────────── Free, universally despised UX
```

### Where We Win

| Dimension           | GovDash                | HigherGov   | FedScout      | **GovScout**                  |
| ------------------- | ---------------------- | ----------- | ------------- | ----------------------------- |
| Pricing             | $20K-100K+/yr          | $500-5K/yr  | $0-1.2K/yr    | **$588-2,388/yr**             |
| Self-serve signup   | No                     | Yes         | Yes           | **Yes**                       |
| Free tier           | No                     | No          | Yes (limited) | **Yes**                       |
| Federal coverage    | Deep                   | Good        | Good          | **Good (via SAM.gov API)**    |
| SLED coverage       | Minimal                | 7K agencies | None          | **Primary focus**             |
| AI matching         | Yes                    | Basic       | No            | **Yes**                       |
| AI proposal help    | Advanced               | No          | No            | **Lightweight**               |
| Set-aside filtering | Yes                    | Yes         | Basic         | **Deep (with cert tracking)** |
| Mobile-first        | No                     | No          | Yes           | **Yes**                       |
| Target customer     | Enterprise ($50M+ rev) | Mid-market  | SMB newcomers | **SMBs ($1-20M rev)**         |

### Why GovDash Can't Come Downmarket

GovDash has 56 employees, FedRAMP infrastructure, 3-week enterprise onboarding,
Salesforce/SharePoint integrations, and a $42M valuation to justify. A $49/month
customer is unit-economically impossible for them. Moving downmarket would:

- Cannibalize $20K-100K+ enterprise ACV
- Misalign with their sales-led GTM (commission structures don't work at $49/mo)
- Require rebuilding their product for self-serve (their onboarding is 3 weeks
  with dedicated teams)
- Conflict with investor expectations (institutional capital from BCI,
  enterprise VCs)

This is the classic innovator's dilemma. Their strength prevents them from
competing here.

---

## Product Definition

### Core Capabilities (MVP)

**1. Unified Procurement Search**

- Federal opportunities via SAM.gov API (free, no auth for public metadata)
- State procurement portals via TinyFish agents (publicly accessible, low
  anti-bot)
- Municipal/county portals via TinyFish agents (the long-tail moat)
- Single search interface across all sources
- Natural language queries: "IT cybersecurity contracts under $500K in Virginia"

**2. AI Opportunity Matching**

- User inputs: NAICS codes, certifications (8(a), HUBZone, SDVOSB, WOSB),
  capabilities, geography, contract size preferences
- System matches incoming opportunities against profile
- Daily email/push alerts for new matches
- Match confidence scoring

**3. Set-Aside Program Intelligence**

- Filter by set-aside type (8(a), HUBZone, SDVOSB, WOSB, small business)
- Track certification status and expiration dates
- Identify agencies falling short of mandated small business goals (these
  agencies are more likely to award set-aside contracts)
- DOGE-aware: flag contracts under regulatory review vs. stable opportunities

**4. SLED Coverage Engine (The Moat)**

- TinyFish agents scrape and normalize solicitations from state/county/municipal
  portals
- Handle heterogeneous formats (HTML tables, PDF uploads, search forms)
- Structured output: title, agency, deadline, budget, category, contact, source
  URL
- Coverage dashboard showing which jurisdictions are indexed
- New portals added incrementally — every addition widens the moat

### Post-MVP Features (Weeks 7-9+)

**5. Lightweight AI Proposal Outlines**

- Not full proposal generation (that's GovDash's $42M play)
- AI reads solicitation requirements and generates: compliance checklist,
  section outline, key evaluation criteria extracted, suggested response
  structure
- Enough to get a small contractor started — not enough to replace a proposal
  writer

**6. Subcontractor Matching**

- Track prime contract awards in real-time
- Identify primes with mandatory small business subcontracting plans
- Match subcontractor capabilities (NAICS + certifications) to prime needs
- "This prime just won a $15M DoD contract with a 23% small business sub goal.
  Your NAICS codes match. Here's the contracting officer."

**7. Pipeline Tracking**

- Lightweight CRM: save opportunities, track status
  (reviewing/bidding/submitted/won/lost)
- Win rate analytics over time
- No Salesforce complexity — think Trello for government bids

---

## Pricing

| Tier             | Price   | Includes                                                                                          |
| ---------------- | ------- | ------------------------------------------------------------------------------------------------- |
| **Free**         | $0/mo   | 10 searches/month, federal only, email alerts for 1 saved search                                  |
| **Starter**      | $49/mo  | Unlimited search, federal + 1 state, AI matching, 5 saved searches, daily alerts                  |
| **Professional** | $99/mo  | Federal + 5 states, AI proposal outlines, pipeline tracking, set-aside filtering, unlimited saves |
| **Team**         | $199/mo | All states, team collaboration (3 seats), API access, priority support, subcontractor matching    |

- Monthly billing, no annual contract required
- Credit card signup, instant access, no sales call
- 14-day free trial on Professional tier

### Unit Economics

| Metric                                     | Value                                 |
| ------------------------------------------ | ------------------------------------- |
| SAM.gov API cost                           | $0 (free federal API)                 |
| TinyFish cost per state portal sweep       | ~$0.18-0.22 (15 steps × $0.012-0.015) |
| Daily SLED scraping (100 portals)          | ~$20/day = ~$600/month                |
| Monthly infrastructure (hosting, DB, etc.) | ~$200-400/month                       |
| **Total monthly operating cost**           | **~$800-1,000/month**                 |
| Revenue at 10 customers (avg $99/mo)       | $990/month                            |
| Revenue at 50 customers (avg $99/mo)       | $4,950/month                          |
| Revenue at 200 customers (avg $99/mo)      | $19,800/month                         |
| **Gross margin at 200 customers**          | **~95%**                              |

Breakeven at ~10 paying customers. The scraping costs are fixed (run once, serve
all users), so every incremental customer is nearly pure margin.

---

## Technical Architecture

```
┌─────────────────────────────────────────────────────┐
│                   User Layer                         │
│  Next.js Web App (mobile-first, responsive)          │
│  + Email/Push notification service                   │
└──────────────────────┬──────────────────────────────┘
                       │
┌──────────────────────▼──────────────────────────────┐
│              Orchestration API (Node/TS)              │
│                                                      │
│  ┌─────────────────┐  ┌──────────────────────────┐  │
│  │ Search Engine    │  │ Matching Engine           │  │
│  │ (query → sources │  │ (profile → opportunities  │  │
│  │  → results)      │  │  → ranked matches)        │  │
│  └────────┬────────┘  └──────────┬───────────────┘  │
│           │                      │                   │
│  ┌────────▼──────────────────────▼───────────────┐  │
│  │         Data Ingestion Layer                    │  │
│  │                                                 │  │
│  │  ┌─────────────────────┐                       │  │
│  │  │ Federal (FREE APIs)  │                       │  │
│  │  │ • SAM.gov Opps API   │  ← Free, no auth     │  │
│  │  │ • USASpending API    │  ← Free, no auth     │  │
│  │  │ • FPDS Atom Feed     │  ← Free, no auth     │  │
│  │  └─────────────────────┘                       │  │
│  │                                                 │  │
│  │  ┌─────────────────────────────────────────┐   │  │
│  │  │ SLED (TinyFish Agents — THE MOAT)        │   │  │
│  │  │ • State procurement portals (50 states)  │   │  │
│  │  │ • County procurement sites               │   │  │
│  │  │ • Municipal bid pages                    │   │  │
│  │  │ • School district procurement            │   │  │
│  │  │ • Special district purchasing            │   │  │
│  │  │                                          │   │  │
│  │  │ Parallel execution: 20 agents            │   │  │
│  │  │ Nightly batch + on-demand queries        │   │  │
│  │  └─────────────────────────────────────────┘   │  │
│  └─────────────────────────────────────────────────┘  │
│                                                      │
│  ┌─────────────────────────────────────────────────┐  │
│  │         Normalization Layer                       │  │
│  │  • Schema mapping (heterogeneous → unified)      │  │
│  │  • NAICS code extraction/classification          │  │
│  │  • Deadline parsing and validation               │  │
│  │  • Budget estimation from description            │  │
│  │  • Set-aside type identification                 │  │
│  │  • Deduplication across sources                  │  │
│  └─────────────────────────────────────────────────┘  │
└──────────────────────┬──────────────────────────────┘
                       │
┌──────────────────────▼──────────────────────────────┐
│              Data Layer (MongoDB)                     │
│  • Opportunities collection (normalized)             │
│  • User profiles (NAICS, certs, geography, prefs)    │
│  • Match history and pipeline tracking               │
│  • Source registry (portal URLs, scrape configs)      │
└──────────────────────┬──────────────────────────────┘
                       │
┌──────────────────────▼──────────────────────────────┐
│              Delivery Layer                           │
│  • REST API (for Team tier + future integrations)    │
│  • Daily email digests (matched opportunities)       │
│  • Push notifications (deadline alerts)              │
│  • CSV export                                        │
└─────────────────────────────────────────────────────┘
```

### Tech Stack

| Component      | Choice                     | Reason                                      |
| -------------- | -------------------------- | ------------------------------------------- |
| Backend        | TypeScript / Node.js       | Robert's top 1% language                    |
| Frontend       | Next.js                    | Mobile-first, SSR, fast iteration           |
| Database       | MongoDB                    | TinyFish partner stack (free credits)       |
| Infrastructure | Google Cloud               | $2K free credits via Google for Startups    |
| Web Agents     | TinyFish API               | Free credits during accelerator             |
| Federal Data   | SAM.gov + USASpending APIs | Free, no auth, legally mandated             |
| AI/LLM         | Gemini (via Google Cloud)  | Matching, classification, proposal outlines |
| Monitoring     | Axiom                      | Partner stack                               |
| Email          | Resend or Postmark         | Transactional alerts                        |
| Auth           | Clerk or Auth.js           | Fast implementation                         |
| Payments       | Stripe                     | Self-serve billing                          |

---

## Build Timeline

### Week 1-2: Foundation + Federal Data

**Day 1-2: SAM.gov API integration**

- Register for API key at api.sam.gov
- Build ingestion pipeline: pull active opportunities, parse JSON, store in
  MongoDB
- This gives you a working federal search engine on day 2

**Day 3-5: First state portals via TinyFish**

- California (Cal eProcure) — largest state, clean HTML
- Texas (SmartBuy) — second largest, low anti-bot
- Virginia — dense federal contractor population, high relevance
- Build goal templates for each portal
- Test extraction success rates — this is the #1 validation gate

**Day 6-10: Core search UI**

- Next.js app with search interface
- Keyword search + filters (state, NAICS, set-aside, budget range, deadline)
- Results display with source links
- Mobile-responsive from day 1

**End of Week 2 deliverable:** Working search engine covering federal + 3
states. Ugly but functional.

### Week 3-4: Matching + SLED Expansion

**Day 11-14: User profiles + matching**

- Onboarding flow: NAICS codes, certifications, geography, contract size
  preferences
- Matching algorithm: score opportunities against profile
- Daily email digest of top matches

**Day 15-20: SLED expansion**

- Add 5-7 more states: Florida, Maryland, New York, Ohio, Georgia, Pennsylvania,
  Illinois
- Add 5-10 high-value county/municipal portals (target: counties with public,
  scrapable procurement pages)
- Build nightly batch scheduler for TinyFish agents
- Normalization pipeline: map heterogeneous schemas to unified format

**End of Week 4 deliverable:** AI-powered matching across federal + 10 states +
select municipalities. Email alerts working. User profiles functional.

### Week 5: Set-Aside Intelligence + Polish

**Day 21-25:**

- Set-aside program filtering (8(a), HUBZone, SDVOSB, WOSB)
- Certification tracking (expiration alerts)
- UI polish: clean design, loading states, empty states, error handling
- Free tier implementation (10 searches/month, 1 saved search)
- Landing page with positioning: "The Stripe of Government Contracting"

**End of Week 5 deliverable:** Demo-ready product with free tier, set-aside
filtering, polished UI.

### Week 6: Demo + Apply

**Day 26-28: Record demo video (2-3 minutes)**

- Script below
- Post on X with @Tiny_Fish #TinyFishAccelerator #BuildInPublic
- Email formal application

**Day 29-30: Content + initial distribution**

- Post in r/govcontracting
- Write "How I built an AI-powered SAM.gov alternative in 5 weeks" post
- Begin reaching out to APEX Accelerator contacts

### Week 7-8: Production Hardening + Revenue Features

- Stripe integration (self-serve billing)
- Pipeline tracking (save/track/status opportunities)
- Lightweight AI proposal outlines (Gemini reads solicitation → generates
  compliance checklist + section outline)
- Error handling, retry logic, rate limiting
- Expand SLED coverage: target 15-20 states + 20-30 municipalities
- Performance optimization

### Week 9: Demo Day

- Full pitch deck
- Metrics: opportunities indexed, users, conversion rate, coverage map
- Live demo showing SLED coverage that nobody else has
- "GovDash raised $42M for Lockheed Martin. We built the Stripe of GovCon in 9
  weeks."

---

## Demo Script (2-3 Minutes)

### [0:00-0:20] The Problem

"There are 350,000 businesses registered to win government contracts. Only
78,000 succeed. The gap isn't opportunity — it's access. GovWin charges $13,000
a year. GovDash requires a sales call and a five-figure contract. And SAM.gov...
well..."

_Show SAM.gov's interface. Click around. Watch it be terrible._

"...you get it."

### [0:20-0:50] The Product

"We built GovScout. Sign up with your email. No sales call. No annual contract.
Forty-nine dollars a month."

_Show signup flow. Type in NAICS codes, select certifications (8(a), SDVOSB),
choose states._

"Now search: 'IT cybersecurity infrastructure, Virginia and Maryland, under
$500K.'"

_Results populate. Federal opportunities from SAM.gov + state opportunities from
Virginia eMall and Maryland eMMA + county opportunities from Fairfax and
Montgomery counties._

### [0:50-1:30] The SLED Moat

"Here's what no one else shows you."

_Filter to state and local only. Highlight municipal results._

"These 12 opportunities are from county and municipal portals. Fairfax County
schools need network upgrades. Montgomery County needs a cybersecurity audit.
Arlington wants a managed services provider. These contracts are $50K to $300K,
three to five bidders each, and they're invisible on SAM.gov, invisible on
GovWin, and invisible on GovDash."

_Show the coverage map — states and counties indexed, with numbers._

"We deploy AI web agents across hundreds of state and local procurement portals
in parallel. Every night, they scrape, normalize, and index opportunities that
the enterprise tools ignore."

### [1:30-2:00] The Market

"GovDash just raised $42 million to serve Lockheed Martin. Their average
contract is six figures. They require a sales call and a three-week onboarding."

"We serve the 78,000 small businesses they'll never talk to. Self-serve. Instant
access. Forty-nine dollars a month."

"46% of eligible small contractors don't use the set-aside programs designed for
them — because they can't find the opportunities. We fix that."

### [2:00-2:15] The Close

"GovScout. Government contracts, found by AI, priced for small business. Built
on @Tiny_Fish."

_#TinyFishAccelerator #BuildInPublic_

---

## Go-To-Market

### Launch Channels (Zero cost)

| Channel           | Audience                                                  | Action                                                   |
| ----------------- | --------------------------------------------------------- | -------------------------------------------------------- |
| r/govcontracting  | Active SMB contractor community                           | Post product launch + "built this because SAM.gov sucks" |
| GovLoop           | 300K+ government + contractor professionals               | Community post                                           |
| APEX Accelerators | 90+ centers helping businesses get government contracts   | Partnership outreach (they need tools to recommend)      |
| SBA SBDCs         | 1,000+ Small Business Development Centers                 | Same partnership play                                    |
| LinkedIn          | GovCon professionals                                      | Content + direct outreach to 8(a) firms                  |
| X/Twitter         | #GovCon community                                         | Build in public, demo videos                             |
| Product Hunt      | Tech early adopters                                       | Launch day                                               |
| SEO               | "SAM.gov alternative," "how to find government contracts" | High intent, low competition keywords                    |

### Pricing Anchoring

"GovWin charges $13,000/year. GovDash won't even show you a price. We charge
$49/month, and you can start in 30 seconds."

This comparison does the selling. The price canyon is so wide that the value
proposition is self-evident.

---

## Risks & Mitigations

| Risk                                         | Severity   | Mitigation                                                                                                                                                                                  |
| -------------------------------------------- | ---------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| State portals resist scraping                | Medium     | These are public procurement sites — they WANT vendors to see bids. Low anti-bot posture by design. TinyFish stealth mode as backup. Test CA/TX/VA immediately — Week 1 validation gate.    |
| SAM.gov API rate limits                      | Medium     | Public access = 10 req/day. System account = 1,000/day (apply immediately, 1-4 week approval). USASpending.gov has NO rate limits as fallback. Cache aggressively.                          |
| TinyFish step costs exceed model             | Low-Medium | Free credits during accelerator. Federal APIs are $0 — SLED scraping is the only cost. Optimize goal templates. Batch nightly to control costs.                                             |
| HigherGov adds AI features                   | Low        | They're bootstrapped with no venture funding. AI R&D is expensive. We'd have 6-12 month head start on AI-native architecture.                                                               |
| GovDash moves downmarket                     | Very Low   | Structurally impossible without destroying their enterprise ACV, sales motion, and investor expectations. Classic innovator's dilemma.                                                      |
| Demo doesn't land with accelerator investors | Medium     | Lead with the numbers ($1.5T SLED market, 350K SAM.gov registrants, $42M GovDash validation). The Stripe analogy makes it instantly legible. Show the SLED coverage map as the visual hook. |
| Federal contracting market shrinks (DOGE)    | Low        | SLED is immune to federal cuts. Product actively redirects users toward stable municipal contracts. DOGE chaos increases demand for our tool, not decreases it.                             |

---

## Key Metrics for Demo Day

| Metric                         | Target                         |
| ------------------------------ | ------------------------------ |
| Opportunities indexed          | 10,000+ across federal + SLED  |
| State portals covered          | 10-15 states                   |
| Municipal portals covered      | 20-30 counties/cities          |
| Registered users (free + paid) | 100+                           |
| Paying customers               | 10-20                          |
| MRR                            | $1,000-2,000                   |
| Set-aside match accuracy       | Demonstrate with live examples |
| Cost per portal scrape         | Validated at $0.18-0.22        |

---

## The Expansion Roadmap

### Phase 1: Prove It (Accelerator, Months 1-3)

- 10-15 states + select municipalities
- Federal via SAM.gov API
- Self-serve product, free + paid tiers
- First paying customers
- Validate SLED scraping at scale

### Phase 2: Coverage Moat (Months 3-9)

- All 50 states
- 200+ municipal/county portals
- Subcontractor matching engine
- AI proposal outlines
- API access for CRM integrations
- Target: 500+ paying customers, $50K+ MRR

### Phase 3: Platform (Months 9-18)

- Cooperative purchasing (NASPO ValuePoint, TIPS, Sourcewell)
- Teaming/partner network (match primes with sub needs)
- Full pipeline CRM
- Historical win/loss analytics
- White-label API for adjacent GovTech platforms
- Target: 2,000+ customers, $200K+ MRR, Series A ready

### The Series A Story

"We built the most comprehensive state and local procurement database in the US,
covering 90,000+ government entities, delivered self-serve at $99/month. GovDash
proved the enterprise market at $42M. We proved the SMB market at 2,000
customers and $200K MRR. Together, we've validated a $3B+ TAM. We're raising to
expand coverage to every procurement portal in America and build the operating
system for small business government contracting."

---

## Immediate Next Steps

### Today

- [ ] Request TinyFish API credits: https://form.typeform.com/to/wwt0oJ3e
- [ ] Register for SAM.gov API key:
      https://open.gsa.gov/api/get-opportunities-public-api/
- [ ] Apply for SAM.gov system account (higher rate limits — takes 1-4 weeks,
      start now)

### This Weekend

- [ ] Test SAM.gov API — pull active opportunities, confirm data structure and
      richness
- [ ] Test TinyFish on California Cal eProcure — can it navigate search, extract
      solicitations?
- [ ] Test TinyFish on Texas SmartBuy — second state validation
- [ ] Test TinyFish on one county portal (Fairfax County, VA or Montgomery
      County, MD)
- [ ] **These four tests are the validation gate. If they work, everything else
      is execution.**

### Next Week

- [ ] Begin core engine build (Week 1 of timeline)
- [ ] SAM.gov ingestion pipeline
- [ ] First state portal goal templates
- [ ] Next.js app scaffold (mobile-first)

---

## Research Lineage

This plan is the product of four brainstorm versions and three independent deep
research analyses:

1. **v1-v2:** Explored 12+ product concepts, narrowed to lead intelligence
   category
2. **v3 + Deep Research #1 (Gemini):** Evaluated 5 verticals, identified
   specialty trades as strongest demo narrative
3. **v3 + Deep Research #2 (Claude):** Counter-argued for healthcare/dental
   based on NPI API advantage
4. **v4:** Dual-vertical strategy (trades for demo, dental for expansion proof)
5. **Deep Research #3:** Government contracts vs. private company intelligence —
   gov contracts won on every dimension; private company intel killed
   (technically impossible with TinyFish)
6. **Deep Research #4:** GovDash competitive gap analysis — confirmed wide-open
   SMB/SLED niche, precise positioning defined

Seven concepts evaluated. Four killed with evidence. One selected with a
precise, defensible niche validated from three independent angles.

---

## The Line That Wins Demo Day

"GovDash is the Salesforce of government contracting. We're Stripe. Self-serve,
radically simpler, and priced for the 99% of contractors that enterprise tools
ignore."

---

_Now go build it._
