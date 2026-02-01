import React from "react";

function HeaderStrip() {
  const games = [
    "DESAWAR",
    "SHRI GANESH",
    "DELHI BAZAR",
    "GALI",
    "GHAZIABAD",
    "FARIDABAD",
    "NOIDA KING",
  ];

  // create long continuous text
  const text = [...games, ...games, ...games]
    .map(item => `${item} RESULT`)
    .join("  •  ");

  return (
    <>
      <style>
        {`
          @keyframes scrollLeft {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
          }
          .scroll-text {
            display: inline-block;
            white-space: nowrap;
            animation: scrollLeft 35s linear infinite;
          }
        `}
      </style>

      <div className="bg-black text-white text-sm py-2 border-b-4 border-dotted border-red-600 overflow-hidden">
        <div className="scroll-text">
          {text}
        </div>
      </div>
    </>
  );
}

export default HeaderStrip;
