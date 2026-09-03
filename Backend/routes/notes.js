const express = require("express");
const router = express.Router();
const Note = require("../model/Note")
const auth = require("../middleware/auth")
// ✅ CREATE note (user-specific)
router.post("/", auth, async (req, res) => {
  try {
    const note = new Note({
      title: req.body.title,
      content: req.body.content,
      topic: req.body.topic,
      userId: req.user.id, 
    });

    const saved = await note.save();
    res.json(saved);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ GET notes (ONLY current user)
router.get("/", auth, async (req, res) => {
  try {
    const { topic } = req.query;

    const filter = {
      userId: req.user.id, // 🔥 filter by user
    };

    if (topic) {
      filter.topic = topic;
    }

    const notes = await Note.find(filter);
    res.json(notes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update Note
router.put("/:id", async (req, res) => {
  const updated = await Note.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(updated);
});

// ✅ DELETE (only own note)
router.delete("/:id", auth, async (req, res) => {
  try {
    const note = await Note.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.id, // 🔥 ownership check
    });

    if (!note) {
      return res.status(404).json({ message: "Not found" });
    }

    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;