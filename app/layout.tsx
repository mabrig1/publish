import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Mabrig PublishAI | Journal Verification & Publishing Assistant",
  description: "Find reputable journals, screen journal legitimacy signals, discover open-access options, and prepare manuscripts for submission with AI assistance.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        {children}
        <a
          href="/free-journals"
          aria-label="Open curated 100 journal candidate directory"
          style={{
            position: "fixed",
            right: 18,
            bottom: 18,
            zIndex: 50,
            padding: "11px 14px",
            borderRadius: 999,
            background: "#172033",
            color: "#fff",
            textDecoration: "none",
            fontSize: 12,
            fontWeight: 800,
            boxShadow: "0 10px 28px rgba(18,33,61,.22)",
          }}
        >
          100 Journal Candidates ↗
        </a>
      </body>
    </html>
  );
}
