import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, Calendar, RefreshCw, Zap, ChevronRight, Search, Activity, ShieldCheck, Flame } from 'lucide-react';
import api from '../api/api';

// SEO Metadata component
const SEOHead = () => {
  const pageTitle = "Satta Live Results | Real-time Market Updates | Delhi Bazar";
  const pageDescription = "Get live Satta results for DESAWAR, GALI, FARIDABAD, GHAZIABAD, SHRI GANESH, DELHI BAZAR, NOIDA KING with real-time updates and secure data feeds.";
  const keywords = "satta live, satta results, desawar result, gali satta, faridabad result, ghaziabad result, delhi bazar, noida king, satta market, live satta results";
  const canonicalUrl = "https://yourdomain.com/today-results";

  return (
    <>
      <title>{pageTitle}</title>
      <meta name="description" content={pageDescription} />
      <meta name="keywords" content={keywords} />
      <meta name="robots" content="index, follow" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta name="author" content="Noida King Infrastructure" />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:title" content={pageTitle} />
      <meta property="og:description" content={pageDescription} />
      <meta property="og:image" content="https://yourdomain.com/og-image.jpg" />
      
      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={pageTitle} />
      <meta name="twitter:description" content={pageDescription} />
      <meta name="twitter:image" content="https://yourdomain.com/twitter-image.jpg" />
      
      {/* Canonical */}
      <link rel="canonical" href={canonicalUrl} />
      
      {/* Structured Data / JSON-LD */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebPage",
          "name": pageTitle,
          "description": pageDescription,
          "url": canonicalUrl,
          "publisher": {
            "@type": "Organization",
            "name": "Noida King Infrastructure",
            "foundingDate": "2026"
          },
          "mainEntity": {
            "@type": "ItemList",
            "name": "Live Satta Results",
            "description": "Daily satta results for popular markets",
            "numberOfItems": 7,
            "itemListElement": [
              {
                "@type": "ListItem",
                "position": 1,
                "name": "DESAWAR Result"
              },
              {
                "@type": "ListItem",
                "position": 2,
                "name": "GALI Result"
              },
              {
                "@type": "ListItem",
                "position": 3,
                "name": "FARIDABAD Result"
              },
              {
                "@type": "ListItem",
                "position": 4,
                "name": "GHAZIABAD Result"
              },
              {
                "@type": "ListItem",
                "position": 5,
                "name": "SHRI GANESH Result"
              },
              {
                "@type": "ListItem",
                "position": 6,
                "name": "DELHI BAZAR Result"
              },
              {
                "@type": "ListItem",
                "position": 7,
                "name": "NOIDA KING Result"
              }
            ]
          }
        })}
      </script>
    </>
  );
};

