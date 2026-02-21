# GovScout Week 1: Foundation Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use `superpowers:executing-plans` to
> implement this plan task-by-task.

**Goal:** Build a working search engine for federal + first 3 state (CA, TX, VA)
government contract opportunities with user profile, onboarding wizard, and
nightly scraping infrastructure.

**Architecture:** Convex backend stores all opportunities in a unified schema.
SAM.gov REST API provides federal data (free, API key required). TinyFish SSE
API scrapes state portals nightly via a Convex workflow + cron. Next.js search
UI connects via Convex React hooks with real-time updates.

**Tech Stack:** Next.js 16, Convex 1.29, Better Auth, `@convex-dev/workpool`,
`@convex-dev/action-retrier`, `@convex-dev/workflow`, SAM.gov API, TinyFish SSE
API, shadcn/ui, TypeScript 5, Vitest + convex-test

**End state:** Users can sign up, complete a 3-step onboarding wizard, and
search a database of federal + CA/TX/VA procurement opportunities. A nightly
Convex cron triggers parallel TinyFish scraping agents.

---

## Pre-flight: Environment Variables

Before starting, ensure these are set in your Convex deployment:

```bash
npx convex env set SAM_GOV_API_KEY your_api_key_here
npx convex env set TINYFISH_API_KEY your_api_key_here
# BETTER_AUTH_SECRET and SITE_URL should already be set from starter kit setup
```

And in `.env.local`:

```
NEXT_PUBLIC_CONVEX_URL=...       # auto-created by convex dev
NEXT_PUBLIC_CONVEX_SITE_URL=https://your-deployment.convex.site   # NOT localhost
```

---

## Task 1: Install Convex Component Packages

**Files:**

- Modify: `package.json` (via pnpm install)
- Modify: `convex/convex.config.ts`

**Step 1: Install packages**

```bash
pnpm add @convex-dev/workpool @convex-dev/action-retrier @convex-dev/workflow
```

Expected: Packages added to `package.json` dependencies.

**Step 2: Update convex.config.ts**

Replace the contents of `convex/convex.config.ts`:

```typescript
import { defineApp } from "convex/server";
import betterAuth from "@convex-dev/better-auth/convex.config";
import workpool from "@convex-dev/workpool/convex.config";
import actionRetrier from "@convex-dev/action-retrier/convex.config";
import workflow from "@convex-dev/workflow/convex.config";

const app = defineApp();
app.use(betterAuth);
app.use(workpool);
app.use(actionRetrier);
app.use(workflow);

export default app;
```

**Step 3: Run Convex dev to validate**

```bash
pnpm run dev:backend
```

Expected: Convex dev starts successfully with no errors. Components appear in
dashboard.

**Step 4: Commit**

```bash
git add convex/convex.config.ts package.json pnpm-lock.yaml
git commit -m "feat: install Convex workpool, action-retrier, workflow components"
```

---

## Task 2: Replace Schema with GovScout Schema

**Files:**

- Modify: `convex/schema.ts`

**Context:** The starter kit has a placeholder `numbers` table. Replace it
entirely with the GovScout schema.

**Step 1: Write the new schema**

Replace `convex/schema.ts`:

```typescript
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  // ─── User Profiles ────────────────────────────────
  userProfiles: defineTable({
    userId: v.string(), // Better Auth user ID (string, not Id<"users"> — auth is in component)
    companyName: v.optional(v.string()),
    naicsCodes: v.array(v.string()), // e.g. ["541512", "541519"]
    certifications: v.array(v.string()), // e.g. ["8a", "hubzone", "sdvosb", "wosb"]
    certExpirations: v.optional(
      v.array(
        v.object({
          type: v.string(),
          expiresAt: v.number(), // Unix timestamp in ms
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
    .index("by_tier", ["tier"]),

  // ─── Opportunities ────────────────────────────────
  opportunities: defineTable({
    title: v.string(),
    description: v.optional(v.string()),
    agency: v.string(),
    agencyLevel: v.union(
      v.literal("federal"),
      v.literal("state"),
      v.literal("county"),
      v.literal("municipal"),
      v.literal("school_district"),
      v.literal("special_district"),
    ),
    state: v.optional(v.string()), // Two-letter state code
    county: v.optional(v.string()),
    city: v.optional(v.string()),
    deadline: v.optional(v.number()), // Unix timestamp in ms
    postedDate: v.optional(v.number()), // Unix timestamp in ms
    estimatedBudget: v.optional(v.number()),
    budgetConfidence: v.optional(
      v.union(
        v.literal("stated"),
        v.literal("estimated"),
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
      v.literal("state_portal"),
      v.literal("county_portal"),
      v.literal("municipal_portal"),
    ),
    sourceUrl: v.string(),
    sourcePortalId: v.optional(v.id("portals")),
    solicitationNumber: v.optional(v.string()),
    contactName: v.optional(v.string()),
    contactEmail: v.optional(v.string()),
    contactPhone: v.optional(v.string()),
    scrapedAt: v.number(),
    active: v.boolean(),
  })
    .index("by_state", ["state"])
    .index("by_agencyLevel", ["agencyLevel"])
    .index("by_deadline", ["deadline"])
    .index("by_setAside", ["setAside"])
    .index("by_sourceType", ["sourceType"])
    .index("by_active_deadline", ["active", "deadline"])
    .index("by_solicitationNumber", ["solicitationNumber"])
    .searchIndex("search_title", {
      searchField: "title",
      filterFields: ["agencyLevel", "state", "setAside", "active"],
    }),

  // ─── Portal Registry ──────────────────────────────
  portals: defineTable({
    name: v.string(), // e.g. "California Cal eProcure"
    url: v.string(),
    state: v.string(), // Two-letter code
    level: v.union(
      v.literal("state"),
      v.literal("county"),
      v.literal("municipal"),
      v.literal("school_district"),
    ),
    county: v.optional(v.string()),
    city: v.optional(v.string()),
    goalTemplate: v.string(), // TinyFish goal prompt
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
    userId: v.string(),
    name: v.string(),
    query: v.optional(v.string()),
    filters: v.object({
      states: v.optional(v.array(v.string())),
      agencyLevels: v.optional(v.array(v.string())),
      setAsides: v.optional(v.array(v.string())),
      naicsCodes: v.optional(v.array(v.string())),
      budgetMin: v.optional(v.number()),
      budgetMax: v.optional(v.number()),
    }),
    alertEnabled: v.boolean(),
    lastAlertSentAt: v.optional(v.number()),
    createdAt: v.number(),
  }).index("by_userId", ["userId"]),

  // ─── Pipeline ─────────────────────────────────────
  pipeline: defineTable({
    userId: v.string(),
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
    createdAt: v.number(),
  })
    .index("by_portalId", ["portalId"])
    .index("by_status", ["status"]),
});
```

**Step 2: Delete the placeholder files**

```bash
rm convex/myFunctions.ts convex/myFunctions.test.ts
```

**Step 3: Run codegen**

```bash
npx convex codegen
```

Expected: `convex/_generated/` files updated with new schema types. No
TypeScript errors.

**Step 4: Commit**

```bash
git add convex/schema.ts
git rm convex/myFunctions.ts convex/myFunctions.test.ts
git commit -m "feat: implement GovScout schema - opportunities, portals, profiles, pipeline"
```

---

## Task 3: Portal Registry Functions

**Files:**

- Create: `convex/portals.ts`
- Create: `convex/portals.test.ts`

**Step 1: Write the failing test**

Create `convex/portals.test.ts`:

```typescript
import { convexTest } from "convex-test";
import { describe, it, expect } from "vitest";
import { api, internal } from "./_generated/api";
import schema from "./schema";
import { modules } from "./test.setup";

describe("portals", () => {
  it("seeds and lists portals", async () => {
    const t = convexTest(schema, modules);

    await t.mutation(internal.portals.seedInitialPortals, {});

    const portals = await t.query(api.portals.listPortals, {});
    expect(portals.length).toBeGreaterThan(0);
    expect(portals[0].state).toBeDefined();
    expect(portals[0].enabled).toBe(true);
  });

  it("gets a single portal", async () => {
    const t = convexTest(schema, modules);

    await t.mutation(internal.portals.seedInitialPortals, {});

    const portals = await t.query(api.portals.listPortals, {});
    const portal = await t.query(api.portals.getPortal, { id: portals[0]._id });
    expect(portal).not.toBeNull();
    expect(portal!.name).toBe(portals[0].name);
  });

  it("updates portal status after scrape", async () => {
    const t = convexTest(schema, modules);

    await t.mutation(internal.portals.seedInitialPortals, {});
    const portals = await t.query(api.portals.listPortals, {});
    const portalId = portals[0]._id;

    await t.mutation(internal.portals.updatePortalScrapeStatus, {
      portalId,
      status: "success",
      count: 42,
    });

    const updated = await t.query(api.portals.getPortal, { id: portalId });
    expect(updated!.lastScrapeStatus).toBe("success");
    expect(updated!.lastScrapeCount).toBe(42);
    expect(updated!.lastScrapedAt).toBeDefined();
  });
});
```

