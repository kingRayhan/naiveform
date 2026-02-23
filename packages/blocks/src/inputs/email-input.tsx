import type { UseFormRegister } from "react-hook-form";
import { defaultInputClass } from "./constants";

export interface EmailInputProps {
  id: string;
  register?: UseFormRegister<Record<string, unknown>>;
  required?: boolean;
  error?: { message?: string };
  placeholder?: string;
  minLength?: number;
  maxLength?: number;
  className?: string;
  disabled?: boolean;
}

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function EmailInput({
  id,
  register,
  required = false,
  error,
  placeholder = "you@example.com",
  minLength,
  maxLength,
  className = defaultInputClass,
  disabled = false,
}: EmailInputProps) {
  if (disabled || !register) {
    return (
      <input
        id={id}
        type="email"
        placeholder={placeholder}
        className={className}
        disabled
        readOnly
      />
    );
  }
  const validate = (v: string | string[]) => {
    const val = typeof v === "string" ? v : "";
    if (!val && !required) return true;
    if (required && !val) return "This field is required";
    if (!emailRegex.test(val)) return "Please enter a valid email address";
    if (minLength != null && val.length < minLength)
      return `At least ${minLength} characters`;
    if (maxLength != null && val.length > maxLength)
      return `At most ${maxLength} characters`;
    return true;
  };

  return (
    <input
      id={id}
      type="email"
      {...register(id, { required: required ? "This field is required" : false, validate, minLength, maxLength })}
      placeholder={placeholder}
      minLength={minLength}
      maxLength={maxLength}
      className={className}
      aria-invalid={!!error}
    />
  );
}
