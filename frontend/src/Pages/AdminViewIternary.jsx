import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FiMoreVertical, FiTrash2 } from "react-icons/fi";
import { FaArrowRight } from "react-icons/fa";
import AdminNavbar from "../components/AdminNavbar";
import Footer from "../components/Footer";
import { Link } from "react-router-dom";
const AdminViewItinerary = () => {
  const [itineraries, setItineraries] = useState([]);
  const [message, setMessage] = useState("");
  const [editingItineraryId, setEditingItineraryId] = useState(null);
  const [updatedFields, setUpdatedFields] = useState({
    totalDays: "",
    totalNights: "",
    newPhoto: null,
  });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchItineraries = async () => {
      try {
        const response = await axios.get("/admin/api/getitineraries");
        setItineraries(response.data);
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

  const handleEditClick = (itinerary) => {
    setEditingItineraryId(itinerary._id);
    setUpdatedFields({
      totalDays: itinerary.totalDays,
      totalNights: itinerary.totalNights,
      newPhoto: null,
    });
  };

  const handleFieldChange = (field, value) => {
    setUpdatedFields((prev) => ({ ...prev, [field]: value }));
  };

  const handleSaveChanges = async (id) => {
    const formData = new FormData();
    formData.append("totalDays", updatedFields.totalDays);
    formData.append("totalNights", updatedFields.totalNights);
    if (updatedFields.newPhoto) {
      formData.append("photos", updatedFields.newPhoto);
    }

    try {
      const response = await axios.put(
        `/admin/api/updateitinerary/${id}`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      setItineraries((prev) =>
        prev.map((itinerary) =>
          itinerary._id === id ? { ...itinerary, ...response.data } : itinerary
        )
      );
      setEditingItineraryId(null);
      setMessage("Itinerary updated successfully!");
    } catch (error) {
      console.error("Error updating itinerary:", error);
      setMessage("Failed to update itinerary.");
    }
  };

  const handleDeleteItinerary = async (id) => {
    if (!window.confirm("Are you sure you want to delete this itinerary?")) {
      return;
    }

    try {
      await axios.delete(`/admin/api/deleteiternary/${id}`);
      setItineraries((prev) =>
        prev.filter((itinerary) => itinerary._id !== id)
      );
      setMessage("Itinerary deleted successfully!");
    } catch (error) {
      console.error("Error deleting itinerary:", error);
      setMessage("Failed to delete itinerary.");
    }
  };

  return (
    <div>
      <AdminNavbar />
      <div className="flex justify-end p-4">
        <Link
          to="/admincreateiternary"
          className="flex items-center font-bold text-lg text-black no-underline"
        >
          Create New Iternary
          <FaArrowRight className="ml-2" /> {/* Arrow Icon */}
        </Link>
      </div>{" "}
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <h1 className="text-4xl font-bold text-center text-gray-800 my-6">
          View Itineraries
        </h1>
        {message && (
          <div className="text-center text-lg mb-6 text-green-500">
            {message}
          </div>
        )}
        {/* Scrollable Container */}
        <div className="flex-grow overflow-y-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
            {itineraries.map((itinerary) => (
              <div
                key={itinerary._id}
                className="bg-white shadow-md rounded-lg overflow-hidden hover:shadow-lg transition-shadow relative"
              >
                {/* Image Section */}
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
                    Created on:{" "}
                    {new Date(itinerary.createdAt).toLocaleDateString()}
                  </p>
                  <button
                    onClick={() => handleViewFullItinerary(itinerary._id)}
                    className="mt-4 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition w-full"
                  >
                    View Full Itinerary
                  </button>
                </div>

                {/* Three Dots Menu and Delete Icon */}
                <div className="absolute top-4 right-4 flex space-x-2">
                  <button
                    onClick={() => handleEditClick(itinerary)}
                    className="p-2 bg-gray-200 rounded-full hover:bg-gray-300 transition"
                  >
                    <FiMoreVertical size={20} />
                  </button>
                  <button
                    onClick={() => handleDeleteItinerary(itinerary._id)}
                    className="p-2 bg-red-200 rounded-full hover:bg-red-300 transition"
                  >
                    <FiTrash2 size={20} className="text-red-600" />
                  </button>
                </div>

                {editingItineraryId === itinerary._id && (
                  <div className="absolute inset-0 bg-white bg-opacity-95 p-6 flex flex-col items-start space-y-4 overflow-y-auto">
                    <h3 className="text-xl font-bold">Edit Itinerary</h3>
                    <input
                      type="number"
                      value={updatedFields.totalDays}
                      onChange={(e) =>
                        handleFieldChange("totalDays", e.target.value)
                      }
                      placeholder="Total Days"
                      className="w-full mb-4 p-2 border rounded-lg"
                    />
                    <input
                      type="number"
                      value={updatedFields.totalNights}
                      onChange={(e) =>
                        handleFieldChange("totalNights", e.target.value)
                      }
                      placeholder="Total Nights"
                      className="w-full mb-4 p-2 border rounded-lg"
                    />
                    {/* Image Upload Section */}
                    <div className="w-full mb-4">
                      <label
                        htmlFor={`photo-${itinerary._id}`}
                        className="w-full h-40 flex items-center justify-center border border-dashed border-gray-400 rounded-lg cursor-pointer hover:bg-gray-100 transition relative"
                      >
                        {updatedFields.newPhoto ? (
                          <img
                            src={URL.createObjectURL(updatedFields.newPhoto)}
                            alt="Preview"
                            className="absolute inset-0 w-full h-full object-cover rounded-lg"
                          />
                        ) : (
                          <span className="text-gray-500 text-xl">+</span>
                        )}
                      </label>
                      <input
                        type="file"
                        id={`photo-${itinerary._id}`}
                        accept="image/*"
                        onChange={(e) =>
                          handleFieldChange("newPhoto", e.target.files[0])
                        }
                        className="hidden"
                      />
                    </div>
                    <button
                      onClick={() => handleSaveChanges(itinerary._id)}
                      className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 transition w-full"
                    >
                      Save Changes
                    </button>
                    <button
                      onClick={() => setEditingItineraryId(null)}
                      className="bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600 transition w-full"
                    >
                      Cancel
                    </button>
                  </div>
                )}
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
      </div>
    </div>
  );
};

export default AdminViewItinerary;
