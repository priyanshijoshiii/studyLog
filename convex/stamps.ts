import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const add = mutation({
  args: {
    sessionId: v.id("sessions"),
    note: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("stamps", {
      sessionId: args.sessionId,
      note: args.note,
      createdAt: Date.now(),
    });
  },
});

export const listBySession = query({
  args: { sessionId: v.id("sessions") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("stamps")
      .filter(q => q.eq(q.field("sessionId"), args.sessionId))
      .order("asc")
      .collect();
  },
});

export const listAll = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("stamps").collect();
  },
});