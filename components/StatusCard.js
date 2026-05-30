"use client";
// components/StatusCard.js
// Displays a colored feedback card during and after operations.
// Three states: loading (teal), success (green), error (red).
// Returns nothing if no message is provided.

export default function StatusCard({ status, message }) {
  // Don't render anything if there is no message to show
  if (!message) return null;

  // Color and icon configuration for each status type
  const styles = {
    loading: {
      background: "rgba(13, 115, 119, 0.07)",       // Soft teal background
      borderColor: "rgba(13, 115, 119, 0.25)",
      color: "#0D7377",
      icon: "⏳",
    },
    success: {
      background: "rgba(45, 140, 91, 0.07)",         // Soft green background
      borderColor: "rgba(45, 140, 91, 0.25)",
      color: "#2D8C5B",
      icon: "✓",
    },
    error: {
      background: "rgba(192, 57, 43, 0.07)",         // Soft red background
      borderColor: "rgba(192, 57, 43, 0.25)",
      color: "#C0392B",
      icon: "✕",
    },
  };

  // Pick the right style, default to loading if status is unknown
  const s = styles[status] || styles.loading;

  return (
    <div
      className="animate-fade-in"
      style={{
        marginTop: 16,
        padding: "12px 16px",
        borderRadius: "var(--radius-sm)",
        border: `1px solid ${s.borderColor}`,
        background: s.background,
        color: s.color,
        fontSize: 13,
        fontWeight: 500,
        display: "flex",
        alignItems: "center",
        gap: 10,
      }}
    >
      {/* Small circle with the icon (⏳ / ✓ / ✕) */}
      <span style={{
        width: 22, height: 22, borderRadius: "50%",
        background: s.borderColor,
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 11, flexShrink: 0, // Don't shrink the icon when message is long
      }}>
        {s.icon}
      </span>

      {/* The actual message text */}
      {message}
    </div>
  );
}
