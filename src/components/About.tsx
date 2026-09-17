"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export default function About() {
  return (
    <section id="about" className="px-6 py-24 max-w-3xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="h-px w-full bg-border mb-16" />

        <h2 className="font-heading text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
          About
        </h2>

        <p className="mt-6 text-base leading-relaxed text-muted max-w-2xl">
          Passionate developer and self taught designer. I study in Manisa and I
          regularly work on my own illustration projects. I am proficient in
          English and Turkish.
        </p>

        <p className="mt-4 text-base leading-relaxed text-muted max-w-2xl">
          Open to commissions and collaborations. Reach out through any of the
          links below.
        </p>

        <div className="mt-10 flex items-center gap-6">
          <a
            href="mailto:ahmetfaruk2344@gmail.com"
            className="text-sm tracking-widest uppercase font-heading text-foreground hover:text-accent transition-colors"
          >
            Email
          </a>
          <span className="text-border">|</span>
          <a
            href="https://www.instagram.com/runicmelody/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm tracking-widest uppercase font-heading text-foreground hover:text-accent transition-colors"
          >
            Illustration Instagram
          </a>
          <span className="text-border">|</span>
          <a
            href="https://www.instagram.com/runicmodeller/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm tracking-widest uppercase font-heading text-foreground hover:text-accent transition-colors"
          >
            Modelling Instagram
          </a>
          <span className="text-border">|</span>
          <a
            href="https://www.linkedin.com/in/ahmet-faruk-ozdemir/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm tracking-widest uppercase font-heading text-foreground hover:text-accent transition-colors"
          >
            LinkedIn
          </a>
        </div>

        <div className="mt-16 h-px w-full bg-border" />

        <p className="mt-8 text-xs text-muted/50 tracking-wider">
          &copy; {new Date().getFullYear()} Ahmet. All artworks are original
          creations, licensed CC BY-NC-ND 4.0.{" "}
          <Link href="/lisans" className="underline hover:text-muted">
            Licensing &amp; usage terms
          </Link>
        </p>
      </motion.div>
    </section>
  );
}
