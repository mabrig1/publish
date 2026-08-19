import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Mabrig PublishAI | Journal Verification & Publishing Assistant",
  description: "Find reputable journals, screen journal legitimacy signals, discover open-access options, and prepare manuscripts for submission with AI assistance.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
