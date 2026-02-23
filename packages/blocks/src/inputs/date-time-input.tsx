import type { DateBlock, DateTimeBlock, TimeBlock } from "@repo/types";
import type { UseFormRegister } from "react-hook-form";
import { defaultInputClass } from "./constants";

export type DateTimeBlockUnion = DateBlock | TimeBlock | DateTimeBlock;

export interface DateTimeInputProps {
  block: DateTimeBlockUnion;
  register?: UseFormRegister<Record<string, unknown>>;
  error?: { message?: string };
  className?: string;
}

export function DateTimeInput({
  block,
  register,
  error,
  className = defaultInputClass,
}: DateTimeInputProps) {
  const { id, type } = block;
  const inputType = type === "datetime" ? "datetime-local" : type;
  const settings = block.settings as { minDate?: string; maxDate?: string } | undefined;
  const min = type !== "time" ? settings?.minDate : undefined;
  const max = type !== "time" ? settings?.maxDate : undefined;
  const disabled = !register;

  if (disabled) {
    return (
      <input
        id={id}
        type={inputType}
        className={className}
        disabled
      />
    );
  }
  return (
    <input
      id={id}
      type={inputType}
      {...register(id)}
      min={min}
      max={max}
      className={className}
      aria-invalid={!!error}
    />
  );
}
