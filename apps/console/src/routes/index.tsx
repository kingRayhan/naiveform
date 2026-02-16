import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@repo/design-system/button";

export const Route = createFileRoute("/")({
  component: DashboardPage,
});

// Mock data – replace with real API
const MOCK_FORMS = [
  { id: "1", title: "Customer feedback", updatedAt: "2 hours ago", responses: 12 },
  { id: "2", title: "Event sign-up", updatedAt: "1 day ago", responses: 0 },
];

function DashboardPage() {
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

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {MOCK_FORMS.map((form) => (
          <Link
            key={form.id}
            to="/forms/$formId"
            params={{ formId: form.id }}
            className="block p-4 border border-border rounded-lg bg-card hover:bg-muted/50 transition-colors text-left"
          >
            <h3 className="font-medium text-foreground truncate">{form.title}</h3>
            <p className="text-sm text-muted-foreground mt-1">
              {form.responses} response{form.responses !== 1 ? "s" : ""} · {form.updatedAt}
            </p>
          </Link>
        ))}
      </div>

      {MOCK_FORMS.length === 0 && (
        <div className="p-8 border border-dashed border-border rounded-lg text-center text-muted-foreground">
          No forms yet. Create your first form to get started.
        </div>
      )}
    </div>
  );
}
