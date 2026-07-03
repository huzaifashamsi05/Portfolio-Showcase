import { useEffect, useRef, useState, useCallback } from "react";
import { motion, useInView } from "framer-motion";
import { toast } from "sonner";
import {
  useGetBio, useGetSkills, useGetProjects, useGetCertifications,
  useGetSocial, useTrackPageView, useTrackCvDownload, useSubmitContact,
  useGetTestimonials,
} from "@workspace/api-client-react";
import { useTheme } from "@/hooks/use-theme";
import { Loader } from "@/components/Loader";
import { Cursor } from "@/components/Cursor";
import profileImg from "@assets/image_1777787685666.png";
import certWebdev from "@assets/Certificate_-_front_development_1777787667060.png";
import certNetworking from "@assets/Basic_Networking_certificate__1777787667056.png";

const ROLES = ["Frontend Developer", "Data Science Student", "Freelancer", "Problem Solver"];

const ROLES_UR = ["فرنٹ اینڈ ڈویلپر", "ڈیٹا سائنس طالب علم", "فری لانسر", "مسائل حل کرنے والا"];

const NAV_LINKS = [
  { label: "About", labelUr: "میرے بارے میں", href: "#about" },
  { label: "Education", labelUr: "تعلیم", href: "#education" },
  { label: "Skills", labelUr: "مہارتیں", href: "#skills" },
  { label: "Projects", labelUr: "منصوبے", href: "#projects" },
  { label: "Services", labelUr: "خدمات", href: "#services" },
  { label: "Certifications", labelUr: "سرٹیفیکیٹس", href: "#certifications" },
  { label: "Contact", labelUr: "رابطہ", href: "#contact" },
];

const SERVICES = [
  { icon: "🖥️", title: "Website Design", desc: "Beautiful, responsive UI/UX crafted for impact" },
  { icon: "⚡", title: "Frontend Development", desc: "HTML, CSS, JavaScript — clean and performant" },
  { icon: "📊", title: "Data Analysis", desc: "Python and data science tools for actionable insights" },
  { icon: "🧩", title: "Problem Solving", desc: "Logical thinking and algorithmic solutions" },
  { icon: "🌐", title: "Networking Solutions", desc: "Basic network setup and configuration" },
  { icon: "💼", title: "Freelance Consulting", desc: "Expert tech advice and guidance" },
];

const HOBBIES = [
  { icon: "🏏", label: "Cricket" },
  { icon: "⚽", label: "Football" },
  { icon: "🏓", label: "Table Tennis" },
  { icon: "🐴", label: "Horse Riding" },
  { icon: "🏊", label: "Swimming" },
  { icon: "🎯", label: "Archery" },
  { icon: "🏐", label: "Volleyball" },
  { icon: "🏀", label: "Basketball" },
];

const EDUCATION = [
  {
    school: "Dawood University of Engineering & Technology",
    degree: "BS Data Science",
    period: "Aug 2025 – 2029",
    note: "1st Year, 2nd Semester",
  },
  {
    school: "Forman College",
    degree: "Intermediate (Pre-engineering)",
    period: "Jul 2023 – Jul 2025",
    note: "",
  },
  {
    school: "St. Paul's English High School",
    degree: "Matriculation — Computer Science",
    period: "Jul 2021 – Jul 2023",
    note: "",
  },
];

const CODING_STATS = [
  { label: "Lines of Code", labelUr: "کوڈ کی لائنیں", value: 10000, suffix: "+", icon: "💻" },
  { label: "Projects Completed", labelUr: "مکمل منصوبے", value: 5, suffix: "+", icon: "🚀" },
  { label: "Cups of Coffee", labelUr: "کافی کے کپ", value: 100, suffix: "+", icon: "☕" },
  { label: "Hours of Coding", labelUr: "کوڈنگ کے گھنٹے", value: 500, suffix: "+", icon: "⏰" },
];

const CATEGORY_COLORS: Record<string, string> = {
  Frontend: "linear-gradient(90deg, #00f5ff, #0891b2)",
  "Programming Languages": "linear-gradient(90deg, #8b5cf6, #6d28d9)",
  Tools: "linear-gradient(90deg, #f59e0b, #d97706)",
  Other: "linear-gradient(90deg, #00f5ff, #8b5cf6)",
};

function SectionWrapper({ id, children, className = "" }: { id: string; children: React.ReactNode; className?: string }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <motion.section
      id={id}
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={`py-20 px-6 md:px-12 max-w-6xl mx-auto ${className}`}
    >
      {children}
    </motion.section>
  );
}

function SectionTitle({ children, accent = "#00f5ff" }: { children: React.ReactNode; accent?: string }) {
  return (
    <div className="mb-14 text-center">
      <h2
        className="text-3xl md:text-4xl font-bold mb-3"
        style={{ fontFamily: "Orbitron, sans-serif", color: accent }}
      >
        {children}
      </h2>
      <div
        className="w-20 h-0.5 mx-auto"
        style={{ background: `linear-gradient(90deg, transparent, ${accent}, transparent)` }}
      />
    </div>
  );
}

function ParticlesCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    const particles: { x: number; y: number; r: number; dx: number; dy: number; color: string }[] = [];

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    for (let i = 0; i < 120; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: Math.random() * 1.5 + 0.3,
        dx: (Math.random() - 0.5) * 0.3,
        dy: (Math.random() - 0.5) * 0.3,
        color: Math.random() > 0.5 ? "#00f5ff" : "#8b5cf6",
      });
    }

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (const p of particles) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = p.color + "88";
        ctx.shadowBlur = 6;
        ctx.shadowColor = p.color;
        ctx.fill();
        p.x += p.dx;
        p.y += p.dy;
        if (p.x < 0 || p.x > canvas.width) p.dx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.dy *= -1;
      }
      animId = requestAnimationFrame(draw);
    };
    draw();
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return <canvas ref={canvasRef} id="particles-canvas" style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }} />;
}

function Typewriter({ isUrdu }: { isUrdu: boolean }) {
  const roles = isUrdu ? ROLES_UR : ROLES;
  const [roleIdx, setRoleIdx] = useState(0);
  const [charIdx, setCharIdx] = useState(0);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    setCharIdx(0);
    setDeleting(false);
    setRoleIdx(0);
  }, [isUrdu]);

  useEffect(() => {
    const role = roles[roleIdx];
    const delay = deleting ? 50 : 100;
    const timer = setTimeout(() => {
      if (!deleting) {
        if (charIdx < role.length) setCharIdx((c) => c + 1);
        else setTimeout(() => setDeleting(true), 1500);
      } else {
        if (charIdx > 0) setCharIdx((c) => c - 1);
        else {
          setDeleting(false);
          setRoleIdx((r) => (r + 1) % roles.length);
        }
      }
    }, delay);
    return () => clearTimeout(timer);
  }, [charIdx, deleting, roleIdx, roles]);

  return (
    <span style={{ color: "#00f5ff", fontFamily: "JetBrains Mono, monospace", fontSize: "1.1rem" }}>
      {roles[roleIdx].slice(0, charIdx)}
      <span className="typewriter-cursor" />
    </span>
  );
}

