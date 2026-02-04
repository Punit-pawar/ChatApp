import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const words = ["Chat.", "Connect.", "Collaborate."];

const Home = () => {
  const [text, setText] = useState("");
  const [index, setIndex] = useState(0);
  const [subIndex, setSubIndex] = useState(0);
  const [reverse, setReverse] = useState(false);

  // Typing animation
  useEffect(() => {
    if (subIndex === words[index].length + 1 && !reverse) {
      setTimeout(() => setReverse(true), 1000);
      return;
    }

    if (subIndex === 0 && reverse) {
      setReverse(false);
      setIndex((prev) => (prev + 1) % words.length);
      return;
    }

    const timeout = setTimeout(() => {
      setSubIndex((prev) => prev + (reverse ? -1 : 1));
    }, reverse ? 40 : 90);

    return () => clearTimeout(timeout);
  }, [subIndex, index, reverse]);

  useEffect(() => {
    setText(words[index].substring(0, subIndex));
  }, [subIndex, index]);

  return (
    <div className="min-h-screen bg-base-200 overflow-hidden">


      {/* HERO */}
      <section className="relative flex flex-col items-center justify-center text-center px-6 py-28">

        {/* Animated blobs */}
        <div className="absolute w-80 h-80 bg-primary opacity-20 rounded-full blur-3xl top-10 left-10 animate-pulse"></div>
        <div className="absolute w-96 h-96 bg-secondary opacity-20 rounded-full blur-3xl bottom-10 right-10 animate-ping"></div>

        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight animate-slide-up">
          <span className="block">Chat Smarter.</span>
          <span className="text-primary h-16 inline-block">
            {text}
            <span className="animate-blink">|</span>
          </span>
        </h1>

        <p className="mt-6 max-w-xl text-lg text-base-content/70 animate-fade-in delay-200">
          A modern chat platform built for speed, security, and style.
          Stay connected anytime, anywhere.
        </p>

        <div className="mt-10 flex gap-4 animate-slide-up delay-300">
          <Link to="/signup" className="btn btn-primary btn-lg">
            Start Chatting 🚀
          </Link>
          <Link to="/login" className="btn btn-outline btn-lg">
            Login
          </Link>
        </div>
      </section>

      {/* FEATURES */}
      <section className="px-6 py-20 bg-base-100">
        <h2 className="text-4xl font-bold text-center mb-14 animate-fade-in">
          Built for the Future 💡
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-6xl mx-auto">

          {[
            { icon: "⚡", title: "Real-time Chat", desc: "Instant, lightning-fast message delivery." },
            { icon: "🔐", title: "Secure", desc: "Encrypted & privacy-first conversations." },
            { icon: "🎨", title: "Beautiful UI", desc: "Looks stunning in every theme." },
          ].map((item, i) => (
            <div
              key={i}
              className="card bg-base-200 shadow-xl transform transition hover:-translate-y-3 hover:scale-105 animate-slide-up"
              style={{ animationDelay: `${i * 150}ms` }}
            >
              <div className="card-body text-center">
                <div className="text-5xl mb-4">{item.icon}</div>
                <h3 className="text-xl font-semibold">{item.title}</h3>
                <p className="text-base-content/70">{item.desc}</p>
              </div>
            </div>
          ))}

        </div>
      </section>

      {/* CTA */}
      <section className="px-6 py-24 text-center bg-base-200">
        <h2 className="text-4xl font-bold mb-4 animate-fade-in">
          Your conversations deserve better 💬
        </h2>
        <p className="text-base-content/70 mb-10 animate-fade-in delay-200">
          Join ChatVerse and experience a new way to chat.
        </p>

        <Link
          to="/signup"
          className="btn btn-primary btn-lg animate-bounce"
        >
          Create Free Account 🚀
        </Link>
      </section>

      {/* FOOTER */}
      <footer className="footer footer-center p-6 bg-base-100 border-t">
        <p className="text-base-content/60">
          © {new Date().getFullYear()} ChatVerse — Built with ❤️
        </p>
      </footer>
    </div>
  );
};

export default Home;
