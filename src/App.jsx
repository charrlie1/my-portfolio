import React, { useState, useEffect, useRef } from 'react';
import {
  BookOpen, Mail, Github, Linkedin, ArrowUpRight,
  Sigma, Menu, X, ExternalLink, ChevronUp
} from 'lucide-react';

if (typeof window !== 'undefined') window.tailwind = window.tailwind || { config: {} };

// ─── Theme ────────────────────────────────────────────────────────────────────
const C = {
  bg:       '#0a0a0a',
  panel:    '#111111',
  border:   '#1f1f1f',
  borderHi: '#333333',
  accent:   '#ffffff',
  dim:      '#404040',
  muted:    '#525252',
  sub:      '#737373',
  text:     '#d4d4d4',
  textHi:   '#f5f5f5',
};

// ─── Anthropic AI Chat ────────────────────────────────────────────────────────
const SYS_PROMPT = `You are the AI assistant for Charles Toluwanimi Abodunrin, a Bachelor of Engineering student in Electrical & Electronic Engineering at Obafemi Awolowo University (OAU), Ile-Ife, Nigeria.
Charles has a deep focus on Mathematical Analysis, Real and Complex Analysis, Linear Algebra, and Embedded Systems.
His key projects include an ESP32-CAM Smart Doorbell System utilizing FreeRTOS and the Telegram API.
His publications include: "The Lobachevsky Integral Identity", "Integral Representation of the Dirichlet Eta Function", "The Cayley-Hamilton Theorem".
Be concise, rigorous, and professional. Keep answers under 3 sentences unless technical details are requested.`;

const AiChat = () => {
  const [open, setOpen]       = useState(false);
  const [visible, setVisible] = useState(false);
  const [msgs, setMsgs]       = useState([{ role:'assistant', content:"Hello. I'm Charles's AI assistant — ask me about his research, publications, or engineering projects." }]);
  const [input, setInput]     = useState('');
  const [loading, setLoading] = useState(false);
  const endRef = useRef(null);

  useEffect(() => { if (open) setTimeout(() => setVisible(true), 10); else setVisible(false); }, [open]);
  useEffect(() => { endRef.current?.scrollIntoView({ behavior:'smooth' }); }, [msgs, loading]);

  const send = async () => {
    if (!input.trim() || loading) return;
    const userMsg = { role:'user', content: input.trim() };
    const history = [...msgs, userMsg];
    setMsgs(history);
    setInput('');
    setLoading(true);
    try {
      const res = await fetch('https://api.anthropic.com/v1/messages', {
        method:'POST',
        headers:{ 'Content-Type':'application/json' },
        body: JSON.stringify({
          model:'claude-sonnet-4-6',
          max_tokens:1000,
          system: SYS_PROMPT,
          messages: history.map(m => ({ role:m.role, content:m.content }))
        })
      });
      const data = await res.json();
      const reply = data.content?.[0]?.text || 'Unable to respond. Please try again.';
      setMsgs(p => [...p, { role:'assistant', content:reply }]);
    } catch {
      setMsgs(p => [...p, { role:'assistant', content:'Connection error. Please try again.' }]);
    }
    setLoading(false);
  };

  return (
    <>
      <style>{`
        @keyframes msg-in { from{opacity:0;transform:translateY(5px)} to{opacity:1;transform:translateY(0)} }
        @keyframes blink   { 0%,100%{opacity:0.2;transform:scale(0.7)} 50%{opacity:1;transform:scale(1.1)} }
      `}</style>
      <div style={{
        position:'fixed', bottom:76, right:20,
        width:'min(340px,calc(100vw - 32px))', height:440,
        zIndex:200, display:'flex', flexDirection:'column',
        background:C.panel, border:`1px solid ${C.borderHi}`,
        boxShadow:'0 24px 80px rgba(0,0,0,0.95)',
        opacity:visible?1:0, transform:visible?'translateY(0)':'translateY(14px)',
        transition:'opacity 0.3s ease, transform 0.3s ease',
        pointerEvents:open?'all':'none',
      }}>
        <div style={{padding:'11px 15px',borderBottom:`1px solid ${C.border}`,display:'flex',justifyContent:'space-between',alignItems:'center',background:C.bg}}>
          <div>
            <p style={{margin:0,fontSize:9,fontFamily:'monospace',color:C.accent,letterSpacing:'0.14em',textTransform:'uppercase'}}>AI Assistant · Claude</p>
            <p style={{margin:0,fontSize:8,fontFamily:'monospace',color:C.muted,letterSpacing:'0.08em'}}>CHARLES.PORTFOLIO</p>
          </div>
          <span style={{width:6,height:6,borderRadius:'50%',background:'#16a34a'}}/>
        </div>
        <div style={{flex:1,overflowY:'auto',padding:13,display:'flex',flexDirection:'column',gap:9}}>
          {msgs.map((m,i) => (
            <div key={i} style={{display:'flex',justifyContent:m.role==='user'?'flex-end':'flex-start',animation:'msg-in 0.22s ease'}}>
              <div style={{maxWidth:'86%',padding:'8px 11px',fontSize:12,lineHeight:1.7,fontFamily:m.role==='assistant'?'Georgia, serif':'system-ui',color:m.role==='user'?C.textHi:C.sub,background:m.role==='user'?'rgba(255,255,255,0.07)':'transparent',border:m.role==='user'?`1px solid ${C.dim}`:'none',wordBreak:'break-word'}}>
                {m.content}
              </div>
            </div>
          ))}
          {loading && (
            <div style={{display:'flex',gap:5,padding:'7px 3px'}}>
              {[0,1,2].map(i => <div key={i} style={{width:4,height:4,borderRadius:'50%',background:C.dim,animation:`blink 1.2s ${i*0.2}s infinite`}}/>)}
            </div>
          )}
          <div ref={endRef}/>
        </div>
        <div style={{padding:'9px 11px',borderTop:`1px solid ${C.border}`,display:'flex',gap:8}}>
          <input value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>e.key==='Enter'&&send()}
            placeholder="Ask about Charles's work..."
            style={{flex:1,background:'transparent',border:`1px solid ${C.border}`,padding:'7px 10px',color:C.textHi,fontSize:11,fontFamily:'monospace',outline:'none'}}/>
          <button onClick={send} disabled={loading}
            style={{background:C.accent,border:'none',color:C.bg,padding:'7px 13px',cursor:'pointer',fontSize:12,fontWeight:700,opacity:loading?0.4:1}}>
            →
          </button>
        </div>
      </div>
      <button onClick={()=>setOpen(p=>!p)} style={{
        position:'fixed',bottom:20,right:20,zIndex:200,
        background:open?C.panel:C.accent,color:open?C.accent:C.bg,
        border:`1px solid ${open?C.dim:C.accent}`,
        padding:'8px 16px',fontSize:9,fontFamily:'monospace',
        letterSpacing:'0.14em',textTransform:'uppercase',cursor:'pointer',
        boxShadow:open?'none':'0 4px 24px rgba(255,255,255,0.12)',
        transition:'all 0.25s',
      }}>
        {open?'[ Close ]':'[ Ask AI ]'}
      </button>
    </>
  );
};

