"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: "#" },
  { href: "/dashboard/trending", label: "Trending Now", icon: "^" },
  { href: "/dashboard/radar", label: "Market Radar", icon: "@" },
  { href: "/dashboard/keywords", label: "Keyword Clusters", icon: "*" },
  { href: "/dashboard/intelligence", label: "Intelligence Engine", icon: "~" },
  { href: "/dashboard/validate", label: "Validate Trend", icon: "V" },
  { href: "/dashboard/starter", label: "Starter Kit", icon: "+" },
  { href: "/dashboard/autopilot", label: "Autopilot", icon: "A" },
  { href: "/dashboard/settings", label: "Settings", icon: "S" },
];

export default function Sidebar() {
  const pathname = usePathname();
  return (
    <aside style={{ position: "fixed", top: 0, left: 0, width: "240px", height: "100vh", background: "var(--bg-secondary)", borderRight: "1px solid var(--border)", display: "flex", flexDirection: "column", zIndex: 50, overflowY: "auto" }}>
      <div style={{ padding: "24px 20px 16px", borderBottom: "1px solid var(--border)" }}>
        <span style={{ fontSize: "20px", fontWeight: 700, color: "var(--accent)", letterSpacing: "-0.5px" }}>NicheFlow</span>
      </div>
      <nav style={{ flex: 1, padding: "12px 0" }}>
        {navItems.map((item) => {
          const active = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));
          return (
            <Link key={item.href} href={item.href} style={{ display: "flex", alignItems: "center", gap: "10px", padding: "10px 20px", color: active ? "var(--accent)" : "var(--text-secondary)", background: active ? "rgba(139,92,246,0.1)" : "transparent", textDecoration: "none", fontSize: "14px", fontWeight: active ? 600 : 400, borderLeft: active ? "2px solid var(--accent)" : "2px solid transparent", transition: "all 0.15s" }}>
              <span style={{ fontSize: "12px", width: "16px", textAlign: "center", opacity: 0.7 }}>{item.icon}</span>
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div style={{ padding: "16px 20px", borderTop: "1px solid var(--border)", fontSize: "12px", color: "var(--text-muted)" }}>NicheFlow v1.0</div>
    </aside>
  );
}
