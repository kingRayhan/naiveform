import { createContext, useContext } from "react";
import type { ContentBlock, FormBlock, InputBlock } from "@repo/types";

export interface FormBuilderContextValue {
  blocks: FormBlock[];
  setBlocks: (blocks: FormBlock[] | ((prev: FormBlock[]) => FormBlock[])) => void;
  updateBlock: (id: string, updates: Partial<FormBlock>) => void;
  removeBlock: (id: string) => void;
  addInputBlock: (type?: InputBlock["type"]) => void;
  addContentBlock: (type?: ContentBlock["type"]) => void;
  reorderBlocks: (oldIndex: number, newIndex: number) => void;
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
