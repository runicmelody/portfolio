"use client";

import { useState, useMemo, useCallback } from "react";
import { AnimatePresence } from "framer-motion";
import { artworks, getAllTags } from "@/data/artworks";
import type { Artwork } from "@/data/artworks";
import TagFilter from "./TagFilter";
import GalleryCard from "./GalleryCard";
import Lightbox from "./Lightbox";

export default function Gallery() {
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const tags = useMemo(() => getAllTags(artworks), []);

  const filtered = useMemo(
    () =>
      activeTag
        ? artworks.filter((a) => a.tags.includes(activeTag))
        : artworks,
    [activeTag]
  );

  const openLightbox = useCallback(
    (artwork: Artwork) => {
      const idx = filtered.findIndex((a) => a.id === artwork.id);
      setLightboxIndex(idx);
    },
    [filtered]
  );

  const closeLightbox = useCallback(() => setLightboxIndex(null), []);

  const goToPrev = useCallback(() => {
    setLightboxIndex((prev) =>
      prev !== null ? (prev - 1 + filtered.length) % filtered.length : null
    );
  }, [filtered.length]);

  const goToNext = useCallback(() => {
    setLightboxIndex((prev) =>
      prev !== null ? (prev + 1) % filtered.length : null
    );
  }, [filtered.length]);

  const lightboxArtwork =
    lightboxIndex !== null ? filtered[lightboxIndex] : null;

  return (
    <section id="gallery" className="px-6 py-24 max-w-7xl mx-auto">
      <div className="mb-12 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6">
        <div>
          <h2 className="font-heading text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
            Gallery
          </h2>
          <p className="mt-2 text-sm text-muted">
            {filtered.length} {filtered.length === 1 ? "piece" : "pieces"}
          </p>
        </div>
        <TagFilter
          tags={tags}
          activeTag={activeTag}
          onTagChange={setActiveTag}
        />
      </div>

      <div className="columns-1 sm:columns-2 lg:columns-3 gap-4">
        <AnimatePresence mode="popLayout">
          {filtered.map((artwork) => (
            <GalleryCard
              key={artwork.id}
              artwork={artwork}
              onClick={() => openLightbox(artwork)}
            />
          ))}
        </AnimatePresence>
      </div>

      <Lightbox
        artwork={lightboxArtwork}
        onClose={closeLightbox}
        onPrev={goToPrev}
        onNext={goToNext}
      />
    </section>
  );
}
