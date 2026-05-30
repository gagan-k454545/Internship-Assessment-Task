"use client";
// app/page.js — Home Page (Landing Page)
// First screen users see. Shows four navigation cards.

import Link from "next/link";

// Navigation cards — each links to a feature page
const navCards = [
  {
    href: "/register",
    icon: "👤",
    title: "Register",
    subtitle: "New Employee Setup",
    desc: "Register your face once to start tracking your attendance.",
    tag: "SETUP",
    tagClass: "badge-teal",
    accentColor: "rgba(108, 99, 255, 0.1)",
    borderColor: "rgba(108, 99, 255, 0.25)",
  },
  {
    href: "/login",
    icon: "🔓",
    title: "Check In",
    subtitle: "Face Authentication",
    desc: "Scan your face to mark your arrival and start your work day.",
    tag: "LOGIN",
    tagClass: "badge-green",
    accentColor: "rgba(0, 212, 170, 0.08)",
    borderColor: "rgba(0, 212, 170, 0.22)",
  },
  {
    href: "/logout",
    icon: "🔒",
    title: "Check Out",
    subtitle: "End of Day",
    desc: "Verify your face to log your departure time with GPS.",
    tag: "LOGOUT",
    tagClass: "badge-amber",
    accentColor: "rgba(255, 107, 107, 0.08)",
    borderColor: "rgba(255, 107, 107, 0.22)",
  },
  {
    href: "/dashboard",
    icon: "📊",
    title: "Dashboard",
    subtitle: "Attendance Records",
    desc: "View all records, login/logout times, and location data.",
    tag: "DATA",
    tagClass: "badge-teal",
    accentColor: "rgba(108, 99, 255, 0.08)",
    borderColor: "rgba(108, 99, 255, 0.2)",
  },
];

export default function Home() {
  return (
    <main className="page" style={{ maxWidth: 700 }}>

      {/* Header section */}
      <div className="animate-slide-up" style={{ textAlign: "center", marginBottom: 56 }}>

        {/* System Online pill */}
        <div style={{
          display: "inline-flex", alignItems: "center", gap: 8,
          background: "rgba(108,99,255,0.1)",
          border: "1px solid rgba(108,99,255,0.25)",
          borderRadius: "var(--radius-full)", padding: "6px 18px", marginBottom: 28,
          backdropFilter: "blur(12px)",
        }}>
          <div style={{
            width: 7, height: 7, borderRadius: "50%",
            background: "var(--accent-success)",
            boxShadow: "0 0 10px var(--accent-success)",
          }} className="animate-pulse-slow" />
          <span style={{ fontSize: 11, fontWeight: 700, color: "var(--accent-success)", letterSpacing: "0.12em", textTransform: "uppercase" }}>
            System Online
          </span>
        </div>

        {/* Main heading — "Face" plain + "Attend" in indigo-to-teal gradient */}
        <h1 style={{
          fontFamily: "'Outfit', sans-serif",
          fontSize: "clamp(2.8rem, 7vw, 4rem)",
          fontWeight: 800,
          lineHeight: 1.1,
          marginBottom: 18,
          letterSpacing: "-0.03em",
          color: "var(--text-primary)",
        }}>
          Face
          <span style={{
            background: "linear-gradient(135deg, #6C63FF, #00D4AA)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}>Attend</span>
        </h1>

        <p style={{ color: "var(--text-secondary)", fontSize: 15, maxWidth: 380, margin: "0 auto", lineHeight: 1.7 }}>
          Smart attendance tracking powered by face recognition and GPS verification.
        </p>
      </div>

      {/* Navigation Cards Grid */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
        gap: 16,
      }}>
        {navCards.map((card, i) => (
          <Link href={card.href} key={card.href} style={{ textDecoration: "none" }}>
            <div
              className="card animate-slide-up"
              style={{
                padding: 26,
                animationDelay: `${i * 0.08}s`,
                background: card.accentColor,
                borderColor: card.borderColor,
                cursor: "pointer",
              }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = "translateY(-4px)";
                e.currentTarget.style.boxShadow = "var(--shadow-soft)";
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "var(--shadow-card)";
              }}
            >
              {/* Icon + badge row */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
                <span style={{ fontSize: 30 }}>{card.icon}</span>
                <span className={`badge ${card.tagClass}`}>{card.tag}</span>
              </div>

              {/* Card title */}
              <h2 style={{
                fontFamily: "'Outfit', sans-serif",
                fontSize: 19, fontWeight: 700,
                color: "var(--text-primary)", marginBottom: 4,
              }}>
                {card.title}
              </h2>

              {/* Subtitle in accent color */}
              <p style={{ fontSize: 12, color: "var(--accent-secondary)", fontWeight: 600, marginBottom: 10 }}>
                {card.subtitle}
              </p>

              {/* Description */}
              <p style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.6 }}>
                {card.desc}
              </p>

              {/* Arrow hint */}
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

      {/* Footer */}
      <p style={{
        marginTop: 56, textAlign: "center",
        fontSize: 12, color: "var(--text-muted)",
        fontFamily: "'JetBrains Mono', monospace",
      }}>
        Built with Next.js · face-api.js · MongoDB · GPS
      </p>
    </main>
  );
}
