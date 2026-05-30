// models/Attendance.js
// Mongoose schema for attendance records.
// One document per employee per day — tracks check-in time, check-out time, and GPS location.

import mongoose from "mongoose";

const AttendanceSchema = new mongoose.Schema(
  {
    // Reference to the User document — links the record to a specific employee
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

    // Employee name — stored directly so dashboard doesn't need a join query
    name: { type: String, required: true },

    // Date as a string in YYYY-MM-DD format (e.g. "2025-05-30")
    date: { type: String, required: true },

    // Time the employee checked in — set by the /api/login route
    loginTime: { type: String, default: null },

    // Time the employee checked out — set by the /api/logout route
    logoutTime: { type: String, default: null },

    // GPS location data captured at check-in or check-out
    location: {
      latitude: { type: Number, default: null },
      longitude: { type: Number, default: null },
      place: { type: String, default: null }, // Human-readable address (e.g. "Mangaluru, Karnataka")
    },
  },
  { timestamps: true } // Adds createdAt and updatedAt automatically
);

// Guard against model re-registration in Next.js development hot-reload
export default mongoose.models.Attendance || mongoose.model("Attendance", AttendanceSchema);
