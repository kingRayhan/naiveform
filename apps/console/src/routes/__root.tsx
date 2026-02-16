import { Outlet, createRootRoute, Link } from "@tanstack/react-router";
import { UserButton, useAuth } from "@clerk/clerk-react";
import { useEffect } from "react";

export const Route = createRootRoute({
  component: RootComponent,
});

const mainNav = [
  { to: "/", label: "Dashboard" },
  { to: "/templates", label: "Templates" },
  { to: "/settings", label: "Settings" },
];

function RootComponent() {
  const { isSignedIn } = useAuth();
  const isAuthRoute = window.location.pathname === "/sign-in";

  useEffect(() => {
    if (!isSignedIn && !isAuthRoute) {
      window.location.href = "/sign-in";
    }
  }, [isSignedIn, isAuthRoute]);

  if (!isSignedIn) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="border-b border-border px-4 py-3 flex items-center justify-between">
        <nav className="flex items-center gap-6">
          <Link
            to="/"
            className="font-semibold text-lg text-foreground hover:opacity-80"
          >
            Naive Form
          </Link>
          <div className="flex gap-1">
            {mainNav.map(({ to, label }) => (
              <Link
                key={to}
                to={to}
                activeProps={{ className: "font-medium text-foreground" }}
                inactiveProps={{
                  className: "text-muted-foreground hover:text-foreground",
                }}
                className="px-3 py-1.5 rounded-md text-sm"
              >
                {label}
              </Link>
            ))}
          </div>
        </nav>
        <UserButton afterSignOutUrl="/" />
      </header>
      <main className="flex-1 p-6">
        <Outlet />
      </main>
    </div>
  );
}
