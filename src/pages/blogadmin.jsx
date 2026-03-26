"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  fetchAllBlogs,
  createBlog,
  updateBlog,
  deleteBlog,
  togglePublish,
  toggleFeatured,
} from "../services/api.js";

// API base
const API_BASE =
  (typeof import.meta !== "undefined" && import.meta.env?.VITE_API_URL)
    ? import.meta.env.VITE_API_URL
    : (typeof process !== "undefined" && process.env?.NEXT_PUBLIC_API_URL)
      ? process.env.NEXT_PUBLIC_API_URL
      : "http://localhost:5000";

//  Publish + Notify API call 
async function publishAndNotify(blogId) {
  const res = await fetch(`${API_BASE}/api/admin/blogs/${blogId}/publish`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
  });
  if (!res.ok) throw new Error(`Publish failed: ${res.status}`);
  return res.json();
}

//  Subscribers API calls 
// async function fetchSubscriberStats() {
//   const res = await fetch(`${API_BASE}/api/subscriptions/stats`);
//   if (!res.ok) throw new Error("Failed to fetch stats");
//   return res.json();
// }

// async function fetchAllSubscribers() {
//   // Uses the scan endpoint via stats — falls back to a full scan
//   const res = await fetch(`${API_BASE}/api/subscriptions/all`);
//   if (!res.ok) throw new Error("Failed to fetch subscribers");
//   return res.json();
// }

//  Adapters 
function transformBlog(blog) {
  const image = blog.imageUrl || blog.image || "";
  return {
    ...blog,
    id: blog.id ?? blog.blogId,
    published: blog.status ? blog.status === "published" : blog.published ?? false,
    date: blog.publishDate
      ? new Date(blog.publishDate).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })
      : blog.date ?? "",
    content: blog.body ?? blog.content ?? "",
    tags: Array.isArray(blog.tags) ? blog.tags : [],
    image, imagePreview: image, imageUrl: image,
  };
}

//  Constants 
const CATEGORIES = ["O&M Strategy", "Technology", "Technical Insights", "Case Study"];
const CAT_CLS = {
  "O&M Strategy": { pill: "bg-green-50 text-green-700 border-green-200", dot: "bg-green-600" },
  "Technology": { pill: "bg-blue-50 text-blue-700 border-blue-200", dot: "bg-blue-600" },
  "Technical Insights": { pill: "bg-orange-50 text-orange-700 border-orange-200", dot: "bg-orange-600" },
  "Case Study": { pill: "bg-yellow-50 text-yellow-700 border-yellow-200", dot: "bg-yellow-600" },
};
const CAT_DEFAULT = { pill: "bg-slate-100 text-slate-600 border-slate-200", dot: "bg-slate-400" };
const EMPTY_FORM = {
  title: "", excerpt: "", content: "", category: "O&M Strategy",
  author: "", date: "", readTime: "", image: "", tags: "", featured: false, published: true,
};

function useWindowWidth() {
  const [width, setWidth] = useState(typeof window !== "undefined" ? window.innerWidth : 1024);
  useEffect(() => {
    const h = () => setWidth(window.innerWidth);
    window.addEventListener("resize", h);
    return () => window.removeEventListener("resize", h);
  }, []);
  return width;
}

function useToast() {
  const [toasts, setToasts] = useState([]);
  const push = useCallback((message, type = "success") => {
    const id = Date.now();
    setToasts(t => [...t, { id, message, type }]);
    setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 3200);
  }, []);
  return { toasts, push };
}

function Toast({ toasts }) {
  const cls = {
    success: { wrap: "bg-green-50 border-green-200", icon: "border-green-600 text-green-600", text: "text-green-700" },
    error: { wrap: "bg-red-50 border-red-200", icon: "border-red-600 text-red-600", text: "text-red-700" },
    info: { wrap: "bg-blue-50 border-blue-200", icon: "border-blue-600 text-blue-600", text: "text-blue-700" },
  };
  const icons = { success: "✓", error: "✕", info: "i" };
  return (
    <div className="fixed bottom-4 right-4 z-9999 flex flex-col gap-2 max-w-[calc(100vw-2rem)]">
      <AnimatePresence>
        {toasts.map(t => {
          const c = cls[t.type] || cls.info;
          return (
            <motion.div key={t.id}
              initial={{ opacity: 0, x: 50, scale: 0.95 }} animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 50 }} transition={{ duration: 0.22 }}
              className={`flex items-center gap-2.5 min-w-50 px-4 py-3 rounded-xl border shadow-lg ${c.wrap}`}>
              <span className={`w-4.5 h-4.5 rounded-full border-[1.5px] flex items-center justify-center text-[10px] font-bold shrink-0 ${c.icon}`}>{icons[t.type]}</span>
              <span className={`text-[13px] font-semibold ${c.text}`}>{t.message}</span>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}

// Category Pill 
function CategoryPill({ category, small = false }) {
  const m = CAT_CLS[category] || CAT_DEFAULT;
  return (
    <span className={`inline-flex items-center gap-1 border rounded-full font-semibold whitespace-nowrap ${m.pill} ${small ? "text-[10px] px-1.5 py-px" : "text-[11px] px-2.5 py-0.5"}`}>
      <span className={`w-1 h-1 rounded-full shrink-0 ${m.dot}`} />
      {category}
    </span>
  );
}

//  Status Badge 
function StatusBadge({ published }) {
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${published ? "bg-green-50 text-green-700 border-green-200" : "bg-slate-50 text-slate-500 border-slate-200"}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${published ? "bg-green-500" : "bg-slate-400"}`} />
      {published ? "Published" : "Draft"}
    </span>
  );
}

//  Button 
function Btn({ children, onClick, variant = "primary", size = "md", disabled = false, icon }) {
  const sizes = { sm: "px-3 py-1.5 text-xs", md: "px-4 py-[7px] text-[13px]", lg: "px-5 py-2.5 text-sm" };
  const variants = {
    primary: "bg-green-600 hover:bg-green-700 text-white border-green-600 hover:border-green-700 shadow-sm hover:shadow-green-200 hover:shadow-md",
    danger: "bg-red-50 hover:bg-red-100 text-red-600 border-red-200 hover:border-red-300",
    ghost: "bg-white hover:bg-slate-50 text-slate-600 border-slate-200 hover:border-slate-300 shadow-sm",
    blue: "bg-blue-50 hover:bg-blue-100 text-blue-600 border-blue-200 hover:border-blue-300",
    accent: "bg-white hover:bg-green-50 text-green-600 border-green-200 hover:border-green-300 shadow-sm",
    notify: "bg-violet-600 hover:bg-violet-700 text-white border-violet-600 shadow-sm hover:shadow-violet-200 hover:shadow-md",
    indigo: "bg-indigo-50 hover:bg-indigo-100 text-indigo-600 border-indigo-200 hover:border-indigo-300 shadow-sm",
  };
  return (
    <button onClick={disabled ? undefined : onClick} disabled={disabled}
      className={`inline-flex items-center gap-1.5 font-semibold rounded-lg border transition-all duration-150 whitespace-nowrap font-[inherit] hover:-translate-y-px active:translate-y-0 ${sizes[size]} ${variants[variant]} ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}>
      {icon && <span className={size === "sm" ? "text-[11px]" : "text-[13px]"}>{icon}</span>}
      {children}
    </button>
  );
}

// Input 
function Input({ label, value, onChange, placeholder, type = "text", multiline = false, rows = 4, required = false, hint }) {
  const [focused, setFocused] = useState(false);
  const base = `w-full border rounded-lg px-3 text-slate-800 text-[13px] outline-none font-[inherit] transition-all duration-150 ${focused ? "border-green-400 bg-white shadow-[0_0_0_3px_rgba(134,239,172,0.25)]" : "border-slate-200 bg-slate-50"} ${multiline ? "py-2.5 resize-y" : "py-2"}`;
  return (
    <div className="flex flex-col gap-1.5">
      {label && <label className="text-[11px] font-bold text-slate-400 tracking-wider uppercase">{label}{required && <span className="text-red-400 ml-0.5">*</span>}</label>}
      {multiline
        ? <textarea value={value} onChange={e => onChange(e.target.value)} onFocus={() => setFocused(true)} onBlur={() => setFocused(false)} placeholder={placeholder} rows={rows} className={base} />
        : <input type={type} value={value} onChange={e => onChange(e.target.value)} onFocus={() => setFocused(true)} onBlur={() => setFocused(false)} placeholder={placeholder} className={base} />
      }
      {hint && <span className="text-[11px] text-slate-400">{hint}</span>}
    </div>
  );
}

// Select 
function Select({ label, value, onChange, options }) {
  const [focused, setFocused] = useState(false);
  return (
    <div className="flex flex-col gap-1.5">
      {label && <label className="text-[11px] font-bold text-slate-400 tracking-wider uppercase">{label}</label>}
      <select value={value} onChange={e => onChange(e.target.value)} onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
        className={`w-full border rounded-lg px-3 py-2 text-slate-800 text-[13px] outline-none font-[inherit] transition-all duration-150 cursor-pointer ${focused ? "border-green-400 bg-white shadow-[0_0_0_3px_rgba(134,239,172,0.25)]" : "border-slate-200 bg-slate-50"}`}>
        {options.map(o => <option key={o.value ?? o} value={o.value ?? o}>{o.label ?? o}</option>)}
      </select>
    </div>
  );
}

// Toggle 
function Toggle({ label, checked, onChange }) {
  return (
    <div className="flex items-center gap-2 cursor-pointer select-none" onClick={() => onChange(!checked)}>
      <div className={`w-9 h-5 rounded-full relative transition-colors duration-200 shrink-0 ${checked ? "bg-green-500" : "bg-slate-200"}`}>
        <div className={`w-3.5 h-3.5 bg-white rounded-full absolute top-0.75 transition-all duration-200 shadow-sm ${checked ? "left-4.75" : "left-0.75"}`} />
      </div>
      <span className={`text-[13px] font-medium ${checked ? "text-slate-800" : "text-slate-400"}`}>{label}</span>
    </div>
  );
}

// Stat Card 
function StatCard({ icon, label, value, valueColor, sub }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 flex flex-col gap-1.5">
      <div className="flex items-center gap-2">
        <span className="text-base">{icon}</span>
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{label}</span>
      </div>
      <div className={`text-3xl font-extrabold leading-none ${valueColor}`}>{value}</div>
      {sub && <div className="text-[11px] text-slate-300">{sub}</div>}
    </div>
  );
}

