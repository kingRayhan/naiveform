import { createFileRoute, useParams } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery } from "@repo/convex/react";
import { api } from "@repo/convex";
import type { Id } from "@repo/convex/dataModel";
import { FormEditor } from "../../../components/form-builder/FormEditor";
import { FormPreview } from "../../../components/form-builder/FormPreview";
import { useFormBuilder } from "@/components/form-builder/form-builder-context";
import { Button } from "@repo/design-system/button";

export const Route = createFileRoute("/forms/$formId/")({
  component: FormEditorPage,
});

function FormEditorPage() {
  const { formId } = useParams({ from: "/forms/$formId/" });
  const formIdTyped = formId as Id<"forms">;
  const form = useQuery(api.forms.get, { formId: formIdTyped });
  const { questions, saveForm } = useFormBuilder();
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await saveForm();
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 xl:gap-8">
      <div>
        <div className="flex items-center justify-between gap-4 mb-4">
          <div>
            <h2 className="text-lg font-semibold text-foreground">Editor</h2>
            <p className="text-muted-foreground text-sm">
              Drag the handle to reorder. Edit title and options inline.
            </p>
          </div>
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving ? "Saving…" : "Save"}
          </Button>
        </div>
        <FormEditor />
      </div>
      <div className="lg:sticky lg:top-6 lg:self-start">
        <h2 className="text-lg font-semibold text-foreground mb-2">Preview</h2>
        <p className="text-muted-foreground text-sm mb-4">
          How respondents will see the form.
        </p>
        <FormPreview
          questions={questions}
          formTitle={form?.title ?? "Untitled form"}
          formDescription={form?.description}
        />
      </div>
    </div>
  );
}
