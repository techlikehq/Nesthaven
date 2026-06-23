import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Flag, Lock, X, AlertTriangle, CheckCircle2, Clock, XCircle,
  MessageCircle, RefreshCw, Home, ShieldCheck, LogOut,
  UserCheck, Building2, ChevronRight, Map, Hash,
  TrendingUp, TrendingDown, BarChart2, Settings, Bell
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell, Legend
} from 'recharts';

const API_URL = (import.meta as any).env?.VITE_API_URL || 'http://localhost:4000';

const T = {
  bg: '#F8F9FB', card: '#FFFFFF', border: '#E5E7EB', borderLight: '#F3F4F6',
  text: '#111827', textMuted: '#6B7280', textLight: '#9CA3AF',
  accent: '#6366F1', accentLight: '#EEF2FF', accentMuted: '#818CF8',
  green: '#10B981', greenLight: '#ECFDF5',
  red: '#EF4444', redLight: '#FEF2F2',
  amber: '#F59E0B', amberLight: '#FFFBEB',
  blue: '#3B82F6', blueLight: '#EFF6FF',
  purple: '#8B5CF6', purpleLight: '#F5F3FF',
};

const CHART_COLORS = ['#6366F1','#3B82F6','#10B981','#F59E0B','#8B5CF6','#EF4444'];

interface Stats { totalProperties:number; verifiedAgents:number; totalConversations:number; totalMessages:number; openReports:number; }
interface DashboardData { stats:Stats; propsByType:any[]; propsByListing:any[]; propsByNeighbourhood:any[]; recentConversations:any[]; agentPerformance:any[]; reportsByReason:any[]; }
interface Report { id:string; conversation_id:string; reported_by:'renter'|'agent'; reason:string; details:string|null; status:'open'|'reviewing'|'resolved'|'dismissed'; created_at:string; renter_name:string; conversation_status:string; agent_name:string; agent_agency:string; property_title:string|null; }
interface ConvoMessage { id:string; sender_type:'renter'|'agent'; body:string; created_at:string; }

const REASON_LABELS: Record<string,string> = {
  asked_off_platform_contact:'Off-platform contact',
  asked_off_platform_payment:'Off-platform payment',
  suspicious_behavior:'Suspicious behavior', other:'Other',
};

const STATUS_CFG: Record<string,{label:string;color:string;bg:string;icon:any}> = {
  open:{label:'Open',color:T.red,bg:T.redLight,icon:AlertTriangle},
  reviewing:{label:'Reviewing',color:T.amber,bg:T.amberLight,icon:Clock},
  resolved:{label:'Resolved',color:T.green,bg:T.greenLight,icon:CheckCircle2},
  dismissed:{label:'Dismissed',color:T.textMuted,bg:T.bg,icon:XCircle},
};

function Card({children,className='',style={}}:{children:React.ReactNode;className?:string;style?:React.CSSProperties}) {
  return <div className={className} style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:12,...style}}>{children}</div>;
}

function Badge({value,type}:{value:string;type:'up'|'down'|'neutral'}) {
  const c={up:{bg:T.greenLight,text:T.green},down:{bg:T.redLight,text:T.red},neutral:{bg:T.bg,text:T.textMuted}}[type];
  return <span style={{background:c.bg,color:c.text,fontSize:11,fontWeight:700,padding:'2px 8px',borderRadius:999,display:'inline-flex',alignItems:'center',gap:3}}>
    {type==='up'&&<TrendingUp size={10}/>}{type==='down'&&<TrendingDown size={10}/>}{value}
  </span>;
}

function ChartTooltip({active,payload,label}:any) {
  if(!active||!payload?.length) return null;
  return <div style={{background:T.text,color:'#fff',padding:'8px 12px',borderRadius:8,fontSize:12,boxShadow:'0 4px 16px rgba(0,0,0,0.2)'}}>
    <p style={{color:T.textLight,marginBottom:4}}>{label}</p>
    {payload.map((p:any,i:number)=><p key={i} style={{color:p.color??T.accent,fontWeight:600}}>{p.name}: {p.value}</p>)}
  </div>;
}

function KPICard({label,value,icon:Icon,color,bg,badge}:{label:string;value:number|string;icon:any;color:string;bg:string;badge?:{value:string;type:'up'|'down'|'neutral'}}) {
  return <Card><div style={{padding:'20px 24px'}}>
    <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:16}}>
      <div style={{width:40,height:40,borderRadius:10,background:bg,display:'flex',alignItems:'center',justifyContent:'center'}}><Icon size={18} color={color}/></div>
      {badge&&<Badge value={badge.value} type={badge.type}/>}
    </div>
    <p style={{fontSize:28,fontWeight:800,color:T.text,lineHeight:1,marginBottom:6}}>{value}</p>
    <p style={{fontSize:13,color:T.textMuted,fontWeight:500}}>{label}</p>
  </div></Card>;
}

