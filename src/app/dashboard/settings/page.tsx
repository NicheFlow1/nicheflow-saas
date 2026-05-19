
"use client";
import { useEffect, useRef, useState } from "react";
import { getSupabaseClient } from "@/lib/supabase/client-singleton";

const THEMES = [
  { id: "dark",     label: "Dark",     colors: ["#0f0f13", "#7c3aed"] },
  { id: "midnight", label: "Midnight", colors: ["#070714", "#6d28d9"] },
  { id: "light",    label: "Light",    colors: ["#f8f8ff", "#7c3aed"] },
  { id: "purple",   label: "Purple",   colors: ["#120a2e", "#a855f7"] },
];

export default function SettingsPage() {
  const supabase = useRef(getSupabaseClient()).current;
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [theme, setTheme] = useState("dark");
  const [credits, setCredits] = useState(0);
  const [plan, setPlan] = useState("free");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    // Load current theme from localStorage
    const saved = localStorage.getItem("nicheflow-theme") || "dark";
    setTheme(saved);

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) return;
      setEmail(session.user.email || "");
      supabase.from("profiles").select("display_name,credits,plan").eq("id", session.user.id).single().then(({ data }) => {
        if (data) {
          setDisplayName(data.display_name || "");
          setCredits(data.credits ?? 0);
          setPlan(data.plan ?? "free");
        }
      });
    });
  }, []);

  function applyTheme(t: string) {
    setTheme(t);
    localStorage.setItem("nicheflow-theme", t);
    document.documentElement.setAttribute("data-theme", t);
  }

  async function saveProfile() {
    setSaving(true);
    const { data: { session } } = await supabase.auth.getSession();
    if (session) {
      await supabase.from("profiles").update({ display_name: displayName }).eq("id", session.user.id);
    }
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  const maxCredits = plan === "pro" ? 200 : plan === "agency" ? 1000 : 10;

  return (
    <div style={{ padding: "2rem", maxWidth: 700, margin: "0 auto" }}>
      <h1 style={{ fontSize: "1.6rem", fontWeight: 800, color: "var(--text-primary)", marginBottom: "2rem" }}>Settings</h1>

      {/* Profile */}
      <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "var(--radius)", padding: "1.5rem", marginBottom: "1.5rem" }}>
        <h2 style={{ fontSize: "1rem", fontWeight: 700, color: "var(--text-primary)", marginBottom: "1.25rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <span>👤</span> Profile
        </h2>
        <div style={{ marginBottom: "1rem" }}>
          <label style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.06em", display: "block", marginBottom: "0.4rem" }}>Display Name</label>
          <input value={displayName} onChange={e => setDisplayName(e.target.value)} placeholder="Your name" style={{ width: "100%" }} />
        </div>
        <div style={{ marginBottom: "1.25rem" }}>
          <label style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.06em", display: "block", marginBottom: "0.4rem" }}>Email</label>
          <input value={email} disabled style={{ width: "100%", opacity: 0.6, cursor: "not-allowed" }} />
        </div>
        <button onClick={saveProfile} disabled={saving} style={{ background: "var(--accent)", color: "white", border: "none", borderRadius: "var(--radius-sm)", padding: "0.6rem 1.4rem", fontWeight: 700, fontSize: "0.9rem", cursor: saving ? "not-allowed" : "pointer", opacity: saving ? 0.7 : 1 }}>
          {saving ? "Saving..." : saved ? "✅ Saved!" : "Save Profile"}
        </button>
      </div>

      {/* Theme */}
      <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "var(--radius)", padding: "1.5rem", marginBottom: "1.5rem" }}>
        <h2 style={{ fontSize: "1rem", fontWeight: 700, color: "var(--text-primary)", marginBottom: "1.25rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <span>🎨</span> Theme
        </h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "0.75rem" }}>
          {THEMES.map(t => (
            <button
              key={t.id}
              onClick={() => applyTheme(t.id)}
              style={{
                background: "var(--bg-elevated)",
                border: `2px solid ${theme === t.id ? "var(--accent)" : "var(--border)"}`,
                borderRadius: "var(--radius)",
                padding: "1rem 0.5rem 0.75rem",
                cursor: "pointer",
                transition: "all 0.15s",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "0.5rem",
                boxShadow: theme === t.id ? "0 0 0 1px var(--accent)" : "none",
              }}
            >
              {/* Color preview */}
              <div style={{ width: 40, height: 40, borderRadius: 8, overflow: "hidden", position: "relative", flexShrink: 0 }}>
                <div style={{ position: "absolute", inset: 0, background: t.colors[0] }} />
                <div style={{ position: "absolute", bottom: 0, right: 0, width: 22, height: 22, background: t.colors[1], borderRadius: "8px 0 0 0" }} />
              </div>
              <span style={{ fontSize: "0.8rem", fontWeight: theme === t.id ? 700 : 500, color: theme === t.id ? "var(--accent-light)" : "var(--text-muted)" }}>
                {t.label}
              </span>
            </button>
          ))}
        </div>
        <p style={{ fontSize: "0.78rem", color: "var(--text-muted)", marginTop: "0.75rem" }}>
          Theme applies instantly across the entire app and is remembered on next visit.
        </p>
      </div>

      {/* Usage */}
      <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "var(--radius)", padding: "1.5rem", marginBottom: "1.5rem" }}>
        <h2 style={{ fontSize: "1rem", fontWeight: 700, color: "var(--text-primary)", marginBottom: "1.25rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <span>📊</span> Usage
        </h2>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
          <span style={{ fontSize: "0.875rem", color: "var(--text-secondary)" }}>Credits used</span>
          <span style={{ fontWeight: 700, color: "var(--accent-light)" }}>{credits} / {maxCredits}</span>
        </div>
        <div style={{ height: 8, background: "var(--bg-elevated)", borderRadius: 999, overflow: "hidden", marginBottom: "1rem" }}>
          <div style={{ height: "100%", width: `${Math.min(100, (credits / maxCredits) * 100)}%`, background: "linear-gradient(90deg, var(--accent), var(--accent-light))", borderRadius: 999, transition: "width 0.5s ease" }} />
        </div>
        <div style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem" }}>
          <span style={{ fontSize: "0.75rem", background: "var(--accent-glow)", color: "var(--accent-light)", border: "1px solid var(--border-accent)", borderRadius: 999, padding: "0.15rem 0.6rem", fontWeight: 700, textTransform: "uppercase" }}>{plan} plan</span>
        </div>
      </div>

      {/* Billing */}
      <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "var(--radius)", padding: "1.5rem" }}>
        <h2 style={{ fontSize: "1rem", fontWeight: 700, color: "var(--text-primary)", marginBottom: "1rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <span>💳</span> Plan & Billing
        </h2>
        <p style={{ fontSize: "0.875rem", color: "var(--text-muted)", marginBottom: "1rem" }}>
          Upgrade to unlock more credits, deeper analysis, and priority processing.
        </p>
        <button onClick={() => window.location.href = "/dashboard/billing"} style={{ background: "linear-gradient(135deg, var(--accent), var(--accent-light))", color: "white", border: "none", borderRadius: "var(--radius-sm)", padding: "0.65rem 1.4rem", fontWeight: 700, fontSize: "0.9rem", cursor: "pointer", boxShadow: "0 4px 12px var(--accent-glow)" }}>
          View Plans & Billing →
        </button>
      </div>
    </div>
  );
}
