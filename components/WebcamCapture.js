"use client";
// components/WebcamCapture.js
// Reusable camera component used on Register, Login, and Logout pages.
// Shows the webcam feed with a scanning animation and corner brackets.
// Uses forwardRef so parent pages can call getVideo() and capture() on it.

import { useRef, useState, forwardRef, useImperativeHandle } from "react";
import Webcam from "react-webcam";

// forwardRef lets parent components pass a ref into this component
const WebcamCapture = forwardRef(({ onCapture }, ref) => {
  const webcamRef = useRef(null); // Internal ref to the Webcam library element
  const [isReady, setIsReady] = useState(false); // true once the camera stream starts

  // useImperativeHandle defines what methods the parent can call via ref
  useImperativeHandle(ref, () => ({
    // getVideo() returns the raw <video> element — needed by face-api.js to detect faces
    getVideo: () => webcamRef.current?.video,
    // capture() takes a screenshot as a JPEG base64 string
    capture: () => webcamRef.current?.getScreenshot(),
  }));

  return (
    <div style={{ position: "relative", width: "100%" }}>

      {/* Camera container with rounded border */}
      <div style={{
        position: "relative",
        borderRadius: "var(--radius)",
        overflow: "hidden",
        // Border turns teal when camera is active
        border: `1px solid ${isReady ? "rgba(13, 115, 119, 0.4)" : "var(--border-color)"}`,
        background: "rgba(0,0,0,0.05)",
        transition: "var(--transition)",
      }}>

        {/* Scanning line — moves top-to-bottom while camera is active */}
        {isReady && (
          <div style={{
            position: "absolute", top: 0, left: 0, right: 0,
            height: 2,
            background: "linear-gradient(to right, transparent, var(--accent-primary), transparent)",
            zIndex: 10, pointerEvents: "none",
          }} className="animate-scan" />
        )}

        {/* Corner brackets — decorative targeting frame around the face area */}
        {["top-left", "top-right", "bottom-left", "bottom-right"].map((pos) => (
          <div key={pos} style={{
            position: "absolute",
            top: pos.startsWith("top") ? 10 : "auto",
            bottom: pos.startsWith("bottom") ? 10 : "auto",
            left: pos.endsWith("left") ? 10 : "auto",
            right: pos.endsWith("right") ? 10 : "auto",
            width: 18, height: 18,
            // Each corner shows only 2 of the 4 sides (top+left, top+right, etc.)
            borderTop: pos.startsWith("top") ? `2px solid var(--accent-primary)` : "none",
            borderBottom: pos.startsWith("bottom") ? `2px solid var(--accent-primary)` : "none",
            borderLeft: pos.endsWith("left") ? `2px solid var(--accent-primary)` : "none",
            borderRight: pos.endsWith("right") ? `2px solid var(--accent-primary)` : "none",
            zIndex: 10, pointerEvents: "none",
            opacity: isReady ? 0.8 : 0.3,
            transition: "var(--transition)",
          }} />
        ))}

        {/* The actual webcam video feed */}
        <Webcam
          ref={webcamRef}
          audio={false}                          // No microphone needed
          screenshotFormat="image/jpeg"          // For the capture() method
          style={{ width: "100%", height: 240, objectFit: "cover", display: "block" }}
          videoConstraints={{ facingMode: "user" }} // Front camera (selfie)
          onUserMedia={() => setIsReady(true)}   // Called when camera connects
          onUserMediaError={() => setIsReady(false)}
          mirrored={true}                        // Mirror so it feels natural
        />

        {/* Small status pill — bottom-left of the camera feed */}
        <div style={{
          position: "absolute", bottom: 12, left: 12, zIndex: 20,
          display: "flex", alignItems: "center", gap: 7,
          background: "rgba(240, 247, 244, 0.85)", // Semi-transparent light background
          backdropFilter: "blur(8px)",
          padding: "5px 12px",
          borderRadius: "var(--radius-full)",
          border: "1px solid var(--border-color)",
        }}>
          {/* Green dot when live, gray when connecting */}
          <div style={{
            width: 6, height: 6, borderRadius: "50%",
            background: isReady ? "var(--accent-success)" : "var(--text-muted)",
            boxShadow: isReady ? "0 0 6px var(--accent-success)" : "none",
          }} />
          <span style={{
            fontSize: 10, fontWeight: 600,
            color: isReady ? "var(--accent-success)" : "var(--text-muted)",
            fontFamily: "'JetBrains Mono', monospace",
            letterSpacing: "0.06em",
            textTransform: "uppercase",
          }}>
            {isReady ? "Camera Live" : "Connecting..."}
          </span>
        </div>
      </div>

      {/* Optional capture button — only rendered if parent passes an onCapture prop */}
      {onCapture && isReady && (
        <button
          className="btn btn-outline btn-full"
          style={{ marginTop: 10 }}
          onClick={() => onCapture(webcamRef.current?.getScreenshot())}
        >
          📸 Capture Photo
        </button>
      )}
    </div>
  );
});

// displayName helps with React DevTools debugging
WebcamCapture.displayName = "WebcamCapture";
export default WebcamCapture;
