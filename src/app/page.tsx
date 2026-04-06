'use client'
import Link from'next/link'
import{ArrowRight,Zap,TrendingUp,Shield,Target,ChevronRight,Crosshair,DollarSign,Activity}from'lucide-react'

const STATS=[{val:'64+',label:'AI Agents'},{val:'7',label:'Score Dimensions'},{val:'<60s',label:'Analysis Speed'},{val:'GO/NO GO',label:'Decision Engine'}]
const FEATURES=[
  {icon:Crosshair,title:'Deep Analysis',desc:'Surgical niche breakdown. Demand, competition, timing, monetization in one report.',color:'#818cf8'},
  {icon:TrendingUp,title:'Trend Lifecycle',desc:'Track from birth to peak. Know when to enter, scale, or exit any market.',color:'#34d399'},
  {icon:Shield,title:'Competition X-Ray',desc:'Map every player. Find their weaknesses. Identify the white spaces.',color:'#22d3ee'},
  {icon:DollarSign,title:'Monetization Intel',desc:'LTV, CAC, pricing psychology, and the exact upsell stack for maximum revenue.',color:'#fbbf24'},
  {icon:Activity,title:'GO / NO GO',desc:'No guesswork. Clear decision signal based on 7 weighted intelligence dimensions.',color:'#f472b6'},
  {icon:Target,title:'Execution Pipeline',desc:'MVP to first dollar in 30 days. Step-by-step roadmap with costs and outcomes.',color:'#a78bfa'},
]

