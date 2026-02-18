import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Button } from "@repo/design-system/button";
import { useUser } from "@clerk/clerk-react";
import { useQuery } from "@repo/convex/react";
import { api } from "@repo/convex";
import { TEMPLATES } from "@/lib/templates.config";

export const Route = createFileRoute("/")({
  component: DashboardPage,
});

function formatRelativeTime(ms: number) {
  const sec = Math.floor((Date.now() - ms) / 1000);
  if (sec < 60) return "just now";
  if (sec < 3600) return `${Math.floor(sec / 60)} min ago`;
  if (sec < 86400) return `${Math.floor(sec / 3600)} hours ago`;
  if (sec < 604800) return `${Math.floor(sec / 86400)} days ago`;
  return "long ago";
}

function DashboardPage() {
  const { user } = useUser();
  const [showArchived, setShowArchived] = useState(false);
  const forms = useQuery(
    api.forms.listByUser,
    user?.id ? { userId: user.id, showArchivedOnly: showArchived } : "skip"
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
          <p className="mt-1 text-muted-foreground">
            Your forms will appear here.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant={showArchived ? "secondary" : "outline"}
            size="sm"
            onClick={() => setShowArchived(!showArchived)}
          >
            {showArchived ? "Hide archived" : "Show archived"}
          </Button>
          <Button asChild>
            <Link to="/forms/new">Create form</Link>
          </Button>
        </div>
      </div>

      {forms === undefined ? (
        <div className="p-8 text-center text-muted-foreground">Loading…</div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {forms.map((form) => (
            <Link
              key={form._id}
              to="/forms/$formId"
              params={{ formId: form._id }}
              className="block p-4 border border-border rounded-lg bg-card hover:bg-muted/50 transition-colors text-left"
            >
              <div className="flex items-center gap-2">
                <h3 className="font-medium text-foreground truncate">{form.title}</h3>
                {form.archived && (
                  <span className="shrink-0 rounded px-1.5 py-0.5 text-xs bg-muted text-muted-foreground">
                    Archived
                  </span>
                )}
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                {form.updatedAt != null
                  ? `Updated ${formatRelativeTime(form.updatedAt)}`
                  : "No responses yet"}
              </p>
            </Link>
          ))}
        </div>
      )}

      {forms?.length === 0 && !showArchived && (
        <EmptyState />
      )}
      {forms?.length === 0 && showArchived && (
        <div className="rounded-lg border border-dashed border-border p-8 text-center text-muted-foreground">
          No archived forms.
        </div>
      )}
    </div>
  );
}

const POPULAR_TEMPLATE_IDS = ["feedback", "contact", "event-registration", "quiz"];

function EmptyState() {
  const popularTemplates = POPULAR_TEMPLATE_IDS
    .map((id) => TEMPLATES.find((t) => t.id === id))
    .filter(Boolean);

  return (
    <div className="rounded-xl border border-dashed border-border bg-muted/30 p-10 sm:p-12 text-center">
      <h2 className="text-xl font-semibold text-foreground">
        Create your first form
      </h2>
      <p className="mt-2 text-muted-foreground max-w-md mx-auto">
        Start from scratch or pick a template to get going quickly.
      </p>
      <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
        <Button asChild size="lg">
          <Link to="/forms/new">Create blank form</Link>
        </Button>
        <Button asChild variant="outline" size="lg">
          <Link to="/templates">Browse templates</Link>
        </Button>
      </div>
      {popularTemplates.length > 0 && (
        <div className="mt-10 pt-8 border-t border-border">
          <p className="text-sm font-medium text-foreground mb-4">
            Or start from a popular template
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {popularTemplates.map((t) => (
              <Link
                key={t!.id}
                to="/forms/new"
                search={{ templateId: t!.id }}
                className="block p-4 rounded-lg border border-border bg-card hover:bg-muted/50 hover:border-primary/50 transition-colors text-left"
              >
                <span className="font-medium text-foreground text-sm">{t!.name}</span>
                <p className="mt-0.5 text-xs text-muted-foreground line-clamp-2">
                  {t!.description}
                </p>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
