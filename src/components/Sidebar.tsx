
"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { getSupabaseClient } from "@/lib/supabase/client-singleton";

const NAV = [
  { href: "/dashboard",              icon: "🏠", label: "Dashboard" },
  { href: "/dashboard/autopilot",    icon: "🤖", label: "Autopilot",          badge: "NEW", badgeColor: "#6366f1" },
  { href: "/trending",               icon: "🔥", label: "Trending Now",       badge: "HOT", badgeColor: "#ef4444" },
  { href: "/dashboard/validate",     icon: "✅", label: "Validate Trend" },
  { href: "/dashboard/radar",        icon: "📡", label: "Market Radar" },
  { href: "/dashboard/keywords",     icon: "🔑", label: "Keyword Clusters" },
  { href: "/dashboard/intelligence", icon: "🧠", label: "Intelligence Engine" },
  { href: "/dashboard/starter",      icon: "🚀", label: "Starter Kit Builder" },
  { href: "/dashboard/content",      icon: "✍️", label: "Content Studio" },
  { href: "/dashboard/reports",      icon: "📊", label: "Past Reports" },
  { href: "/dashboard/chat",         icon: "💬", label: "AI Assistant" },
  { href: "/dashboard/settings",     icon: "⚙️", label: "Settings" },
];

export default function Sidebar() {
  const pathname = usePathname();
  const supabase = useRef(getSupabaseClient()).current;
  const [credits, setCredits] = useState(0);
  const [plan, setPlan] = useState("free");

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) return;
      supabase.from("profiles").select("credits,plan").eq("id", session.user.id).single().then(({ data }) => {
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
    <aside style={{
      width: 230, minWidth: 230, flexShrink: 0,
      background: "var(--bg-surface)",
      borderRight: "1px solid var(--border)",
      display: "flex", flexDirection: "column",
      height: "100vh", position: "sticky", top: 0,
      overflow: "hidden",
    }}>
      {/* Logo */}
      <div style={{ padding: "1.2rem 1.25rem", borderBottom: "1px solid var(--border)", flexShrink: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
          <div style={{ width: 30, height: 30, background: "linear-gradient(135deg, var(--accent), var(--accent-light))", borderRadius: 7, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.9rem", boxShadow: "0 2px 8px var(--accent-glow)", flexShrink: 0 }}>⚡</div>
          <div>
            <div style={{ fontWeight: 800, fontSize: "1rem", background: "linear-gradient(135deg, var(--accent-light), #f0f0ff)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", lineHeight: 1.1 }}>NicheFlow</div>
            <div style={{ fontSize: "0.6rem", color: "var(--text-muted)", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase" }}>AI Scout</div>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: "0.6rem 0.6rem", overflowY: "auto", display: "flex", flexDirection: "column", gap: "0.05rem" }}>
        {NAV.map((item) => {
          const active = item.href === "/dashboard" ? pathname === item.href : pathname.startsWith(item.href);
          return (
            <Link key={item.href} href={item.href} style={{
              display: "flex", alignItems: "center", gap: "0.6rem",
              padding: "0.48rem 0.75rem", borderRadius: "var(--radius-sm)",
              textDecoration: "none", fontSize: "0.845rem",
              fontWeight: active ? 700 : 500,
              color: active ? "var(--accent-light)" : "var(--text-secondary)",
              background: active ? "rgba(124,58,237,0.12)" : "transparent",
              border: active ? "1px solid rgba(124,58,237,0.25)" : "1px solid transparent",
              transition: "all 0.12s",
            }}>
              <span style={{ fontSize: "0.9rem", flexShrink: 0 }}>{item.icon}</span>
              <span style={{ flex: 1, truncate: "ellipsis", overflow: "hidden", whiteSpace: "nowrap" }}>{item.label}</span>
              {item.badge && (
                <span style={{ background: item.badgeColor + "22", color: item.badgeColor, border: `1px solid ${item.badgeColor}44`, borderRadius: 999, padding: "0.08rem 0.4rem", fontSize: "0.6rem", fontWeight: 800, letterSpacing: "0.04em", flexShrink: 0 }}>
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Credits + Plan */}
      <div style={{ padding: "0.85rem 1rem", borderTop: "1px solid var(--border)", flexShrink: 0 }}>
        <div style={{ background: "var(--bg-card)", borderRadius: "var(--radius-sm)", padding: "0.65rem 0.75rem", marginBottom: "0.6rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.35rem" }}>
            <span style={{ fontSize: "0.68rem", color: "var(--text-muted)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em" }}>Credits</span>
            <span style={{ fontSize: "0.72rem", color: "var(--accent-light)", fontWeight: 700 }}>{credits}/{maxCredits}</span>
          </div>
          <div style={{ height: 3, background: "var(--bg-elevated)", borderRadius: 999, overflow: "hidden" }}>
            <div style={{ height: "100%", width: `${Math.min(100, (credits / maxCredits) * 100)}%`, background: "linear-gradient(90deg, var(--accent), var(--accent-light))", borderRadius: 999 }} />
          </div>
          <span style={{ display: "inline-block", marginTop: "0.4rem", fontSize: "0.65rem", background: "rgba(124,58,237,0.15)", color: "var(--accent-light)", border: "1px solid rgba(124,58,237,0.3)", borderRadius: 999, padding: "0.08rem 0.45rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.04em" }}>{plan}</span>
        </div>
        <Link href="/dashboard/billing" style={{ display: "block", textAlign: "center", background: "linear-gradient(135deg, var(--accent), var(--accent-light))", color: "white", borderRadius: "var(--radius-sm)", padding: "0.45rem", fontWeight: 700, fontSize: "0.75rem", textDecoration: "none", marginBottom: "0.4rem", boxShadow: "0 2px 8px var(--accent-glow)" }}>
          ⚡ Upgrade Plan
        </Link>
        <button onClick={signOut} style={{ width: "100%", background: "transparent", border: "1px solid var(--border)", borderRadius: "var(--radius-sm)", padding: "0.38rem", color: "var(--text-muted)", fontSize: "0.75rem", fontWeight: 600, cursor: "pointer" }}>
          Sign Out
        </button>
      </div>
    </aside>
  );
}
