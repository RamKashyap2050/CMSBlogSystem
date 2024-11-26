const mongoose = require("mongoose");

const itinerarySchema = new mongoose.Schema(
  {
    destination: {
      type: String,
      required: true,
      trim: true,
    },
    totalDays: {
      type: Number,
      required: true,
    },
    totalNights: {
      type: Number,
      required: true,
    },
    photos: {
      type: String,
    },
    adminId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
      required: true,
    },
  },
  {
    timestamps: true, // Adds `createdAt` and `updatedAt` fields automatically
  }
);

const Itinerary = mongoose.model("Itinerary", itinerarySchema);

module.exports = Itinerary;
