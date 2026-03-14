import React from "react";
import { useNavigate } from "react-router-dom";
import { IoMdSettings } from "react-icons/io";

const QuickNavigation = ({ setFetchMode, fetchMode }) => {
  const navigate = useNavigate();
  return (
    <>
      <div className="p-2 bg-info-content h-full flex flex-col justify-between">
        <div className="flex flex-col gap-4 items-center justify-start">
          <button
            className={`rounded-full border h-10 w-10 ${fetchMode === "RC" ? "bg-primary text-primary-content" : ""}`}
            onClick={() => setFetchMode("RC")}
          >
            RC
          </button>
          <button
            className={`rounded-full border h-10 w-10 ${fetchMode === "AC" ? "bg-primary text-primary-content" : ""}`}
            onClick={() => setFetchMode("AC")}
          >
            AC
          </button>
        </div>

        <div className="flex items-center justify-center p-4">
          <button
            className="text-3xl transition hover:rotate-90 hover:text-accent duration-300"
            onClick={() => navigate("/userDashboard")}
          >
            <IoMdSettings />
          </button>
        </div>
      </div>
    </>
  );
};

export default QuickNavigation;