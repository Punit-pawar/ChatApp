import React from "react";
import { motion } from "framer-motion";

const About = () => {
  return (
    <div className="min-h-[92vh] bg-base-200 py-16 px-6">

      <div className="max-w-7xl mx-auto">

        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl font-bold text-base-content mb-6">
            About <span className="text-primary">ChatVerse</span>
          </h1>

          <p className="max-w-3xl mx-auto text-base-content/70 text-lg">
            ChatVerse is a modern real-time communication platform designed
            to make conversations simple, fast, and engaging. Built with
            cutting-edge technologies, it provides a smooth and beautiful
            chat experience for users.
          </p>
        </motion.div>

        {/* Features Section */}
        <div className="grid md:grid-cols-3 gap-8 mb-20">

          <motion.div
            whileHover={{ scale: 1.05 }}
            className="card bg-base-100 shadow-md border border-base-300"
          >
            <div className="card-body text-center">
              <h2 className="card-title justify-center text-primary">
                Real-Time Messaging
              </h2>
              <p className="text-base-content/70">
                Send and receive messages instantly with a smooth and
                responsive interface designed for modern conversations.
              </p>
            </div>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.05 }}
            className="card bg-base-100 shadow-md border border-base-300"
          >
            <div className="card-body text-center">
              <h2 className="card-title justify-center text-primary">
                Theme Customization
              </h2>
              <p className="text-base-content/70">
                Choose from multiple beautiful themes to personalize your
                chat experience according to your style.
              </p>
            </div>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.05 }}
            className="card bg-base-100 shadow-md border border-base-300"
          >
            <div className="card-body text-center">
              <h2 className="card-title justify-center text-primary">
                Smooth UI Experience
              </h2>
              <p className="text-base-content/70">
                Built using modern frontend technologies to deliver
                fast, fluid, and responsive user interfaces.
              </p>
            </div>
          </motion.div>

        </div>

        {/* Tech Stack */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-20"
        >
          <h2 className="text-3xl font-bold text-center text-base-content mb-10">
            Technologies Used
          </h2>

          <div className="flex flex-wrap justify-center gap-4">

            <span className="badge badge-primary badge-lg">React</span>
            <span className="badge badge-secondary badge-lg">Node.js</span>
            <span className="badge badge-accent badge-lg">Express</span>
            <span className="badge badge-info badge-lg">MongoDB</span>
            <span className="badge badge-success badge-lg">TailwindCSS</span>
            <span className="badge badge-warning badge-lg">DaisyUI</span>

          </div>
        </motion.div>

        {/* Team / Creator */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <div className="card bg-base-100 shadow-lg border border-base-300 max-w-xl mx-auto">
            <div className="card-body">

              <h2 className="text-2xl font-bold text-primary">
                Built by Developers
              </h2>

              <p className="text-base-content/70">
                ChatVerse was created to demonstrate modern full-stack
                application development using React and Node.js. It focuses
                on delivering performance, clean UI, and scalability.
              </p>

              <div className="mt-4 text-sm text-base-content/60">
                Powered by <span className="font-bold">ChatVerse</span>
              </div>

            </div>
          </div>
        </motion.div>

      </div>

    </div>
  );
};

export default About;