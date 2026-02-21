import { cronJobs } from "convex/server";
import { internal } from "./_generated/api";

const crons = cronJobs();

// Nightly federal data sync at 1:00 AM ET (6:00 AM UTC)
crons.cron("sync sam.gov", "0 6 * * *", internal.jobs.nightlyFederalSync, {
  daysBack: 1,
  maxPages: 10,
});

// SLED portal scraping — weekly on Sunday at 2:00 AM ET (7:00 AM UTC)
// Set to weekly during free trial (500 steps). Each portal costs ~15 steps.
// Change to "0 7 * * *" (daily) once on a paid plan with sufficient credits.
crons.cron("weekly sled scrape", "0 7 * * 0", internal.jobs.nightlySledScrape, {
  maxPortals: 3,
});

export default crons;
