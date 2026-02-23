import type { UrlBlock } from "@repo/types";
import type { UseFormRegister } from "react-hook-form";
import { UrlIcon } from "./icons";
import { defaultInputClass } from "./constants";

export interface UrlInputProps {
  block: UrlBlock;
  register?: UseFormRegister<Record<string, unknown>>;
  error?: { message?: string };
  className?: string;
}

export function UrlInput({
  block,
  register,
  error,
  className = defaultInputClass,
}: UrlInputProps) {
  const { id, settings } = block;
  const required = settings?.required ?? false;
  const placeholder = settings?.placeholder ?? "Your answer";
  const minLength = settings?.minLength;
  const maxLength = settings?.maxLength;
  const inputClass = `${className} pl-9`;
  const disabled = !register;

  if (disabled) {
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
