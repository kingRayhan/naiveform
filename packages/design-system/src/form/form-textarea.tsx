import { Controller, type Control, type FieldPath, type FieldValues } from "react-hook-form";
import { cn } from "../lib/utils";

const textareaStyles =
  "dark:bg-input/30 border-input focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:aria-invalid:border-destructive/50 disabled:bg-input/50 dark:disabled:bg-input/80 min-h-[80px] w-full rounded-lg border bg-transparent px-2.5 py-2 text-base transition-colors placeholder:text-muted-foreground focus-visible:ring-3 aria-invalid:ring-3 md:text-sm outline-none disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 resize-y";

type FormTextareaProps<T extends FieldValues> = {
  name: FieldPath<T>;
  control: Control<T>;
  label: string;
  description?: string;
  placeholder?: string;
  rows?: number;
  id?: string;
  className?: string;
};

export function FormTextarea<T extends FieldValues>({
  name,
  control,
  label,
  description,
  placeholder,
  rows = 3,
  id,
  className,
}: FormTextareaProps<T>) {
  const inputId = id ?? name;

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <div
          className={cn("space-y-1.5", className)}
          data-invalid={fieldState.invalid ? "" : undefined}
        >
          <label
            htmlFor={inputId}
            className="block text-sm font-medium text-foreground"
          >
            {label}
          </label>
          <textarea
            {...field}
            id={inputId}
            rows={rows}
            placeholder={placeholder}
            aria-invalid={fieldState.invalid}
            aria-describedby={
              fieldState.error?.message
                ? `${inputId}-error`
                : description
                  ? `${inputId}-description`
                  : undefined
            }
            className={cn(textareaStyles)}
          />
          {description && !fieldState.error && (
            <p id={`${inputId}-description`} className="text-sm text-muted-foreground">
              {description}
            </p>
          )}
          {fieldState.error?.message && (
            <p
              id={`${inputId}-error`}
              className="text-sm text-destructive"
              role="alert"
            >
              {fieldState.error.message}
            </p>
          )}
        </div>
      )}
    />
  );
}