function Sidebar({active,onNav,onLogout,openReports}:{active:string;onNav:(s:string)=>void;onLogout:()=>void;openReports:number}) {
  const nav=[
    {id:'overview',label:'Overview',icon:BarChart2},
    {id:'listings',label:'Listings',icon:Building2},
    {id:'agents',label:'Agents',icon:UserCheck},
    {id:'conversations',label:'Conversations',icon:MessageCircle},
    {id:'areas',label:'Area Intelligence',icon:Map},
    {id:'reports',label:'Reports',icon:Flag,badge:openReports},
  ];
  return <aside style={{width:220,minHeight:'100vh',background:T.card,borderRight:`1px solid ${T.border}`,display:'flex',flexDirection:'column',flexShrink:0}}>
    <div style={{padding:'24px 20px 20px',borderBottom:`1px solid ${T.borderLight}`}}>
      <div style={{display:'flex',alignItems:'center',gap:10}}>
        <div style={{width:32,height:32,background:T.accent,borderRadius:8,display:'flex',alignItems:'center',justifyContent:'center'}}><Home size={14} color="#fff"/></div>
        <div>
          <p style={{fontSize:14,fontWeight:700,color:T.text,lineHeight:1}}>NestHaven</p>
          <p style={{fontSize:10,color:T.textLight,letterSpacing:'0.08em',textTransform:'uppercase',fontFamily:'monospace'}}>Admin</p>
        </div>
      </div>
    </div>
    <nav style={{flex:1,padding:'12px 10px'}}>
      {nav.map(({id,label,icon:Icon,badge})=>{
        const isActive=active===id;
        return <button key={id} onClick={()=>onNav(id)} style={{width:'100%',display:'flex',alignItems:'center',gap:10,padding:'9px 12px',borderRadius:8,border:'none',cursor:'pointer',background:isActive?T.accentLight:'transparent',color:isActive?T.accent:T.textMuted,fontSize:13,fontWeight:isActive?600:500,marginBottom:2,transition:'all 0.15s'}}>
          <Icon size={15}/><span style={{flex:1,textAlign:'left'}}>{label}</span>
          {(badge??0)>0&&<span style={{background:T.red,color:'#fff',fontSize:10,fontWeight:700,width:18,height:18,borderRadius:'50%',display:'flex',alignItems:'center',justifyContent:'center'}}>{badge}</span>}
        </button>;
      })}
    </nav>
    <div style={{padding:'10px 10px 20px',borderTop:`1px solid ${T.borderLight}`}}>
      <button style={{width:'100%',display:'flex',alignItems:'center',gap:10,padding:'9px 12px',borderRadius:8,border:'none',cursor:'pointer',background:'transparent',color:T.textMuted,fontSize:13,fontWeight:500,marginBottom:2}}><Settings size={15}/>Settings</button>
      <button onClick={onLogout} style={{width:'100%',display:'flex',alignItems:'center',gap:10,padding:'9px 12px',borderRadius:8,border:'none',cursor:'pointer',background:'transparent',color:T.textMuted,fontSize:13,fontWeight:500}}><LogOut size={15}/>Sign out</button>
    </div>
  </aside>;
}

function SectionHeader({eyebrow,title,subtitle}:{eyebrow:string;title:string;subtitle?:string}) {
  return <div style={{marginBottom:24}}>
    <p style={{fontSize:11,fontWeight:700,color:T.accent,letterSpacing:'0.1em',textTransform:'uppercase',marginBottom:4}}>{eyebrow}</p>
    <h1 style={{fontSize:22,fontWeight:800,color:T.text,lineHeight:1.2,margin:0}}>{title}</h1>
    {subtitle&&<p style={{fontSize:13,color:T.textMuted,marginTop:4}}>{subtitle}</p>}
  </div>;
}

