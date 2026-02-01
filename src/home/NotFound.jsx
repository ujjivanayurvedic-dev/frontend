import React from 'react';
import { Link } from 'react-router-dom';
import { FaHome, FaExclamationTriangle } from 'react-icons/fa';

export default function NotFound() {
  return (
    <div className="min-h-screen w-full bg-[#050505] relative overflow-hidden flex flex-col items-center justify-center p-4">
      
      {/* Background Ambience */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-red-900/20 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-yellow-900/20 rounded-full blur-[120px]"></div>
        {/* Grid Texture */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-size-[24px_24px]"></div>
      </div>

      {/* Main Content Card */}
      <div className="relative z-10 max-w-lg w-full text-center">
        
        {/* Animated Icon */}
        <div className="mb-6 flex justify-center">
          <div className="relative">
            <div className="absolute inset-0 bg-red-500 blur-xl opacity-20 animate-pulse"></div>
            <FaExclamationTriangle className="text-6xl text-red-500 relative z-10 animate-bounce" />
          </div>
        </div>

        {/* 404 Glitch Text */}
        <h1 className="text-[100px] md:text-[150px] font-black leading-none tracking-tighter text-transparent bg-clip-text bg-linear-to-b from-white via-gray-400 to-gray-800 drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]">
          4<span className="text-yellow-500">0</span>4
        </h1>

        {/* Message */}
        <h2 className="text-2xl md:text-3xl font-bold text-white uppercase tracking-widest mb-4">
          Game Over
        </h2>
        
        <p className="text-gray-400 text-sm md:text-base leading-relaxed mb-8 max-w-md mx-auto">
          The page you are looking for has been removed or does not exist. 
          Don't worry, your luck is still waiting on the home page.
        </p>

        {/* Action Button */}
        <Link 
          to="/" 
          className="group relative inline-flex items-center justify-center gap-3 px-8 py-4 bg-linear-to-r from-yellow-600 to-yellow-800 rounded-full text-white font-bold tracking-widest uppercase transition-all hover:scale-105 hover:shadow-[0_0_30px_rgba(234,179,8,0.4)]"
        >
          {/* Button Shine Effect */}
          <div className="absolute inset-0 w-full h-full rounded-full bg-linear-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 overflow-hidden"></div>
          
          <FaHome className="text-lg" />
          <span>Back to Home</span>
        </Link>

      </div>

      {/* Footer Decoration */}
      <div className="absolute bottom-8 text-center">
         <p className="text-white/20 text-[10px] uppercase tracking-[0.3em]">
           Error Code: Not_Found
         </p>
      </div>

    </div>
  );
}