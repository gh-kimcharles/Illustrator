"use client";

import { useEffect, useRef } from "react";

export default function TopologyBackground() {
  const containerRef = useRef<HTMLDivElement>(null);
  const effectRef = useRef<{ destroy: () => void } | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let mounted = true;

    Promise.all([import("p5"), import("vanta/dist/vanta.topology.min")]).then(
      ([p5Module, vantaModule]) => {
        if (!mounted || !containerRef.current) return;

        // silence vanta's warning about missing THREE; no harm since topology uses p5, not three.js
        if (typeof window !== "undefined" && !("THREE" in window)) {
          (window as Window & { THREE?: unknown }).THREE = {};
        }

        effectRef.current = vantaModule.default({
          el: containerRef.current,
          p5: p5Module.default,
          backgroundColor: 0x09090b,
          color: 0x71717a,
          mouseControls: true,
          touchControls: true,
          gyroControls: false,
          minHeight: 200,
          minWidth: 200,
          scale: 1,
          scaleMobile: 1,
          speed: 2,
        });
      },
    );

    return () => {
      mounted = false;
      effectRef.current?.destroy();
      effectRef.current = null;
    };
  }, []);

  return (
    <div ref={containerRef} className="absolute inset-0 overflow-hidden" />
  );
}
