import { useState } from "react";
import { motion } from "framer-motion";
import {
  FaApple,
  FaGooglePlay,
  FaSolarPanel,
  FaCalculator,
  FaChartLine,
  FaBroom,
  FaFileAlt,
  FaMoneyBillWave,
  FaUserTie,
} from "react-icons/fa";
import {
  BoltIcon,
  ChartBarIcon,
  ShieldCheckIcon,
  InformationCircleIcon,
  HomeModernIcon,
  PlusCircleIcon,
  ArrowTrendingUpIcon,
  SunIcon,
  MapPinIcon,
  DocumentTextIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";
import { QRCodeSVG } from "qrcode.react";

/* ─────────────────────────────────────────────────────────────
   CONSTANTS
───────────────────────────────────────────────────────────── */
const PLAY_STORE_URL =
  "https://play.google.com/store/apps/details?id=com.umakant3525.PV_PROTECT&hl=en_IN";
const APP_STORE_URL =
  "https://apps.apple.com/in/app/pvprotech/id6744603579";

/* ─────────────────────────────────────────────────────────────
   DATA
───────────────────────────────────────────────────────────── */

const APP_FEATURES = [
  {
    id: 1,
    icon: <FaCalculator style={{ width: 22, height: 22 }} />,
    label: "Free Tool",
    title: "Free Health Calculator",
    desc: "Get instant insights into your solar plant's condition with our built-in calculator — completely free. Evaluates key performance indicators and outputs a clear health score.",
    bullets: [
      "Instant Plant Health Score (0–100)",
      "Performance Ratio Analysis",
      "Degradation Rate Estimate",
      "Recommended Next Action",
    ],
    accent: "#fbbf24",
    accentBg: "rgba(251,191,36,0.10)",
    accentBorder: "rgba(251,191,36,0.28)",
    accentBorderHover: "rgba(251,191,36,0.8)",
  },
  {
    id: 2,
    icon: <BoltIcon style={{ width: 22, height: 22 }} />,
    label: "Energy",
    title: "Calculate Your Energy",
    desc: "Track exactly how much energy your plant generates by the hour, day, or month. Compare against expected output using irradiation data and EPI metrics.",
    bullets: [
      "Hourly / Daily / Monthly Charts",
      "Irradiation vs Actual Output",
      "Energy Performance Index (EPI)",
      "Bill Savings Calculation",
    ],
    accent: "#34d399",
    accentBg: "rgba(52,211,153,0.10)",
    accentBorder: "rgba(52,211,153,0.28)",
    accentBorderHover: "rgba(52,211,153,0.8)",
  },
  {
    id: 3,
    icon: <HomeModernIcon style={{ width: 22, height: 22 }} />,
    label: "Setup",
    title: "Onboard Your Solar Plant",
    desc: "Add your plant to PVProtech in minutes with our guided onboarding flow. No technical expertise required — just a few details and you're monitoring live.",
    bullets: [
      "Guided 4-Step Setup Wizard",
      "Supports All Major Inverter Brands",
      "Auto-detects Plant Specifications",
      "Live Dashboard in Under 5 Minutes",
    ],
    accent: "#38bdf8",
    accentBg: "rgba(56,189,248,0.10)",
    accentBorder: "rgba(56,189,248,0.28)",
    accentBorderHover: "rgba(56,189,248,0.8)",
  },
  {
    id: 4,
    icon: <ChartBarIcon style={{ width: 22, height: 22 }} />,
    label: "Management",
    title: "Efficient Plant Management",
    desc: "A complete 360° management suite for your solar investment — generation data, cleaning cycles, plant info, reports, and financial analytics all in one place.",
    bullets: [
      "Real-Time Generation Monitoring",
      "Cleaning Cycle Scheduling & Alerts",
      "Plant Info & Document Vault",
      "Financial ROI & Bill Analysis",
    ],
    accent: "#a78bfa",
    accentBg: "rgba(167,139,250,0.10)",
    accentBorder: "rgba(167,139,250,0.28)",
    accentBorderHover: "rgba(167,139,250,0.8)",
  },
];

const CLIENT_DASHBOARD = [
  {
    icon: <ChartBarIcon style={{ width: 22, height: 22 }} />,
    title: "Plant Generation",
    desc: "Live and historical generation data with trend charts, daily summaries, and month-on-month comparisons.",
    accent: "#34d399",
    accentBg: "rgba(52,211,153,0.10)",
    accentBorder: "rgba(52,211,153,0.28)",
    accentBorderHover: "rgba(52,211,153,0.8)",
    label: "Client Portal",
  },
  {
    icon: <SunIcon style={{ width: 22, height: 22 }} />,
    title: "Irradiation Data",
    desc: "Location-specific solar irradiance correlated to your plant's actual output to benchmark against theoretical maximum generation.",
    accent: "#fbbf24",
    accentBg: "rgba(251,191,36,0.10)",
    accentBorder: "rgba(251,191,36,0.28)",
    accentBorderHover: "rgba(251,191,36,0.8)",
    label: "Client Portal",
  },
  {
    icon: <BoltIcon style={{ width: 22, height: 22 }} />,
    title: "EPI Tracking",
    desc: "Monitor the Energy Performance Index to evaluate how efficiently your system converts sunlight into usable electricity over time.",
    accent: "#38bdf8",
    accentBg: "rgba(56,189,248,0.10)",
    accentBorder: "rgba(56,189,248,0.28)",
    accentBorderHover: "rgba(56,189,248,0.8)",
    label: "Client Portal",
  },
  {
    icon: <FaBroom style={{ fontSize: 20 }} />,
    title: "Cleaning Cycles",
    desc: "Track scheduled panel cleaning dates, view service history, and receive smart push alerts when dust accumulation is impacting your output.",
    accent: "#4ade80",
    accentBg: "rgba(74,222,128,0.10)",
    accentBorder: "rgba(74,222,128,0.28)",
    accentBorderHover: "rgba(74,222,128,0.8)",
    label: "Client Portal",
  },
  {
    icon: <MapPinIcon style={{ width: 22, height: 22 }} />,
    title: "Plant Info",
    desc: "Access your full plant profile — capacity, panel brand, inverter model, warranty status, installation date, and installer contact — in one tap.",
    accent: "#fb923c",
    accentBg: "rgba(251,146,60,0.10)",
    accentBorder: "rgba(251,146,60,0.28)",
    accentBorderHover: "rgba(251,146,60,0.8)",
    label: "Client Portal",
  },
  {
    icon: <DocumentTextIcon style={{ width: 22, height: 22 }} />,
    title: "Reports View",
    desc: "Download detailed PDF reports for any period — generation summaries, performance analysis, and maintenance logs. Share directly from the app.",
    accent: "#a78bfa",
    accentBg: "rgba(167,139,250,0.10)",
    accentBorder: "rgba(167,139,250,0.28)",
    accentBorderHover: "rgba(167,139,250,0.8)",
    label: "Client Portal",
  },
  {
    icon: <FaMoneyBillWave style={{ fontSize: 20 }} />,
    title: "Financial Analytics",
    desc: "Track your solar investment ROI, monitor monthly savings, and see exactly how much your plant reduced your electricity bill — with trend graphs.",
    accent: "#34d399",
    accentBg: "rgba(52,211,153,0.10)",
    accentBorder: "rgba(52,211,153,0.28)",
    accentBorderHover: "rgba(52,211,153,0.8)",
    label: "Client Portal",
  },
  {
    icon: <FaChartLine style={{ fontSize: 20 }} />,
    title: "Bill Analysis",
    desc: "Compare pre-solar and post-solar electricity bills side by side. Understand unit savings, cost savings, and projected annual benefit with visual breakdowns.",
    accent: "#fbbf24",
    accentBg: "rgba(251,191,36,0.10)",
    accentBorder: "rgba(251,191,36,0.28)",
    accentBorderHover: "rgba(251,191,36,0.8)",
    label: "Client Portal",
  },
];

const ONBOARD_STEPS = [
  { n: 1, title: "Register Your Solar Power Plant", desc: "Share Your Plant Details", color: "#34d399" },
  { n: 2, title: "Add Plant Details", desc: "Enter your plant's capacity, installation date, inverter model, and location.", color: "#38bdf8" },
  { n: 3, title: "Share Your Invertor Details", desc: "Guided integration for all major inverter brands — no technical expertise needed.", color: "#a78bfa" },
  { n: 4, title: "Go Live — Monitor Now", desc: "Your dashboard activates instantly with live generation data, health scores, and alerts.", color: "#fbbf24" },
];

const APP_STATS = [
  { value: "Free", label: "Health Calculator", color: "#fde047" },
  { value: "Live", label: "Plant Monitoring", color: "#4ade80" },
  { value: "2 min", label: "Plant Onboarding", color: "#c084fc" },
  { value: "iOS+", label: "Android Support", color: "#fbbf24" },
  { value: "24/7", label: "Data Updates", color: "#34d399" },
];

/* ─────────────────────────────────────────────────────────────
   SHARED: HERO BUTTON
───────────────────────────────────────────────────────────── */
function HeroButton({ gradient, hoverGrad, shadow, icon, label, onClick }) {
  const [h, setH] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setH(true)}
      onMouseLeave={() => setH(false)}
      className="relative overflow-hidden flex items-center gap-3 px-6 py-3.5 rounded-full text-white text-base font-semibold cursor-pointer transition-all duration-300"
      style={{
        background: h ? hoverGrad : gradient,
        transform: h ? "scale(1.05)" : "scale(1)",
        boxShadow: h ? `0 12px 32px ${shadow}` : "0 4px 16px rgba(0,0,0,0.3)",
      }}
    >
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "linear-gradient(105deg,transparent 30%,rgba(255,255,255,0.18) 50%,transparent 70%)",
          backgroundSize: "200% 100%",
          backgroundPosition: h ? "150% 0" : "-50% 0",
          transition: "background-position 0.7s",
        }}
      />
      {icon}
      <span className="transition-all duration-200" style={{ letterSpacing: h ? "0.04em" : "normal" }}>
        {label}
      </span>
    </button>
  );
}

