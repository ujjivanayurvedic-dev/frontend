import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function TitleManager() {
  const location = useLocation();

  useEffect(() => {
    const date = new Date()
      .toLocaleDateString("en-GB")
      .replaceAll("/", "-");

    let title = "Satta King Result";

    switch (location.pathname) {
      case "/":
      case "/satta-king":
      case "/chart":
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

      default:
        title = "Page Not Found | Satta King";
    }

    document.title = title;
  }, [location.pathname]);

  return null;
}