**Step 2: Run test to confirm it fails**

```bash
pnpm run test:once -- portals
```

Expected: FAIL — `portals` module not found.

**Step 3: Implement portals.ts**

Create `convex/portals.ts`:

```typescript
import { internalMutation, mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Goal template factory for TinyFish agents
const makeGoalTemplate = (portalName: string, state: string) =>
  `Extract all currently active solicitations/bids/RFPs from this ${state} government procurement portal (${portalName}).
Navigate to the opportunities/solicitations listing, and extract each opportunity as a JSON object with these fields:
- title: string (solicitation title)
- agency: string (issuing department or agency)
- deadline: string (bid due date, exact text as shown)
- estimatedBudget: string or null (dollar amount if visible)
- solicitationNumber: string or null (reference/opportunity number)
- contactName: string or null
- contactEmail: string or null
- sourceUrl: string (direct URL to this specific solicitation)
Return a JSON object with key "opportunities" containing an array of these objects.
Only include active/open solicitations. Skip any that are closed or awarded.`;

const INITIAL_PORTALS = [
  {
    name: "California Cal eProcure",
    url: "https://caleprocure.ca.gov/pages/Events/event-search.aspx",
    state: "CA",
    level: "state" as const,
    goalTemplate: makeGoalTemplate("Cal eProcure", "California"),
    scrapeFrequency: "daily" as const,
    enabled: true,
    notes: "Largest state portal. Clean HTML, low anti-bot.",
  },
  {
    name: "Texas SmartBuy",
    url: "https://www.txsmartbuy.com/sp",
    state: "TX",
    level: "state" as const,
    goalTemplate: makeGoalTemplate("SmartBuy", "Texas"),
    scrapeFrequency: "daily" as const,
    enabled: true,
    notes: "Second largest state. Low anti-bot.",
  },
  {
    name: "Virginia eVA",
    url: "https://eva.virginia.gov/",
    state: "VA",
    level: "state" as const,
    goalTemplate: makeGoalTemplate("eVA", "Virginia"),
    scrapeFrequency: "daily" as const,
    enabled: true,
    notes: "Dense federal contractor population. Priority for matching.",
  },
];

export const seedInitialPortals = internalMutation({
  args: {},
  returns: v.number(),
  handler: async (ctx) => {
    // Skip if already seeded
    const existing = await ctx.db.query("portals").first();
    if (existing) return 0;

    let count = 0;
    for (const portal of INITIAL_PORTALS) {
      await ctx.db.insert("portals", portal);
      count++;
    }
    return count;
  },
});

export const listPortals = query({
  args: { enabledOnly: v.optional(v.boolean()) },
  returns: v.array(v.any()),
  handler: async (ctx, args) => {
    if (args.enabledOnly !== false) {
      return ctx.db
        .query("portals")
        .withIndex("by_enabled", (q) => q.eq("enabled", true))
        .collect();
    }
    return ctx.db.query("portals").collect();
  },
});

export const getPortal = query({
  args: { id: v.id("portals") },
  returns: v.union(v.any(), v.null()),
  handler: async (ctx, args) => {
    return ctx.db.get(args.id);
  },
});

export const updatePortalScrapeStatus = internalMutation({
  args: {
    portalId: v.id("portals"),
    status: v.union(
      v.literal("success"),
      v.literal("partial"),
      v.literal("failed"),
    ),
    count: v.optional(v.number()),
    error: v.optional(v.string()),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    await ctx.db.patch(args.portalId, {
      lastScrapedAt: Date.now(),
      lastScrapeStatus: args.status,
      lastScrapeCount: args.count,
    });
    return null;
  },
});
```

**Step 4: Run test to confirm it passes**

```bash
pnpm run test:once -- portals
```

Expected: PASS — 3 tests passing.

**Step 5: Commit**

```bash
git add convex/portals.ts convex/portals.test.ts
git commit -m "feat: portal registry with CA/TX/VA initial portals"
```

---

## Task 4: Opportunities Core Functions

**Files:**

- Create: `convex/opportunities.ts`
- Create: `convex/opportunities.test.ts`

**Step 1: Write the failing tests**

Create `convex/opportunities.test.ts`:

```typescript
import { convexTest } from "convex-test";
import { describe, it, expect } from "vitest";
import { api, internal } from "./_generated/api";
import schema from "./schema";
import { modules } from "./test.setup";

const SAMPLE_OPPORTUNITY = {
  title: "IT Cybersecurity Services",
  agency: "Department of Homeland Security",
  agencyLevel: "federal" as const,
  state: "DC",
  naicsCodes: ["541512"],
  setAside: "small_business" as const,
  sourceType: "sam_gov" as const,
  sourceUrl: "https://sam.gov/opp/abc123",
  solicitationNumber: "DHS-2026-001",
  scrapedAt: Date.now(),
  active: true,
};

describe("opportunities", () => {
  it("ingests a batch of opportunities", async () => {
    const t = convexTest(schema, modules);

    const count = await t.mutation(internal.opportunities.ingestBatch, {
      opportunities: [SAMPLE_OPPORTUNITY],
      sourceType: "sam_gov",
    });

    expect(count).toBe(1);

    const stored = await t.run(async (ctx) =>
      ctx.db.query("opportunities").collect(),
    );
    expect(stored).toHaveLength(1);
    expect(stored[0].title).toBe("IT Cybersecurity Services");
  });

  it("deduplicates by solicitationNumber on re-ingest", async () => {
    const t = convexTest(schema, modules);

    await t.mutation(internal.opportunities.ingestBatch, {
      opportunities: [SAMPLE_OPPORTUNITY],
      sourceType: "sam_gov",
    });
    // Ingest same opportunity again
    await t.mutation(internal.opportunities.ingestBatch, {
      opportunities: [SAMPLE_OPPORTUNITY],
      sourceType: "sam_gov",
    });

    const stored = await t.run(async (ctx) =>
      ctx.db.query("opportunities").collect(),
    );
    expect(stored).toHaveLength(1); // Should not duplicate
  });

  it("lists recent active opportunities", async () => {
    const t = convexTest(schema, modules);

    await t.mutation(internal.opportunities.ingestBatch, {
      opportunities: [
        SAMPLE_OPPORTUNITY,
        {
          ...SAMPLE_OPPORTUNITY,
          title: "Network Infrastructure RFP",
          solicitationNumber: "DHS-2026-002",
        },
      ],
      sourceType: "sam_gov",
    });

    const result = await t.query(api.opportunities.listRecent, { limit: 10 });
    expect(result).toHaveLength(2);
  });

  it("filters opportunities by state", async () => {
    const t = convexTest(schema, modules);

    await t.mutation(internal.opportunities.ingestBatch, {
      opportunities: [
        { ...SAMPLE_OPPORTUNITY, state: "VA", solicitationNumber: "VA-001" },
        { ...SAMPLE_OPPORTUNITY, state: "TX", solicitationNumber: "TX-001" },
      ],
      sourceType: "sam_gov",
    });

    const vaOpps = await t.query(api.opportunities.listByState, {
      state: "VA",
    });
    expect(vaOpps).toHaveLength(1);
    expect(vaOpps[0].state).toBe("VA");
  });
});
```

**Step 2: Run test to confirm it fails**

```bash
pnpm run test:once -- opportunities
```

Expected: FAIL — `opportunities` module not found.

**Step 3: Implement opportunities.ts**

Create `convex/opportunities.ts`:

