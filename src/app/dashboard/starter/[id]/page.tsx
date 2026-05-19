
"use client";
import { useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";
import { getSupabaseClient } from "@/lib/supabase/client-singleton";

export default function KitDetailPage() {
  const params = useParams();
  const id = params?.id as string;
  const supabase = useRef(getSupabaseClient()).current;
  const [kit, setKit] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    supabase.from("starter_kits").select("*").eq("id", id).single().then(({ data }) => {
      setKit(data);
      setLoading(false);
    });
  }, [id]);

  function copy(text: string, key: string) {
    navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(null), 2000);
  }

  if (loading) return (
    <div style={{ padding: "3rem", textAlign: "center" }}>
      <div style={{ width: 40, height: 40, border: "3px solid var(--border)", borderTopColor: "var(--accent)", borderRadius: "50%", animation: "spin 1s linear infinite", margin: "0 auto 1rem" }} />
      <p style={{ color: "var(--text-muted)" }}>Loading your starter kit...</p>
    </div>
  );

  if (!kit) return (
    <div style={{ padding: "3rem", textAlign: "center" }}>
      <p style={{ color: "var(--text-muted)" }}>Kit not found.</p>
      <button onClick={() => window.location.href = "/dashboard/starter"} style={{ marginTop: "1rem", background: "var(--accent)", color: "white", border: "none", borderRadius: "var(--radius-sm)", padding: "0.6rem 1.2rem", fontWeight: 700, cursor: "pointer" }}>
        Build a New Kit
      </button>
    </div>
  );

  const d = kit.data || {};
  const signal = kit.signal || "WATCH";
  const signalColors: Record<string, string> = { GO: "#10b981", WATCH: "#f59e0b", NO_GO: "#ef4444", WAIT: "#6b7280" };
  const sc = signalColors[signal] || "#f59e0b";

  return (
    <div style={{ padding: "2rem", maxWidth: 900, margin: "0 auto" }}>
      {/* Header */}
      <div style={{ marginBottom: "2rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.75rem" }}>
          <button onClick={() => window.location.href = "/dashboard/starter"} style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "var(--radius-sm)", padding: "0.4rem 0.8rem", color: "var(--text-muted)", fontSize: "0.8rem", cursor: "pointer" }}>
            ← Back
          </button>
          <span style={{ background: sc + "22", color: sc, border: `1px solid ${sc}44`, borderRadius: 999, padding: "0.2rem 0.75rem", fontSize: "0.8rem", fontWeight: 700 }}>
            {signal}
          </span>
          <span style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>Score: <strong style={{ color: "var(--accent-light)" }}>{kit.overall_score}/100</strong></span>
        </div>
        <h1 style={{ fontSize: "1.8rem", fontWeight: 800, color: "var(--text-primary)", marginBottom: "0.4rem" }}>
          🚀 {kit.keyword}
        </h1>
        <p style={{ color: "var(--text-secondary)", fontSize: "1rem", fontStyle: "italic" }}>{kit.one_liner || d.one_liner}</p>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
        {/* Market Overview */}
        <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "var(--radius)", padding: "1.5rem" }}>
          <h2 style={{ fontSize: "1rem", fontWeight: 700, color: "var(--text-primary)", marginBottom: "1rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
            🎯 Market Overview
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "1rem" }}>
            {[
              { label: "Target Customer", value: kit.target_customer || d.target_customer },
              { label: "Core Pain Point", value: kit.problem_statement || d.pain_point },
              { label: "Revenue Month 1", value: d.revenue_month1 || kit.revenue_30d_estimate },
              { label: "Revenue Month 3", value: d.revenue_month3 },
            ].map((item, i) => item.value && (
              <div key={i} style={{ background: "var(--bg-elevated)", borderRadius: "var(--radius-sm)", padding: "0.75rem" }}>
                <p style={{ fontSize: "0.7rem", color: "var(--text-muted)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "0.3rem" }}>{item.label}</p>
                <p style={{ fontSize: "0.9rem", color: "var(--text-primary)", fontWeight: 500 }}>{item.value}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Product Ideas */}
        {(kit.product_ideas || d.product_ideas)?.length > 0 && (
          <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "var(--radius)", padding: "1.5rem" }}>
            <h2 style={{ fontSize: "1rem", fontWeight: 700, color: "var(--text-primary)", marginBottom: "1rem" }}>💡 Product Ideas</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              {(kit.product_ideas || d.product_ideas).map((p: any, i: number) => (
                <div key={i} style={{ background: "var(--bg-elevated)", borderRadius: "var(--radius-sm)", padding: "1rem", display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "1rem" }}>
                  <div>
                    <p style={{ fontWeight: 700, color: "var(--text-primary)", marginBottom: "0.25rem" }}>{p.name}</p>
                    <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>{p.description}</p>
                  </div>
                  <div style={{ textAlign: "right", flexShrink: 0 }}>
                    <p style={{ fontWeight: 700, color: "var(--accent-light)", whiteSpace: "nowrap" }}>{p.price}</p>
                    <p style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>{p.build_time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Landing Page Copy */}
        <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "var(--radius)", padding: "1.5rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
            <h2 style={{ fontSize: "1rem", fontWeight: 700, color: "var(--text-primary)" }}>📄 Landing Page Copy</h2>
            <button onClick={() => copy(`${kit.headline || d.landing_page_headline}\n\n${kit.subheadline || d.landing_page_subtext}\n\nCTA: ${kit.cta_text || d.cta_text}`, "lp")} style={{ background: "var(--bg-elevated)", border: "1px solid var(--border)", borderRadius: "var(--radius-sm)", padding: "0.35rem 0.75rem", color: "var(--text-muted)", fontSize: "0.8rem", cursor: "pointer" }}>
              {copied === "lp" ? "✅ Copied!" : "📋 Copy"}
            </button>
          </div>
          <div style={{ background: "linear-gradient(135deg, var(--bg-elevated), var(--bg-card))", border: "1px solid var(--border-accent)", borderRadius: "var(--radius-sm)", padding: "1.25rem" }}>
            <p style={{ fontSize: "1.3rem", fontWeight: 800, color: "var(--text-primary)", marginBottom: "0.5rem", lineHeight: 1.3 }}>{kit.headline || d.landing_page_headline}</p>
            <p style={{ fontSize: "0.95rem", color: "var(--text-secondary)", marginBottom: "1rem", lineHeight: 1.6 }}>{kit.subheadline || d.landing_page_subtext}</p>
            <span style={{ background: "var(--accent)", color: "white", borderRadius: "var(--radius-sm)", padding: "0.5rem 1.25rem", fontWeight: 700, fontSize: "0.9rem" }}>{kit.cta_text || d.cta_text}</span>
          </div>
        </div>

        {/* Week 1 Action Plan */}
        {(kit.week1_actions || d.week1_actions)?.length > 0 && (
          <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "var(--radius)", padding: "1.5rem" }}>
            <h2 style={{ fontSize: "1rem", fontWeight: 700, color: "var(--text-primary)", marginBottom: "1rem" }}>📅 Week 1 Action Plan</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              {(kit.week1_actions || d.week1_actions).map((action: string, i: number) => (
                <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: "0.75rem", background: "var(--bg-elevated)", borderRadius: "var(--radius-sm)", padding: "0.75rem" }}>
                  <span style={{ background: "var(--accent)", color: "white", borderRadius: "50%", width: 22, height: 22, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.75rem", fontWeight: 700, flexShrink: 0 }}>{i + 1}</span>
                  <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem", margin: 0 }}>{action}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Content Hooks + Reddit */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.25rem" }}>
          {(kit.content_hooks || d.content_hooks)?.length > 0 && (
            <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "var(--radius)", padding: "1.5rem" }}>
              <h2 style={{ fontSize: "1rem", fontWeight: 700, color: "var(--text-primary)", marginBottom: "1rem" }}>🎣 Content Hooks</h2>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                {(kit.content_hooks || d.content_hooks).map((h: string, i: number) => (
                  <div key={i} style={{ background: "var(--bg-elevated)", borderRadius: "var(--radius-sm)", padding: "0.6rem 0.75rem", fontSize: "0.85rem", color: "var(--text-secondary)", borderLeft: "3px solid var(--accent)" }}>
                    {h}
                  </div>
                ))}
              </div>
            </div>
          )}
          {(kit.reddit_communities || d.reddit_communities)?.length > 0 && (
            <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "var(--radius)", padding: "1.5rem" }}>
              <h2 style={{ fontSize: "1rem", fontWeight: 700, color: "var(--text-primary)", marginBottom: "1rem" }}>🔴 Reddit Communities</h2>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
                {(kit.reddit_communities || d.reddit_communities).map((r: string, i: number) => (
                  <span key={i} style={{ background: "rgba(255,69,0,0.12)", color: "#ff6b35", border: "1px solid rgba(255,69,0,0.25)", borderRadius: 999, padding: "0.3rem 0.7rem", fontSize: "0.82rem", fontWeight: 600 }}>
                    {r.startsWith("r/") ? r : `r/${r}`}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Build Another */}
        <div style={{ textAlign: "center", paddingTop: "1rem" }}>
          <button onClick={() => window.location.href = "/dashboard/starter"} style={{ background: "linear-gradient(135deg, var(--accent), var(--accent-light))", color: "white", border: "none", borderRadius: "var(--radius)", padding: "0.75rem 2rem", fontWeight: 700, fontSize: "1rem", cursor: "pointer", boxShadow: "0 4px 20px var(--accent-glow)" }}>
            🚀 Build Another Kit
          </button>
        </div>
      </div>
    </div>
  );
}
