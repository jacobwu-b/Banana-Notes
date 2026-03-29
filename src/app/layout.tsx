import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Banana Notes",
  description: "A playful note-taking app",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
