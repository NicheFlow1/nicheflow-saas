
"use client";
import { useRef, useState } from "react";
import { getSupabaseClient } from "@/lib/supabase/client-singleton";

const CATEGORIES = [
  { id: "all", label: "🌐 All" },
  { id: "ai-tech", label: "🤖 AI & Tech" },
  { id: "health-wellness", label: "💚 Health" },
  { id: "finance", label: "💰 Finance" },
  { id: "creator-economy", label: "🎨 Creator" },
  { id: "saas", label: "⚙️ SaaS" },
  { id: "ecommerce", label: "🛒 E-commerce" },
  { id: "education", label: "📚 Education" },
  { id: "climate-green", label: "🌱 Climate" },
];

interface TrendTopic {
  topic: string; category: string; score: number;
  signal: string; momentum: string; why_trending: string;
  opportunity: string; time_window: string; difficulty: string;
}

const signalConfig: Record<string, { color: string; bg: string; label: string }> = {
  GO:    { color: "#10b981", bg: "rgba(16,185,129,0.12)", label: "🟢 GO" },
  WATCH: { color: "#f59e0b", bg: "rgba(245,158,11,0.12)", label: "🟡 WATCH" },
  WAIT:  { color: "#6b7280", bg: "rgba(107,114,128,0.12)", label: "⚪ WAIT" },
};
const momentumIcon: Record<string, string> = { Rising: "📈", Stable: "➡️", Declining: "📉" };
const diffConfig: Record<string, { color: string }> = {
  Easy: { color: "#10b981" }, Medium: { color: "#f59e0b" }, Hard: { color: "#ef4444" },
};

