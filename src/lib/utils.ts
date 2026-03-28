import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
export function cn(...inputs:ClassValue[]) { return twMerge(clsx(inputs)) }
export function slugify(t:string) { return t.toLowerCase().replace(/[^\w\s-]/g,'').replace(/[\s_-]+/g,'-').replace(/^-|-$/g,'').substring(0,50) }
export function formatRelativeTime(d:string) {
  const now=new Date(),then=new Date(d),diff=now.getTime()-then.getTime()
  const m=Math.floor(diff/60000),h=Math.floor(diff/3600000),day=Math.floor(diff/86400000)
  if(m<1)return 'just now'
  if(m<60)return `${m}m ago`
  if(h<24)return `${h}h ago`
  return `${day}d ago`
}
export const STATUS_COLORS:Record<string,string>={
  draft:"text-nf-amber bg-nf-amber/10 border-nf-amber/20",
  validating:"text-nf-amber bg-nf-amber/10 border-nf-amber/20",
  building:"text-nf-purple bg-nf-purple/10 border-nf-purple/20",
  branding:"text-nf-pink bg-nf-pink/10 border-nf-pink/20",
  launching:"text-nf-teal bg-nf-teal/10 border-nf-teal/20",
  live:"text-nf-teal bg-nf-teal/10 border-nf-teal/20",
  paused:"text-zinc-400 bg-zinc-400/10 border-zinc-400/20",
  archived:"text-zinc-500 bg-zinc-500/10 border-zinc-500/20",
  pending:"text-zinc-400 bg-zinc-400/10 border-zinc-400/20",
  running:"text-nf-purple bg-nf-purple/10 border-nf-purple/20",
  complete:"text-nf-teal bg-nf-teal/10 border-nf-teal/20",
  failed:"text-red-400 bg-red-400/10 border-red-400/20"
}
export const PIPELINE_STEPS=[
  {key:'idea',label:'Idea Engine',icon:' 💡',step:1},
  {key:'market',label:'Market Analysis',icon:'📊',step:2},
  {key:'product',label:'Product Build',icon:'🏗️',step:3},
  {key:'brand',label:'Brand Studio',icon:'🎨',step:4},
  {key:'landing',label:'Landing Page',icon:'💡',step:5},
  {key:'content',label:'Content Gen',icon:'📣',step:6},
  {key:'growth',label:'Growth Plan',icon:'🗺️',step:7},
  {key:'deploy',icon:'|'��',step:8,label:'Deploy'}
] as const