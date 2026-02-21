# GovScout — Product Requirements Document

## AI-Powered Procurement Intelligence for Small Business Government Contractors

**Version:** 1.0 **Date:** February 20, 2026 **Author:** Robert Guss
**Program:** TinyFish Accelerator (9-week, 100% remote, $2M seed pool)
**Status:** BUILD

---

## 1. Executive Summary

GovScout is a self-serve, AI-powered procurement search engine that aggregates
government contract opportunities across federal, state, and local portals for
small business contractors. It targets the 78,000+ small businesses actively
pursuing government contracts who are priced out of enterprise tools like GovWin
($13K-119K/year) and GovDash ($20K-100K+/year) but poorly served by the free,
universally despised SAM.gov interface.

**One-liner:** "The Stripe of government contracting — self-serve, AI-powered,
and priced for the 99% of contractors that enterprise tools ignore."

**Primary metric:** Monthly Recurring Revenue (MRR) by Demo Day.

---

## 2. Problem Statement

### The Market

Government procurement in the US totals $2.3-2.8 trillion annually — $834B
federal (FY2025) and an estimated $1.5-2T at the state and local (SLED) level.
There are 350,000-435,000 businesses registered in SAM.gov seeking government
contracts, but only 78,747 small businesses won federal contracts in FY2024.

### The Pain

Small government contractors ($1M-$20M revenue) face three compounding problems:

1. **They can't afford the tools.** GovWin charges $13,000-$119,000/year.
   GovDash requires a sales call and a five-figure annual contract. Bloomberg
   Government costs $7,500/seat/year. For a 12-person HVAC company trying to win
   its first municipal contract, these prices are prohibitive.

2. **They can't find the opportunities.** SAM.gov is universally despised —
   broken search, no AI matching, federal only. State and local procurement
   (2-3x the federal market) is fragmented across 90,837 local government
   entities with no centralized portal. Opportunities are posted on county
   websites, municipal bid pages, school district procurement offices, and
   sometimes local newspapers. No existing tool aggregates them affordably.

3. **They don't use the programs designed for them.** 46% of small businesses
   under $20M revenue don't use set-aside programs they qualify for (8(a),
   HUBZone, SDVOSB, WOSB). These programs reserved $176B in FY2024 awards. The
   gap isn't eligibility — it's discovery and navigation.

### The Timing

- **DOGE chaos:** Federal contract freezes, 8(a) program suspensions, and
  sole-source reviews are hammering small federal contractors. SLED procurement
  is immune to federal DOGE mandates and represents a safe haven. GovScout
  redirects panicked federal contractors toward stable municipal opportunities.
- **Set-aside expansion:** SDVOSB targets increased from 3% to 5% in FY2024. SDB
  goals rose from 5% to 13%. More money reserved, same discovery gap.
- **GovTech momentum:** Deal volume hit $20.5B in 2025 — 1.5x the previous
  record.
- **AI agent viability:** Aggregating 90,000+ fragmented SLED portals was
  impossible for a solo developer before 2025. Agentic web browsing changes the
  unit economics of data aggregation by 100x.

---

## 3. Market Validation

### Competitor Funding as Proof

| Company              | Funding                        | Focus                       | Why They Can't Serve SMBs                                           |
| -------------------- | ------------------------------ | --------------------------- | ------------------------------------------------------------------- |
| GovDash              | $42M ($30M Series B, Jan 2026) | Enterprise federal ERP      | FedRAMP infrastructure, 3-week onboarding, no self-serve, $20K+ ACV |
| GovWin (Deltek)      | Legacy (30-year incumbent)     | Enterprise federal + SLED   | $13K-119K/year, 275+ layoffs Jan 2025, aging platform               |
| Govly                | $13.1M                         | Federal IT supply chain     | Niche channel focus, not general procurement                        |
| Bloomberg Government | Enterprise (Bloomberg)         | Federal policy intelligence | $7,500/seat, policy focus not BD tool                               |

GovDash's $42M raise validates the market. Their enterprise positioning
validates the gap. They have 56 employees, FedRAMP Moderate Equivalency,
Arlington VA office, and serve top-100 federal contractors. Moving downmarket
would cannibalize $20K-100K+ enterprise ACV, conflict with their sales-led GTM,
and require rebuilding for self-serve. Classic innovator's dilemma.

### The Pricing Canyon

The market has a wide pricing gap with no AI-native, self-serve, SLED-focused
tool:

- **$0/year:** SAM.gov (free, broken, federal only)
- **$360/year:** FindRFP (email alerts, archaic)
- **$500-5,000/year:** HigherGov (closest competitor, bootstrapped, pre-AI, 7K
  SLED agencies)
- **$1,200/year:** FedScout (mobile-first, federal only)

**[THE GAP — GovScout targets here at $588-2,388/year]**

- **$6,000/year:** EZGovOpps
- **$7,500/year:** Bloomberg Government
- **$13,000-119,000/year:** GovWin
- **$20,000-100,000+/year:** GovDash (estimated)

### Target Customer

**Primary persona: "The Small GovCon Owner"**

