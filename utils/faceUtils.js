// utils/faceUtils.js
// Utility functions for face recognition and location.
// Used on the Register, Login, and Logout pages.
// Built on top of face-api.js — a JavaScript face recognition library.

import * as faceapi from "face-api.js";

// Flag to avoid downloading the models more than once per session
let modelsLoaded = false;

// loadModels — downloads the AI model weights from CDN
// Must be called before any face detection
export async function loadModels() {
  // Skip if models are already loaded in this browser session
  if (modelsLoaded) return;

  // GitHub CDN — hosts the pre-trained face recognition model files
  const MODEL_URL = "https://cdn.jsdelivr.net/gh/justadudewhohacks/face-api.js@master/weights";

  // Load three models in parallel:
  // 1. tinyFaceDetector — finds faces in the image (fast and lightweight)
  // 2. faceLandmark68Net — maps 68 points on the face (eyes, nose, mouth, etc.)
  // 3. faceRecognitionNet — turns landmarks into a 128-number descriptor
  await Promise.all([
    faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
    faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
    faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL),
  ]);

  modelsLoaded = true;
  console.log("✅ Face models loaded");
}

// getFaceDescriptor — detects the face in a video frame and returns its descriptor
// The descriptor is a Float32Array of 128 numbers unique to that face
export async function getFaceDescriptor(videoElement) {
  // detectAllFaces scans the video frame
  // withFaceLandmarks maps facial points
  // withFaceDescriptors converts to the 128-number vector
  const detections = await faceapi
    .detectAllFaces(videoElement, new faceapi.TinyFaceDetectorOptions())
    .withFaceLandmarks()
    .withFaceDescriptors();

  // Must detect exactly one face — throw helpful errors for 0 or 2+
  if (detections.length === 0) {
    throw new Error("No face detected. Please face the camera.");
  }

  if (detections.length > 1) {
    throw new Error("Multiple faces detected. Only one person should be in frame.");
  }

  // Return the descriptor from the first (and only) detected face
  return detections[0].descriptor;
}

// matchFace — compares a live face descriptor against all registered users
// Returns the matching user object, or null if no match is found
export function matchFace(liveDescriptor, users) {
  if (!users || users.length === 0) return null;

  // Wrap each user's descriptor in face-api's LabeledFaceDescriptors format
  // The label is the user's MongoDB _id, used to look them up after matching
  const labeledDescriptors = users.map((user) => {
    return new faceapi.LabeledFaceDescriptors(user._id.toString(), [
      new Float32Array(user.descriptor),
    ]);
  });

  // FaceMatcher compares descriptors using Euclidean distance
  // 0.6 = threshold — below 0.6 means it's likely the same person
  const matcher = new faceapi.FaceMatcher(labeledDescriptors, 0.6);
  const match = matcher.findBestMatch(liveDescriptor);

  // "unknown" means no match was close enough
  if (match.label === "unknown") return null;

  // Return the full user object that matched
  return users.find((u) => u._id.toString() === match.label) || null;
}

// getLocation — gets the user's GPS coordinates from the browser
// Returns a Promise that resolves to { latitude, longitude }
export function getLocation() {
  return new Promise((resolve, reject) => {
    // Check if the browser supports geolocation
    if (!navigator.geolocation) {
      reject(new Error("Geolocation is not supported by your browser."));
      return;
    }

    // Ask the browser to get the current position
    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      },
      () => {
        // User denied location permission
        reject(new Error("Location permission denied. Please allow location access."));
      }
    );
  });
}

// getTodayDate — returns today's date as a string in YYYY-MM-DD format
export function getTodayDate() {
  return new Date().toISOString().split("T")[0];
}

// getCurrentTime — returns the current time in HH:MM:SS AM/PM format
export function getCurrentTime() {
  return new Date().toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}
