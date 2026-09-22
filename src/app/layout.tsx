import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Ncare | Dashboard",
  description: "Ncare salon management dashboard",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" dir="ltr" className="h-full antialiased">
      <body className="min-h-full font-sans text-ink">{children}</body>
    </html>
  );
}
