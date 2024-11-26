const mongoose = require("mongoose");

const itineraryDaySchema = new mongoose.Schema(
    {
      itinerary: {
        type: mongoose.Schema.Types.ObjectId, // Reference to the associated Itinerary
        ref: "Itinerary",
        required: true,
      },
      dayNumber: {
        type: String, // Day number in the itinerary (e.g., 1, 2, 3, etc.)
        required: true,
      },
      activities: [
        {
          name: {
            type: String,
            required: true,
          },
          description: {
            type: String,
            required: true,
          },
          image: {
            type: String, // URL of the activity image
          },
        },
      ],
    },
    {
      timestamps: true, // Adds `createdAt` and `updatedAt` fields automatically
    }
  );
  
  const ItineraryDay = mongoose.model("ItineraryDay", itineraryDaySchema);
  
  module.exports = ItineraryDay;
  