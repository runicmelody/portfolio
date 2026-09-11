"use client";

import { useEffect, useRef } from "react";
import dungeonWgsl from "./dungeon.wgsl";

/**
 * Fixed, full-viewport animated WebGPU background — dark dungeon:
 * rising ember sparks, forge glow and drifting magic dust.
 * Falls back silently to the CSS gradient in globals.css when
 * WebGPU is unavailable (the canvas is hidden).
 */
export default function DungeonBackground() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    let disposed = false;
    let stopLoop: (() => void) | undefined;

    async function boot() {
      const canvas = canvasRef.current;
      if (!canvas) return;

      try {
        const vgpu = await import("vgpu");
        if (disposed) return;

        const gpu = await vgpu.init();
        if (disposed) {
          gpu.dispose();
          return;
        }

        const canvasSurface = vgpu.surface(gpu, canvas, {
          dpr: [1, 1.5],
        });

        const shader = vgpu.effect(gpu, dungeonWgsl, {
          set: { params: { time: 0, resolution: canvasSurface.size } },
        });

        const gpuClock = vgpu.clock(gpu);

        const handle = vgpu.frameLoop(gpu, (frame) => {
          if (disposed) return;
          shader.set({
            params: {
              time: gpuClock.time,
              resolution: canvasSurface.size,
            },
          });
          frame.pass({ target: canvasSurface, clear: [0, 0, 0, 1] }, (pass) => {
            pass.draw(shader);
          });
        });
        stopLoop = () => handle.stop();
      } catch {
        // WebGPU missing or init failed -> CSS fallback stays visible
        canvas.style.display = "none";
      }
    }

    void boot();

    return () => {
      disposed = true;
      stopLoop?.();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-10 h-full w-full"
    />
  );
}
