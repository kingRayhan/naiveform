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
  const required = settings?.required ?? false;
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
      {...register(id, {
        required: required ? "This field is required" : false,
        min:
          min != null
            ? { value: min, message: `Minimum value is ${min}` }
            : undefined,
        max:
          max != null
            ? { value: max, message: `Maximum value is ${max}` }
            : undefined,
      })}
      placeholder={placeholder}
      min={min}
      max={max}
      step={step}
      className={className}
      aria-invalid={!!error}
    />
  );
}
