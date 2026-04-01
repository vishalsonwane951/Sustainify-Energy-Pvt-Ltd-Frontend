import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShieldCheckIcon, MapPinIcon, CogIcon, LockClosedIcon, LinkIcon,
  ClockIcon, UserGroupIcon, FingerPrintIcon, GlobeAltIcon,
  ArrowPathIcon, EnvelopeIcon, ChevronDownIcon, DocumentTextIcon,
  CheckCircleIcon, ExclamationTriangleIcon, InformationCircleIcon,
} from "@heroicons/react/24/outline";
import { SunIcon } from "@heroicons/react/24/outline";

const C = {
  green:   { accent:"#34d399", bg:"rgba(52,211,153,0.10)",  border:"rgba(52,211,153,0.28)",  borderHov:"rgba(52,211,153,0.9)"  },
  amber:   { accent:"#fbbf24", bg:"rgba(251,191,36,0.10)",  border:"rgba(251,191,36,0.28)",  borderHov:"rgba(251,191,36,0.9)"  },
  blue:    { accent:"#60a5fa", bg:"rgba(96,165,250,0.10)",  border:"rgba(96,165,250,0.28)",  borderHov:"rgba(96,165,250,0.9)"  },
  purple:  { accent:"#a78bfa", bg:"rgba(167,139,250,0.10)", border:"rgba(167,139,250,0.28)", borderHov:"rgba(167,139,250,0.9)" },
  emerald: { accent:"#4ade80", bg:"rgba(74,222,128,0.10)",  border:"rgba(74,222,128,0.28)",  borderHov:"rgba(74,222,128,0.9)"  },
};

