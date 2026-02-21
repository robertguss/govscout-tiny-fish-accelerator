import { internalMutation, internalQuery, query } from "./_generated/server";
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
