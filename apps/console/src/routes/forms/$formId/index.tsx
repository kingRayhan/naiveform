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

function formatLastSaved(ms: number): string {
  const d = new Date(ms);
  const now = new Date();
  const isToday =
    d.getDate() === now.getDate() &&
    d.getMonth() === now.getMonth() &&
    d.getFullYear() === now.getFullYear();
  return isToday
    ? d.toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" })
    : d.toLocaleDateString(undefined, {
        weekday: "short",
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit",
      });
}

function FormEditorPage() {
  const { formId } = useParams({ from: "/forms/$formId/" });
  const formIdTyped = formId as Id<"forms">;
  const form = useQuery(api.forms.get, { formId: formIdTyped });
  const { questions, saveForm } = useFormBuilder();
  const [isSaving, setIsSaving] = useState(false);
  const [lastSavedAt, setLastSavedAt] = useState<number | null>(null);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await saveForm();
      setLastSavedAt(Date.now());
    } finally {
      setIsSaving(false);
    }
  };

  const savedAt = lastSavedAt ?? form?.updatedAt;

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
          <div className="flex items-center gap-3 shrink-0">
            {savedAt != null && (
              <span className="text-xs text-muted-foreground">
                Last saved at {formatLastSaved(savedAt)}
              </span>
            )}
            <Button onClick={handleSave} disabled={isSaving}>
              {isSaving ? "Saving…" : "Save"}
            </Button>
          </div>
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
