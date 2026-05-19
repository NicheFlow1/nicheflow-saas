
"use client";
import { useEffect, useRef, useState } from "react";
import { getSupabaseClient } from "@/lib/supabase/client-singleton";

export default function DashboardPage() {
  const supabase = useRef(getSupabaseClient()).current;
  const [profile, setProfile] = useState<any>(null);
  const [stats, setStats] = useState({ generations: 0, reports: 0, kits: 0, plan: "free" });

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (!session) return;
      const uid = session.user.id;
      const [{ data: prof }, { count: rCount }, { count: kCount }] = await Promise.all([
        supabase.from("profiles").select("display_name,credits,plan").eq("id", uid).single(),
        supabase.from("market_reports").select("*", { count: "exact", head: true }).eq("user_id", uid),
        supabase.from("starter_kits").select("*", { count: "exact", head: true }).eq("user_id", uid),
      ]);
      if (prof) {
        setProfile(prof);
        setStats({ generations: prof.credits ?? 0, reports: rCount ?? 0, kits: kCount ?? 0, plan: prof.plan ?? "free" });
      }
    });
  }, []);

  const name = profile?.display_name || "there";
  const maxCredits = stats.plan === "pro" ? 200 : stats.plan === "agency" ? 1000 : 10;

  const STAT_CARDS = [
    { icon: "⚡", label: "Generations", value: `${stats.generations}/${maxCredits}`, color: "#7c3aed" },
    { icon: "📈", label: "Reports", value: stats.reports, color: "#10b981" },
    { icon: "📦", label: "Starter Kits", value: stats.kits, color: "#f59e0b" },
    { icon: "⚡", label: "Plan", value: stats.plan.toUpperCase(), color: "#6366f1" },
  ];

  const QUICK_LINKS = [
    { href: "/dashboard/autopilot",    icon: "🤖", label: "Autopilot",          desc: "AI-powered daily market briefing" },
    { href: "/trending",               icon: "🔥", label: "Trending Now",        desc: "What is blowing up right now" },
    { href: "/dashboard/validate",     icon: "✅", label: "Validate Trend",      desc: "Score any niche in seconds" },
    { href: "/dashboard/radar",        icon: "📡", label: "Market Radar",        desc: "Track and signal your markets" },
    { href: "/dashboard/keywords",     icon: "🔑", label: "Keyword Clusters",    desc: "SEO clusters with intent data" },
    { href: "/dashboard/intelligence", icon: "🧠", label: "Intelligence Engine", desc: "Deep market analysis" },
    { href: "/dashboard/starter",      icon: "🚀", label: "Starter Kit Builder", desc: "Full business kit in minutes" },
    { href: "/dashboard/content",      icon: "✍️", label: "Content Studio",      desc: "Viral content for any platform" },
    { href: "/dashboard/chat",         icon: "💬", label: "AI Assistant",        desc: "Chat with ARIA, your AI scout" },
  ];

  return (
    <div style={{ padding: "2rem 2.5rem", maxWidth: 1100, margin: "0 auto" }}>
      {/* Header */}
      <div style={{ marginBottom: "2.5rem" }}>
        <h1 style={{ fontSize: "1.75rem", fontWeight: 800, color: "var(--text-primary)", marginBottom: "0.3rem" }}>
          Dashboard
        </h1>
        <p style={{ color: "var(--text-muted)", fontSize: "0.95rem" }}>
          Welcome back, <strong style={{ color: "var(--accent-light)" }}>{name}</strong>. Here is your market intelligence overview.
        </p>
      </div>

      {/* Stat cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "1rem", marginBottom: "2.5rem" }}>
        {STAT_CARDS.map((s, i) => (
          <div key={i} style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "var(--radius)", padding: "1.25rem", position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: `linear-gradient(90deg, ${s.color}, ${s.color}88)` }} />
            <p style={{ fontSize: "0.72rem", color: "var(--text-muted)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: "0.5rem" }}>{s.label}</p>
            <p style={{ fontSize: "1.6rem", fontWeight: 800, color: "var(--text-primary)" }}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Quick access */}
      <div style={{ marginBottom: "1rem" }}>
        <h2 style={{ fontSize: "1rem", fontWeight: 700, color: "var(--text-primary)", marginBottom: "1rem" }}>Quick Access</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "0.75rem" }}>
          {QUICK_LINKS.map((link, i) => (
            <a key={i} href={link.href} style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "var(--radius)", padding: "1rem 1.1rem", textDecoration: "none", display: "flex", alignItems: "flex-start", gap: "0.75rem", transition: "all 0.15s", cursor: "pointer" }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = "var(--border-accent)"; e.currentTarget.style.background = "var(--bg-elevated)"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.background = "var(--bg-card)"; }}>
              <span style={{ fontSize: "1.25rem", flexShrink: 0, marginTop: "0.1rem" }}>{link.icon}</span>
              <div>
                <p style={{ fontWeight: 700, color: "var(--text-primary)", fontSize: "0.875rem", marginBottom: "0.2rem" }}>{link.label}</p>
                <p style={{ fontSize: "0.775rem", color: "var(--text-muted)", lineHeight: 1.4 }}>{link.desc}</p>
              </div>
            </a>
          ))}
        </div>
      </div>

      {/* Upgrade banner (free only) */}
      {stats.plan === "free" && (
        <div style={{ marginTop: "2rem", background: "linear-gradient(135deg, rgba(124,58,237,0.15), rgba(167,139,250,0.08))", border: "1px solid var(--border-accent)", borderRadius: "var(--radius-lg)", padding: "1.5rem 2rem", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "1rem" }}>
          <div>
            <h3 style={{ fontWeight: 800, color: "var(--text-primary)", marginBottom: "0.3rem" }}>Unlock the full platform</h3>
            <p style={{ color: "var(--text-muted)", fontSize: "0.875rem" }}>Upgrade to Pro for 200 credits/mo, deeper analysis, and priority processing.</p>
          </div>
          <a href="/dashboard/billing" style={{ background: "linear-gradient(135deg, var(--accent), var(--accent-light))", color: "white", borderRadius: "var(--radius-sm)", padding: "0.65rem 1.5rem", fontWeight: 700, fontSize: "0.9rem", textDecoration: "none", whiteSpace: "nowrap", boxShadow: "0 4px 12px var(--accent-glow)", flexShrink: 0 }}>
            Upgrade to Pro →
          </a>
        </div>
      )}
    </div>
  );
}
