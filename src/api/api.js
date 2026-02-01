// 🔥 FIX: Matches your specific .env variable name
// Added "||" fallback to prevent "undefined" errors if .env fails to load
const DataAPI = import.meta.env.VITE_NEW_SCRAPE_DATABASED || "http://localhost:5000/api";

const api = {
  Auth: {
    login: `${DataAPI}/auth/login`,
    logout: `${DataAPI}/auth/logout`,
    register: `${DataAPI}/auth/register`,
  },
  DateNumber: {
    getAll: `${DataAPI}/date-number`,
    add: `${DataAPI}/date-number`,
    update: (date) => `${DataAPI}/date-number/${date}`,
  },
  NewScrapeData: {
    // These match your Backend app.js routes:
    // app.use("/api/v1", scraperRoutes) -> /scrape
    saveScrape: `${DataAPI}/v1/scrape`,
    getScrape: `${DataAPI}/v1/results`,
    gameChartFull: `${DataAPI}/game-chart-full`,
    gameChartLive: `${DataAPI}/game-chart-live`,
    gameChartRecent: `${DataAPI}/game-chart-recent`,
  }
};

export default api;