const SECTIONS = [
  {
    id:"s1", num:"01", color:C.green,
    icon:<MapPinIcon style={{width:22,height:22}}/>,
    label:"Data Collection", title:"Information We Collect",
    summary:"Location, profile, media & diagnostics — all used only to power the app.",
    subsections:[
      { icon:"📡", heading:"Location Data",
        body:"PVPROTECH collects your device's precise GPS location to enable core features — real-time technician tracking, site navigation, and job dispatch.",
        pills:["App functionality only","Linked to your identity","Never shared externally","Not used for ads"],
        warn:"You may disable location access at any time in device settings. Features like live technician tracking require it to function." },
      { icon:"🖼️", heading:"User Content (Photos & Media)",
        body:"Photos, videos, and files uploaded for job documentation are stored solely for in-app use, linked to your account and job.",
        pills:["Linked to account & job","Job documentation only","No external sharing"] },
      { icon:"👤", heading:"Account & Profile",
        body:"When you register, we collect your name, email, phone number, job role, and organization to manage your account.",
        pills:["Name & email","Phone number","Job role & org","Encrypted password"] },
      { icon:"📊", heading:"Usage & Diagnostics",
        body:"Crash reports, app version, OS info, and anonymized feature usage patterns help us fix bugs — never for marketing.",
        pills:["Crash logs & error reports","App & device metadata","Feature usage (anonymized)"] },
    ],
  },
  {
    id:"s2", num:"02", color:C.amber,
    icon:<CogIcon style={{width:22,height:22}}/>,
    label:"Data Usage", title:"How We Use Your Information",
    summary:"Your data powers the app. Nothing else. We never sell it.",
    table:[
      ["Real-time technician location display","Location data"],
      ["Job dispatching & field service management","Location, profile info"],
      ["Job documentation & reporting","Photos, videos, content"],
      ["Account authentication & security","Email, password (hashed)"],
      ["App performance & bug fixes","Usage & diagnostic data"],
      ["Customer support & communication","Email, phone number"],
    ],
  },
  {
    id:"s3", num:"03", color:C.blue,
    icon:<LockClosedIcon style={{width:22,height:22}}/>,
    label:"Security", title:"Data Storage & Security",
    summary:"Industry-standard encryption at rest and in transit. Audited regularly.",
    secItems:[
      { icon:"🔐", label:"TLS Encryption in Transit", detail:"All data between your device and our servers uses Transport Layer Security." },
      { icon:"🗄️", label:"Encryption at Rest",        detail:"Sensitive data stored on our servers is encrypted at rest." },
      { icon:"👮", label:"Access Controls",            detail:"Only authorized personnel with a legitimate need can access personal data." },
      { icon:"☁️", label:"Secure Cloud Infrastructure",detail:"Servers are hosted on secure, compliance-certified cloud infrastructure." },
      { icon:"🔍", label:"Periodic Security Audits",   detail:"We conduct regular reviews of all our data handling and security practices." },
    ],
    warn:"While we take all reasonable measures, no system is 100% impenetrable. In the event of a breach, affected users will be notified promptly under applicable laws.",
  },
  {
    id:"s4", num:"04", color:C.purple,
    icon:<LinkIcon style={{width:22,height:22}}/>,
    label:"Third Parties", title:"Third-Party Services",
    summary:"Zero advertising SDKs. Zero data brokers. Your data stays with us.",
    body:"PVPROTECH does not use third-party advertising networks, analytics tracking SDKs, or data brokers. Your personal data is not sold, rented, or transferred to any third parties for commercial purposes.\n\nWe may use trusted service providers strictly to operate our platform (e.g., cloud hosting). Any such provider is bound by strict confidentiality obligations and may not use your data for their own purposes.",
    info:"If we ever add third-party integrations in the future, this policy will be updated and you will be notified accordingly.",
  },
  {
    id:"s5", num:"05", color:C.green,
    icon:<ClockIcon style={{width:22,height:22}}/>,
    label:"Retention", title:"Data Retention",
    summary:"We keep data only as long as needed — and no longer.",
    table:[
      ["Account profile data",        "Active account + 30 days after deletion"],
      ["Location data",               "Active session only — not stored long-term"],
      ["Job photos & media",          "Duration of project lifecycle"],
      ["Diagnostic & crash logs",     "Up to 90 days"],
    ],
    footnote:"To request deletion of your account and all associated data, email vikrant@sustainfyenergy.com.",
  },
  {
    id:"s6", num:"06", color:C.amber,
    icon:<UserGroupIcon style={{width:22,height:22}}/>,
    label:"Children", title:"Children's Privacy",
    summary:"PVPROTECH does not knowingly collect data from children under 13.",
    body:"PVPROTECH is a professional field service management platform. While suitable for users of all ages, we do not knowingly collect, store, or process personal information from children under the age of 13.\n\nIf we learn that a child's data was collected without parental consent, we will delete it immediately. Contact vikrant@sustainfyenergy.com if you believe this has occurred.",
  },
  {
    id:"s7", num:"07", color:C.emerald,
    icon:<FingerPrintIcon style={{width:22,height:22}}/>,
    label:"Your Rights", title:"Your Privacy Rights",
    summary:"Access, correct, delete, or port your data — just ask.",
    rights:[
      { right:"Right to Access",            detail:"Request a copy of the personal data we hold about you." },
      { right:"Right to Correction",        detail:"Request correction of inaccurate or incomplete data." },
      { right:"Right to Deletion",          detail:"Request deletion of your personal data." },
      { right:"Right to Restrict Processing",detail:"Ask us to limit how we use your data in certain circumstances." },
      { right:"Right to Data Portability",  detail:"Request your data in a structured, machine-readable format." },
      { right:"Right to Withdraw Consent",  detail:"Where processing is based on consent, withdraw it at any time." },
      { right:"Location Access Control",    detail:"Disable location tracking at any time in your device settings." },
    ],
    highlight:"To exercise any of these rights, email vikrant@sustainfyenergy.com. We respond within 30 days.",
  },
  {
    id:"s8", num:"08", color:C.blue,
    icon:<GlobeAltIcon style={{width:22,height:22}}/>,
    label:"Cookies", title:"Cookies & Tracking Technologies",
    summary:"No ad cookies. Session-only cookies on the website.",
    secItems:[
      { icon:"🍪", label:"Session Cookies Only",     detail:"Temporary cookies to keep you logged in. Deleted when you close your browser." },
      { icon:"🚫", label:"No Advertising Cookies",   detail:"We do not use cookies for advertising, remarketing, or behavioral tracking." },
      { icon:"🔒", label:"No Third-Party Tracking",  detail:"No third-party trackers or analytics pixels on our platform." },
    ],
  },
  {
    id:"s9", num:"09", color:C.purple,
    icon:<ArrowPathIcon style={{width:22,height:22}}/>,
    label:"Updates", title:"Changes to This Policy",
    summary:"We'll notify you of any material changes — always.",
    secItems:[
      { icon:"📅", label:"Revised Date",              detail:"The \"Last Updated\" date at the top of this page will be revised." },
      { icon:"📬", label:"Material Change Notice",    detail:"We notify users via email or in-app notification for significant changes." },
      { icon:"✅", label:"Continued Use = Acceptance",detail:"Continued use after updates constitutes acceptance of the revised policy." },
    ],
  },
];