- 5-50 employee company, $1M-$20M annual revenue
- Registered in SAM.gov, may have won 0-5 federal contracts
- One person (often the owner) handles business development part-time
- Cannot justify $13K+ for GovWin, cannot afford a full-time BD professional
- Wants government contracts but can't find them efficiently
- Likely qualifies for set-aside programs but isn't using them
- Increasingly interested in SLED contracts as federal uncertainty grows

**Size of market:** 78,747 small businesses won federal contracts in FY2024.
350,000-435,000 registered in SAM.gov (4-5x ratio of registered to winning).
Realistic addressable: 50,000-80,000 firms actively pursuing contracts.

---

## 4. Product Definition

### 4.1 Core Capabilities

#### 4.1.1 Unified Procurement Search

Users search for government contract opportunities across federal, state, and
local sources from a single interface. Natural language queries are supported
alongside structured filters.

**User stories:**

- As a contractor, I can search "IT cybersecurity contracts under $500K in
  Virginia" and see results from SAM.gov, Virginia eMall, Fairfax County, and
  Montgomery County in one view.
- As a contractor, I can filter results by source type (federal, state, local),
  set-aside program, NAICS code, budget range, and deadline.
- As a contractor, I can see the source URL for every opportunity to verify and
  access the original posting.

**Acceptance criteria:**

- Search returns results in under 3 seconds for cached/indexed data
- Each result displays: title, agency, deadline, estimated budget, set-aside
  type, source, NAICS codes, geographic location
- Results are deduplicated across sources (same opportunity posted on SAM.gov
  and a state portal appears once)
- Free tier: 10 searches/month, federal results only
- Paid tiers: unlimited searches, federal + SLED results based on tier

#### 4.1.2 User Profile & AI Matching

Users create a profile with their capabilities, certifications, and preferences.
The system matches incoming opportunities against this profile and delivers
ranked results.

**User stories:**

- As a contractor, I can enter my NAICS codes, certifications (8(a), HUBZone,
  SDVOSB, WOSB), service areas (states/zip codes), and preferred contract size
  range during onboarding.
- As a contractor, I receive a daily email digest of my top matched
  opportunities, ranked by relevance.
- As a contractor, I can see a match confidence score explaining why an
  opportunity was recommended.

**Acceptance criteria:**

- Onboarding captures: NAICS codes (autocomplete from official list),
  certification types, geographic preferences, contract size range ($min-$max),
  keywords
- Matching algorithm scores opportunities 0-100 based on profile alignment
- Daily email digest sent by 7am ET with top 10 matches
- Users can adjust profile at any time; matching updates within 24 hours

#### 4.1.3 SLED Coverage Engine (The Moat)

TinyFish web agents scrape, normalize, and index solicitations from state and
local procurement portals nightly. This is the core differentiation — no
existing affordable tool aggregates SLED data at this depth.

**User stories:**

- As a contractor, I can see opportunities from my state's procurement portal
  that don't appear on SAM.gov.
- As a contractor, I can see a coverage map showing which states, counties, and
  municipalities are indexed.
- As a contractor in Texas, I can find municipal contracts from Houston, Dallas,
  Austin, and San Antonio that are invisible to federal-only tools.

**Acceptance criteria:**

- Nightly batch scraping via TinyFish agents for all indexed portals
- Each scraped opportunity normalized to unified schema: title, agency,
  deadline, budget (estimated if not stated), category, contact info, source
  URL, set-aside type (if applicable), NAICS codes (extracted or classified by
  AI)
- Coverage map on dashboard showing indexed jurisdictions with opportunity
  counts
- Minimum coverage targets by Demo Day: 10-15 state portals, 20-30
  county/municipal portals
- Stretch goal: as many states and municipalities as TinyFish agents can
  reliably scrape

#### 4.1.4 Set-Aside Intelligence

Dedicated filtering and tracking for small business set-aside programs,
targeting the 46% of eligible businesses that don't use programs designed for
them.

**User stories:**

- As an 8(a) certified contractor, I can filter to show only 8(a) set-aside
  opportunities.
- As a contractor unsure of my eligibility, I can see which set-aside programs I
  might qualify for based on my profile.
- As a contractor, I can track my certification expiration dates and receive
  renewal reminders.

**Acceptance criteria:**

- Filter by: 8(a), HUBZone, SDVOSB, WOSB, small business, unrestricted
- Set-aside type extracted from federal data (SAM.gov provides this natively)
  and classified by AI for SLED opportunities
- Certification expiration tracking with 90/60/30-day email reminders
- Informational prompts (not legal advice) about programs the user may qualify
  for based on profile data

#### 4.1.5 Self-Serve Billing

Credit card signup, monthly billing, no sales call. This is core product
positioning, not a feature.

**User stories:**

- As a contractor, I can sign up with my email, enter a credit card, and access
  paid features in under 2 minutes.
- As a contractor, I can upgrade, downgrade, or cancel my subscription at any
  time without talking to anyone.
- As a contractor, I can start with a free tier and upgrade when I find value.

**Acceptance criteria:**

