import type { NumberBlock } from "@repo/types";
import type { UseFormRegister } from "react-hook-form";
import { defaultInputClass } from "./constants";

export interface NumberInputProps {
  block: NumberBlock;
  register?: UseFormRegister<Record<string, unknown>>;
  error?: { message?: string };
  className?: string;
}

export function NumberInput({
  block,
  register,
  error,
  className = defaultInputClass,
}: NumberInputProps) {
  const { id, settings } = block;
  const placeholder = settings?.placeholder;
  const min = settings?.min;
  const max = settings?.max;
  const step = settings?.step;
  const disabled = !register;

  if (disabled) {
    return (
      <input
        id={id}
        type="number"
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
      type="number"
      {...register(id)}
      placeholder={placeholder}
      min={min}
      max={max}
      step={step}
      className={className}
      aria-invalid={!!error}
    />
  );
}
