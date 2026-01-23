const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    name: {
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

    password: {
      type: String,
      required: true,
      minlength: 6,
      select: false,
    },

    location: {
      type: String,
      trim: true,
    },

    contactInfo: {
      type: String,
      required: true,
      trim: true,
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

// prevent duplicate emails
userSchema.index({ email: 1 }, { unique: true });

// hash password before save
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

module.exports = mongoose.model("User", userSchema);
