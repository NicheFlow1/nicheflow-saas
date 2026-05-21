"use client";
import { useRef, useState } from "react";
import { getSupabaseClient } from "@/lib/supabase/client-singleton";

const CATEGORIES = [
  { id: "all", label: "All" },
  { id: "ai-tech", label: "AI & Tech" },
  { id: "health-wellness", label: "Health & Wellness" },
  { id: "finance", label: "Finance" },
  { id: "creator-economy", label: "Creator Economy" },
  { id: "saas", label: "SaaS" },
  { id: "ecommerce", label: "E-commerce" },
  { id: "education", label: "Education" },
  { id: "climate-green", label: "Climate & Green" },
];

const PLATFORM_COLORS: Record<string,string> = {
  "TikTok": "#ff0050", "Reddit": "#ff4500", "YouTube": "#ff0000",
  "Twitter/X": "#1da1f2", "LinkedIn": "#0077b5", "Google": "#4285f4",
  "Instagram": "#e1306c", "Newsletter": "#10b981"
};

const SIG: Record<string,{color:string;bg:string}> = {
  GO:    { color: "#10b981", bg: "rgba(16,185,129,0.12)" },
  WATCH: { color: "#f59e0b", bg: "rgba(245,158,11,0.12)" },
  WAIT:  { color: "#6b7280", bg: "rgba(107,114,128,0.1)" },
};
const MOM: Record<string,string> = { Rising: "#10b981", Stable: "#6366f1", Declining: "#ef4444" };
const DIFF: Record<string,string> = { Easy: "#10b981", Medium: "#f59e0b", Hard: "#ef4444" };
const FORE: Record<string,string> = { Growing: "#10b981", Peak: "#f59e0b", Maturing: "#6366f1", Declining: "#ef4444" };

