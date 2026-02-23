import type { DropdownBlock } from "@repo/types";
import type { UseFormRegister } from "react-hook-form";
import { defaultInputClass } from "./constants";

export interface DropdownInputProps {
  block: DropdownBlock;
  register?: UseFormRegister<Record<string, unknown>>;
  error?: { message?: string };
  className?: string;
}

export function DropdownInput({
  block,
  register,
  error,
  className = defaultInputClass,
}: DropdownInputProps) {
  const { id, options = [] } = block;
  const placeholder = block.settings?.placeholder ?? "Choose";
  const disabled = !register;

  if (disabled) {
    return (
      <select id={id} className={className} disabled>
        <option value="">{placeholder}</option>
        {options.map((opt: string, i: number) => (
          <option key={i} value={opt}>
            {opt || `Option ${i + 1}`}
          </option>
        ))}
      </select>
    );
  }
  return (
    <select
      id={id}
      {...register(id)}
      className={className}
      aria-invalid={!!error}
    >
      <option value="">{placeholder}</option>
      {options.map((opt: string, i: number) => (
        <option key={i} value={opt}>
          {opt || `Option ${i + 1}`}
        </option>
      ))}
    </select>
  );
}
