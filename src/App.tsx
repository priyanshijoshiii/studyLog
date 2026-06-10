import { useState, useEffect } from "react";
import { useMutation } from "convex/react";
import { api } from "../convex/_generated/api";


type AppState = "idle" | "countdown" | "studying" | "stamping" | "break";

export default function App() {
  const [state, setState] = useState<AppState>("idle");
  const [countdown, setCountdown] = useState(3);
  const [seconds, setSeconds] = useState(0);
  const [sessionId, setSessionId] = useState<Id<"sessions"> | null>(null);
  const [stampNote, setStampNote] = useState("");

  const startSession = useMutation(api.sessions.start);
  const stopSession = useMutation(api.sessions.stop);

  useEffect(() => {
  if (state !== "countdown") return;
  
  if (countdown === 0) {
    setState("studying");
    setCountdown(3);
    return;
  }

  const timer = setTimeout(() => {
    setCountdown(countdown - 1);
  }, 1000);

  return () => clearTimeout(timer);
}, [state, countdown]);

useEffect(() => {
  if (state !== "studying") return;

  const timer = setInterval(() => {
    setSeconds(s => s + 1);
  }, 1000);

  return () => clearInterval(timer);
}, [state]);

  return (
    <div style={{
      backgroundColor: "#000",
      minHeight: "100vh",
      color: "#fff",
      fontFamily: "monospace",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      gap: "20px",
    }}>
      {state === "idle" && (
        <button
          onClick={() => setState("countdown")}
          style={{
            backgroundColor: "transparent",
            border: "1px solid #fff",
            color: "#fff",
            fontFamily: "monospace",
            fontSize: "24px",
            padding: "16px 40px",
            cursor: "pointer",
          }}
        >
          Start Studying
        </button>
      )}

      {state === "countdown" && (
        <p style={{ fontSize: "120px", margin: 0 }}>{countdown}</p>
      )}

      {state === "studying" && (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "40px" }}>
          <p style={{ fontSize: "80px", margin: 0 }}>
            {String(Math.floor(seconds / 3600)).padStart(2, "0")}:
            {String(Math.floor((seconds % 3600) / 60)).padStart(2, "0")}:
            {String(seconds % 60).padStart(2, "0")}
          </p>

          <div style={{ display: "flex", gap: "20px" }}>
            <button
              onClick={() => setState("stamping")}
              style={{
                backgroundColor: "transparent",
                border: "1px solid #fff",
                color: "#fff",
                fontFamily: "monospace",
                fontSize: "16px",
                padding: "10px 24px",
                cursor: "pointer",
              }}
            >
              Stamp it
            </button>

            <button
              onClick={() => setState("break")}
              style={{
                backgroundColor: "transparent",
                border: "1px solid #555",
                color: "#555",
                fontFamily: "monospace",
                fontSize: "16px",
                padding: "10px 24px",
                cursor: "pointer",
              }}
            >
              Take a Break
            </button>
            <button
              onClick={() => setState("idle")}
              style={{
                backgroundColor: "transparent",
                border: "1px solid #ff4444",
                color: "#ff4444",
                fontFamily: "monospace",
                fontSize: "16px",
                padding: "10px 24px",
                cursor: "pointer",
              }}
            >
              Stop
            </button>                 
          </div>
        </div>
      )}
    
      {state === "stamping" && (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "20px" }}>
          <p style={{ color: "#555", margin: 0 }}>timer paused — what are you studying?</p>
          <input
            autoFocus
            value={stampNote}
            onChange={e => setStampNote(e.target.value)}
            placeholder="e.g. linked lists, convex queries..."
            style={{
              backgroundColor: "transparent",
              border: "1px solid #fff",
              color: "#fff",
              fontFamily: "monospace",
              fontSize: "16px",
              padding: "10px 16px",
              width: "320px",
              outline: "none",
            }}
          />
          <div style={{ display: "flex", gap: "20px" }}>
            <button
              onClick={() => {
                setStampNote("");
                setState("studying");
              }}
              style={{
                backgroundColor: "transparent",
                border: "1px solid #fff",
                color: "#fff",
                fontFamily: "monospace",
                fontSize: "16px",
                padding: "10px 24px",
                cursor: "pointer",
              }}
            >
              Save & Resume
            </button>
            <button
              onClick={() => setState("studying")}
              style={{
                backgroundColor: "transparent",
                border: "1px solid #555",
                color: "#555",
                fontFamily: "monospace",
                fontSize: "16px",
                padding: "10px 24px",
                cursor: "pointer",
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {state === "break" && (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "20px" }}>
          <p style={{ fontSize: "32px", margin: 0, color: "#555" }}>on a break</p>
          <button
            onClick={() => setState("studying")}
            style={{
              backgroundColor: "transparent",
              border: "1px solid #fff",
              color: "#fff",
              fontFamily: "monospace",
              fontSize: "16px",
              padding: "10px 24px",
              cursor: "pointer",
            }}
          >
            Resume
          </button>
        </div>
      )}    
 
    </div>  
  );
}