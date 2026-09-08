const express = require("express");
const router = express.Router();
const Topic = require("../model/Topic");
const auth = require("../middleware/auth");

// 🔍 SEARCH topics
router.get("/search", auth, async (req, res) => {
  try {
    const { q } = req.query;

    if (!q) {
      return res.json([]);
    }

    const topics = await Topic.find({
      userId: req.user.id,
      $or: [
        { name: { $regex: q, $options: "i" } },
        { label: { $regex: q, $options: "i" } },
      ],
    });

    res.json(topics);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;