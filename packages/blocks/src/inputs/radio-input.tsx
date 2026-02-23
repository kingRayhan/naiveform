import type { RadioInputBlock } from "@repo/types";
import type { UseFormRegister } from "react-hook-form";

export interface RadioInputProps {
  block: RadioInputBlock;
  register?: UseFormRegister<Record<string, unknown>>;
  error?: { message?: string };
}

export function RadioInput({
  block,
  register,
  error,
}: RadioInputProps) {
  const { id, options = [] } = block;
  const required = block.settings?.required ?? false;
  const disabled = !register;

  if (disabled) {
    return (
      <div className="space-y-2">
        {options.map((opt: string, i: number) => (
          <label key={i} className="flex items-center gap-2 text-foreground">
            <input
              type="radio"
              name={`q-${id}`}
              value={opt}
              disabled
              className="rounded-full border-input"
            />
            <span>{opt || `Option ${i + 1}`}</span>
          </label>
        ))}
      </div>
    );
  }
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
              type="radio"
              {...register(id, { required: required ? "Select an option" : false })}
              value={opt}
              className="rounded-full border-input"
            />
            <span>{opt || `Option ${i + 1}`}</span>
          </label>
        );
      })}
    </div>
  );
}
