import React, { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";

const DummyChatData = [
  { senderId: 1, receiverId: 2, message: "Hi, how are you?" },
  { senderId: 2, receiverId: 1, message: "I am good! How about you?" },
  { senderId: 1, receiverId: 2, message: "Doing well. Are you free today?" },
  { senderId: 2, receiverId: 1, message: "Yes, mostly in the evening." },
  { senderId: 1, receiverId: 2, message: "Great, we should catch up." },
  { senderId: 2, receiverId: 1, message: "Sure, what time works for you?" },
  { senderId: 1, receiverId: 2, message: "Maybe around 6 PM?" },
  { senderId: 2, receiverId: 1, message: "6 PM sounds good." },
  { senderId: 1, receiverId: 2, message: "Let's meet at the cafe near the office." },
  { senderId: 2, receiverId: 1, message: "Perfect, I like that place." },
  { senderId: 1, receiverId: 2, message: "Did you finish the project work?" },
  { senderId: 2, receiverId: 1, message: "Almost done, just a few things left." },
  { senderId: 1, receiverId: 2, message: "Nice! Let me know if you need help." },
  { senderId: 2, receiverId: 1, message: "Thanks, I will." },
  { senderId: 1, receiverId: 2, message: "Also, did you check the new tech article I shared?" },
  { senderId: 2, receiverId: 1, message: "Yes, it was really interesting." },
  { senderId: 1, receiverId: 2, message: "The part about real-time apps was great." },
  { senderId: 2, receiverId: 1, message: "True, especially the Socket.IO example." },
  { senderId: 1, receiverId: 2, message: "Exactly! I want to try building one." },
  { senderId: 2, receiverId: 1, message: "Let's discuss it in the evening then." },
];

const ChatWindow = ({ receiver }) => {
  const bottomRef = useRef(null);

  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");

  const scrolltoBottom = () => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Auto scroll on new message
  useEffect(() => {
    scrolltoBottom();
  }, [messages]);

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSend();
    }
  };

  const handleSend = () => {
    if (!inputMessage.trim()) return;

    const messagePacket = {
      senderId: 1,
      receiverId: 2,
      message: inputMessage,
    };

    setMessages((prev) => [...prev, messagePacket]);
    setInputMessage("");
  };

  const fetchAllOldMessage = () => {
    try {
      setTimeout(() => {
        setMessages(DummyChatData);
      }, 1000);
    } catch (error) {
      toast.error("Some Error");
    }
  };

  // Load messages when receiver changes
  useEffect(() => {
    setMessages([]);
    if (receiver) fetchAllOldMessage();
  }, [receiver]);

  if (!receiver) {
    return (
      <div className="p-2 h-full flex items-center justify-center bg-base-200 transition-colors duration-300">
        <span className="text-sm text-primary font-medium animate-pulse">
          Select a contact to start chatting...
        </span>
      </div>
    );
  }

  return (
    <>
      <div className="p-2 h-full bg-base-200 transition-all duration-300">

        <div className="border border-base-300 rounded-lg h-full p-2 bg-base-100 shadow-md transition-all">

          {/* Header */}
          <div className="bg-primary p-3 rounded-lg mb-2 shadow-md transition-all duration-300 hover:shadow-lg">
            <h2 className="text-lg font-bold text-primary-content tracking-wide">
              {receiver.fullName}
            </h2>
          </div>

          {/* Messages */}
          <div className="h-4/5 overflow-y-auto p-2 border border-base-300 rounded-lg bg-accent/30 space-y-1">

            {messages.length > 0 ? (
              messages.map((chat, idx) => (
                <div
                  key={idx}
                  className={`chat ${
                    chat.senderId === 2 ? "chat-receiver" : "chat-sender"
                  } transition-all duration-200`}
                >
                  <div className="chat-header text-base-content opacity-70 text-xs">
                    {chat.senderId === 2 ? receiver.fullName : "Arpit Gupta"}
                  </div>

                  <div className="chat-bubble shadow-sm hover:shadow-md hover:scale-[1.02] transition-all duration-200">
                    {chat.message}
                  </div>
                </div>
              ))
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                Loading Chats ...
              </div>
            )}

            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div className="mt-2 flex gap-2">
            <input
              type="text"
              value={inputMessage}
              placeholder="Type your message..."
              className="input input-bordered w-full focus:outline-none focus:ring-2 focus:ring-primary transition-all duration-200"
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyDown={handleKeyDown}
            />

            <button
              className="btn btn-primary hover:scale-105 active:scale-95 transition-all duration-200 shadow-sm hover:shadow-md"
              onClick={handleSend}
            >
              Send
            </button>
          </div>

          {/* Footer */}
          <div className="text-center text-sm text-base-content/60 mt-1">
            Powered by <span className="font-bold">ChatVerse</span>
          </div>

        </div>
      </div>
    </>
  );
};

export default ChatWindow;