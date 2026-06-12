import { useState, useEffect } from "react";
import { formatTimestamp } from "./formatTimestamp";
import { api } from "../convex/_generated/api";
import { useMutation, useQuery } from "convex/react";


type AppState = "idle" | "countdown" | "studying" | "stamping" | "break" | "history";

export default function App() {
  const [state, setState] = useState<AppState>("idle");
  const [countdown, setCountdown] = useState(3);
  const [seconds, setSeconds] = useState(0);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [stampNote, setStampNote] = useState("");

  const lang: 'ru' | 'en' = navigator.language.startsWith('ru') ? 'ru' : 'en'

  const startSession = useMutation(api.sessions.start);
  const stopSession = useMutation(api.sessions.stop);
  const addStamp = useMutation(api.stamps.add);
  
  const sessions = useQuery(api.sessions.list);
  const stamps = useQuery(
    api.stamps.listBySession,
    sessionId ? { sessionId } : "skip"
  );  

  useEffect(() => {
    if (state !== "countdown") return;

    if (countdown === 0) {
      // save session to Convex when studying starts
      startSession().then(id => {
        setSessionId(id);
      });
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
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "20px" }}>
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
          <button
            onClick={() => setState("history")}
            style={{
              backgroundColor: "transparent",
              border: "none",
              color: "#555",
              fontFamily: "monospace",
              fontSize: "14px",
              cursor: "pointer",
            }}
          >
            previous sessions →
          </button>
        </div>
      )}

      {state === "countdown" && (
        <p style={{ fontSize: "120px", margin: 0 }}>{countdown}</p>
      )}

      {state === "studying" && (
        <div style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
          height: "100vh",
          position: "relative",
        }}>
          <p style={{ fontSize: "80px", margin: 0 }}>
            {String(Math.floor(seconds / 3600)).padStart(2, "0")}:
            {String(Math.floor((seconds % 3600) / 60)).padStart(2, "0")}:
            {String(seconds % 60).padStart(2, "0")}
          </p>

          <div style={{ display: "flex", gap: "20px", marginTop: "40px" }}>
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
              onClick={() => {
                if (sessionId) {
                  stopSession({ sessionId });
                }
                setSeconds(0);
                setState("idle");
              }}
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

          {stamps && stamps.length > 0 && (
            <div style={{
              marginTop: "60px",
              width: "400px",
              maxHeight: "150px",
              overflowY: "scroll",
              borderTop: "1px solid #111111",
              paddingTop: "16px",
              display: "flex",
              flexDirection: "column",
              gap: "8px",
              overflowWrap: "break-word",
            }}>
            {stamps.map(stamp => (
              <div key={stamp._id} style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                gap: "16px",
              }}>
                <p style={{
                  margin: 0,
                  color: "#555",
                  fontSize: "13px",
                  wordBreak: "break-word",
                  overflowWrap: "break-word",
                }}>
                  · {stamp.note}
                </p>
                <span style={{ color: "#333", fontSize: "13px", whiteSpace: "nowrap" }}>
                  {formatTimestamp(stamp.createdAt, 'lang')}
                </span>
              </div>
            ))}
            </div>
          )}
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
                if (sessionId && stampNote.trim() !== "") {
                  addStamp({ sessionId, note: stampNote });
                }
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

      {state === "history" && (
        <div style={{
          width: "100%",
          maxWidth: "600px",
          padding: "40px 20px",
          display: "flex",
          flexDirection: "column",
          gap: "24px",
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <p style={{ margin: 0, fontSize: "18px" }}>previous sessions</p>
            <button
              onClick={() => setState("idle")}
              style={{
                backgroundColor: "transparent",
                border: "none",
                color: "#555",
                fontFamily: "monospace",
                fontSize: "14px",
                cursor: "pointer",
              }}
            >
              ← back
            </button>
          </div>

          {sessions && sessions.length === 0 && (
            <p style={{ color: "#555", fontSize: "14px" }}>no sessions yet</p>
          )}

          {sessions && sessions.map(session => (
            <div key={session._id} style={{
              borderTop: "1px solid #111",
              paddingTop: "16px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
            }}>
              <p style={{ margin: 0, color: "#888", fontSize: "14px" }}>
                {formatTimestamp(session.startTime, lang)}
              </p>
              <p style={{ margin: 0, color: "#555", fontSize: "14px" }}>
                {session.endTime
                  ? (() => {
                      const mins = Math.floor((session.endTime - session.startTime) / 60000)
                      const hrs = Math.floor(mins / 60)
                      const remainMins = mins % 60
                      return hrs > 0 ? `${hrs}h ${remainMins}m` : `${mins}m`
                    })()
                  : "in progress"
                }
              </p>
            </div>
          ))}
        </div>
      )}       
 
    </div>  
  );
}