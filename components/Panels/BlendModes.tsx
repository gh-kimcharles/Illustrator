import { BlendMode } from "@/types";
import {
  color,
  colorBurn,
  colorDodge,
  darken,
  exclusion,
  hardLight,
  hue,
  lighten,
  luminosity,
  multiply,
  normal,
  overlay,
  saturation,
  softLight,
  screen,
  difference,
} from "../../lib/blend";

export interface BlendModeDescriptor {
  value: BlendMode;
  label: string;
  group: BlendModeGroup;
}

export type BlendModeGroup =
  | "Normal"
  | "Darken"
  | "Lighten"
  | "Contrast"
  | "Difference"
  | "Component";

// all registered modes in render order (bottom to top)
const ALL_MODES: BlendModeDescriptor[] = [
  // Normal
  normal,
  // Darken
  multiply,
  darken,
  colorBurn,
  // Lighten
  screen,
  lighten,
  colorDodge,
  // Contrast
  overlay,
  softLight,
  hardLight,
  // Difference
  difference,
  exclusion,
  // Component
  hue,
  saturation,
  color,
  luminosity,
];

// group order for the dropdown
const GROUP_ORDER: BlendModeGroup[] = [
  "Normal",
  "Darken",
  "Lighten",
  "Contrast",
  "Difference",
  "Component",
];

export interface BlendModeGroupEntry {
  group: BlendModeGroup;
  modes: BlendModeDescriptor[];
}

// builds the grouped structure consumed by the Select dropdown
export const FlatBlendModes = (): BlendModeDescriptor[] => {
  return ALL_MODES;
};

// flat list for cases that don't need grouping
export const GroupedBlendModes = (): BlendModeGroupEntry[] => {
  return GROUP_ORDER.reduce<BlendModeGroupEntry[]>((acc, group) => {
    const modes = ALL_MODES.filter((m) => m.group === group);
    if (modes.length > 0) acc.push({ group, modes });
    return acc;
  }, []);
};
