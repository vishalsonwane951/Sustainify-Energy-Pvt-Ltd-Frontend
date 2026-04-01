import { useState } from "react";
import { motion } from "framer-motion";
import {
  MdOutlineLocationOn,
  MdOutlinePhoto,
  MdOutlinePersonOutline,
  MdOutlineBarChart,
  MdOutlineSettings,
  MdOutlineLock,
  MdOutlineLink,
  MdOutlineAccessTime,
  MdOutlineGroup,
  MdOutlineFingerprint,
  MdOutlineLanguage,
  MdOutlineAutorenew,
  MdOutlineEmail,
  MdOutlineKeyboardArrowDown,
  MdOutlineKeyboardArrowUp,
  MdOutlineVerifiedUser,
  MdOutlineWbSunny,
} from "react-icons/md";

/* ─────────────────────────────────────────────────────────────
   DATA
───────────────────────────────────────────────────────────── */

const SECTIONS = [
  {
    id: "s1",
    num: "01",
    icon: <MdOutlineLocationOn size={22} />,
    label: "Data Collection",
    title: "Information We Collect",
    accent: "#34d399",
    accentBg: "rgba(52,211,153,0.10)",
    accentBorder: "rgba(52,211,153,0.28)",
    accentBorderHover: "rgba(52,211,153,0.8)",
    content: [
      {
        type: "subsection",
        icon: "📡",
        heading: "Location Data",
        text: "PVPROTECH collects your device's precise location to enable core app functionality — including real-time technician tracking, site navigation, and job dispatch.",
        bullets: [
          "Used only for core app functionality",
          "Linked to your account identity",
          "Never shared with third parties",
          "Never used for advertising or tracking",
        ],
        warning: "You may disable location access at any time via your device settings. Some features like technician dispatching and live tracking require location access to function properly.",
      },
      {
        type: "subsection",
        icon: "🖼️",
        heading: "User Content (Photos & Media)",
        text: "When you upload photos, videos, or files through the app for job documentation or workflow purposes:",
        bullets: [
          "Linked to your account and relevant job/project",
          "Used solely for job documentation and workflow processing",
          "Not shared externally without your explicit consent",
        ],
      },
      {
        type: "subsection",
        icon: "👤",
        heading: "Account & Profile Information",
        text: "When you register for PVPROTECH, we may collect:",
        bullets: [
          "Full name and email address",
          "Phone number (for communication and verification)",
          "Job role and organization name",
          "Login credentials (passwords are encrypted)",
        ],
      },
      {
        type: "subsection",
        icon: "📊",
        heading: "Usage & Diagnostic Data",
        text: "To improve app performance and stability, we may automatically collect app version, device type, OS version, crash reports, and feature usage patterns — never used for marketing.",
        bullets: [
          "App version, device type, and OS version",
          "Crash reports and error logs",
          "Feature usage patterns (without personal content)",
        ],
      },
    ],
  },
  {
    id: "s2",
    num: "02",
    icon: <MdOutlineSettings size={22} />,
    label: "Data Usage",
    title: "How We Use Your Information",
    accent: "#fbbf24",
    accentBg: "rgba(251,191,36,0.10)",
    accentBorder: "rgba(251,191,36,0.28)",
    accentBorderHover: "rgba(251,191,36,0.8)",
    content: [
      {
        type: "text",
        text: "We use your information strictly for the purposes listed below. We do not sell your data, and we do not use it for advertising.",
      },
      {
        type: "table",
        rows: [
          ["Displaying real-time technician locations", "Location data"],
          ["Dispatching jobs and field service management", "Location, profile info"],
          ["Job documentation and reporting", "Photos, videos, user content"],
          ["Account authentication and security", "Email, password (hashed)"],
          ["App performance and bug fixes", "Usage & diagnostic data"],
          ["Customer support and communication", "Email, phone number"],
        ],
      },
    ],
  },
  {
    id: "s3",
    num: "03",
    icon: <MdOutlineLock size={22} />,
    label: "Security",
    title: "Data Storage & Security",
    accent: "#60a5fa",
    accentBg: "rgba(96,165,250,0.10)",
    accentBorder: "rgba(96,165,250,0.28)",
    accentBorderHover: "rgba(96,165,250,0.8)",
    content: [
      {
        type: "text",
        text: "PVPROTECH employs industry-standard security practices to protect your information from unauthorized access, disclosure, alteration, or destruction.",
      },
      {
        type: "bullets",
        items: [
          { icon: "🔐", label: "Encryption in Transit", detail: "All data uses TLS (Transport Layer Security)" },
          { icon: "🗄️", label: "Encryption at Rest", detail: "Sensitive data on servers is encrypted at rest" },
          { icon: "👮", label: "Access Control", detail: "Only authorized personnel with legitimate need access personal data" },
          { icon: "☁️", label: "Secure Infrastructure", detail: "Hosted on secure, compliant cloud infrastructure" },
          { icon: "🔍", label: "Regular Audits", detail: "Periodic security reviews of all data practices" },
        ],
      },
      {
        type: "warning",
        text: "While we take all reasonable measures to protect your data, no system is 100% impenetrable. In the event of a data breach, we will notify affected users promptly in accordance with applicable laws.",
      },
    ],
  },
  {
    id: "s4",
    num: "04",
    icon: <MdOutlineLink size={22} />,
    label: "Third Parties",
    title: "Third-Party Services",
    accent: "#a78bfa",
    accentBg: "rgba(167,139,250,0.10)",
    accentBorder: "rgba(167,139,250,0.28)",
    accentBorderHover: "rgba(167,139,250,0.8)",
    content: [
      {
        type: "text",
        text: "PVPROTECH does not use third-party advertising networks, analytics tracking SDKs, or data brokers. Your personal data is not sold, rented, or transferred to any third parties for commercial purposes.",
      },
      {
        type: "text",
        text: "We may use trusted service providers strictly to operate our platform (e.g., cloud hosting infrastructure). Any such provider is bound by confidentiality obligations and may not use your data for their own purposes.",
      },
      {
        type: "info",
        text: "If we ever add third-party integrations in the future, this policy will be updated and you will be notified accordingly.",
      },
    ],
  },
  {
    id: "s5",
    num: "05",
    icon: <MdOutlineAccessTime size={22} />,
    label: "Retention",
    title: "Data Retention",
    accent: "#34d399",
    accentBg: "rgba(52,211,153,0.10)",
    accentBorder: "rgba(52,211,153,0.28)",
    accentBorderHover: "rgba(52,211,153,0.8)",
    content: [
      {
        type: "text",
        text: "We retain your personal data only for as long as necessary to provide the services described in this policy, or as required by applicable law.",
      },
      {
        type: "table",
        rows: [
          ["Account profile data", "Active account + 30 days after deletion"],
          ["Location data", "Active session only — not stored long-term"],
          ["Job photos & media", "Duration of project lifecycle"],
          ["Diagnostic & crash logs", "Up to 90 days"],
        ],
      },
    ],
  },
  {
    id: "s6",
    num: "06",
    icon: <MdOutlineGroup size={22} />,
    label: "Children",
    title: "Children's Privacy",
    accent: "#fbbf24",
    accentBg: "rgba(251,191,36,0.10)",
    accentBorder: "rgba(251,191,36,0.28)",
    accentBorderHover: "rgba(251,191,36,0.8)",
    content: [
      {
        type: "text",
        text: "PVPROTECH is a professional field service management platform. While it is suitable for users of all ages, we do not knowingly collect, store, or process personal information from children under the age of 13.",
      },
      {
        type: "text",
        text: "If we become aware that personal data from a child has been collected without verified parental consent, we will take immediate steps to delete that information. Contact us at vikrant@sustainfyenergy.com if you believe a child has provided us with data.",
      },
    ],
  },
  {
    id: "s7",
    num: "07",
    icon: <MdOutlineFingerprint size={22} />,
    label: "Your Rights",
    title: "Your Privacy Rights",
    accent: "#4ade80",
    accentBg: "rgba(74,222,128,0.10)",
    accentBorder: "rgba(74,222,128,0.28)",
    accentBorderHover: "rgba(74,222,128,0.8)",
    content: [
      {
        type: "text",
        text: "Depending on your location, you may have the following rights regarding your personal data:",
      },
      {
        type: "rights",
        items: [
          { right: "Right to Access", detail: "Request a copy of the personal data we hold about you" },
          { right: "Right to Correction", detail: "Request correction of inaccurate or incomplete data" },
          { right: "Right to Deletion", detail: "Request deletion of your personal data (right to be forgotten)" },
          { right: "Right to Restrict Processing", detail: "Ask us to limit how we use your data in certain circumstances" },
          { right: "Right to Data Portability", detail: "Request your data in a structured, machine-readable format" },
          { right: "Right to Withdraw Consent", detail: "Where processing is based on consent, you may withdraw it at any time" },
          { right: "Location Access Control", detail: "Disable location tracking at any time via your device settings" },
        ],
      },
      {
        type: "highlight",
        text: "To exercise any of these rights, contact us at vikrant@sustainfyenergy.com. We will respond within 30 days.",
      },
    ],
  },
  {
    id: "s8",
    num: "08",
    icon: <MdOutlineLanguage size={22} />,
    label: "Cookies",
    title: "Cookies & Tracking Technologies",
    accent: "#60a5fa",
    accentBg: "rgba(96,165,250,0.10)",
    accentBorder: "rgba(96,165,250,0.28)",
    accentBorderHover: "rgba(96,165,250,0.8)",
    content: [
      {
        type: "text",
        text: "Our mobile application does not use cookies. If you access PVPROTECH through our website (pvprotech.com), standard web technologies may be used to maintain your session.",
      },
      {
        type: "bullets",
        items: [
          { icon: "🍪", label: "Session Cookies", detail: "Temporary cookies to keep you logged in. Deleted when you close your browser." },
          { icon: "🚫", label: "No Advertising Cookies", detail: "We do not use cookies for advertising, remarketing, or behavioral tracking." },
          { icon: "🔒", label: "No Third-Party Tracking", detail: "We do not allow third-party trackers or analytics pixels on our platform." },
        ],
      },
    ],
  },
  {
    id: "s9",
    num: "09",
    icon: <MdOutlineAutorenew size={22} />,
    label: "Updates",
    title: "Changes to This Policy",
    accent: "#a78bfa",
    accentBg: "rgba(167,139,250,0.10)",
    accentBorder: "rgba(167,139,250,0.28)",
    accentBorderHover: "rgba(167,139,250,0.8)",
    content: [
      {
        type: "text",
        text: "We may update this Privacy Policy to reflect changes in our data practices, legal requirements, or service features. When we do:",
      },
      {
        type: "bullets",
        items: [
          { icon: "📅", label: "Revised Date", detail: 'The "Last Updated" date at the top will be updated.' },
          { icon: "📬", label: "Material Change Notification", detail: "We will notify users via email or in-app notification for material changes." },
          { icon: "✅", label: "Continued Use = Acceptance", detail: "Continued use of the app after updates constitutes acceptance of the revised policy." },
        ],
      },
    ],
  },
];

