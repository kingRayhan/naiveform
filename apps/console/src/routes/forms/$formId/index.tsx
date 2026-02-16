import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/forms/$formId/")({
  component: FormEditorPage,
});

function FormEditorPage() {
  return (
    <div>
      <h2 className="text-lg font-semibold text-foreground mb-4">Form editor</h2>
      <p className="text-muted-foreground">
        Add and edit questions here. Question types: short text, long text, multiple choice, checkboxes, dropdown, date.
      </p>
      <div className="mt-6 p-6 border border-dashed border-border rounded-lg text-center text-muted-foreground">
        Editor UI coming soon. Drag to add questions, click to edit.
      </div>
    </div>
  );
}
