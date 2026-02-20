export const QUESTION_TYPES = [
  { value: "short_text", label: "Short answer" },
  { value: "long_text", label: "Paragraph" },
  { value: "multiple_choice", label: "Multiple choice" },
  { value: "checkboxes", label: "Checkboxes" },
  { value: "dropdown", label: "Dropdown" },
  { value: "date", label: "Date" },
  { value: "star_rating", label: "Star rating" },
] as const;

export type QuestionType = (typeof QUESTION_TYPES)[number]["value"];

export const SHORT_TEXT_INPUT_TYPES = [
  { value: "text" as const, label: "Text" },
  { value: "email" as const, label: "Email" },
  { value: "phone" as const, label: "Phone" },
  { value: "number" as const, label: "Number" },
];

export type ShortTextInputType = (typeof SHORT_TEXT_INPUT_TYPES)[number]["value"];

export interface FormQuestion {
  id: string;
  type: QuestionType;
  title: string;
  required: boolean;
  options?: string[]; // for multiple_choice, checkboxes, dropdown
  inputType?: ShortTextInputType; // for short_text
  ratingMax?: number; // for star_rating, default 5
}

/** Slug from title for use as question id: lowercase, alphanumeric + underscores. */
export function slugify(title: string): string {
  const s = title
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_|_$/g, "");
  return s || "field";
}

/** Return a slug for the title that is unique among existingIds (append -2, -3 if needed). */
export function uniqueSlug(title: string, existingIds: string[]): string {
  const base = slugify(title);
  const set = new Set(existingIds);
  if (!set.has(base)) return base;
  let n = 2;
  while (set.has(`${base}-${n}`)) n++;
  return `${base}-${n}`;
}

/** Normalize question ids to slug-from-title; handles collisions and empty titles. */
export function normalizeQuestionIds(questions: FormQuestion[]): FormQuestion[] {
  const used = new Set<string>();
  return questions.map((q) => {
    const id = uniqueSlug(q.title || "field", [...used]);
    used.add(id);
    return { ...q, id };
  });
}

export function createEmptyQuestion(id: string): FormQuestion {
  return {
    id,
    type: "short_text",
    title: "",
    required: false,
  };
}

export function getDefaultOptions(type: QuestionType): string[] | undefined {
  if (type === "multiple_choice" || type === "checkboxes" || type === "dropdown") {
    return ["Option 1", "Option 2"];
  }
  return undefined;
}
