import type { EmailBlock } from "@repo/types";
import type { UseFormRegister } from "react-hook-form";
import { defaultInputClass } from "./constants";

export interface EmailInputProps {
  block: EmailBlock;
  register?: UseFormRegister<Record<string, unknown>>;
  error?: { message?: string };
  className?: string;
}

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function EmailInput({
  block,
  register,
  error,
  className = defaultInputClass,
}: EmailInputProps) {
  const { id, settings } = block;
  const required = settings?.required ?? false;
  const placeholder = settings?.placeholder ?? "you@example.com";
  const minLength = settings?.minLength;
  const maxLength = settings?.maxLength;
  const disabled = !register;

  if (disabled) {
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
  const validate = (value: unknown) => {
    const val = typeof value === "string" ? value : Array.isArray(value) ? value[0] ?? "" : "";
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
