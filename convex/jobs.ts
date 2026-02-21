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

    // Ensure portals are seeded on first run
    await ctx.runMutation(internal.portals.seedInitialPortals, {});

    // Get all enabled portals
    const portals = await ctx.runQuery(internal.portals.listEnabledPortals, {});

    console.log(`Scraping ${portals.length} portals...`);

    // Scrape portals sequentially (workpool parallelism to be added in Week 2)
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
