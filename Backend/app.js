const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const notesRoutes = require("./routes/notes")
const authRoutes = require("./routes/auth")
const topicRoutes = require("./routes/topics");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());
main().catch(err => console.log(err));

async function main() {
  await mongoose.connect(process.env.MONGO_URI);
}
// Routes
app.use("/notes", require("./routes/notes"));
app.use("/auth", authRoutes)
app.use("/topic", topicRoutes)

app.listen(5000, () => console.log("Server running on port 5000"));