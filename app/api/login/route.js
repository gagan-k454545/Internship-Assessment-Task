// app/api/login/route.js
// POST /api/login
// Receives a face descriptor and GPS location from the browser.
// Matches the face against all registered users, then saves the check-in time.

export const dynamic = "force-dynamic"; // Never cache this route
import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import Attendance from "@/models/Attendance";

// euclideanDistance — measures how similar two face descriptors are.
// A lower number means the faces are more alike.
// Faces with distance < 0.6 are considered the same person.
function euclideanDistance(arr1, arr2) {
  return Math.sqrt(arr1.reduce((sum, val, i) => sum + Math.pow(val - arr2[i], 2), 0));
}

// getISTDateTime — returns the current time and date in India Standard Time (IST)
function getISTDateTime() {
  const now = new Date();
  const time = now.toLocaleTimeString("en-IN", {
    timeZone: "Asia/Kolkata",
    hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: true,
  });
  const date = now.toLocaleDateString("en-CA", { timeZone: "Asia/Kolkata" }); // Returns YYYY-MM-DD
  return { time, date };
}

// getPlaceName — converts GPS coordinates into a human-readable place name
// Uses the free Nominatim API from OpenStreetMap
async function getPlaceName(latitude, longitude) {
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`,
      { headers: { "User-Agent": "FaceAttendanceApp/1.0" } }
    );
    const data = await res.json();
    const a = data.address;
    // Build a readable string like "Mangaluru, Karnataka"
    const area = a.suburb || a.neighbourhood || a.village || a.town || a.city || "";
    const city = a.city || a.town || a.county || "";
    const state = a.state || "";
    return [area, city, state].filter(Boolean).join(", ");
  } catch {
    // Fall back to showing raw coordinates if the API fails
    return `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;
  }
}

export async function POST(request) {
  // Try to connect to the database first
  try { await connectDB(); } catch (e) {
    return NextResponse.json({ error: "Database connection failed. Check MONGO_URI." }, { status: 500 });
  }

  try {
    // Read the face descriptor and GPS location from the request body
    const { descriptor, location } = await request.json();

    // Validate that a descriptor was sent
    if (!descriptor || !Array.isArray(descriptor))
      return NextResponse.json({ error: "Face descriptor is required" }, { status: 400 });

    // Load all registered users from the database
    const users = await User.find({});
    if (!users.length)
      return NextResponse.json({ error: "No employees registered yet." }, { status: 404 });

    // Compare the incoming face against every registered user
    // Keep track of the closest match and its distance
    let bestMatch = null, bestDistance = Infinity;
    for (const user of users) {
      const d = euclideanDistance(descriptor, user.descriptor);
      if (d < bestDistance) { bestDistance = d; bestMatch = user; }
    }

    // Reject if no match was close enough (distance > 0.6 = unknown face)
    if (!bestMatch || bestDistance > 0.6)
      return NextResponse.json({ error: "Face not recognized. Please register first." }, { status: 401 });

    // Get the current IST time and today's date
    const { time: loginTime, date: today } = getISTDateTime();

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

    // Find an existing attendance record for this user today
    let record = await Attendance.findOne({ userId: bestMatch._id, date: today });

    if (record) {
      // Update the existing record with the new login time
      record.loginTime = loginTime;
      record.location = locationData;
      await record.save();
    } else {
      // Create a new attendance record for today
      record = await Attendance.create({
        userId: bestMatch._id, name: bestMatch.name,
        date: today, loginTime, location: locationData,
      });
    }

    // Return success with the employee's name and check-in time
    return NextResponse.json({ message: "Check-in successful", name: bestMatch.name, loginTime, location: record.location });
  } catch (error) {
    return NextResponse.json({ error: error.message || "Server error." }, { status: 500 });
  }
}
