import React from "react";

const ItineraryDay = ({ dayNumber, activities }) => {
  // Parse and sort dayNumber (if needed in future for reordering)
  const parsedDayNumber = parseInt(dayNumber.replace("Day ", ""), 10) || dayNumber;
  console.log(parsedDayNumber)
  return (
    <div className="bg-white rounded-lg shadow-lg p-4 mb-6">
      <div className="flex justify-between items-center mb-4">
        {/* Consistent rendering of Day number */}
        <h2 className="text-2xl font-bold text-gray-800">Day {parsedDayNumber}</h2>
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
          </div>
        ))}
      </div>
    </div>
  );
};

export default ItineraryDay;
