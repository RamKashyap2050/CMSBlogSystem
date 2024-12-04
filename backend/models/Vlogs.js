const { Int32 } = require("bson");
const mongoose = require("mongoose");

const vlogschema = mongoose.Schema(
  {
    adminId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Admin",
    },
    title: {
      type: String,
      required: [true, "Please enter a Title"],
    },
    content: {
      type: String,
      required: [true, "Please enter Content"],
    },
    description: {
      type: String,
      required: [true, "Please enter a Description"],
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
          ref: "Users", // User who posted the comment
        },
        comment: {
          type: String,
          required: true, // Comment content
        },
        created_at: {
          type: Date,
          default: Date.now, // Timestamp for the comment
        },
        admin_reply: {
          type: String,
        },
        admin_id: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Admin", // Admin reply to the comment
        },
        admin_liked_comment: {
          type: Boolean,
          default: false,
        },
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
