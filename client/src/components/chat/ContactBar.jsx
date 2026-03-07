import React, { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import api from "../../config/api";

const DummyRecentContact = [
  { id: 1, fullName: "Amit Sharma", email: "amit.sharma@example.com", mobileNumber: "9876543210" },
  { id: 2, fullName: "Priya Verma", email: "priya.verma@example.com", mobileNumber: "9876501234" },
  { id: 3, fullName: "Rahul Singh", email: "rahul.singh@example.com", mobileNumber: "9123456780" },
  { id: 4, fullName: "Sneha Gupta", email: "sneha.gupta@example.com", mobileNumber: "9988776655" },
  { id: 5, fullName: "Vikram Patel", email: "vikram.patel@example.com", mobileNumber: "9898989898" },
  { id: 6, fullName: "Neha Joshi", email: "neha.joshi@example.com", mobileNumber: "9812345678" },
  { id: 7, fullName: "Arjun Mehta", email: "arjun.mehta@example.com", mobileNumber: "9001122334" },
  { id: 8, fullName: "Kavita Nair", email: "kavita.nair@example.com", mobileNumber: "9012345678" },
  { id: 9, fullName: "Rohit Agarwal", email: "rohit.agarwal@example.com", mobileNumber: "9090909090" },
  { id: 10, fullName: "Pooja Kapoor", email: "pooja.kapoor@example.com", mobileNumber: "9887766554" }
];

const ContactBar = ({ fetchMode, setReceiver }) => {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchContacts = async () => {
    setLoading(true);
    try {
      let res;
      if (fetchMode === "RC") {
        setContacts(DummyRecentContact);
      } else if (fetchMode === "AC") {
        res = await api.get("/user/allUsers");
        setContacts(res.data.data);
      } else {
        setContacts([]);
      }
    } catch (error) {
      toast.error("Failed to load contacts.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContacts();
  }, [fetchMode]);

  // Helper function for the dynamic avatar (UI only)
  const getInitials = (name) => {
    return name ? name.charAt(0).toUpperCase() : "?";
  };

  if (loading) {
    return (
      <div className="h-full p-3 overflow-y-auto space-y-4">
        {[1, 2, 3, 4, 5, 6].map((n) => (
          <div key={n} className="flex gap-4 items-center animate-pulse p-2">
            <div className="w-12 h-12 rounded-full bg-base-content/10"></div>
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-base-content/10 rounded w-3/4"></div>
              <div className="h-3 bg-base-content/10 rounded w-1/2"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (contacts.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-base-content/50 font-medium">
        No contacts found.
      </div>
    );
  }

  return (
    <div className="h-full p-3 overflow-y-auto space-y-2 custom-scrollbar">
      {contacts.map((contact) => (
        <div
          key={contact.id || contact._id}
          onClick={() => setReceiver(contact)}
          className="
            flex items-center gap-4 p-3 rounded-2xl
            bg-base-100/60 backdrop-blur-md border border-transparent
            shadow-sm transition-all duration-300 ease-out cursor-pointer group
            hover:shadow-md hover:border-primary/30 hover:bg-primary/5 hover:scale-[1.02]
            active:scale-[0.98]
          "
        >
          {/* Avatar */}
          <div className="relative flex-shrink-0">
            <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-white font-bold text-xl shadow-inner group-hover:shadow-[0_0_15px_rgba(var(--fallback-p,var(--p)),0.4)] transition-all duration-300 group-hover:scale-110">
              {getInitials(contact.fullName)}
            </div>
            {/* Optional subtle online indicator dot */}
            <span className="absolute bottom-0 right-0 w-3 h-3 bg-success border-2 border-base-100 rounded-full"></span>
          </div>

          {/* Details */}
          <div className="flex flex-col flex-1 overflow-hidden">
            <h3 className="font-bold text-base-content truncate transition-colors duration-300 group-hover:text-primary tracking-tight">
              {contact.fullName}
            </h3>
            <p className="text-xs text-base-content/60 truncate transition-all duration-300 group-hover:text-base-content/80">
              {contact.email}
            </p>
            <p className="text-xs font-semibold text-base-content/50 mt-0.5 tracking-wide">
              {contact.mobileNumber}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ContactBar;