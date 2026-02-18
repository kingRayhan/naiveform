import { useState, useCallback, useEffect, useRef, type ReactNode } from "react";
import { useMutation } from "@repo/convex/react";
import { api } from "@repo/convex";
import { FormBuilderContext } from "./form-builder-context";
import type { FormQuestion } from "../../lib/form-builder-types";
import { createEmptyQuestion } from "../../lib/form-builder-types";
import { arrayMove } from "@dnd-kit/sortable";

function generateId() {
  return `q-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

import type { Id } from "@repo/convex/dataModel";

interface FormBuilderProviderProps {
  children: ReactNode;
  formId?: Id<"forms"> | null;
  initialQuestions?: FormQuestion[] | null;
}

export function FormBuilderProvider({
  children,
  formId,
  initialQuestions,
}: FormBuilderProviderProps) {
  const updateForm = useMutation(api.forms.update);
  const [questions, setQuestions] = useState<FormQuestion[]>(() => [
    createEmptyQuestion(generateId()),
  ]);
  const lastFormId = useRef<string | null>(null);

  useEffect(() => {
    if (!formId || initialQuestions === undefined) return;
    if (lastFormId.current !== formId) {
      lastFormId.current = formId;
      setQuestions(
        initialQuestions?.length
          ? initialQuestions
          : [createEmptyQuestion(generateId())]
      );
    }
  }, [formId, initialQuestions]);

  const saveForm = useCallback(async () => {
    if (!formId) return;
    await updateForm({ formId, questions });
  }, [formId, questions, updateForm]);

  const updateQuestion = useCallback((id: string, updates: Partial<FormQuestion>) => {
    setQuestions((prev) =>
      prev.map((q) => (q.id === id ? { ...q, ...updates } : q))
    );
  }, []);

  const removeQuestion = useCallback((id: string) => {
    setQuestions((prev) => prev.filter((q) => q.id !== id));
  }, []);

  const addQuestion = useCallback(() => {
    setQuestions((prev) => [...prev, createEmptyQuestion(generateId())]);
  }, []);

  const reorderQuestions = useCallback((oldIndex: number, newIndex: number) => {
    setQuestions((prev) => arrayMove(prev, oldIndex, newIndex));
  }, []);

  const value = {
    questions,
    setQuestions,
    updateQuestion,
    removeQuestion,
    addQuestion,
    reorderQuestions,
    saveForm,
  };

  return (
    <FormBuilderContext.Provider value={value}>
      {children}
    </FormBuilderContext.Provider>
  );
}
