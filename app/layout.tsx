import type { Metadata } from "next";
import {
  Geist,
  Geist_Mono,
  Instrument_Serif,
  Inter,
  Rethink_Sans,
} from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

// add: Rethink sans font for headings
const rethinkSans = Rethink_Sans({
  variable: "--font-rethink-sans",
  subsets: ["latin"],
});

// add: Instrument Serif font for styling headings
const instrumentSerif = Instrument_Serif({
  variable: "--font-instrument-serif",
  subsets: ["latin"],
  weight: ["400"],
  style: ["normal", "italic"],
});

// add: Inter font for text blocks
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

// Geist font for UI elements
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

// Geist mono for code blocks (code editor, logs, terminal, etc.)
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Illustrator",
  description: "A Photoshop-like by Kim Charles",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${instrumentSerif.variable} ${rethinkSans.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {/* use provider to separate client components */}
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
