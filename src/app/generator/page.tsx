'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Wand2, CheckCircle, Loader2, AlertCircle } from 'lucide-react'
import toast from 'react-hot-toast'
import { cn } from '@/lib/utils'
const MODULES = [
  { key: 'idea', label: 'Idea Engine', icon: '💡', desc: 'Generating business concept...' },
  { key: 'market', label: 'Market Analysis', icon: '📊', desc: 'Analyzing market...' },
  { key: 'product', label: 'Product Builder', icon: '🛠', desc: 'Designing MVP...' },
  { key: 'brand', label: 'Brand Studio', icon: '🎨', desc: 'Creating brand...' },
  { key: 'landing', label: 'Landing Page', icon: '📄', desc: 'Writing copy...' },
  { key: 'content', label: 'Content Gen', icon: '📝', desc: 'Generating content...' },
  { key: 'growth', label: 'Growth Plan', icon: '🚀', desc: 'Building growth plan...' },
]
type State = { projectId: string|null; niche: string; projectName: string; outputs: Record<string,unknown>; step: number; running: boolean; error: string|null }
const INIT: State = { projectId: null, niche: '', projectName: '', outputs: {}, step: 0, running: false, error: null }
export default function GeneratorPage() {
  const router = useRouter()
  const [niche, setNiche] = useState('')
  const [state, setState] = useState<State>(INIT)
  async function startGeneration() {
    if (!niche.trim()) { toast.error('Enter a niche'); return }
    setState(s => ({...s, running: true, error: null, niche, step: 0}))
    const res = await fetch('/api/projects', { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({name: niche+' Project', niche, description: ''}) })
    const proj = await res.json()
    if (!res.ok) { setState(s => ({...s, running: false, error: proj.error})); return }
    let projectId = proj.id, outputs: Record<string,unknown> = {}, projectName = proj.name
    for (let i = 0; i < MODULES.length; i++) {
      const mod = MODULES[i]
      setState(s => ({...s, step: i+1, projectId, projectName}))
      const gr = await fetch('/api/generate', { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({projectId, module: mod.key, context: {niche, ...outputs}}) })
      const gd = await gr.json()
      if (!gr.ok) { setState(s => ({...s, running: false, error: gd.error})); return }
      outputs[mod.key] = gd.output
      if (mod.key === 'idea' && (gd.output as Record<string,unknown>)?.businessName) projectName = (gd.output as Record<string,unknown>).businessName as string
      setState(s => ({...s, outputs: {...s.outputs, [mod.key]: gd.output}, projectName}))
    }
    setState(s => ({...s, running: false, step: 8}))
    toast.success('Business generated!')
  }
  const isDone = state.step >= 8 && !state.running
  if (state.running || isDone) return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold">{isDone ? 'Business Ready: '+state.projectName : 'Generating: '+state.niche}</h1>
      <div className="nf-card p-6 space-y-3">
        {MODULES.map((m, i) => {
          const sN = i+1, done = state.step > sN || isDone, running = state.step === sN && state.running
          return (
            <div key={m.key} className={cn('flex items-center gap-3 p-3 rounded-xl', running ? 'bg-nf-purple/10 border border-nf-purple/30' : done ? 'bg-nf-surface2' : 'opacity-40')}>
              <div className={cn('w-8 h-8 rounded-lg flex items-center justify-center text-sm', running ? 'bg-nf-purple/20' : done ? 'bg-nf-teal/10' : 'bg-nf-surface3')}>
                {done ? <CheckCircle size={14} className="text-nf-teal"/> : running ? <Loader2 size={14} className="animate-spin text-nf-purple"/> : m.icon}
              </div>
              <div>
                <div className="text-sm font-semibold">{m.label}</div>
                <div className="text-xs text-muted-foreground">{done ? 'Complete' : running ? m.desc : 'Queued'}</div>
              </div>
            </div>
          )
        })}
      </div>
      {isDone && (
        <div className="flex gap-3">
          <button onClick={() => router.push('/projects/'+state.projectId)} className="nf-btn-primary px-5 py-2.5 rounded-xl">View Project</button>
          <button onClick={() => { setState(INIT); setNiche('') }} className="nf-btn-ghost border border-nf-border px-5 py-2.5 rounded-xl">Generate Another</button>
        </div>
      )}
    </div>
  )
  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold">AI Business Generator</h1>
        <p className="text-muted-foreground mt-2">Enter a niche and get a complete business in minutes.</p>
      </div>
      {state.error && <div className="flex items-center gap-2 p-4 rounded-xl bg-red-400/10 text-red-400 mb-6"><AlertCircle size={14}/>{state.error}</div>}
      <div className="nf-card p-8">
        <input type="text" value={niche} onChange={e => setNiche(e.target.value)} onKeyDown={e => e.key === 'Enter' && startGeneration()}
          placeholder="e.g. remote work tools, pet nutrition, AI for lawyers..."
          className="w-full bg-nf-surface2 border border-nf-border rounded-xl px-5 py-3.5 text-base focus:outline-none focus:border-nf-purple/60 mb-6"/>
        <button onClick={startGeneration} disabled={!niche.trim()} className="w-full nf-btn-primary py-3.5 rounded-xl text-base flex items-center justify-center gap-2 disabled:opacity-40">
          <Wand2 size={16}/> Generate Complete Business
        </button>
      </div>
    </div>
  )
}
