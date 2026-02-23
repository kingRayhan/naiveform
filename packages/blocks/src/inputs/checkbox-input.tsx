export interface CheckboxInputProps {
  id: string;
  options: string[];
  disabled?: boolean;
}

export function CheckboxInput({
  id,
  options,
  disabled = false,
}: CheckboxInputProps) {
  return (
    <div className="space-y-2">
      {options.map((opt: string, i: number) => (
        <label
          key={i}
          className="flex items-center gap-2 text-foreground"
        >
          <input
            type="checkbox"
            value={opt}
            disabled={disabled}
            className="rounded border-input"
          />
          <span>{opt || `Option ${i + 1}`}</span>
        </label>
      ))}
    </div>
  );
}