- Stripe integration via Convex Stripe component
- Subscription tiers enforced server-side (Convex mutations check tier before
  returning SLED results)
- Free tier functional without credit card
- 14-day free trial on Professional tier
- Self-serve upgrade/downgrade/cancel in dashboard settings

### 4.2 Data Sources

#### 4.2.1 Federal (Free APIs — Foundation Layer)

| Source                    | Access Method | Auth Required  | Cost | Data                                                                  |
| ------------------------- | ------------- | -------------- | ---- | --------------------------------------------------------------------- |
| SAM.gov Opportunities API | REST API      | API key (free) | $0   | Active federal solicitations, set-aside types, NAICS codes, deadlines |
| USASpending.gov API       | REST API      | None           | $0   | Historical contract awards, vendor data, spending patterns since 1979 |
| FPDS Atom Feed            | Atom/RSS      | None           | $0   | Real-time federal contract award notifications                        |

**SAM.gov API rate limits:**

- Public access: 10 requests/day (development)
- System account: 1,000 requests/day (production — applied for, 1-4 week
  approval)

**Legal status:** All federal procurement data is legally mandated public record
under FOIA, FFATA, and the DATA Act. Zero legal risk.

#### 4.2.2 SLED (TinyFish Agents — Differentiation Layer)

**Priority state portals (high-value, high-contractor-density):**

| Priority | State        | Portal       | Notes                                   |
| -------- | ------------ | ------------ | --------------------------------------- |
| 1        | California   | Cal eProcure | Largest state, clean HTML, low anti-bot |
| 2        | Texas        | SmartBuy     | Second largest, low anti-bot            |
| 3        | Virginia     | eVA          | Dense federal contractor population     |
| 4        | Florida      | MFMP         | Large state, public search              |
| 5        | Maryland     | eMMA         | Dense federal contractor population     |
| 6        | New York     | —            | Large state                             |
| 7        | Ohio         | —            | Large state                             |
| 8        | Georgia      | —            | Growing state                           |
| 9        | Pennsylvania | eMarketplace | Legacy HTML, near-perfect extraction    |
| 10       | Illinois     | —            | Large state                             |

**Municipal targets (high-value counties with public procurement pages):**

- Fairfax County, VA
- Montgomery County, MD
- Los Angeles County, CA
- Harris County, TX (Houston)
- Maricopa County, AZ (Phoenix)
- Cook County, IL (Chicago)
- Major city procurement offices in indexed states

**TinyFish integration pattern:**

- Nightly batch: Convex cron triggers workflow → fans out TinyFish agents →
  collects results → normalizes → stores
- On-demand: User searches trigger real-time TinyFish agent for specific portal
  (premium feature)
- Goal template per portal: URL, navigation steps, extraction schema, expected
  fields

**Legal status:** State and local procurement portals are public by design —
they want vendors to find and bid on solicitations. Low anti-bot posture.
TinyFish stealth mode available as backup.

### 4.3 Pricing

| Tier             | Price      | Includes                                                                                                           |
| ---------------- | ---------- | ------------------------------------------------------------------------------------------------------------------ |
| **Free**         | $0/month   | 10 searches/month, federal results only, 1 saved search, email alerts for saved search                             |
| **Starter**      | $49/month  | Unlimited search, federal + 1 state, AI matching, 5 saved searches, daily email alerts                             |
| **Professional** | $99/month  | Federal + 5 states, AI matching, set-aside intelligence, pipeline tracking, unlimited saved searches, daily alerts |
| **Team**         | $199/month | All indexed states, 3 user seats, API access, priority support, all features                                       |

- Monthly billing, no annual contract required
- 14-day free trial on Professional
- Self-serve upgrade/downgrade/cancel

### 4.4 Non-Goals (Explicitly Out of Scope)

These features are intentionally excluded from the MVP and near-term roadmap:

- **Full proposal generation** — GovDash's $42M play. We provide lightweight
  outlines and compliance checklists, not full proposal writing.
- **Contract management / post-award** — Out of scope. We help find and start
  pursuing opportunities, not manage active contracts.
- **CUI / classified data handling** — No FedRAMP, no CMMC. We aggregate
  publicly posted solicitations only.
- **Subcontractor matching** — Future feature (Phase 3). Requires prime
  contractor data pipeline.
- **Team collaboration beyond 3 seats** — Enterprise team features are
  post-seed.
- **White-label / API-first** — Team tier includes basic API access. Full API
  product is post-seed.

---

## 5. Technical Architecture

### 5.1 Stack