```typescript
import { internalMutation, query } from "./_generated/server";
import { v } from "convex/values";

// Type for incoming opportunity data (before normalization to DB format)
const opportunityInputValidator = v.object({
  title: v.string(),
  description: v.optional(v.string()),
  agency: v.string(),
  agencyLevel: v.union(
    v.literal("federal"),
    v.literal("state"),
    v.literal("county"),
    v.literal("municipal"),
    v.literal("school_district"),
    v.literal("special_district"),
  ),
  state: v.optional(v.string()),
  county: v.optional(v.string()),
  city: v.optional(v.string()),
  deadline: v.optional(v.number()),
  postedDate: v.optional(v.number()),
  estimatedBudget: v.optional(v.number()),
  budgetConfidence: v.optional(
    v.union(v.literal("stated"), v.literal("estimated"), v.literal("unknown")),
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
    v.literal("state_portal"),
    v.literal("county_portal"),
    v.literal("municipal_portal"),
  ),
  sourceUrl: v.string(),
  sourcePortalId: v.optional(v.id("portals")),
  solicitationNumber: v.optional(v.string()),
  contactName: v.optional(v.string()),
  contactEmail: v.optional(v.string()),
  contactPhone: v.optional(v.string()),
  scrapedAt: v.number(),
  active: v.boolean(),
});

export const ingestBatch = internalMutation({
  args: {
    opportunities: v.array(opportunityInputValidator),
    sourceType: v.string(),
    portalId: v.optional(v.id("portals")),
  },
  returns: v.number(),
  handler: async (ctx, args) => {
    let newCount = 0;

    for (const opp of args.opportunities) {
      // Deduplicate by solicitationNumber (if present)
      if (opp.solicitationNumber) {
        const existing = await ctx.db
          .query("opportunities")
          .withIndex("by_solicitationNumber", (q) =>
            q.eq("solicitationNumber", opp.solicitationNumber),
          )
          .unique();

        if (existing) {
          // Update existing record's scrapedAt and active status
          await ctx.db.patch(existing._id, {
            scrapedAt: opp.scrapedAt,
            active: opp.active,
          });
          continue;
        }
      }

      await ctx.db.insert("opportunities", {
        ...opp,
        sourcePortalId: args.portalId,
      });
      newCount++;
    }

    return newCount;
  },
});

export const listRecent = query({
  args: { limit: v.optional(v.number()) },
  returns: v.array(v.any()),
  handler: async (ctx, args) => {
    return ctx.db
      .query("opportunities")
      .withIndex("by_active_deadline", (q) => q.eq("active", true))
      .order("desc")
      .take(args.limit ?? 20);
  },
});

export const listByState = query({
  args: { state: v.string(), limit: v.optional(v.number()) },
  returns: v.array(v.any()),
  handler: async (ctx, args) => {
    return ctx.db
      .query("opportunities")
      .withIndex("by_state", (q) => q.eq("state", args.state))
      .order("desc")
      .take(args.limit ?? 50);
  },
});

export const getOpportunity = query({
  args: { id: v.id("opportunities") },
  returns: v.union(v.any(), v.null()),
  handler: async (ctx, args) => {
    return ctx.db.get(args.id);
  },
});

export const searchOpportunities = query({
  args: {
    query: v.optional(v.string()),
    states: v.optional(v.array(v.string())),
    agencyLevel: v.optional(v.string()),
    setAside: v.optional(v.string()),
    limit: v.optional(v.number()),
  },
  returns: v.array(v.any()),
  handler: async (ctx, args) => {
    const limit = args.limit ?? 50;

    // Full-text search when query provided
    if (args.query && args.query.trim().length > 0) {
      const results = await ctx.db
        .query("opportunities")
        .withSearchIndex("search_title", (q) => {
          let search = q.search("title", args.query!);
          if (args.agencyLevel) {
            search = search.eq(
              "agencyLevel",
              args.agencyLevel as
                | "federal"
                | "state"
                | "county"
                | "municipal"
                | "school_district"
                | "special_district",
            );
          }
          if (args.setAside) {
            search = search.eq(
              "setAside",
              args.setAside as
                | "8a"
                | "hubzone"
                | "sdvosb"
                | "wosb"
                | "small_business"
                | "unrestricted"
                | "other",
            );
          }
          return search.eq("active", true);
        })
        .take(limit);
      return results;
    }

    // Filtered browsing without full-text search
    let dbQuery = ctx.db
      .query("opportunities")
      .withIndex("by_active_deadline", (q) => q.eq("active", true))
      .order("desc");

    const results = await dbQuery.take(limit);

    // Apply client-side filters (state/setAside) for non-search queries
    return results.filter((opp) => {
      if (
        args.states &&
        args.states.length > 0 &&
        !args.states.includes(opp.state ?? "")
      ) {
        return false;
      }
      if (args.setAside && opp.setAside !== args.setAside) {
        return false;
      }
      if (args.agencyLevel && opp.agencyLevel !== args.agencyLevel) {
        return false;
      }
      return true;
    });
  },
});

export const getStats = query({
  args: {},
  returns: v.object({
    total: v.number(),
    federal: v.number(),
    state: v.number(),
    local: v.number(),
  }),
  handler: async (ctx) => {
    const all = await ctx.db
      .query("opportunities")
      .withIndex("by_active_deadline", (q) => q.eq("active", true))
      .collect();
    return {
      total: all.length,
      federal: all.filter((o) => o.agencyLevel === "federal").length,
      state: all.filter((o) => o.agencyLevel === "state").length,
      local: all.filter((o) =>
        ["county", "municipal", "school_district", "special_district"].includes(
          o.agencyLevel,
        ),
      ).length,
    };
  },
});
```

**Step 4: Run tests to confirm they pass**

```bash
pnpm run test:once -- opportunities
```

Expected: PASS — 4 tests passing.

**Step 5: Commit**

```bash
git add convex/opportunities.ts convex/opportunities.test.ts
git commit -m "feat: opportunities ingest, search, and stats queries"
```

---

## Task 5: User Profile Functions

**Files:**

- Create: `convex/userProfiles.ts`
- Create: `convex/userProfiles.test.ts`

**Step 1: Write the failing tests**

Create `convex/userProfiles.test.ts`:

```typescript
import { convexTest } from "convex-test";
import { describe, it, expect } from "vitest";
import { api } from "./_generated/api";
import schema from "./schema";
import { modules } from "./test.setup";

describe("userProfiles", () => {
  it("creates a profile for a new user", async () => {
    const t = convexTest(schema, modules);
    const asUser = t.withIdentity({ subject: "user_abc123", name: "Jane Doe" });

    await asUser.mutation(api.userProfiles.upsertProfile, {
      companyName: "Acme IT Services",
      naicsCodes: ["541512", "541519"],
      certifications: ["sdvosb"],
      states: ["VA", "MD"],
      keywords: ["cybersecurity", "network"],
    });

    const profile = await asUser.query(api.userProfiles.getMyProfile, {});
    expect(profile).not.toBeNull();
    expect(profile!.companyName).toBe("Acme IT Services");
    expect(profile!.naicsCodes).toContain("541512");
    expect(profile!.tier).toBe("free"); // Default tier
    expect(profile!.onboardingComplete).toBe(false); // Not complete yet
  });

  it("completes onboarding", async () => {
    const t = convexTest(schema, modules);
    const asUser = t.withIdentity({ subject: "user_abc123" });

    await asUser.mutation(api.userProfiles.upsertProfile, {
      companyName: "Acme IT",
      naicsCodes: ["541512"],
      certifications: [],
      states: ["VA"],
      keywords: [],
    });
    await asUser.mutation(api.userProfiles.completeOnboarding, {});

    const profile = await asUser.query(api.userProfiles.getMyProfile, {});
    expect(profile!.onboardingComplete).toBe(true);
  });

  it("updates an existing profile", async () => {
    const t = convexTest(schema, modules);
    const asUser = t.withIdentity({ subject: "user_abc123" });

    await asUser.mutation(api.userProfiles.upsertProfile, {
      companyName: "Old Name",
      naicsCodes: ["541512"],
      certifications: [],
      states: ["VA"],
      keywords: [],
    });
    await asUser.mutation(api.userProfiles.upsertProfile, {
      companyName: "New Name",
      naicsCodes: ["541512", "561210"],
      certifications: ["8a"],
      states: ["VA", "MD"],
      keywords: ["federal"],
    });

    const profile = await asUser.query(api.userProfiles.getMyProfile, {});
    expect(profile!.companyName).toBe("New Name");
    expect(profile!.certifications).toContain("8a");
    expect(profile!.states).toContain("MD");
  });
});
```

