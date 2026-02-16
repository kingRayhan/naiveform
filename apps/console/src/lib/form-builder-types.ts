export const QUESTION_TYPES = [
  { value: "short_text", label: "Short answer" },
  { value: "long_text", label: "Paragraph" },
  { value: "multiple_choice", label: "Multiple choice" },
  { value: "checkboxes", label: "Checkboxes" },
  { value: "dropdown", label: "Dropdown" },
  { value: "date", label: "Date" },
] as const;

export type QuestionType = (typeof QUESTION_TYPES)[number]["value"];

export interface FormQuestion {
  id: string;
  type: QuestionType;
  title: string;
  required: boolean;
  options?: string[]; // for multiple_choice, checkboxes, dropdown
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
