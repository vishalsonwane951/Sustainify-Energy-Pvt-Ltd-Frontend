import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  FaSolarPanel,
  FaTools,
  FaChartLine,
  FaCalculator,
  FaUserTie,
  FaWhatsapp,
  FaStar,
  FaChevronDown,
  FaChevronUp,
  FaHandshake,
  FaMapMarkerAlt,
  FaCheckCircle,
  FaArrowRight,
} from "react-icons/fa";
import { MdCleaningServices, MdElectricBolt, MdVerified } from "react-icons/md";
import { HiOutlineLightningBolt } from "react-icons/hi";
// import SolarBenefitCalculator from "../../Components/SolarBenefitCalculator/SolarBenefitCalculator";

//  Animated Counter 
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
            if (current >= target) {
              setCount(target);
              clearInterval(timer);
            } else {
              setCount(Math.floor(current));
            }
          }, duration / steps);
        }
      },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target, duration]);

  return (
    <span ref={ref}>
      {count}
      {suffix}
    </span>
  );
};

// FAQ Item 
const FAQItem = ({ question, answer }) => {
  const [open, setOpen] = useState(false);
  return (
    <div
      className={`border rounded-xl transition-all duration-300 overflow-hidden ${
        open ? "border-emerald-500/60 bg-slate-800/70" : "border-slate-700/50 bg-slate-900/50"
      }`}
    >
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between p-5 text-left gap-4"
      >
        <span className="text-base font-semibold text-slate-100">{question}</span>
        {open ? (
          <FaChevronUp className="text-emerald-400 shrink-0" />
        ) : (
          <FaChevronDown className="text-slate-400 shrink-0" />
        )}
      </button>
      {open && (
        <div className="px-5 pb-5 text-slate-300 text-sm leading-relaxed border-t border-slate-700/50 pt-4">
          {answer}
        </div>
      )}
    </div>
  );
};

// Testimonial Card 
const testimonials = [
  {
    name: "Rajesh Sharma",
    role: "Residential Solar Owner, Pune",
    text: "PVProtect's health score system caught a fault in one of my panels before it caused real damage. Excellent diagnostics and super fast technician dispatch.",
    rating: 5,
  },
  {
    name: "Priya Industries Pvt Ltd",
    role: "Commercial Client, Nashik",
    text: "We've been using PVProtect for O&M of our 200 kW rooftop plant. Their performance reports are transparent and the team is always responsive.",
    rating: 5,
  },
  {
    name: "Anand Solar EPC",
    role: "Business Partner, Mumbai",
    text: "Partnering with PVProtect expanded our service portfolio. Their technician network and platform made scaling our operations seamless.",
    rating: 5,
  },
  {
    name: "Suresh Mehta",
    role: "Agricultural Solar User, Solapur",
    text: "The mobile app is fantastic — I can monitor my 50 kW pumping system from anywhere. Great savings and excellent ongoing support.",
    rating: 5,
  },
];

