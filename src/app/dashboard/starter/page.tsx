
"use client";
import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { getSupabaseClient } from "@/lib/supabase/client-singleton";
import { Suspense } from "react";

function StarterKitContent() {
  const supabase = useRef(getSupabaseClient()).current;
  const searchParams = useSearchParams();
  const prefill = searchParams.get("keyword") || "";

  const [keyword, setKeyword] = useState(prefill);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState("");
  const [dots, setDots] = useState(".");

  useEffect(() => { if (prefill) setKeyword(prefill); }, [prefill]);

  async function buildKit() {
    if (!keyword.trim()) return;
    setLoading(true);
    setError("");
    setResult(null);
    let d = 1;
    const iv = setInterval(() => setDots(".".repeat((d++ % 3) + 1)), 500);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/autopilot`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${session?.access_token}` },
          body: JSON.stringify({ action: "generate_starter_kit", keyword }),
          signal: AbortSignal.timeout(100000),
        }
      );
      clearInterval(iv);
      const data = await res.json();
      if (data.error) setError(data.error);
      else { setResult(data); if (data.id) setTimeout(() => window.location.href = `/dashboard/starter/${data.id}`, 1500); }
    } catch (e) { clearInterval(iv); setError(String(e)); }
    setLoading(false);
  }

  return (
    <div style={{ padding: "2rem", maxWidth: 800, margin: "0 auto" }}>
      <div style={{ marginBottom: "2rem" }}>
        <h1 style={{ fontSize: "1.8rem", fontWeight: 800, color: "var(--text-primary)", marginBottom: "0.4rem" }}>🚀 Starter Kit Builder</h1>
        <p style={{ color: "var(--text-muted)", fontSize: "0.95rem" }}>Enter a niche keyword — get a complete business starter kit with product ideas, landing page copy, and week 1 actions.</p>
      </div>

      <div style={{ display: "flex", gap: "0.75rem", marginBottom: "2rem" }}>
        <input
          value={keyword}
          onChange={e => setKeyword(e.target.value)}
          onKeyDown={e => e.key === "Enter" && buildKit()}
          placeholder="e.g. AI agents, longevity supplements, micro SaaS..."
          style={{ flex: 1, padding: "0.8rem 1rem", fontSize: "1rem", borderRadius: "var(--radius-sm)", background: "var(--bg-card)", border: "1px solid var(--border)", color: "var(--text-primary)" }}
        />
        <button
          onClick={buildKit}
          disabled={loading || !keyword.trim()}
          style={{ background: loading ? "var(--bg-elevated)" : "linear-gradient(135deg, var(--accent), var(--accent-light))", color: "white", border: "none", borderRadius: "var(--radius-sm)", padding: "0 1.5rem", fontWeight: 700, fontSize: "0.95rem", whiteSpace: "nowrap", opacity: loading ? 0.7 : 1, cursor: loading ? "not-allowed" : "pointer", boxShadow: loading ? "none" : "0 4px 15px var(--accent-glow)", display: "flex", alignItems: "center", gap: "0.5rem" }}
        >
          {loading ? (
            <><div style={{ width: 16, height: 16, border: "2px solid rgba(255,255,255,0.3)", borderTopColor: "white", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />Building{dots}</>
          ) : "Build Complete Starter Kit"}
        </button>
      </div>

      {error && (
        <div style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)", borderRadius: "var(--radius)", padding: "1rem 1.25rem", color: "#fca5a5", marginBottom: "1.5rem", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span>⚠️ {error}</span>
          <button onClick={buildKit} style={{ background: "var(--accent)", color: "white", border: "none", borderRadius: "var(--radius-sm)", padding: "0.4rem 0.9rem", fontWeight: 600, fontSize: "0.8rem", cursor: "pointer" }}>Retry</button>
        </div>
      )}

      {result && (
        <div style={{ background: "rgba(16,185,129,0.08)", border: "1px solid rgba(16,185,129,0.3)", borderRadius: "var(--radius)", padding: "1.25rem", marginBottom: "1.5rem", display: "flex", alignItems: "center", gap: "0.75rem" }}>
          <span style={{ fontSize: "1.5rem" }}>✅</span>
          <div>
            <p style={{ color: "#10b981", fontWeight: 700, margin: 0 }}>Starter kit built successfully!</p>
            <p style={{ color: "var(--text-muted)", fontSize: "0.85rem", margin: 0 }}>Redirecting to your kit{dots}</p>
          </div>
        </div>
      )}

      {!loading && !result && !error && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1rem", marginTop: "1rem" }}>
          {["AI productivity tools", "longevity supplements", "micro SaaS for creators", "pet wellness products", "sustainable fashion", "newsletter monetization"].map(ex => (
            <button key={ex} onClick={() => { setKeyword(ex); }} style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "var(--radius-sm)", padding: "0.6rem 0.75rem", color: "var(--text-muted)", fontSize: "0.8rem", cursor: "pointer", textAlign: "left", transition: "all 0.15s" }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = "var(--accent)"; e.currentTarget.style.color = "var(--accent-light)"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.color = "var(--text-muted)"; }}>
              {ex}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default function StarterPage() {
  return (
    <Suspense fallback={<div style={{ padding: "2rem", color: "var(--text-muted)" }}>Loading...</div>}>
      <StarterKitContent />
    </Suspense>
  );
}
