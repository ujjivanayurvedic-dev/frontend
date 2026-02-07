import { BrowserRouter, Routes, Route, Outlet, Navigate } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";

import Home from "./home/Home";
import Login from "./auth/Login/Login";
import Dashboard from "./auth/dashboard/Dashboard";
import NotFound from "./home/NotFound";
import TermsOfService from "./components/TermsOfService/TermsOfService";
import TitleManager from "./components/TitleManager/TitleManager";

// Pages
import SattaResult from "./pages/SattaResult";
import Gali from "./pages/Gali";
import Deshwar from "./pages/Deshwar";
import Faridabad from "./pages/Faridabad";
import Ghaziabad from "./pages/Ghaziabad";
import NoidaKing from "./pages/NoidaKing";
import DelhiBazar from "./pages/DelhiBazar";
import ShriGanesh from "./pages/ShriGanesh";
import TodayResult from "./pages/TodayResult";
import YesterDayResult from "./pages/YesterDayResult";
import ResultTable from "./pages/ResultTable";

const ProtectedRoute = () => {
  const isAuthenticated = localStorage.getItem("isAdminLoggedIn");
  return isAuthenticated ? <Outlet /> : <Navigate to="/hidden-login" replace />;
};

export default function App() {
  return (
    <HelmetProvider>
      <BrowserRouter>
        <TitleManager />

        <Routes>
          {/* HOME */}
          <Route path="/" element={<Home />} />

          {/* OLD URL REDIRECTS (SEO FIX) */}
          <Route path="/satta-king" element={<Navigate to="/#results" replace />} />
          <Route path="/chart" element={<Navigate to="/#chart" replace />} />

          {/* AUTH */}
          <Route path="/hidden-login" element={<Login />} />

          {/* RESULTS */}
          <Route path="/satta-result" element={<SattaResult />} />

          {/* DESAWAR (single canonical) */}
          <Route path="/desawar-result" element={<Deshwar />} />
          <Route
            path="/disawar-result"
            element={<Navigate to="/desawar-result" replace />}
          />

          <Route path="/gali-result" element={<Gali />} />
          <Route path="/faridabad-result" element={<Faridabad />} />
          <Route path="/ghaziabad-result" element={<Ghaziabad />} />
          <Route path="/noida-king-result" element={<NoidaKing />} />
          <Route path="/delhi-bazar-result" element={<DelhiBazar />} />
          <Route path="/shri-ganesh-result" element={<ShriGanesh />} />
          <Route path="/satta-result-today" element={<TodayResult />} />
          <Route path="/satta-result-yesterday" element={<YesterDayResult />} />

          {/* MONTH RESULT (ONE CANONICAL) */}
          <Route path="/february-2026-satta-king" element={<ResultTable />} />
          <Route
            path="/satta-king-result-february-2026"
            element={<Navigate to="/february-2026-satta-king" replace />}
          />

          {/* PROTECTED */}
          <Route element={<ProtectedRoute />}>
            <Route path="/hidden-dashboard" element={<Dashboard />} />
          </Route>

          {/* LEGAL */}
          <Route path="/terms-of-service" element={<TermsOfService />} />

          {/* 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </HelmetProvider>
  );
}