function ScrollProgress() {
  const [pct, setPct] = useState(0);
  useEffect(() => {
    const h = () => {
      const el = document.documentElement;
      setPct((el.scrollTop / (el.scrollHeight - el.clientHeight)) * 100);
    };
    window.addEventListener("scroll", h, { passive:true });
    return () => window.removeEventListener("scroll", h);
  }, []);
  return (
    <div className="fixed top-0 left-0 right-0 h-0.5 z-[999] pointer-events-none">
      <div className="h-full transition-all duration-75" style={{ width:`${pct}%`, background:"linear-gradient(to right,#34d399,#fbbf24,#60a5fa)" }} />
    </div>
  );
}

function TrustBadge({ icon, label, sub, color }) {
  const [h, setH] = useState(false);
  return (
    <div
      onMouseEnter={()=>setH(true)} onMouseLeave={()=>setH(false)}
      className="flex flex-col items-center gap-2.5 px-4 py-5 rounded-2xl border transition-all duration-300 cursor-default"
      style={{
        background: h ? "rgba(15,23,42,0.95)" : "rgba(15,23,42,0.65)",
        borderColor: h ? color : `${color}40`,
        transform: h ? "translateY(-4px)" : "translateY(0)",
        boxShadow: h ? `0 12px 32px rgba(0,0,0,0.4)` : "none",
      }}>
      <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl border transition-all duration-300"
        style={{ background:`${color}18`, borderColor: h ? `${color}60` : `${color}30` }}>
        {icon}
      </div>
      <div className="text-center">
        <p className="text-white text-xs font-bold leading-tight">{label}</p>
        {sub && <p className="text-slate-500 text-xs mt-0.5">{sub}</p>}
      </div>
    </div>
  );
}

function PolicyTable({ rows, color }) {
  return (
    <div className="rounded-xl overflow-hidden border" style={{ borderColor:"rgba(255,255,255,0.08)" }}>
      <div className="grid grid-cols-2 px-5 py-3 border-b" style={{ background:`${color.accent}18`, borderColor:"rgba(255,255,255,0.08)" }}>
        <span className="text-xs font-bold uppercase tracking-widest" style={{ color:color.accent }}>Purpose</span>
        <span className="text-xs font-bold uppercase tracking-widest" style={{ color:color.accent }}>Data Used</span>
      </div>
      {rows.map(([p,d], i) => (
        <div key={i} className="grid grid-cols-2 px-5 py-3.5 border-b last:border-b-0"
          style={{ borderColor:"rgba(255,255,255,0.05)", background: i%2===0?"rgba(255,255,255,0.025)":"transparent" }}>
          <span className="text-slate-300 text-sm pr-4">{p}</span>
          <span className="text-slate-400 text-sm">{d}</span>
        </div>
      ))}
    </div>
  );
}