/* ─────────────────────────────────────────────────────────────
   QR HOVER BUTTON  ← NEW
   Shows the button label normally; on hover, replaces content
   with a QR code. Clicking always navigates to `href`.
───────────────────────────────────────────────────────────── */
function QRHoverButton({ gradient, hoverGrad, shadow, accentColor, icon, label, href, qrValue }) {
  const [hovered, setHovered] = useState(false);

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        textDecoration: "none",
        borderRadius: hovered ? 20 : 9999,
        overflow: "hidden",
        transition: "all 0.35s cubic-bezier(0.16,1,0.3,1)",
        background: hovered ? "rgba(15,23,42,0.97)" : gradient,
        border: hovered ? `2px solid ${accentColor}` : "2px solid transparent",
        boxShadow: hovered
          ? `0 0 32px ${accentColor}55, 0 12px 40px rgba(0,0,0,0.5)`
          : `0 4px 16px rgba(0,0,0,0.3)`,
        width: hovered ? 180 : "auto",
        height: hovered ? 220 : 52,
        padding: hovered ? 0 : "0 24px",
        cursor: "pointer",
      }}
    >
      {/* Normal button content */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          position: "absolute",
          opacity: hovered ? 0 : 1,
          transform: hovered ? "scale(0.8)" : "scale(1)",
          transition: "all 0.25s ease",
          color: "#fff",
          fontSize: 15,
          fontWeight: 600,
          whiteSpace: "nowrap",
          pointerEvents: "none",
        }}
      >
        {icon}
        <span>{label}</span>
      </div>

      {/* QR overlay on hover */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 10,
          opacity: hovered ? 1 : 0,
          transform: hovered ? "scale(1)" : "scale(0.85)",
          transition: "all 0.3s cubic-bezier(0.16,1,0.3,1)",
          padding: "16px 12px 12px",
          pointerEvents: "none",
        }}
      >
        {/* QR code */}
        <div
          style={{
            borderRadius: 12,
            padding: 8,
            background: "#fff",
            border: `2px solid ${accentColor}`,
            boxShadow: `0 0 16px ${accentColor}44`,
          }}
        >
          <QRCodeSVG
            value={qrValue}
            size={110}
            bgColor="#ffffff"
            fgColor="#0f172a"
            level="H"
          />
        </div>

        {/* Label */}
        <div style={{ textAlign: "center" }}>
          <p style={{ fontSize: 10, fontWeight: 800, color: accentColor, textTransform: "uppercase", letterSpacing: "0.08em", margin: 0 }}>
            📱 Scan to Download
          </p>
          <p style={{ fontSize: 9, color: "rgba(255,255,255,0.45)", marginTop: 2 }}>
            or click to open store
          </p>
        </div>
      </div>
    </a>
  );
}


