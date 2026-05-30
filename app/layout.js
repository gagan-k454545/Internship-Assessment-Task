// app/layout.js
// Root layout — wraps every page. Sets up fonts, background effects, and toast notifications.

import { Outfit, Plus_Jakarta_Sans, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";

// Outfit font — used for headings
const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit", display: "swap" });

// Plus Jakarta Sans — used for body text and buttons
const plusJakarta = Plus_Jakarta_Sans({ subsets: ["latin"], variable: "--font-jakarta", display: "swap" });

// JetBrains Mono — used for timestamps and data
const jetbrainsMono = JetBrains_Mono({ subsets: ["latin"], weight: ["400", "500"], variable: "--font-mono", display: "swap" });

export const metadata = {
  title: "FaceAttend — Smart Attendance System",
  description: "Face authentication attendance system with GPS verification",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${outfit.variable} ${plusJakarta.variable} ${jetbrainsMono.variable}`}>
      <body style={{ backgroundColor: "var(--bg-primary)", color: "var(--text-primary)", minHeight: "100vh" }}>

        {/* Large indigo radial glow at top — main depth effect */}
        <div style={{
          position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0,
          background: "radial-gradient(ellipse 70% 45% at 50% -5%, rgba(108,99,255,0.18), transparent)",
        }} />

        {/* Secondary teal glow bottom-right — adds color depth */}
        <div style={{
          position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0,
          background: "radial-gradient(ellipse 50% 40% at 90% 110%, rgba(0,212,170,0.1), transparent)",
        }} />

        {/* Dot-grid texture — subtle dark pattern over the background */}
        <div style={{
          position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0,
          backgroundImage: "radial-gradient(rgba(255,255,255,0.03) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }} />

        {/* Page content sits above all background layers */}
        <div style={{ position: "relative", zIndex: 1 }}>
          {children}
        </div>

        {/* Toast notifications — dark styled to match the theme */}
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: "#131929",
              color: "#EAEFFE",
              border: "1px solid rgba(108,99,255,0.25)",
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontSize: "13px",
              borderRadius: "12px",
              boxShadow: "0 8px 30px rgba(0,0,0,0.5)",
            },
            success: { iconTheme: { primary: "#00E5A0", secondary: "#131929" } },
            error:   { iconTheme: { primary: "#FF4757", secondary: "#131929" } },
          }}
        />
      </body>
    </html>
  );
}
