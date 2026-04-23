import { cn } from "@/utils";

interface SliderProps {
  label?: string;
  min: number;
  max: number;
  value: number;
  onChange: (value: number) => void;
  showValue?: boolean;
  gradient?: string;
  className?: string;
  step?: number;
}

export function Slider({
  label,
  min,
  max,
  value,
  onChange,
  showValue = true,
  gradient,
  className,
  step = 1,
}: SliderProps) {
  return (
    <div className={cn("flex items-center gap-1.5", className)}>
      {label && (
        <span className="w-3 text-[10px] text-editor-text-muted flex-shrink-0">
          {label}
        </span>
      )}

      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        style={gradient ? { background: gradient } : undefined}
        className="flex-1"
      />

      {showValue && (
        <span className="w-7 text-[10px] text-editor-text-muted text-right flex-shrink-0">
          {value}
        </span>
      )}
    </div>
  );
}