/* ─────────────────────────────────────────────────────────────
   APP FEATURE CARD
───────────────────────────────────────────────────────────── */
function AppFeatureCard({ s, index }) {
  const [h, setH] = useState(false);
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.08 }}
      onMouseEnter={() => setH(true)}
      onMouseLeave={() => setH(false)}
      className="relative flex flex-col overflow-hidden cursor-default rounded-2xl px-5 py-6 border transition-all duration-300"
      style={{
        borderColor: h ? s.accentBorderHover : s.accentBorder,
        background: h ? "rgba(15,23,42,0.95)" : "rgba(15,23,42,0.6)",
        transform: h ? "translateY(-5px) scale(1.02)" : "translateY(0) scale(1)",
        boxShadow: h ? "0 16px 40px rgba(0,0,0,0.5)" : "0 2px 12px rgba(0,0,0,0.25)",
      }}
    >
      <div
        className="absolute top-0 left-0 right-0 h-0.5 transition-opacity duration-300"
        style={{
          background: `linear-gradient(90deg,${s.accent},transparent)`,
          opacity: h ? 1 : 0,
        }}
      />
      <div className="flex items-center gap-3.5 mb-4">
        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center border shrink-0"
          style={{ background: s.accentBg, borderColor: s.accentBorder, color: s.accent }}
        >
          {s.icon}
        </div>
        <div>
          <div className="text-xs font-bold uppercase tracking-widest mb-0.5" style={{ color: s.accent }}>
            {s.label}
          </div>
          <h3 className="text-sm font-bold transition-colors duration-200" style={{ color: h ? s.accent : "#fff" }}>
            {s.title}
          </h3>
        </div>
      </div>
      <p className="text-sm leading-relaxed text-slate-400 mb-4">{s.desc}</p>
      <div className="border-t border-slate-700/60 pt-4 flex flex-col gap-2">
        {s.bullets.map((b, i) => (
          <div key={i} className="flex items-center gap-2.5">
            <div className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: s.accent }} />
            <span className="text-xs text-slate-400">{b}</span>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

/* ─────────────────────────────────────────────────────────────
   CLIENT DASHBOARD CARD
───────────────────────────────────────────────────────────── */
function ClientCard({ s, index }) {
  const [h, setH] = useState(false);
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.07 }}
      onMouseEnter={() => setH(true)}
      onMouseLeave={() => setH(false)}
      className="relative flex flex-col overflow-hidden cursor-default rounded-2xl px-5 py-5 border transition-all duration-300"
      style={{
        borderColor: h ? s.accentBorderHover : s.accentBorder,
        background: h ? "rgba(15,23,42,0.95)" : "rgba(15,23,42,0.6)",
        transform: h ? "translateY(-5px) scale(1.02)" : "translateY(0) scale(1)",
        boxShadow: h ? "0 12px 32px rgba(0,0,0,0.45)" : "0 2px 12px rgba(0,0,0,0.25)",
      }}
    >
      <div
        className="absolute top-0 left-0 right-0 h-0.5 transition-opacity duration-300"
        style={{
          background: `linear-gradient(90deg,${s.accent},transparent)`,
          opacity: h ? 1 : 0,
        }}
      />
      <div className="flex items-center gap-3 mb-3">
        <div
          className="w-11 h-11 rounded-xl flex items-center justify-center border shrink-0"
          style={{ background: s.accentBg, borderColor: s.accentBorder, color: s.accent }}
        >
          {s.icon}
        </div>
        <div>
          <div className="text-xs font-bold uppercase tracking-widest mb-0.5" style={{ color: s.accent }}>
            {s.label}
          </div>
          <h3 className="text-sm font-bold transition-colors duration-200" style={{ color: h ? s.accent : "#fff" }}>
            {s.title}
          </h3>
        </div>
      </div>
      <p className="text-sm leading-relaxed text-slate-400">{s.desc}</p>
    </motion.div>
  );
}

