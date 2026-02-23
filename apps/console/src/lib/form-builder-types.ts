/**
 * Re-export block model and helpers from @repo/types.
 * Use FormBlock, InputBlock, ContentBlock, etc. from @repo/types in the editor.
 */
import { INPUT_BLOCK_TYPES } from "@repo/types";
export {
  INPUT_BLOCK_TYPES,
  CONTENT_BLOCK_TYPES,
  createEmptyInputBlock,
  createEmptyContentBlock,
  isInputBlock,
  isContentBlock,
  getFormBlocks,
} from "@repo/types";
export type {
  FormBlock,
  InputBlock,
  ContentBlock,
} from "@repo/types";

/** Legacy alias for SortableQuestionItem: input block type union plus legacy names. */
export type QuestionType =
  | import("@repo/types").InputBlock["type"]
  | "multiple_choice"
  | "checkboxes"
  | "short_text";

/** Legacy alias: InputBlock with optional top-level inputType, ratingMax, required, options and legacy type names. */
export type FormQuestion = Omit<import("@repo/types").InputBlock, "type"> & {
  type: QuestionType;
  options?: string[];
  inputType?: "text" | "email" | "phone" | "url";
  ratingMax?: number;
  required?: boolean;
};

export type ShortTextInputType = "text" | "email" | "phone" | "url";

/** Legacy: question type options for dropdown (value + label). */
export const QUESTION_TYPES: { value: QuestionType; label: string }[] = [
  ...INPUT_BLOCK_TYPES.map((t) => ({ value: t.type as QuestionType, label: t.label })),
  { value: "multiple_choice" as const, label: "Multiple choice" },
  { value: "checkboxes" as const, label: "Checkboxes" },
  { value: "short_text" as const, label: "Short text" },
].filter(
  (t, i, arr) => arr.findIndex((x) => x.value === t.value) === i
) as { value: QuestionType; label: string }[];

export const SHORT_TEXT_INPUT_TYPES: { value: ShortTextInputType; label: string }[] = [
  { value: "text", label: "Text" },
  { value: "email", label: "Email" },
  { value: "phone", label: "Phone" },
  { value: "url", label: "URL" },
];

/** Default options for option-based question types. */
export function getDefaultOptions(type: QuestionType): string[] {
  const withOptions: QuestionType[] = [
    "radio",
    "checkbox",
    "dropdown",
    "multiple_choice",
    "checkboxes",
  ];
  return withOptions.includes(type) ? ["Option 1"] : [];
}

/** Slug from title for block id: lowercase, alphanumeric + underscores. */
export function slugify(title: string): string {
  const s = title
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_|_$/g, "");
  return s || "field";
}

/** Return a slug unique among existingIds (append -2, -3 if needed). */
export function uniqueSlug(title: string, existingIds: string[]): string {
  const base = slugify(title);
  const set = new Set(existingIds);
  if (!set.has(base)) return base;
  let n = 2;
  while (set.has(`${base}-${n}`)) n++;
  return `${base}-${n}`;
}
