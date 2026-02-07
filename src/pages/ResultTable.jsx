import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { RefreshCw, TrendingUp, Clock, Crown, Calendar } from 'lucide-react';
import api from '../api/api';

const SattaDashboard = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState('');
  const [currentDate, setCurrentDate] = useState('');
  const [error, setError] = useState(null);

  const gamesList = [
    "DESAWAR",
    "DELHI BAZAR", 
    "SHRI GANESH",
    "FARIDABAD",
    "GHAZIABAD",
    "GALI",
    "NOIDA KING"
  ];

  // SEO keywords for February 2026
  const seoKeywords = [
    "February 2026 Satta King",
    "Satta King Result February 2026",
    "February 2026 Lottery Results",
    "2026 Satta King Chart",
    "Satta Result February 2026",
    "Satta King February Month",
    "2026 Monthly Satta Results",
    "February Satta Bazar",
    "Desawar February 2026",
    "Gali Result February 2026",
    "Delhi Bazar February 2026",
    "Faridabad Satta February 2026",
    "Ghaziabad Result Feb 2026",
    "Noida King February Month",
    "Shri Ganesh February 2026",
    "satta king live",
    "satta result",
    "satta dashboard",
    "lottery results"
  ];

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${api.NewScrapeData.gameChartLive}?_t=${Date.now()}`);
      const result = await response.json();

      if (result.success && result.data && result.data.length > 0) {
        const latestData = result.data[0]; // Get latest day data
        const formattedData = gamesList.map(gameName => {
          const game = latestData.games[gameName];
          let todayResult = "--";
          let yesterdayResult = "--";
          
          // Get today's result
          if (game && game.result && game.result.trim() !== "" && game.result !== "??") {
            todayResult = game.result;
          }
          
          // Get yesterday's result
          if (result.data.length > 1) {
            const yesterdayData = result.data[1];
            const yesterdayGame = yesterdayData.games[gameName];
            if (yesterdayGame && yesterdayGame.result && yesterdayGame.result.trim() !== "" && yesterdayGame.result !== "??") {
              yesterdayResult = yesterdayGame.result;
            }
          }

          return {
            name: gameName,
            result: todayResult,
            yesterday: yesterdayResult,
            time: game?.time || "00:00",
            date: latestData.date
          };
        });

        setData(formattedData);
        setCurrentDate(latestData.date);
        setLastUpdated(new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }));
      }
      setError(null);
    } catch (err) {
      console.error("Dashboard API Error:", err);
      setError("Failed to fetch data. Please try again.");
      // Fallback to sample data
      setData(gamesList.map(name => ({
        name,
        result: Math.floor(Math.random() * 90 + 10).toString().padStart(2, '0'),
        yesterday: Math.floor(Math.random() * 90 + 10).toString().padStart(2, '0'),
        time: "00:00",
        date: new Date().toLocaleDateString('en-IN').replace(/\//g, '-')
      })));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // Refresh every 5 minutes
    const interval = setInterval(fetchData, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  // Format date to display
  const formatDate = (dateStr) => {
    if (!dateStr) return new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
    const parts = dateStr.split('-');
    if (parts.length === 3) {
      const date = new Date(parts[2], parts[1] - 1, parts[0]);
      return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
    }
    return dateStr;
  };

  // Check if date is in February 2026 for SEO
  const isFebruary2026 = () => {
    const date = new Date();
    return date.getMonth() === 1 && date.getFullYear() === 2026; // Month is 0-indexed
  };

  // Generate page title based on date
  const generatePageTitle = () => {
    if (isFebruary2026()) {
      return "February 2026 Satta King Live Results | Real-Time Lottery Dashboard";
    }
    return "Satta King Live Dashboard - All Lottery Results in One Place";
  };

  // Generate meta description
  const generateMetaDescription = () => {
    if (isFebruary2026()) {
      return `Get February 2026 Satta King results live. Track Desawar, Gali, Delhi Bazar, Faridabad, Ghaziabad, Noida King, and Shri Ganesh lottery results for February 2026 month. Updated in real-time.`;
    }
    return "Live Satta King dashboard showing real-time results for Desawar, Gali, Delhi Bazar, Faridabad, Ghaziabad, Noida King, and Shri Ganesh lottery games.";
  };

  // Generate structured data for SEO
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Dashboard",
    "name": "February 2026 Satta King Results Dashboard",
    "description": `Live Satta King results dashboard for February 2026 showing all major lottery games including Desawar, Gali, Delhi Bazar, and more`,
    "url": window.location.href,
    "datePublished": "2026-02-01T00:00:00Z",
    "dateModified": new Date().toISOString(),
    "temporalCoverage": "2026-02-01/2026-02-28",
    "mainEntity": data.map(item => ({
      "@type": "LotteryGame",
      "name": item.name,
      "gameNumber": item.result !== "--" ? item.result : undefined,
      "previousResult": item.yesterday !== "--" ? item.yesterday : undefined,
      "date": currentDate
    }))
  };

  // Calculate statistics
  const totalGames = data.length;
  const liveGames = data.filter(item => item.result !== "--").length;
  const averageResult = data.reduce((sum, item) => {
    const num = parseInt(item.result);
    return sum + (isNaN(num) ? 0 : num);
  }, 0) / liveGames || 0;

  return (
    <>
      {/* SEO Meta Tags */}
      <Helmet>
        <title>{generatePageTitle()}</title>
        <meta name="description" content={generateMetaDescription()} />
        <meta name="keywords" content={seoKeywords.join(', ')} />
        <meta name="robots" content="index, follow" />
        <meta name="author" content="Satta King Results" />
        
        {/* Month Specific Meta */}
        <meta name="month" content="February 2026" />
        <meta name="year" content="2026" />
        
        {/* Open Graph */}
        <meta property="og:title" content="February 2026 Satta King Results | Live Dashboard" />
        <meta property="og:description" content="Track all February 2026 Satta King lottery results in real-time. Get live updates for Desawar, Gali, Delhi Bazar and more." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={window.location.href} />
        <meta property="og:image" content={`https://${window.location.hostname}/api/og-image/february-2026-dashboard`} />
        <meta property="og:site_name" content="Satta King Results" />
        
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="February 2026 Satta King Live Results" />
        <meta name="twitter:description" content="All February 2026 lottery results in one place. Real-time updates for 7 major Satta games." />
        <meta name="twitter:image" content={`https://${window.location.hostname}/api/twitter-image/february-2026`} />
        
        {/* Canonical */}
        <link rel="canonical" href={window.location.href} />
        
        {/* Structured Data */}
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
        
        {/* Additional Meta */}
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="theme-color" content="#e67e22" />
        <meta name="apple-mobile-web-app-title" content="Feb 2026 Satta King" />
      </Helmet>

      <div style={styles.container}>
        <style>
          {`
            @keyframes pulse {
              0% { opacity: 1; }
              50% { opacity: 0.7; }
              100% { opacity: 1; }
            }
            @keyframes slideIn {
              from { transform: translateX(-10px); opacity: 0; }
              to { transform: translateX(0); opacity: 1; }
            }
            .glass-card:hover { 
              border-left: 8px solid #e67e22; 
              transition: 0.3s; 
              transform: translateY(-2px);
              box-shadow: 0 8px 25px rgba(211, 84, 0, 0.15);
            }
            .glass-card:active { 
              transform: scale(0.98); 
              transition: 0.2s; 
            }
            .glow { animation: pulse 2s infinite; }
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}
        </style>

        {/* Header Area with Month Badge */}
        <div style={styles.header}>
          <div style={styles.headerTop}>
            <div style={styles.titleContainer}>
              <Crown size={24} style={styles.crownIcon} />
              <div>
                <h1 style={styles.title}>Satta King Live</h1>
                {isFebruary2026() && (
                  <div style={styles.monthBadge}>
                    <Calendar size={12} />
                    <span>February 2026 Edition</span>
                  </div>
                )}
              </div>
            </div>
            <button 
              onClick={fetchData} 
              style={styles.refreshButton}
              disabled={loading}
            >
              <RefreshCw size={18} style={loading ? { animation: 'spin 1s linear infinite' } : {}} />
              {loading ? 'Updating...' : 'Refresh'}
            </button>
          </div>
          
          <div style={styles.dateBadge}>
            <Clock size={12} />
            <span>{formatDate(currentDate)}</span>
            {lastUpdated && <span style={styles.updateTime}> • Updated: {lastUpdated}</span>}
          </div>

          {/* Stats Bar */}
          <div style={styles.statsBar}>
            <div style={styles.statItem}>
              <div style={styles.statValue}>{totalGames}</div>
              <div style={styles.statLabel}>Games</div>
            </div>
            <div style={styles.statDivider} />
            <div style={styles.statItem}>
              <div style={styles.statValue}>{liveGames}</div>
              <div style={styles.statLabel}>Live</div>
            </div>
            <div style={styles.statDivider} />
            <div style={styles.statItem}>
              <div style={styles.statValue}>{Math.round(averageResult)}</div>
              <div style={styles.statLabel}>Avg</div>
            </div>
            {isFebruary2026() && (
              <>
                <div style={styles.statDivider} />
                <div style={styles.statItem}>
                  <Calendar size={16} style={{color: '#e67e22'}} />
                  <div style={styles.statLabel}>Feb 2026</div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div style={styles.errorCard}>
            <div style={styles.errorText}>{error}</div>
            <button onClick={fetchData} style={styles.retryButton}>
              Retry
            </button>
          </div>
        )}

        {/* Loading State */}
        {loading && data.length === 0 ? (
          <div style={styles.loadingContainer}>
            <div style={styles.loadingSpinner}></div>
            <div style={styles.loadingText}>Fetching February 2026 results...</div>
          </div>
        ) : (
          /* List Container */
          <div style={styles.listContainer}>
            {data.map((item, i) => (
              <div key={i} style={styles.listRow} className="glass-card">
                <div style={styles.listLabel}>
                  <div style={styles.dotContainer}>
                    <div style={styles.dot}></div>
                    {item.result !== "--" && <div style={styles.liveGlow}></div>}
                  </div>
                  <div>
                    <div style={styles.gameName}>{item.name}</div>
                    <div style={styles.yesterdayContainer}>
                      <TrendingUp size={10} />
                      <div style={styles.yesterdayText}>Yesterday: {item.yesterday}</div>
                    </div>
                    <div style={styles.timeText}>{item.time}</div>
                  </div>
                </div>
                <div style={styles.resultContainer}>
                  <div style={{
                    ...styles.listResult,
                    ...(item.result === "--" ? styles.pendingResult : {})
                  }}>
                    {item.result}
                  </div>
                  <div style={{
                    ...styles.liveIndicator,
                    ...(item.result === "--" ? styles.pendingIndicator : {})
                  }}>
                    {item.result === "--" ? "PENDING" : "LIVE"}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* SEO Content for February 2026 */}
        <div style={styles.seoContent}>
          <h2 style={styles.seoHeading}>February 2026 Satta King Results</h2>
          <p style={styles.seoParagraph}>
            Welcome to the comprehensive February 2026 Satta King results dashboard. 
            This page provides live updates for all major Satta games throughout February 2026. 
            Track daily results for Desawar, Gali, Delhi Bazar, Faridabad, Ghaziabad, Noida King, 
            and Shri Ganesh lottery games. Our system automatically updates with the latest 
            February 2026 Satta King results as they become available.
          </p>
          
          <h3 style={styles.seoSubHeading}>February 2026 Monthly Chart</h3>
          <p style={styles.seoParagraph}>
            This dashboard serves as your complete February 2026 Satta King chart, 
            showing real-time results for all major games. Whether you're looking for 
            Desawar February 2026 results, Gali results for February 2026, or Delhi Bazar 
            numbers for this month, you'll find them all here updated live.
          </p>
          
          <div style={styles.monthList}>
            <h4 style={styles.seoListHeading}>February 2026 Games Covered:</h4>
            <ul style={styles.seoList}>
              <li>Desawar Satta King February 2026 Results</li>
              <li>Gali Lottery February 2026 Live Numbers</li>
              <li>Delhi Bazar Satta February 2026 Updates</li>
              <li>Faridabad Satta King Feb 2026 Results</li>
              <li>Ghaziabad Lottery February 2026 Numbers</li>
              <li>Noida King February 2026 Live Results</li>
              <li>Shri Ganesh Satta February 2026 Chart</li>
            </ul>
          </div>
          
          <p style={styles.seoParagraph}>
            Bookmark this page for easy access to all February 2026 Satta King results. 
            The dashboard refreshes automatically every 5 minutes to ensure you have 
            the most current lottery numbers for February 2026.
          </p>
        </div>

        {/* Footer */}
        <div style={styles.footer}>
          <div style={styles.footerText}>
            February 2026 Satta King results are automatically updated. 
            Results are for informational purposes only.
          </div>
        </div>
      </div>
    </>
  );
};

const styles = {
  container: {
    padding: '20px',
    background: 'linear-gradient(135deg, #fff5e6 0%, #ffdfba 100%)',
    minHeight: '100vh',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    color: '#5d4037'
  },
  header: {
    marginBottom: '25px'
  },
  headerTop: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '10px'
  },
  titleContainer: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '10px'
  },
  crownIcon: {
    color: '#e67e22',
    marginTop: '5px'
  },
  title: {
    fontSize: '24px',
    fontWeight: '900',
    color: '#a04000',
    margin: '0 0 5px 0',
    textTransform: 'uppercase',
    letterSpacing: '0.5px'
  },
  monthBadge: {
    display: 'flex',
    alignItems: 'center',
    gap: '5px',
    background: 'linear-gradient(135deg, #2c3e50 0%, #34495e 100%)',
    color: 'white',
    padding: '4px 10px',
    borderRadius: '12px',
    fontSize: '11px',
    fontWeight: '600',
    width: 'fit-content'
  },
  refreshButton: {
    background: 'linear-gradient(135deg, #e67e22 0%, #d35400 100%)',
    color: 'white',
    border: 'none',
    padding: '8px 16px',
    borderRadius: '25px',
    fontSize: '14px',
    fontWeight: '600',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    cursor: 'pointer',
    boxShadow: '0 4px 12px rgba(230, 126, 34, 0.2)',
    transition: 'all 0.3s',
    marginTop: '5px'
  },
  dateBadge: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    background: '#e67e22',
    color: 'white',
    padding: '6px 16px',
    borderRadius: '20px',
    fontSize: '13px',
    fontWeight: '600',
    width: 'fit-content',
    marginBottom: '15px'
  },
  updateTime: {
    fontSize: '11px',
    opacity: 0.9
  },
  statsBar: {
    display: 'flex',
    background: 'rgba(255, 255, 255, 0.8)',
    borderRadius: '15px',
    padding: '12px',
    justifyContent: 'space-around',
    alignItems: 'center',
    boxShadow: '0 4px 12px rgba(211, 84, 0, 0.08)'
  },
  statItem: {
    textAlign: 'center',
    flex: 1
  },
  statValue: {
    fontSize: '24px',
    fontWeight: '900',
    color: '#d35400',
    lineHeight: '1'
  },
  statLabel: {
    fontSize: '11px',
    color: '#a04000',
    opacity: 0.7,
    fontWeight: '600',
    textTransform: 'uppercase',
    marginTop: '2px'
  },
  statDivider: {
    width: '1px',
    height: '30px',
    background: 'rgba(230, 126, 34, 0.2)',
    margin: '0 5px'
  },
  errorCard: {
    background: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%)',
    color: 'white',
    padding: '15px',
    borderRadius: '15px',
    marginBottom: '20px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    animation: 'slideIn 0.3s ease-out'
  },
  errorText: {
    fontSize: '14px',
    fontWeight: '500'
  },
  retryButton: {
    background: 'white',
    color: '#e67e22',
    border: 'none',
    padding: '6px 12px',
    borderRadius: '20px',
    fontSize: '12px',
    fontWeight: '600',
    cursor: 'pointer'
  },
  loadingContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '40px 20px'
  },
  loadingSpinner: {
    width: '40px',
    height: '40px',
    border: '4px solid rgba(230, 126, 34, 0.2)',
    borderTop: '4px solid #e67e22',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
    marginBottom: '15px'
  },
  loadingText: {
    color: '#a04000',
    fontSize: '14px',
    fontWeight: '500'
  },
  listContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    marginBottom: '30px'
  },
  listRow: {
    background: 'linear-gradient(90deg, #ffffff 0%, #fff0e0 100%)',
    borderRadius: '15px',
    padding: '15px 20px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    boxShadow: '0 4px 15px rgba(211, 84, 0, 0.08)',
    borderLeft: '5px solid #e67e22',
    transition: 'all 0.3s',
    animation: 'slideIn 0.5s ease-out'
  },
  listLabel: {
    display: 'flex',
    alignItems: 'center',
    gap: '15px'
  },
  dotContainer: {
    position: 'relative',
    width: '20px',
    height: '20px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  dot: {
    width: '10px',
    height: '10px',
    background: '#e67e22',
    borderRadius: '50%',
    boxShadow: '0 0 8px #e67e22',
    zIndex: 2
  },
  liveGlow: {
    position: 'absolute',
    width: '20px',
    height: '20px',
    background: '#e67e22',
    borderRadius: '50%',
    opacity: 0.3,
    animation: 'pulse 2s infinite'
  },
  gameName: {
    fontWeight: '800',
    fontSize: '15px',
    color: '#5d4037',
    textTransform: 'uppercase',
    letterSpacing: '0.3px'
  },
  yesterdayContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '5px',
    marginTop: '3px'
  },
  yesterdayText: {
    fontSize: '11px',
    color: '#a04000',
    opacity: 0.7,
    fontWeight: '600'
  },
  timeText: {
    fontSize: '10px',
    color: '#e67e22',
    fontWeight: '600',
    marginTop: '2px'
  },
  resultContainer: {
    textAlign: 'right'
  },
  listResult: {
    fontSize: '32px',
    fontWeight: '900',
    color: '#d35400',
    lineHeight: '1',
    textShadow: '1px 1px 3px rgba(211, 84, 0, 0.1)'
  },
  pendingResult: {
    color: '#bdc3c7',
    fontSize: '28px'
  },
  liveIndicator: {
    fontSize: '10px',
    color: '#27ae60',
    fontWeight: 'bold',
    marginTop: '3px',
    textTransform: 'uppercase',
    letterSpacing: '0.5px'
  },
  pendingIndicator: {
    color: '#e67e22'
  },
  // SEO Content Styling
  seoContent: {
    background: 'rgba(255, 255, 255, 0.9)',
    borderRadius: '15px',
    padding: '20px',
    marginBottom: '20px',
    boxShadow: '0 4px 15px rgba(211, 84, 0, 0.05)',
    border: '1px solid rgba(230, 126, 34, 0.1)'
  },
  seoHeading: {
    fontSize: '18px',
    fontWeight: '700',
    color: '#2c3e50',
    margin: '0 0 15px 0',
    paddingBottom: '10px',
    borderBottom: '2px solid #e67e22'
  },
  seoSubHeading: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#34495e',
    margin: '20px 0 10px 0'
  },
  seoParagraph: {
    fontSize: '14px',
    lineHeight: '1.6',
    color: '#2c3e50',
    margin: '0 0 15px 0'
  },
  monthList: {
    background: 'rgba(230, 126, 34, 0.05)',
    padding: '15px',
    borderRadius: '10px',
    margin: '15px 0'
  },
  seoListHeading: {
    fontSize: '15px',
    fontWeight: '600',
    color: '#d35400',
    margin: '0 0 10px 0'
  },
  seoList: {
    margin: '0',
    paddingLeft: '20px'
  },
  seoListli: {
    fontSize: '13px',
    lineHeight: '1.8',
    color: '#5d4037',
    marginBottom: '5px'
  },
  footer: {
    textAlign: 'center',
    paddingTop: '20px',
    borderTop: '1px solid rgba(230, 126, 34, 0.1)'
  },
  footerText: {
    fontSize: '12px',
    color: '#a04000',
    opacity: 0.7,
    marginBottom: '10px'
  },
  sourceInfo: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    fontSize: '11px',
    color: '#e67e22',
    fontWeight: '600'
  },
  sourceDot: {
    width: '6px',
    height: '6px',
    background: '#27ae60',
    borderRadius: '50%',
    animation: 'pulse 2s infinite'
  }
};

export default SattaDashboard;