export interface StarRatingInputProps {
  id: string;
  max?: number;
  disabled?: boolean;
}

export function StarRatingInput({
  id,
  max = 5,
  disabled = false,
}: StarRatingInputProps) {
  const count = Math.min(10, Math.max(3, max));
  return (
    <div className="flex gap-1" aria-hidden>
      {Array.from({ length: count }, (_, i) => (
        <span
          key={i}
          className="text-2xl text-muted-foreground/50"
          aria-hidden
        >
          ☆
        </span>
      ))}
      <span className="ml-2 text-sm text-muted-foreground">
        (Star rating)
      </span>
    </div>
  );
}
