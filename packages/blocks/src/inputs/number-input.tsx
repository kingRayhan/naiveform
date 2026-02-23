import { defaultInputClass } from "./constants";

export interface NumberInputProps {
  id: string;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

export function NumberInput({
  id,
  placeholder,
  className = defaultInputClass,
  disabled = false,
}: NumberInputProps) {
  return (
    <input
      id={id}
      type="number"
      placeholder={placeholder}
      className={className}
      disabled={disabled}
      readOnly={disabled}
    />
  );
}
