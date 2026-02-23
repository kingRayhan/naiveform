import type { PhoneBlock } from "@repo/types";
import type { UseFormRegister } from "react-hook-form";
import { PhoneIcon } from "./icons";
import { defaultInputClass } from "./constants";

export interface PhoneInputProps {
  block: PhoneBlock;
  register?: UseFormRegister<Record<string, unknown>>;
  error?: { message?: string };
  className?: string;
}

export function PhoneInput({
  block,
  register,
  error,
  className = defaultInputClass,
}: PhoneInputProps) {
  const { id, settings } = block;
  const placeholder = settings?.placeholder ?? "+1 (555) 000-0000";
  const inputClass = `${className} pl-9`;
  const disabled = !register;

  if (disabled) {
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
  return (
    <div className="relative">
      <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2">
        <PhoneIcon />
      </span>
      <input
        id={id}
        type="tel"
        inputMode="tel"
        {...register(id)}
        placeholder={placeholder}
        className={inputClass}
        aria-invalid={!!error}
      />
    </div>
  );
}
