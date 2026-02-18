import type { FormQuestion } from "../../lib/form-builder-types";

interface FormPreviewProps {
  questions: FormQuestion[];
  formTitle?: string;
  formDescription?: string;
}

const inputClass =
  "w-full px-3 py-2 border border-input rounded-md bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring";

export function FormPreview({
  questions,
  formTitle = "Untitled form",
  formDescription,
}: FormPreviewProps) {
  return (
    <div className="rounded-lg border border-border bg-card p-6 shadow-sm">
      <div className="mb-6 border-b border-border pb-6">
        <h1 className="text-2xl font-semibold text-foreground">{formTitle}</h1>
        {formDescription && (
          <p className="mt-2 text-muted-foreground">{formDescription}</p>
        )}
      </div>

      <div className="space-y-6">
        {questions.length === 0 ? (
          <p className="py-8 text-center text-muted-foreground">
            No questions yet. Add questions in the Editor tab.
          </p>
        ) : (
          questions.map((q) => (
            <div key={q.id} className="space-y-2">
              <label className="block text-sm font-medium text-foreground">
                {q.title || "(Untitled question)"}
                {q.required && (
                  <span className="text-destructive ml-0.5">*</span>
                )}
              </label>

              {q.type === "short_text" && (
                <input
                  type={
                    q.inputType === "email"
                      ? "email"
                      : q.inputType === "number"
                        ? "number"
                        : "text"
                  }
                  placeholder={
                    q.inputType === "email"
                      ? "you@example.com"
                      : q.inputType === "phone"
                        ? "+1 (555) 000-0000"
                        : "Your answer"
                  }
                  className={inputClass}
                  disabled
                  readOnly
                />
              )}

              {q.type === "long_text" && (
                <textarea
                  rows={3}
                  placeholder="Your answer"
                  className={inputClass}
                  disabled
                  readOnly
                />
              )}

              {q.type === "multiple_choice" && (
                <div className="space-y-2">
                  {(q.options ?? []).map((opt, i) => (
                    <label
                      key={i}
                      className="flex items-center gap-2 text-foreground"
                    >
                      <input
                        type="radio"
                        name={`q-${q.id}`}
                        value={opt}
                        disabled
                        className="rounded-full border-input"
                      />
                      <span>{opt || `Option ${i + 1}`}</span>
                    </label>
                  ))}
                </div>
              )}

              {q.type === "checkboxes" && (
                <div className="space-y-2">
                  {(q.options ?? []).map((opt, i) => (
                    <label
                      key={i}
                      className="flex items-center gap-2 text-foreground"
                    >
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
              )}

              {q.type === "dropdown" && (
                <select className={inputClass} disabled>
                  <option value="">Choose</option>
                  {(q.options ?? []).map((opt, i) => (
                    <option key={i} value={opt}>
                      {opt || `Option ${i + 1}`}
                    </option>
                  ))}
                </select>
              )}

              {q.type === "date" && (
                <input type="date" className={inputClass} disabled />
              )}

              {q.type === "star_rating" && (
                <div className="flex gap-1" aria-hidden>
                  {Array.from(
                    { length: Math.min(10, Math.max(3, q.ratingMax ?? 5)) },
                    (_, i) => (
                      <span
                        key={i}
                        className="text-2xl text-muted-foreground/50"
                        aria-hidden
                      >
                        ☆
                      </span>
                    )
                  )}
                  <span className="ml-2 text-sm text-muted-foreground">
                    (Star rating)
                  </span>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* {questions.length > 0 && (
        <div className="mt-6 pt-6">
          <button
            type="button"
            className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
            disabled
          >
            Submit (preview)
          </button>
        </div>
      )} */}
    </div>
  );
}
