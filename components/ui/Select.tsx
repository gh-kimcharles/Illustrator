import { cn } from "@/utils";

interface SelectOption<T extends string> {
  value: T;
  label: string;
}

interface SelectGroup<T extends string> {
  group: string;
  modes: SelectOption<T>[];
}

interface SelectProps<T extends string> {
  value: T;
  onChange: (value: T) => void;
  // flat list
  options?: SelectOption<T>[];
  // group list
  groups?: SelectGroup<T>[];
  className?: string;
}
export function Select<T extends string>({
  value,
  onChange,
  options,
  groups,
  className,
}: SelectProps<T>) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value as T)}
      className={cn(
        "editor-input w-full appearance-none cursor-pointer",
        className,
      )}
    >
      {/* Group rendering */}
      {groups?.map(({ group, modes }) => (
        <optgroup key={group} label={group}>
          {modes.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </optgroup>
      ))}

      {/* Flat rendering */}
      {!groups &&
        options?.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
    </select>
  );
}
