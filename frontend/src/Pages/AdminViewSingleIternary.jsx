import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import AdminNavbar from "../components/AdminNavbar";
import Footer from "../components/Footer";
import AdminItineraryDay from "../components/AdminIternaryDay";
import axios from "axios";

const AdminViewSingleItinerary = () => {
  const { id } = useParams(); // Extract itinerary ID from URL params
  const [itinerary, setItinerary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [newDay, setNewDay] = useState({ dayNumber: "", activities: [] });
  const [newActivity, setNewActivity] = useState({
    name: "",
    description: "",
    image: null,
  });

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
      await axios.delete(`/admin/api/deleteActivity/${dayId}/${activityId}`);
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

  const handleAddDay = async () => {
    try {
      const response = await axios.post(`/admin/api/addday/${id}`, newDay);
      setItinerary((prev) => ({
        ...prev,
        days: [...prev.days, response.data], // Add new day to days array
      }));
      setNewDay({ dayNumber: "", activities: [] });
    } catch (err) {
      console.error("Error adding day:", err);
      alert("Failed to add day.");
    }
  };

  const handleAddActivity = async (dayId) => {
    if (!newActivity.name || !newActivity.description || !newActivity.image) {
      alert("Please fill in all fields before adding an activity.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("name", newActivity.name);
      formData.append("description", newActivity.description);
      formData.append("image", newActivity.image);
      console.log("Form Data");
      formData.forEach((value, key) => {
        console.log(`${key}: ${value}`);
      });
            const response = await axios.post(
        `/admin/api/addactivity/${itinerary._id}/${dayId}`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      // Add the new activity to the correct day in the itinerary state
      setItinerary((prev) => ({
        ...prev,
        days: prev.days.map((day) =>
          day._id === dayId
            ? { ...day, activities: [...day.activities, response.data] }
            : day
        ),
      }));

      // Reset the new activity form
      setNewActivity({ name: "", description: "", image: null });
    } catch (err) {
      console.error("Error adding activity:", err);
      alert("Failed to add activity.");
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
          <AdminItineraryDay
            key={day._id}
            dayId={day._id}
            dayNumber={day.dayNumber}
            activities={day.activities}
            handleDeleteActivity={handleDeleteActivity}
            handleDeleteDay={handleDeleteDay}
            handleAddActivity={handleAddActivity} // Pass to AdminItineraryDay
            newActivity={newActivity} // Pass newActivity state
            setNewActivity={setNewActivity} // Pass setter
          />
        ))}
        {/* Add Day Section */}
        <div className="mt-8 p-4 bg-white rounded-lg shadow-lg">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Add a New Day
          </h2>
          <input
            type="text"
            value={newDay.dayNumber}
            onChange={(e) =>
              setNewDay({ ...newDay, dayNumber: e.target.value })
            }
            placeholder="Day Number"
            className="w-full border rounded-lg p-2 mb-4"
          />
          <button
            onClick={handleAddDay}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
          >
            Add Day
          </button>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default AdminViewSingleItinerary;
