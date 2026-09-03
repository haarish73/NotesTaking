require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const notesRoutes = require("./routes/notes")
const authRoutes = require("./routes/auth")
const topicRoutes = require("./routes/topics");


const app = express();

app.use(cors());
app.use(express.json());
main().catch(err => console.log(err));

async function main() {
      if (!process.env.MONGODB_URI) {
    console.log("❌ MONGODB_URI is missing");
    process.exit(1);
  }

  await mongoose.connect(process.env.MONGODB_URI);
  console.log("mongodb connected");
}
// Routes
app.use("/notes", require("./routes/notes"));
app.use("/auth", authRoutes)
app.use("/topic", topicRoutes)

app.listen(5000, () => console.log("Server running on port 5000"));