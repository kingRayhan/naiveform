import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/forms/$formId/preview")({
  component: FormPreviewPage,
});

function FormPreviewPage() {
  return (
    <div>
      <h2 className="text-lg font-semibold text-foreground mb-4">Preview</h2>
      <p className="text-muted-foreground mb-4">
        Read-only preview of the form as respondents will see it.
      </p>
      <div className="p-6 border border-dashed border-border rounded-lg text-center text-muted-foreground">
        Preview coming soon.
      </div>
    </div>
  );
}
