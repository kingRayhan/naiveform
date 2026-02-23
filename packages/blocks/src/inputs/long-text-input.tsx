import type { LongTextBlock } from "@repo/types";
import type { UseFormRegister } from "react-hook-form";
import { defaultInputClass } from "./constants";

export interface LongTextInputProps {
  block: LongTextBlock;
  register?: UseFormRegister<Record<string, unknown>>;
  error?: { message?: string };
  className?: string;
}

export function LongTextInput({
  block,
  register,
  error,
  className = defaultInputClass,
}: LongTextInputProps) {
  const { id, settings } = block;
  const required = settings?.required ?? false;
  const placeholder = settings?.placeholder ?? "Your answer";
  const rows = settings?.rows ?? 3;
  const minLength = settings?.minLength;
  const maxLength = settings?.maxLength;
  const disabled = !register;

  if (disabled) {
    return (
      <textarea
        id={id}
        rows={rows}
        placeholder={placeholder}
        className={className}
        disabled
        readOnly
      />
    );
  }
  return (
    <textarea
      id={id}
      rows={rows}
      placeholder={placeholder}
      {...register(id, {
        required: required ? "This field is required" : false,
        minLength: minLength
          ? { value: minLength, message: `At least ${minLength} characters` }
          : undefined,
        maxLength: maxLength
          ? { value: maxLength, message: `At most ${maxLength} characters` }
          : undefined,
      })}
      className={className}
      aria-invalid={!!error}
    />
  );
}
