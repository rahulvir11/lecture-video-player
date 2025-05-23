
# 🎥 Lecture Video Player

A smart React-based lecture video player that tracks unique watch intervals, calculates accurate progress, avoids double-counting, and resumes playback from the last watched position.

---

## 🚀 Features

- ⏱️ **Watch Interval Tracking**  
  Automatically detects and stores watched video segments as the user watches.

- 📊 **Accurate Progress Calculation**  
  Uses merged time intervals to calculate truly unique watch progress, avoiding duplicate counts for rewatches or skipped segments.

- 🔁 **Resume from Last Watched Position**  
  Automatically resumes video playback from the last watched point.

- 💾 **Persistent State**  
  Watch data is saved using local storage or backend APIs for continuous experience across sessions.

---

## 🛠️ Technologies Used

- React
- JavaScript
- HTML5 Video API
- Local Storage (can be extended to backend API)

---

## 📄 Design Documentation

### Tracking Watched Intervals

We used the `onTimeUpdate` event from the video element to track continuous playback segments. Intervals were saved as pairs of `[startTime, endTime]` only when the video was actively playing (not paused or seeking).

### Merging Intervals for Unique Progress

To ensure rewatched or overlapped segments are only counted once:

1. Sort all saved intervals by `startTime`.
2. Merge overlapping or adjacent intervals.
3. Calculate total watched time by summing the lengths of merged intervals.
4. Compute progress:  
   `Progress (%) = (Total Unique Watched Time / Video Duration) * 100`

### Challenges & Solutions

| Challenge                              | Solution |
|----------------------------------------|----------|
| Handling seeking/fast-forward          | Ignored intervals during seeking using playback state checks |
| Avoiding double-counting               | Merged overlapping watch intervals |
| Reducing storage write overhead        | Batched updates on pause/unload using throttling |
| Resuming playback                      | Stored farthest watched point and set `video.currentTime` on mount |

---

## 📦 Getting Started

1. **Clone the repository**
   ```bash
   git clone https://github.com/rahulvir11/lecture-video-player.git
   cd lecture-video-player


