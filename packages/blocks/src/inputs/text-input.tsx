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
      {...register(id)}
      placeholder={placeholder}
      minLength={minLength}
      maxLength={maxLength}
      className={className}
      aria-invalid={!!error}
    />
  );
}