| Layer            | Technology                                 | Rationale                                                            |
| ---------------- | ------------------------------------------ | -------------------------------------------------------------------- |
| **Framework**    | Next.js 16                                 | Already in starter kit, SSR, mobile-first                            |
| **Runtime**      | TypeScript 5.x                             | Robert's top 1% language                                             |
| **Backend**      | Convex                                     | Real-time, serverless, zero infra management, already in starter kit |
| **Auth**         | Better Auth                                | Already integrated in starter kit with Convex                        |
| **UI**           | shadcn/ui + Tailwind CSS 4                 | 20+ components pre-installed in starter kit                          |
| **Testing**      | Vitest + convex-test                       | Already configured in starter kit                                    |
| **Web Agents**   | TinyFish API (SSE)                         | SLED portal scraping, accelerator credits                            |
| **Federal Data** | SAM.gov + USASpending APIs                 | Free, no auth (public metadata), legally mandated                    |
| **AI/LLM**       | Gemini (via Google Cloud)                  | Matching, classification, proposal outlines                          |
| **Email**        | Resend (Convex component)                  | Daily alert digests                                                  |
| **Payments**     | Stripe (Convex component)                  | Self-serve billing                                                   |
| **Deployment**   | Vercel (frontend) + Convex Cloud (backend) | Standard starter kit deployment                                      |

### 5.2 Convex Components

| Component                      | Purpose                                                                                                 | Priority |
| ------------------------------ | ------------------------------------------------------------------------------------------------------- | -------- |
| **@convex-dev/workpool**       | Scraping job orchestration — separate queues for SLED scraping and federal sync with parallelism limits | Week 1   |
| **@convex-dev/action-retrier** | Retry failed TinyFish calls with exponential backoff                                                    | Week 1   |
| **@convex-dev/workflow**       | Durable nightly scraping pipeline — survives failures, picks up where it left off                       | Week 1   |
| **@convex-dev/crons**          | Nightly batch trigger (2am ET)                                                                          | Week 1   |
| **@convex-dev/rate-limiter**   | Rate limit free tier API usage + manage portal scraping rates                                           | Week 2   |
| **@convex-dev/stripe**         | Self-serve subscription billing                                                                         | Week 2   |
| **@convex-dev/resend**         | Daily email alert digests                                                                               | Week 3   |
| **@convex-dev/aggregate**      | Dashboard counters (opportunities indexed, matches today)                                               | Week 3   |
| **@convex-dev/geospatial**     | Geographic opportunity filtering (opportunities within X miles)                                         | Week 4   |

### 5.3 Data Schema (Convex)

