import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "../css/Register.css";

// ✅ Use BASE URL instead of full endpoint
const BASE_URL = "https://notestaking-nuya.onrender.com";

function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    // ✅ Basic validation
    if (!username || !email || !password) {
      setError("All fields are required");
      return;
    }

    try {
      const res = await fetch(`${BASE_URL}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          email,
          password,
        }),
      });

      const data = await res.json();

      // ✅ Handle backend errors properly
      if (!res.ok) {
        setError(data.message || "Registration failed");
        return;
      }

      // ✅ Success
      setMessage("✅ Registered successfully! Redirecting...");

      setUsername("");
      setEmail("");
      setPassword("");

      setTimeout(() => {
        navigate("/login");
      }, 1500);

    } catch (err) {
      console.error(err);
      setError("Server not responding (check backend / DB)");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h2>Create Account</h2>
          <p>Join us to start organizing your notes</p>
        </div>

        <form onSubmit={handleRegister} className="auth-form">
          {error && <div className="error-banner">{error}</div>}
          {message && <div className="success-banner">{message}</div>}

          <div className="form-group">
            <label>Username</label>
            <input
              type="text"
              placeholder="e.g. johndoe"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button type="submit" className="auth-btn">
            Create Account
          </button>
        </form>

        <div className="auth-footer">
          Already have an account? <Link to="/login">Sign in</Link>
        </div>
      </div>
    </div>
  );
}

export default Register;