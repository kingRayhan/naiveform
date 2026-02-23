import type { UseFormRegister } from "react-hook-form";
import { defaultInputClass } from "./constants";

export interface TextInputProps {
  id: string;
  register?: UseFormRegister<Record<string, unknown>>;
  required?: boolean;
  error?: { message?: string };
  placeholder?: string;
  minLength?: number;
  maxLength?: number;
  className?: string;
  /** When true, renders a disabled read-only input (e.g. for preview). */
  disabled?: boolean;
}

export function TextInput({
  id,
  register,
  required = false,
  error,
  placeholder = "Your answer",
  minLength,
  maxLength,
  className = defaultInputClass,
  disabled = false,
}: TextInputProps) {
  if (disabled || !register) {
    return (
      <input
        id={id}
        type="text"
        placeholder={placeholder}
        className={className}
        disabled
        readOnly
      />
    );
  }
  return (
    <input
      id={id}
      type="text"
      {...register(id, {
        required: required ? "This field is required" : false,
        minLength: minLength
          ? { value: minLength, message: `At least ${minLength} characters` }
          : undefined,
        maxLength: maxLength
          ? { value: maxLength, message: `At most ${maxLength} characters` }
          : undefined,
      })}
      placeholder={placeholder}
      minLength={minLength}
      maxLength={maxLength}
      className={className}
      aria-invalid={!!error}
    />
  );
}
