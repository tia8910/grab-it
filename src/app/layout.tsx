import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Grab It — Your Shortcut to Mastery",
  description: "AI-powered course search. Find the best free and paid online courses with certificates from NVIDIA, Google, IBM, Meta, Coursera, and Udemy.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-[#fafbff] text-gray-900 antialiased">
        {children}
      </body>
    </html>
  );
}
