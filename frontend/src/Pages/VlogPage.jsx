import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const VlogPage = () => {
  const [vlogs, setVlogs] = useState([]); // Store vlogs
  const [loading, setLoading] = useState(true); // Loading state
  const [showYouTube, setShowYouTube] = useState(true); // Toggle for hero section media

  useEffect(() => {
    const fetchVlogs = async () => {
      try {
        const response = await axios.get("/admin/api/getvlogs"); // Fetch vlogs from backend
        setVlogs(response.data); // Assuming the backend sends an array of vlogs
        console.log(response.data)
        setLoading(false);
      } catch (error) {
        console.error("Error fetching vlogs:", error);
        setLoading(false);
      }
    };

    fetchVlogs();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        Loading vlogs...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <section className="relative bg-gray-900 h-[500px] flex items-center justify-center">
        {/* Toggle Button for Hero Section Media */}
        <button
          className="absolute top-4 right-4 bg-white text-gray-800 py-2 px-4 rounded-lg shadow-md hover:bg-gray-200"
          onClick={() => setShowYouTube(!showYouTube)}
        >
          {showYouTube ? "Show Video File" : "Show YouTube"}
        </button>

        {/* Hero Section Media */}
        {showYouTube ? (
          <video
            className="absolute inset-0 w-full h-full object-cover z-0"
            src="https://example-aws-bucket-trial-for-farmerplace.s3.us-east-2.amazonaws.com/AsITravel/the-himalayas-from-20000-ft-1080-publer.io.mp4"
            autoPlay
            loop
            muted
            playsInline // Prevent fullscreen on mobile
            disablePictureInPicture // Optional: Prevent PiP mode
          ></video>
        ) : (
          <iframe
            width="560"
            height="315"
            src="https://www.youtube.com/embed/-hTVNidxg2s?si=SSSJ7KHXq_heg2XS"
            title="YouTube video player"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
            className="absolute inset-0 w-full h-full max-w-3xl mx-auto"
          ></iframe>
        )}

        {/* Overlay for readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-black/90 z-10"></div>

        {/* Content */}
        <div className="relative z-20 text-center max-w-2xl mx-auto">
          <h2 className="text-4xl font-extrabold text-white leading-tight">
            Capturing Adventures Through Videos
          </h2>
          <p className="text-lg text-gray-300 mt-4">
            Experience the world through breathtaking visuals and compelling
            stories.
          </p>
        </div>
      </section>

      <main className="max-w-6xl mx-auto p-6">
        <h3 className="text-3xl font-bold text-gray-800 mb-6">Latest Videos</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {vlogs.map((vlog) => (
            <div
              key={vlog._id}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
            >
              <div className="relative group">
                {vlog.VideoUrl ? (
                  <video
                    src={vlog.VideoUrl}
                    className="w-full h-40 object-cover"
                    controls
                  />
                ) : (
                  <iframe
                    width="100%"
                    height="150"
                    src={`https://www.youtube.com/embed/${vlog.YouTubeId}`}
                    title={vlog.title}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                  ></iframe>
                )}
                {/* <div className="absolute inset-0 bg-black bg-opacity-40 group-hover:bg-opacity-70 flex items-center justify-center transition">
                  <button className="text-white bg-red-600 px-4 py-2 rounded-lg hover:bg-red-500">
                    Watch Now
                  </button>
                </div> */}
              </div>
              <div className="p-4">
                <h3 className="text-xl font-bold text-gray-800">{vlog.title}</h3>
                <p className="text-gray-600 mt-2">{vlog.description}</p>
                <Link
                  to={`/vlogs/${vlog._id}`}
                  className="text-blue-500 hover:text-blue-700 font-semibold mt-4 inline-block"
                >
                  Watch Now →
                </Link>
              </div>
            </div>
          ))}
        </div>
        {vlogs.length === 0 && (
          <p className="text-center text-gray-600 mt-10">
            No vlogs available. Check back later!
          </p>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default VlogPage;
