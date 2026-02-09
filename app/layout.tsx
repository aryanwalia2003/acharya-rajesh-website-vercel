import type { Metadata } from "next";
import { Newsreader, Martel } from "next/font/google";
import "./globals.css";
import Providers from "@/components/Providers";

const newsreader = Newsreader({
  subsets: ["latin"],
  variable: "--font-newsreader",
  style: ["italic", "normal"],
});

const martel = Martel({
  weight: ["200", "300", "400", "600", "700", "800", "900"],
  subsets: ["devanagari"],
  variable: "--font-martel",
});

export const metadata: Metadata = {
  title: "Acharya Rajesh Walia | Vedic Astrologer",
  description: "Scholarly Vedic Astrology Journal and Consultations",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="hi" className="light">
      <body
        className={`${newsreader.variable} ${martel.variable} antialiased font-display`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}