import { convexTest } from "convex-test";
import { describe, it, expect } from "vitest";
import { api, internal } from "./_generated/api";
import schema from "./schema";
import { modules } from "./test.setup";

describe("portals", () => {
  it("seeds and lists portals", async () => {
    const t = convexTest(schema, modules);

    await t.mutation(internal.portals.seedInitialPortals, {});

    const portals = await t.query(api.portals.listPortals, {});
    expect(portals.length).toBeGreaterThan(0);
    expect(portals[0].state).toBeDefined();
    expect(portals[0].enabled).toBe(true);
  });

  it("gets a single portal", async () => {
    const t = convexTest(schema, modules);

    await t.mutation(internal.portals.seedInitialPortals, {});

    const portals = await t.query(api.portals.listPortals, {});
    const portal = await t.query(api.portals.getPortal, { id: portals[0]._id });
    expect(portal).not.toBeNull();
    expect(portal!.name).toBe(portals[0].name);
  });

  it("updates portal status after scrape", async () => {
    const t = convexTest(schema, modules);

    await t.mutation(internal.portals.seedInitialPortals, {});
    const portals = await t.query(api.portals.listPortals, {});
    const portalId = portals[0]._id;

    await t.mutation(internal.portals.updatePortalScrapeStatus, {
      portalId,
      status: "success",
      count: 42,
    });

    const updated = await t.query(api.portals.getPortal, { id: portalId });
    expect(updated!.lastScrapeStatus).toBe("success");
    expect(updated!.lastScrapeCount).toBe(42);
    expect(updated!.lastScrapedAt).toBeDefined();
  });
});
