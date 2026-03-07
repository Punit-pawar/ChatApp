import React from "react";
import { useNavigate } from "react-router-dom";

const QuickNavigation = ({ setFetchMode, fetchMode }) => {

  const navigate = useNavigate();

  return (
    <div className="flex flex-col justify-between items-center h-full p-3">

      <div className="flex flex-col gap-4 mt-2">

        <button
          onClick={() => setFetchMode("RC")}
          className={`btn btn-circle btn-outline hover:scale-110 transition-all duration-200 
          ${fetchMode === "RC" ? "bg-primary text-primary-content" : ""}`}
        >
          RC
        </button>

        <button
          onClick={() => setFetchMode("AC")}
          className={`btn btn-circle btn-outline hover:scale-110 transition-all duration-200 
          ${fetchMode === "AC" ? "bg-primary text-primary-content" : ""}`}
        >
          AC
        </button>

      </div>

      <div className="flex flex-col gap-4 mt-2">

        <button
          onClick={() => navigate("/userDashboard")}
          className="btn btn-ghost btn-sm w-full hover:bg-base-300 transition-all duration-200"
        >
          PR
        </button>

        <button
          className="btn btn-ghost btn-sm w-full hover:bg-rose-300 transition-all duration-200"
        >
          {/* onClick={handleLogout} */}
          Logout
        </button>

      </div>

    </div>
  );
};

export default QuickNavigation;