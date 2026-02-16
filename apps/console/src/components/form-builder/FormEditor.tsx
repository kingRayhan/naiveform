import { useCallback } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  verticalListSortingStrategy,
  sortableKeyboardCoordinates,
} from "@dnd-kit/sortable";
import { useFormBuilder } from "./form-builder-context";
import { SortableQuestionItem } from "./SortableQuestionItem";
import { Button } from "@repo/design-system/button";

export function FormEditor() {
  const { questions, setQuestions, updateQuestion, removeQuestion, addQuestion } =
    useFormBuilder();

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;
      if (over && active.id !== over.id) {
        setQuestions((prev) => {
          const oldIndex = prev.findIndex((q) => q.id === active.id);
          const newIndex = prev.findIndex((q) => q.id === over.id);
          if (oldIndex === -1 || newIndex === -1) return prev;
          return arrayMove(prev, oldIndex, newIndex);
        });
      }
    },
    [setQuestions]
  );

  const questionIds = questions.map((q) => q.id);

  return (
    <div className="space-y-4">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={questionIds}
          strategy={verticalListSortingStrategy}
        >
          {questions.map((question) => (
            <SortableQuestionItem
              key={question.id}
              question={question}
              onUpdate={updateQuestion}
              onRemove={removeQuestion}
            />
          ))}
        </SortableContext>

        <Button
          type="button"
          variant="outline"
          className="w-full border-dashed"
          onClick={addQuestion}
        >
          + Add question
        </Button>
      </DndContext>
    </div>
  );
}
