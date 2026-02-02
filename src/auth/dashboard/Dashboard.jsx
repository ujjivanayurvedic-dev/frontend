import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  PlusCircle,
  RefreshCw,
  Calendar,
  LayoutDashboard,
  Database,
  Activity,
  CheckCircle2,
  Loader2,
  ArrowUpRight,
  Menu,
  X,
  LogOut,
} from "lucide-react";
import api from "../../api/api";

const Dashboard = () => {
  const navigate = useNavigate();

  // ---------------- STATE ----------------
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isScraping, setIsScraping] = useState(false);
  const [scrapeMessage, setScrapeMessage] = useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const [formData, setFormData] = useState({ date: "", number: "" });
  const [editData, setEditData] = useState({ date: "", number: "" });

  // Auto-run refs
  const lastRunRef = useRef(null);
  const scrapeFunctionRef = useRef(null);

  // ---------------- FETCH DATA ----------------
  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await axios.get(api.DateNumber.getAll, {
        withCredentials: true,
      });
      setList(res.data?.data || []);
    } catch (err) {
      console.error("Fetch error", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // ---------------- SCRAPE HANDLER ----------------
  const handleScrape = async () => {
    if (isScraping) return;

    setIsScraping(true);
    setScrapeMessage("Starting Sync...");
    console.log("🚀 Scrape started");

    try {
      const res = await axios.get(api.NewScrapeData.saveScrape, {
        withCredentials: true,
        headers: {
          "x-scrape-secret": import.meta.env.VITE_SCRAPE_SECRET,
        },
      });

      if (res.data?.success) {
        setScrapeMessage(
          `Sync Successful (${res.data.totalFound} records)`
        );
        fetchData();
      } else {
        throw new Error(res.data?.message || "Scrape failed");
      }

      setTimeout(() => setScrapeMessage(""), 4000);
    } catch (err) {
      console.error("❌ Scrape failed", err);
      setScrapeMessage("Sync Failed");
    } finally {
      setIsScraping(false);
    }
  };

  useEffect(() => {
    scrapeFunctionRef.current = handleScrape;
  });

  // ---------------- AUTO TIME TRIGGER ----------------
  useEffect(() => {
    const targetTimes = [
      "06:30",
      "15:20",
      "16:50",
      "18:20",
      "21:45",
      "23:45",
    ];

    const interval = setInterval(() => {
      const now = new Date();
      const hh = String(now.getHours()).padStart(2, "0");
      const mm = String(now.getMinutes()).padStart(2, "0");
      const currentTime = `${hh}:${mm}`;

      if (
        targetTimes.includes(currentTime) &&
        lastRunRef.current !== currentTime
      ) {
        scrapeFunctionRef.current?.();
        lastRunRef.current = currentTime;
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // ---------------- ADD / UPDATE ----------------
  const handleAction = async (e, type) => {
    e.preventDefault();
    try {
      if (type === "add") {
        await axios.post(api.DateNumber.add, formData, {
          withCredentials: true,
        });
        setFormData({ date: "", number: "" });
      } else {
        await axios.put(
          api.DateNumber.update(editData.date),
          { number: editData.number },
          { withCredentials: true }
        );
        setEditData({ date: "", number: "" });
      }
      fetchData();
    } catch (err) {
      alert("Action failed");
    }
  };

  // ---------------- LOGOUT ----------------
  const handleLogout = () => {
    localStorage.removeItem("isAdminLoggedIn");
    navigate("/hidden-login");
  };

  // ---------------- UI ----------------
  return (
    <div className="app-container">
      {/* Mobile Header */}
      <div className="mobile-header">
        <div className="logo-section">
          <div className="logo-icon">
            <Activity size={20} color="#fff" />
          </div>
          <span className="logo-text">Nexus DB</span>
        </div>
        <button
          className="menu-btn"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Sidebar */}
      <nav className={`sidebar ${isMobileMenuOpen ? "open" : ""}`}>
        <div className="desktop-logo">
          <div className="logo-section">
            <div className="logo-icon">
              <Activity size={20} color="#fff" />
            </div>
            <span className="logo-text">Nexus DB</span>
          </div>
        </div>

        <div className="nav-menu">
          <p className="menu-label">MAIN MENU</p>

          <button className="nav-item active">
            <LayoutDashboard size={20} />
            <span>Dashboard</span>
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
      </nav>

      {/* Main Content */}
      <main className="main-content">
        <header className="content-header">
          <div>
            <h1 className="page-title">Analytics Overview</h1>
            <p className="page-subtitle">
              Manage and monitor database entries
            </p>
          </div>

          <div className="header-actions">
            <button
              onClick={handleScrape}
              disabled={isScraping}
              className={`btn-sync ${isScraping ? "disabled" : ""}`}
            >
              {isScraping ? (
                <Loader2 size={16} className="spin" />
              ) : (
                <RefreshCw size={16} />
              )}
              {isScraping ? "Syncing..." : "Sync Database"}
            </button>

            {scrapeMessage && (
              <span
                className={`status-msg ${
                  scrapeMessage.includes("Successful")
                    ? "success"
                    : "error"
                }`}
              >
                {scrapeMessage}
              </span>
            )}
          </div>
        </header>

        {/* Stats */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-label">Total Records</div>
            <div className="stat-value">{list.length}</div>
            <div className="stat-trend">
              <ArrowUpRight size={14} /> Updated
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-label">Last Scrape</div>
            <div className="stat-value">Auto / Manual</div>
            <div className="stat-trend">
              <CheckCircle2 size={14} /> Healthy
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Status</th>
                <th>Value</th>
              </tr>
            </thead>
            <tbody>
              {list.map((item) => (
                <tr key={item._id}>
                  <td>
                    <Calendar size={14} /> {item.date}
                  </td>
                  <td>
                    <span className="badge-active">Active</span>
                  </td>
                  <td>
                    <strong>{item.number}</strong>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {!loading && list.length === 0 && (
            <div className="empty-state">No data found</div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
