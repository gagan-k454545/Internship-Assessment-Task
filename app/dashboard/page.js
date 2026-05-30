"use client";
// app/dashboard/page.js — Attendance Records Dashboard
// Fetches all attendance records from MongoDB and displays them in a table.
// Also shows summary stats at the top (total records, check-ins, unique employees).

import { useEffect, useState } from "react";
import PageHeader from "@/components/PageHeader";

export default function DashboardPage() {
  // records holds the array of attendance documents from the database
  const [records, setRecords] = useState([]);

  // loading = true while data is being fetched from the API
  const [loading, setLoading] = useState(true);

  // error holds any error message if the fetch fails
  const [error, setError] = useState("");

  // Fetch records when the page first loads
  useEffect(() => { fetchRecords(); }, []);

  // fetchRecords calls the /api/attendance endpoint and updates state
  const fetchRecords = async () => {
    setLoading(true); setError("");
    try {
      const res = await fetch("/api/attendance", { cache: "no-store" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to fetch records");
      setRecords(data.records || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false); // Always stop the loading spinner
    }
  };

  // Compute summary stats from the records array
  const totalLogins = records.filter((r) => r.loginTime).length;         // Count records that have a check-in time
  const uniqueEmployees = new Set(records.map((r) => r.name)).size;      // Count distinct employee names

  // Stats array used to render the three stat cards at the top
  const stats = [
    { label: "Total Records", value: records.length, color: "var(--accent-primary)", glow: "rgba(13,115,119,0.2)" },
    { label: "Check-ins", value: totalLogins, color: "var(--accent-secondary)", glow: "rgba(20,160,133,0.2)" },
    { label: "Employees", value: uniqueEmployees, color: "var(--accent-highlight)", glow: "rgba(224,123,57,0.2)" },
  ];

  return (
    <main className="page-wide animate-fade-in">
      {/* Page title and back link */}
      <PageHeader title="Attendance Dashboard" subtitle="Live attendance records with location data" />

      {/* ---- Summary Stats Row ---- */}
      {/* Three cards showing total records, check-ins, and employee count */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
        gap: 12,
        marginBottom: 28,
      }}>
        {stats.map((stat) => (
          <div key={stat.label} className="card" style={{ padding: "20px 24px", textAlign: "center" }}>
            {/* Large colored number */}
            <p style={{
              fontFamily: "'Outfit', sans-serif",
              fontSize: 32, fontWeight: 700,
              color: stat.color,
              textShadow: `0 0 20px ${stat.glow}`, // Subtle color glow on the number
              lineHeight: 1,
              marginBottom: 6,
            }}>
              {stat.value}
            </p>
            {/* Stat label below the number */}
            <p style={{ fontSize: 12, color: "var(--text-secondary)", fontWeight: 500 }}>
              {stat.label}
            </p>
          </div>
        ))}
      </div>

      {/* ---- Table Header Bar ---- */}
      {/* Shows record count on the left and a Refresh button on the right */}
      <div style={{
        display: "flex", justifyContent: "space-between", alignItems: "center",
        marginBottom: 12,
      }}>
        <p style={{ fontSize: 13, color: "var(--text-muted)" }}>
          {records.length} record{records.length !== 1 ? "s" : ""} found
        </p>
        {/* Refresh button re-runs fetchRecords to get the latest data */}
        <button className="btn btn-outline" style={{ padding: "8px 16px", fontSize: 12 }} onClick={fetchRecords}>
          ↻ Refresh
        </button>
      </div>

      {/* ---- Main Data Table Card ---- */}
      <div className="card" style={{ overflow: "hidden", padding: 0 }}>

        {/* Show loading message while fetching */}
        {loading ? (
          <div style={{ padding: 64, textAlign: "center", color: "var(--text-secondary)", fontSize: 14 }}
            className="animate-pulse-slow">
            Loading records...
          </div>

        ) : error ? (
          /* Show error if fetch failed */
          <div style={{ padding: 64, textAlign: "center" }}>
            <p style={{ color: "var(--accent-error)", marginBottom: 8, fontSize: 14 }}>✕ {error}</p>
            <p style={{ color: "var(--text-muted)", fontSize: 12 }}>Check your MongoDB connection and environment variables.</p>
          </div>

        ) : records.length === 0 ? (
          /* Show empty state if no records exist yet */
          <div style={{ padding: 64, textAlign: "center" }}>
            <p style={{ fontSize: 40, marginBottom: 16 }}>📭</p>
            <p style={{ color: "var(--text-secondary)", fontSize: 14, marginBottom: 12 }}>No attendance records yet.</p>
            <a href="/login" style={{ color: "var(--accent-secondary)", fontSize: 13, textDecoration: "none" }}>
              Make your first check-in →
            </a>
          </div>

        ) : (
          /* Scrollable table when records exist */
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>

              {/* Table column headers */}
              <thead>
                <tr style={{ borderBottom: "1px solid var(--border-color)", background: "rgba(13,115,119,0.03)" }}>
                  {["Name", "Date", "Check-in (IST)", "Check-out (IST)", "Location"].map((col) => (
                    <th key={col} style={{
                      padding: "12px 16px",
                      textAlign: "left",
                      fontSize: 11,
                      fontWeight: 600,
                      color: "var(--text-muted)",
                      textTransform: "uppercase",
                      letterSpacing: "0.07em",
                      whiteSpace: "nowrap",
                    }}>
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>

              {/* Table rows — one per attendance record */}
              <tbody>
                {records.map((rec) => (
                  <tr
                    key={rec._id}
                    style={{ borderBottom: "1px solid var(--border-color)", transition: "var(--transition)", cursor: "default" }}
                    // Highlight row with soft teal on hover
                    onMouseEnter={e => e.currentTarget.style.background = "rgba(13,115,119,0.04)"}
                    onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                  >
                    {/* Employee name — bold */}
                    <td style={{ padding: "14px 16px", fontWeight: 600, color: "var(--text-primary)", whiteSpace: "nowrap" }}>
                      {rec.name}
                    </td>

                    {/* Date in monospace font */}
                    <td style={{ padding: "14px 16px", color: "var(--text-secondary)", whiteSpace: "nowrap", fontFamily: "'JetBrains Mono', monospace", fontSize: 12 }}>
                      {rec.date}
                    </td>

                    {/* Check-in time — green badge if present, dash if missing */}
                    <td style={{ padding: "14px 16px", whiteSpace: "nowrap", fontFamily: "'JetBrains Mono', monospace", fontSize: 12 }}>
                      {rec.loginTime
                        ? <span style={{
                            color: "var(--accent-success)",
                            background: "rgba(45,140,91,0.08)",
                            border: "1px solid rgba(45,140,91,0.2)",
                            borderRadius: 6, padding: "2px 8px",
                          }}>{rec.loginTime}</span>
                        : <span style={{ color: "var(--text-muted)" }}>—</span>}
                    </td>

                    {/* Check-out time — orange badge if present, dash if missing */}
                    <td style={{ padding: "14px 16px", whiteSpace: "nowrap", fontFamily: "'JetBrains Mono', monospace", fontSize: 12 }}>
                      {rec.logoutTime
                        ? <span style={{
                            color: "var(--accent-highlight)",
                            background: "rgba(224,123,57,0.08)",
                            border: "1px solid rgba(224,123,57,0.2)",
                            borderRadius: 6, padding: "2px 8px",
                          }}>{rec.logoutTime}</span>
                        : <span style={{ color: "var(--text-muted)" }}>—</span>}
                    </td>

                    {/* Location — show place name, or lat/lng if name unavailable */}
                    <td style={{ padding: "14px 16px", color: "var(--text-secondary)", fontSize: 12, maxWidth: 180 }}>
                      {rec.location?.place
                        || (rec.location?.latitude
                          ? `${rec.location.latitude.toFixed(3)}, ${rec.location.longitude.toFixed(3)}`
                          : "—")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ---- Bottom Action Buttons ---- */}
      <div style={{ display: "flex", gap: 10, marginTop: 20, flexWrap: "wrap" }}>
        <a href="/register" className="btn btn-outline" style={{ fontSize: 13 }}>+ Register Employee</a>
        <a href="/login" className="btn btn-primary" style={{ fontSize: 13 }}>Check In</a>
        <a href="/logout" className="btn btn-amber" style={{ fontSize: 13 }}>Check Out</a>
      </div>
    </main>
  );
}
