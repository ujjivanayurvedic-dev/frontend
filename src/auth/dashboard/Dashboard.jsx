import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; 
import { 
  PlusCircle, RefreshCw, Calendar, 
  LayoutDashboard, Database, Activity, CheckCircle2, 
  Loader2, ArrowUpRight, Menu, X, LogOut 
} from "lucide-react";
import api from "../../api/api";

const Dashboard = () => {
  const navigate = useNavigate();

  // --- STATE ---
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isScraping, setIsScraping] = useState(false);
  const [scrapeMessage, setScrapeMessage] = useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false); 

  const [formData, setFormData] = useState({ date: "", number: "" });
  const [editData, setEditData] = useState({ date: "", number: "" });

  // Refs for tracking automatic execution
  const lastRunRef = useRef(null);
  const scrapeFunctionRef = useRef(null);

  // --- DATA FETCHING ---
  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await axios.get(api.DateNumber.getAll, { withCredentials: true });
      setList(res.data.data || []);
    } catch (err) {
      console.error("Fetch error", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // --- SCRAPE LOGIC ---
  const handleScrape = async () => {
    // If already scraping, stop here to prevent double clicks or double triggers
    if (isScraping) {
        console.log("Scrape already in progress. Skipping.");
        return;
    }
    
    setIsScraping(true);
    setScrapeMessage("Starting Sync...");
    console.log("🚀 Starting Scrape Request..."); 

    try {
      await axios.get(api.NewScrapeData.saveScrape, { withCredentials: true });
      setScrapeMessage("Sync Successful");
      console.log("✅ Scrape Successful"); 
      fetchData(); // Refresh list after scrape
      setTimeout(() => setScrapeMessage(""), 4000);
    } catch (err) {
      console.error("❌ Scrape failed", err);
      setScrapeMessage("Sync Failed");
    } finally {
      setIsScraping(false);
    }
  };

  // Keep the Ref updated with the latest version of handleScrape
  useEffect(() => {
    scrapeFunctionRef.current = handleScrape;
  });

  // --- AUTOMATIC TIME TRIGGER (FIXED) ---
  useEffect(() => {
     // EXACT times you want the scraper to run (24h format)
     const targetTimes = [
      "06:30", "15:20", "16:50", "18:20", "21:45", "23:45"
    ];

    // Check every 1 second (1000ms) to ensure we don't miss the minute
    const intervalId = setInterval(() => {
      const now = new Date();
      
      // Force 2-digit format (e.g., 9 -> "09")
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      const currentTime = `${hours}:${minutes}`;

      // Debug: Uncomment the line below to see the clock ticking in Console
      // console.log("Checking time:", currentTime);

      if (targetTimes.includes(currentTime)) {
        // Only run if we haven't run for this specific time yet
        if (lastRunRef.current !== currentTime) {
          console.log(`⏰ MATCH FOUND: ${currentTime} - Triggering Auto-Scrape!`);
          
          if (scrapeFunctionRef.current) {
            scrapeFunctionRef.current();
          }
          
          // Mark this time as 'done' so it doesn't run 60 times in that minute
          lastRunRef.current = currentTime;
        }
      }
    }, 1000); // Changed from 5000 to 1000 for better accuracy

    return () => clearInterval(intervalId);
  }, []); 

  // --- MANUAL ADD/UPDATE ---
  const handleAction = async (e, type) => {
    e.preventDefault();
    try {
      if (type === 'add') {
        await axios.post(api.DateNumber.add, formData, { withCredentials: true });
        setFormData({ date: "", number: "" });
      } else {
        await axios.put(api.DateNumber.update(editData.date), { number: editData.number }, { withCredentials: true });
        setEditData({ date: "", number: "" });
      }
      fetchData();
    } catch (err) { alert("Action failed. Check console."); }
  };

  // --- LOGOUT FUNCTION ---
  const handleLogout = () => {
    console.log("Logging out...");
    localStorage.removeItem("isAdminLoggedIn");
    navigate("/hidden-login");
  };

  // --- RENDER ---
  return (
    <div className="app-container">
      {/* Mobile Header */}
      <div className="mobile-header">
        <div className="logo-section">
          <div className="logo-icon"><Activity size={20} color="#fff" /></div>
          <span className="logo-text">Nexus DB</span>
        </div>
        <button className="menu-btn" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Sidebar Navigation */}
      <nav className={`sidebar ${isMobileMenuOpen ? 'open' : ''}`}>
        <div className="desktop-logo">
            <div className="logo-section">
            <div className="logo-icon"><Activity size={20} color="#fff" /></div>
            <span className="logo-text">Nexus DB</span>
            </div>
        </div>
        
        <div className="nav-menu">
          <p className="menu-label">MAIN MENU</p>
          
          <button className="nav-item active">
            <LayoutDashboard size={20} />
            <span>Dashboard</span>
            <div className="active-bar"></div>
          </button>

          <button className="nav-item">
            <Database size={20} />
            <span>Scrape Logs</span>
          </button>

          {/* LOGOUT BUTTON */}
          <button className="nav-item logout" onClick={handleLogout}>
            <LogOut size={20} />
            <span>Sign Out</span>
          </button>
        </div>

        <div className="sidebar-bottom">
            <div className="status-indicator">
                <div className="status-dot"></div>
                <span>System Online</span>
            </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="main-content">
        <header className="content-header">
          <div className="header-text">
            <h1 className="page-title">Analytics Overview</h1>
            <p className="page-subtitle">Manage and monitor database entries</p>
          </div>
          
          <div className="header-actions">
            <button 
                onClick={handleScrape} 
                disabled={isScraping} 
                className={`btn-sync ${isScraping ? 'disabled' : ''}`}
            >
              {isScraping ? <Loader2 size={16} className="spin" /> : <RefreshCw size={16} />}
              {isScraping ? "Syncing..." : "Sync Database"}
            </button>
            {scrapeMessage && (
              <span className={`status-msg ${scrapeMessage.includes("Success") ? 'success' : 'error'}`}>
                {scrapeMessage}
              </span>
            )}
          </div>
        </header>

        {/* Stats Grid */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-label">Total Records</div>
            <div className="stat-value">{list.length}</div>
            <div className="stat-trend"><ArrowUpRight size={14} /> +2 today</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Last Scrape</div>
            <div className="stat-value">Just Now</div>
            <div className="stat-trend"><CheckCircle2 size={14} /> Healthy</div>
          </div>
        </div>

        {/* Action Forms Area */}
        <div className="action-grid">
          <div className="card">
            <h3 className="card-title"><PlusCircle size={18} className="icon-blue" /> New Entry</h3>
            <form onSubmit={(e) => handleAction(e, 'add')} className="action-form">
              <input className="input-field" placeholder="Date (DD-MM-YYYY)" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} />
              <input className="input-field" placeholder="Value" value={formData.number} onChange={e => setFormData({...formData, number: e.target.value})} />
              <button className="btn-primary">Submit Entry</button>
            </form>
          </div>

          <div className="card">
            <h3 className="card-title"><RefreshCw size={18} className="icon-blue" /> Quick Update</h3>
            <form onSubmit={(e) => handleAction(e, 'update')} className="action-form">
              <input className="input-field" placeholder="Target Date" value={editData.date} onChange={e => setEditData({...editData, date: e.target.value})} />
              <input className="input-field" placeholder="New Value" value={editData.number} onChange={e => setEditData({...editData, number: e.target.value})} />
              <button className="btn-secondary">Update Row</button>
            </form>
          </div>
        </div>

        {/* Table Area */}
        <div className="table-wrapper">
          <div className="table-scroll">
            <table className="data-table">
                <thead>
                <tr>
                    <th>Date</th>
                    <th>Status</th>
                    <th>Recorded Value</th>
                </tr>
                </thead>
                <tbody>
                {list.map((item, idx) => (
                    <tr key={item._id || idx}>
                    <td>
                        <div className="date-cell"><Calendar size={14} /> {item.date}</div>
                    </td>
                    <td>
                        <span className="badge-active"><div className="dot" /> Active</span>
                    </td>
                    <td>
                        <strong className="value-text">{item.number}</strong>
                    </td>
                    </tr>
                ))}
                </tbody>
            </table>
          </div>
          {list.length === 0 && <div className="empty-state">No data found in database.</div>}
        </div>
      </main>

      {/* STYLES */}
      <style>{`
        :root {
            --primary: #4318FF;
            --secondary: #E9EDF7;
            --text-dark: #1B2559;
            --text-gray: #A3AED0;
            --success: #05CD99;
            --bg: #F4F7FE;
            --white: #ffffff;
            --radius: 16px;
        }

        * { box-sizing: border-box; }
        body { margin: 0; font-family: 'Plus Jakarta Sans', sans-serif; background: var(--bg); color: var(--text-dark); }
        
        .spin { animation: spin 1s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }

        .app-container { display: flex; flex-direction: column; min-height: 100vh; }
        
        /* Mobile Header */
        .mobile-header { display: flex; justify-content: space-between; align-items: center; padding: 16px 20px; background: var(--white); border-bottom: 1px solid var(--secondary); position: sticky; top: 0; z-index: 50; }
        .menu-btn { background: none; border: none; cursor: pointer; color: var(--text-dark); }
        
        /* Sidebar */
        .sidebar { background: var(--white); border-right: 1px solid var(--secondary); display: flex; flex-direction: column; padding: 24px; position: fixed; top: 60px; left: -100%; width: 100%; height: calc(100vh - 60px); transition: left 0.3s ease; z-index: 40; }
        .sidebar.open { left: 0; }
        .desktop-logo { display: none; }
        .logo-section { display: flex; align-items: center; gap: 12px; }
        .logo-icon { width: 32px; height: 32px; background: var(--primary); border-radius: 10px; display: flex; align-items: center; justify-content: center; }
        .logo-text { font-size: 20px; font-weight: 800; color: var(--text-dark); }

        /* Nav Menu */
        .nav-menu { display: flex; flex-direction: column; gap: 8px; margin-top: 30px; flex: 1; }
        .menu-label { font-size: 11px; font-weight: 700; color: var(--text-gray); letter-spacing: 1px; margin: 0 0 8px 12px; opacity: 0.6; }
        .nav-item { position: relative; display: flex; align-items: center; gap: 14px; width: 100%; border: none; background: transparent; padding: 14px 16px; border-radius: 12px; color: var(--text-gray); font-weight: 600; font-size: 14px; cursor: pointer; transition: all 0.2s ease-in-out; text-align: left; }
        .nav-item:hover { background: var(--bg); color: var(--primary); transform: translateX(4px); }
        
        /* Logout Specific */
        .nav-item.logout:hover { background: #FFF1F1; color: #E03137; }

        .nav-item.active { background: var(--primary); color: var(--white); box-shadow: 0 10px 20px -5px rgba(67, 24, 255, 0.4); }
        .nav-item.active .active-bar { position: absolute; right: 0; top: 50%; transform: translateY(-50%); width: 4px; height: 24px; background: rgba(255, 255, 255, 0.3); border-radius: 4px 0 0 4px; }

        .sidebar-bottom { margin-top: auto; padding-top: 20px; border-top: 1px solid var(--secondary); }
        .status-indicator { display: flex; align-items: center; gap: 8px; font-size: 14px; color: var(--success); font-weight: 600; }
        .status-dot { width: 8px; height: 8px; background: var(--success); border-radius: 50%; box-shadow: 0 0 0 4px rgba(5, 205, 153, 0.1); }

        /* Content */
        .main-content { flex: 1; padding: 20px; overflow-y: auto; }
        .content-header { display: flex; flex-direction: column; gap: 16px; margin-bottom: 24px; }
        .page-title { font-size: 24px; font-weight: 800; margin: 0; color: var(--text-dark); }
        .page-subtitle { color: var(--text-gray); margin: 4px 0 0 0; font-size: 14px; }
        .header-actions { display: flex; align-items: center; justify-content: space-between; gap: 12px; width: 100%; }
        
        .btn-sync { display: flex; align-items: center; gap: 8px; background: var(--white); border: 1px solid transparent; padding: 10px 16px; border-radius: 12px; color: var(--primary); font-weight: 700; cursor: pointer; box-shadow: 0 4px 10px rgba(0,0,0,0.03); transition: 0.2s; white-space: nowrap; flex: 1; justify-content: center; }
        .btn-sync:active { transform: scale(0.98); }
        .btn-sync.disabled { background: var(--secondary); color: var(--text-gray); cursor: not-allowed; }
        
        .status-msg { font-size: 12px; font-weight: 700; }
        .status-msg.success { color: var(--success); }
        .status-msg.error { color: #EE5D50; }

        .stats-grid, .action-grid { display: grid; grid-template-columns: 1fr; gap: 16px; margin-bottom: 24px; }
        .stat-card, .card, .table-wrapper { background: var(--white); padding: 20px; border-radius: var(--radius); box-shadow: 0 4px 20px rgba(0,0,0,0.02); }
        
        .stat-label { color: var(--text-gray); font-size: 14px; font-weight: 500; }
        .stat-value { font-size: 28px; font-weight: 800; color: var(--text-dark); margin: 8px 0; }
        .stat-trend { font-size: 13px; color: var(--success); display: flex; align-items: center; gap: 4px; font-weight: 600; }

        .card-title { margin: 0 0 16px 0; font-size: 16px; color: var(--text-dark); display: flex; align-items: center; gap: 10px; }
        .icon-blue { color: var(--primary); }
        .action-form { display: flex; flex-direction: column; gap: 12px; }
        .input-field { padding: 14px; border-radius: 12px; border: 1px solid var(--secondary); background: var(--bg); outline: none; font-size: 14px; transition: 0.2s; }
        .input-field:focus { border-color: var(--primary); background: var(--white); }
        .btn-primary { background: var(--primary); color: var(--white); border: none; padding: 14px; border-radius: 12px; font-weight: 700; cursor: pointer; transition: 0.2s; }
        .btn-primary:hover { background: #3311db; }
        .btn-secondary { background: var(--secondary); color: var(--text-dark); border: none; padding: 14px; border-radius: 12px; font-weight: 700; cursor: pointer; transition: 0.2s; }
        .btn-secondary:hover { background: #dce1ef; }

        .table-scroll { overflow-x: auto; -webkit-overflow-scrolling: touch; }
        .data-table { width: 100%; border-collapse: collapse; min-width: 500px; } 
        .data-table th { text-align: left; padding: 12px; border-bottom: 1px solid var(--secondary); color: var(--text-gray); font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px; }
        .data-table td { padding: 16px 12px; border-bottom: 1px solid var(--bg); color: var(--text-dark); font-size: 14px; }
        .date-cell { display: flex; align-items: center; gap: 8px; font-weight: 600; }
        .badge-active { display: inline-flex; align-items: center; gap: 6px; background: rgba(5, 205, 153, 0.1); color: var(--success); padding: 4px 10px; border-radius: 20px; font-size: 12px; font-weight: 700; }
        .dot { width: 6px; height: 6px; background: var(--success); border-radius: 50%; }
        .value-text { color: var(--primary); font-size: 16px; }
        .empty-state { text-align: center; padding: 40px; color: var(--text-gray); font-style: italic; }

        @media (min-width: 1024px) {
            .app-container { flex-direction: row; }
            .mobile-header { display: none; }
            .sidebar { position: sticky; top: 0; left: 0; width: 280px; height: 100vh; padding: 30px; transform: none; border-right: 1px solid var(--secondary); }
            .desktop-logo { display: block; margin-bottom: 40px; }
            .main-content { padding: 40px; }
            .content-header { flex-direction: row; justify-content: space-between; align-items: center; }
            .header-actions { width: auto; }
            .btn-sync { flex: unset; }
            .stats-grid { grid-template-columns: repeat(2, 1fr); gap: 24px; }
            .action-grid { grid-template-columns: repeat(2, 1fr); gap: 24px; }
            .page-title { font-size: 32px; }
        }
      `}</style>
    </div>
  );
};

export default Dashboard;