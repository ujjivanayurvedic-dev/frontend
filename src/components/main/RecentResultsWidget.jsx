import React, { useState, useEffect, useRef } from 'react';
import api from '../../api/api';

const RecentResultsWidget = () => {
  // State
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState('');
  const [dataSource, setDataSource] = useState('today'); 
  const [error, setError] = useState(null);
  
  // Refs for cleanup
  const isMounted = useRef(true);
  const abortControllerRef = useRef(null);
  
  // Get formatted dates
  const getDates = () => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    const format = (date) => {
      return `${String(date.getDate()).padStart(2, '0')}-${String(date.getMonth() + 1).padStart(2, '0')}-${date.getFullYear()}`;
    };
    
    return {
      today: format(today),
      yesterday: format(yesterday),
      todayReadable: today.toLocaleDateString('en-IN', { 
        weekday: 'short', 
        day: 'numeric', 
        month: 'short' 
      })
    };
  };
  
  const dates = getDates();
  
  // Parse time string to 24-hour format
  const parseTimeString = (timeStr, dateStr) => {
    if (!timeStr) return new Date().getTime();
    
    const [time, period] = timeStr.toLowerCase().split(' ');
    const [hours, minutes] = time.split(':').map(Number);
    const [day, month, year] = dateStr.split('-').map(Number);
    
    let hour24 = hours;
    if (period === 'pm' && hours < 12) {
      hour24 = hours + 12;
    } else if (period === 'am' && hours === 12) {
      hour24 = 0;
    }
    
    return new Date(year, month - 1, day, hour24, minutes).getTime();
  };
  
  // Format time to 12-hour with AM/PM
  const formatTime = (timestamp) => {
    if (!timestamp) return '--:--';
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-IN', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    }).toUpperCase();
  };
  
  // Get time ago text
  const getTimeAgo = (timestamp) => {
    if (!timestamp) return '';
    const now = Date.now();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes} min ago`;
    if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    if (days < 2) return 'Yesterday';
    return `${days} days ago`;
  };
  
  // Fetch data using your API
  const fetchData = async () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    abortControllerRef.current = new AbortController();
    
    if (!isMounted.current) return;
    
    if (results.length === 0) setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`${api.NewScrapeData.gameChartLive}?_t=${Date.now()}`, {
        method: 'GET',
        signal: abortControllerRef.current.signal,
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      
      const data = await response.json();
      
      if (isMounted.current && data.success && data.data) {
        processGameChartData(data.data);
        setLastUpdate(new Date().toLocaleTimeString('en-IN', { 
          hour: '2-digit', 
          minute: '2-digit',
          second: '2-digit'
        }));
      }
    } catch (error) {
      if (error.name === 'AbortError') {
        return; 
      }
      
      console.error('Fetch error:', error.message);
      if (isMounted.current) {
        setError('Connection issue. Please check your network.');
        if (results.length === 0) {
          setResults(getPlaceholderData());
        }
      }
    } finally {
      if (isMounted.current) {
        setLoading(false);
      }
    }
  };
  
  // Process the game-chart-live API response
  const processGameChartData = (apiData) => {
    if (!apiData || !Array.isArray(apiData)) {
      setResults(getPlaceholderData());
      setDataSource('none');
      return;
    }
    
    // Collect ALL games from all dates
    let allGames = [];
    
    apiData.forEach(dayData => {
      if (dayData.games && dayData.date) {
        Object.entries(dayData.games).forEach(([gameName, gameInfo]) => {
          if (gameInfo.result && gameInfo.time) {
            const timestamp = parseTimeString(gameInfo.time, dayData.date);
            
            allGames.push({
              name: gameName,
              result: gameInfo.result,
              timestamp: timestamp,
              formattedTime: formatTime(timestamp),
              timeAgo: getTimeAgo(timestamp),
              date: dayData.date,
              isToday: dayData.date === dates.today,
              hasResult: true,
              rawTime: gameInfo.time
            });
          }
        });
      }
    });
    
    // Sort by timestamp DESCENDING (newest first)
    allGames.sort((a, b) => b.timestamp - a.timestamp);
    
    // Take only the 3 most recent results
    let recentResults = allGames.slice(0, 3);
    
    // Fill with placeholders if needed
    if (recentResults.length < 3) {
      const placeholdersNeeded = 3 - recentResults.length;
      const placeholders = getPlaceholderData().slice(0, placeholdersNeeded);
      recentResults = [...recentResults, ...placeholders];
    }
    
    // Determine data source
    let source = 'none';
    const hasToday = recentResults.some(r => r.isToday && r.hasResult);
    const hasYesterday = recentResults.some(r => r.date === dates.yesterday && r.hasResult);
    
    if (hasToday && hasYesterday) {
      source = 'mixed';
    } else if (hasToday) {
      source = 'today';
    } else if (hasYesterday) {
      source = 'yesterday';
    } else if (recentResults.some(r => r.hasResult)) {
      source = 'older';
    }
    
    setResults(recentResults);
    setDataSource(source);
  };
  
  const getPlaceholderData = () => {
    const now = Date.now();
    const placeholders = [
      { name: "DESAWAR", result: "", timestamp: now - 3600000, formattedTime: "--:--", timeAgo: "", isToday: false, hasResult: false },
      { name: "GALI", result: "", timestamp: now - 7200000, formattedTime: "--:--", timeAgo: "", isToday: false, hasResult: false },
      { name: "NOIDA KING", result: "", timestamp: now - 10800000, formattedTime: "--:--", timeAgo: "", isToday: false, hasResult: false }
    ];
    
    // Sort placeholders by timestamp (newest first)
    return placeholders.sort((a, b) => b.timestamp - a.timestamp);
  };
  
  // Initial fetch and setup
  useEffect(() => {
    isMounted.current = true;
    fetchData();
    
    const intervalId = setInterval(fetchData, 20000);
    
    return () => {
      isMounted.current = false;
      clearInterval(intervalId);
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  
  // Get status text
  const getStatusText = () => {
    if (loading && results.length === 0) return 'Fetching latest results...';
    if (error) return error;
    
    const validResults = results.filter(r => r.hasResult).length;
    
    switch(dataSource) {
      case 'today':
        return validResults === 0 
          ? 'No results declared today yet' 
          : `Showing ${validResults} latest result${validResults !== 1 ? 's' : ''} from today`;
      case 'yesterday':
        return `Showing yesterday's results`;
      case 'mixed':
        return 'Showing latest results from today and yesterday';
      case 'older':
        return 'Showing recent results';
      default:
        return 'Waiting for live results...';
    }
  };
  
  const getPositionColor = (index) => {
    switch(index) {
      case 0: return { bg: 'from-amber-500 to-yellow-500', text: 'text-black', border: 'border-amber-400/50' };
      case 1: return { bg: 'from-blue-500 to-cyan-500', text: 'text-white', border: 'border-blue-400/40' };
      case 2: return { bg: 'from-emerald-500 to-green-500', text: 'text-white', border: 'border-emerald-400/30' };
      default: return { bg: 'from-slate-600 to-slate-700', text: 'text-white', border: 'border-slate-500/20' };
    }
  };
  
  // Get display order number (1st, 2nd, 3rd) based on actual data, not just position
  const getDisplayOrder = (index, hasResult) => {
    if (!hasResult) return null;
    return index + 1;
  };
  
  return (
    <section className="w-full max-w-md mx-auto mt-6 bg-linear-to-br from-gray-900 via-slate-900 to-black p-6 rounded-3xl shadow-2xl border border-slate-800/60 relative overflow-hidden">
      
      <div className="absolute inset-0 bg-linear-to-br from-amber-500/5 via-transparent to-blue-500/5 animate-pulse"></div>
      <div className="absolute top-0 left-1/4 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-1/4 w-48 h-48 bg-blue-500/10 rounded-full blur-3xl"></div>
      
      <header className="relative z-10 mb-8">
        <div className="flex justify-between items-start">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="relative">
                <div className="w-3 h-3 bg-linear-to-r from-amber-500 to-red-500 rounded-full animate-ping"></div>
                <div className="absolute top-0 w-3 h-3 bg-linear-to-r from-amber-500 to-red-500 rounded-full"></div>
              </div>
              <h1 className="text-white text-2xl font-black tracking-tight italic">
                LIVE RESULTS
              </h1>
            </div>
            <p className="text-slate-300 text-sm font-medium tracking-wide">
              {getStatusText()}
            </p>
          </div>
          
          <div className="text-right">
            <div className="inline-flex items-center gap-2 bg-slate-800/50 backdrop-blur-sm px-3 py-1.5 rounded-full border border-slate-700/50">
              <div className={`w-2 h-2 rounded-full ${loading ? 'bg-amber-500 animate-pulse' : dataSource === 'today' ? 'bg-emerald-500' : 'bg-blue-500'}`}></div>
              <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                {loading ? 'UPDATING' : dataSource === 'today' ? 'LIVE' : 'ARCHIVE'}
              </span>
            </div>
          </div>
        </div>
        
        <div className="flex justify-between items-center mt-4">
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4 text-amber-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
            </svg>
            <span className="text-xs text-slate-400 font-mono">
              {dates.todayReadable}
            </span>
          </div>
          
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4 text-slate-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 2a8 8 0 100 16 8 8 0 000-16zm0 2a1 1 0 011 1v5.586l2.707 2.707a1 1 0 01-1.414 1.414l-3-3a1 1 0 01-.293-.707V5a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            <span className="text-xs text-slate-400">
              Updated: {lastUpdate || '--:--'}
            </span>
          </div>
        </div>
      </header>
      
      <div className="relative z-10 space-y-4">
        {loading && results.length === 0 ? (
          [1, 2, 3].map(i => {
            const colors = getPositionColor(i-1);
            return (
              <div key={i} className={`relative rounded-2xl p-5 backdrop-blur-sm bg-linear-to-br ${colors.bg}/10 border ${colors.border} animate-pulse`}>
                <div className="flex items-center justify-between">
                  <div className="space-y-3">
                    <div className="h-4 w-32 bg-white/20 rounded"></div>
                    <div className="h-6 w-24 bg-white/30 rounded"></div>
                    <div className="h-3 w-20 bg-white/10 rounded"></div>
                  </div>
                  <div className="w-14 h-14 bg-white/20 rounded-full"></div>
                </div>
              </div>
            );
          })
        ) : (
          results.map((game, index) => {
            const colors = getPositionColor(index);
            const hasResult = game.hasResult;
            const displayOrder = getDisplayOrder(index, hasResult);
            const isLatest = index === 0 && hasResult;
            
            return (
              <div 
                key={`${game.name}-${index}-${game.timestamp}`}
                className={`relative rounded-2xl p-5 backdrop-blur-sm transition-all duration-300 hover:scale-[1.02] hover:shadow-xl ${
                  hasResult 
                    ? `bg-linear-to-br ${colors.bg}/20 border ${colors.border}`
                    : 'bg-linear-to-br from-slate-800/50 to-slate-900/50 border border-slate-700/30'
                }`}
              >
                {displayOrder && (
                  <div className={`absolute -top-2 -left-2 w-8 h-8 rounded-full flex items-center justify-center text-xs font-black shadow-lg ${
                    displayOrder === 1 ? 'bg-linear-to-br from-amber-500 to-yellow-500 text-black' :
                    displayOrder === 2 ? 'bg-linear-to-br from-blue-500 to-cyan-500 text-white' :
                    'bg-linear-to-br from-emerald-500 to-green-500 text-white'
                  }`}>
                    {displayOrder}
                  </div>
                )}
                
                {isLatest && (
                  <div className="absolute -top-2 -right-2">
                    <span className="text-[10px] font-bold bg-linear-to-r from-red-500 to-pink-500 text-white px-2 py-1 rounded-full shadow-lg">
                      LATEST
                    </span>
                  </div>
                )}
                
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className={`font-black uppercase tracking-tight ${
                        hasResult 
                          ? index === 0 ? 'text-2xl text-white' : 'text-xl text-slate-200'
                          : 'text-lg text-slate-400'
                      }`}>
                        {game.name}
                      </h3>
                      
                      {hasResult && !game.isToday && (
                        <span className="text-[10px] font-bold bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded-full border border-blue-500/30">
                          PREV DAY
                        </span>
                      )}
                    </div>
                    
                    <div className="flex flex-col gap-1 mt-2">
                      {game.formattedTime && game.formattedTime !== '--:--' && (
                        <div className="flex items-center gap-2">
                          <svg className="w-3 h-3 text-amber-500" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                          </svg>
                          <span className="text-xs text-slate-300 font-mono">
                            {game.formattedTime}
                          </span>
                          {game.timeAgo && game.timeAgo !== 'Just now' && game.timeAgo !== 'Yesterday' && (
                            <span className="text-xs text-slate-500">
                              • {game.timeAgo}
                            </span>
                          )}
                        </div>
                      )}
                      
                      {game.date && game.date !== dates.today && hasResult && (
                        <span className="text-[11px] text-slate-400">
                          Date: {game.date}
                        </span>
                      )}
                      
                      {!hasResult && (
                        <span className="text-xs text-slate-500">
                          ⏳ Waiting for result...
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <div className="relative">
                    <div className={`relative flex items-center justify-center rounded-full font-black font-mono shadow-2xl ${
                      hasResult
                        ? `w-16 h-16 text-3xl ${colors.text} bg-linear-to-br ${colors.bg}`
                        : 'w-14 h-14 text-xl text-slate-400 bg-linear-to-br from-slate-700 to-slate-800'
                    }`}>
                      {game.result || '--'}
                      
                      {isLatest && (
                        <div className="absolute inset-0 rounded-full border-2 border-amber-400/50 animate-ping"></div>
                      )}
                    </div>
                    
                    {game.timeAgo === 'Just now' && hasResult && (
                      <div className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center animate-bounce">
                        <span className="text-[8px] font-black text-white">NEW</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </section>
  );
};

export default RecentResultsWidget;