"use client";
import { useEffect, useRef, useState } from "react";
import { getSupabaseClient } from "@/lib/supabase/client-singleton";
const PLANS=[
  {id:"free",name:"Free",price:0,priceId:"",features:["7 AI generations/month","Trending Now","Basic Radar","Keyword Clusters (3/mo)","Community support"],cta:"Current Plan",color:"#6b7280"},
  {id:"starter",name:"Starter",price:19,priceId:"price_starter_monthly",features:["50 AI generations/month","Everything in Free","Daily Picks","Watchlist (20 niches)","Audience Intel","AI Forecast","Email support"],cta:"Upgrade to Starter",color:"#6366f1"},
  {id:"pro",name:"Pro",price:49,priceId:"price_pro_monthly",features:["Unlimited AI generations","Everything in Starter","Real Semrush data","LunarCrush social scores","Unlimited Watchlist","PDF/CSV exports","Starter Kit Builder","Priority support"],cta:"Upgrade to Pro",color:"#8b5cf6",popular:true},
  {id:"agency",name:"Agency",price:99,priceId:"price_agency_monthly",features:["Everything in Pro","5 team seats","White-label reports","API access","Custom integrations","Dedicated account manager"],cta:"Upgrade to Agency",color:"#10b981"},
];
export default function BillingPage(){
  const supabase=useRef(getSupabaseClient()).current;
  const [plan,setPlan]=useState("free");
  const [sub,setSub]=useState<any>(null);
  const [loading,setLoading]=useState(true);
  const [upgrading,setUpgrading]=useState("");
  const [success,setSuccess]=useState(false);
  useEffect(()=>{if(typeof window!=="undefined"&&window.location.search.includes("success=1"))setSuccess(true);loadBilling();},[]);
  async function tok(){const{data:{session}}=await supabase.auth.getSession();return session?.access_token;}
  async function callC(action:string,extra={}){const t=await tok();const r=await fetch(process.env.NEXT_PUBLIC_SUPABASE_URL+"/functions/v1/connectors",{method:"POST",headers:{"Content-Type":"application/json",Authorization:"Bearer "+t},body:JSON.stringify({action,...extra})});return r.json();}
  async function loadBilling(){setLoading(true);try{const d=await callC("stripe_subscription");setPlan(d.plan||"free");setSub(d.subscription);}catch{}setLoading(false);}
  async function upgrade(p:any){if(!p.priceId)return;setUpgrading(p.id);try{const d=await callC("stripe_checkout",{price_id:p.priceId});if(d.url)window.location.href=d.url;}catch{}setUpgrading("");}
  async function portal(){setUpgrading("portal");try{const d=await callC("stripe_portal");if(d.url)window.location.href=d.url;}catch{}setUpgrading("");}
  return(
    <div style={{minHeight:"100vh",background:"var(--bg-base)"}}>
      <div style={{borderBottom:"1px solid var(--border)",background:"var(--bg-surface)",padding:"1.75rem 2.5rem"}}>
        <div style={{maxWidth:1000,margin:"0 auto"}}>
          <h1 style={{fontSize:"1.6rem",fontWeight:800,color:"var(--text-primary)",margin:"0 0 0.25rem"}}>Billing & Plans</h1>
          <p style={{color:"var(--text-muted)",margin:0,fontSize:"0.9rem"}}>Upgrade to unlock real data, unlimited generations, and premium features.</p>
        </div>
      </div>
      <div style={{maxWidth:1000,margin:"0 auto",padding:"2rem 2.5rem"}}>
        {success&&<div style={{background:"rgba(16,185,129,0.1)",border:"1px solid rgba(16,185,129,0.3)",borderRadius:8,padding:"1rem 1.25rem",color:"#10b981",marginBottom:"1.5rem",fontWeight:600}}>Payment successful! Your plan has been upgraded.</div>}
        {loading&&<div style={{textAlign:"center",padding:"2rem",color:"var(--text-muted)"}}>Loading billing info...</div>}
        {!loading&&sub&&<div style={{background:"var(--bg-card)",border:"1px solid var(--border)",borderRadius:10,padding:"1rem 1.25rem",marginBottom:"1.5rem",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
          <div><span style={{fontSize:"0.8rem",color:"var(--text-muted)"}}>Active — </span><strong style={{color:"var(--text-primary)"}}>{sub.plan}</strong><span style={{fontSize:"0.8rem",color:"var(--text-muted)"}}> renews {new Date(sub.current_period_end*1000).toLocaleDateString()}</span></div>
          <button onClick={portal} disabled={upgrading==="portal"} style={{background:"transparent",color:"var(--accent-light)",border:"1px solid var(--border-accent)",borderRadius:6,padding:"0.4rem 1rem",fontWeight:600,fontSize:"0.82rem",cursor:"pointer"}}>{upgrading==="portal"?"Loading...":"Manage Subscription"}</button>
        </div>}
        {!loading&&<div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:"1rem"}}>
          {PLANS.map(p=>{
            const isCurrent=plan===p.id;
            return(
              <div key={p.id} style={{background:"var(--bg-card)",border:(p as any).popular?"2px solid #8b5cf6":"1px solid var(--border)",borderRadius:12,overflow:"hidden"}}>
                {(p as any).popular&&<div style={{background:"#8b5cf6",color:"white",fontSize:"0.65rem",fontWeight:800,textAlign:"center",padding:"0.25rem",letterSpacing:"0.08em"}}>MOST POPULAR</div>}
                <div style={{padding:"1.25rem"}}>
                  <div style={{fontSize:"0.75rem",fontWeight:700,color:p.color,textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:"0.4rem"}}>{p.name}</div>
                  <div style={{fontSize:"2rem",fontWeight:800,color:"var(--text-primary)",lineHeight:1.1,marginBottom:"0.25rem"}}>{p.price===0?"Free":"$"+p.price}<span style={{fontSize:"0.9rem",fontWeight:400,color:"var(--text-muted)"}}>{p.price>0?"/mo":""}</span></div>
                  <div style={{height:"0.5px",background:"var(--border)",margin:"1rem 0"}} />
                  <ul style={{listStyle:"none",padding:0,margin:"0 0 1.25rem",display:"flex",flexDirection:"column",gap:"0.5rem"}}>
                    {p.features.map((f,i)=><li key={i} style={{display:"flex",gap:"0.5rem",fontSize:"0.82rem",color:"var(--text-secondary)"}}><span style={{color:p.color,flexShrink:0}}>✓</span>{f}</li>)}
                  </ul>
                  <button onClick={()=>!isCurrent&&upgrade(p)} disabled={isCurrent||upgrading===p.id} style={{width:"100%",background:isCurrent?"var(--bg-elevated)":(p as any).popular?"#8b5cf6":"transparent",color:isCurrent?"var(--text-muted)":(p as any).popular?"white":p.color,border:isCurrent?"1px solid var(--border)":(p as any).popular?"none":"1px solid "+p.color,borderRadius:8,padding:"0.65rem",fontWeight:700,fontSize:"0.85rem",cursor:isCurrent?"default":"pointer"}}>{upgrading===p.id?"Loading...":isCurrent?"Current Plan":p.cta}</button>
                </div>
              </div>
            );
          })}
        </div>}
      </div>
    </div>
  );
}
