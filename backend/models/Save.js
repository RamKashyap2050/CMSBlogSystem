const { Int32 } = require("bson");
const mongoose = require("mongoose");

const SaveSchema = mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Users",
    },
    blogId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Blogs",
    },
    vlogId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Vlogs",
    },
  },
  { collection: "Save", timestamp: true }
);

module.exports = mongoose.model("Save", SaveSchema);
