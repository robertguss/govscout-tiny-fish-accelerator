import { convexTest } from "convex-test";
import { describe, it, expect } from "vitest";
import { api, internal } from "./_generated/api";
import schema from "./schema";
import { modules } from "./test.setup";

const SAMPLE_OPPORTUNITY = {
  title: "IT Cybersecurity Services",
  agency: "Department of Homeland Security",
  agencyLevel: "federal" as const,
  state: "DC",
  naicsCodes: ["541512"],
  setAside: "small_business" as const,
  sourceType: "sam_gov" as const,
  sourceUrl: "https://sam.gov/opp/abc123",
  solicitationNumber: "DHS-2026-001",
  scrapedAt: Date.now(),
  active: true,
};

describe("opportunities", () => {
  it("ingests a batch of opportunities", async () => {
    const t = convexTest(schema, modules);

    const count = await t.mutation(internal.opportunities.ingestBatch, {
      opportunities: [SAMPLE_OPPORTUNITY],
      sourceType: "sam_gov",
    });

    expect(count).toBe(1);

    const stored = await t.run(async (ctx) =>
      ctx.db.query("opportunities").collect(),
    );
    expect(stored).toHaveLength(1);
    expect(stored[0].title).toBe("IT Cybersecurity Services");
  });

  it("deduplicates by solicitationNumber on re-ingest", async () => {
    const t = convexTest(schema, modules);

    await t.mutation(internal.opportunities.ingestBatch, {
      opportunities: [SAMPLE_OPPORTUNITY],
      sourceType: "sam_gov",
    });
    // Ingest same opportunity again
    await t.mutation(internal.opportunities.ingestBatch, {
      opportunities: [SAMPLE_OPPORTUNITY],
      sourceType: "sam_gov",
    });

    const stored = await t.run(async (ctx) =>
      ctx.db.query("opportunities").collect(),
    );
    expect(stored).toHaveLength(1); // Should not duplicate
  });

  it("lists recent active opportunities", async () => {
    const t = convexTest(schema, modules);

    await t.mutation(internal.opportunities.ingestBatch, {
      opportunities: [
        SAMPLE_OPPORTUNITY,
        {
          ...SAMPLE_OPPORTUNITY,
          title: "Network Infrastructure RFP",
          solicitationNumber: "DHS-2026-002",
        },
      ],
      sourceType: "sam_gov",
    });

    const result = await t.query(api.opportunities.listRecent, { limit: 10 });
    expect(result).toHaveLength(2);
  });

  it("filters opportunities by state", async () => {
    const t = convexTest(schema, modules);

    await t.mutation(internal.opportunities.ingestBatch, {
      opportunities: [
        { ...SAMPLE_OPPORTUNITY, state: "VA", solicitationNumber: "VA-001" },
        { ...SAMPLE_OPPORTUNITY, state: "TX", solicitationNumber: "TX-001" },
      ],
      sourceType: "sam_gov",
    });

    const vaOpps = await t.query(api.opportunities.listByState, {
      state: "VA",
    });
    expect(vaOpps).toHaveLength(1);
    expect(vaOpps[0].state).toBe("VA");
  });
});