// ─── Signal Canvas ────────────────────────────────────────────────────────────
const useSignalCanvas = (ref) => {
  useEffect(() => {
    const canvas = ref.current; if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let raf, t = 0;
    const resize = () => { canvas.width=window.innerWidth; canvas.height=window.innerHeight; };
    window.addEventListener('resize',resize); resize();
    const draw = () => {
      t += 0.008; ctx.clearRect(0,0,canvas.width,canvas.height);
      const cy=canvas.height/2, w=canvas.width;
      [{a:40,f:0.003,p:t,c:'rgba(255,255,255,0.08)'},{a:25,f:0.01,p:t*1.5,c:'rgba(255,255,255,0.05)'},{a:60,f:0.002,p:-t*0.5,c:'rgba(255,255,255,0.03)'}].forEach(({a,f,p,c})=>{
        ctx.beginPath(); ctx.strokeStyle=c; ctx.lineWidth=1.5;
        for(let x=0;x<w;x++) ctx.lineTo(x,cy+Math.sin(x*f+p)*a+Math.sin(x*f*2.5+p)*(a*0.3));
        ctx.stroke();
      });
      raf=requestAnimationFrame(draw);
    };
    draw();
    return ()=>{window.removeEventListener('resize',resize);cancelAnimationFrame(raf);};
  },[]);
};

// ─── Navigation ───────────────────────────────────────────────────────────────
const NAV_ITEMS = [
  {id:'home',label:'Home'},{id:'about',label:'About'},{id:'projects',label:'Projects'},
  {id:'writing',label:'Publications'},{id:'skills',label:'Skills'},{id:'contact',label:'Contact'}
];

const Nav = ({active,setActive}) => {
  const [mob,setMob] = useState(false);
  const go = id => { setActive(id); setMob(false); };
  return (
    <>
      <style>{`
        .nl{position:relative;font-family:monospace;font-size:clamp(10px,1.1vw,12px);letter-spacing:0.1em;text-transform:uppercase;background:none;border:none;cursor:pointer;padding:6px 0;color:#525252;transition:color 0.2s;white-space:nowrap;}
        .nl::after{content:'';position:absolute;bottom:0;left:0;width:0;height:1px;background:#fff;transition:width 0.28s;}
        .nl.on{color:#fff;}.nl.on::after{width:100%;}.nl:not(.on):hover{color:#a3a3a3;}
        .mob-menu{position:fixed;inset:0;background:#0a0a0a;z-index:90;display:flex;flex-direction:column;justify-content:center;padding:40px clamp(20px,6vw,80px);gap:clamp(20px,4vh,36px);}
        .mob-nl{font-family:monospace;font-size:clamp(28px,9vw,48px);text-transform:uppercase;letter-spacing:0.04em;background:none;border:none;cursor:pointer;color:#404040;transition:color 0.2s;text-align:left;}
        .mob-nl.on,.mob-nl:hover{color:#fff;}
        @media(max-width:768px){.dk-nav{display:none!important}.mb-btn{display:flex!important}}
        @media(min-width:769px){.mb-btn{display:none!important}.dk-nav{display:flex!important}}
      `}</style>
      <nav style={{position:'fixed',top:0,left:0,right:0,zIndex:50,padding:'clamp(14px,2vw,28px) clamp(20px,5.5vw,88px)',background:'linear-gradient(to bottom,#0a0a0a 55%,transparent)',display:'flex',alignItems:'center',justifyContent:'space-between'}}>
        <div style={{fontFamily:'monospace',fontSize:'clamp(9px,1vw,11px)',letterSpacing:'0.18em',color:C.muted,textTransform:'uppercase',whiteSpace:'nowrap'}}>C.T. ABODUNRIN</div>
        <div className="dk-nav" style={{alignItems:'center',gap:'clamp(20px,2.8vw,48px)'}}>
          {NAV_ITEMS.map(n=><button key={n.id} className={`nl ${active===n.id?'on':''}`} onClick={()=>go(n.id)}>{n.label}</button>)}
        </div>
        <button className="mb-btn" onClick={()=>setMob(p=>!p)} style={{background:'none',border:'none',cursor:'pointer',color:'#fff',zIndex:100,alignItems:'center'}}>
          {mob?<X size={22}/>:<Menu size={22}/>}
        </button>
      </nav>
      {mob&&(
        <div className="mob-menu">
          <p style={{fontFamily:'monospace',fontSize:9,letterSpacing:'0.2em',color:C.muted,textTransform:'uppercase',margin:'0 0 8px 0'}}>C.T. ABODUNRIN — PORTFOLIO</p>
          {NAV_ITEMS.map(n=><button key={n.id} className={`mob-nl ${active===n.id?'on':''}`} onClick={()=>go(n.id)}>{n.label}</button>)}
        </div>
      )}
    </>
  );
};

// ─── Section Header (with watermark index) ────────────────────────────────────
const SectionHeader = ({title,subtitle,index}) => (
  <div style={{marginBottom:'clamp(36px,5vw,72px)',borderBottom:`1px solid ${C.border}`,paddingBottom:'clamp(18px,2.5vw,28px)',width:'100%',position:'relative',overflow:'hidden'}}>
    {index&&<span style={{position:'absolute',right:0,top:'50%',transform:'translateY(-50%)',fontFamily:'Georgia,serif',fontSize:'clamp(80px,14vw,200px)',color:'rgba(255,255,255,0.025)',fontWeight:700,lineHeight:1,userSelect:'none',pointerEvents:'none',letterSpacing:'-0.04em'}}>{index}</span>}
    <h2 style={{fontSize:'clamp(34px,5.5vw,76px)',fontFamily:'Georgia,serif',color:'#fff',margin:'0 0 10px 0',letterSpacing:'-0.02em',lineHeight:1,position:'relative'}}>{title}</h2>
    {subtitle&&<p style={{color:C.muted,fontFamily:'monospace',fontSize:'clamp(10px,1vw,12px)',textTransform:'uppercase',letterSpacing:'0.13em',margin:0,position:'relative'}}>{subtitle}</p>}
  </div>
);

// ─── Tech Tag with hover ──────────────────────────────────────────────────────
const TechTag = ({label}) => {
  const [hov,setHov] = useState(false);
  return (
    <span onMouseEnter={()=>setHov(true)} onMouseLeave={()=>setHov(false)}
      style={{fontSize:'clamp(9px,0.85vw,11px)',fontFamily:'monospace',textTransform:'uppercase',padding:'5px 10px',border:`1px solid ${hov?C.borderHi:C.border}`,color:hov?C.text:C.sub,background:hov?'rgba(255,255,255,0.04)':'#111',transition:'all 0.18s',cursor:'default'}}>
      {label}
    </span>
  );
};

