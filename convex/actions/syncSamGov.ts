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
  | "other" {
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

function toMDY(date: Date): string {
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  const y = date.getFullYear();
  return `${m}/${d}/${y}`;
}

// SAM.gov free public API: 10 requests/day hard limit.
// Budget allocation:
//   - Daily cron (daysBack:1, maxPages:2)  = 2 requests/day (automatic)
//   - Manual testing/backfill              = 8 requests/day remaining
// Apply for a SAM.gov system account to get 1,000 requests/day (1-4 week approval).
// https://open.gsa.gov/api/get-opportunities-public-api/
export const syncSamGov = internalAction({
  args: {
    daysBack: v.optional(v.number()),
    // maxPages controls how many API requests are made (1 page = 1 request = 100 opportunities).
    // Default 2 = 200 opportunities max per run. Safe for the 10 req/day free limit.
    maxPages: v.optional(v.number()),
  },
  returns: v.object({
    total: v.number(),
    newOpportunities: v.number(),
    requestsUsed: v.number(),
    rateLimited: v.boolean(),
  }),
  handler: async (ctx, args) => {
    const apiKey = process.env.SAM_GOV_API_KEY;
    if (!apiKey) throw new Error("SAM_GOV_API_KEY not set in Convex env");

    const daysBack = args.daysBack ?? 1;
    const maxPages = args.maxPages ?? 2; // Conservative default: 2 of 10 daily requests

    const fromDate = new Date();
    fromDate.setDate(fromDate.getDate() - daysBack);
    const postedFrom = toMDY(fromDate);
    const postedTo = toMDY(new Date());

    let totalFetched = 0;
    let totalNew = 0;
    let requestsUsed = 0;
    let rateLimited = false;
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
      requestsUsed++;

      // Handle rate limit explicitly — stop pagination, don't crash
      if (response.status === 429) {
        console.warn(
          `SAM.gov rate limit hit after ${requestsUsed} requests today. ` +
            `Saving ${page + 1 < maxPages ? maxPages - page - 1 : 0} remaining planned requests. ` +
            `Limit resets at midnight UTC. Apply for a system account for 1,000 req/day.`,
        );
        rateLimited = true;
        break;
      }

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

      if (items.length < limit) break; // Last page — no need for another request
    }

    console.log(
      `SAM.gov sync: ${requestsUsed} API requests used, ${totalFetched} fetched, ${totalNew} new` +
        (rateLimited ? " (RATE LIMITED)" : ""),
    );

    return {
      total: totalFetched,
      newOpportunities: totalNew,
      requestsUsed,
      rateLimited,
    };
  },
});
