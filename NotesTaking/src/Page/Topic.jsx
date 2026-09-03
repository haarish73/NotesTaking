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

  // ✅ Load topics from backend
  const loadTopics = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch(API, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      setTopics(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      setTopics([]);
    }
  };

  // ✅ Run on page load
  useEffect(() => {
    loadTopics();
  }, []);

  // ✅ Add topic (save to MongoDB)
const handleAddTopic = async (e) => {
  e.preventDefault();
  if (!newTopicName.trim()) return;

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
    Authorization: `Bearer ${token}`, // ✅ MUST
  },
  body: JSON.stringify(newTopicObj),
});

const data = await res.json();
console.log("RESPONSE:", data); // 👈 VERY IMPORTANT

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

    loadTopics();

    setNewTopicName("");
    setNewTopicIcon("📖");
    setShowAddForm(false);

  } catch (err) {
    console.error(err);

    // ❌ ERROR ALERT
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: "Something went wrong!",
    });
  }
};
  return (
    <div className="container">
      <header className="home-header">
        <h1>📚 My Notes</h1>
        <p className="subtitle">Pick a topic to view or add your notes</p>

        <button
          className="add-topic-btn"
          onClick={() => setShowAddForm(!showAddForm)}
        >
          {showAddForm ? "Cancel" : "+ Add New Topic"}
        </button>
      </header>

      {/* ✅ Add Topic Form */}
      {showAddForm && (
        <form onSubmit={handleAddTopic} className="add-topic-form">
          <input
            type="text"
            placeholder="Topic Name (e.g. Python)"
            value={newTopicName}
            onChange={(e) => setNewTopicName(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="Emoji Icon (e.g. 🐍)"
            value={newTopicIcon}
            onChange={(e) => setNewTopicIcon(e.target.value)}
            maxLength={2}
          />
          <button type="submit">Create Topic</button>
        </form>
      )}

      {/* ✅ Topics List */}
      <div className="topics-grid">
        {topics.length === 0 ? (
          <p>No topics found</p>
        ) : (
          topics.map((topic) => (
            <div
              key={topic._id || topic.name}
              className="book-card"
              style={{ "--accent": topic.color }}
              onClick={() => navigate(`/topics/${topic.name}`)}
            >
              <span className="book-icon">{topic.icon}</span>
              <h2>{topic.label}</h2>
              <span className="book-arrow">→</span>
            </div>
          ))
        )}
      </div>

      <footer className="home-footer">
        <p>Organize your learning, one topic at a time ✨</p>
      </footer>
    </div>
  );
}

export default Topics;