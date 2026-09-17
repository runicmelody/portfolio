# Runicc — Illustration Portfolio

Personal illustration portfolio built with **Next.js 16 / React 19**, with a **fully procedural WebGPU background written from scratch**.

## The background shader

[`src/components/dungeon/dungeon.wgsl`](src/components/dungeon/dungeon.wgsl) is a fragment shader written by hand. No textures — everything is generated per pixel:

- hash-based value noise + 4-octave FBM for the smoky ambient layers
- 80 independently animated ember particles rising from a flickering forge glow
- three parallax layers of drifting magic dust (teal → violet)
- edge vignette, subtle film grain, display gamma correction

[`src/components/dungeon/DungeonBackground.tsx`](src/components/dungeon/DungeonBackground.tsx) boots WebGPU through `vgpu`, drives the render loop, and falls back silently to a CSS gradient when WebGPU is unavailable.
[`next.config.ts`](next.config.ts) adds a Turbopack rule so `.wgsl` files are imported as modules.

## Gallery

Masonry grid with tag filtering (`OC` / `Sketches`) and a lightbox. Artwork metadata lives in [`src/data/artworks.ts`](src/data/artworks.ts).

## Stack

Next.js 16 · React 19 · TypeScript · Tailwind CSS 4 · WebGPU / WGSL · Vercel

## Run it

```bash
npm install
npm run dev
```

WebGPU needs a recent Chrome or Edge. Without it the site falls back to the CSS background.