function SectionCard({ s, index }) {
  const [open, setOpen] = useState(false);
  const [hov, setHov] = useState(false);
  const color = s.color;

  const linkify = (text) => {
    if (!text || !text.includes("vikrant@sustainfyenergy.com")) return text;
    const parts = text.split("vikrant@sustainfyenergy.com");
    return <>{parts[0]}<a href="mailto:vikrant@sustainfyenergy.com" className="underline font-bold" style={{ color:color.accent }}>vikrant@sustainfyenergy.com</a>{parts[1]}</>;
  };

  return (
    <motion.div
      initial={{ opacity:0, y:28 }} whileInView={{ opacity:1, y:0 }}
      viewport={{ once:true }} transition={{ duration:0.45, delay:index*0.05 }}
      id={s.id}
      onMouseEnter={()=>setHov(true)} onMouseLeave={()=>setHov(false)}
      className="relative overflow-hidden rounded-2xl border scroll-mt-24 transition-all duration-300"
      style={{
        borderColor: hov ? color.borderHov : color.border,
        background: hov ? "rgba(15,23,42,0.97)" : "rgba(15,23,42,0.65)",
        boxShadow: hov ? `0 20px 60px rgba(0,0,0,0.6), 0 0 0 1px ${color.accent}18` : "0 2px 16px rgba(0,0,0,0.28)",
        transform: hov ? "translateY(-2px)" : "translateY(0)",
      }}>

      {/* Top gradient line */}
      <div className="absolute top-0 left-0 right-0 h-px transition-opacity duration-300"
        style={{ background:`linear-gradient(90deg,${color.accent},transparent)`, opacity: hov?1:0.45 }} />

      {/* Corner glow */}
      <div className="absolute -top-20 -right-20 w-40 h-40 rounded-full pointer-events-none transition-opacity duration-500"
        style={{ background:`radial-gradient(circle,${color.accent}15,transparent)`, opacity:hov?1:0 }} />

      {/* Header */}
      <button onClick={()=>setOpen(o=>!o)} className="w-full flex items-center gap-4 px-6 py-5 text-left">
        <div className="w-12 h-12 rounded-xl flex items-center justify-center border shrink-0 transition-all duration-300"
          style={{ background:open||hov?color.bg:"rgba(255,255,255,0.04)", borderColor:color.border, color:color.accent }}>
          {s.icon}
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-xs font-bold uppercase tracking-widest mb-0.5" style={{ color:color.accent }}>
            Section {s.num} — {s.label}
          </div>
          <h2 className="text-base md:text-lg font-extrabold text-white leading-tight">{s.title}</h2>
          {!open && <p className="text-slate-500 text-xs mt-1 line-clamp-1">{s.summary}</p>}
        </div>
        <div className="shrink-0 flex items-center gap-2.5">
          <span className="hidden sm:flex text-xs font-bold px-2.5 py-1 rounded-lg"
            style={{ background:`${color.accent}18`, color:color.accent }}>{s.num}</span>
          <ChevronDownIcon style={{ width:20,height:20,color:color.accent,
            transform:open?"rotate(180deg)":"rotate(0deg)",
            transition:"transform 0.3s cubic-bezier(0.16,1,0.3,1)" }} />
        </div>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div key="body"
            initial={{ height:0, opacity:0 }} animate={{ height:"auto", opacity:1 }}
            exit={{ height:0, opacity:0 }} transition={{ duration:0.35, ease:[0.16,1,0.3,1] }}
            style={{ overflow:"hidden" }}>
            <div className="px-6 pb-7 flex flex-col gap-5">
              <div className="h-px" style={{ background:`linear-gradient(90deg,${color.border},transparent)` }} />

              {s.subsections?.map((sub, i) => (
                <div key={i} className="flex flex-col gap-3">
                  <div className="flex items-center gap-2.5">
                    <span className="text-xl">{sub.icon}</span>
                    <h3 className="text-white font-bold text-sm">{sub.heading}</h3>
                  </div>
                  <p className="text-slate-400 text-sm leading-relaxed">{sub.body}</p>
                  {sub.pills && (
                    <div className="flex flex-wrap gap-2">
                      {sub.pills.map((p,j) => (
                        <span key={j} className="text-xs font-semibold px-3 py-1.5 rounded-lg border"
                          style={{ background:color.bg, borderColor:color.border, color:color.accent }}>{p}</span>
                      ))}
                    </div>
                  )}
                  {sub.warn && (
                    <div className="flex gap-2.5 items-start rounded-xl px-4 py-3 border"
                      style={{ background:"rgba(251,191,36,0.07)", borderColor:"rgba(251,191,36,0.22)" }}>
                      <ExclamationTriangleIcon style={{ width:16,height:16,color:"#fbbf24",flexShrink:0,marginTop:1 }} />
                      <p className="text-amber-300 text-xs leading-relaxed">{sub.warn}</p>
                    </div>
                  )}
                  {i < s.subsections.length-1 && <div className="h-px" style={{ background:"rgba(255,255,255,0.05)" }} />}
                </div>
              ))}

              {s.table && <PolicyTable rows={s.table} color={color} />}
              {s.footnote && (
                <p className="text-slate-500 text-xs">{linkify(s.footnote)}</p>
              )}

              {s.secItems && (
                <div className="grid gap-3">
                  {s.secItems.map((item, i) => (
                    <div key={i} className="flex items-start gap-3 rounded-xl px-4 py-3.5 border"
                      style={{ background:"rgba(255,255,255,0.03)", borderColor:"rgba(255,255,255,0.07)" }}>
                      <span className="text-lg shrink-0">{item.icon}</span>
                      <div>
                        <p className="text-white font-semibold text-sm">{item.label}</p>
                        <p className="text-slate-400 text-xs leading-relaxed mt-0.5">{item.detail}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {s.body && s.body.split("\n\n").map((para, i) => (
                <p key={i} className="text-slate-300 text-sm leading-relaxed">{linkify(para)}</p>
              ))}

              {s.info && (
                <div className="flex gap-2.5 items-start rounded-xl px-4 py-3.5 border"
                  style={{ background:"rgba(96,165,250,0.07)", borderColor:"rgba(96,165,250,0.22)" }}>
                  <InformationCircleIcon style={{ width:16,height:16,color:"#60a5fa",flexShrink:0,marginTop:1 }} />
                  <p className="text-sky-300 text-sm leading-relaxed">{s.info}</p>
                </div>
              )}

              {s.warn && (
                <div className="flex gap-2.5 items-start rounded-xl px-4 py-3.5 border"
                  style={{ background:"rgba(251,191,36,0.07)", borderColor:"rgba(251,191,36,0.22)" }}>
                  <ExclamationTriangleIcon style={{ width:16,height:16,color:"#fbbf24",flexShrink:0,marginTop:1 }} />
                  <p className="text-amber-300 text-sm leading-relaxed">{s.warn}</p>
                </div>
              )}

              {s.rights && (
                <div className="grid gap-2.5">
                  {s.rights.map((item, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <div className="mt-1 w-5 h-5 rounded-full flex items-center justify-center shrink-0"
                        style={{ background:color.bg, border:`1px solid ${color.border}` }}>
                        <div className="w-1.5 h-1.5 rounded-full" style={{ background:color.accent }} />
                      </div>
                      <div>
                        <span className="text-white font-semibold text-sm">{item.right}: </span>
                        <span className="text-slate-400 text-sm">{item.detail}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {s.highlight && (
                <div className="flex gap-2.5 items-start rounded-xl px-4 py-3.5 border"
                  style={{ background:color.bg, borderColor:color.border }}>
                  <CheckCircleIcon style={{ width:16,height:16,color:color.accent,flexShrink:0,marginTop:1 }} />
                  <p className="text-sm leading-relaxed" style={{ color:color.accent }}>{linkify(s.highlight)}</p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function PrivacyPolicy() {
  const [tocOpen, setTocOpen] = useState(false);
  const [activeSection, setActiveSection] = useState(null);

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior:"smooth", block:"start" });
    setTocOpen(false);
  };

  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => entries.forEach(e => { if(e.isIntersecting) setActiveSection(e.target.id); }),
      { threshold:0.2 }
    );
    SECTIONS.forEach(s => { const el = document.getElementById(s.id); if(el) obs.observe(el); });
    return () => obs.disconnect();
  }, []);

  return (
    <div className="min-h-screen text-white relative" style={{ background:"linear-gradient(to bottom,#0c1f3a,#000,#071a0f)" }}>
      <ScrollProgress />

      {/* Background effects */}
      <div className="fixed inset-0 pointer-events-none z-0" style={{ background:"radial-gradient(circle,rgba(100,200,150,0.18) 1px,transparent 1px)", backgroundSize:"26px 26px" }} />
      <div className="fixed pointer-events-none z-0" style={{ top:-200,right:-100,width:700,height:700,borderRadius:"50%",background:"rgba(52,211,153,0.07)",filter:"blur(130px)" }} />
      <div className="fixed pointer-events-none z-0" style={{ bottom:100,left:-150,width:500,height:500,borderRadius:"50%",background:"rgba(251,191,36,0.05)",filter:"blur(110px)" }} />
      <div className="fixed pointer-events-none z-0" style={{ top:"40%",left:"30%",width:400,height:400,borderRadius:"50%",background:"rgba(96,165,250,0.04)",filter:"blur(100px)" }} />

      {/* ── NAVBAR ── */}
      {/* <nav className="sticky top-0.5 z-50 flex items-center justify-between px-5 md:px-12 py-4 border-b"
        style={{ background:"rgba(10,18,32,0.9)", backdropFilter:"blur(20px)", borderColor:"rgba(51,65,85,0.45)" }}>
        <a href="https://pvprotech.com" className="flex items-center gap-3 no-underline group">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center transition-transform duration-200 group-hover:scale-105"
            style={{ background:"linear-gradient(135deg,#34d399,#059669)" }}>
            <SunIcon style={{ width:18,height:18,color:"#fff" }} />
          </div>
          <span className="text-lg font-extrabold tracking-tight bg-clip-text text-transparent"
            style={{ backgroundImage:"linear-gradient(to right,#fde047,#4ade80)" }}>PVPROTECH</span>
        </a>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-4 py-1.5 rounded-full border"
            style={{ background:"rgba(52,211,153,0.08)", borderColor:"rgba(52,211,153,0.25)" }}>
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            <span className="text-xs font-bold text-green-400 tracking-widest uppercase hidden sm:block">Privacy Policy</span>
          </div>
          <a href="https://pvprotech.com" className="text-xs text-slate-500 hover:text-white transition-colors no-underline hidden md:block">← Back to site</a>
        </div>
      </nav> */}

      {/* ── HERO ── */}
      <section className="relative overflow-hidden pt-20 pb-10 px-6">
        <div className="max-w-5xl mx-auto text-center relative z-10">
          <motion.div initial={{ opacity:0,y:16 }} animate={{ opacity:1,y:0 }} transition={{ duration:0.5 }}
            className="inline-flex items-center gap-2.5 px-4 py-1.5 mb-8 rounded-full border"
            style={{ background:"rgba(52,211,153,0.08)", borderColor:"rgba(52,211,153,0.25)" }}>
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            <span className="text-xs font-bold text-green-400 tracking-widest uppercase">Effective April 24, 2025 · v1.0</span>
          </motion.div>

          <motion.h1 initial={{ opacity:0,y:28 }} animate={{ opacity:1,y:0 }} transition={{ duration:0.65,delay:0.1 }}
            className="text-5xl md:text-7xl font-extrabold leading-none tracking-tight mb-6 bg-clip-text text-transparent drop-shadow-lg"
            style={{ backgroundImage:"linear-gradient(to right,#fde047,#4ade80,#60a5fa)" }}>
            Your Privacy.<br />Our Commitment.
          </motion.h1>

          <motion.p initial={{ opacity:0,y:20 }} animate={{ opacity:1,y:0 }} transition={{ duration:0.6,delay:0.2 }}
            className="text-lg md:text-xl text-sky-200 max-w-2xl mx-auto leading-relaxed mb-12">
            Full transparency, zero fine print. Here's exactly how PVPROTECH collects, uses, and protects your data.
          </motion.p>

          <motion.div initial={{ opacity:0,y:20 }} animate={{ opacity:1,y:0 }} transition={{ duration:0.6,delay:0.3 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-3 max-w-3xl mx-auto mb-12">
            {[
              { icon:"🛡️", label:"No Data Selling",  sub:"Ever",                 color:"#34d399" },
              { icon:"🚫", label:"Zero Ad Networks", sub:"No tracking SDKs",     color:"#fbbf24" },
              { icon:"📍", label:"Location",         sub:"App functionality only",color:"#60a5fa" },
              { icon:"⚖️", label:"GDPR Aware",       sub:"DPDP Act compliant",   color:"#a78bfa" },
            ].map(b => <TrustBadge key={b.label} {...b} />)}
          </motion.div>
        </div>
      </section>

      {/* ── STATS BAR ── */}
      <div className="border-t border-b px-6 py-8" style={{ background:"rgba(10,18,32,0.88)", borderColor:"rgba(51,65,85,0.5)" }}>
        <div className="max-w-5xl mx-auto grid gap-4" style={{ gridTemplateColumns:"repeat(auto-fit,minmax(120px,1fr))" }}>
          {[
            { value:"9",       label:"Policy sections", color:"#fde047" },
            { value:"0",       label:"Third-party SDKs",color:"#4ade80" },
            { value:"0",       label:"Ad networks",     color:"#4ade80" },
            { value:"30d",     label:"Response SLA",    color:"#60a5fa" },
            { value:"256-bit", label:"AES encryption",  color:"#a78bfa" },
          ].map((stat, i, arr) => (
            <div key={stat.label} className="text-center px-3"
              style={{ borderRight:i<arr.length-1?"1px solid rgba(51,65,85,0.5)":"none" }}>
              <div className="text-2xl md:text-3xl font-extrabold leading-none mb-1.5" style={{ color:stat.color }}>{stat.value}</div>
              <div className="text-xs text-slate-500 uppercase tracking-widest">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── MAIN CONTENT ── */}
      <section className="relative z-10 py-14 px-6">
        <div className="max-w-5xl mx-auto flex gap-8 items-start">

          {/* Desktop sticky sidebar */}
          <aside className="hidden lg:flex flex-col gap-1 sticky top-24 w-52 shrink-0">
            <p className="text-xs font-bold text-slate-600 uppercase tracking-widest mb-3 px-2">Contents</p>
            {SECTIONS.map(s => (
              <button key={s.id} onClick={()=>scrollTo(s.id)}
                className="flex items-center gap-2.5 py-2 px-3 rounded-xl text-left transition-all duration-200"
                style={{
                  background: activeSection===s.id ? s.color.bg : "transparent",
                  color: activeSection===s.id ? s.color.accent : "#64748b",
                  borderLeft: `2px solid ${activeSection===s.id ? s.color.accent : "transparent"}`,
                }}>
                <span className="text-xs font-bold opacity-60">{s.num}</span>
                <span className="text-xs truncate">{s.title}</span>
              </button>
            ))}
          </aside>

          {/* Main column */}
          <div className="flex-1 min-w-0 flex flex-col gap-5">

            {/* Mobile TOC */}
            <div className="lg:hidden relative overflow-hidden rounded-2xl border"
              style={{ borderColor:"rgba(52,211,153,0.28)", background:"rgba(15,23,42,0.75)" }}>
              <div className="absolute left-0 top-0 bottom-0 w-1 rounded-l-2xl"
                style={{ background:"linear-gradient(to bottom,#34d399,#4ade80,transparent)" }} />
              <button onClick={()=>setTocOpen(o=>!o)} className="w-full flex items-center justify-between px-6 py-4 text-left">
                <div className="flex items-center gap-3">
                  <DocumentTextIcon style={{ width:16,height:16,color:"#4ade80" }} />
                  <span className="text-xs font-bold text-green-400 uppercase tracking-widest">Table of Contents</span>
                  <span className="text-slate-600 text-xs">— {SECTIONS.length} sections</span>
                </div>
                <ChevronDownIcon style={{ width:17,height:17,color:"#4ade80",transform:tocOpen?"rotate(180deg)":"rotate(0deg)",transition:"transform 0.3s" }} />
              </button>
              {tocOpen && (
                <div className="px-6 pb-5 grid grid-cols-1 sm:grid-cols-2 gap-1 border-t" style={{ borderColor:"rgba(52,211,153,0.15)" }}>
                  {SECTIONS.map(s => (
                    <button key={s.id} onClick={()=>scrollTo(s.id)}
                      className="flex items-center gap-3 py-2.5 px-3 rounded-xl text-left transition-all hover:bg-white/5">
                      <span className="text-xs font-extrabold" style={{ color:s.color.accent,minWidth:20 }}>{s.num}</span>
                      <span className="text-slate-300 text-xs">{s.title}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Intro */}
            <motion.div initial={{ opacity:0,y:20 }} whileInView={{ opacity:1,y:0 }} viewport={{ once:true }}
              className="rounded-2xl border px-6 py-5"
              style={{ background:"rgba(15,23,42,0.65)", borderColor:"rgba(51,65,85,0.5)" }}>
              <p className="text-slate-300 text-sm leading-relaxed">
                Welcome to <span className="text-white font-bold">PVPROTECH</span> — a field technician and solar energy management platform operated by{" "}
                <span className="text-white font-bold">Sustainfy Energy</span>. This Privacy Policy explains how we collect, use, store, and safeguard your personal information. By using PVPROTECH, you agree to the practices described here.
              </p>
              <div className="mt-4 flex flex-wrap gap-3">
                <a href="mailto:vikrant@sustainfyenergy.com"
                  className="flex items-center gap-2 text-xs font-semibold px-3.5 py-2 rounded-xl border no-underline"
                  style={{ background:"rgba(96,165,250,0.08)", borderColor:"rgba(96,165,250,0.25)", color:"#60a5fa" }}>
                  <EnvelopeIcon style={{ width:14,height:14 }} /> vikrant@sustainfyenergy.com
                </a>
                <span className="flex items-center gap-2 text-xs text-slate-500 px-3.5 py-2 rounded-xl border"
                  style={{ borderColor:"rgba(255,255,255,0.06)" }}>🌐 pvprotech.com</span>
              </div>
            </motion.div>

            {SECTIONS.map((s, i) => <SectionCard key={s.id} s={s} index={i} />)}
            <p className="text-center text-xs text-slate-600 py-2">Click any section above to expand its details ↑</p>
          </div>
        </div>
      </section>

      {/* ── CONTACT CTA ── */}
      <section className="relative py-20 px-6 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none" style={{ background:"radial-gradient(circle,rgba(100,200,150,0.18) 1px,transparent 1px)", backgroundSize:"26px 26px" }} />
        <div className="absolute inset-0" style={{ background:"linear-gradient(to bottom,rgba(0,0,0,0.75),rgba(0,0,0,0.7),rgba(0,0,0,0.75))" }} />
        <div className="max-w-2xl mx-auto text-center relative z-10">
          <motion.div initial={{ opacity:0,y:16 }} whileInView={{ opacity:1,y:0 }} viewport={{ once:true }}
            className="inline-flex items-center gap-2.5 px-4 py-1.5 mb-6 rounded-full border"
            style={{ background:"rgba(52,211,153,0.08)", borderColor:"rgba(52,211,153,0.25)" }}>
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            <span className="text-xs font-bold text-green-400 tracking-widest uppercase">Section 10 — Contact</span>
          </motion.div>

          <motion.h2 initial={{ opacity:0,y:20 }} whileInView={{ opacity:1,y:0 }} viewport={{ once:true }} transition={{ delay:0.1 }}
            className="text-4xl md:text-5xl font-extrabold mb-5 bg-clip-text text-transparent"
            style={{ backgroundImage:"linear-gradient(to right,#fde047,#4ade80,#60a5fa)" }}>
            Questions About<br />Your Privacy?
          </motion.h2>

          <motion.p initial={{ opacity:0,y:16 }} whileInView={{ opacity:1,y:0 }} viewport={{ once:true }} transition={{ delay:0.2 }}
            className="text-sky-200 text-base leading-relaxed mb-10">
            Our team responds to all privacy requests within 30 days. Reach out for data access, corrections, or deletions.
          </motion.p>

          <motion.div initial={{ opacity:0,y:16 }} whileInView={{ opacity:1,y:0 }} viewport={{ once:true }} transition={{ delay:0.3 }}
            className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
            {[
              { icon:"✉️", label:"Email Us",  val:"vikrant@sustainfyenergy.com", href:"mailto:vikrant@sustainfyenergy.com", color:"#34d399" },
              { icon:"📞", label:"Call Us",   val:"+91 99759 29989",             href:"tel:+919975929989",                  color:"#60a5fa" },
              { icon:"💬", label:"WhatsApp",  val:"Chat on WhatsApp",            href:"https://wa.me/919975929989",         color:"#4ade80" },
            ].map(c => (
              <a key={c.label} href={c.href} target="_blank" rel="noopener noreferrer"
                className="flex flex-col items-center gap-3 px-4 py-6 rounded-2xl border no-underline transition-all duration-300"
                style={{ background:"rgba(15,23,42,0.8)", borderColor:`${c.color}35` }}
                onMouseEnter={e=>{ e.currentTarget.style.borderColor=c.color; e.currentTarget.style.transform="translateY(-5px)"; e.currentTarget.style.background="rgba(15,23,42,0.97)"; e.currentTarget.style.boxShadow=`0 16px 40px rgba(0,0,0,0.5)`; }}
                onMouseLeave={e=>{ e.currentTarget.style.borderColor=`${c.color}35`; e.currentTarget.style.transform="translateY(0)"; e.currentTarget.style.background="rgba(15,23,42,0.8)"; e.currentTarget.style.boxShadow="none"; }}>
                <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
                  style={{ background:`${c.color}18`, border:`1px solid ${c.color}35` }}>{c.icon}</div>
                <div className="text-center">
                  <p className="text-xs font-bold uppercase tracking-widest mb-0.5" style={{ color:c.color }}>{c.label}</p>
                  <p className="text-white text-xs font-medium">{c.val}</p>
                </div>
              </a>
            ))}
          </motion.div>

          <p className="text-slate-500 text-xs">
            PVPROTECH is operated by <span className="text-slate-400">Sustainfy Energy</span> · Pune, Maharashtra, India
          </p>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="border-t px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-3"
        style={{ borderColor:"rgba(51,65,85,0.5)", background:"rgba(10,18,32,0.9)" }}>
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background:"linear-gradient(135deg,#34d399,#059669)" }}>
            <SunIcon style={{ width:14,height:14,color:"#fff" }} />
          </div>
          <span className="text-sm font-bold bg-clip-text text-transparent"
            style={{ backgroundImage:"linear-gradient(to right,#fde047,#4ade80)" }}>PVPROTECH</span>
          <span className="text-slate-600 text-sm">· Sustainfy Energy</span>
        </div>
        <div className="flex items-center gap-4 text-xs text-slate-600">
          <span>Privacy Policy v1.0</span>
          <span>·</span>
          <span>April 24, 2025</span>
          <span>·</span>
          <a href="https://pvprotech.com" className="hover:text-white transition-colors" style={{ color:"inherit" }}>pvprotech.com</a>
        </div>
      </footer>

      {/* WhatsApp FAB */}
      <a href="https://wa.me/919975929989" target="_blank" rel="noopener noreferrer"
        className="fixed bottom-7 right-7 w-14 h-14 rounded-full flex items-center justify-center text-2xl no-underline z-50"
        style={{ background:"#25d366", boxShadow:"0 4px 22px rgba(37,211,102,0.45)" }}>
        💬
      </a>
    </div>
  );
}