**Step 2: Run test to confirm it fails**

```bash
pnpm run test:once -- userProfiles
```

Expected: FAIL — module not found.

**Step 3: Implement userProfiles.ts**

Create `convex/userProfiles.ts`:

```typescript
import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const getMyProfile = query({
  args: {},
  returns: v.union(v.any(), v.null()),
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return null;

    return ctx.db
      .query("userProfiles")
      .withIndex("by_userId", (q) => q.eq("userId", identity.subject))
      .unique();
  },
});

export const upsertProfile = mutation({
  args: {
    companyName: v.optional(v.string()),
    naicsCodes: v.array(v.string()),
    certifications: v.array(v.string()),
    states: v.array(v.string()),
    keywords: v.array(v.string()),
    contractSizeMin: v.optional(v.number()),
    contractSizeMax: v.optional(v.number()),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    const existing = await ctx.db
      .query("userProfiles")
      .withIndex("by_userId", (q) => q.eq("userId", identity.subject))
      .unique();

    const now = Date.now();

    if (existing) {
      await ctx.db.patch(existing._id, {
        ...args,
        updatedAt: now,
      });
    } else {
      await ctx.db.insert("userProfiles", {
        userId: identity.subject,
        companyName: args.companyName,
        naicsCodes: args.naicsCodes,
        certifications: args.certifications,
        states: args.states,
        keywords: args.keywords,
        contractSizeMin: args.contractSizeMin,
        contractSizeMax: args.contractSizeMax,
        tier: "free",
        onboardingComplete: false,
        createdAt: now,
        updatedAt: now,
      });
    }
    return null;
  },
});

export const completeOnboarding = mutation({
  args: {},
  returns: v.null(),
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    const profile = await ctx.db
      .query("userProfiles")
      .withIndex("by_userId", (q) => q.eq("userId", identity.subject))
      .unique();

    if (!profile) throw new Error("Profile not found");

    await ctx.db.patch(profile._id, {
      onboardingComplete: true,
      updatedAt: Date.now(),
    });
    return null;
  },
});
```

**Step 4: Run tests to confirm they pass**

```bash
pnpm run test:once -- userProfiles
```

Expected: PASS — 3 tests passing.

**Step 5: Commit**

```bash
git add convex/userProfiles.ts convex/userProfiles.test.ts
git commit -m "feat: user profile upsert, onboarding completion, and query"
```

---

## Task 6: SAM.gov Ingestion Action

**Files:**

- Create: `convex/actions/syncSamGov.ts`

**Context:** SAM.gov public API endpoint is
`https://api.sam.gov/opportunities/v2/search`. Requires `api_key` query param.
Returns JSON with `opportunitiesData` array. Rate limit: 10 req/day (public),
1000/day (system account). Fetch the last 30 days of opportunities, paginate
with `offset` + `limit=100`.

**Set-aside code mapping (SAM.gov → our schema):**

- `"SBA"` or `"Total Small Business Set-Aside (FAR 19.5)"` → `"small_business"`
- `"8A"` → `"8a"`
- `"HZC"` or `"Historically Underutilized Business (HUBZone) Set-Aside"` →
  `"hubzone"`
- `"SDVOSBC"` or `"Service-Disabled Veteran-Owned Small Business"` → `"sdvosb"`
- `"WOSB"` → `"wosb"`
- `null` / `undefined` → `"unrestricted"`
- anything else → `"other"`

**Step 1: Create the actions directory and file**

```bash
mkdir -p convex/actions
```

Create `convex/actions/syncSamGov.ts`:

```typescript
"use node";

import { internalAction } from "../_generated/server";
import { internal } from "../_generated/api";
import { v } from "convex/values";

const SAM_GOV_BASE = "https://api.sam.gov/opportunities/v2/search";

function mapSetAside(
  code: string | null | undefined,
):
  | "8a"
  | "hubzone"
  | "sdvosb"
  | "wosb"
  | "small_business"
  | "unrestricted"
  | "other"
  | undefined {
  if (!code) return "unrestricted";
  const c = code.toUpperCase();
  if (c === "SBA" || c.includes("TOTAL SMALL BUSINESS"))
    return "small_business";
  if (c === "8A" || c.includes("8(A)")) return "8a";
  if (c === "HZC" || c.includes("HUBZONE")) return "hubzone";
  if (c === "SDVOSBC" || c.includes("SERVICE-DISABLED VETERAN"))
    return "sdvosb";
  if (c === "WOSB" || c.includes("WOMEN-OWNED")) return "wosb";
  if (c === "NONE" || c === "UNRESTRICTED") return "unrestricted";
  return "other";
}

function parseDate(dateStr: string | null | undefined): number | undefined {
  if (!dateStr) return undefined;
  const d = new Date(dateStr);
  return isNaN(d.getTime()) ? undefined : d.getTime();
}

export const syncSamGov = internalAction({
  args: {
    daysBack: v.optional(v.number()), // How many days of history to fetch
    maxPages: v.optional(v.number()), // Safety limit on API calls
  },
  returns: v.object({ total: v.number(), newOpportunities: v.number() }),
  handler: async (ctx, args) => {
    const apiKey = process.env.SAM_GOV_API_KEY;
    if (!apiKey) throw new Error("SAM_GOV_API_KEY not set in Convex env");

    const daysBack = args.daysBack ?? 30;
    const maxPages = args.maxPages ?? 5; // Conservative default (5 pages × 100 = 500 opportunities)

    const fromDate = new Date();
    fromDate.setDate(fromDate.getDate() - daysBack);
    const postedFrom = `${String(fromDate.getMonth() + 1).padStart(2, "0")}/${String(fromDate.getDate()).padStart(2, "0")}/${fromDate.getFullYear()}`;
    const postedTo = `${String(new Date().getMonth() + 1).padStart(2, "0")}/${String(new Date().getDate()).padStart(2, "0")}/${new Date().getFullYear()}`;

    let totalFetched = 0;
    let totalNew = 0;
    let offset = 0;
    const limit = 100;

    for (let page = 0; page < maxPages; page++) {
      const url = new URL(SAM_GOV_BASE);
      url.searchParams.set("api_key", apiKey);
      url.searchParams.set("limit", String(limit));
      url.searchParams.set("offset", String(offset));
      url.searchParams.set("postedFrom", postedFrom);
      url.searchParams.set("postedTo", postedTo);
      url.searchParams.set("active", "Yes");

      const response = await fetch(url.toString());
      if (!response.ok) {
        console.error(
          `SAM.gov API error: ${response.status} ${response.statusText}`,
        );
        break;
      }

      const data = await response.json();
      const items: any[] = data.opportunitiesData ?? [];

      if (items.length === 0) break;

      const normalized = items.map((item: any) => ({
        title: item.title ?? "Untitled",
        description: item.description,
        agency:
          item.fullParentPathName ?? item.organizationType ?? "Unknown Agency",
        agencyLevel: "federal" as const,
        state: item.placeOfPerformance?.state?.code,
        deadline: parseDate(item.responseDeadLine),
        postedDate: parseDate(item.postedDate),
        naicsCodes: item.naicsCode ? [item.naicsCode] : [],
        setAside: mapSetAside(item.typeOfSetAside),
        sourceType: "sam_gov" as const,
        sourceUrl: item.uiLink ?? `https://sam.gov/opp/${item.noticeId}`,
        solicitationNumber: item.solicitationNumber,
        contactName: item.pointOfContact?.[0]?.fullName,
        contactEmail: item.pointOfContact?.[0]?.email,
        scrapedAt: Date.now(),
        active: item.active === "Yes",
      }));

      const newCount = await ctx.runMutation(
        internal.opportunities.ingestBatch,
        {
          opportunities: normalized,
          sourceType: "sam_gov",
        },
      );

      totalFetched += items.length;
      totalNew += newCount;
      offset += limit;

      // Stop if we got fewer than limit (last page)
      if (items.length < limit) break;
    }

    return { total: totalFetched, newOpportunities: totalNew };
  },
});
```

**Step 2: Run codegen**

```bash
npx convex codegen
```

Expected: Generated files updated with new `internal.actions.syncSamGov`
reference.

**Step 3: Manually test via Convex dashboard**

```bash
# Start dev server if not running
pnpm run dev:backend
# Open dashboard
npx convex dashboard
```

In the dashboard, navigate to Functions → `actions/syncSamGov` → Run with
`{ "daysBack": 7, "maxPages": 1 }`.

Expected: Function returns `{ total: N, newOpportunities: N }` where N > 0.
Check Data tab → opportunities table has records.

**Step 4: Commit**

```bash
git add convex/actions/syncSamGov.ts
git commit -m "feat: SAM.gov API ingestion action with set-aside normalization"
```

---

## Task 7: TinyFish SLED Scraping Action

**Files:**

- Create: `convex/actions/scrapeSledPortal.ts`

**Context:** TinyFish SSE API endpoint:
`https://agent.tinyfish.ai/v1/automation/run-sse`. Posts JSON with `url` and
`goal`. Streams SSE events. We read until a `COMPLETE` event with
`status: "COMPLETED"` containing `resultJson`. The result should have an
`opportunities` array.

