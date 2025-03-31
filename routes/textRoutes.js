const express = require("express");
const axios = require("axios");
const mongoose = require("mongoose");
const TTSHistory = require("../models/ttsHistory");

require("dotenv").config();
const router = express.Router();

// 📌 Convert Text to Speech & Store in MongoDB
router.post("/tts", async (req, res) => {
  try {
    const { text } = req.body;
    if (!text || text.trim() === "") {
      return res.status(400).json({ error: "Please enter text before converting!" });
    }

    console.log("🔹 Received text for TTS:", text);

    // 🔹 Ensure API Key Exists
    const apiKey = process.env.ELEVENLABS_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: "❌ Missing ElevenLabs API Key. Contact support." });
    }

    // 🔹 Call ElevenLabs API
    const response = await axios.post(
      "https://api.elevenlabs.io/v1/text-to-speech/EXAVITQu4vr4xnSDxMaL",
      { text, voice_settings: { stability: 0.5, similarity_boost: 0.5 } },
      { headers: { "Content-Type": "application/json", "xi-api-key": apiKey }, responseType: "arraybuffer" }
    );

    if (!response.data) {
      return res.status(500).json({ error: "❌ API Error: No audio received from ElevenLabs." });
    }

    console.log("✅ ElevenLabs API responded successfully!");

    // 🔹 Store audio in MongoDB
    const newHistory = new TTSHistory({ text, audioData: response.data });
    await newHistory.save();

    console.log("✅ Audio saved in MongoDB!");

    res.status(200).json({ message: "TTS Generated!", text });
  } catch (error) {
    console.error("❌ TTS Error:", error);
    res.status(500).json({ error: "❌ Failed to convert text to speech" });
  }
});

// 📌 Fetch All Stored Audio
router.get("/tts-history", async (req, res) => {
  try {
    const history = await TTSHistory.find().sort({ createdAt: -1 }).limit(10);
    res.status(200).json(history);
  } catch (error) {
    console.error("❌ History Fetch Error:", error);
    res.status(500).json({ error: "❌ Failed to fetch history" });
  }
});

// 📌 Get Audio File by ID
router.get("/audio/:id", async (req, res) => {
  try {
    const audio = await TTSHistory.findById(req.params.id);
    if (!audio) return res.status(404).json({ error: "Audio not found" });

    res.set("Content-Type", "audio/mpeg");
    res.send(audio.audioData);
  } catch (error) {
    console.error("❌ Error fetching audio:", error);
    res.status(500).json({ error: "❌ Internal Server Error" });
  }
});

module.exports = router;





