import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Mabrig PublishAI | AI-Assisted Academic Publishing Services",
  description: "Premium manuscript technical support, journal matching and verification, academic formatting, submission preparation, and responsible AI-assisted publishing intelligence.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
