import { convexTest } from "convex-test";
import { describe, it, expect } from "vitest";
import { api } from "./_generated/api";
import schema from "./schema";
import { modules } from "./test.setup";

describe("userProfiles", () => {
  it("creates a profile for a new user", async () => {
    const t = convexTest(schema, modules);
    const asUser = t.withIdentity({ subject: "user_abc123", name: "Jane Doe" });

    await asUser.mutation(api.userProfiles.upsertProfile, {
      companyName: "Acme IT Services",
      naicsCodes: ["541512", "541519"],
      certifications: ["sdvosb"],
      states: ["VA", "MD"],
      keywords: ["cybersecurity", "network"],
    });

    const profile = await asUser.query(api.userProfiles.getMyProfile, {});
    expect(profile).not.toBeNull();
    expect(profile!.companyName).toBe("Acme IT Services");
    expect(profile!.naicsCodes).toContain("541512");
    expect(profile!.tier).toBe("free"); // Default tier
    expect(profile!.onboardingComplete).toBe(false); // Not complete yet
  });

  it("completes onboarding", async () => {
    const t = convexTest(schema, modules);
    const asUser = t.withIdentity({ subject: "user_abc123" });

    await asUser.mutation(api.userProfiles.upsertProfile, {
      companyName: "Acme IT",
      naicsCodes: ["541512"],
      certifications: [],
      states: ["VA"],
      keywords: [],
    });
    await asUser.mutation(api.userProfiles.completeOnboarding, {});

    const profile = await asUser.query(api.userProfiles.getMyProfile, {});
    expect(profile!.onboardingComplete).toBe(true);
  });

  it("updates an existing profile", async () => {
    const t = convexTest(schema, modules);
    const asUser = t.withIdentity({ subject: "user_abc123" });

    await asUser.mutation(api.userProfiles.upsertProfile, {
      companyName: "Old Name",
      naicsCodes: ["541512"],
      certifications: [],
      states: ["VA"],
      keywords: [],
    });
    await asUser.mutation(api.userProfiles.upsertProfile, {
      companyName: "New Name",
      naicsCodes: ["541512", "561210"],
      certifications: ["8a"],
      states: ["VA", "MD"],
      keywords: ["federal"],
    });

    const profile = await asUser.query(api.userProfiles.getMyProfile, {});
    expect(profile!.companyName).toBe("New Name");
    expect(profile!.certifications).toContain("8a");
    expect(profile!.states).toContain("MD");
  });
});