export default function HomePage(){
  return(
    <div style={{minHeight:'100vh',background:'var(--bg-base)',color:'var(--text-primary)',overflowX:'hidden'}}>
      <div style={{position:'fixed',inset:0,backgroundImage:'linear-gradient(rgba(99,102,241,0.03) 1px,transparent 1px),linear-gradient(90deg,rgba(99,102,241,0.03) 1px,transparent 1px)',backgroundSize:'48px 48px',pointerEvents:'none'}}/>
      <div style={{position:'fixed',top:'15%',left:'50%',transform:'translateX(-50%)',width:900,height:900,borderRadius:'50%',background:'radial-gradient(ellipse,rgba(99,102,241,0.07) 0%,transparent 65%)',pointerEvents:'none'}}/>
      <nav style={{position:'sticky',top:0,zIndex:50,display:'flex',alignItems:'center',justifyContent:'space-between',padding:'14px 48px',background:'rgba(2,2,8,0.85)',backdropFilter:'blur(24px)',borderBottom:'1px solid var(--border)'}}>
        <div style={{display:'flex',alignItems:'center',gap:10}}>
          <div style={{width:32,height:32,borderRadius:10,background:'linear-gradient(135deg,#6366f1,#8b5cf6)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:11,fontWeight:900,color:'white',fontFamily:'monospace',boxShadow:'0 4px 12px rgba(99,102,241,0.35)'}}>NF</div>
          <div><div style={{fontSize:14,fontWeight:800,letterSpacing:-0.3}}>NicheFlow</div><div style={{fontSize:8,fontWeight:600,color:'var(--text-dim)',fontFamily:'monospace',letterSpacing:'0.08em',textTransform:'uppercase'}}>Intelligence OS</div></div>
        </div>
        <div style={{display:'flex',alignItems:'center',gap:8}}>
          <Link href='/auth/login' style={{padding:'7px 16px',borderRadius:9,fontSize:12,fontWeight:600,color:'var(--text-secondary)',textDecoration:'none',border:'1px solid var(--border)',background:'transparent'}}>Sign In</Link>
          <Link href='/auth/signup' style={{padding:'7px 16px',borderRadius:9,fontSize:12,fontWeight:700,color:'white',textDecoration:'none',background:'linear-gradient(135deg,#6366f1,#8b5cf6)',border:'1px solid rgba(99,102,241,0.3)',boxShadow:'0 4px 12px rgba(99,102,241,0.25)'}}>Get Started Free</Link>
        </div>
      </nav>
      <section style={{textAlign:'center',padding:'100px 24px 80px',maxWidth:860,margin:'0 auto',position:'relative'}}>
        <div style={{display:'inline-flex',alignItems:'center',gap:8,padding:'5px 14px 5px 8px',background:'rgba(99,102,241,0.08)',border:'1px solid rgba(99,102,241,0.2)',borderRadius:100,marginBottom:32}}>
          <span style={{fontSize:8,fontWeight:800,fontFamily:'monospace',letterSpacing:'0.1em',color:'#818cf8',background:'rgba(99,102,241,0.15)',padding:'2px 7px',borderRadius:6,textTransform:'uppercase'}}>Live</span>
          <span style={{fontSize:11,color:'var(--text-secondary)',fontWeight:500}}>GO/NO GO decision engine now active</span>
          <ChevronRight size={11} style={{color:'#818cf8'}}/>
        </div>
        <h1 style={{fontSize:'clamp(36px,6vw,72px)',fontWeight:900,lineHeight:1.05,letterSpacing:-2,marginBottom:20}}>
          <span>Find Market </span>
          <span style={{background:'linear-gradient(135deg,#818cf8 0%,#a78bfa 40%,#22d3ee 100%)',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent',backgroundClip:'text'}}>Opportunities</span>
          <span> Before Others Do</span>
        </h1>
        <p style={{fontSize:16,color:'var(--text-secondary)',maxWidth:520,margin:'0 auto 40px',lineHeight:1.65,fontWeight:400}}>A market intelligence OS powered by 64 AI agents. Detect trends, map markets, and get a clear GO or NO GO signal before the opportunity becomes obvious.</p>
        <div style={{display:'flex',alignItems:'center',justifyContent:'center',gap:12,flexWrap:'wrap'}}>
          <Link href='/auth/signup' style={{display:'inline-flex',alignItems:'center',gap:8,padding:'13px 28px',borderRadius:14,fontSize:14,fontWeight:700,color:'white',textDecoration:'none',background:'linear-gradient(135deg,#6366f1,#8b5cf6)',border:'1px solid rgba(99,102,241,0.3)',boxShadow:'0 8px 24px rgba(99,102,241,0.3)'}}><Zap size={15}/>Start Free Analysis</Link>
          <Link href='/auth/login' style={{display:'inline-flex',alignItems:'center',gap:8,padding:'13px 24px',borderRadius:14,fontSize:13,fontWeight:600,color:'var(--text-secondary)',textDecoration:'none',background:'var(--bg-card)',border:'1px solid var(--border)'}}>Sign in</Link>
        </div>
      </section>
      <section style={{maxWidth:860,margin:'0 auto 80px',padding:'0 24px'}}>
        <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:12}}>
          {STATS.map(({val,label})=>(
            <div key={label} style={{background:'var(--bg-card)',border:'1px solid var(--border)',borderRadius:16,padding:'20px 16px',textAlign:'center'}}>
              <div style={{fontSize:26,fontWeight:900,letterSpacing:-1,background:'linear-gradient(135deg,#818cf8,#a78bfa)',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent',backgroundClip:'text',marginBottom:4}}>{val}</div>
              <div style={{fontSize:10,fontWeight:600,color:'var(--text-muted)',fontFamily:'monospace',textTransform:'uppercase',letterSpacing:'0.06em'}}>{label}</div>
            </div>
          ))}
        </div>
      </section>
      <section style={{maxWidth:1000,margin:'0 auto 100px',padding:'0 24px'}}>
        <div style={{textAlign:'center',marginBottom:48}}>
          <div style={{fontSize:10,fontWeight:700,fontFamily:'monospace',letterSpacing:'0.15em',textTransform:'uppercase',color:'#818cf8',marginBottom:10}}>Intelligence Modules</div>
          <h2 style={{fontSize:36,fontWeight:900,letterSpacing:-1}}>Everything you need to win</h2>
        </div>
        <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:14}}>
          {FEATURES.map(({icon:Icon,title,desc,color})=>(
            <div key={title} style={{background:'var(--bg-card)',border:'1px solid var(--border)',borderRadius:18,padding:'22px',transition:'all 0.2s'}} onMouseEnter={e=>{e.currentTarget.style.borderColor='rgba(99,102,241,0.2)';e.currentTarget.style.transform='translateY(-2px)';e.currentTarget.style.boxShadow='0 8px 24px rgba(99,102,241,0.08)'}} onMouseLeave={e=>{e.currentTarget.style.borderColor='var(--border)';e.currentTarget.style.transform='none';e.currentTarget.style.boxShadow='none'}}>
              <div style={{width:38,height:38,borderRadius:11,background:'rgba(0,0,0,0.25)',border:'1px solid rgba(255,255,255,0.05)',display:'flex',alignItems:'center',justifyContent:'center',marginBottom:12}}><Icon size={17} style={{color}}/></div>
              <div style={{fontSize:13,fontWeight:700,marginBottom:5}}>{title}</div>
              <div style={{fontSize:11,color:'var(--text-muted)',lineHeight:1.6}}>{desc}</div>
            </div>
          ))}
        </div>
      </section>
      <section style={{textAlign:'center',padding:'60px 24px 100px',maxWidth:560,margin:'0 auto'}}>
        <div style={{background:'linear-gradient(135deg,rgba(99,102,241,0.08),rgba(139,92,246,0.08))',border:'1px solid rgba(99,102,241,0.18)',borderRadius:24,padding:'48px 36px'}}>
          <h2 style={{fontSize:30,fontWeight:900,letterSpacing:-0.8,marginBottom:10}}>Start finding opportunities</h2>
          <p style={{fontSize:13,color:'var(--text-secondary)',marginBottom:24,lineHeight:1.6}}>7 free intelligence analyses. No credit card. See what the market is missing.</p>
          <Link href='/auth/signup' style={{display:'inline-flex',alignItems:'center',gap:8,padding:'12px 26px',borderRadius:13,fontSize:13,fontWeight:700,color:'white',textDecoration:'none',background:'linear-gradient(135deg,#6366f1,#8b5cf6)',boxShadow:'0 6px 20px rgba(99,102,241,0.3)'}}><Zap size={14}/>Get started free</Link>
        </div>
      </section>
      <footer style={{textAlign:'center',padding:'20px 24px',borderTop:'1px solid var(--border)',color:'var(--text-dim)',fontSize:11,fontFamily:'monospace'}}>
        NicheFlow Intelligence OS
      </footer>
    </div>
  )
}