/* ─────────────────────────────────────────────────────────────
   PHONE MOCKUP COMPONENTS
───────────────────────────────────────────────────────────── */
const PrimaryPhone = () => (
  <div
    className="relative overflow-hidden shrink-0 mb-8"
    style={{
      width: 220,
      borderRadius: 38,
      border: "7px solid #1a3450",
      boxShadow: "0 30px 80px rgba(0,0,0,0.7), inset 0 1px 0 rgba(255,255,255,0.06)",
      background: "#091520",
    }}
  >
    <div
      className="absolute top-0 left-1/2 -translate-x-1/2 z-10"
      style={{ width: 72, height: 24, borderRadius: "0 0 14px 14px", background: "#091520" }}
    />
    <div
      style={{
        background: "linear-gradient(180deg,#0c2233 0%,#091520 100%)",
        padding: "32px 12px 14px",
        minHeight: 490,
        display: "flex",
        flexDirection: "column",
        gap: 9,
      }}
    >
      <div className="flex justify-between items-center">
        <div>
          <p style={{ fontSize: 8, color: "rgba(255,255,255,0.4)" }}>Good morning ☀️</p>
          <p style={{ fontSize: 11, fontWeight: 700, color: "#fff" }}>Rahul's Plant</p>
        </div>
        <div
          className="flex items-center justify-center rounded-full text-white font-bold"
          style={{ width: 26, height: 26, background: "linear-gradient(135deg,#34d399,#059669)", fontSize: 10 }}
        >
          R
        </div>
      </div>

      <div style={{ background: "linear-gradient(135deg,#065f46,#34d399)", borderRadius: 14, padding: 14 }}>
        <p style={{ fontSize: 7, color: "rgba(255,255,255,0.7)", textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: 3 }}>
          Today's Generation
        </p>
        <p style={{ fontSize: 22, fontWeight: 800, color: "#fff", lineHeight: 1 }}>
          28.4 <span style={{ fontSize: 10, fontWeight: 400 }}>kWh</span>
        </p>
        <p style={{ fontSize: 8, color: "rgba(255,255,255,0.7)", marginTop: 2 }}>↑ 12% vs yesterday</p>
        <div className="flex gap-2 mt-2">
          {[["Power Now", "4.2 kW"], ["Monthly", "710 kWh"]].map(([l, v]) => (
            <div key={l} style={{ flex: 1, background: "rgba(255,255,255,0.15)", borderRadius: 8, padding: "6px 7px" }}>
              <p style={{ fontSize: 6, color: "rgba(255,255,255,0.65)" }}>{l}</p>
              <p style={{ fontSize: 10, fontWeight: 700, color: "#fff" }}>{v}</p>
            </div>
          ))}
        </div>
      </div>

      <p style={{ fontSize: 8, fontWeight: 700, color: "rgba(255,255,255,0.45)", textTransform: "uppercase", letterSpacing: "0.8px" }}>
        Quick Metrics
      </p>
      <div className="flex gap-1.5">
        {[["☀️", "6.2", "Irrad."], ["⚡", "87%", "EPI"], ["🧹", "2d", "Clean"]].map(([e, v, l]) => (
          <div
            key={l}
            className="flex-1 flex flex-col items-center py-2"
            style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.05)", borderRadius: 10 }}
          >
            <span style={{ fontSize: 12 }}>{e}</span>
            <p style={{ fontSize: 10, fontWeight: 700, color: "#fff" }}>{v}</p>
            <p style={{ fontSize: 6, color: "rgba(255,255,255,0.4)" }}>{l}</p>
          </div>
        ))}
      </div>

      <div style={{ background: "rgba(255,255,255,0.05)", borderRadius: 10, padding: 10 }}>
        <p style={{ fontSize: 7, color: "rgba(255,255,255,0.45)", marginBottom: 8 }}>This Week (kWh)</p>
        <div className="flex items-end gap-1" style={{ height: 44 }}>
          {[50, 65, 60, 78, 86, 92, 100].map((h, i) => (
            <div key={i} style={{ flex: 1, borderRadius: "3px 3px 0 0", background: `rgba(52,211,153,${0.3 + i * 0.1})`, height: `${h}%` }} />
          ))}
        </div>
        <div className="flex justify-between mt-1">
          {["M", "T", "W", "T", "F", "S", "S"].map((d, i) => (
            <span key={i} style={{ fontSize: 6, color: "rgba(255,255,255,0.25)" }}>{d}</span>
          ))}
        </div>
      </div>

      <div style={{ background: "rgba(255,255,255,0.05)", borderRadius: 10, padding: 10 }}>
        <div className="flex justify-between items-center mb-2">
          <span style={{ fontSize: 8, color: "rgba(255,255,255,0.45)" }}>Plant Health Score</span>
          <span style={{ fontSize: 11, fontWeight: 800, color: "#34d399" }}>92/100</span>
        </div>
        <div style={{ height: 5, background: "rgba(255,255,255,0.1)", borderRadius: 3, overflow: "hidden" }}>
          <div style={{ height: "100%", width: "92%", background: "linear-gradient(90deg,#34d399,#fbbf24)", borderRadius: 3 }} />
        </div>
      </div>
    </div>
  </div>
);