// Delete Modal
function DeleteModal({ blog, onConfirm, onCancel }) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onCancel}
      className="fixed inset-0 z-2000 bg-black/35 backdrop-blur-sm flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0, scale: 0.96, y: 10 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.96 }}
        onClick={e => e.stopPropagation()} className="w-full max-w-sm bg-white rounded-2xl shadow-2xl overflow-hidden">
        <div className="h-0.75 bg-red-500" />
        <div className="p-6">
          <div className="w-10 h-10 rounded-full bg-red-50 border border-red-200 flex items-center justify-center text-base mb-3.5">🗑️</div>
          <h3 className="text-base font-bold text-slate-800 mb-1.5">Delete Article?</h3>
          <p className="text-[13px] text-slate-500 leading-relaxed mb-1.5">This cannot be undone:</p>
          <p className="text-[13px] text-red-500 font-semibold italic mb-5">"{blog.title}"</p>
          <div className="flex gap-2.5">
            <button onClick={onCancel} className="flex-1 py-2.5 rounded-lg border border-slate-200 bg-white text-slate-600 text-[13px] font-semibold cursor-pointer font-[inherit] hover:bg-slate-50 transition-colors">Cancel</button>
            <button onClick={onConfirm} className="flex-1 py-2.5 rounded-lg bg-red-500 hover:bg-red-600 text-white text-[13px] font-semibold cursor-pointer font-[inherit] transition-colors border-none">Delete</button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

// Publish + Notify Modal
function PublishNotifyModal({ blog, onConfirm, onCancel, loading }) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onCancel}
      className="fixed inset-0 z-2000 bg-black/35 backdrop-blur-sm flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0, scale: 0.96, y: 10 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.96 }}
        onClick={e => e.stopPropagation()} className="w-full max-w-sm bg-white rounded-2xl shadow-2xl overflow-hidden">
        <div className="h-0.75 bg-linear-to-r from-violet-500 to-indigo-500" />
        <div className="p-6">
          <div className="w-11 h-11 rounded-full bg-violet-50 border border-violet-200 flex items-center justify-center text-xl mb-3.5">📧</div>
          <h3 className="text-base font-bold text-slate-800 mb-2">Publish &amp; Notify Subscribers?</h3>
          <p className="text-[13px] text-slate-500 leading-relaxed mb-1.5">
            This will publish the article and email <strong className="text-slate-700">all active subscribers</strong>:
          </p>
          <p className="text-[13px] text-violet-600 font-semibold italic mb-1.5">"{blog.title}"</p>
          <p className="text-[12px] text-slate-400 leading-relaxed mb-5">Emails send in the background — this cannot be undone.</p>
          <div className="flex gap-2.5">
            <button onClick={onCancel} disabled={loading}
              className="flex-1 py-2.5 rounded-lg border border-slate-200 bg-white text-slate-600 text-[13px] font-semibold cursor-pointer font-[inherit] hover:bg-slate-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
              Cancel
            </button>
            <button onClick={onConfirm} disabled={loading}
              className="flex-1 py-2.5 rounded-lg bg-violet-600 hover:bg-violet-700 disabled:bg-violet-400 text-white text-[13px] font-semibold cursor-pointer font-[inherit] transition-colors border-none flex items-center justify-center gap-1.5 disabled:cursor-not-allowed">
              {loading ? (
                <>
                  <svg className="animate-spin" width="13" height="13" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" stroke="rgba(255,255,255,0.4)" strokeWidth="3" />
                    <path d="M12 2a10 10 0 0 1 10 10" stroke="#fff" strokeWidth="3" strokeLinecap="round" />
                  </svg>
                  Sending…
                </>
              ) : "📧 Publish & Notify"}
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

