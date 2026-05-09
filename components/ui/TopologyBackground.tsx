"use client";

import { useEffect, useRef } from "react";

// Perlin noise
const P: number[] = Array.from({ length: 256 }, (_, i) => i);
for (let i = 255; i > 0; i--) {
  const j = Math.floor(Math.random() * (i + 1));
  [P[i], P[j]] = [P[j], P[i]];
}
const PERM = [...P, ...P];

function fade(t: number) {
  return t * t * t * (t * (t * 6 - 15) + 10);
}
function lerp(a: number, b: number, t: number) {
  return a + t * (b - a);
}
function grad(h: number, x: number, y: number, z: number) {
  const u = h < 8 ? x : y;
  const v = h < 4 ? y : h === 12 || h === 14 ? x : z;
  return (h & 1 ? -u : u) + (h & 2 ? -v : v);
}
function noise(x: number, y: number, z = 0): number {
  const X = Math.floor(x) & 255;
  const Y = Math.floor(y) & 255;
  const Z = Math.floor(z) & 255;
  x -= Math.floor(x);
  y -= Math.floor(y);
  z -= Math.floor(z);
  const u = fade(x),
    v = fade(y),
    w = fade(z);
  const A = PERM[X] + Y,
    AA = PERM[A] + Z,
    AB = PERM[A + 1] + Z;
  const B = PERM[X + 1] + Y,
    BA = PERM[B] + Z,
    BB = PERM[B + 1] + Z;
  return lerp(
    lerp(
      lerp(grad(PERM[AA], x, y, z), grad(PERM[BA], x - 1, y, z), u),
      lerp(grad(PERM[AB], x, y - 1, z), grad(PERM[BB], x - 1, y - 1, z), u),
      v,
    ),
    lerp(
      lerp(
        grad(PERM[AA + 1], x, y, z - 1),
        grad(PERM[BA + 1], x - 1, y, z - 1),
        u,
      ),
      lerp(
        grad(PERM[AB + 1], x, y - 1, z - 1),
        grad(PERM[BB + 1], x - 1, y - 1, z - 1),
        u,
      ),
      v,
    ),
    w,
  );
}

// Config
const PARTICLE_COUNT = 2500;
const CELL_SIZE = 15;
const PARTICLE_SPEED = 2.2;
const STROKE_COLOR = `rgba(113, 113, 122, 0.05)`; // zinc-500
const BG_COLOR = "#09090b"; // zinc-950

// Types
interface Particle {
  x: number;
  y: number;
  px: number;
  py: number;
  vx: number;
  vy: number;
}

interface Cell {
  vx: number;
  vy: number;
}

export default function TopologyBackground() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const canvas = document.createElement("canvas");
    Object.assign(canvas.style, {
      position: "absolute",
      inset: "0",
      width: "100%",
      height: "100%",
      pointerEvents: "none",
      display: "block",
    });
    container.appendChild(canvas);

    const ctx = canvas.getContext("2d");
    if (!ctx) {
      container.removeChild(canvas);
      return;
    }

    const dpr = Math.min(window.devicePixelRatio, 1.5);
    let W = 0,
      H = 0;
    let field: Cell[][] = [];
    let particles: Particle[] = [];

    // Vector field
    function buildField() {
      const cols = Math.ceil((W + 200) / CELL_SIZE);
      const rows = Math.ceil((H + 200) / CELL_SIZE);
      const TAU = Math.PI * 2;
      field = [];

      for (let r = 0; r < rows; r++) {
        field[r] = [];
        for (let c = 0; c < cols; c++) {
          const nx = 0.003 * c;
          const ny = 0.003 * r;
          let maxN = 0,
            minN = 1;
          let hx = 0,
            hy = 0,
            lx = 0,
            ly = 0;

          for (let k = 0; k < 20; k++) {
            const angle = (k / 20) * TAU;
            const px = nx + Math.cos(angle) * 0.1;
            const py = ny + Math.sin(angle) * 0.1;
            const n = (noise(px, py) + 1) / 2;
            if (n > maxN) {
              maxN = n;
              hx = px;
              hy = py;
            }
            if (n < minN) {
              minN = n;
              lx = px;
              ly = py;
            }
          }

          const dvx = lx - hx,
            dvy = ly - hy;
          const len = Math.sqrt(dvx * dvx + dvy * dvy) || 1;
          field[r][c] = {
            vx: (dvx / len) * (maxN - minN),
            vy: (dvy / len) * (maxN - minN),
          };
        }
      }
    }

    // Particles
    function spawnParticles() {
      particles = Array.from({ length: PARTICLE_COUNT }, () => {
        const x = Math.random() * (W + 200);
        const y = Math.random() * (H + 200);
        return { x, y, px: x, py: y, vx: 0, vy: 0 };
      });
    }

    // Resize
    function resize() {
      if (!container || !ctx) return;
      W = container.offsetWidth;
      H = container.offsetHeight;
      canvas.width = W * dpr;
      canvas.height = H * dpr;
      canvas.style.width = `${W}px`;
      canvas.style.height = `${H}px`;
      ctx.scale(dpr, dpr);
      ctx.fillStyle = BG_COLOR;
      ctx.fillRect(0, 0, W, H);
      buildField();
      spawnParticles();
    }

    resize();
    window.addEventListener("resize", resize, { passive: true });

    // Helpers
    function wrap(v: number, max: number) {
      return ((v % max) + max) % max;
    }

    // Animation
    let raf: number;

    function draw() {
      raf = requestAnimationFrame(draw);
      if (!ctx) return;
      ctx.save();
      ctx.translate(-100, -100);
      ctx.strokeStyle = STROKE_COLOR;
      ctx.lineWidth = 1;

      for (const p of particles) {
        const cx = Math.floor(Math.min(Math.max(p.x, 0), W + 199) / CELL_SIZE);
        const cy = Math.floor(Math.min(Math.max(p.y, 0), H + 199) / CELL_SIZE);
        const cell = field[cy]?.[cx];
        if (!cell) continue;

        p.px = p.x;
        p.py = p.y;

        p.vx += cell.vx * 3;
        p.vy += cell.vy * 3;

        const speed = Math.sqrt(p.vx * p.vx + p.vy * p.vy) || 1;
        p.vx = (p.vx / speed) * PARTICLE_SPEED;
        p.vy = (p.vy / speed) * PARTICLE_SPEED;

        p.x = wrap(p.x + p.vx, W + 200);
        p.y = wrap(p.y + p.vy, H + 200);

        const dx = p.px - p.x,
          dy = p.py - p.y;
        if (dx * dx + dy * dy < 100) {
          ctx.beginPath();
          ctx.moveTo(p.px, p.py);
          ctx.lineTo(p.x, p.y);
          ctx.stroke();
        }
      }

      ctx.restore();
    }

    draw();

    // Cleanup
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      if (canvas.parentNode) canvas.parentNode.removeChild(canvas);
    };
  }, []);

  return (
    <div ref={containerRef} className="absolute inset-0 overflow-hidden" />
  );
}
