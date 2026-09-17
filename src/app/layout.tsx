import type { Metadata } from "next";
import { Dela_Gothic_One, Syne, DM_Sans } from "next/font/google";
import "./globals.css";
import DungeonBackground from "@/components/dungeon/DungeonBackground";
import { copyrightNotice, LICENSE, LICENSE_URL, SITE } from "@/data/site";
import { siteJsonLd } from "@/lib/schema";

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
  metadataBase: new URL(SITE.url),
  title: {
    default: `${SITE.name} — Dark Fantasy Illustration`,
    template: `%s — ${SITE.name}`,
  },
  description:
    "Portfolio of Ahmet Faruk Özdemir — original dark fantasy illustration, creature design, manga and ink drawing. Licensed CC BY-NC-ND 4.0.",
  keywords: [
    "dark fantasy",
    "illustration",
    "horror art",
    "creature design",
    "manga",
    "ink drawing",
  ],
  authors: [{ name: SITE.author, url: SITE.url }],
  creator: SITE.author,
  publisher: SITE.author,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: SITE.url,
    siteName: `${SITE.name} — Illustration Portfolio`,
    title: `${SITE.name} — Dark Fantasy Illustration`,
    description:
      "Original dark fantasy illustration, creature design and ink drawing by Ahmet Faruk Özdemir.",
    locale: "en_US",
  },
  other: {
    // Görünür ve makine-okunur telif bildirimi
    copyright: copyrightNotice(),
    // Metin ve veri madenciliği rezervi (TDM Reservation Protocol)
    "tdm-reservation": "1",
    "tdm-policy": LICENSE_URL,
  },
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
        <DungeonBackground />
        {/* Lisansın makine tarafından bulunabilir olması (React bunu <head>'e taşır) */}
        <link rel="license" href={LICENSE.url} title={LICENSE.name} />
        <link rel="author" href={LICENSE_URL} title={SITE.author} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(siteJsonLd()) }}
        />
        {children}
      </body>
    </html>
  );
}
