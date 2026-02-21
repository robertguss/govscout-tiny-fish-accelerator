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
  args: {
    // Safety cap: max portals to scrape per run. Critical during free trial.
    // Each portal costs ~15 TinyFish steps. Default 3 = ~45 steps/run.
    maxPortals: v.optional(v.number()),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    const maxPortals = args.maxPortals ?? 3;
    console.log(`Starting SLED scrape (max ${maxPortals} portals)...`);

    // Ensure portals are seeded on first run
    await ctx.runMutation(internal.portals.seedInitialPortals, {});

    // Get enabled portals, capped to budget limit
    const allPortals = await ctx.runQuery(
      internal.portals.listEnabledPortals,
      {},
    );
    const portals = allPortals.slice(0, maxPortals);

    console.log(
      `Scraping ${portals.length} of ${allPortals.length} enabled portals...`,
    );

    let totalStepsUsed = 0;

    // Scrape portals sequentially (workpool parallelism added in Week 2)
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
        totalStepsUsed += result.stepsUsed ?? 0;
        console.log(
          `Portal ${portal.name}: ${result.count} found, ${result.newCount} new, ${result.stepsUsed ?? 0} steps`,
        );
      } catch (err: any) {
        console.error(`Portal ${portal.name} failed: ${err.message}`);
      }
    }

    console.log(
      `SLED scrape complete. Total steps used this run: ${totalStepsUsed}`,
    );
    return null;
  },
});
