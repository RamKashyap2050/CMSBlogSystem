import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import useItineraryStore from "../store/useIternaryStore";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const Itinerary = () => {
  const { itineraries, fetchItineraries, loading, error } = useItineraryStore();

  useEffect(() => {
    fetchItineraries(); // Fetch data when the component mounts
  }, [fetchItineraries]);

  if (loading) {
    return <div className="text-center text-gray-500">Loading itineraries...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500">{error}</div>;
  }
  console.log(itineraries)
  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 p-6">
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-10">
          Explore My Suggested Itineraries
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-6xl mx-auto">
          {itineraries.map((itinerary) => (
            <div
              key={itinerary._id} // Use `_id` from the backend
              className="bg-white shadow-md rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
            >
              <img
                src={itinerary.photos}
                alt={itinerary.destination}
                className="w-full h-48 object-cover"
              />

              <div className="p-6">
                <h2 className="text-2xl font-bold text-gray-800">
                  {itinerary.destination}
                </h2>
                <p className="text-gray-600 mt-2">
                  <strong>Days:</strong> {itinerary.totalDays}
                </p>
                <p className="text-gray-600 mt-2">
                  <strong>Nights:</strong> {itinerary.totalNights}
                </p>

                <Link
                  to={`/itinerary/${itinerary._id}`}
                  className="mt-4 inline-block px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  View Details
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Itinerary;
