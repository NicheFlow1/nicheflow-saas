
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

const signalColors: Record<string, string> = {
  GO: "#10b981", WATCH: "#f59e0b", WAIT: "#6b7280",
};
const momentumColors: Record<string, string> = {
  Rising: "#10b981", Stable: "#6366f1", Declining: "#ef4444",
};
const difficultyColors: Record<string, string> = {
  Easy: "#10b981", Medium: "#f59e0b", Hard: "#ef4444",
};

interface TrendTopic {
  topic: string;
  category: string;
  score: number;
  signal: string;
  momentum: string;
  why_trending: string;
  opportunity: string;
  time_window: string;
  difficulty: string;
}

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
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/autopilot`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session?.access_token}`,
          },
          body: JSON.stringify({ action: "trending", category }),
        }
      );
      const data = await res.json();
      if (data.topics) {
        setTopics(data.topics);
        setLastScanned(new Date().toLocaleTimeString());
      } else {
        setError(data.error || "Failed to load trending topics");
      }
    } catch (e) {
      setError(String(e));
    }
    setLoading(false);
  }

  return (
    <div style={{ padding: "2rem", maxWidth: 1000, margin: "0 auto" }}>
      {/* Header */}
      <div style={{ marginBottom: "2rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.5rem" }}>
          <span style={{ fontSize: "1.5rem" }}>🔥</span>
          <h1 style={{ fontSize: "1.8rem", fontWeight: 700, color: "var(--text-primary)" }}>
            Trending Now
          </h1>
          <span style={{
            background: "#ef444422", color: "#ef4444",
            border: "1px solid #ef444444", borderRadius: 999,
            padding: "0.15rem 0.6rem", fontSize: "0.7rem", fontWeight: 700,
          }}>
            LIVE
          </span>
        </div>
        <p style={{ color: "var(--text-muted)" }}>
          Discover what is trending RIGHT NOW — before it goes mainstream. Powered by real data signals.
        </p>
      </div>

      {/* Category Filter */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", marginBottom: "1.5rem" }}>
        {CATEGORIES.map(cat => (
          <button
            key={cat.id}
            onClick={() => setCategory(cat.id)}
            style={{
              background: category === cat.id ? "var(--accent)" : "var(--bg-card)",
              color: category === cat.id ? "white" : "var(--text-secondary)",
              border: `1px solid ${category === cat.id ? "var(--accent)" : "var(--border)"}`,
              borderRadius: 999, padding: "0.35rem 0.9rem",
              fontWeight: category === cat.id ? 700 : 500,
              fontSize: "0.85rem", cursor: "pointer", transition: "all 0.15s",
            }}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Scan Button */}
      <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "2rem" }}>
        <button
          onClick={scan}
          disabled={loading}
          style={{
            background: loading ? "var(--bg-elevated)" : "var(--accent)",
            color: loading ? "var(--text-muted)" : "white",
            border: "none", borderRadius: "var(--radius)",
            padding: "0.75rem 1.75rem", fontWeight: 700, fontSize: "1rem",
            display: "flex", alignItems: "center", gap: "0.5rem",
            boxShadow: loading ? "none" : "0 4px 15px var(--accent-glow)",
            transition: "all 0.2s",
          }}
        >
          {loading ? (
            <>
              <div style={{ width: 16, height: 16, border: "2px solid var(--text-muted)", borderTopColor: "var(--accent)", borderRadius: "50%", animation: "spin 1s linear infinite" }} />
              Scanning markets...
            </>
          ) : (
            <>🔄 Scan Trending Topics</>
          )}
        </button>
        {lastScanned && (
          <span style={{ color: "var(--text-muted)", fontSize: "0.8rem" }}>
            Last scanned: {lastScanned}
          </span>
        )}
      </div>

      {/* Error */}
      {error && (
        <div style={{
          background: "#7f1d1d22", border: "1px solid #ef444444",
          borderRadius: "var(--radius-sm)", padding: "1rem",
          color: "var(--danger)", marginBottom: "1.5rem",
        }}>
          {error}
        </div>
      )}

      {/* Empty state */}
      {topics.length === 0 && !loading && !error && (
        <div style={{
          textAlign: "center", padding: "4rem 2rem",
          background: "var(--bg-card)", border: "1px solid var(--border)",
          borderRadius: "var(--radius)",
        }}>
          <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>🔥</div>
          <p style={{ color: "var(--text-muted)", marginBottom: "0.5rem", fontWeight: 500 }}>
            No trends loaded yet.
          </p>
          <p style={{ color: "var(--text-muted)", fontSize: "0.875rem" }}>
            Click &quot;Scan Trending Topics&quot; to discover what is blowing up right now.
          </p>
        </div>
      )}

      {/* Topics Grid */}
      {topics.length > 0 && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(440px, 1fr))", gap: "1rem" }}>
          {topics.map((t, i) => (
            <div
              key={i}
              style={{
                background: "var(--bg-card)", border: "1px solid var(--border)",
                borderRadius: "var(--radius)", padding: "1.25rem",
                animation: "fadeIn 0.3s ease", transition: "border-color 0.2s",
              }}
              onMouseEnter={e => (e.currentTarget.style.borderColor = "var(--border-accent)")}
              onMouseLeave={e => (e.currentTarget.style.borderColor = "var(--border)")}
            >
              {/* Top row */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.75rem" }}>
                <h3 style={{ fontSize: "1rem", fontWeight: 700, color: "var(--text-primary)", flex: 1, marginRight: "0.5rem" }}>
                  {t.topic}
                </h3>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "0.3rem" }}>
                  <span style={{
                    background: signalColors[t.signal] + "22",
                    color: signalColors[t.signal],
                    border: `1px solid ${signalColors[t.signal]}44`,
                    borderRadius: 999, padding: "0.15rem 0.6rem",
                    fontSize: "0.72rem", fontWeight: 700,
                  }}>
                    {t.signal}
                  </span>
                  <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--accent-light)" }}>
                    {t.score}/100
                  </span>
                </div>
              </div>

              {/* Score bar */}
              <div style={{ height: 4, background: "var(--bg-elevated)", borderRadius: 999, overflow: "hidden", marginBottom: "0.75rem" }}>
                <div style={{
                  height: "100%", width: `${t.score}%`,
                  background: `linear-gradient(90deg, ${signalColors[t.signal] || "var(--accent)"}, var(--accent-light))`,
                  borderRadius: 999, transition: "width 0.8s ease",
                }} />
              </div>

              {/* Badges row */}
              <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem", marginBottom: "0.75rem" }}>
                <span style={{ background: "var(--bg-elevated)", color: "var(--text-muted)", borderRadius: 999, padding: "0.15rem 0.55rem", fontSize: "0.7rem", border: "1px solid var(--border)" }}>
                  {t.category}
                </span>
                <span style={{
                  background: momentumColors[t.momentum] + "22",
                  color: momentumColors[t.momentum],
                  border: `1px solid ${momentumColors[t.momentum]}44`,
                  borderRadius: 999, padding: "0.15rem 0.55rem", fontSize: "0.7rem", fontWeight: 600,
                }}>
                  {t.momentum === "Rising" ? "📈" : t.momentum === "Declining" ? "📉" : "➡️"} {t.momentum}
                </span>
                <span style={{
                  background: difficultyColors[t.difficulty] + "22",
                  color: difficultyColors[t.difficulty],
                  border: `1px solid ${difficultyColors[t.difficulty]}44`,
                  borderRadius: 999, padding: "0.15rem 0.55rem", fontSize: "0.7rem", fontWeight: 600,
                }}>
                  {t.difficulty}
                </span>
                <span style={{ background: "var(--bg-elevated)", color: "var(--info)", borderRadius: 999, padding: "0.15rem 0.55rem", fontSize: "0.7rem", border: "1px solid var(--border)" }}>
                  ⏱ {t.time_window}
                </span>
              </div>

              {/* Why trending */}
              <p style={{ fontSize: "0.82rem", color: "var(--text-secondary)", marginBottom: "0.5rem", lineHeight: 1.5 }}>
                <strong style={{ color: "var(--text-muted)", fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "0.04em" }}>Why trending: </strong>
                {t.why_trending}
              </p>

              {/* Opportunity */}
              <p style={{ fontSize: "0.82rem", color: "var(--success)", lineHeight: 1.5, marginBottom: "0.75rem" }}>
                <strong style={{ color: "var(--text-muted)", fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "0.04em" }}>Opportunity: </strong>
                {t.opportunity}
              </p>

              {/* Action buttons */}
              <div style={{ display: "flex", gap: "0.5rem" }}>
                <button
                  onClick={() => window.location.href = `/dashboard/starter?keyword=${encodeURIComponent(t.topic)}`}
                  style={{
                    flex: 1, background: "var(--accent)", color: "white", border: "none",
                    borderRadius: "var(--radius-sm)", padding: "0.5rem", fontWeight: 600,
                    fontSize: "0.8rem", cursor: "pointer",
                  }}
                >
                  🚀 Build Kit
                </button>
                <button
                  onClick={() => window.location.href = `/dashboard/validate?q=${encodeURIComponent(t.topic)}`}
                  style={{
                    flex: 1, background: "var(--bg-elevated)", color: "var(--text-secondary)",
                    border: "1px solid var(--border)", borderRadius: "var(--radius-sm)",
                    padding: "0.5rem", fontWeight: 600, fontSize: "0.8rem", cursor: "pointer",
                  }}
                >
                  ✅ Validate
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
