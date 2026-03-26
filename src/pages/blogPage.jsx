"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

const API_BASE =
  (typeof process !== "undefined" && process.env?.NEXT_PUBLIC_API_URL) ||
  (typeof import.meta !== "undefined" && import.meta.env?.VITE_API_URL) ||
  "http://localhost:5000";

const CATEGORIES = ["All", "O&M Strategy", "Technology", "Technical Insights", "Case Study"];

const CATEGORY_META = {
  "O&M Strategy": { accent: "#4ade80", accentBg: "rgba(74,222,128,0.10)", accentBorder: "rgba(74,222,128,0.28)", accentBorderHover: "rgba(74,222,128,0.85)", glow: "rgba(74,222,128,0.15)" },
  "Technology": { accent: "#60a5fa", accentBg: "rgba(96,165,250,0.10)", accentBorder: "rgba(96,165,250,0.28)", accentBorderHover: "rgba(96,165,250,0.85)", glow: "rgba(96,165,250,0.15)" },
  "Technical Insights": { accent: "#fb923c", accentBg: "rgba(251,146,60,0.10)", accentBorder: "rgba(251,146,60,0.28)", accentBorderHover: "rgba(251,146,60,0.85)", glow: "rgba(251,146,60,0.15)" },
  "Case Study": { accent: "#facc15", accentBg: "rgba(250,204,21,0.10)", accentBorder: "rgba(250,204,21,0.28)", accentBorderHover: "rgba(250,204,21,0.85)", glow: "rgba(250,204,21,0.15)" },
};

const DEFAULT_META = { accent: "#94a3b8", accentBg: "rgba(148,163,184,0.1)", accentBorder: "rgba(148,163,184,0.28)", accentBorderHover: "rgba(148,163,184,0.8)", glow: "rgba(148,163,184,0.1)" };

