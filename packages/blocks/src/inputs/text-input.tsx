import type { TextBlock } from "@repo/types";
import type { UseFormRegister } from "react-hook-form";
import { defaultInputClass } from "./constants";

export interface TextInputProps {
  block: TextBlock;
  register?: UseFormRegister<Record<string, unknown>>;
  error?: { message?: string };
  className?: string;
}

export function TextInput({
  block,
  register,
  error,
  className = defaultInputClass,
}: TextInputProps) {
  const { id, settings } = block;
  const required = settings?.required ?? false;
  const placeholder = settings?.placeholder ?? "Your answer";
  const minLength = settings?.minLength;
  const maxLength = settings?.maxLength;
  const disabled = !register;

  if (disabled) {
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
