import { defaultInputClass } from "./constants";

export interface LongTextInputProps {
  id: string;
  placeholder?: string;
  rows?: number;
  className?: string;
  disabled?: boolean;
}

export function LongTextInput({
  id,
  placeholder = "Your answer",
  rows = 3,
  className = defaultInputClass,
  disabled = false,
}: LongTextInputProps) {
  return (
    <textarea
      id={id}
      rows={rows}
      placeholder={placeholder}
      className={className}
      disabled={disabled}
      readOnly={disabled}
    />
  );
}
