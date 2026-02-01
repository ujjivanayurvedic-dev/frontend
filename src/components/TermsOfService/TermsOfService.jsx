import React, { memo } from 'react';

const TermsOfService = memo(function TermsOfService() {
  return (
    <article className="min-h-screen w-full bg-[#050505] text-slate-300 py-12 px-4 md:px-8">
      
      {/* --- HEADER SECTION --- */}
      <header className="max-w-4xl mx-auto mb-12 border-b border-white/10 pb-8">
        <h1 className="text-3xl md:text-5xl font-black text-white uppercase tracking-tight mb-4">
          Terms of Service
        </h1>
        <p className="text-yellow-500 font-mono text-sm tracking-widest uppercase">
          Effective Date: <span className="text-white">November 24, 2024</span>
        </p>
      </header>

      {/* --- CONTENT CONTAINER --- */}
      <div className="max-w-4xl mx-auto space-y-12">

        {/* 1. AGREEMENT */}
        <section aria-labelledby="section-1">
          <h2 id="section-1" className="text-xl md:text-2xl font-bold text-white mb-4 flex items-center gap-3">
            <span className="flex items-center justify-center w-8 h-8 rounded-full bg-slate-800 text-sm text-yellow-500 font-mono border border-white/10">1</span>
            AGREEMENT TO TERMS
          </h2>
          <div className="pl-0 md:pl-11 space-y-4 leading-relaxed">
            <p>
              These Terms of Service (“Terms”) constitute a legally binding agreement made between you ("the User") and the owners and operators of <span className="text-white font-semibold">satta-king-fast.com</span> ("we," "us," or "our"), concerning your access to and use of the Services.
            </p>
            <p className="bg-red-900/10 border-l-4 border-red-500/50 p-4 text-slate-200">
              By accessing the Services, you agree that you have read, understood, and agree to be bound by these Terms. <strong>If you do not agree, you are prohibited from using the Services and must discontinue use immediately.</strong>
            </p>
          </div>
        </section>

        {/* 2. DESCRIPTION OF SERVICES */}
        <section aria-labelledby="section-2">
          <h2 id="section-2" className="text-xl md:text-2xl font-bold text-white mb-4 flex items-center gap-3">
            <span className="flex items-center justify-center w-8 h-8 rounded-full bg-slate-800 text-sm text-yellow-500 font-mono border border-white/10">2</span>
            DESCRIPTION OF THE SERVICES
          </h2>
          <div className="pl-0 md:pl-11 space-y-6 leading-relaxed">
            <p>
              The services provided (collectively, "the Services") consist of an independent media platform and informational archive. Our function is to:
            </p>
            <ul className="list-disc list-inside space-y-2 marker:text-yellow-600 ml-2">
              <li>Aggregate, organize, and present publicly available data originating from offline, regional, or state-sanctioned public draws and announcements.</li>
              <li>Present this aggregated data for the purposes of journalistic analysis, public information, and statistical archiving.</li>
            </ul>
            
            <div className="bg-slate-900/50 p-6 rounded-xl border border-white/5 space-y-4">
              <h3 className="text-white font-bold text-sm uppercase tracking-wider">You acknowledge and agree to the following:</h3>
              <ul className="space-y-3 text-sm">
                <li className="flex gap-3 items-start">
                  <span className="text-yellow-500 mt-1">❖</span>
                  <span>The Services are provided for <strong>informational and historical reference only</strong>. The information provided is not intended as advice of any kind. The User agrees not to rely on the information on this Website for any personal or financial decision-making.</span>
                </li>
                <li className="flex gap-3 items-start">
                  <span className="text-yellow-500 mt-1">❖</span>
                  <span>The data provided is informational in nature. We do not guarantee the absolute accuracy, timeliness, or completeness of the data and disclaim any liability for errors or omissions.</span>
                </li>
                <li className="flex gap-3 items-start">
                  <span className="text-yellow-500 mt-1">❖</span>
                  <span>The Services are provided entirely free of charge. This is a <strong>non-transactional service</strong>, and we do not facilitate or accept any form of financial exchanges between users or third parties.</span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* 3. PRIVACY POLICY */}
        <section aria-labelledby="section-3">
          <h2 id="section-3" className="text-xl md:text-2xl font-bold text-white mb-4 flex items-center gap-3">
            <span className="flex items-center justify-center w-8 h-8 rounded-full bg-slate-800 text-sm text-yellow-500 font-mono border border-white/10">3</span>
            PRIVACY POLICY
          </h2>
          <p className="pl-0 md:pl-11 leading-relaxed">
            Our Privacy Policy, which is incorporated into these Terms, describes how we handle the information you may provide to us. By using the Services, you consent to the collection and use of this information as set forth in the Privacy Policy.
          </p>
        </section>

        {/* 4. USER ELIGIBILITY */}
        <section aria-labelledby="section-4">
          <h2 id="section-4" className="text-xl md:text-2xl font-bold text-white mb-4 flex items-center gap-3">
            <span className="flex items-center justify-center w-8 h-8 rounded-full bg-slate-800 text-sm text-yellow-500 font-mono border border-white/10">4</span>
            USER ELIGIBILITY AND RESPONSIBILITY
          </h2>
          <p className="pl-0 md:pl-11 leading-relaxed">
            The Services are intended for users who are of the legal age of majority in their jurisdiction. It is your <strong>sole and absolute responsibility</strong> to ensure that your access to and use of the Services is not in violation of any applicable local, state, or national law or regulation in your jurisdiction.
          </p>
        </section>

        {/* 5. GOVERNING LAW */}
        <section aria-labelledby="section-5">
          <h2 id="section-5" className="text-xl md:text-2xl font-bold text-white mb-4 flex items-center gap-3">
            <span className="flex items-center justify-center w-8 h-8 rounded-full bg-slate-800 text-sm text-yellow-500 font-mono border border-white/10">5</span>
            GOVERNING LAW AND JURISDICTION
          </h2>
          <p className="pl-0 md:pl-11 leading-relaxed">
            These Terms and any dispute that arises between you and us will be governed by the laws of the State of Wyoming, USA, without regard to its conflict of law principles. You agree that all disputes related to these Terms or the Services will be brought exclusively in the state and federal courts located in Cheyenne, Wyoming, USA. You hereby consent to the personal jurisdiction and venue in such forums.
          </p>
        </section>

        {/* 6. INTELLECTUAL PROPERTY */}
        <section aria-labelledby="section-6">
          <h2 id="section-6" className="text-xl md:text-2xl font-bold text-white mb-4 flex items-center gap-3">
            <span className="flex items-center justify-center w-8 h-8 rounded-full bg-slate-800 text-sm text-yellow-500 font-mono border border-white/10">6</span>
            INTELLECTUAL PROPERTY RIGHTS
          </h2>
          <p className="pl-0 md:pl-11 leading-relaxed">
            The Services and their original content, features, and functionality are and will remain the exclusive property of us and our licensors, protected by copyright, trademark, and other laws of the United States and foreign countries.
          </p>
        </section>

        {/* 7. PROHIBITED CONDUCT */}
        <section aria-labelledby="section-7">
          <h2 id="section-7" className="text-xl md:text-2xl font-bold text-white mb-4 flex items-center gap-3">
            <span className="flex items-center justify-center w-8 h-8 rounded-full bg-slate-800 text-sm text-yellow-500 font-mono border border-white/10">7</span>
            PROHIBITED CONDUCT
          </h2>
          <p className="pl-0 md:pl-11 leading-relaxed">
            You agree not to misuse the Services, including but not limited to, scraping, interfering with the network, or using the data for any commercial purpose without our prior written consent.
          </p>
        </section>

        {/* 8. DISCLAIMERS (Highlighted Box) */}
        <section aria-labelledby="section-8">
          <h2 id="section-8" className="text-xl md:text-2xl font-bold text-white mb-4 flex items-center gap-3">
            <span className="flex items-center justify-center w-8 h-8 rounded-full bg-slate-800 text-sm text-yellow-500 font-mono border border-white/10">8</span>
            DISCLAIMERS; LIMITATION OF LIABILITY
          </h2>
          <div className="pl-0 md:pl-11">
            <div className="bg-white/5 border border-white/10 p-6 rounded-lg space-y-4">
              <p className="uppercase font-bold text-xs tracking-widest text-slate-500 mb-2">Important Notice</p>
              <p className="text-slate-200 font-medium">
                THE SERVICES ARE PROVIDED "AS-IS" AND "AS-AVAILABLE" AT YOUR SOLE RISK. TO THE MAXIMUM EXTENT PERMITTED BY LAW, WE DISCLAIM ALL WARRANTIES, EXPRESS OR IMPLIED, OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, OR NON-INFRINGEMENT.
              </p>
              <div className="h-px w-full bg-white/10 my-4"></div>
              <p className="text-slate-200 font-medium">
                <span className="text-yellow-500">LIMITATION OF LIABILITY:</span> IN NO EVENT SHALL WE BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, OR ANY LOSS OF PROFITS OR REVENUES. OUR AGGREGATE LIABILITY SHALL NOT EXCEED ONE HUNDRED U.S. DOLLARS (U.S. $100.00).
              </p>
            </div>
          </div>
        </section>

        {/* 9. GENERAL TERMS */}
        <section aria-labelledby="section-9">
          <h2 id="section-9" className="text-xl md:text-2xl font-bold text-white mb-4 flex items-center gap-3">
            <span className="flex items-center justify-center w-8 h-8 rounded-full bg-slate-800 text-sm text-yellow-500 font-mono border border-white/10">9</span>
            GENERAL TERMS
          </h2>
          <ul className="pl-0 md:pl-11 space-y-3 leading-relaxed">
            <li>
              <strong className="text-white">Entire Agreement:</strong> These Terms constitute the entire agreement between you and us regarding the Services.
            </li>
            <li>
              <strong className="text-white">Severability:</strong> If any provision is held to be invalid, the remaining provisions will remain in full force.
            </li>
            <li>
              <strong className="text-white">Revisions:</strong> We may revise these Terms from time to time. By continuing to access or use the Services after revisions become effective, you agree to be bound by the revised Terms.
            </li>
          </ul>
        </section>

      </div>

      {/* --- FOOTER NOTE --- */}
      <footer className="max-w-4xl mx-auto mt-16 pt-8 border-t border-white/10 text-center">
        <p className="text-xs text-slate-500 uppercase tracking-widest">
          ©  Satta-King-Fast.com &bull; All Rights Reserved
        </p>
      </footer>

    </article>
  );
});

export default TermsOfService;