function AnimatedCounter({ target, suffix }: { target: number; suffix: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (!isInView) return;
    let start = 0;
    const duration = 2000;
    const step = Math.ceil(target / (duration / 16));
    const timer = setInterval(() => {
      start = Math.min(start + step, target);
      setCount(start);
      if (start >= target) clearInterval(timer);
    }, 16);
    return () => clearInterval(timer);
  }, [isInView, target]);

  return (
    <span ref={ref} style={{ fontFamily: "Orbitron, sans-serif", color: "#00f5ff", textShadow: "0 0 20px #00f5ff66" }}>
      {count.toLocaleString()}{suffix}
    </span>
  );
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <span key={star} style={{ color: star <= rating ? "#f59e0b" : "#334155", fontSize: "1rem" }}>★</span>
      ))}
    </div>
  );
}

const PROJECT_CATEGORIES: Record<string, string> = {
  "Portfolio Website": "Web",
  "Data Analysis Dashboard": "Data Science",
  "Network Monitor Tool": "Tool",
};

export default function HomePage() {
  const [loaded, setLoaded] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [activeSection, setActiveSection] = useState("hero");
  const [showBackTop, setShowBackTop] = useState(false);
  const [lightboxImg, setLightboxImg] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [bannerDismissed, setBannerDismissed] = useState(() => localStorage.getItem("banner-dismissed") === "1");
  const [skillFilter, setSkillFilter] = useState("All");
  const [isUrdu, setIsUrdu] = useState(false);
  const { theme, toggleTheme } = useTheme();

  const { data: bio } = useGetBio();
  const { data: skills } = useGetSkills();
  const { data: projects } = useGetProjects();
  const { data: certifications } = useGetCertifications();
  const { data: social } = useGetSocial();
  const { data: testimonials } = useGetTestimonials();

  const trackPageView = useTrackPageView();
  const trackCvDownload = useTrackCvDownload();
  const submitContact = useSubmitContact();

  const [contactForm, setContactForm] = useState({ name: "", email: "", message: "", honeypot: "" });

  useEffect(() => {
    trackPageView.mutate();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      setScrollProgress(docHeight > 0 ? (scrollTop / docHeight) * 100 : 0);
      setShowBackTop(scrollTop > 400);

      const sections = NAV_LINKS.map((l) => l.href.slice(1));
      for (const id of [...sections].reverse()) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top <= 100) {
          setActiveSection(id);
          break;
        }
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (contactForm.honeypot) return;
    if (!contactForm.name || !contactForm.email || !contactForm.message) {
      toast.error("Please fill in all fields.");
      return;
    }
    try {
      await submitContact.mutateAsync({ data: { name: contactForm.name, email: contactForm.email, message: contactForm.message, honeypot: "" } });
      toast.success("Message sent! I'll get back to you soon.");
      setContactForm({ name: "", email: "", message: "", honeypot: "" });
    } catch {
      toast.error("Failed to send. Please try again.");
    }
  };

  const handleCvDownload = useCallback(() => {
    trackCvDownload.mutate();
  }, []);

  const scrollTo = (href: string) => {
    const el = document.getElementById(href.slice(1));
    el?.scrollIntoView({ behavior: "smooth" });
    setMobileMenuOpen(false);
  };

  const dismissBanner = () => {
    setBannerDismissed(true);
    localStorage.setItem("banner-dismissed", "1");
  };

  const getCertImage = (cert: { imageUrl: string | null; title: string }) => {
    if (cert.title.toLowerCase().includes("networking")) return certNetworking;
    if (cert.title.toLowerCase().includes("html") || cert.title.toLowerCase().includes("css") || cert.title.toLowerCase().includes("javascript") || cert.title.toLowerCase().includes("front")) return certWebdev;
    return cert.imageUrl;
  };

  const skillCategories = ["All", ...Array.from(new Set((skills ?? []).map((s) => s.category)))];
  const filteredSkills = skillFilter === "All" ? (skills ?? []) : (skills ?? []).filter((s) => s.category === skillFilter);

  if (!loaded) return <Loader onComplete={() => setLoaded(true)} />;

  const bg = theme === "dark" ? "#080c18" : "#f0f4ff";
  const fg = theme === "dark" ? "#e2e8f0" : "#1e293b";
  const card = theme === "dark" ? "#0d1426" : "#ffffff";
  const border = theme === "dark" ? "#1e293b" : "#e2e8f0";

  const displayTestimonials = testimonials ?? [];

  return (
    <div style={{ background: bg, color: fg, minHeight: "100vh" }} dir={isUrdu ? "rtl" : "ltr"}>
      <Cursor />

      {/* Scroll progress */}
      <div id="scroll-progress" style={{ width: `${scrollProgress}%` }} />

      {/* Availability Banner */}
      {!bannerDismissed && (
        <div
          style={{
            background: "linear-gradient(90deg, #052e16, #064e3b)",
            borderBottom: "1px solid #22c55e44",
            position: "relative",
            zIndex: 200,
          }}
          className="py-2 px-6 flex items-center justify-center gap-3 text-sm"
        >
          <span style={{ fontSize: "0.6rem", color: "#22c55e" }}>●</span>
          <span style={{ color: "#bbf7d0", fontFamily: "Space Grotesk, sans-serif" }}>
            {isUrdu ? "فری لانس کام کے لیے دستیاب ہیں — آج رابطہ کریں!" : "Available for Freelance Work — Let's Connect!"}
          </span>
          <button
            onClick={() => scrollTo("#contact")}
            className="ml-2 px-3 py-0.5 rounded-full text-xs font-semibold transition-all"
            style={{ background: "#22c55e22", color: "#22c55e", border: "1px solid #22c55e44", cursor: "pointer" }}
          >
            {isUrdu ? "ابھی رابطہ کریں" : "Hire Me"}
          </button>
          <button
            onClick={dismissBanner}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-xs"
            style={{ color: "#22c55e66", background: "none", border: "none", cursor: "pointer", fontSize: "1rem" }}
            title="Dismiss"
          >
            ✕
          </button>
        </div>
      )}

      {/* Navbar */}
      <nav
        style={{
          position: "fixed",
          top: bannerDismissed ? 0 : "auto",
          left: 0, right: 0, zIndex: 100,
          background: theme === "dark" ? "rgba(8,12,24,0.9)" : "rgba(240,244,255,0.9)",
          backdropFilter: "blur(12px)",
          borderBottom: `1px solid ${theme === "dark" ? "#1e293b" : "#e2e8f0"}`,
        }}
      >
        <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
          <div
            className="text-xl font-bold cursor-pointer"
            style={{ fontFamily: "Orbitron, sans-serif", background: "linear-gradient(135deg, #00f5ff, #8b5cf6)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          >
            MH Shamsi
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-5">
            {NAV_LINKS.map((l) => (
              <button
                key={l.href}
                onClick={() => scrollTo(l.href)}
                className="text-sm transition-colors duration-200"
                style={{
                  color: activeSection === l.href.slice(1) ? "#00f5ff" : fg,
                  fontFamily: "Space Grotesk, sans-serif",
                  fontWeight: activeSection === l.href.slice(1) ? 600 : 400,
                  textShadow: activeSection === l.href.slice(1) ? "0 0 10px #00f5ff88" : "none",
                  background: "none", border: "none", cursor: "pointer",
                }}
              >
                {isUrdu ? l.labelUr : l.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            {/* Language Switcher */}
            <button
              onClick={() => setIsUrdu(!isUrdu)}
              className="text-xs px-2.5 py-1 rounded-md font-bold transition-all duration-200"
              style={{
                background: isUrdu ? "#8b5cf622" : "#00f5ff22",
                border: isUrdu ? "1px solid #8b5cf644" : "1px solid #00f5ff44",
                color: isUrdu ? "#8b5cf6" : "#00f5ff",
                cursor: "pointer",
                fontFamily: "Space Grotesk, sans-serif",
                minWidth: "2.5rem",
              }}
              title="Toggle English/Urdu"
            >
              {isUrdu ? "EN" : "اردو"}
            </button>

            <button
              onClick={toggleTheme}
              className="w-9 h-9 rounded-lg flex items-center justify-center transition-all duration-200"
              style={{ background: theme === "dark" ? "#1e293b" : "#e2e8f0", border: "1px solid #00f5ff33", color: "#00f5ff", cursor: "pointer" }}
              title="Toggle theme"
            >
              {theme === "dark" ? "☀️" : "🌙"}
            </button>
            <button
              className="md:hidden w-9 h-9 rounded-lg flex items-center justify-center"
              style={{ background: theme === "dark" ? "#1e293b" : "#e2e8f0", border: "1px solid #00f5ff33", color: "#00f5ff", cursor: "pointer" }}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              ☰
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div style={{ background: theme === "dark" ? "#0d1426" : "#fff", borderTop: `1px solid ${border}`, padding: "1rem" }}>
            {NAV_LINKS.map((l) => (
              <button
                key={l.href}
                onClick={() => scrollTo(l.href)}
                className="block w-full text-left py-2 px-4 text-sm rounded transition-colors"
                style={{ color: activeSection === l.href.slice(1) ? "#00f5ff" : fg, background: "none", border: "none", cursor: "pointer", fontFamily: "Space Grotesk, sans-serif" }}
              >
                {isUrdu ? l.labelUr : l.label}
              </button>
            ))}
          </div>
        )}
      </nav>

      {/* HERO */}
      <section
        id="hero"
        style={{
          minHeight: "100vh", position: "relative", display: "flex", alignItems: "center",
          justifyContent: "center", overflow: "hidden",
          paddingTop: bannerDismissed ? "64px" : "104px",
        }}
      >
        <ParticlesCanvas />
        <div
          style={{
            position: "absolute", inset: 0,
            background: theme === "dark"
              ? "radial-gradient(ellipse at 30% 50%, #00f5ff0a 0%, transparent 60%), radial-gradient(ellipse at 70% 50%, #8b5cf60a 0%, transparent 60%)"
              : "radial-gradient(ellipse at 30% 50%, #00f5ff15 0%, transparent 60%), radial-gradient(ellipse at 70% 50%, #8b5cf615 0%, transparent 60%)",
          }}
        />

        <div className="relative z-10 max-w-6xl mx-auto px-6 py-20 flex flex-col md:flex-row items-center gap-16">
          <motion.div
            className="flex-1 text-center md:text-left"
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <p className="text-xs uppercase tracking-widest mb-3" style={{ color: "#00f5ff", fontFamily: "JetBrains Mono, monospace" }}>
              {isUrdu ? "< ہیلو ورلڈ />" : "<hello world />"}
            </p>
            <h1
              className="text-4xl md:text-6xl font-black mb-4 leading-tight"
              style={{ fontFamily: "Orbitron, sans-serif", background: "linear-gradient(135deg, #e2e8f0 0%, #00f5ff 50%, #8b5cf6 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}
            >
              {bio?.name ?? "Muhammad Huzaifa Shamsi"}
            </h1>
            <div className="mb-4 text-lg" style={{ minHeight: "2rem" }}>
              <Typewriter isUrdu={isUrdu} />
            </div>
            <p className="text-sm md:text-base mb-8 leading-relaxed max-w-xl" style={{ color: theme === "dark" ? "#94a3b8" : "#475569" }}>
              {bio?.subtitle ?? "Crafting interactive web experiences while exploring the limitless possibilities of Data Science and Artificial Intelligence."}
            </p>
            <div className="flex flex-wrap gap-3 justify-center md:justify-start">
              <button
                onClick={async () => {
                  try {
                    await trackCvDownloadMutation.mutateAsync();
                  } catch {}
                  if (bio?.cvUrl) {
                    const a = document.createElement("a");
                    a.href = bio.cvUrl;
                    a.download = "CV.pdf";
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                  } else {
                    alert(isUrdu ? "سی وی دستیاب نہیں ہے" : "CV is currently unavailable");
                  }
                }}
                className="px-6 py-3 rounded-lg font-semibold text-sm transition-all duration-300"
                style={{ background: "linear-gradient(135deg, #00f5ff, #0891b2)", color: "#080c18", fontFamily: "Space Grotesk, sans-serif", boxShadow: "0 0 20px #00f5ff44", cursor: "pointer", border: "none" }}
              >
                {isUrdu ? "سی وی دیکھیں" : "View My CV"}
              </button>
              <button
                onClick={() => scrollTo("#contact")}
                className="px-6 py-3 rounded-lg font-semibold text-sm transition-all duration-300"
                style={{ background: "transparent", border: "1px solid #00f5ff66", color: "#00f5ff", fontFamily: "Space Grotesk, sans-serif", cursor: "pointer" }}
              >
                {isUrdu ? "رابطہ کریں" : "Contact Me"}
              </button>
              <a
                href="https://wa.me/923098333185"
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 rounded-lg font-semibold text-sm transition-all duration-300"
                style={{ background: "#25D366", color: "#fff", fontFamily: "Space Grotesk, sans-serif", boxShadow: "0 0 20px #25D36644" }}
              >
                WhatsApp
              </a>
            </div>
          </motion.div>

          <motion.div
            className="relative"
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <div className="w-56 h-56 md:w-72 md:h-72 rounded-full p-1 profile-glow" style={{ background: "linear-gradient(135deg, #00f5ff, #8b5cf6)" }}>
              <div className="w-full h-full rounded-full overflow-hidden">
                <img src={profileImg} alt="Muhammad Huzaifa Shamsi" className="w-full h-full object-cover" />
              </div>
            </div>
            <motion.div
              className="absolute -bottom-2 -right-2 text-xs px-3 py-1 rounded-full"
              style={{ background: "#25D36622", border: "1px solid #25D36666", color: "#25D366", fontFamily: "JetBrains Mono, monospace" }}
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              {isUrdu ? "فری لانس کے لیے دستیاب" : "Available for Freelance"}
            </motion.div>
          </motion.div>
        </div>

        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <div className="w-6 h-10 rounded-full flex items-start justify-center pt-1" style={{ border: "1px solid #00f5ff44" }}>
            <div className="w-1 h-2 rounded-full" style={{ background: "#00f5ff" }} />
          </div>
        </motion.div>
      </section>

      {/* CODING STATS */}
      <div style={{ background: theme === "dark" ? "#060a16" : "#e8edf8", borderTop: `1px solid ${border}`, borderBottom: `1px solid ${border}` }}>
        <div className="max-w-6xl mx-auto px-6 py-12 grid grid-cols-2 md:grid-cols-4 gap-6">
          {CODING_STATS.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className="text-center p-6 rounded-xl"
              style={{ background: card, border: `1px solid ${border}` }}
            >
              <div className="text-2xl mb-2">{stat.icon}</div>
              <div className="text-2xl md:text-3xl font-black mb-1">
                <AnimatedCounter target={stat.value} suffix={stat.suffix} />
              </div>
              <div className="text-xs" style={{ color: theme === "dark" ? "#64748b" : "#94a3b8", fontFamily: "Space Grotesk, sans-serif" }}>
                {isUrdu ? stat.labelUr : stat.label}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* ABOUT */}
      <SectionWrapper id="about">
        <SectionTitle>{isUrdu ? "میرے بارے میں" : "About Me"}</SectionTitle>
        <div className="grid md:grid-cols-2 gap-12 items-start">
          <div>
            <p className="leading-relaxed mb-6" style={{ color: theme === "dark" ? "#94a3b8" : "#475569", lineHeight: 1.8 }}>
              {bio?.about ?? "Hi! I'm Muhammad Huzaifa Shamsi, a passionate Frontend Developer and Data Science enthusiast currently pursuing my degree at Dawood University. I love building beautiful, responsive websites and exploring the world of data."}
            </p>
            <div className="flex flex-wrap gap-3 mb-6">
              {[
                { label: "Location", value: bio?.location ?? "Karachi, Pakistan" },
                { label: "Email", value: bio?.email ?? "huzaifashamsi05@gmail.com" },
                { label: "Phone", value: bio?.phone ?? "+92 309 8333185" },
              ].map((item) => (
                <div key={item.label} className="text-xs px-3 py-1.5 rounded-md" style={{ background: theme === "dark" ? "#1e293b" : "#f1f5f9", border: `1px solid ${border}`, fontFamily: "JetBrains Mono, monospace" }}>
                  <span style={{ color: "#00f5ff" }}>{item.label}:</span>{" "}
                  <span style={{ color: fg }}>{item.value}</span>
                </div>
              ))}
            </div>
            <div className="flex gap-3 flex-wrap">
              {["Urdu (Native)", "English (Working)", "German (Elementary)"].map((lang) => (
                <span key={lang} className="text-xs px-3 py-1 rounded-full" style={{ background: "#8b5cf622", border: "1px solid #8b5cf644", color: "#8b5cf6" }}>
                  {lang}
                </span>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {[
              { num: "3+", label: "Technologies" },
              { num: "1st", label: "Year University" },
              { num: "2", label: "Certifications" },
              { num: "∞", label: "Curiosity" },
            ].map((stat) => (
              <div
                key={stat.label}
                className="p-6 rounded-xl text-center gradient-border"
                style={{ background: card, border: `1px solid ${border}` }}
              >
                <div
                  className="text-3xl font-bold mb-1"
                  style={{ fontFamily: "Orbitron, sans-serif", color: "#00f5ff", textShadow: "0 0 20px #00f5ff66" }}
                >
                  {stat.num}
                </div>
                <div className="text-xs" style={{ color: theme === "dark" ? "#64748b" : "#94a3b8" }}>{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </SectionWrapper>

      {/* EDUCATION */}
      <SectionWrapper id="education" className="relative">
        <SectionTitle>{isUrdu ? "تعلیم" : "Education"}</SectionTitle>
        <div className="relative pl-10">
          <div className="timeline-line" />
          {EDUCATION.map((edu, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15, duration: 0.5 }}
              className="relative mb-10 last:mb-0"
            >
              <div
                className="timeline-dot"
                style={{ top: "1.2rem", background: i === 0 ? "#00f5ff" : "#8b5cf6", boxShadow: `0 0 12px ${i === 0 ? "#00f5ff" : "#8b5cf6"}` }}
              />
              <div
                className="ml-6 p-5 rounded-xl"
                style={{ background: card, border: `1px solid ${border}`, boxShadow: i === 0 ? "0 0 20px #00f5ff0a" : "none" }}
              >
                <div className="text-xs mb-1" style={{ color: "#00f5ff", fontFamily: "JetBrains Mono, monospace" }}>{edu.period}</div>
                <h3 className="font-bold text-base mb-1" style={{ fontFamily: "Space Grotesk, sans-serif" }}>{edu.school}</h3>
                <p className="text-sm" style={{ color: theme === "dark" ? "#94a3b8" : "#475569" }}>{edu.degree}</p>
                {edu.note && <p className="text-xs mt-1" style={{ color: "#8b5cf6" }}>{edu.note}</p>}
              </div>
            </motion.div>
          ))}
        </div>
      </SectionWrapper>

      {/* SKILLS */}
      <SectionWrapper id="skills">
        <SectionTitle>{isUrdu ? "مہارتیں" : "Skills"}</SectionTitle>

        {/* Category Filter */}
        {skills && skills.length > 0 && (
          <div className="flex flex-wrap gap-2 justify-center mb-8">
            {skillCategories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSkillFilter(cat)}
                className="px-4 py-1.5 rounded-full text-xs font-semibold transition-all duration-200"
                style={{
                  background: skillFilter === cat ? "linear-gradient(135deg, #00f5ff, #8b5cf6)" : "transparent",
                  color: skillFilter === cat ? "#080c18" : "#00f5ff",
                  border: skillFilter === cat ? "none" : "1px solid #00f5ff44",
                  cursor: "pointer",
                  fontFamily: "Space Grotesk, sans-serif",
                }}
              >
                {cat}
              </button>
            ))}
          </div>
        )}

        {/* Skills Grid */}
        <div className="grid md:grid-cols-2 gap-6 mb-10">
          {filteredSkills.map((skill, i) => (
            <motion.div
              key={skill.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.07, duration: 0.4 }}
              className="p-5 rounded-xl"
              style={{ background: card, border: `1px solid ${border}` }}
            >
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium" style={{ fontFamily: "Space Grotesk, sans-serif" }}>{skill.name}</span>
                <span className="text-xs" style={{ color: "#00f5ff", fontFamily: "JetBrains Mono, monospace" }}>{skill.percentage}%</span>
              </div>
              <div className="h-2 rounded-full overflow-hidden" style={{ background: theme === "dark" ? "#1e293b" : "#e2e8f0" }}>
                <motion.div
                  className="h-full rounded-full"
                  style={{ background: CATEGORY_COLORS[skill.category] ?? CATEGORY_COLORS.Other }}
                  initial={{ width: 0 }}
                  whileInView={{ width: `${skill.percentage}%` }}
                  viewport={{ once: true }}
                  transition={{ duration: 1.2, ease: "easeOut", delay: i * 0.07 }}
                />
              </div>
              <div className="text-xs mt-1" style={{ color: theme === "dark" ? "#475569" : "#94a3b8" }}>{skill.category}</div>
            </motion.div>
          ))}
        </div>

        {/* GitHub Stats Widget */}
        <div className="p-6 rounded-xl" style={{ background: card, border: `1px solid ${border}` }}>
          <h3 className="text-sm font-bold mb-4 flex items-center gap-2" style={{ color: "#00f5ff", fontFamily: "Orbitron, sans-serif" }}>
            <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
            </svg>
            {isUrdu ? "گٹ ہب اعداد و شمار" : "GitHub Stats"}
          </h3>
          <div className="flex flex-col md:flex-row gap-4 items-start">
            <img
              src="https://github-readme-stats.vercel.app/api?username=huzaifashamsi05&show_icons=true&theme=tokyonight&hide_border=true&bg_color=0d1426&title_color=00f5ff&text_color=94a3b8&icon_color=8b5cf6"
              alt="GitHub Stats"
              className="rounded-lg"
              style={{ maxWidth: "100%", height: "auto" }}
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = "none";
              }}
            />
            <img
              src="https://github-readme-stats.vercel.app/api/top-langs/?username=huzaifashamsi05&layout=compact&theme=tokyonight&hide_border=true&bg_color=0d1426&title_color=00f5ff&text_color=94a3b8"
              alt="Top Languages"
              className="rounded-lg"
              style={{ maxWidth: "100%", height: "auto" }}
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = "none";
              }}
            />
          </div>
          <a
            href="https://github.com/huzaifashamsi05"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-flex items-center gap-2 text-xs px-4 py-2 rounded-lg transition-all duration-200"
            style={{ color: "#00f5ff", border: "1px solid #00f5ff33", background: "#00f5ff11" }}
          >
            <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
            </svg>
            {isUrdu ? "گٹ ہب پروفائل دیکھیں" : "View GitHub Profile"}
          </a>
        </div>
      </SectionWrapper>

      {/* PROJECTS */}
      <SectionWrapper id="projects">
        <SectionTitle accent="#8b5cf6">{isUrdu ? "منصوبے" : "Projects"}</SectionTitle>
        <div className="grid md:grid-cols-3 gap-6">
          {(projects ?? []).map((project, i) => {
            const category = PROJECT_CATEGORIES[project.title] ?? "Web";
            const catColor = category === "Data Science" ? "#8b5cf6" : category === "Tool" ? "#f59e0b" : "#00f5ff";
            return (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.12, duration: 0.5 }}
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
                className="rounded-xl overflow-hidden relative flex flex-col"
                style={{ background: card, border: `1px solid ${border}` }}
                onMouseEnter={(e) => (e.currentTarget.style.boxShadow = "0 0 30px #8b5cf622, 0 0 60px #8b5cf60a")}
                onMouseLeave={(e) => (e.currentTarget.style.boxShadow = "none")}
              >
                {/* Thumbnail area */}
                <div
                  className="h-32 flex items-center justify-center relative overflow-hidden"
                  style={{
                    background: `linear-gradient(135deg, ${catColor}15, ${catColor}05)`,
                    borderBottom: `1px solid ${border}`,
                  }}
                >
                  <div style={{ fontFamily: "Orbitron, sans-serif", color: catColor, opacity: 0.3, fontSize: "3rem", fontWeight: 900 }}>
                    {category === "Data Science" ? "📊" : category === "Tool" ? "🔧" : "🌐"}
                  </div>
                  {/* Status badge */}
                  <span
                    className="absolute top-3 right-3 text-xs px-2 py-0.5 rounded-full"
                    style={{
                      background: project.status === "live" ? "#22c55e22" : project.status === "in_progress" ? "#f59e0b22" : "#8b5cf622",
                      color: project.status === "live" ? "#22c55e" : project.status === "in_progress" ? "#f59e0b" : "#8b5cf6",
                      border: `1px solid ${project.status === "live" ? "#22c55e44" : project.status === "in_progress" ? "#f59e0b44" : "#8b5cf644"}`,
                      fontFamily: "JetBrains Mono, monospace",
                    }}
                  >
                    {project.status === "coming_soon" ? "Coming Soon" : project.status === "in_progress" ? "In Progress" : "● Live"}
                  </span>
                  {/* Category tag */}
                  <span
                    className="absolute top-3 left-3 text-xs px-2 py-0.5 rounded"
                    style={{ background: `${catColor}22`, color: catColor, border: `1px solid ${catColor}44`, fontFamily: "Space Grotesk, sans-serif", fontWeight: 600 }}
                  >
                    {category}
                  </span>
                </div>

                <div className="p-5 flex flex-col flex-1">
                  <h3 className="font-bold text-base mb-2" style={{ fontFamily: "Space Grotesk, sans-serif" }}>{project.title}</h3>
                  <p className="text-sm mb-4 flex-1 whitespace-pre-wrap" style={{ color: theme === "dark" ? "#94a3b8" : "#475569", lineHeight: 1.6 }}>{project.description}</p>
                  <div className="flex flex-wrap gap-1 mb-4">
                    {project.techUsed.split(",").map((tech) => (
                      <span key={tech} className="text-xs px-2 py-0.5 rounded" style={{ background: "#00f5ff11", color: "#00f5ff", border: "1px solid #00f5ff22", fontFamily: "JetBrains Mono, monospace" }}>
                        {tech.trim()}
                      </span>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    {project.githubUrl && (
                      <a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-semibold transition-all duration-200"
                        style={{ background: "#8b5cf622", color: "#8b5cf6", border: "1px solid #8b5cf644" }}
                      >
                        <svg viewBox="0 0 24 24" width="12" height="12" fill="currentColor">
                          <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                        </svg>
                        GitHub
                      </a>
                    )}
                    {project.liveUrl ? (
                      <a
                        href={project.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-semibold transition-all duration-200"
                        style={{ background: "#00f5ff22", color: "#00f5ff", border: "1px solid #00f5ff44" }}
                      >
                        <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14 21 3"/>
                        </svg>
                        Live Demo
                      </a>
                    ) : (
                      !project.githubUrl && (
                        <span className="flex-1 flex items-center justify-center py-2 rounded-lg text-xs" style={{ color: "#334155", border: "1px solid #1e293b" }}>
                          Coming Soon
                        </span>
                      )
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </SectionWrapper>

      {/* TESTIMONIALS */}
      <SectionWrapper id="testimonials">
        <SectionTitle>{isUrdu ? "تاثرات" : "Testimonials"}</SectionTitle>
        <div className="grid md:grid-cols-3 gap-6">
          {displayTestimonials.map((t, i) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.12, duration: 0.5 }}
              className="p-6 rounded-xl relative"
              style={{ background: card, border: `1px solid ${border}` }}
            >
              <div
                className="absolute -top-3 left-6 text-4xl leading-none"
                style={{ color: "#00f5ff44", fontFamily: "Georgia, serif" }}
              >
                "
              </div>
              <div className="mb-3">
                <StarRating rating={t.rating} />
              </div>
              <p className="text-sm mb-5 leading-relaxed whitespace-pre-wrap" style={{ color: theme === "dark" ? "#94a3b8" : "#475569", fontStyle: "italic" }}>
                "{t.quote}"
              </p>
              <div className="flex items-center gap-3 pt-4" style={{ borderTop: `1px solid ${border}` }}>
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0"
                  style={{ background: "linear-gradient(135deg, #00f5ff33, #8b5cf633)", color: "#00f5ff", border: "1px solid #00f5ff44" }}
                >
                  {t.name.charAt(0)}
                </div>
                <div>
                  <div className="font-bold text-sm" style={{ fontFamily: "Space Grotesk, sans-serif" }}>{t.name}</div>
                  <div className="text-xs" style={{ color: "#8b5cf6" }}>{t.role}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </SectionWrapper>

      {/* SERVICES */}
      <SectionWrapper id="services">
        <SectionTitle>{isUrdu ? "خدمات" : "Services"}</SectionTitle>
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
          {SERVICES.map((service, i) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.4 }}
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
              className="p-6 rounded-xl cursor-default"
              style={{ background: card, border: `1px solid ${border}` }}
              onMouseEnter={(e) => (e.currentTarget.style.boxShadow = "0 0 25px #00f5ff22, 0 0 50px #00f5ff0a")}
              onMouseLeave={(e) => (e.currentTarget.style.boxShadow = "none")}
            >
              <div className="text-3xl mb-4">{service.icon}</div>
              <h3 className="font-bold text-base mb-2" style={{ fontFamily: "Space Grotesk, sans-serif", color: "#00f5ff" }}>{service.title}</h3>
              <p className="text-sm" style={{ color: theme === "dark" ? "#94a3b8" : "#475569" }}>{service.desc}</p>
            </motion.div>
          ))}
        </div>
      </SectionWrapper>

      {/* CERTIFICATIONS */}
      <SectionWrapper id="certifications">
        <SectionTitle accent="#8b5cf6">{isUrdu ? "سرٹیفیکیٹس" : "Certifications"}</SectionTitle>
        <div className="grid sm:grid-cols-2 gap-6">
          {(certifications ?? []).map((cert, i) => {
            const certImg = getCertImage(cert as { imageUrl: string | null; title: string });
            return (
              <motion.div
                key={cert.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15, duration: 0.5 }}
                className="p-6 rounded-xl cursor-pointer transition-all duration-300"
                style={{ background: card, border: `1px solid ${border}` }}
                onClick={() => certImg && setLightboxImg(certImg as string)}
                onMouseEnter={(e) => (e.currentTarget.style.boxShadow = "0 0 25px #8b5cf622")}
                onMouseLeave={(e) => (e.currentTarget.style.boxShadow = "none")}
              >
                <div
                  className="w-full h-36 rounded-lg mb-4 overflow-hidden"
                  style={{ background: theme === "dark" ? "#1e293b" : "#f1f5f9", display: "flex", alignItems: "center", justifyContent: "center" }}
                >
                  {certImg ? (
                    <img src={certImg as string} alt={cert.title} className="w-full h-full object-cover" />
                  ) : (
                    <span style={{ color: "#8b5cf6", fontFamily: "Orbitron, sans-serif", fontSize: "2rem" }}>🏆</span>
                  )}
                </div>
                <h3 className="font-bold text-sm mb-1" style={{ fontFamily: "Space Grotesk, sans-serif" }}>{cert.title}</h3>
                <p className="text-xs mb-2" style={{ color: "#8b5cf6" }}>{cert.organization}</p>
                <div className="flex justify-between items-center">
                  <span className="text-xs" style={{ color: theme === "dark" ? "#64748b" : "#94a3b8", fontFamily: "JetBrains Mono, monospace" }}>{cert.date}</span>
                  {certImg && <span className="text-xs" style={{ color: "#00f5ff" }}>Click to view ↗</span>}
                </div>
              </motion.div>
            );
          })}
        </div>
      </SectionWrapper>

      {/* BLOG */}
      <SectionWrapper id="blog">
        <SectionTitle>{isUrdu ? "بلاگ / مضامین" : "Blog / Articles"}</SectionTitle>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="text-center p-16 rounded-2xl relative overflow-hidden"
          style={{ background: card, border: `1px solid ${border}` }}
        >
          <div
            className="absolute inset-0 pointer-events-none"
            style={{ background: "radial-gradient(ellipse at 50% 50%, #00f5ff05 0%, transparent 70%)" }}
          />
          <div className="text-6xl mb-6">✍️</div>
          <h3 className="text-2xl font-bold mb-3" style={{ fontFamily: "Orbitron, sans-serif", color: "#00f5ff" }}>
            {isUrdu ? "جلد آ رہا ہے" : "Coming Soon"}
          </h3>
          <p className="text-sm mb-6" style={{ color: theme === "dark" ? "#64748b" : "#94a3b8", maxWidth: "400px", margin: "0 auto 1.5rem", lineHeight: 1.7 }}>
            {isUrdu
              ? "تکنیکی مضامین، سیکھنے کے تجربات اور ڈویلپمنٹ گائیڈز جلد شائع ہوں گی۔"
              : "Technical articles, learning experiences, and development guides are coming soon. Stay tuned!"}
          </p>
          <div className="flex flex-wrap gap-2 justify-center">
            {["Python", "Web Dev", "Data Science", "Networking"].map((tag) => (
              <span key={tag} className="text-xs px-3 py-1 rounded-full" style={{ background: "#00f5ff11", color: "#00f5ff", border: "1px solid #00f5ff22" }}>
                #{tag.toLowerCase().replace(" ", "-")}
              </span>
            ))}
          </div>
        </motion.div>
      </SectionWrapper>

      {/* CV / RESUME */}
      <SectionWrapper id="cv">
        <SectionTitle>{isUrdu ? "ریزومے / سی وی" : "Resume / CV"}</SectionTitle>
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="rounded-2xl overflow-hidden"
            style={{ border: `1px solid ${border}` }}
          >
            {/* CV Preview Header */}
            <div
              className="p-8 relative"
              style={{ background: "linear-gradient(135deg, #00f5ff0a, #8b5cf60a)", borderBottom: `1px solid ${border}` }}
            >
              <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
                <div className="w-16 h-16 rounded-full overflow-hidden flex-shrink-0" style={{ border: "2px solid #00f5ff44" }}>
                  <img src={profileImg} alt="CV" className="w-full h-full object-cover" />
                </div>
                <div className="text-center md:text-left">
                  <h3 className="text-xl font-black mb-1" style={{ fontFamily: "Orbitron, sans-serif", background: "linear-gradient(135deg, #00f5ff, #8b5cf6)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                    Muhammad Huzaifa Shamsi
                  </h3>
                  <p className="text-sm mb-1" style={{ color: "#00f5ff" }}>Frontend Developer & Data Science Student</p>
                  <p className="text-xs" style={{ color: theme === "dark" ? "#64748b" : "#94a3b8" }}>
                    Karachi, Pakistan · huzaifashamsi05@gmail.com · +92 309 8333185
                  </p>
                </div>
              </div>
            </div>

            {/* CV Summary sections */}
            <div className="p-6 grid md:grid-cols-3 gap-4" style={{ background: card }}>
              {[
                { title: "Education", icon: "🎓", items: ["BS Data Science — Dawood University", "Intermediate — Forman College", "Matric (CS) — St. Paul's"] },
                { title: "Key Skills", icon: "⚡", items: ["HTML, CSS, JavaScript", "Python, C, C++, Java", "Data Science Basics"] },
                { title: "Certifications", icon: "🏆", items: ["HTML/CSS/JS — LumaByte", "Networking — Cisco/Saylani"] },
              ].map((section) => (
                <div key={section.title}>
                  <h4 className="text-xs font-bold mb-2 flex items-center gap-1.5" style={{ color: "#00f5ff", fontFamily: "Space Grotesk, sans-serif" }}>
                    <span>{section.icon}</span>{section.title}
                  </h4>
                  <ul className="space-y-1">
                    {section.items.map((item) => (
                      <li key={item} className="text-xs" style={{ color: theme === "dark" ? "#64748b" : "#94a3b8" }}>• {item}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            {/* Download actions */}
            <div className="px-6 pb-6 flex flex-wrap gap-3 items-center" style={{ background: card }}>
              <a
                href="/api/cv"
                download="Muhammad_Huzaifa_Shamsi_CV.pdf"
                onClick={handleCvDownload}
                className="flex items-center gap-2 px-5 py-2.5 rounded-lg font-semibold text-sm transition-all duration-300"
                style={{ background: "linear-gradient(135deg, #00f5ff, #8b5cf6)", color: "#080c18", fontFamily: "Space Grotesk, sans-serif", boxShadow: "0 0 20px #00f5ff33" }}
              >
                <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"/>
                </svg>
                {isUrdu ? "سی وی ڈاؤن لوڈ کریں" : "Download CV (PDF)"}
              </a>
              <span className="text-xs" style={{ color: theme === "dark" ? "#475569" : "#94a3b8", fontFamily: "JetBrains Mono, monospace" }}>
                Last updated: January 2026
              </span>
            </div>
          </motion.div>
        </div>
      </SectionWrapper>

      {/* INTERESTS */}
      <SectionWrapper id="interests">
        <SectionTitle>{isUrdu ? "دلچسپیاں اور مشاغل" : "Interests & Hobbies"}</SectionTitle>
        <div className="grid grid-cols-4 md:grid-cols-8 gap-4">
          {HOBBIES.map((hobby, i) => (
            <motion.div
              key={hobby.label}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.07, duration: 0.4 }}
              whileHover={{ scale: 1.1, transition: { duration: 0.2 } }}
              className="flex flex-col items-center gap-2 p-4 rounded-xl cursor-default"
              style={{ background: card, border: `1px solid ${border}` }}
              onMouseEnter={(e) => (e.currentTarget.style.boxShadow = "0 0 20px #00f5ff22")}
              onMouseLeave={(e) => (e.currentTarget.style.boxShadow = "none")}
            >
              <span className="text-2xl">{hobby.icon}</span>
              <span className="text-xs text-center" style={{ color: theme === "dark" ? "#94a3b8" : "#475569", fontFamily: "Space Grotesk, sans-serif" }}>{hobby.label}</span>
            </motion.div>
          ))}
        </div>
      </SectionWrapper>

      {/* MAP */}
      <SectionWrapper id="map">
        <SectionTitle>{isUrdu ? "مقام" : "Location"}</SectionTitle>
        <div className="rounded-xl overflow-hidden" style={{ border: `1px solid ${border}`, width: "100%", height: "400px" }}>
          <iframe
            title="Karachi Location"
            src="https://www.openstreetmap.org/export/embed.html?bbox=66.9167%2C24.8333%2C67.1667%2C25.1333&layer=mapnik&marker=24.9833%2C67.0667"
            style={{ width: "100%", height: "100%", border: "none", display: "block" }}
            loading="lazy"
          />
        </div>
        <p className="text-center text-sm mt-3" style={{ color: theme === "dark" ? "#64748b" : "#94a3b8", fontFamily: "JetBrains Mono, monospace" }}>
          📍 Gulshan-e-Maymar, Sector X-3, Karachi, Pakistan
        </p>
      </SectionWrapper>

      {/* CONTACT */}
      <SectionWrapper id="contact">
        <SectionTitle>{isUrdu ? "رابطہ کریں" : "Contact Me"}</SectionTitle>
        <div className="max-w-2xl mx-auto">
          <form onSubmit={handleContactSubmit} className="p-8 rounded-2xl" style={{ background: card, border: `1px solid ${border}` }}>
            <input type="text" name="honeypot" value={contactForm.honeypot} onChange={(e) => setContactForm({ ...contactForm, honeypot: e.target.value })} style={{ display: "none" }} tabIndex={-1} autoComplete="off" />

            <div className="grid sm:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="text-xs mb-1 block" style={{ color: "#00f5ff", fontFamily: "JetBrains Mono, monospace" }}>
                  {isUrdu ? "آپ کا نام" : "Your Name"}
                </label>
                <input
                  type="text"
                  value={contactForm.name}
                  onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                  placeholder="John Doe"
                  className="w-full px-4 py-3 rounded-lg text-sm outline-none transition-all duration-200"
                  style={{ background: theme === "dark" ? "#1e293b" : "#f8fafc", border: `1px solid ${border}`, color: fg, fontFamily: "Space Grotesk, sans-serif" }}
                  onFocus={(e) => (e.target.style.borderColor = "#00f5ff66")}
                  onBlur={(e) => (e.target.style.borderColor = border)}
                />
              </div>
              <div>
                <label className="text-xs mb-1 block" style={{ color: "#00f5ff", fontFamily: "JetBrains Mono, monospace" }}>
                  {isUrdu ? "ای میل" : "Email Address"}
                </label>
                <input
                  type="email"
                  value={contactForm.email}
                  onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                  placeholder="john@example.com"
                  className="w-full px-4 py-3 rounded-lg text-sm outline-none transition-all duration-200"
                  style={{ background: theme === "dark" ? "#1e293b" : "#f8fafc", border: `1px solid ${border}`, color: fg, fontFamily: "Space Grotesk, sans-serif" }}
                  onFocus={(e) => (e.target.style.borderColor = "#00f5ff66")}
                  onBlur={(e) => (e.target.style.borderColor = border)}
                />
              </div>
            </div>
            <div className="mb-6">
              <label className="text-xs mb-1 block" style={{ color: "#00f5ff", fontFamily: "JetBrains Mono, monospace" }}>
                {isUrdu ? "پیغام" : "Message"}
              </label>
              <textarea
                value={contactForm.message}
                onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                placeholder={isUrdu ? "اپنا پیغام یہاں لکھیں..." : "Your message here..."}
                rows={5}
                className="w-full px-4 py-3 rounded-lg text-sm outline-none transition-all duration-200 resize-none"
                style={{ background: theme === "dark" ? "#1e293b" : "#f8fafc", border: `1px solid ${border}`, color: fg, fontFamily: "Space Grotesk, sans-serif" }}
                onFocus={(e) => (e.target.style.borderColor = "#00f5ff66")}
                onBlur={(e) => (e.target.style.borderColor = border)}
              />
            </div>
            <button
              type="submit"
              disabled={submitContact.isPending}
              className="w-full py-3 rounded-lg font-bold text-sm transition-all duration-300"
              style={{ background: "linear-gradient(135deg, #00f5ff, #8b5cf6)", color: "#080c18", fontFamily: "Space Grotesk, sans-serif", cursor: "pointer", boxShadow: "0 0 20px #00f5ff33", opacity: submitContact.isPending ? 0.7 : 1, border: "none" }}
            >
              {submitContact.isPending ? (isUrdu ? "بھیجا جا رہا ہے..." : "Sending...") : (isUrdu ? "پیغام بھیجیں" : "Send Message")}
            </button>
          </form>
        </div>
      </SectionWrapper>

      {/* FOOTER */}
      <footer style={{ background: theme === "dark" ? "#040710" : "#e8edf8", borderTop: `1px solid ${border}` }}>
        <div className="max-w-6xl mx-auto px-6 py-12">
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            {/* Brand */}
            <div>
              <div className="text-2xl font-bold mb-3" style={{ fontFamily: "Orbitron, sans-serif", background: "linear-gradient(135deg, #00f5ff, #8b5cf6)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                MH Shamsi
              </div>
              <p className="text-xs leading-relaxed mb-4" style={{ color: theme === "dark" ? "#475569" : "#94a3b8" }}>
                Frontend Developer & Data Science Student based in Karachi, Pakistan. Building the future one line of code at a time.
              </p>
              <div className="flex gap-2 flex-wrap">
                {social && [
                  { href: social.github, label: "GitHub" },
                  { href: social.linkedin, label: "LinkedIn" },
                  { href: social.twitter, label: "Twitter" },
                  { href: social.youtube, label: "YouTube" },
                  { href: social.instagram, label: "Instagram" },
                ].map((s) => (
                  <a
                    key={s.label}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs px-2.5 py-1 rounded-md transition-all duration-200"
                    style={{ color: theme === "dark" ? "#64748b" : "#94a3b8", background: theme === "dark" ? "#1e293b" : "#f1f5f9", border: `1px solid ${border}` }}
                    onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = "#00f5ff"; (e.currentTarget as HTMLAnchorElement).style.borderColor = "#00f5ff44"; }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = theme === "dark" ? "#64748b" : "#94a3b8"; (e.currentTarget as HTMLAnchorElement).style.borderColor = border; }}
                  >
                    {s.label}
                  </a>
                ))}
              </div>
            </div>

            {/* Sitemap */}
            <div>
              <h4 className="text-xs font-bold mb-3 uppercase tracking-widest" style={{ color: "#00f5ff", fontFamily: "Space Grotesk, sans-serif" }}>Sitemap</h4>
              <div className="grid grid-cols-2 gap-1">
                {NAV_LINKS.map((l) => (
                  <button
                    key={l.href}
                    onClick={() => scrollTo(l.href)}
                    className="text-left text-xs py-1 transition-colors duration-200"
                    style={{ color: theme === "dark" ? "#475569" : "#94a3b8", background: "none", border: "none", cursor: "pointer", fontFamily: "Space Grotesk, sans-serif" }}
                    onMouseEnter={(e) => ((e.target as HTMLButtonElement).style.color = "#00f5ff")}
                    onMouseLeave={(e) => ((e.target as HTMLButtonElement).style.color = theme === "dark" ? "#475569" : "#94a3b8")}
                  >
                    → {l.label}
                  </button>
                ))}
                <button
                  onClick={() => scrollTo("#testimonials")}
                  className="text-left text-xs py-1 transition-colors duration-200"
                  style={{ color: theme === "dark" ? "#475569" : "#94a3b8", background: "none", border: "none", cursor: "pointer", fontFamily: "Space Grotesk, sans-serif" }}
                  onMouseEnter={(e) => ((e.target as HTMLButtonElement).style.color = "#00f5ff")}
                  onMouseLeave={(e) => ((e.target as HTMLButtonElement).style.color = theme === "dark" ? "#475569" : "#94a3b8")}
                >
                  → Testimonials
                </button>
                <button
                  onClick={() => scrollTo("#cv")}
                  className="text-left text-xs py-1 transition-colors duration-200"
                  style={{ color: theme === "dark" ? "#475569" : "#94a3b8", background: "none", border: "none", cursor: "pointer", fontFamily: "Space Grotesk, sans-serif" }}
                  onMouseEnter={(e) => ((e.target as HTMLButtonElement).style.color = "#00f5ff")}
                  onMouseLeave={(e) => ((e.target as HTMLButtonElement).style.color = theme === "dark" ? "#475569" : "#94a3b8")}
                >
                  → CV / Resume
                </button>
              </div>
            </div>

            {/* Contact Info */}
            <div>
              <h4 className="text-xs font-bold mb-3 uppercase tracking-widest" style={{ color: "#00f5ff", fontFamily: "Space Grotesk, sans-serif" }}>Get In Touch</h4>
              <div className="space-y-2 text-xs" style={{ color: theme === "dark" ? "#475569" : "#94a3b8" }}>
                <p>📧 huzaifashamsi05@gmail.com</p>
                <p>📱 +92 309 8333185</p>
                <p>📍 Karachi, Pakistan</p>
                <a
                  href="https://wa.me/923098333185"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 mt-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all"
                  style={{ background: "#25D36622", color: "#25D366", border: "1px solid #25D36644" }}
                >
                  💬 Chat on WhatsApp
                </a>
              </div>
            </div>
          </div>

          <div className="pt-6 flex flex-col md:flex-row items-center justify-between gap-3" style={{ borderTop: `1px solid ${border}` }}>
            <p className="text-xs" style={{ color: theme === "dark" ? "#334155" : "#cbd5e1", fontFamily: "Space Grotesk, sans-serif" }}>
              Made with ❤️ by Huzaifa Shamsi · © {new Date().getFullYear()} All rights reserved
            </p>
            <div className="flex items-center gap-4">
              <span className="text-xs" style={{ color: theme === "dark" ? "#1e293b" : "#e2e8f0", fontFamily: "JetBrains Mono, monospace" }}>
                Built with React + TypeScript
              </span>
              <a
                href="/admin"
                className="text-xs opacity-20 hover:opacity-60 transition-opacity duration-300"
                style={{ color: theme === "dark" ? "#334155" : "#94a3b8" }}
              >
                ⚙
              </a>
            </div>
          </div>
        </div>
      </footer>

      {/* Floating WhatsApp */}
      <a href="https://wa.me/923098333185" target="_blank" rel="noopener noreferrer" className="whatsapp-btn" title="Chat on WhatsApp">
        <svg viewBox="0 0 24 24" fill="white" width="24" height="24">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
        </svg>
      </a>

      {/* Back to Top */}
      {showBackTop && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          className="back-to-top"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          title="Back to top"
        >
          ↑
        </motion.button>
      )}

      {/* Lightbox */}
      {lightboxImg && (
        <div className="lightbox-overlay" onClick={() => setLightboxImg(null)}>
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-3xl w-full"
          >
            <img src={lightboxImg} alt="Certificate" className="w-full rounded-xl" />
            <button
              onClick={() => setLightboxImg(null)}
              className="absolute -top-4 -right-4 w-8 h-8 rounded-full flex items-center justify-center"
              style={{ background: "#1e293b", border: "1px solid #00f5ff44", color: "#00f5ff", cursor: "pointer" }}
            >
              ✕
            </button>
          </motion.div>
        </div>
      )}
    </div>
  );
}
