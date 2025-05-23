const mongoose = require("mongoose");

const progressSchema = new mongoose.Schema({
    userId: String,
    videoId: String,
    watchedIntervals: [[Number]], // array of [start, end]
    lastPosition: Number,
  });
  
const Progress = mongoose.model('Progress', progressSchema);

module.exports = Progress;