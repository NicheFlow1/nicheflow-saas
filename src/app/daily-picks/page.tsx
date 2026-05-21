"use client";
import { useEffect, useRef, useState } from "react";
import { getSupabaseClient } from "@/lib/supabase/client-singleton";

const SIG: Record<string,{color:string;bg:string}> = {
  GO:    { color: "#10b981", bg: "rgba(16,185,129,0.12)" },
  WATCH: { color: "#f59e0b", bg: "rgba(245,158,11,0.12)" },
  WAIT:  { color: "#6b7280", bg: "rgba(107,114,128,0.1)" },
};
const COMP: Record<string,string> = { Low: "#10b981", Medium: "#f59e0b", High: "#ef4444" };
const PLATFORM_COLORS: Record<string,string> = { "TikTok": "#ff0050", "Reddit": "#ff4500", "YouTube": "#ff0000", "Twitter/X": "#1da1f2", "LinkedIn": "#0077b5", "Google": "#4285f4", "Instagram": "#e1306c", "Newsletter": "#10b981" };

export default function DailyPicksPage() {
  const supabase = useRef(getSupabaseClient()).current;
  const [picks, setPicks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [date, setDate] = useState("");
  const [saving, setSaving] = useState<Record<number,boolean>>({});
  const [saved, setSaved] = useState<Record<number,boolean>>({});

  useEffect(() => { load(); }, []);

  async function getToken() {
    const { data: { session } } = await supabase.auth.getSession();
    return session?.access_token;
  }

  async function load() {
    setLoading(true);
    try {
      const token = await getToken();
      const res = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/autopilot`, {
        method: "POST", headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ action: "daily_picks" }),
      });
      const data = await res.json();
      setPicks(data.picks || []);
      setDate(data.date || "");
    } catch {}
    setLoading(false);
  }

  async function saveToWatchlist(p: any, i: number) {
    setSaving(prev => ({ ...prev, [i]: true }));
    try {
      const token = await getToken();
      await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/autopilot`, {
        method: "POST", headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ action: "watchlist_add", niche: p.niche, score: p.score, signal: p.signal, category: p.category }),
      });
      setSaved(prev => ({ ...prev, [i]: true }));
    } catch {}
    setSaving(prev => ({ ...prev, [i]: false }));
  }

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-base)" }}>
      <div style={{ borderBottom: "1px solid var(--border)", background: "var(--bg-surface)", padding: "1.75rem 2.5rem" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.35rem" }}>
            <h1 style={{ fontSize: "1.6rem", fontWeight: 800, color: "var(--text-primary)", margin: 0 }}>Daily Picks</h1>
            <span style={{ background: "linear-gradient(135deg,#f59e0b,#f97316)", color: "white", borderRadius: 999, padding: "0.18rem 0.65rem", fontSize: "0.65rem", fontWeight: 800, letterSpacing: "0.08em" }}>CURATED</span>
            {date && <span style={{ marginLeft: "auto", fontSize: "0.78rem", color: "var(--text-muted)" }}>{new Date(date).toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}</span>}
          </div>
          <p style={{ color: "var(--text-muted)", margin: 0, fontSize: "0.9rem" }}>5 AI-curated niche opportunities refreshed daily — the best entry points available right now.</p>
        </div>
      </div>

      <div style={{ maxWidth: 900, margin: "0 auto", padding: "2rem 2.5rem" }}>
        {loading && (
          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            {[...Array(5)].map((_,i) => (
              <div key={i} style={{ height: 120, background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "var(--radius-lg)", animation: "pulse 1.5s ease-in-out infinite", opacity: 0.5 }} />
            ))}
          </div>
        )}

        {!loading && picks.map((p, i) => {
          const sig = SIG[p.signal] || SIG.WATCH;
          const compColor = COMP[p.competition] || "#6b7280";
          const platColor = PLATFORM_COLORS[p.platform_signal] || "#6366f1";
          return (
            <div key={i} style={{ display: "flex", gap: 0, background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "var(--radius-lg)", overflow: "hidden", marginBottom: "0.75rem", transition: "all 0.2s" }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = "var(--border-accent)"; e.currentTarget.style.transform = "translateX(2px)"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.transform = "translateX(0)"; }}
            >
              <div style={{ width: 4, background: sig.color, flexShrink: 0 }} />
              <div style={{ flex: 1, padding: "1.25rem" }}>
                <div style={{ display: "flex", alignItems: "flex-start", gap: "1rem", marginBottom: "0.75rem" }}>
                  <div style={{ width: 32, height: 32, borderRadius: 8, background: sig.bg, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: "0.9rem", color: sig.color, flexShrink: 0 }}>#{p.rank}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", flexWrap: "wrap", marginBottom: "0.3rem" }}>
                      <h3 style={{ fontSize: "1rem", fontWeight: 700, color: "var(--text-primary)", margin: 0 }}>{p.niche}</h3>
                      <span style={{ background: sig.bg, color: sig.color, border: `1px solid ${sig.color}40`, borderRadius: 999, padding: "0.12rem 0.55rem", fontSize: "0.68rem", fontWeight: 700 }}>{p.signal}</span>
                      {p.time_sensitive && <span style={{ background: "rgba(239,68,68,0.1)", color: "#ef4444", border: "1px solid rgba(239,68,68,0.2)", borderRadius: 999, padding: "0.12rem 0.55rem", fontSize: "0.68rem", fontWeight: 700 }}>TIME SENSITIVE</span>}
                    </div>
                    <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", margin: "0 0 0.5rem", lineHeight: 1.5 }}>{p.why_today}</p>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "0.35rem" }}>
                      <span style={{ background: "var(--bg-elevated)", color: "var(--text-muted)", border: "1px solid var(--border)", borderRadius: 999, padding: "0.12rem 0.5rem", fontSize: "0.68rem" }}>{p.category}</span>
                      <span style={{ background: "var(--bg-elevated)", color: "var(--text-muted)", border: "1px solid var(--border)", borderRadius: 999, padding: "0.12rem 0.5rem", fontSize: "0.68rem" }}>{p.revenue_model}</span>
                      {p.estimated_tam && <span style={{ background: "rgba(16,185,129,0.08)", color: "#10b981", border: "1px solid rgba(16,185,129,0.2)", borderRadius: 999, padding: "0.12rem 0.5rem", fontSize: "0.68rem", fontWeight: 600 }}>TAM {p.estimated_tam}</span>}
                      <span style={{ background: compColor + "18", color: compColor, border: `1px solid ${compColor}30`, borderRadius: 999, padding: "0.12rem 0.5rem", fontSize: "0.68rem", fontWeight: 600 }}>{p.competition} competition</span>
                      {p.platform_signal && <span style={{ background: platColor + "18", color: platColor, border: `1px solid ${platColor}30`, borderRadius: 999, padding: "0.12rem 0.5rem", fontSize: "0.68rem", fontWeight: 600 }}>{p.platform_signal}</span>}
                    </div>
                  </div>
                  <div style={{ flexShrink: 0, textAlign: "right" }}>
                    <div style={{ fontSize: "1.5rem", fontWeight: 800, color: sig.color, lineHeight: 1 }}>{p.score}</div>
                    <div style={{ fontSize: "0.65rem", color: "var(--text-muted)", marginBottom: "0.5rem" }}>score</div>
                  </div>
                </div>
                <div style={{ background: "var(--bg-elevated)", borderRadius: 6, padding: "0.6rem 0.75rem", marginBottom: "0.75rem" }}>
                  <span style={{ fontSize: "0.68rem", fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.06em" }}>Entry angle — </span>
                  <span style={{ fontSize: "0.82rem", color: "var(--text-secondary)" }}>{p.entry_angle}</span>
                </div>
                <div style={{ display: "flex", gap: "0.5rem" }}>
                  <button onClick={() => window.location.href=`/dashboard/starter?keyword=${encodeURIComponent(p.niche)}`} style={{ background: "var(--accent)", color: "white", border: "none", borderRadius: 6, padding: "0.5rem 1rem", fontSize: "0.8rem", fontWeight: 700, cursor: "pointer" }}>Build Kit</button>
                  <button onClick={() => window.location.href=`/trending`} style={{ background: "transparent", color: "var(--text-secondary)", border: "1px solid var(--border)", borderRadius: 6, padding: "0.5rem 1rem", fontSize: "0.8rem", fontWeight: 600, cursor: "pointer" }}>Full Trends</button>
                  <button onClick={() => saveToWatchlist(p, i)} disabled={saving[i] || saved[i]} style={{ marginLeft: "auto", background: saved[i] ? "rgba(16,185,129,0.1)" : "transparent", color: saved[i] ? "#10b981" : "var(--text-muted)", border: `1px solid ${saved[i] ? "rgba(16,185,129,0.3)" : "var(--border)"}`, borderRadius: 6, padding: "0.5rem 1rem", fontSize: "0.8rem", fontWeight: 600, cursor: saved[i] ? "default" : "pointer" }}>{saving[i] ? "..." : saved[i] ? "Saved" : "+ Watchlist"}</button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
