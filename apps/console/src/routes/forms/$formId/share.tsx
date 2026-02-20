import { createFileRoute, useParams } from "@tanstack/react-router";
import { useQuery } from "@repo/convex/react";
import { api } from "@repo/convex";
import type { Id } from "@repo/convex/dataModel";
import { Button } from "@repo/design-system/button";

const FORM_APP_URL = import.meta.env.VITE_FORM_APP_URL ?? "";

export const Route = createFileRoute("/forms/$formId/share")({
  component: FormSharePage,
});

function FormSharePage() {
  const { formId } = useParams({ from: "/forms/$formId/share" });
  const form = useQuery(api.forms.get, { formId: formId as Id<"forms"> });
  const formIdOrSlug = form?.slug?.trim() || formId;
  const formUrl = FORM_APP_URL ? `${FORM_APP_URL.replace(/\/$/, "")}/${formIdOrSlug}` : "";
  const embedUrl = FORM_APP_URL ? `${FORM_APP_URL.replace(/\/$/, "")}/embed/${formIdOrSlug}` : "";

  const headlessActionUrl =
    (import.meta.env.VITE_CONVEX_SITE_URL ?? "").replace(/\/$/, "") +
    (formIdOrSlug ? `/f/${formIdOrSlug}` : "");

  return (
    <div>
      <h2 className="text-lg font-semibold text-foreground mb-4">Share</h2>
      <p className="text-muted-foreground mb-4">
        Share the form link or embed the form on your site.
      </p>
      <div className="space-y-6 max-w-lg">
        <div>
          <label className="block text-sm font-medium text-foreground mb-1">Form link</label>
          <div className="flex gap-2">
            <input
              type="text"
              readOnly
              value={formUrl || "Set VITE_FORM_APP_URL in .env"}
              className="flex-1 px-3 py-2 border border-input rounded-md bg-muted text-foreground text-sm"
            />
            <Button
              variant="secondary"
              onClick={() => formUrl && navigator.clipboard?.writeText(formUrl)}
              disabled={!formUrl}
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
            value={embedUrl ? `<iframe src="${embedUrl}" width="640" height="480" frameborder="0"></iframe>` : "Set VITE_FORM_APP_URL in .env"}
            className="w-full px-3 py-2 border border-input rounded-md bg-muted text-foreground text-sm font-mono"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-foreground mb-1">Headless form (Formspree-style)</label>
          <p className="text-sm text-muted-foreground mb-2">
            Use a plain HTML form and POST to our endpoint. Set <code className="text-xs bg-muted px-1 rounded">VITE_CONVEX_SITE_URL</code> to your Convex HTTP URL (e.g. <code className="text-xs bg-muted px-1 rounded">https://your-deployment.convex.site</code> from the Convex dashboard).
          </p>
          <textarea
            readOnly
            rows={8}
            value={
              headlessActionUrl
                ? `<form action="${headlessActionUrl}" method="post">
  <label for="email">Your Email</label>
  <input name="Email" id="email" type="email" required>
  <button type="submit">Submit</button>
</form>`
                : "Set VITE_CONVEX_SITE_URL in .env (e.g. https://your-deployment.convex.site)"
            }
            className="w-full px-3 py-2 border border-input rounded-md bg-muted text-foreground text-sm font-mono"
          />
          <p className="text-xs text-muted-foreground mt-1">
            Field <code className="bg-muted px-0.5 rounded">name</code> values should match your form question titles (e.g. &quot;Email&quot;, &quot;Full name&quot;).
          </p>
        </div>
      </div>
    </div>
  );
}
