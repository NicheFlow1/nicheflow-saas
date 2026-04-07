import Link from 'next/link'

export default function LandingPage(){
  const features=[
    {icon:'🧠',title:'ARIA Intelligence Engine',desc:'Powered by Llama 3.3 70B — our AI analyst fuses YC partner instincts, a16z market sizing, and Reddit trend spotting into one surgical analysis.'},
    {icon:'⚡',title:'Trend Flow Detection',desc:'Know where a trend is in its lifecycle. Birth, emerging, growing, peaking, saturating. Enter at the right moment, not when everyone else does.'},
    {icon:'🎯',title:'GO / NO GO Decisions',desc:'Every analysis returns a clear binary signal. No more guessing. Demand, competition, timing, virality, longevity — all scored 0-100.'},
    {icon:'🗺️',title:'Competition X-Ray',desc:'Map every incumbent, their core weaknesses, the white spaces they miss, and your exact positioning angle to outcompete them.'},
    {icon:'💰',title:'Monetization Intelligence',desc:'Not just how to make money — which model, what price psychology, LTV/CAC estimates, full upsell stack, and first revenue in 30 days.'},
    {icon:'🚀',title:'Execution Pipeline',desc:'From MVP definition to Week 1-2 actions through Month 4-6 milestones. A complete roadmap, not vague advice.'},
  ]
  const stats=[
    {val:'7 Dimensions',label:'Scoring system'},
    {val:'4 Modes',label:'Analysis types'},
    {val:'5 Platforms',label:'Trend signals'},
    {val:'30 Days',label:'First revenue path'},
  ]
  return(
    <div style={{minHeight:'100vh',background:'var(--bg-base)',color:'var(--text-primary)',fontFamily:"-apple-system,'Inter',sans-serif"}}>
      {/* NAV */}
      <nav style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'16px 40px',borderBottom:'1px solid var(--border-base)',position:'sticky',top:0,background:'rgba(5,5,8,0.85)',backdropFilter:'blur(12px)',zIndex:100}}>
        <div style={{display:'flex',alignItems:'center',gap:10}}>
          <div style={{width:28,height:28,borderRadius:8,background:'linear-gradient(135deg,#6366f1,#8b5cf6,#ec4899)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:11,fontWeight:900,color:'white'}}>
            NF
          </div>
          <span style={{fontSize:14,fontWeight:700}}>NicheFlow</span>
          <span style={{fontSize:9,fontWeight:700,color:'var(--text-disabled)',textTransform:'uppercase',letterSpacing:'0.08em',background:'var(--bg-muted)',padding:'2px 6px',borderRadius:4,border:'1px solid var(--border-base)'}}>Intelligence OS</span>
        </div>
        <div style={{display:'flex',gap:10}}>
          <Link href='/auth/login' style={{display:'flex',alignItems:'center',padding:'7px 14px',borderRadius:8,fontSize:13,fontWeight:600,color:'var(--text-secondary)',textDecoration:'none',border:'1px solid var(--border-base)',background:'transparent',transition:'all 0.12s'}}>Log in</Link>
          <Link href='/auth/signup' style={{display:'flex',alignItems:'center',padding:'7px 16px',borderRadius:8,fontSize:13,fontWeight:700,color:'white',textDecoration:'none',background:'var(--brand-purple)',transition:'all 0.12s'}}>Get Started Free</Link>
        </div>
      </nav>

      {/* HERO */}
      <section style={{maxWidth:760,margin:'0 auto',padding:'96px 24px 80px',textAlign:'center'}}>
        <div style={{display:'inline-flex',alignItems:'center',gap:6,padding:'5px 12px',borderRadius:99,background:'rgba(99,102,241,0.08)',border:'1px solid rgba(99,102,241,0.2)',fontSize:11,fontWeight:600,color:'var(--brand-purple)',marginBottom:28}}>
          <span>⚡</span> Market Intelligence OS — Powered by ARIA
        </div>
        <h1 style={{fontSize:'clamp(2rem,5vw,3.2rem)',fontWeight:900,letterSpacing:'-0.04em',lineHeight:1.1,marginBottom:20}}>
          Find winning opportunities
          <span style={{display:'block',background:'linear-gradient(135deg,#6366f1,#8b5cf6,#ec4899)',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent',backgroundClip:'text'}}>
            before everyone else does
          </span>
        </h1>
        <p style={{fontSize:16,color:'var(--text-secondary)',lineHeight:1.7,maxWidth:580,margin:'0 auto 40px'}}>
          NicheFlow is a full market intelligence OS. Detect trends before they peak, score opportunities with 7-dimensional AI analysis, map competition, and get a complete execution roadmap — in seconds.
        </p>
        <div style={{display:'flex',gap:12,justifyContent:'center',flexWrap:'wrap'}}>
          <Link href='/auth/signup' style={{display:'inline-flex',alignItems:'center',gap:8,padding:'13px 28px',borderRadius:12,fontSize:14,fontWeight:700,color:'white',textDecoration:'none',background:'linear-gradient(135deg,#6366f1,#8b5cf6)',boxShadow:'0 4px 20px rgba(99,102,241,0.35)'}}>
            Start for free &rarr;
          </Link>
          <Link href='/auth/login' style={{display:'inline-flex',alignItems:'center',gap:8,padding:'13px 24px',borderRadius:12,fontSize:14,fontWeight:600,color:'var(--text-secondary)',textDecoration:'none',border:'1px solid var(--border-base)',background:'var(--bg-elevated)'}}>
            Sign in
          </Link>
        </div>
        <p style={{fontSize:11,color:'var(--text-disabled)',marginTop:16}}>No credit card required &mdash; 7 free analyses</p>
      </section>

      {/* STATS */}
      <section style={{maxWidth:700,margin:'0 auto',padding:'0 24px 80px'}}>
        <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:12}}>
          {stats.map(({val,label})=>(
            <div key={val} style={{background:'var(--bg-elevated)',border:'1px solid var(--border-base)',borderRadius:14,padding:'20px 16px',textAlign:'center'}}>
              <div style={{fontSize:'1.4rem',fontWeight:900,letterSpacing:'-0.03em',background:'linear-gradient(135deg,#6366f1,#8b5cf6)',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent',backgroundClip:'text'}}>{val}</div>
              <div style={{fontSize:10,color:'var(--text-tertiary)',marginTop:4,textTransform:'uppercase',letterSpacing:'0.04em'}}>{label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* FEATURES */}
      <section style={{maxWidth:900,margin:'0 auto',padding:'0 24px 100px'}}>
        <div style={{textAlign:'center',marginBottom:48}}>
          <h2 style={{fontSize:'1.75rem',fontWeight:800,letterSpacing:'-0.03em',marginBottom:12}}>Everything you need to find your edge</h2>
          <p style={{fontSize:14,color:'var(--text-secondary)'}}>One platform. Total market clarity.</p>
        </div>
        <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:16}}>
          {features.map(({icon,title,desc})=>(
            <div key={title} style={{background:'var(--bg-elevated)',border:'1px solid var(--border-base)',borderRadius:16,padding:22,transition:'border-color 0.15s'}}>
              <div style={{fontSize:24,marginBottom:12}}>{icon}</div>
              <h3 style={{fontSize:13,fontWeight:700,marginBottom:6}}>{title}</h3>
              <p style={{fontSize:11,color:'var(--text-tertiary)',lineHeight:1.65}}>{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section style={{maxWidth:560,margin:'0 auto',padding:'0 24px 100px',textAlign:'center'}}>
        <div style={{background:'linear-gradient(135deg,rgba(99,102,241,0.06),rgba(139,92,246,0.06))',border:'1px solid rgba(99,102,241,0.15)',borderRadius:24,padding:'48px 40px'}}>
          <h2 style={{fontSize:'1.6rem',fontWeight:800,letterSpacing:'-0.03em',marginBottom:12}}>Ready to find your next big opportunity?</h2>
          <p style={{fontSize:13,color:'var(--text-tertiary)',marginBottom:28,lineHeight:1.6}}>Join thousands of founders, marketers, and builders who use NicheFlow to find winning markets before the crowd.</p>
          <Link href='/auth/signup' style={{display:'inline-flex',alignItems:'center',gap:8,padding:'14px 32px',borderRadius:12,fontSize:15,fontWeight:700,color:'white',textDecoration:'none',background:'linear-gradient(135deg,#6366f1,#8b5cf6)',boxShadow:'0 4px 24px rgba(99,102,241,0.35)'}}>
            Start for free &rarr;
          </Link>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{borderTop:'1px solid var(--border-base)',padding:'24px 40px',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
        <div style={{fontSize:12,color:'var(--text-disabled)'}}>&copy; 2025 NicheFlow Intelligence OS</div>
        <div style={{display:'flex',gap:20}}>
          <Link href='/auth/login' style={{fontSize:12,color:'var(--text-tertiary)',textDecoration:'none'}}>Login</Link>
          <Link href='/auth/signup' style={{fontSize:12,color:'var(--text-tertiary)',textDecoration:'none'}}>Sign Up</Link>
        </div>
      </footer>
    </div>
  )
}