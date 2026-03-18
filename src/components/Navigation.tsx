"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

export default function Navigation() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    function handleScroll() {
      setScrolled(window.scrollY > 50);
    }
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={cn(
        "fixed top-0 left-0 right-0 z-40 transition-all duration-500",
        scrolled
          ? "bg-background/80 backdrop-blur-md border-b border-border"
          : "bg-transparent"
      )}
    >
      <div className="mx-auto max-w-7xl flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-8">
          <a
            href="#gallery"
            className="text-sm tracking-widest uppercase text-muted hover:text-foreground transition-colors"
          >
            Gallery
          </a>
          <a
            href="#about"
            className="text-sm tracking-widest uppercase text-muted hover:text-foreground transition-colors"
          >
            About
          </a>
        </div>
      </div>
    </nav>
  );
}
