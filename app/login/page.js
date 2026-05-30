"use client";
// app/login/page.js — Check In Page
// Employee scans their face to mark attendance for the day.
// Steps: load AI models → detect face → get GPS → send to API → show result.

import { useRef, useState } from "react";
import { loadModels, getFaceDescriptor, getLocation } from "@/utils/faceUtils";
import WebcamCapture from "@/components/WebcamCapture";
import StatusCard from "@/components/StatusCard";
import PageHeader from "@/components/PageHeader";
import toast from "react-hot-toast";

export default function LoginPage() {
  // webcamRef lets us call methods on the WebcamCapture component
  const webcamRef = useRef(null);

  // status: null | "loading" | "success" | "error"
  const [status, setStatus] = useState(null);

  // message shown inside the StatusCard
  const [message, setMessage] = useState("");

  // attendance holds the API response (name, time, location)
  const [attendance, setAttendance] = useState(null);

  // done = true hides the scan button and shows "View Dashboard" instead
  const [done, setDone] = useState(false);

  // handleLogin runs when user clicks "Scan & Check In"
  const handleLogin = async () => {
    // Get the video element from the webcam component
    const video = webcamRef.current?.getVideo();
    if (!video) { toast.error("Camera not ready"); return; }

    try {
      // Step 1: Load the face recognition AI models from CDN
      setStatus("loading"); setMessage("Loading face recognition models...");
      await loadModels();

      // Step 2: Detect the face in the webcam frame and get its descriptor (128 numbers)
      setMessage("Scanning your face...");
      const descriptor = await getFaceDescriptor(video);

      // Step 3: Ask the browser for the user's GPS coordinates
      setMessage("Getting your GPS location...");
      const location = await getLocation();

      // Step 4: Send the face descriptor and location to the backend API
      setMessage("Authenticating...");
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ descriptor: Array.from(descriptor), location }),
      });

      const data = await res.json();

      // If API returned an error status, throw it so the catch block handles it
      if (!res.ok) throw new Error(data.error || "Authentication failed");

      // Step 5: Show success and store the result
      setStatus("success");
      setMessage(`Welcome back, ${data.name}! Check-in recorded at ${data.loginTime}`);
      setAttendance(data);
      setDone(true);
      toast.success(`Checked in: ${data.name}`);
    } catch (err) {
      // Show any error (face not found, GPS denied, server error, etc.)
      setStatus("error"); setMessage(err.message); toast.error(err.message);
    }
  };

  return (
    <main className="page animate-fade-in">
      {/* Page title and back button */}
      <PageHeader title="Check In" subtitle="Scan your face to mark your arrival" />

      {/* Main card containing the camera and action area */}
      <div className="card" style={{ padding: 28 }}>

        {/* Camera section — webcam feed for face scanning */}
        <div style={{ marginBottom: 20 }}>
          <label className="input-label">Face Scan</label>
          <WebcamCapture ref={webcamRef} />
        </div>

        {/* GPS notice — tells the user location will be captured */}
        <div style={{
          display: "flex", alignItems: "center", gap: 10,
          background: "var(--bg-input)",
          border: "1px solid var(--border-color)",
          borderRadius: "var(--radius-sm)",
          padding: "10px 14px",
          marginBottom: 20,
          fontSize: 13, color: "var(--text-secondary)",
        }}>
          <span>📍</span>
          <span>GPS location will be captured automatically</span>
        </div>

        {/* StatusCard shows the current step or error message */}
        <StatusCard status={status} message={message} />

        {/* Result card — only shown after a successful check-in */}
        {attendance && (
          <div
            className="animate-slide-up"
            style={{
              marginTop: 16,
              background: "rgba(45, 140, 91, 0.06)",           // Soft green background
              border: "1px solid rgba(45, 140, 91, 0.2)",
              borderRadius: "var(--radius-sm)",
              padding: 16,
            }}
          >
            {/* Green label at the top of the result card */}
            <p style={{ fontSize: 11, fontWeight: 600, color: "var(--accent-success)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 12 }}>
              ✓ Check-In Recorded
            </p>

            {/* Show employee name, check-in time, and location */}
            {[
              { key: "Employee", value: attendance.name },
              { key: "Check-in Time (IST)", value: attendance.loginTime },
              { key: "Location", value: attendance.location?.place || "Fetching..." },
            ].map(({ key, value }) => (
              <div key={key} className="info-row">
                <span className="key">{key}</span>
                <span className="value">{value}</span>
              </div>
            ))}
          </div>
        )}

        {/* Action button area */}
        <div style={{ marginTop: 20 }}>
          {/* Before check-in: show the Scan button. After: show link to dashboard */}
          {!done ? (
            <button
              className="btn btn-primary btn-full"
              onClick={handleLogin}
              disabled={status === "loading"} // Disable while processing
            >
              {status === "loading" ? "⏳ Authenticating..." : "🔓 Scan & Check In"}
            </button>
          ) : (
            <a href="/dashboard" className="btn btn-outline btn-full" style={{ display: "flex", marginTop: 8 }}>
              View Dashboard →
            </a>
          )}
        </div>
      </div>
    </main>
  );
}