function Overview({data,loading}:{data:DashboardData|null;loading:boolean}) {
  if(loading||!data) return <div style={{display:'flex',alignItems:'center',justifyContent:'center',height:300}}><p style={{fontSize:14,color:T.textMuted}}>Loading real-time data...</p></div>;
  const{stats}=data;
  return <div>
    <SectionHeader eyebrow="Platform Overview" title="Dashboard" subtitle="Live data from your NestHaven database — all metrics are real."/>
    <div style={{display:'grid',gridTemplateColumns:'repeat(5,1fr)',gap:16,marginBottom:28}}>
      <KPICard label="Total Properties" value={stats.totalProperties} icon={Building2} color={T.accent} bg={T.accentLight}/>
      <KPICard label="Verified Agents" value={stats.verifiedAgents} icon={UserCheck} color={T.blue} bg={T.blueLight}/>
      <KPICard label="Total Chats" value={stats.totalConversations} icon={MessageCircle} color={T.green} bg={T.greenLight}/>
      <KPICard label="Total Messages" value={stats.totalMessages} icon={Hash} color={T.purple} bg={T.purpleLight}/>
      <KPICard label="Open Reports" value={stats.openReports} icon={Flag} color={stats.openReports>0?T.red:T.green} bg={stats.openReports>0?T.redLight:T.greenLight} badge={stats.openReports>0?{value:'Needs review',type:'down'}:{value:'All clear',type:'up'}}/>
    </div>
    <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:20,marginBottom:20}}>
      <Card><div style={{padding:'20px 24px 16px'}}>
        <p style={{fontSize:14,fontWeight:700,color:T.text,marginBottom:2}}>Listings by Neighbourhood</p>
        <p style={{fontSize:12,color:T.textMuted,marginBottom:20}}>Port Harcourt — live from database</p>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={data.propsByNeighbourhood.map(d=>({name:d.name.split(' ')[0],count:parseInt(d.count)}))} barSize={32}>
            <CartesianGrid strokeDasharray="3 3" stroke={T.borderLight} vertical={false}/>
            <XAxis dataKey="name" tick={{fontSize:11,fill:T.textLight}} axisLine={false} tickLine={false}/>
            <YAxis tick={{fontSize:11,fill:T.textLight}} axisLine={false} tickLine={false} allowDecimals={false} width={24}/>
            <Tooltip content={<ChartTooltip/>} cursor={{fill:T.accentLight}}/>
            <Bar dataKey="count" name="Listings" fill={T.accent} radius={[4,4,0,0]}/>
          </BarChart>
        </ResponsiveContainer>
      </div></Card>
      <Card><div style={{padding:'20px 24px 16px'}}>
        <p style={{fontSize:14,fontWeight:700,color:T.text,marginBottom:2}}>Property Type Mix</p>
        <p style={{fontSize:12,color:T.textMuted,marginBottom:20}}>Distribution across all listings</p>
        <ResponsiveContainer width="100%" height={220}>
          <PieChart>
            <Pie data={data.propsByType.map(d=>({name:d.property_type,value:parseInt(d.count)}))} cx="50%" cy="45%" outerRadius={80} innerRadius={40} dataKey="value" paddingAngle={2}>
              {data.propsByType.map((_,i)=><Cell key={i} fill={CHART_COLORS[i%CHART_COLORS.length]}/>)}
            </Pie>
            <Tooltip content={<ChartTooltip/>}/><Legend wrapperStyle={{fontSize:11,color:T.textMuted}}/>
          </PieChart>
        </ResponsiveContainer>
      </div></Card>
    </div>
    <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:20,marginBottom:20}}>
      <Card><div style={{padding:'20px 24px 16px'}}>
        <p style={{fontSize:14,fontWeight:700,color:T.text,marginBottom:2}}>Listing Type Split</p>
        <p style={{fontSize:12,color:T.textMuted,marginBottom:20}}>Rent / Sale / Shortlet breakdown</p>
        <ResponsiveContainer width="100%" height={160}>
          <BarChart data={data.propsByListing.map(d=>({name:d.listing_type,count:parseInt(d.count)}))} barSize={44} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" stroke={T.borderLight} horizontal={false}/>
            <XAxis type="number" tick={{fontSize:11,fill:T.textLight}} axisLine={false} tickLine={false} allowDecimals={false}/>
            <YAxis type="category" dataKey="name" tick={{fontSize:12,fill:T.textMuted}} axisLine={false} tickLine={false} width={54}/>
            <Tooltip content={<ChartTooltip/>} cursor={{fill:T.borderLight}}/>
            <Bar dataKey="count" name="Properties" radius={[0,4,4,0]}>
              {data.propsByListing.map((d,i)=><Cell key={i} fill={d.listing_type==='Rent'?T.blue:d.listing_type==='Sale'?T.accent:T.green}/>)}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div></Card>
      <Card><div style={{padding:'20px 24px 16px'}}>
        <p style={{fontSize:14,fontWeight:700,color:T.text,marginBottom:2}}>Reports by Reason</p>
        <p style={{fontSize:12,color:T.textMuted,marginBottom:20}}>Flagged conversation breakdown</p>
        {data.reportsByReason.length===0
          ?<div style={{height:160,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',gap:8}}><ShieldCheck size={28} color={T.green}/><p style={{fontSize:13,color:T.textMuted}}>No reports — platform is clean</p></div>
          :<ResponsiveContainer width="100%" height={160}>
            <BarChart data={data.reportsByReason.map(d=>({name:REASON_LABELS[d.reason]??d.reason,count:parseInt(d.count)}))} barSize={28}>
              <CartesianGrid strokeDasharray="3 3" stroke={T.borderLight} vertical={false}/>
              <XAxis dataKey="name" tick={{fontSize:10,fill:T.textLight}} axisLine={false} tickLine={false}/>
              <YAxis tick={{fontSize:11,fill:T.textLight}} axisLine={false} tickLine={false} allowDecimals={false} width={24}/>
              <Tooltip content={<ChartTooltip/>} cursor={{fill:T.redLight}}/>
              <Bar dataKey="count" name="Reports" fill={T.red} radius={[4,4,0,0]} opacity={0.85}/>
            </BarChart>
          </ResponsiveContainer>
        }
      </div></Card>
    </div>
    <Card style={{marginBottom:20}}>
      <div style={{padding:'20px 24px 0'}}>
        <p style={{fontSize:14,fontWeight:700,color:T.text,marginBottom:2}}>Agent Performance</p>
        <p style={{fontSize:12,color:T.textMuted,marginBottom:20}}>All agents — live data from database</p>
      </div>
      <table style={{width:'100%',borderCollapse:'collapse'}}>
        <thead><tr style={{borderBottom:`1px solid ${T.borderLight}`}}>
          {['Agent','Agency','Rating','Total Deals','Active Chats','Status'].map(h=>(
            <th key={h} style={{textAlign:h==='Agent'||h==='Agency'?'left':'right',fontSize:11,fontWeight:700,color:T.textLight,letterSpacing:'0.06em',textTransform:'uppercase',padding:'8px 24px 12px'}}>{h}</th>
          ))}
        </tr></thead>
        <tbody>{data.agentPerformance.map((agent:any,i:number)=>(
          <tr key={agent.id} style={{borderBottom:i<data.agentPerformance.length-1?`1px solid ${T.borderLight}`:'none'}}>
            <td style={{padding:'14px 24px'}}>
              <div style={{display:'flex',alignItems:'center',gap:10}}>
                <div style={{width:32,height:32,borderRadius:'50%',background:T.accentLight,overflow:'hidden',flexShrink:0}}>
                  <img src={agent.photo_url} alt={agent.name} style={{width:'100%',height:'100%',objectFit:'cover'}} onError={(e)=>{(e.target as HTMLImageElement).style.display='none';}}/>
                </div>
                <span style={{fontSize:13,fontWeight:600,color:T.text}}>{agent.name}</span>
              </div>
            </td>
            <td style={{padding:'14px 24px',fontSize:12,color:T.textMuted}}>{agent.agency}</td>
            <td style={{padding:'14px 24px',textAlign:'right'}}><span style={{fontSize:13,fontWeight:700,color:T.amber}}>{agent.rating}</span></td>
            <td style={{padding:'14px 24px',textAlign:'right',fontSize:13,fontWeight:600,color:T.text}}>{agent.deals_count}</td>
            <td style={{padding:'14px 24px',textAlign:'right',fontSize:13,color:T.textMuted}}>{agent.conversations}</td>
            <td style={{padding:'14px 24px',textAlign:'right'}}>
              {agent.verified
                ?<span style={{fontSize:11,fontWeight:600,color:T.green,background:T.greenLight,padding:'3px 10px',borderRadius:999,display:'inline-flex',alignItems:'center',gap:4}}><ShieldCheck size={10}/>Verified</span>
                :<span style={{fontSize:11,fontWeight:600,color:T.textMuted,background:T.bg,padding:'3px 10px',borderRadius:999}}>Unverified</span>
              }
            </td>
          </tr>
        ))}</tbody>
      </table>
      <div style={{height:8}}/>
    </Card>
    {data.recentConversations.length>0&&<Card>
      <div style={{padding:'20px 24px 0'}}>
        <p style={{fontSize:14,fontWeight:700,color:T.text,marginBottom:2}}>Recent Conversations</p>
        <p style={{fontSize:12,color:T.textMuted,marginBottom:20}}>Latest chat activity</p>
      </div>
      {data.recentConversations.map((c:any)=>(
        <div key={c.id} style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'12px 24px',borderTop:`1px solid ${T.borderLight}`}}>
          <div>
            <p style={{fontSize:13,fontWeight:600,color:T.text}}>{c.renter_name} <span style={{color:T.textLight,fontWeight:400}}>with</span> {c.agent_name}</p>
            {c.property_title&&<p style={{fontSize:12,color:T.textMuted,marginTop:2}}>{c.property_title}</p>}
          </div>
          <div style={{display:'flex',alignItems:'center',gap:12}}>
            <span style={{fontSize:11,color:T.textLight,fontFamily:'monospace'}}>{new Date(c.created_at).toLocaleDateString()}</span>
            <span style={{fontSize:11,fontWeight:600,padding:'3px 10px',borderRadius:999,color:c.status==='active'?T.green:c.status==='disputed'?T.red:T.textMuted,background:c.status==='active'?T.greenLight:c.status==='disputed'?T.redLight:T.bg}}>{c.status}</span>
          </div>
        </div>
      ))}
      <div style={{height:8}}/>
    </Card>}
  </div>;
}

