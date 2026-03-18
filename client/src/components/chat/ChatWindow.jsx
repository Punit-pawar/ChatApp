import React, { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import api from "../../config/api";
import { useAuth } from "../../context/AuthContext";
import socketAPI from "../../config/WebSocket";

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
      <div className="p-2 h-full flex items-center justify-center">
        <span className="text-sm text-primary">
          Select a contact to start chatting...
        </span>
      </div>
    );
  }

  // ================= UI =================

  return (
    <div className="p-2 h-full">
      <div className="border rounded-lg h-full p-2">

        {/* HEADER */}

        <div className="bg-primary p-3 rounded-lg mb-2">
          <h2 className="text-lg font-bold text-primary-content">
            {receiver.fullName}
          </h2>
        </div>

        {/* CHAT */}

        <div className="h-4/5 overflow-y-auto p-2 border rounded-lg bg-accent/30">

          {messages.length > 0 ? (
            messages.map((chat, idx) => (
              <div
                key={idx}
                className={`chat ${
                  chat.senderId === senderId
                    ? "chat-end"
                    : "chat-start"
                }`}
              >
                <div className="chat-header">
                  {chat.senderId === senderId
                    ? user?.fullName
                    : receiver?.fullName}
                </div>

                <div className="chat-bubble">
                  {chat.message}
                </div>
              </div>
            ))
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              No messages
            </div>
          )}

          <div ref={bottomRef} />
        </div>

        {/* INPUT */}

        <div className="mt-2 flex gap-2">
          <input
            type="text"
            value={inputMessage}
            placeholder="Type your message..."
            className="input input-bordered w-full"
            onChange={(e) =>
              setInputMessage(e.target.value)
            }
            onKeyDown={handleKeyDown}
          />

          <button
            className="btn btn-primary"
            onClick={handleSend}
            disabled={!inputMessage}
          >
            Send
          </button>
        </div>

        <div className="text-center text-sm text-base-content/60 mt-1">
          Powered by <b>ChatApp</b>
        </div>

      </div>
    </div>
  );
};

export default ChatWindow;