const TOC_ITEMS = SECTIONS.map(s => ({ id: s.id, num: s.num, label: s.title }));

/* ─────────────────────────────────────────────────────────────
   POLICY SECTION CARD
───────────────────────────────────────────────────────────── */
function SectionCard({ s, index }) {
  const [h, setH] = useState(false);
  const [open, setOpen] = useState(true);

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.45, delay: index * 0.06 }}
      id={s.id}
      onMouseEnter={() => setH(true)}
      onMouseLeave={() => setH(false)}
      className="relative overflow-hidden rounded-2xl border transition-all duration-300 scroll-mt-24"
      style={{
        borderColor: h ? s.accentBorderHover : s.accentBorder,
        background: h ? "rgba(15,23,42,0.97)" : "rgba(15,23,42,0.65)",
        boxShadow: h ? "0 16px 48px rgba(0,0,0,0.55)" : "0 2px 16px rgba(0,0,0,0.28)",
      }}
    >
      {/* Top accent bar */}
      <div
        className="absolute top-0 left-0 right-0 h-0.5 transition-opacity duration-300"
        style={{
          background: `linear-gradient(90deg,${s.accent},transparent)`,
          opacity: h ? 1 : 0.4,
        }}
      />

      {/* Header */}
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center gap-4 px-6 py-5 text-left"
      >
        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center border shrink-0"
          style={{ background: s.accentBg, borderColor: s.accentBorder, color: s.accent }}
        >
          {s.icon}
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-xs font-bold uppercase tracking-widest mb-0.5" style={{ color: s.accent }}>
            Section {s.num} — {s.label}
          </div>
          <h2 className="text-lg font-extrabold text-white leading-tight">{s.title}</h2>
        </div>
        <div className="shrink-0 text-slate-500 transition-transform duration-300" style={{ transform: open ? "rotate(0deg)" : "rotate(180deg)" }}>
          <MdOutlineKeyboardArrowUp size={20} />
        </div>
      </button>

      {/* Body */}
      {open && (
        <div className="px-6 pb-7 flex flex-col gap-5">
          <div className="h-px" style={{ background: `linear-gradient(90deg,${s.accentBorder},transparent)` }} />

          {s.content.map((block, bi) => (
            <div key={bi}>
              {block.type === "text" && (
                <p className="text-slate-300 text-sm leading-relaxed">{block.text}</p>
              )}

              {block.type === "info" && (
                <div
                  className="flex gap-3 items-start rounded-xl px-4 py-3.5 border"
                  style={{ background: "rgba(96,165,250,0.07)", borderColor: "rgba(96,165,250,0.2)" }}
                >
                  <span className="text-base mt-0.5">ℹ️</span>
                  <p className="text-sky-300 text-sm leading-relaxed">{block.text}</p>
                </div>
              )}

              {block.type === "warning" && (
                <div
                  className="flex gap-3 items-start rounded-xl px-4 py-3.5 border"
                  style={{ background: "rgba(251,191,36,0.07)", borderColor: "rgba(251,191,36,0.22)" }}
                >
                  <span className="text-base mt-0.5">⚠️</span>
                  <p className="text-amber-300 text-sm leading-relaxed">{block.text}</p>
                </div>
              )}

              {block.type === "highlight" && (
                <div
                  className="flex gap-3 items-start rounded-xl px-4 py-3.5 border"
                  style={{ background: `${s.accentBg}`, borderColor: s.accentBorder }}
                >
                  <span className="text-base mt-0.5">📩</span>
                  <p className="text-sm leading-relaxed" style={{ color: s.accent }}>{block.text}</p>
                </div>
              )}

              {block.type === "subsection" && (
                <div className="flex flex-col gap-3">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{block.icon}</span>
                    <h3 className="text-white font-bold text-base">{block.heading}</h3>
                  </div>
                  <p className="text-slate-400 text-sm leading-relaxed">{block.text}</p>
                  {block.bullets && (
                    <div className="grid gap-1.5">
                      {block.bullets.map((b, i) => (
                        <div key={i} className="flex items-center gap-2.5">
                          <div className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: s.accent }} />
                          <span className="text-slate-400 text-sm">{b}</span>
                        </div>
                      ))}
                    </div>
                  )}
                  {block.warning && (
                    <div
                      className="flex gap-3 items-start rounded-xl px-4 py-3 border mt-1"
                      style={{ background: "rgba(251,191,36,0.07)", borderColor: "rgba(251,191,36,0.22)" }}
                    >
                      <span className="text-sm mt-0.5">⚠️</span>
                      <p className="text-amber-300 text-xs leading-relaxed">{block.warning}</p>
                    </div>
                  )}
                </div>
              )}

              {block.type === "bullets" && (
                <div className="grid gap-3">
                  {block.items.map((item, i) => (
                    <div
                      key={i}
                      className="flex items-start gap-3 rounded-xl px-4 py-3 border transition-colors duration-200"
                      style={{ background: "rgba(255,255,255,0.03)", borderColor: "rgba(255,255,255,0.07)" }}
                    >
                      <span className="text-lg shrink-0">{item.icon}</span>
                      <div>
                        <p className="text-white font-semibold text-sm">{item.label}</p>
                        <p className="text-slate-400 text-xs leading-relaxed mt-0.5">{item.detail}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {block.type === "rights" && (
                <div className="grid gap-2.5">
                  {block.items.map((item, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <div
                        className="mt-1 w-5 h-5 rounded-full flex items-center justify-center shrink-0"
                        style={{ background: s.accentBg, border: `1px solid ${s.accentBorder}` }}
                      >
                        <div className="w-1.5 h-1.5 rounded-full" style={{ background: s.accent }} />
                      </div>
                      <div>
                        <span className="text-white font-semibold text-sm">{item.right}: </span>
                        <span className="text-slate-400 text-sm">{item.detail}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {block.type === "table" && (
                <div className="rounded-xl overflow-hidden border" style={{ borderColor: "rgba(255,255,255,0.08)" }}>
                  <div
                    className="grid grid-cols-2 px-4 py-2.5 border-b"
                    style={{ background: `${s.accentBg}`, borderColor: "rgba(255,255,255,0.08)" }}
                  >
                    <span className="text-xs font-bold uppercase tracking-widest" style={{ color: s.accent }}>Purpose</span>
                    <span className="text-xs font-bold uppercase tracking-widest" style={{ color: s.accent }}>Data Used</span>
                  </div>
                  {block.rows.map(([purpose, data], i) => (
                    <div
                      key={i}
                      className="grid grid-cols-2 px-4 py-3 border-b last:border-b-0 transition-colors duration-150"
                      style={{
                        borderColor: "rgba(255,255,255,0.05)",
                        background: i % 2 === 0 ? "rgba(255,255,255,0.02)" : "transparent",
                      }}
                    >
                      <span className="text-slate-300 text-sm">{purpose}</span>
                      <span className="text-slate-400 text-sm">{data}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </motion.div>
  );
}

/* ─────────────────────────────────────────────────────────────
   MAIN PAGE
───────────────────────────────────────────────────────────── */
export default function PrivacyPolicyPage() {
  const [tocOpen, setTocOpen] = useState(false);

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
    setTocOpen(false);
  };

  return (
    <div
      className="min-h-screen text-white"
      style={{ background: "linear-gradient(to bottom,#0c1f3a,#000,#071a0f)" }}
    >
      {/* Background grid */}
      <div
        className="fixed inset-0 pointer-events-none z-0"
        style={{
          background: "radial-gradient(circle,rgba(100,200,150,0.18) 1px,transparent 1px)",
          backgroundSize: "26px 26px",
        }}
      />
      {/* Glow orbs */}
      <div className="fixed pointer-events-none z-0" style={{ top: -200, right: -100, width: 700, height: 700, borderRadius: "50%", background: "rgba(52,211,153,0.07)", filter: "blur(120px)" }} />
      <div className="fixed pointer-events-none z-0" style={{ bottom: 100, left: -150, width: 500, height: 500, borderRadius: "50%", background: "rgba(251,191,36,0.05)", filter: "blur(100px)" }} />

      {/* HERO */}
      <section className="relative overflow-hidden pt-20 pb-16 px-6">
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2.5 px-4 py-1.5 mb-7 rounded-full border"
            style={{ background: "rgba(52,211,153,0.08)", borderColor: "rgba(52,211,153,0.25)" }}
          >
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            <span className="text-xs font-bold text-green-400 tracking-widest uppercase">
              Last Updated — April 24, 2025
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-5xl md:text-6xl font-extrabold leading-tight mb-6 bg-clip-text text-transparent drop-shadow-lg"
            style={{ backgroundImage: "linear-gradient(to right,#fde047,#4ade80,#60a5fa)" }}
          >
            Your Privacy.<br />Our Commitment.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg text-sky-200 max-w-2xl mx-auto leading-relaxed mb-10"
          >
            We believe in full transparency. Here's exactly how PVPROTECH collects,
            uses, and protects your data — no fine print, no surprises.
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="flex flex-wrap justify-center gap-4 mb-10"
          >
            {[
              { icon: "🛡️", label: "No Data Selling" },
              { icon: "📍", label: "Location Only for App Use" },
              { icon: "🚫", label: "Zero Ads or Tracking" },
              { icon: "✅", label: "GDPR & DPDP Aware" },
            ].map((chip) => (
              <div
                key={chip.label}
                className="flex items-center gap-2 px-4 py-2 rounded-full border text-sm text-slate-300"
                style={{ background: "rgba(15,23,42,0.7)", borderColor: "rgba(51,65,85,0.6)" }}
              >
                <span>{chip.icon}</span>
                <span>{chip.label}</span>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* STATS BAR */}
      <div
        className="border-t border-b px-6 py-7"
        style={{ background: "rgba(10,18,32,0.85)", borderColor: "rgba(51,65,85,0.5)" }}
      >
        <div className="max-w-4xl mx-auto grid gap-4" style={{ gridTemplateColumns: "repeat(auto-fit,minmax(120px,1fr))" }}>
          {[
            { value: "9", label: "Policy Sections", color: "#fde047" },
            { value: "0", label: "Third-Party SDKs", color: "#4ade80" },
            { value: "0", label: "Ad Networks", color: "#4ade80" },
            { value: "30d", label: "Response SLA", color: "#60a5fa" },
          ].map((stat, i, arr) => (
            <div
              key={stat.label}
              className="text-center px-3"
              style={{ borderRight: i < arr.length - 1 ? "1px solid rgba(51,65,85,0.5)" : "none" }}
            >
              <div className="text-3xl font-extrabold leading-none mb-1.5" style={{ color: stat.color }}>
                {stat.value}
              </div>
              <div className="text-xs text-slate-500 uppercase tracking-widest">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* MAIN CONTENT */}
      <section className="relative z-10 py-14 px-6">
        <div className="max-w-4xl mx-auto">

          {/* TOC */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative overflow-hidden rounded-2xl border mb-10"
            style={{ borderColor: "rgba(52,211,153,0.28)", background: "rgba(15,23,42,0.75)" }}
          >
            <div className="absolute left-0 top-0 bottom-0 w-1 rounded-l-2xl" style={{ background: "linear-gradient(to bottom,#34d399,#4ade80,transparent)" }} />

            <button
              onClick={() => setTocOpen(o => !o)}
              className="w-full flex items-center justify-between px-7 py-5 text-left"
            >
              <div className="flex items-center gap-3">
                <span className="text-lg">📋</span>
                <span className="text-xs font-bold text-green-400 uppercase tracking-widest">Table of Contents</span>
                <span className="text-slate-500 text-xs">— {SECTIONS.length} sections</span>
              </div>
              <MdOutlineKeyboardArrowDown
                size={18}
                style={{ color: "#4ade80", transform: tocOpen ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.3s" }}
              />
            </button>

            {tocOpen && (
              <div className="px-7 pb-6 grid grid-cols-1 sm:grid-cols-2 gap-1.5 border-t" style={{ borderColor: "rgba(52,211,153,0.15)" }}>
                {TOC_ITEMS.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => scrollTo(item.id)}
                    className="flex items-center gap-3 py-2.5 px-3 rounded-xl text-left transition-all duration-150 hover:bg-white/5"
                  >
                    <span className="text-xs font-extrabold" style={{ color: "#34d399", minWidth: 24 }}>{item.num}</span>
                    <span className="text-slate-300 text-sm hover:text-white transition-colors">{item.label}</span>
                  </button>
                ))}
              </div>
            )}
          </motion.div>

          {/* Intro card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="rounded-2xl border px-6 py-5 mb-8"
            style={{ background: "rgba(15,23,42,0.65)", borderColor: "rgba(51,65,85,0.5)" }}
          >
            <p className="text-slate-300 text-sm leading-relaxed">
              Welcome to <span className="text-white font-bold">PVPROTECH</span> — a field technician and solar energy management platform operated by{" "}
              <span className="text-white font-bold">Sustainfy Energy</span>. This Privacy Policy explains how we collect, use, store, and safeguard your personal information when you use our mobile application and web services. By using PVPROTECH, you agree to the practices described in this policy.
            </p>
            <div
              className="mt-3 flex items-center gap-2 rounded-xl px-4 py-2.5 border"
              style={{ background: "rgba(96,165,250,0.07)", borderColor: "rgba(96,165,250,0.2)" }}
            >
              <span className="text-sm">✉️</span>
              <p className="text-sky-300 text-xs">
                Questions? Contact us at{" "}
                <a href="mailto:vikrant@sustainfyenergy.com" className="font-bold underline" style={{ color: "#60a5fa" }}>
                  vikrant@sustainfyenergy.com
                </a>
              </p>
            </div>
          </motion.div>

          {/* Policy sections */}
          <div className="flex flex-col gap-5">
            {SECTIONS.map((s, i) => (
              <SectionCard key={s.id} s={s} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* CONTACT CTA */}
      <section className="relative py-20 px-6 overflow-hidden">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: "radial-gradient(circle,rgba(100,200,150,0.18) 1px,transparent 1px)", backgroundSize: "26px 26px" }}
        />
        <div
          className="absolute inset-0"
          style={{ background: "linear-gradient(to bottom,rgba(0,0,0,0.75),rgba(0,0,0,0.65),rgba(0,0,0,0.75))" }}
        />

        <div className="max-w-2xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2.5 px-4 py-1.5 mb-6 rounded-full border"
            style={{ background: "rgba(52,211,153,0.08)", borderColor: "rgba(52,211,153,0.25)" }}
          >
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            <span className="text-xs font-bold text-green-400 tracking-widest uppercase">Section 10 — Contact</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-extrabold mb-5 bg-clip-text text-transparent"
            style={{ backgroundImage: "linear-gradient(to right,#fde047,#4ade80,#60a5fa)" }}
          >
            Questions About<br />Your Privacy?
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-sky-200 text-base leading-relaxed mb-8"
          >
            Our team is here to help. Reach out for any privacy-related requests, questions, or concerns — we respond within 30 days.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8"
          >
            <a
              href="mailto:vikrant@sustainfyenergy.com"
              className="inline-flex items-center gap-3 px-7 py-3.5 rounded-full text-base font-bold no-underline transition-all duration-300"
              style={{
                background: "linear-gradient(to right,#22c55e,#10b981)",
                color: "#fff",
                boxShadow: "0 8px 28px rgba(34,197,94,0.35)",
              }}
              onMouseEnter={e => { e.currentTarget.style.transform = "scale(1.05)"; e.currentTarget.style.boxShadow = "0 12px 36px rgba(34,197,94,0.5)"; }}
              onMouseLeave={e => { e.currentTarget.style.transform = "scale(1)"; e.currentTarget.style.boxShadow = "0 8px 28px rgba(34,197,94,0.35)"; }}
            >
              <MdOutlineEmail size={20} />
              vikrant@sustainfyenergy.com
            </a>
          </motion.div>

          <div className="flex flex-wrap justify-center gap-6 text-sm text-slate-400">
            <div className="flex items-center gap-2">
              <span>📞</span><span>+91 99759 29989</span>
            </div>
            <div className="flex items-center gap-2">
              <span>🌐</span>
              <a href="https://pvprotech.com" className="hover:text-white transition-colors" style={{ color: "inherit" }}>pvprotech.com</a>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer
        className="border-t px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-3"
        style={{ borderColor: "rgba(51,65,85,0.5)", background: "rgba(10,18,32,0.85)" }}
      >
        <div className="flex items-center gap-2">
          <div
            className="w-7 h-7 rounded-lg flex items-center justify-center"
            style={{ background: "linear-gradient(135deg,#34d399,#059669)" }}
          >
            <MdOutlineWbSunny size={14} color="#fff" />
          </div>
          <span className="text-sm font-bold text-slate-400">
            © 2025 PVPROTECH · Sustainfy Energy
          </span>
        </div>
        <p className="text-xs text-slate-600">All rights reserved. Privacy Policy v1.0 — April 24, 2025</p>
      </footer>

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