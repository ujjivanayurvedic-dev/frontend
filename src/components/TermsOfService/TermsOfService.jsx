import React, { memo } from 'react';

const TermsOfService = memo(function TermsOfService() {
  return (
    <article className="min-h-screen w-full bg-[#050505] text-slate-300 py-12 px-4 md:px-8 font-sans selection:bg-red-500/30 selection:text-red-200">
      
      {/* --- HEADER SECTION --- */}
      <header className="max-w-4xl mx-auto mb-16 border-b border-white/10 pb-8 relative">
        <div className="absolute top-0 left-0 w-20 h-20 bg-red-600/20 blur-3xl rounded-full -translate-y-1/2 pointer-events-none"></div>
        
        <h1 className="text-3xl md:text-5xl font-black text-white uppercase tracking-tight mb-4 relative z-10">
          Terms of Service
        </h1>
        <div className="flex flex-col md:flex-row md:items-center gap-4 text-sm font-medium">
          <p className="text-slate-500 uppercase tracking-widest">
            Last Updated: <span className="text-white">November 24, 2024</span>
          </p>
          <span className="hidden md:block w-1 h-1 bg-slate-700 rounded-full"></span>
          <p className="text-red-500 uppercase tracking-widest">
            Effective Immediately
          </p>
        </div>
      </header>

      {/* --- CONTENT CONTAINER --- */}
      <div className="max-w-4xl mx-auto space-y-16">

        {/* 1. AGREEMENT */}
        <section aria-labelledby="section-1" className="relative">
          <div className="absolute -left-4 md:-left-12 top-0 h-full w-[1px] bg-gradient-to-b from-white/10 to-transparent hidden md:block"></div>
          
          <h2 id="section-1" className="text-xl md:text-2xl font-bold text-white mb-6 flex items-center gap-4">
            <span className="flex items-center justify-center w-8 h-8 rounded bg-slate-800 text-xs text-red-400 font-mono border border-white/10 shadow-lg shadow-black/50">01</span>
            AGREEMENT TO TERMS
          </h2>
          
          <div className="space-y-4 leading-relaxed text-slate-400">
            <p>
              These Terms of Service (“Terms”) constitute a legally binding agreement made between you ("the User") and the owners and operators of <span className="text-white font-semibold underline decoration-red-500/50 underline-offset-4">sattakingresult.info</span> ("we," "us," or "our"), concerning your access to and use of the Services.
            </p>
            <div className="bg-red-500/5 border-l-2 border-red-500 p-5 rounded-r-lg">
              <p className="text-slate-200 text-sm">
                <strong className="text-red-400 uppercase text-xs tracking-wider block mb-1">Important</strong>
                By accessing the Services, you agree that you have read, understood, and agree to be bound by these Terms. If you do not agree with all of these Terms, you are strictly prohibited from using the Services and must discontinue use immediately.
              </p>
            </div>
          </div>
        </section>

        {/* 2. DESCRIPTION OF SERVICES */}
        <section aria-labelledby="section-2" className="relative">
          <div className="absolute -left-4 md:-left-12 top-0 h-full w-[1px] bg-gradient-to-b from-white/10 to-transparent hidden md:block"></div>

          <h2 id="section-2" className="text-xl md:text-2xl font-bold text-white mb-6 flex items-center gap-4">
            <span className="flex items-center justify-center w-8 h-8 rounded bg-slate-800 text-xs text-red-400 font-mono border border-white/10 shadow-lg shadow-black/50">02</span>
            DESCRIPTION OF SERVICES
          </h2>
          
          <div className="space-y-6 leading-relaxed text-slate-400">
            <p>
              The platform provided via <span className="text-slate-200">sattakingresult.info</span> operates strictly as an independent media portal and informational archive. Our explicit function is to:
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-[#0A0A0A] p-5 rounded-xl border border-white/5 hover:border-white/10 transition-colors">
                <h3 className="text-white font-semibold mb-2 text-sm">Data Aggregation</h3>
                <p className="text-xs text-slate-500 leading-5">
                  We organize publicly available data originating from third-party sources and regional announcements for ease of access.
                </p>
              </div>
              <div className="bg-[#0A0A0A] p-5 rounded-xl border border-white/5 hover:border-white/10 transition-colors">
                <h3 className="text-white font-semibold mb-2 text-sm">Historical Archiving</h3>
                <p className="text-xs text-slate-500 leading-5">
                  We maintain a statistical database of past results for journalistic analysis and public information purposes only.
                </p>
              </div>
            </div>

            <p className="italic text-sm text-slate-500">
              Note: This is a non-transactional service. We do not facilitate any financial exchanges, payment processing, or commercial activities between users.
            </p>
          </div>
        </section>

        {/* 3. USER RESPONSIBILITY */}
        <section aria-labelledby="section-3" className="relative">
          <div className="absolute -left-4 md:-left-12 top-0 h-full w-[1px] bg-gradient-to-b from-white/10 to-transparent hidden md:block"></div>

          <h2 id="section-3" className="text-xl md:text-2xl font-bold text-white mb-6 flex items-center gap-4">
            <span className="flex items-center justify-center w-8 h-8 rounded bg-slate-800 text-xs text-red-400 font-mono border border-white/10 shadow-lg shadow-black/50">03</span>
            USER ELIGIBILITY & LAWS
          </h2>
          <div className="space-y-4 leading-relaxed text-slate-400">
            <p>
              The Services are intended solely for users who have reached the age of majority in their respective jurisdiction.
            </p>
            <p>
              It is your <strong className="text-white">sole and absolute responsibility</strong> to ensure that your access to and use of this website does not violate any applicable local, state, or national laws. We claim no responsibility for the use of the information provided herein. Users accessing this site from jurisdictions where such content is prohibited must exit immediately.
            </p>
          </div>
        </section>

        {/* 4. INTELLECTUAL PROPERTY */}
        <section aria-labelledby="section-4" className="relative">
          <div className="absolute -left-4 md:-left-12 top-0 h-full w-[1px] bg-gradient-to-b from-white/10 to-transparent hidden md:block"></div>

          <h2 id="section-4" className="text-xl md:text-2xl font-bold text-white mb-6 flex items-center gap-4">
            <span className="flex items-center justify-center w-8 h-8 rounded bg-slate-800 text-xs text-red-400 font-mono border border-white/10 shadow-lg shadow-black/50">04</span>
            INTELLECTUAL PROPERTY
          </h2>
          <p className="leading-relaxed text-slate-400">
            The layout, design, data structures, and original content of <span className="text-slate-200">sattakingresult.info</span> are the exclusive property of the operators. You may not scrape, copy, or reproduce the database for commercial purposes without prior written consent.
          </p>
        </section>

        {/* 5. DISCLAIMER & LIABILITY */}
        <section aria-labelledby="section-5" className="relative">
          <h2 id="section-5" className="text-xl md:text-2xl font-bold text-white mb-6 flex items-center gap-4">
            <span className="flex items-center justify-center w-8 h-8 rounded bg-slate-800 text-xs text-red-400 font-mono border border-white/10 shadow-lg shadow-black/50">05</span>
            DISCLAIMERS & LIABILITY
          </h2>
          
          <div className="bg-white/[0.02] border border-white/5 rounded-xl p-6 md:p-8 backdrop-blur-sm">
            <div className="space-y-6">
              <div>
                <h3 className="text-white font-bold text-sm uppercase tracking-widest mb-2">No Warranties</h3>
                <p className="text-slate-400 text-sm">
                  THE SERVICES ARE PROVIDED ON AN "AS-IS" AND "AS-AVAILABLE" BASIS. WE DISCLAIM ALL WARRANTIES, EXPRESS OR IMPLIED, REGARDING THE ACCURACY, TIMELINESS, OR COMPLETENESS OF THE DATA PROVIDED.
                </p>
              </div>
              <div className="h-px w-full bg-white/5"></div>
              <div>
                <h3 className="text-white font-bold text-sm uppercase tracking-widest mb-2">Limitation of Liability</h3>
                <p className="text-slate-400 text-sm">
                  IN NO EVENT SHALL THE OPERATORS BE LIABLE FOR ANY INDIRECT, CONSEQUENTIAL, OR INCIDENTAL DAMAGES ARISING FROM YOUR USE OF THE SITE. YOU AGREE THAT YOUR USE OF THE SERVICES IS AT YOUR SOLE RISK.
                </p>
              </div>
            </div>
          </div>
        </section>

      </div>

    </article>
  );
});

export default TermsOfService;