```typescript
// convex/schema.ts

import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  // ─── User Profiles ────────────────────────────────
  userProfiles: defineTable({
    userId: v.id("users"), // Better Auth user reference
    companyName: v.optional(v.string()),
    naicsCodes: v.array(v.string()), // e.g. ["541512", "541519"]
    certifications: v.array(v.string()), // e.g. ["8a", "hubzone", "sdvosb", "wosb"]
    certExpirations: v.optional(
      v.array(
        v.object({
          type: v.string(),
          expiresAt: v.number(), // Unix timestamp
        }),
      ),
    ),
    states: v.array(v.string()), // e.g. ["VA", "MD", "DC"]
    contractSizeMin: v.optional(v.number()),
    contractSizeMax: v.optional(v.number()),
    keywords: v.array(v.string()),
    tier: v.union(
      v.literal("free"),
      v.literal("starter"),
      v.literal("professional"),
      v.literal("team"),
    ),
    stripeCustomerId: v.optional(v.string()),
    stripeSubscriptionId: v.optional(v.string()),
    onboardingComplete: v.boolean(),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_userId", ["userId"])
    .index("by_tier", ["tier"])
    .index("by_stripeCustomerId", ["stripeCustomerId"]),

  // ─── Opportunities ────────────────────────────────
  opportunities: defineTable({
    title: v.string(),
    description: v.optional(v.string()),
    agency: v.string(), // Issuing agency name
    agencyLevel: v.union(
      v.literal("federal"),
      v.literal("state"),
      v.literal("county"),
      v.literal("municipal"),
      v.literal("school_district"),
      v.literal("special_district"),
    ),
    state: v.optional(v.string()), // State code (null for federal)
    county: v.optional(v.string()),
    city: v.optional(v.string()),
    latitude: v.optional(v.number()),
    longitude: v.optional(v.number()),
    deadline: v.optional(v.number()), // Unix timestamp
    postedDate: v.optional(v.number()),
    estimatedBudget: v.optional(v.number()),
    budgetConfidence: v.optional(
      v.union(
        v.literal("stated"), // Budget explicitly in solicitation
        v.literal("estimated"), // AI-estimated from description
        v.literal("unknown"),
      ),
    ),
    naicsCodes: v.array(v.string()),
    setAside: v.optional(
      v.union(
        v.literal("8a"),
        v.literal("hubzone"),
        v.literal("sdvosb"),
        v.literal("wosb"),
        v.literal("small_business"),
        v.literal("unrestricted"),
        v.literal("other"),
      ),
    ),
    sourceType: v.union(
      v.literal("sam_gov"),
      v.literal("usaspending"),
      v.literal("fpds"),
      v.literal("state_portal"),
      v.literal("county_portal"),
      v.literal("municipal_portal"),
    ),
    sourceUrl: v.string(), // Direct link to original posting
    sourcePortalId: v.optional(v.id("portals")),
    solicitationNumber: v.optional(v.string()),
    contactName: v.optional(v.string()),
    contactEmail: v.optional(v.string()),
    contactPhone: v.optional(v.string()),
    rawData: v.optional(v.any()), // Original scraped/API data for debugging
    scrapedAt: v.number(),
    expiresAt: v.optional(v.number()), // When to stop showing (deadline + buffer)
    active: v.boolean(),
  })
    .index("by_state", ["state"])
    .index("by_agencyLevel", ["agencyLevel"])
    .index("by_deadline", ["deadline"])
    .index("by_setAside", ["setAside"])
    .index("by_sourceType", ["sourceType"])
    .index("by_active_deadline", ["active", "deadline"])
    .index("by_solicitationNumber", ["solicitationNumber"])
    .searchIndex("search_title_desc", {
      searchField: "title",
      filterFields: ["agencyLevel", "state", "setAside", "active"],
    }),

  // ─── Portal Registry ──────────────────────────────
  portals: defineTable({
    name: v.string(), // e.g. "California Cal eProcure"
    url: v.string(),
    state: v.string(),
    level: v.union(
      v.literal("state"),
      v.literal("county"),
      v.literal("municipal"),
      v.literal("school_district"),
    ),
    county: v.optional(v.string()),
    city: v.optional(v.string()),
    goalTemplate: v.string(), // TinyFish goal prompt template
    scrapeFrequency: v.union(v.literal("daily"), v.literal("weekly")),
    lastScrapedAt: v.optional(v.number()),
    lastScrapeStatus: v.optional(
      v.union(v.literal("success"), v.literal("partial"), v.literal("failed")),
    ),
    lastScrapeCount: v.optional(v.number()),
    enabled: v.boolean(),
    notes: v.optional(v.string()),
  })
    .index("by_state", ["state"])
    .index("by_enabled", ["enabled"]),

  // ─── Saved Searches ───────────────────────────────
  savedSearches: defineTable({
    userId: v.id("users"),
    name: v.string(),
    query: v.optional(v.string()),
    filters: v.object({
      states: v.optional(v.array(v.string())),
      agencyLevels: v.optional(v.array(v.string())),
      setAsides: v.optional(v.array(v.string())),
      naicsCodes: v.optional(v.array(v.string())),
      budgetMin: v.optional(v.number()),
      budgetMax: v.optional(v.number()),
      keywords: v.optional(v.array(v.string())),
    }),
    alertEnabled: v.boolean(),
    lastAlertSentAt: v.optional(v.number()),
    createdAt: v.number(),
  }).index("by_userId", ["userId"]),

  // ─── Pipeline (lightweight CRM) ───────────────────
  pipeline: defineTable({
    userId: v.id("users"),
    opportunityId: v.id("opportunities"),
    status: v.union(
      v.literal("saved"),
      v.literal("reviewing"),
      v.literal("bidding"),
      v.literal("submitted"),
      v.literal("won"),
      v.literal("lost"),
      v.literal("no_bid"),
    ),
    notes: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_userId", ["userId"])
    .index("by_userId_status", ["userId", "status"])
    .index("by_opportunityId", ["opportunityId"]),

  // ─── Scrape Jobs ──────────────────────────────────
  scrapeJobs: defineTable({
    portalId: v.id("portals"),
    status: v.union(
      v.literal("queued"),
      v.literal("running"),
      v.literal("completed"),
      v.literal("failed"),
    ),
    startedAt: v.optional(v.number()),
    completedAt: v.optional(v.number()),
    opportunitiesFound: v.optional(v.number()),
    opportunitiesNew: v.optional(v.number()),
    error: v.optional(v.string()),
    tinyfishRunId: v.optional(v.string()),
    stepsUsed: v.optional(v.number()),
    createdAt: v.number(),
  })
    .index("by_portalId", ["portalId"])
    .index("by_status", ["status"])
    .index("by_createdAt", ["createdAt"]),
});
```

### 5.4 System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    CLIENT (Next.js 16)                        │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌───────────────┐  │
│  │ Search   │ │ Dashboard│ │ Pipeline │ │ Settings/     │  │
│  │ Page     │ │ + Map    │ │ (CRM)    │ │ Billing       │  │
│  └────┬─────┘ └────┬─────┘ └────┬─────┘ └───────┬───────┘  │
│       │             │            │                │          │
│       └─────────────┴────────────┴────────────────┘          │
│                    Convex React hooks                         │
│                    (real-time subscriptions)                  │
└────────────────────────────┬────────────────────────────────┘
                             │ (real-time sync)
