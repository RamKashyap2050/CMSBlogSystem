import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import ItineraryDay from "../components/IternaryDay";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const ItineraryDetail = () => {
  const { id } = useParams(); // Get itinerary ID from route params
  const [itinerary, setItinerary] = useState(null); // State for itinerary details
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(""); // Error state

  useEffect(() => {
    const fetchItinerary = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`/admin/api/itinerary/${id}`);
        setItinerary(response.data); // Set the fetched itinerary data
      } catch (err) {
        console.error("Failed to fetch itinerary:", err);
        setError("Failed to load itinerary. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchItinerary();
  }, [id]);

  if (loading) {
    return (
      <div className="text-center text-gray-500">Loading itinerary...</div>
    );
  }

  if (error) {
    return <div className="text-center text-red-500">{error}</div>;
  }

  if (!itinerary) {
    return (
      <div className="text-center text-gray-500">
        No itinerary found for ID: {id}
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 p-6">
        <h1 className="text-4xl font-bold text-gray-800 text-center mb-6">
          {itinerary.destination}
        </h1>
        <p className="text-gray-600 text-center mb-4">
          {itinerary.totalDays} Days | {itinerary.totalNights} Nights
        </p>
        {itinerary.days
          .sort((a, b) => {
            const dayA = parseInt(a.dayNumber.replace("Day ", ""), 10) || 0;
            const dayB = parseInt(b.dayNumber.replace("Day ", ""), 10) || 0;
            return dayA - dayB;
          })
          .map((day) => (
            <ItineraryDay
              key={day.dayNumber}
              dayNumber={day.dayNumber}
              activities={day.activities}
            />
          ))}
      </div>
      <Footer />
    </>
  );
};

export default ItineraryDetail;
