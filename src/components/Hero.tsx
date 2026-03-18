"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { artworks } from "@/data/artworks";

export default function Hero() {
  const heroArtwork = artworks[0];
  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden">
      <div className="absolute inset-0">
        <Image
          src={heroArtwork ? `/artworks/${heroArtwork.filename}` : "/artworks/pfp.png"}
          alt=""
          fill
          className="object-cover opacity-20 scale-110 blur-sm"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/80 to-background" />
      </div>

      <div className="relative z-10 text-center px-6">
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="font-display text-6xl sm:text-8xl md:text-9xl tracking-tight text-foreground leading-none"
        >
          Ahmet
        </motion.h1>
      </div>

      <motion.a
        href="#gallery"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-muted hover:text-foreground transition-colors cursor-pointer"
      >
        <span className="text-[10px] tracking-[0.4em] uppercase font-heading">
          Scroll
        </span>
        <motion.svg
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
        >
          <path d="M3 6l5 5 5-5" />
        </motion.svg>
      </motion.a>
    </section>
  );
}
