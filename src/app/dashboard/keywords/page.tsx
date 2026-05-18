
"use client";
import { useRef, useState } from "react";
import { getSupabaseClient } from "@/lib/supabase/client-singleton";

interface KWItem { kw: string; vol: string; diff: string; trend: string; }
interface Cluster { cluster: string; intent: string; keywords: KWItem[]; content_angles: string[]; best_keyword: string; }

const intentColors: Record<string, string> = {
  informational: "#3b82f6",
  commercial: "#f59e0b",
  transactional: "#10b981",
  navigational: "#8b5cf6",
};

export default function KeywordsPage() {
  const supabase = useRef(getSupabaseClient()).current;
  const [seed, setSeed] = useState("");
  const [loading, setLoading] = useState(false);
  const [clusters, setClusters] = useState<Cluster[]>([]);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState<string | null>(null);

  async function generate() {
    if (!seed.trim()) return;
    setLoading(true);
    setError("");
    setClusters([]);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/keyword-clusters`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${session?.access_token}` },
          body: JSON.stringify({ seed }),
        }
      );
      const data = await res.json();
      if (data.clusters) setClusters(data.clusters);
      else setError(data.error || "Failed to generate clusters");
    } catch (e) { setError(String(e)); }
    setLoading(false);
  }

  function copy(text: string, key: string) {
    navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(null), 2000);
  }

  return (
    <div style={{ padding: "2rem", maxWidth: 1000, margin: "0 auto" }}>
      <div style={{ marginBottom: "2rem" }}>
        <h1 style={{ fontSize: "1.8rem", fontWeight: 700, color: "var(--text-primary)", marginBottom: "0.5rem" }}>
          🔑 Keyword Clusters
        </h1>
        <p style={{ color: "var(--text-muted)" }}>
          Enter a seed keyword — get AI-grouped clusters with volume, difficulty, and content angles.
        </p>
      </div>

      <div style={{ display: "flex", gap: "0.75rem", marginBottom: "2rem" }}>
        <input
          value={seed}
          onChange={e => setSeed(e.target.value)}
          onKeyDown={e => e.key === "Enter" && generate()}
          placeholder="e.g. AI tools for solopreneurs"
          style={{ flex: 1, padding: "0.75rem 1rem" }}
        />
        <button
          onClick={generate}
          disabled={loading || !seed.trim()}
          style={{
            background: "var(--accent)", color: "white", border: "none",
            borderRadius: "var(--radius-sm)", padding: "0 1.5rem",
            fontWeight: 700, fontSize: "0.95rem", opacity: loading ? 0.6 : 1,
          }}
        >
          {loading ? "⏳ Clustering..." : "🔍 Generate Clusters"}
        </button>
        {clusters.length > 0 && (
          <button
            onClick={() => copy(clusters.flatMap(c => c.keywords.map(k => k.kw)).join("\n"), "all")}
            style={{
              background: "var(--bg-elevated)", color: "var(--text-primary)",
              border: "1px solid var(--border)", borderRadius: "var(--radius-sm)",
              padding: "0 1rem", fontWeight: 600, fontSize: "0.85rem",
            }}
          >
            {copied === "all" ? "✅ Copied!" : "📋 Copy All"}
          </button>
        )}
      </div>

      {error && (
        <div style={{
          background: "#7f1d1d22", border: "1px solid #ef444444",
          borderRadius: "var(--radius-sm)", padding: "1rem",
          color: "var(--danger)", marginBottom: "1rem",
        }}>
          {error}
        </div>
      )}

      {loading && (
        <div style={{ textAlign: "center", padding: "3rem" }}>
          <div style={{
            width: 40, height: 40, border: "3px solid var(--border)",
            borderTopColor: "var(--accent)", borderRadius: "50%",
            animation: "spin 1s linear infinite", margin: "0 auto 1rem",
          }} />
          <p style={{ color: "var(--text-muted)" }}>Analyzing search landscape...</p>
        </div>
      )}

      {clusters.length > 0 && (
        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          {clusters.map((cluster, i) => (
            <div
              key={i}
              style={{
                background: "var(--bg-card)", border: "1px solid var(--border)",
                borderRadius: "var(--radius)", overflow: "hidden", animation: "fadeIn 0.3s ease",
              }}
            >
              <div style={{
                padding: "1rem 1.25rem", borderBottom: "1px solid var(--border)",
                display: "flex", justifyContent: "space-between", alignItems: "center",
              }}>
                <div>
                  <h3 style={{ fontSize: "1rem", fontWeight: 700, color: "var(--text-primary)", marginBottom: "0.3rem" }}>
                    {cluster.cluster}
                  </h3>
                  <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
                    <span style={{
                      background: (intentColors[cluster.intent] || "#6366f1") + "22",
                      color: intentColors[cluster.intent] || "#6366f1",
                      border: `1px solid ${intentColors[cluster.intent] || "#6366f1"}44`,
                      borderRadius: 999, padding: "0.15rem 0.6rem",
                      fontSize: "0.7rem", fontWeight: 700, textTransform: "uppercase",
                    }}>
                      {cluster.intent}
                    </span>
                    <span style={{ color: "var(--text-muted)", fontSize: "0.8rem" }}>
                      Best: <strong style={{ color: "var(--accent-light)" }}>{cluster.best_keyword}</strong>
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => copy(cluster.keywords.map(k => k.kw).join("\n"), cluster.cluster)}
                  style={{
                    background: "var(--bg-elevated)", color: "var(--text-muted)",
                    border: "1px solid var(--border)", borderRadius: "var(--radius-sm)",
                    padding: "0.4rem 0.75rem", fontSize: "0.8rem", fontWeight: 600,
                  }}
                >
                  {copied === cluster.cluster ? "✅" : "📋"}
                </button>
              </div>
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.875rem" }}>
                  <thead>
                    <tr style={{ background: "var(--bg-elevated)" }}>
                      {["Keyword", "Volume", "Difficulty", "Trend"].map(h => (
                        <th key={h} style={{
                          padding: "0.6rem 1rem", textAlign: "left",
                          color: "var(--text-muted)", fontWeight: 600,
                          fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.05em",
                        }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {cluster.keywords.map((kw, j) => (
                      <tr key={j} style={{ borderTop: "1px solid var(--border)" }}>
                        <td style={{ padding: "0.7rem 1rem", color: "var(--text-primary)", fontWeight: 500 }}>{kw.kw}</td>
                        <td style={{ padding: "0.7rem 1rem", color: "var(--success)" }}>{kw.vol}</td>
                        <td style={{
                          padding: "0.7rem 1rem",
                          color: Number(kw.diff) > 60 ? "var(--danger)" : Number(kw.diff) > 35 ? "var(--warning)" : "var(--success)",
                        }}>{kw.diff}/100</td>
                        <td style={{ padding: "0.7rem 1rem", color: "var(--text-secondary)" }}>{kw.trend}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {cluster.content_angles.length > 0 && (
                <div style={{
                  padding: "0.75rem 1.25rem", borderTop: "1px solid var(--border)",
                  background: "var(--bg-elevated)",
                }}>
                  <p style={{ fontSize: "0.72rem", color: "var(--text-muted)", marginBottom: "0.5rem", textTransform: "uppercase", fontWeight: 600, letterSpacing: "0.05em" }}>
                    Content Angles
                  </p>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem" }}>
                    {cluster.content_angles.map((a, k) => (
                      <span key={k} style={{
                        background: "var(--bg-card)", border: "1px solid var(--border)",
                        borderRadius: 999, padding: "0.2rem 0.65rem",
                        fontSize: "0.78rem", color: "var(--text-secondary)",
                      }}>
                        {a}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
