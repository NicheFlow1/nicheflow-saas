'use client';
import React, { useState, useEffect, useRef } from 'react';
import { getSupabaseClient } from '@/lib/supabase/client-singleton';
import { Check, Zap, Crown, Building2 } from 'lucide-react';

const PLANS = [
  { key:'free', name:'Free', price:'$0', period:'forever', color:'var(--text-muted)', icon:<Zap size={20}/>, features:['7 generations/month','Trend validation','Starter kit builder','AI chat (ARIA)','Content studio'] },
  { key:'pro', name:'Pro', price:'$19', period:'per month', color:'#6366f1', icon:<Crown size={20} color="#6366f1"/>, features:['100 generations/month','Everything in Free','Priority AI responses','Advanced market radar','Full export options','Email support'], popular:true },
  { key:'agency', name:'Agency', price:'$49', period:'per month', color:'#f59e0b', icon:<Building2 size={20} color="#f59e0b"/>, features:['500 generations/month','Everything in Pro','Team workspaces','White-label reports','API access','Dedicated support'] },
];

const NP_API = '9Z5S7VS-F0G4K15-KMJSAJ9-BFZSV4Q';

export default function BillingPage() {
  const [session, setSession] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState<string|null>(null);
  const [success, setSuccess] = useState(false);
  const sbRef = useRef(getSupabaseClient());

  useEffect(() => {
    if (typeof window !== 'undefined' && window.location.search.includes('success=1')) setSuccess(true);
    const sb = sbRef.current;
    sb.auth.getSession().then(async ({ data }: any) => {
      setSession(data.session);
      if (data.session) {
        const { data: pr } = await sb.from('profiles').select('*').eq('id', data.session.user.id).single();
        setProfile(pr);
      }
    });
  }, []);

  async function upgrade(planKey: string) {
    if (!session || planKey === 'free') return;
    setLoading(planKey);
    try {
      const price = planKey === 'pro' ? 19 : 49;
      const r = await fetch('https://api.nowpayments.io/v1/invoice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-api-key': NP_API },
        body: JSON.stringify({
          price_amount: price,
          price_currency: 'usd',
          order_id: `${session.user.id}_${planKey}_${Date.now()}`,
          order_description: `NicheFlow ${planKey} plan`,
          success_url: `${window.location.origin}/settings/billing?success=1`,
          cancel_url: `${window.location.origin}/settings/billing`,
        })
      });
      const inv = await r.json();
      if (inv.invoice_url) window.open(inv.invoice_url, '_blank');
      else alert('Payment setup failed. Please try again.');
    } catch { alert('Payment setup failed. Please try again.'); }
    finally { setLoading(null); }
  }

  const currentPlan = profile?.plan || 'free';

  return (
    <div style={{ maxWidth:860,margin:'0 auto',padding:'32px 24px' }}>
      <div style={{ marginBottom:28 }}>
        <h1 style={{ fontSize:20,fontWeight:700,color:'var(--text-primary)',margin:'0 0 4px' }}>Billing & Plans</h1>
        <p style={{ fontSize:14,color:'var(--text-muted)',margin:0 }}>Current plan: <strong style={{ color:'var(--text-primary)',textTransform:'capitalize' }}>{currentPlan}</strong> · {profile?.generations_used||0}/{profile?.generations_limit||7} generations used</p>
      </div>

      {success && (
        <div style={{ padding:'14px 18px',background:'rgba(16,185,129,.08)',border:'1px solid rgba(16,185,129,.25)',borderRadius:12,marginBottom:24,display:'flex',alignItems:'center',gap:10 }}>
          <Check size={18} color="#10b981"/>
          <span style={{ fontSize:14,color:'#10b981',fontWeight:600 }}>Payment received! Your plan will be upgraded within a few minutes.</span>
        </div>
      )}

      <div style={{ display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(240px,1fr))',gap:16 }}>
        {PLANS.map(plan => (
          <div key={plan.key} style={{ background:'var(--bg-card)',border:`1px solid ${plan.popular?'rgba(99,102,241,.4)':'var(--border-base)'}`,borderRadius:16,padding:24,position:'relative',display:'flex',flexDirection:'column' }}>
            {plan.popular && <div style={{ position:'absolute',top:-1,left:'50%',transform:'translateX(-50%)',background:'#6366f1',color:'#fff',fontSize:11,fontWeight:700,padding:'3px 14px',borderRadius:'0 0 10px 10px',letterSpacing:'0.05em' }}>MOST POPULAR</div>}
            <div style={{ display:'flex',alignItems:'center',gap:10,marginBottom:14,marginTop:plan.popular?10:0 }}>
              {plan.icon}
              <span style={{ fontSize:16,fontWeight:700,color:'var(--text-primary)' }}>{plan.name}</span>
            </div>
            <div style={{ marginBottom:18 }}>
              <span style={{ fontSize:32,fontWeight:800,color:'var(--text-primary)' }}>{plan.price}</span>
              <span style={{ fontSize:13,color:'var(--text-muted)',marginLeft:4 }}>{plan.period}</span>
            </div>
            <div style={{ flex:1,marginBottom:20 }}>
              {plan.features.map((f,i) => (
                <div key={i} style={{ display:'flex',alignItems:'center',gap:8,marginBottom:8 }}>
                  <Check size={14} color="#10b981"/>
                  <span style={{ fontSize:13,color:'var(--text-secondary)' }}>{f}</span>
                </div>
              ))}
            </div>
            <button
              onClick={()=>upgrade(plan.key)}
              disabled={currentPlan===plan.key||loading===plan.key||plan.key==='free'}
              style={{ width:'100%',padding:'10px',borderRadius:9,fontSize:13,fontWeight:700,cursor:currentPlan===plan.key||plan.key==='free'?'not-allowed':'pointer',border:'none',background:currentPlan===plan.key?'var(--bg-hover)':plan.popular?'#6366f1':plan.key==='agency'?'#f59e0b':'var(--bg-hover)',color:currentPlan===plan.key?'var(--text-muted)':'#fff' }}
            >
              {loading===plan.key?'Opening payment...':(currentPlan===plan.key?'Current Plan':plan.key==='free'?'Free Forever':`Upgrade to ${plan.name} →`)}
            </button>
          </div>
        ))}
      </div>

      <div style={{ marginTop:32,padding:20,background:'var(--bg-card)',border:'1px solid var(--border-base)',borderRadius:12 }}>
        <h3 style={{ fontSize:14,fontWeight:600,color:'var(--text-primary)',marginBottom:8 }}>Payment Info</h3>
        <p style={{ fontSize:13,color:'var(--text-muted)',margin:'0 0 6px' }}>Payments are processed via NowPayments — supports Bitcoin, Ethereum, USDT, and 50+ cryptocurrencies.</p>
        <p style={{ fontSize:13,color:'var(--text-muted)',margin:0 }}>After payment, your plan is upgraded automatically within minutes. Questions? Email us at support@nicheflow.ai</p>
      </div>
    </div>
  );
}
