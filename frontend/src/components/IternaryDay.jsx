import React from "react";

const ItineraryDay = ({
  dayNumber,
  activities,
  dayId,
  handleDeleteActivity,
  handleDeleteDay,
}) => {
  const isAdmin = localStorage.getItem("Admin");

  return (
    <div className="bg-white rounded-lg shadow-lg p-4 mb-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-gray-800">
          {isAdmin ? "Day" : ""} {dayNumber}
        </h2>
        {isAdmin && (
          <button
            onClick={() => handleDeleteDay(dayId)}
            className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
          >
            Delete Day
          </button>
        )}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {activities.map((activity, index) => (
          <div
            key={index}
            className="rounded-lg overflow-hidden shadow-md bg-gray-50 relative"
          >
            <div className="h-64 w-full">
              <img
                src={activity.image}
                alt={activity.name}
                className="w-full h-full object-cover rounded-t-lg"
              />
            </div>
            <div className="p-4">
              <h3 className="text-lg font-semibold text-gray-800">
                {activity.name}
              </h3>
              <p className="text-gray-600 mt-2">{activity.description}</p>
            </div>
            {isAdmin && (
              <button
                onClick={() => handleDeleteActivity(dayId, activity._id)}
                className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-red-600 transition"
              >
                &times;
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ItineraryDay;
