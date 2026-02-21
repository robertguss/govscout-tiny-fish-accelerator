import { cronJobs } from "convex/server";
import { internal } from "./_generated/api";

const crons = cronJobs();

// ─── CRONS PAUSED (early testing) ─────────────────────────────────────────────
// Trigger jobs manually from the Convex dashboard during development.
// Uncomment when ready to run on a schedule.

// Daily federal data sync at 1:00 AM ET (6:00 AM UTC)
// SAM.gov free API = 10 req/day. maxPages:2 uses 2, leaving 8 for manual use.
// Upgrade to SAM.gov system account for 1,000 req/day (apply now, 1-4 wks).
// crons.cron("sync sam.gov", "0 6 * * *", internal.jobs.nightlyFederalSync, {
//   daysBack: 1,
//   maxPages: 2,
// });

// SLED portal scraping — weekly on Sunday at 2:00 AM ET (7:00 AM UTC)
// ~15 TinyFish steps per portal. maxPortals:3 = ~45 steps/week.
// Change "0 7 * * 0" → "0 7 * * *" for daily once on a paid plan.
// crons.cron("weekly sled scrape", "0 7 * * 0", internal.jobs.nightlySledScrape, {
//   maxPortals: 3,
// });

export default crons;
