import React, { memo } from 'react';

const Disclaimer = memo(function Disclaimer() {
  return (
    <aside 
      className="w-full bg-black border-t border-white/5 py-10 px-4 overflow-visible relative"
      aria-label="Legal Disclaimer"
    >
      <div className="max-w-5xl mx-auto relative z-10">
        
        {/* === MAIN CARD CONTAINER === */}
        <div className="relative group isolate">
            
          {/* 1. THE ATMOSPHERE GLOW (Wide, soft, background light) */}
          <div className="absolute -inset-2 bg-gradient-to-r from-red-600 via-red-900 to-transparent rounded-2xl blur-2xl opacity-40 group-hover:opacity-60 transition duration-500"></div>
          
          {/* 2. THE INTENSE BORDER GLOW (Tight, bright, neon rim) */}
          <div className="absolute -inset-[1px] bg-gradient-to-r from-red-500 via-red-500/40 to-transparent rounded-xl opacity-70 group-hover:opacity-100 blur-[2px] transition duration-500"></div>
          
          {/* 3. BORDER STROKE (Physical border line) */}
          <div className="relative rounded-xl bg-gradient-to-r from-red-500 via-white/10 to-white/5 p-[1px]">
            
            {/* === INNER CONTENT CARD === */}
            <div className="relative flex flex-col md:flex-row items-start gap-6 bg-[#09090b] rounded-xl p-6 shadow-2xl overflow-hidden">
              
              {/* 4. INTERNAL SPOTLIGHT (Reflection on the black surface) */}
              {/* This makes the top-left corner look like it's being hit by a red light */}
              <div className="absolute top-0 left-0 w-80 h-80 bg-red-600/20 blur-[80px] rounded-full -translate-x-1/3 -translate-y-1/2 pointer-events-none mix-blend-screen"></div>

              {/* === ICON SECTION === */}
              <div className="shrink-0 relative mt-1 z-10">
                {/* Icon Outer Flare */}
                <div className="absolute inset-0 bg-red-500 blur-xl opacity-60 rounded-full animate-pulse"></div>
                
                {/* Icon Container */}
                <div className="relative bg-gradient-to-br from-red-950 to-black p-3 rounded-xl border border-red-500/50 text-red-400 shadow-[0_0_30px_rgba(239,68,68,0.6)]">
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    viewBox="0 0 24 24" 
                    fill="currentColor" 
                    className="w-6 h-6 drop-shadow-[0_0_8px_rgba(239,68,68,1)]"
                    aria-hidden="true"
                  >
                    <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zM12 8.25a.75.75 0 01.75.75v3.75a.75.75 0 01-1.5 0V9a.75.75 0 01.75-.75zm0 8.25a.75.75 0 100-1.5.75.75 0 000 1.5z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>

              {/* === TEXT CONTENT === */}
              <div className="flex-1 relative z-10">
                <p className="text-xs md:text-sm text-slate-300 leading-relaxed font-medium tracking-wide">
                  {/* Glowing Badge */}
                  <span className="text-white uppercase tracking-widest font-extrabold mr-3 text-[10px] bg-red-600 px-2 py-1 rounded shadow-[0_0_15px_rgba(220,38,38,0.8)] border border-red-400/50">
                    Disclaimer
                  </span>
                  This website is an independent media portal for informational and journalistic purposes only. As a non-transactional service, we are not affiliated with any entity mentioned. Users are solely responsible for complying with all applicable laws in their jurisdiction.
                </p>
                
                {/* Action Area */}
                <div className="mt-4 flex items-center">
                   <a 
                    href="/terms-of-service" 
                    className="group/link inline-flex items-center gap-2 text-[11px] font-bold text-red-400 hover:text-red-300 transition-colors uppercase tracking-wider shadow-black drop-shadow-md"
                    aria-label="Read full terms of service"
                  >
                    Read Full Policy
                    <span className="bg-red-500/10 border border-red-500/20 p-1 rounded-full group-hover/link:bg-red-500/30 group-hover/link:border-red-500/50 transition-all shadow-[0_0_10px_rgba(239,68,68,0.2)]">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3 transform transition-transform group-hover/link:translate-x-0.5 text-red-400">
                        <path fillRule="evenodd" d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z" clipRule="evenodd" />
                      </svg>
                    </span>
                  </a>
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* Footer Glow Line */}
        <div className="mt-8 flex justify-center opacity-80">
           <div className="h-[1px] w-48 bg-gradient-to-r from-transparent via-red-500 to-transparent shadow-[0_0_10px_#ef4444]"></div>
        </div>

      </div>
    </aside>
  );
});

export default Disclaimer;
