import React, { useEffect, useState, useRef, useCallback } from "react";
import { Link } from "react-router-dom";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import {
  FiZap, FiShield, FiGlobe, FiMessageCircle, FiStar,
  FiArrowRight, FiCheck, FiUsers, FiActivity, FiClock
} from "react-icons/fi";

/* ===== TYPING WORDS ===== */
const words = ["Chat.", "Connect.", "Collaborate.", "Thrive."];

/* ===== FLOATING PARTICLE ===== */
const Particle = ({ style }) => (
  <motion.div
    className="absolute rounded-full pointer-events-none"
    style={style}
    animate={{ y: [0, -120, 0], opacity: [0, 0.7, 0], scale: [0.5, 1, 0.5] }}
    transition={{
      duration: style.duration,
      repeat: Infinity,
      delay: style.delay,
      ease: "easeInOut"
    }}
  />
);

/* ===== ANIMATED COUNTER ===== */
const Counter = ({ target, suffix = "", duration = 2 }) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting && !started) setStarted(true); },
      { threshold: 0.5 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [started]);

  useEffect(() => {
    if (!started) return;
    const steps = 60;
    const increment = target / steps;
    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= target) { setCount(target); clearInterval(timer); }
      else setCount(Math.floor(current));
    }, (duration * 1000) / steps);
    return () => clearInterval(timer);
  }, [started, target, duration]);

  return <span ref={ref}>{count.toLocaleString()}{suffix}</span>;
};

