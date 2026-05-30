// app/layout.js
// Root layout — wraps every page in the app.
// This file runs once and sets up fonts, background, and toast notifications.

import { Outfit, Plus_Jakarta_Sans, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";

// Load the Outfit font — used for headings
const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap", // Show fallback font while Outfit loads
});

// Load Plus Jakarta Sans — used for body text and buttons
const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  display: "swap",
});

// Load JetBrains Mono — used for timestamps and data
const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-mono",
  display: "swap",
});

// Page title and description shown in browser tab and Google
export const metadata = {
  title: "FaceAttend — Smart Attendance System",
  description: "Face authentication attendance system with GPS verification",
};

// RootLayout wraps every page — children is the current page content
export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${outfit.variable} ${plusJakarta.variable} ${jetbrainsMono.variable}`}>
      <body style={{ backgroundColor: "var(--bg-primary)", color: "var(--text-primary)", minHeight: "100vh" }}>

        {/* Soft radial glow at the top — adds depth to the light background */}
        <div style={{
          position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0,
          background: "radial-gradient(ellipse 80% 50% at 50% -10%, rgba(13,115,119,0.08), transparent)",
        }} />

        {/* Subtle dot-grid texture overlay — decorative background pattern */}
        <div style={{
          position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0,
          backgroundImage: "radial-gradient(rgba(13,115,119,0.06) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }} />

        {/* Page content sits above the background layers */}
        <div style={{ position: "relative", zIndex: 1 }}>
          {children}
        </div>

        {/* Toast notification system — shows success/error messages on any page */}
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: "#FFFFFF",
              color: "#1A2E2C",
              border: "1px solid rgba(13,115,119,0.2)",
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontSize: "13px",
              borderRadius: "10px",
              boxShadow: "0 8px 30px rgba(13,115,119,0.15)",
            },
            success: {
              iconTheme: { primary: "#2D8C5B", secondary: "#FFFFFF" },
            },
            error: {
              iconTheme: { primary: "#C0392B", secondary: "#FFFFFF" },
            },
          }}
        />
      </body>
    </html>
  );
}
