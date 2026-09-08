import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../css/Notes.css";
import Swal from "sweetalert2";

const BASE_URL = "https://notestaking-nuya.onrender.com";
const API = `${BASE_URL}/notes`;

function Notes() {
  const { topicName } = useParams();
  const navigate = useNavigate();

  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  // ✅ Load Notes with Swal cold-start handling
  const loadNotes = async () => {
    const token = localStorage.getItem("token");

    Swal.fire({
      title: "Fetching Notes...",
title: "Almost there...",
html: "Just connecting to the server. Thanks for your patience!",
      allowOutsideClick: false,
      allowEscapeKey: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });

    try {
      setLoading(true);

      const res = await fetch(`${API}?topic=${topicName}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (!res.ok) {
        console.error("Error:", data);
        setNotes([]);
        Swal.close();
        return;
      }

      setNotes(Array.isArray(data) ? data : []);
      Swal.close();
    } catch (err) {
      console.error("❌ Failed to load notes:", err);
      setNotes([]);
      Swal.close();
    } finally {
      setLoading(false);
    }
  };

  // ✅ Add Note
  const addNote = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    if (!title.trim() || !content.trim()) return;

    Swal.fire({
      title: "Saving Note...",
      html: "Connecting to server...",
      allowOutsideClick: false,
      allowEscapeKey: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });

    try {
      const res = await fetch(API, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title,
          content,
          topic: topicName,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        Swal.fire({
          icon: "error",
          title: "Failed to Add",
          text: data.message || "Could not save your note.",
        });
        return;
      }

      Swal.fire({
        icon: "success",
        title: "Note Created!",
        text: "Your note was added successfully.",
        timer: 1500,
        showConfirmButton: false,
      });

      setTitle("");
      setContent("");
      setShowModal(false);
      loadNotes();
    } catch (err) {
      console.error("❌ Failed to add note:", err);
      Swal.fire({
        icon: "error",
        title: "Server Error",
        text: "Could not connect to the server.",
      });
    }
  };

  // ✅ Delete Note with Confirmation
  const deleteNote = async (id) => {
    const token = localStorage.getItem("token");

    const result = await Swal.fire({
      title: "Delete this note?",
      text: "This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

    if (!result.isConfirmed) return;

    Swal.fire({
      title: "Deleting...",
      allowOutsideClick: false,
      allowEscapeKey: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });

    try {
      const res = await fetch(`${API}/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        Swal.fire({
          icon: "error",
          title: "Delete Failed",
          text: "Could not delete the note.",
        });
        return;
      }

      Swal.fire({
        icon: "success",
        title: "Deleted!",
        text: "Note has been removed.",
        timer: 1500,
        showConfirmButton: false,
      });

      loadNotes();
    } catch (err) {
      console.error("❌ Failed to delete note:", err);
      Swal.fire({
        icon: "error",
        title: "Server Error",
        text: "Could not complete request.",
      });
    }
  };

  useEffect(() => {
    loadNotes();
  }, [topicName]);

  return (
    <div className="notes-page">
      {/* Top Navigation */}
      <div className="top-nav">
        <button className="back-btn" onClick={() => navigate("/")}>
          ← Back to Topics
        </button>
        <div className="quote-tag">"Small notes make big progress."</div>
      </div>

      {/* Header Bar */}
      <div className="notes-header">
        <div className="header-left">
          <div className="topic-icon">☕</div>
          <div>
            <h1>{topicName} Notes</h1>
            <p className="subtitle">
              Capture your ideas, questions and learnings about {topicName}.
            </p>
          </div>
        </div>

        <div className="header-right">
          <div className="search-box">
            <span>🔍</span>
            <input type="text" placeholder="Search notes..." disabled />
          </div>
          <select className="sort-dropdown" disabled>
            <option>⇅ Newest</option>
          </select>
        </div>
      </div>

      {/* Main Grid Content */}
      <div className="notes-grid">
        {/* Create Card Button */}
        <div className="add-card-placeholder" onClick={() => setShowModal(true)}>
          <div className="plus-circle">+</div>
          <h3>Add New Note</h3>
          <p>Write a new note about {topicName} and keep learning!</p>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="status-card">
            <p>Loading notes...</p>
          </div>
        ) : notes.length === 0 ? (
          /* Empty State */
          <div className="empty-notes-card">
            <div className="empty-icon">📖</div>
            <h3>No notes found for "{topicName}"</h3>
            <p>Looks like you haven't added any notes yet.</p>
            <button className="primary-btn" onClick={() => setShowModal(true)}>
              + Add Your First Note
            </button>
          </div>
        ) : (
          /* Notes Mapping */
          notes.map((note) => (
            <div key={note._id || note.id} className="note-card">
              <div className="note-card-header">
                <div className="card-icon">📄</div>
                <button
                  className="delete-icon-btn"
                  title="Delete Note"
                  onClick={() => deleteNote(note._id || note.id)}
                >
                  🗑️
                </button>
              </div>

              <h3 className="note-card-title">{note.title}</h3>
              <p className="note-card-content">{note.content}</p>

              <div className="note-card-footer">
                <span className="note-date">📅 Recently Added</span>
                <span className="note-tag">{topicName}</span>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Floating Action Button */}
      <button className="fab-btn" onClick={() => setShowModal(true)}>
        +
      </button>

      {/* Add Note Modal Dialog */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-card">
            <div className="modal-header">
              <h2>Add New Note</h2>
              <button className="close-btn" onClick={() => setShowModal(false)}>
                ✕
              </button>
            </div>
            <form onSubmit={addNote}>
              <input
                className="note-input"
                placeholder="Title / Question"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
              <textarea
                className="note-textarea"
                placeholder="Content / Answer"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                required
              />
              <div className="modal-actions">
                <button
                  type="button"
                  className="cancel-btn"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="primary-btn">
                  + Add Note
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Notes;