export default function TrendingPage() {
  const supabase = useRef(getSupabaseClient()).current;
  const [category, setCategory] = useState("all");
  const [loading, setLoading] = useState(false);
  const [topics, setTopics] = useState<any[]>([]);
  const [error, setError] = useState("");
  const [lastScanned, setLastScanned] = useState<string | null>(null);
  const [saving, setSaving] = useState<Record<number,boolean>>({});
  const [saved, setSaved] = useState<Record<number,boolean>>({});
  const [forecasting, setForecasting] = useState<Record<number,boolean>>({});
  const [forecasts, setForecasts] = useState<Record<number,any>>({});

  async function scan() {
    setLoading(true); setError(""); setTopics([]);
    setSaved({}); setForecasts({});
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const res = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/autopilot`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${session?.access_token}` },
        body: JSON.stringify({ action: "trending", category }),
      });
      const data = await res.json();
      if (data.topics) { setTopics(data.topics); setLastScanned(new Date().toLocaleTimeString()); }
      else setError(data.error || "Failed to load trending topics");
    } catch (e) { setError(String(e)); }
    setLoading(false);
  }

  async function saveToWatchlist(t: any, i: number) {
    setSaving(p => ({ ...p, [i]: true }));
    try {
      const { data: { session } } = await supabase.auth.getSession();
      await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/autopilot`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${session?.access_token}` },
        body: JSON.stringify({ action: "watchlist_add", niche: t.topic, score: t.score, signal: t.signal, category: t.category }),
      });
      setSaved(p => ({ ...p, [i]: true }));
    } catch {}
    setSaving(p => ({ ...p, [i]: false }));
  }

  async function getForecast(t: any, i: number) {
    if (forecasts[i]) { setForecasts(p => { const n = {...p}; delete n[i]; return n; }); return; }
    setForecasting(p => ({ ...p, [i]: true }));
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const res = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/autopilot`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${session?.access_token}` },
        body: JSON.stringify({ action: "forecast", topic: t.topic }),
      });
      const data = await res.json();
      setForecasts(p => ({ ...p, [i]: data }));
    } catch {}
    setForecasting(p => ({ ...p, [i]: false }));
  }

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-base)" }}>
      <div style={{ borderBottom: "1px solid var(--border)", background: "var(--bg-surface)", padding: "1.75rem 2.5rem 1.5rem" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.35rem" }}>
            <h1 style={{ fontSize: "1.6rem", fontWeight: 800, color: "var(--text-primary)", margin: 0 }}>Trending Now</h1>
            <span style={{ background: "linear-gradient(135deg,#ef4444,#f97316)", color: "white", borderRadius: 999, padding: "0.18rem 0.65rem", fontSize: "0.65rem", fontWeight: 800, letterSpacing: "0.08em" }}>LIVE</span>
            {lastScanned && <span style={{ marginLeft: "auto", fontSize: "0.78rem", color: "var(--text-muted)" }}>Updated {lastScanned}</span>}
          </div>
          <p style={{ color: "var(--text-muted)", margin: "0 0 1.25rem", fontSize: "0.9rem" }}>Discover what is blowing up <strong style={{ color: "var(--accent-light)" }}>right now</strong> — before it goes mainstream.</p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem" }}>
            {CATEGORIES.map(c => (
              <button key={c.id} onClick={() => setCategory(c.id)} style={{ background: category === c.id ? "var(--accent)" : "transparent", color: category === c.id ? "white" : "var(--text-muted)", border: `1px solid ${category === c.id ? "var(--accent)" : "var(--border)"}`, borderRadius: 999, padding: "0.32rem 0.85rem", fontSize: "0.8rem", fontWeight: category === c.id ? 700 : 500, cursor: "pointer", transition: "all 0.15s" }}>{c.label}</button>
            ))}
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "1.75rem 2.5rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1.75rem" }}>
          <button onClick={scan} disabled={loading} style={{ background: loading ? "var(--bg-elevated)" : "var(--accent)", color: "white", border: "none", borderRadius: "var(--radius)", padding: "0.7rem 1.75rem", fontWeight: 700, fontSize: "0.95rem", display: "inline-flex", alignItems: "center", gap: "0.55rem", boxShadow: loading ? "none" : "0 4px 16px var(--accent-glow)", cursor: loading ? "not-allowed" : "pointer", transition: "all 0.2s" }}>
            {loading ? <><div style={{ width: 16, height: 16, border: "2px solid rgba(255,255,255,0.25)", borderTopColor: "white", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} /> Scanning markets...</> : "Scan Trending Topics"}
          </button>
          {topics.length > 0 && <a href="/watchlist" style={{ fontSize: "0.85rem", color: "var(--accent-light)", textDecoration: "none", fontWeight: 600 }}>View Watchlist →</a>}
        </div>

        {error && <div style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.25)", borderRadius: "var(--radius)", padding: "1rem 1.25rem", color: "#fca5a5", marginBottom: "1.5rem" }}>{error}</div>}

        {!loading && topics.length === 0 && !error && (
          <div style={{ textAlign: "center", padding: "5rem 2rem", background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "var(--radius-lg)" }}>
            <div style={{ width: 56, height: 56, background: "var(--bg-elevated)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1rem", fontSize: "1.5rem" }}>🔥</div>
            <h3 style={{ color: "var(--text-primary)", fontWeight: 700, marginBottom: "0.4rem" }}>No trends loaded</h3>
            <p style={{ color: "var(--text-muted)", fontSize: "0.875rem" }}>Pick a category and hit <strong style={{ color: "var(--accent-light)" }}>Scan Trending Topics</strong></p>
          </div>
        )}

        {loading && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(460px, 1fr))", gap: "1.25rem" }}>
            {[...Array(4)].map((_, i) => (
              <div key={i} style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "var(--radius-lg)", padding: "1.5rem", opacity: 0.5 }}>
                <div style={{ height: 18, background: "var(--bg-elevated)", borderRadius: 6, marginBottom: "0.75rem", width: "65%", animation: "pulse 1.5s ease-in-out infinite" }} />
                <div style={{ height: 12, background: "var(--bg-elevated)", borderRadius: 6, marginBottom: "0.5rem", animation: "pulse 1.5s ease-in-out infinite" }} />
                <div style={{ height: 12, background: "var(--bg-elevated)", borderRadius: 6, width: "80%", animation: "pulse 1.5s ease-in-out infinite" }} />
              </div>
            ))}
          </div>
        )}

        {topics.length > 0 && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(460px, 1fr))", gap: "1.25rem" }}>
            {topics.map((t, i) => {
              const sig = SIG[t.signal] || SIG.WAIT;
              const platColor = PLATFORM_COLORS[t.platform] || "#6366f1";
              const fc = forecasts[i];
              return (
                <div key={i} style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "var(--radius-lg)", overflow: "hidden", transition: "all 0.2s", animation: `fadeIn 0.35s ease ${i * 0.04}s both" }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = "var(--border-accent)"; e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 8px 32px rgba(0,0,0,0.25)"; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none"; }}
                >
                  <div style={{ height: 3, background: `linear-gradient(90deg, ${sig.color}, var(--accent-light))` }} />
                  <div style={{ padding: "1.25rem" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "0.75rem", marginBottom: "0.85rem" }}>
                      <div style={{ flex: 1 }}>
                        <h3 style={{ fontSize: "1rem", fontWeight: 700, color: "var(--text-primary)", margin: "0 0 0.4rem", lineHeight: 1.35 }}>{t.topic}</h3>
                        {t.platform && (
                          <span style={{ display: "inline-flex", alignItems: "center", gap: 4, background: platColor + "18", color: platColor, border: `1px solid ${platColor}30`, borderRadius: 999, padding: "0.15rem 0.5rem", fontSize: "0.68rem", fontWeight: 700 }}>
                            <span style={{ width: 5, height: 5, borderRadius: "50%", background: platColor, display: "inline-block" }} />
                            {t.platform}
                          </span>
                        )}
                      </div>
                      <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "0.35rem", flexShrink: 0 }}>
                        <span style={{ background: sig.bg, color: sig.color, border: `1px solid ${sig.color}40`, borderRadius: 999, padding: "0.18rem 0.65rem", fontSize: "0.72rem", fontWeight: 700 }}>{t.signal}</span>
                        <span style={{ fontSize: "0.78rem", fontWeight: 800, color: "var(--accent-light)" }}>{t.score}/100</span>
                      </div>
                    </div>

                    <div style={{ height: 4, background: "var(--bg-elevated)", borderRadius: 999, overflow: "hidden", marginBottom: "0.85rem" }}>
                      <div style={{ height: "100%", width: `${t.score}%`, background: `linear-gradient(90deg, ${sig.color}, var(--accent-light))`, borderRadius: 999 }} />
                    </div>

                    <div style={{ display: "flex", flexWrap: "wrap", gap: "0.35rem", marginBottom: "1rem" }}>
                      <span style={{ background: "var(--bg-elevated)", color: "var(--text-muted)", border: "1px solid var(--border)", borderRadius: 999, padding: "0.18rem 0.55rem", fontSize: "0.7rem" }}>{t.category}</span>
                      <span style={{ background: (MOM[t.momentum]||"#6366f1") + "18", color: MOM[t.momentum]||"#6366f1", border: `1px solid ${MOM[t.momentum]||"#6366f1"}30`, borderRadius: 999, padding: "0.18rem 0.55rem", fontSize: "0.7rem", fontWeight: 600 }}>{t.momentum}</span>
                      <span style={{ background: (DIFF[t.difficulty]||"#6b7280") + "18", color: DIFF[t.difficulty]||"#6b7280", border: `1px solid ${DIFF[t.difficulty]||"#6b7280"}30`, borderRadius: 999, padding: "0.18rem 0.55rem", fontSize: "0.7rem", fontWeight: 600 }}>{t.difficulty}</span>
                      <span style={{ background: "rgba(59,130,246,0.1)", color: "#60a5fa", border: "1px solid rgba(59,130,246,0.2)", borderRadius: 999, padding: "0.18rem 0.55rem", fontSize: "0.7rem" }}>{t.time_window}</span>
                      {t.forecast_3m && <span style={{ background: (FORE[t.forecast_3m]||"#6366f1") + "18", color: FORE[t.forecast_3m]||"#6366f1", border: `1px solid ${FORE[t.forecast_3m]||"#6366f1"}30`, borderRadius: 999, padding: "0.18rem 0.55rem", fontSize: "0.7rem", fontWeight: 600 }}>3m: {t.forecast_3m}</span>}
                    </div>

                    <div style={{ background: "var(--bg-elevated)", borderRadius: "var(--radius-sm)", padding: "0.75rem", marginBottom: "0.75rem" }}>
                      <p style={{ fontSize: "0.68rem", color: "var(--text-muted)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.07em", margin: "0 0 0.3rem" }}>Why trending</p>
                      <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", margin: 0, lineHeight: 1.55 }}>{t.why_trending}</p>
                    </div>

                    <div style={{ background: "rgba(16,185,129,0.06)", border: "1px solid rgba(16,185,129,0.18)", borderRadius: "var(--radius-sm)", padding: "0.75rem", marginBottom: "1rem" }}>
                      <p style={{ fontSize: "0.68rem", color: "#10b981", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.07em", margin: "0 0 0.3rem" }}>Opportunity</p>
                      <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", margin: 0, lineHeight: 1.55 }}>{t.opportunity}</p>
                    </div>

                    {fc && (
                      <div style={{ background: "rgba(99,102,241,0.06)", border: "1px solid rgba(99,102,241,0.2)", borderRadius: "var(--radius-sm)", padding: "0.85rem", marginBottom: "1rem" }}>
                        <p style={{ fontSize: "0.68rem", color: "#818cf8", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.07em", margin: "0 0 0.6rem" }}>AI Forecast</p>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "0.5rem", marginBottom: "0.6rem" }}>
                          {[{label:"3 months",d:fc.forecast_3m},{label:"6 months",d:fc.forecast_6m},{label:"12 months",d:fc.forecast_12m}].map((f,j) => f.d && (
                            <div key={j} style={{ background: "var(--bg-elevated)", borderRadius: 6, padding: "0.5rem", textAlign: "center" }}>
                              <div style={{ fontSize: "0.65rem", color: "var(--text-muted)", marginBottom: 2 }}>{f.label}</div>
                              <div style={{ fontSize: "0.9rem", fontWeight: 800, color: FORE[f.d.direction]||"#6366f1" }}>{f.d.score}</div>
                              <div style={{ fontSize: "0.65rem", color: FORE[f.d.direction]||"#6366f1", fontWeight: 600 }}>{f.d.direction}</div>
                            </div>
                          ))}
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "0.5rem 0.65rem", background: (fc.verdict === "ENTER_NOW" ? "rgba(16,185,129,0.1)" : "rgba(245,158,11,0.1)"), borderRadius: 6 }}>
                          <span style={{ fontSize: "0.75rem", fontWeight: 700, color: fc.verdict === "ENTER_NOW" ? "#10b981" : "#f59e0b" }}>{fc.verdict?.replace("_"," ")}</span>
                          <span style={{ fontSize: "0.75rem", color: "var(--text-secondary)" }}>— {fc.verdict_reason}</span>
                        </div>
                      </div>
                    )}

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.5rem", marginBottom: "0.5rem" }}>
                      <button onClick={() => window.location.href = `/dashboard/starter?keyword=${encodeURIComponent(t.topic)}`} style={{ background: "var(--accent)", color: "white", border: "none", borderRadius: "var(--radius-sm)", padding: "0.6rem", fontWeight: 700, fontSize: "0.82rem", cursor: "pointer", transition: "opacity 0.15s" }} onMouseEnter={e => e.currentTarget.style.opacity="0.85"} onMouseLeave={e => e.currentTarget.style.opacity="1"}>Build Starter Kit</button>
                      <button onClick={() => window.location.href = `/dashboard/validate?q=${encodeURIComponent(t.topic)}`} style={{ background: "transparent", color: "var(--text-secondary)", border: "1px solid var(--border)", borderRadius: "var(--radius-sm)", padding: "0.6rem", fontWeight: 600, fontSize: "0.82rem", cursor: "pointer", transition: "all 0.15s" }} onMouseEnter={e => { e.currentTarget.style.borderColor="var(--accent)"; e.currentTarget.style.color="var(--accent-light)"; }} onMouseLeave={e => { e.currentTarget.style.borderColor="var(--border)"; e.currentTarget.style.color="var(--text-secondary)"; }}>Validate Trend</button>
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.5rem" }}>
                      <button onClick={() => getForecast(t, i)} disabled={forecasting[i]} style={{ background: "transparent", color: forecasts[i] ? "var(--accent-light)" : "var(--text-muted)", border: `1px solid ${forecasts[i] ? "var(--accent)" : "var(--border)"}`, borderRadius: "var(--radius-sm)", padding: "0.6rem", fontWeight: 600, fontSize: "0.82rem", cursor: "pointer", transition: "all 0.15s" }}>{forecasting[i] ? "Forecasting..." : forecasts[i] ? "Hide Forecast" : "AI Forecast"}</button>
                      <button onClick={() => saveToWatchlist(t, i)} disabled={saving[i] || saved[i]} style={{ background: saved[i] ? "rgba(16,185,129,0.1)" : "transparent", color: saved[i] ? "#10b981" : "var(--text-muted)", border: `1px solid ${saved[i] ? "rgba(16,185,129,0.3)" : "var(--border)"}`, borderRadius: "var(--radius-sm)", padding: "0.6rem", fontWeight: 600, fontSize: "0.82rem", cursor: saved[i] ? "default" : "pointer", transition: "all 0.15s" }}>{saving[i] ? "Saving..." : saved[i] ? "Saved" : "+ Watchlist"}</button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
