const { Int32 } = require("bson");
const mongoose = require("mongoose");

const vlogschema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Users",
    },
    title: {
      type: String,
      required: [true, "Please enter a Title"],
    },
    content: {
      type: String,
      required: [true, "Please enter Content"],
    },
    VideoUrl: {
      type: String,
    },
    liked_by: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Users",
      },
    ],
    comments: [
      {
        user_id: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Users",
        },
        comment: String,
      },
    ],
    archieved: {
      type: Boolean,
      default: false,
    },
  },
  { collection: "Vlogs", timestamp: true }
);

module.exports = mongoose.model("Vlogs", vlogschema);