const TodayResult = () => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');
  const [lastUpdated, setLastUpdated] = useState(new Date().toLocaleTimeString());

  // LUXURY EARTH PALETTE (No Black, No Blue, No Purple, No Cyan)
  const cardThemes = [
    { border: "border-emerald-500/40", glow: "bg-emerald-500/10", text: "text-emerald-400", btn: "bg-emerald-500" },
    { border: "border-orange-500/40", glow: "bg-orange-500/10", text: "text-orange-400", btn: "bg-orange-500" },
    { border: "border-amber-500/40", glow: "bg-amber-500/10", text: "text-amber-400", btn: "bg-amber-500" },
    { border: "border-rose-500/40", glow: "bg-rose-500/10", text: "text-rose-400", btn: "bg-rose-500" },
    { border: "border-lime-500/40", glow: "bg-lime-500/10", text: "text-lime-400", btn: "bg-lime-500" },
  ];

  const fetchAllData = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${api.NewScrapeData.gameChartLive}?_t=${Date.now()}`);
      const data = await response.json();
      if (data.success && data.data) {
        const latestDay = data.data[0];
        const prevDay = data.data[1] || { games: {} };
        const allGameNames = ["DESAWAR", "GALI", "FARIDABAD", "GHAZIABAD", "SHRI GANESH", "DELHI BAZAR", "NOIDA KING"];
        
        const processedResults = allGameNames.map((name, index) => {
          const todayGame = latestDay.games[name];
          const yesterdayGame = prevDay.games[name];
          const activeGame = (todayGame && todayGame.result && todayGame.result !== "??") 
            ? { ...todayGame, date: latestDay.date, isToday: true } 
            : { ...yesterdayGame, date: prevDay.date, isToday: false };

          return {
            name: name,
            result: activeGame.result || "--",
            time: activeGame.time || "00:00",
            date: activeGame.date,
            isToday: activeGame.isToday,
            theme: cardThemes[index % cardThemes.length]
          };
        });
        setResults(processedResults);
        setLastUpdated(new Date().toLocaleTimeString());
      }
    } catch (error) { console.error(error); } finally { setLoading(false); }
  };

  useEffect(() => {
    fetchAllData();
    // Preload for better performance
    const preloadImage = (src) => {
      const img = new Image();
      img.src = src;
    };
    preloadImage('https://yourdomain.com/og-image.jpg');
  }, []);

  return (
    <>
      <SEOHead />
      
      <div className="min-h-screen bg-[#1e1f23] text-[#f4f4f5] p-4 md:p-12 font-sans overflow-x-hidden relative">
        
        {/* SEMANTIC HEADER */}
        <header className="relative z-10 max-w-6xl mx-auto mb-10 space-y-6">
          <div className="flex items-center justify-between">
            <motion.div 
              initial={{ opacity: 0, x: -20 }} 
              animate={{ opacity: 1, x: 0 }} 
              className="flex items-center gap-3"
            >
              <div className="w-10 h-10 bg-orange-500 rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(249,115,22,0.4)]">
                <Flame size={24} className="text-[#1e1f23]" strokeWidth={3} />
              </div>
              <div>
                <h1 className="text-2xl font-black tracking-tighter uppercase leading-none">
                  SATTA <span className="text-orange-500">LIVE</span>
                </h1>
                <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mt-1">
                  Terminal Sync: {lastUpdated}
                </p>
              </div>
            </motion.div>
            <button 
              onClick={fetchAllData} 
              aria-label="Refresh results"
              className="w-12 h-12 bg-[#2a2b30] border border-white/5 rounded-2xl flex items-center justify-center text-orange-500 shadow-xl active:scale-90 transition-transform"
            >
              <RefreshCw size={20} className={loading ? "animate-spin" : ""} />
            </button>
          </div>

          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
            <input 
              type="text" 
              placeholder="SEARCH MARKET ID..." 
              aria-label="Search satta markets"
              className="bg-[#2a2b30] border border-white/5 rounded-2xl py-4 pl-12 pr-6 outline-none focus:border-orange-500/50 transition-all w-full text-sm font-bold tracking-tight"
              onChange={(e) => setFilter(e.target.value)}
            />
          </div>
        </header>

        {/* SEMANTIC MAIN CONTENT */}
        <main className="relative z-10 max-w-6xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 perspective-[1500px]">
            <AnimatePresence>
              {results.filter(g => g.name.toLowerCase().includes(filter.toLowerCase())).map((game, index) => (
                <motion.article
                  key={game.name}
                  initial={{ opacity: 0, rotateX: -15, y: 30 }}
                  animate={{ opacity: 1, rotateX: 0, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -10, rotateY: 5 }}
                  className="group relative transform-gpu"
                  style={{ transformStyle: 'preserve-3d' }}
                  itemScope
                  itemType="https://schema.org/Game"
                >
                  {/* 3D SQUARE BOX */}
                  <div className={`relative aspect-square bg-[#25262b] rounded-[48px] border-b-[6px] border-r-4 border-black/20 p-8 flex flex-col justify-between overflow-hidden shadow-2xl transition-all duration-300`}>
                    
                    {/* INTERNAL GLOW */}
                    <div className={`absolute -top-10 -right-10 w-40 h-40 ${game.theme.glow} blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />

                    <div className="flex justify-between items-start" style={{ transform: 'translateZ(30px)' }}>
                      <div>
                        <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-1">
                          DATA_STREAM
                        </span>
                        <h2 className={`text-2xl font-black tracking-tighter uppercase leading-none ${game.theme.text}`} itemProp="name">
                          {game.name}
                        </h2>
                      </div>
                      <div className={`w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center border border-white/10 ${game.isToday ? 'text-orange-500' : 'text-slate-600'}`}>
                        <Zap size={18} fill={game.isToday ? "currentColor" : "none"} />
                      </div>
                    </div>

                    {/* POP-OUT NUMBER (3D LOOK) */}
                    <div className="flex flex-col items-center" style={{ transform: 'translateZ(60px)' }}>
                      <motion.h3 
                        className="text-8xl font-black tabular-nums tracking-tighter text-white drop-shadow-[0_15px_15px_rgba(0,0,0,0.5)]"
                        itemProp="gameResult"
                      >
                        {game.result}
                      </motion.h3>
                      <div className={`mt-2 h-1.5 w-12 rounded-full ${game.isToday ? 'bg-orange-500 animate-pulse' : 'bg-slate-700'}`} />
                    </div>

                    <div className="flex items-center justify-between border-t border-white/5 pt-6" style={{ transform: 'translateZ(20px)' }}>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400">
                          <Clock size={12} className="text-orange-500" /> 
                          <time itemProp="startTime">{game.time}</time>
                        </div>
                        <div className="flex items-center gap-2 text-[10px] font-bold text-slate-500">
                          <Calendar size={12} /> 
                          <time itemProp="datePublished">{game.date}</time>
                        </div>
                      </div>
                      <motion.button 
                        whileTap={{ scale: 0.9 }} 
                        className={`w-12 h-12 rounded-2xl ${game.theme.btn} text-[#1e1f23] flex items-center justify-center shadow-lg cursor-pointer`}
                        aria-label={`View ${game.name} details`}
                      >
                        <ChevronRight size={24} strokeWidth={3} />
                      </motion.button>
                    </div>
                  </div>
                </motion.article>
              ))}
            </AnimatePresence>
          </div>
        </main>
        {/* BACKGROUND DEPTH GLOW */}
        <div className="fixed inset-0 pointer-events-none">
          <div className="absolute top-[-5%] left-[-10%] w-[120%] h-[40%] bg-emerald-600/5 blur-[100px] rounded-full" />
          <div className="absolute bottom-[0%] right-[-10%] w-full h-[50%] bg-orange-600/5 blur-[120px] rounded-full" />
        </div>
      </div>
    </>
  );
};

export default TodayResult;