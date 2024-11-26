const { Int32 } = require("bson");
const mongoose = require("mongoose");

const adminSchema = mongoose.Schema(
  {
    admin_name: {
      type: String,
      required: [true, "Please enter your first name"],
    },

    phone: {
      type: String,
      required: [true, "Please enter your phone"],
    },
    email: {
      type: String,
      required: [true, "Please enter your email"],
    },
    password: {
      type: String,
      required: [true, "Please enter your password"],
    },
  },
  { collection: "Admin", timestamp: true }
);

module.exports = mongoose.model("Admin", adminSchema);
