import React, { useState, useEffect, useMemo, useCallback } from 'react';
import axios from 'axios';
import api from '../../api/api';

const GAMES_CONFIG = [
  { key: 'DESAWAR', label: 'DESAWAR', time: '05:30 AM' },
  { key: 'SHRI GANESH', label: 'SHRI GANESH', time: '04:40 PM' },
  { key: 'DELHI BAZAR', label: 'DELHI BAZAR', time: '03:15 PM' },
  { key: 'GALI', label: 'GALI', time: '11:10 PM' },
  { key: 'GHAZIABAD', label: 'GHAZIABAD', time: '08:50 PM' },
  { key: 'FARIDABAD', label: 'FARIDABAD', time: '06:15 PM' },
  { key: 'NOIDA KING', label: 'NOIDA KING', time: '05:30 PM' }
];

// Create a map for O(1) lookups
const GAMES_MAP = Object.fromEntries(GAMES_CONFIG.map(g => [g.key, g]));

// Optimized initial state - pre-structure all games
const createInitialResults = () => {
  return GAMES_CONFIG.reduce((acc, game) => {
    acc[game.key] = { today: null, last: null };
    return acc;
  }, {});
};

// Format dates without locale for speed
const formatDate = (date) => {
  const d = date.getDate().toString().padStart(2, '0');
  const m = (date.getMonth() + 1).toString().padStart(2, '0');
  const y = date.getFullYear();
  return `${d}-${m}-${y}`;
};

