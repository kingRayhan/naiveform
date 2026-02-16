import { createFileRoute } from "@tanstack/react-router";
import { FormEditor } from "../../../components/form-builder/FormEditor";

export const Route = createFileRoute("/forms/$formId/")({
  component: FormEditorPage,
});

function FormEditorPage() {
  return (
    <div>
      <h2 className="text-lg font-semibold text-foreground mb-4">
        Form editor
      </h2>
      <p className="text-muted-foreground mb-6">
        Drag the handle to reorder questions. Click to edit title and options.
      </p>
      <FormEditor />
    </div>
  );
}
