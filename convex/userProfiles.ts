import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const getMyProfile = query({
  args: {},
  returns: v.union(v.any(), v.null()),
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return null;

    return ctx.db
      .query("userProfiles")
      .withIndex("by_userId", (q) => q.eq("userId", identity.subject))
      .unique();
  },
});

export const upsertProfile = mutation({
  args: {
    companyName: v.optional(v.string()),
    naicsCodes: v.array(v.string()),
    certifications: v.array(v.string()),
    states: v.array(v.string()),
    keywords: v.array(v.string()),
    contractSizeMin: v.optional(v.number()),
    contractSizeMax: v.optional(v.number()),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    const existing = await ctx.db
      .query("userProfiles")
      .withIndex("by_userId", (q) => q.eq("userId", identity.subject))
      .unique();

    const now = Date.now();

    if (existing) {
      await ctx.db.patch(existing._id, {
        ...args,
        updatedAt: now,
      });
    } else {
      await ctx.db.insert("userProfiles", {
        userId: identity.subject,
        companyName: args.companyName,
        naicsCodes: args.naicsCodes,
        certifications: args.certifications,
        states: args.states,
        keywords: args.keywords,
        contractSizeMin: args.contractSizeMin,
        contractSizeMax: args.contractSizeMax,
        tier: "free",
        onboardingComplete: false,
        createdAt: now,
        updatedAt: now,
      });
    }
    return null;
  },
});

export const completeOnboarding = mutation({
  args: {},
  returns: v.null(),
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    const profile = await ctx.db
      .query("userProfiles")
      .withIndex("by_userId", (q) => q.eq("userId", identity.subject))
      .unique();

    if (!profile) throw new Error("Profile not found");

    await ctx.db.patch(profile._id, {
      onboardingComplete: true,
      updatedAt: Date.now(),
    });
    return null;
  },
});
