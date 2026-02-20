import { createFileRoute, useParams } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { useQuery, useMutation } from "@repo/convex/react";
import { api } from "@repo/convex";
import type { Id } from "@repo/convex/dataModel";
import { getErrorMessage } from "@repo/convex/error";
import { Button } from "@repo/design-system/button";
import { FormFieldGroup } from "@repo/design-system/form/form-field-group";
import { Input } from "@repo/design-system/input";
import { HelpCircle, Plus, Trash2 } from "lucide-react";

const WEBHOOK_PAYLOAD_EXAMPLE = {
  answers: {
    Email: "juqol@mailinator.com",
    "Full name": "Sit quasi quia quos ",
    "Phone number": "Inventore ut eos au",
  },
  formId: "j575b59bka9zt12b58xv2c8yfn81ddej",
  formTitle: "Event Registration",
  responseId: "j9703s523a2sr9kf2defzzy91581dq35",
  submittedAt: 1771452682412.579,
};

export const Route = createFileRoute("/forms/$formId/webhooks")({
  component: FormWebhooksPage,
});

function FormWebhooksPage() {
  const { formId } = useParams({ from: "/forms/$formId/webhooks" });
  const formIdTyped = formId as Id<"forms">;
  const form = useQuery(api.forms.get, { formId: formIdTyped });
  const logs = useQuery(api.responses.listWebhookLogsByForm, {
    formId: formIdTyped,
    limit: 100,
  });
  const updateForm = useMutation(api.forms.update);
  const [webhookUrls, setWebhookUrls] = useState<string[]>([]);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const hasSyncedRef = useRef(false);
  const prevFormIdRef = useRef(formId);

  useEffect(() => {
    if (!form) return;
    if (prevFormIdRef.current !== formId) {
      prevFormIdRef.current = formId;
      hasSyncedRef.current = false;
    }
    if (hasSyncedRef.current) return;
    hasSyncedRef.current = true;
    const urls = (Array.isArray(form.settings?.webhooks) ? form.settings.webhooks : []) as string[];
    queueMicrotask(() => setWebhookUrls(urls));
  }, [form, formId]);

  const handleSaveWebhooks = async () => {
    if (!form) return;
    setSaveError(null);
    setSaving(true);
    const trimmed = webhookUrls.map((u) => u.trim()).filter((u) => u.length > 0);
    try {
      await updateForm({
        formId: formIdTyped,
        settings: {
          ...form.settings,
          webhooks: trimmed,
        },
      });
    } catch (err) {
      setSaveError(getErrorMessage(err, "Failed to save webhooks"));
    } finally {
      setSaving(false);
    }
  };

  if (form === undefined || logs === undefined) {
    return (
      <div className="text-muted-foreground">Loading webhooks…</div>
    );
  }
  if (form === null) {
    return (
      <div className="text-destructive">Form not found.</div>
    );
  }

  return (
    <div className="space-y-8">
      <FormFieldGroup
        title="Webhook URLs"
        description="We'll POST the submission payload (form title, response ID, submitted at, answers) to each URL when someone submits the form."
      >
        <div className="space-y-4">
          <div className="flex items-center gap-1.5">
            <span className="block text-sm font-medium text-foreground">
              Endpoints
            </span>
            <span className="relative inline-flex group">
              <button
                type="button"
                className="rounded p-0.5 text-muted-foreground hover:text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                aria-label="Example webhook payload"
              >
                <HelpCircle className="h-4 w-4" />
              </button>
              <span className="absolute left-0 bottom-full z-50 mb-1.5 hidden w-[min(400px,90vw)] rounded-md border border-border bg-popover px-3 py-2.5 shadow-md group-hover:block">
                <span className="text-xs font-medium text-foreground">
                  Example payload (POST body)
                </span>
                <pre className="mt-1.5 overflow-x-auto whitespace-pre-wrap wrap-break-word text-xs text-muted-foreground">
                  {JSON.stringify(WEBHOOK_PAYLOAD_EXAMPLE, null, 2)}
                </pre>
              </span>
            </span>
          </div>
          <div className="space-y-2">
            {webhookUrls.map((url, i) => (
              <div key={i} className="flex gap-2 items-start">
                <div className="flex-1 space-y-1.5">
                  <label
                    htmlFor={`webhook-${i}`}
                    className="block text-sm font-medium text-foreground"
                  >
                    Webhook {i + 1}
                  </label>
                  <Input
                    id={`webhook-${i}`}
                    type="text"
                    value={url}
                    onChange={(e) =>
                      setWebhookUrls((prev) => {
                        const next = [...prev];
                        next[i] = e.target.value;
                        return next;
                      })
                    }
                    placeholder="https://your-server.com/webhook"
                    className="w-full"
                  />
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="shrink-0 text-muted-foreground hover:text-destructive mt-8"
                  onClick={() =>
                    setWebhookUrls((prev) => prev.filter((_, j) => j !== i))
                  }
                  aria-label="Remove webhook"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setWebhookUrls((prev) => [...prev, ""])}
              className="gap-1.5"
            >
              <Plus className="h-4 w-4" />
              Add webhook URL
            </Button>
          </div>
          {saveError && (
            <p className="text-sm text-destructive" role="alert">
              {saveError}
            </p>
          )}
          <Button
            type="button"
            onClick={handleSaveWebhooks}
            disabled={saving}
          >
            {saving ? "Saving…" : "Save webhooks"}
          </Button>
        </div>
      </FormFieldGroup>

      <FormFieldGroup
        title="Delivery logs"
        description="Recent webhook delivery attempts for this form."
      >
        {logs.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No deliveries yet. Submissions will appear here once webhooks are
            configured and a response is submitted.
          </p>
        ) : (
          <div className="overflow-x-auto rounded-lg border border-border">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  <th className="px-4 py-3 text-left font-medium text-foreground">
                    Time
                  </th>
                  <th className="px-4 py-3 text-left font-medium text-foreground">
                    Response
                  </th>
                  <th className="px-4 py-3 text-left font-medium text-foreground">
                    URL
                  </th>
                  <th className="px-4 py-3 text-left font-medium text-foreground">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {logs.map((log) => (
                  <tr
                    key={log._id}
                    className="border-b border-border last:border-0 hover:bg-muted/30"
                  >
                    <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">
                      {new Date(log._creationTime).toLocaleString(undefined, {
                        dateStyle: "short",
                        timeStyle: "short",
                      })}
                    </td>
                    <td className="px-4 py-3 font-mono text-xs text-foreground">
                      {log.responseId.slice(-8)}
                    </td>
                    <td
                      className="px-4 py-3 text-foreground max-w-[280px] truncate"
                      title={log.url}
                    >
                      {log.url}
                    </td>
                    <td className="px-4 py-3">
                      {log.success ? (
                        <span className="text-green-600 dark:text-green-400">
                          {log.statusCode ?? "OK"}
                        </span>
                      ) : (
                        <span
                          className="text-destructive"
                          title={log.errorMessage}
                        >
                          {log.statusCode ?? "Error"}
                          {log.errorMessage && (
                            <span className="block truncate max-w-[220px] text-xs text-muted-foreground">
                              {log.errorMessage}
                            </span>
                          )}
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </FormFieldGroup>
    </div>
  );
}
