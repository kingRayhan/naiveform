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
  const placeholder = settings?.placeholder ?? "Your answer";
  const rows = settings?.rows ?? 3;
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
      {...register(id)}
      className={className}
      aria-invalid={!!error}
    />
  );
}
