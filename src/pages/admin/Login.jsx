import { useState, useEffect } from "react";
import { adminLogin, useAuth } from "../../services/auth.service";
import { useNavigate, Link } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const user = useAuth();

  // ✅ Auto-redirect if already logged in
  useEffect(() => {
    if (user) {
      navigate("/admin");
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await adminLogin(email, password);
      // ❌ DO NOT navigate here
      // ProtectedRoute + useAuth will handle redirect
    } catch (err) {
      setError("Invalid email or password");
    }
  };

  return (
    <div className="login-page">
      {/* BACK TO HOME */}
      <Link to="/" className="back-home">
        ← Back to Home
      </Link>

      <div className="login-card">
        <h2>Admin Login</h2>
        <p className="login-subtitle">
          Sign in to access the admin dashboard
        </p>

        {error && <p className="login-error">{error}</p>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              placeholder="admin@residence.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="login-btn">
            Login
          </button>
        </form>
      </div>
    </div>
  );
}
