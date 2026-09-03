import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../css/Notes.css";

const API = "http://localhost:5000/notes";

function Notes() {
  const { topicName } = useParams();
  const navigate = useNavigate();

  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);

  const loadNotes = async () => {
    const token = localStorage.getItem("token");
    try {
      setLoading(true);
      const res = await fetch(`${API}?topic=${topicName}`, {
        headers: {
          Authorization: token || "",
        },
      });
      const data = await res.json();

      setNotes(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to load notes:", err);
      setNotes([]);
    } finally {
      setLoading(false);
    }
  };

  const addNote = async (e) => {
    e.preventDefault(); // Prevents page refresh
    const token = localStorage.getItem("token");
    if (!title.trim() || !content.trim()) return;

    try {
      await fetch(API, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token || "",
        },
        body: JSON.stringify({ title, content, topic: topicName }),
      });

      setTitle("");
      setContent("");
      loadNotes();
    } catch (err) {
      console.error("Failed to add note:", err);
    }
  };

  const deleteNote = async (id) => {
    const token = localStorage.getItem("token");
    try {
      await fetch(`${API}/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: token || "",
        },
      });
      loadNotes();
    } catch (err) {
      console.error("Failed to delete note:", err);
    }
  };

  useEffect(() => {
    loadNotes();
  }, [topicName]);

  return (
    <div className="notes-container">
      {/* Header */}
      <div className="notes-header">
        <button className="back-btn" onClick={() => navigate("/")}>
          ← Back to Topics
        </button>
        <h1>{topicName} Notes</h1>
      </div>

      {/* Add New Note Form */}
      <form className="note-form-card" onSubmit={addNote}>
        <h2>Add New Note</h2>
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
        <button type="submit" className="add-note-btn">
          + Add Note
        </button>
      </form>

      {/* Notes List */}
      <div className="notes-grid">
        {loading ? (
          <div className="empty-notes-card">
            <p>Loading notes...</p>
          </div>
        ) : notes.length === 0 ? (
          <div className="empty-notes-card">
            <p>No notes found for "{topicName}". Create one above! 📝</p>
          </div>
        ) : (
          notes.map((note) => (
            <div key={note._id || note.id} className="note-card">
              <div className="note-card-header">
                <h3 className="note-card-title">{note.title}</h3>
                <button
                  className="delete-btn"
                  onClick={() => deleteNote(note._id || note.id)}
                >
                  🗑️ Delete
                </button>
              </div>
              <p className="note-card-content">{note.content}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Notes;