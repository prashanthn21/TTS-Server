const mongoose = require("mongoose");

const TTSHistorySchema = new mongoose.Schema({
  text: { type: String, required: true },  
  audioData: { type: Buffer, required: true },  // Store MP3 file as binary data
  createdAt: { type: Date, default: Date.now }
});

const TTSHistory = mongoose.model("TTSHistory", TTSHistorySchema);
module.exports = TTSHistory;
