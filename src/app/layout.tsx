import type { Metadata } from "next";
import { Dela_Gothic_One, Syne, DM_Sans } from "next/font/google";
import "./globals.css";

const delaGothic = Dela_Gothic_One({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-dela-gothic",
  display: "swap",
});

const syne = Syne({
  subsets: ["latin"],
  variable: "--font-syne",
  display: "swap",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Ahmet",
  description: "Portfolio of Ahmet Faruk Özdemir.",
  keywords: [
    "dark fantasy",
    "illustration",
    "horror art",
    "creature design",
    "manga",
    "ink drawing",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${delaGothic.variable} ${syne.variable} ${dmSans.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
