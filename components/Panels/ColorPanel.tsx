"use client";

import { useEditorStore } from "@/store/useEditorStore";
import { hexToRgb, rgbToCss, rgbToHex } from "@/utils/color";
import { useState } from "react";

const SWATCHES = [
  "#000000",
  "#1a1a1a",
  "#333333",
  "#4d4d4d",
  "#666666",
  "#808080",
  "#999999",
  "#b3b3b3",
  "#cccccc",
  "#ffffff",
  "#ff0000",
  "#ff4000",
  "#ff8000",
  "#ffbf00",
  "#ffff00",
  "#80ff00",
  "#00ff00",
  "#00ff80",
  "#00ffff",
  "#0080ff",
  "#0000ff",
  "#8000ff",
  "#ff00ff",
  "#ff0080",
  "#800000",
  "#804000",
  "#808000",
  "#008000",
  "#008080",
  "#000080",
  "#ff9999",
  "#ffcc99",
  "#ffff99",
  "#ccff99",
  "#99ffcc",
  "#99ccff",
  "#cc99ff",
  "#ff99cc",
  "#c8a882",
  "#6b4226",
];

function PanelSection({
  title,
  children,
  defaultOpen = true,
}: {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="border-b border-editor-border flex-shrink-0">
      <button
        onClick={() => setOpen(!open)}
        className="w-full h-[26px] flex items-center justify-between px-2.5 bg-editor-panelHeader border-b border-editor-border hover:bg-editor-hover transition-colors"
      >
        <span className="text-[11px] font-semibold uppercase tracking-wide text-editor-textMuted">
          {title}
        </span>
        <span className="text-[10px] text-editor-textMuted">
          {open ? "▾" : "▸"}
        </span>
      </button>
      {open && <div className="p-2.5">{children}</div>}
    </div>
  );
}

const ColorPanel = () => {
  const { fgColor, bgColor, setFgColor, setBgColor, swapColors } =
    useEditorStore();
  const [hexInput, setHexInput] = useState(rgbToHex(fgColor));
  const [editingBg, setEditingBg] = useState(false);

  const activeColor = editingBg ? bgColor : fgColor;
  const setActive = editingBg ? setBgColor : setFgColor;

  function handleSlider(channel: "r" | "g" | "b", value: number) {
    const next = { ...activeColor, [channel]: value };
    setActive(next);
    setHexInput(rgbToHex(next));
  }

  function handleHex(raw: string) {
    setHexInput(raw);
    const parsed = hexToRgb(raw);
    if (parsed) setActive(parsed);
  }

  const sliders: { label: string; key: "r" | "g" | "b"; grad: string }[] = [
    {
      label: "R",
      key: "r",
      grad: `linear-gradient(to right, rgb(0,${activeColor.g},${activeColor.b}), rgb(255,${activeColor.g},${activeColor.b}))`,
    },
    {
      label: "G",
      key: "g",
      grad: `linear-gradient(to right, rgb(${activeColor.r},0,${activeColor.b}), rgb(${activeColor.r},255,${activeColor.b}))`,
    },
    {
      label: "B",
      key: "b",
      grad: `linear-gradient(to right, rgb(${activeColor.r},${activeColor.g},0), rgb(${activeColor.r},${activeColor.g},255))`,
    },
  ];

  return (
    <>
      <PanelSection title="Color">
        {/* FG / BG swatches */}
        <div className="flex items-start gap-2 mb-2">
          <div
            className="relative w-12 h-12 flex-shrink-0 cursor-pointer"
            onClick={swapColors}
            title="Click to swap"
          >
            {/* BG swatch */}
            <div
              className={`absolute bottom-0 right-0 w-8 h-8 border-2 cursor-pointer ${editingBg ? "border-white" : "border-[#555]"}`}
              style={{ background: rgbToCss(bgColor) }}
              onClick={(e) => {
                e.stopPropagation();
                setEditingBg(true);
                setHexInput(rgbToHex(bgColor));
              }}
            />
            {/* FG swatch */}
            <div
              className={`absolute top-0 left-0 w-8 h-8 border-2 z-10 cursor-pointer ${!editingBg ? "border-white" : "border-[#555]"}`}
              style={{ background: rgbToCss(fgColor) }}
              onClick={(e) => {
                e.stopPropagation();
                setEditingBg(false);
                setHexInput(rgbToHex(fgColor));
              }}
            />
            <span className="absolute bottom-0 left-0 text-[8px] text-editor-textMuted leading-none z-20">
              ↺
            </span>
          </div>

          {/* Sliders */}
          <div className="flex-1 space-y-1">
            {sliders.map(({ label, key, grad }) => (
              <div key={key} className="flex items-center gap-1.5">
                <span className="w-2.5 text-[10px] text-editor-textMuted">
                  {label}
                </span>
                <input
                  type="range"
                  min={0}
                  max={255}
                  value={activeColor[key]}
                  onChange={(e) => handleSlider(key, Number(e.target.value))}
                  style={{ background: grad }}
                  className="flex-1 h-1.5"
                />
                <span className="w-7 text-[10px] text-editor-textMuted text-right">
                  {activeColor[key]}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Hex input */}
        <div className="flex items-center gap-1.5">
          <span className="text-[10px] text-editor-textMuted">#</span>
          <input
            value={hexInput}
            onChange={(e) => handleHex(e.target.value)}
            maxLength={6}
            className="flex-1 bg-[#1e1e1e] border border-editor-borderLight text-editor-textPrimary px-1.5 py-0.5 text-[11px] font-mono outline-none focus:border-editor-active"
            placeholder="000000"
          />
          {/* Preview dot */}
          <div
            className="w-5 h-5 border border-editor-borderLight"
            style={{ background: rgbToCss(activeColor) }}
          />
        </div>
      </PanelSection>

      <PanelSection title="Swatches">
        <div className="grid grid-cols-10 gap-0.5">
          {SWATCHES.map((color) => (
            <button
              key={color}
              title={color}
              className="aspect-square w-full border border-transparent hover:border-white hover:scale-110 transition-transform"
              style={{ background: color }}
              onClick={() => {
                const rgb = hexToRgb(color.replace("#", ""));
                if (rgb) {
                  setActive(rgb);
                  setHexInput(color.replace("#", "").toUpperCase());
                }
              }}
            />
          ))}
        </div>
      </PanelSection>
    </>
  );
};

export default ColorPanel;
