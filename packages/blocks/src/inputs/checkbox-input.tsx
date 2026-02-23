import type { CheckboxesBlock } from "@repo/types";
import { Controller, type Control, type UseFormClearErrors, type UseFormSetValue, type UseFormWatch } from "react-hook-form";

export interface CheckboxInputProps {
  block: CheckboxesBlock;
  control?: Control<Record<string, unknown>>;
  setValue?: UseFormSetValue<Record<string, unknown>>;
  watch?: UseFormWatch<Record<string, unknown>>;
  clearErrors?: UseFormClearErrors<Record<string, unknown>>;
  error?: { message?: string };
}

export function CheckboxInput({
  block,
  control,
  setValue,
  watch,
  clearErrors,
  error,
}: CheckboxInputProps) {
  const { id, options = [] } = block;
  const minSelections = block.settings?.minSelections;
  const maxSelections = block.settings?.maxSelections;
  const disabled = !control || !setValue || !watch || !clearErrors;

  if (disabled) {
    return (
      <div className="space-y-2">
        {options.map((opt: string, i: number) => (
          <label key={i} className="flex items-center gap-2 text-foreground">
            <input
              type="checkbox"
              value={opt}
              disabled
              className="rounded border-input"
            />
            <span>{opt || `Option ${i + 1}`}</span>
          </label>
        ))}
      </div>
    );
  }

  return (
    <Controller
      name={id}
      control={control}
      rules={{
        validate: (v: unknown) => {
          const arr = Array.isArray(v) ? v : [];
          if (minSelections != null && arr.length < minSelections)
            return `Select at least ${minSelections} option(s)`;
          if (maxSelections != null && arr.length > maxSelections)
            return `Select at most ${maxSelections} option(s)`;
          return true;
        },
      }}
      render={({ field }) => {
        const watched = watch(id) as string[] | undefined;
        const arr = Array.isArray(field.value)
          ? field.value
          : Array.isArray(watched)
            ? watched
            : [];

        const toggle = (opt: string) => {
          clearErrors(id);
          const next = arr.includes(opt)
            ? arr.filter((o) => o !== opt)
            : [...arr, opt];
          field.onChange(next);
        };

        return (
          <div className="space-y-2" role="group">
            {options.map((opt: string, i: number) => {
              const optionId = `${id}-option-${i}`;
              return (
                <label
                  key={i}
                  htmlFor={optionId}
                  className="flex items-center gap-2 text-foreground"
                >
                  <input
                    id={optionId}
                    type="checkbox"
                    checked={arr.includes(opt)}
                    onChange={() => toggle(opt)}
                    onBlur={field.onBlur}
                    className="rounded border-input"
                  />
                  <span>{opt || `Option ${i + 1}`}</span>
                </label>
              );
            })}
          </div>
        );
      }}
    />
  );
}
