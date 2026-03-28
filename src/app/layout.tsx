import type { Metadata } from 'next'
import { Syne, DM_Mono } from 'next/font/google'
import { Toaster } from 'react-hot-toast'
import '@/styles/globals.css'
const syne=Syne({subsets:['latin'],variable:'--font-syne', weight:['400','800']})
const dmMono=DM_Mono({subsets:['latin'],variable:'--font-dm-mono', weight:['400']})
export const metadata:Metadata={title:{default:'NicheFlow - AI Startup Generator',template:'%s | NicheFlow'},description:'Generate niche businesses with AI'}
export default function RootLayout({children}:{children:React.ReactNode}){
  return(<html lang="en" className="dark"><body className={`${syne.variable} ${dmMono.variable} font-sans antialiased bg-nf-bg`}>{children}<Toaster position="top-right" toastOptions={{style:{background:'#1a1a24',color:'#f0f0f8',border:'1px solid #2a2a38'},success:{iconTheme:{primary:'#00d4a8',secondary:'#0a0a0f'}},error:{iconTheme:{primary:'#ff6b9d',secondary:'#0a0a0f'}}}}/></body></html>)
}