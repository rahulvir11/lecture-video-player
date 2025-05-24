import { useState } from "react";
import LectureVideoPlayer from "./components/Progress";

function App() {
  const [selectedVideo, setSelectedVideo] = useState({});
  const [userId, setUserId] = useState("rahul");
  const videoList = [
    { id: "lecture-101", title: "lecture-101", src: "/ecommerce.mp4" },
    { id: "lecture-102", title: "lecture-102", src: "/ochi.mp4" },
    { id: "lecture-103", title: "lecture-103", src: "/newass.mp4" },
  ];
  const names = [
    "Ravi Kumar",
    "Pankaj Singh",
    "Saurabh Yadav",
    "Anjali Kumari",
    "Manoj Tiwari",
  ];

  return (
    <div className="flex min-h-screen bg-gray-100 ">
      <div className="w-full">
        <h3 className="p-2">students names</h3>
        <select
          onChange={(e) => setUserId(e.target.value)}
          className="p-2 rounded-lg text-base border border-gray-300 focus:outline-none cursor-pointer w-52"
        >
          {names.map((name, index) => (
            <option key={index} value={name}>
              {name}
            </option>
          ))}
        </select>
        <LectureVideoPlayer selectedVideo={selectedVideo} userId={userId} />
      </div>

      <div className="w-1/3 p-6 border-l bg-white shadow-md">
        <h2 className="text-xl font-bold mb-4">All Lectures</h2>
        <ul className="space-y-3">
          {videoList.map((video) => (
            <li
              key={video.id}
              onClick={() => setSelectedVideo(video)}
              className={`cursor-pointer p-3 border rounded-lg ${
                selectedVideo.id === video.id
                  ? "bg-blue-100 border-blue-500"
                  : "hover:bg-gray-100"
              }`}
            >
              {video.title}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default App;
