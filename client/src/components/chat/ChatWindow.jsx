import React, { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import api from "../../config/api";
import { useAuth } from "../../context/AuthContext";
import socketAPI from "../../config/WebSocket";

const ChatWindow = ({ receiver }) => {
  const { user } = useAuth();
  const bottomRef = useRef(null);

  const senderId = user?._id || 1; // Replace with actual logged-in user ID
  const receiverId = receiver?._id || 2; // Replace with actual receiver ID

  const [messages, setMessages] = useState([]);

  const [inputMessage, setInputMessage] = useState("");

  const scrolltoBottom = () => {
   // console.log(bottomRef);
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  //On Every New Message
  useEffect(() => {
    scrolltoBottom();
  }, [messages]);

  const handleKeyDown = (e) => {
    e.key === "Enter" && handleSend();
  };

  const handleSend = async () => {
    //call Backend

    const messagePacket = {
      senderId,
      receiverId,
      message: inputMessage,
    };

    const timestamp = new Date().toISOString();

    try {
      if (socketAPI.connected) {
        socketAPI.emit("send", messagePacket);
        setInputMessage("");
        setMessages((prev) => [
          ...prev,
          { ...messagePacket, createdAt: timestamp, updatedAt: timestamp },
        ]);
      }
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.message || "Message Sending Failed");
    }
  };

  const fetchAllOldMessage = async () => {
    try {
      const res = await api.get(`/user/fetchMessages/${receiverId}`);
      setMessages(res.data.data);
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.message || "Error Fetching Messages");
    }
  };

  const handleReceiveMessage = (newMessagePack) => {
    // console.log(newMessagePack);
    setMessages((prev) => [...prev, newMessagePack]);
  };

  //on component Load
  useEffect(() => {
    setMessages([]);
    if (receiver) {
      fetchAllOldMessage();
    }
  }, [receiver]);

  useEffect(() => {
    socketAPI.on("receive", handleReceiveMessage);

    return () => {
      socketAPI.off("receive", handleReceiveMessage);
    };
  }, [receiverId, handleReceiveMessage]);



  if (!receiver) {
    return (
      <div className="p-2 h-full flex items-center justify-center">
        <span className="text-sm text-primary">
          Select a contact to start chatting...
        </span>
      </div>
    );
  }

  console.log("messages = ", messages);

  return (
    <>
      <div className="p-2 h-full">
        <div className="border rounded-lg h-full p-2">
          <div className="bg-primary p-3 rounded-lg mb-2">
            <h2 className="text-lg font-bold text-primary-content">
              {receiver.fullName}
            </h2>
          </div>

          <div className="h-4/5 overflow-y-auto p-2 border rounded-lg bg-accent/30">
            {/* Chat messages will go here */}
            {messages.length > 0 ? (
              messages.map((chat, idx) => (
                <div
                  key={idx}
                  className={`chat ${chat.senderId === receiverId ? "chat-receiver" : "chat-sender"}`}
                >
                  <div className="chat-header text-base-content">
                    {chat.senderId === receiverId
                      ? receiver.fullName
                      : user.fullName}
                  </div>
                  <div className="chat-bubble">{chat.message}</div>
                </div>
              ))
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                {" "}
                Loading Chats ...
              </div>
            )}

            {/* Dummy div to scroll to bottom */}
            <div ref={bottomRef} />
          </div>

          <div className="mt-2 flex gap-2">
            <input
              type="text"
              value={inputMessage}
              placeholder="Type your message..."
              className="input input-bordered w-full"
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <button
              className="btn btn-primary disabled:bg-secondary"
              onClick={handleSend}
              disabled={inputMessage === ""}
            >
              Send
            </button>
          </div>

          <div className="text-center text-sm text-base-content/60 mt-1">
            Powered by <span className="font-bold">ChatAppFSD45</span>
          </div>
        </div>
      </div>
    </>
  );
};

export default ChatWindow;