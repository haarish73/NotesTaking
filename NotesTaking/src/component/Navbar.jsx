import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../css/Navbar.css";
import Swal from "sweetalert2"; 
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

  const handleLogout = () => {
    Swal.fire({
      title: "Logout?",
      text: "Are you sure you want to sign out?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, logout!",
    }).then((result) => {
      if (result.isConfirmed) {
        // Clear auth data
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        // Show logout alert before navigating
        Swal.fire({
          icon: "success",
          title: "Logged Out!",
          text: "You have been successfully logged out.",
          timer: 1500,
          showConfirmButton: false,
        }).then(() => {
          navigate("/login");
        });
      }
    });
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
              onClick={handleLogout}
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