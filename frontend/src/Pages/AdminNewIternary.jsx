import React, { useState } from "react";
import Footer from "../components/Footer";
import AdminNavbar from "../components/AdminNavbar";
import axios from "axios";
import { FaMagic } from "react-icons/fa"; // Magic icon

const AdminNewItinerary = () => {
  const [formData, setFormData] = useState({
    destination: "",
    totalDays: "",
    totalNights: "",
  });
  const [photos, setPhotos] = useState([]);
  const [message, setMessage] = useState("");
  const [step, setStep] = useState(1);
  const [itineraryId, setItineraryId] = useState(null);
  const [days, setDays] = useState([]);
  const [currentDay, setCurrentDay] = useState({
    dayNumber: "",
    activities: [],
  });
  const [loading, setLoading] = useState(false); // Loading spinner for magic wand

  const handleGenerateActivityDescription = async (index) => {
    const activityName = currentDay.activities[index].name;
    const itineraryId = JSON.parse(localStorage.getItem("itineraryId")); // Fetch itineraryId
  
    if (!activityName.trim() || !itineraryId) {
      setMessage("Activity name and itinerary ID are required.");
      return;
    }
  
    setLoading(true);
    try {
      const response = await axios.post("/admin/api/generateActivityDescription", {
        activityName,
        itineraryId,
      });
  
      const { activityDescription } = response.data.data;
  
      // Update activity description in state
      const updatedActivities = currentDay.activities.map((activity, i) =>
        i === index ? { ...activity, description: activityDescription } : activity
      );
      setCurrentDay({ ...currentDay, activities: updatedActivities });
      setMessage("Activity description generated successfully!");
    } catch (error) {
      console.error("Error generating activity description:", error);
      setMessage("Failed to generate activity description.");
    } finally {
      setLoading(false);
    }
  };
  

  // Handle form field changes for Step 1
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle file changes for Step 1 photos
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    const updatedPhotos = files.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));
    setPhotos((prevPhotos) => [...prevPhotos, ...updatedPhotos]);
  };

  // Remove photos for Step 1
  const handleRemovePhoto = (index) => {
    setPhotos((prevPhotos) => prevPhotos.filter((_, i) => i !== index));
  };

  // Handle form submission for Step 1
  const handleSubmitStep1 = async (e) => {
    e.preventDefault();

    if (photos.length === 0) {
      setMessage("Please upload at least one photo.");
      return;
    }

    try {
      const adminData = JSON.parse(localStorage.getItem("Admin"));
      if (!adminData || !adminData._id) {
        setMessage("Admin information is missing. Please log in again.");
        return;
      }

      const formDataWithFiles = new FormData();
      formDataWithFiles.append("destination", formData.destination);
      formDataWithFiles.append("totalDays", formData.totalDays);
      formDataWithFiles.append("totalNights", formData.totalNights);
      formDataWithFiles.append("adminId", adminData._id);
      photos.forEach((photo) => {
        formDataWithFiles.append("photos", photo.file);
      });

      const response = await axios.post(
        "/admin/api/createnewiternary",
        formDataWithFiles,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log(response.data);
      localStorage.setItem(
        "itineraryId",
        JSON.stringify(response.data.itineraryId)
      );
      setItineraryId(response.data.itineraryId);
      setMessage("Itinerary created successfully! Proceed to add days.");
      setStep(2);
    } catch (error) {
      console.error("Error creating itinerary:", error);
      setMessage("Failed to create the itinerary. Please try again.");
    }
  };

  // Handle adding a new activity for the current day
  const handleAddActivity = () => {
    setCurrentDay({
      ...currentDay,
      activities: [
        ...currentDay.activities,
        { name: "", description: "", image: null, preview: null },
      ],
    });
  };

  // Handle activity field changes
  const handleActivityChange = (index, field, value) => {
    const updatedActivities = currentDay.activities.map((activity, i) =>
      i === index ? { ...activity, [field]: value } : activity
    );
    setCurrentDay({ ...currentDay, activities: updatedActivities });
  };

  // Handle activity file changes
  const handleActivityFileChange = (index, file) => {
    const updatedActivities = currentDay.activities.map((activity, i) =>
      i === index
        ? { ...activity, image: file, preview: URL.createObjectURL(file) }
        : activity
    );
    setCurrentDay({ ...currentDay, activities: updatedActivities });
  };

  // Save the current day to the days array
  const handleSaveDay = () => {
    setDays([...days, { ...currentDay, dayNumber: `Day ${days.length + 1}` }]);
    setCurrentDay({ dayNumber: "", activities: [] });
    setMessage("Day added successfully!");
  };

  // Handle form submission for Step 2
  const handleSubmitStep2 = async () => {
    const storedItineraryId = JSON.parse(localStorage.getItem("itineraryId"));
    const formDataWithFiles = new FormData();
    formDataWithFiles.append("storedItineraryId", storedItineraryId);

    days.forEach((day, dayIndex) => {
      formDataWithFiles.append(`days[${dayIndex}][dayNumber]`, day.dayNumber);

      day.activities.forEach((activity, activityIndex) => {
        formDataWithFiles.append(
          `days[${dayIndex}][activities][${activityIndex}][name]`,
          activity.name
        );
        formDataWithFiles.append(
          `days[${dayIndex}][activities][${activityIndex}][description]`,
          activity.description
        );
        if (activity.image) {
          formDataWithFiles.append(
            `days[${dayIndex}][activities][${activityIndex}][image]`,
            activity.image
          );
        }
      });
    });

    try {
      const response = await axios.post(
        "/admin/api/additernaryday",
        formDataWithFiles,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setMessage("Itinerary with days and activities saved successfully!");
      console.log(response.data);
      setStep(1); // Reset to Step 1 for creating a new itinerary
    } catch (error) {
      console.error("Error saving days:", error);
      setMessage("Failed to save days. Please try again.");
    }
  };

  return (
    <>
      <AdminNavbar />
      <div className="min-h-screen bg-gray-50 p-6">
        {step === 1 && (
          <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-8">
            {/* Step 1: Create Itinerary */}
            <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
              Create New Itinerary
            </h1>
            <form onSubmit={handleSubmitStep1} className="space-y-4">
              {/* Other fields omitted for brevity */}
              <div>
                <label
                  htmlFor="destination"
                  className="block text-gray-700 font-medium mb-2"
                >
                  Destination
                </label>
                <input
                  type="text"
                  id="destination"
                  name="destination"
                  value={formData.destination}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter the destination"
                  required
                />
              </div>

              {/* Total Days */}
              <div>
                <label
                  htmlFor="totalDays"
                  className="block text-gray-700 font-medium mb-2"
                >
                  Total Days
                </label>
                <input
                  type="number"
                  id="totalDays"
                  name="totalDays"
                  value={formData.totalDays}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter the total number of days"
                  required
                />
              </div>

              {/* Total Nights */}
              <div>
                <label
                  htmlFor="totalNights"
                  className="block text-gray-700 font-medium mb-2"
                >
                  Total Nights
                </label>
                <input
                  type="number"
                  id="totalNights"
                  name="totalNights"
                  value={formData.totalNights}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter the total number of nights"
                  required
                />
              </div>
              <div>
                <label htmlFor="photos" className="block text-gray-700">
                  Upload Photos
                </label>
                <div className="grid grid-cols-2 gap-4">
                  {photos.map((photo, index) => (
                    <div key={index} className="relative">
                      <img
                        src={photo.preview}
                        alt={`Preview ${index}`}
                        className="w-full h-32 object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemovePhoto(index)}
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6"
                      >
                        &times;
                      </button>
                    </div>
                  ))}
                  <label
                    htmlFor="photo-upload"
                    className="flex items-center justify-center w-32 h-32 border border-dashed border-gray-400 rounded-lg cursor-pointer"
                  >
                    <span className="text-3xl">+</span>
                  </label>
                  <input
                    type="file"
                    id="photo-upload"
                    accept="image/*"
                    multiple
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </div>
              </div>
              <button
                type="submit"
                className="w-full bg-blue-500 text-white py-3 rounded-lg"
              >
                Save and Proceed
              </button>
            </form>
          </div>
        )}
        {step === 2 && (
          <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-8">
            {/* Step 2: Add Days and Activities */}
            <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
              Add Days and Activities
            </h1>
            <div>
              <h2 className="text-xl font-semibold mb-4">
                Day {days.length + 1}
              </h2>
              {currentDay.activities.map((activity, index) => (
                <div key={index} className="mb-4">
                  <div className="relative mb-2">
                    <input
                      type="text"
                      placeholder="Activity Name"
                      value={activity.name}
                      onChange={(e) =>
                        handleActivityChange(index, "name", e.target.value)
                      }
                      className="w-full border rounded-lg p-2 pr-10" // Add padding-right for the button space
                    />
                    <button
                      type="button"
                      onClick={() => handleGenerateActivityDescription(index)}
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 text-blue-500 hover:text-blue-600 focus:outline-none"
                      title="Generate Description"
                    >
                      {loading ? (
                        <div className="animate-spin h-5 w-5 border-2 border-blue-500 border-t-transparent rounded-full"></div>
                      ) : (
                        <FaMagic size={20} />
                      )}
                    </button>
                  </div>

                  <textarea
                    placeholder="Activity Description"
                    value={activity.description}
                    onChange={(e) =>
                      handleActivityChange(index, "description", e.target.value)
                    }
                    className="w-full border rounded-lg p-2 mb-2"
                  />
                  <div className="flex items-center space-x-4">
                    {activity.preview && (
                      <img
                        src={activity.preview}
                        alt={`Activity ${index}`}
                        className="w-20 h-20 object-cover"
                      />
                    )}
                    <label
                      htmlFor={`activity-file-${index}`}
                      className="flex items-center justify-center w-20 h-20 border border-dashed border-gray-400 rounded-lg cursor-pointer"
                    >
                      <span className="text-xl">+</span>
                    </label>
                    <input
                      type="file"
                      id={`activity-file-${index}`}
                      accept="image/*"
                      onChange={(e) =>
                        handleActivityFileChange(index, e.target.files[0])
                      }
                      className="hidden"
                    />
                  </div>
                </div>
              ))}
              <button
                type="button"
                onClick={handleAddActivity}
                className="bg-green-500 text-white px-4 py-2 rounded-lg"
              >
                Add Activity
              </button>
              <button
                type="button"
                onClick={handleSaveDay}
                className="bg-blue-500 text-white px-4 py-2 rounded-lg ml-4"
              >
                Save Day
              </button>
            </div>
            <button
              type="button"
              onClick={handleSubmitStep2}
              className="w-full bg-blue-500 text-white py-3 rounded-lg mt-6"
            >
              Submit Itinerary
            </button>
          </div>
        )}
        {message && (
          <p className="text-center mt-4 text-green-500">{message}</p>
        )}
      </div>
      <Footer />
    </>
  );
};

export default AdminNewItinerary;
