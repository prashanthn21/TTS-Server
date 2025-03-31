const mongoose = require("mongoose");

const TTSSchema = new mongoose.Schema({
    text: { type: String, required: true },
    audioUrl: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("TTS", TTSSchema);
