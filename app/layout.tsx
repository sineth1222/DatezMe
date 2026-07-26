import type { Metadata, Viewport } from "next";
import { Playfair_Display, Manrope, Caveat } from "next/font/google";
import "./globals.css";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  weight: ["500", "600", "700", "800"],
});

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  weight: ["400", "500", "600", "700"],
});

const caveat = Caveat({
  subsets: ["latin"],
  variable: "--font-caveat",
  weight: ["500", "600", "700"],
});

export const metadata: Metadata = {
  title: "DatezMe — Plane Less. Love More.",
  description:
    "Create a secret, romantic date invitation link for your special someone. Made for Sri Lankan couples.",
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
  ),
  manifest: "/manifest.json",
  openGraph: {
    title: "DatezMe — Plane Less. Love More.",
    description: "A secret invitation, made just for them.",
    type: "website",
  },
  icons: {
    icon: [
      { url: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: "/icons/apple-touch-icon.png",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "DatezMe",
  },
};

export const viewport: Viewport = {
  themeColor: "#6B1E3C",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${playfair.variable} ${manrope.variable} ${caveat.variable}`}
    >
      <body className="font-body antialiased">{children}</body>
    </html>
  );
}
