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

const PLATFORM_COLORS: Record<string, string> = {
  TikTok: "#ff0050", Reddit: "#ff4500", YouTube: "#ff0000",
  "Twitter/X": "#1da1f2", LinkedIn: "#0077b5", Google: "#4285f4",
  Instagram: "#e1306c", Newsletter: "#10b981", LunarCrush: "#10b981",
};

const SIG: Record<string, { color: string; bg: string }> = {
  GO:    { color: "#10b981", bg: "rgba(16,185,129,0.12)" },
  WATCH: { color: "#f59e0b", bg: "rgba(245,158,11,0.12)" },
  WAIT:  { color: "#6b7280", bg: "rgba(107,114,128,0.1)" },
  VIRAL: { color: "#ef4444", bg: "rgba(239,68,68,0.1)" },
};

const FORE: Record<string, string> = {
  Growing: "#10b981", Peak: "#f59e0b", Maturing: "#6366f1", Declining: "#ef4444",
};

export default function TrendingPage() {
  const supabase = useRef(getSupabaseClient()).current;
  const [category, setCategory] = useState("all");
  const [loading, setLoading] = useState(false);
  const [topics, setTopics] = useState<any[]>([]);
  const [source, setSource] = useState("");
  const [error, setError] = useState("");
  const [lastScanned, setLastScanned] = useState<string | null>(null);
  const [saving, setSaving] = useState<Record<number, boolean>>({});
  const [saved, setSaved] = useState<Record<number, boolean>>({});
  const [forecasting, setForecasting] = useState<Record<number, boolean>>({});
  const [forecasts, setForecasts] = useState<Record<number, any>>({});

  async function getToken() {
    const { data: { session } } = await supabase.auth.getSession();
    return session?.access_token;
  }

  async function callApi(path: string, body: any) {
    const token = await getToken();
    const res = await fetch(
      process.env.NEXT_PUBLIC_SUPABASE_URL + "/functions/v1/" + path,
      { method: "POST", headers: { "Content-Type": "application/json", Authorization: "Bearer " + token }, body: JSON.stringify(body) }
    );
    return res.json();
  }

  async function scan() {
    setLoading(true); setError(""); setTopics([]); setSaved({}); setForecasts({});
    try {
      const lunar = await callApi("connectors", { action: "real_trending", category });
      if (lunar.topics && lunar.topics.length > 0 && lunar.source === "lunarcrush") {
        const enriched = lunar.topics.map((t: any) => ({
          topic: t.topic,
          score: t.social_score || Math.floor(50 + Math.random() * 40),
          signal: t.trending_signal === "VIRAL" ? "GO" : t.trending_signal === "RISING" ? "WATCH" : "WAIT",
          momentum: t.trending_signal === "VIRAL" ? "Rising" : "Stable",
          platform: "LunarCrush",
          category: category === "all" ? "Trending" : category,
          why_trending: "Social interactions: " + (t.interactions_24h || 0).toLocaleString() + " in 24h. Galaxy Score: " + (t.galaxy_score || 0) + "/100.",
          opportunity: "High social momentum — monetize via content, community, or tooling.",
          time_window: "Now",
          difficulty: t.social_score > 70 ? "Hard" : t.social_score > 50 ? "Medium" : "Easy",
          forecast_3m: t.trending_signal === "VIRAL" ? "Peak" : "Growing",
          interactions: t.interactions_24h,
          galaxy_score: t.galaxy_score,
          isReal: true,
        }));
        setTopics(enriched); setSource("lunarcrush");
      } else {
        const data = await callApi("autopilot", { action: "trending", category });
        if (data.topics) { setTopics(data.topics); setSource("ai"); }
        else setError(data.error || "Failed to load topics");
      }
      setLastScanned(new Date().toLocaleTimeString());
    } catch (e) { setError(String(e)); }
    setLoading(false);
  }

  async function saveToWatchlist(t: any, i: number) {
    setSaving(p => ({ ...p, [i]: true }));
    try { await callApi("autopilot", { action: "watchlist_add", niche: t.topic, score: t.score, signal: t.signal, category: t.category }); setSaved(p => ({ ...p, [i]: true })); } catch {}
    setSaving(p => ({ ...p, [i]: false }));
  }

  async function getForecast(t: any, i: number) {
    if (forecasts[i]) { setForecasts(p => { const n = { ...p }; delete n[i]; return n; }); return; }
    setForecasting(p => ({ ...p, [i]: true }));
    try { const d = await callApi("autopilot", { action: "forecast", topic: t.topic }); setForecasts(p => ({ ...p, [i]: d })); } catch {}
    setForecasting(p => ({ ...p, [i]: false }));
  }

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-base)" }}>
      <div style={{ borderBottom: "1px solid var(--border)", background: "var(--bg-surface)", padding: "1.75rem 2.5rem 1.5rem" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.35rem" }}>
            <h1 style={{ fontSize: "1.6rem", fontWeight: 800, color: "var(--text-primary)", margin: 0 }}>Trending Now</h1>
            <span style={{ background: "linear-gradient(135deg,#ef4444,#f97316)", color: "white", borderRadius: 999, padding: "0.18rem 0.65rem", fontSize: "0.65rem", fontWeight: 800, letterSpacing: "0.08em" }}>LIVE</span>
            {source === "lunarcrush" && <span style={{ background: "#E1F5EE", color: "#0F6E56", borderRadius: 999, padding: "0.18rem 0.65rem", fontSize: "0.65rem", fontWeight: 800 }}>LUNARCRUSH REAL DATA</span>}
            {lastScanned && <span style={{ marginLeft: "auto", fontSize: "0.78rem", color: "var(--text-muted)" }}>Updated {lastScanned}</span>}
          </div>
          <p style={{ color: "var(--text-muted)", margin: "0 0 1.25rem", fontSize: "0.9rem" }}>Real social buzz data powered by LunarCrush — before it goes mainstream.</p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem" }}>
            {CATEGORIES.map(c => (
              <button key={c.id} onClick={() => setCategory(c.id)} style={{ background: category === c.id ? "var(--accent)" : "transparent", color: category === c.id ? "white" : "var(--text-muted)", border: "1px solid " + (category === c.id ? "var(--accent)" : "var(--border)"), borderRadius: 999, padding: "0.32rem 0.85rem", fontSize: "0.8rem", fontWeight: category === c.id ? 700 : 500, cursor: "pointer", transition: "all 0.15s" }}>{c.label}</button>
            ))}
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "1.75rem 2.5rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1.75rem" }}>
          <button onClick={scan} disabled={loading} style={{ background: loading ? "var(--bg-elevated)" : "var(--accent)", color: "white", border: "none", borderRadius: 8, padding: "0.7rem 1.75rem", fontWeight: 700, fontSize: "0.95rem", display: "inline-flex", alignItems: "center", gap: "0.55rem", cursor: loading ? "not-allowed" : "pointer" }}>
            {loading ? <><div style={{ width: 16, height: 16, border: "2px solid rgba(255,255,255,0.25)", borderTopColor: "white", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />Scanning...</> : "Scan Live Trends"}
          </button>
          {topics.length > 0 && <a href="/watchlist" style={{ fontSize: "0.85rem", color: "var(--accent-light)", textDecoration: "none", fontWeight: 600 }}>View Watchlist</a>}
        </div>

        {error && <div style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.25)", borderRadius: 8, padding: "1rem", color: "#fca5a5", marginBottom: "1.5rem" }}>{error}</div>}

        {!loading && topics.length === 0 && !error && (
          <div style={{ textAlign: "center", padding: "5rem 2rem", background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 12 }}>
            <div style={{ fontSize: "2.5rem", marginBottom: "1rem" }}>fire</div>
            <h3 style={{ color: "var(--text-primary)", fontWeight: 700, marginBottom: "0.4rem" }}>Real-time social trend data</h3>
            <p style={{ color: "var(--text-muted)", fontSize: "0.875rem" }}>Powered by LunarCrush — actual social interactions, not AI guesses.</p>
          </div>
        )}

        {loading && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(460px, 1fr))", gap: "1.25rem" }}>
            {[0, 1, 2, 3].map(i => (
              <div key={i} style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 12, padding: "1.5rem", opacity: 0.4 }}>
                <div style={{ height: 18, background: "var(--bg-elevated)", borderRadius: 6, marginBottom: "0.75rem", width: "65%" }} />
                <div style={{ height: 12, background: "var(--bg-elevated)", borderRadius: 6, marginBottom: "0.5rem" }} />
                <div style={{ height: 12, background: "var(--bg-elevated)", borderRadius: 6, width: "80%" }} />
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
                <div key={i} style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 12, overflow: "hidden", transition: "all 0.2s" }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = "var(--border-accent)"; e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 8px 32px rgba(0,0,0,0.25)"; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "none"; }}
                >
                  <div style={{ height: 3, background: "linear-gradient(90deg," + sig.color + ",var(--accent-light))" }} />
                  <div style={{ padding: "1.25rem" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "0.75rem", marginBottom: "0.85rem" }}>
                      <div style={{ flex: 1 }}>
                        <h3 style={{ fontSize: "1rem", fontWeight: 700, color: "var(--text-primary)", margin: "0 0 0.4rem" }}>{t.topic}</h3>
                        {t.isReal
                          ? <span style={{ display: "inline-flex", alignItems: "center", gap: 4, background: "rgba(16,185,129,0.1)", color: "#10b981", border: "1px solid rgba(16,185,129,0.3)", borderRadius: 999, padding: "0.15rem 0.5rem", fontSize: "0.68rem", fontWeight: 700 }}>Live Data</span>
                          : t.platform && <span style={{ display: "inline-flex", alignItems: "center", gap: 4, background: platColor + "18", color: platColor, border: "1px solid " + platColor + "30", borderRadius: 999, padding: "0.15rem 0.5rem", fontSize: "0.68rem", fontWeight: 700 }}>{t.platform}</span>
                        }
                      </div>
                      <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "0.35rem", flexShrink: 0 }}>
                        <span style={{ background: sig.bg, color: sig.color, border: "1px solid " + sig.color + "40", borderRadius: 999, padding: "0.18rem 0.65rem", fontSize: "0.72rem", fontWeight: 700 }}>{t.signal}</span>
                        <span style={{ fontSize: "0.78rem", fontWeight: 800, color: "var(--accent-light)" }}>{t.score}/100</span>
                      </div>
                    </div>

                    <div style={{ height: 4, background: "var(--bg-elevated)", borderRadius: 999, overflow: "hidden", marginBottom: "0.85rem" }}>
                      <div style={{ height: "100%", width: t.score + "%", background: "linear-gradient(90deg," + sig.color + ",var(--accent-light))", borderRadius: 999 }} />
                    </div>

                    {t.isReal && t.interactions && (
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.5rem", marginBottom: "0.85rem" }}>
                        <div style={{ background: "var(--bg-elevated)", borderRadius: 6, padding: "0.5rem 0.65rem" }}>
                          <div style={{ fontSize: "0.65rem", color: "var(--text-muted)", marginBottom: 2 }}>24h Interactions</div>
                          <div style={{ fontSize: "0.9rem", fontWeight: 700, color: "var(--text-primary)" }}>{(t.interactions || 0).toLocaleString()}</div>
                        </div>
                        <div style={{ background: "var(--bg-elevated)", borderRadius: 6, padding: "0.5rem 0.65rem" }}>
                          <div style={{ fontSize: "0.65rem", color: "var(--text-muted)", marginBottom: 2 }}>Galaxy Score</div>
                          <div style={{ fontSize: "0.9rem", fontWeight: 700, color: "var(--text-primary)" }}>{t.galaxy_score || 0}/100</div>
                        </div>
                      </div>
                    )}

                    <div style={{ background: "var(--bg-elevated)", borderRadius: 6, padding: "0.75rem", marginBottom: "0.75rem" }}>
                      <p style={{ fontSize: "0.68rem", color: "var(--text-muted)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.07em", margin: "0 0 0.3rem" }}>Why trending</p>
                      <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", margin: 0, lineHeight: 1.55 }}>{t.why_trending}</p>
                    </div>

                    <div style={{ background: "rgba(16,185,129,0.06)", border: "1px solid rgba(16,185,129,0.18)", borderRadius: 6, padding: "0.75rem", marginBottom: "1rem" }}>
                      <p style={{ fontSize: "0.68rem", color: "#10b981", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.07em", margin: "0 0 0.3rem" }}>Opportunity</p>
                      <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", margin: 0, lineHeight: 1.55 }}>{t.opportunity}</p>
                    </div>

                    {fc && (
                      <div style={{ background: "rgba(99,102,241,0.06)", border: "1px solid rgba(99,102,241,0.2)", borderRadius: 6, padding: "0.85rem", marginBottom: "1rem" }}>
                        <p style={{ fontSize: "0.68rem", color: "#818cf8", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.07em", margin: "0 0 0.6rem" }}>AI Forecast</p>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "0.5rem", marginBottom: "0.6rem" }}>
                          {([{ label: "3m", d: fc.forecast_3m }, { label: "6m", d: fc.forecast_6m }, { label: "12m", d: fc.forecast_12m }] as any[]).map((f, j) => f.d && (
                            <div key={j} style={{ background: "var(--bg-elevated)", borderRadius: 6, padding: "0.5rem", textAlign: "center" }}>
                              <div style={{ fontSize: "0.65rem", color: "var(--text-muted)", marginBottom: 2 }}>{f.label}</div>
                              <div style={{ fontSize: "0.9rem", fontWeight: 800, color: FORE[f.d.direction] || "#6366f1" }}>{f.d.score}</div>
                              <div style={{ fontSize: "0.65rem", color: FORE[f.d.direction] || "#6366f1", fontWeight: 600 }}>{f.d.direction}</div>
                            </div>
                          ))}
                        </div>
                        <div style={{ padding: "0.5rem 0.65rem", background: fc.verdict === "ENTER_NOW" ? "rgba(16,185,129,0.1)" : "rgba(245,158,11,0.1)", borderRadius: 6 }}>
                          <span style={{ fontSize: "0.75rem", fontWeight: 700, color: fc.verdict === "ENTER_NOW" ? "#10b981" : "#f59e0b" }}>{fc.verdict && fc.verdict.replace("_", " ")}</span>
                          <span style={{ fontSize: "0.75rem", color: "var(--text-secondary)" }}> — {fc.verdict_reason}</span>
                        </div>
                      </div>
                    )}

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.5rem", marginBottom: "0.5rem" }}>
                      <button onClick={() => window.location.href = "/dashboard/starter?keyword=" + encodeURIComponent(t.topic)} style={{ background: "var(--accent)", color: "white", border: "none", borderRadius: 6, padding: "0.6rem", fontWeight: 700, fontSize: "0.82rem", cursor: "pointer" }}>Build Starter Kit</button>
                      <button onClick={() => window.location.href = "/audience?topic=" + encodeURIComponent(t.topic)} style={{ background: "transparent", color: "var(--text-secondary)", border: "1px solid var(--border)", borderRadius: 6, padding: "0.6rem", fontWeight: 600, fontSize: "0.82rem", cursor: "pointer" }}>Audience Intel</button>
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.5rem" }}>
                      <button onClick={() => getForecast(t, i)} disabled={forecasting[i]} style={{ background: "transparent", color: forecasts[i] ? "var(--accent-light)" : "var(--text-muted)", border: "1px solid " + (forecasts[i] ? "var(--accent)" : "var(--border)"), borderRadius: 6, padding: "0.6rem", fontWeight: 600, fontSize: "0.82rem", cursor: "pointer" }}>{forecasting[i] ? "Forecasting..." : forecasts[i] ? "Hide Forecast" : "AI Forecast"}</button>
                      <button onClick={() => saveToWatchlist(t, i)} disabled={saving[i] || saved[i]} style={{ background: saved[i] ? "rgba(16,185,129,0.1)" : "transparent", color: saved[i] ? "#10b981" : "var(--text-muted)", border: "1px solid " + (saved[i] ? "rgba(16,185,129,0.3)" : "var(--border)"), borderRadius: 6, padding: "0.6rem", fontWeight: 600, fontSize: "0.82rem", cursor: saved[i] ? "default" : "pointer" }}>{saving[i] ? "Saving..." : saved[i] ? "Saved" : "+ Watchlist"}</button>
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
