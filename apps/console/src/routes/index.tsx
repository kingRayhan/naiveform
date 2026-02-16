import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@repo/design-system/button";
import { useUser } from "@clerk/clerk-react";
import { useQuery } from "@repo/convex/react";
import { api } from "@repo/convex";

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
  const forms = useQuery(
    api.forms.listByUser,
    user?.id ? { userId: user.id } : "skip"
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
        <Button asChild>
          <Link to="/forms/new">Create form</Link>
        </Button>
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
              <h3 className="font-medium text-foreground truncate">{form.title}</h3>
              <p className="text-sm text-muted-foreground mt-1">
                {form.updatedAt != null
                  ? `Updated ${formatRelativeTime(form.updatedAt)}`
                  : "No responses yet"}
              </p>
            </Link>
          ))}
        </div>
      )}

      {forms?.length === 0 && (
        <div className="p-8 border border-dashed border-border rounded-lg text-center text-muted-foreground">
          No forms yet. Create your first form to get started.
        </div>
      )}
    </div>
  );
}
