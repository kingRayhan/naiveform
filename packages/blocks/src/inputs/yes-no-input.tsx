import type { YesNoBlock } from "@repo/types";
import type { UseFormRegister } from "react-hook-form";

export interface YesNoInputProps {
  block: YesNoBlock;
  register?: UseFormRegister<Record<string, unknown>>;
  error?: { message?: string };
}

export function YesNoInput({
  block,
  register,
  error: _error,
}: YesNoInputProps) {
  const { id } = block;
  const required = block.settings?.required ?? false;
  const disabled = !register;

  if (disabled) {
    return (
      <div className="flex gap-4">
        <label className="flex items-center gap-2">
          <input
            type="radio"
            name={`q-${id}`}
            disabled
            className="rounded-full border-input"
          />
          <span>Yes</span>
        </label>
        <label className="flex items-center gap-2">
          <input
            type="radio"
            name={`q-${id}`}
            disabled
            className="rounded-full border-input"
          />
          <span>No</span>
        </label>
      </div>
    );
  }
  return (
    <div className="flex gap-4" role="group">
      <label htmlFor={`${id}-yes`} className="flex items-center gap-2">
        <input
          id={`${id}-yes`}
          type="radio"
          {...register(id, {
            required: required ? "Select an option" : false,
          })}
          value="yes"
          className="rounded-full border-input"
        />
        <span>Yes</span>
      </label>
      <label htmlFor={`${id}-no`} className="flex items-center gap-2">
        <input
          id={`${id}-no`}
          type="radio"
          {...register(id)}
          value="no"
          className="rounded-full border-input"
        />
        <span>No</span>
      </label>
    </div>
  );
}
