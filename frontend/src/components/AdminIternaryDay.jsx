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
          <div className="rounded-lg overflow-hidden shadow-md bg-gray-50 p-4 flex flex-col justify-center items-center">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Add New Activity
            </h3>
            <div className="mb-4 w-full">
              <input
                type="text"
                value={newActivity.name}
                onChange={(e) =>
                  setNewActivity({ ...newActivity, name: e.target.value })
                }
                placeholder="Activity Name"
                className="w-full border rounded-lg p-2 mb-2"
              />
              <textarea
                value={newActivity.description}
                onChange={(e) =>
                  setNewActivity({ ...newActivity, description: e.target.value })
                }
                placeholder="Activity Description"
                className="w-full border rounded-lg p-2 mb-2"
              ></textarea>
            </div>
  
            {/* Image Upload with Preview */}
            <div className="flex flex-col items-left w-full">
              {newActivity.image && (
                <img
                  src={URL.createObjectURL(newActivity.image)}
                  alt="Preview"
                  className="w-32 h-32 object-cover rounded-lg mb-2"
                />
              )}
              <label
                htmlFor="activity-image"
                className="flex items-center justify-center w-20 h-20 border border-dashed border-gray-400 rounded-lg cursor-pointer"
                >
                +
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
              className="mt-4 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition"
            >
              Add Activity
            </button>
          </div>
        </div>
      </div>
    );
  };
  
  export default AdminItineraryDay;
  