**Step 1: Implement scrapeSledPortal.ts**

Create `convex/actions/scrapeSledPortal.ts`:

```typescript
"use node";

import { internalAction } from "../_generated/server";
import { internal } from "../_generated/api";
import { v } from "convex/values";

const TINYFISH_SSE_URL = "https://agent.tinyfish.ai/v1/automation/run-sse";

function parseDeadline(dateStr: string | null | undefined): number | undefined {
  if (!dateStr) return undefined;
  const d = new Date(dateStr);
  return isNaN(d.getTime()) ? undefined : d.getTime();
}

function parseBudget(budgetStr: string | null | undefined): number | undefined {
  if (!budgetStr) return undefined;
  // Remove currency symbols, commas, text — extract first number
  const match = budgetStr.replace(/[,$]/g, "").match(/[\d.]+/);
  if (!match) return undefined;
  const num = parseFloat(match[0]);
  // Handle K/M suffixes in the original string
  if (budgetStr.toLowerCase().includes("m")) return num * 1_000_000;
  if (budgetStr.toLowerCase().includes("k")) return num * 1_000;
  return num;
}

export const scrapeSledPortal = internalAction({
  args: {
    portalId: v.id("portals"),
    url: v.string(),
    goalTemplate: v.string(),
    state: v.string(),
    agencyLevel: v.union(
      v.literal("state"),
      v.literal("county"),
      v.literal("municipal"),
      v.literal("school_district"),
    ),
  },
  returns: v.object({
    success: v.boolean(),
    count: v.number(),
    newCount: v.number(),
    error: v.optional(v.string()),
  }),
  handler: async (ctx, args) => {
    const apiKey = process.env.TINYFISH_API_KEY;
    if (!apiKey) throw new Error("TINYFISH_API_KEY not set in Convex env");

    let result: any = null;
    let errorMsg: string | undefined;

    try {
      const response = await fetch(TINYFISH_SSE_URL, {
        method: "POST",
        headers: {
          "X-API-Key": apiKey,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          url: args.url,
          goal: args.goalTemplate,
        }),
      });

      if (!response.ok) {
        throw new Error(`TinyFish API error: ${response.status}`);
      }

      // Read SSE stream
      const reader = response.body!.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const text = decoder.decode(value);
        for (const line of text.split("\n")) {
          if (!line.startsWith("data: ")) continue;
          try {
            const event = JSON.parse(line.slice(6));
            if (event.type === "COMPLETE" && event.status === "COMPLETED") {
              result = event.resultJson;
            }
          } catch {
            // Ignore malformed SSE lines
          }
        }
      }
    } catch (err: any) {
      errorMsg = err.message;
      await ctx.runMutation(internal.portals.updatePortalScrapeStatus, {
        portalId: args.portalId,
        status: "failed",
        error: errorMsg,
      });
      return { success: false, count: 0, newCount: 0, error: errorMsg };
    }

    if (!result?.opportunities?.length) {
      await ctx.runMutation(internal.portals.updatePortalScrapeStatus, {
        portalId: args.portalId,
        status: "partial",
        count: 0,
      });
      return { success: true, count: 0, newCount: 0 };
    }

    const opportunities = (result.opportunities as any[]).map((opp) => ({
      title: opp.title ?? "Untitled",
      agency: opp.agency ?? "Unknown Agency",
      agencyLevel: args.agencyLevel,
      state: args.state,
      deadline: parseDeadline(opp.deadline),
      estimatedBudget: parseBudget(opp.estimatedBudget),
      budgetConfidence: opp.estimatedBudget
        ? ("stated" as const)
        : ("unknown" as const),
      naicsCodes: [] as string[],
      sourceType:
        args.agencyLevel === "state"
          ? ("state_portal" as const)
          : args.agencyLevel === "county"
            ? ("county_portal" as const)
            : ("municipal_portal" as const),
      sourceUrl: opp.sourceUrl ?? args.url,
      sourcePortalId: args.portalId,
      solicitationNumber: opp.solicitationNumber,
      contactName: opp.contactName,
      contactEmail: opp.contactEmail,
      scrapedAt: Date.now(),
      active: true,
    }));

    const newCount = await ctx.runMutation(internal.opportunities.ingestBatch, {
      opportunities,
      sourceType:
        args.agencyLevel === "state" ? "state_portal" : "county_portal",
      portalId: args.portalId,
    });

    await ctx.runMutation(internal.portals.updatePortalScrapeStatus, {
      portalId: args.portalId,
      status: "success",
      count: opportunities.length,
    });

    return {
      success: true,
      count: opportunities.length,
      newCount,
    };
  },
});
```

**Step 2: Manually test (requires TinyFish API key)**

In the Convex dashboard, first seed portals:

- Run `internal.portals.seedInitialPortals` with `{}`

Then get the CA portal ID from the Data tab, and run
`internal.actions.scrapeSledPortal` with:

```json
{
  "portalId": "<CA portal ID>",
  "url": "https://caleprocure.ca.gov/pages/Events/event-search.aspx",
  "goalTemplate": "...",
  "state": "CA",
  "agencyLevel": "state"
}
```

Expected: Returns `{ success: true, count: N, newCount: N }`. Opportunities
table has CA state records.

**Step 3: Commit**

```bash
git add convex/actions/scrapeSledPortal.ts
git commit -m "feat: TinyFish SLED portal scraping action with SSE stream parsing"
```

---

## Task 8: Nightly Scraping Cron

**Files:**

- Create: `convex/crons.ts`
- Modify: `convex/http.ts` (register workflow handlers)

**Context:** Convex crons are defined in `convex/crons.ts` using `cronJobs` from
`"convex/server"`. No external package needed for crons themselves. The nightly
job should: seed portals (first run), then scrape each enabled portal in
sequence (workpool parallelism to be added in Week 2).

**Step 1: Implement crons.ts**

Create `convex/crons.ts`:

```typescript
import { cronJobs } from "convex/server";
import { internal } from "./_generated/api";

const crons = cronJobs();

// Nightly federal data sync at 1:00 AM ET (6:00 AM UTC)
crons.cron("sync sam.gov", "0 6 * * *", internal.jobs.nightlyFederalSync, {
  daysBack: 1,
  maxPages: 10,
});

// Nightly SLED portal scraping at 2:00 AM ET (7:00 AM UTC)
crons.cron(
  "nightly sled scrape",
  "0 7 * * *",
  internal.jobs.nightlySledScrape,
  {},
);

export default crons;
```

**Step 2: Create jobs.ts for the cron handler functions**

Create `convex/jobs.ts`:

