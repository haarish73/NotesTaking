import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../css/Navbar.css";

function Navbar() {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Read stored user state
  const userData = localStorage.getItem("user");
  const user = userData ? JSON.parse(userData) : null;
  const name = user?.username;

  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
  };

  const handleNavigate = (path) => {
    setIsMenuOpen(false); // Auto close menu on mobile after selection
    navigate(path);
  };

  const logout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setIsMenuOpen(false);
    navigate("/login");
  };

  return (
    <nav className="navbar">
      {/* Brand Logo / Title */}
      <h2 className="nav-brand" onClick={() => handleNavigate("/")}>
        📚 NotesApp
      </h2>

      {/* Hamburger / Cross Icon Button for Mobile */}
      <button 
        className="hamburger-toggle" 
        onClick={toggleMenu} 
        aria-label="Toggle navigation"
      >
        {isMenuOpen ? "✕" : "☰"}
      </button>

      {/* Right Navigation Controls */}
      <div className={`nav-right ${isMenuOpen ? "active" : ""}`}>
        {!user ? (
          <>
            <button 
              className="nav-btn nav-btn-login" 
              onClick={() => handleNavigate("/login")}
            >
              Login
            </button>
            <button 
              className="nav-btn nav-btn-register" 
              onClick={() => handleNavigate("/register")}
            >
              Register
            </button>
          </>
        ) : (
          <>
            <span 
              className="user-profile-link" 
              onClick={() => handleNavigate("/profile")}
            >
              👤 {name}
            </span>
            <button 
              className="nav-btn nav-btn-logout" 
              onClick={logout}
            >
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;