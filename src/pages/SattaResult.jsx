import React, { useState, useEffect, useRef } from 'react';
import { 
  CheckCircle2, Clock, Zap, 
  ArrowUpRight, Trophy, Loader2, 
  BellRing
} from 'lucide-react';
import api from '../api/api';
import { Helmet } from 'react-helmet-async'; // Install: npm install react-helmet-async

const ProfessionalMarketSchedule = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [backendData, setBackendData] = useState({});
  const [loading, setLoading] = useState(true);
  
  const isMounted = useRef(true);
  const abortControllerRef = useRef(null);

  // SEO: Structured data for markets
  const fullSchedule = [
    { 
      name: "DESAWAR", 
      time: "05:30 AM", 
      color: "#2563eb", 
      letter: "D",
      description: "Desawar Satta King Result - Morning Session Results"
    },
    { 
      name: "DELHI BAZAR", 
      time: "03:15 PM", 
      color: "#6366f1", 
      letter: "D",
      description: "Delhi Bazar Satta King Result - Afternoon Session"
    },
    { 
      name: "SHRI GANESH", 
      time: "04:40 PM", 
      color: "#f59e0b", 
      letter: "S",
      description: "Shri Ganesh Satta Result - Evening Draw Time"
    },
    { 
      name: "NOIDA KING", 
      time: "05:30 PM", 
      color: "#ec4899", 
      letter: "N",
      description: "Noida King Satta King Results - Daily Updates"
    },
    { 
      name: "FARIDABAD", 
      time: "06:15 PM", 
      color: "#059669", 
      letter: "F",
      description: "Faridabad Satta King Results - Live Faridabad Bazar"
    },
    { 
      name: "GHAZIABAD", 
      time: "07:40 PM", 
      color: "#2563eb", 
      letter: "G",
      description: "Ghaziabad Satta King - Night Session Results"
    },
    { 
      name: "GALI", 
      time: "11:10 PM", 
      color: "#ca8a04", 
      letter: "G",
      description: "Gali Satta Result - Late Night Final Draw"
    },
  ];

  // SEO: Meta data for the page
  const pageMetaData = {
    title: "Satta King Result - Live Desawar, Gali, Faridabad Results Today | Official Updates",
    description: "Get official live Satta King results for Desawar, Gali, Faridabad, Ghaziabad, Delhi Bazar, Noida King, and Shri Ganesh. Real-time updates with accurate timing and verified results.",
    keywords: "satta king result, desawar result, gali result, faridabad satta, ghaziabad result, delhi bazar, noida king, shri ganesh, satta king live, satta result today",
    canonical: "https://yoursite.com/satta-king-result",
    ogImage: "https://yoursite.com/og-satta-result.jpg",
    structuredData: {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "name": "Satta King Result Live Updates",
      "description": "Official live Satta King results with real-time updates",
      "url": "https://yoursite.com/satta-king-result",
      "mainEntity": {
        "@type": "ItemList",
        "itemListElement": fullSchedule.map((market, index) => ({
          "@type": "ListItem",
          "position": index + 1,
          "item": {
            "@type": "Game",
            "name": `${market.name} Satta King Result`,
            "description": market.description,
            "startTime": market.time
          }
        }))
      }
    }
  };

  const getMinutes = (timeStr) => {
    if (!timeStr) return 0;
    const [time, modifier] = timeStr.toLowerCase().split(' ');
    let [hours, minutes] = time.split(':');
    if (hours === '12') hours = '00';
    if (modifier === 'pm') hours = parseInt(hours, 10) + 12;
    return parseInt(hours, 10) * 60 + parseInt(minutes, 10);
  };

  const fetchData = async () => {
    if (abortControllerRef.current) abortControllerRef.current.abort();
    abortControllerRef.current = new AbortController();

    try {
      const response = await fetch(`${api.NewScrapeData.gameChartLive}?_t=${Date.now()}`, {
        method: 'GET',
        signal: abortControllerRef.current.signal,
      });
      const result = await response.json();

      if (isMounted.current && result.success && result.data?.length > 0) {
        setBackendData(result.data[0].games || {});
      }
    } catch (error) {
      if (error.name !== 'AbortError') console.error('Fetch error:', error);
    } finally {
      if (isMounted.current) setLoading(false);
    }
  };

  useEffect(() => {
    isMounted.current = true;
    fetchData();
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    const apiTimer = setInterval(fetchData, 20000);

    return () => {
      isMounted.current = false;
      clearInterval(timer);
      clearInterval(apiTimer);
      if (abortControllerRef.current) abortControllerRef.current.abort();
    };
  }, []);

  const nowInMinutes = currentTime.getHours() * 60 + currentTime.getMinutes();
  
  const processedMarkets = fullSchedule.map(m => {
    const apiMatch = backendData[m.name];
    const result = apiMatch?.result || "";
    const marketMins = getMinutes(m.time);
    
    // Logic: Is the time for this market now or in the past, but result hasn't arrived?
    const isWaitingForResult = nowInMinutes >= marketMins && (result === "" || result === "??");
    const isCompleted = result !== "" && result !== "??";

    return {
      ...m,
      result: result,
      totalMins: marketMins,
      isCompleted: isCompleted,
      isWaitingForResult: isWaitingForResult
    };
  });

  // Identify the "Current" top market
  const activeTopMarket = processedMarkets.find(m => m.isWaitingForResult) || 
                          processedMarkets.find(m => !m.isCompleted);

  // SORTING: Active/Waiting market always index 0, then by time.
  const sortedMarkets = [...processedMarkets].sort((a, b) => {
    if (activeTopMarket) {
      if (a.name === activeTopMarket.name) return -1;
      if (b.name === activeTopMarket.name) return 1;
    }
    return a.totalMins - b.totalMins;
  });

  // SEO: Generate breadcrumb structured data
  const breadcrumbStructuredData = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://yoursite.com"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Satta King",
        "item": "https://yoursite.com/satta-king"
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": "Live Results",
        "item": "https://yoursite.com/satta-king-result"
      }
    ]
  };

  if (loading && Object.keys(backendData).length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC]">
        <Helmet>
          <title>{pageMetaData.title}</title>
          <meta name="description" content={pageMetaData.description} />
          <meta name="keywords" content={pageMetaData.keywords} />
          <link rel="canonical" href={pageMetaData.canonical} />
          <meta property="og:title" content={pageMetaData.title} />
          <meta property="og:description" content={pageMetaData.description} />
          <meta property="og:image" content={pageMetaData.ogImage} />
          <meta property="og:url" content={pageMetaData.canonical} />
          <meta name="twitter:card" content="summary_large_image" />
          <script type="application/ld+json">
            {JSON.stringify(pageMetaData.structuredData)}
          </script>
          <script type="application/ld+json">
            {JSON.stringify(breadcrumbStructuredData)}
          </script>
        </Helmet>
        <Loader2 className="w-10 h-10 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <>
      {/* SEO Meta Tags and Structured Data */}
      <Helmet>
        <title>{pageMetaData.title}</title>
        <meta name="description" content={pageMetaData.description} />
        <meta name="keywords" content={pageMetaData.keywords} />
        <link rel="canonical" href={pageMetaData.canonical} />
        
        {/* Open Graph */}
        <meta property="og:title" content={pageMetaData.title} />
        <meta property="og:description" content={pageMetaData.description} />
        <meta property="og:image" content={pageMetaData.ogImage} />
        <meta property="og:url" content={pageMetaData.canonical} />
        <meta property="og:type" content="website" />
        
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={pageMetaData.title} />
        <meta name="twitter:description" content={pageMetaData.description} />
        <meta name="twitter:image" content={pageMetaData.ogImage} />
        
        {/* Structured Data */}
        <script type="application/ld+json">
          {JSON.stringify(pageMetaData.structuredData)}
        </script>
        <script type="application/ld+json">
          {JSON.stringify(breadcrumbStructuredData)}
        </script>
        
        {/* Additional SEO Tags */}
        <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
        <meta name="author" content="Satta King Official" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta httpEquiv="Content-Type" content="text/html; charset=utf-8" />
        <link rel="alternate" href={pageMetaData.canonical} hrefLang="en" />
        
        {/* SEO: Page-specific meta for markets */}
        {processedMarkets.map((market) => (
          <meta 
            key={market.name} 
            name={`${market.name.toLowerCase().replace(/\s+/g, '-')}-result`} 
            content={`${market.name} Satta King Result: ${market.result || 'Coming Soon'} at ${market.time}`} 
          />
        ))}
      </Helmet>

      <div className="min-h-screen bg-[#F8FAFC] p-4 md:p-12 font-sans text-slate-900">
        <style dangerouslySetInnerHTML={{ __html: `
          @keyframes result-blink { 0%, 100% { opacity: 1; color: #ef4444; } 50% { opacity: 0.4; } }
          .animate-result-blink { animation: result-blink 1s infinite ease-in-out; }
          
          @keyframes border-glow { 0%, 100% { border-color: #f59e0b; box-shadow: 0 0 20px rgba(245, 158, 11, 0.2); } 50% { border-color: #fbbf24; box-shadow: 0 0 35px rgba(245, 158, 11, 0.4); } }
          .upcoming-card { animation: border-glow 2s infinite; border-width: 2px !important; }

          @keyframes pulse-soft { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.05); } }
          .animate-pulse-soft { animation: pulse-soft 2s infinite; }
        `}} />

        <div className="max-w-4xl mx-auto relative z-10">
          {/* SEO: Breadcrumb Navigation (hidden but accessible) */}
          <nav aria-label="Breadcrumb" className="sr-only">
            <ol itemScope itemType="https://schema.org/BreadcrumbList">
              <li itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem">
                <a itemProp="item" href="https://yoursite.com">
                  <span itemProp="name">Home</span>
                </a>
                <meta itemProp="position" content="1" />
              </li>
              <li itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem">
                <a itemProp="item" href="https://yoursite.com/satta-king">
                  <span itemProp="name">Satta King</span>
                </a>
                <meta itemProp="position" content="2" />
              </li>
              <li itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem">
                <span itemProp="name">Live Results</span>
                <meta itemProp="position" content="3" />
              </li>
            </ol>
          </nav>

          {/* HEADER */}
          <header className="group relative flex flex-col md:flex-row md:items-center justify-between mb-6 md:mb-12 bg-white/70 backdrop-blur-2xl p-6 md:p-8 rounded-3xl md:rounded-[2.5rem] border border-white shadow-sm ring-1 ring-slate-200/60">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-red-600"></span>
                </span>
                <span className="text-amber-600 text-[9px] font-black tracking-[0.2em] uppercase">Official Live Updates</span>
              </div>
              <h1 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight leading-tight italic">
                SATTA KING <span className="bg-clip-text text-transparent bg-linear-to-b from-amber-400 via-amber-600 to-amber-800 uppercase">RESULT</span>
              </h1>
              {/* SEO: Additional descriptive text for search engines */}
              <p className="text-sm text-slate-600 mt-2 hidden md:block">
                Live Satta King Results for Desawar, Gali, Faridabad, Ghaziabad, Delhi Bazar, Noida King, and Shri Ganesh with real-time updates and accurate timing.
              </p>
            </div>

            <div className="mt-6 md:mt-0 flex items-center justify-between md:justify-end gap-6 border-t md:border-t-0 md:border-l border-slate-100 pt-4 md:pt-0 md:pl-6">
              <div className="text-left md:text-right">
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-0.5">Live Time</p>
                <p className="text-xl md:text-2xl font-black text-slate-800 tabular-nums" 
                   aria-live="polite"
                   aria-label={`Current time: ${currentTime.toLocaleTimeString()}`}>
                  {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                </p>
              </div>
              <div className="relative bg-linear-to-br from-amber-500 to-amber-700 p-3 md:p-4 rounded-xl shadow-lg text-white">
                <Trophy size={20} className="md:w-7 md:h-7" strokeWidth={2.5} />
              </div>
            </div>
          </header>

          {/* SEO: Hidden content for search engines (semantic structure) */}
          <div className="sr-only" aria-hidden="true">
            <h2>Satta King Daily Results Schedule</h2>
            <p>Get live Satta King results for all major markets including Desawar Satta King, Gali Result, Faridabad Satta, Ghaziabad Result, Delhi Bazar, Noida King, and Shri Ganesh.</p>
            <ul>
              {fullSchedule.map(market => (
                <li key={market.name}>
                  {market.name} Satta Result at {market.time} - {market.description}
                </li>
              ))}
            </ul>
          </div>

          {/* Market Cards */}
          <main>
            <div className="grid gap-3 md:gap-4">
              {sortedMarkets.map((market, idx) => {
                const isTop = activeTopMarket && market.name === activeTopMarket.name;
                const showComingSoon = market.isWaitingForResult && !market.result;

                // SEO: Create semantic HTML structure for each market
                const marketStructuredData = {
                  "@context": "https://schema.org",
                  "@type": "Game",
                  "name": `${market.name} Satta King Result`,
                  "description": market.description,
                  "startTime": market.time,
                  "endTime": market.isCompleted ? market.time : undefined,
                  "result": market.result || undefined,
                  "status": market.isCompleted ? "Completed" : (market.isWaitingForResult ? "Live" : "Pending")
                };

                return (
                  <React.Fragment key={idx}>
                    <script type="application/ld+json">
                      {JSON.stringify(marketStructuredData)}
                    </script>
                    
                    <article 
                      className={`group relative transition-all duration-500 p-4 rounded-[1.25rem] md:rounded-4xl border overflow-hidden
                        ${isTop ? 'upcoming-card bg-white scale-[1.02] z-30 mb-4' : 'bg-white/80 border-slate-100 shadow-sm opacity-90'}
                      `}
                      itemScope
                      itemType="https://schema.org/Game"
                    >
                      {isTop && (
                        <div className="absolute top-0 left-0 right-0 h-1.5 bg-linear-to-r from-amber-400 via-yellow-500 to-amber-400 animate-pulse"></div>
                      )}

                      {isTop && (
                        <div className="absolute top-0 right-0 bg-amber-600 text-white px-5 py-1.5 rounded-bl-2xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                          <BellRing size={12} className="animate-bounce" />
                          {market.isWaitingForResult ? "RESULT COMING NOW" : "UPCOMING"}
                        </div>
                      )}

                      <div className="flex items-center justify-between relative z-10 pt-2">
                        <div className="flex items-center gap-3 md:gap-6">
                          <div 
                            className={`w-12 h-12 md:w-16 md:h-16 rounded-xl md:rounded-[1.25rem] flex items-center justify-center text-white font-black text-lg md:text-2xl shadow-lg 
                              ${isTop ? 'animate-pulse-soft ring-4 ring-amber-100' : ''}`}
                            style={{ backgroundColor: market.color }}
                            aria-label={`${market.name} Market Logo`}
                          >
                            {market.letter}
                          </div>

                          <div>
                            <h2 className={`text-base md:text-xl font-black flex items-center gap-1 ${isTop ? 'text-amber-800' : 'text-slate-800'}`} itemProp="name">
                              {market.name}
                              <ArrowUpRight size={14} className={isTop ? "text-amber-400" : "text-slate-300"} />
                            </h2>
                            <div className="flex items-center gap-1.5 text-slate-400 font-bold mt-0.5">
                              <Clock size={10} className={isTop ? "text-amber-500" : "text-blue-500"} />
                              <time className="text-[9px] md:text-[10px] tracking-widest uppercase" itemProp="startTime">
                                {market.time}
                              </time>
                            </div>
                            {/* SEO: Hidden description for search engines */}
                            <meta itemProp="description" content={market.description} />
                          </div>
                        </div>

                        <div className="flex items-center gap-4 md:gap-10">
                          <div className="text-right">
                            <p className="text-[8px] md:text-[9px] uppercase font-black text-slate-400 tracking-wider mb-0.5">Result</p>
                            <p className={`text-2xl md:text-4xl font-mono font-black tracking-tighter 
                              ${showComingSoon ? 'text-[12px] md:text-sm animate-result-blink' : (market.result ? 'text-slate-900' : 'text-slate-200')}`}
                              itemProp="result">
                              {showComingSoon ? "COMING SOON" : (market.result || "--")}
                            </p>
                          </div>

                          <div className="hidden sm:block min-w-22.5">
                            <div className={`flex items-center justify-center gap-2 py-2 rounded-xl border font-black text-[9px] uppercase
                              ${market.isCompleted ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 
                                isTop ? 'bg-amber-100 text-amber-700 border-amber-300' : 'bg-slate-50 text-slate-400 border-slate-100'}`}>
                              {market.isCompleted ? <CheckCircle2 size={12}/> : <Zap size={12} className={market.isWaitingForResult ? "animate-spin" : ""}/>}
                              <span itemProp="status">
                                {market.isCompleted ? 'Closed' : market.isWaitingForResult ? 'Live' : 'Pending'}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </article>
                  </React.Fragment>
                );
              })}
            </div>
          </main>
        </div>
      </div>
    </>
  );
};

export default ProfessionalMarketSchedule;