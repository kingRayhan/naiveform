import { createFileRoute, Link, Outlet, useParams } from "@tanstack/react-router";
import { useQuery } from "@repo/convex/react";
import { api } from "@repo/convex";
import type { Id } from "@repo/convex/dataModel";
import { FormBuilderProvider } from "@/components/form-builder/FormBuilderProvider";

export const Route = createFileRoute("/forms/$formId")({
  component: FormLayoutPage,
});

const formNav: { to: string; label: string }[] = [
  { to: "/forms/$formId/", label: "Editor" },
  { to: "/forms/$formId/settings", label: "Settings" },
  { to: "/forms/$formId/responses", label: "Responses" },
  { to: "/forms/$formId/share", label: "Share" },
];

function FormLayoutPage() {
  const { formId } = useParams({ from: "/forms/$formId" });
  const formIdTyped = formId as Id<"forms">;
  const form = useQuery(api.forms.get, { formId: formIdTyped });

  if (form === undefined) {
    return (
      <div className="p-6 text-muted-foreground">Loading form…</div>
    );
  }
  if (form === null) {
    return (
      <div className="p-6">
        <p className="text-destructive">Form not found.</p>
        <Link to="/" className="text-sm text-primary hover:underline mt-2 inline-block">
          Back to dashboard
        </Link>
      </div>
    );
  }

  return (
    <FormBuilderProvider
      formId={formIdTyped}
      initialQuestions={form.questions}
    >
      <div>
        <div className="flex items-center gap-4 mb-4">
          <Link to="/" className="text-muted-foreground hover:text-foreground text-sm">
            ← Back to dashboard
          </Link>
        </div>
        <nav className="flex gap-2 border-b border-border pb-2 mb-6">
          {formNav.map(({ to, label }) => (
            <Link
              key={to}
              to={to}
              params={{ formId }}
              activeProps={{ className: "font-medium text-foreground" }}
              inactiveProps={{ className: "text-muted-foreground hover:text-foreground" }}
              className="px-3 py-1.5 rounded-md text-sm"
            >
              {label}
            </Link>
          ))}
        </nav>
        <Outlet />
      </div>
    </FormBuilderProvider>
  );
}
