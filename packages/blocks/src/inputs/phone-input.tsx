import type { UseFormRegister } from "react-hook-form";
import { PhoneIcon } from "./icons";
import { defaultInputClass } from "./constants";

export interface PhoneInputProps {
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

const phoneRegex = /^[\d\s\-+()]{10,}$/;

export function PhoneInput({
  id,
  register,
  required = false,
  error,
  placeholder = "+1 (555) 000-0000",
  minLength,
  maxLength,
  className = defaultInputClass,
  disabled = false,
}: PhoneInputProps) {
  const inputClass = `${className} pl-9`;
  if (disabled || !register) {
    return (
      <div className="relative">
        <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2">
          <PhoneIcon />
        </span>
        <input
          id={id}
          type="tel"
          placeholder={placeholder}
          className={inputClass}
          disabled
          readOnly
        />
      </div>
    );
  }
  const validate = (v: string | string[]) => {
    const val = typeof v === "string" ? v : "";
    if (!val && !required) return true;
    if (required && !val) return "This field is required";
    if (!phoneRegex.test(val)) return "Please enter a valid phone number";
    if (minLength != null && val.length < minLength)
      return `At least ${minLength} characters`;
    if (maxLength != null && val.length > maxLength)
      return `At most ${maxLength} characters`;
    return true;
  };

  return (
    <div className="relative">
      <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2">
        <PhoneIcon />
      </span>
      <input
        id={id}
        type="tel"
        inputMode="tel"
        {...register(id, {
          required: required ? "This field is required" : false,
          validate,
          minLength,
          maxLength,
        })}
        placeholder={placeholder}
        minLength={minLength}
        maxLength={maxLength}
        className={inputClass}
        aria-invalid={!!error}
      />
    </div>
  );
}
