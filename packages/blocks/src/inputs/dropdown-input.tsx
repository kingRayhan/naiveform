import { defaultInputClass } from "./constants";

export interface DropdownInputProps {
  id: string;
  options: string[];
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

export function DropdownInput({
  id,
  options,
  placeholder = "Choose",
  className = defaultInputClass,
  disabled = false,
}: DropdownInputProps) {
  return (
    <select id={id} className={className} disabled={disabled}>
      <option value="">{placeholder}</option>
      {options.map((opt: string, i: number) => (
        <option key={i} value={opt}>
          {opt || `Option ${i + 1}`}
        </option>
      ))}
    </select>
  );
}
