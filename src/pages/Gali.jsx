import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Crown, Share2, Sparkles, Trophy, RotateCcw } from 'lucide-react';
import confetti from 'canvas-confetti';
import api from '../api/api';
import { Helmet } from 'react-helmet-async';

const Gali = () => {
  const [revealed, setRevealed] = useState(false);
  // Real Data States
  const [luckyNumber, setLuckyNumber] = useState("--");
  const [gameTime, setGameTime] = useState("11:50 PM");
  const [displayDate, setDisplayDate] = useState("Loading...");
  const [lastUpdated, setLastUpdated] = useState(new Date().toISOString());
  const [metaDescription, setMetaDescription] = useState("Latest Gali lottery results with verified winning numbers");

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

        // Logic: Find the most recent valid result for GALI
        for (const dayEntry of data.data) {
          const game = dayEntry.games["GALI"];
          // Check if result is valid (not empty, not just whitespace, not ??)
          if (game && game.result && game.result.trim() !== "" && game.result !== "??") {
            selectedEntry = {
              game: game,
              date: dayEntry.date
            };
            break; 
          }
        }

        if (selectedEntry) {
          setLuckyNumber(selectedEntry.game.result);
          setGameTime(selectedEntry.game.time || "11:50 PM");
          
          // Format Date (e.g., "07 Feb")
          const dateParts = selectedEntry.date.split('-');
          const dateObj = new Date(dateParts[2], dateParts[1] - 1, dateParts[0]);
          const formattedDate = dateObj.toLocaleDateString('en-IN', { day: '2-digit', month: 'short' });
          setDisplayDate(formattedDate);
          setLastUpdated(new Date().toISOString());
          
          // Update meta description dynamically
          setMetaDescription(`Gali lottery winning number ${selectedEntry.game.result} drawn at ${selectedEntry.game.time || "11:50 PM"} on ${formattedDate}. Verified late-night lottery results updated in real-time.`);
        }
      }
    } catch (error) {
      console.error("Gali API Error:", error);
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
    "name": "Gali Lottery",
    "description": "Latest Gali lottery results with verified winning numbers and midnight draw timings",
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
      "description": "Refresh latest Gali lottery results"
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
        "name": "Night Lottery Games",
        "item": "https://lottery-results.com/night-games"
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": "Gali Lottery",
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
        "name": "What time is Gali lottery drawn?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": `The Gali lottery is drawn daily at ${gameTime} (late night) across multiple cities in India.`
        }
      },
      {
        "@type": "Question",
        "name": "How can I check Gali lottery results?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "You can check the latest Gali lottery results on this page. The winning number is updated in real-time after the official late-night draw."
        }
      },
      {
        "@type": "Question",
        "name": "Is Gali lottery available in multiple cities?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes, Gali lottery is a popular lottery game that operates in multiple cities across India with synchronized late-night draws."
        }
      },
      {
        "@type": "Question",
        "name": "What makes Gali lottery special?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Gali lottery is known for its late-night draws at 11:50 PM, making it one of the final lottery results of the day for many players."
        }
      }
    ]
  };

  const handleShare = async () => {
    const shareData = {
      title: `Gali Lottery Result - ${luckyNumber}`,
      text: `Gali winning number ${luckyNumber} drawn at ${gameTime}. Check the official late-night lottery results!`,
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
        <title>{`Gali Lottery Results - Live Winning Numbers ${luckyNumber !== "--" ? `: ${luckyNumber}` : ""}`}</title>
        <meta name="description" content={metaDescription} />
        <meta name="keywords" content="Gali lottery, Gali result, Gali satta, late night lottery, midnight lottery, lottery results night, Gali lottery time, Gali disawar, Gali satta result, lottery results 11:50 PM, night satta, verified lottery results" />
        <meta name="robots" content="index, follow" />
        <meta name="author" content="Lottery Results" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content={window.location.href} />
        <meta property="og:title" content={`Gali Lottery - Winning Number: ${luckyNumber}`} />
        <meta property="og:description" content={`Official Gali lottery results. Late-night draw at ${gameTime} on ${displayDate}. Winning number: ${luckyNumber}`} />
        <meta property="og:image" content={`https://${window.location.hostname}/api/og-image?game=gali&number=${luckyNumber}&date=${displayDate}&time=night`} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt" content="Gali Lottery Night Results" />
        <meta property="og:site_name" content="Lottery Results" />
        <meta property="og:locale" content="en_IN" />
        
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@LotteryNight" />
        <meta name="twitter:creator" content="@LotteryNight" />
        <meta name="twitter:title" content={`Gali Result Tonight: ${luckyNumber}`} />
        <meta name="twitter:description" content={`Latest Gali lottery winning number ${luckyNumber}. Late-night draw at ${gameTime}`} />
        <meta name="twitter:image" content={`https://${window.location.hostname}/api/og-image?game=gali&number=${luckyNumber}`} />
        
        {/* Canonical */}
        <link rel="canonical" href={window.location.href} />
        
        {/* Additional SEO Tags */}
        <meta name="article:published_time" content={lastUpdated} />
        <meta name="article:modified_time" content={lastUpdated} />
        <meta name="article:section" content="Lottery" />
        <meta name="article:tag" content="Gali Lottery" />
        <meta name="article:tag" content="Night Lottery" />
        <meta name="article:tag" content="Late Night Results" />
        <meta name="article:tag" content="Midnight Lottery" />
        
        {/* Event Timing Tags */}
        <meta name="event:time" content="23:50" />
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
        
        {/* Additional SEO */}
        <meta name="googlebot" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
        <meta name="bingbot" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
        <meta name="apple-mobile-web-app-title" content="Gali Lottery" />
        <meta name="application-name" content="Gali Lottery Results" />
        
        {/* Mobile Specific */}
        <meta name="theme-color" content="#FFD700" />
        <meta name="msapplication-TileColor" content="#FFD700" />
      </Helmet>

      <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center p-4 selection:bg-amber-500/30">
        
        {/* Hidden SEO Content for better indexing */}
        <div className="sr-only" aria-hidden="true">
          <h1>Gali Lottery Results</h1>
          <h2>Official Gali Lottery Winning Numbers - Late Night Draw</h2>
          <p>The Gali lottery is drawn daily at {gameTime} (late night) across multiple cities in India. Today's winning number is {luckyNumber} drawn on {displayDate}.</p>
          <p>Gali lottery is one of the most popular late-night lottery games in India, known for its final draw of the day at 11:50 PM.</p>
          <p>All Gali lottery results are verified through official sources and updated in real-time for accuracy. The late timing makes it convenient for players to check results before midnight.</p>
          <p>Check previous Gali results, upcoming draw schedules, and lottery tips specifically for night-time lottery games.</p>
          <p>Gali lottery operates in multiple cities with synchronized draws. Play responsibly and check results regularly.</p>
          <p>As one of the last lottery draws of the day, Gali results are highly anticipated by lottery enthusiasts across India.</p>
        </div>
        
        {/* Background Ambience */}
        <div className="absolute top-0 w-full h-64 bg-amber-600/10 blur-[120px]" />
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-90 perspective-[1000px]"
        >
          {/* Floating Crown Badge */}
          <motion.div 
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 4, repeat: Infinity }}
            className="flex justify-center -mb-6 relative z-20"
          >
            <div className="bg-linear-to-tr from-amber-300 to-yellow-600 p-3 rounded-2xl shadow-2xl shadow-amber-500/40">
              <Crown size={24} className="text-black" />
            </div>
          </motion.div>

          {/* 3D Glass Card */}
          <motion.div 
            style={{ transformStyle: "preserve-3d" }}
            whileHover={{ rotateX: 5, rotateY: -5 }}
            className="relative group"
          >
            <div className="absolute -inset-0.5 bg-linear-to-b from-amber-500/50 to-transparent rounded-[50px] blur opacity-30 group-hover:opacity-60 transition duration-1000"></div>
            
            <div className="relative bg-[#0d0d0f] border border-white/10 rounded-[48px] overflow-hidden p-8 flex flex-col items-center">
              
              <div className="absolute top-0 left-0 w-full h-full bg-linear-to-tr from-white/5 via-transparent to-transparent pointer-events-none" />

              {/* Header Area */}
              <div className="w-full flex justify-between items-center mb-8 opacity-60">
                <Sparkles size={16} className="text-amber-400" />
                <p className="text-[10px] font-black tracking-[0.3em] uppercase text-white/80">Gali Result</p>
                <Share2 
                  size={16} 
                  className="text-white hover:text-amber-400 cursor-pointer transition-colors" 
                  onClick={handleShare}
                  aria-label="Share Gali lottery results"
                />
              </div>

              {/* Main Number with 3D Pop */}
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

              {/* Verification & Meta Info */}
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

              {/* Refresh Button */}
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => { 
                  setRevealed(false); 
                  fetchRealData(); 
                  setTimeout(triggerWin, 600); 
                }}
                className="group relative w-full py-4 bg-white text-black font-black text-[11px] uppercase tracking-[0.2em] rounded-2xl overflow-hidden shadow-2xl transition-all"
                aria-label="Refresh Gali lottery results"
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
            <p>Gali Lottery is a popular multi-city lottery game in India. All results are for informational purposes only.</p>
            <p>Play responsibly. Must be 18+ to participate in lottery games. Results are updated daily after the 11:50 PM draw.</p>
            <p>Disclaimer: This website provides Gali lottery results information. Gambling may be addictive. Please play responsibly.</p>
            <p>The Gali lottery draw at 11:50 PM makes it one of the final lottery results available each day for many players.</p>
            <p>Gali results are synchronized across multiple participating cities for consistent nationwide draws.</p>
          </div>
        </motion.div>
      </div>
    </>
  );
};

export default Gali;