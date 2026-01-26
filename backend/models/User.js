const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
    },

    lastName: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    // Password stored as plain text (as per requirement)
    password: {
      type: String,
      required: true,
      minlength: 6,
    },

    location: {
      type: String,
      trim: true,
    },

    // Phone number only
    phone: {
      type: String,
      required: true,
      trim: true,
      match: [/^[0-9]{10}$/, "Phone number must be 10 digits"],
    },

    // ER diagram: Donor / Recipient / Both
    userType: {
      type: String,
      enum: ["Donor", "Recipient", "Both"],
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