┌────────────────────────────▼────────────────────────────────┐
│                    CONVEX BACKEND                             │
│                                                              │
│  Queries (real-time reads)                                   │
│  ├── searchOpportunities (full-text + filters)               │
│  ├── getMatchedOpportunities (profile-based ranking)         │
│  ├── getDashboardStats (via Aggregate component)             │
│  ├── getCoverageMap (portal registry + counts)               │
│  └── getPipeline (user's saved opportunities)                │
│                                                              │
│  Mutations (writes)                                          │
│  ├── updateProfile / completeOnboarding                      │
│  ├── saveSearch / toggleAlert                                │
│  ├── addToPipeline / updatePipelineStatus                    │
│  ├── ingestOpportunities (from scrape results)               │
│  └── deduplicateOpportunities                                │
│                                                              │
│  Actions (external calls)                                    │
│  ├── scrapeSledPortal (TinyFish SSE → parse → mutate)        │
│  ├── syncSamGov (SAM.gov API → parse → mutate)               │
│  ├── syncUsaSpending (USASpending API → parse → mutate)      │
│  ├── classifyOpportunity (Gemini → NAICS/set-aside/budget)   │
│  └── sendAlertDigest (Resend component)                      │
│                                                              │
│  Convex Components                                           │
│  ├── Workpool → orchestrates parallel TinyFish agents        │
│  ├── Workflow → durable nightly scraping pipeline             │
│  ├── Crons → 2am ET nightly trigger                          │
│  ├── Action Retrier → retry failed scrapes                   │
│  ├── Rate Limiter → free tier limits + portal rate control   │
│  ├── Stripe → subscription management                        │
│  ├── Resend → email alerts                                   │
│  ├── Aggregate → dashboard counters                          │
│  └── Geospatial → geographic proximity queries               │
│                                                              │
└──────────┬──────────────┬──────────────┬────────────────────┘
           │              │              │
    ┌──────▼──────┐ ┌────▼────┐ ┌───────▼────────┐
    │ TinyFish    │ │ Federal │ │ Gemini         │
    │ Agent API   │ │ APIs    │ │ (AI classify)  │
    │ (SSE)       │ │ (free)  │ │                │
    │             │ │         │ │                │
    │ State       │ │ SAM.gov │ │ NAICS matching │
    │ portals     │ │ USASpend│ │ Set-aside ID   │
    │ County      │ │ FPDS    │ │ Budget est.    │
    │ portals     │ │         │ │                │
    └─────────────┘ └─────────┘ └────────────────┘
```

### 5.5 TinyFish Integration Pattern

```typescript
// convex/actions/scrapeSledPortal.ts
"use node";

import { internalAction } from "../_generated/server";
import { internal } from "../_generated/api";
import { v } from "convex/values";

export const scrapeSledPortal = internalAction({
  args: {
    portalId: v.id("portals"),
    goalTemplate: v.string(),
    url: v.string(),
  },
  handler: async (ctx, args) => {
    // 1. Call TinyFish SSE endpoint
    const response = await fetch(
      "https://agent.tinyfish.ai/v1/automation/run-sse",
      {
        method: "POST",
        headers: {
          "X-API-Key": process.env.TINYFISH_API_KEY!,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          url: args.url,
          goal: args.goalTemplate,
        }),
      },
    );

    // 2. Read SSE stream
    const reader = response.body!.getReader();
    const decoder = new TextDecoder();
    let result = null;

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const text = decoder.decode(value);
      const lines = text.split("\n");

      for (const line of lines) {
        if (line.startsWith("data: ")) {
          const event = JSON.parse(line.slice(6));
          if (event.type === "COMPLETE" && event.status === "COMPLETED") {
            result = event.resultJson;
          }
        }
      }
    }

    // 3. Write results to Convex via mutation
    if (result?.opportunities) {
      await ctx.runMutation(internal.opportunities.ingestBatch, {
        portalId: args.portalId,
        opportunities: result.opportunities,
        scrapedAt: Date.now(),
      });
    }

    return {
      success: !!result,
      count: result?.opportunities?.length ?? 0,
    };
  },
});
```

### 5.6 Nightly Scraping Workflow

```
2:00 AM ET — Convex Cron triggers nightlyScrapeWorkflow

Step 1: Query all enabled portals from portal registry
Step 2: Fan out via Workpool — one TinyFish action per portal
        (parallelism limit: 20 concurrent agents)
Step 3: Each agent:
        a. Calls TinyFish SSE endpoint with portal's goal template
        b. Reads stream until COMPLETE
        c. Writes results via ingestBatch mutation
        d. Updates portal lastScrapedAt and status
Step 4: After all agents complete:
        a. Run deduplication across new results
        b. Run AI classification (Gemini) for NAICS/set-aside/budget
        c. Update aggregate counters
Step 5: Trigger alert digest workflow
        a. For each user with alertEnabled saved searches
        b. Match new opportunities against saved search filters
        c. Send Resend email with top matches
```

---

## 6. User Flows

### 6.1 Signup to First Result

```
Landing page → "Start Free" button
  → Email + password signup (Better Auth)
    → Onboarding wizard (3 steps):
      Step 1: Company basics (name, state, size)
      Step 2: Capabilities (NAICS codes autocomplete, keywords)
      Step 3: Certifications (checkboxes: 8(a), HUBZone, SDVOSB, WOSB, none)
    → Dashboard with first matched results
      (federal results available immediately from cached SAM.gov data)

Target: signup to first matched result in under 60 seconds
```

### 6.2 Search Flow

```
Search bar (top of dashboard)
  → Type natural language query or keywords
  → Results page with filters sidebar:
      Source: Federal / State / Local / All
      Set-aside: 8(a) / HUBZone / SDVOSB / WOSB / Small Business / All
      State: [multi-select]
      Budget: $min — $max slider
      Deadline: Next 7 / 14 / 30 / 60 days
      NAICS: [autocomplete multi-select]
  → Click result → expanded view with:
      Full description, contact info, deadline countdown,
      match score, "Save to Pipeline" button, "View Original" link
