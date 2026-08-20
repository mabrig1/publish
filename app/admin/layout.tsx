import type { ReactNode } from "react";

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
          gap: 8,
          padding: 7,
          borderRadius: 999,
          background: "rgba(15,32,47,.94)",
          boxShadow: "0 12px 32px rgba(15,32,47,.24)",
          backdropFilter: "blur(10px)",
        }}
      >
        <a href="/admin" style={{ color: "#fff", textDecoration: "none", fontSize: 12, fontWeight: 800, padding: "8px 11px", borderRadius: 999 }}>Dashboard</a>
        <a href="/admin/scholar-auditor" style={{ color: "#10251f", background: "#71e0bd", textDecoration: "none", fontSize: 12, fontWeight: 900, padding: "8px 12px", borderRadius: 999 }}>Live Scholar Auditor</a>
      </nav>
    </>
  );
}
