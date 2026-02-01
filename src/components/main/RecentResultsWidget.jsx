import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import api from '../../api/api';

const RecentResultsWidget = () => {
  // 1. Initialize State (Empty by default for instant load)
  const [latestResults, setLatestResults] = useState([]);

  // 2. SEO-Friendly Date (Memoized)
  const todayStr = useMemo(() => {
    const d = new Date();
    // Format: DD-MM-YYYY
    return `${String(d.getDate()).padStart(2, '0')}-${String(d.getMonth() + 1).padStart(2, '0')}-${d.getFullYear()}`;
  }, []);

  // 3. Fetch Logic
  useEffect(() => {
    let isMounted = true;

    const fetchLiveResults = async () => {
      try {
        const response = await axios.get(api.NewScrapeData.gameChartRecent);
        
        if (isMounted && response.data && response.data.success) {
          processData(response.data.data);
        }
      } catch (error) {
        console.error("Live feed error:", error);
      }
    };

    fetchLiveResults(); // Call immediately
    const interval = setInterval(fetchLiveResults, 20000); // Auto-refresh 20s
    
    return () => { clearInterval(interval); isMounted = false; };
  }, []); 

  const processData = (data) => {
    if (!data || data.length === 0) return;

    const todayData = data[0]; 
    if (!todayData || !todayData.games) return;

    // Convert object to array & sort by time (Newest First)
    const declaredGames = Object.entries(todayData.games)
      .map(([name, val]) => ({
        name: name,
        result: val.result,
        timestamp: val.timestamp
      }))
      .sort((a, b) => b.timestamp - a.timestamp);

    setLatestResults(declaredGames);
  };

  return (
    <section 
      className="w-full max-w-md mx-auto mt-6 bg-gradient-to-b from-slate-900 to-black p-5 rounded-3xl shadow-2xl border border-slate-800 relative overflow-hidden"
      aria-label="Fastest Satta King Results Live"
    >
      {/* CSS-Only Glow (No Image) */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-32 bg-yellow-500/20 blur-[80px] rounded-full pointer-events-none" aria-hidden="true"></div>
      
      {/* HEADER */}
      <header className="relative z-10 flex justify-between items-center mb-6 px-1">
        <div>
          <h2 className="text-white text-xl font-black tracking-wider italic">
            FAST RESULT
          </h2>
          <time className="text-slate-400 text-[11px] font-bold uppercase tracking-widest mt-1 block">
            {todayStr}
          </time>
        </div>

        {/* Live Badge */}
        <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/50 px-3 py-1 rounded-full">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
          </span>
          <span className="text-[10px] font-bold text-red-500 tracking-wider">LIVE</span>
        </div>
      </header>

      {/* RESULTS AREA */}
      <div className="relative z-10 min-h-[100px]" role="status" aria-live="polite">
        
        {latestResults.length === 0 ? (
          // CLEAN TEXT ONLY (No Icon/Image)
          <div className="mt-6 text-center">
            <p className="text-gray-400 text-sm font-medium tracking-wide animate-pulse">
              Waiting for updates...
            </p>
          </div>
        ) : (
          // DATA LIST
          <div className="flex flex-col gap-4">
            {latestResults.map((game, index) => {
              const isLatest = index === 0;
              
              return (
                <article 
                  key={game.name} 
                  className={`relative rounded-2xl border transition-all duration-500 ${
                    isLatest 
                      ? 'bg-gradient-to-r from-slate-800 to-slate-900 border-yellow-500/50 shadow-md' 
                      : 'bg-white/5 border-white/10'
                  }`}
                >
                  <div className={`flex items-center justify-between ${isLatest ? 'p-5' : 'p-4'}`}>
                    
                    {/* Game Name */}
                    <div className="flex flex-col gap-1">
                      {isLatest && (
                        <span className="text-[9px] font-bold text-yellow-400 uppercase tracking-widest">
                          Just Announced
                        </span>
                      )}
                      <h3 className={`font-black uppercase tracking-tight text-white ${isLatest ? 'text-2xl' : 'text-lg text-slate-300'}`}>
                        {game.name}
                      </h3>
                    </div>

                    {/* Result Number */}
                    <div className={`relative flex items-center justify-center rounded-full font-black font-mono shadow-inner ${
                      isLatest 
                        ? 'w-16 h-16 text-4xl text-black bg-gradient-to-br from-yellow-300 via-yellow-400 to-yellow-600' 
                        : 'w-12 h-12 text-xl text-white bg-gradient-to-br from-slate-600 to-slate-800 border border-slate-500'
                    }`}>
                      <span className="relative z-10 drop-shadow-sm">
                        {game.result}
                      </span>
                    </div>

                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};

export default RecentResultsWidget;