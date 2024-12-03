const AdminItineraryDay = ({
  dayNumber,
  activities,
  dayId,
  handleDeleteActivity,
  handleDeleteDay,
  handleAddActivity,
  newActivity,
  setNewActivity,
}) => {
  return (
    <div className="bg-white rounded-lg shadow-lg p-4 mb-6">
      {/* Day Header */}
      {console.log(dayNumber)}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-gray-800">{dayNumber}</h2>
        <button
          onClick={() => handleDeleteDay(dayId)}
          className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
        >
          Delete Day
        </button>
      </div>

      {/* Activities Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {activities.map((activity, index) => (
          <div
            key={index}
            className="rounded-lg overflow-hidden shadow-md bg-gray-50 relative"
          >
            {/* Activity Image */}
            <div className="h-64 w-full">
              <img
                src={activity.image}
                alt={activity.name}
                className="w-full h-full object-cover rounded-t-lg"
              />
            </div>

            {/* Activity Content */}
            <div className="p-4">
              <h3 className="text-lg font-semibold text-gray-800">
                {activity.name}
              </h3>
              <p className="text-gray-600 mt-2">{activity.description}</p>
            </div>

            {/* Delete Activity Button */}
            <button
              onClick={() => handleDeleteActivity(dayId, activity._id)}
              className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-red-600 transition"
            >
              &times;
            </button>
          </div>
        ))}

        {/* Add Activity Card */}
        <div className="rounded-lg overflow-hidden shadow-md bg-white p-6 flex flex-col items-center space-y-4 border border-gray-200">
          <h3 className="text-xl font-semibold text-gray-700 mb-2">
            Add New Activity
          </h3>
          {/* Activity Name */}
          <input
            type="text"
            value={newActivity.name}
            onChange={(e) =>
              setNewActivity({ ...newActivity, name: e.target.value })
            }
            placeholder="Activity Name"
            className="w-full border border-gray-300 rounded-lg px-4 py-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {/* Activity Description */}
          <textarea
            value={newActivity.description}
            onChange={(e) =>
              setNewActivity({ ...newActivity, description: e.target.value })
            }
            placeholder="Activity Description"
            className="w-full border border-gray-300 rounded-lg px-4 py-2 text-gray-800 resize-none h-24 focus:outline-none focus:ring-2 focus:ring-blue-500"
          ></textarea>
          {/* Image Upload with Preview */}
          <div className="flex  w-full space-y-2">
            {newActivity.image && (
              <img
                src={URL.createObjectURL(newActivity.image)}
                alt="Preview"
                className="w-32 h-32 object-cover rounded-lg shadow-md"
              />
            )}
            <label
              htmlFor="activity-image"
              className="flex items-center justify-center w-24 h-24 border border-dashed border-blue-400 rounded-lg cursor-pointer text-blue-500 hover:bg-blue-100 transition"
            >
              <span className="text-2xl font-bold">+</span>
            </label>
            <input
              type="file"
              id="activity-image"
              accept="image/*"
              onChange={(e) =>
                setNewActivity({ ...newActivity, image: e.target.files[0] })
              }
              className="hidden"
            />
          </div>
          {/* Add Activity Button */}
          <button
            onClick={() => handleAddActivity(dayId)}
            className="w-full bg-blue-500 text-white font-semibold py-2 rounded-lg hover:bg-blue-600 transition"
          >
            Add Activity
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminItineraryDay;
