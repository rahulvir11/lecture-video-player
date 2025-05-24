import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';

const LectureVideoPlayer = ({ selectedVideo,userId }) => {
  const videoRef = useRef(null);
  const [watched, setWatched] = useState([]);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        const { data } = await axios.get('https://api.assignment.virrahul.com/get-progress', {
          params: { userId, videoId: selectedVideo.id },
        });

        if (data?.lastPosition && videoRef.current) {
          videoRef.current.currentTime = data.lastPosition;
        }

        const intervals = data.watchedIntervals || [];
        setWatched(intervals);
        updateProgress(intervals);
      } catch (err) {
        console.error('Failed to fetch progress:', err.message);
      }
    };

    if (selectedVideo?.id) {
      fetchProgress();
    }

    return () => {
      setWatched([]);
      setProgress(0);
    };
  }, [selectedVideo,userId]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    let intervalId = null;

    const handleInterval = () => {
      const current = video.currentTime;
      if (current < 1) return;

      const newInterval = [current - 1, current];
      saveInterval(newInterval, current);
    };

    // Start tracking every second
    intervalId = setInterval(handleInterval, 1000);

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [watched, selectedVideo,userId]);

  const saveInterval = async (interval, lastPosition) => {
    try {
      await axios.post('https://api.assignment.virrahul.com/save-progress', {
        userId,
        videoId: selectedVideo.id,
        interval,
        lastPosition,
      });

      const updated = mergeIntervals([...watched, interval]);
      setWatched(updated);
      updateProgress(updated);
    } catch (err) {
      console.error('Failed to save interval:', err.message);
    }
  };

  const mergeIntervals = (intervals) => {
    if (intervals.length === 0) return [];

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
  };

  const updateProgress = (intervals) => {
    const totalWatched = intervals.reduce((acc, [start, end]) => acc + (end - start), 0);
    const totalDuration = videoRef.current?.duration || 1;
    const calculatedProgress = Math.min(100, ((totalWatched / totalDuration) * 100).toFixed(2));
    setProgress(calculatedProgress);
  };

  return (
    <div className=" mx-28 m-auto bg-gray-100 min-h-screen p-6">
      <div className="w-full lg:w-2/3 mx-auto">
        <h1 className="text-2xl font-semibold mb-4">{selectedVideo.title}</h1>
        <video
          src={selectedVideo.src}
          type="video/mp4"
          ref={videoRef}
          width="100%"
          controls
          className="rounded shadow-md bg-black"
          onLoadedMetadata={() => updateProgress(watched)} // recalculate when metadata is loaded
        >
          Your browser does not support the video tag.
        </video>
        <div className="mt-4 text-lg">
          Progress: <strong>{progress}%</strong>
        </div>
      </div>
    </div>
  );
};

export default LectureVideoPlayer;
