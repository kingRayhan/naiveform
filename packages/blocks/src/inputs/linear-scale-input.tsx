export interface LinearScaleInputProps {
  min: number;
  max: number;
  minLabel?: string;
  maxLabel?: string;
  disabled?: boolean;
}

export function LinearScaleInput({
  min,
  max,
  minLabel,
  maxLabel,
}: LinearScaleInputProps) {
  return (
    <div className="flex items-center gap-2 text-sm text-muted-foreground">
      <span>{minLabel ?? min}</span>
      <span>—</span>
      <span>{maxLabel ?? max}</span>
    </div>
  );
}