const SecondaryPhone = () => (
  <div
    className="relative overflow-hidden shrink-0"
    style={{
      width: 190,
      borderRadius: 34,
      border: "6px solid #1a3450",
      boxShadow: "0 24px 60px rgba(0,0,0,0.6)",
      background: "#091520",
    }}
  >
    <div
      className="absolute top-0 left-1/2 -translate-x-1/2 z-10"
      style={{ width: 64, height: 22, borderRadius: "0 0 12px 12px", background: "#091520" }}
    />
    <div
      style={{
        background: "linear-gradient(180deg,#0c2233 0%,#091520 100%)",
        padding: "28px 11px 12px",
        minHeight: 410,
        display: "flex",
        flexDirection: "column",
        gap: 8,
      }}
    >
      <p style={{ fontSize: 10, fontWeight: 700, color: "#fff" }}>Reports</p>

      <div style={{ background: "rgba(52,211,153,0.12)", borderRadius: 10, padding: 11 }}>
        <p style={{ fontSize: 7, color: "rgba(255,255,255,0.5)", marginBottom: 2 }}>Monthly Savings</p>
        <p style={{ fontSize: 17, fontWeight: 800, color: "#34d399" }}>₹4,280</p>
      </div>

      {[
        { dot: "#34d399", t: "Generation Report", s: "March 2025", b: "PDF", bc: "rgba(52,211,153,0.2)", tc: "#34d399" },
        { dot: "#fbbf24", t: "Bill Analysis", s: "Units saved: 214", b: "View", bc: "rgba(251,191,36,0.2)", tc: "#fbbf24" },
        { dot: "#60a5fa", t: "Financial Summary", s: "ROI tracking", b: "Open", bc: "rgba(96,165,250,0.2)", tc: "#60a5fa" },
      ].map((r) => (
        <div key={r.t} className="flex items-center gap-2" style={{ background: "rgba(255,255,255,0.05)", borderRadius: 9, padding: "7px 9px" }}>
          <div style={{ width: 7, height: 7, borderRadius: "50%", background: r.dot, flexShrink: 0 }} />
          <div style={{ flex: 1 }}>
            <p style={{ fontSize: 8, fontWeight: 600, color: "#fff" }}>{r.t}</p>
            <p style={{ fontSize: 6, color: "rgba(255,255,255,0.4)" }}>{r.s}</p>
          </div>
          <span style={{ fontSize: 7, background: r.bc, color: r.tc, padding: "2px 6px", borderRadius: 4, fontWeight: 700 }}>{r.b}</span>
        </div>
      ))}

      <div style={{ background: "rgba(255,255,255,0.05)", borderRadius: 10, padding: 9 }}>
        <div className="flex justify-between items-center mb-1.5">
          <span style={{ fontSize: 7, color: "rgba(255,255,255,0.45)" }}>PR This Month</span>
          <span style={{ fontSize: 10, fontWeight: 800, color: "#fbbf24" }}>81.4%</span>
        </div>
        <div style={{ height: 5, background: "rgba(255,255,255,0.1)", borderRadius: 3, overflow: "hidden" }}>
          <div style={{ height: "100%", width: "81%", background: "linear-gradient(90deg,#fbbf24,#34d399)", borderRadius: 3 }} />
        </div>
      </div>
    </div>
  </div>
);

