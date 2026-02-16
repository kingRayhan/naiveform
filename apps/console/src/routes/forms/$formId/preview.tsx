import { createFileRoute, useParams } from "@tanstack/react-router";
import { useQuery } from "@repo/convex/react";
import { api } from "@repo/convex";
import type { Id } from "@repo/convex/dataModel";
import { useFormBuilder } from "@/components/form-builder/form-builder-context";
import { FormPreview } from "@/components/form-builder/FormPreview";

export const Route = createFileRoute("/forms/$formId/preview")({
  component: FormPreviewPage,
});

function FormPreviewPage() {
  const { formId } = useParams({ from: "/forms/$formId/preview" });
  const formIdTyped = formId as Id<"forms">;
  const form = useQuery(api.forms.get, { formId: formIdTyped });
  const { questions } = useFormBuilder();

  return (
    <div>
      <h2 className="text-lg font-semibold text-foreground mb-4">Preview</h2>
      <p className="text-muted-foreground mb-6">
        How your form will look to respondents. Edits in the Editor tab update
        here.
      </p>
      <FormPreview
        questions={questions}
        formTitle={form?.title ?? "Untitled form"}
        formDescription={form?.description}
      />
    </div>
  );
}