export default function TrendingPage() {
  const supabase = useRef(getSupabaseClient()).current;
  const [category, setCategory] = useState("all");
  const [loading, setLoading] = useState(false);
  const [topics, setTopics] = useState<TrendTopic[]>([]);
  const [error, setError] = useState("");
  const [lastScanned, setLastScanned] = useState<string | null>(null);
  const [dots, setDots] = useState(".");

  async function scan() {
    setLoading(true);
    setError("");
    setTopics([]);
    // Animate dots
    let d = 1;
    const iv = setInterval(() => { setDots(".".repeat((d++ % 3) + 1)); }, 500);
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
      clearInterval(iv);
      if (data.topics) { setTopics(data.topics); setLastScanned(new Date().toLocaleTimeString()); }
      else setError(data.error || "Failed to load trending topics");
    } catch (e) { clearInterval(iv); setError(String(e)); }
    setLoading(false);
  }

  function goToStarter(topic: string) {
    window.location.href = `/dashboard/starter?keyword=${encodeURIComponent(topic)}`;
  }
  function goToValidate(topic: string) {
    window.location.href = `/dashboard/validate?q=${encodeURIComponent(topic)}`;
  }

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-base)", padding: "0" }}>
      {/* Hero Header */}
      <div style={{ background: "linear-gradient(135deg, var(--bg-surface) 0%, var(--bg-elevated) 100%)", borderBottom: "1px solid var(--border)", padding: "2.5rem 2.5rem 2rem" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "1rem" }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.5rem" }}>
                <span style={{ fontSize: "2rem" }}>🔥</span>
                <h1 style={{ fontSize: "2rem", fontWeight: 800, color: "var(--text-primary)", margin: 0 }}>Trending Now</h1>
                <span style={{ background: "linear-gradient(135deg, #ef4444, #f97316)", color: "white", borderRadius: 999, padding: "0.2rem 0.7rem", fontSize: "0.7rem", fontWeight: 800, letterSpacing: "0.08em", boxShadow: "0 2px 8px rgba(239,68,68,0.4)" }}>LIVE</span>
              </div>
              <p style={{ color: "var(--text-muted)", margin: 0, fontSize: "0.95rem" }}>
                Discover what&apos;s blowing up <strong style={{ color: "var(--accent-light)" }}>RIGHT NOW</strong> — before it goes mainstream.
              </p>
            </div>
            {lastScanned && (
              <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "var(--radius-sm)", padding: "0.5rem 1rem", fontSize: "0.8rem", color: "var(--text-muted)" }}>
                🕐 Last scan: <strong style={{ color: "var(--text-secondary)" }}>{lastScanned}</strong>
              </div>
            )}
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "2rem 2.5rem" }}>
        {/* Category Pills */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", marginBottom: "1.75rem" }}>
          {CATEGORIES.map(cat => (
            <button key={cat.id} onClick={() => setCategory(cat.id)} style={{ background: category === cat.id ? "var(--accent)" : "var(--bg-card)", color: category === cat.id ? "white" : "var(--text-secondary)", border: `1px solid ${category === cat.id ? "var(--accent)" : "var(--border)"}`, borderRadius: 999, padding: "0.4rem 1rem", fontWeight: category === cat.id ? 700 : 500, fontSize: "0.85rem", cursor: "pointer", transition: "all 0.15s", boxShadow: category === cat.id ? "0 2px 10px var(--accent-glow)" : "none" }}>
              {cat.label}
            </button>
          ))}
        </div>

        {/* Scan Button */}
        <div style={{ marginBottom: "2rem" }}>
          <button onClick={scan} disabled={loading} style={{ background: loading ? "var(--bg-elevated)" : "linear-gradient(135deg, var(--accent), var(--accent-light))", color: "white", border: "none", borderRadius: "var(--radius)", padding: "0.85rem 2rem", fontWeight: 700, fontSize: "1rem", display: "inline-flex", alignItems: "center", gap: "0.6rem", boxShadow: loading ? "none" : "0 4px 20px var(--accent-glow)", transition: "all 0.2s", cursor: loading ? "not-allowed" : "pointer" }}>
            {loading ? (
              <>
                <div style={{ width: 18, height: 18, border: "2.5px solid rgba(255,255,255,0.3)", borderTopColor: "white", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
                Scanning markets{dots}
              </>
            ) : (
              <> 🔄 Scan Trending Topics </>
            )}
          </button>
        </div>

        {/* Error */}
        {error && (
          <div style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)", borderRadius: "var(--radius)", padding: "1rem 1.25rem", color: "#fca5a5", marginBottom: "1.5rem", display: "flex", alignItems: "center", gap: "0.75rem" }}>
            <span style={{ fontSize: "1.2rem" }}>⚠️</span> {error}
          </div>
        )}

        {/* Empty state */}
        {topics.length === 0 && !loading && !error && (
          <div style={{ textAlign: "center", padding: "5rem 2rem", background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "var(--radius-lg)" }}>
            <div style={{ fontSize: "4rem", marginBottom: "1.25rem", filter: "grayscale(0.3)" }}>🔥</div>
            <h3 style={{ color: "var(--text-primary)", fontWeight: 700, marginBottom: "0.5rem", fontSize: "1.2rem" }}>No trends loaded yet</h3>
            <p style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>Pick a category above and hit <strong style={{ color: "var(--accent-light)" }}>Scan Trending Topics</strong> to discover what&apos;s blowing up right now.</p>
          </div>
        )}

        {/* Loading skeleton */}
        {loading && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(480px, 1fr))", gap: "1.25rem" }}>
            {[...Array(4)].map((_, i) => (
              <div key={i} style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "var(--radius-lg)", padding: "1.5rem", animation: "pulse 1.5s ease-in-out infinite", opacity: 0.6 }}>
                <div style={{ height: 20, background: "var(--bg-elevated)", borderRadius: 6, marginBottom: "0.75rem", width: "70%" }} />
                <div style={{ height: 14, background: "var(--bg-elevated)", borderRadius: 6, marginBottom: "0.5rem", width: "90%" }} />
                <div style={{ height: 14, background: "var(--bg-elevated)", borderRadius: 6, width: "60%" }} />
              </div>
            ))}
          </div>
        )}

        {/* Topics Grid */}
        {topics.length > 0 && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(480px, 1fr))", gap: "1.25rem" }}>
            {topics.map((t, i) => {
              const sig = signalConfig[t.signal] || signalConfig.WAIT;
              const diff = diffConfig[t.difficulty] || { color: "#6b7280" };
              return (
                <div key={i} style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "var(--radius-lg)", overflow: "hidden", transition: "all 0.2s", animation: `fadeIn 0.4s ease ${i * 0.05}s both` }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = "var(--border-accent)"; e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 8px 30px rgba(0,0,0,0.3)"; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none"; }}
                >
                  {/* Card top accent bar */}
                  <div style={{ height: 3, background: `linear-gradient(90deg, ${sig.color}, var(--accent-light))` }} />

                  <div style={{ padding: "1.25rem" }}>
                    {/* Header row */}
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "0.75rem", marginBottom: "0.75rem" }}>
                      <h3 style={{ fontSize: "1.05rem", fontWeight: 700, color: "var(--text-primary)", margin: 0, lineHeight: 1.3, flex: 1 }}>{t.topic}</h3>
                      <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "0.4rem", flexShrink: 0 }}>
                        <span style={{ background: sig.bg, color: sig.color, border: `1px solid ${sig.color}44`, borderRadius: 999, padding: "0.2rem 0.7rem", fontSize: "0.75rem", fontWeight: 700, whiteSpace: "nowrap" }}>{sig.label}</span>
                        <div style={{ display: "flex", alignItems: "center", gap: "0.3rem" }}>
                          <div style={{ width: 40, height: 5, background: "var(--bg-elevated)", borderRadius: 999, overflow: "hidden" }}>
                            <div style={{ height: "100%", width: `${t.score}%`, background: `linear-gradient(90deg, ${sig.color}, var(--accent-light))`, borderRadius: 999 }} />
                          </div>
                          <span style={{ fontSize: "0.8rem", fontWeight: 800, color: "var(--accent-light)" }}>{t.score}</span>
                        </div>
                      </div>
                    </div>

                    {/* Badges */}
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "0.35rem", marginBottom: "1rem" }}>
                      <span style={{ background: "var(--bg-elevated)", color: "var(--text-muted)", borderRadius: 999, padding: "0.2rem 0.6rem", fontSize: "0.72rem", border: "1px solid var(--border)" }}>{t.category}</span>
                      <span style={{ background: "rgba(16,185,129,0.1)", color: "#10b981", border: "1px solid rgba(16,185,129,0.25)", borderRadius: 999, padding: "0.2rem 0.6rem", fontSize: "0.72rem", fontWeight: 600 }}>{momentumIcon[t.momentum]} {t.momentum}</span>
                      <span style={{ background: `${diff.color}18`, color: diff.color, border: `1px solid ${diff.color}33`, borderRadius: 999, padding: "0.2rem 0.6rem", fontSize: "0.72rem", fontWeight: 600 }}>{t.difficulty}</span>
                      <span style={{ background: "rgba(59,130,246,0.1)", color: "#60a5fa", border: "1px solid rgba(59,130,246,0.25)", borderRadius: 999, padding: "0.2rem 0.6rem", fontSize: "0.72rem" }}>⏱ {t.time_window}</span>
                    </div>

                    {/* Why trending */}
                    <div style={{ background: "var(--bg-elevated)", borderRadius: "var(--radius-sm)", padding: "0.75rem", marginBottom: "0.75rem" }}>
                      <p style={{ fontSize: "0.7rem", color: "var(--text-muted)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "0.3rem" }}>Why trending</p>
                      <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", margin: 0, lineHeight: 1.55 }}>{t.why_trending}</p>
                    </div>

                    {/* Opportunity */}
                    <div style={{ background: "rgba(16,185,129,0.07)", border: "1px solid rgba(16,185,129,0.2)", borderRadius: "var(--radius-sm)", padding: "0.75rem", marginBottom: "1rem" }}>
                      <p style={{ fontSize: "0.7rem", color: "#10b981", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "0.3rem" }}>💡 Opportunity</p>
                      <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", margin: 0, lineHeight: 1.55 }}>{t.opportunity}</p>
                    </div>

                    {/* Action buttons */}
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.6rem" }}>
                      <button onClick={() => goToStarter(t.topic)} style={{ background: "linear-gradient(135deg, var(--accent), var(--accent-light))", color: "white", border: "none", borderRadius: "var(--radius-sm)", padding: "0.6rem", fontWeight: 700, fontSize: "0.82rem", cursor: "pointer", transition: "all 0.15s", boxShadow: "0 2px 8px var(--accent-glow)" }}>
                        🚀 Build Starter Kit
                      </button>
                      <button onClick={() => goToValidate(t.topic)} style={{ background: "var(--bg-elevated)", color: "var(--text-primary)", border: "1px solid var(--border)", borderRadius: "var(--radius-sm)", padding: "0.6rem", fontWeight: 600, fontSize: "0.82rem", cursor: "pointer", transition: "all 0.15s" }}>
                        ✅ Validate Trend
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
