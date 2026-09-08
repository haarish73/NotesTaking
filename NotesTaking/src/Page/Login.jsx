import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import Swal from "sweetalert2";
import "../css/Login.css";

const BASE_URL = "https://notestaking-nuya.onrender.com";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token && token !== "null") {
      navigate("/");
    }
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Email and password are required");
      return;
    }

    // Display SweetAlert2 loading modal for Render spin-up delay
    Swal.fire({
     title: "Almost there...",
html: "Just connecting to the server. Thanks for your patience!",
      allowOutsideClick: false,
      allowEscapeKey: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });

    try {
      const res = await fetch(`${BASE_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        Swal.close();
        setError(data.message || "Invalid credentials");
        return;
      }

      // Store tokens/user data
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      // Show success alert before navigating
      Swal.fire({
        icon: "success",
        title: "Login Successful!",
        text: "Redirecting to dashboard...",
        timer: 1500,
        showConfirmButton: false,
      }).then(() => {
        navigate("/");
      });
    } catch (err) {
      console.error(err);
      Swal.close();
      setError("Server not responding. Check backend status.");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h2>Welcome Back</h2>
          <p>Please enter your details to sign in</p>
        </div>

        <form onSubmit={handleLogin} className="auth-form">
          {error && <div className="error-banner">{error}</div>}

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
            Sign In
          </button>
        </form>

        <div className="auth-footer">
          Don’t have an account? <Link to="/register">Sign up</Link>
        </div>
      </div>
    </div>
  );
}

export default Login;