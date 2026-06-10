import { defineSchema, defineTable } from "convex/server"; // import means bringing tools from somewhere else and we are importing theree important things 
// defineSchema is a function that defines our whole database
// defineTable -> a function that defines one table inside it
import { v } from "convex/values";
// v -- a tool for saying what type each field is : (v.number(), v.string(), etc)

export default defineSchema({
  sessions: defineTable({ 
    startTime: v.number(), // field must be a number
    endTime: v.optional(v.number()), // can be a number or missing
  }),
  // this creates a table called sessions. like a spreadsheet with columns startTime and end time

// export default means "this is the main thing that this file gives to the rest of the app"
//convec reads this file and sets up the databse based on what we define here  

  stamps: defineTable({
    sessionId: v.id("sessions"),
    note: v.string(),
    createdAt: v.number(),
  }),
  // this created a stamps table and have columns sessionId , note and createdAt
});