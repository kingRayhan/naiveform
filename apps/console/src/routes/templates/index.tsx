import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Eye, FilePlus } from "lucide-react";
import { Button } from "@repo/design-system/button";
import { TEMPLATES, getTemplateById } from "@/lib/templates.config";
import { FormPreview } from "@/components/form-builder/FormPreview";

export const Route = createFileRoute("/templates/")({
  component: TemplatesPage,
});

function TemplatesPage() {
  const [previewTemplateId, setPreviewTemplateId] = useState<string | null>(null);
  const previewTemplate = previewTemplateId ? getTemplateById(previewTemplateId) : null;

  return (
    <div>
      <h1 className="text-2xl font-bold text-foreground">Templates</h1>
      <p className="mt-1 text-muted-foreground mb-6">
        Start from a template or create a blank form.
      </p>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {TEMPLATES.map((t) => (
          <div
            key={t.id}
            className="p-4 border border-border rounded-lg bg-card hover:bg-muted/50 transition-colors"
          >
            <h3 className="font-medium text-foreground">{t.name}</h3>
            <p className="text-sm text-muted-foreground mt-1">{t.description}</p>
            <div className="mt-3 flex gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setPreviewTemplateId(t.id)}
              >
                <Eye className="size-3.5 shrink-0" aria-hidden />
                Preview
              </Button>
              <Button variant="outline" size="sm" asChild>
                <Link to="/forms/new" search={{ templateId: t.id }}>
                  <FilePlus className="size-3.5 shrink-0" aria-hidden />
                  Use template
                </Link>
              </Button>
            </div>
          </div>
        ))}
      </div>

      {previewTemplate && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={() => setPreviewTemplateId(null)}
          role="dialog"
          aria-modal="true"
          aria-label="Template preview"
        >
          <div
            className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-lg bg-background shadow-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-border bg-background px-4 py-3">
              <span className="font-medium text-foreground">
                Preview: {previewTemplate.name}
              </span>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setPreviewTemplateId(null)}
              >
                Close
              </Button>
            </div>
            <div className="p-4">
              <FormPreview
                formTitle={previewTemplate.form.title}
                formDescription={previewTemplate.form.description}
                questions={previewTemplate.form.questions}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
