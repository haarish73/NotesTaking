const mongoose = require("mongoose");

const TopicSchema = new mongoose.Schema({
  name: String,     // slug (react, dbms)
  label: String,    // display name (React, DBMS)
  icon: String,
  color: String,

  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

module.exports = mongoose.model("Topic", TopicSchema);