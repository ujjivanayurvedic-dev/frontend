import React from "react";
import { FaWhatsapp } from "react-icons/fa";

const WhatsAppSmall = () => {
  const phoneNumber = "918130035485";

  return (
    <div className="fixed bottom-6 right-6 flex flex-col items-end z-50 group">
      {/* Informational Tooltip */}
      <div className="mb-2 px-3 py-1 bg-white/80 backdrop-blur-md border border-gray-200 rounded-lg shadow-sm transform transition-all duration-300 group-hover:-translate-y-1">
        <p className="text-[10px] text-gray-600 font-medium leading-none uppercase tracking-widest text-center">
          Connect Only For <span className="text-green-600">Information Purpose</span>
        </p>
      </div>

      {/* Main Button Container */}
      <div className="relative">
        {/* Subtle Ping Animation */}
        <span className="absolute inset-0 rounded-full bg-green-500 animate-ping opacity-20"></span>
        
        <a
          href={`https://wa.me/${phoneNumber}`}
          target="_blank"
          rel="noopener noreferrer"
          className="relative flex items-center justify-center w-14 h-14 bg-[#25D366] text-white rounded-2xl shadow-xl hover:shadow-green-200/50 hover:scale-105 active:scale-95 transition-all duration-300 border-b-4 border-green-700"
          aria-label="Contact for Information"
        >
          <FaWhatsapp size={28} />
        </a>
      </div>
    </div>
  );
};

export default WhatsAppSmall;
