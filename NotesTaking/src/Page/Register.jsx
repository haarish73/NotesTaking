import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Swal from "sweetalert2";
import "../css/Register.css";

const BASE_URL = "https://notestaking-nuya.onrender.com";

function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");

    if (!username || !email || !password) {
      setError("All fields are required");
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

      if (!res.ok) {
        Swal.close();
        setError(data.message || "Registration failed");
        return;
      }

      // Show success alert before navigating
      Swal.fire({
        icon: "success",
        title: "Registered Successfully!",
        text: "Redirecting to login...",
        timer: 1500,
        showConfirmButton: false,
      }).then(() => {
        setUsername("");
        setEmail("");
        setPassword("");
        navigate("/login");
      });
    } catch (err) {
      console.error(err);
      Swal.close();
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