// ─── Project Card ─────────────────────────────────────────────────────────────
const ProjectCard = ({title,tech,description,methodology,link}) => (
  <div style={{border:`1px solid ${C.border}`,background:'rgba(17,17,17,0.5)',padding:'clamp(22px,2.8vw,44px)',transition:'border-color 0.35s',display:'flex',flexDirection:'column'}}
    onMouseEnter={e=>e.currentTarget.style.borderColor=C.borderHi}
    onMouseLeave={e=>e.currentTarget.style.borderColor=C.border}>
    <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',gap:14,marginBottom:14}}>
      <h3 style={{fontFamily:'Georgia,serif',fontSize:'clamp(17px,2vw,26px)',color:'#e5e5e5',margin:0,lineHeight:1.3,flex:'1 1 auto'}}>{title}</h3>
      {link?(
        <a href={link} target="_blank" rel="noreferrer"
          style={{display:'inline-flex',alignItems:'center',gap:6,padding:'5px 12px',border:`1px solid ${C.borderHi}`,background:'#111',color:C.text,fontFamily:'monospace',fontSize:'clamp(9px,0.85vw,10px)',letterSpacing:'0.1em',textTransform:'uppercase',textDecoration:'none',whiteSpace:'nowrap',flexShrink:0,transition:'border-color 0.18s,color 0.18s'}}
          onMouseEnter={e=>{e.currentTarget.style.borderColor='#fff';e.currentTarget.style.color='#fff';}}
          onMouseLeave={e=>{e.currentTarget.style.borderColor=C.borderHi;e.currentTarget.style.color=C.text;}}>
          <Github size={12}/> GitHub
        </a>
      ):(
        <span style={{display:'inline-flex',alignItems:'center',gap:6,padding:'5px 12px',border:`1px solid ${C.border}`,color:C.muted,fontFamily:'monospace',fontSize:'clamp(9px,0.85vw,10px)',letterSpacing:'0.1em',textTransform:'uppercase',whiteSpace:'nowrap',flexShrink:0,userSelect:'none'}}>
          <Github size={12}/> Soon
        </span>
      )}
    </div>
    <div style={{display:'flex',flexWrap:'wrap',gap:7,marginBottom:'clamp(16px,2vw,28px)'}}>
      {tech.map((t,i)=><TechTag key={i} label={t}/>)}
    </div>
    <p style={{color:C.sub,fontSize:'clamp(13px,1.15vw,16px)',lineHeight:1.85,marginBottom:'clamp(18px,2.2vw,32px)',fontWeight:300,flexGrow:1}}>{description}</p>
    <div style={{background:'rgba(8,8,8,0.6)',padding:'clamp(14px,1.8vw,24px)',borderLeft:`1px solid ${C.border}`}}>
      <span style={{display:'block',fontSize:'clamp(8px,0.8vw,10px)',fontFamily:'monospace',color:C.muted,textTransform:'uppercase',letterSpacing:'0.15em',marginBottom:14}}>Methodology & Insight</span>
      <ul style={{listStyle:'none',padding:0,margin:0,display:'flex',flexDirection:'column',gap:10}}>
        {methodology.map((item,i)=>(
          <li key={i} style={{display:'flex',alignItems:'flex-start',fontSize:'clamp(12px,1.05vw,14px)',color:C.text,fontWeight:300,lineHeight:1.75}}>
            <span style={{marginRight:12,color:C.dim,marginTop:6,fontSize:7,flexShrink:0}}>●</span>{item}
          </li>
        ))}
      </ul>
    </div>
  </div>
);

// ─── Publications Modal ───────────────────────────────────────────────────────
const PubModal = ({note,onClose}) => {
  useEffect(()=>{
    const esc = e => e.key==='Escape'&&onClose();
    document.addEventListener('keydown',esc);
    return ()=>document.removeEventListener('keydown',esc);
  },[onClose]);
  return (
    <div onClick={onClose} style={{position:'fixed',inset:0,background:'rgba(0,0,0,0.88)',zIndex:300,display:'flex',alignItems:'center',justifyContent:'center',padding:'clamp(16px,4vw,60px)',backdropFilter:'blur(4px)'}}>
      <div onClick={e=>e.stopPropagation()} style={{background:'#0f0f0f',border:'1px solid #2a2a2a',padding:'clamp(28px,4vw,52px)',maxWidth:740,width:'100%',maxHeight:'85vh',overflowY:'auto',position:'relative',animation:'modal-in 0.22s ease'}}>
        {/* Close */}
        <button onClick={onClose}
          style={{position:'absolute',top:18,right:18,background:'none',border:'none',cursor:'pointer',color:C.muted,transition:'color 0.18s'}}
          onMouseEnter={e=>e.currentTarget.style.color='#fff'}
          onMouseLeave={e=>e.currentTarget.style.color=C.muted}>
          <X size={18}/>
        </button>

        {/* Meta + title */}
        <p style={{fontFamily:'monospace',fontSize:10,color:C.dim,textTransform:'uppercase',letterSpacing:'0.2em',margin:'0 0 12px 0'}}>{note.date} · Publication</p>
        <h2 style={{fontFamily:'Georgia,serif',fontSize:'clamp(20px,3vw,36px)',color:'white',margin:'0 0 clamp(20px,2.5vw,32px) 0',lineHeight:1.25,paddingRight:32}}>{note.title}</h2>

        {/* Equation — shown first, as the anchor */}
        {note.equation&&(
          <div style={{padding:'clamp(12px,1.8vw,20px) clamp(16px,2.5vw,28px)',background:'#080808',border:'1px solid #1f1f1f',marginBottom:'clamp(20px,2.5vw,30px)',overflowX:'auto'}}>
            <code style={{fontSize:'clamp(12px,1.2vw,15px)',fontFamily:'monospace',color:'#e5e5e5',letterSpacing:'0.04em',whiteSpace:'nowrap'}}>{note.equation}</code>
          </div>
        )}

        {/* Abstract / excerpt */}
        <p style={{color:'#a3a3a3',fontSize:'clamp(14px,1.3vw,17px)',lineHeight:1.9,fontWeight:300,margin:'0 0 clamp(20px,2.5vw,30px) 0'}}>{note.excerpt}</p>

        {/* Proof Summary */}
        {note.proof&&(
          <>
            <div style={{borderTop:'1px solid #1f1f1f',paddingTop:'clamp(16px,2vw,22px)',marginBottom:14}}>
              <span style={{fontFamily:'monospace',fontSize:10,color:C.dim,textTransform:'uppercase',letterSpacing:'0.16em'}}>Proof Summary</span>
            </div>
            <p style={{color:'#a3a3a3',fontSize:'clamp(13px,1.2vw,16px)',lineHeight:1.9,fontWeight:300,margin:'0 0 clamp(20px,2.5vw,30px) 0'}}>{note.proof}</p>
          </>
        )}

        {/* Key Result */}
        {note.keyResult&&(
          <div style={{padding:'clamp(14px,2vw,22px)',background:'rgba(255,255,255,0.02)',border:'1px solid #1f1f1f',borderLeft:'3px solid #2a2a2a'}}>
            <span style={{display:'block',fontFamily:'monospace',fontSize:10,color:C.dim,textTransform:'uppercase',letterSpacing:'0.16em',marginBottom:10}}>Key Result</span>
            <p style={{color:C.text,fontSize:'clamp(13px,1.2vw,16px)',lineHeight:1.8,fontWeight:300,margin:0}}>{note.keyResult}</p>
          </div>
        )}
      </div>
    </div>
  );
};