```typescript
import { internalAction } from "./_generated/server";
import { internal } from "./_generated/api";
import { v } from "convex/values";

export const nightlyFederalSync = internalAction({
  args: {
    daysBack: v.optional(v.number()),
    maxPages: v.optional(v.number()),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    console.log("Starting nightly SAM.gov sync...");
    const result = await ctx.runAction(internal.actions.syncSamGov.syncSamGov, {
      daysBack: args.daysBack ?? 1,
      maxPages: args.maxPages ?? 10,
    });
    console.log(
      `SAM.gov sync complete: ${result.total} fetched, ${result.newOpportunities} new`,
    );
    return null;
  },
});

export const nightlySledScrape = internalAction({
  args: {},
  returns: v.null(),
  handler: async (ctx) => {
    console.log("Starting nightly SLED scrape...");

    // Ensure portals are seeded
    await ctx.runMutation(internal.portals.seedInitialPortals, {});

    // Get all enabled portals
    const portals = await ctx.runQuery(internal.portals.listEnabledPortals, {});

    console.log(`Scraping ${portals.length} portals...`);

    // Scrape portals sequentially (workpool parallelism in Week 2)
    for (const portal of portals) {
      try {
        const result = await ctx.runAction(
          internal.actions.scrapeSledPortal.scrapeSledPortal,
          {
            portalId: portal._id,
            url: portal.url,
            goalTemplate: portal.goalTemplate,
            state: portal.state,
            agencyLevel: portal.level as
              | "state"
              | "county"
              | "municipal"
              | "school_district",
          },
        );
        console.log(
          `Portal ${portal.name}: ${result.count} found, ${result.newCount} new`,
        );
      } catch (err: any) {
        console.error(`Portal ${portal.name} failed: ${err.message}`);
      }
    }

    console.log("SLED scrape complete");
    return null;
  },
});
```

**Step 3: Add internal portal query for jobs.ts**

In `convex/portals.ts`, add this function:

```typescript
export const listEnabledPortals = internalQuery({
  args: {},
  returns: v.array(v.any()),
  handler: async (ctx) => {
    return ctx.db
      .query("portals")
      .withIndex("by_enabled", (q) => q.eq("enabled", true))
      .collect();
  },
});
```

Also add the import at the top of `convex/portals.ts`:

```typescript
import {
  internalMutation,
  internalQuery,
  mutation,
  query,
} from "./_generated/server";
```

**Step 4: Run codegen and verify**

```bash
npx convex codegen
pnpm run dev:backend
```

Expected: Convex dev starts, crons appear in Convex dashboard under Crons
section.

**Step 5: Commit**

```bash
git add convex/crons.ts convex/jobs.ts convex/portals.ts
git commit -m "feat: nightly cron jobs for SAM.gov sync and SLED portal scraping"
```

---

## Task 9: Onboarding Wizard UI

**Files:**

- Create: `app/dashboard/onboarding/page.tsx`
- Modify: `middleware.ts` (redirect new users to onboarding)

**Context:** A 3-step wizard using shadcn/ui. Step 1: Company basics. Step 2:
NAICS codes (free-text, comma-separated for now). Step 3: Certifications
(checkboxes). On completion, call `completeOnboarding` mutation and redirect to
`/dashboard`.

**Step 1: Create the onboarding page**

Create `app/dashboard/onboarding/page.tsx`:

```tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const CERTIFICATIONS = [
  {
    id: "8a",
    label: "8(a) Business Development",
    description: "SBA-certified socially/economically disadvantaged",
  },
  {
    id: "hubzone",
    label: "HUBZone",
    description: "Historically Underutilized Business Zone",
  },
  {
    id: "sdvosb",
    label: "SDVOSB",
    description: "Service-Disabled Veteran-Owned Small Business",
  },
  { id: "wosb", label: "WOSB", description: "Women-Owned Small Business" },
];

const US_STATES = [
  "AL",
  "AK",
  "AZ",
  "AR",
  "CA",
  "CO",
  "CT",
  "DE",
  "FL",
  "GA",
  "HI",
  "ID",
  "IL",
  "IN",
  "IA",
  "KS",
  "KY",
  "LA",
  "ME",
  "MD",
  "MA",
  "MI",
  "MN",
  "MS",
  "MO",
  "MT",
  "NE",
  "NV",
  "NH",
  "NJ",
  "NM",
  "NY",
  "NC",
  "ND",
  "OH",
  "OK",
  "OR",
  "PA",
  "RI",
  "SC",
  "SD",
  "TN",
  "TX",
  "UT",
  "VT",
  "VA",
  "WA",
  "WV",
  "WI",
  "WY",
  "DC",
];

export default function OnboardingPage() {
  const router = useRouter();
  const upsertProfile = useMutation(api.userProfiles.upsertProfile);
  const completeOnboarding = useMutation(api.userProfiles.completeOnboarding);

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  // Step 1
  const [companyName, setCompanyName] = useState("");
  const [selectedStates, setSelectedStates] = useState<string[]>([]);

  // Step 2
  const [naicsInput, setNaicsInput] = useState("");
  const [keywords, setKeywords] = useState("");

  // Step 3
  const [certifications, setCertifications] = useState<string[]>([]);

  const toggleState = (state: string) => {
    setSelectedStates((prev) =>
      prev.includes(state) ? prev.filter((s) => s !== state) : [...prev, state],
    );
  };

  const toggleCert = (id: string) => {
    setCertifications((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id],
    );
  };

  const handleFinish = async () => {
    setLoading(true);
    try {
      const naicsCodes = naicsInput
        .split(",")
        .map((s) => s.trim())
        .filter((s) => s.length > 0);

      const keywordList = keywords
        .split(",")
        .map((s) => s.trim())
        .filter((s) => s.length > 0);

      await upsertProfile({
        companyName: companyName || undefined,
        naicsCodes,
        certifications,
        states: selectedStates,
        keywords: keywordList,
      });
      await completeOnboarding();
      router.push("/dashboard");
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 p-4">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <div className="mb-2 flex gap-2">
            {[1, 2, 3].map((n) => (
              <div
                key={n}
                className={`h-2 flex-1 rounded-full transition-colors ${
                  n <= step ? "bg-primary" : "bg-zinc-200"
                }`}
              />
            ))}
          </div>
          <CardTitle>
            {step === 1 && "Welcome to GovScout"}
            {step === 2 && "Your Capabilities"}
            {step === 3 && "Your Certifications"}
          </CardTitle>
          <CardDescription>
            {step === 1 &&
              "Tell us about your company so we can find matching opportunities."}
            {step === 2 &&
              "Enter your NAICS codes and keywords to improve AI matching."}
            {step === 3 &&
              "Select certifications to unlock set-aside filtering."}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {step === 1 && (
            <>
              <div className="space-y-2">
                <Label htmlFor="company">Company Name (optional)</Label>
                <Input
                  id="company"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="Acme IT Services LLC"
                />
              </div>
              <div className="space-y-2">
                <Label>Primary States (select up to 5)</Label>
                <div className="grid max-h-48 grid-cols-6 gap-1 overflow-y-auto rounded border p-2">
                  {US_STATES.map((state) => (
                    <button
                      key={state}
                      onClick={() => toggleState(state)}
                      className={`rounded px-1 py-0.5 text-xs transition-colors ${
                        selectedStates.includes(state)
                          ? "bg-primary text-primary-foreground"
                          : "hover:bg-zinc-100"
                      }`}
                    >
                      {state}
                    </button>
                  ))}
                </div>
                {selectedStates.length > 0 && (
                  <p className="text-xs text-muted-foreground">
                    Selected: {selectedStates.join(", ")}
                  </p>
                )}
              </div>
            </>
          )}

          {step === 2 && (
            <>
              <div className="space-y-2">
                <Label htmlFor="naics">NAICS Codes</Label>
                <Input
                  id="naics"
                  value={naicsInput}
                  onChange={(e) => setNaicsInput(e.target.value)}
                  placeholder="541512, 541519, 561210"
                />
                <p className="text-xs text-muted-foreground">
                  Comma-separated. Find yours at{" "}
                  <a
                    href="https://www.census.gov/naics/"
                    target="_blank"
                    rel="noreferrer"
                    className="underline"
                  >
                    census.gov/naics
                  </a>
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="keywords">Keywords (optional)</Label>
                <Input
                  id="keywords"
                  value={keywords}
                  onChange={(e) => setKeywords(e.target.value)}
                  placeholder="cybersecurity, network infrastructure, cloud"
                />
                <p className="text-xs text-muted-foreground">
                  Comma-separated terms for AI matching.
                </p>
              </div>
            </>
          )}

          {step === 3 && (
            <div className="space-y-3">
              {CERTIFICATIONS.map((cert) => (
                <div key={cert.id} className="flex items-start space-x-3">
                  <Checkbox
                    id={cert.id}
                    checked={certifications.includes(cert.id)}
                    onCheckedChange={() => toggleCert(cert.id)}
                  />
                  <div>
                    <Label
                      htmlFor={cert.id}
                      className="cursor-pointer font-medium"
                    >
                      {cert.label}
                    </Label>
                    <p className="text-xs text-muted-foreground">
                      {cert.description}
                    </p>
                  </div>
                </div>
              ))}
              <div className="flex items-start space-x-3">
                <Checkbox
                  id="none"
                  checked={certifications.length === 0}
                  onCheckedChange={() => setCertifications([])}
                />
                <Label htmlFor="none" className="cursor-pointer">
                  None / Not sure
                </Label>
              </div>
            </div>
          )}

          <div className="flex gap-2 pt-2">
            {step > 1 && (
              <Button
                variant="outline"
                onClick={() => setStep(step - 1)}
                className="flex-1"
              >
                Back
              </Button>
            )}
            {step < 3 ? (
              <Button onClick={() => setStep(step + 1)} className="flex-1">
                Continue
              </Button>
            ) : (
              <Button
                onClick={handleFinish}
                disabled={loading}
                className="flex-1"
              >
                {loading ? "Setting up..." : "Start Finding Contracts"}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
```

