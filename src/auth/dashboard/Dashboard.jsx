import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; 
import { 
  PlusCircle, RefreshCw, Calendar, 
  LayoutDashboard, Database, Activity, CheckCircle2, 
  Loader2, ArrowUpRight, Menu, X, LogOut,
  Edit2, Check, Save // Added icons for editing
} from "lucide-react";
import api from "../../api/api";

const Dashboard = () => {
  const navigate = useNavigate();

  // --- STATE ---
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Scrape State
  const [isScraping, setIsScraping] = useState(false);
  const [scrapeMessage, setScrapeMessage] = useState("");
  
  // UI State
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false); 

  // Form State (Only for New Entry now)
  const [formData, setFormData] = useState({ date: "", number: "" });

  // --- INLINE EDITING STATE ---
  const [editingDate, setEditingDate] = useState(null); // Tracks which row is active
  const [editValue, setEditValue] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);

  // Refs for tracking automatic execution
  const lastRunRef = useRef(null);
  const scrapeFunctionRef = useRef(null);

  // --- DATA FETCHING ---
  const fetchData = async () => {
    // Only show full loader on initial load
    if(list.length === 0) setLoading(true);
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

  // --- INLINE UPDATE LOGIC (The Fix) ---
  const startEditing = (item) => {
    setEditingDate(item.date);
    setEditValue(item.number);
  };

  const cancelEditing = () => {
    setEditingDate(null);
    setEditValue("");
  };

  const handleInlineUpdate = async (date) => {
    if (!editValue) return;
    setIsUpdating(true);

    try {
      // CRITICAL FIX: Encode the date to handle slashes (12/05/2024 -> 12%2F05%2F2024)
      const encodedDate = encodeURIComponent(date); 
      
      await axios.put(
        api.DateNumber.update(encodedDate), 
        { number: editValue },
        { withCredentials: true }
      );

      // Optimistic Update (Update UI immediately)
      setList((prevList) =>
        prevList.map((item) =>
          item.date === date ? { ...item, number: editValue } : item
        )
      );

      setScrapeMessage("Update Saved!");
      setTimeout(() => setScrapeMessage(""), 3000);
      cancelEditing();
    } catch (err) {
      console.error("Update failed", err);
      alert("Update failed. Please check console.");
    } finally {
      setIsUpdating(false);
    }
  };

  // --- SCRAPE LOGIC ---
  const handleScrape = async () => {
    if (isScraping) return;
    
    setIsScraping(true);
    setScrapeMessage("Starting Sync...");

    try {
      await axios.post(api.NewScrapeData.saveScrape, {}, { // Ensure POST if that's what API expects
          withCredentials: true,
          headers: { "x-scrape-secret": import.meta.env.VITE_SCRAPE_SECRET }
      });
      setScrapeMessage("Sync Successful");
      fetchData(); 
      setTimeout(() => setScrapeMessage(""), 4000);
    } catch (err) {
      console.error("Scrape failed", err);
      setScrapeMessage("Sync Failed");
    } finally {
      setIsScraping(false);
    }
  };

  useEffect(() => {
    scrapeFunctionRef.current = handleScrape;
  });

  // --- AUTOMATIC TIME TRIGGER ---
  useEffect(() => {
     const targetTimes = ["06:30", "15:20", "16:50", "18:20", "21:45", "23:45"];
    const intervalId = setInterval(() => {
      const now = new Date();
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      const currentTime = `${hours}:${minutes}`;

      if (targetTimes.includes(currentTime)) {
        if (lastRunRef.current !== currentTime) {
          scrapeFunctionRef.current?.();
          lastRunRef.current = currentTime;
        }
      }
    }, 1000); 

    return () => clearInterval(intervalId);
  }, []); 

  // --- ADD NEW ENTRY ---
  const handleAdd = async (e) => {
    e.preventDefault();
    try {
        await axios.post(api.DateNumber.add, formData, { withCredentials: true });
        setFormData({ date: "", number: "" });
        fetchData();
    } catch (err) { alert("Add failed."); }
  };

  // --- LOGOUT ---
  const handleLogout = () => {
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
              <span className={`status-msg ${scrapeMessage.includes("Success") || scrapeMessage.includes("Saved") ? 'success' : 'error'}`}>
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
            <div className="stat-trend"><ArrowUpRight size={14} /> Live Data</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">System Status</div>
            <div className="stat-value">Active</div>
            <div className="stat-trend"><CheckCircle2 size={14} /> Healthy</div>
          </div>
          
          {/* Moved "New Entry" here to balance layout since I removed Quick Update */}
           <div className="stat-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <h3 className="card-title" style={{marginBottom: '10px'}}><PlusCircle size={18} className="icon-blue" /> Quick Add</h3>
            <form onSubmit={handleAdd} style={{display:'flex', gap:'8px'}}>
              <input className="input-field-small" placeholder="Date (DD-MM-YYYY)" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} />
              <input className="input-field-small" placeholder="Value" value={formData.number} onChange={e => setFormData({...formData, number: e.target.value})} />
              <button className="btn-icon-only"><PlusCircle size={20}/></button>
            </form>
          </div>
        </div>

        {/* Table Area */}
        <div className="table-wrapper">
          <div className="table-scroll">
            <table className="data-table">
                <thead>
                <tr>
                    <th style={{width: '30%'}}>Date</th>
                    <th style={{width: '20%'}}>Status</th>
                    <th style={{width: '30%'}}>Recorded Value</th>
                    <th style={{width: '20%', textAlign: 'right'}}>Actions</th>
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
                    
                    {/* EDITABLE CELL */}
                    <td>
                        {editingDate === item.date ? (
                            <input 
                                className="table-input"
                                value={editValue}
                                onChange={(e) => setEditValue(e.target.value)}
                                autoFocus
                            />
                        ) : (
                            <strong className="value-text">{item.number}</strong>
                        )}
                    </td>

                    {/* ACTION BUTTONS */}
                    <td style={{textAlign: 'right'}}>
                        {editingDate === item.date ? (
                            <div className="action-buttons">
                                <button onClick={() => handleInlineUpdate(item.date)} className="btn-action save" disabled={isUpdating}>
                                    {isUpdating ? <Loader2 size={16} className="spin"/> : <Check size={16} />}
                                </button>
                                <button onClick={cancelEditing} className="btn-action cancel" disabled={isUpdating}>
                                    <X size={16} />
                                </button>
                            </div>
                        ) : (
                            <button onClick={() => startEditing(item)} className="btn-action edit">
                                <Edit2 size={16} />
                            </button>
                        )}
                    </td>
                    </tr>
                ))}
                </tbody>
            </table>
          </div>
          {!loading && list.length === 0 && <div className="empty-state">No data found in database.</div>}
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

        .stats-grid { display: grid; grid-template-columns: 1fr; gap: 16px; margin-bottom: 24px; }
        .stat-card, .table-wrapper { background: var(--white); padding: 20px; border-radius: var(--radius); box-shadow: 0 4px 20px rgba(0,0,0,0.02); }
        
        .stat-label { color: var(--text-gray); font-size: 14px; font-weight: 500; }
        .stat-value { font-size: 28px; font-weight: 800; color: var(--text-dark); margin: 8px 0; }
        .stat-trend { font-size: 13px; color: var(--success); display: flex; align-items: center; gap: 4px; font-weight: 600; }
        
        /* New Mini Form Styles */
        .card-title { margin: 0; font-size: 14px; color: var(--text-dark); display: flex; align-items: center; gap: 8px; font-weight: 700; }
        .icon-blue { color: var(--primary); }
        .input-field-small { padding: 8px 12px; border-radius: 8px; border: 1px solid var(--secondary); background: var(--bg); outline: none; font-size: 13px; flex: 1; min-width: 0; }
        .input-field-small:focus { border-color: var(--primary); background: var(--white); }
        .btn-icon-only { background: var(--primary); color: white; border: none; border-radius: 8px; width: 36px; display: flex; align-items: center; justify-content: center; cursor: pointer; }
        .btn-icon-only:hover { background: #3311db; }

        .table-scroll { overflow-x: auto; -webkit-overflow-scrolling: touch; }
        .data-table { width: 100%; border-collapse: collapse; min-width: 500px; } 
        .data-table th { text-align: left; padding: 12px; border-bottom: 1px solid var(--secondary); color: var(--text-gray); font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px; }
        .data-table td { padding: 16px 12px; border-bottom: 1px solid var(--bg); color: var(--text-dark); font-size: 14px; }
        .date-cell { display: flex; align-items: center; gap: 8px; font-weight: 600; }
        .badge-active { display: inline-flex; align-items: center; gap: 6px; background: rgba(5, 205, 153, 0.1); color: var(--success); padding: 4px 10px; border-radius: 20px; font-size: 12px; font-weight: 700; }
        .dot { width: 6px; height: 6px; background: var(--success); border-radius: 50%; }
        .value-text { color: var(--primary); font-size: 16px; }
        .empty-state { text-align: center; padding: 40px; color: var(--text-gray); font-style: italic; }

        /* Editing Styles */
        .table-input { width: 100%; padding: 8px; border: 2px solid var(--primary); border-radius: 8px; font-weight: bold; color: var(--primary); outline: none; font-family: inherit; }
        .action-buttons { display: flex; gap: 8px; justify-content: flex-end; }
        .btn-action { padding: 6px; border-radius: 8px; border: none; cursor: pointer; transition: 0.2s; display: flex; align-items: center; justify-content: center; }
        .btn-action.edit { background: transparent; color: var(--text-gray); }
        .btn-action.edit:hover { background: var(--bg); color: var(--primary); }
        .btn-action.save { background: rgba(5, 205, 153, 0.1); color: var(--success); }
        .btn-action.save:hover { background: rgba(5, 205, 153, 0.2); }
        .btn-action.cancel { background: #FFF1F1; color: #E03137; }
        .btn-action.cancel:hover { background: #ffdede; }

        @media (min-width: 1024px) {
            .app-container { flex-direction: row; }
            .mobile-header { display: none; }
            .sidebar { position: sticky; top: 0; left: 0; width: 280px; height: 100vh; padding: 30px; transform: none; border-right: 1px solid var(--secondary); }
            .desktop-logo { display: block; margin-bottom: 40px; }
            .main-content { padding: 40px; }
            .content-header { flex-direction: row; justify-content: space-between; align-items: center; }
            .header-actions { width: auto; }
            .btn-sync { flex: unset; }
            /* Adjusted grid to 3 columns to fit new entry form nicely */
            .stats-grid { grid-template-columns: repeat(3, 1fr); gap: 24px; }
            .page-title { font-size: 32px; }
        }
      `}</style>
    </div>
  );
};

export default Dashboard;
