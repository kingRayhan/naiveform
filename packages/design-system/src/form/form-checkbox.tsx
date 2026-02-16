import { Controller, type Control, type FieldPath, type FieldValues } from "react-hook-form";
import { cn } from "../lib/utils";

type FormCheckboxProps<T extends FieldValues> = {
  name: FieldPath<T>;
  control: Control<T>;
  label: string;
  description?: string;
  id?: string;
  className?: string;
};

const checkboxStyles =
  "size-4 rounded border-input bg-background text-primary focus-visible:ring-ring focus-visible:ring-3 focus-visible:ring-offset-2 cursor-pointer aria-invalid:border-destructive aria-invalid:ring-destructive/20";

export function FormCheckbox<T extends FieldValues>({
  name,
  control,
  label,
  description,
  id,
  className,
}: FormCheckboxProps<T>) {
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
            className="flex cursor-pointer items-center gap-3 text-sm font-medium text-foreground"
          >
            <input
              type="checkbox"
              id={inputId}
              checked={!!field.value}
              onChange={(e) => field.onChange(e.target.checked)}
              onBlur={field.onBlur}
              ref={field.ref}
              aria-invalid={fieldState.invalid}
              aria-describedby={
                fieldState.error?.message
                  ? `${inputId}-error`
                  : description
                    ? `${inputId}-description`
                    : undefined
              }
              className={cn(checkboxStyles)}
            />
            <span className="font-normal">{label}</span>
          </label>
          {description && !fieldState.error && (
            <p
              id={`${inputId}-description`}
              className="text-sm text-muted-foreground pl-7"
            >
              {description}
            </p>
          )}
          {fieldState.error?.message && (
            <p
              id={`${inputId}-error`}
              className="text-sm text-destructive pl-7"
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
