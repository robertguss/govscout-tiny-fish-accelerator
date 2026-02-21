import { internalMutation, query } from "./_generated/server";
import { v } from "convex/values";

// Validator for incoming opportunity data
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
    const results = await ctx.db
      .query("opportunities")
      .withIndex("by_active_deadline", (q) => q.eq("active", true))
      .order("desc")
      .take(limit);

    // Apply client-side filters for non-search queries
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
    const [
      federalOpps,
      stateOpps,
      countyOpps,
      municipalOpps,
      schoolOpps,
      specialOpps,
    ] = await Promise.all([
      ctx.db
        .query("opportunities")
        .withIndex("by_agencyLevel", (q) => q.eq("agencyLevel", "federal"))
        .collect(),
      ctx.db
        .query("opportunities")
        .withIndex("by_agencyLevel", (q) => q.eq("agencyLevel", "state"))
        .collect(),
      ctx.db
        .query("opportunities")
        .withIndex("by_agencyLevel", (q) => q.eq("agencyLevel", "county"))
        .collect(),
      ctx.db
        .query("opportunities")
        .withIndex("by_agencyLevel", (q) => q.eq("agencyLevel", "municipal"))
        .collect(),
      ctx.db
        .query("opportunities")
        .withIndex("by_agencyLevel", (q) =>
          q.eq("agencyLevel", "school_district"),
        )
        .collect(),
      ctx.db
        .query("opportunities")
        .withIndex("by_agencyLevel", (q) =>
          q.eq("agencyLevel", "special_district"),
        )
        .collect(),
    ]);

    const federal = federalOpps.length;
    const state = stateOpps.length;
    const local =
      countyOpps.length +
      municipalOpps.length +
      schoolOpps.length +
      specialOpps.length;

    return {
      total: federal + state + local,
      federal,
      state,
      local,
    };
  },
});
