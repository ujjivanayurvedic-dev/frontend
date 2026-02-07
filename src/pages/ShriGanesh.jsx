import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Crown, Share2, Sparkles, Trophy, RotateCcw } from 'lucide-react';
import confetti from 'canvas-confetti';
import api from '../api/api';
import { Helmet } from 'react-helmet-async'; // Install: npm install react-helmet-async

const ShriGanesh = () => {
  const [revealed, setRevealed] = useState(false);
  // Real Data States
  const [luckyNumber, setLuckyNumber] = useState("--");
  const [gameTime, setGameTime] = useState("04:30 PM");
  const [displayDate, setDisplayDate] = useState("Loading...");
  const [lastUpdated, setLastUpdated] = useState(new Date().toISOString());

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

        // Logic: Find the most recent valid result for SHRI GANESH
        for (const dayEntry of data.data) {
          const game = dayEntry.games["SHRI GANESH"];
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
          setGameTime(selectedEntry.game.time || "04:30 PM");
          
          const dateParts = selectedEntry.date.split('-');
          const dateObj = new Date(dateParts[2], dateParts[1] - 1, dateParts[0]);
          const formattedDate = dateObj.toLocaleDateString('en-IN', { day: '2-digit', month: 'short' });
          setDisplayDate(formattedDate);
          setLastUpdated(new Date().toISOString());
        }
      }
    } catch (error) {
      console.error("Shri Ganesh API Error:", error);
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
    "name": "Shri Ganesh Lottery",
    "description": "Latest Shri Ganesh lottery results with verified winning numbers and draw timings",
    "url": window.location.href,
    "gameNumber": luckyNumber !== "--" ? luckyNumber : undefined,
    "drawDate": displayDate !== "Loading..." ? displayDate : undefined,
    "drawTime": gameTime,
    "status": "Verified",
    "dateModified": lastUpdated,
    "provider": {
      "@type": "Organization",
      "name": "Lottery Results"
    },
    "potentialAction": {
      "@type": "UpdateAction",
      "target": window.location.href,
      "description": "Refresh latest lottery results"
    }
  };

  return (
    <>
      {/* SEO Meta Tags */}
      <Helmet>
        <title>Shri Ganesh Lottery Results - Live Winning Numbers {luckyNumber !== "--" ? `- ${luckyNumber}` : ""}</title>
        <meta 
          name="description" 
          content={`Get the latest Shri Ganesh lottery results. Winning number: ${luckyNumber}. Draw time: ${gameTime} on ${displayDate}. Verified and updated in real-time.`} 
        />
        <meta 
          name="keywords" 
          content="Shri Ganesh lottery, lottery results, winning numbers, daily lottery, lottery draw, lottery winner, lottery ticket, gambling results"
        />
        <meta name="robots" content="index, follow, max-image-preview:large" />
        <meta name="author" content="Lottery Results" />
        <meta property="og:title" content={`Shri Ganesh Lottery Results - ${luckyNumber !== "--" ? `Winning Number: ${luckyNumber}` : "Live Results"}`} />
        <meta property="og:description" content={`Latest Shri Ganesh lottery results drawn at ${gameTime} on ${displayDate}. Verified winning number: ${luckyNumber}.`} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={window.location.href} />
        <meta property="og:image" content={`https://${window.location.hostname}/api/og-image?game=shri-ganesh&number=${luckyNumber}`} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt" content="Shri Ganesh Lottery Results" />
        <meta property="og:site_name" content="Lottery Results" />
        <meta property="og:locale" content="en_IN" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`Shri Ganesh Lottery Results - ${luckyNumber}`} />
        <meta name="twitter:description" content={`Winning number ${luckyNumber} drawn at ${gameTime}. Check latest lottery results.`} />
        <meta name="twitter:image" content={`https://${window.location.hostname}/api/og-image?game=shri-ganesh&number=${luckyNumber}`} />
        <meta name="twitter:creator" content="@lotteryresults" />
        <link rel="canonical" href={window.location.href} />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      </Helmet>

      <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center p-4 selection:bg-amber-500/30">
        
        {/* Hidden SEO Content for better indexing */}
        <div className="sr-only" aria-hidden="true">
          <h1>Shri Ganesh Lottery Results</h1>
          <h2>Latest Winning Numbers and Draw Information</h2>
          <p>Today's Shri Ganesh lottery winning number is {luckyNumber} drawn at {gameTime} on {displayDate}.</p>
          <p>Verified lottery results updated in real-time. Check previous results and upcoming draws.</p>
          <p>Shri Ganesh is a popular daily lottery game with draws scheduled regularly.</p>
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
                <p className="text-[10px] font-black tracking-[0.3em] uppercase text-white/80">Shri Ganesh Result</p>
                <Share2 
                  size={16} 
                  className="text-white hover:text-amber-400 cursor-pointer" 
                  onClick={() => {
                    if (navigator.share) {
                      navigator.share({
                        title: `Shri Ganesh Lottery Result - ${luckyNumber}`,
                        text: `Shri Ganesh winning number ${luckyNumber} drawn at ${gameTime}. Check it out!`,
                        url: window.location.href,
                      });
                    } else {
                      navigator.clipboard.writeText(window.location.href);
                      alert('Link copied to clipboard!');
                    }
                  }}
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
                aria-label="Refresh lottery results"
              >
                <div className="absolute inset-0 bg-linear-to-r from-amber-400 to-yellow-600 opacity-100 group-hover:opacity-90 transition-opacity" />
                <span className="relative z-10 flex items-center justify-center gap-2">
                  <RotateCcw size={14} /> Refresh Card
                </span>
              </motion.button>

            </div>
          </motion.div>
        </motion.div>
      </div>
    </>
  );
};

export default ShriGanesh;