function ReportsSection({adminKey,onRefresh}:{adminKey:string;onRefresh:()=>void}) {
  const[reports,setReports]=useState<Report[]>([]);
  const[loading,setLoading]=useState(true);
  const[filter,setFilter]=useState('open');
  const[activeReport,setActiveReport]=useState<Report|null>(null);
  const[convoMessages,setConvoMessages]=useState<ConvoMessage[]>([]);
  const[loadingMessages,setLoadingMessages]=useState(false);

  const fetchReports=useCallback(async()=>{
    setLoading(true);
    try{const res=await fetch(`${API_URL}/api/admin/reports`,{headers:{'x-admin-key':adminKey}});setReports(await res.json());}
    catch(err){console.error(err);}finally{setLoading(false);}
  },[adminKey]);

  useEffect(()=>{fetchReports();},[fetchReports]);

  const openReport=async(report:Report)=>{
    setActiveReport(report);setLoadingMessages(true);
    try{const res=await fetch(`${API_URL}/api/admin/reports/${report.id}/messages`,{headers:{'x-admin-key':adminKey}});setConvoMessages(await res.json());}
    catch(err){console.error(err);}finally{setLoadingMessages(false);}
  };

  const updateStatus=async(reportId:string,status:string)=>{
    await fetch(`${API_URL}/api/admin/reports/${reportId}`,{method:'PATCH',headers:{'Content-Type':'application/json','x-admin-key':adminKey},body:JSON.stringify({status})});
    setReports(prev=>prev.map(r=>r.id===reportId?{...r,status:status as Report['status']}:r));
    if(activeReport?.id===reportId) setActiveReport(prev=>prev?{...prev,status:status as Report['status']}:prev);
  };

  const filtered=filter==='all'?reports:reports.filter(r=>r.status===filter);
  const counts={open:reports.filter(r=>r.status==='open').length,reviewing:reports.filter(r=>r.status==='reviewing').length,resolved:reports.filter(r=>r.status==='resolved').length,dismissed:reports.filter(r=>r.status==='dismissed').length};

  return <div>
    <div style={{display:'flex',alignItems:'flex-start',justifyContent:'space-between',marginBottom:24}}>
      <SectionHeader eyebrow="Trust & Safety" title="Reports" subtitle="Flagged conversations requiring review."/>
      <button onClick={()=>{fetchReports();onRefresh();}} style={{display:'flex',alignItems:'center',gap:6,padding:'8px 14px',border:`1px solid ${T.border}`,borderRadius:8,background:T.card,fontSize:12,fontWeight:600,color:T.textMuted,cursor:'pointer'}}>
        <RefreshCw size={12}/>Refresh
      </button>
    </div>
    <div style={{display:'flex',gap:8,marginBottom:20,flexWrap:'wrap'}}>
      {['open','reviewing','resolved','dismissed','all'].map(s=>{
        const isActive=filter===s;const count=s==='all'?reports.length:counts[s as keyof typeof counts];
        return <button key={s} onClick={()=>setFilter(s)} style={{padding:'6px 14px',borderRadius:8,border:`1px solid ${isActive?T.accent:T.border}`,background:isActive?T.accentLight:T.card,cursor:'pointer',fontSize:12,fontWeight:600,color:isActive?T.accent:T.textMuted}}>
          {s==='all'?'All':STATUS_CFG[s].label} ({count})
        </button>;
      })}
    </div>
    {loading&&<p style={{fontSize:13,color:T.textMuted}}>Loading reports...</p>}
    {!loading&&filtered.length===0&&<Card><div style={{padding:'64px 24px',textAlign:'center'}}><ShieldCheck size={28} color={T.green} style={{marginBottom:12}}/><p style={{fontSize:13,color:T.textMuted}}>No {filter!=='all'?STATUS_CFG[filter]?.label.toLowerCase():''} reports.</p></div></Card>}
    <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:16}}>
      {filtered.map(report=>{
        const cfg=STATUS_CFG[report.status];const Icon=cfg.icon;
        return <button key={report.id} onClick={()=>openReport(report)} style={{textAlign:'left',background:T.card,border:`1px solid ${T.border}`,borderRadius:12,padding:'18px 20px',cursor:'pointer',width:'100%'}}>
          <div style={{display:'flex',justifyContent:'space-between',marginBottom:12}}>
            <span style={{display:'inline-flex',alignItems:'center',gap:5,fontSize:10,fontWeight:700,letterSpacing:'0.07em',textTransform:'uppercase',padding:'3px 10px',borderRadius:999,color:cfg.color,background:cfg.bg}}><Icon size={9}/>{cfg.label}</span>
            <span style={{fontSize:11,color:T.textLight,fontFamily:'monospace'}}>{new Date(report.created_at).toLocaleDateString()}</span>
          </div>
          <p style={{fontSize:13,fontWeight:700,color:T.text,marginBottom:4}}>{REASON_LABELS[report.reason]??report.reason}</p>
          <p style={{fontSize:12,color:T.textMuted,marginBottom:14}}>Reported by <span style={{fontWeight:600,color:T.text}}>{report.reported_by}</span></p>
          <div style={{borderTop:`1px solid ${T.borderLight}`,paddingTop:12,display:'flex',justifyContent:'space-between',alignItems:'center'}}>
            <span style={{fontSize:11,color:T.textMuted}}>{report.renter_name} ↔ {report.agent_name}</span>
            <ChevronRight size={13} color={T.textLight}/>
          </div>
        </button>;
      })}
    </div>
    <AnimatePresence>
      {activeReport&&<>
        <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} style={{position:'fixed',inset:0,background:'rgba(0,0,0,0.4)',zIndex:100}} onClick={()=>setActiveReport(null)}/>
        <motion.div initial={{x:'100%'}} animate={{x:0}} exit={{x:'100%'}} transition={{type:'spring',damping:32,stiffness:320}} style={{position:'fixed',right:0,top:0,bottom:0,width:480,background:T.card,zIndex:101,display:'flex',flexDirection:'column',boxShadow:'-4px 0 40px rgba(0,0,0,0.12)'}}>
          <div style={{padding:'20px 24px',borderBottom:`1px solid ${T.border}`,display:'flex',justifyContent:'space-between',alignItems:'center'}}>
            <p style={{fontSize:15,fontWeight:700,color:T.text}}>Report Details</p>
            <button onClick={()=>setActiveReport(null)} style={{background:'none',border:'none',cursor:'pointer',color:T.textMuted,padding:4}}><X size={16}/></button>
          </div>
          <div style={{padding:'20px 24px',borderBottom:`1px solid ${T.border}`}}>
            <div style={{marginBottom:16}}><p style={{fontSize:11,fontWeight:700,color:T.textLight,letterSpacing:'0.06em',textTransform:'uppercase',marginBottom:4}}>Reason</p><p style={{fontSize:14,fontWeight:600,color:T.text}}>{REASON_LABELS[activeReport.reason]??activeReport.reason}</p></div>
            {activeReport.details&&<div style={{marginBottom:16}}><p style={{fontSize:11,fontWeight:700,color:T.textLight,letterSpacing:'0.06em',textTransform:'uppercase',marginBottom:4}}>Details</p><p style={{fontSize:13,color:T.textMuted}}>{activeReport.details}</p></div>}
            <div style={{display:'flex',gap:32,marginBottom:16}}>
              <div><p style={{fontSize:11,fontWeight:700,color:T.textLight,letterSpacing:'0.06em',textTransform:'uppercase',marginBottom:4}}>Renter</p><p style={{fontSize:13,fontWeight:600,color:T.text}}>{activeReport.renter_name}</p></div>
              <div><p style={{fontSize:11,fontWeight:700,color:T.textLight,letterSpacing:'0.06em',textTransform:'uppercase',marginBottom:4}}>Agent</p><p style={{fontSize:13,fontWeight:600,color:T.text}}>{activeReport.agent_name}</p><p style={{fontSize:11,color:T.textMuted}}>{activeReport.agent_agency}</p></div>
            </div>
            <div><p style={{fontSize:11,fontWeight:700,color:T.textLight,letterSpacing:'0.06em',textTransform:'uppercase',marginBottom:8}}>Update Status</p>
              <div style={{display:'flex',gap:8,flexWrap:'wrap'}}>
                {Object.keys(STATUS_CFG).map(status=>{const isActive=activeReport.status===status;return <button key={status} onClick={()=>updateStatus(activeReport.id,status)} style={{padding:'6px 12px',borderRadius:8,cursor:'pointer',fontSize:12,fontWeight:600,border:`1px solid ${isActive?T.text:T.border}`,background:isActive?T.text:T.card,color:isActive?'#fff':T.textMuted,transition:'all 0.15s'}}>{STATUS_CFG[status].label}</button>;})}
              </div>
            </div>
          </div>
          <div style={{padding:'12px 24px',borderBottom:`1px solid ${T.border}`}}>
            <p style={{fontSize:11,fontWeight:700,color:T.textLight,letterSpacing:'0.06em',textTransform:'uppercase',display:'flex',alignItems:'center',gap:6}}><MessageCircle size={11}/>Full Conversation</p>
          </div>
          <div style={{flex:1,overflowY:'auto',padding:'16px 24px',background:T.bg,display:'flex',flexDirection:'column',gap:10}}>
            {loadingMessages&&<p style={{fontSize:13,color:T.textMuted,textAlign:'center',paddingTop:32}}>Loading...</p>}
            {!loadingMessages&&convoMessages.map(m=>(
              <div key={m.id} style={{display:'flex',justifyContent:m.sender_type==='renter'?'flex-end':'flex-start'}}>
                <div style={{maxWidth:'78%',padding:'10px 14px',borderRadius:12,fontSize:13,background:m.sender_type==='renter'?T.text:T.card,color:m.sender_type==='renter'?'#fff':T.text,border:m.sender_type==='agent'?`1px solid ${T.border}`:'none',borderBottomRightRadius:m.sender_type==='renter'?4:12,borderBottomLeftRadius:m.sender_type==='agent'?4:12}}>
                  <p style={{fontSize:9,fontWeight:700,letterSpacing:'0.08em',textTransform:'uppercase',opacity:0.5,marginBottom:4}}>{m.sender_type}</p>
                  {m.body}
                  <p style={{fontSize:10,opacity:0.4,marginTop:4}}>{new Date(m.created_at).toLocaleString([],{dateStyle:'short',timeStyle:'short'})}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </>}
    </AnimatePresence>
  </div>;
}

function PlaceholderSection({eyebrow,title,description,icon:Icon}:{eyebrow:string;title:string;description:string;icon:any}) {
  return <div>
    <SectionHeader eyebrow={eyebrow} title={title}/>
    <Card><div style={{padding:'80px 40px',textAlign:'center'}}>
      <Icon size={32} color={T.textLight} style={{marginBottom:16}}/>
      <p style={{fontSize:14,fontWeight:600,color:T.textMuted,marginBottom:8}}>{title} management</p>
      <p style={{fontSize:13,color:T.textLight,maxWidth:360,margin:'0 auto',lineHeight:1.6}}>{description}</p>
      <span style={{display:'inline-block',marginTop:20,fontSize:11,fontWeight:700,color:T.accent,background:T.accentLight,padding:'5px 14px',borderRadius:999}}>Coming soon</span>
    </div></Card>
  </div>;
}

function AdminGate({onUnlock}:{onUnlock:(key:string)=>void}) {
  const[key,setKey]=useState('');const[error,setError]=useState(false);const[loading,setLoading]=useState(false);
  const handleSubmit=async(e:React.FormEvent)=>{
    e.preventDefault();setLoading(true);
    try{const res=await fetch(`${API_URL}/api/admin/reports`,{headers:{'x-admin-key':key}});if(res.ok){sessionStorage.setItem('nh_admin_key',key);onUnlock(key);}else setError(true);}
    finally{setLoading(false);}
  };
  return <div style={{minHeight:'100vh',background:T.bg,display:'flex',alignItems:'center',justifyContent:'center',padding:24}}>
    <div style={{width:'100%',maxWidth:360}}>
      <div style={{textAlign:'center',marginBottom:32}}>
        <div style={{width:48,height:48,background:T.accent,borderRadius:12,display:'flex',alignItems:'center',justifyContent:'center',margin:'0 auto 16px'}}><Lock size={20} color="#fff"/></div>
        <h1 style={{fontSize:22,fontWeight:800,color:T.text,marginBottom:8}}>Admin Console</h1>
        <p style={{fontSize:14,color:T.textMuted}}>NestHaven · Restricted access</p>
      </div>
      <motion.form onSubmit={handleSubmit} initial={{opacity:0,y:16}} animate={{opacity:1,y:0}}>
        <Card style={{padding:28}}>
          <label style={{fontSize:12,fontWeight:600,color:T.textMuted,display:'block',marginBottom:8}}>Admin Key</label>
          <input type="password" value={key} onChange={e=>{setKey(e.target.value);setError(false);}} placeholder="Enter your admin key"
            style={{width:'100%',border:`1px solid ${error?T.red:T.border}`,borderRadius:8,padding:'10px 14px',fontSize:14,color:T.text,outline:'none',background:T.card,marginBottom:error?8:16,boxSizing:'border-box'}}/>
          {error&&<p style={{fontSize:12,color:T.red,marginBottom:16}}>Incorrect key. Try again.</p>}
          <button type="submit" disabled={loading} style={{width:'100%',padding:'11px 0',background:T.accent,color:'#fff',border:'none',borderRadius:8,fontSize:14,fontWeight:700,cursor:'pointer',opacity:loading?0.7:1}}>
            {loading?'Verifying...':'Unlock Dashboard'}
          </button>
        </Card>
      </motion.form>
    </div>
  </div>;
}

export default function AdminDashboard() {
  const[adminKey,setAdminKey]=useState<string|null>(()=>sessionStorage.getItem('nh_admin_key'));
  const[data,setData]=useState<DashboardData|null>(null);
  const[loading,setLoading]=useState(true);
  const[section,setSection]=useState('overview');

  const fetchData=useCallback(async(key:string)=>{
    setLoading(true);
    try{const res=await fetch(`${API_URL}/api/admin/stats`,{headers:{'x-admin-key':key}});if(!res.ok){sessionStorage.removeItem('nh_admin_key');setAdminKey(null);return;}setData(await res.json());}
    catch(err){console.error(err);}finally{setLoading(false);}
  },[]);

  useEffect(()=>{if(adminKey)fetchData(adminKey);},[adminKey,fetchData]);
  const handleLogout=()=>{sessionStorage.removeItem('nh_admin_key');setAdminKey(null);};
  if(!adminKey) return <AdminGate onUnlock={setAdminKey}/>;
  const openReports=data?.stats.openReports??0;

  const renderSection=()=>{
    switch(section){
      case 'overview': return <Overview data={data} loading={loading}/>;
      case 'reports': return <ReportsSection adminKey={adminKey} onRefresh={()=>fetchData(adminKey)}/>;
      case 'listings': return <PlaceholderSection eyebrow="Listings" title="Listings Management" description="View all active property listings, remove flagged entries, and manage listing status." icon={Building2}/>;
      case 'agents': return <PlaceholderSection eyebrow="Agents" title="Agent Management" description="Review and approve agent verification documents, manage accounts, and view performance metrics." icon={UserCheck}/>;
      case 'conversations': return <PlaceholderSection eyebrow="Conversations" title="Conversation Monitor" description="Monitor flagged conversations and auto-detected suspicious message patterns across the platform." icon={MessageCircle}/>;
      case 'areas': return <PlaceholderSection eyebrow="Area Intelligence" title="Area Score Editor" description="Update neighbourhood scores, flood risk data, power/water ratings, and amenity scores for Port Harcourt areas." icon={Map}/>;
      default: return <Overview data={data} loading={loading}/>;
    }
  };

  return <div style={{display:'flex',minHeight:'100vh',background:T.bg,fontFamily:'Inter,Geist,system-ui,sans-serif'}}>
    <Sidebar active={section} onNav={setSection} onLogout={handleLogout} openReports={openReports}/>
    <main style={{flex:1,overflowY:'auto'}}>
      <div style={{position:'sticky',top:0,zIndex:10,background:'rgba(248,249,251,0.9)',backdropFilter:'blur(8px)',borderBottom:`1px solid ${T.border}`,padding:'12px 32px',display:'flex',alignItems:'center',justifyContent:'space-between'}}>
        <p style={{fontSize:12,color:T.textLight,textTransform:'capitalize'}}>{section}</p>
        <div style={{display:'flex',alignItems:'center',gap:8}}>
          <button onClick={()=>fetchData(adminKey)} style={{display:'flex',alignItems:'center',justifyContent:'center',width:32,height:32,border:`1px solid ${T.border}`,borderRadius:8,background:T.card,cursor:'pointer',color:T.textMuted}}><RefreshCw size={14}/></button>
          <button style={{position:'relative',display:'flex',alignItems:'center',justifyContent:'center',width:32,height:32,border:`1px solid ${T.border}`,borderRadius:8,background:T.card,cursor:'pointer',color:T.textMuted}}>
            <Bell size={15}/>{openReports>0&&<span style={{position:'absolute',top:6,right:6,width:6,height:6,background:T.red,borderRadius:'50%'}}/>}
          </button>
          <div style={{display:'flex',alignItems:'center',gap:8,padding:'6px 12px',border:`1px solid ${T.border}`,borderRadius:8,background:T.card}}>
            <div style={{width:22,height:22,borderRadius:6,background:T.accent,display:'flex',alignItems:'center',justifyContent:'center'}}><ShieldCheck size={11} color="#fff"/></div>
            <span style={{fontSize:12,fontWeight:600,color:T.text}}>Admin</span>
          </div>
        </div>
      </div>
      <div style={{padding:'32px'}}>
        <AnimatePresence mode="wait">
          <motion.div key={section} initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-4}} transition={{duration:0.15}}>
            {renderSection()}
          </motion.div>
        </AnimatePresence>
      </div>
    </main>
  </div>;
}
