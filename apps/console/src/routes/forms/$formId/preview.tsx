import { createFileRoute } from "@tanstack/react-router";
import { useFormBuilder } from "@/components/form-builder/form-builder-context";
import { FormPreview } from "@/components/form-builder/FormPreview";

export const Route = createFileRoute("/forms/$formId/preview")({
  component: FormPreviewPage,
});

function FormPreviewPage() {
  const { questions } = useFormBuilder();

  return (
    <div>
      <h2 className="text-lg font-semibold text-foreground mb-4">Preview</h2>
      <p className="text-muted-foreground mb-6">
        How your form will look to respondents. Edits in the Editor tab update here.
      </p>
      <FormPreview questions={questions} formTitle="Untitled form" />
    </div>
  );
}
