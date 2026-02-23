import type { UseFormRegister } from "react-hook-form";
import { UrlIcon } from "./icons";
import { defaultInputClass } from "./constants";

export interface UrlInputProps {
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

export function UrlInput({
  id,
  register,
  required = false,
  error,
  placeholder = "Your answer",
  minLength,
  maxLength,
  className = defaultInputClass,
  disabled = false,
}: UrlInputProps) {
  const inputClass = `${className} pl-9`;
  if (disabled || !register) {
    return (
      <div className="relative">
        <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2">
          <UrlIcon />
        </span>
        <input
          id={id}
          type="url"
          placeholder={placeholder}
          className={inputClass}
          disabled
          readOnly
        />
      </div>
    );
  }
  return (
    <div className="relative">
      <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2">
        <UrlIcon />
      </span>
      <input
        id={id}
        type="url"
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
        className={inputClass}
        aria-invalid={!!error}
      />
    </div>
  );
}
