import React, { memo } from 'react';

const Disclaimer = memo(function Disclaimer() {
  return (
    <aside 
      className="w-full bg-[#050505] border-t border-white/5 py-8 px-4"
      aria-label="Legal Disclaimer"
    >
      <div className="max-w-5xl mx-auto">
        
        {/* Main Card Container with Gradient Border Effect */}
        <div className="relative group rounded-xl bg-linear-to-r from-red-600/30 via-white/5 to-white/5 p-[1px]">
          
          <div className="relative flex flex-col md:flex-row items-start gap-5 bg-[#0e0e0e] rounded-xl p-6 shadow-2xl">
            
            {/* 1. Icon with Glow Effect */}
            <div className="shrink-0 relative mt-1">
              <div className="absolute inset-0 bg-red-500/20 blur-lg rounded-full animate-pulse"></div>
              <div className="relative bg-red-900/20 p-2 rounded-lg border border-red-500/30 text-red-500">
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  viewBox="0 0 24 24" 
                  fill="currentColor" 
                  className="w-6 h-6"
                  aria-hidden="true"
                >
                  <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zM12 8.25a.75.75 0 01.75.75v3.75a.75.75 0 01-1.5 0V9a.75.75 0 01.75-.75zm0 8.25a.75.75 0 100-1.5.75.75 0 000 1.5z" clipRule="evenodd" />
                </svg>
              </div>
            </div>

            {/* 2. Text Content */}
            <div className="flex-1">
              <p className="text-xs md:text-sm text-slate-300 leading-relaxed font-medium tracking-wide">
                <span className="text-white uppercase tracking-widest font-bold mr-2 text-[10px] bg-red-500/20 px-2 py-0.5 rounded border border-red-500/30">
                  Disclaimer
                </span>
                This website is an independent media portal for informational and journalistic purposes only. As a non-transactional service, we are not affiliated with any entity mentioned. Users are solely responsible for complying with all applicable laws in their jurisdiction.
              </p>
              
              {/* 3. Action Area */}
              <div className="mt-3 flex items-center">
                 <a 
                  href="/terms-of-service" 
                  className="group inline-flex items-center gap-2 text-[11px] font-bold text-red-500 hover:text-red-400 transition-colors uppercase tracking-wider"
                  aria-label="Read full terms of service"
                >
                  Read Full Policy
                  <span className="bg-red-500/10 p-1 rounded-full group-hover:bg-red-500/20 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3 transform transition-transform group-hover:translate-x-0.5">
                      <path fillRule="evenodd" d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z" clipRule="evenodd" />
                    </svg>
                  </span>
                </a>
              </div>
            </div>

          </div>
        </div>

        {/* 4. Footer Copyright (Optional aesthetic touch) */}
        <div className="mt-6 flex justify-center opacity-30">
           <div className="h-px w-24 bg-linear-to-r from-transparent via-white to-transparent"></div>
        </div>

      </div>
    </aside>
  );
});

export default Disclaimer;