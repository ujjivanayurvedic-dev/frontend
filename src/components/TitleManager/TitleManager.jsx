import { useLocation } from "react-router-dom";
import { Helmet } from "react-helmet-async";

export default function TitleManager() {
  const location = useLocation();
  const date = new Date().toLocaleDateString("en-GB").replaceAll("/", "-");

  let title = "";

  switch (location.pathname) {
    case "/":
    case "/satta-king":
    case "/chart":
    case "/satta-matka":
      title = `Satta King Result - ${date}`;
      break;

    case "/hidden-login":
      title = "Admin Login | Satta King";
      break;

    case "/hidden-dashboard":
      title = "Admin Dashboard | Satta King";
      break;

    case "/terms-of-service":
      title = "Terms of Service | Satta King";
      break;

    // --- ADDED MISSING ROUTES BELOW ---
    case "/satta-result":
    case "/satta-result-today":
      title = `Satta Result Today - ${date}`;
      break;

    case "/satta-result-yesterday":
      title = "Satta Result Yesterday";
      break;

    case "/disawar-result":
    case "/desawar-result":
      title = "Deshawar Satta Result";
      break;

    case "/gali-result":
      title = "Gali Satta Result";
      break;

    case "/faridabad-result":
      title = "Faridabad Satta Result";
      break;

    case "/ghaziabad-result":
      title = "Ghaziabad Satta Result";
      break;

    case "/noida-king-result":
      title = "Noida King Result";
      break;

    case "/delhi-bazar-result":
      title = "Delhi Bazar Result";
      break;

    case "/shri-ganesh-result":
      title = "Shri Ganesh Result";
      break;

    default:
      title = "Page Not Found | Satta King";
  }

  return (
    <Helmet>
      <title>{title}</title>
    </Helmet>
  );
}