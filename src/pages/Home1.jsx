import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  FaSolarPanel, FaTools, FaChartLine, FaCalculator,
  FaUserTie, FaWhatsapp, FaStar, FaChevronDown, FaChevronUp,
  FaHandshake, FaMapMarkerAlt, FaCheckCircle, FaArrowRight,
} from "react-icons/fa";
import { MdCleaningServices, MdElectricBolt, MdVerified } from "react-icons/md";

// ─── Animated Counter ─────────────────────────────────────────────────────────
const AnimatedCounter = ({ target, suffix = "", duration = 2000 }) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const started = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          const steps = 60;
          const increment = target / steps;
          let current = 0;
          const timer = setInterval(() => {
            current += increment;
            if (current >= target) { setCount(target); clearInterval(timer); }
            else setCount(Math.floor(current));
          }, duration / steps);
        }
      },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target, duration]);

  return <span ref={ref}>{count}{suffix}</span>;
};

// ─── FAQ Item ─────────────────────────────────────────────────────────────────
const FAQItem = ({ question, answer }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className={`border rounded-2xl transition-all duration-300 overflow-hidden ${open ? "border-emerald-500/40 bg-slate-800/70" : "border-slate-700/50 bg-slate-900/50"}`}>
      <button onClick={() => setOpen(!open)} className="w-full flex items-center justify-between p-6 text-left gap-4">
        <span className="text-base font-semibold text-slate-100 tracking-tight">{question}</span>
        <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 transition-all ${open ? "bg-emerald-500/20 text-emerald-400" : "bg-slate-800 text-slate-500"}`}>
          {open ? <FaChevronUp className="text-xs" /> : <FaChevronDown className="text-xs" />}
        </div>
      </button>
      {open && (
        <div className="px-6 pb-6 text-slate-300 text-sm leading-relaxed border-t border-slate-700/50 pt-5">
          {answer}
        </div>
      )}
    </div>
  );
};

// ─── Testimonial Data ─────────────────────────────────────────────────────────
const testimonials = [
  { name: "Rajesh Sharma", role: "Residential Solar Owner, Pune", text: "PVProtect's health score system caught a fault in one of my panels before it caused real damage. Excellent diagnostics and super fast technician dispatch.", rating: 5 },
  { name: "Priya Industries Pvt Ltd", role: "Commercial Client, Nashik", text: "We've been using PVProtect for O&M of our 200 kW rooftop plant. Their performance reports are transparent and the team is always responsive.", rating: 5 },
  { name: "Anand Solar EPC", role: "Business Partner, Mumbai", text: "Partnering with PVProtect expanded our service portfolio. Their technician network and platform made scaling our operations seamless.", rating: 5 },
  { name: "Suresh Mehta", role: "Agricultural Solar User, Solapur", text: "The mobile app is fantastic — I can monitor my 50 kW pumping system from anywhere. Great savings and excellent ongoing support.", rating: 5 },
];

const Home1 = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [quizScore, setQuizScore] = useState(null);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [currentQuiz, setCurrentQuiz] = useState(null);
  const [showCalculator, setShowCalculator] = useState(false);
  const [testimonialIndex, setTestimonialIndex] = useState(0);
  const [formData, setFormData] = useState({ name: "", email: "", phone: "", subject: "", message: "" });
  const [formSubmitted, setFormSubmitted] = useState(false);

  const solarQuizzes = [
    { question: "How much energy loss can dirty solar panels cause?", options: ["5-10%", "15-25%", "30-40%", "50%+"], correct: 1, fact: "Dirty solar panels can reduce efficiency by 15-25%! Regular cleaning is essential for optimal performance." },
    { question: "What is the average lifespan of a quality solar panel?", options: ["10-15 years", "15-20 years", "25-30 years", "40-50 years"], correct: 2, fact: "Quality solar panels last 25-30 years with minimal degradation, making them a long-term investment in clean energy." },
    { question: "How often should solar panels be professionally cleaned?", options: ["Every month", "2-4 times per year", "Once every 5 years", "Never, rain is enough"], correct: 1, fact: "Solar panels should be cleaned 2-4 times per year depending on location and environmental conditions." },
    { question: "Solar panels generate electricity from:", options: ["Heat from the sun", "Light from the sun", "Wind energy", "Both heat and wind"], correct: 1, fact: "It's light, not heat, that generates electricity. Too much heat can actually reduce solar panel efficiency!" },
    { question: "What % of CO₂ can a household reduce by using solar?", options: ["20-30%", "40-50%", "60-70%", "Up to 80%"], correct: 3, fact: "An average household can reduce carbon emissions by up to 80% by switching to solar energy." },
  ];

  useEffect(() => { setCurrentQuiz(solarQuizzes[Math.floor(Math.random() * solarQuizzes.length)]); }, []);
  useEffect(() => { if (location.state?.showCalculator) { setShowCalculator(true); window.history.replaceState({}, document.title); } }, [location]);
  useEffect(() => { const t = setInterval(() => setTestimonialIndex(p => (p + 1) % testimonials.length), 5000); return () => clearInterval(t); }, []);

  const handleQuizAnswer = (i) => { setSelectedAnswer(i); setQuizScore(i === currentQuiz.correct); };
  const loadNewQuiz = () => { setCurrentQuiz(solarQuizzes[Math.floor(Math.random() * solarQuizzes.length)]); setSelectedAnswer(null); setQuizScore(null); };
  const handleInputChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
  const handleSubmit = (e) => { e.preventDefault(); setFormSubmitted(true); setTimeout(() => { setFormSubmitted(false); setFormData({ name: "", email: "", phone: "", subject: "", message: "" }); }, 3000); };
  const handleCalculateSavings = () => { if (localStorage.getItem("isVerified") === "true") setShowCalculator(true); else navigate("/user-data", { state: { from: "calculator" } }); };

  if (!currentQuiz) return null;

  const faqItems = [
    { question: "What is PVProtect's Solar Health Score?", answer: "The Solar Health Score is a proprietary diagnostic metric that evaluates your solar PV system's performance across multiple parameters — panel output, inverter efficiency, soiling levels, and more — giving you a single actionable score out of 100." },
    { question: "How often should my solar panels be professionally serviced?", answer: "We recommend 2-4 service visits per year. In dusty regions like Rajasthan or western Maharashtra, quarterly cleaning significantly prevents the 15-25% efficiency loss caused by soiling." },
    { question: "How do I register my solar plant with PVProtect?", answer: "Click 'Register for Services' on this page, fill in your plant details (capacity, location, installation date), and our team will schedule an initial assessment within 48 hours." },
    { question: "Can businesses and EPC companies partner with PVProtect?", answer: "Absolutely. We offer partner programs for EPC firms, solar distributors, and O&M companies. Click 'Partner With Us' to explore revenue-sharing models and co-branding opportunities." },
    { question: "Is the PVProtect mobile app free to use?", answer: "The basic app is free and includes real-time monitoring and alerts. Advanced analytics, health reports, and priority support are available under our Pro subscription plans." },
  ];

  const customerJourney = [
    { step: "01", icon: "📋", title: "Register Your Plant", desc: "Fill in your solar system details — capacity, location, installation year." },
    { step: "02", icon: "🔍", title: "Initial Health Audit", desc: "Our certified technician performs a full on-site assessment and generates your Health Score." },
    { step: "03", icon: "📊", title: "Receive Your Report", desc: "Get a detailed PDF report with performance gaps, maintenance priorities, and ROI projections." },
    { step: "04", icon: "🛠️", title: "Schedule Services", desc: "Book cleaning, O&M, or repairs directly through the app or website." },
    { step: "05", icon: "📱", title: "Monitor & Optimize", desc: "Track live performance via the PVProtect app with alerts, insights, and monthly reports." },
    { step: "06", icon: "🚀", title: "Maximize ROI", desc: "Enjoy peak efficiency, lower bills, and a fully documented asset history for resale value." },
  ];

  return (
    <div className="min-h-screen bg-linear-to-b from-blue-900 via-black to-green-900 text-white" style={{ fontFamily: "'DM Sans', 'Outfit', sans-serif" }}>

      {/*  Floating WhatsApp */}
      <a href="https://wa.me/919999999999?text=Hi%2C%20I%20want%20to%20know%20more%20about%20PVProtect"
        target="_blank" rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 bg-green-500 hover:bg-green-400 text-white w-14 h-14 rounded-2xl flex items-center justify-center shadow-2xl shadow-green-500/40 transition-all duration-300 hover:scale-110 hover:rounded-full">
        <FaWhatsapp className="text-2xl" />
      </a>

      {/* HERO — Split Layout with orbit rings*/}
      <section className="relative min-h-screen flex items-center overflow-hidden bg-black">

        {/* Background layers */}
        <div className="absolute inset-0">
          <img src="/Home-bg.jpg" alt="" className="absolute inset-0 w-full h-full object-cover opacity-25" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(100,200,150,0.2)_1px,transparent_1px)] bg-size-[26px_26px]" />
          <div className="absolute inset-0 bg-linear-to-b from-black/80 via-black/70 to-black/80" />
          <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-[120px] pointer-events-none" />
          <div className="absolute bottom-1/4 left-1/3 w-80 h-80 bg-emerald-600/8 rounded-full blur-[100px] pointer-events-none" />
        </div>

        <div className="relative z-10 w-full max-w-7xl mx-auto px-6 lg:px-12 pt-28 pb-20 grid lg:grid-cols-2 gap-16 items-center">

          {/* Left — Copy */}
          <div>
            {/* Pill badge */}
            <div className="inline-flex items-center gap-2.5 bg-emerald-500/10 border border-emerald-500/40 rounded-full px-4 py-1.5 text-xs text-emerald-300 mb-8 tracking-wide">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <MdVerified className="text-emerald-400 text-sm" />
              Trusted by 20+ Solar Plant Owners Across India
            </div>

            <h1 className="text-5xl lg:text-6xl xl:text-7xl font-bold leading-[1.05] tracking-tight mb-6">
              <span className="text-white">Your solar plant</span>
              <br />
              <span className="relative inline-block">
                <span className="bg-linear-to-r from-amber-300 via-yellow-300 to-amber-400 bg-clip-text text-transparent">
                  deserves better
                </span>
                <svg className="absolute -bottom-2 left-0 w-full" height="4" viewBox="0 0 300 4">
                  <path d="M0 2 Q75 0 150 2 Q225 4 300 2" stroke="url(#ug)" strokeWidth="2.5" fill="none" strokeLinecap="round" />
                  <defs><linearGradient id="ug" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stopColor="#f59e0b" /><stop offset="100%" stopColor="#fde68a" /></linearGradient></defs>
                </svg>
              </span>
              <br />
              <span className="text-slate-400 font-light">than guesswork.</span>
            </h1>

            <p className="text-slate-300 text-lg leading-relaxed mb-10 max-w-xl">
              Complete lifecycle O&amp;M for your Solar PV system — diagnostics, cleaning, upgrades, and real-time monitoring. One platform, peak performance, always.
            </p>

            {/* CTA Grid */}
            <div className="grid grid-cols-2 gap-3 max-w-lg">
              <button onClick={handleCalculateSavings}
                className="group col-span-2 flex items-center justify-center gap-3 bg-amber-400 hover:bg-amber-300 text-zinc-950 font-bold py-4 px-6 rounded-2xl text-base transition-all duration-200 hover:scale-[1.02] shadow-lg shadow-amber-500/25">
                <FaCalculator className="text-lg" />
                Calculate Your Savings
                <FaArrowRight className="group-hover:translate-x-1 transition-transform text-sm" />
              </button>

              <button onClick={() => navigate("/user-data")}
                className="flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 border border-slate-700 hover:border-slate-600 text-white font-semibold py-3.5 px-5 rounded-xl text-sm transition-all duration-200 hover:scale-[1.02]">
                <FaChartLine className="text-emerald-400" />
                Solar Health
              </button>

              <button onClick={() => navigate("/registration")}
                className="flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 border border-slate-700 hover:border-slate-600 text-white font-semibold py-3.5 px-5 rounded-xl text-sm transition-all duration-200 hover:scale-[1.02]">
                <FaSolarPanel className="text-sky-400" />
                Register Plant
              </button>

              <button onClick={() => navigate("/technician-registration")}
                className="col-span-2 flex items-center justify-center gap-2 bg-slate-900/60 hover:bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-400 hover:text-slate-200 font-medium py-3 px-5 rounded-xl text-sm transition-all duration-200">
                <FaUserTie className="text-violet-400 text-xs" />
                Are you a technician? Register here →
              </button>
            </div>
          </div>

          {/* Right — Visual card cluster */}
          <div className="hidden lg:flex items-center justify-center relative">
            {/* Orbit rings */}
            <div className="absolute w-105 h-105 rounded-full border border-slate-700/60" />
            <div className="absolute w-[320px] h-80 rounded-full border border-slate-700/40" />

            {/* Central score card */}
            <div className="relative w-52 h-52 bg-slate-900 border border-slate-700 rounded-3xl flex flex-col items-center justify-center shadow-2xl z-10">
              <div className="text-xs text-slate-500 uppercase tracking-widest mb-2">Health Score</div>
              <div className="text-6xl font-bold bg-linear-to-br from-amber-300 to-emerald-400 bg-clip-text text-transparent">87</div>
              <div className="text-xs text-slate-500 mt-1">out of 100</div>
              <div className="mt-3 flex gap-1">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className={`h-1.5 w-6 rounded-full ${i < 4 ? "bg-emerald-400" : "bg-slate-700"}`} />
                ))}
              </div>
              <div className="mt-2 text-[10px] text-emerald-400 font-semibold">PERFORMING WELL</div>
            </div>

            {/* Floating stat chips */}
            {[
              { label: "Uptime", value: "98%", color: "text-emerald-400", pos: "-top-4 -right-8" },
              { label: "Efficiency", value: "+22%", color: "text-amber-400", pos: "top-16 -left-16" },
              { label: "CO₂ Saved", value: "2.4T", color: "text-sky-400", pos: "-bottom-6 left-4" },
              { label: "Alerts", value: "0 faults", color: "text-violet-400", pos: "bottom-10 -right-14" },
            ].map((chip, i) => (
              <div key={i} className={`absolute ${chip.pos} bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 shadow-xl text-center min-w-20`}>
                <div className={`text-lg font-bold ${chip.color}`}>{chip.value}</div>
                <div className="text-[10px] text-slate-500 mt-0.5">{chip.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-40">
          <span className="text-[10px] text-slate-500 uppercase tracking-[0.2em]">Scroll</span>
          <div className="w-px h-8 bg-linear-to-b from-slate-500 to-transparent" />
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════ */}
      {/* STATS TICKER                                                          */}
      {/* ══════════════════════════════════════════════════════════════════════ */}
      <section className="border-y border-slate-800/60 bg-linear-to-r from-emerald-950 via-slate-950 to-blue-950 backdrop-blur-sm py-10 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-3 md:grid-cols-6 gap-y-8 gap-x-4 text-center">
          {[
            { value: 20, suffix: "+", label: "Plants Managed" },
            { value: 150, suffix: "+", label: "Happy Clients" },
            { value: 5000, suffix: "+", label: "kW Serviced" },
            { value: 98, suffix: "%", label: "Uptime Rate" },
            { value: 500, suffix: "+", label: "Technicians" },
            { value: 12, suffix: "+", label: "States" },
          ].map((stat, i) => (
            <div key={i} className="flex flex-col items-center gap-1">
              <div className="text-2xl md:text-3xl font-extrabold text-emerald-400">
                <AnimatedCounter target={stat.value} suffix={stat.suffix} />
              </div>
              <div className="text-xs text-slate-400 uppercase tracking-wider">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* SERVICES — Clean card grid*/}
      <section className="py-24 px-6 bg-linear-to-b from-slate-950 via-black to-slate-900">
        <div className="max-w-7xl mx-auto space-y-24">

          {/* Services */}
          <div>
            <div className="mb-12">
              <p className="text-amber-400 text-xs uppercase tracking-[0.2em] mb-3">What We Do</p>
              <h2 className="text-4xl font-bold text-white tracking-tight">Our Solar Services</h2>
              <p className="text-slate-400 text-base mt-3 max-w-lg">Comprehensive solutions to maximise your solar investment throughout its entire lifecycle.</p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { icon: <MdCleaningServices className="text-2xl" />, accent: "text-emerald-400", border: "hover:border-emerald-500/40", glow: "group-hover:bg-emerald-500/5", title: "Panel Cleaning", desc: "Professional cleaning restoring 15–25% lost efficiency with specialised equipment." },
                { icon: <FaTools className="text-2xl" />, accent: "text-sky-400", border: "hover:border-sky-500/40", glow: "group-hover:bg-sky-500/5", title: "O&M Services", desc: "Full operations & maintenance with preventive care and rapid troubleshooting." },
                { icon: <FaChartLine className="text-2xl" />, accent: "text-amber-400", border: "hover:border-amber-500/40", glow: "group-hover:bg-amber-500/5", title: "Performance Testing", desc: "Thermal imaging, IV curve testing and efficiency analysis before issues escalate." },
                { icon: <FaSolarPanel className="text-2xl" />, accent: "text-violet-400", border: "hover:border-violet-500/40", glow: "group-hover:bg-violet-500/5", title: "System Upgrades", desc: "Inverter upgrades, monitoring tech, and optimisation to extend system life." },
              ].map((s, i) => (
                <div key={i} className={`group bg-slate-900/60 p-6 rounded-2xl border border-slate-700/60 ${s.border} ${s.glow} transition-all duration-300 hover:-translate-y-1`}>
                  <div className={`${s.accent} mb-5 opacity-80 group-hover:opacity-100 transition-opacity`}>{s.icon}</div>
                  <h3 className="text-base font-semibold text-white mb-2">{s.title}</h3>
                  <p className="text-slate-400 text-sm leading-relaxed">{s.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Customer Journey */}
          <div>
            <div className="mb-12">
              <p className="text-sky-400 text-xs uppercase tracking-[0.2em] mb-3">How It Works</p>
              <h2 className="text-4xl font-bold text-white tracking-tight">Your PVProtect Journey</h2>
              <p className="text-slate-400 text-base mt-3 max-w-lg">A transparent, step-by-step process from registration to long-term peak performance.</p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {customerJourney.map((step, i) => (
                <div key={i} className="relative bg-slate-900/60 p-6 rounded-2xl border border-slate-700/60 hover:border-slate-600 transition-all duration-300 hover:-translate-y-1 group">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-xs font-bold text-slate-600 font-mono">{step.step}</span>
                    <div className="h-px flex-1 bg-slate-700 group-hover:bg-slate-600 transition-colors" />
                    <span className="text-xl">{step.icon}</span>
                  </div>
                  <h3 className="text-sm font-semibold text-white mb-2">{step.title}</h3>
                  <p className="text-slate-400 text-xs leading-relaxed">{step.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Quiz */}
          <div className="max-w-3xl mx-auto">
            <div className="mb-10">
              <p className="text-amber-400 text-xs uppercase tracking-[0.2em] mb-3">Quick Quiz</p>
              <h2 className="text-4xl font-bold text-white tracking-tight">Test Your Solar IQ</h2>
            </div>

            <div className="bg-slate-900/70 p-8 rounded-3xl border border-slate-700/60">
              <p className="text-sm text-slate-500 mb-1 uppercase tracking-widest font-mono">Question</p>
              <h3 className="text-xl font-semibold text-white mb-6 leading-snug">{currentQuiz.question}</h3>

              <div className="grid sm:grid-cols-2 gap-3 mb-6">
                {currentQuiz.options.map((option, index) => (
                  <button key={index} onClick={() => handleQuizAnswer(index)} disabled={selectedAnswer !== null}
                    className={`p-4 rounded-xl text-sm font-medium transition-all duration-200 text-left border ${
                      selectedAnswer === null
                        ? "bg-slate-800 border-slate-700 hover:border-slate-500 hover:bg-slate-700/80 text-slate-200"
                        : selectedAnswer === index
                          ? index === currentQuiz.correct
                            ? "bg-emerald-500/15 border-emerald-500/60 text-emerald-300"
                            : "bg-rose-500/15 border-rose-500/60 text-rose-300"
                          : index === currentQuiz.correct
                            ? "bg-emerald-500/15 border-emerald-500/60 text-emerald-300"
                            : "bg-slate-800/50 border-slate-800 text-slate-600"
                    }`}>
                    {option}
                  </button>
                ))}
              </div>

              {selectedAnswer !== null && (
                <div className={`p-5 rounded-2xl border ${quizScore ? "bg-emerald-500/5 border-emerald-500/30" : "bg-sky-500/5 border-sky-500/30"}`}>
                  <p className="font-semibold text-white mb-1">{quizScore ? "🎉 Correct!" : "📚 Good Try!"}</p>
                  <p className="text-slate-400 text-sm mb-4">{currentQuiz.fact}</p>
                  <button onClick={loadNewQuiz}
                    className="text-sm font-semibold text-amber-400 hover:text-amber-300 transition-colors flex items-center gap-2">
                    Next Question <FaArrowRight className="text-xs" />
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Why Us */}
          <div>
            <div className="mb-12">
              <p className="text-violet-400 text-xs uppercase tracking-[0.2em] mb-3">Our Edge</p>
              <h2 className="text-4xl font-bold text-white tracking-tight">Why Choose PVProtect</h2>
            </div>

            <div className="grid lg:grid-cols-2 gap-10">
              <div className="space-y-3">
                {[
                  { icon: "🏆", title: "Certified Experts", desc: "Industry-certified technicians with 10+ years of solar experience across residential and commercial plants." },
                  { icon: "🛡️", title: "Performance Guaranteed", desc: "We back all services with performance guarantees and comprehensive warranties." },
                  { icon: "⚡", title: "Prompt & Efficient", desc: "Emergency response within 24 hours. Scheduled maintenance never delayed." },
                  { icon: "📱", title: "Tech-Driven Platform", desc: "Real-time monitoring, AI-assisted diagnostics, and the only Solar Health Score system in India." },
                  { icon: "🤝", title: "Transparent Reporting", desc: "Every service visit ends with a detailed digital report — no hidden findings, no surprises." },
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-4 bg-slate-900/60 p-4 rounded-xl border border-slate-700/60 hover:border-slate-600 transition-all group">
                    <span className="text-xl mt-0.5 grayscale group-hover:grayscale-0 transition-all">{item.icon}</span>
                    <div>
                      <p className="font-semibold text-slate-100 text-sm">{item.title}</p>
                      <p className="text-slate-400 text-xs mt-0.5 leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-2 gap-3 content-start">
                {[
                  { num: "25+", label: "Yr Panel Life", color: "text-sky-400" },
                  { num: "80%", label: "CO₂ Reduction", color: "text-emerald-400" },
                  { num: "40-70%", label: "Bill Savings", color: "text-amber-400" },
                  { num: "15%", label: "Annual Growth", color: "text-violet-400" },
                  { num: "5-7yr", label: "Payback Period", color: "text-pink-400" },
                  { num: "98%", label: "Uptime Rate", color: "text-orange-400" },
                ].map((stat, i) => (
                  <div key={i} className="bg-slate-900/60 p-5 rounded-2xl border border-slate-700/60 hover:border-slate-500 transition-all hover:-translate-y-0.5 text-center group">
                    <div className={`text-3xl font-bold ${stat.color} mb-1 tracking-tight`}>{stat.num}</div>
                    <p className="text-xs text-slate-400 uppercase tracking-wider">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS*/}
      <section className="py-24 px-6 bg-linear-to-b from-slate-900 to-blue-950 border-y border-slate-800/60">
        <div className="max-w-5xl mx-auto">
          <div className="mb-12">
            <p className="text-amber-400 text-xs uppercase tracking-[0.2em] mb-3">Client Stories</p>
            <h2 className="text-4xl font-bold text-white tracking-tight">What our clients say</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.slice(0, 3).map((t, i) => (
              <div key={i} className={`p-6 rounded-2xl border transition-all duration-300 ${i === testimonialIndex ? "bg-slate-900/70 border-emerald-500/40" : "bg-slate-900/40 border-slate-700/50"}`}>
                <div className="flex gap-0.5 mb-4">
                  {[...Array(t.rating)].map((_, j) => <FaStar key={j} className="text-amber-400 text-xs" />)}
                </div>
                <p className="text-slate-200 text-sm leading-relaxed mb-5 italic">"{t.text}"</p>
                <div>
                  <p className="font-semibold text-white text-sm">{t.name}</p>
                  <p className="text-slate-400 text-xs mt-0.5">{t.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

=      {/* PARTNER CTA                                                           */}
      <section className="py-24 px-6 bg-linear-to-r from-slate-950 via-blue-950 to-slate-950">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-14 items-center">
            <div>
              <p className="text-sky-400 text-xs uppercase tracking-[0.2em] mb-4">For Businesses &amp; EPCs</p>
              <h2 className="text-4xl font-bold text-white tracking-tight mb-4">Partner with<br />PVProtect</h2>
              <p className="text-slate-400 text-base leading-relaxed mb-8">
                Join our growing partner ecosystem and expand your service reach with PVProtect's platform, technician network, and co-branded solutions.
              </p>
              <ul className="space-y-2.5 mb-10">
                {["Revenue-sharing O&M partnership models", "White-label Solar Health Score reports", "Access to 500+ certified technicians pan-India", "Co-marketing and lead-sharing programs", "Priority API access for platform integration"].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-slate-300 text-sm">
                    <FaCheckCircle className="text-emerald-500 shrink-0 text-xs" />
                    {item}
                  </li>
                ))}
              </ul>
              <button onClick={() => navigate("/partner")}
                className="group flex items-center gap-3 bg-white text-zinc-950 font-bold py-3.5 px-7 rounded-xl text-sm transition-all hover:scale-[1.02] shadow-lg">
                <FaHandshake />
                Become a Partner
                <FaArrowRight className="group-hover:translate-x-1 transition-transform text-xs" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {[
                { icon: "🏢", title: "EPC Companies", desc: "Outsource your post-installation O&M while you focus on new projects." },
                { icon: "🔧", title: "Technicians", desc: "Join our certified workforce and get regular quality assignments." },
                { icon: "📦", title: "Distributors", desc: "Bundle PVProtect's plans with your panel and inverter sales." },
                { icon: "🏗️", title: "Developers", desc: "Ensure long-term plant health with structured O&M from Day 1." },
              ].map((card, i) => (
                <div key={i} className="bg-slate-900/60 p-5 rounded-2xl border border-slate-700/60 hover:border-slate-600 transition-all hover:-translate-y-0.5">
                  <div className="text-2xl mb-3">{card.icon}</div>
                  <p className="font-semibold text-white text-sm mb-1">{card.title}</p>
                  <p className="text-slate-400 text-xs leading-relaxed">{card.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FAQ                                                                   */}
      <section className="py-24 px-6 bg-linear-to-b from-slate-950 via-black to-slate-900 border-t border-slate-800/60">
        <div className="max-w-3xl mx-auto">
          <div className="mb-12">
            <p className="text-emerald-400 text-xs uppercase tracking-[0.2em] mb-3">Got Questions?</p>
            <h2 className="text-4xl font-bold text-white tracking-tight">Frequently asked</h2>
          </div>
          <div className="space-y-2">
            {faqItems.map((faq, i) => <FAQItem key={i} {...faq} />)}
          </div>
        </div>
      </section>

      {/* APP DOWNLOAD*/}
      <section className="py-24 px-6 bg-linear-to-b from-slate-900 via-black to-slate-900 border-t border-slate-800/60">
        <div className="max-w-5xl mx-auto text-center">
          <p className="text-emerald-400 text-xs uppercase tracking-[0.2em] mb-4">Mobile App</p>
          <h2 className="text-4xl font-bold text-white tracking-tight mb-4">Monitor on the go</h2>
          <p className="text-slate-400 text-base mb-8 max-w-xl mx-auto">Real-time insights, maintenance updates, and instant fault alerts — all in your pocket.</p>

          <div className="flex items-center justify-center gap-4 flex-wrap mb-12">
            {[{ icon: "📊", label: "Live Dashboard" }, { icon: "🔔", label: "Instant Alerts" }, { icon: "📅", label: "Service Booking" }].map((f, i) => (
              <div key={i} className="flex items-center gap-2 bg-slate-900/50 border border-slate-700/50 rounded-xl px-4 py-2.5 text-xs text-slate-400">
                <span>{f.icon}</span>{f.label}
              </div>
            ))}
          </div>

          <div className="flex items-center justify-center gap-6 flex-wrap">
            {[
              { href: "http://play.google.com/store/apps/details?id=com.umakant3525.PV_PROTECT&hl=en_IN", src: "/PlayStoreDownload.png", label: "Google Play" },
              { href: "https://apps.apple.com/in/app/pvprotech/id6744603579", src: "/AppStoreDownload.png", label: "App Store" },
            ].map((app, i) => (
              <a key={i} href={app.href} target="_blank" rel="noopener noreferrer"
                className="group bg-slate-900/60 border border-slate-700/60 hover:border-slate-500 rounded-2xl px-8 py-5 transition-all duration-200 hover:-translate-y-1 hover:shadow-xl hover:shadow-black/40">
                <img src={app.src} alt={app.label} className="h-10 object-contain" />
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* CONTACT                                                               */}

      <section className="py-24 px-6 bg-linear-to-b from-slate-900 to-blue-950 border-t border-slate-800/60">
        <div className="max-w-5xl mx-auto">
          <div className="mb-12">
            <p className="text-blue-400 text-xs uppercase tracking-[0.2em] mb-3">Reach Out</p>
            <h2 className="text-4xl font-bold text-white tracking-tight">Contact Us</h2>
            <p className="text-slate-400 mt-2">Have a project in mind? We'd love to hear from you.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-12">
            <div className="space-y-3">
              {[
                { icon: "📧", label: "Email", value: "support@pvprotect.in" },
                { icon: "📞", label: "Phone", value: "+91 98765 43210" },
                { icon: "💬", label: "WhatsApp", value: "+91 98765 43210" },
                { icon: "🕐", label: "Support Hours", value: "Mon–Sat, 9 AM – 7 PM IST" },
              ].map((info, i) => (
                <div key={i} className="flex items-center gap-4 bg-slate-900/60 p-4 rounded-xl border border-slate-700/60">
                  <span className="text-lg">{info.icon}</span>
                  <div>
                    <p className="text-[10px] text-slate-500 uppercase tracking-widest">{info.label}</p>
                    <p className="text-slate-200 text-sm font-medium">{info.value}</p>
                  </div>
                </div>
              ))}
              <div className="flex items-start gap-4 bg-slate-900/60 p-4 rounded-xl border border-slate-700/60">
                <FaMapMarkerAlt className="text-rose-400 text-sm mt-1 shrink-0" />
                <div>
                  <p className="text-[10px] text-slate-500 uppercase tracking-widest mb-1">Office</p>
                  <p className="text-slate-200 text-sm font-medium">PVProtect Energy Pvt. Ltd.<br />Pune, Maharashtra 411001, India</p>
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">
              {formSubmitted ? (
                <div className="bg-emerald-500/5 border border-emerald-500/30 rounded-2xl p-10 text-center">
                  <div className="text-3xl mb-3">✅</div>
                  <p className="text-emerald-400 font-semibold">Message sent!</p>
                  <p className="text-slate-400 text-sm mt-1">We'll respond within 24 hours.</p>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-2 gap-3">
                    {["name:Your Name:text", "phone:Phone Number:tel"].map((f) => { const [name, ph, type] = f.split(":"); return (
                      <input key={name} type={type} name={name} value={formData[name]} onChange={handleInputChange} placeholder={ph}
                        required={name === "name"}
                        className="bg-slate-800/60 border border-slate-600/60 focus:border-emerald-500/70 rounded-xl px-4 py-3 text-slate-200 placeholder-slate-500 focus:outline-none transition-colors text-sm" />
                    ); })}
                  </div>
                  {["email:Email Address:email:true", "subject:Subject:text:false"].map((f) => { const [name, ph, type, req] = f.split(":"); return (
                    <input key={name} type={type} name={name} value={formData[name]} onChange={handleInputChange} placeholder={ph}
                      required={req === "true"}
                      className="w-full bg-slate-800/60 border border-slate-600/60 focus:border-emerald-500/70 rounded-xl px-4 py-3 text-slate-200 placeholder-slate-500 focus:outline-none transition-colors text-sm" />
                  ); })}
                  <textarea name="message" value={formData.message} onChange={handleInputChange}
                    placeholder="Tell us about your solar plant — capacity, location, what you need..." rows={4} required
                    className="w-full bg-slate-800/60 border border-slate-600/60 focus:border-emerald-500/70 rounded-xl px-4 py-3 text-slate-200 placeholder-slate-500 focus:outline-none transition-colors text-sm resize-none" />
                  <button type="submit"
                    className="w-full bg-amber-400 hover:bg-amber-300 text-zinc-950 font-bold py-3.5 rounded-xl transition-all hover:scale-[1.01] text-sm">
                    Send Message →
                  </button>
                </>
              )}
            </form>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home1;