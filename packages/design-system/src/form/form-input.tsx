import { Controller, type Control, type FieldPath, type FieldValues } from "react-hook-form";
import { Input } from "../ui/input";
import { cn } from "../lib/utils";

type FormInputProps<T extends FieldValues> = {
  name: FieldPath<T>;
  control: Control<T>;
  label: string;
  description?: string;
  placeholder?: string;
  type?: React.ComponentProps<"input">["type"];
  id?: string;
  className?: string;
};

export function FormInput<T extends FieldValues>({
  name,
  control,
  label,
  description,
  placeholder,
  type = "text",
  id,
  className,
}: FormInputProps<T>) {
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
          <Input
            {...field}
            id={inputId}
            type={type}
            placeholder={placeholder}
            aria-invalid={fieldState.invalid}
            aria-describedby={
              fieldState.error?.message
                ? `${inputId}-error`
                : description
                  ? `${inputId}-description`
                  : undefined
            }
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