const MathNote = ({note,onOpen}) => {
  const [hov,setHov] = useState(false);
  return (
    <div onClick={()=>onOpen(note)}
      onMouseEnter={()=>setHov(true)} onMouseLeave={()=>setHov(false)}
      style={{borderTop:`1px solid ${C.border}`,padding:'clamp(24px,3.5vw,48px) 0',cursor:'pointer',
        background:hov?'rgba(255,255,255,0.02)':'transparent',transition:'background 0.22s'}}>
      <div style={{display:'flex',flexWrap:'wrap',justifyContent:'space-between',alignItems:'baseline',gap:12,marginBottom:'clamp(10px,1.3vw,20px)'}}>
        <h4 style={{fontFamily:'Georgia,serif',fontSize:'clamp(17px,2.2vw,30px)',color:hov?'#fff':'#e5e5e5',margin:0,lineHeight:1.3,flex:'1 1 auto',maxWidth:'75%',transition:'color 0.2s'}}>{note.title}</h4>
        <div style={{display:'flex',alignItems:'center',gap:14,flexShrink:0}}>
          <span style={{fontSize:'clamp(10px,1vw,12px)',fontFamily:'monospace',color:C.muted,whiteSpace:'nowrap'}}>{note.date}</span>
          <span style={{display:'inline-flex',alignItems:'center',gap:5,fontFamily:'monospace',fontSize:'clamp(9px,0.85vw,10px)',color:hov?'#e5e5e5':C.dim,textTransform:'uppercase',letterSpacing:'0.12em',transition:'color 0.2s',whiteSpace:'nowrap'}}>
            Read <ExternalLink size={10}/>
          </span>
        </div>
      </div>
      <p style={{color:C.sub,fontSize:'clamp(13px,1.15vw,15px)',fontWeight:300,marginBottom:'clamp(12px,1.6vw,22px)',lineHeight:1.85,maxWidth:900}}>{note.excerpt}</p>
      {note.equation&&(
        <div style={{display:'inline-block',padding:'clamp(9px,1.2vw,14px) clamp(14px,1.8vw,22px)',background:C.bg,border:`1px solid ${C.border}`,overflowX:'auto',maxWidth:'100%'}}>
          <code style={{fontSize:'clamp(11px,1.05vw,13px)',fontFamily:'monospace',color:C.text,letterSpacing:'0.04em',whiteSpace:'nowrap'}}>{note.equation}</code>
        </div>
      )}
    </div>
  );
};

// ─── Radar Chart ─────────────────────────────────────────────────────────────
const RadarChart = ({data,size=300}) => {
  const cx=size/2,cy=size/2,R=size*0.35,n=data.length;
  const angle = i=>(Math.PI*2*i)/n - Math.PI/2;
  const pt = (i,r)=>({x:cx+r*Math.cos(angle(i)),y:cy+r*Math.sin(angle(i))});
  return (
    <svg viewBox={`0 0 ${size} ${size}`} style={{width:'100%',maxWidth:size,display:'block'}}>
      {[0.25,0.5,0.75,1].map(r=>(
        <polygon key={r} points={Array.from({length:n},(_,i)=>pt(i,R*r)).map(p=>`${p.x},${p.y}`).join(' ')} fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth={1}/>
      ))}
      {Array.from({length:n},(_,i)=>{const p=pt(i,R);return <line key={i} x1={cx} y1={cy} x2={p.x} y2={p.y} stroke="rgba(255,255,255,0.08)" strokeWidth={1}/>;} )}
      <polygon points={data.map((d,i)=>{const p=pt(i,R*d.v);return `${p.x},${p.y}`;}).join(' ')} fill="rgba(255,255,255,0.07)" stroke="rgba(255,255,255,0.45)" strokeWidth={1.5}/>
      {data.map((d,i)=>{const p=pt(i,R*d.v);return <circle key={i} cx={p.x} cy={p.y} r={3.5} fill="#fff" opacity={0.85}/>;} )}
      {data.map((d,i)=>{
        const lp=pt(i,R*1.22);
        return <text key={i} x={lp.x} y={lp.y} textAnchor="middle" dominantBaseline="middle" style={{fontSize:size>280?9:8,fontFamily:'monospace',fill:'#737373',textTransform:'uppercase',letterSpacing:'0.05em'}}>{d.label}</text>;
      })}
    </svg>
  );
};

// ─── Data ─────────────────────────────────────────────────────────────────────
const SKILL_SETS = [
  {
    category:'Pure Mathematics',
    radar:[{label:'Real Analysis',v:0.90},{label:'Complex Analysis',v:0.85},{label:'Linear Algebra',v:0.92},{label:'Contour/Residues',v:0.80},{label:'Differentiation',v:0.88}],
    skills:['Real Analysis','Complex Analysis','Contour Integration & Residues','Linear Algebra','Series & Transforms'],
  },
  {
    category:'Engineering',
    radar:[{label:'Embedded Sys.',v:0.88},{label:'DSP',v:0.82},{label:'Control Theory',v:0.78},{label:'Circuit Analysis',v:0.84},{label:'Systems Modeling',v:0.75}],
    skills:['Embedded Systems (FreeRTOS)','Digital Signal Processing','Control Systems','Circuit Analysis','Systems Modeling'],
  },
  {
    category:'Computation',
    radar:[{label:'C/C++',v:0.90},{label:'MATLAB',v:0.85},{label:'Python',v:0.80},{label:'LabVIEW',v:0.72},{label:'LaTeX',v:0.88}],
    skills:['C / C++','MATLAB / Simulink','Python (NumPy, SciPy)','LabVIEW','LaTeX Typesetting'],
  },
];

