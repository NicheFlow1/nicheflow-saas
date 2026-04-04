'use client'
import{useEffect,useState}from 'react'
import{supabase}from '@/lib/supabase/client-singleton'
export default function GeneratorPage(){
  const[profile,setProfile]=useState<any>(null)
  const[niche,setNiche]=useState('')
  const[loading,setLoading]=useState(false)
  const[result,setResult]=useState<any>(null)
  const[error,setError]=useState('')
  useEffect(()=>{
    supabase.auth.getSession().then(async({data:{session}})=>{
      if(!session)return
      const{data}=await supabase.from('profiles').select('*').eq('id',session.user.id).single()
      setProfile(data)
    })
  },[])
  async function generate(e:React.FormEvent){
    e.preventDefault()
    if(!niche.trim())return
    setLoading(true);setError('');setResult(null)
    const{data:{session}}=await supabase.auth.getSession()
    if(!session){setError('Not logged in');setLoading(false);return}
    const res=await fetch('/api/generate',{method:'POST',headers:{'Content-Type':'application/json','Authorization':'Bearer '+session.access_token},body:JSON.stringify({niche})})
    const data=await res.json()
    if(!res.ok){setError(data.error||'Generation failed');setLoading(false);return}
    setResult(data);setLoading(false)
  }
  const used=profile?.generations_used||0
  const limit=profile?.generations_limit||7
  const remaining=limit-used
  return(
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">AI Generator</h1>
        <span className="text-xs font-mono text-muted-foreground">{remaining} generations left</span>
      </div>
      {remaining<=0?(
        <div className="nf-card p-8 text-center">
          <p className="text-sm text-muted-foreground mb-4">You've used all your generations.</p>
          <a href="/settings/billing" className="nf-btn-primary px-4 py-2 rounded-lg text-sm">Upgrade Plan</a>
        </div>
      ):(
        <form onSubmit={generate} className="nf-card p-6 space-y-4">
          <label className="block text-sm font-medium">Enter your niche or idea</label>
          <textarea value={niche} onChange={e=>setNiche(e.target.value)} placeholder="e.g. AI tools for real estate agents, eco-friendly pet products..." rows={3}
            className="w-full bg-nf-surface2 border border-nf-border rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-nf-purple/60 resize-none"/>
          {error&&<p className="text-red-400 text-xs">{error}</p>}
          <button type="submit" disabled={loading||!niche.trim()} className="nf-btn-primary px-6 py-2.5 rounded-lg disabled:opacity-50">
            {loading?'Generating...':'Generate Business Plan'}
          </button>
        </form>
      )}
      {result&&(
        <div className="nf-card p-6 space-y-4">
          <h2 className="text-lg font-bold">{result.name||'Your Business Plan'}</h2>
          {result.description&&<p className="text-sm text-muted-foreground">{result.description}</p>}
          {result.sections&&result.sections.map((s:any,i:number)=>(
            <div key={i}>
              <h3 className="text-sm font-semibold mb-1">{s.title}</h3>
              <p className="text-sm text-muted-foreground">{s.content}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}