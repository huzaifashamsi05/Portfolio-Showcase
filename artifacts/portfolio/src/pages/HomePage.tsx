import { useEffect, useRef, useState, useCallback } from "react";
import { motion, useInView } from "framer-motion";
import { toast } from "sonner";
import {
  useGetBio, useGetSkills, useGetProjects, useGetCertifications,
  useGetSocial, useTrackPageView, useTrackCvDownload, useSubmitContact,
} from "@workspace/api-client-react";
import { useTheme } from "@/hooks/use-theme";
import { Loader } from "@/components/Loader";
import { Cursor } from "@/components/Cursor";
import profileImg from "@assets/image_1777787685666.png";
import certWebdev from "@assets/Certificate_-_front_development_1777787667060.png";
import certNetworking from "@assets/Basic_Networking_certificate__1777787667056.png";

const ROLES = ["Frontend Developer", "Data Science Student", "Freelancer", "Problem Solver"];

const NAV_LINKS = [
  { label: "About", href: "#about" },
  { label: "Education", href: "#education" },
  { label: "Skills", href: "#skills" },
  { label: "Projects", href: "#projects" },
  { label: "Services", href: "#services" },
  { label: "Certifications", href: "#certifications" },
  { label: "Interests", href: "#interests" },
  { label: "Contact", href: "#contact" },
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

function Typewriter() {
  const [roleIdx, setRoleIdx] = useState(0);
  const [charIdx, setCharIdx] = useState(0);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const role = ROLES[roleIdx];
    const delay = deleting ? 50 : 100;
    const timer = setTimeout(() => {
      if (!deleting) {
        if (charIdx < role.length) setCharIdx((c) => c + 1);
        else setTimeout(() => setDeleting(true), 1500);
      } else {
        if (charIdx > 0) setCharIdx((c) => c - 1);
        else {
          setDeleting(false);
          setRoleIdx((r) => (r + 1) % ROLES.length);
        }
      }
    }, delay);
    return () => clearTimeout(timer);
  }, [charIdx, deleting, roleIdx]);

  return (
    <span style={{ color: "#00f5ff", fontFamily: "JetBrains Mono, monospace", fontSize: "1.1rem" }}>
      {ROLES[roleIdx].slice(0, charIdx)}
      <span className="typewriter-cursor" />
    </span>
  );
}

