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
    if (location.hash === "#results") {
      resultsRef.current?.scrollIntoView({ behavior: "smooth" });
    }

    if (location.hash === "#chart") {
      chartRef.current?.scrollIntoView({ behavior: "smooth" });
    }

    if (!location.hash) {
      window.scrollTo({ top: 0 });
    }
  }, [location.hash]);

  return (
    <>
      <Navbar />
      <HeaderStrip />
      <HighlightBanner />
      <Disclaimer />
      <RecentResultsWidget />

      <div id="results" ref={resultsRef}>
        <LiveResultCards />
      </div>

      <div id="chart" ref={chartRef}>
        <GameResultsTable />
      </div>

      <Disclaimer />
      <WhatsAppButton />
    </>
  );
}
