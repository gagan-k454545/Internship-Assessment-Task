// app/api/attendance/route.js
// GET /api/attendance
// Fetches all attendance records from MongoDB and returns them sorted newest-first.
// Used by the Dashboard page to display the table.

import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Attendance from "@/models/Attendance";

// force-dynamic tells Next.js to never cache this API route
// (important because attendance data changes constantly)
export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  try {
    // Connect to MongoDB
    await connectDB();

    // Fetch all records, sort by createdAt descending (newest first)
    // .lean() returns plain JS objects instead of Mongoose documents — faster
    const records = await Attendance.find({}).sort({ createdAt: -1 }).lean();

    return NextResponse.json(
      { records },
      {
        status: 200,
        headers: {
          // Prevent browser and CDN from caching this response
          "Cache-Control": "no-store, no-cache, must-revalidate",
        },
      }
    );
  } catch (error) {
    // Log the error on the server and return a 500 to the client
    console.error("Attendance fetch error:", error.message);
    return NextResponse.json(
      { error: "Failed to fetch: " + error.message },
      { status: 500 }
    );
  }
}
