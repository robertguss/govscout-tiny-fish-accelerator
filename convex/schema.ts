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
      agencyLevels: v.optional(
        v.array(
          v.union(
            v.literal("federal"),
            v.literal("state"),
            v.literal("county"),
            v.literal("municipal"),
            v.literal("school_district"),
            v.literal("special_district"),
          ),
        ),
      ),
      setAsides: v.optional(
        v.array(
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
      ),
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
    stepsUsed: v.optional(v.number()), // TinyFish step budget tracking
    createdAt: v.number(),
  })
    .index("by_portalId", ["portalId"])
    .index("by_status", ["status"])
    .index("by_createdAt", ["createdAt"]),
});