export default function HomePage() {
  const [loaded, setLoaded] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [activeSection, setActiveSection] = useState("hero");
  const [showBackTop, setShowBackTop] = useState(false);
  const [lightboxImg, setLightboxImg] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();

  const { data: bio } = useGetBio();
  const { data: skills } = useGetSkills();
  const { data: projects } = useGetProjects();
  const { data: certifications } = useGetCertifications();
  const { data: social } = useGetSocial();

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

  const handleCvDownload = () => {
    trackCvDownload.mutate();
  };

  const scrollTo = (href: string) => {
    const el = document.getElementById(href.slice(1));
    el?.scrollIntoView({ behavior: "smooth" });
    setMobileMenuOpen(false);
  };

  // Get cert image by title
  const getCertImage = (cert: { imageUrl: string | null; title: string }) => {
    if (cert.title.toLowerCase().includes("networking")) return certNetworking;
    if (cert.title.toLowerCase().includes("html") || cert.title.toLowerCase().includes("css") || cert.title.toLowerCase().includes("javascript") || cert.title.toLowerCase().includes("front")) return certWebdev;
    return cert.imageUrl;
  };

  if (!loaded) return <Loader onComplete={() => setLoaded(true)} />;

  const bg = theme === "dark" ? "#080c18" : "#f0f4ff";
  const fg = theme === "dark" ? "#e2e8f0" : "#1e293b";
  const card = theme === "dark" ? "#0d1426" : "#ffffff";
  const border = theme === "dark" ? "#1e293b" : "#e2e8f0";

  return (
    <div style={{ background: bg, color: fg, minHeight: "100vh" }}>
      <Cursor />

      {/* Scroll progress */}
      <div id="scroll-progress" style={{ width: `${scrollProgress}%` }} />

      {/* Navbar */}
      <nav
        style={{
          position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
          background: theme === "dark" ? "rgba(8,12,24,0.85)" : "rgba(240,244,255,0.85)",
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
          <div className="hidden md:flex items-center gap-6">
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
                {l.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3">
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
                {l.label}
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
          justifyContent: "center", overflow: "hidden", paddingTop: "64px",
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
              &lt;hello world /&gt;
            </p>
            <h1
              className="text-4xl md:text-6xl font-black mb-4 leading-tight"
              style={{ fontFamily: "Orbitron, sans-serif", background: "linear-gradient(135deg, #e2e8f0 0%, #00f5ff 50%, #8b5cf6 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}
            >
              {bio?.name ?? "Muhammad Huzaifa Shamsi"}
            </h1>
            <div className="mb-4 text-lg" style={{ minHeight: "2rem" }}>
              <Typewriter />
            </div>
            <p className="text-sm md:text-base mb-8 leading-relaxed max-w-xl" style={{ color: theme === "dark" ? "#94a3b8" : "#475569" }}>
              {bio?.subtitle ?? "Crafting interactive web experiences while exploring the limitless possibilities of Data Science and Artificial Intelligence."}
            </p>
            <div className="flex flex-wrap gap-3 justify-center md:justify-start">
              <a
                href="/api/cv"
                download
                onClick={handleCvDownload}
                className="px-6 py-3 rounded-lg font-semibold text-sm transition-all duration-300"
                style={{ background: "linear-gradient(135deg, #00f5ff, #0891b2)", color: "#080c18", fontFamily: "Space Grotesk, sans-serif", boxShadow: "0 0 20px #00f5ff44" }}
              >
                Download CV
              </a>
              <button
                onClick={() => scrollTo("#contact")}
                className="px-6 py-3 rounded-lg font-semibold text-sm transition-all duration-300"
                style={{ background: "transparent", border: "1px solid #00f5ff66", color: "#00f5ff", fontFamily: "Space Grotesk, sans-serif", cursor: "pointer" }}
              >
                Contact Me
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
              Available for Freelance
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

      {/* ABOUT */}
      <SectionWrapper id="about">
        <SectionTitle>About Me</SectionTitle>
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
        <SectionTitle>Education</SectionTitle>
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
        <SectionTitle>Skills</SectionTitle>
        {skills && skills.length > 0 ? (
          <div className="grid md:grid-cols-2 gap-6">
            {skills.map((skill, i) => (
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
                    style={{ background: skill.category === "Frontend" ? "linear-gradient(90deg, #00f5ff, #0891b2)" : skill.category === "Programming Languages" ? "linear-gradient(90deg, #8b5cf6, #6d28d9)" : "linear-gradient(90deg, #00f5ff, #8b5cf6)" }}
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
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {[
              { name: "HTML5", category: "Frontend", percentage: 85 },
              { name: "CSS3", category: "Frontend", percentage: 80 },
              { name: "JavaScript", category: "Frontend", percentage: 70 },
              { name: "C Language", category: "Programming Languages", percentage: 75 },
              { name: "C++", category: "Programming Languages", percentage: 70 },
              { name: "Python", category: "Programming Languages", percentage: 65 },
              { name: "Java", category: "Programming Languages", percentage: 60 },
              { name: "Networking Basics", category: "Other", percentage: 70 },
              { name: "Data Science", category: "Other", percentage: 50 },
            ].map((skill, i) => (
              <div key={skill.name} className="p-5 rounded-xl" style={{ background: card, border: `1px solid ${border}` }}>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium">{skill.name}</span>
                  <span className="text-xs" style={{ color: "#00f5ff", fontFamily: "JetBrains Mono, monospace" }}>{skill.percentage}%</span>
                </div>
                <div className="h-2 rounded-full overflow-hidden" style={{ background: theme === "dark" ? "#1e293b" : "#e2e8f0" }}>
                  <div className="h-full rounded-full" style={{ width: `${skill.percentage}%`, background: "linear-gradient(90deg, #00f5ff, #8b5cf6)" }} />
                </div>
                <div className="text-xs mt-1" style={{ color: theme === "dark" ? "#475569" : "#94a3b8" }}>{skill.category}</div>
              </div>
            ))}
          </div>
        )}
      </SectionWrapper>

      {/* PROJECTS */}
      <SectionWrapper id="projects">
        <SectionTitle accent="#8b5cf6">Projects</SectionTitle>
        <div className="grid md:grid-cols-3 gap-6">
          {(projects && projects.length > 0 ? projects : [
            { id: 1, title: "Portfolio Website", description: "Personal portfolio showcasing skills and projects", techUsed: "HTML, CSS, JavaScript, React", status: "live", liveUrl: null, githubUrl: "https://github.com/huzaifashamsi05" },
            { id: 2, title: "Data Analysis Dashboard", description: "Data visualization dashboard with Python and data science tools.", techUsed: "Python, Pandas, Matplotlib", status: "coming_soon", liveUrl: null, githubUrl: null },
            { id: 3, title: "Network Monitor Tool", description: "Basic network monitoring solution for small environments.", techUsed: "C++, Networking", status: "in_progress", liveUrl: null, githubUrl: null },
          ]).map((project, i) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.12, duration: 0.5 }}
              className="rounded-xl overflow-hidden relative"
              style={{ background: card, border: `1px solid ${border}` }}
            >
              {project.status === "coming_soon" && (
                <div className="absolute inset-0 shimmer pointer-events-none z-10" />
              )}
              <div className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="font-bold text-base" style={{ fontFamily: "Space Grotesk, sans-serif" }}>{project.title}</h3>
                  <span
                    className="text-xs px-2 py-0.5 rounded-full ml-2 flex-shrink-0"
                    style={{
                      background: project.status === "live" ? "#22c55e22" : project.status === "in_progress" ? "#f59e0b22" : "#8b5cf622",
                      color: project.status === "live" ? "#22c55e" : project.status === "in_progress" ? "#f59e0b" : "#8b5cf6",
                      border: `1px solid ${project.status === "live" ? "#22c55e44" : project.status === "in_progress" ? "#f59e0b44" : "#8b5cf644"}`,
                      fontFamily: "JetBrains Mono, monospace",
                    }}
                  >
                    {project.status === "coming_soon" ? "Coming Soon" : project.status === "in_progress" ? "In Progress" : "Live"}
                  </span>
                </div>
                <p className="text-sm mb-4" style={{ color: theme === "dark" ? "#94a3b8" : "#475569" }}>{project.description}</p>
                <div className="flex flex-wrap gap-1 mb-4">
                  {project.techUsed.split(",").map((tech) => (
                    <span key={tech} className="text-xs px-2 py-0.5 rounded" style={{ background: "#00f5ff11", color: "#00f5ff", border: "1px solid #00f5ff22", fontFamily: "JetBrains Mono, monospace" }}>
                      {tech.trim()}
                    </span>
                  ))}
                </div>
                <div className="flex gap-3">
                  {project.liveUrl && (
                    <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="text-xs" style={{ color: "#00f5ff" }}>Live</a>
                  )}
                  {project.githubUrl && (
                    <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="text-xs" style={{ color: "#8b5cf6" }}>GitHub</a>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </SectionWrapper>

      {/* SERVICES */}
      <SectionWrapper id="services">
        <SectionTitle>Services</SectionTitle>
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
        <SectionTitle accent="#8b5cf6">Certifications</SectionTitle>
        <div className="grid sm:grid-cols-2 gap-6">
          {(certifications && certifications.length > 0 ? certifications : [
            { id: 1, title: "HTML, CSS & JavaScript Certificate", organization: "LumaByte Pvt Ltd", date: "11 November 2025", imageUrl: null, verifyUrl: null },
            { id: 2, title: "Networking Basics Certificate", organization: "Saylani Welfare International Trust (Cisco Networking Academy)", date: "05 Jan 2026", imageUrl: null, verifyUrl: null },
          ]).map((cert, i) => {
            const certImg = getCertImage(cert as any);
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
                  {certImg && <span className="text-xs" style={{ color: "#00f5ff" }}>Click to view</span>}
                </div>
              </motion.div>
            );
          })}
        </div>
      </SectionWrapper>

      {/* INTERESTS */}
      <SectionWrapper id="interests">
        <SectionTitle>Interests & Hobbies</SectionTitle>
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
        <SectionTitle>Location</SectionTitle>
        <div className="rounded-xl overflow-hidden" style={{ border: `1px solid ${border}` }}>
          <iframe
            title="Karachi Location"
            src="https://www.openstreetmap.org/export/embed.html?bbox=66.9167%2C24.8333%2C67.1667%2C25.1333&layer=mapnik&marker=24.9833%2C67.0667"
            className="map-frame"
            style={{ width: "100%", height: "400px", border: "none" }}
          />
        </div>
        <p className="text-center text-sm mt-3" style={{ color: theme === "dark" ? "#64748b" : "#94a3b8", fontFamily: "JetBrains Mono, monospace" }}>
          Gulshan-e-Maymar, Sector X-3, Karachi, Pakistan
        </p>
      </SectionWrapper>

      {/* CONTACT */}
      <SectionWrapper id="contact">
        <SectionTitle>Contact Me</SectionTitle>
        <div className="max-w-2xl mx-auto">
          <form onSubmit={handleContactSubmit} className="p-8 rounded-2xl" style={{ background: card, border: `1px solid ${border}` }}>
            {/* Honeypot */}
            <input type="text" name="honeypot" value={contactForm.honeypot} onChange={(e) => setContactForm({ ...contactForm, honeypot: e.target.value })} style={{ display: "none" }} tabIndex={-1} autoComplete="off" />

            <div className="grid sm:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="text-xs mb-1 block" style={{ color: "#00f5ff", fontFamily: "JetBrains Mono, monospace" }}>Your Name</label>
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
                <label className="text-xs mb-1 block" style={{ color: "#00f5ff", fontFamily: "JetBrains Mono, monospace" }}>Email Address</label>
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
              <label className="text-xs mb-1 block" style={{ color: "#00f5ff", fontFamily: "JetBrains Mono, monospace" }}>Message</label>
              <textarea
                value={contactForm.message}
                onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                placeholder="Your message here..."
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
              style={{ background: "linear-gradient(135deg, #00f5ff, #8b5cf6)", color: "#080c18", fontFamily: "Space Grotesk, sans-serif", cursor: "pointer", boxShadow: "0 0 20px #00f5ff33", opacity: submitContact.isPending ? 0.7 : 1 }}
            >
              {submitContact.isPending ? "Sending..." : "Send Message"}
            </button>
          </form>
        </div>
      </SectionWrapper>

      {/* FOOTER */}
      <footer style={{ background: theme === "dark" ? "#040710" : "#e8edf8", borderTop: `1px solid ${border}`, padding: "2rem 1.5rem" }}>
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-xl font-bold" style={{ fontFamily: "Orbitron, sans-serif", background: "linear-gradient(135deg, #00f5ff, #8b5cf6)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              MH Shamsi
            </div>

            <div className="flex items-center gap-4">
              {social && [
                { key: "github", href: social.github, icon: "GitHub" },
                { key: "linkedin", href: social.linkedin, icon: "LinkedIn" },
                { key: "twitter", href: social.twitter, icon: "Twitter" },
                { key: "youtube", href: social.youtube, icon: "YouTube" },
                { key: "instagram", href: social.instagram, icon: "Instagram" },
              ].map((s) => (
                <a
                  key={s.key}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs px-3 py-1.5 rounded-md transition-all duration-200"
                  style={{ color: theme === "dark" ? "#64748b" : "#94a3b8", background: theme === "dark" ? "#1e293b" : "#f1f5f9", border: `1px solid ${border}` }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = "#00f5ff"; (e.currentTarget as HTMLAnchorElement).style.borderColor = "#00f5ff44"; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = theme === "dark" ? "#64748b" : "#94a3b8"; (e.currentTarget as HTMLAnchorElement).style.borderColor = border; }}
                >
                  {s.icon}
                </a>
              ))}
            </div>

            <div className="flex items-center gap-4">
              <span className="text-xs" style={{ color: theme === "dark" ? "#475569" : "#94a3b8" }}>
                © 2025 Muhammad Huzaifa Shamsi
              </span>
              <a
                href="/admin"
                className="text-xs opacity-30 hover:opacity-70 transition-opacity"
                style={{ color: theme === "dark" ? "#475569" : "#94a3b8" }}
              >
                Admin
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
