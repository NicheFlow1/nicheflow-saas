"use client";
import { useEffect, useRef, useState } from "react";
import { getSupabaseClient } from "@/lib/supabase/client-singleton";

const SIG: Record<string,{color:string;bg:string}> = {
  GO:    { color: "#10b981", bg: "rgba(16,185,129,0.12)" },
  WATCH: { color: "#f59e0b", bg: "rgba(245,158,11,0.12)" },
  WAIT:  { color: "#6b7280", bg: "rgba(107,114,128,0.1)" },
};

export default function WatchlistPage() {
  const supabase = useRef(getSupabaseClient()).current;
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [removing, setRemoving] = useState<Record<string,boolean>>({});
  const [analyzing, setAnalyzing] = useState<Record<string,boolean>>({});
  const [analyses, setAnalyses] = useState<Record<string,any>>({});

  useEffect(() => { loadWatchlist(); }, []);

  async function getToken() {
    const { data: { session } } = await supabase.auth.getSession();
    return session?.access_token;
  }

  async function loadWatchlist() {
    setLoading(true);
    try {
      const token = await getToken();
      const res = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/autopilot`, {
        method: "POST", headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ action: "watchlist_get" }),
      });
      const data = await res.json();
      setItems(data.items || []);
    } catch {}
    setLoading(false);
  }

  async function remove(id: string) {
    setRemoving(p => ({ ...p, [id]: true }));
    try {
      const token = await getToken();
      await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/autopilot`, {
        method: "POST", headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ action: "watchlist_remove", id }),
      });
      setItems(p => p.filter(i => i.id !== id));
    } catch {}
    setRemoving(p => ({ ...p, [id]: false }));
  }

  async function reAnalyze(item: any) {
    setAnalyzing(p => ({ ...p, [item.id]: true }));
    try {
      const token = await getToken();
      const res = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/autopilot`, {
        method: "POST", headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ action: "forecast", topic: item.niche }),
      });
      const data = await res.json();
      setAnalyses(p => ({ ...p, [item.id]: data }));
    } catch {}
    setAnalyzing(p => ({ ...p, [item.id]: false }));
  }

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-base)" }}>
      <div style={{ borderBottom: "1px solid var(--border)", background: "var(--bg-surface)", padding: "1.75rem 2.5rem" }}>
        <div style={{ maxWidth: 1000, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <h1 style={{ fontSize: "1.6rem", fontWeight: 800, color: "var(--text-primary)", margin: "0 0 0.25rem" }}>My Watchlist</h1>
            <p style={{ color: "var(--text-muted)", margin: 0, fontSize: "0.9rem" }}>Niches you are tracking — re-analyze any time to get an updated forecast.</p>
          </div>
          <a href="/trending" style={{ background: "var(--accent)", color: "white", borderRadius: "var(--radius-sm)", padding: "0.6rem 1.25rem", fontWeight: 700, fontSize: "0.85rem", textDecoration: "none" }}>+ Add from Trending</a>
        </div>
      </div>

      <div style={{ maxWidth: 1000, margin: "0 auto", padding: "2rem 2.5rem" }}>
        {loading && (
          <div style={{ display: "flex", justifyContent: "center", padding: "4rem" }}>
            <div style={{ width: 28, height: 28, border: "2px solid var(--border)", borderTopColor: "var(--accent)", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
          </div>
        )}

        {!loading && items.length === 0 && (
          <div style={{ textAlign: "center", padding: "5rem 2rem", background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "var(--radius-lg)" }}>
            <div style={{ fontSize: "2.5rem", marginBottom: "1rem" }}>👁</div>
            <h3 style={{ color: "var(--text-primary)", fontWeight: 700, marginBottom: "0.5rem" }}>Your watchlist is empty</h3>
            <p style={{ color: "var(--text-muted)", fontSize: "0.875rem", marginBottom: "1.5rem" }}>Scan trending topics and save the ones you want to track.</p>
            <a href="/trending" style={{ background: "var(--accent)", color: "white", borderRadius: "var(--radius-sm)", padding: "0.65rem 1.5rem", fontWeight: 700, textDecoration: "none" }}>Scan Trending Topics</a>
          </div>
        )}

        {!loading && items.length > 0 && (
          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            <div style={{ display: "grid", gridTemplateColumns: "3fr 1fr 1fr 1fr 1fr auto", gap: "1rem", padding: "0 1rem", fontSize: "0.72rem", fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.07em" }}>
              <span>Niche</span><span>Signal</span><span>Score</span><span>Category</span><span>Saved</span><span></span>
            </div>
            {items.map((item) => {
              const sig = SIG[item.signal] || SIG.WAIT;
              const fc = analyses[item.id];
              const date = new Date(item.created_at).toLocaleDateString();
              return (
                <div key={item.id} style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "var(--radius)", overflow: "hidden" }}>
                  <div style={{ display: "grid", gridTemplateColumns: "3fr 1fr 1fr 1fr 1fr auto", gap: "1rem", alignItems: "center", padding: "1rem" }}>
                    <div>
                      <p style={{ fontWeight: 700, color: "var(--text-primary)", margin: "0 0 0.2rem", fontSize: "0.95rem" }}>{item.niche}</p>
                      {item.notes && <p style={{ fontSize: "0.78rem", color: "var(--text-muted)", margin: 0 }}>{item.notes}</p>}
                    </div>
                    <span style={{ display: "inline-block", background: sig.bg, color: sig.color, border: `1px solid ${sig.color}40`, borderRadius: 999, padding: "0.18rem 0.65rem", fontSize: "0.72rem", fontWeight: 700, width: "fit-content" }}>{item.signal}</span>
                    <div>
                      <span style={{ fontSize: "1.1rem", fontWeight: 800, color: "var(--accent-light)" }}>{item.score}</span>
                      <div style={{ height: 3, background: "var(--bg-elevated)", borderRadius: 99, marginTop: 4, overflow: "hidden" }}><div style={{ height: "100%", width: `${item.score}%`, background: sig.color, borderRadius: 99 }} /></div>
                    </div>
                    <span style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>{item.category}</span>
                    <span style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>{date}</span>
                    <div style={{ display: "flex", gap: "0.4rem" }}>
                      <button onClick={() => reAnalyze(item)} disabled={analyzing[item.id]} style={{ background: "transparent", color: "var(--accent-light)", border: "1px solid var(--border-accent)", borderRadius: 6, padding: "0.35rem 0.65rem", fontSize: "0.75rem", fontWeight: 600, cursor: "pointer", whiteSpace: "nowrap" }}>{analyzing[item.id] ? "..." : "Re-analyze"}</button>
                      <button onClick={() => remove(item.id)} disabled={removing[item.id]} style={{ background: "transparent", color: "#ef4444", border: "1px solid rgba(239,68,68,0.2)", borderRadius: 6, padding: "0.35rem 0.65rem", fontSize: "0.75rem", cursor: "pointer" }}>{removing[item.id] ? "..." : "Remove"}</button>
                    </div>
                  </div>
                  {fc && (
                    <div style={{ borderTop: "1px solid var(--border)", padding: "0.85rem 1rem", background: "rgba(99,102,241,0.04)" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "1.5rem", flexWrap: "wrap" }}>
                        <span style={{ fontSize: "0.72rem", fontWeight: 700, color: "#818cf8", textTransform: "uppercase", letterSpacing: "0.07em" }}>Forecast</span>
                        {[{l:"3m",d:fc.forecast_3m},{l:"6m",d:fc.forecast_6m},{l:"12m",d:fc.forecast_12m}].map((f,j) => f.d && (
                          <span key={j} style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}><strong style={{ color: "var(--text-primary)" }}>{f.l}:</strong> {f.d.score}/100 · {f.d.direction}</span>
                        ))}
                        <span style={{ marginLeft: "auto", fontSize: "0.8rem", fontWeight: 700, color: fc.verdict === "ENTER_NOW" ? "#10b981" : "#f59e0b" }}>{fc.verdict?.replace("_"," ")} — {fc.verdict_reason}</span>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
