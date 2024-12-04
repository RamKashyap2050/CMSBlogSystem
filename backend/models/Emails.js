const mongoose = require("mongoose");

const emailSchema = mongoose.Schema(
  {

    user_name: {
      type: String,
    },
    message: {
      type: String,
    },
    email: {
      type: String,
    },
    admin_reply: {
      type: String, 
    },
  },
  { collection: "Emails", timestamps: true } // Enables createdAt and updatedAt fields
);

module.exports = mongoose.model("Emails", emailSchema);
