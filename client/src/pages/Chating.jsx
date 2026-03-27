import React, { useState } from "react";
import QuickNavigation from "../components/chat/QuickNavigation";
import ContactBar from "../components/chat/ContactBar";
import ChatWindow from "../components/chat/ChatWindow";
import { useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import socketAPI from "../config/WebSocket";
import { motion } from "framer-motion";

const Chating = () => {
  const { user } = useAuth();
  const [fetchMode, setFetchMode] = useState("AC");

  const [receiver, setReceiver] = useState(null);

  useEffect(() => {
    if (user) {
      socketAPI.emit("createPath", user._id);
    }

    return () => {
      socketAPI.emit("destroyPath", user._id);
    };
  }, []);

  return (
    <>
      <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        transition={{ duration: 0.5 }}
        className="flex h-[92vh]"
      >
        <motion.div 
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="w-1/20 border-r-2 border-gray-300 overflow-hidden"
        >
          <QuickNavigation setFetchMode={setFetchMode} fetchMode={fetchMode} />
        </motion.div>
        
        <motion.div 
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="w-4/20 border-r-2 border-gray-300 overflow-hidden"
        >
          <ContactBar fetchMode={fetchMode} setReceiver={setReceiver} />
        </motion.div>
        
        <motion.div 
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="w-15/20 border-r-2 border-gray-300 overflow-hidden"
        >
          <ChatWindow receiver={receiver} />
        </motion.div>
      </motion.div>
    </>
  );
};

export default Chating;