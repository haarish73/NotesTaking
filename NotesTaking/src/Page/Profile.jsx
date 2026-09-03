import React from "react";
import { useNavigate } from "react-router-dom";
import "../css/Profile.css";

function Profile() {
  const navigate = useNavigate();
  const userData = localStorage.getItem("user");
  const user = userData ? JSON.parse(userData) : null;

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  if (!user) {
    return (
      <div className="profile-container">
        <div className="login-prompt-card">
          <h2>🔒 Access Restricted</h2>
          <p>Please log in to view your profile dashboard.</p>
          <button className="btn btn-login" onClick={() => navigate("/login")}>
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  // Generate an avatar letter from username or default to 'U'
  const avatarLetter = user.username ? user.username.charAt(0).toUpperCase() : "U";

  return (
    <div className="profile-container">
      <div className="profile-card">
        {/* Header with Avatar */}
        <div className="profile-header">
          <div className="profile-avatar">{avatarLetter}</div>
          <div className="profile-title-group">
            <h1>User Profile</h1>
            <p className="profile-subtitle">Manage your personal details and account settings</p>
          </div>
        </div>

        {/* User Details */}
        <div className="profile-details">
          <div className="detail-row">
            <span className="detail-label">Username</span>
            <span className="detail-value">{user.username}</span>
          </div>

          <div className="detail-row">
            <span className="detail-label">Email Address</span>
            <span className="detail-value">{user.email}</span>
          </div>
        </div>

        {/* Actions */}
        <div className="profile-actions">
          <button className="btn btn-logout" onClick={handleLogout}>
            🚪 Log Out
          </button>
        </div>
      </div>
    </div>
  );
}

export default Profile;