import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Eye, FilePlus } from "lucide-react";
import { Button } from "@repo/design-system/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@repo/design-system/dialog";
import { TEMPLATES, getTemplateById } from "@/lib/templates.config";
import { FormPreview } from "@/components/form-builder/FormPreview";

export const Route = createFileRoute("/templates/")({
  component: TemplatesPage,
});

function TemplatesPage() {
  const [previewTemplateId, setPreviewTemplateId] = useState<string | null>(
    null
  );
  const previewTemplate = previewTemplateId
    ? getTemplateById(previewTemplateId)
    : null;

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
            <p className="text-sm text-muted-foreground mt-1">
              {t.description}
            </p>
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

      <Dialog
        open={!!previewTemplate}
        onOpenChange={(open) => !open && setPreviewTemplateId(null)}
      >
        {previewTemplate && (
          <DialogContent className="max-h-[90vh] max-w-2xl flex flex-col gap-0 p-0 overflow-hidden">
            <DialogHeader className="shrink-0 border-b border-border px-4 py-3">
              <DialogTitle>Preview: {previewTemplate.name}</DialogTitle>
            </DialogHeader>
            <div className="min-h-0 overflow-y-auto p-4">
              <FormPreview
                formTitle={previewTemplate.form.title}
                formDescription={previewTemplate.form.description}
                questions={previewTemplate.form.questions}
              />
            </div>
            <DialogFooter className="shrink-0 border-t border-border px-4 py-3">
              <Button variant="outline" size="sm" asChild>
                <Link
                  to="/forms/new"
                  search={{ templateId: previewTemplate.id }}
                  onClick={() => setPreviewTemplateId(null)}
                >
                  <FilePlus className="size-3.5 shrink-0" aria-hidden />
                  Use template
                </Link>
              </Button>
            </DialogFooter>
          </DialogContent>
        )}
      </Dialog>
    </div>
  );
}
