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

  // Auto scrape refs
  const lastRunRef = useRef(null);
  const scrapeFnRef = useRef(null);

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
        setScrapeMessage(
          `Sync Successful (${res.data.totalFound})`
        );
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
      "06:30",
      "15:20",
      "16:50",
      "18:20",
      "21:45",
      "23:45",
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
    <div className="min-h-screen bg-slate-100 flex">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-white shadow-lg transform transition-transform md:relative md:translate-x-0 ${
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="p-6 flex items-center gap-3 border-b">
          <div className="bg-indigo-600 p-2 rounded-lg">
            <Activity className="text-white" size={18} />
          </div>
          <span className="font-bold text-lg">Nexus DB</span>
        </div>

        <nav className="p-4 space-y-2">
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg bg-indigo-600 text-white">
            <LayoutDashboard size={18} /> Dashboard
          </button>

          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-slate-600 hover:bg-slate-100">
            <Database size={18} /> Scrape Logs
          </button>

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50"
          >
            <LogOut size={18} /> Logout
          </button>
        </nav>
      </aside>

      {/* Main */}
      <div className="flex-1">
        {/* Mobile Header */}
        <div className="md:hidden flex justify-between items-center bg-white px-4 py-3 shadow">
          <span className="font-bold">Dashboard</span>
          <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            {isMobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>

        <main className="p-6 space-y-6">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-slate-800">
                Analytics Overview
              </h1>
              <p className="text-slate-500 text-sm">
                Monitor & sync database
              </p>
            </div>

            <div className="flex items-center gap-4">
              <button
                onClick={handleScrape}
                disabled={isScraping}
                className={`flex items-center gap-2 px-5 py-2 rounded-lg font-semibold text-white ${
                  isScraping
                    ? "bg-slate-400"
                    : "bg-indigo-600 hover:bg-indigo-700"
                }`}
              >
                {isScraping ? (
                  <Loader2 className="animate-spin" size={18} />
                ) : (
                  <RefreshCw size={18} />
                )}
                {isScraping ? "Syncing..." : "Sync Database"}
              </button>

              {scrapeMessage && (
                <span className="text-sm font-semibold text-indigo-600">
                  {scrapeMessage}
                </span>
              )}
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl p-6 shadow">
              <p className="text-slate-500 text-sm">Total Records</p>
              <h2 className="text-3xl font-bold text-slate-800 mt-2">
                {list.length}
              </h2>
              <p className="flex items-center gap-1 text-green-600 text-sm mt-2">
                <ArrowUpRight size={14} /> Updated
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow">
              <p className="text-slate-500 text-sm">Last Scrape</p>
              <h2 className="text-xl font-bold text-slate-800 mt-2">
                Auto / Manual
              </h2>
              <p className="text-green-600 text-sm mt-2">Healthy</p>
            </div>
          </div>

          {/* Table */}
          <div className="bg-white rounded-xl shadow overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-6 py-4 text-left">Date</th>
                  <th className="px-6 py-4 text-left">Status</th>
                  <th className="px-6 py-4 text-left">Value</th>
                </tr>
              </thead>
              <tbody>
                {list.map((item) => (
                  <tr key={item._id} className="border-t">
                    <td className="px-6 py-4 flex items-center gap-2">
                      <Calendar size={14} /> {item.date}
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs font-semibold">
                        Active
                      </span>
                    </td>
                    <td className="px-6 py-4 font-bold text-indigo-600">
                      {item.number}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {!loading && list.length === 0 && (
              <div className="p-6 text-center text-slate-500">
                No data found
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
