import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../css/Topic.css";
import Swal from "sweetalert2";

const API = "https://notestaking-nuya.onrender.com/topic";

function Topics() {
  const navigate = useNavigate();

  const [topics, setTopics] = useState([]);
  const [newTopicName, setNewTopicName] = useState("");
  const [newTopicIcon, setNewTopicIcon] = useState("📖");
  const [showAddForm, setShowAddForm] = useState(false);

  // ✅ Load topics with Render cold-start indicator
  const loadTopics = async () => {
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
      const token = localStorage.getItem("token");

      const res = await fetch(API, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      setTopics(Array.isArray(data) ? data : []);
      Swal.close();
    } catch (err) {
      console.error(err);
      setTopics([]);
      Swal.close();
    }
  };

  useEffect(() => {
    loadTopics();
  }, []);

  // ✅ Add topic with loader and feedback modal
  const handleAddTopic = async (e) => {
    e.preventDefault();
    if (!newTopicName.trim()) return;

    Swal.fire({
      title: "Saving Topic...",
      html: "Connecting to server...",
      allowOutsideClick: false,
      allowEscapeKey: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });

    try {
      const token = localStorage.getItem("token");
      const slugKey = newTopicName.toLowerCase().replace(/\s+/g, "-");

      const newTopicObj = {
        name: slugKey,
        label: newTopicName,
        icon: newTopicIcon || "📁",
        color: `#${Math.floor(Math.random() * 16777215).toString(16)}`,
      };

      const res = await fetch(API, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newTopicObj),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || JSON.stringify(data));
      }

      // ✅ SUCCESS ALERT
      Swal.fire({
        icon: "success",
        title: "Topic Added!",
        text: `${newTopicName} created successfully 🎉`,
        timer: 1500,
        showConfirmButton: false,
      });

      setNewTopicName("");
      setNewTopicIcon("📖");
      setShowAddForm(false);
      loadTopics();
    } catch (err) {
      console.error(err);

      // ❌ ERROR ALERT
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: err.message || "Something went wrong while creating the topic!",
      });
    }
  };

  return (
    <div className="topics-page-wrapper">
      <main className="topics-container">
        {/* Header Section */}
        <div className="topics-header">
          <div className="header-title-box">
            <div className="main-logo-icon">📚</div>
            <div>
              <h1>My Notes</h1>
              <p className="subtitle">Pick a topic to view or add your notes</p>
            </div>
          </div>
          <div className="quote-badge">
            "Organize Today <br /> Learn Tomorrow"
          </div>
        </div>

        {/* Action Controls */}
        <div className="action-bar">
          <button
            className="primary-action-btn"
            onClick={() => setShowAddForm(true)}
          >
            + Add New Topic
          </button>

          <div className="filter-controls">
            <div className="search-input-wrapper">
              <span>🔍</span>
              <input type="text" placeholder="Search topics..." disabled />
            </div>
            <select className="filter-dropdown" disabled>
              <option>▦ All Topics</option>
            </select>
          </div>
        </div>

        {/* Display Grid or Empty State Area */}
        <div className="display-section">
          {topics.length === 0 ? (
            <div className="empty-box">
              <div className="box-illustration">📦</div>
              <h2>No topics found</h2>
              <p>
                You haven't added any topics yet. Create your first topic to
                start organizing your notes!
              </p>
              <button
                className="primary-action-btn"
                onClick={() => setShowAddForm(true)}
              >
                + Add New Topic
              </button>
            </div>
          ) : (
            <div className="topics-grid">
              {topics.map((topic) => (
                <div
                  key={topic._id || topic.name}
                  className="topic-card"
                  onClick={() => navigate(`/topics/${topic.name}`)}
                >
                  <div
                    className="card-icon-wrapper"
                    style={{ backgroundColor: topic.color + "22" }}
                  >
                    <span className="topic-icon">{topic.icon}</span>
                  </div>
                  <div className="card-info">
                    <h2>{topic.label}</h2>
                    <span className="card-arrow">→</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Informational Feature Cards */}
        <div className="info-cards-grid">
          <div className="info-card purple-card">
            <span className="info-icon">📖</span>
            <div>
              <h3>Organize Easily</h3>
              <p>Create topics and keep your notes structured.</p>
            </div>
          </div>
          <div className="info-card blue-card">
            <span className="info-icon">⚡</span>
            <div>
              <h3>Boost Your Learning</h3>
              <p>Keep all your important notes in one place.</p>
            </div>
          </div>
          <div className="info-card green-card">
            <span className="info-icon">🎯</span>
            <div>
              <h3>Achieve Your Goals</h3>
              <p>Stay consistent and make progress every day.</p>
            </div>
          </div>
        </div>
      </main>

      {/* Add Topic Modal */}
      {showAddForm && (
        <div className="modal-backdrop">
          <div className="modal-content">
            <div className="modal-header">
              <h2>Add New Topic</h2>
              <button
                className="modal-close-btn"
                onClick={() => setShowAddForm(false)}
              >
                ✕
              </button>
            </div>
            <form onSubmit={handleAddTopic} className="modal-form">
              <label>Topic Name</label>
              <input
                type="text"
                placeholder="e.g. Python, React, Java"
                value={newTopicName}
                onChange={(e) => setNewTopicName(e.target.value)}
                required
              />
              <label>Emoji Icon</label>
              <input
                type="text"
                placeholder="e.g. 🐍, ⚛️, ☕"
                value={newTopicIcon}
                onChange={(e) => setNewTopicIcon(e.target.value)}
                maxLength={2}
              />
              <div className="modal-actions">
                <button
                  type="button"
                  className="cancel-btn"
                  onClick={() => setShowAddForm(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="primary-action-btn">
                  Create Topic
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Topics;