/* ===== FEATURE CARD ===== */
const FeatureCard = ({ icon: Icon, title, desc, color, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 40 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5, delay, type: "spring", stiffness: 100 }}
    whileHover={{ y: -10, scale: 1.02 }}
    className="feature-card glass-card rounded-3xl p-8 cursor-default group"
  >
    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 shadow-lg transition-all duration-300 group-hover:scale-110 group-hover:rotate-6`}
      style={{ background: `linear-gradient(135deg, ${color}33, ${color}66)`, border: `1px solid ${color}44` }}>
      <Icon size={26} style={{ color }} />
    </div>
    <h3 className="text-xl font-bold mb-3 text-white">{title}</h3>
    <p className="text-white/50 leading-relaxed text-sm">{desc}</p>
    <div className="mt-6 flex items-center gap-2 text-sm font-semibold opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0"
      style={{ color }}>
      Learn more <FiArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
    </div>
  </motion.div>
);

/* ===== TESTIMONIAL CARD ===== */
const TestimonialCard = ({ name, role, text, avatar, delay }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.9 }}
    whileInView={{ opacity: 1, scale: 1 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5, delay }}
    whileHover={{ y: -6 }}
    className="glass-card rounded-3xl p-7 flex flex-col gap-4"
  >
    <div className="flex gap-1">
      {[...Array(5)].map((_, i) => (
        <FiStar key={i} size={14} className="text-yellow-400 fill-yellow-400" />
      ))}
    </div>
    <p className="text-white/70 text-sm leading-relaxed italic">"{text}"</p>
    <div className="flex items-center gap-3 mt-2">
      <img src={avatar} alt={name} className="w-10 h-10 rounded-full object-cover border-2 border-white/10" />
      <div>
        <p className="text-white font-bold text-sm">{name}</p>
        <p className="text-white/40 text-xs">{role}</p>
      </div>
    </div>
  </motion.div>
);

const Home = () => {
  const [text, setText] = useState("");
  const [wordIndex, setWordIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [reverse, setReverse] = useState(false);
  const { scrollY } = useScroll();
  const heroY = useTransform(scrollY, [0, 500], [0, -80]);
  const heroOpacity = useTransform(scrollY, [0, 400], [1, 0.3]);

  /* ===== PARTICLE DATA ===== */
  const particles = Array.from({ length: 20 }, (_, i) => ({
    width: Math.random() * 6 + 2,
    height: Math.random() * 6 + 2,
    left: `${Math.random() * 100}%`,
    bottom: `${Math.random() * 30}%`,
    background: i % 3 === 0 ? "var(--color-primary)" : i % 3 === 1 ? "var(--color-secondary)" : "var(--color-accent)",
    duration: Math.random() * 6 + 4,
    delay: Math.random() * 5,
    opacity: 0,
  }));

  /* ===== TYPING ANIMATION ===== */
  useEffect(() => {
    const word = words[wordIndex];
    if (!reverse && charIndex === word.length + 1) {
      setTimeout(() => setReverse(true), 1200);
      return;
    }
    if (reverse && charIndex === 0) {
      setReverse(false);
      setWordIndex((p) => (p + 1) % words.length);
      return;
    }
    const t = setTimeout(() => setCharIndex((p) => p + (reverse ? -1 : 1)), reverse ? 40 : 80);
    return () => clearTimeout(t);
  }, [charIndex, wordIndex, reverse]);

  useEffect(() => setText(words[wordIndex].substring(0, charIndex)), [charIndex, wordIndex]);

  const features = [
    { icon: FiZap, title: "Real-Time Messaging", desc: "Lightning-fast message delivery powered by WebSockets. Feel the speed of instant communication.", color: "#f59e0b", delay: 0 },
    { icon: FiShield, title: "End-to-End Encrypted", desc: "Your conversations are private, always. Military-grade encryption keeps every message secure.", color: "#6366f1", delay: 0.1 },
    { icon: FiGlobe, title: "Global Reach", desc: "Connect with anyone, anywhere in the world. No borders, no limits — just conversations.", color: "#10b981", delay: 0.2 },
    { icon: FiMessageCircle, title: "AI-Powered Chat", desc: "Our smart AI assistant is ready to help 24/7. Ask anything, get intelligent answers instantly.", color: "#ec4899", delay: 0.3 },
    { icon: FiUsers, title: "Rich Profiles", desc: "Express yourself with beautiful custom avatars, bios, and personalized profile themes.", color: "#f97316", delay: 0.4 },
    { icon: FiActivity, title: "Live Status", desc: "See who's online, typing, and active in real-time with sleek animated presence indicators.", color: "#06b6d4", delay: 0.5 },
  ];

  const stats = [
    { value: 50000, suffix: "+", label: "Active Users", icon: FiUsers },
    { value: 99, suffix: ".9%", label: "Uptime SLA", icon: FiActivity },
    { value: 2, suffix: "M+", label: "Messages Sent", icon: FiMessageCircle },
    { value: 150, suffix: "+", label: "Countries", icon: FiGlobe },
  ];

  const testimonials = [
    { name: "Aiden Carter", role: "Product Designer", text: "ChatVerse completely transformed how our team communicates. The UI is absolutely gorgeous and the speed is unreal.", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=aiden", delay: 0 },
    { name: "Sophia Lee", role: "Startup Founder", text: "We switched from Slack to ChatVerse and never looked back. The AI assistant alone is worth it.", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=sophia", delay: 0.1 },
    { name: "Marcus Webb", role: "Software Engineer", text: "The animations and design are on another level. It actually makes chatting feel premium and exciting.", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=marcus", delay: 0.2 },
  ];

  return (
    <div className="min-h-screen overflow-x-hidden" style={{ background: "#050811" }}>

      {/* ===== HERO SECTION ===== */}
      <section className="relative min-h-[100vh] flex flex-col items-center justify-center text-center px-6 overflow-hidden">
        {/* Ambient orbs */}
        <div className="orb w-[600px] h-[600px] top-[-200px] left-[-200px] opacity-30"
          style={{ background: "radial-gradient(circle, var(--color-primary), transparent 70%)" }} />
        <div className="orb w-[500px] h-[500px] bottom-[-100px] right-[-100px] opacity-20"
          style={{ background: "radial-gradient(circle, var(--color-accent), transparent 70%)" }} />
        <div className="orb w-[300px] h-[300px] top-[40%] right-[20%] opacity-10"
          style={{ background: "radial-gradient(circle, var(--color-secondary), transparent 70%)" }} />
        {/* HUD grid overlay */}
        <div className="absolute inset-0 hud-grid opacity-30 pointer-events-none" />

        <motion.div style={{ y: heroY, opacity: heroOpacity }} className="relative z-10 max-w-5xl mx-auto">

          {/* Main heading */}
          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2, type: "spring", stiffness: 80 }}
            className="text-6xl md:text-8xl font-black tracking-tight leading-[1.05] mb-6"
          >
            <span className="block text-white drop-shadow-[0_0_40px_rgba(255,255,255,0.15)]">Chat Verse</span>
            <span className="gradient-text inline-block min-h-[1.2em]">
              {text}<span className="animate-blink ml-0.5 inline-block w-[3px] h-[0.85em] bg-current align-middle" />
            </span>
          </motion.h1>

          {/* Subheading */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="text-lg md:text-xl text-white/50 max-w-2xl mx-auto leading-relaxed mb-12"
          >
            A next-generation chat platform built for speed, privacy, and pure aesthetic pleasure.
            Connect with your world — beautifully.
          </motion.p>

          {/* CTA buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.55 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <Link to="/signup">
              <motion.button
                whileHover={{ scale: 1.06, boxShadow: "0 0 40px rgba(var(--color-primary), 0.5)" }}
                whileTap={{ scale: 0.97 }}
                className="btn btn-primary btn-lg rounded-2xl px-10 font-bold tracking-wide shadow-[0_0_30px_rgba(var(--color-primary),0.35)] gap-2 text-base"
              >
                Start for Free <FiArrowRight />
              </motion.button>
            </Link>
            <Link to="/login">
              <motion.button
                whileHover={{ scale: 1.04, borderColor: "rgba(255,255,255,0.3)" }}
                whileTap={{ scale: 0.97 }}
                className="btn btn-lg rounded-2xl px-10 font-bold tracking-wide bg-white/5 border border-white/10 text-white hover:bg-white/10 text-base backdrop-blur-sm"
              >
                Sign In
              </motion.button>
            </Link>
          </motion.div>
        </motion.div>
      </section>

      {/* ===== MARQUEE STRIP ===== */}
      <div className="py-6 border-y border-white/5 overflow-hidden" style={{ background: "rgba(255,255,255,0.02)" }}>
        <div className="marquee-track gap-16 text-4xl font-black tracking-[0.3em] text-white/5">
          {[...Array(6)].map((_, i) => (
            <React.Fragment key={i}>
              <span>CHAT</span><span className="text-primary/30">✦</span>
              <span>VERSE</span><span className="text-accent/30">✦</span>
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* ===== STATS SECTION ===== */}
      <section className="py-24 px-6 relative">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="grid grid-cols-2 md:grid-cols-4 gap-6"
          >
            {stats.map(({ value, suffix, label, icon: Icon }, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                whileHover={{ y: -4 }}
                className="glass-card rounded-3xl p-7 text-center"
              >
                <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto mb-4">
                  <Icon size={18} className="text-primary" />
                </div>
                <div className="text-4xl font-black text-white mb-1">
                  <Counter target={value} suffix={suffix} />
                </div>
                <p className="text-white/40 text-sm font-medium">{label}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ===== FEATURES SECTION ===== */}
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="text-xs font-bold uppercase tracking-[0.3em] text-primary/60 mb-4 block">Everything you need</span>
            <h2 className="text-5xl font-black text-white mb-5 leading-tight">
              Built for the <span className="gradient-text">Future</span>
            </h2>
            <p className="text-white/40 text-lg max-w-xl mx-auto">
              Every feature thoughtfully crafted to make your chat experience extraordinary.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f, i) => <FeatureCard key={i} {...f} />)}
          </div>
        </div>
      </section>

      {/* ===== HOW IT WORKS ===== */}
      <section className="py-24 px-6 relative overflow-hidden">
        <div className="orb w-[400px] h-[400px] left-[-100px] top-[50%] -translate-y-1/2 opacity-10"
          style={{ background: "radial-gradient(circle, var(--color-primary), transparent 70%)" }} />

        <div className="max-w-5xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="text-xs font-bold uppercase tracking-[0.3em] text-accent/60 mb-4 block">Simple & Fast</span>
            <h2 className="text-5xl font-black text-white leading-tight">
              Up & running in <span className="gradient-text">60 seconds</span>
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 relative">
            <div className="absolute top-12 left-[16.6%] right-[16.6%] h-[1px] bg-gradient-to-r from-primary/30 via-accent/30 to-secondary/30 hidden md:block" />
            {[
              { step: "01", title: "Create Account", desc: "Sign up in seconds with email or Google. No lengthy forms, no friction.", icon: FiUsers, color: "var(--color-primary)" },
              { step: "02", title: "Set Your Profile", desc: "Upload your avatar, customize your identity and make it truly yours.", icon: FiStar, color: "var(--color-secondary)" },
              { step: "03", title: "Start Chatting", desc: "Jump into the chat with our AI assistant or invite friends. It's that easy.", icon: FiMessageCircle, color: "var(--color-accent)" },
            ].map(({ step, title, desc, icon: Icon, color }, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15, type: "spring", stiffness: 100 }}
                className="text-center relative group"
              >
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  className="w-24 h-24 rounded-3xl mx-auto mb-6 flex items-center justify-center relative"
                  style={{ background: `linear-gradient(135deg, ${color}22, ${color}44)`, border: `1px solid ${color}33` }}
                >
                  <Icon size={32} style={{ color }} />
                  <div className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-[10px] font-black text-white/40">
                    {step}
                  </div>
                </motion.div>
                <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
                <p className="text-white/40 text-sm leading-relaxed">{desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>


      {/* ===== CTA SECTION ===== */}
      <section className="py-28 px-6 relative overflow-hidden">
        <div className="orb w-[500px] h-[500px] left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 opacity-20"
          style={{ background: "radial-gradient(circle, var(--color-primary), transparent 60%)" }} />

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative z-10 text-center max-w-3xl mx-auto"
        >
          <div className="glass-card rounded-[2.5rem] p-14 border border-white/10">
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 3, repeat: Infinity, repeatDelay: 2 }}
              className="text-6xl mb-6 inline-block"
            >
              💬
            </motion.div>
            <h2 className="text-5xl font-black text-white mb-6 leading-tight">
              Your conversations<br />deserve <span className="gradient-text">better</span>
            </h2>
            <p className="text-white/40 mb-10 text-lg">
              Join over 50,000 users who upgraded their chat experience. Free forever, no credit card needed.
            </p>
            <Link to="/signup">
              <motion.button
                whileHover={{ scale: 1.05, boxShadow: "0 0 60px rgba(var(--color-primary), 0.6)" }}
                whileTap={{ scale: 0.97 }}
                className="btn btn-primary btn-lg rounded-2xl px-14 font-bold tracking-wide shadow-[0_0_40px_rgba(var(--color-primary),0.4)] text-base gap-2"
              >
                Create Free Account <FiArrowRight />
              </motion.button>
            </Link>
          </div>
        </motion.div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer className="py-8 px-6 border-t border-white/5 text-center">
        <p className="text-white/20 text-sm flex items-center justify-center gap-2">
          <FiClock size={14} />
          © {new Date().getFullYear()} ChatVerse — Built with ❤️ for the future of chat
        </p>
      </footer>
    </div>
  );
};

export default Home;
