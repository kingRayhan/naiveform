import type { EmailBlock } from "@repo/types";
import type { UseFormRegister } from "react-hook-form";
import { defaultInputClass } from "./constants";

export interface EmailInputProps {
  block: EmailBlock;
  register?: UseFormRegister<Record<string, unknown>>;
  error?: { message?: string };
  className?: string;
}

export function EmailInput({
  block,
  register,
  error,
  className = defaultInputClass,
}: EmailInputProps) {
  const { id, settings } = block;
  const placeholder = settings?.placeholder ?? "you@example.com";
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
  return (
    <input
      id={id}
      type="email"
      {...register(id)}
      placeholder={placeholder}
      className={className}
      aria-invalid={!!error}
    />
  );
}
