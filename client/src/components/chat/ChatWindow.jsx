import React, { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import api from "../../config/api";
import { useAuth } from "../../context/AuthContext";
import socketAPI from "../../config/WebSocket";
import { motion, AnimatePresence } from "framer-motion";

const ChatWindow = ({ receiver }) => {
  const { user } = useAuth();

  const bottomRef = useRef(null);

  // ✅ SAFE IDs
  const senderId = user?._id || user?.id;
  const receiverId = receiver?._id || receiver?.id;

  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");

  // ================= SCROLL =================

  const scrolltoBottom = () => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  };

  useEffect(() => {
    scrolltoBottom();
  }, [messages]);

  // ================= SEND =================

  const handleSend = async () => {
    if (!inputMessage) return;
    if (!receiverId) return;

    const messagePacket = {
      senderId,
      receiverId,
      message: inputMessage,
    };

    const timestamp = new Date().toISOString();

    try {
      if (socketAPI) {
        socketAPI.emit("send", messagePacket);

        setMessages((prev) => [
          ...prev,
          {
            ...messagePacket,
            createdAt: timestamp,
          },
        ]);

        setInputMessage("");
      }
    } catch (error) {
      console.log(error);
      toast.error("Message Sending Failed");
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSend();
    }
  };

  // ================= FETCH OLD =================

  const fetchAllOldMessage = async () => {
    try {
      if (!receiverId) return;

      const res = await api.get(
        `/user/fetchMessages/${receiverId}`
      );

      setMessages(res.data.data || []);
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.message || "Error Fetching Messages");
    }
  };

  // ================= RECEIVE =================

  const handleReceiveMessage = (msg) => {
    setMessages((prev) => [...prev, msg]);
  };

  // ================= LOAD ON RECEIVER CHANGE =================

  useEffect(() => {
    setMessages([]);

    if (receiverId) {
      fetchAllOldMessage();
    }
  }, [receiverId]);

  // ================= SOCKET =================

  useEffect(() => {
    socketAPI.on("receive", handleReceiveMessage);

    return () => {
      socketAPI.off("receive", handleReceiveMessage);
    };
  }, []);

  // ================= NO RECEIVER =================

  if (!receiver) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 20 }}
        className="p-2 h-full flex flex-col items-center justify-center gap-4 text-center"
      >
        <div className="text-6xl animate-bounce">💬</div>
        <span className="text-lg font-semibold text-primary/80">
          Select a contact to start chatting...
        </span>
        <span className="text-sm opacity-50">Say hi to your friends and colleagues!</span>
      </motion.div>
    );
  }

  // ================= UI =================

  return (
    <div className="p-2 h-full">
      <div className="border rounded-lg h-full p-2">

        {/* HEADER */}

        <motion.div 
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="bg-primary p-3 rounded-lg mb-2 flex justify-between items-center"
        >
          <div className="flex gap-3 items-center">
            <div className="w-10 h-10 rounded-full bg-primary-content/20 flex items-center justify-center font-bold text-primary-content text-lg">
              {receiver.fullName?.charAt(0).toUpperCase()}
            </div>
            <div>
              <h2 className="text-lg font-bold text-primary-content leading-none">
                {receiver.fullName}
              </h2>
              {receiver.email && <p className="text-xs text-primary-content/80 mt-1">{receiver.email}</p>}
            </div>
          </div>
        </motion.div>

        {/* CHAT */}

        <div className="h-4/5 overflow-y-auto p-2 border rounded-lg bg-accent/20 backdrop-blur-md">

          <AnimatePresence>
            {messages.length > 0 ? (
              messages.map((chat, idx) => (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8, y: 10, originX: chat.senderId === senderId ? 1 : 0 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ type: "spring", stiffness: 300, damping: 25 }}
                  key={idx}
                  className={`chat ${
                    chat.senderId === senderId
                      ? "chat-end"
                      : "chat-start"
                  }`}
                >
                  <div className="chat-header text-xs opacity-60 mb-1">
                    {chat.senderId === senderId
                      ? user?.fullName
                      : receiver?.fullName}
                  </div>

                  <div className={`chat-bubble ${chat.senderId === senderId ? "chat-bubble-primary" : ""}`}>
                    {chat.message}
                  </div>
                  <div className="chat-footer text-[10px] opacity-40 mt-1">
                    {chat.createdAt && new Date(chat.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </motion.div>
              ))
            ) : (
              <motion.div 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                className="w-full h-full flex flex-col gap-2 items-center justify-center opacity-40"
              >
                <div className="text-5xl">👋</div>
                <p>No messages yet. Break the ice!</p>
              </motion.div>
            )}
          </AnimatePresence>

          <div ref={bottomRef} />
        </div>

        {/* INPUT */}

        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="mt-2 flex gap-2"
        >
          <input
            type="text"
            value={inputMessage}
            placeholder="Type your message...."
            className="input input-bordered w-full shadow-inner focus:shadow-[0_0_10px_rgba(var(--primary),0.3)] transition-shadow"
            onChange={(e) =>
              setInputMessage(e.target.value)
            }
            onKeyDown={handleKeyDown}
          />

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="btn btn-primary shadow-lg"
            onClick={handleSend}
            disabled={!inputMessage}
          >
            Send
          </motion.button>
        </motion.div>

        <div className="text-center text-sm text-base-content/60 mt-1">
          Powered by <b>ChatApp</b>
        </div>

      </div>
    </div>
  );
};

export default ChatWindow;