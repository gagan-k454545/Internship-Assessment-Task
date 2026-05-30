// app/api/logout/route.js
// POST /api/logout
// Same face matching logic as /api/login, but saves the logoutTime instead.
// Updates the existing attendance record for today.

export const dynamic = "force-dynamic"; // Always run fresh, never cache
import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import Attendance from "@/models/Attendance";

// euclideanDistance — measures similarity between two face descriptor arrays
// Lower = more similar. Threshold: 0.6
function euclideanDistance(arr1, arr2) {
  return Math.sqrt(arr1.reduce((sum, val, i) => sum + Math.pow(val - arr2[i], 2), 0));
}

// getISTDateTime — returns current time and date in India Standard Time
function getISTDateTime() {
  const now = new Date();
  const time = now.toLocaleTimeString("en-IN", {
    timeZone: "Asia/Kolkata",
    hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: true,
  });
  const date = now.toLocaleDateString("en-CA", { timeZone: "Asia/Kolkata" }); // YYYY-MM-DD
  return { time, date };
}

// getPlaceName — reverse geocodes GPS coordinates to a readable address
// Uses the free OpenStreetMap Nominatim API
async function getPlaceName(latitude, longitude) {
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`,
      { headers: { "User-Agent": "FaceAttendanceApp/1.0" } }
    );
    const data = await res.json();
    const a = data.address;
    const area = a.suburb || a.neighbourhood || a.village || a.town || a.city || "";
    const city = a.city || a.town || a.county || "";
    const state = a.state || "";
    return [area, city, state].filter(Boolean).join(", ");
  } catch {
    return `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;
  }
}

export async function POST(request) {
  // Connect to MongoDB
  try { await connectDB(); } catch (e) {
    return NextResponse.json({ error: "Database connection failed. Check MONGO_URI." }, { status: 500 });
  }

  try {
    // Get face descriptor and location from the request
    const { descriptor, location } = await request.json();

    // Validate descriptor
    if (!descriptor || !Array.isArray(descriptor))
      return NextResponse.json({ error: "Face descriptor is required" }, { status: 400 });

    // Load all registered users
    const users = await User.find({});
    if (!users.length)
      return NextResponse.json({ error: "No employees registered yet." }, { status: 404 });

    // Find the closest matching face in the database
    let bestMatch = null, bestDistance = Infinity;
    for (const user of users) {
      const d = euclideanDistance(descriptor, user.descriptor);
      if (d < bestDistance) { bestDistance = d; bestMatch = user; }
    }

    // Reject unrecognized faces
    if (!bestMatch || bestDistance > 0.6)
      return NextResponse.json({ error: "Face not recognized. Please try again." }, { status: 401 });

    // Get current IST time and date
    const { time: logoutTime, date: today } = getISTDateTime();

    // Resolve GPS coordinates to a place name
    let place = null;
    if (location?.latitude && location?.longitude) {
      place = await getPlaceName(location.latitude, location.longitude);
    }

    const locationData = {
      latitude: location?.latitude || null,
      longitude: location?.longitude || null,
      place,
    };

    // Look for an existing attendance record for this user today
    let record = await Attendance.findOne({ userId: bestMatch._id, date: today });

    if (!record) {
      // No check-in exists — create a new record with just the logout time
      record = await Attendance.create({
        userId: bestMatch._id, name: bestMatch.name,
        date: today, logoutTime, location: locationData,
      });
    } else {
      // Update the existing record with the logout time
      record.logoutTime = logoutTime;
      record.location = locationData;
      await record.save();
    }

    // Return success
    return NextResponse.json({ message: "Check-out successful", name: bestMatch.name, logoutTime, location: record.location });
  } catch (error) {
    return NextResponse.json({ error: error.message || "Server error." }, { status: 500 });
  }
}
