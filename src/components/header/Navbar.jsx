import React from "react";
import { useNavigate, useLocation } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const baseBtn =
    "w-1/3 font-bold text-center py-2 rounded-xl border border-black transition";

  const activeBtn = "bg-red-600 text-white";
  const normalBtn = "bg-[#F5FFBD] text-red-600";

  return (
    <nav className="w-full bg-black flex justify-center py-2 sticky top-0 z-50">
      <div className="w-[95%] flex justify-between gap-2">

        <button
          onClick={() => navigate("/")}
          className={`${baseBtn} ${
            location.pathname === "/" ? activeBtn : normalBtn
          }`}
        >
          HOME
        </button>

        <button
          onClick={() => navigate("/satta-king")}
          className={`${baseBtn} ${
            location.pathname === "/satta-king" ? activeBtn : normalBtn
          }`}
        >
          SATTA KING
        </button>

        <button
          onClick={() => navigate("/chart")}
          className={`${baseBtn} ${
            location.pathname === "/chart" ? activeBtn : normalBtn
          }`}
        >
          CHART
        </button>

      </div>
    </nav>
  );
}

export default Navbar;