const Home = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [quizScore, setQuizScore] = useState(null);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [currentQuiz, setCurrentQuiz] = useState(null);
  const [showCalculator, setShowCalculator] = useState(false);
  const [testimonialIndex, setTestimonialIndex] = useState(0);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [formSubmitted, setFormSubmitted] = useState(false);

  const solarQuizzes = [
    {
      question: "How much energy loss can dirty solar panels cause?",
      options: ["5-10%", "15-25%", "30-40%", "50%+"],
      correct: 1,
      fact: "Dirty solar panels can reduce efficiency by 15-25%! Regular cleaning is essential for optimal performance.",
    },
    {
      question: "What is the average lifespan of a quality solar panel?",
      options: ["10-15 years", "15-20 years", "25-30 years", "40-50 years"],
      correct: 2,
      fact: "Quality solar panels last 25-30 years with minimal degradation, making them a long-term investment in clean energy.",
    },
    {
      question: "How often should solar panels be professionally cleaned?",
      options: ["Every month", "2-4 times per year", "Once every 5 years", "Never, rain is enough"],
      correct: 1,
      fact: "Solar panels should be cleaned 2-4 times per year depending on location and environmental conditions.",
    },
    {
      question: "Solar panels generate electricity from:",
      options: ["Heat from the sun", "Light from the sun", "Wind energy", "Both heat and wind"],
      correct: 1,
      fact: "It's light, not heat, that generates electricity. Too much heat can actually reduce solar panel efficiency!",
    },
    {
      question: "What % of CO₂ can a household reduce by using solar?",
      options: ["20-30%", "40-50%", "60-70%", "Up to 80%"],
      correct: 3,
      fact: "An average household can reduce carbon emissions by up to 80% by switching to solar energy.",
    },
  ];

  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * solarQuizzes.length);
    setCurrentQuiz(solarQuizzes[randomIndex]);
  }, []);

  useEffect(() => {
    if (location.state?.showCalculator) {
      setShowCalculator(true);
      window.history.replaceState({}, document.title);
    }
  }, [location]);

  // Auto-rotate testimonials
  useEffect(() => {
    const timer = setInterval(() => {
      setTestimonialIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const handleQuizAnswer = (index) => {
    setSelectedAnswer(index);
    setQuizScore(index === currentQuiz.correct);
  };

  const loadNewQuiz = () => {
    const randomIndex = Math.floor(Math.random() * solarQuizzes.length);
    setCurrentQuiz(solarQuizzes[randomIndex]);
    setSelectedAnswer(null);
    setQuizScore(null);
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormSubmitted(true);
    setTimeout(() => {
      setFormSubmitted(false);
      setFormData({ name: "", email: "", phone: "", subject: "", message: "" });
    }, 3000);
  };

  const handleCalculateSavings = () => {
    const isVerified = localStorage.getItem("isVerified");
    if (isVerified === "true") {
      setShowCalculator(true);
    } else {
      navigate("/user-data", { state: { from: "calculator" } });
    }
  };

  if (!currentQuiz) return null;

  const faqItems = [
    {
      question: "What is PVProtect's Solar Health Score?",
      answer:
        "The Solar Health Score is a proprietary diagnostic metric that evaluates your solar PV system's performance across multiple parameters — panel output, inverter efficiency, soiling levels, and more — giving you a single actionable score out of 100.",
    },
    {
      question: "How often should my solar panels be professionally serviced?",
      answer:
        "We recommend 2-4 service visits per year. In dusty regions like Rajasthan or western Maharashtra, quarterly cleaning significantly prevents the 15-25% efficiency loss caused by soiling.",
    },
    {
      question: "How do I register my solar plant with PVProtect?",
      answer:
        "Click 'Register for Services' on this page, fill in your plant details (capacity, location, installation date), and our team will schedule an initial assessment within 48 hours.",
    },
    {
      question: "Can businesses and EPC companies partner with PVProtect?",
      answer:
        "Absolutely. We offer partner programs for EPC firms, solar distributors, and O&M companies. Click 'Partner With Us' to explore revenue-sharing models and co-branding opportunities.",
    },
    {
      question: "Is the PVProtect mobile app free to use?",
      answer:
        "The basic app is free and includes real-time monitoring and alerts. Advanced analytics, health reports, and priority support are available under our Pro subscription plans.",
    },
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
    <div className="min-h-screen bg-linear-to-b from-blue-900 via-black to-green-900 text-white">
      {/* Calculator Modal  */}
      {showCalculator && (
        <SolarBenefitCalculator onClose={() => setShowCalculator(false)} />
      )}

      {/*  Floating WhatsApp Button  */}
      <a
        href="https://wa.me/919999999999?text=Hi%2C%20I%20want%20to%20know%20more%20about%20PVProtect"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 bg-green-500 hover:bg-green-400 text-white w-14 h-14 rounded-full flex items-center justify-center shadow-2xl shadow-green-500/40 transition-all duration-300 hover:scale-110"
        title="Chat with us on WhatsApp"
      >
        <FaWhatsapp className="text-3xl" />
      </a>

      {/* ══════════════════════════════════════════════════════════════════════ */}
      {/* HERO SECTION                                                          */}
      {/* ══════════════════════════════════════════════════════════════════════ */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden bg-black">
        <img
          src="/Home-bg.jpg"
          alt="Solar Background"
          className="absolute inset-0 w-full h-full object-cover opacity-25"
        />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(100,200,150,0.2)_1px,transparent_1px)] bg-size-[26px_26px]"></div>
        <div className="absolute inset-0 bg-linear-to-b from-black/80 via-black/70 to-black/80"></div>

        <div className="relative z-10 text-center px-6 sm:px-12 max-w-5xl mx-auto">
          {/* Trust Badge */}
          <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/40 rounded-full px-4 py-1.5 text-sm text-emerald-300 mb-6">
            <MdVerified className="text-emerald-400" />
            Trusted by 20+ Solar Plant Owners Across India
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-7xl font-extrabold leading-tight bg-linear-to-r from-yellow-300 via-green-400 to-blue-400 bg-clip-text text-transparent drop-shadow-lg">
            Your Renewable Journey Starts with Choosing Solar Energy!
          </h1>

          <p className="mt-6 text-lg sm:text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto leading-relaxed">
            Complete lifecycle support for your Solar PV system — from installation to maintenance, we ensure peak performance and sustainability.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5 mt-12 max-w-4xl mx-auto">
            {/* Calculate Savings */}
            <button
              onClick={handleCalculateSavings}
              className="group relative overflow-hidden bg-linear-to-r from-violet-500 via-purple-500 to-indigo-600 hover:from-violet-600 hover:via-purple-600 hover:to-indigo-700 text-white font-semibold py-4 px-8 rounded-2xl text-base sm:text-lg shadow-xl hover:shadow-violet-500/50 transition-all duration-300 transform hover:scale-105 active:scale-95"
            >
              <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
              <span className="relative flex items-center justify-center gap-3">
                <FaCalculator className="text-xl" />
                <span className="group-hover:tracking-wide transition-all">Calculate Savings</span>
              </span>
            </button>

            {/* Solar Health Score */}
            <button
              onClick={() => navigate("/user-data")}
              className="group relative overflow-hidden bg-linear-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold py-4 px-8 rounded-2xl text-base sm:text-lg shadow-xl hover:shadow-green-500/50 transition-all duration-300 transform hover:scale-105 active:scale-95"
            >
              <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
              <span className="relative flex items-center justify-center gap-3">
                <FaChartLine className="text-xl" />
                <span className="group-hover:tracking-wide transition-all">Explore Solar Health</span>
              </span>
            </button>

            {/* Register for Services */}
            <button
              onClick={() => navigate("/registration")}
              className="group relative overflow-hidden bg-linear-to-r from-yellow-400 via-orange-400 to-red-500 hover:from-yellow-500 hover:via-orange-500 hover:to-red-600 text-white font-semibold py-4 px-8 rounded-2xl text-base sm:text-lg shadow-xl hover:shadow-orange-500/50 transition-all duration-300 transform hover:scale-105 active:scale-95"
            >
              <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
              <span className="relative flex items-center justify-center gap-3">
                <FaSolarPanel className="text-xl" />
                <span className="group-hover:tracking-wide transition-all">Register for Services</span>
              </span>
            </button>

            {/* Technician Registration */}
            <button
              onClick={() => navigate("/technician-registration")}
              className="group relative overflow-hidden bg-linear-to-r from-cyan-500 via-blue-500 to-indigo-600 hover:from-cyan-600 hover:via-blue-600 hover:to-indigo-700 text-white font-semibold py-4 px-8 rounded-2xl text-base sm:text-lg shadow-xl hover:shadow-blue-500/50 transition-all duration-300 transform hover:scale-105 active:scale-95"
            >
              <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
              <span className="relative flex items-center justify-center gap-3">
                <FaUserTie className="text-xl" />
                <span className="group-hover:tracking-wide transition-all">Register As Technician</span>
              </span>
            </button>
          </div>
        </div>

        {/* Scroll hint */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 opacity-60 animate-bounce">
          <span className="text-xs text-slate-400 tracking-widest uppercase">Scroll</span>
          <FaChevronDown className="text-slate-400 text-sm" />
        </div>
      </section>

      {/* ANIMATED STATS TICKER */}
      <section className="py-10 px-6 bg-linear-to-r from-emerald-950 via-slate-950 to-blue-950 border-y border-slate-800/60">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6 text-center">
            {[
              { value: 20, suffix: "+", label: "Plants Managed" },
              { value: 150, suffix: "+", label: "Happy Clients" },
              { value: 5000, suffix: "+ kW", label: "Capacity Serviced" },
              { value: 98, suffix: "%", label: "Uptime Guaranteed" },
              { value: 500, suffix: "+", label: "Technicians Network" },
              { value: 12, suffix: "+", label: "States Covered" },
            ].map((stat, i) => (
              <div key={i} className="flex flex-col items-center">
                <div className="text-2xl md:text-3xl font-extrabold text-emerald-400">
                  <AnimatedCounter target={stat.value} suffix={stat.suffix} />
                </div>
                <div className="text-xs text-slate-400 mt-1 tracking-wide">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SERVICES + QUIZ + WHY US                                             */}
      <section className="py-20 px-6 bg-linear-to-b from-slate-950 via-black to-slate-900">
        <div className="max-w-7xl mx-auto space-y-20">

          {/*  Our Services */}
          <div>
            <div className="text-center mb-10">
              <p className="text-emerald-400 text-sm uppercase tracking-widest mb-2">What We Do</p>
              <h2 className="text-3xl md:text-4xl font-bold bg-linear-to-r from-yellow-300 to-emerald-400 bg-clip-text text-transparent">
                Our Solar Services
              </h2>
              <p className="text-slate-300 text-base mt-3 max-w-2xl mx-auto">
                Comprehensive solutions to maximize your solar investment throughout its entire lifecycle.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  icon: <MdCleaningServices className="text-3xl text-emerald-400" />,
                  bg: "bg-emerald-500/10",
                  border: "border-emerald-500/30 hover:border-emerald-400",
                  title: "Panel Cleaning",
                  desc: "Professional cleaning restoring 15-25% lost efficiency. Specialized equipment for all panel types.",
                },
                {
                  icon: <FaTools className="text-3xl text-sky-400" />,
                  bg: "bg-sky-500/10",
                  border: "border-sky-500/30 hover:border-sky-400",
                  title: "O&M Services",
                  desc: "Full operations & maintenance with preventive care, system monitoring, and rapid troubleshooting.",
                },
                {
                  icon: <FaChartLine className="text-3xl text-amber-400" />,
                  bg: "bg-amber-500/10",
                  border: "border-amber-500/30 hover:border-amber-400",
                  title: "Performance Testing",
                  desc: "Thermal imaging, IV curve testing and efficiency analysis to catch issues before they impact output.",
                },
                {
                  icon: <FaSolarPanel className="text-3xl text-violet-400" />,
                  bg: "bg-violet-500/10",
                  border: "border-violet-500/30 hover:border-violet-400",
                  title: "System Upgrades",
                  desc: "Inverter upgrades, monitoring tech, and optimization to extend system life and improve ROI.",
                },
              ].map((s, i) => (
                <div key={i} className={`bg-slate-900/60 p-6 rounded-2xl border ${s.border} transition-all hover:scale-105`}>
                  <div className={`${s.bg} w-16 h-16 rounded-full flex items-center justify-center mb-4`}>
                    {s.icon}
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{s.title}</h3>
                  <p className="text-slate-300 text-sm">{s.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/*  Customer Journey   */}
          <div>
            <div className="text-center mb-10">
              <p className="text-blue-400 text-sm uppercase tracking-widest mb-2">How It Works</p>
              <h2 className="text-3xl md:text-4xl font-bold bg-linear-to-r from-blue-300 to-violet-400 bg-clip-text text-transparent">
                Your PVProtect Journey
              </h2>
              <p className="text-slate-300 text-base mt-3 max-w-2xl mx-auto">
                A transparent, step-by-step process from registration to long-term peak performance.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {customerJourney.map((step, i) => (
                <div
                  key={i}
                  className="relative bg-slate-900/60 p-6 rounded-2xl border border-slate-700/60 hover:border-blue-500/50 transition-all hover:scale-105"
                >
                  <div className="absolute -top-3 -left-3 bg-linear-to-br from-blue-500 to-violet-600 text-white text-xs font-bold w-8 h-8 rounded-full flex items-center justify-center shadow-lg">
                    {step.step}
                  </div>
                  <div className="text-3xl mb-3">{step.icon}</div>
                  <h3 className="text-base font-semibold mb-2 text-white">{step.title}</h3>
                  <p className="text-slate-300 text-sm">{step.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/*  Solar Quiz  */}
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <p className="text-yellow-400 text-sm uppercase tracking-widest mb-2">Interactive</p>
              <h2 className="text-3xl md:text-4xl font-bold bg-linear-to-r from-yellow-300 to-emerald-400 bg-clip-text text-transparent">
                Test Your Solar Knowledge
              </h2>
              <p className="text-slate-300 mt-2">Think you know solar? Take our quick quiz!</p>
            </div>

            <div className="bg-slate-900/70 p-8 md:p-10 rounded-2xl border border-slate-700/60">
              <h3 className="text-xl md:text-2xl font-semibold mb-6 text-center">
                {currentQuiz.question}
              </h3>

              <div className="grid md:grid-cols-2 gap-4 mb-6">
                {currentQuiz.options.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => handleQuizAnswer(index)}
                    disabled={selectedAnswer !== null}
                    className={`p-4 rounded-xl text-base font-semibold transition-all ${
                      selectedAnswer === null
                        ? "bg-slate-800/60 hover:bg-slate-700/60 border border-slate-600/80"
                        : selectedAnswer === index
                        ? index === currentQuiz.correct
                          ? "bg-emerald-600 border-2 border-emerald-400"
                          : "bg-rose-600 border-2 border-rose-400"
                        : index === currentQuiz.correct
                        ? "bg-emerald-600 border-2 border-emerald-400"
                        : "bg-slate-700/60 border border-slate-600"
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>

              {selectedAnswer !== null && (
                <div
                  className={`p-6 rounded-xl border ${
                    quizScore
                      ? "bg-emerald-900/40 border-emerald-500/70"
                      : "bg-sky-900/40 border-sky-500/70"
                  }`}
                >
                  <p className="text-xl font-bold mb-2">
                    {quizScore ? "🎉 Correct!" : "📚 Good Try!"}
                  </p>
                  <p className="text-slate-200 mb-4 text-sm">{currentQuiz.fact}</p>
                  <button
                    onClick={loadNewQuiz}
                    className="bg-linear-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-white font-semibold py-2.5 px-6 rounded-xl transition-all hover:scale-105"
                  >
                    Next Question →
                  </button>
                </div>
              )}
            </div>
          </div>

          {/*  Why Choose Us + Facts  */}
          <div>
            <div className="text-center mb-10">
              <p className="text-violet-400 text-sm uppercase tracking-widest mb-2">Our Edge</p>
              <h2 className="text-3xl md:text-4xl font-bold bg-linear-to-r from-blue-400 via-violet-400 to-purple-400 bg-clip-text text-transparent">
                Why Choose PVProtect
              </h2>
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
              <div className="space-y-4">
                {[
                  { icon: "🏆", title: "Certified Experts", desc: "Industry-certified technicians with 10+ years of solar experience across residential and commercial plants." },
                  { icon: "🛡️", title: "Performance Guaranteed", desc: "We back all services with performance guarantees and comprehensive warranties." },
                  { icon: "⚡", title: "Prompt & Efficient", desc: "Emergency response within 24 hours. Scheduled maintenance never delayed." },
                  { icon: "📱", title: "Tech-Driven Platform", desc: "Real-time monitoring, AI-assisted diagnostics, and the only Solar Health Score system in India." },
                  { icon: "🤝", title: "Transparent Reporting", desc: "Every service visit ends with a detailed digital report — no hidden findings, no surprises." },
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-4 bg-slate-900/50 p-4 rounded-xl border border-slate-700/50 hover:border-slate-500 transition-all">
                    <span className="text-2xl mt-0.5">{item.icon}</span>
                    <div>
                      <p className="font-semibold text-white text-sm">{item.title}</p>
                      <p className="text-slate-300 text-sm mt-0.5">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-2 gap-5 content-start">
                {[
                  { num: "25+", label: "Years Lifespan", sub: "Quality panels last 25–30 years with proper O&M.", color: "text-sky-400" },
                  { num: "80%", label: "CO₂ Reduction", sub: "Average household reduces carbon emissions by up to 80%.", color: "text-emerald-400" },
                  { num: "40-70%", label: "Bill Savings", sub: "Typical annual electricity bill reduction with solar.", color: "text-yellow-400" },
                  { num: "15%", label: "Annual Growth", sub: "Solar adoption growing 15% per year across India.", color: "text-violet-400" },
                  { num: "5-7 yrs", label: "Payback Period", sub: "Average time for solar systems to recover installation costs.", color: "text-pink-400" },
                  { num: "98%", label: "Uptime Rate", sub: "Our O&M clients maintain industry-leading plant uptime.", color: "text-orange-400" },
                ].map((stat, i) => (
                  <div key={i} className="bg-slate-900/60 p-5 rounded-2xl border border-slate-700/60 hover:border-slate-400 transition-all hover:scale-105 text-center">
                    <div className={`text-3xl font-bold ${stat.color} mb-1`}>{stat.num}</div>
                    <p className="text-sm font-semibold text-slate-100 mb-1">{stat.label}</p>
                    <p className="text-xs text-slate-400">{stat.sub}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS                            */}
      <section className="py-20 px-6 bg-linear-to-b from-slate-900 to-blue-950">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <p className="text-yellow-400 text-sm uppercase tracking-widest mb-2">Client Stories</p>
            <h2 className="text-3xl md:text-4xl font-bold bg-linear-to-r from-yellow-300 via-green-400 to-blue-400 bg-clip-text text-transparent">
              What Our Clients Say
            </h2>
          </div>

          {/* Featured testimonial */}
          <div className="bg-slate-900/70 rounded-2xl border border-slate-700/60 p-8 md:p-10 mb-6 transition-all">
            <div className="flex gap-1 mb-4">
              {[...Array(testimonials[testimonialIndex].rating)].map((_, i) => (
                <FaStar key={i} className="text-yellow-400 text-sm" />
              ))}
            </div>
            <p className="text-slate-100 text-lg leading-relaxed mb-6 italic">
              "{testimonials[testimonialIndex].text}"
            </p>
            <div>
              <p className="font-semibold text-white">{testimonials[testimonialIndex].name}</p>
              <p className="text-slate-400 text-sm">{testimonials[testimonialIndex].role}</p>
            </div>
          </div>

          {/* Dot nav */}
          <div className="flex justify-center gap-2">
            {testimonials.map((_, i) => (
              <button
                key={i}
                onClick={() => setTestimonialIndex(i)}
                className={`rounded-full transition-all duration-300 ${
                  i === testimonialIndex ? "w-8 h-2.5 bg-emerald-400" : "w-2.5 h-2.5 bg-slate-600 hover:bg-slate-400"
                }`}
              />
            ))}
          </div>

          {/* Mini cards row */}
          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4 mt-8">
            {testimonials.map((t, i) => (
              <button
                key={i}
                onClick={() => setTestimonialIndex(i)}
                className={`p-4 rounded-xl border text-left transition-all ${
                  i === testimonialIndex
                    ? "border-emerald-500/60 bg-emerald-900/20"
                    : "border-slate-700/50 bg-slate-900/40 hover:border-slate-500"
                }`}
              >
                <p className="text-xs font-semibold text-white truncate">{t.name}</p>
                <p className="text-xs text-slate-400 truncate">{t.role}</p>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* BUSINESS PARTNER CTA (inspired by Evolve "Be Our Partner")           */}
      <section className="py-20 px-6 bg-linear-to-r from-slate-950 via-blue-950 to-slate-950 border-y border-slate-800/60">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-10 items-center">
            <div>
              <p className="text-blue-400 text-sm uppercase tracking-widest mb-3">For Businesses & EPCs</p>
              <h2 className="text-3xl md:text-4xl font-bold bg-linear-to-r from-blue-300 to-cyan-400 bg-clip-text text-transparent mb-4">
                Partner With PVProtect
              </h2>
              <p className="text-slate-300 text-base leading-relaxed mb-6">
                Are you an EPC company, solar distributor, or O&M firm? Join our growing partner ecosystem and expand your service reach with PVProtect's platform, technician network, and co-branded solutions.
              </p>
              <ul className="space-y-3 mb-8">
                {[
                  "Revenue-sharing O&M partnership models",
                  "White-label Solar Health Score reports",
                  "Access to 500+ certified technicians pan-India",
                  "Co-marketing and lead-sharing programs",
                  "Priority API access for platform integration",
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-slate-200 text-sm">
                    <FaCheckCircle className="text-emerald-400 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
              <button
                onClick={() => navigate("/partner")}
                className="group flex items-center gap-3 bg-linear-to-r from-blue-500 to-cyan-500 hover:from-blue-400 hover:to-cyan-400 text-white font-semibold py-3.5 px-8 rounded-2xl shadow-xl hover:shadow-blue-500/40 transition-all hover:scale-105"
              >
                <FaHandshake className="text-xl" />
                Become a Partner
                <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {[
                { icon: "🏢", title: "EPC Companies", desc: "Outsource your post-installation O&M to us while you focus on new projects." },
                { icon: "🔧", title: "Solar Technicians", desc: "Join our certified workforce and get regular high-quality work assignments." },
                { icon: "📦", title: "Distributors", desc: "Bundle PVProtect's maintenance plans with your panel/inverter sales." },
                { icon: "🏗️", title: "Developers", desc: "Ensure long-term plant health with structured O&M from Day 1." },
              ].map((card, i) => (
                <div key={i} className="bg-slate-900/60 p-5 rounded-2xl border border-slate-700/60 hover:border-blue-500/50 transition-all hover:scale-105">
                  <div className="text-2xl mb-2">{card.icon}</div>
                  <p className="font-semibold text-white text-sm mb-1">{card.title}</p>
                  <p className="text-slate-400 text-xs">{card.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FAQ SECTION (inspired by Evolve Energy)                              */}
      <section className="py-20 px-6 bg-linear-to-b from-slate-950 via-black to-slate-900">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-10">
            <p className="text-emerald-400 text-sm uppercase tracking-widest mb-2">Got Questions?</p>
            <h2 className="text-3xl md:text-4xl font-bold bg-linear-to-r from-emerald-300 to-blue-400 bg-clip-text text-transparent">
              Frequently Asked Questions
            </h2>
          </div>
          <div className="space-y-3">
            {faqItems.map((faq, i) => (
              <FAQItem key={i} question={faq.question} answer={faq.answer} />
            ))}
          </div>
        </div>
      </section>

      {/* APP DOWNLOAD SECTION                                                  */}
      <section className="py-20 px-6 bg-linear-to-b from-slate-900 via-black to-slate-900 text-white text-center">
        <div className="max-w-5xl mx-auto">
          <p className="text-emerald-400 text-sm uppercase tracking-widest mb-3">Mobile App</p>
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-linear-to-r from-yellow-300 via-green-400 to-blue-400 bg-clip-text text-transparent">
            Get the PVProtect App
          </h2>
          <p className="text-slate-300 text-lg mb-4 max-w-2xl mx-auto leading-relaxed">
            Monitor your solar performance on the go. Real-time insights, maintenance updates, and instant fault alerts — all in your pocket.
          </p>

          {/* App feature highlights */}
          <div className="grid sm:grid-cols-3 gap-4 max-w-3xl mx-auto mb-12">
            {[
              { icon: "📊", label: "Live Performance Dashboard" },
              { icon: "🔔", label: "Instant Fault Alerts" },
              { icon: "📅", label: "Service Booking & History" },
            ].map((f, i) => (
              <div key={i} className="flex items-center gap-2 bg-slate-900/50 border border-slate-700/50 rounded-xl px-4 py-3 text-sm text-slate-200">
                <span className="text-lg">{f.icon}</span>
                {f.label}
              </div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-8">
            <a
              href="http://play.google.com/store/apps/details?id=com.umakant3525.PV_PROTECT&hl=en_IN"
              target="_blank"
              rel="noopener noreferrer"
              className="group relative p-6 hover:p-7 w-full max-w-xs sm:max-w-sm rounded-2xl shadow-xl hover:shadow-2xl hover:shadow-gray-700/50 transition-all duration-400 transform hover:-translate-y-2 hover:scale-105 active:scale-95 bg-linear-to-br from-slate-800/30 to-gray-900/30 backdrop-blur-sm border border-slate-600/40 hover:border-slate-500/60"
            >
              <div className="absolute inset-0 bg-linear-to-r from-slate-400/10 to-gray-400/10 rounded-2xl blur-xl -z-10 opacity-0 group-hover:opacity-100 transition-all duration-500 animate-pulse"></div>
              <div className="relative mx-auto max-w-56">
                <img src="/PlayStoreDownload.png" alt="Get it on Google Play" className="w-full h-16 object-contain drop-shadow-2xl" />
              </div>
              <span className="block text-md mt-4 tracking-wide text-slate-300 group-hover:text-slate-200 font-semibold">Android</span>
            </a>

            <a
              href="https://apps.apple.com/in/app/pvprotech/id6744603579"
              target="_blank"
              rel="noopener noreferrer"
              className="group relative p-6 hover:p-7 w-full max-w-xs sm:max-w-sm rounded-2xl shadow-xl hover:shadow-2xl hover:shadow-gray-800/50 transition-all duration-400 transform hover:-translate-y-2 hover:scale-105 active:scale-95 bg-linear-to-br from-slate-800/30 to-gray-900/30 backdrop-blur-sm border border-slate-600/40 hover:border-slate-500/60"
            >
              <div className="absolute inset-0 bg-linear-to-r from-slate-400/10 to-gray-400/10 rounded-2xl blur-xl -z-10 opacity-0 group-hover:opacity-100 transition-all duration-500 animate-pulse"></div>
              <div className="relative mx-auto max-w-56">
                <img src="/AppStoreDownload.png" alt="Download on the App Store" className="w-full h-16 object-contain drop-shadow-2xl" />
              </div>
              <span className="block text-md mt-4 tracking-wide text-slate-300 group-hover:text-slate-200 font-semibold">iOS</span>
            </a>
          </div>
        </div>
      </section>

      {/* CONTACT FORM */}
      <section className="py-20 px-6 bg-linear-to-b from-slate-900 to-blue-950">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <p className="text-blue-400 text-sm uppercase tracking-widest mb-2">Reach Out</p>
            <h2 className="text-3xl md:text-4xl font-bold bg-linear-to-r from-blue-300 to-emerald-400 bg-clip-text text-transparent">
              Contact Us
            </h2>
            <p className="text-slate-300 mt-2 max-w-xl mx-auto">
              Have a project in mind or want to learn more? We'd love to hear from you.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-10">
            {/* Contact Info */}
            <div className="space-y-6">
              {[
                { icon: "📧", label: "Email", value: "support@pvprotect.in" },
                { icon: "📞", label: "Phone", value: "+91 98765 43210" },
                { icon: "💬", label: "WhatsApp", value: "+91 98765 43210" },
                { icon: "🕐", label: "Support Hours", value: "Mon–Sat, 9 AM – 7 PM IST" },
              ].map((info, i) => (
                <div key={i} className="flex items-center gap-4 bg-slate-900/50 p-4 rounded-xl border border-slate-700/50">
                  <span className="text-2xl">{info.icon}</span>
                  <div>
                    <p className="text-xs text-slate-400 uppercase tracking-wide">{info.label}</p>
                    <p className="text-white font-medium">{info.value}</p>
                  </div>
                </div>
              ))}

              <div className="flex items-start gap-4 bg-slate-900/50 p-4 rounded-xl border border-slate-700/50">
                <FaMapMarkerAlt className="text-red-400 text-xl mt-1 shrink-0" />
                <div>
                  <p className="text-xs text-slate-400 uppercase tracking-wide mb-1">Office</p>
                  <p className="text-white font-medium">PVProtect Energy Pvt. Ltd.<br />Pune, Maharashtra 411001, India</p>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {formSubmitted ? (
                <div className="bg-emerald-900/40 border border-emerald-500/60 rounded-2xl p-8 text-center">
                  <div className="text-4xl mb-3">✅</div>
                  <p className="text-emerald-300 font-semibold text-lg">Message Sent Successfully!</p>
                  <p className="text-slate-300 text-sm mt-1">We'll get back to you within 24 hours.</p>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Your Name"
                      required
                      className="bg-slate-800/60 border border-slate-600/60 rounded-xl px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500/70 transition-colors text-sm"
                    />
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="Phone Number"
                      className="bg-slate-800/60 border border-slate-600/60 rounded-xl px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500/70 transition-colors text-sm"
                    />
                  </div>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="Email Address"
                    required
                    className="w-full bg-slate-800/60 border border-slate-600/60 rounded-xl px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500/70 transition-colors text-sm"
                  />
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    placeholder="Subject"
                    className="w-full bg-slate-800/60 border border-slate-600/60 rounded-xl px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500/70 transition-colors text-sm"
                  />
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    placeholder="Tell us about your solar plant — capacity, location, what you need..."
                    rows={4}
                    required
                    className="w-full bg-slate-800/60 border border-slate-600/60 rounded-xl px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500/70 transition-colors text-sm resize-none"
                  />
                  <button
                    type="submit"
                    className="w-full bg-linear-to-r from-emerald-500 to-green-600 hover:from-emerald-400 hover:to-green-500 text-white font-semibold py-3.5 rounded-xl shadow-xl hover:shadow-emerald-500/30 transition-all hover:scale-105"
                  >
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

export default Home;