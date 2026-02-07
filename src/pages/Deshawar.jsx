import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Crown, Share2, Sparkles, Trophy, RotateCcw } from 'lucide-react';
import confetti from 'canvas-confetti';
import api from '../api/api';
import { Helmet } from 'react-helmet-async';

const Deshwar = () => {
  const [revealed, setRevealed] = useState(false);
  const [luckyNumber, setLuckyNumber] = useState("--");
  const [gameTime, setGameTime] = useState("05:00 AM");
  const [displayDate, setDisplayDate] = useState("Loading...");
  const [lastUpdated, setLastUpdated] = useState(new Date().toISOString());
  const [metaDescription, setMetaDescription] = useState("Latest Desawar lottery results with verified winning numbers");

  const triggerWin = () => {
    setRevealed(true);
    const duration = 3 * 1000;
    const end = Date.now() + duration;

    (function frame() {
      confetti({
        particleCount: 2,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ['#FFD700', '#FFA500']
      });
      confetti({
        particleCount: 2,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ['#FFD700', '#FFA500']
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    }());
  };

  const fetchRealData = async () => {
    try {
      const response = await fetch(`${api.NewScrapeData.gameChartLive}?_t=${Date.now()}`);
      const data = await response.json();

      if (data.success && data.data && data.data.length > 0) {
        let selectedEntry = null;

        // Logic: Find the first date entry that actually has a result for DESAWAR
        for (const dayEntry of data.data) {
          const game = dayEntry.games["DESAWAR"];
          if (game && game.result && game.result.trim() !== "" && game.result !== "??") {
            selectedEntry = {
              game: game,
              date: dayEntry.date
            };
            break; // Stop once we find the most recent valid result
          }
        }

        if (selectedEntry) {
          setLuckyNumber(selectedEntry.game.result);
          setGameTime(selectedEntry.game.time || "05:00 AM");
          
          // Format the Date
          const dateParts = selectedEntry.date.split('-');
          const dateObj = new Date(dateParts[2], dateParts[1] - 1, dateParts[0]);
          const formattedDate = dateObj.toLocaleDateString('en-IN', { day: '2-digit', month: 'short' });
          setDisplayDate(formattedDate);
          setLastUpdated(new Date().toISOString());
          
          // Update meta description dynamically
          setMetaDescription(`Desawar lottery winning number ${selectedEntry.game.result} drawn at ${selectedEntry.game.time || "05:00 AM"} on ${formattedDate}. Verified morning lottery results updated in real-time.`);
        }
      }
    } catch (error) {
      console.error("Desawar API Error:", error);
    }
  };

  useEffect(() => {
    fetchRealData();
    const timer = setTimeout(triggerWin, 1500);
    return () => clearTimeout(timer);
  }, []);

  // Generate structured data for rich snippets
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "LotteryGame",
    "name": "Desawar Lottery",
    "description": "Latest Desawar lottery results with verified winning numbers and morning draw timings",
    "url": window.location.href,
    "gameNumber": luckyNumber !== "--" ? luckyNumber : undefined,
    "drawDate": displayDate !== "Loading..." ? displayDate : undefined,
    "drawTime": gameTime,
    "status": "Verified",
    "dateModified": lastUpdated,
    "location": {
      "@type": "Place",
      "name": "Multiple Cities, India",
      "address": {
        "@type": "PostalAddress",
        "addressCountry": "IN"
      }
    },
    "provider": {
      "@type": "Organization",
      "name": "Lottery Results",
      "url": "https://lottery-results.com"
    },
    "potentialAction": {
      "@type": "UpdateAction",
      "target": window.location.href,
      "description": "Refresh latest Desawar lottery results"
    }
  };

  // Generate Breadcrumb structured data
  const breadcrumbData = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://lottery-results.com"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Morning Lottery Games",
        "item": "https://lottery-results.com/morning-games"
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": "Desawar Lottery",
        "item": window.location.href
      }
    ]
  };

  // Generate FAQ structured data
  const faqData = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "What time is Desawar lottery drawn?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": `The Desawar lottery is drawn daily at ${gameTime} (early morning) across multiple cities in India.`
        }
      },
      {
        "@type": "Question",
        "name": "How can I check Desawar lottery results?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "You can check the latest Desawar lottery results on this page. The winning number is updated in real-time after the official morning draw."
        }
      },
      {
        "@type": "Question",
        "name": "Is Desawar the same as Gali lottery?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Desawar and Gali are two different lottery games with different draw times. Desawar is drawn at 5:00 AM while Gali is drawn at 11:50 PM."
        }
      },
      {
        "@type": "Question",
        "name": "What makes Desawar lottery special?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Desawar lottery is one of the oldest and most popular lottery games in India, known for its early morning 5:00 AM draw time."
        }
      }
    ]
  };

  // Generate Event structured data for the daily draw
  const eventData = {
    "@context": "https://schema.org",
    "@type": "Event",
    "name": "Desawar Lottery Morning Draw",
    "startDate": `T05:00:00+05:30`,
    "endDate": `T05:05:00+05:30`,
    "eventStatus": "EventScheduled",
    "eventAttendanceMode": "OnlineEventAttendanceMode",
    "location": {
      "@type": "Place",
      "name": "Multiple Cities, India"
    },
    "organizer": {
      "@type": "Organization",
      "name": "Desawar Lottery"
    }
  };

  const handleShare = async () => {
    const shareData = {
      title: `Desawar Lottery Result - ${luckyNumber}`,
      text: `Desawar winning number ${luckyNumber} drawn at ${gameTime}. Check the official morning lottery results!`,
      url: window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (error) {
        console.log('Sharing cancelled:', error);
      }
    } else {
      await navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  return (
    <>
      {/* SEO Meta Tags */}
      <Helmet>
        {/* Primary Meta Tags */}
        <title>{`Desawar Lottery Results - Live Winning Numbers ${luckyNumber !== "--" ? `: ${luckyNumber}` : ""}`}</title>
        <meta name="description" content={metaDescription} />
        <meta name="keywords" content="Desawar lottery, Desawar result, Desawar satta, morning lottery, 5 AM lottery, lottery results morning, Desawar lottery time, Desawar gali, Desawar satta result, lottery results 5:00 AM, morning satta, verified lottery results, deshwar lottery" />
        <meta name="robots" content="index, follow" />
        <meta name="author" content="Lottery Results" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content={window.location.href} />
        <meta property="og:title" content={`Desawar Lottery - Winning Number: ${luckyNumber}`} />
        <meta property="og:description" content={`Official Desawar lottery results. Morning draw at ${gameTime} on ${displayDate}. Winning number: ${luckyNumber}`} />
        <meta property="og:image" content={`https://${window.location.hostname}/api/og-image?game=desawar&number=${luckyNumber}&date=${displayDate}&time=morning`} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt" content="Desawar Lottery Morning Results" />
        <meta property="og:site_name" content="Lottery Results" />
        <meta property="og:locale" content="en_IN" />
        
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@MorningLottery" />
        <meta name="twitter:creator" content="@MorningLottery" />
        <meta name="twitter:title" content={`Desawar Result Today: ${luckyNumber}`} />
        <meta name="twitter:description" content={`Latest Desawar lottery winning number ${luckyNumber}. Morning draw at ${gameTime}`} />
        <meta name="twitter:image" content={`https://${window.location.hostname}/api/og-image?game=desawar&number=${luckyNumber}`} />
        
        {/* Canonical */}
        <link rel="canonical" href={window.location.href} />
        
        {/* Additional SEO Tags */}
        <meta name="article:published_time" content={lastUpdated} />
        <meta name="article:modified_time" content={lastUpdated} />
        <meta name="article:section" content="Lottery" />
        <meta name="article:tag" content="Desawar Lottery" />
        <meta name="article:tag" content="Morning Lottery" />
        <meta name="article:tag" content="5 AM Lottery" />
        <meta name="article:tag" content="Early Morning Results" />
        
        {/* Event Timing Tags */}
        <meta name="event:time" content="05:00" />
        <meta name="event:type" content="lottery_draw" />
        
        {/* Structured Data */}
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
        <script type="application/ld+json">
          {JSON.stringify(breadcrumbData)}
        </script>
        <script type="application/ld+json">
          {JSON.stringify(faqData)}
        </script>
        <script type="application/ld+json">
          {JSON.stringify(eventData)}
        </script>
        
        {/* Additional SEO */}
        <meta name="googlebot" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
        <meta name="bingbot" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
        <meta name="apple-mobile-web-app-title" content="Desawar Lottery" />
        <meta name="application-name" content="Desawar Lottery Results" />
        
        {/* Mobile Specific */}
        <meta name="theme-color" content="#FFD700" />
        <meta name="msapplication-TileColor" content="#FFD700" />
        
        {/* Alternate Spelling Variations */}
        <meta name="alternate" content="Deshwar" />
        <meta name="alternate" content="Desawar" />
        <link rel="alternate" hreflang="hi" href={`https://${window.location.hostname}/hi/desawar`} />
      </Helmet>

      <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center p-4 selection:bg-amber-500/30">
        
        {/* Hidden SEO Content for better indexing */}
        <div className="sr-only" aria-hidden="true">
          <h1>Desawar Lottery Results</h1>
          <h2>Official Desawar Lottery Winning Numbers - Morning Draw</h2>
          <p>The Desawar lottery is drawn daily at {gameTime} (early morning) across multiple cities in India. Today's winning number is {luckyNumber} drawn on {displayDate}.</p>
          <p>Desawar lottery is one of the oldest and most popular lottery games in India, known for its first draw of the day at 5:00 AM.</p>
          <p>All Desawar lottery results are verified through official sources and updated in real-time for accuracy. The early morning timing makes it the first lottery result available each day.</p>
          <p>Check previous Desawar results, upcoming draw schedules, and lottery tips specifically for morning lottery games.</p>
          <p>Desawar lottery operates in multiple cities with synchronized morning draws. Play responsibly and check results regularly.</p>
          <p>As one of the first lottery draws of the day, Desawar results are highly anticipated by lottery enthusiasts starting their day across India.</p>
          <p>Note: Desawar is also spelled as Deshwar in some regions. Both refer to the same lottery game.</p>
        </div>
        
        <div className="absolute top-0 w-full h-64 bg-amber-600/10 blur-[120px]" />
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-90 perspective-[1000px]"
        >
          <motion.div 
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 4, repeat: Infinity }}
            className="flex justify-center -mb-6 relative z-20"
          >
            <div className="bg-linear-to-tr from-amber-300 to-yellow-600 p-3 rounded-2xl shadow-2xl shadow-amber-500/40">
              <Crown size={24} className="text-black" />
            </div>
          </motion.div>

          <motion.div 
            style={{ transformStyle: "preserve-3d" }}
            whileHover={{ rotateX: 5, rotateY: -5 }}
            className="relative group"
          >
            <div className="absolute -inset-0.5 bg-linear-to-b from-amber-500/50 to-transparent rounded-[50px] blur opacity-30 group-hover:opacity-60 transition duration-1000"></div>
            
            <div className="relative bg-[#0d0d0f] border border-white/10 rounded-[48px] overflow-hidden p-8 flex flex-col items-center">
              
              <div className="absolute top-0 left-0 w-full h-full bg-linear-to-tr from-white/5 via-transparent to-transparent pointer-events-none" />

              <div className="w-full flex justify-between items-center mb-8 opacity-60">
                <Sparkles size={16} className="text-amber-400" />
                <p className="text-[10px] font-black tracking-[0.3em] uppercase text-white/80">Desawar Result</p>
                <Share2 
                  size={16} 
                  className="text-white hover:text-amber-400 cursor-pointer transition-colors" 
                  onClick={handleShare}
                  aria-label="Share Desawar lottery results"
                />
              </div>

              <div className="h-45 flex items-center justify-center relative" style={{ transform: "translateZ(60px)" }}>
                <AnimatePresence mode="wait">
                  {revealed ? (
                    <motion.div
                      key="number"
                      initial={{ scale: 0, rotate: -15, opacity: 0 }}
                      animate={{ scale: 1, rotate: 0, opacity: 1 }}
                      className="relative"
                    >
                      <h1 className="text-[130px] font-black leading-none bg-linear-to-b from-white via-amber-200 to-amber-600 bg-clip-text text-transparent drop-shadow-[0_10px_30px_rgba(245,158,11,0.5)]">
                        {luckyNumber}
                      </h1>
                    </motion.div>
                  ) : (
                    <div className="flex gap-3">
                      <motion.div animate={{ opacity: [0.2, 0.5, 0.2] }} transition={{ repeat: Infinity, duration: 1 }} className="w-12 h-20 bg-white/5 rounded-2xl" />
                      <motion.div animate={{ opacity: [0.2, 0.5, 0.2] }} transition={{ repeat: Infinity, duration: 1, delay: 0.2 }} className="w-12 h-20 bg-white/5 rounded-2xl" />
                    </div>
                  )}
                </AnimatePresence>
              </div>

              <div className="w-full space-y-4 mb-8">
                <div className="flex justify-between items-center px-4">
                  <div className="text-center">
                    <p className="text-[8px] text-slate-500 uppercase font-bold tracking-widest mb-1">Time</p>
                    <p className="text-slate-200 text-xs font-bold">{gameTime}</p>
                  </div>
                  <div className="h-6 w-px bg-white/10" />
                  <div className="text-center">
                    <p className="text-[8px] text-slate-500 uppercase font-bold tracking-widest mb-1">Status</p>
                    <p className="text-green-500 text-xs font-bold flex items-center gap-1 uppercase tracking-tighter">
                      <Trophy size={10} /> Verified
                    </p>
                  </div>
                  <div className="h-6 w-px bg-white/10" />
                  <div className="text-center">
                    <p className="text-[8px] text-slate-500 uppercase font-bold tracking-widest mb-1">Date</p>
                    <p className="text-slate-200 text-xs font-bold">{displayDate}</p>
                  </div>
                </div>
              </div>

              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => { 
                  setRevealed(false); 
                  fetchRealData(); 
                  setTimeout(triggerWin, 600); 
                }}
                className="group relative w-full py-4 bg-white text-black font-black text-[11px] uppercase tracking-[0.2em] rounded-2xl overflow-hidden shadow-2xl transition-all"
                aria-label="Refresh Desawar lottery results"
              >
                <div className="absolute inset-0 bg-linear-to-r from-amber-400 to-yellow-600 opacity-100 group-hover:opacity-90 transition-opacity" />
                <span className="relative z-10 flex items-center justify-center gap-2">
                  <RotateCcw size={14} /> Refresh Card
                </span>
              </motion.button>

            </div>
          </motion.div>
          
          {/* Additional SEO Footer */}
          <div className="sr-only" aria-hidden="true">
            <p>Desawar Lottery is one of the most historic lottery games in India. All results are for informational purposes only.</p>
            <p>Play responsibly. Must be 18+ to participate in lottery games. Results are updated daily after the 5:00 AM draw.</p>
            <p>Disclaimer: This website provides Desawar lottery results information. Gambling may be addictive. Please play responsibly.</p>
            <p>The Desawar lottery draw at 5:00 AM makes it the first major lottery result available each day for many players.</p>
            <p>Desawar results are synchronized across multiple participating cities for consistent nationwide morning draws.</p>
            <p>Alternative spellings: Deshwar, Desawar. Both refer to the same popular morning lottery game.</p>
          </div>
        </motion.div>
      </div>
    </>
  );
};

export default Deshwar;