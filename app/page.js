"use client";
// app/page.js — Home Page (Landing Page)
// This is the first screen users see.
// It shows four navigation cards linking to Register, Check In, Check Out, and Dashboard.

import Link from "next/link";

// Array of cards to display on the home page.
// Each card has a link, icon, title, description, and color values.
const navCards = [
  {
    href: "/register",
    icon: "👤",
    title: "Register",
    subtitle: "New Employee Setup",
    desc: "Register your face once to start tracking your attendance.",
    tag: "SETUP",
    tagClass: "badge-teal",
    accentColor: "rgba(13, 115, 119, 0.08)",   // Teal tint for card background
    borderColor: "rgba(13, 115, 119, 0.2)",
  },
  {
    href: "/login",
    icon: "🔓",
    title: "Check In",
    subtitle: "Face Authentication",
    desc: "Scan your face to mark your arrival and start your work day.",
    tag: "LOGIN",
    tagClass: "badge-green",
    accentColor: "rgba(20, 160, 133, 0.07)",   // Green tint for check-in card
    borderColor: "rgba(20, 160, 133, 0.2)",
  },
  {
    href: "/logout",
    icon: "🔒",
    title: "Check Out",
    subtitle: "End of Day",
    desc: "Verify your face to log your departure time with GPS.",
    tag: "LOGOUT",
    tagClass: "badge-amber",
    accentColor: "rgba(224, 123, 57, 0.07)",   // Orange tint for check-out card
    borderColor: "rgba(224, 123, 57, 0.2)",
  },
  {
    href: "/dashboard",
    icon: "📊",
    title: "Dashboard",
    subtitle: "Attendance Records",
    desc: "View all records, login/logout times, and location data.",
    tag: "DATA",
    tagClass: "badge-teal",
    accentColor: "rgba(13, 115, 119, 0.06)",
    borderColor: "rgba(13, 115, 119, 0.18)",
  },
];

export default function Home() {
  return (
    <main className="page" style={{ maxWidth: 700 }}>

      {/* ---- Header Section ---- */}
      <div className="animate-slide-up" style={{ textAlign: "center", marginBottom: 56 }}>

        {/* Green dot with "System Online" label — shows the app is running */}
        <div style={{
          display: "inline-flex", alignItems: "center", gap: 8,
          background: "var(--bg-card)", border: "1px solid var(--border-color)",
          borderRadius: "var(--radius-full)", padding: "6px 16px", marginBottom: 24,
          backdropFilter: "blur(12px)",
        }}>
          {/* Pulsing green dot */}
          <div style={{
            width: 7, height: 7, borderRadius: "50%",
            background: "var(--accent-success)",
            boxShadow: "0 0 8px var(--accent-success)",
          }} className="animate-pulse-slow" />
          <span style={{ fontSize: 11, fontWeight: 600, color: "var(--text-secondary)", letterSpacing: "0.1em", textTransform: "uppercase" }}>
            System Online
          </span>
        </div>

        {/* Main app name — "Face" in dark + "Attend" in teal-to-green gradient */}
        <h1 style={{
          fontFamily: "'Outfit', sans-serif",
          fontSize: "clamp(2.5rem, 6vw, 3.5rem)", // Responsive font size
          fontWeight: 700,
          lineHeight: 1.15,
          marginBottom: 16,
          letterSpacing: "-0.02em",
        }}>
          Face
          <span style={{
            background: "linear-gradient(135deg, #0D7377, #14A085)",  // Teal gradient on "Attend"
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}>Attend</span>
        </h1>

        {/* Short description under the title */}
        <p style={{ color: "var(--text-secondary)", fontSize: 15, maxWidth: 380, margin: "0 auto" }}>
          Smart attendance tracking powered by face recognition and GPS verification.
        </p>
      </div>

      {/* ---- Navigation Cards Grid ---- */}
      {/* auto-fit means cards stack on mobile and go side-by-side on wide screens */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
        gap: 16,
      }}>
        {/* Loop through the navCards array and render one card per item */}
        {navCards.map((card, i) => (
          <Link href={card.href} key={card.href} style={{ textDecoration: "none" }}>
            <div
              className="card animate-slide-up"
              style={{
                padding: 24,
                animationDelay: `${i * 0.08}s`,  // Each card fades in slightly after the previous
                background: card.accentColor,
                borderColor: card.borderColor,
                cursor: "pointer",
              }}
              // Lift card on hover
              onMouseEnter={e => {
                e.currentTarget.style.transform = "translateY(-3px)";
                e.currentTarget.style.boxShadow = "var(--shadow-soft)";
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "var(--shadow-card)";
              }}
            >
              {/* Card top row: emoji icon on left, category badge on right */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
                <span style={{ fontSize: 28 }}>{card.icon}</span>
                <span className={`badge ${card.tagClass}`}>{card.tag}</span>
              </div>

              {/* Card title */}
              <h2 style={{
                fontFamily: "'Outfit', sans-serif",
                fontSize: 18, fontWeight: 600,
                color: "var(--text-primary)", marginBottom: 4,
              }}>
                {card.title}
              </h2>

              {/* Card subtitle in green */}
              <p style={{ fontSize: 12, color: "var(--accent-secondary)", fontWeight: 500, marginBottom: 10 }}>
                {card.subtitle}
              </p>

              {/* Card body text */}
              <p style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.55 }}>
                {card.desc}
              </p>

              {/* Arrow hint at the bottom — shows it's clickable */}
              <div style={{
                marginTop: 20, fontSize: 13, color: "var(--text-muted)",
                display: "flex", alignItems: "center", gap: 6,
              }}>
                Get started <span style={{ fontSize: 16 }}>→</span>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* ---- Footer ---- */}
      <p style={{
        marginTop: 56, textAlign: "center",
        fontSize: 12, color: "var(--text-muted)",
        fontFamily: "'JetBrains Mono', monospace", // Monospace for the tech stack list
      }}>
        Built with Next.js · face-api.js · MongoDB · GPS
      </p>
    </main>
  );
}
