import type { Metadata } from "next";
import "./globals.css";
import AffiliateFooter from "@/components/AffiliateFooter";

export const metadata: Metadata = {
  title: "Grab It — Your Shortcut to Mastery",
  description:
    "AI-powered course search. Find the best free and paid online courses with certificates. The direct link to every certificate.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="flex min-h-screen flex-col bg-gray-50 text-gray-900 antialiased">
        <main className="flex-1">{children}</main>
        <AffiliateFooter />
      </body>
    </html>
  );
}
