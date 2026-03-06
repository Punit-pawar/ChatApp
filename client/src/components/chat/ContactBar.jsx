import React, { useState, useEffect } from "react";
import { toast } from "react-hot-toast";

const DummyRecentContact = [
  { id: 1, name: "Amit Sharma", email: "amit.sharma@example.com", contactNumber: "9876543210" },
  { id: 2, name: "Priya Verma", email: "priya.verma@example.com", contactNumber: "9876501234" },
  { id: 3, name: "Rahul Singh", email: "rahul.singh@example.com", contactNumber: "9123456780" },
  { id: 4, name: "Sneha Gupta", email: "sneha.gupta@example.com", contactNumber: "9988776655" },
  { id: 5, name: "Vikram Patel", email: "vikram.patel@example.com", contactNumber: "9898989898" }
];

const DummyAllContact = [
  { id: 11, name: "Ankit Tiwari", email: "ankit.tiwari@example.com", contactNumber: "9876012345" },
  { id: 12, name: "Ritika Saxena", email: "ritika.saxena@example.com", contactNumber: "9811122233" },
  { id: 13, name: "Manish Yadav", email: "manish.yadav@example.com", contactNumber: "9822334455" },
  { id: 14, name: "Deepak Choudhary", email: "deepak.choudhary@example.com", contactNumber: "9833445566" },
  { id: 15, name: "Shalini Mishra", email: "shalini.mishra@example.com", contactNumber: "9844556677" }
];

const ContactBar = ({ fetchMode, setReceiver }) => {

  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchContacts = () => {
    setLoading(true);

    try {
      setTimeout(() => {

        setLoading(false);

        if (fetchMode === "RC") setContacts(DummyRecentContact);
        else if (fetchMode === "AC") setContacts(DummyAllContact);
        else setContacts([]);

      }, 1000);

    } catch (error) {
      toast.error("Failed to load contacts.");
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
              {contact.name}
            </h3>

            <p className="text-sm text-base-content opacity-70">
              {contact.email}
            </p>

            <p className="text-sm font-medium text-base-content">
              {contact.contactNumber}
            </p>

          </div>
        </div>
      ))}

    </div>
  );
};

export default ContactBar;