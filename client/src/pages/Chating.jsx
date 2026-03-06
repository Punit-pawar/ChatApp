import React, { useState } from "react";
import QuickNavigation from "../components/chat/QuickNavigation";
import ContactBar from "../components/chat/ContactBar";
import ChatWindow from "../components/chat/ChatWindow";

const Chating = () => {
  const [fetchMode, setFetchMode] = useState("RC");
  const [receiver, setReceiver] = useState(null);

  return (
    <div className="h-[92vh] bg-base-100 text-base-content transition-colors duration-300">
      
      <div className="flex h-full backdrop-blur-sm">

        {/* Navigation */}
        <div className="w-16 md:w-20 border-r border-base-300 bg-base-200/70 backdrop-blur-md transition-all duration-300">
          <QuickNavigation setFetchMode={setFetchMode} />
        </div>

        {/* Contacts */}
        <div className="w-72 border-r border-base-300 bg-base-200/40 backdrop-blur-md transition-all duration-300">
          <ContactBar fetchMode={fetchMode} setReceiver={setReceiver} />
        </div>

        {/* Chat Window */}
        <div className="flex-1 bg-base-100/50 backdrop-blur-md transition-all duration-300">
          <ChatWindow receiver={receiver} />
        </div>

      </div>
    </div>
  );
};

export default Chating;