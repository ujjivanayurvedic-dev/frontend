import React, { memo } from 'react';

const HighlightBanner = memo(function HighlightBanner() {
  return (
    <section 
      className="w-full relative overflow-hidden py-10"
      aria-label="Satta King Cloud Official Live Updates"
    >
      
      {/* 1. BACKGROUND LAYER (Decorative - Hidden from Screen Readers) */}
      <div className="absolute inset-0 w-full h-full bg-[#050505]" aria-hidden="true">
        {/* Subtle Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-size-[24px_24px]"></div>
        
        {/* Golden Spotlight */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-75 md:w-150 h-75 bg-yellow-600/20 rounded-full blur-[80px] pointer-events-none"></div>
      </div>

      {/* 2. CONTENT LAYER */}
      <div className="relative z-10 w-full flex justify-center px-4">
        
        <div className="relative group w-full max-w-xl">
          
          {/* Animated Gold Ring Glow */}
          <div className="absolute -inset-px bg-linear-to-r from-yellow-700 via-yellow-400 to-yellow-700 rounded-full opacity-60 blur-md group-hover:opacity-100 transition duration-500 animate-pulse will-change-[opacity]"></div>
          
          {/* Main Glassmorphism Box */}
          <div className="relative w-full bg-black/80 backdrop-blur-xl rounded-full border border-yellow-500/50 px-6 py-4 text-center shadow-[0_0_40px_-10px_rgba(234,179,8,0.3)] flex flex-col items-center justify-center">
            
            {/* Top Line - Decorative SEO */}
            <div className="flex items-center gap-3 mb-1 opacity-80" aria-hidden="true">
              <div className="h-px w-8 bg-linear-to-r from-transparent to-yellow-500"></div>
              <p className="text-yellow-100/70 font-mono text-[9px] md:text-[10px] tracking-[0.3em] uppercase">
                Official Results
              </p>
              <div className="h-px w-8 bg-linear-to-l from-transparent to-yellow-500"></div>
            </div>

            {/* Main Title */}
            {/* We use h1 here if this is the main title of the page, otherwise h2 is fine */}
            <h2 className="relative text-2xl md:text-3xl font-black italic tracking-wider uppercase text-white">
              {/* Decorative Shimmer Layer (Hidden from SEO) */}
              <span 
                aria-hidden="true" 
                className="absolute inset-0 text-transparent bg-clip-text bg-linear-to-r from-yellow-300 via-white to-yellow-300 animate-[shimmer_2s_infinite] bg-size-[200%_100%] pointer-events-none"
              >
                Satta King Cloud 
              </span>
              
              {/* Actual Readable Text for SEO */}
              <span className="text-transparent bg-clip-text bg-linear-to-b from-yellow-300 to-yellow-700">
                Satta King Cloud
              </span>
            </h2>

             {/* Bottom Micro Text */}
             <p className="text-[10px] text-gray-500 font-bold tracking-widest mt-1">
               FASTEST LIVE UPDATES
             </p>

          </div>
        </div>
      </div>

      {/* Animation Styles */}
      <style>{`
        @keyframes shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>
    </section>
  )
});

export default HighlightBanner;