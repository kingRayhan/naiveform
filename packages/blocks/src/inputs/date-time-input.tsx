import { defaultInputClass } from "./constants";

export interface DateTimeInputProps {
  id: string;
  type: "date" | "time" | "datetime";
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

export function DateTimeInput({
  id,
  type,
  placeholder,
  className = defaultInputClass,
  disabled = false,
}: DateTimeInputProps) {
  const inputType = type === "datetime" ? "datetime-local" : type;
  return (
    <input
      id={id}
      type={inputType}
      placeholder={placeholder}
      className={className}
      disabled={disabled}
    />
  );
}
