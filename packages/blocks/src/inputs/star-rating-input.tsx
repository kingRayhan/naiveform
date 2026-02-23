import { useState } from "react";
import type { StarRatingBlock } from "@repo/types";
import type { ControllerFieldState, ControllerRenderProps } from "react-hook-form";
import { Controller, type Control } from "react-hook-form";

export interface StarRatingInputProps {
  block: StarRatingBlock;
  control?: Control<Record<string, unknown>>;
  error?: { message?: string };
  labelId?: string;
}

function StarRatingStars({
  field,
  fieldState,
  count,
  labelId,
}: {
  field: ControllerRenderProps<Record<string, unknown>, string>;
  fieldState: ControllerFieldState;
  count: number;
  labelId?: string;
}) {
  const [hover, setHover] = useState(0);
  const selected = field.value ? parseInt(String(field.value), 10) : 0;
  return (
    <div className="flex flex-col gap-1">
      <div className="flex gap-1" role="group" aria-labelledby={labelId}>
        {Array.from({ length: count }, (_, i) => i + 1).map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => field.onChange(String(star))}
            onBlur={field.onBlur}
            onMouseEnter={() => setHover(star)}
            onMouseLeave={() => setHover(0)}
            className="text-2xl transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded p-0.5"
            aria-label={`${star} star${star > 1 ? "s" : ""}`}
          >
            {(hover || selected) >= star ? (
              <span className="text-amber-400">★</span>
            ) : (
              <span className="text-muted-foreground/50">☆</span>
            )}
          </button>
        ))}
      </div>
      {fieldState.error?.message && (
        <p className="text-sm text-destructive" role="alert">
          {fieldState.error.message}
        </p>
      )}
    </div>
  );
}

export function StarRatingInput({
  block,
  control,
  labelId,
}: StarRatingInputProps) {
  const { id } = block;
  const required = block.settings?.required ?? false;
  const max = block.settings?.ratingMax ?? 5;
  const count = Math.min(10, Math.max(3, max));
  const disabled = !control;

  if (disabled) {
    return (
      <div className="flex gap-1" aria-hidden>
        {Array.from({ length: count }, (_, i) => (
          <span
            key={i}
            className="text-2xl text-muted-foreground/50"
            aria-hidden
          >
            ☆
          </span>
        ))}
        <span className="ml-2 text-sm text-muted-foreground">
          (Star rating)
        </span>
      </div>
    );
  }

  return (
    <Controller
      name={id}
      control={control}
      rules={{
        required: required ? "Please select a rating" : false,
        validate: (v: unknown) => {
          const val = typeof v === "string" ? v : "";
          if (!val && !required) return true;
          const n = parseInt(val, 10);
          if (Number.isNaN(n) || n < 1 || n > count)
            return `Please select between 1 and ${count}`;
          return true;
        },
      }}
      render={({ field, fieldState }) => (
        <StarRatingStars
          field={field}
          fieldState={fieldState}
          count={count}
          labelId={labelId}
        />
      )}
    />
  );
}
