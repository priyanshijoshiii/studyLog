# StudyLog

A minimal, distraction-free study session tracker.

**Live demo:** https://study-log-rose.vercel.app/

## What it does

- Start a study session with a 3-2-1 countdown
- Live timer counts up in `HH:MM:SS`
- Add timestamped notes during a session to mark what you're working on — timer pauses while you type
- Take a break — timer pauses, resume when ready
- Stop a session — saved permanently
- View all previous sessions with duration and timestamps
- Automatically displays times in English (12h) or Russian (24h) based on browser language

## Why

Most study trackers are cluttered with streaks, badges, and social features. StudyLog is just a timer, a way to mark moments during a session, and a history of past sessions — nothing else.

## Tech Stack

- **Frontend:** React + TypeScript (Vite)
- **Backend:** Convex (database, queries, mutations, real-time sync)
- **Deployment:** Vercel (frontend) + Convex Cloud (backend)

## Project Structure

```
studylog/
├── convex/
│   ├── schema.ts      # database tables: sessions, stamps
│   ├── sessions.ts    # start, stop, list sessions
│   └── stamps.ts      # add, list stamps for a session
├── src/
│   ├── App.tsx              # main UI and app logic
│   └── formatTimestamp.ts   # timestamp formatting utility
```

## Running Locally

```bash
npm install
npx convex dev      # starts Convex backend
npm run dev         # starts frontend (separate terminal)
```
