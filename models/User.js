// models/User.js
// Mongoose schema for registered employees.
// Each user has a name, email, and their face descriptor (128 numbers).

import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    // Employee's full name
    name: {
      type: String,
      required: true,
      trim: true, // Removes leading/trailing whitespace
    },

    // Company email — must be unique so one person can't register twice
    email: {
      type: String,
      required: true,
      unique: true,      // Prevents duplicate registrations
      lowercase: true,   // Always stored in lowercase
      trim: true,
    },

    // The face descriptor — 128 floating-point numbers from face-api.js
    // These numbers represent the unique shape of the person's face
    descriptor: {
      type: [Number],
      required: true,
    },
  },
  { timestamps: true } // Automatically adds createdAt and updatedAt fields
);

// Prevent Mongoose from re-compiling the model on every hot-reload in development
export default mongoose.models.User || mongoose.model("User", UserSchema);
