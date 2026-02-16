import { createFileRoute } from "@tanstack/react-router";
import { Button } from "@repo/design-system/button";

export const Route = createFileRoute("/forms/$formId/share")({
  component: FormSharePage,
});

function FormSharePage() {
  const formUrl = typeof window !== "undefined" ? `${window.location.origin}/f/form-id` : "/f/form-id";

  return (
    <div>
      <h2 className="text-lg font-semibold text-foreground mb-4">Share</h2>
      <p className="text-muted-foreground mb-4">
        Share the form link or embed the form on your site.
      </p>
      <div className="space-y-4 max-w-lg">
        <div>
          <label className="block text-sm font-medium text-foreground mb-1">Form link</label>
          <div className="flex gap-2">
            <input
              type="text"
              readOnly
              value={formUrl}
              className="flex-1 px-3 py-2 border border-input rounded-md bg-muted text-foreground text-sm"
            />
            <Button
              variant="secondary"
              onClick={() => navigator.clipboard?.writeText(formUrl)}
            >
              Copy
            </Button>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-foreground mb-1">Embed code</label>
          <textarea
            readOnly
            rows={3}
            value={`<iframe src="${formUrl}" width="640" height="480" frameborder="0"></iframe>`}
            className="w-full px-3 py-2 border border-input rounded-md bg-muted text-foreground text-sm font-mono"
          />
        </div>
      </div>
    </div>
  );
}
