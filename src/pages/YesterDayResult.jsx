import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from 'framer-motion';
import { History, Search, RefreshCcw, ShieldCheck, ArrowUpRight,Clock } from 'lucide-react';
import api from '../api/api';

const YesterDayResult = () => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');
  const [targetDate, setTargetDate] = useState('');

  // ARCHIVE PALETTE (Industrial Earth Tones - No Black/Blue/Purple/Cyan)
  const archiveThemes = [
    { border: "border-orange-500/30", text: "text-orange-500", glow: "bg-orange-500/10", shadow: "shadow-orange-900/20" },
    { border: "border-emerald-500/30", text: "text-emerald-500", glow: "bg-emerald-500/10", shadow: "shadow-emerald-900/20" },
    { border: "border-amber-500/30", text: "text-amber-500", glow: "bg-amber-500/10", shadow: "shadow-amber-900/20" },
    { border: "border-rose-500/30", text: "text-rose-500", glow: "bg-rose-500/10", shadow: "shadow-rose-900/20" },
  ];

  const fetchYesterdayData = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${api.NewScrapeData.gameChartLive}?_t=${Date.now()}`);
      const data = await response.json();
      
      if (data.success && data.data && data.data.length > 1) {
        // Index [1] is Yesterday in the API array
        const yesterdayData = data.data[1]; 
        setTargetDate(yesterdayData.date);
        
        const allGameNames = ["DESAWAR", "GALI", "FARIDABAD", "GHAZIABAD", "SHRI GANESH", "DELHI BAZAR", "NOIDA KING"];
        
        const processed = allGameNames.map((name, index) => {
          const gameInfo = yesterdayData.games[name] || {};
          return {
            name,
            result: gameInfo.result || "--",
            time: gameInfo.time || "CLOSED",
            theme: archiveThemes[index % archiveThemes.length]
          };
        });
        
        setResults(processed);
      }
    } catch (error) {
      console.error("Archive Fetch Error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchYesterdayData();
  }, []);

  // Create meta description dynamically based on results
  const createMetaDescription = () => {
    if (results.length === 0) return "View yesterday's game results including DESAWAR, GALI, FARIDABAD, GHAZIABAD, and other popular games.";
    
    const activeGames = results.filter(g => g.result !== "--").slice(0, 3);
    const gameList = activeGames.map(g => `${g.name}: ${g.result}`).join(", ");
    return `Yesterday's results: ${gameList}. Check verified historical data for all major games including timings and security status. Updated on ${targetDate}.`;
  };

  // Create structured data for Google
  const createStructuredData = () => {
    const structuredData = {
      "@context": "https://schema.org",
      "@type": "Dataset",
      "name": "Yesterday's Game Results Archive",
      "description": createMetaDescription(),
      "dateModified": new Date().toISOString(),
      "temporalCoverage": targetDate,
      "keywords": results.map(game => game.name).join(", "),
      "creator": {
        "@type": "Organization",
        "name": "Game Results Archive"
      },
      "includedInDataCatalog": {
        "@type": "DataCatalog",
        "name": "Historical Game Results"
      }
    };
    
    return JSON.stringify(structuredData);
  };

  return (
    <>
      {/* SEO Meta Tags */}
      <Helmet>
        <title>Yesterday's Game Results Archive | Verified Historical Data</title>
        <meta name="description" content={createMetaDescription()} />
        <meta name="keywords" content="yesterday result, game results, DESAWAR, GALI, FARIDABAD, GHAZIABAD, SHRI GANESH, DELHI BAZAR, NOIDA KING, historical data, archive" />
        <meta property="og:title" content={`Yesterday's Results (${targetDate})`} />
        <meta property="og:description" content={createMetaDescription()} />
        <meta property="og:type" content="website" />
        <meta property="og:locale" content="en_US" />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href={`https://yourdomain.com/yesterday-results/${targetDate.replace(/\//g, '-')}`} />
        
        {/* Structured Data for SEO */}
        <script type="application/ld+json">
          {createStructuredData()}
        </script>
      </Helmet>

      <div className="min-h-screen bg-[#222428] text-[#e2e2e2] p-4 md:p-12 font-sans relative overflow-x-hidden">
        
        {/* RADIANT AMBIENT BACKGROUND GLOW */}
        <div className="fixed inset-0 pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-full h-[40%] bg-orange-500/5 blur-[120px] rounded-full" />
          <div className="absolute bottom-[-10%] right-[-10%] w-full h-[40%] bg-emerald-500/5 blur-[120px] rounded-full" />
        </div>

        <div className="relative z-10 max-w-6xl mx-auto">
          
          {/* MOBILE-FIRST HEADER */}
          <header className="mb-12 space-y-6">
            <div className="flex items-center justify-between">
              <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="flex items-center gap-4">
                <div className="w-12 h-12 bg-[#2d2f34] rounded-2xl flex items-center justify-center border border-white/5 shadow-2xl">
                  <History className="text-orange-500" size={26} />
                </div>
                <div>
                  <h1 className="text-3xl font-black tracking-tight uppercase leading-none">
                    Yesterday's <span className="text-orange-500">Game Results</span>
                  </h1>
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.4em] mt-1 italic">
                    Date: {targetDate || "06-02-2026"}
                  </p>
                </div>
              </motion.div>
              
              <motion.button 
                whileTap={{ scale: 0.9 }}
                onClick={fetchYesterdayData}
                className="w-12 h-12 bg-[#2d2f34] border border-white/5 rounded-2xl flex items-center justify-center text-slate-400 hover:text-orange-500 shadow-xl"
                aria-label="Refresh yesterday's results"
              >
                <RefreshCcw size={20} className={loading ? "animate-spin text-orange-500" : ""} />
              </motion.button>
            </div>

            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
              <input 
                type="text" 
                placeholder="SEARCH PREVIOUS RECORD..." 
                className="bg-[#1b1c20] border border-white/5 rounded-2xl py-5 pl-12 pr-6 outline-none focus:border-orange-500/40 transition-all w-full text-sm font-bold tracking-tight shadow-inner"
                onChange={(e) => setFilter(e.target.value)}
                aria-label="Search through yesterday's game results"
              />
            </div>
          </header>

          {/* 3D SQUARE BOX GRID */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-10 perspective-[1500px]">
            <AnimatePresence>
              {results.filter(g => g.name.toLowerCase().includes(filter.toLowerCase())).map((game, index) => (
                <motion.div
                  key={game.name}
                  initial={{ opacity: 0, rotateX: -10 }}
                  animate={{ opacity: 1, rotateX: 0 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ y: -8, rotateY: 5 }}
                  className="group relative transform-gpu"
                  style={{ transformStyle: 'preserve-3d' }}
                >
                  {/* 3D SQUARE BOX */}
                  <div className={`relative aspect-square bg-[#282a2f] rounded-[44px] border border-white/5 p-8 flex flex-col justify-between shadow-2xl overflow-hidden`}>
                    
                    {/* DYNAMIC HOVER GLOW */}
                    <div className={`absolute -top-10 -right-10 w-40 h-40 ${game.theme.glow} blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />

                    <div className="flex justify-between items-start" style={{ transform: 'translateZ(30px)' }}>
                      <div>
                        <span className="text-[9px] font-black text-slate-600 uppercase tracking-widest block mb-1">Archived_Log</span>
                        <h3 className={`text-2xl font-black tracking-tighter uppercase leading-none ${game.theme.text}`}>
                          {game.name}
                        </h3>
                      </div>
                    </div>

                    {/* 3D FLOATING RESULT */}
                    <div className="flex flex-col items-center" style={{ transform: 'translateZ(60px)' }}>
                      <h2 className="text-8xl font-black tabular-nums tracking-tighter text-white drop-shadow-[0_10px_20px_rgba(0,0,0,0.4)]">
                        {game.result}
                      </h2>
                      <div className="mt-4 flex items-center gap-2 px-4 py-1.5 bg-white/5 rounded-full border border-white/5">
                          <Clock size={12} className="text-orange-500" />
                          <span className="text-[10px] font-black text-slate-400 tabular-nums uppercase">{game.time}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between border-t border-white/5 pt-6" style={{ transform: 'translateZ(20px)' }}>
                      <div className="flex flex-col">
                        <span className="text-[8px] font-black text-slate-600 uppercase tracking-widest leading-none">Security Status</span>
                        <span className="text-[10px] font-bold text-emerald-600 uppercase mt-1 flex items-center gap-1">
                          <ShieldCheck size={10} /> Verified Data
                        </span>
                      </div>
                      
                      <motion.div 
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className={`w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:text-white hover:bg-orange-500 transition-all cursor-pointer`}
                      >
                        <ArrowUpRight size={22} />
                      </motion.div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </>
  );
};

export default YesterDayResult;