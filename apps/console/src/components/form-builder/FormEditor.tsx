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
import { SortableBlockItem } from "./SortableBlockItem";
import { Button } from "@repo/design-system/button";

export function FormEditor() {
  const {
    blocks,
    setBlocks,
    updateBlock,
    removeBlock,
    addInputBlock,
    addContentBlock,
    reorderBlocks,
  } = useFormBuilder();

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
        setBlocks((prev) => {
          const oldIndex = prev.findIndex((b) => b.id === active.id);
          const newIndex = prev.findIndex((b) => b.id === over.id);
          if (oldIndex === -1 || newIndex === -1) return prev;
          return arrayMove(prev, oldIndex, newIndex);
        });
      }
    },
    [setBlocks]
  );

  const blockIds = blocks.map((b) => b.id);

  return (
    <div className="space-y-2">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={blockIds}
          strategy={verticalListSortingStrategy}
        >
          {blocks.map((block) => (
            <SortableBlockItem
              key={block.id}
              block={block}
              onUpdate={updateBlock}
              onRemove={removeBlock}
            />
          ))}
        </SortableContext>

        <div className="flex flex-wrap gap-2">
          <Button
            type="button"
            variant="outline"
            className="border-dashed"
            onClick={() => addInputBlock()}
          >
            + Add input
          </Button>
          <Button
            type="button"
            variant="outline"
            className="border-dashed"
            onClick={() => addContentBlock()}
          >
            + Add content
          </Button>
        </div>
      </DndContext>
    </div>
  );
}
