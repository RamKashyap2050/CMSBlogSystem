const mongoose = require("mongoose");

const blogSchema = mongoose.Schema(
  {
    adminId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Admin", // Reference to Users collection
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
    post_image: {
      type: String, // URL for the post image
    },
    liked_by: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Users", // Users who liked this blog
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
    archived: {
      type: Boolean,
      default: false, // Whether the blog is archived
    },
  },
  { collection: "Blogs", timestamps: true } // Enables createdAt and updatedAt fields
);

module.exports = mongoose.model("Blogs", blogSchema);
