import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "CineForge AI — Imagine. Generate. Inspire.",
  description:
    "Your creative universe. Transform ideas, scripts and images into cinematic AI videos with CineForge AI.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
