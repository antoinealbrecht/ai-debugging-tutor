import type { ReactNode } from "react";
import "./globals.css";

export const metadata = {
  title: "AI Debugging Tutor",
  description: "A guided AI tutor for debugging JavaScript and TypeScript errors."
};

export default function RootLayout({
  children
}: {
  children: ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
