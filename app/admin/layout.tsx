import type { ReactNode } from "react";

const linkStyle = {
  color: "#fff",
  textDecoration: "none",
  fontSize: 12,
  fontWeight: 800,
  padding: "8px 11px",
  borderRadius: 999,
} as const;

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <>
      {children}
      <nav
        aria-label="Publisher quick tools"
        style={{
          position: "fixed",
          right: 16,
          bottom: 16,
          zIndex: 80,
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "flex-end",
          gap: 7,
          maxWidth: "calc(100vw - 32px)",
          padding: 7,
          borderRadius: 18,
          background: "rgba(15,32,47,.94)",
          boxShadow: "0 12px 32px rgba(15,32,47,.24)",
          backdropFilter: "blur(10px)",
        }}
      >
        <a href="/admin" style={linkStyle}>Dashboard</a>
        <a href="/admin/submission-readiness" style={{ ...linkStyle, background: "#f5c963", color: "#2c2818" }}>Submission Gate</a>
        <a href="/admin/journal-matrix" style={{ ...linkStyle, background: "#f0a6dd", color: "#522044" }}>Journal Matrix</a>
        <a href="/admin/citation-auditor" style={{ ...linkStyle, background: "#9dd2ff", color: "#163a55" }}>Citation Auditor</a>
        <a href="/admin/visibility-pack" style={{ ...linkStyle, background: "#cab8ff", color: "#31245e" }}>Visibility Pack</a>
        <a href="/admin/scholar-auditor" style={{ ...linkStyle, background: "#71e0bd", color: "#10251f", fontWeight: 900 }}>Live Scholar Auditor</a>
      </nav>
    </>
  );
}
