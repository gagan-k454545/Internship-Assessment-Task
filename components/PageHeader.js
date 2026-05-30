"use client";
// components/PageHeader.js
// Consistent header shown at the top of every inner page.
// Shows a back link, the page title, an optional subtitle, and a divider line.

import Link from "next/link";

// Props:
//   title    — main heading (e.g. "Check In")
//   subtitle — smaller text below the title (optional)
//   backHref — where the back link goes (default: home page)
export default function PageHeader({ title, subtitle, backHref = "/" }) {
  return (
    <div style={{ marginBottom: 32 }}>

      {/* Back link — takes user to the previous page (defaults to home) */}
      <Link href={backHref} style={{
        display: "inline-flex", alignItems: "center", gap: 8,
        color: "var(--text-secondary)", fontSize: 13, fontWeight: 500,
        textDecoration: "none", marginBottom: 20,
        transition: "var(--transition)",
      }}
        // Darken on hover so it looks interactive
        onMouseEnter={e => e.currentTarget.style.color = "var(--text-primary)"}
        onMouseLeave={e => e.currentTarget.style.color = "var(--text-secondary)"}
      >
        ← Back
      </Link>

      {/* Page title — large heading using the Outfit display font */}
      <h1 style={{
        fontFamily: "'Outfit', sans-serif",
        fontSize: "clamp(1.6rem, 4vw, 2rem)", // Scales between mobile and desktop
        fontWeight: 700,
        color: "var(--text-primary)",
        letterSpacing: "-0.02em",
        marginBottom: subtitle ? 6 : 0,
      }}>
        {title}
      </h1>

      {/* Subtitle — only renders if subtitle prop is provided */}
      {subtitle && (
        <p style={{ color: "var(--text-secondary)", fontSize: 14 }}>
          {subtitle}
        </p>
      )}

      {/* Divider line below the header — fades from teal to transparent */}
      <div className="divider" style={{ marginTop: 20 }} />
    </div>
  );
}
