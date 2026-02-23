export interface YesNoInputProps {
  id: string;
  disabled?: boolean;
}

export function YesNoInput({
  id,
  disabled = false,
}: YesNoInputProps) {
  return (
    <div className="flex gap-4">
      <label className="flex items-center gap-2">
        <input
          type="radio"
          name={`q-${id}`}
          disabled={disabled}
          className="rounded-full border-input"
        />
        <span>Yes</span>
      </label>
      <label className="flex items-center gap-2">
        <input
          type="radio"
          name={`q-${id}`}
          disabled={disabled}
          className="rounded-full border-input"
        />
        <span>No</span>
      </label>
    </div>
  );
}
