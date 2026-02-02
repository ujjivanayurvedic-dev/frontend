import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  RefreshCw,
  Calendar,
  LayoutDashboard,
  Database,
  Activity,
  Loader2,
  ArrowUpRight,
  Menu,
  X,
  LogOut,
  Edit2, // Added for Edit Icon
  Check, // Added for Save Icon
  Save,  // Alternative Save Icon
} from "lucide-react";
import api from "../../api/api";

const Dashboard = () => {
  const navigate = useNavigate();

  // ---------------- STATE ----------------
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Scrape State
  const [isScraping, setIsScraping] = useState(false);
  const [scrapeMessage, setScrapeMessage] = useState("");
  
  // UI State
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Edit/Update State
  const [editingDate, setEditingDate] = useState(null); // Tracks which row is being edited
  const [editValue, setEditValue] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);

  // Auto scrape refs
  const lastRunRef = useRef(null);
  const scrapeFnRef = useRef(null);

  // ---------------- FETCH DATA ----------------
  const fetchData = async () => {
    // Only show full page loader on initial load, not background refreshes
    if (list.length === 0) setLoading(true);
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

  // ---------------- UPDATE (PUT) ----------------
  const startEditing = (item) => {
    setEditingDate(item.date);
    setEditValue(item.number);
  };

  const cancelEditing = () => {
    setEditingDate(null);
    setEditValue("");
  };

  const handleUpdate = async (date) => {
    if (!editValue) return;
    setIsUpdating(true);

    try {
      // Assuming the API expects a PUT/PATCH request with { number: newValue }
      // Using the api.DateNumber.update(date) function you provided
      const res = await axios.put(
        api.DateNumber.update(date), 
        { number: editValue },
        { withCredentials: true }
      );

      if (res.data?.success) {
        // Optimistic UI Update (Update list locally to avoid a re-fetch)
        setList((prevList) =>
          prevList.map((item) =>
            item.date === date ? { ...item, number: editValue } : item
          )
        );
        setScrapeMessage("Update Saved!");
        setTimeout(() => setScrapeMessage(""), 3000);
        cancelEditing();
      } else {
        alert("Failed to update number.");
      }
    } catch (err) {
      console.error("Update error", err);
      alert("Error updating record.");
    } finally {
      setIsUpdating(false);
    }
  };

  // ---------------- SCRAPE (POST) ----------------
  const handleScrape = async () => {
    if (isScraping) return;

    setIsScraping(true);
    setScrapeMessage("Syncing...");

    try {
      const res = await axios.post(
        api.NewScrapeData.saveScrape,
        {},
        {
          withCredentials: true,
          headers: {
            "x-scrape-secret": import.meta.env.VITE_SCRAPE_SECRET,
          },
        }
      );

      if (res.data?.success) {
        setScrapeMessage(`Sync Successful (${res.data.totalFound})`);
        fetchData();
      } else {
        throw new Error("Scrape failed");
      }

      setTimeout(() => setScrapeMessage(""), 4000);
    } catch (err) {
      console.error("Scrape error", err);
      setScrapeMessage("Sync Failed");
    } finally {
      setIsScraping(false);
    }
  };

  useEffect(() => {
    scrapeFnRef.current = handleScrape;
  });

  // ---------------- AUTO TIME TRIGGER ----------------
  useEffect(() => {
    const targetTimes = [
      "06:30", "15:20", "16:50", "18:20", "21:45", "23:45",
    ];

    const interval = setInterval(() => {
      const now = new Date();
      const time = `${String(now.getHours()).padStart(2, "0")}:${String(
        now.getMinutes()
      ).padStart(2, "0")}`;

      if (targetTimes.includes(time) && lastRunRef.current !== time) {
        scrapeFnRef.current?.();
        lastRunRef.current = time;
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // ---------------- LOGOUT ----------------
  const handleLogout = () => {
    localStorage.removeItem("isAdminLoggedIn");
    navigate("/hidden-login");
  };

  // ---------------- UI ----------------
  return (
    <div className="min-h-screen bg-slate-50 flex font-sans text-slate-900">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-slate-900 text-white shadow-2xl transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0 ${
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="p-6 flex items-center gap-3 border-b border-slate-700">
          <div className="bg-indigo-500 p-2 rounded-lg shadow-indigo-500/50 shadow-lg">
            <Activity className="text-white" size={20} />
          </div>
          <span className="font-bold text-xl tracking-tight">Nexus DB</span>
        </div>

        <nav className="p-4 space-y-2 mt-4">
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-indigo-600 text-white shadow-lg shadow-indigo-900/20 transition-all hover:bg-indigo-500">
            <LayoutDashboard size={18} /> <span className="font-medium">Dashboard</span>
          </button>

          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-slate-400 hover:bg-slate-800 hover:text-white transition-colors">
            <Database size={18} /> <span className="font-medium">Scrape Logs</span>
          </button>

          <div className="pt-8 mt-8 border-t border-slate-800">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors"
            >
              <LogOut size={18} /> <span className="font-medium">Logout</span>
            </button>
          </div>
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Mobile Header */}
        <div className="md:hidden flex justify-between items-center bg-white px-4 py-3 shadow-sm z-40">
          <span className="font-bold text-lg">Dashboard</span>
          <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2 text-slate-600">
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        <main className="flex-1 overflow-y-auto p-6 lg:p-10 space-y-8">
          
          {/* Header Section */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <h1 className="text-3xl font-bold text-slate-800 tracking-tight">
                Analytics Overview
              </h1>
              <p className="text-slate-500 mt-1">
                Real-time database monitoring & synchronization
              </p>
            </div>

            <div className="flex items-center gap-4 bg-white p-2 rounded-2xl shadow-sm border border-slate-100">
               {scrapeMessage && (
                <span className="text-xs font-bold px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full animate-pulse">
                  {scrapeMessage}
                </span>
              )}
              
              <button
                onClick={handleScrape}
                disabled={isScraping}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm transition-all shadow-md ${
                  isScraping
                    ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                    : "bg-indigo-600 text-white hover:bg-indigo-700 hover:shadow-indigo-200"
                }`}
              >
                {isScraping ? (
                  <Loader2 className="animate-spin" size={16} />
                ) : (
                  <RefreshCw size={16} />
                )}
                {isScraping ? "Syncing..." : "Sync Database"}
              </button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start">
                <div>
                   <p className="text-slate-500 text-sm font-medium uppercase tracking-wider">Total Records</p>
                   <h2 className="text-4xl font-extrabold text-slate-800 mt-2">{list.length}</h2>
                </div>
                <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
                  <Database size={24} />
                </div>
              </div>
              <p className="flex items-center gap-1 text-emerald-600 text-sm mt-4 font-medium">
                <ArrowUpRight size={16} /> Live Data
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start">
                <div>
                   <p className="text-slate-500 text-sm font-medium uppercase tracking-wider">System Status</p>
                   <h2 className="text-xl font-bold text-slate-800 mt-2">Operational</h2>
                </div>
                <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
                  <Activity size={24} />
                </div>
              </div>
               <p className="text-emerald-600 text-sm mt-4 font-medium">All systems normal</p>
            </div>
          </div>

          {/* Data Table */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center">
                <h3 className="font-bold text-lg text-slate-800">Date Records</h3>
                <span className="text-xs text-slate-400 font-mono bg-slate-50 px-2 py-1 rounded">Read/Write Access</span>
            </div>
            
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm text-left">
                <thead className="bg-slate-50/50 text-slate-500 font-medium border-b border-slate-100">
                  <tr>
                    <th className="px-6 py-4 w-1/3">Date</th>
                    <th className="px-6 py-4 w-1/4">Status</th>
                    <th className="px-6 py-4 w-1/4">Number Value</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {list.map((item) => (
                    <tr key={item._id || item.date} className="hover:bg-slate-50/80 transition-colors group">
                      
                      {/* Date Column */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-slate-100 text-slate-500 rounded-lg group-hover:bg-white group-hover:shadow-sm transition-all">
                                <Calendar size={16} />
                            </div>
                            <span className="font-medium text-slate-700">{item.date}</span>
                        </div>
                      </td>

                      {/* Status Column */}
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-100">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                          Active
                        </span>
                      </td>

                      {/* Number/Input Column */}
                      <td className="px-6 py-4">
                        {editingDate === item.date ? (
                          <input
                            type="text" // changed to text to allow flexible input or stick to number
                            value={editValue}
                            onChange={(e) => setEditValue(e.target.value)}
                            className="w-full px-3 py-2 border-2 border-indigo-200 rounded-lg focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all font-mono text-lg font-bold text-indigo-600 bg-white"
                            autoFocus
                          />
                        ) : (
                          <span className="font-mono text-lg font-bold text-slate-700 group-hover:text-indigo-600 transition-colors">
                            {item.number}
                          </span>
                        )}
                      </td>

                      {/* Actions Column */}
                      <td className="px-6 py-4 text-right">
                        {editingDate === item.date ? (
                          <div className="flex items-center justify-end gap-2">
                             <button
                              onClick={() => handleUpdate(item.date)}
                              disabled={isUpdating}
                              className="p-2 rounded-lg bg-emerald-50 text-emerald-600 hover:bg-emerald-100 hover:text-emerald-700 transition-colors"
                              title="Save"
                            >
                               {isUpdating ? <Loader2 className="animate-spin" size={18}/> : <Check size={18} />}
                            </button>
                            <button
                              onClick={cancelEditing}
                              disabled={isUpdating}
                              className="p-2 rounded-lg bg-red-50 text-red-500 hover:bg-red-100 hover:text-red-600 transition-colors"
                              title="Cancel"
                            >
                              <X size={18} />
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => startEditing(item)}
                            className="p-2 rounded-lg text-slate-400 hover:bg-indigo-50 hover:text-indigo-600 opacity-0 group-hover:opacity-100 transition-all transform translate-x-2 group-hover:translate-x-0"
                            title="Edit Number"
                          >
                            <Edit2 size={18} />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {!loading && list.length === 0 && (
                <div className="flex flex-col items-center justify-center py-16 text-slate-400">
                  <Database size={48} strokeWidth={1} className="mb-4 text-slate-200" />
                  <p>No records found in database</p>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
