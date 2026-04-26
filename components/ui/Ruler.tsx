import React from "react";

/* Ruler sub-components */
export function RulerH({ width }: { width: number }) {
  const ticks = [];
  for (let i = 0; i <= width; i += 50)
    ticks.push(
      <span
        key={i}
        style={{
          position: "absolute",
          left: i,
          fontSize: 9,
          color: "var(--editor-text-muted)",
          bottom: 2,
        }}
      >
        {i}
      </span>,
    );
  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        left: 20,
        right: 0,
        height: 20,
        background: "var(--editor-panel-header)",
        borderBottom: "1px solid var(--editor-border)",
        overflow: "hidden",
      }}
    >
      {ticks}
    </div>
  );
}

export function RulerV({ height }: { height: number }) {
  const ticks = [];
  for (let i = 0; i <= height; i += 50) {
    ticks.push(
      <span
        key={i}
        style={{
          position: "absolute",
          top: i,
          fontSize: 8,
          color: "var(--editor-text-muted)",
          right: 2,
          writingMode: "vertical-rl",
        }}
      >
        {i}
      </span>,
    );
  }
  return (
    <div
      style={{
        position: "absolute",
        top: 20,
        left: 0,
        width: 20,
        bottom: 0,
        background: "var(--editor-panel-header)",
        borderRight: "1px solid var(--editor-border)",
        overflow: "hidden",
      }}
    >
      {ticks}
    </div>
  );
}
