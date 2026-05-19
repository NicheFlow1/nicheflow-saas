
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

interface TrendTopic {
  topic: string; category: string; score: number;
  signal: string; momentum: string; why_trending: string;
  opportunity: string; time_window: string; difficulty: string;
}

const SIG: Record<string, { color: string; bg: string }> = {
  GO:    { color: "#10b981", bg: "rgba(16,185,129,0.12)" },
  WATCH: { color: "#f59e0b", bg: "rgba(245,158,11,0.12)" },
  WAIT:  { color: "#6b7280", bg: "rgba(107,114,128,0.1)" },
};
const MOM: Record<string, string> = { Rising: "#10b981", Stable: "#6366f1", Declining: "#ef4444" };
const DIFF: Record<string, string> = { Easy: "#10b981", Medium: "#f59e0b", Hard: "#ef4444" };

export default function TrendingPage() {
  const supabase = useRef(getSupabaseClient()).current;
  const [category, setCategory] = useState("all");
  const [loading, setLoading] = useState(false);
  const [topics, setTopics] = useState<TrendTopic[]>([]);
  const [error, setError] = useState("");
  const [lastScanned, setLastScanned] = useState<string | null>(null);

  async function scan() {
    setLoading(true);
    setError("");
    setTopics([]);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/autopilot`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${session?.access_token}` },
          body: JSON.stringify({ action: "trending", category }),
        }
      );
      const data = await res.json();
      if (data.topics) { setTopics(data.topics); setLastScanned(new Date().toLocaleTimeString()); }
      else setError(data.error || "Failed to load trending topics");
    } catch (e) { setError(String(e)); }
    setLoading(false);
  }

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-base)" }}>
      {/* Top bar */}
      <div style={{ borderBottom: "1px solid var(--border)", background: "var(--bg-surface)", padding: "1.75rem 2.5rem 1.5rem" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.35rem" }}>
            <h1 style={{ fontSize: "1.6rem", fontWeight: 800, color: "var(--text-primary)", margin: 0 }}>Trending Now</h1>
            <span style={{ background: "linear-gradient(135deg,#ef4444,#f97316)", color: "white", borderRadius: 999, padding: "0.18rem 0.65rem", fontSize: "0.65rem", fontWeight: 800, letterSpacing: "0.08em" }}>LIVE</span>
            {lastScanned && <span style={{ marginLeft: "auto", fontSize: "0.78rem", color: "var(--text-muted)" }}>Updated {lastScanned}</span>}
          </div>
          <p style={{ color: "var(--text-muted)", margin: "0 0 1.25rem", fontSize: "0.9rem" }}>
            Discover what is blowing up <strong style={{ color: "var(--accent-light)" }}>right now</strong> — before it goes mainstream.
          </p>
          {/* Category pills */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem" }}>
            {CATEGORIES.map(c => (
              <button key={c.id} onClick={() => setCategory(c.id)} style={{
                background: category === c.id ? "var(--accent)" : "transparent",
                color: category === c.id ? "white" : "var(--text-muted)",
                border: `1px solid ${category === c.id ? "var(--accent)" : "var(--border)"}`,
                borderRadius: 999, padding: "0.32rem 0.85rem", fontSize: "0.8rem",
                fontWeight: category === c.id ? 700 : 500, cursor: "pointer", transition: "all 0.15s",
              }}>
                {c.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "1.75rem 2.5rem" }}>
        {/* Scan button */}
        <div style={{ marginBottom: "1.75rem" }}>
          <button onClick={scan} disabled={loading} style={{
            background: loading ? "var(--bg-elevated)" : "var(--accent)",
            color: "white", border: "none", borderRadius: "var(--radius)",
            padding: "0.7rem 1.75rem", fontWeight: 700, fontSize: "0.95rem",
            display: "inline-flex", alignItems: "center", gap: "0.55rem",
            boxShadow: loading ? "none" : "0 4px 16px var(--accent-glow)",
            cursor: loading ? "not-allowed" : "pointer", transition: "all 0.2s",
          }}>
            {loading
              ? <><div style={{ width: 16, height: 16, border: "2px solid rgba(255,255,255,0.25)", borderTopColor: "white", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} /> Scanning markets...</>
              : "Scan Trending Topics"
            }
          </button>
        </div>

        {error && (
          <div style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.25)", borderRadius: "var(--radius)", padding: "1rem 1.25rem", color: "#fca5a5", marginBottom: "1.5rem" }}>
            {error}
          </div>
        )}

        {/* Empty */}
        {!loading && topics.length === 0 && !error && (
          <div style={{ textAlign: "center", padding: "5rem 2rem", background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "var(--radius-lg)" }}>
            <div style={{ width: 56, height: 56, background: "var(--bg-elevated)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1rem", fontSize: "1.5rem" }}>🔥</div>
            <h3 style={{ color: "var(--text-primary)", fontWeight: 700, marginBottom: "0.4rem" }}>No trends loaded</h3>
            <p style={{ color: "var(--text-muted)", fontSize: "0.875rem" }}>Pick a category and hit <strong style={{ color: "var(--accent-light)" }}>Scan Trending Topics</strong></p>
          </div>
        )}

        {/* Skeleton */}
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

        {/* Cards */}
        {topics.length > 0 && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(460px, 1fr))", gap: "1.25rem" }}>
            {topics.map((t, i) => {
              const sig = SIG[t.signal] || SIG.WAIT;
              const momColor = MOM[t.momentum] || "#6366f1";
              const diffColor = DIFF[t.difficulty] || "#6b7280";
              return (
                <div key={i} style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "var(--radius-lg)", overflow: "hidden", transition: "all 0.2s", animation: `fadeIn 0.35s ease ${i * 0.04}s both` }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = "var(--border-accent)"; e.currentTarget.style.boxShadow = "0 8px 32px rgba(0,0,0,0.25)"; e.currentTarget.style.transform = "translateY(-2px)"; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.boxShadow = "none"; e.currentTarget.style.transform = "translateY(0)"; }}
                >
                  {/* Accent strip */}
                  <div style={{ height: 3, background: `linear-gradient(90deg, ${sig.color}, var(--accent-light))` }} />

                  <div style={{ padding: "1.25rem" }}>
                    {/* Header */}
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "0.75rem", marginBottom: "0.85rem" }}>
                      <h3 style={{ fontSize: "1rem", fontWeight: 700, color: "var(--text-primary)", margin: 0, lineHeight: 1.35, flex: 1 }}>{t.topic}</h3>
                      <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "0.35rem", flexShrink: 0 }}>
                        <span style={{ background: sig.bg, color: sig.color, border: `1px solid ${sig.color}40`, borderRadius: 999, padding: "0.18rem 0.65rem", fontSize: "0.72rem", fontWeight: 700 }}>
                          {t.signal}
                        </span>
                        <span style={{ fontSize: "0.78rem", fontWeight: 800, color: "var(--accent-light)" }}>{t.score}/100</span>
                      </div>
                    </div>

                    {/* Score bar */}
                    <div style={{ height: 4, background: "var(--bg-elevated)", borderRadius: 999, overflow: "hidden", marginBottom: "0.85rem" }}>
                      <div style={{ height: "100%", width: `${t.score}%`, background: `linear-gradient(90deg, ${sig.color}, var(--accent-light))`, borderRadius: 999 }} />
                    </div>

                    {/* Badges */}
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "0.35rem", marginBottom: "1rem" }}>
                      <span style={{ background: "var(--bg-elevated)", color: "var(--text-muted)", border: "1px solid var(--border)", borderRadius: 999, padding: "0.18rem 0.55rem", fontSize: "0.7rem" }}>{t.category}</span>
                      <span style={{ background: momColor + "18", color: momColor, border: `1px solid ${momColor}30`, borderRadius: 999, padding: "0.18rem 0.55rem", fontSize: "0.7rem", fontWeight: 600 }}>{t.momentum}</span>
                      <span style={{ background: diffColor + "18", color: diffColor, border: `1px solid ${diffColor}30`, borderRadius: 999, padding: "0.18rem 0.55rem", fontSize: "0.7rem", fontWeight: 600 }}>{t.difficulty}</span>
                      <span style={{ background: "rgba(59,130,246,0.1)", color: "#60a5fa", border: "1px solid rgba(59,130,246,0.2)", borderRadius: 999, padding: "0.18rem 0.55rem", fontSize: "0.7rem" }}>{t.time_window}</span>
                    </div>

                    {/* Why */}
                    <div style={{ background: "var(--bg-elevated)", borderRadius: "var(--radius-sm)", padding: "0.75rem", marginBottom: "0.75rem" }}>
                      <p style={{ fontSize: "0.68rem", color: "var(--text-muted)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.07em", margin: "0 0 0.3rem" }}>Why trending</p>
                      <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", margin: 0, lineHeight: 1.55 }}>{t.why_trending}</p>
                    </div>

                    {/* Opportunity */}
                    <div style={{ background: "rgba(16,185,129,0.06)", border: "1px solid rgba(16,185,129,0.18)", borderRadius: "var(--radius-sm)", padding: "0.75rem", marginBottom: "1rem" }}>
                      <p style={{ fontSize: "0.68rem", color: "#10b981", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.07em", margin: "0 0 0.3rem" }}>Opportunity</p>
                      <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", margin: 0, lineHeight: 1.55 }}>{t.opportunity}</p>
                    </div>

                    {/* Buttons */}
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.6rem" }}>
                      <button
                        onClick={() => window.location.href = `/dashboard/starter?keyword=${encodeURIComponent(t.topic)}`}
                        style={{ background: "var(--accent)", color: "white", border: "none", borderRadius: "var(--radius-sm)", padding: "0.6rem", fontWeight: 700, fontSize: "0.82rem", cursor: "pointer", transition: "opacity 0.15s" }}
                        onMouseEnter={e => e.currentTarget.style.opacity = "0.85"}
                        onMouseLeave={e => e.currentTarget.style.opacity = "1"}
                      >
                        Build Starter Kit
                      </button>
                      <button
                        onClick={() => window.location.href = `/dashboard/validate?q=${encodeURIComponent(t.topic)}`}
                        style={{ background: "transparent", color: "var(--text-secondary)", border: "1px solid var(--border)", borderRadius: "var(--radius-sm)", padding: "0.6rem", fontWeight: 600, fontSize: "0.82rem", cursor: "pointer", transition: "all 0.15s" }}
                        onMouseEnter={e => { e.currentTarget.style.borderColor = "var(--accent)"; e.currentTarget.style.color = "var(--accent-light)"; }}
                        onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.color = "var(--text-secondary)"; }}
                      >
                        Validate Trend
                      </button>
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
