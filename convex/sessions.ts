import {mutation, query} from "./_generated/server"; // imported two types of backend fucntions, mutation - changes data( insert, update, delete) and query - reads data
import {v} from "convex/values";

// start a new study session
export const start = mutation({
    args: {}, // this fucntion takes no arguement, nothing needs to be passed in
    handler: async (ctx) => { // actual function that runs
        const sessionID = await ctx.db.insert("sessions", { // insert a new row into the session table
            startTime: Date.now(),
            endTime: undefined, // session just started , no end time yet
        });
        return sessionID; // give back the id of the new session so the frontend knows which session is active
    },
})

//stop the current session
export const stop = mutation({
    args: {sessionId: v.id("sessions")}, // this function needs sessionID to know which session to stop
    handler: async (ctx, args) => {
        await ctx.db.patch(args.sessionId, { // update an existing row , only changes the fields you specify
            endTime: Date.now(), // sets end time to right now
        });
    },
})

//get all the sesions
export const list = query({ 
    args: {},
    handler: async (ctx) => {
        return await ctx.db.query("sessions").order("desc").collect(); 
        // ctx.db.query("sessions") ->reads from the session table
        // .order("desc") ->newest first
        // .collect() -> get all results as ab array
    },
});