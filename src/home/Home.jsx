import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import Navbar from "../components/header/Navbar";
import HeaderStrip from "../components/header/HeaderStrip";
import HighlightBanner from "../components/header/HighlightBanner";
import WhatsAppButton from "../components/main/WhatsAppButton";
import GameResultsTable from "../components/main/GameResultsTable";
import LiveResultCards from "../components/main/LiveResultCards";
import Disclaimer from "../components/Disclaimer/Disclaimer";
import RecentResultsWidget from "../components/main/RecentResultsWidget";




export default function Home() {
  const location = useLocation();

  const resultsRef = useRef(null);
  const chartRef = useRef(null);

  useEffect(() => {
    if (location.pathname === "/satta-king") {
      resultsRef.current?.scrollIntoView({ behavior: "smooth" });
    }
    if (location.pathname === "/chart") {
      chartRef.current?.scrollIntoView({ behavior: "smooth" });
    }
    if (location.pathname === "/") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [location.pathname]);

  return (
    <>
      <Navbar />
      <HeaderStrip />
      <HighlightBanner />
      <Disclaimer />
      <RecentResultsWidget/>
      <div ref={resultsRef}>
        <LiveResultCards/>
      </div>
      <div ref={chartRef}>
        <GameResultsTable/>
      </div>
      <Disclaimer />
      <WhatsAppButton />
    </>
  );
}