**Step 2: Verify the page renders**

```bash
pnpm run dev
```

Navigate to `http://localhost:3000/dashboard/onboarding`. Expected: 3-step
wizard renders. Clicking through steps works. Final step saves profile and
redirects.

**Step 3: Commit**

```bash
git add app/dashboard/onboarding/
git commit -m "feat: 3-step onboarding wizard for company profile, NAICS codes, certifications"
```

---

## Task 10: Search Page UI

**Files:**

- Create: `app/dashboard/search/page.tsx`

**Step 1: Create search page**

Create `app/dashboard/search/page.tsx`:

```tsx
"use client";

import { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AppSidebar } from "@/components/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { SiteHeader } from "@/components/site-header";
import {
  Search,
  ExternalLink,
  Calendar,
  Building2,
  DollarSign,
} from "lucide-react";

const SET_ASIDE_LABELS: Record<string, string> = {
  "8a": "8(a)",
  hubzone: "HUBZone",
  sdvosb: "SDVOSB",
  wosb: "WOSB",
  small_business: "Small Business",
  unrestricted: "Unrestricted",
  other: "Other",
};

const AGENCY_LEVEL_LABELS: Record<string, string> = {
  federal: "Federal",
  state: "State",
  county: "County",
  municipal: "Municipal",
  school_district: "School District",
};

function formatDeadline(timestamp: number | undefined): string {
  if (!timestamp) return "No deadline";
  const d = new Date(timestamp);
  const now = new Date();
  const daysLeft = Math.ceil(
    (d.getTime() - now.getTime()) / (1000 * 60 * 60 * 24),
  );
  if (daysLeft < 0) return "Expired";
  if (daysLeft === 0) return "Due today";
  if (daysLeft === 1) return "Due tomorrow";
  return `${daysLeft} days left`;
}

function formatBudget(amount: number | undefined): string {
  if (!amount) return "";
  if (amount >= 1_000_000) return `$${(amount / 1_000_000).toFixed(1)}M`;
  if (amount >= 1_000) return `$${(amount / 1_000).toFixed(0)}K`;
  return `$${amount.toLocaleString()}`;
}

export default function SearchPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [submittedQuery, setSubmittedQuery] = useState("");
  const [agencyLevel, setAgencyLevel] = useState<string>("");
  const [setAside, setSetAside] = useState<string>("");

  const opportunities = useQuery(api.opportunities.searchOpportunities, {
    query: submittedQuery || undefined,
    agencyLevel: agencyLevel || undefined,
    setAside: setAside || undefined,
    limit: 50,
  });

  const handleSearch = () => {
    setSubmittedQuery(searchQuery);
  };

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col gap-4 p-4 md:p-6">
          {/* Search bar */}
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                placeholder="Search opportunities (e.g. IT cybersecurity Virginia)"
                className="pl-9"
              />
            </div>
            <Button onClick={handleSearch}>Search</Button>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-2">
            <Select value={agencyLevel} onValueChange={setAgencyLevel}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Source" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Sources</SelectItem>
                <SelectItem value="federal">Federal</SelectItem>
                <SelectItem value="state">State</SelectItem>
                <SelectItem value="county">County</SelectItem>
                <SelectItem value="municipal">Municipal</SelectItem>
              </SelectContent>
            </Select>

            <Select value={setAside} onValueChange={setSetAside}>
              <SelectTrigger className="w-44">
                <SelectValue placeholder="Set-Aside" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Set-Asides</SelectItem>
                <SelectItem value="small_business">Small Business</SelectItem>
                <SelectItem value="8a">8(a)</SelectItem>
                <SelectItem value="hubzone">HUBZone</SelectItem>
                <SelectItem value="sdvosb">SDVOSB</SelectItem>
                <SelectItem value="wosb">WOSB</SelectItem>
                <SelectItem value="unrestricted">Unrestricted</SelectItem>
              </SelectContent>
            </Select>

            {(agencyLevel || setAside || submittedQuery) && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setSearchQuery("");
                  setSubmittedQuery("");
                  setAgencyLevel("");
                  setSetAside("");
                }}
              >
                Clear filters
              </Button>
            )}
          </div>

          {/* Results */}
          <div className="space-y-3">
            {opportunities === undefined && (
              <p className="text-muted-foreground">Loading...</p>
            )}
            {opportunities?.length === 0 && (
              <div className="rounded-lg border border-dashed p-8 text-center text-muted-foreground">
                <Search className="mx-auto mb-2 h-8 w-8 opacity-40" />
                <p>
                  No opportunities found. Try adjusting your search or filters.
                </p>
              </div>
            )}
            {opportunities?.map((opp) => (
              <Card key={opp._id} className="transition-shadow hover:shadow-md">
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between gap-2">
                    <CardTitle className="text-base leading-snug">
                      {opp.title}
                    </CardTitle>
                    <a
                      href={opp.sourceUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="shrink-0 text-muted-foreground hover:text-foreground"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    <Badge variant="outline" className="text-xs">
                      {AGENCY_LEVEL_LABELS[opp.agencyLevel] ?? opp.agencyLevel}
                    </Badge>
                    {opp.setAside && opp.setAside !== "unrestricted" && (
                      <Badge variant="secondary" className="text-xs">
                        {SET_ASIDE_LABELS[opp.setAside] ?? opp.setAside}
                      </Badge>
                    )}
                    {opp.state && (
                      <Badge variant="outline" className="text-xs">
                        {opp.state}
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Building2 className="h-3 w-3" />
                      {opp.agency}
                    </span>
                    {opp.deadline && (
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {formatDeadline(opp.deadline)}
                      </span>
                    )}
                    {opp.estimatedBudget && (
                      <span className="flex items-center gap-1">
                        <DollarSign className="h-3 w-3" />
                        {formatBudget(opp.estimatedBudget)}
                      </span>
                    )}
                  </div>
                  {opp.description && (
                    <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">
                      {opp.description}
                    </p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          {opportunities && opportunities.length > 0 && (
            <p className="text-center text-sm text-muted-foreground">
              {opportunities.length} opportunities
            </p>
          )}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
```

**Step 2: Verify page renders and search works**

Navigate to `http://localhost:3000/dashboard/search` (after seeding data via
Task 6 manual test). Expected: Search bar shows, results cards appear with
opportunity data. Filters work.

**Step 3: Commit**

```bash
git add app/dashboard/search/
git commit -m "feat: search page with full-text search and agency/set-aside filters"
```

---

## Task 11: Update Dashboard Home

**Files:**

