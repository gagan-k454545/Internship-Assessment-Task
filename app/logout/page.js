"use client";
// app/logout/page.js — Check Out Page
// Employee scans their face at the end of the day to record their departure time.
// Same flow as login: scan face → get GPS → send to API → show result.

import { useRef, useState } from "react";
import { loadModels, getFaceDescriptor, getLocation } from "@/utils/faceUtils";
import WebcamCapture from "@/components/WebcamCapture";
import StatusCard from "@/components/StatusCard";
import PageHeader from "@/components/PageHeader";
import toast from "react-hot-toast";

export default function LogoutPage() {
  // webcamRef lets us read the video stream from WebcamCapture
  const webcamRef = useRef(null);

  // status: null | "loading" | "success" | "error"
  const [status, setStatus] = useState(null);

  // Message shown in the StatusCard component
  const [message, setMessage] = useState("");

  // result holds the API response after a successful check-out
  const [result, setResult] = useState(null);

  // done = true replaces the Check Out button with "View Dashboard"
  const [done, setDone] = useState(false);

  // handleLogout runs when user clicks "Scan & Check Out"
  const handleLogout = async () => {
    // Get the webcam video element
    const video = webcamRef.current?.getVideo();
    if (!video) { toast.error("Camera not ready"); return; }

    try {
      // Step 1: Load AI face recognition models
      setStatus("loading"); setMessage("Loading face recognition models...");
      await loadModels();

      // Step 2: Detect and extract the face descriptor from the webcam
      setMessage("Scanning your face...");
      const descriptor = await getFaceDescriptor(video);

      // Step 3: Get GPS coordinates from the browser
      setMessage("Getting your GPS location...");
      const location = await getLocation();

      // Step 4: Call the /api/logout endpoint with face data and location
      setMessage("Processing check-out...");
      const res = await fetch("/api/logout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ descriptor: Array.from(descriptor), location }),
      });

      const data = await res.json();

      // Throw an error if the API returned a failure status
      if (!res.ok) throw new Error(data.error || "Check-out failed");

      // Step 5: Show success and save the result
      setStatus("success");
      setMessage(`Goodbye, ${data.name}! Check-out at ${data.logoutTime}`);
      setResult(data);
      setDone(true);
      toast.success(`Checked out: ${data.name}`);
    } catch (err) {
      // Handle errors — unknown face, GPS denied, server issue, etc.
      setStatus("error"); setMessage(err.message); toast.error(err.message);
    }
  };

  return (
    <main className="page animate-fade-in">
      {/* Page title and back link */}
      <PageHeader title="Check Out" subtitle="Verify your face to mark your end of day" />

      {/* Main card */}
      <div className="card" style={{ padding: 28 }}>

        {/* Camera section for face scanning */}
        <div style={{ marginBottom: 20 }}>
          <label className="input-label">Face Scan</label>
          <WebcamCapture ref={webcamRef} />
        </div>

        {/* GPS notice */}
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
          <span>GPS location will be captured for check-out</span>
        </div>

        {/* StatusCard shows loading steps, success, or error */}
        <StatusCard status={status} message={message} />

        {/* Result card — shown after a successful check-out */}
        {result && (
          <div
            className="animate-slide-up"
            style={{
              marginTop: 16,
              background: "rgba(224, 123, 57, 0.06)",           // Soft orange background for check-out
              border: "1px solid rgba(224, 123, 57, 0.2)",
              borderRadius: "var(--radius-sm)",
              padding: 16,
            }}
          >
            {/* Orange label */}
            <p style={{ fontSize: 11, fontWeight: 600, color: "var(--accent-highlight)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 12 }}>
              🔒 Check-Out Recorded
            </p>

            {/* Display employee name, checkout time, and location */}
            {[
              { key: "Employee", value: result.name },
              { key: "Check-out Time (IST)", value: result.logoutTime },
              { key: "Location", value: result.location?.place || "Fetching..." },
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
          {/* Show amber check-out button before done, dashboard link after */}
          {!done ? (
            <button
              className="btn btn-amber btn-full"
              onClick={handleLogout}
              disabled={status === "loading"}
            >
              {status === "loading" ? "⏳ Processing..." : "🔒 Scan & Check Out"}
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
