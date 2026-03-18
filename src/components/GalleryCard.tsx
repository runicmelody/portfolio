"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import type { Artwork } from "@/data/artworks";

interface GalleryCardProps {
  artwork: Artwork;
  onClick: () => void;
}

export default function GalleryCard({ artwork, onClick }: GalleryCardProps) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="break-inside-avoid mb-4 group cursor-pointer"
      onClick={onClick}
    >
      <div className="relative overflow-hidden rounded-lg bg-surface">
        <Image
          src={`/artworks/${artwork.filename}`}
          alt="Artwork"
          width={artwork.width}
          height={artwork.height}
          className="w-full h-auto transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/0 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
          <div className="flex gap-2 mt-1.5">
            {artwork.tags.map((tag) => (
              <span
                key={tag}
                className="text-[10px] tracking-widest uppercase text-white/60"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
