import { cn } from "@/utils";

interface NumberInputProps {
  value: number;
  min?: number;
  max?: number;
  step?: number;
  onChange: (value: number) => void;
  suffix?: string;
  className?: string;
}

export function NumberInput({
  value,
  min,
  max,
  step,
  onChange,
  suffix,
  className,
}: NumberInputProps) {
  return (
    <div className="flex items-center gap-1">
      <input
        type="number"
        value={value}
        min={min}
        max={max}
        step={step}
        onChange={(e) => onChange(Number(e.target.value))}
        className={cn("editor-input w-14 text-center", className)}
      />
      {suffix && (
        <span className="text-[10px] text-editor-text-muted">{suffix}</span>
      )}
    </div>
  );
}
