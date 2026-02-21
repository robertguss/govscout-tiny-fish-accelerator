import { internalMutation, query } from "./_generated/server";
import { v } from "convex/values";

// ─── Mutations (called by scrapeSledPortal action) ────────────────────────────

export const createJob = internalMutation({
  args: { portalId: v.id("portals") },
  returns: v.id("scrapeJobs"),
  handler: async (ctx, args) => {
    return ctx.db.insert("scrapeJobs", {
      portalId: args.portalId,
      status: "running",
      startedAt: Date.now(),
      createdAt: Date.now(),
    });
  },
});

export const completeJob = internalMutation({
  args: {
    jobId: v.id("scrapeJobs"),
    opportunitiesFound: v.number(),
    opportunitiesNew: v.number(),
    stepsUsed: v.optional(v.number()),
    tinyfishRunId: v.optional(v.string()),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    await ctx.db.patch(args.jobId, {
      status: "completed",
      completedAt: Date.now(),
      opportunitiesFound: args.opportunitiesFound,
      opportunitiesNew: args.opportunitiesNew,
      stepsUsed: args.stepsUsed,
      tinyfishRunId: args.tinyfishRunId,
    });
    return null;
  },
});

export const failJob = internalMutation({
  args: {
    jobId: v.id("scrapeJobs"),
    error: v.string(),
    stepsUsed: v.optional(v.number()),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    await ctx.db.patch(args.jobId, {
      status: "failed",
      completedAt: Date.now(),
      error: args.error,
      stepsUsed: args.stepsUsed,
    });
    return null;
  },
});

// ─── Queries (dashboard visibility) ───────────────────────────────────────────

export const listRecent = query({
  args: { limit: v.optional(v.number()) },
  returns: v.array(v.any()),
  handler: async (ctx, args) => {
    return ctx.db
      .query("scrapeJobs")
      .withIndex("by_createdAt")
      .order("desc")
      .take(args.limit ?? 20);
  },
});

/**
 * Returns total TinyFish steps consumed across all tracked scrape jobs.
 * Use this to monitor free trial budget burn.
 */
export const getTotalStepsUsed = query({
  args: {},
  returns: v.object({
    totalSteps: v.number(),
    jobCount: v.number(),
    successCount: v.number(),
    failCount: v.number(),
  }),
  handler: async (ctx) => {
    const jobs = await ctx.db.query("scrapeJobs").collect();
    const totalSteps = jobs.reduce((sum, j) => sum + (j.stepsUsed ?? 0), 0);
    return {
      totalSteps,
      jobCount: jobs.length,
      successCount: jobs.filter((j) => j.status === "completed").length,
      failCount: jobs.filter((j) => j.status === "failed").length,
    };
  },
});
