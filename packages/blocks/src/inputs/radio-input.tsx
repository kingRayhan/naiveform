export interface RadioInputProps {
  id: string;
  options: string[];
  disabled?: boolean;
}

export function RadioInput({
  id,
  options,
  disabled = false,
}: RadioInputProps) {
  return (
    <div className="space-y-2">
      {options.map((opt: string, i: number) => (
        <label
          key={i}
          className="flex items-center gap-2 text-foreground"
        >
          <input
            type="radio"
            name={`q-${id}`}
            value={opt}
            disabled={disabled}
            className="rounded-full border-input"
          />
          <span>{opt || `Option ${i + 1}`}</span>
        </label>
      ))}
    </div>
  );
}