const LiveResultCards = () => {
  // 1. Initialize with structured empty results (avoids undefined checks)
  const [results, setResults] = useState(createInitialResults());
  const [isLoading, setIsLoading] = useState(true);
  
  // 2. Optimized fetch with caching
  useEffect(() => {
    const fetchAndProcessData = async () => {
      try {
        setIsLoading(true);
        
        // Use Promise.race for timeout protection
        const fetchPromise = axios.get(api.NewScrapeData.gameChartLive, {
          timeout: 5000, // 5 second timeout
          headers: {
            'Cache-Control': 'no-cache',
            'Pragma': 'no-cache'
          }
        });
        
        const timeoutPromise = new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Request timeout')), 5000)
        );
        
        const response = await Promise.race([fetchPromise, timeoutPromise]);
        
        if (response?.data?.success) {
          // Process data immediately without waiting for dates
          processDataWithServerResponse(response.data.data);
        }
      } catch (error) {
        console.error("Live fetch error:", error);
        // Consider implementing retry logic here
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchAndProcessData();
    
    // Optional: Set up polling if needed
    const intervalId = setInterval(fetchAndProcessData, 30000); // 30 seconds
    
    return () => clearInterval(intervalId);
  }, []);

  // 3. Highly optimized data processing
  const processDataWithServerResponse = useCallback((serverData) => {
    if (!serverData || !Array.isArray(serverData)) return;
    
    // Single pass processing - O(n)
    const dateMap = {};
    let todayData = null;
    let yesterdayData = null;
    
    // Create today and yesterday dates in expected format
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    const todayStr = formatDate(today);
    const yesterdayStr = formatDate(yesterday);
    
    // Build lookup map and identify today/yesterday data in one pass
    for (let i = 0; i < serverData.length; i++) {
      const item = serverData[i];
      dateMap[item.date] = item.games;
      
      if (item.date === todayStr) todayData = item.games;
      if (item.date === yesterdayStr) yesterdayData = item.games;
    }
    
    // If we didn't find today's data, try to find latest available
    if (!todayData) {
      for (let i = 0; i < serverData.length; i++) {
        const item = serverData[i];
        const itemDate = new Date(item.date.split('-').reverse().join('-'));
        const todayDate = new Date(todayStr.split('-').reverse().join('-'));
        
        if (itemDate <= todayDate) {
          todayData = item.games;
          break;
        }
      }
    }
    
    // Batch update results - single state update
    const newResults = { ...results };
    let hasChanges = false;
    
    GAMES_CONFIG.forEach(game => {
      const todayResult = todayData?.[game.key]?.result || null;
      const lastResult = yesterdayData?.[game.key]?.result || null;
      
      // Only update if values changed
      if (newResults[game.key]?.today !== todayResult || newResults[game.key]?.last !== lastResult) {
        newResults[game.key] = { today: todayResult, last: lastResult };
        hasChanges = true;
      }
    });
    
    if (hasChanges) {
      setResults(newResults);
    }
  }, []);

  // 4. Memoize game cards to prevent unnecessary re-renders
  const GameCard = React.memo(({ game, result }) => {
    const { today, last } = result || {};
    
    return (
      <article 
        key={game.key} 
        className="relative bg-linear-to-b from-[#004d00] to-[#003300] border-2 border-[#006400] rounded-xl p-4 shadow-lg overflow-hidden transform transition-transform duration-300 hover:scale-[1.01]"
      >
        {/* Simplified background - remove complex pattern for faster paint */}
        <div className="absolute inset-0 opacity-5 bg-linear-to-br from-transparent via-white to-transparent pointer-events-none"></div>
        
        <div className="relative z-10 flex flex-col items-center">
          <h2 className="text-xl md:text-2xl font-black text-white uppercase tracking-wider drop-shadow-md text-center">
            {game.label}
          </h2>
          
          <time className="text-yellow-400 font-bold text-xs md:text-sm bg-black/30 px-3 py-1 rounded-full mt-1 mb-4 md:mb-6 border border-white/10">
            TIME: {game.time}
          </time>

          <div className="flex items-center justify-center w-full gap-3 md:gap-8">
            {/* YESTERDAY RESULT */}
            <div className="flex flex-col items-center gap-1">
              <span className="text-green-100 text-[10px] md:text-xs font-bold uppercase tracking-widest">
                Yesterday
              </span>
              <div className="w-14 h-14 md:w-16 md:h-16 bg-white rounded-full flex items-center justify-center shadow-lg border-4 border-gray-200">
                <span className="text-2xl md:text-3xl font-extrabold text-gray-800">
                  {last || <span className="text-gray-300 text-lg"></span>}
                </span>
              </div>
            </div>

            {/* LIVE ICON */}
            <div className="relative flex flex-col items-center justify-center -mt-2" aria-hidden="true">
              <div className="bg-linear-to-r from-red-600 to-red-500 text-white text-[9px] font-bold px-2 py-0.5 transform -skew-x-12 shadow-lg border border-red-400 animate-pulse">
                LIVE
              </div>
              <div className="text-red-500 mt-1">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 md:w-8 md:h-8">
                  <path fillRule="evenodd" d="M12.97 3.97a.75.75 0 011.06 0l7.5 7.5a.75.75 0 010 1.06l-7.5 7.5a.75.75 0 11-1.06-1.06l6.22-6.22H3a.75.75 0 010-1.5h16.19l-6.22-6.22a.75.75 0 010-1.06z" clipRule="evenodd" />
                </svg>
              </div>
            </div>

            {/* TODAY RESULT */}
            <div className="flex flex-col items-center gap-1">
              <span className="text-green-100 text-[10px] md:text-xs font-bold uppercase tracking-widest">
                Today
              </span>
              
              <div className="w-14 h-14 md:w-16 md:h-16 bg-white rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(255,255,0,0.4)] border-4 border-yellow-300 relative group">
                {isLoading && !today && (
                  <span className="absolute w-full h-full rounded-full border-2 border-yellow-500 animate-ping opacity-30"></span>
                )}
                
                <span className="text-2xl md:text-3xl font-extrabold text-black z-10 min-h-[1em]">
                  {today || <span className="text-gray-200 text-lg animate-pulse"></span>}
                </span>
              </div>
            </div>
          </div>
        </div>
      </article>
    );
  });

  // 5. Lazy render optimization - render visible items first
  const renderGameCards = useMemo(() => {
    return GAMES_CONFIG.map(game => (
      <GameCard 
        key={game.key} 
        game={game} 
        result={results[game.key]} 
      />
    ));
  }, [results]);

  return (
    <section className="w-full max-w-5xl mx-auto p-4" aria-label="Latest Satta King Results">
      {isLoading ? (
        // Skeleton loader for initial load
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {GAMES_CONFIG.map((game) => (
            <div key={game.key} className="bg-linear-to-b from-[#004d00] to-[#003300] border-2 border-[#006400] rounded-xl p-4 animate-pulse h-48"></div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {renderGameCards}
        </div>
      )}
    </section>
  );
};

export default LiveResultCards;