const PROJECTS = [
  {
    title:'ESP32-CAM Smart Doorbell System',
    tech:['ESP32-CAM','C++','Telegram API','FreeRTOS'],
    description:'Full-stack embedded system with Telegram bot integration, on-device face recognition, OLED status display, and relay-controlled door actuation — designed for reliability in real-world WiFi environments.',
    methodology:['Implemented frame validation and JPEG decompression error recovery for stable camera pipeline operation.','Engineered fast WiFi reconnection using RTC-cached BSSID/channel and static IP for sub-second recovery.','Designed ForceReply keyboard flows, anti-spam cooldowns, and inline Telegram keyboards for polished UX.'],
    link:'https://github.com/charrlie1/-ESP32-CAM-Smart-Doorbell-Pro',
  },
  {
    title:'Discrete Template Matching via Cross-Correlation',
    tech:['MATLAB','Linear Algebra','Image Processing'],
    description:'Designed a manual optical character recognition pipeline without high-level CV libraries, demonstrating a fundamental understanding of 2D convolution and matched filters in noisy environments.',
    methodology:['Implemented Normalized Cross-Correlation (NCC) from first principles to handle varying lighting conditions.','Optimized the sliding window by converting spatial convolution to frequency-domain multiplication (FFT) for O(N log N) complexity.','Conducted sensitivity analysis against Gaussian noise up to −10 dB SNR.'],
  },
  {
    title:'Spectral Audio Fingerprinting',
    tech:['LabVIEW','Signal Processing','Hashing'],
    description:'An acoustic analysis system capable of identifying audio segments from a database. Focus was on robustness against distortion and time-shifting.',
    methodology:['Designed a custom Short-Time Fourier Transform (STFT) pipeline to generate spectrograms.','Implemented a constellation map algorithm to extract robust spectral peaks (anchors).','Created a time-invariant hashing scheme pairing anchor points with target zones for O(1) database retrieval.'],
  },
  {
    title:'PID & LQR Control for Magnetic Levitation',
    tech:['Python','Control Theory','Embedded C'],
    description:'Simulation and firmware implementation for an unstable magnetic levitation system. Compared classical control methods against modern state-space approaches.',
    methodology:['Derived non-linear equations of motion and linearized them around the equilibrium point.','Designed a PID controller using Root Locus analysis for transient response requirements.','Implemented a Linear Quadratic Regulator (LQR) to optimise control effort vs. error state.'],
  },
];

const WRITING = [
  {
    title:'The Lobachevsky Integral Identity',date:'JUN 2025',
    excerpt:'A profound result in mathematical analysis providing a remarkable transformation formula for integrals involving the sinc function — one of the most elegant integral transformations in classical analysis.',
    equation:'∫₀^∞ f(x) (sin x / x) dx = ∫₀^{π/2} f(x) dx',
    proof:'The proof proceeds by expressing sin(x)/x via its integral representation, interchanging the order of integration (justified by Fubini\'s theorem), and exploiting the periodicity of the integrand. The sum of f evaluated over shifted half-period intervals collapses cleanly to the right-hand side.',
    keyResult:'Any weighted-sinc integral over the positive half-line reduces to an ordinary integral over [0, π/2] — dramatically simplifying a broad class of otherwise intractable integrals, provided f satisfies mild regularity conditions.',
  },
  {
    title:'Integral Representation of the Dirichlet Eta Function',date:'MAY 2025',
    excerpt:'A rigorous proof of the integral representation of the Dirichlet eta function using complex analysis and the residue theorem, establishing analytic continuation to the entire complex plane.',
    equation:'η(s) = (1 / Γ(s)) ∫₀^∞ x^{s−1} / (eˣ + 1) dx',
    proof:'The derivation expresses 1/(eˣ+1) as a convergent geometric series, integrates term by term to recover the eta series, then deforms the contour to the Hankel contour for analytic continuation. Pole contributions are computed via the residue theorem.',
    keyResult:'Valid for Re(s) > 0 and, after continuation, for all s ∈ ℂ \\ {1}. Provides the direct bridge η(s) = (1 − 2^{1−s}) ζ(s) linking the Riemann zeta function with the Gamma function.',
  },
  {
    title:'The Cayley-Hamilton Theorem: A Fundamental Result',date:'APR 2025',
    excerpt:'Explores this cornerstone of linear algebra — every square matrix satisfies its own characteristic equation — with proof, applications, and implications for matrix computations.',
    equation:'p(λ) = det(A − λI) = 0  ⟹  p(A) = 0',
    proof:'The proof constructs adj(λI − A) as a polynomial in λ with matrix coefficients, multiplies both sides by (λI − A), and equates powers of λ. Substituting A for λ and using the annihilation property of the determinant completes the argument.',
    keyResult:'Every n×n matrix A satisfies p(A) = 0. This means Aⁿ and all higher powers are linear combinations of I, A, …, A^{n−1} — enabling closed-form computation of matrix functions, exponentials, and inverses.',
  },
];

// ─── Footer ───────────────────────────────────────────────────────────────────
const Footer = ({setActive, scrollToTop}) => (
  <footer style={{borderTop:`1px solid ${C.border}`,padding:'clamp(28px,3.5vw,52px) clamp(20px,5.5vw,88px)',display:'flex',flexWrap:'wrap',alignItems:'flex-end',justifyContent:'space-between',gap:24}}>
    <div>
      <p style={{fontFamily:'monospace',fontSize:'clamp(9px,0.9vw,11px)',color:C.muted,letterSpacing:'0.16em',textTransform:'uppercase',margin:'0 0 12px 0'}}>C.T. ABODUNRIN · OAU ILE-IFE</p>
      <div style={{display:'flex',flexWrap:'wrap',gap:'clamp(14px,2.2vw,28px)'}}>
        {NAV_ITEMS.filter(n=>n.id!=='home').map(n=>(
          <button key={n.id} onClick={()=>setActive(n.id)}
            style={{background:'none',border:'none',cursor:'pointer',fontFamily:'monospace',fontSize:'clamp(9px,0.9vw,11px)',color:C.muted,textTransform:'uppercase',letterSpacing:'0.1em',padding:0,transition:'color 0.18s'}}
            onMouseEnter={e=>e.currentTarget.style.color='#fff'}
            onMouseLeave={e=>e.currentTarget.style.color=C.muted}>
            {n.label}
          </button>
        ))}
      </div>
    </div>
    <button
      onClick={scrollToTop}
      style={{display:'inline-flex',alignItems:'center',gap:8,background:'none',border:`1px solid ${C.border}`,color:C.muted,cursor:'pointer',padding:'9px 16px',fontFamily:'monospace',fontSize:'clamp(9px,0.9vw,11px)',letterSpacing:'0.1em',textTransform:'uppercase',transition:'all 0.18s'}}
      onMouseEnter={e=>{e.currentTarget.style.borderColor='#fff';e.currentTarget.style.color='#fff';}}
      onMouseLeave={e=>{e.currentTarget.style.borderColor=C.border;e.currentTarget.style.color=C.muted;}}>
      <ChevronUp size={13}/> Back to top
    </button>
  </footer>
);

