import React from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

const QuickNavigation = ({ setFetchMode, fetchMode }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate("/login");
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    toast.success("Logout successful");
  };

  return (
    <div className="flex flex-col justify-between items-center h-full py-6 px-3 bg-base-100/60 backdrop-blur-xl border-r border-base-content/5 shadow-lg transition-all duration-300">
      
      {/* Top Buttons */}
      <div className="flex flex-col gap-6 mt-2 w-full items-center">
        
        <div className="tooltip tooltip-right tooltip-primary font-semibold" data-tip="Recent Chats">
          <button
            onClick={() => setFetchMode("RC")}
            className={`
              btn btn-circle relative overflow-hidden transition-all duration-500 ease-out
              hover:scale-110 active:scale-95 hover:shadow-lg
              ${fetchMode === "RC"
                ? "bg-gradient-to-br from-primary to-secondary text-white border-none shadow-[0_0_15px_rgba(var(--fallback-p,var(--p)),0.4)] ring-4 ring-primary/20 scale-110"
                : "bg-base-200/50 border-base-content/10 hover:border-primary/50 hover:bg-primary text-base-content"
              }
            `}
          >
            <span className="font-bold tracking-wider relative z-10">RC</span>
          </button>
        </div>

        <div className="tooltip tooltip-right tooltip-primary font-semibold" data-tip="All Chats">
          <button
            onClick={() => setFetchMode("AC")}
            className={`
              btn btn-circle relative overflow-hidden transition-all duration-500 ease-out
              hover:scale-110 active:scale-95 hover:shadow-lg
              ${fetchMode === "AC"
                ? "bg-gradient-to-br from-primary to-secondary text-white border-none shadow-[0_0_15px_rgba(var(--fallback-p,var(--p)),0.4)] ring-4 ring-primary/20 scale-110"
                : "bg-base-200/50 border-base-content/10 hover:border-primary/50 hover:bg-primary text-base-content"
              }
            `}
          >
            <span className="font-bold tracking-wider relative z-10">AC</span>
          </button>
        </div>

      </div>

      {/* Bottom Buttons */}
      <div className="flex flex-col gap-3 mt-2 w-full">
        
        <div className="tooltip tooltip-right font-semibold" data-tip="User Dashboard">
          <button
            onClick={() => navigate("/userDashboard")}
            className="
              btn btn-ghost w-full rounded-xl
              transition-all duration-300
              hover:bg-primary/10 hover:text-primary
              hover:shadow-sm hover:-translate-y-1
              active:scale-95 font-bold tracking-wide
            "
          >
            PR
          </button>
        </div>

        <div className="tooltip tooltip-right tooltip-error font-semibold" data-tip="Sign Out">
          <button
            onClick={handleLogout}
            className="
              btn btn-ghost w-full rounded-xl
              transition-all duration-300
              hover:bg-error/10 hover:text-error
              hover:shadow-sm hover:-translate-y-1
              active:scale-95 font-bold tracking-wide
            "
          >
            Out
          </button>
        </div>

      </div>

    </div>
  );
};

export default QuickNavigation;