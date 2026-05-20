
"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { getSupabaseClient } from "@/lib/supabase/client-singleton";

const NAV = [
  { href: "/dashboard", icon: "🏠", label: "Dashboard" },
  { href: "/dashboard/autopilot", icon: "🤖", label: "Autopilot" },
  { href: "/dashboard/trending", icon: "🔥", label: "Trending Now" },
  { href: "/dashboard/validate", icon: "✅", label: "Validate Trend" },
  { href: "/dashboard/radar", icon: "📡", label: "Market Radar" },
  { href: "/dashboard/keywords", icon: "🔑", label: "Keyword Clusters" },
  { href: "/dashboard/intelligence", icon: "🧠", label: "Intelligence Engine" },
  { href: "/dashboard/starter", icon: "🚀", label: "Starter Kit Builder" },
  { href: "/dashboard/content", icon: "✍️", label: "Content Studio" },
  { href: "/dashboard/reports", icon: "📊", label: "Past Reports" },
  { href: "/dashboard/chat", icon: "💬", label: "AI Assistant" },
  { href: "/dashboard/settings", icon: "⚙️", label: "Settings" },
];

export default function Sidebar() {
  const pathname = usePathname();
  const supabase = useRef(getSupabaseClient()).current;
  const [credits, setCredits] = useState(0);
  const [plan, setPlan] = useState("free");

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) return;
      supabase
        .from("profiles")
        .select("credits,plan")
        .eq("id", session.user.id)
        .single()
        .then(({ data }) => {
          if (data) { setCredits(data.credits ?? 0); setPlan(data.plan ?? "free"); }
        });
    });
  }, []);

  async function signOut() {
    await supabase.auth.signOut();
    window.location.href = "/auth/login";
  }

  const maxCredits = plan === "pro" ? 200 : plan === "agency" ? 1000 : 10;

  return (
    <aside style={{ width: 230, background: "var(--bg-surface)", borderRight: "1px solid var(--border)", display: "flex", flexDirection: "column", height: "100vh", position: "sticky", top: 0, flexShrink: 0, overflow: "hidden" }}>
      <div style={{ padding: "1.25rem 1.5rem", borderBottom: "1px solid var(--border)", flexShrink: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
          <div style={{ width: 32, height: 32, background: "linear-gradient(135deg, var(--accent), var(--accent-light))", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1rem", boxShadow: "0 2px 8px var(--accent-glow)" }}>⚡</div>
          <span style={{ fontWeight: 800, fontSize: "1.1rem", background: "linear-gradient(135deg, var(--accent-light), #f0f0ff)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>NicheFlow</span>
        </div>
      </div>

      <nav style={{ flex: 1, padding: "0.75rem", overflowY: "auto", display: "flex", flexDirection: "column", gap: "0.1rem" }}>
        {NAV.map((item) => {
          const active = item.href === "/dashboard" ? pathname === item.href : pathname.startsWith(item.href);
          return (
            <Link key={item.href} href={item.href} style={{ display: "flex", alignItems: "center", gap: "0.65rem", padding: "0.5rem 0.8rem", borderRadius: "var(--radius-sm)", textDecoration: "none", fontSize: "0.855rem", fontWeight: active ? 700 : 500, color: active ? "var(--accent-light)" : "var(--text-secondary)", background: active ? "var(--accent-glow)" : "transparent", border: active ? "1px solid var(--border-accent)" : "1px solid transparent", transition: "all 0.15s" }}>
              <span style={{ fontSize: "0.95rem" }}>{item.icon}</span>
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div style={{ padding: "1rem 1.25rem", borderTop: "1px solid var(--border)", flexShrink: 0 }}>
        <div style={{ background: "var(--bg-card)", borderRadius: "var(--radius-sm)", padding: "0.75rem", marginBottom: "0.75rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.4rem" }}>
            <span style={{ fontSize: "0.72rem", color: "var(--text-muted)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>Credits</span>
            <span style={{ fontSize: "0.75rem", color: "var(--accent-light)", fontWeight: 700 }}>{credits} / {maxCredits}</span>
          </div>
          <div style={{ height: 4, background: "var(--bg-elevated)", borderRadius: 999, overflow: "hidden" }}>
            <div style={{ height: "100%", width: `${Math.min(100, (credits / maxCredits) * 100)}%`, background: "linear-gradient(90deg, var(--accent), var(--accent-light))", borderRadius: 999, transition: "width 0.5s ease" }} />
          </div>
          <div style={{ marginTop: "0.5rem" }}>
            <span style={{ fontSize: "0.68rem", background: "var(--accent-glow)", color: "var(--accent-light)", border: "1px solid var(--border-accent)", borderRadius: 999, padding: "0.1rem 0.5rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.04em" }}>{plan} plan</span>
          </div>
        </div>
        <Link href="/dashboard/billing" style={{ display: "block", textAlign: "center", background: "linear-gradient(135deg, var(--accent), var(--accent-light))", color: "white", borderRadius: "var(--radius-sm)", padding: "0.5rem", fontWeight: 700, fontSize: "0.8rem", textDecoration: "none", marginBottom: "0.5rem", boxShadow: "0 2px 8px var(--accent-glow)" }}>⚡ Upgrade Plan</Link>
        <button onClick={signOut} style={{ width: "100%", background: "transparent", border: "1px solid var(--border)", borderRadius: "var(--radius-sm)", padding: "0.4rem", color: "var(--text-muted)", fontSize: "0.8rem", fontWeight: 600 }}>Sign Out</button>
      </div>
    </aside>
  );
}
