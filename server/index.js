import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";
import cookieParser from "cookie-parser";

import connectDB from "./config/db.js";
import Progress from "./model/progressSchema.js";


// Load environment variables
dotenv.config();

// Connect to the database
connectDB();

// Initialize express
const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
app.use(morgan("dev"));
app.use(cookieParser());

function mergeIntervals(intervals) {
    if (!intervals.length) return [];
  
    intervals.sort((a, b) => a[0] - b[0]);
    const merged = [intervals[0]];
  
    for (let i = 1; i < intervals.length; i++) {
      const last = merged[merged.length - 1];
      const current = intervals[i];
  
      if (current[0] <= last[1]) {
        last[1] = Math.max(last[1], current[1]);
      } else {
        merged.push(current);
      }
    }
    return merged;
  }
app.get('/get-progress', async (req, res) => {
    const { userId, videoId } = req.query;
    const record = await Progress.findOne({ userId, videoId });
    res.json(record || {});
  });

app.post('/save-progress', async (req, res) => {
    const { userId, videoId, interval, lastPosition } = req.body;
  
    let record = await Progress.findOne({ userId, videoId });
    if (!record) {
      record = new Progress({ userId, videoId, watchedIntervals: [interval], lastPosition });
    } else {
      record.watchedIntervals.push(interval);
      record.lastPosition = lastPosition;
    }
  
    // Merge intervals
    record.watchedIntervals = mergeIntervals(record.watchedIntervals);
    await record.save();
  
    res.json({ success: true });
});

// Error Handling Middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: err.message });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
