import React from "react";

const QuickNavigation = ({ setFetchMode }) => {

  return (
    <div className="flex flex-col justify-between items-center h-full p-3">

      <div className="flex flex-col gap-4 mt-2">

        <button
          onClick={() => setFetchMode("RC")}
          className="btn btn-circle btn-outline hover:scale-110 transition-all duration-200"
        >
          RC
        </button>

        <button
          onClick={() => setFetchMode("AC")}
          className="btn btn-circle btn-outline hover:scale-110 transition-all duration-200"
        >
          AC
        </button>

      </div>

      <div className="flex flex-col gap-4 mt-2">

        <button className="btn btn-ghost btn-sm w-full hover:bg-base-300 transition-all duration-200">
          PR
        </button>

        <button className="btn btn-ghost btn-sm w-full hover:bg-rose-300 transition-all duration-200">
          {/* onClick={handleLogout} */}
          Logout
        </button>

      </div>

    </div>
  );
};

export default QuickNavigation;