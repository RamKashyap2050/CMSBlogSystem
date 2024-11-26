import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import AdminNavbar from "../components/AdminNavbar";
import Footer from "../components/Footer";

const AdminViewItinerary = () => {
  const [itineraries, setItineraries] = useState([]);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch itineraries from the backend
    const fetchItineraries = async () => {
      try {
        const response = await axios.get("/admin/api/getitineraries");
        setItineraries(response.data); // Assume the backend returns an array of itineraries
      } catch (error) {
        console.error("Error fetching itineraries:", error);
        setMessage("Failed to load itineraries. Please try again.");
      }
    };
    fetchItineraries();
  }, []);

  const handleViewFullItinerary = (id) => {
    navigate(`/adminviewsingleitinerary/${id}`);
  };

  return (
    <>
      <AdminNavbar />
      <div className="min-h-screen bg-gray-50 p-6">
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-10">
          View Itineraries
        </h1>
        {message && (
          <div className="text-center text-lg mb-6 text-red-500">
            {message}
          </div>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
          {itineraries.map((itinerary) => (
            <div
              key={itinerary._id}
              className="bg-white shadow-md rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
            >
              <img
                src={itinerary.photos}
                alt={itinerary.destination}
                className="w-full h-40 object-cover"
              />
              <div className="p-4">
                <h2 className="text-xl font-bold text-gray-800">
                  {itinerary.destination}
                </h2>
                <p className="text-gray-600 text-sm">
                  {itinerary.totalDays} days / {itinerary.totalNights} nights
                </p>
                <p className="text-gray-500 text-sm mt-2">
                  Created on: {new Date(itinerary.createdAt).toLocaleDateString()}
                </p>
                <button
                  onClick={() => handleViewFullItinerary(itinerary._id)}
                  className="mt-4 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition w-full"
                >
                  View Full Itinerary
                </button>
              </div>
            </div>
          ))}
        </div>
        {itineraries.length === 0 && (
          <p className="text-center text-gray-600 mt-10">
            No itineraries found.
          </p>
        )}
      </div>
      <Footer />
    </>
  );
};

export default AdminViewItinerary;
