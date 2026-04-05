import type { Metadata, Viewport } from "next";
import { Inter, Bungee_Shade } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const bungeeShade = Bungee_Shade({
  variable: "--font-bungee",
  weight: "400",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "The Hahei Classic",
  description:
    "Golf competition leaderboard for the Hahei Classic at Mercury Bay Golf Club",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#0a1f0a",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${bungeeShade.variable}`}>
      <body className="min-h-screen pb-20 md:pb-0">{children}</body>
    </html>
  );
}
