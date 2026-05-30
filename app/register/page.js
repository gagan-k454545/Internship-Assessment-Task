"use client";
// app/register/page.js — Employee Registration Page
// New employees enter their name + email, then scan their face once.
// The face descriptor (128 numbers) is saved to the database.

import { useRef, useState } from "react";
import { loadModels, getFaceDescriptor } from "@/utils/faceUtils";
import WebcamCapture from "@/components/WebcamCapture";
import StatusCard from "@/components/StatusCard";
import PageHeader from "@/components/PageHeader";
import toast from "react-hot-toast";

export default function RegisterPage() {
  // webcamRef lets us access the video feed from WebcamCapture
  const webcamRef = useRef(null);

  // Form field values
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  // status: null | "loading" | "success" | "error"
  const [status, setStatus] = useState(null);

  // Message shown inside StatusCard
  const [message, setMessage] = useState("");

  // done = true disables the form and hides the register button
  const [done, setDone] = useState(false);

  // handleRegister runs when user clicks "Register My Face"
  const handleRegister = async () => {
    // Validate that name and email are filled in before proceeding
    if (!name || !email) { toast.error("Please fill in your name and email"); return; }

    // Get the live video element from the webcam component
    const video = webcamRef.current?.getVideo();
    if (!video) { toast.error("Camera not ready"); return; }

    try {
      // Step 1: Download the face-api.js AI models from CDN
      setStatus("loading"); setMessage("Loading face recognition models...");
      await loadModels();

      // Step 2: Detect the face and extract its descriptor (128-number vector)
      setMessage("Scanning your face...");
      const descriptor = await getFaceDescriptor(video);

      // Step 3: Send name, email, and descriptor to the backend to save in MongoDB
      setMessage("Saving to database...");
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, descriptor: Array.from(descriptor) }),
      });

      const data = await res.json();

      // If the API returned a non-OK status, throw the error
      if (!res.ok) throw new Error(data.error || "Registration failed");

      // Step 4: Mark as done and show success message
      setStatus("success");
      setMessage(`Welcome, ${name}! You're now registered.`);
      setDone(true);
      toast.success("Registration complete!");
    } catch (err) {
      // Show any error — duplicate email, no face found, server error, etc.
      setStatus("error"); setMessage(err.message); toast.error(err.message);
    }
  };

  return (
    <main className="page animate-fade-in">
      {/* Page title and back link */}
      <PageHeader title="Register Face" subtitle="One-time setup to join the attendance system" />

      {/* Main form card */}
      <div className="card" style={{ padding: 28 }}>

        {/* Form fields: name, email, and camera */}
        <div style={{ display: "flex", flexDirection: "column", gap: 20, marginBottom: 24 }}>

          {/* Full Name input */}
          <div>
            <label className="input-label">Full Name</label>
            <input
              className="input"
              type="text"
              placeholder="e.g. Gagan Kumar"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={done} // Lock field after successful registration
            />
          </div>

          {/* Email input */}
          <div>
            <label className="input-label">Email Address</label>
            <input
              className="input"
              type="email"
              placeholder="e.g. gagan@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={done}
            />
          </div>

          {/* Webcam capture component */}
          <div>
            <label className="input-label">Face Capture</label>
            <WebcamCapture ref={webcamRef} />
          </div>
        </div>

        {/* Tips box — helps users get a good face scan */}
        <div style={{
          background: "rgba(13, 115, 119, 0.05)",
          border: "1px solid rgba(13, 115, 119, 0.15)",
          borderRadius: "var(--radius-sm)",
          padding: "12px 16px",
          marginBottom: 20,
        }}>
          {/* Tips heading */}
          <p style={{ fontSize: 11, fontWeight: 600, color: "var(--accent-primary)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 8 }}>
            Tips for best results
          </p>

          {/* List of tips */}
          {["Look directly at the camera", "Make sure only your face is visible", "Good lighting improves accuracy"].map(tip => (
            <p key={tip} style={{ fontSize: 12, color: "var(--text-secondary)", marginBottom: 4 }}>
              → {tip}
            </p>
          ))}
        </div>

        {/* StatusCard shows loading progress, success, or error */}
        <StatusCard status={status} message={message} />

        {/* Action button area */}
        <div style={{ marginTop: 20 }}>
          {/* Before done: show Register button. After: show link to Check In page */}
          {!done ? (
            <button
              className="btn btn-primary btn-full"
              onClick={handleRegister}
              disabled={status === "loading"}
              style={{ marginTop: 8 }}
            >
              {status === "loading" ? "⏳ Processing..." : "📸 Register My Face"}
            </button>
          ) : (
            <a href="/login" className="btn btn-outline btn-full" style={{ display: "flex", marginTop: 8 }}>
              Go to Check In →
            </a>
          )}
        </div>
      </div>
    </main>
  );
}