// Subscribers Panel 
function SubscribersPanel({ onBack, isMobile }) {
  const [stats, setStats] = useState(null);
  const [subscribers, setSubscribers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all"); // all | active | unsubscribed
  const [actionLoading, setActionLoading] = useState(null); // email of row being actioned
  const [deleteTarget, setDeleteTarget] = useState(null); // email pending delete confirm
  const { toasts: _, push } = useToast();

  // ── helpers to recompute stats from current list ──────────────────────────
  function recomputeStats(list) {
    const active = list.filter(s => s.isActive === true || s.isActive === "true").length;
    setStats({ total: list.length, active, unsubscribed: list.length - active });
  }

  async function loadData() {
    try {
      setLoading(true); setError(null);
      const [statsRes, subRes] = await Promise.all([
        fetch(`${API_BASE}/api/subscriptions/stats`),
        fetch(`${API_BASE}/api/subscriptions/all`),
      ]);
      const statsData = await statsRes.json();
      if (statsData.success) setStats(statsData.data);
      if (subRes.ok) {
        const subData = await subRes.json();
        setSubscribers(subData.subscribers || []);
      }
    } catch { setError("Failed to load subscriber data."); }
    finally { setLoading(false); }
  }

  useEffect(() => { loadData(); }, []);

  // Toggle active / inactive
  async function handleToggle(sub) {
    setActionLoading(sub.email);
    const wasActive = sub.isActive === true || sub.isActive === "true";
    try {
      const res = await fetch(`${API_BASE}/api/subscriptions/toggle`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: sub.email }),
      });
      if (!res.ok) throw new Error("Toggle failed");
      setSubscribers(prev => {
        const updated = prev.map(s =>
          s.email === sub.email ? { ...s, isActive: !wasActive, unsubscribedAt: wasActive ? new Date().toISOString() : undefined } : s
        );
        recomputeStats(updated);
        return updated;
      });
      push(wasActive ? "Subscriber deactivated." : "Subscriber reactivated.", "success");
    } catch { push("Action failed. Please try again.", "error"); }
    finally { setActionLoading(null); }
  }

  // Delete subscriber 
  async function handleDelete(email) {
    setActionLoading(email);
    try {
      const res = await fetch(`${API_BASE}/api/subscriptions/${encodeURIComponent(email)}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Delete failed");
      setSubscribers(prev => {
        const updated = prev.filter(s => s.email !== email);
        recomputeStats(updated);
        return updated;
      });
      push("Subscriber deleted.", "success");
    } catch { push("Delete failed. Please try again.", "error"); }
    finally { setActionLoading(null); setDeleteTarget(null); }
  }

  const filtered = useMemo(() => {
    let list = [...subscribers];
    if (filter === "active") list = list.filter(s => s.isActive === true || s.isActive === "true");
    if (filter === "unsubscribed") list = list.filter(s => !s.isActive || s.isActive === "false");
    if (search) list = list.filter(s => s.email?.toLowerCase().includes(search.toLowerCase()));
    return list.sort((a, b) => new Date(b.subscribedAt || 0) - new Date(a.subscribedAt || 0));
  }, [subscribers, filter, search]);

  return (
    <motion.div key="subscribers" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }}>

      {/* Delete confirm modal */}
      <AnimatePresence>
        {deleteTarget && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setDeleteTarget(null)}
            className="fixed inset-0 z-2000 bg-black/35 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0, scale: 0.96, y: 10 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.96 }}
              onClick={e => e.stopPropagation()} className="w-full max-w-sm bg-white rounded-2xl shadow-2xl overflow-hidden">
              <div className="h-0.75 bg-red-500" />
              <div className="p-6">
                <div className="w-10 h-10 rounded-full bg-red-50 border border-red-200 flex items-center justify-center text-base mb-3.5">🗑️</div>
                <h3 className="text-base font-bold text-slate-800 mb-1.5">Delete Subscriber?</h3>
                <p className="text-[13px] text-slate-500 leading-relaxed mb-1.5">This will permanently remove:</p>
                <p className="text-[13px] text-red-500 font-semibold mb-5 break-all">{deleteTarget}</p>
                <p className="text-[12px] text-slate-400 mb-5">They will no longer receive any emails and cannot be recovered.</p>
                <div className="flex gap-2.5">
                  <button onClick={() => setDeleteTarget(null)}
                    className="flex-1 py-2.5 rounded-lg border border-slate-200 bg-white text-slate-600 text-[13px] font-semibold cursor-pointer font-[inherit] hover:bg-slate-50 transition-colors">
                    Cancel
                  </button>
                  <button onClick={() => handleDelete(deleteTarget)}
                    disabled={actionLoading === deleteTarget}
                    className="flex-1 py-2.5 rounded-lg bg-red-500 hover:bg-red-600 disabled:bg-red-300 text-white text-[13px] font-semibold cursor-pointer font-[inherit] transition-colors border-none flex items-center justify-center gap-1.5">
                    {actionLoading === deleteTarget
                      ? <><svg className="animate-spin" width="12" height="12" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="rgba(255,255,255,0.4)" strokeWidth="3" /><path d="M12 2a10 10 0 0 1 10 10" stroke="#fff" strokeWidth="3" strokeLinecap="round" /></svg> Deleting…</>
                      : "Delete"}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Page header */}
      <div className={`flex items-center justify-between gap-3 flex-wrap ${isMobile ? "py-5" : "pt-7 pb-5"}`}>
        <div className="flex items-center gap-3">
          <button onClick={onBack}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-slate-200 bg-white text-slate-600 text-[13px] font-semibold cursor-pointer hover:bg-green-50 hover:border-green-300 hover:text-green-700 transition-all shadow-sm">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M9 2L4 7l5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            {isMobile ? "Back" : "Back to Admin"}
          </button>
          <div>
            <p className="text-[10px] font-bold text-indigo-500 uppercase tracking-widest mb-0.5">Email List</p>
            <h1 className={`font-extrabold text-slate-900 ${isMobile ? "text-lg" : "text-2xl"}`}>Subscribers</h1>
          </div>
        </div>
        {stats && !isMobile && (
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-semibold text-green-600 bg-green-50 border border-green-200 rounded-full px-3 py-1">
              ● {stats.active} Active
            </span>
            <span className="text-[11px] font-semibold text-slate-500 bg-slate-50 border border-slate-200 rounded-full px-3 py-1">
              {stats.unsubscribed} Unsubscribed
            </span>
          </div>
        )}
      </div>

      {/* Stats row */}
      {stats && (
        <div className={`grid gap-3 mb-5 ${isMobile ? "grid-cols-3" : "grid-cols-3 max-w-lg"}`}>
          <StatCard icon="👥" label="Total" value={stats.total} valueColor="text-slate-800" sub="All time" />
          <StatCard icon="✅" label="Active" value={stats.active} valueColor="text-green-600" sub="Subscribed" />
          <StatCard icon="🚪" label="Unsubscribed" value={stats.unsubscribed} valueColor="text-slate-400" sub="Opted out" />
        </div>
      )}

      {/* Table card */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden mb-12">

        {/* Toolbar */}
        <div className={`border-b border-slate-50 bg-white flex gap-2.5 ${isMobile ? "flex-col p-3.5" : "flex-row items-center p-3.5"}`}>
          {!isMobile && <span className="text-[13px] font-bold text-slate-700 mr-1 shrink-0">All Subscribers</span>}
          <div className="relative flex-1">
            <svg className="absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" width="13" height="13" viewBox="0 0 14 14" fill="none">
              <circle cx="6" cy="6" r="4" stroke="#9ca3af" strokeWidth="1.5" /><path d="M9 9l3 3" stroke="#9ca3af" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
            <input value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search by email…"
              className="w-full pl-8 pr-3 py-1.75 text-[12px] border border-slate-200 rounded-lg outline-none bg-slate-50 text-slate-700 font-[inherit] focus:border-indigo-400 focus:bg-white focus:shadow-[0_0_0_3px_rgba(99,102,241,0.15)] transition-all" />
          </div>
          <div className="flex gap-1.5">
            {["all", "active", "unsubscribed"].map(f => (
              <button key={f} onClick={() => setFilter(f)}
                className={`px-3 py-1.75 rounded-lg text-[12px] font-semibold border transition-all cursor-pointer font-[inherit] capitalize ${filter === f ? "bg-indigo-600 text-white border-indigo-600" : "bg-slate-50 text-slate-600 border-slate-200 hover:border-indigo-300 hover:text-indigo-600"}`}>
                {f}
              </button>
            ))}
          </div>
          <span className="text-[12px] text-slate-400 shrink-0">{filtered.length} result{filtered.length !== 1 ? "s" : ""}</span>
        </div>

        {/* Content */}
        {loading ? (
          <div className="p-4 flex flex-col gap-2.5">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center gap-3 px-2">
                <div className="w-8 h-8 rounded-full bg-slate-200 animate-pulse shrink-0" />
                <div className="flex-1 flex flex-col gap-1.5">
                  <div className="h-3 w-[40%] rounded bg-slate-200 animate-pulse" />
                  <div className="h-2.5 w-[25%] rounded bg-slate-200 animate-pulse" />
                </div>
                <div className="w-16 h-5 rounded-full bg-slate-200 animate-pulse" />
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="py-10 text-center">
            <p className="text-[13px] text-red-400 font-medium">{error}</p>
            <p className="text-[12px] text-slate-400 mt-1">Make sure <code className="bg-slate-100 px-1 rounded text-[11px]">GET /api/subscriptions/all</code> is added to your backend.</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-12 px-6 text-center">
            <span className="text-3xl block mb-2.5">📭</span>
            <p className="text-[15px] font-bold text-slate-500">No subscribers found</p>
            <p className="text-[13px] text-slate-400 mt-1">
              {search ? `No results for "${search}"` : "No one has subscribed yet."}
            </p>
          </div>
        ) : isMobile ? (
          // Mobile: card list
          <div className="p-3.5 flex flex-col gap-2">
            {filtered.map((sub, i) => {
              const active = sub.isActive === true || sub.isActive === "true";
              const isActioning = actionLoading === sub.email;
              const date = sub.subscribedAt
                ? new Date(sub.subscribedAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })
                : "—";
              return (
                <div key={sub.email ?? i} className="bg-white rounded-xl p-3 flex items-center gap-3 border border-slate-100 shadow-sm">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${active ? "bg-green-100 text-green-700 border border-green-200" : "bg-slate-200 text-slate-500 border border-slate-200"}`}>
                    {sub.email?.[0]?.toUpperCase() ?? "?"}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] font-semibold text-slate-800 truncate">{sub.email}</p>
                    <p className="text-[10px] text-slate-400">{date}</p>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${active ? "bg-green-50 text-green-600 border-green-200" : "bg-slate-100 text-slate-400 border-slate-200"}`}>
                      {active ? "Active" : "Out"}
                    </span>
                    {/* Toggle */}
                    <button
                      onClick={() => handleToggle(sub)}
                      disabled={isActioning}
                      title={active ? "Deactivate" : "Reactivate"}
                      className={`w-7 h-7 rounded-lg border flex items-center justify-center text-[12px] transition-colors cursor-pointer disabled:opacity-40 ${active ? "border-orange-200 bg-orange-50 hover:bg-orange-100" : "border-green-200 bg-green-50 hover:bg-green-100"}`}>
                      {isActioning ? "⏳" : active ? "🔕" : "🔔"}
                    </button>
                    {/* Delete */}
                    <button
                      onClick={() => setDeleteTarget(sub.email)}
                      disabled={isActioning}
                      title="Delete subscriber"
                      className="w-7 h-7 rounded-lg border border-red-200 bg-red-50 hover:bg-red-100 flex items-center justify-center text-[12px] transition-colors cursor-pointer disabled:opacity-40">
                      🗑️
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          // Desktop: table
          <div className="overflow-x-auto">
            <table className="w-full border-collapse min-w-150">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  {["#", "Email", "Status", "Subscribed On", "Unsubscribed On", "Actions"].map(h => (
                    <th key={h} className={`py-2.5 px-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest whitespace-nowrap ${h === "Actions" ? "text-right" : "text-left"}`}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <AnimatePresence>
                  {filtered.map((sub, i) => {
                    const active = sub.isActive === true || sub.isActive === "true";
                    const isActioning = actionLoading === sub.email;
                    const subDate = sub.subscribedAt
                      ? new Date(sub.subscribedAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })
                      : "—";
                    const unsubDate = sub.unsubscribedAt
                      ? new Date(sub.unsubscribedAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })
                      : "—";
                    return (
                      <motion.tr key={sub.email ?? i}
                        initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                        transition={{ duration: 0.15, delay: Math.min(i * 0.03, 0.25) }}
                        className="border-b border-slate-50 hover:bg-indigo-50/40 transition-colors duration-100">
                        <td className="px-4 py-3 text-[12px] text-slate-300 font-medium w-10">{i + 1}</td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2.5">
                            <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-bold shrink-0 ${active ? "bg-green-100 text-green-700 border border-green-200" : "bg-slate-100 text-slate-400 border border-slate-200"}`}>
                              {sub.email?.[0]?.toUpperCase() ?? "?"}
                            </div>
                            <span className="text-[13px] font-medium text-slate-700">{sub.email}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${active ? "bg-green-50 text-green-700 border-green-200" : "bg-slate-50 text-slate-400 border-slate-200"}`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${active ? "bg-green-500" : "bg-slate-300"}`} />
                            {active ? "Active" : "Unsubscribed"}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-[12px] text-slate-400">{subDate}</td>
                        <td className="px-4 py-3 text-[12px] text-slate-400">{active ? "—" : unsubDate}</td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-1.5 justify-end">
                            {/* Toggle active/inactive */}
                            <button
                              onClick={() => handleToggle(sub)}
                              disabled={isActioning}
                              title={active ? "Deactivate subscriber" : "Reactivate subscriber"}
                              className={`h-7 px-2.5 rounded-lg border flex items-center gap-1 text-[11px] font-semibold transition-all cursor-pointer disabled:opacity-40 ${active
                                ? "border-orange-200 bg-orange-50 hover:bg-orange-100 text-orange-600"
                                : "border-green-200 bg-green-50 hover:bg-green-100 text-green-600"
                                }`}>
                              {isActioning
                                ? <svg className="animate-spin" width="12" height="12" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" opacity="0.3" /><path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" /></svg>
                                : <span>{active ? "🔕" : "🔔"}</span>
                              }
                              {active ? "Deactivate" : "Reactivate"}
                            </button>

                            {/* Delete */}
                            <button
                              onClick={() => setDeleteTarget(sub.email)}
                              disabled={isActioning}
                              title="Delete subscriber permanently"
                              className="w-7 h-7 rounded-lg border border-red-200 bg-red-50 hover:bg-red-100 flex items-center justify-center text-[12px] transition-colors cursor-pointer disabled:opacity-40">
                              🗑️
                            </button>
                          </div>
                        </td>
                      </motion.tr>
                    );
                  })}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        )}

        {/* Footer */}
        {!loading && filtered.length > 0 && (
          <div className="px-4 py-2.5 border-t border-slate-50 flex items-center justify-between flex-wrap gap-2">
            <span className="text-[12px] text-slate-400">Showing {filtered.length} of {subscribers.length}</span>
            {stats && (
              <div className="flex gap-1.5">
                <span className="text-[11px] font-semibold text-green-600 bg-green-50 border border-green-200 rounded-full px-2.5 py-0.5">{stats.active} Active</span>
                <span className="text-[11px] font-semibold text-slate-500 bg-slate-50 border border-slate-200 rounded-full px-2.5 py-0.5">{stats.unsubscribed} Unsubscribed</span>
              </div>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
}

// Mobile Blog Card
function BlogCard({ blog, onEdit, onDelete, onTogglePublish, onToggleFeatured, onPublishNotify }) {
  return (
    <div className="bg-white rounded-xl border border-slate-100 p-3.5 flex flex-col gap-2.5">
      <div className="flex gap-3 items-start">
        <div className="w-14 h-11 rounded-lg overflow-hidden shrink-0 bg-slate-100 border border-slate-200">
          {blog.image
            ? <img src={blog.image} alt="" className="w-full h-full object-cover" onError={e => e.target.style.display = "none"} />
            : <div className="w-full h-full flex items-center justify-center text-base">☀️</div>
          }
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[13px] font-bold text-slate-800 leading-snug mb-1">{blog.title}</p>
          <p className="text-[11px] text-slate-400">{blog.author} · {blog.date}</p>
        </div>
      </div>
      <div className="flex items-center gap-1.5 flex-wrap">
        <CategoryPill category={blog.category} small />
        <StatusBadge published={blog.published} />
        {blog.featured && <span className="text-[10px] text-yellow-600 font-bold">⭐ Featured</span>}
      </div>
      <div className="flex gap-2 justify-end border-t border-slate-50 pt-2.5 flex-wrap">
        <button onClick={() => onToggleFeatured(blog)} className={`px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white cursor-pointer text-[13px] transition-opacity ${blog.featured ? "opacity-100" : "opacity-30"}`}>⭐</button>
        <button onClick={() => onTogglePublish(blog)} className="px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white cursor-pointer text-[13px]">{blog.published ? "📴" : "📢"}</button>
        {!blog.published && (
          <button onClick={() => onPublishNotify(blog)} className="px-2.5 py-1.5 rounded-lg border border-violet-200 bg-violet-50 cursor-pointer flex items-center gap-1">
            <span className="text-[11px]">📧</span>
            <span className="text-[11px] font-bold text-violet-700">Notify</span>
          </button>
        )}
        <button onClick={() => onEdit(blog)} className="px-2.5 py-1.5 rounded-lg border border-blue-200 bg-blue-50 cursor-pointer text-[13px]">✏️</button>
        <button onClick={() => onDelete(blog)} className="px-2.5 py-1.5 rounded-lg border border-red-200 bg-red-50 cursor-pointer text-[13px]">🗑️</button>
      </div>
    </div>
  );
}

function BlogRow({ blog, onEdit, onDelete, onTogglePublish, onToggleFeatured, onPublishNotify, index }) {
  const [h, setH] = useState(false);
  const rowBg = h ? "bg-green-50" : index % 3 === 0 ? "bg-[#f9fffe]" : index % 3 === 1 ? "bg-white" : "bg-[#fffef0]";
  return (
    <motion.tr
      initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
      transition={{ duration: 0.18, delay: Math.min(index * 0.04, 0.3) }}
      onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)}
      className={`transition-colors duration-150 border-b border-slate-50 ${rowBg}`}>
      <td className="px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="w-12 h-9 rounded-lg overflow-hidden shrink-0 bg-slate-100 border border-slate-200">
            {blog.image
              ? <img src={blog.image} alt="" className="w-full h-full object-cover" onError={e => e.target.style.display = "none"} />
              : <div className="w-full h-full flex items-center justify-center text-green-500 text-sm">☀️</div>
            }
          </div>
          <div className="min-w-0">
            <p className={`text-[13px] font-bold truncate max-w-55 transition-colors duration-150 ${h ? "text-green-700" : "text-slate-800"}`}>{blog.title}</p>
            <p className="text-[11px] text-slate-400 truncate max-w-55 mt-0.5">{blog.excerpt?.slice(0, 55)}…</p>
          </div>
        </div>
      </td>
      <td className="px-2.5 py-3"><CategoryPill category={blog.category} /></td>
      <td className="px-2.5 py-3"><StatusBadge published={blog.published} /></td>
      <td className="px-2.5 py-3 text-center">
        <button onClick={() => onToggleFeatured(blog)} className={`bg-transparent border-none cursor-pointer text-[15px] transition-opacity duration-200 ${blog.featured ? "opacity-100" : "opacity-20"}`}>⭐</button>
      </td>
      <td className="px-2.5 py-3"><span className="text-[12px] text-slate-400">{blog.date}</span></td>
      <td className="px-2.5 py-3">
        <div className="flex items-center gap-1.5">
          <div className="w-6 h-6 rounded-full bg-green-100 border border-green-200 flex items-center justify-center text-[10px] font-extrabold text-green-700 shrink-0">
            {blog.author?.[0]?.toUpperCase() ?? "?"}
          </div>
          <span className="text-[12px] text-slate-600 font-medium">{blog.author}</span>
        </div>
      </td>
      <td className="px-4 py-3">
        <div className="flex gap-1.5 justify-end items-center">
          {!blog.published && (
            <button onClick={() => onPublishNotify(blog)} title="Publish & Email All Subscribers"
              className="h-7 px-2.5 rounded-lg border border-violet-200 bg-violet-50 hover:bg-violet-100 hover:border-violet-300 cursor-pointer flex items-center gap-1 transition-all duration-150">
              <span className="text-[11px]">📧</span>
              <span className="text-[11px] font-bold text-violet-700">Notify</span>
            </button>
          )}
          <button onClick={() => onTogglePublish(blog)} className="w-7 h-7 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 cursor-pointer flex items-center justify-center text-[12px] transition-colors">{blog.published ? "📴" : "📢"}</button>
          <button onClick={() => onEdit(blog)} className="w-7 h-7 rounded-lg border border-blue-200 bg-blue-50 hover:bg-blue-100 cursor-pointer flex items-center justify-center text-[12px] transition-colors">✏️</button>
          <button onClick={() => onDelete(blog)} className="w-7 h-7 rounded-lg border border-red-200 bg-red-50 hover:bg-red-100 cursor-pointer flex items-center justify-center text-[12px] transition-colors">🗑️</button>
        </div>
      </td>
    </motion.tr>
  );
}

//  Blog Editor 
function BlogEditor({ blog, onSave, onCancel, saving }) {
  const isEdit = !!blog?.id;
  const width = useWindowWidth();
  const isMobile = width < 640;
  const [form, setForm] = useState(() =>
    blog
      ? { ...EMPTY_FORM, ...blog, tags: Array.isArray(blog.tags) ? blog.tags.join(", ") : blog.tags || "", imagePreview: blog.imageUrl || blog.image || "" }
      : { ...EMPTY_FORM, category: "O&M Strategy", date: new Date().toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }), imagePreview: "" }
  );
  const [preview, setPreview] = useState(false);
  const [activeTab, setActiveTab] = useState("content");
  const set = (key) => (val) => setForm(f => ({ ...f, [key]: val }));
  const wordCount = useMemo(() => form.content.trim().split(/\s+/).filter(Boolean).length, [form.content]);
  const readTimeCalc = Math.max(1, Math.round(wordCount / 200));

  const handleSave = () => {
    const tags = typeof form.tags === "string" ? form.tags.split(",").map(t => t.trim()).filter(Boolean) : form.tags;
    const data = new FormData();
    data.append("title", form.title); data.append("excerpt", form.excerpt);
    data.append("content", form.content); data.append("category", form.category);
    data.append("author", form.author); data.append("date", form.date);
    data.append("readTime", form.readTime || `${readTimeCalc} min read`);
    data.append("tags", JSON.stringify(tags)); data.append("featured", form.featured);
    data.append("published", form.published); data.append("status", form.published ? "published" : "draft");
    if (form.imageFile) data.append("image", form.imageFile);
    onSave(data, (savedImageUrl) => {
      if (savedImageUrl) setForm(f => ({ ...f, imagePreview: savedImageUrl, image: savedImageUrl, imageUrl: savedImageUrl }));
    });
  };

  const tabs = [{ id: "content", label: "Content" }, { id: "media", label: "Media" }, { id: "settings", label: "Settings" }];

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }} className="flex flex-col h-full">
      <div className={`border-b border-slate-100 bg-white flex items-center gap-2.5 shrink-0 flex-wrap ${isMobile ? "px-4 py-3" : "px-6 py-4"}`}>
        <button onClick={onCancel} className="w-8 h-8 rounded-lg border border-slate-200 bg-white cursor-pointer flex items-center justify-center text-slate-500 text-sm shrink-0 hover:border-green-300 hover:text-green-600 transition-all">←</button>
        <div className="flex-1 min-w-0">
          <h2 className={`font-bold text-slate-800 truncate ${isMobile ? "text-sm" : "text-base"}`}>{isEdit ? "Edit Article" : "New Article"}</h2>
          <p className="text-[11px] text-slate-400">{wordCount} words · ~{readTimeCalc} min read</p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          {!isMobile && <Toggle label="Published" checked={form.published} onChange={set("published")} />}
          {!isMobile && <Btn onClick={() => setPreview(!preview)} variant="ghost" size="sm" icon={preview ? "✏️" : "👁️"}>{preview ? "Edit" : "Preview"}</Btn>}
          <Btn onClick={handleSave} variant="primary" size={isMobile ? "sm" : "md"} icon={saving ? "⏳" : "💾"} disabled={saving || !form.title}>
            {saving ? "Saving…" : isEdit ? "Update" : "Publish"}
          </Btn>
        </div>
      </div>
      {isMobile && (
        <div className="px-4 py-2.5 bg-white border-b border-slate-100 flex items-center justify-between">
          <Toggle label="Published" checked={form.published} onChange={set("published")} />
          <button onClick={() => setPreview(!preview)} className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white cursor-pointer text-[12px] font-semibold text-slate-600 font-[inherit]">
            {preview ? "✏️ Edit" : "👁️ Preview"}
          </button>
        </div>
      )}
      <div className={`flex border-b border-slate-100 bg-white shrink-0 ${isMobile ? "pl-2" : "pl-6"}`}>
        {tabs.map(t => (
          <button key={t.id} onClick={() => setActiveTab(t.id)}
            className={`border-none bg-transparent cursor-pointer font-[inherit] font-semibold transition-all duration-150 -mb-px ${isMobile ? "px-3.5 py-2.5 text-[12px]" : "px-4 py-3 text-[13px]"} ${activeTab === t.id ? "border-b-2 border-green-500 text-green-600" : "border-b-2 border-transparent text-slate-400 hover:text-slate-600"}`}>
            {t.label}
          </button>
        ))}
      </div>
      <div className={`flex-1 overflow-auto bg-slate-50 ${isMobile ? "p-3.5" : "p-6"}`}>
        {preview ? (
          <div className={`max-w-170 mx-auto bg-white rounded-2xl border border-slate-100 shadow-sm ${isMobile ? "p-5" : "p-9"}`}>
            <div className="mb-3"><CategoryPill category={form.category} /></div>
            <h1 className={`font-extrabold text-slate-900 leading-tight mb-2.5 ${isMobile ? "text-xl" : "text-2xl"}`}>{form.title || "Untitled"}</h1>
            <p className="text-[12px] text-slate-400 mb-4">By {form.author || "Author"} · {form.date} · {form.readTime || `${readTimeCalc} min read`}</p>
            {(form.imagePreview || form.image) && (
              <div className={`rounded-xl overflow-hidden mb-5 ${isMobile ? "h-44" : "h-56"}`}>
                <img src={form.imagePreview || form.image} alt="preview" className="w-full h-full object-cover" onError={e => e.target.style.display = "none"} />
              </div>
            )}
            <p className="text-sm text-slate-700 italic border-l-[3px] border-green-500 pl-3 leading-7 mb-4">{form.excerpt}</p>
            {form.content.split(/\n\n+/).filter(Boolean).map((p, i) => <p key={i} className="text-sm text-slate-600 leading-7 mb-3.5">{p}</p>)}
          </div>
        ) : (
          <div className="max-w-195 mx-auto flex flex-col gap-3.5">
            {activeTab === "content" && (
              <>
                <div className={`bg-white rounded-xl border border-slate-100 flex flex-col gap-3.5 ${isMobile ? "p-3.5" : "p-5"}`}>
                  <Input label="Article Title" value={form.title} onChange={v => v.length <= 100 && set("title")(v)} placeholder="Enter a compelling title…" required hint={`${form.title.length}/100 characters`} />
                  <Input label="Excerpt / Summary" value={form.excerpt} onChange={v => v.length <= 400 && set("excerpt")(v)} placeholder="A 1–2 sentence summary…" multiline rows={isMobile ? 3 : 4} hint={`${form.excerpt.length}/400 characters`} />
                </div>
                <div className={`bg-white rounded-xl border border-slate-100 ${isMobile ? "p-3.5" : "p-5"}`}>
                  <Input label="Full Content" value={form.content} onChange={set("content")} placeholder="Write your article here…" multiline rows={isMobile ? 10 : 16} hint={`${wordCount} words · ~${readTimeCalc} min read`} />
                </div>
              </>
            )}
            {activeTab === "media" && (
              <div className={`bg-white rounded-xl border border-slate-100 flex flex-col gap-3.5 ${isMobile ? "p-3.5" : "p-5"}`}>
                <div className="flex flex-col gap-2">
                  <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Upload Cover Image</label>
                  <input type="file" accept="image/*" onChange={e => { const f = e.target.files[0]; if (f) setForm(x => ({ ...x, imageFile: f, imagePreview: URL.createObjectURL(f) })); }}
                    className="border border-dashed border-slate-300 rounded-xl p-3 cursor-pointer bg-slate-50 text-[13px] max-w-full" />
                  <span className="text-[11px] text-slate-400">Recommended: 1200×630px</span>
                </div>
                {(form.imagePreview || form.image)
                  ? <div className={`rounded-xl overflow-hidden border border-slate-200 ${isMobile ? "h-44" : "h-56"}`}><img src={form.imagePreview || form.image} alt="preview" className="w-full h-full object-cover" onError={e => e.target.style.display = "none"} /></div>
                  : <div className="h-36 rounded-xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center gap-2 text-slate-400"><span className="text-3xl">🖼️</span><span className="text-[13px] font-medium">No image selected</span></div>
                }
              </div>
            )}
            {activeTab === "settings" && (
              <div className={`bg-white rounded-xl border border-slate-100 flex flex-col gap-3.5 ${isMobile ? "p-3.5" : "p-5"}`}>
                <div className={`grid gap-3 ${isMobile ? "grid-cols-1" : "grid-cols-2"}`}>
                  <Select label="Category" value={form.category} onChange={set("category")} options={CATEGORIES} />
                  <Input label="Author Name" value={form.author} onChange={set("author")} placeholder="e.g. Rahul Sharma" />
                  <Input type="date" label="Publish Date" value={form.date} onChange={set("date")} />
                  <Input label="Read Time" value={form.readTime} onChange={set("readTime")} placeholder={`Auto: ${readTimeCalc} min read`} hint="Leave blank to auto-calculate" />
                </div>
                <Input label="Tags" value={typeof form.tags === "string" ? form.tags : form.tags.join(", ")} onChange={set("tags")} placeholder="solar, O&M, inverter, India" hint="Comma-separated" />
                <div className="bg-slate-50 rounded-xl border border-slate-100 p-4 flex flex-col gap-3">
                  <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest m-0">Visibility</p>
                  <Toggle label="Published (visible on site)" checked={form.published} onChange={set("published")} />
                  <Toggle label="Featured Article (shown prominently)" checked={form.featured} onChange={set("featured")} />
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
}

//  Main Admin Panel 
export default function BlogAdminPanel() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [view, setView] = useState("list");
  const [editingBlog, setEditingBlog] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [notifyTarget, setNotifyTarget] = useState(null);
  const [notifying, setNotifying] = useState(false);
  const [search, setSearch] = useState("");
  const [filterCat, setFilterCat] = useState("All");
  const [filterStatus, setFilterStatus] = useState("All");
  const [sortBy, setSortBy] = useState("date");
  const [searchFocused, setSearchFocused] = useState(false);
  const { toasts, push } = useToast();
  const width = useWindowWidth();
  const isMobile = width < 640;
  const isTablet = width >= 640 && width < 1024;

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const raw = await fetchAllBlogs(200);
        const list = Array.isArray(raw) ? raw : (raw?.blogs ?? []);
        setBlogs(list.map(transformBlog));
      } catch { push("Could not connect to API. Please check your server.", "error"); }
      finally { setLoading(false); }
    })();
  }, []);

  const displayed = useMemo(() => {
    let list = [...blogs];
    if (filterCat !== "All") list = list.filter(b => b.category === filterCat);
    if (filterStatus === "Published") list = list.filter(b => b.published);
    if (filterStatus === "Draft") list = list.filter(b => !b.published);
    if (search) list = list.filter(b => b.title?.toLowerCase().includes(search.toLowerCase()) || b.author?.toLowerCase().includes(search.toLowerCase()));
    if (sortBy === "date") list.sort((a, b) => new Date(b.publishDate ?? b.date) - new Date(a.publishDate ?? a.date));
    if (sortBy === "title") list.sort((a, b) => a.title.localeCompare(b.title));
    return list;
  }, [blogs, filterCat, filterStatus, search, sortBy]);

  const stats = useMemo(() => ({
    total: blogs.length, published: blogs.filter(b => b.published).length,
    draft: blogs.filter(b => !b.published).length, featured: blogs.filter(b => b.featured).length,
  }), [blogs]);

  const handleSave = async (formData, onImageSaved) => {
    setSaving(true);
    try {
      const isEdit = !!editingBlog?.id;
      let saved;
      if (isEdit) {
        const raw = await updateBlog(editingBlog.id, formData);
        const blogData = raw?.blog ?? raw;
        const resolvedImageUrl = blogData.imageUrl || editingBlog.imageUrl || editingBlog.image || "";
        saved = transformBlog({ ...blogData, imageUrl: resolvedImageUrl });
        setBlogs(bl => bl.map(b => b.id === saved.id ? saved : b));
        if (onImageSaved) onImageSaved(resolvedImageUrl);
        push("Article updated successfully!", "success");
      } else {
        const raw = await createBlog(formData);
        saved = transformBlog(raw?.blog ?? raw);
        setBlogs(bl => [saved, ...bl]);
        push("Article published successfully!", "success");
      }
      setView("list"); setEditingBlog(null);
    } catch { push("Failed to save article.", "error"); }
    finally { setSaving(false); }
  };

  const handleDelete = async (blog) => {
    try {
      await deleteBlog(blog.id ?? blog.blogId);
      setBlogs(bl => bl.filter(b => b.id !== (blog.id ?? blog.blogId)));
      push("Article deleted.", "success");
    } catch { push("Failed to delete article.", "error"); }
    finally { setDeleteTarget(null); }
  };

  const handleTogglePublish = async (blog) => {
    const optimistic = { ...blog, published: !blog.published };
    setBlogs(bl => bl.map(b => b.id === blog.id ? optimistic : b));
    try {
      const raw = await togglePublish(blog);
      const updated = transformBlog(raw?.blog ?? raw);
      setBlogs(bl => bl.map(b => b.id === updated.id ? updated : b));
      push(`Article ${updated.published ? "published" : "unpublished"}.`, "success");
    } catch {
      setBlogs(bl => bl.map(b => b.id === blog.id ? blog : b));
      push("Failed to update status.", "error");
    }
  };

  const handleToggleFeatured = async (blog) => {
    const blogId = blog.id || blog._id || blog.blogId;
    if (!blogId) { push("Blog ID is missing!", "error"); return; }
    const matchId = b => b.id || b._id || b.blogId;
    const optimistic = { ...blog, featured: !blog.featured };
    setBlogs(bl => bl.map(b => matchId(b) === blogId ? optimistic : b));
    try {
      const raw = await toggleFeatured(blogId);
      const updated = transformBlog(raw?.blog ?? raw);
      setBlogs(bl => bl.map(b => matchId(b) === (updated.id || updated._id || updated.blogId) ? updated : b));
      push(updated.featured ? "Marked as featured." : "Feature removed.", "info");
    } catch {
      setBlogs(bl => bl.map(b => matchId(b) === blogId ? blog : b));
      push("Failed to update featured status.", "error");
    }
  };

  const handlePublishNotifyConfirm = async () => {
    if (!notifyTarget) return;
    setNotifying(true);
    try {
      const data = await publishAndNotify(notifyTarget.id ?? notifyTarget.blogId);
      const updated = transformBlog(data?.blog ?? { ...notifyTarget, published: true });
      setBlogs(bl => bl.map(b => b.id === updated.id ? updated : b));
      push("Published! Subscriber emails are on their way 📧", "success");
    } catch { push("Failed to publish & notify. Please try again.", "error"); }
    finally { setNotifying(false); setNotifyTarget(null); }
  };

  const openNew = () => { setEditingBlog(null); setView("editor"); };
  const openEdit = b => { setEditingBlog(b); setView("editor"); };
  const closeEditor = () => { setView("list"); setEditingBlog(null); };

  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
      <style>{`*, *::before, *::after { font-family: 'Plus Jakarta Sans', -apple-system, sans-serif; } ::-webkit-scrollbar{width:4px;height:4px} ::-webkit-scrollbar-track{background:#f1f5f9} ::-webkit-scrollbar-thumb{background:#cbd5e1;border-radius:10px} select option{background:#fff;color:#1e293b}`}</style>

      <Toast toasts={toasts} />
      <AnimatePresence>
        {deleteTarget && <DeleteModal blog={deleteTarget} onConfirm={() => handleDelete(deleteTarget)} onCancel={() => setDeleteTarget(null)} />}
        {notifyTarget && <PublishNotifyModal blog={notifyTarget} onConfirm={handlePublishNotifyConfirm} onCancel={() => !notifying && setNotifyTarget(null)} loading={notifying} />}
      </AnimatePresence>

      <div className="min-h-screen bg-slate-50">



        {/*  Page content  */}
        <div className={`max-w-325 mx-auto ${isMobile ? "px-3.5" : "px-6"}`}>
          <AnimatePresence mode="wait">

            {/*  Subscribers view  */}
            {view === "subscribers" && (
              <SubscribersPanel
                key="subscribers"
                onBack={() => setView("list")}
                isMobile={isMobile}
              />
            )}

            {/* Blog list */}
            {view === "list" && (
              <motion.div key="list" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }}>
                <div className={`flex items-end justify-between gap-3 flex-wrap ${isMobile ? "py-5" : "pt-7 pb-5"}`}>
                  <div>
                    <p className="text-[10px] font-bold text-green-500 uppercase tracking-widest mb-0.5">Content Management</p>
                    <h1 className={`font-extrabold text-slate-900 mb-0.5 ${isMobile ? "text-lg" : "text-2xl"}`}>Blog Articles</h1>
                    {!isMobile && <p className="text-[13px] text-slate-400">Manage and publish your solar energy articles</p>}
                  </div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <Btn
                      onClick={() => setView("subscribers")}
                      variant={view === "subscribers" ? "indigo" : "ghost"}
                      size={isMobile ? "sm" : "md"}
                      icon="👥"
                    >
                      {isMobile ? "Subs" : "Subscribers"}
                    </Btn>
                    <a href="/blogs" target="_blank" rel="noopener" className="no-underline">
                      <Btn variant="ghost" size={isMobile ? "sm" : "md"} icon="🌐">
                        {isMobile ? "" : "View Site"}
                      </Btn>
                    </a>
                    <Btn onClick={openNew} variant="primary" size={isMobile ? "sm" : "md"} icon="✍️">
                      {isMobile ? "New" : "+ New Article"}
                    </Btn>
                  </div>
                </div>

                <div className={`grid gap-3 mb-5 ${isMobile ? "grid-cols-2" : "grid-cols-4"}`}>
                  <StatCard icon="📰" label="Total" value={stats.total} valueColor="text-slate-800" sub="All articles" />
                  <StatCard icon="📢" label="Published" value={stats.published} valueColor="text-green-600" sub="Live on site" />
                  <StatCard icon="📝" label="Drafts" value={stats.draft} valueColor="text-orange-500" sub="Unpublished" />
                  <StatCard icon="⭐" label="Featured" value={stats.featured} valueColor="text-yellow-600" sub="Highlighted" />
                </div>

                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden mb-12">
                  <div className={`border-b border-slate-50 bg-white flex gap-2.5 ${isMobile ? "flex-col p-3.5" : "flex-row items-center p-3.5"}`}>
                    {!isMobile && <span className="text-[13px] font-bold text-slate-700 mr-1 shrink-0">All Articles</span>}
                    <div className="relative flex-1">
                      <svg className="absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" width="13" height="13" viewBox="0 0 14 14" fill="none">
                        <circle cx="6" cy="6" r="4" stroke="#9ca3af" strokeWidth="1.5" /><path d="M9 9l3 3" stroke="#9ca3af" strokeWidth="1.5" strokeLinecap="round" />
                      </svg>
                      <input value={search} onChange={e => setSearch(e.target.value)} onFocus={() => setSearchFocused(true)} onBlur={() => setSearchFocused(false)}
                        placeholder="Search title or author…"
                        className={`w-full pl-8 pr-3 py-1.75 text-[12px] border rounded-lg outline-none bg-slate-50 text-slate-700 transition-all duration-150 font-[inherit] ${searchFocused ? "border-green-400 bg-white shadow-[0_0_0_3px_rgba(134,239,172,0.25)]" : "border-slate-200"}`} />
                    </div>
                    <div className="flex gap-2 flex-wrap">
                      {[{ val: filterCat, fn: setFilterCat, opts: ["All", ...CATEGORIES] }, { val: filterStatus, fn: setFilterStatus, opts: ["All", "Published", "Draft"] }].map((f, i) => (
                        <select key={i} value={f.val} onChange={e => f.fn(e.target.value)}
                          className="text-[12px] border border-slate-200 rounded-lg px-2.5 py-1.75 bg-slate-50 text-slate-600 outline-none cursor-pointer font-[inherit] flex-1 min-w-25">
                          {f.opts.map(o => <option key={o}>{o}</option>)}
                        </select>
                      ))}
                      <select value={sortBy} onChange={e => setSortBy(e.target.value)}
                        className="text-[12px] border border-slate-200 rounded-lg px-2.5 py-1.75 bg-slate-50 text-slate-600 outline-none cursor-pointer font-[inherit] flex-1 min-w-25">
                        <option value="date">Sort: Date</option>
                        <option value="title">Sort: Title</option>
                      </select>
                    </div>
                    <span className="text-[12px] text-slate-400 shrink-0">{displayed.length} result{displayed.length !== 1 ? "s" : ""}</span>
                  </div>

                  {loading ? (
                    <div className={isMobile ? "p-3.5" : ""}>
                      {Array.from({ length: 4 }).map((_, i) => (
                        isMobile
                          ? <div key={i} className="bg-slate-50 rounded-xl p-3.5 mb-2.5 flex gap-3"><div className="w-14 h-11 rounded-lg bg-slate-200 animate-pulse shrink-0" /><div className="flex-1 flex flex-col gap-2"><div className="h-3 w-[70%] rounded bg-slate-200 animate-pulse" /><div className="h-2.5 w-1/2 rounded bg-slate-200 animate-pulse" /></div></div>
                          : <div key={i} className="px-4 py-3.5 border-b border-slate-50 flex items-center gap-3.5"><div className="w-12 h-9 rounded-lg bg-slate-200 animate-pulse" /><div className="flex-1 flex flex-col gap-1.5"><div className="h-3 w-[38%] rounded bg-slate-200 animate-pulse" /><div className="h-2.5 w-[55%] rounded bg-slate-200 animate-pulse" /></div><div className="w-17.5 h-5 rounded-full bg-slate-200 animate-pulse" /><div className="w-21.5 h-7 rounded-lg bg-slate-200 animate-pulse" /></div>
                      ))}
                    </div>
                  ) : displayed.length === 0 ? (
                    <div className="py-12 px-6 text-center">
                      <span className="text-3xl block mb-2.5">📭</span>
                      <p className="text-[15px] font-bold text-slate-500">No articles found</p>
                      <p className="text-[13px] text-slate-400 mt-1">Try adjusting your filters or write a new article.</p>
                      <button onClick={openNew} className="mt-4 px-5 py-2 bg-green-600 hover:bg-green-700 text-white border-none rounded-lg text-[13px] font-semibold cursor-pointer font-[inherit] transition-colors">Write First Article</button>
                    </div>
                  ) : isMobile ? (
                    <div className="p-3.5 flex flex-col gap-2.5">
                      <AnimatePresence>
                        {displayed.map(blog => (
                          <motion.div key={blog.id ?? blog.blogId} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                            <BlogCard blog={blog} onEdit={openEdit} onDelete={setDeleteTarget} onTogglePublish={handleTogglePublish} onToggleFeatured={handleToggleFeatured} onPublishNotify={setNotifyTarget} />
                          </motion.div>
                        ))}
                      </AnimatePresence>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className={`w-full border-collapse ${isTablet ? "min-w-150" : "min-w-175"}`}>
                        <thead>
                          <tr className="bg-slate-50 border-b border-slate-100">
                            {["Article", "Category", "Status", "Featured", "Date", "Author", "Actions"].map(h => (
                              <th key={h} className={`py-2.5 px-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest whitespace-nowrap ${h === "Actions" ? "text-right" : h === "Featured" ? "text-center" : "text-left"}`}>{h}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          <AnimatePresence>
                            {displayed.map((blog, index) => (
                              <BlogRow key={blog.id ?? blog.blogId ?? index} blog={blog} index={index}
                                onEdit={openEdit} onDelete={setDeleteTarget} onTogglePublish={handleTogglePublish} onToggleFeatured={handleToggleFeatured} onPublishNotify={setNotifyTarget} />
                            ))}
                          </AnimatePresence>
                        </tbody>
                      </table>
                    </div>
                  )}

                  {!loading && displayed.length > 0 && (
                    <div className="px-4 py-2.5 border-t border-slate-50 flex items-center justify-between flex-wrap gap-2">
                      <span className="text-[12px] text-slate-400">Showing {displayed.length} of {blogs.length}</span>
                      <div className="flex gap-1.5">
                        <span className="text-[11px] font-semibold text-green-600 bg-green-50 border border-green-200 rounded-full px-2.5 py-0.5">{stats.published} Published</span>
                        <span className="text-[11px] font-semibold text-slate-500 bg-slate-50 border border-slate-200 rounded-full px-2.5 py-0.5">{stats.draft} Draft</span>
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {/* Editor */}
            {view === "editor" && (
              <motion.div key="editor" initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }} transition={{ duration: 0.22 }}
                className={`flex flex-col min-h-screen pb-8 ${isMobile ? "pt-3.5" : "pt-5"}`}>
                <div className="bg-white rounded-xl md:rounded-2xl border border-slate-100 shadow-sm flex-1 flex flex-col overflow-hidden">
                  <BlogEditor blog={editingBlog} onSave={handleSave} onCancel={closeEditor} saving={saving} />
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </div>
    </>
  );
}