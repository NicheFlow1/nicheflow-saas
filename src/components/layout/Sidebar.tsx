"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
const NAV=[{section:"Discover",items:[{href:"/dashboard",label:"Dashboard",icon:"#"},{href:"/daily-picks",label:"Daily Picks",icon:"star",badge:"NEW"},{href:"/trending",label:"Trending Now",icon:"up",badge:"HOT"},{href:"/watchlist",label:"My Watchlist",icon:"o"}]},{section:"Research",items:[{href:"/validate",label:"Validate Trend",icon:"v"},{href:"/radar",label:"Market Radar",icon:"r"},{href:"/audience",label:"Audience Intel",icon:"a",badge:"NEW"},{href:"/generator",label:"Intelligence Engine",icon:"g"},{href:"/dashboard/keywords",label:"Keyword Clusters",icon:"k"}]},{section:"Build",items:[{href:"/dashboard/starter",label:"Starter Kit",icon:"s"},{href:"/content",label:"Content Studio",icon:"c"},{href:"/autopilot",label:"Autopilot",icon:"p"},{href:"/ai-chat",label:"AI Assistant",icon:"ai"}]},{section:"Account",items:[{href:"/projects",label:"Past Reports",icon:"f"},{href:"/settings",label:"Settings",icon:"set"},{href:"/settings/billing",label:"Billing",icon:"$"}]}];
export default function Sidebar({profile}:{profile?:any}){
  const pathname=usePathname();
  const used=profile?.generations_used||0;
  const limit=profile?.generations_limit||7;
  const pct=Math.min(100,Math.round((used/limit)*100));
  const plan=(profile?.plan||"free").toUpperCase();
  return(
    <aside style={{width:240,minHeight:"100vh",background:"#0a0b10",borderRight:"1px solid #1e2130",display:"flex",flexDirection:"column",flexShrink:0,position:"sticky",top:0,height:"100vh",overflowY:"auto"}}>
      <div style={{padding:"20px 16px 16px",borderBottom:"1px solid #1e2130"}}>
        <div style={{display:"flex",alignItems:"center",gap:10}}>
          <div style={{width:34,height:34,borderRadius:10,background:"linear-gradient(135deg,#6366f1,#8b5cf6)",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,fontSize:16,color:"white",fontWeight:800}}>N</div>
          <div>
            <div style={{fontSize:15,fontWeight:800,color:"#f0f1f5",letterSpacing:"-0.02em",lineHeight:1.1}}>NicheFlow</div>
            <div style={{fontSize:9,fontWeight:700,color:"#6b7194",letterSpacing:"0.12em",textTransform:"uppercase"}}>AI SCOUT</div>
          </div>
        </div>
      </div>
      <nav style={{flex:1,padding:"8px"}}>
        {NAV.map(section=>(
          <div key={section.section} style={{marginBottom:4}}>
            <div style={{fontSize:10,fontWeight:700,color:"#3d4160",letterSpacing:"0.1em",textTransform:"uppercase",padding:"10px 8px 4px"}}>{section.section}</div>
            {section.items.map((item:any)=>{
              const active=pathname===item.href||(item.href!=="/dashboard"&&pathname?.startsWith(item.href));
              return(
                <Link key={item.href} href={item.href} style={{display:"flex",alignItems:"center",gap:10,padding:"7px 10px",borderRadius:8,marginBottom:1,textDecoration:"none",background:active?"rgba(99,102,241,0.12)":"transparent",color:active?"#a5b4fc":"#6b7194",fontWeight:active?600:400,fontSize:13,transition:"all 0.15s"}}>
                  <span style={{fontSize:11,width:16,textAlign:"center",color:active?"#818cf8":"#4b5280",flexShrink:0}}>{item.icon}</span>
                  <span style={{flex:1}}>{item.label}</span>
                  {item.badge&&<span style={{fontSize:9,fontWeight:700,background:item.badge==="HOT"?"rgba(245,158,11,0.2)":"rgba(16,185,129,0.2)",color:item.badge==="HOT"?"#f59e0b":"#10b981",padding:"2px 6px",borderRadius:6}}>{item.badge}</span>}
                </Link>
              );
            })}
          </div>
        ))}
      </nav>
      <div style={{padding:"12px 16px 16px",borderTop:"1px solid #1e2130"}}>
        <div style={{display:"flex",justifyContent:"space-between",fontSize:11,color:"#6b7194",marginBottom:6}}>
          <span style={{fontWeight:600,color:"#4b5280",textTransform:"uppercase",letterSpacing:"0.05em"}}>{plan}</span>
          <span>{used}/{limit}</span>
        </div>
        <div style={{height:4,background:"#1e2130",borderRadius:2,overflow:"hidden",marginBottom:10}}>
          <div style={{height:"100%",width:pct+"%",background:used>=limit?"#ef4444":"linear-gradient(90deg,#6366f1,#8b5cf6)",borderRadius:2}}/>
        </div>
        <Link href="/settings/billing" style={{fontSize:12,color:"#7c3aed",textDecoration:"none",fontWeight:600,display:"block",marginBottom:8}}>Upgrade to Pro</Link>
      </div>
    </aside>
  );
}
