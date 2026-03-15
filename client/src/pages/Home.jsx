import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import {
  FiArrowRight,
  FiUsers,
  FiMessageCircle,
  FiGlobe,
  FiZap,
  FiShield,
  FiActivity,
} from "react-icons/fi";

const words = ["Chat.", "Connect.", "Collaborate.", "Thrive."];

const Home = () => {
  const [text, setText] = useState("");
  const [i, setI] = useState(0);
  const [char, setChar] = useState(0);
  const [rev, setRev] = useState(false);

  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 500], [0, -100]);

  // typing animation

  useEffect(() => {
    const word = words[i];

    if (!rev && char === word.length) {
      setTimeout(() => setRev(true), 1000);
      return;
    }

    if (rev && char === 0) {
      setRev(false);
      setI((p) => (p + 1) % words.length);
      return;
    }

    const t = setTimeout(() => {
      setChar((p) => p + (rev ? -1 : 1));
    }, rev ? 40 : 80);

    return () => clearTimeout(t);
  }, [char, rev, i]);

  useEffect(() => {
    setText(words[i].substring(0, char));
  }, [char, i]);

  const features = [
    { icon: FiZap, title: "Fast", color: "#f59e0b" },
    { icon: FiShield, title: "Secure", color: "#6366f1" },
    { icon: FiGlobe, title: "Global", color: "#10b981" },
    { icon: FiMessageCircle, title: "AI Chat", color: "#ec4899" },
    { icon: FiUsers, title: "Profiles", color: "#f97316" },
    { icon: FiActivity, title: "Live", color: "#06b6d4" },
  ];

  return (
    <div className="min-h-screen bg-[#050811] text-white overflow-hidden grid-bg">

      {/* ORBS */}

      <div className="orb w-[500px] h-[500px] bg-purple-500 top-[-200px] left-[-200px] opacity-30" />
      <div className="orb w-[400px] h-[400px] bg-cyan-500 bottom-[-100px] right-[-100px] opacity-20" />

      {/* HERO */}

      <section className="min-h-screen flex items-center justify-center text-center">

        <motion.div style={{ y }}>

          <motion.h1
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-7xl font-black mb-6"
          >
            ChatVerse
            <br />
            <span className="gradient-text">
              {text}
              <span className="animate-pulse">|</span>
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-white/50 mb-8"
          >
            Futuristic chat platform with real-time messaging
          </motion.p>

          <div className="flex gap-4 justify-center">

            <Link to="/signup">
              <motion.button
                whileHover={{ scale: 1.1 }}
                className="btn btn-primary glow-btn"
              >
                Start Free <FiArrowRight />
              </motion.button>
            </Link>

            <Link to="/login">
              <motion.button
                whileHover={{ scale: 1.1 }}
                className="btn btn-outline"
              >
                Login
              </motion.button>
            </Link>

          </div>

        </motion.div>
      </section>

      {/* FEATURES */}

      <section className="py-20">

        <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">

          {features.map((f, i) => (

            <motion.div
              key={i}
              whileHover={{ y: -10, scale: 1.05 }}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="glass p-8 rounded-3xl text-center"
            >
              <f.icon
                size={40}
                style={{ color: f.color }}
                className="mx-auto mb-4"
              />

              <h3 className="text-xl font-bold">{f.title}</h3>

            </motion.div>

          ))}

        </div>

      </section>

      {/* STATS */}

      <section className="py-20">

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">

          {[
            ["50K+", "Users"],
            ["2M+", "Messages"],
            ["150+", "Countries"],
            ["99%", "Uptime"],
          ].map((s, i) => (

            <motion.div
              key={i}
              whileHover={{ scale: 1.1 }}
              className="glass p-6 rounded-2xl text-center"
            >
              <h2 className="text-3xl font-bold">{s[0]}</h2>
              <p className="text-white/40">{s[1]}</p>
            </motion.div>

          ))}

        </div>

      </section>

    </div>
  );
};

export default Home;