import { useState } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type {
  FormQuestion,
  QuestionType,
  ShortTextInputType,
} from "../../lib/form-builder-types";
import {
  QUESTION_TYPES,
  SHORT_TEXT_INPUT_TYPES,
  getDefaultOptions,
} from "../../lib/form-builder-types";
import { HelpCircle } from "lucide-react";
import { Button } from "@repo/design-system/button";

interface SortableQuestionItemProps {
  question: FormQuestion;
  onUpdate: (id: string, updates: Partial<FormQuestion>) => void;
  onRemove: (id: string) => void;
}

export function SortableQuestionItem({
  question,
  onUpdate,
  onRemove,
}: SortableQuestionItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    setActivatorNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: question.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const [isEditingFieldId, setIsEditingFieldId] = useState(false);
  const [fieldIdDraft, setFieldIdDraft] = useState(question.id);
  const fieldIdValue = isEditingFieldId ? fieldIdDraft : question.id;

  const hasOptions =
    question.type === "multiple_choice" ||
    question.type === "checkboxes" ||
    question.type === "dropdown";
  const options = question.options ?? [];

  const handleTypeChange = (newType: QuestionType) => {
    const defaultOpts = getDefaultOptions(newType);
    const updates: Partial<FormQuestion> = {
      type: newType,
      options: defaultOpts,
    };
    if (newType !== "short_text") {
      updates.inputType = undefined;
    } else if (!question.inputType) {
      updates.inputType = "text";
    }
    if (newType === "star_rating") {
      updates.ratingMax = 5;
    } else {
      updates.ratingMax = undefined;
    }
    onUpdate(question.id, updates);
  };

  const setOption = (index: number, value: string) => {
    const next = [...(question.options ?? [])];
    next[index] = value;
    onUpdate(question.id, { options: next });
  };

  const addOption = () => {
    const next = [
      ...(question.options ?? []),
      `Option ${(question.options?.length ?? 0) + 1}`,
    ];
    onUpdate(question.id, { options: next });
  };

  const removeOption = (index: number) => {
    const next = (question.options ?? []).filter((_, i) => i !== index);
    onUpdate(question.id, { options: next.length ? next : undefined });
  };

  const inputClass =
    "w-full px-3 py-2 border border-input rounded-md bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring text-sm";

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`rounded-lg border border-border bg-card p-4 shadow-sm ${isDragging ? "z-50 opacity-90 shadow-md" : ""}`}
    >
      <div className="flex gap-3">
        {/* Drag handle */}
        <button
          type="button"
          ref={setActivatorNodeRef}
          {...attributes}
          {...listeners}
          className="mt-2 flex cursor-grab touch-none flex-col gap-0.5 rounded p-1 text-muted-foreground hover:bg-muted hover:text-foreground active:cursor-grabbing"
          aria-label="Drag to reorder"
        >
          <span className="block h-0.5 w-4 bg-current" />
          <span className="block h-0.5 w-4 bg-current" />
          <span className="block h-0.5 w-4 bg-current" />
        </button>

        <div className="min-w-0 flex-1 space-y-3">
          <div className="flex gap-2">
            <input
              type="text"
              value={question.title}
              onChange={(e) => onUpdate(question.id, { title: e.target.value })}
              placeholder="Question title"
              className={inputClass}
            />
            <select
              value={question.type}
              onChange={(e) => handleTypeChange(e.target.value as QuestionType)}
              className={`${inputClass} w-auto min-w-[140px]`}
            >
              {QUESTION_TYPES.map(({ value, label }) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground text-sm whitespace-nowrap">
              Field ID:
            </span>
            <input
              type="text"
              value={fieldIdValue}
              onFocus={() => {
                setFieldIdDraft(question.id);
                setIsEditingFieldId(true);
              }}
              onChange={(e) => setFieldIdDraft(e.target.value)}
              onBlur={() => {
                onUpdate(question.id, { id: fieldIdDraft });
                setIsEditingFieldId(false);
              }}
              placeholder="e.g. email, full_name"
              className={`${inputClass} max-w-[200px] font-mono text-sm`}
            />
            <span className="relative flex group">
              <button
                type="button"
                className="rounded p-0.5 text-muted-foreground hover:text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                aria-label="Why Field ID is needed"
              >
                <HelpCircle className="h-4 w-4" />
              </button>
              <span className="absolute left-0 bottom-full z-50 mb-1.5 hidden w-[min(280px,90vw)] rounded-md border border-border bg-popover px-3 py-2 shadow-md group-hover:block">
                <span className="text-xs text-foreground">
                  Stable key for this field. Used in headless HTML/API
                  submissions and when you change the question title later. Use
                  lowercase letters, numbers, and underscores; duplicates get
                  -2, -3.
                </span>
              </span>
            </span>
          </div>

          {hasOptions && (
            <div className="space-y-2 pl-0">
              {options.map((opt, i) => (
                <div key={i} className="flex items-center gap-2">
                  <span className="text-muted-foreground text-sm">
                    {question.type === "multiple_choice"
                      ? "○"
                      : question.type === "checkboxes"
                        ? "☐"
                        : "▾"}
                  </span>
                  <input
                    type="text"
                    value={opt}
                    onChange={(e) => setOption(i, e.target.value)}
                    placeholder={`Option ${i + 1}`}
                    className={inputClass}
                  />
                  <button
                    type="button"
                    onClick={() => removeOption(i)}
                    className="rounded p-1 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                    aria-label="Remove option"
                  >
                    ×
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={addOption}
                className="text-sm text-muted-foreground hover:text-foreground"
              >
                + Add option
              </button>
            </div>
          )}

          {question.type === "short_text" && (
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground text-sm flex-none">
                Input type:
              </span>
              <select
                value={question.inputType ?? "text"}
                onChange={(e) =>
                  onUpdate(question.id, {
                    inputType: e.target.value as ShortTextInputType,
                  })
                }
                className={`${inputClass} w-auto min-w-[100px]`}
              >
                {SHORT_TEXT_INPUT_TYPES.map(({ value, label }) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </div>
          )}
          {question.type === "long_text" && (
            <p className="text-muted-foreground text-sm">Long answer text</p>
          )}
          {question.type === "date" && (
            <p className="text-muted-foreground text-sm">Date</p>
          )}

          {question.type === "star_rating" && (
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground text-sm flex-none">
                Max stars:
              </span>
              <select
                value={question.ratingMax ?? 5}
                onChange={(e) =>
                  onUpdate(question.id, {
                    ratingMax: parseInt(e.target.value, 10),
                  })
                }
                className={`${inputClass} w-auto min-w-[80px]`}
              >
                {[3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
                  <option key={n} value={n}>
                    {n}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className="flex items-center justify-between pt-1">
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={question.required}
                onChange={(e) =>
                  onUpdate(question.id, { required: e.target.checked })
                }
                className="rounded border-input"
              />
              Required
            </label>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="text-destructive hover:bg-destructive/10 hover:text-destructive"
              onClick={() => onRemove(question.id)}
            >
              Remove
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
