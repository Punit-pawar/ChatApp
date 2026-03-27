import React, { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import api from "../../config/api";
import socketAPI from "../../config/WebSocket";
import { GoDotFill } from "react-icons/go";
import { motion, AnimatePresence } from "framer-motion";

const DummyRecentContact = [
  {
    id: "64a7d8c5f6e5b4001f3e9c4c",
    fullName: "Amit Sharma",
    email: "amit.sharma@example.com",
    mobileNumber: "9876543210",
  },
];

const DummyAllContact = [];

const ContactBar = ({ fetchMode, setReceiver }) => {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);

  // ✅ FIX — must be object not undefined
  const [onlineUsers, setOnlineUsers] = useState({});

  const fetchContacts = async () => {
    setLoading(true);

    try {
      if (fetchMode === "RC") {
        setContacts(DummyRecentContact);
      } else if (fetchMode === "AC") {
        const res = await api.get("/user/allUsers");
        setContacts(res.data.data || []);
      }
    } catch (error) {
      toast.error("Failed to load contacts");
      setContacts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContacts();
  }, [fetchMode]);

  const handleOnlineUsers = (onlineList) => {
    setOnlineUsers(onlineList || {});
  };

  useEffect(() => {
    socketAPI.on("onlineUsers", handleOnlineUsers);

    return () => {
      socketAPI.off("onlineUsers", handleOnlineUsers);
    };
  }, []);

  // ✅ FIX safe check
  if (loading) {
    return (
      <div className="p-2 h-full flex items-center justify-center">
        <span className="text-sm text-primary">
          Loading contacts...
        </span>
      </div>
    );
  }

  return (
    <div className="p-2 bg-accent-content h-full flex flex-col gap-2">
      <div className="overflow-y-auto space-y-1">

        {contacts?.length === 0 && (
          <p className="text-center text-sm">
            No contacts
          </p>
        )}

        <AnimatePresence>
          {contacts?.map((contact, index) => (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ scale: 1.02, backgroundColor: "var(--primary)", borderColor: "transparent", color: "var(--primary-content)" }}
              whileTap={{ scale: 0.98 }}
              key={contact._id || contact.id}
              className="p-2 bg-accent/40 border border-transparent transition-colors rounded-lg cursor-pointer"
              onClick={() => setReceiver(contact)}
            >
              <h3 className="font-semibold flex justify-between">
                {contact.fullName}
                {onlineUsers?.[contact._id] && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="flex justify-center items-center"
                  >
                    <GoDotFill className="text-green-400" />
                  </motion.div>
                )}
              </h3>
              <p className="text-sm opacity-80">{contact.email}</p>
              <p className="text-sm font-bold opacity-90">{contact.mobileNumber}</p>
            </motion.div>
          ))}
        </AnimatePresence>

      </div>
    </div>
  );
};

export default ContactBar;