const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const textRoutes = require("./routes/textRoutes");
const axios = require("axios");
const fs = require("fs");
const path = require("path");
require("dotenv").config();

const TTS = require("./models/TTSModel");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());


// ✅ Serve static files correctly
app.use("/public", express.static(path.resolve(__dirname, "public")));
app.use("/uploads", express.static(path.resolve(__dirname, "uploads")));

// ✅ API Routes
app.use("/api", textRoutes);

// ✅ Root Route
app.get("/", (req, res) => {
  res.send("✅ Backend is running on Vercel!");
});


// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
}).then(() => console.log("✅ MongoDB connected"))
.catch(err => console.error("❌ MongoDB connection error:", err));

// Server Start
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
