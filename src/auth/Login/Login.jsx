import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, Lock, Mail, Loader2 } from "lucide-react"; 
import api from "../../api/api"; 

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      // 1. Send Login Request
      const res = await axios.post(api.Auth.login, formData, { withCredentials: true });

      // ---------------------------------------------------------
      // ✅ THE FIX: Manually set the Admin Flag on success
      // ---------------------------------------------------------
      
      // Ideally, you should check if res.data.role === 'admin' here 
      // if your backend returns it. For now, we assume anyone who 
      // logs into this specific hidden page is an admin.
      localStorage.setItem("isAdminLoggedIn", "true");
      
      setSuccess("Login Successful! Access Granted.");

      // 2. Redirect after 1.5 seconds
      setTimeout(() => {
        navigate("/hidden-dashboard");
      }, 1500);

    } catch (err) {
      console.error("Login Error:", err);
      setError(err.response?.data?.message || "Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={uiStyles.page}>
      <div style={uiStyles.blob1}></div>
      <div style={uiStyles.blob2}></div>

      <div style={uiStyles.card}>
        <div style={uiStyles.header}>
          <div style={uiStyles.logoIcon}>
            <Lock size={24} color="#4f46e5" />
          </div>
          <h2 style={uiStyles.title}>Admin Panel</h2>
          <p style={uiStyles.subtitle}>Secure access only</p>
        </div>

        <form onSubmit={handleSubmit}>
          {error && <div style={uiStyles.errorBadge}>{error}</div>}
          {success && <div style={uiStyles.successBadge}>{success}</div>}

          <div style={uiStyles.inputGroup}>
            <label style={uiStyles.label}>Email Address</label>
            <div style={uiStyles.inputWrapper}>
              <Mail size={18} style={uiStyles.iconLeft} />
              <input
                type="email"
                name="email"
                placeholder="admin@example.com"
                value={formData.email}
                onChange={handleChange}
                required
                style={uiStyles.input}
              />
            </div>
          </div>

          <div style={uiStyles.inputGroup}>
            <label style={uiStyles.label}>Password</label>
            <div style={uiStyles.inputWrapper}>
              <Lock size={18} style={uiStyles.iconLeft} />
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                required
                style={uiStyles.input}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={uiStyles.eyeButton}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading} 
            style={{
                ...uiStyles.button,
                backgroundColor: loading ? "#818cf8" : "#4f46e5"
            }}
          >
            {loading ? <Loader2 style={uiStyles.spin} size={20} /> : "Login to Dashboard"}
          </button>
        </form>
      </div>
    </div>
  );
};

/* --- Keep your existing UI Styles below --- */
const uiStyles = {
  page: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f1f5f9",
    fontFamily: "'Inter', system-ui, sans-serif",
    position: "relative",
    overflow: "hidden",
  },
  blob1: {
    position: "absolute",
    width: "300px",
    height: "300px",
    background: "rgba(79, 70, 229, 0.1)",
    borderRadius: "50%",
    top: "-100px",
    right: "-50px",
    filter: "blur(50px)",
  },
  blob2: {
    position: "absolute",
    width: "250px",
    height: "250px",
    background: "rgba(147, 51, 234, 0.1)",
    borderRadius: "50%",
    bottom: "-50px",
    left: "-50px",
    filter: "blur(50px)",
  },
  card: {
    width: "100%",
    maxWidth: "420px",
    padding: "40px",
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    backdropFilter: "blur(10px)",
    borderRadius: "20px",
    boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.1)",
    border: "1px solid #ffffff",
    zIndex: 1,
  },
  header: { textAlign: "center", marginBottom: "32px" },
  logoIcon: {
    width: "48px",
    height: "48px",
    backgroundColor: "#eef2ff",
    borderRadius: "12px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    margin: "0 auto 16px auto",
  },
  title: { fontSize: "24px", fontWeight: "800", color: "#1e293b", margin: "0" },
  subtitle: { fontSize: "14px", color: "#64748b", marginTop: "8px" },
  inputGroup: { marginBottom: "20px" },
  label: { display: "block", fontSize: "13px", fontWeight: "600", color: "#475569", marginBottom: "6px" },
  inputWrapper: { position: "relative", display: "flex", alignItems: "center" },
  iconLeft: { position: "absolute", left: "12px", color: "#94a3b8" },
  input: {
    width: "100%",
    padding: "12px 40px", // space for icons
    borderRadius: "10px",
    border: "1px solid #e2e8f0",
    fontSize: "15px",
    transition: "all 0.2s",
    outline: "none",
    backgroundColor: "#fff",
  },
  eyeButton: {
    position: "absolute",
    right: "12px",
    background: "none",
    border: "none",
    color: "#94a3b8",
    cursor: "pointer",
    padding: "4px",
    display: "flex",
  },
  button: {
    width: "100%",
    padding: "14px",
    color: "white",
    border: "none",
    borderRadius: "10px",
    fontSize: "16px",
    fontWeight: "600",
    cursor: "pointer",
    display: "flex",
    justifyContent: "center",
    transition: "transform 0.1s",
    marginTop: "10px",
  },
  errorBadge: { padding: "12px", backgroundColor: "#fef2f2", color: "#dc2626", borderRadius: "8px", fontSize: "13px", marginBottom: "16px", border: "1px solid #fecaca" },
  successBadge: { padding: "12px", backgroundColor: "#f0fdf4", color: "#16a34a", borderRadius: "8px", fontSize: "13px", marginBottom: "16px", border: "1px solid #bbf7d0" },
  link: { color: "#4f46e5", fontWeight: "600", cursor: "pointer" },
  spin: { animation: "spin 1s linear infinite" }
};

export default Login;