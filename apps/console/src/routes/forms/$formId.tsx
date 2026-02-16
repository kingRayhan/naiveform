import { createFileRoute, Link, Outlet, useParams } from "@tanstack/react-router";

export const Route = createFileRoute("/forms/$formId")({
  component: FormLayoutPage,
});

const formNav: { to: string; label: string }[] = [
  { to: "/forms/$formId/", label: "Editor" },
  { to: "/forms/$formId/settings", label: "Settings" },
  { to: "/forms/$formId/preview", label: "Preview" },
  { to: "/forms/$formId/responses", label: "Responses" },
  { to: "/forms/$formId/share", label: "Share" },
];

function FormLayoutPage() {
  const { formId } = useParams({ from: "/forms/$formId" });

  return (
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
  );
}
