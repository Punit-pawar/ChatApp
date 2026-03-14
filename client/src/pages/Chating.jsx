import React, { useState } from "react";
import QuickNavigation from "../components/chat/QuickNavigation";
import ContactBar from "../components/chat/ContactBar";
import ChatWindow from "../components/chat/ChatWindow";
import { useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import socketAPI from "../config/WebSocket";

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
      <div className="flex h-[92vh]">
        <div className="w-1/20 border-r-2 border-gray-300 overflow-hidden">
          <QuickNavigation setFetchMode={setFetchMode} fetchMode={fetchMode} />
        </div>
        <div className="w-4/20 border-r-2 border-gray-300 overflow-hidden">
          <ContactBar fetchMode={fetchMode} setReceiver={setReceiver} />
        </div>
        <div className="w-15/20 border-r-2 border-gray-300 overflow-hidden">
          <ChatWindow receiver={receiver} />
        </div>
      </div>
    </>
  );
};

export default Chating;