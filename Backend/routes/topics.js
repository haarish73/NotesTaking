const express = require("express");
const router = express.Router();
const Topic = require("../model/Topic");
const auth = require("../middleware/auth");

// ✅ CREATE topic
router.post("/", auth, async (req, res) => {
  try {
    const topic = new Topic({
      ...req.body,
      userId: req.user.id, // 🔥 link to user
    });

    const saved = await topic.save();
    res.json(saved);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ GET topics (only user topics)
router.get("/", auth, async (req, res) => {
  try {
    const topics = await Topic.find({
      userId: req.user.id,
    });

    res.json(topics);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


module.exports = router;