/* ─────────────────────────────────────────────────────────────
   MAIN PAGE
───────────────────────────────────────────────────────────── */
export default function AppFeaturesPage1() {
  const [loginTab, setLoginTab] = useState("client");

  const handleCall = () => { window.location.href = "tel:+919975929989"; };
  const handleWhatsApp = () => {
    window.open(`https://wa.me/919975929989?text=${encodeURIComponent("Hello, I want to know more about the PVProtech mobile app.")}`, "_blank");
  };

  const handlePlayStore = () => window.open(PLAY_STORE_URL, "_blank", "noopener,noreferrer");
  const handleAppStore  = () => window.open(APP_STORE_URL,  "_blank", "noopener,noreferrer");

  return (
    <div className="min-h-screen text-white" style={{ background: "linear-gradient(to bottom,#1e3a5f,#000,#14532d)" }}>

      {/* ══════════════════════════════════════
          HERO
      ══════════════════════════════════════ */}
      <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden bg-black">
        <img
          src="/Home-bg.jpg"
          alt="Solar Background"
          className="absolute inset-0 w-full h-full object-cover opacity-20"
        />
        <div className="absolute inset-0" style={{ background: "radial-gradient(circle,rgba(100,200,150,0.2) 1px,transparent 1px)", backgroundSize: "26px 26px" }} />
        <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom,rgba(0,0,0,0.8),rgba(0,0,0,0.65),rgba(0,0,0,0.8))" }} />

        <div className="relative z-10 w-full max-w-7xl mx-auto px-6 py-16">
          <div className="flex flex-col lg:flex-row items-center gap-16">

            {/* LEFT — copy */}
            <div className="flex-1 min-w-0 flex flex-col md:flex-row items-start gap-8 top-10">
              <div className="flex-1 min-w-0">
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 mb-7 border"
                  style={{ background: "rgba(52,211,153,0.1)", borderColor: "rgba(52,211,153,0.25)" }}
                >
                  <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                  <span className="text-xs font-bold text-green-400 tracking-widest uppercase">
                    Now Available — iOS &amp; Android
                  </span>
                </motion.div>

                <motion.h1
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 }}
                  className="text-5xl md:text-6xl font-extrabold leading-tight mb-5 bg-clip-text text-transparent drop-shadow-lg"
                  style={{ backgroundImage: "linear-gradient(to right,#fde047,#4ade80,#60a5fa)" }}
                >
                  Your Solar Plant.<br />
                  In Your Pocket.
                </motion.h1>

                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="text-lg text-blue-200 max-w-xl text-justify gap-5 mb-10 leading-relaxed flex"
                >
                  The PVProtech app gives you real-time generation data, irradiation analytics, cleaning cycle
                  tracking, financial reports, and a free health calculator — all in one place.

                  {/* <motion.a
                    href={PLAY_STORE_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    initial={{ opacity: 0, x: 16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                    className="shrink-0 flex flex-col items-center gap-3 no-underline group"
                  >
                    <div
                      className="rounded-2xl p-3 border transition-all duration-300 group-hover:scale-105"
                      style={{
                        background: "#fff",
                        borderColor: "rgba(52,211,153,0.5)",
                        boxShadow: "0 0 32px rgba(52,211,153,0.2), 0 8px 24px rgba(0,0,0,0.4)",
                      }}
                    >
                      <QRCodeSVG value={PLAY_STORE_URL} size={120} bgColor="#ffffff" fgColor="#0f172a" level="H" />
                    </div>
                    <div className="text-center">
                      <p className="text-xs font-bold text-green-400 uppercase tracking-widest">📱 Scan to Download</p>
                      <p className="text-xs text-slate-500 mt-0.5">Google Play Store</p>
                    </div>
                  </motion.a> */}
                </motion.p>

                {/* ── HERO DOWNLOAD BUTTONS WITH QR HOVER ── */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                  className="flex flex-wrap gap-4 mb-10"
                  style={{ alignItems: "flex-end" }}
                >
                  {/* App Store button — QR on hover */}
                  <QRHoverButton
                    gradient="linear-gradient(to right,#22c55e,#10b981)"
                    hoverGrad="linear-gradient(to right,#16a34a,#059669)"
                    shadow="rgba(34,197,94,0.5)"
                    accentColor="#22c55e"
                    icon={<FaApple style={{ fontSize: 20 }} />}
                    label="Download on App Store"
                    href={APP_STORE_URL}
                    qrValue={APP_STORE_URL}
                  />

                  {/* Google Play button — QR on hover */}
                  <QRHoverButton
                    gradient="linear-gradient(to right,#3b82f6,#2563eb)"
                    hoverGrad="linear-gradient(to right,#2563eb,#1d4ed8)"
                    shadow="rgba(59,130,246,0.5)"
                    accentColor="#3b82f6"
                    icon={<FaGooglePlay style={{ fontSize: 18 }} />}
                    label="Get it on Google Play"
                    href={PLAY_STORE_URL}
                    qrValue={PLAY_STORE_URL}
                  />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.5 }}
                  className="flex flex-wrap gap-6"
                >
                  {["Free Health Calculator", "Live Plant Monitoring", "iOS & Android"].map((item) => (
                    <div key={item} className="flex items-center gap-2">
                      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                        <circle cx="7" cy="7" r="6" stroke="#4ade80" strokeWidth="1.5" />
                        <path d="M4.5 7l2 2 3-4" stroke="#4ade80" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      <span className="text-sm text-blue-200">{item}</span>
                    </div>
                  ))}
                </motion.div>
              </div>
            </div>

            {/* RIGHT — phones */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="flex items-end gap-4 shrink-0"
            >
              <PrimaryPhone />
              <SecondaryPhone />
            </motion.div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          STATS BAR
      ══════════════════════════════════════ */}
      <div
        className="border-t border-b px-6 py-8"
        style={{ background: "rgba(15,23,42,0.85)", borderColor: "rgba(51,65,85,0.6)" }}
      >
        <div className="max-w-7xl mx-auto grid gap-4" style={{ gridTemplateColumns: "repeat(auto-fit,minmax(130px,1fr))" }}>
          {APP_STATS.map((stat, i) => (
            <div
              key={stat.label}
              className="text-center px-3"
              style={{ borderRight: i < APP_STATS.length - 1 ? "1px solid rgba(51,65,85,0.5)" : "none" }}
            >
              <div className="text-3xl font-extrabold leading-none mb-1.5" style={{ color: stat.color }}>
                {stat.value}
              </div>
              <div className="text-xs text-slate-500 uppercase tracking-widest">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ══════════════════════════════════════
          CORE APP FEATURES
      ══════════════════════════════════════ */}
      <section
        className="py-16 px-6"
        style={{ background: "linear-gradient(to bottom,#0f172a,#000,#020617)" }}
      >
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2
              className="text-3xl md:text-4xl font-bold mb-4 bg-clip-text text-transparent"
              style={{ backgroundImage: "linear-gradient(to right,#fde047,#4ade80)" }}
            >
              What the App Does For You
            </h2>
            <p className="text-slate-300 text-base max-w-2xl mx-auto leading-relaxed">
              Four core capabilities — built around what solar plant owners actually need every day.
            </p>
          </motion.div>

          <div className="grid gap-5" style={{ gridTemplateColumns: "repeat(auto-fill,minmax(280px,1fr))" }}>
            {APP_FEATURES.map((s, i) => (
              <AppFeatureCard key={s.id} s={s} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          ONBOARDING STEPS
      ══════════════════════════════════════ */}
      <section
        className="py-16 px-6"
        style={{ background: "linear-gradient(to bottom,#020617,#000,#0f172a)" }}
      >
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2
              className="text-3xl md:text-4xl font-bold mb-4 bg-clip-text text-transparent"
              style={{ backgroundImage: "linear-gradient(to right,#60a5fa,#a78bfa,#c084fc)" }}
            >
              Up &amp; Running in Minutes
            </h2>
            <p className="text-slate-400 text-base max-w-xl mx-auto leading-relaxed">
              Getting your solar plant onto PVProtech is effortless. Follow four simple steps and start monitoring live.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-14 items-center">
            <div className="relative">
              <div
                className="absolute left-5 top-12 bottom-5 w-0.5"
                style={{ background: "linear-gradient(to bottom,rgba(52,211,153,0.4),transparent)" }}
              />
              <div className="flex flex-col gap-7 relative z-10">
                {ONBOARD_STEPS.map(({ n, title, desc, color }, i) => (
                  <motion.div
                    key={n}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="flex gap-5 items-start"
                  >
                    <div
                      className="w-10 h-10 shrink-0 flex items-center justify-center rounded-full font-extrabold text-base border-2 relative z-10"
                      style={{ background: `${color}15`, borderColor: `${color}50`, color }}
                    >
                      {n}
                    </div>
                    <div className="pt-1.5">
                      <h4 className="font-bold text-white text-base mb-1">
                        <a href="https://pvprotech.com/registration" target="_blank">{title}</a>
                      </h4>
                      <p className="text-slate-400 text-sm leading-relaxed">{desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          CLIENT DASHBOARD — ALL FEATURES
      ══════════════════════════════════════ */}
      <section
        className="py-16 px-6"
        style={{ background: "linear-gradient(to bottom,#0f172a,#000,#020617)" }}
      >
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <div className="text-xs font-bold text-amber-400 tracking-widest uppercase mb-3">
              Client Login — pvprotech.com
            </div>
            <h2
              className="text-3xl md:text-4xl font-bold mb-4 bg-clip-text text-transparent"
              style={{ backgroundImage: "linear-gradient(to right,#fde047,#4ade80)" }}
            >
              Your Plant. Your Dashboard. Your Control.
            </h2>
            <p className="text-slate-300 text-base max-w-2xl mx-auto leading-relaxed">
              Log in as a client on{" "}
              <span
                className="font-bold bg-clip-text text-transparent"
                style={{ backgroundImage: "linear-gradient(to right,#fbbf24,#f97316)" }}
              >
                pvprotech.com
              </span>{" "}
              and get a complete picture of your plant's performance, financials, cleaning cycles,
              and maintenance — with zero technical complexity.
            </p>
          </motion.div>

          <div className="flex justify-center gap-3 mb-10">
            {[
              { key: "client", label: "Client View", icon: <FaUserTie className="text-sm" /> },
            ].map(({ key, label, icon }) => (
              <button
                key={key}
                onClick={() => setLoginTab(key)}
                className="flex items-center gap-2 px-5 py-2 rounded-full text-sm font-bold border transition-all duration-200"
                style={{
                  background: loginTab === key ? "linear-gradient(to right,#fde047,#4ade80)" : "transparent",
                  color: loginTab === key ? "#0d1117" : "#94a3b8",
                  borderColor: loginTab === key ? "transparent" : "rgba(51,65,85,0.8)",
                }}
              >
                {icon} {label}
              </button>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="rounded-2xl overflow-hidden border border-white/10 mb-10"
            style={{ background: "rgba(15,23,42,0.85)" }}
          >
            <div
              className="px-5.5 py-3.5 border-b border-white/10 flex items-center gap-2"
              style={{ background: "rgba(255,255,255,0.07)" }}
            >
              {["#ef4444", "#f59e0b", "#22c55e"].map((c, i) => (
                <div key={i} className="w-2.5 h-2.5 rounded-full" style={{ background: c }} />
              ))}
              <span className="text-xs font-semibold text-white/50 ml-2.5">
                PVProtech Client Portal — Plant Dashboard — Pune Rooftop 5kWp
              </span>
              <div
                className="ml-auto text-xs font-bold px-2.5 py-0.5 rounded-lg"
                style={{ background: "rgba(52,211,153,0.2)", color: "#34d399" }}
              >
                🟢 LIVE DATA
              </div>
            </div>

            <div className="p-5 grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { label: "TODAY'S GENERATION", val: "28.4", unit: "kWh", trend: "▲ +12% vs yesterday", tc: "#34d399" },
                { label: "PERFORMANCE RATIO (EPI)", val: "87.4", unit: "%", trend: "▲ Target: 80%", tc: "#34d399" },
                { label: "IRRADIATION TODAY", val: "5.8", unit: "kWh/m²", trend: "Clear sky conditions", tc: "#fbbf24" },
                { label: "BILL SAVED TODAY", val: "₹312", unit: "/day", trend: "▲ ₹4,280 this month", tc: "#34d399" },
              ].map((k, i) => (
                <div key={i} className="rounded-xl p-4 border border-slate-700/60" style={{ background: "rgba(15,23,42,0.6)" }}>
                  <div className="text-xs text-slate-400 font-bold tracking-widest mb-2 uppercase">{k.label}</div>
                  <div className="text-2xl font-extrabold text-white leading-none">
                    {k.val}<span className="text-xs text-slate-400 font-normal ml-1">{k.unit}</span>
                  </div>
                  <div className="text-xs mt-1.5" style={{ color: k.tc }}>{k.trend}</div>
                </div>
              ))}
            </div>
          </motion.div>

          <div className="grid gap-4" style={{ gridTemplateColumns: "repeat(auto-fill,minmax(260px,1fr))" }}>
            {CLIENT_DASHBOARD.map((s, i) => (
              <ClientCard key={s.title} s={s} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          DOWNLOAD CTA
      ══════════════════════════════════════ */}
      <section className="relative py-20 px-6 text-center bg-black overflow-hidden">
        <img src="/Home-bg.jpg" alt="" className="absolute inset-0 w-full h-full object-cover opacity-10" />
        <div className="absolute inset-0" style={{ background: "radial-gradient(circle,rgba(100,200,150,0.2) 1px,transparent 1px)", backgroundSize: "26px 26px" }} />
        <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom,rgba(0,0,0,0.8),rgba(0,0,0,0.7),rgba(0,0,0,0.8))" }} />

        <div className="relative z-10 max-w-5xl mx-auto">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="flex-1 text-center md:text-left">
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="inline-flex items-center gap-2.5 px-4 py-1.5 mb-6 rounded-full border"
                style={{ background: "rgba(52,211,153,0.08)", borderColor: "rgba(52,211,153,0.25)" }}
              >
                <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                <span className="text-xs font-bold text-green-400 uppercase tracking-widest">
                  Free Download — iOS &amp; Android
                </span>
              </motion.div>

              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="text-4xl md:text-5xl font-bold mb-5 bg-clip-text text-transparent"
                style={{ backgroundImage: "linear-gradient(to right,#fde047,#4ade80,#60a5fa)" }}
              >
                Your Solar Plant's Health<br />Starts Here
              </motion.h2>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="text-base text-sky-200 mb-10 leading-relaxed"
              >
                Download PVProtech free and start monitoring your plant in under 2 minutes.
                Available on both iOS and Android.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
                className="flex flex-wrap justify-center md:justify-start gap-4 mb-8"
              >
                <HeroButton
                  gradient="linear-gradient(to right,#22c55e,#10b981)"
                  hoverGrad="linear-gradient(to right,#16a34a,#059669)"
                  shadow="rgba(34,197,94,0.5)"
                  icon={<FaApple className="text-xl" />}
                  label="Download on App Store"
                  onClick={handleAppStore}
                />
                <HeroButton
                  gradient="linear-gradient(to right,#3b82f6,#2563eb)"
                  hoverGrad="linear-gradient(to right,#2563eb,#1d4ed8)"
                  shadow="rgba(59,130,246,0.5)"
                  icon={<FaGooglePlay className="text-lg" />}
                  label="Get it on Google Play"
                  onClick={handlePlayStore}
                />
              </motion.div>

              <div className="flex flex-wrap justify-center md:justify-start gap-8 mt-10 text-sm text-slate-400">
                <div onClick={handleCall} className="flex items-center gap-2 cursor-pointer hover:text-white transition-colors">
                  <span>📞</span><span>+91 99759 29989</span>
                </div>
                <div onClick={handleWhatsApp} className="flex items-center gap-2 cursor-pointer hover:text-white transition-colors">
                  <span>💬</span><span>WhatsApp Us</span>
                </div>
                <div className="flex items-center gap-2">
                  <span>✉️</span><span>assure@sustainfyenergy.com</span>
                </div>
              </div>
            </div>

            <motion.a
              href={PLAY_STORE_URL}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="shrink-0 flex flex-col items-center gap-4 no-underline group"
            >
              <div
                className="rounded-2xl p-4 border transition-all duration-300 group-hover:scale-105"
                style={{
                  background: "#fff",
                  borderColor: "rgba(52,211,153,0.5)",
                  boxShadow: "0 0 48px rgba(52,211,153,0.2), 0 12px 40px rgba(0,0,0,0.5)",
                }}
              >
                <QRCodeSVG value={PLAY_STORE_URL} size={160} bgColor="#ffffff" fgColor="#0f172a" level="H" />
              </div>
              <div className="text-center">
                <p className="text-xs font-bold text-green-400 uppercase tracking-widest">📱 Scan to Download</p>
                <p className="text-xs text-slate-500 mt-0.5">Opens Google Play Store directly</p>
              </div>
            </motion.a>
          </div>
        </div>
      </section>

      {/* WhatsApp FAB */}
      <a
        href="https://wa.me/919975929989"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-7 right-7 w-14 h-14 rounded-full flex items-center justify-center text-2xl no-underline z-50"
        style={{ background: "#25d366", boxShadow: "0 4px 22px rgba(37,211,102,0.45)" }}
      >
        💬
      </a>
    </div>
  );
}
