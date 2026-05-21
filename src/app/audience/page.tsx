"use client";
import { useRef, useState } from "react";
import { getSupabaseClient } from "@/lib/supabase/client-singleton";

const ACTIVITY: Record<string,string> = { High: "#10b981", Medium: "#f59e0b", Low: "#6b7280" };

export default function AudiencePage() {
  const supabase = useRef(getSupabaseClient()).current;
  const [topic, setTopic] = useState("");
  const [loading, setLoading] = useState(false);
  const [intel, setIntel] = useState<any>(null);
  const [error, setError] = useState("");

  async function analyze() {
    if (!topic.trim()) return;
    setLoading(true); setError(""); setIntel(null);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const res = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/autopilot`, {
        method: "POST", headers: { "Content-Type": "application/json", Authorization: `Bearer ${session?.access_token}` },
        body: JSON.stringify({ action: "audience_intel", topic }),
      });
      const data = await res.json();
      if (data.topic) setIntel(data);
      else setError(data.error || "Analysis failed");
    } catch (e) { setError(String(e)); }
    setLoading(false);
  }

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-base)" }}>
      <div style={{ borderBottom: "1px solid var(--border)", background: "var(--bg-surface)", padding: "1.75rem 2.5rem" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <h1 style={{ fontSize: "1.6rem", fontWeight: 800, color: "var(--text-primary)", margin: "0 0 0.25rem" }}>Audience Intelligence</h1>
          <p style={{ color: "var(--text-muted)", margin: 0, fontSize: "0.9rem" }}>Find exactly where your niche audience lives — which platforms, communities, and channels they use.</p>
        </div>
      </div>

      <div style={{ maxWidth: 900, margin: "0 auto", padding: "2rem 2.5rem" }}>
        <div style={{ display: "flex", gap: "0.75rem", marginBottom: "2rem" }}>
          <input value={topic} onChange={e => setTopic(e.target.value)} onKeyDown={e => e.key === "Enter" && analyze()} placeholder="Enter a niche (e.g. AI productivity tools, longevity supplements...)" style={{ flex: 1, background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "var(--radius-sm)", padding: "0.75rem 1rem", color: "var(--text-primary)", fontSize: "0.9rem", outline: "none" }} />
          <button onClick={analyze} disabled={loading || !topic.trim()} style={{ background: "var(--accent)", color: "white", border: "none", borderRadius: "var(--radius-sm)", padding: "0.75rem 1.5rem", fontWeight: 700, fontSize: "0.9rem", cursor: loading ? "not-allowed" : "pointer", opacity: loading ? 0.7 : 1, whiteSpace: "nowrap", display: "flex", alignItems: "center", gap: "0.5rem" }}>
            {loading ? <><div style={{ width: 14, height: 14, border: "2px solid rgba(255,255,255,0.3)", borderTopColor: "white", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} /> Analyzing...</> : "Analyze Audience"}
          </button>
        </div>

        {error && <div style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.25)", borderRadius: "var(--radius)", padding: "1rem", color: "#fca5a5", marginBottom: "1.5rem" }}>{error}</div>}

        {!intel && !loading && (
          <div style={{ textAlign: "center", padding: "4rem 2rem", background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "var(--radius-lg)" }}>
            <div style={{ fontSize: "2.5rem", marginBottom: "1rem" }}>🎯</div>
            <h3 style={{ color: "var(--text-primary)", fontWeight: 700, marginBottom: "0.4rem" }}>Know your audience</h3>
            <p style={{ color: "var(--text-muted)", fontSize: "0.875rem" }}>Enter any niche to find where the audience hangs out, what they read, watch, and listen to.</p>
          </div>
        )}

        {intel && (
          <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "0.75rem" }}>
              {[{label:"Audience Size",value:intel.audience_size,color:"#8b5cf6"},{label:"Age Range",value:intel.demographics?.age_range,color:"#6366f1"},{label:"Income",value:intel.demographics?.income,color:"#10b981"},{label:"Gender",value:intel.demographics?.gender_split,color:"#f59e0b"}].map((s,i) => (
                <div key={i} style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "var(--radius)", padding: "1rem", position: "relative", overflow: "hidden" }}>
                  <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: s.color }} />
                  <p style={{ fontSize: "0.68rem", color: "var(--text-muted)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.07em", margin: "0 0 0.4rem" }}>{s.label}</p>
                  <p style={{ fontSize: "0.9rem", fontWeight: 700, color: "var(--text-primary)", margin: 0 }}>{s.value}</p>
                </div>
              ))}
            </div>

            <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "var(--radius-lg)", padding: "1.25rem" }}>
              <h3 style={{ fontSize: "0.8rem", fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: "1rem" }}>Where they hang out</h3>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                {(intel.platforms || []).map((plat: any, i: number) => (
                  <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: "1rem", padding: "0.85rem 1rem", background: "var(--bg-elevated)", borderRadius: 8 }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginBottom: "0.35rem" }}>
                        <span style={{ fontWeight: 700, color: "var(--text-primary)", fontSize: "0.9rem" }}>{plat.name}</span>
                        <span style={{ fontSize: "0.7rem", color: ACTIVITY[plat.activity]||"#6b7280", fontWeight: 600 }}>{plat.activity} activity</span>
                      </div>
                      {plat.communities && <p style={{ margin: "0 0 0.25rem", fontSize: "0.8rem", color: "var(--text-secondary)" }}>Communities: {plat.communities.join(", ")}</p>}
                      {plat.channels && <p style={{ margin: "0 0 0.25rem", fontSize: "0.8rem", color: "var(--text-secondary)" }}>Channels: {plat.channels.join(", ")}</p>}
                      {plat.hashtags && <p style={{ margin: "0 0 0.25rem", fontSize: "0.8rem", color: "var(--text-secondary)" }}>Hashtags: {plat.hashtags.join(", ")}</p>}
                      <p style={{ margin: 0, fontSize: "0.75rem", color: "var(--text-muted)" }}>Best for: {plat.best_for}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
              <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "var(--radius)", padding: "1.1rem" }}>
                <h3 style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.07em", margin: "0 0 0.75rem" }}>Pain Points</h3>
                <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "0.4rem" }}>
                  {(intel.pain_points||[]).map((p:string,i:number) => <li key={i} style={{ fontSize: "0.85rem", color: "var(--text-secondary)", display: "flex", alignItems: "flex-start", gap: "0.5rem" }}><span style={{ color: "#ef4444", flexShrink: 0 }}>•</span>{p}</li>)}
                </ul>
              </div>
              <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "var(--radius)", padding: "1.1rem" }}>
                <h3 style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.07em", margin: "0 0 0.75rem" }}>Buying Triggers</h3>
                <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "0.4rem" }}>
                  {(intel.buying_triggers||[]).map((p:string,i:number) => <li key={i} style={{ fontSize: "0.85rem", color: "var(--text-secondary)", display: "flex", alignItems: "flex-start", gap: "0.5rem" }}><span style={{ color: "#10b981", flexShrink: 0 }}>•</span>{p}</li>)}
                </ul>
              </div>
              <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "var(--radius)", padding: "1.1rem" }}>
                <h3 style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.07em", margin: "0 0 0.75rem" }}>Best Channels to Reach Them</h3>
                <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "0.4rem" }}>
                  {(intel.best_channels_to_reach||[]).map((p:string,i:number) => <li key={i} style={{ fontSize: "0.85rem", color: "var(--text-secondary)", display: "flex", alignItems: "flex-start", gap: "0.5rem" }}><span style={{ color: "#6366f1", flexShrink: 0 }}>•</span>{p}</li>)}
                </ul>
              </div>
              <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "var(--radius)", padding: "1.1rem" }}>
                <h3 style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.07em", margin: "0 0 0.75rem" }}>Influencer Types</h3>
                <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "0.4rem" }}>
                  {(intel.influencer_types||[]).map((p:string,i:number) => <li key={i} style={{ fontSize: "0.85rem", color: "var(--text-secondary)", display: "flex", alignItems: "flex-start", gap: "0.5rem" }}><span style={{ color: "#f59e0b", flexShrink: 0 }}>•</span>{p}</li>)}
                </ul>
              </div>
            </div>

            <div style={{ display: "flex", gap: "0.75rem" }}>
              <button onClick={() => window.location.href=`/dashboard/starter?keyword=${encodeURIComponent(topic)}`} style={{ background: "var(--accent)", color: "white", border: "none", borderRadius: "var(--radius-sm)", padding: "0.65rem 1.5rem", fontWeight: 700, fontSize: "0.9rem", cursor: "pointer" }}>Build Starter Kit</button>
              <button onClick={() => window.location.href=`/trending`} style={{ background: "transparent", color: "var(--text-secondary)", border: "1px solid var(--border)", borderRadius: "var(--radius-sm)", padding: "0.65rem 1.5rem", fontWeight: 600, fontSize: "0.9rem", cursor: "pointer" }}>Trending Now</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
