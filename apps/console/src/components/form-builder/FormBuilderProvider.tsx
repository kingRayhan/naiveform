import { useState, useCallback, useEffect, useRef, type ReactNode } from "react";
import { useMutation } from "@repo/convex/react";
import { api } from "@repo/convex";
import { FormBuilderContext } from "./form-builder-context";
import type { FormBlock } from "@repo/types";
import {
  createEmptyInputBlock,
  createEmptyContentBlock,
  INPUT_BLOCK_TYPES,
  CONTENT_BLOCK_TYPES,
} from "@repo/types";
import type { InputBlock, ContentBlock } from "@repo/types";
import { arrayMove } from "@dnd-kit/sortable";
import type { Id } from "@repo/convex/dataModel";

function uniqueBlockId(prefix: string, existingIds: string[]): string {
  const set = new Set(existingIds);
  if (!set.has(prefix)) return prefix;
  let n = 2;
  while (set.has(`${prefix}-${n}`)) n++;
  return `${prefix}-${n}`;
}

interface FormBuilderProviderProps {
  children: ReactNode;
  formId?: Id<"forms"> | null;
  initialBlocks?: FormBlock[] | null;
}

export function FormBuilderProvider({
  children,
  formId,
  initialBlocks,
}: FormBuilderProviderProps) {
  const updateForm = useMutation(api.forms.update);
  const [blocks, setBlocks] = useState<FormBlock[]>(() => [
    createEmptyInputBlock(uniqueBlockId("field", [])),
  ]);
  const lastFormId = useRef<string | null>(null);

  useEffect(() => {
    if (!formId || initialBlocks === undefined) return;
    if (lastFormId.current !== formId) {
      lastFormId.current = formId;
      setBlocks(
        initialBlocks?.length
          ? initialBlocks
          : [createEmptyInputBlock(uniqueBlockId("field", []))]
      );
    }
  }, [formId, initialBlocks]);

  const saveForm = useCallback(async () => {
    if (!formId) return;
    await updateForm({ formId, blocks });
  }, [formId, blocks, updateForm]);

  const updateBlock = useCallback((id: string, updates: Partial<FormBlock>) => {
    setBlocks((prev): FormBlock[] => {
      const otherIds = prev.map((b) => b.id).filter((oid) => oid !== id);
      const newId =
        updates.id !== undefined
          ? uniqueBlockId(updates.id, otherIds)
          : undefined;
      const resolved = newId !== undefined ? { ...updates, id: newId } : updates;
      return prev.map((b) => (b.id === id ? { ...b, ...resolved } : b)) as FormBlock[];
    });
  }, []);

  const removeBlock = useCallback((id: string) => {
    setBlocks((prev) => prev.filter((b) => b.id !== id));
  }, []);

  const addInputBlock = useCallback((type?: InputBlock["type"]) => {
    const inputType =
      type && INPUT_BLOCK_TYPES.some((t) => t.type === type) ? type : "text";
    setBlocks((prev) => {
      const nextId = uniqueBlockId("field", prev.map((b) => b.id));
      return [...prev, createEmptyInputBlock(nextId, inputType)];
    });
  }, []);

  const addContentBlock = useCallback((type?: ContentBlock["type"]) => {
    const contentType =
      type && CONTENT_BLOCK_TYPES.some((t) => t.type === type)
        ? type
        : "paragraph";
    setBlocks((prev) => {
      const nextId = uniqueBlockId("content", prev.map((b) => b.id));
      return [...prev, createEmptyContentBlock(nextId, contentType)];
    });
  }, []);

  const reorderBlocks = useCallback((oldIndex: number, newIndex: number) => {
    setBlocks((prev) => arrayMove(prev, oldIndex, newIndex));
  }, []);

  const value = {
    blocks,
    setBlocks,
    updateBlock,
    removeBlock,
    addInputBlock,
    addContentBlock,
    reorderBlocks,
    saveForm,
  };

  return (
    <FormBuilderContext.Provider value={value}>
      {children}
    </FormBuilderContext.Provider>
  );
}