const FALLBACK_ICONS = {
  "O&M Strategy": (<svg width="48" height="48" viewBox="0 0 48 48" fill="none"><path d="M8 40V20L24 8L40 20V40H28V30H20V40H8Z" stroke="#4ade80" strokeWidth="2" strokeLinejoin="round" /><circle cx="24" cy="22" r="4" stroke="#4ade80" strokeWidth="2" /></svg>),
  "Technology": (<svg width="48" height="48" viewBox="0 0 48 48" fill="none"><rect x="6" y="14" width="36" height="24" rx="3" stroke="#60a5fa" strokeWidth="2" /><path d="M16 22h6M16 28h10M16 34h4" stroke="#60a5fa" strokeWidth="1.5" strokeLinecap="round" opacity="0.8" /></svg>),
  "Technical Insights": (<svg width="48" height="48" viewBox="0 0 48 48" fill="none"><path d="M24 6L28 18H42L31 26L35 38L24 30L13 38L17 26L6 18H20L24 6Z" stroke="#fb923c" strokeWidth="2" strokeLinejoin="round" /></svg>),
  "Case Study": (<svg width="48" height="48" viewBox="0 0 48 48" fill="none"><rect x="8" y="6" width="32" height="38" rx="3" stroke="#facc15" strokeWidth="2" /><path d="M14 16h20M14 22h20M14 28h12M20 35l4 4 8-8" stroke="#facc15" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.9" /></svg>),
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

function normalizeBlog(b) {
  let tags = b.tags;
  if (typeof tags === "string") {
    try { tags = JSON.parse(tags); } catch { tags = tags.split(",").map(t => t.trim()).filter(Boolean); }
  }
  return {
    ...b,
    id: b._id || b.id || b.blogId,
    date: b.dateFormatted || b.date || "",
    tags: Array.isArray(tags) ? tags : [],
    image: b.imageUrl ?? b.image ?? "",
  };
}

function BlogImage({ src, category, height, style: extraStyle = {} }) {
  const [errored, setErrored] = useState(false);
  const meta = CATEGORY_META[category] || DEFAULT_META;
  if (!src || errored) {
    return (
      <div style={{ width: "100%", height: height || "100%", display: "flex", alignItems: "center", justifyContent: "center", background: "linear-gradient(135deg,#0d1e30 0%,#0a1a28 100%)", ...extraStyle }}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
          {FALLBACK_ICONS[category]}
          <span style={{ color: meta.accent, fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase" }}>{category}</span>
        </div>
      </div>
    );
  }
  return <img src={src} alt={category} onError={() => setErrored(true)} style={{ width: "100%", height: height || "100%", objectFit: "cover", display: "block", ...extraStyle }} />;
}

function CategoryPill({ category, small = false }) {
  const meta = CATEGORY_META[category] || DEFAULT_META;
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 5, padding: small ? "2px 8px" : "4px 13px", borderRadius: 100, fontSize: small ? 9 : 11, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", background: meta.accentBg, color: meta.accent, border: `1px solid ${meta.accentBorder}`, whiteSpace: "nowrap" }}>
      <span style={{ width: 4, height: 4, borderRadius: "50%", background: meta.accent, display: "inline-block", flexShrink: 0 }} />
      {category}
    </span>
  );
}

function SkeletonCard() {
  return (
    <div style={{ borderRadius: 16, overflow: "hidden", border: "1px solid rgba(51,65,85,0.6)", background: "rgba(15,23,42,0.60)" }}>
      <div style={{ height: 190, background: "linear-gradient(90deg,#0d1e30 25%,#142033 50%,#0d1e30 75%)", backgroundSize: "200% 100%", animation: "shimmer 1.6s infinite" }} />
      <div style={{ padding: 20, display: "flex", flexDirection: "column", gap: 10 }}>
        {[45, 90, 75, 60].map((w, i) => (<div key={i} style={{ height: i === 1 ? 16 : 10, width: `${w}%`, borderRadius: 6, background: "rgba(51,65,85,0.6)" }} />))}
      </div>
    </div>
  );
}

function BlogModal({ blog, onClose }) {
  const meta = CATEGORY_META[blog.category] || DEFAULT_META;
  const width = useWindowWidth();
  const isMobile = width < 640;

  useEffect(() => {
    const handler = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    document.body.style.overflow = "hidden";
    return () => { window.removeEventListener("keydown", handler); document.body.style.overflow = ""; };
  }, [onClose]);

  const contentBlocks = useMemo(() => {
    const raw = blog.content || blog.body || "";
    if (!raw) return [];
    return raw.split(/\n\n+/).filter(Boolean);
  }, [blog]);

  const tags = Array.isArray(blog.tags) ? blog.tags : [];

  return (
    <motion.div key="modal-backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }} onClick={onClose}
      style={{ position: "fixed", inset: 0, zIndex: 1000, background: "rgba(0,0,0,0.88)", backdropFilter: "blur(10px)", display: "flex", alignItems: "flex-start", justifyContent: "center", padding: isMobile ? "12px 12px 40px" : "32px 16px 48px", overflowY: "auto" }}
    >
      <motion.div key="modal-panel"
        initial={{ opacity: 0, y: 48, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 24, scale: 0.97 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }} onClick={(e) => e.stopPropagation()}
        style={{ width: "100%", maxWidth: 840, borderRadius: isMobile ? 16 : 22, overflow: "hidden", background: "linear-gradient(160deg,#0d1e30 0%,#080f1a 60%,#091a0f 100%)", border: `1px solid ${meta.accentBorder}`, boxShadow: `0 40px 100px rgba(0,0,0,0.8), 0 0 80px ${meta.glow}`, position: "relative" }}
      >
        <div style={{ height: 3, background: `linear-gradient(90deg,${meta.accent},${meta.accent}80,transparent)` }} />
        <button onClick={onClose}
          style={{ position: "absolute", top: 14, right: 14, zIndex: 20, width: 34, height: 34, borderRadius: "50%", background: "rgba(15,23,42,0.95)", border: "1px solid rgba(51,65,85,0.8)", color: "#94a3b8", fontSize: 14, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.2s", lineHeight: 1 }}
          onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(239,68,68,0.2)"; e.currentTarget.style.color = "#f87171"; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(15,23,42,0.95)"; e.currentTarget.style.color = "#94a3b8"; }}
        >✕</button>

        <div style={{ position: "relative", height: isMobile ? 200 : 300, overflow: "hidden" }}>
          <BlogImage src={blog.image} category={blog.category} height={isMobile ? 200 : 300} />
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top,rgba(8,15,26,1) 0%,rgba(8,15,26,0.4) 50%,transparent 100%)" }} />
          {blog.featured && (
            <div style={{ position: "absolute", top: 14, left: 14, background: "linear-gradient(to right,#facc15,#fb923c)", color: "#0d1117", fontSize: 9, fontWeight: 800, letterSpacing: "0.12em", textTransform: "uppercase", padding: "4px 12px", borderRadius: 100 }}>⭐ Featured</div>
          )}
        </div>

        <div style={{ padding: isMobile ? "20px 18px 32px" : "36px 44px 52px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", marginBottom: 14 }}>
            <CategoryPill category={blog.category} small={isMobile} />
            {blog.date && <span style={{ color: "#475569", fontSize: 11 }}>{blog.date}</span>}
            {blog.readTime && <span style={{ color: "#475569", fontSize: 11 }}>· {blog.readTime}</span>}
            {blog.author && <span style={{ color: "#475569", fontSize: 11 }}>· By <span style={{ color: meta.accent, fontWeight: 600 }}>{blog.author}</span></span>}
          </div>

          <h1 style={{ margin: "0 0 16px", fontSize: isMobile ? "clamp(18px,5vw,22px)" : "clamp(20px,3vw,28px)", fontWeight: 800, lineHeight: 1.25, color: "#f8fafc", fontFamily: "'Sora', sans-serif", letterSpacing: "-0.015em" }}>{blog.title}</h1>
          <div style={{ height: 2, background: `linear-gradient(90deg,${meta.accent},${meta.accent}40,transparent)`, marginBottom: isMobile ? 18 : 28, borderRadius: 2 }} />

          <div style={{ fontSize: isMobile ? 14 : 15, lineHeight: 1.85, color: "rgba(241,245,249,0.72)", fontFamily: "'Sora', sans-serif" }}>
            {contentBlocks.length > 0
              ? contentBlocks.map((block, i) => <p key={i} style={{ margin: "0 0 16px" }}>{block}</p>)
              : (
                <>
                  <p style={{ margin: "0 0 16px", fontSize: isMobile ? 14 : 16, color: "rgba(241,245,249,0.82)" }}>{blog.excerpt}</p>
                  <div style={{ padding: "14px 18px", borderRadius: 10, background: meta.accentBg, border: `1px solid ${meta.accentBorder}`, marginTop: 12 }}>
                    <p style={{ margin: 0, fontSize: 12, color: "rgba(241,245,249,0.5)", fontStyle: "italic", lineHeight: 1.7 }}>
                      Full content from <code style={{ color: meta.accent, fontSize: 11, background: "rgba(0,0,0,0.3)", padding: "1px 5px", borderRadius: 4 }}>blog.content</code>
                    </p>
                  </div>
                </>
              )
            }
          </div>

          {tags.length > 0 && (
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginTop: 24, paddingTop: 20, borderTop: "1px solid rgba(51,65,85,0.5)" }}>
              <span style={{ color: "#475569", fontSize: 11, fontWeight: 600, alignSelf: "center" }}>Tags:</span>
              {tags.map((tag, i) => (
                <span key={i} style={{ padding: "2px 10px", borderRadius: 100, fontSize: 10, fontWeight: 600, background: "rgba(51,65,85,0.4)", color: "#94a3b8", border: "1px solid rgba(51,65,85,0.6)" }}>#{tag}</span>
              ))}
            </div>
          )}

          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: isMobile ? 24 : 36, paddingTop: isMobile ? 18 : 24, borderTop: "1px solid rgba(51,65,85,0.5)", flexWrap: "wrap", gap: 10 }}>
            <button onClick={onClose}
              style={{ display: "flex", alignItems: "center", gap: 7, padding: isMobile ? "8px 14px" : "10px 20px", borderRadius: 10, background: "transparent", border: "1px solid rgba(51,65,85,0.8)", color: "#94a3b8", fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "'Sora', sans-serif", transition: "all 0.2s" }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = meta.accentBorder; e.currentTarget.style.color = meta.accent; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = "rgba(51,65,85,0.8)"; e.currentTarget.style.color = "#94a3b8"; }}
            >
              <svg width="12" height="12" viewBox="0 0 14 14" fill="none"><path d="M9 2L4 7l5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
              Back to Articles
            </button>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <span style={{ fontSize: 11, color: "#475569" }}>Share:</span>
              {[{ label: "𝕏", title: "Twitter" }, { label: "in", title: "LinkedIn" }, { label: "🔗", title: "Copy link" }].map((s, i) => (
                <button key={i} title={s.title}
                  style={{ width: 30, height: 30, borderRadius: 8, background: "rgba(51,65,85,0.3)", border: "1px solid rgba(51,65,85,0.6)", color: "#94a3b8", fontSize: 12, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.2s", fontFamily: "inherit" }}
                  onMouseEnter={(e) => { e.currentTarget.style.borderColor = meta.accentBorder; e.currentTarget.style.color = meta.accent; e.currentTarget.style.background = meta.accentBg; }}
                  onMouseLeave={(e) => { e.currentTarget.style.borderColor = "rgba(51,65,85,0.6)"; e.currentTarget.style.color = "#94a3b8"; e.currentTarget.style.background = "rgba(51,65,85,0.3)"; }}
                >{s.label}</button>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

function FeaturedCard({ blog, onOpen, isMobile }) {
  const [hovered, setHovered] = useState(false);
  const meta = CATEGORY_META[blog.category] || DEFAULT_META;

  if (isMobile) {
    return (
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
        onClick={() => onOpen(blog)}
        style={{ borderRadius: 16, overflow: "hidden", border: `1px solid ${meta.accentBorder}`, background: "rgba(15,23,42,0.80)", cursor: "pointer", marginBottom: 16, position: "relative", boxShadow: "0 4px 20px rgba(0,0,0,0.3)" }}
      >
        <div style={{ position: "relative", height: 200, overflow: "hidden" }}>
          <BlogImage src={blog.image} category={blog.category} height={200} />
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top,rgba(8,15,26,1) 0%,rgba(8,15,26,0.2) 60%,transparent 100%)" }} />
          <div style={{ position: "absolute", top: 12, left: 12, background: "linear-gradient(to right,#facc15,#fb923c)", color: "#0d1117", fontSize: 9, fontWeight: 800, letterSpacing: "0.1em", textTransform: "uppercase", padding: "4px 10px", borderRadius: 100 }}>⭐ Featured</div>
        </div>
        <div style={{ padding: "16px 18px 20px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10, flexWrap: "wrap" }}>
            <CategoryPill category={blog.category} small />
            <span style={{ color: "#475569", fontSize: 11 }}>{blog.date}</span>
          </div>
          <h2 style={{ margin: "0 0 8px", fontSize: 17, fontWeight: 800, lineHeight: 1.3, color: "#f8fafc", fontFamily: "'Sora', sans-serif" }}>{blog.title}</h2>
          <p style={{ margin: "0 0 12px", fontSize: 13, lineHeight: 1.65, color: "rgba(255,255,255,0.45)", display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{blog.excerpt}</p>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <span style={{ color: "#475569", fontSize: 12 }}>By {blog.author}</span>
            <span style={{ color: meta.accent, fontSize: 12, fontWeight: 700, display: "flex", alignItems: "center", gap: 4 }}>
              Read Article
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2 6h8M6 2l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </span>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
      onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)} onClick={() => onOpen(blog)}
      style={{ display: "grid", gridTemplateColumns: "1fr 1fr", borderRadius: 20, overflow: "hidden", border: `1px solid ${hovered ? meta.accentBorderHover : "rgba(51,65,85,0.6)"}`, background: "rgba(15,23,42,0.60)", cursor: "pointer", transition: "all 0.35s ease", transform: hovered ? "translateY(-6px)" : "translateY(0)", boxShadow: hovered ? `0 24px 60px rgba(0,0,0,0.6), 0 0 40px ${meta.glow}` : "0 4px 24px rgba(0,0,0,0.3)", marginBottom: 24, position: "relative" }}
    >
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: `linear-gradient(90deg,${meta.accent},${meta.accent}60,transparent)`, opacity: hovered ? 1 : 0, transition: "opacity 0.3s", zIndex: 2 }} />
      <div style={{ position: "relative", height: 380, overflow: "hidden" }}>
        <div style={{ transform: hovered ? "scale(1.06)" : "scale(1)", transition: "transform 0.55s ease", height: "100%" }}>
          <BlogImage src={blog.image} category={blog.category} height={380} />
        </div>
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to right,transparent 40%,rgba(13,20,30,0.98))" }} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top,rgba(13,20,30,0.7) 0%,transparent 50%)" }} />
        <div style={{ position: "absolute", top: 16, left: 16, background: "linear-gradient(to right,#facc15,#fb923c)", color: "#0d1117", fontSize: 10, fontWeight: 800, letterSpacing: "0.12em", textTransform: "uppercase", padding: "5px 14px", borderRadius: 100, zIndex: 2 }}>⭐ Featured</div>
        <div style={{ position: "absolute", bottom: 20, left: 20, opacity: hovered ? 1 : 0, transform: hovered ? "translateY(0)" : "translateY(8px)", transition: "all 0.3s ease", zIndex: 2 }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "8px 16px", borderRadius: 100, background: "rgba(8,15,26,0.9)", border: `1px solid ${meta.accentBorder}`, backdropFilter: "blur(8px)" }}>
            <span style={{ color: meta.accent, fontSize: 12, fontWeight: 700 }}>Click to read</span>
          </div>
        </div>
      </div>
      <div style={{ padding: "44px 40px", display: "flex", flexDirection: "column", justifyContent: "center", gap: 18, position: "relative" }}>
        <div style={{ position: "absolute", top: "50%", right: -40, transform: "translateY(-50%)", width: 200, height: 200, background: `radial-gradient(circle,${meta.glow},transparent 70%)`, pointerEvents: "none", opacity: hovered ? 1 : 0, transition: "opacity 0.4s" }} />
        <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
          <CategoryPill category={blog.category} />
          <span style={{ color: "#475569", fontSize: 12 }}>{blog.date}{blog.readTime ? ` · ${blog.readTime}` : ""}</span>
        </div>
        <h2 style={{ margin: 0, fontSize: "clamp(18px,2vw,24px)", fontWeight: 800, lineHeight: 1.25, color: hovered ? "#f8fafc" : "#e2e8f0", fontFamily: "'Sora', sans-serif", letterSpacing: "-0.01em", transition: "color 0.3s" }}>{blog.title}</h2>
        <p style={{ margin: 0, fontSize: 14, lineHeight: 1.75, color: "rgba(255,255,255,0.45)", display: "-webkit-box", WebkitLineClamp: 4, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{blog.excerpt}</p>
        <div style={{ height: 1, background: `linear-gradient(90deg,${meta.accentBorder},transparent)` }} />
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span style={{ color: "#475569", fontSize: 13 }}>By {blog.author}</span>
          <span style={{ display: "flex", alignItems: "center", gap: hovered ? 10 : 5, color: meta.accent, fontSize: 13, fontWeight: 700, transition: "all 0.2s" }}>
            Read Article
            <svg width="15" height="15" viewBox="0 0 15 15" fill="none" style={{ transform: hovered ? "translateX(3px)" : "translateX(0)", transition: "transform 0.25s" }}><path d="M2.5 7.5h10M8.5 3.5l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </span>
        </div>
      </div>
    </motion.div>
  );
}

function BlogCard({ blog, index, onOpen }) {
  const [hovered, setHovered] = useState(false);
  const meta = CATEGORY_META[blog.category] || DEFAULT_META;
  return (
    <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4, delay: (index % 6) * 0.06 }}
      onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)} onClick={() => onOpen(blog)}
      style={{ position: "relative", borderRadius: 16, overflow: "hidden", border: `1px solid ${hovered ? meta.accentBorderHover : meta.accentBorder}`, background: hovered ? "rgba(15,23,42,0.95)" : "rgba(15,23,42,0.60)", cursor: "pointer", transition: "all 0.35s cubic-bezier(0.16,1,0.3,1)", transform: hovered ? "translateY(-6px) scale(1.01)" : "translateY(0) scale(1)", boxShadow: hovered ? `0 20px 50px rgba(0,0,0,0.5), 0 0 30px ${meta.glow}` : "0 2px 12px rgba(0,0,0,0.25)", display: "flex", flexDirection: "column" }}
    >
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg,${meta.accent},${meta.accent}60,transparent)`, opacity: hovered ? 1 : 0, transition: "opacity 0.3s", zIndex: 2 }} />
      <div style={{ height: 190, overflow: "hidden", flexShrink: 0, position: "relative" }}>
        <div style={{ transform: hovered ? "scale(1.06)" : "scale(1)", transition: "transform 0.55s ease", height: "100%" }}>
          <BlogImage src={blog.image} category={blog.category} height={190} />
        </div>
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top,rgba(13,20,30,1) 0%,rgba(13,20,30,0.2) 50%,transparent 100%)" }} />
        {blog.featured && (
          <div style={{ position: "absolute", top: 10, left: 10, background: "linear-gradient(to right,#facc15,#fb923c)", color: "#0d1117", fontSize: 9, fontWeight: 800, letterSpacing: "0.1em", textTransform: "uppercase", padding: "3px 9px", borderRadius: 100, zIndex: 3 }}>⭐ Featured</div>
        )}
        <div style={{ position: "absolute", inset: 0, background: `${meta.accent}15`, opacity: hovered ? 1 : 0, transition: "opacity 0.3s", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ transform: hovered ? "scale(1) translateY(0)" : "scale(0.85) translateY(10px)", transition: "transform 0.35s ease", padding: "8px 18px", borderRadius: 100, background: "rgba(8,15,26,0.9)", border: `1px solid ${meta.accentBorderHover}`, backdropFilter: "blur(8px)", display: "flex", alignItems: "center", gap: 7 }}>
            <span style={{ color: meta.accent, fontSize: 12, fontWeight: 700 }}>Read Article</span>
            <svg width="12" height="12" viewBox="0 0 14 14" fill="none"><path d="M2 7h10M7 3l4 4-4 4" stroke={meta.accent} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </div>
        </div>
      </div>
      <div style={{ padding: "16px 18px 18px", display: "flex", flexDirection: "column", gap: 8, flex: 1 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
          <span style={{ fontSize: 9, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.1em", color: meta.accent }}>{blog.category}</span>
          <span style={{ color: "#334155", fontSize: 10 }}>·</span>
          <span style={{ color: "#475569", fontSize: 10 }}>{blog.date}</span>
        </div>
        <h3 style={{ margin: 0, fontSize: 14, fontWeight: 700, lineHeight: 1.4, color: hovered ? meta.accent : "#f1f5f9", fontFamily: "'Sora', sans-serif", transition: "color 0.3s", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{blog.title}</h3>
        <p style={{ margin: 0, fontSize: 12, lineHeight: 1.65, color: "rgba(255,255,255,0.4)", display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{blog.excerpt}</p>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: "auto", paddingTop: 10, borderTop: `1px solid ${hovered ? meta.accentBorder : "rgba(51,65,85,0.4)"}`, transition: "border-color 0.3s" }}>
          <span style={{ color: "#475569", fontSize: 11 }}>{blog.readTime}</span>
          <span style={{ display: "flex", alignItems: "center", gap: 4, color: meta.accent, fontSize: 11, fontWeight: 700, transform: hovered ? "translateX(3px)" : "translateX(0)", transition: "transform 0.25x" }}>
            Read more
            <svg width="11" height="11" viewBox="0 0 12 12" fill="none"><path d="M2 6h8M6 2l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </span>
        </div>
      </div>
    </motion.div>
  );
}

function TabButton({ label, active, onClick, small = false }) {
  const [h, setH] = useState(false);
  return (
    <button onClick={onClick} onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)}
      style={{ padding: small ? "5px 12px" : "7px 18px", borderRadius: 100, fontSize: small ? 11 : 13, fontWeight: 700, cursor: "pointer", fontFamily: "'Sora', sans-serif", transition: "all 0.2s", background: active ? "linear-gradient(to right,#facc15,#4ade80)" : "transparent", border: active ? "1px solid transparent" : `1px solid ${h ? "rgba(250,204,21,0.5)" : "rgba(51,65,85,0.8)"}`, color: active ? "#0d1117" : h ? "#facc15" : "#94a3b8", boxShadow: active ? "0 4px 16px rgba(250,204,21,0.2)" : "none", whiteSpace: "nowrap" }}
    >{label}</button>
  );
}

function HeroButton({ gradient, hoverGrad, shadow, icon, label, onClick, small = false }) {
  const [h, setH] = useState(false);
  return (
    <button onClick={onClick} onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)}
      style={{ display: "flex", alignItems: "center", gap: 8, padding: small ? "10px 18px" : "12px 24px", borderRadius: 100, background: h ? hoverGrad : gradient, border: "none", color: "#fff", fontSize: small ? 13 : 15, fontWeight: 700, cursor: "pointer", fontFamily: "'Sora', sans-serif", transition: "all 0.3s ease", transform: h ? "scale(1.04)" : "scale(1)", boxShadow: h ? `0 12px 32px ${shadow}` : "0 4px 16px rgba(0,0,0,0.3)" }}
    >{icon}{label}</button>
  );
}

// ─── UPDATED Newsletter — real API call to POST /api/subscriptions ─────────────
function Newsletter({ isMobile }) {
  const [focused, setFocused] = useState(false);
  const [email, setEmail]     = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus]   = useState(null); // "success" | "error"
  const [message, setMessage] = useState("");

  async function handleSubscribe() {
    const trimmed = email.trim();
    if (!trimmed || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      setStatus("error");
      setMessage("Please enter a valid email address.");
      return;
    }
    setLoading(true);
    setStatus(null);
    setMessage("");
    try {
      const res = await fetch(`${API_BASE}/api/subscriptions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: trimmed }),
      });
      const data = await res.json();
      if (data.success) {
        setStatus("success");
        setMessage(data.message || "You're subscribed!");
        setEmail("");
      } else {
        setStatus("error");
        setMessage(data.message || "Something went wrong. Please try again.");
      }
    } catch {
      setStatus("error");
      setMessage("Network error. Please check your connection.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ marginTop: isMobile ? 48 : 72, borderRadius: 20, background: "rgba(15,23,42,0.80)", border: "1px solid rgba(255,255,255,0.10)", padding: isMobile ? "28px 20px" : "48px 44px", display: "flex", flexDirection: isMobile ? "column" : "row", alignItems: isMobile ? "flex-start" : "center", justifyContent: "space-between", gap: isMobile ? 20 : 32, position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", top: -60, right: -60, width: 280, height: 280, background: "radial-gradient(circle,rgba(74,222,128,0.07),transparent 70%)", pointerEvents: "none" }} />

      {/* Left: text */}
      <div style={{ position: "relative", zIndex: 1 }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 7, background: "rgba(74,222,128,0.08)", border: "1px solid rgba(74,222,128,0.25)", borderRadius: 100, padding: "4px 12px", marginBottom: 12 }}>
          <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#4ade80", display: "inline-block", animation: "pvpulse 2s infinite" }} />
          <span style={{ color: "#4ade80", fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase" }}>Stay Updated</span>
        </div>
        <h3 style={{ margin: "0 0 6px", fontSize: isMobile ? 18 : 22, fontWeight: 800, color: "#f1f5f9", fontFamily: "'Sora', sans-serif" }}>Stay ahead in solar O&amp;M</h3>
        <p style={{ margin: 0, fontSize: 13, color: "rgba(255,255,255,0.4)", lineHeight: 1.6 }}>Expert insights — no spam, unsubscribe anytime.</p>
      </div>

      {/* Right: form or success */}
      <div style={{ position: "relative", zIndex: 1, width: isMobile ? "100%" : "auto", flexShrink: 0 }}>
        {status === "success" ? (
          <div style={{ display: "flex", alignItems: "center", gap: 10, color: "#4ade80", fontSize: 14, fontWeight: 700 }}>
            <span style={{ fontSize: 22 }}>✅</span> {message}
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <div style={{ display: "flex", gap: 8, flexWrap: isMobile ? "wrap" : "nowrap" }}>
              <input
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => { setEmail(e.target.value); if (status === "error") setStatus(null); }}
                onKeyDown={(e) => e.key === "Enter" && !loading && handleSubscribe()}
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
                disabled={loading}
                style={{ background: "rgba(255,255,255,0.05)", border: `1px solid ${status === "error" ? "#f87171" : focused ? "#4ade80" : "rgba(255,255,255,0.10)"}`, borderRadius: 10, padding: "10px 16px", color: "#f1f5f9", fontSize: 13, outline: "none", fontFamily: "'Sora', sans-serif", width: isMobile ? "100%" : 220, transition: "border-color 0.2s", opacity: loading ? 0.6 : 1 }}
              />
              <button
                onClick={handleSubscribe}
                disabled={loading}
                style={{ background: loading ? "rgba(34,197,94,0.4)" : "linear-gradient(to right,#22c55e,#10b981)", border: "none", borderRadius: 10, padding: "10px 18px", color: "#fff", fontSize: 13, fontWeight: 700, cursor: loading ? "not-allowed" : "pointer", fontFamily: "'Sora', sans-serif", whiteSpace: "nowrap", width: isMobile ? "100%" : "auto", transition: "all 0.2s", display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
                {loading ? (
                  <>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" style={{ animation: "spin 0.8s linear infinite" }}>
                      <circle cx="12" cy="12" r="10" stroke="rgba(255,255,255,0.3)" strokeWidth="3" />
                      <path d="M12 2a10 10 0 0 1 10 10" stroke="#fff" strokeWidth="3" strokeLinecap="round" />
                    </svg>
                    Subscribing…
                  </>
                ) : "Subscribe →"}
              </button>
            </div>
            {status === "error" && (
              <p style={{ margin: 0, fontSize: 11, color: "#f87171", display: "flex", alignItems: "center", gap: 4, paddingLeft: 2 }}>
                <span>⚠️</span> {message}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default function BlogsPage() {
  const [allBlogs, setAllBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchFocused, setSearchFocused] = useState(false);
  const [selectedBlog, setSelectedBlog] = useState(null);
  const [filterOpen, setFilterOpen] = useState(false);

  const width = useWindowWidth();
  const isMobile = width < 640;
  const isTablet = width >= 640 && width < 1024;

  const openBlog = useCallback((blog) => setSelectedBlog(blog), []);
  const closeBlog = useCallback(() => setSelectedBlog(null), []);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true); setError(null);
        const res = await fetch(`${API_BASE}/api/blogs?limit=100`);
        if (!res.ok) throw new Error(`Server responded with ${res.status}`);
        const data = await res.json();
        setAllBlogs((data.blogs || []).map(normalizeBlog));
      } catch (err) {
        console.error("BlogsPage fetch error:", err);
        setError("Failed to load articles. Please try again later.");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const featuredBlogs = allBlogs.filter((b) => b.featured);
  const isDefaultView = activeCategory === "All" && !searchQuery;

  const filteredBlogs = useMemo(() => {
    return allBlogs.filter((blog) => {
      const matchCat = activeCategory === "All" || blog.category === activeCategory;
      const matchSearch = !searchQuery
        || blog.title.toLowerCase().includes(searchQuery.toLowerCase())
        || (blog.excerpt || "").toLowerCase().includes(searchQuery.toLowerCase());
      if (isDefaultView && blog.featured) return false;
      return matchCat && matchSearch;
    });
  }, [allBlogs, activeCategory, searchQuery, isDefaultView]);

  const showFeaturedHero = isDefaultView && featuredBlogs.length > 0;
  const gridCols = isMobile ? "1fr" : isTablet ? "repeat(2,1fr)" : "repeat(auto-fill,minmax(300px,1fr))";

  return (
    <>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link href="https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700;800&display=swap" rel="stylesheet" />
      <style>{`
        * { box-sizing: border-box; }
        @keyframes pvpulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.6;transform:scale(1.2)} }
        @keyframes shimmer { 0%{background-position:200% 0} 100%{background-position:-200% 0} }
        @keyframes spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
        ::-webkit-scrollbar { width:5px }
        ::-webkit-scrollbar-track { background:#0d1117 }
        ::-webkit-scrollbar-thumb { background:#1e293b; border-radius:3px }
        button { -webkit-tap-highlight-color: transparent; }
      `}</style>

      <AnimatePresence>
        {selectedBlog && <BlogModal blog={selectedBlog} onClose={closeBlog} />}
      </AnimatePresence>

      <div style={{ minHeight: "100vh", background: "linear-gradient(180deg,#1e3a5f 0%,#000000 35%,#0a1a0e 70%,#14532d 100%)", color: "#f1f5f9", fontFamily: "'Sora', sans-serif" }}>

        <section style={{ position: "relative", minHeight: isMobile ? "50vh" : "70vh", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", background: "#000" }}>
          <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(circle,rgba(100,200,150,0.2) 1px,transparent 1px)", backgroundSize: "26px 26px" }} />
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom,rgba(0,0,0,0.80),rgba(0,0,0,0.70),rgba(0,0,0,0.80))" }} />
          <div style={{ position: "absolute", top: -100, left: "50%", transform: "translateX(-50%)", width: 700, height: 350, background: "radial-gradient(ellipse,rgba(249,115,22,0.14) 0%,transparent 70%)", pointerEvents: "none" }} />

          <div style={{ position: "relative", zIndex: 1, textAlign: "center", padding: isMobile ? "60px 20px 48px" : "80px 24px", maxWidth: 900, width: "100%" }}>
            <motion.h1 initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }}
              style={{ margin: "0 0 20px", fontSize: isMobile ? "clamp(26px,7vw,36px)" : "clamp(32px,5vw,56px)", fontWeight: 800, lineHeight: 1.15, letterSpacing: "-0.02em", background: "linear-gradient(to right,#facc15,#4ade80,#60a5fa)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
              Solar O&amp;M Knowledge Hub
            </motion.h1>
            <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }}
              style={{ margin: "0 auto 36px", fontSize: isMobile ? 14 : "clamp(15px,2vw,18px)", lineHeight: 1.8, color: "#93c5fd", maxWidth: 540, padding: isMobile ? "0 8px" : 0 }}>
              Expert insights on solar plant operations, maintenance strategies, and emerging technologies — from practitioners in the field.
            </motion.p>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, delay: 0.4 }}
              style={{ display: "flex", gap: isMobile ? 16 : 24, justifyContent: "center", flexWrap: "wrap" }}>
              {["Pan-India Coverage", "Updated Weekly"].map((item) => (
                <div key={item} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><circle cx="7" cy="7" r="6" stroke="#4ade80" strokeWidth="1.5" /><path d="M4.5 7l2 2 3-4" stroke="#4ade80" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                  <span style={{ fontSize: 13, color: "#93c5fd" }}>{item}</span>
                </div>
              ))}
            </motion.div>
          </div>
        </section>

        <div style={{ background: "rgba(15,23,42,0.85)", backdropFilter: "blur(12px)", borderTop: "1px solid rgba(51,65,85,0.6)", borderBottom: "1px solid rgba(51,65,85,0.6)", position: "sticky", top: 0, zIndex: 100 }}>
          {isMobile ? (
            <div style={{ padding: "10px 14px", display: "flex", flexDirection: "column", gap: 10 }}>
              <div style={{ display: "flex", gap: 8 }}>
                <div style={{ position: "relative", flex: 1 }}>
                  <svg style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }} width="13" height="13" viewBox="0 0 15 15" fill="none"><circle cx="6.5" cy="6.5" r="4.5" stroke="#64748b" strokeWidth="1.5" /><path d="M10 10l3 3" stroke="#64748b" strokeWidth="1.5" strokeLinecap="round" /></svg>
                  <input type="text" placeholder="Search articles…" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                    style={{ width: "100%", background: "rgba(255,255,255,0.05)", border: `1px solid ${searchFocused ? "#4ade80" : "rgba(51,65,85,0.8)"}`, borderRadius: 10, padding: "8px 12px 8px 32px", color: "#f1f5f9", fontSize: 13, outline: "none", fontFamily: "'Sora', sans-serif" }}
                    onFocus={() => setSearchFocused(true)} onBlur={() => setSearchFocused(false)} />
                </div>
                <button onClick={() => setFilterOpen(o => !o)}
                  style={{ padding: "8px 14px", borderRadius: 10, background: filterOpen ? "rgba(74,222,128,0.15)" : "rgba(255,255,255,0.05)", border: `1px solid ${filterOpen ? "#4ade80" : "rgba(51,65,85,0.8)"}`, color: filterOpen ? "#4ade80" : "#94a3b8", fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: "'Sora', sans-serif", whiteSpace: "nowrap" }}>
                  Filter {activeCategory !== "All" ? "●" : ""}
                </button>
              </div>
              <AnimatePresence>
                {filterOpen && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }} style={{ overflow: "hidden" }}>
                    <div style={{ display: "flex", gap: 6, flexWrap: "wrap", paddingBottom: 4 }}>
                      {CATEGORIES.map((cat) => (
                        <TabButton key={cat} label={cat} active={activeCategory === cat} onClick={() => { setActiveCategory(cat); setFilterOpen(false); }} small />
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 24px", display: "flex", alignItems: "center", gap: 10, height: 68, flexWrap: "wrap" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6, flex: 1, flexWrap: "wrap" }}>
                {CATEGORIES.map((cat) => (
                  <TabButton key={cat} label={cat} active={activeCategory === cat} onClick={() => setActiveCategory(cat)} small={isTablet} />
                ))}
              </div>
              <div style={{ position: "relative", flexShrink: 0 }}>
                <svg style={{ position: "absolute", left: 11, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }} width="13" height="13" viewBox="0 0 15 15" fill="none"><circle cx="6.5" cy="6.5" r="4.5" stroke="#64748b" strokeWidth="1.5" /><path d="M10 10l3 3" stroke="#64748b" strokeWidth="1.5" strokeLinecap="round" /></svg>
                <input type="text" placeholder="Search articles…" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} onFocus={() => setSearchFocused(true)} onBlur={() => setSearchFocused(false)}
                  style={{ background: "rgba(255,255,255,0.05)", border: `1px solid ${searchFocused ? "#4ade80" : "rgba(51,65,85,0.8)"}`, borderRadius: 10, padding: "8px 14px 8px 34px", color: "#f1f5f9", fontSize: 12, outline: "none", width: isTablet ? 180 : 220, fontFamily: "'Sora', sans-serif", transition: "border-color 0.2s" }} />
              </div>
            </div>
          )}
        </div>

        <div style={{ background: "linear-gradient(to bottom,#0f172a,#000000,#020617)" }}>
          <div style={{ maxWidth: 1280, margin: "0 auto", padding: isMobile ? "28px 14px 60px" : "52px 24px 80px" }}>

            {error && (
              <div style={{ marginBottom: 24, padding: "14px 18px", borderRadius: 12, background: "rgba(239,68,68,0.07)", border: "1px solid rgba(239,68,68,0.25)", display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
                <span style={{ color: "#f87171", fontSize: 13 }}>{error}</span>
                <button onClick={() => window.location.reload()} style={{ marginLeft: "auto", background: "none", border: "none", color: "#4ade80", fontSize: 12, cursor: "pointer", fontFamily: "'Sora', sans-serif", textDecoration: "underline" }}>Retry</button>
              </div>
            )}

            {loading && (
              <div style={{ display: "grid", gridTemplateColumns: gridCols, gap: isMobile ? 14 : 20 }}>
                {Array.from({ length: isMobile ? 3 : 6 }).map((_, i) => <SkeletonCard key={i} />)}
              </div>
            )}

            {!loading && !error && showFeaturedHero && (
              <div style={{ marginBottom: isMobile ? 4 : 8 }}>
                {featuredBlogs.map((blog) => (
                  <FeaturedCard key={blog.id} blog={blog} onOpen={openBlog} isMobile={isMobile} />
                ))}
              </div>
            )}

            {!loading && !error && (
              <div style={{ display: "flex", alignItems: "center", marginBottom: isMobile ? 16 : 24 }}>
                <p style={{ margin: 0, fontSize: 12, color: "#64748b" }}>
                  {showFeaturedHero ? (
                    <>
                      <span style={{ color: "#facc15", fontWeight: 700 }}>{featuredBlogs.length}</span> featured
                      {filteredBlogs.length > 0 && <> · <span style={{ color: "#4ade80", fontWeight: 700 }}>{filteredBlogs.length}</span> more</>}
                    </>
                  ) : (
                    <>
                      <span style={{ color: "#4ade80", fontWeight: 700 }}>{filteredBlogs.length}</span> article{filteredBlogs.length !== 1 ? "s" : ""}
                      {activeCategory !== "All" ? ` in ${activeCategory}` : ""}
                      {searchQuery ? ` matching "${searchQuery}"` : ""}
                    </>
                  )}
                </p>
              </div>
            )}

            {!loading && !error && filteredBlogs.length > 0 && (
              <AnimatePresence mode="wait">
                <motion.div key={activeCategory + searchQuery} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3 }}
                  style={{ display: "grid", gridTemplateColumns: gridCols, gap: isMobile ? 14 : 20 }}>
                  {filteredBlogs.map((blog, i) => <BlogCard key={blog.id} blog={blog} index={i} onOpen={openBlog} />)}
                </motion.div>
              </AnimatePresence>
            )}

            {!loading && !error && filteredBlogs.length === 0 && !showFeaturedHero && (
              <div style={{ textAlign: "center", padding: isMobile ? "60px 20px" : "80px 24px" }}>
                <svg width="48" height="48" viewBox="0 0 56 56" fill="none" style={{ margin: "0 auto 16px", display: "block", opacity: 0.3 }}><circle cx="24" cy="24" r="16" stroke="#475569" strokeWidth="2" /><path d="M36 36l10 10" stroke="#475569" strokeWidth="2" strokeLinecap="round" /></svg>
                <p style={{ margin: "0 0 6px", fontSize: isMobile ? 16 : 18, fontWeight: 700, color: "#94a3b8", fontFamily: "'Sora', sans-serif" }}>No articles found</p>
                <p style={{ margin: 0, fontSize: 13, color: "#475569" }}>Try a different search term or category.</p>
              </div>
            )}

            {!loading && <Newsletter isMobile={isMobile} />}
          </div>
        </div>

        {!loading && (
          <section style={{ position: "relative", padding: isMobile ? "48px 20px" : "64px 24px", textAlign: "center", background: "#000", overflow: "hidden" }}>
            <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(circle,rgba(100,200,150,0.2) 1px,transparent 1px)", backgroundSize: "26px 26px" }} />
            <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom,rgba(0,0,0,0.80),rgba(0,0,0,0.70),rgba(0,0,0,0.80))" }} />

            <div style={{ position: "relative", zIndex: 1, maxWidth: 680, margin: "0 auto" }}>
              <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(74,222,128,0.08)", border: "1px solid rgba(74,222,128,0.25)", borderRadius: 100, padding: "6px 18px", marginBottom: 20 }}>
                <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#4ade80", display: "inline-block", animation: "pvpulse 2s infinite" }} />
                <span style={{ color: "#4ade80", fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase" }}>Free Plant Health Audit</span>
              </motion.div>
              <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}
                style={{ margin: "0 0 16px", fontSize: isMobile ? "clamp(20px,5vw,28px)" : "clamp(24px,3.5vw,38px)", fontWeight: 800, background: "linear-gradient(to right,#facc15,#4ade80,#60a5fa)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text", letterSpacing: "-0.01em" }}>
                Ready to Optimise Your Solar Investment?
              </motion.h2>
              <motion.p initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }}
                style={{ margin: "0 0 36px", fontSize: isMobile ? 14 : 17, lineHeight: 1.75, color: "#93c5fd" }}>
                Get a free plant health audit from our certified engineers. Identify performance gaps and maximise your ROI — at no cost.
              </motion.p>
              <motion.div initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.3 }}
                style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
                <HeroButton gradient="linear-gradient(to right,#facc15,#fb923c,#ef4444)" hoverGrad="linear-gradient(to right,#eab308,#f97316,#dc2626)" shadow="rgba(251,146,60,0.5)" icon={<span style={{ fontSize: 18 }}>☀️</span>} label="Request Free Audit" onClick={() => { }} small={isMobile} />
                <HeroButton gradient="linear-gradient(to right,#06b6d4,#3b82f6,#6366f1)" hoverGrad="linear-gradient(to right,#0891b2,#2563eb,#4f46e5)" shadow="rgba(59,130,246,0.5)" icon={<span style={{ fontSize: 18 }}>📞</span>} label="Schedule a Call →" onClick={() => { window.location.href = "tel:+919975929989"; }} small={isMobile} />
              </motion.div>
            </div>
          </section>
        )}
      </div>
    </>
  );
}