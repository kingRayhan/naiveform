import { createContext, useContext } from "react";
import type { FormQuestion } from "../../lib/form-builder-types";

export interface FormBuilderContextValue {
  questions: FormQuestion[];
  setQuestions: (
    questions: FormQuestion[] | ((prev: FormQuestion[]) => FormQuestion[])
  ) => void;
  updateQuestion: (id: string, updates: Partial<FormQuestion>) => void;
  removeQuestion: (id: string) => void;
  addQuestion: () => void;
  reorderQuestions: (oldIndex: number, newIndex: number) => void;
  saveForm: () => Promise<void>;
}

export const FormBuilderContext = createContext<FormBuilderContextValue | null>(
  null
);

export function useFormBuilder() {
  const ctx = useContext(FormBuilderContext);
  if (!ctx)
    throw new Error("useFormBuilder must be used within FormBuilderProvider");
  return ctx;
}
