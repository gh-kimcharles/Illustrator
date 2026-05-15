"use client";

import { useState } from "react";
import { Panel } from "@/components/ui";
import {
  BrightnessContrast,
  HueSaturation,
  Levels,
  Invert,
  Grayscale,
  Blur,
  Sharpen,
  Posterize,
  Vibrance,
  Curves,
} from "./adjustments";
import {
  BlackAndWhiteIcon,
  BlurIcon,
  BrightnessContrastIcon,
  CurvesIcon,
  HueSaturationIcon,
  InvertIcon,
  LevelsIcon,
  PosterizeIcon,
  SharpenIcon,
  VibranceIcon,
} from "@/assets/icons/adjustments";

type OpenModal =
  | "brightness"
  | "hue"
  | "levels"
  | "invert"
  | "grayscale"
  | "blur"
  | "sharpen"
  | "vibrance"
  | "posterize"
  | "curves"
  | null;

const ADJUSTMENTS: {
  icon: React.ReactNode;
  label: string;
  id: OpenModal;
}[] = [
  { icon: <BrightnessContrastIcon />, label: "B/C", id: "brightness" },
  { icon: <HueSaturationIcon />, label: "Hue/Sat", id: "hue" },
  { icon: <LevelsIcon />, label: "Levels", id: "levels" },
  { icon: <CurvesIcon />, label: "Curves", id: "curves" },
  { icon: <VibranceIcon />, label: "Vibrance", id: "vibrance" },
  { icon: <PosterizeIcon />, label: "Posterize", id: "posterize" },
  { icon: <InvertIcon />, label: "Invert", id: "invert" },
  { icon: <BlackAndWhiteIcon />, label: "B&W", id: "grayscale" },
  { icon: <BlurIcon />, label: "Blur", id: "blur" },
  { icon: <SharpenIcon />, label: "Sharpen", id: "sharpen" },
];

const AdjustmentsPanel = () => {
  const [openModal, setOpenModal] = useState<OpenModal>(null);

  function close() {
    setOpenModal(null);
  }

  return (
    <>
      <Panel title="Adjustments">
        <p className="text-[10px] text-editor-text-muted mb-2">
          Add an adjustment
        </p>
        <div className="grid grid-cols-5 gap-1">
          {ADJUSTMENTS.map((adj) => (
            <button
              key={adj.label}
              title={adj.id ? adj.label : `${adj.label} — coming in Phase 5`}
              disabled={adj.id === null}
              onClick={() => adj.id && setOpenModal(adj.id)}
              className="
                flex flex-col items-center gap-0.5
                bg-editor-input-bg border border-editor-border-light
                text-editor-text-muted px-1 py-1.5 text-[9px]
                hover:bg-editor-hover hover:text-editor-text
                disabled:opacity-40 disabled:cursor-not-allowed
                transition-colors
              "
            >
              <span className="text-sm leading-none">{adj.icon}</span>
              <span className="leading-tight text-center">{adj.label}</span>
            </button>
          ))}
        </div>
      </Panel>

      {/* modals */}
      {openModal === "brightness" && <BrightnessContrast onClose={close} />}
      {openModal === "hue" && <HueSaturation onClose={close} />}
      {openModal === "levels" && <Levels onClose={close} />}
      {openModal === "invert" && <Invert onClose={close} />}
      {openModal === "grayscale" && <Grayscale onClose={close} />}
      {openModal === "blur" && <Blur onClose={close} />}
      {openModal === "sharpen" && <Sharpen onClose={close} />}
      {openModal === "posterize" && <Posterize onClose={close} />}
      {openModal === "vibrance" && <Vibrance onClose={close} />}
      {openModal === "curves" && <Curves onClose={close} />}
    </>
  );
};

export default AdjustmentsPanel;
