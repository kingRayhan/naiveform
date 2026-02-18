import {
  Outlet,
  createRootRoute,
  Link,
  useLocation,
  Navigate,
} from "@tanstack/react-router";
import { UserButton, useAuth } from "@clerk/clerk-react";

export const Route = createRootRoute({
  component: RootComponent,
});

const AUTH_ROUTES = ["/sign-in", "/sign-up"];

const mainNav = [
  { to: "/", label: "Dashboard" },
  { to: "/templates", label: "Templates" },
];

function RootComponent() {
  const { isSignedIn, isLoaded } = useAuth();
  const { pathname } = useLocation();
  const isAuthRoute = AUTH_ROUTES.some((route) => pathname.startsWith(route));

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-muted-foreground">Loading…</div>
      </div>
    );
  }

  if (!isSignedIn) {
    if (isAuthRoute) {
      return <Outlet />;
    }
    return <Navigate to="/sign-in" />;
  }

  if (isAuthRoute) {
    return <Navigate to="/" />;
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
        <UserButton afterSignOutUrl="/sign-in" />
      </header>
      <main className="flex-1 p-6">
        <Outlet />
      </main>
    </div>
  );
}
