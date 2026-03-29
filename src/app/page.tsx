import Link from 'next/link'
import { PLAN_LIMITS } from '@/types/database'
export default function HomePage() {
  return (
    <div className="min-h-screen bg-nf-bg text-foreground">
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-5 border-b border-nf-border/50 bg-nf-bg/80 backdrop-blur-xl">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-nf-purple to-nf-pink flex items-center justify-center text-white font-bold font-mono">NF</div>
          <span className="font-bold">NicheFlow</span>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/auth/login" className="nf-btn-ghost">Sign in</Link>
          <Link href="/auth/signup" className="nf-btn-primary">Start free</Link>
        </div>
      </nav>
      <section className="pt-40 pb-24 px-8 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-6xl font-extrabold tracking-tight mb-6">Build a Complete <span className="gradient-text">Digital Business</span> with AI</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10">NicheFlow turns a niche idea into a fully-built startup automatically.</p>
          <Link href="/auth/signup" className="nf-btn-primary px-8 py-3.5 text-base rounded-xl">Generate your business free</Link>
          <p className="text-xs text-muted-foreground mt-4 font-mono">No credit card. 7 free generations.</p>
        </div>
      </section>
      <section className="py-20 px-8 bg-nf-surface/30">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Simple pricing</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {Object.entries(PLAN_LIMITS).map(([key, plan]) => (
              <div key={key} className={"nf-card p-6" + (key==='pro' ? ' glow-purple' : '')}>
                <div className="text-sm font-mono text-muted-foreground mb-1">{plan.label}</div>
                <div className="text-3xl font-bold mb-4">{plan.price}</div>
                <ul className="space-y-2 mb-6">{plan.features.map((f,i) => (
                  <li key={i} className="text-sm text-muted-foreground flex items-center gap-2"><span className="text-nf-teal">+</span>{f}</li>
                ))}</ul>
                <Link href={key==='free'?'/auth/signup':'/auth/signup?plan='+key} className={"block text-center py-2.5 rounded-lg text-sm font-semibold border " + (key==='pro'?'bg-nf-purple text-white border-nf-purple':'border-nf-border')}>
                  {key==='free'?'Get started free':'Get '+plan.label}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>
      <footer className="border-t border-nf-border py-10 px-8">
        <p className="text-center text-xs text-muted-foreground font-mono">&copy; 2026 NicheFlow.</p>
      </footer>
    </div>
  )
}