// ─── Section Wrapper ──────────────────────────────────────────────────────────
const Sec = ({children,full}) => (
  <div style={{width:'100%',minHeight:full?'100vh':'auto',display:full?'flex':'block',flexDirection:full?'column':undefined,justifyContent:full?'center':undefined,paddingTop:'clamp(80px,9vw,132px)',paddingBottom:'clamp(40px,5vw,72px)',paddingLeft:'clamp(20px,5.5vw,88px)',paddingRight:'clamp(20px,5.5vw,88px)',boxSizing:'border-box'}}>
    {children}
  </div>
);

// ─── App ──────────────────────────────────────────────────────────────────────
export default function App() {
  const [active,setActive]           = useState('home');
  const [selNote,setSelNote]         = useState(null);
  const [activeSkill,setActiveSkill] = useState(0);
  const canvasRef = useRef(null);
  const rootRef   = useRef(null);
  useSignalCanvas(canvasRef);

  // ↓ Replace null with your image URL string when ready
  const IMG_SRC = "data:image/jpeg;base64,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";

  const scrollToTop = () => {
    if (rootRef.current) rootRef.current.scrollTop = 0;
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
    try { window.scrollTo(0, 0); } catch(_) {}
  };

  useEffect(() => { scrollToTop(); }, [active]);

  const render = () => {
    switch(active) {

      // ── HOME ──────────────────────────────────────────────────────────────
      case 'home': return (
        <Sec full>
          <style>{`@keyframes pulse-dot{0%,100%{opacity:0.35}50%{opacity:1}}`}</style>
          <div style={{display:'grid',gridTemplateColumns:'1fr auto',alignItems:'center',gap:'clamp(28px,4vw,60px)',width:'100%'}}>
            {/* Left */}
            <div style={{minWidth:0}}>
              <div style={{display:'inline-flex',alignItems:'center',gap:9,padding:'5px 13px',marginBottom:'clamp(20px,3.5vw,44px)',border:`1px solid ${C.border}`,background:'rgba(17,17,17,0.6)',fontFamily:'monospace',fontSize:'clamp(9px,0.95vw,11px)',color:C.sub,letterSpacing:'0.12em',textTransform:'uppercase',borderRadius:100}}>
                <span style={{width:7,height:7,background:'#14532d',borderRadius:'50%',animation:'pulse-dot 2s infinite'}}/>
                Open to Research & Engineering Roles
              </div>
              <h1 style={{fontFamily:"Georgia,'Times New Roman',serif",fontSize:'clamp(28px,6vw,92px)',color:'#fff',lineHeight:1.07,letterSpacing:'-0.025em',margin:'0 0 clamp(14px,2vw,24px) 0'}}>
                Applied Mathematics.<br/>Signal Processing.<br/><em style={{color:C.muted}}>First Principles.</em>
              </h1>
              <p style={{fontFamily:'Georgia,serif',fontSize:'clamp(14px,1.7vw,22px)',color:C.text,fontStyle:'italic',margin:'0 0 clamp(8px,1.2vw,14px) 0'}}>Charles Toluwanimi Abodunrin</p>
              <p style={{fontSize:'clamp(13px,1.3vw,18px)',color:C.sub,fontWeight:300,lineHeight:1.75,maxWidth:'min(660px,100%)',margin:'0 0 clamp(24px,3.5vw,48px) 0'}}>
                EEE Undergraduate at Obafemi Awolowo University. Focused on real &amp; complex analysis, rigorous mathematical modeling, and systems engineering.
              </p>
              <div style={{display:'flex',flexWrap:'wrap',gap:'clamp(10px,1.4vw,18px)'}}>
                <button onClick={()=>setActive('writing')}
                  style={{padding:'clamp(10px,1.1vw,14px) clamp(20px,2.6vw,40px)',background:'#fff',color:'#0a0a0a',border:'none',cursor:'pointer',fontSize:'clamp(11px,1.1vw,14px)',fontWeight:500,transition:'background 0.18s',whiteSpace:'nowrap'}}
                  onMouseEnter={e=>e.target.style.background='#e5e5e5'} onMouseLeave={e=>e.target.style.background='#fff'}>
                  Read Publications
                </button>
                <button onClick={()=>setActive('about')}
                  style={{padding:'clamp(10px,1.1vw,14px) clamp(20px,2.6vw,40px)',background:'transparent',color:C.text,border:`1px solid ${C.dim}`,cursor:'pointer',fontSize:'clamp(11px,1.1vw,14px)',transition:'border-color 0.18s',whiteSpace:'nowrap'}}
                  onMouseEnter={e=>e.target.style.borderColor=C.sub} onMouseLeave={e=>e.target.style.borderColor=C.dim}>
                  About Me
                </button>
              </div>
            </div>
            {/* Right — stat cluster (hidden on small phones) */}
            <div style={{display:'flex',flexDirection:'column',gap:'clamp(12px,1.8vw,24px)',flexShrink:0,alignItems:'flex-end'}} className="hero-stats">
              {[{num:'4+',label:'Engineering\nProjects'},{num:'3',label:'Publications\n& Proofs'},{num:'B.Eng',label:'Electrical &\nElectronics'}].map((s,i)=>(
                <div key={i} style={{textAlign:'right',borderRight:`1px solid ${C.border}`,paddingRight:'clamp(14px,2vw,28px)'}}>
                  <div style={{fontFamily:'Georgia,serif',fontSize:'clamp(22px,3.2vw,48px)',color:'#fff',lineHeight:1,letterSpacing:'-0.03em'}}>{s.num}</div>
                  <div style={{fontFamily:'monospace',fontSize:'clamp(8px,0.75vw,9px)',color:C.muted,textTransform:'uppercase',letterSpacing:'0.1em',lineHeight:1.55,whiteSpace:'pre-line'}}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>
          <style>{`@media(max-width:580px){.hero-stats{display:none!important}}`}</style>
        </Sec>
      );

      // ── ABOUT ─────────────────────────────────────────────────────────────
      case 'about': return (
        <Sec>
          <SectionHeader title="About" subtitle="Background & Philosophy" index="01"/>
          <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(min(320px,100%),1fr))',gap:'clamp(32px,5vw,72px)',alignItems:'start'}}>
            {/* Bio */}
            <div style={{display:'flex',flexDirection:'column',gap:'clamp(16px,2vw,26px)',fontSize:'clamp(14px,1.3vw,17px)',color:C.sub,fontWeight:300,lineHeight:1.9}}>
              <p style={{margin:0}}>I am an electrical engineering student at Obafemi Awolowo University, driven by the "why" behind the "how." While many industries rush toward high-level frameworks, my primary interest lies in pure mathematical foundations — particularly Real and Complex Analysis, and Linear Algebra.</p>
              <p style={{margin:0}}>My approach is highly rigorous. I enjoy proving fundamental transformation theorems and analyzing complex integrals (such as the Lobachevsky Integral Identity and the Dirichlet eta function) just as much as applying these concepts to physical engineering systems.</p>
              <p style={{margin:0}}>Whether utilizing contour integration, applying the residue theorem, or exploring matrix computations through the Cayley-Hamilton theorem, I aim to bridge elegant classical analysis and modern signal processing.</p>
            </div>
            {/* Photo + info */}
            <div style={{display:'flex',flexDirection:'column',gap:'clamp(18px,2.5vw,32px)'}}>
              {/* Image */}
              <div style={{width:'100%',aspectRatio:'4/5',maxWidth:320,background:'#111',border:`1px solid ${C.border}`,overflow:'hidden',position:'relative'}}>
                {IMG_SRC?(
                  <img src={IMG_SRC} alt="Charles Abodunrin" style={{width:'100%',height:'100%',objectFit:'cover',display:'block',filter:'grayscale(100%) contrast(1.1)'}}/>
                ):(
                  <div style={{width:'100%',height:'100%',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',gap:12}}>
                    <svg viewBox="0 0 80 80" width={56} height={56} style={{opacity:0.12}}>
                      <circle cx={40} cy={28} r={18} fill="#fff"/>
                      <ellipse cx={40} cy={72} rx={28} ry={20} fill="#fff"/>
                    </svg>
                    <span style={{fontFamily:'monospace',fontSize:9,color:C.muted,letterSpacing:'0.14em',textTransform:'uppercase'}}>Photo coming soon</span>
                  </div>
                )}
              </div>
              {/* Education & interests */}
              <div style={{borderTop:`1px solid ${C.border}`,paddingTop:'clamp(16px,2vw,24px)',display:'flex',flexDirection:'column',gap:'clamp(14px,1.8vw,22px)'}}>
                <div>
                  <p style={{fontFamily:'monospace',fontSize:'clamp(9px,0.85vw,10px)',color:C.muted,textTransform:'uppercase',letterSpacing:'0.14em',margin:'0 0 7px 0'}}>Education</p>
                  <p style={{fontSize:'clamp(14px,1.4vw,18px)',color:'#fff',margin:'0 0 4px 0'}}>B.Eng. Electrical &amp; Electronic Engineering</p>
                  <p style={{color:C.sub,fontSize:'clamp(12px,1.1vw,14px)',margin:0}}>Obafemi Awolowo University (OAU), Ile-Ife</p>
                </div>
                <div>
                  <p style={{fontFamily:'monospace',fontSize:'clamp(9px,0.85vw,10px)',color:C.muted,textTransform:'uppercase',letterSpacing:'0.14em',margin:'0 0 7px 0'}}>Core Interests</p>
                  <p style={{fontSize:'clamp(12px,1.1vw,14px)',color:C.text,lineHeight:1.8,margin:0,fontWeight:300}}>Real &amp; Complex Analysis, Linear Algebra, Embedded Systems, Signal Processing, Stochastic Models.</p>
                </div>
              </div>
            </div>
          </div>
        </Sec>
      );

      // ── PROJECTS ──────────────────────────────────────────────────────────
      case 'projects': return (
        <Sec>
          <SectionHeader title="Projects" subtitle="Engineering & Simulation" index="02"/>
          <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(min(440px,100%),1fr))',gap:'clamp(14px,1.8vw,26px)'}}>
            {PROJECTS.map((p,i)=><ProjectCard key={i} {...p}/>)}
          </div>
        </Sec>
      );

      // ── WRITING ───────────────────────────────────────────────────────────
      case 'writing': return (
        <Sec>
          <SectionHeader title="Publications & Notes" subtitle="Mathematical Analysis & Proofs" index="03"/>
          <div style={{padding:'clamp(14px,1.8vw,22px) clamp(16px,2.2vw,32px)',background:'rgba(17,17,17,0.4)',border:`1px solid ${C.border}`,display:'flex',alignItems:'flex-start',gap:16,maxWidth:840,marginBottom:'clamp(18px,3vw,44px)'}}>
            <BookOpen size={18} style={{color:C.muted,flexShrink:0,marginTop:2}}/>
            <p style={{color:C.sub,fontSize:'clamp(12px,1.15vw,15px)',lineHeight:1.85,margin:0,fontWeight:300}}>Academic writings focusing on rigorous proofs, integral transformations, and fundamental theorems in classical and complex analysis. Click any entry to read the full abstract and key results.</p>
          </div>
          <div style={{width:'100%'}}>
            {WRITING.map((n,i)=><MathNote key={i} note={n} onOpen={setSelNote}/>)}
          </div>
          {selNote&&<PubModal note={selNote} onClose={()=>setSelNote(null)}/>}
        </Sec>
      );

      // ── SKILLS ────────────────────────────────────────────────────────────
      case 'skills': return (
        <Sec>
          <SectionHeader title="Competencies" subtitle="Theory & Tools" index="04"/>
          {/* Tabs */}
          <div style={{display:'flex',gap:0,marginBottom:'clamp(22px,3vw,44px)',borderBottom:`1px solid ${C.border}`}}>
            {SKILL_SETS.map((s,i)=>(
              <button key={i} onClick={()=>setActiveSkill(i)}
                style={{background:'none',border:'none',borderBottom:activeSkill===i?'2px solid #fff':'2px solid transparent',cursor:'pointer',padding:'clamp(8px,1.1vw,13px) clamp(12px,1.8vw,26px)',fontFamily:'monospace',fontSize:'clamp(10px,1vw,12px)',color:activeSkill===i?'#fff':C.muted,textTransform:'uppercase',letterSpacing:'0.1em',transition:'color 0.2s,border-color 0.2s',marginBottom:-1,whiteSpace:'nowrap'}}>
                {s.category}
              </button>
            ))}
          </div>
          {/* Radar + bars */}
          {SKILL_SETS.map((s,i)=>i===activeSkill&&(
            <div key={i} style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(min(260px,100%),1fr))',gap:'clamp(28px,5vw,64px)',alignItems:'center'}}>
              <div style={{display:'flex',justifyContent:'center'}}><RadarChart data={s.radar} size={320}/></div>
              <div>
                <p style={{fontFamily:'monospace',fontSize:'clamp(9px,0.9vw,10px)',color:C.muted,textTransform:'uppercase',letterSpacing:'0.14em',margin:'0 0 clamp(16px,2vw,26px) 0'}}>Proficiency Details</p>
                <ul style={{listStyle:'none',padding:0,margin:0,display:'flex',flexDirection:'column',gap:'clamp(13px,1.6vw,20px)'}}>
                  {s.skills.map((skill,si)=>{
                    const val=s.radar[si]?.v??0.75;
                    return (
                      <li key={si}>
                        <div style={{display:'flex',justifyContent:'space-between',alignItems:'baseline',marginBottom:6}}>
                          <span style={{fontSize:'clamp(13px,1.2vw,15px)',color:C.text,fontWeight:300}}>{skill}</span>
                          <span style={{fontFamily:'monospace',fontSize:'clamp(9px,0.85vw,10px)',color:C.muted}}>{Math.round(val*100)}%</span>
                        </div>
                        <div style={{height:1,background:C.border,width:'100%'}}>
                          <div style={{height:'100%',background:'rgba(255,255,255,0.45)',width:`${val*100}%`,transition:'width 0.55s ease'}}/>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>
          ))}
        </Sec>
      );

      // ── CONTACT ───────────────────────────────────────────────────────────
      case 'contact': return (
        <Sec>
          <SectionHeader title="Contact" subtitle="Get in Touch" index="05"/>
          <div style={{background:'rgba(14,14,14,0.5)',border:`1px solid ${C.border}`,padding:'clamp(22px,4vw,68px)',display:'flex',flexWrap:'wrap',alignItems:'flex-start',justifyContent:'space-between',gap:'clamp(28px,4vw,52px)'}}>
            {/* Left */}
            <div style={{flex:'1 1 min(380px,100%)'}}>
              <p style={{fontSize:'clamp(14px,1.7vw,22px)',color:C.text,fontWeight:300,lineHeight:1.75,margin:'0 0 clamp(18px,2.8vw,36px) 0',maxWidth:520}}>
                Open to academic research collaborations and engineering roles requiring rigorous mathematical and analytical depth.
              </p>
              {/* Email block */}
              <div style={{border:`1px solid ${C.border}`,padding:'clamp(14px,1.8vw,24px)',marginBottom:'clamp(12px,1.6vw,20px)',background:C.bg,transition:'border-color 0.2s'}}
                onMouseEnter={e=>e.currentTarget.style.borderColor=C.borderHi}
                onMouseLeave={e=>e.currentTarget.style.borderColor=C.border}>
                <p style={{fontFamily:'monospace',fontSize:'clamp(9px,0.85vw,10px)',color:C.muted,textTransform:'uppercase',letterSpacing:'0.14em',margin:'0 0 7px 0'}}>Email</p>
                <a href="mailto:charlesabodunrin@student.oauife.edu.ng"
                  style={{display:'flex',alignItems:'center',gap:11,color:'#fff',textDecoration:'none',fontSize:'clamp(11px,1.15vw,15px)',wordBreak:'break-all',transition:'color 0.18s'}}
                  onMouseEnter={e=>e.currentTarget.style.color=C.sub} onMouseLeave={e=>e.currentTarget.style.color='#fff'}>
                  <Mail size={15} style={{flexShrink:0}}/>
                  charlesabodunrin@student.oauife.edu.ng
                </a>
              </div>
              {/* Location block */}
              <div style={{border:`1px solid ${C.border}`,padding:'clamp(12px,1.5vw,20px)',background:C.bg}}>
                <p style={{fontFamily:'monospace',fontSize:'clamp(9px,0.85vw,10px)',color:C.muted,textTransform:'uppercase',letterSpacing:'0.14em',margin:'0 0 6px 0'}}>Location</p>
                <p style={{fontSize:'clamp(12px,1.15vw,14px)',color:C.text,margin:0,fontWeight:300}}>Ile-Ife, Osun State, Nigeria</p>
              </div>
            </div>
            {/* Social links */}
            <div style={{display:'flex',flexDirection:'column',gap:'clamp(10px,1.4vw,16px)',minWidth:200}}>
              <p style={{fontFamily:'monospace',fontSize:'clamp(9px,0.85vw,10px)',color:C.muted,textTransform:'uppercase',letterSpacing:'0.14em',margin:'0 0 4px 0'}}>Profiles</p>
              {[
                {href:'https://github.com/charrlie1',Icon:Github,label:'GitHub'},
                {href:'https://ng.linkedin.com/in/charles-abodunrin-1003262a5',Icon:Linkedin,label:'LinkedIn'},
                {href:'https://www.researchgate.net/profile/Charles-Abodunrin',Icon:Sigma,label:'ResearchGate'},
              ].map(({href,Icon,label})=>(
                <a key={label} href={href} target="_blank" rel="noreferrer"
                  style={{display:'flex',alignItems:'center',gap:13,textDecoration:'none',border:`1px solid ${C.border}`,padding:'clamp(11px,1.3vw,17px) clamp(13px,1.6vw,20px)',background:C.bg,transition:'border-color 0.18s,background 0.18s'}}
                  onMouseEnter={e=>{e.currentTarget.style.borderColor=C.borderHi;e.currentTarget.style.background='rgba(255,255,255,0.03)';}}
                  onMouseLeave={e=>{e.currentTarget.style.borderColor=C.border;e.currentTarget.style.background=C.bg;}}>
                  <Icon size={15} style={{color:C.text,flexShrink:0}}/>
                  <span style={{fontFamily:'monospace',fontSize:'clamp(10px,1vw,12px)',textTransform:'uppercase',letterSpacing:'0.1em',color:C.text}}>{label}</span>
                  <ExternalLink size={10} style={{color:C.muted,marginLeft:'auto'}}/>
                </a>
              ))}
            </div>
          </div>
        </Sec>
      );

      default: return null;
    }
  };

  return (
    <div ref={rootRef} style={{minHeight:'100vh',height:'100vh',overflowY:'auto',background:C.bg,color:C.text,overflowX:'hidden',fontFamily:"system-ui,-apple-system,sans-serif"}}>
      <style>{`
        *,*::before,*::after{box-sizing:border-box;}
        html,body{margin:0;padding:0;width:100%;overflow-x:hidden;}
        ::selection{background:#333;color:#fff;}
        ::-webkit-scrollbar{width:3px;} ::-webkit-scrollbar-track{background:#0a0a0a;} ::-webkit-scrollbar-thumb{background:#262626;}
        @keyframes modal-in{from{opacity:0;transform:scale(0.97)}to{opacity:1;transform:scale(1)}}
      `}</style>

      <canvas ref={canvasRef} style={{position:'fixed',inset:0,width:'100%',height:'100%',pointerEvents:'none',opacity:0.4,zIndex:0}}/>
      <Nav active={active} setActive={setActive}/>
      <main style={{position:'relative',zIndex:10,width:'100%'}}>{render()}</main>
      {active!=='home'&&<Footer setActive={setActive} scrollToTop={scrollToTop}/>}
      <AiChat/>
    </div>
  );
}