- Modify: `app/dashboard/page.tsx`
- Delete: `app/dashboard/data.json` (if present — it's demo data)

**Step 1: Delete demo data file**

```bash
rm -f app/dashboard/data.json
```

**Step 2: Replace dashboard page**

Replace `app/dashboard/page.tsx`:

```tsx
"use client";

import { useQuery } from "convex/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { api } from "@/convex/_generated/api";
import { AppSidebar } from "@/components/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { SiteHeader } from "@/components/site-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Building2, Globe, MapPin, TrendingUp } from "lucide-react";
import Link from "next/link";

export default function DashboardPage() {
  const router = useRouter();
  const profile = useQuery(api.userProfiles.getMyProfile, {});
  const stats = useQuery(api.opportunities.getStats, {});
  const recentOpps = useQuery(api.opportunities.listRecent, { limit: 5 });
  const portals = useQuery(api.portals.listPortals, {});

  // Redirect to onboarding if profile not complete
  useEffect(() => {
    if (
      profile !== undefined &&
      profile !== null &&
      !profile.onboardingComplete
    ) {
      router.push("/dashboard/onboarding");
    }
  }, [profile, router]);

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col gap-4 p-4 md:gap-6 md:p-6">
          {/* Stats */}
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                  <Globe className="h-4 w-4" />
                  Total Opportunities
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">
                  {stats?.total?.toLocaleString() ?? "—"}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                  <Building2 className="h-4 w-4" />
                  Federal
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">
                  {stats?.federal?.toLocaleString() ?? "—"}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  State
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">
                  {stats?.state?.toLocaleString() ?? "—"}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                  <TrendingUp className="h-4 w-4" />
                  Local
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">
                  {stats?.local?.toLocaleString() ?? "—"}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Recent opportunities */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Recent Opportunities</CardTitle>
              <Link
                href="/dashboard/search"
                className="text-sm text-primary hover:underline"
              >
                View all →
              </Link>
            </CardHeader>
            <CardContent className="space-y-3">
              {recentOpps?.length === 0 && (
                <p className="text-muted-foreground">
                  No opportunities yet.{" "}
                  <Link href="/dashboard/search" className="underline">
                    Run a search
                  </Link>{" "}
                  or wait for the nightly sync.
                </p>
              )}
              {recentOpps?.map((opp) => (
                <div
                  key={opp._id}
                  className="flex items-start justify-between gap-2 border-b pb-3 last:border-0 last:pb-0"
                >
                  <div>
                    <p className="font-medium leading-snug">{opp.title}</p>
                    <p className="mt-0.5 text-sm text-muted-foreground">
                      {opp.agency}
                    </p>
                  </div>
                  <Badge variant="outline" className="shrink-0 text-xs">
                    {opp.agencyLevel}
                  </Badge>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Coverage */}
          {portals && portals.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Indexed Portals</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {portals.map((portal: any) => (
                    <Badge key={portal._id} variant="secondary">
                      {portal.name} ({portal.lastScrapeCount ?? 0} opps)
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
```

**Step 3: Commit**

```bash
git add app/dashboard/page.tsx
git rm -f app/dashboard/data.json
git commit -m "feat: GovScout dashboard with stats, recent opportunities, and portal coverage"
```

---

## Task 12: Update Sidebar Navigation

**Files:**

- Modify: `components/app-sidebar.tsx`

**Step 1: Read current sidebar**

Read `components/app-sidebar.tsx` to understand the current structure before
editing.

**Step 2: Update nav items**

Replace the navigation items array with GovScout navigation. Find the nav items
configuration (look for `navMain` or similar array) and replace with:

```typescript
const navItems = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Search",
    url: "/dashboard/search",
    icon: Search,
  },
  {
    title: "Pipeline",
    url: "/dashboard/pipeline",
    icon: Kanban,
  },
  {
    title: "Saved Searches",
    url: "/dashboard/saved",
    icon: Bookmark,
  },
  {
    title: "Coverage Map",
    url: "/dashboard/coverage",
    icon: Map,
  },
  {
    title: "Profile",
    url: "/dashboard/profile",
    icon: User,
  },
];
```

Import the Lucide icons at the top:
`LayoutDashboard, Search, Kanban, Bookmark, Map, User` from `"lucide-react"`.

**Note:** Read the actual `app-sidebar.tsx` first before making edits — the
starter kit's sidebar has a specific structure. Adapt the data format to match
what's already there.

**Step 3: Commit**

```bash
git add components/app-sidebar.tsx
git commit -m "feat: update sidebar navigation for GovScout routes"
```

---

## Task 13: Update Landing Page

**Files:**

- Modify: `app/page.tsx`

**Step 1: Replace landing page**

Replace `app/page.tsx`:

```tsx
"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const router = useRouter();
  const session = authClient.useSession();
  const user = session.data?.user;

  if (user) {
    router.push("/dashboard");
    return null;
  }

  return (
    <div className="flex min-h-screen flex-col bg-zinc-50">
      {/* Nav */}
      <header className="border-b bg-white px-6 py-4">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <span className="text-xl font-bold">GovScout</span>
          <div className="flex items-center gap-3">
            <Link href="/login">
              <Button variant="ghost">Sign in</Button>
            </Link>
            <Link href="/signup">
              <Button>Start Free</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <main className="flex-1">
        <section className="px-6 py-20 text-center">
          <div className="mx-auto max-w-3xl">
            <Badge className="mb-4">The Stripe of Government Contracting</Badge>
            <h1 className="mb-6 text-4xl font-bold tracking-tight md:text-5xl">
              Find government contracts your competitors miss
            </h1>
            <p className="mb-8 text-lg text-zinc-600">
              AI-powered search across federal, state, and local procurement
              portals. GovWin charges $13,000/year. GovDash requires a sales
              call. We charge $49/month, and you start in 30 seconds.
            </p>
            <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
              <Link href="/signup">
                <Button size="lg" className="w-full sm:w-auto">
                  Start Free — No Card Required
                </Button>
              </Link>
              <Link href="/pricing">
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full sm:w-auto"
                >
                  See Pricing
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Pricing */}
        <section className="border-t bg-white px-6 py-16">
          <div className="mx-auto max-w-4xl">
            <h2 className="mb-10 text-center text-2xl font-bold">
              Simple, honest pricing
            </h2>
            <div className="grid gap-6 md:grid-cols-3">
              {[
                {
                  name: "Free",
                  price: "$0",
                  desc: "Get started",
                  features: [
                    "10 searches/month",
                    "Federal only",
                    "1 saved search",
                  ],
                },
                {
                  name: "Starter",
                  price: "$49/mo",
                  desc: "Most popular",
                  features: [
                    "Unlimited search",
                    "Federal + 1 state",
                    "AI matching",
                    "Daily alerts",
                  ],
                  highlight: true,
                },
                {
                  name: "Professional",
                  price: "$99/mo",
                  desc: "Full access",
                  features: [
                    "Federal + 5 states",
                    "Set-aside filtering",
                    "Pipeline tracking",
                    "14-day free trial",
                  ],
                },
              ].map((tier) => (
                <div
                  key={tier.name}
                  className={`rounded-xl border p-6 ${
                    tier.highlight
                      ? "border-primary shadow-md"
                      : "border-zinc-200"
                  }`}
                >
                  {tier.highlight && (
                    <Badge className="mb-2">Most Popular</Badge>
                  )}
                  <h3 className="text-lg font-bold">{tier.name}</h3>
                  <p className="text-2xl font-bold">{tier.price}</p>
                  <ul className="mt-4 space-y-2">
                    {tier.features.map((f) => (
                      <li
                        key={f}
                        className="flex items-center gap-2 text-sm text-zinc-600"
                      >
                        <span className="text-green-500">✓</span> {f}
                      </li>
                    ))}
                  </ul>
                  <Link href="/signup" className="mt-6 block">
                    <Button
                      className="w-full"
                      variant={tier.highlight ? "default" : "outline"}
                    >
                      Get Started
                    </Button>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t bg-white px-6 py-8 text-center text-sm text-zinc-500">
        GovScout — Government contracts, found by AI, priced for small business.
      </footer>
    </div>
  );
}
```

**Step 2: Commit**

```bash
git add app/page.tsx
git commit -m "feat: GovScout landing page with hero, value proposition, and pricing tiers"
```

---

## Week 1 Validation Checklist

Before declaring Week 1 complete, verify:

- [ ] `pnpm run test:once` — All tests pass
- [ ] `pnpm run build` — Production build succeeds with no TypeScript errors
- [ ] Convex dashboard shows: portals table has 3 records (CA/TX/VA), crons
      registered
- [ ] Sign up at `localhost:3000` → complete onboarding → reach dashboard
- [ ] SAM.gov sync: Run `internal.jobs.nightlyFederalSync` in dashboard →
      opportunities table has federal records
- [ ] Search page: Navigate to `/dashboard/search` → opportunities appear →
      filters work
- [ ] TinyFish test (if API key available): Run
      `internal.actions.scrapeSledPortal` for CA portal → state records appear

---

## Final Commit

```bash
git add -A
git commit -m "feat: GovScout Week 1 foundation — schema, SAM.gov, TinyFish, search UI, onboarding"
```