```

### 6.3 Upgrade Flow

```
Free user hits search limit (10/month) or tries SLED filter
  → Upgrade prompt with tier comparison
  → Select tier → Stripe Checkout (embedded)
  → Payment success → immediate access to paid features
  → No page reload needed (Convex real-time updates tier)
```

---

## 7. Pages & Navigation

### 7.1 Public Pages

| Page    | Route      | Purpose                                     |
| ------- | ---------- | ------------------------------------------- |
| Landing | `/`        | Hero, value prop, pricing, "Start Free" CTA |
| Pricing | `/pricing` | Tier comparison table, FAQ                  |
| Login   | `/login`   | Email/password login                        |
| Signup  | `/signup`  | Email/password signup                       |

### 7.2 Authenticated Pages (Dashboard)

| Page               | Route                         | Purpose                                              |
| ------------------ | ----------------------------- | ---------------------------------------------------- |
| Dashboard          | `/dashboard`                  | Matched opportunities, stats, coverage map           |
| Search             | `/dashboard/search`           | Full search with filters                             |
| Opportunity Detail | `/dashboard/opportunity/[id]` | Full details, save to pipeline, view original        |
| Pipeline           | `/dashboard/pipeline`         | Kanban or list view of saved opportunities by status |
| Saved Searches     | `/dashboard/saved`            | Manage saved searches and alert preferences          |
| Profile            | `/dashboard/profile`          | Edit NAICS, certifications, states, preferences      |
| Settings           | `/dashboard/settings`         | Account, billing, team (if Team tier)                |
| Coverage Map       | `/dashboard/coverage`         | Visual map of indexed jurisdictions                  |

### 7.3 Navigation Structure

```
Sidebar (app-sidebar from starter kit):
├── Dashboard (home)
├── Search
├── Pipeline
├── Saved Searches
├── Coverage Map
├── Profile
└── Settings / Billing
```

---

## 8. Success Metrics

### Demo Day Targets

| Metric                    | Target      | Stretch     |
| ------------------------- | ----------- | ----------- |
| Opportunities indexed     | 10,000+     | 50,000+     |
| State portals covered     | 10-15       | 25+         |
| Municipal portals covered | 20-30       | 50+         |
| Registered users          | 50+         | 200+        |
| Paying customers          | 5-10        | 20+         |
| MRR                       | $500+       | $2,000+     |
| Signup to first result    | <60 seconds | <30 seconds |
| Search response time      | <3 seconds  | <1 second   |

### North Star Metric

**Opportunities surfaced that the user would not have found otherwise.** This is
measured by tracking SLED-sourced opportunities that users save to their
pipeline. If users are saving municipal contracts they discovered through
GovScout, the product is working.

---

## 9. Build Plan

The timeline below accounts for AI-accelerated development velocity. Robert is a
top 1% TypeScript developer building with Claude Code + BMAD Method on a
pre-built starter kit with Convex components handling infrastructure.
Traditional timelines do not apply.

### Week 1: Foundation

**Goal:** Working search engine with federal data + first state portals.

- Clone starter kit, install Convex components (workpool, retrier, workflow,
  crons, rate-limiter, stripe, resend, aggregate, geospatial)
- Implement Convex schema (schema.ts above)
- SAM.gov API integration: pull active opportunities, parse, store
- USASpending API integration: historical award data
- TinyFish integration: first 3 state portals (CA, TX, VA)
- Basic search UI with filters
- Coverage map skeleton
- User profile + onboarding wizard

**End of week 1:** Searchable database of federal + 3 state opportunities. Users
can sign up, create a profile, and search.

### Week 2: SLED Expansion + Matching

**Goal:** Broad SLED coverage and AI matching.

- Add 7-12 more state portals via TinyFish goal templates
- Add 10-20 municipal/county portals
- Nightly scraping workflow (Convex workflow + crons + workpool)
- AI matching algorithm: score opportunities against user profiles
- Daily email digest (Resend component)
- Set-aside filtering
- Stripe billing integration
- Rate limiting (free tier enforcement)

**End of week 2:** Production-ready scraping pipeline. AI matching. Email
alerts. Billing. 10+ states, 20+ municipalities.

### Week 3: Polish + Revenue

**Goal:** Real users, real revenue.

- Landing page with positioning ("The Stripe of Government Contracting")
- Pricing page
- Dashboard polish: coverage map with real data, stats counters
- Pipeline tracking (save/status/notes)
- Saved searches with alerts
- Expand SLED coverage: add every portal that TinyFish can reliably scrape
- Begin outreach: r/govcontracting, GovLoop, LinkedIn
- First paying customers

**End of week 3:** Polished product with real users and initial revenue.

### Week 4-5: Growth + Demo Prep

**Goal:** Maximize coverage, users, and revenue before demo.

- Aggressive SLED expansion: target all 50 state portals + as many
  municipalities as possible
- Content marketing: "How to find government contracts" SEO content
- APEX Accelerator outreach (90+ centers that recommend tools to small
  contractors)
- Refine matching algorithm based on user behavior
- Performance optimization
- Record demo video
- Build pitch deck

### Week 6: Demo Video Submission

- Record and edit 2-3 minute demo video
- Post on X with @Tiny_Fish #TinyFishAccelerator #BuildInPublic
- Submit formal application

### Week 7-9: Scale + Demo Day

- Continue expanding SLED coverage
- Iterate on product based on user feedback
- Optimize conversion funnel (free → paid)
- Prepare Demo Day presentation
- Live demo showing real-time agent scraping, coverage map, matched results
- Present metrics: opportunities indexed, users, MRR, coverage

---

## 10. Risks & Mitigations

| Risk                                          | Severity | Probability | Mitigation                                                                                                                                                                                                           |
| --------------------------------------------- | -------- | ----------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| State portals resist TinyFish scraping        | Medium   | Low         | These are public procurement sites designed for vendor access. Low anti-bot by design. TinyFish stealth mode as backup. Test CA/TX/VA in week 1 — this is the #1 validation gate.                                    |
| SAM.gov system account delayed beyond 4 weeks | Medium   | Medium      | Public access (10 req/day) is sufficient for development and early users. Cache aggressively. USASpending API has no rate limits as supplementary source.                                                            |
| TinyFish API unreliable or expensive at scale | Medium   | Low         | Free accelerator credits cover build period. Action Retrier component handles transient failures. Workpool limits parallelism to avoid overload. Monitor step counts per portal and optimize goal templates.         |
| HigherGov adds AI features                    | Low      | Medium      | HigherGov is bootstrapped with no venture funding. AI R&D is expensive. GovScout has 6-12 month head start on AI-native architecture.                                                                                |
| GovDash moves downmarket                      | Very Low | Very Low    | Structurally impossible without destroying enterprise ACV, sales motion, and investor expectations. 56 employees, FedRAMP, $42M valuation all anchor them upmarket.                                                  |
| Low initial user adoption                     | Medium   | Medium      | Product-led growth via free tier. SEO targeting high-intent keywords ("SAM.gov alternative," "find government contracts"). APEX Accelerator partnerships provide built-in distribution to 78,000+ small contractors. |
| Federal contracting market shrinks (DOGE)     | Low      | Medium      | SLED is immune to federal cuts. Product actively redirects users toward stable municipal contracts. DOGE chaos increases demand, not decreases it.                                                                   |

---

## 11. Future Roadmap

### Phase 2 (Months 3-9): Coverage Moat

- All 50 state portals
- 200+ municipal/county portals
- Subcontractor matching engine
- AI proposal outlines (lightweight — compliance checklists, section outlines)
- API access for CRM integrations
- Target: 500+ paying customers, $50K+ MRR

### Phase 3 (Months 9-18): Platform

- Cooperative purchasing (NASPO ValuePoint, TIPS, Sourcewell)
- Teaming/partner network (match primes with sub needs)
- Full pipeline CRM
- Historical win/loss analytics
- White-label API for adjacent GovTech platforms
- Target: 2,000+ customers, $200K+ MRR, Series A ready

---

## 12. Appendix

### A. NAICS Codes Reference

The North American Industry Classification System (NAICS) is the standard for
classifying business activities. GovScout uses NAICS codes as the primary
matching dimension between user capabilities and opportunities. The full NAICS
database is available from the Census Bureau and should be loaded as a reference
table for autocomplete.

### B. Set-Aside Program Reference

| Program                        | Code    | Eligibility                                           | FY2024 Awards           |
| ------------------------------ | ------- | ----------------------------------------------------- | ----------------------- |
| 8(a) Business Development      | 8A      | SBA-certified socially and economically disadvantaged | Part of $76B SDB total  |
| HUBZone                        | HUBZONE | Principal office + 35% employees in HUBZone           | $17.5B                  |
| Service-Disabled Veteran-Owned | SDVOSB  | Service-disabled veteran owns 51%+                    | $32B                    |
| Women-Owned Small Business     | WOSB    | Woman owns 51%+, manages day-to-day                   | $31B                    |
| Small Business Set-Aside       | SB      | Meets SBA size standards for NAICS code               | Included in $176B total |

### C. SAM.gov API Endpoints

- **Get Opportunities:** `GET https://api.sam.gov/opportunities/v2/search`
- **Parameters:** keyword, soltype, naics, setaside, postedFrom, postedTo,
  state, zip, limit, offset
- **Documentation:** https://open.gsa.gov/api/get-opportunities-public-api/

### D. Key Links

- TinyFish Accelerator: https://www.tinyfish.ai/accelerator
- TinyFish API Docs: https://docs.mino.ai
- TinyFish API Credits Application: https://form.typeform.com/to/wwt0oJ3e
- SAM.gov API: https://open.gsa.gov/api/get-opportunities-public-api/
- USASpending API: https://api.usaspending.gov/
- Starter Kit: https://github.com/robertguss/web-app-starter-kit
- Convex Components: https://www.convex.dev/components
