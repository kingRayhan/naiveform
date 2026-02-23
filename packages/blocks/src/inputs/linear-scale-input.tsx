import type { LinearScaleBlock } from "@repo/types";
import type { UseFormRegister } from "react-hook-form";
import { defaultInputClass } from "./constants";

export interface LinearScaleInputProps {
  block: LinearScaleBlock;
  register?: UseFormRegister<Record<string, unknown>>;
  error?: { message?: string };
  className?: string;
}

export function LinearScaleInput({
  block,
  register,
  error,
  className,
}: LinearScaleInputProps) {
  const { id, settings } = block;
  const min = settings.min;
  const max = settings.max;
  const minLabel = settings.minLabel;
  const maxLabel = settings.maxLabel;
  const required = settings.required ?? false;
  const scaleClass = className ?? `${defaultInputClass} w-20`;
  const disabled = !register;

  if (disabled) {
    return (
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <span>{minLabel ?? min}</span>
        <span>—</span>
        <span>{maxLabel ?? max}</span>
      </div>
    );
  }

  return (
    <div
      className="flex items-center gap-2 flex-wrap"
      role="group"
    >
      <span className="text-sm text-muted-foreground">
        {minLabel ?? min}
      </span>
      <input
        id={id}
        type="number"
        min={min}
        max={max}
        {...register(id, {
          required: required ? "This field is required" : false,
        })}
        className={scaleClass}
        aria-invalid={!!error}
      />
      <span className="text-sm text-muted-foreground">
        {maxLabel ?? max}
      </span>
    </div>
  );
}
