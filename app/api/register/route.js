// app/api/register/route.js
// POST /api/register
// Receives name, email, and face descriptor from the Register page.
// Checks for duplicate emails, then saves the new user to MongoDB.

export const dynamic = "force-dynamic"; // Don't cache this route
import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";

export async function POST(request) {
  // Step 1: Connect to MongoDB
  try {
    await connectDB();
  } catch (dbError) {
    console.error("DB Connection failed:", dbError.message);
    return NextResponse.json(
      { error: "Database connection failed. Check MONGO_URI in Vercel environment variables." },
      { status: 500 }
    );
  }

  try {
    // Step 2: Read the request body
    const body = await request.json();
    const { name, email, descriptor } = body;

    // Step 3: Validate all required fields are present
    if (!name || !email || !descriptor) {
      return NextResponse.json(
        { error: "Name, email, and face descriptor are required" },
        { status: 400 }
      );
    }

    // Validate the descriptor is a non-empty array of numbers
    if (!Array.isArray(descriptor) || descriptor.length === 0) {
      return NextResponse.json(
        { error: "Invalid face descriptor" },
        { status: 400 }
      );
    }

    // Step 4: Check if this email is already registered
    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      return NextResponse.json(
        { error: "This email is already registered. Use a different email." },
        { status: 409 } // 409 Conflict
      );
    }

    // Step 5: Save the new user to the database
    const user = await User.create({
      name,
      email: email.toLowerCase(), // Always store lowercase
      descriptor,
    });

    // Return success with the new user's ID and name
    return NextResponse.json(
      { message: "Registration successful", userId: user._id, name: user.name },
      { status: 201 } // 201 Created
    );
  } catch (error) {
    console.error("Register error:", error.message);
    return NextResponse.json(
      { error: error.message || "Server error. Please try again." },
      { status: 500 }
    );
  }
}
