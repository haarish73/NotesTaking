const mongoose = require("mongoose");

const NoteSchema = new mongoose.Schema({
  title: String,
  content: String,
  topic: String,
  date: {
    type: Date,
    default: Date.now
  },
    userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  }
});

module.exports = mongoose.model("Note", NoteSchema);