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
