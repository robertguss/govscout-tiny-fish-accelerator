"use node";

import { internalAction } from "../_generated/server";
import { internal } from "../_generated/api";
import { v } from "convex/values";

const TINYFISH_SSE_URL = "https://agent.tinyfish.ai/v1/automation/run-sse";

function parseDeadline(dateStr: string | null | undefined): number | undefined {
  if (!dateStr) return undefined;
  const d = new Date(dateStr);
  return isNaN(d.getTime()) ? undefined : d.getTime();
}

function parseBudget(budgetStr: string | null | undefined): number | undefined {
  if (!budgetStr) return undefined;
  // Match a number optionally followed immediately by K or M suffix
  const match = budgetStr
    .replace(/[,$]/g, "")
    .match(/(\d+(?:\.\d+)?)\s*([KkMm])?(?:\b|$)/);
  if (!match) return undefined;
  const num = parseFloat(match[1]);
  const suffix = match[2]?.toUpperCase();
  if (suffix === "M") return num * 1_000_000;
  if (suffix === "K") return num * 1_000;
  return num;
}

export const scrapeSledPortal = internalAction({
  args: {
    portalId: v.id("portals"),
    url: v.string(),
    goalTemplate: v.string(),
    state: v.string(),
    agencyLevel: v.union(
      v.literal("state"),
      v.literal("county"),
      v.literal("municipal"),
      v.literal("school_district"),
    ),
  },
  returns: v.object({
    success: v.boolean(),
    count: v.number(),
    newCount: v.number(),
    error: v.optional(v.string()),
  }),
  handler: async (
    ctx,
    args,
  ): Promise<{
    success: boolean;
    count: number;
    newCount: number;
    error?: string;
  }> => {
    const apiKey = process.env.TINYFISH_API_KEY;
    if (!apiKey) throw new Error("TINYFISH_API_KEY not set in Convex env");

    let result: any = null;
    let errorMsg: string | undefined;

    try {
      const response = await fetch(TINYFISH_SSE_URL, {
        method: "POST",
        headers: {
          "X-API-Key": apiKey,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          url: args.url,
          goal: args.goalTemplate,
        }),
      });

      if (!response.ok) {
        throw new Error(
          `TinyFish API error: ${response.status} ${response.statusText}`,
        );
      }

      // Read SSE stream
      const reader = response.body!.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() ?? ""; // Keep the potentially incomplete last line

        for (const line of lines) {
          if (!line.startsWith("data: ")) continue;
          try {
            const event = JSON.parse(line.slice(6));
            if (event.type === "COMPLETE" && event.status === "COMPLETED") {
              result = event.resultJson;
            }
          } catch {
            // Ignore malformed SSE lines
          }
        }
      }
    } catch (err: any) {
      errorMsg = err.message;
      await ctx.runMutation(internal.portals.updatePortalScrapeStatus, {
        portalId: args.portalId,
        status: "failed",
        error: errorMsg,
      });
      return { success: false, count: 0, newCount: 0, error: errorMsg };
    }

    if (!result?.opportunities?.length) {
      await ctx.runMutation(internal.portals.updatePortalScrapeStatus, {
        portalId: args.portalId,
        status: "partial",
        count: 0,
      });
      return { success: true, count: 0, newCount: 0 };
    }

    const sourceType =
      args.agencyLevel === "state"
        ? ("state_portal" as const)
        : args.agencyLevel === "county"
          ? ("county_portal" as const)
          : ("municipal_portal" as const);

    const opportunities = (result.opportunities as any[]).map((opp) => ({
      title: opp.title ?? "Untitled",
      agency: opp.agency ?? "Unknown Agency",
      agencyLevel: args.agencyLevel,
      state: args.state,
      deadline: parseDeadline(opp.deadline),
      estimatedBudget: parseBudget(opp.estimatedBudget),
      budgetConfidence: opp.estimatedBudget
        ? ("stated" as const)
        : ("unknown" as const),
      naicsCodes: [] as string[],
      sourceType,
      sourceUrl: opp.sourceUrl ?? args.url,
      sourcePortalId: args.portalId,
      solicitationNumber: opp.solicitationNumber,
      contactName: opp.contactName,
      contactEmail: opp.contactEmail,
      scrapedAt: Date.now(),
      active: true,
    }));

    const newCount: number = await ctx.runMutation(
      internal.opportunities.ingestBatch,
      {
        opportunities,
        sourceType,
        portalId: args.portalId,
      },
    );

    await ctx.runMutation(internal.portals.updatePortalScrapeStatus, {
      portalId: args.portalId,
      status: "success",
      count: opportunities.length,
    });

    return {
      success: true,
      count: opportunities.length,
      newCount,
    };
  },
});
