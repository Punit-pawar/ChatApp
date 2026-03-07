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
      }

      else if (fetchMode === "AC") {
        res = await api.get("/user/allUsers");
        setContacts(res.data.data);
      }

      else {
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

  if (loading || contacts.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <span className="loading loading-dots loading-md text-primary"></span>
      </div>
    );
  }

  return (
    <div className="h-full p-3 overflow-y-auto space-y-3">

      {contacts.map((contact) => (
        <div
          key={contact.id}
          onClick={() => setReceiver(contact)}
          className="
          card bg-base-100 border border-base-300
          shadow-sm hover:shadow-xl
          hover:bg-base-200
          hover:border-primary
          hover:scale-[1.02]
          cursor-pointer
          transition-all duration-300
          "
        >
          <div className="card-body p-4">

            <h3 className="font-semibold text-base-content">
              {contact.fullName}
            </h3>

            <p className="text-sm text-base-content opacity-70">
              {contact.email}
            </p>

            <p className="text-sm font-medium text-base-content">
              {contact.mobileNumber}
            </p>

          </div>
        </div>
      ))}

    </div>
  );
};

export default ContactBar;