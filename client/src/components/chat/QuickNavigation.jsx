import React from "react";
import { useNavigate } from "react-router-dom";
import { IoMdSettings } from "react-icons/io";
import { motion } from "framer-motion";

const QuickNavigation = ({ setFetchMode, fetchMode }) => {
  const navigate = useNavigate();
  return (
    <>
      <div className="p-2 bg-info-content h-full flex flex-col justify-between">
        <div className="flex flex-col gap-4 items-center justify-start">
          <motion.button
            whileHover={{ scale: 1.15 }}
            whileTap={{ scale: 0.9 }}
            className={`rounded-full border h-10 w-10 transition-shadow ${fetchMode === "RC" ? "bg-primary text-primary-content shadow-[0_0_10px_rgba(var(--primary),0.5)]" : ""}`}
            onClick={() => setFetchMode("RC")}
          >
            RC
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.15 }}
            whileTap={{ scale: 0.9 }}
            className={`rounded-full border h-10 w-10 transition-shadow ${fetchMode === "AC" ? "bg-primary text-primary-content shadow-[0_0_10px_rgba(var(--primary),0.5)]" : ""}`}
            onClick={() => setFetchMode("AC")}
          >
            AC
          </motion.button>
        </div>

        <div className="flex items-center justify-center p-4">
          <motion.button
            whileHover={{ rotate: 90, scale: 1.2, color: "var(--accent)" }}
            whileTap={{ scale: 0.9 }}
            transition={{ type: "spring", stiffness: 300 }}
            className="text-3xl transition-colors duration-300"
            onClick={() => navigate("/userDashboard")}
          >
            <IoMdSettings />
          </motion.button>
        </div>
      </div>
    </>
  );
};

export default QuickNavigation;