import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import AdminNavbar from "../components/AdminNavbar";
import Footer from "../components/Footer";
import ItineraryDay from "../components/IternaryDay";
import axios from "axios";

const AdminViewSingleItinerary = () => {
  const { id } = useParams(); // Extract itinerary ID from URL params
  const [itinerary, setItinerary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchItinerary = async () => {
      try {
        const response = await axios.get(`/admin/api/itinerary/${id}`);
        setItinerary(response.data);
      } catch (err) {
        console.error("Error fetching itinerary:", err);
        setError("Failed to load itinerary. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchItinerary();
  }, [id]);

  const handleDeleteActivity = async (dayId, activityId) => {
    try {
      await axios.delete(`/admin/api/deleteactivity/${dayId}/${activityId}`);
      setItinerary((prev) => ({
        ...prev,
        days: prev.days.map((day) =>
          day._id === dayId
            ? {
                ...day,
                activities: day.activities.filter(
                  (activity) => activity._id !== activityId
                ),
              }
            : day
        ),
      }));
    } catch (err) {
      console.error("Error deleting activity:", err);
      alert("Failed to delete activity.");
    }
  };

  const handleDeleteDay = async (dayId) => {
    try {
      await axios.delete(`/admin/api/deleteday/${dayId}`);
      setItinerary((prev) => ({
        ...prev,
        days: prev.days.filter((day) => day._id !== dayId),
      }));
    } catch (err) {
      console.error("Error deleting day:", err);
      alert("Failed to delete day.");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        Loading itinerary...
      </div>
    );
  }

  if (error || !itinerary) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500">
        {error || "Itinerary not found!"}
      </div>
    );
  }

  return (
    <>
      <AdminNavbar />
      <div className="min-h-screen bg-gray-50 p-6">
        <h1 className="text-4xl font-bold text-gray-800 text-center mb-6">
          {itinerary.destination}
        </h1>
        <p className="text-gray-600 text-center mb-4">
          {itinerary.totalDays} Days | {itinerary.totalNights} Nights
        </p>
        <div className="text-center mb-8">
          <img
            src={itinerary.photos}
            alt={`${itinerary.destination} main`}
            className="w-full max-w-3xl mx-auto rounded-lg shadow-md object-cover"
          />
        </div>
        {itinerary.days.map((day) => (
          <ItineraryDay
            key={day._id}
            dayId={day._id}
            dayNumber={day.dayNumber}
            activities={day.activities}
            handleDeleteActivity={handleDeleteActivity}
            handleDeleteDay={handleDeleteDay}
          />
        ))}
      </div>
      <Footer />
    </>
  );
};

export default AdminViewSingleItinerary;
