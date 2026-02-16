import type { ReactNode } from "react";
import { cn } from "../lib/utils";

type FormFieldGroupProps = {
  title: string;
  description?: string;
  children: ReactNode;
  className?: string;
};

/**
 * Groups form fields under a section title (e.g. "Response options", "Status").
 * Use with FormCheckbox or other form controls inside.
 */
export function FormFieldGroup({
  title,
  description,
  children,
  className,
}: FormFieldGroupProps) {
  return (
    <div className={cn("space-y-4", className)}>
      <div>
        <span className="block text-sm font-medium text-foreground">{title}</span>
        {description && (
          <p className="mt-0.5 text-sm text-muted-foreground">{description}</p>
        )}
      </div>
      <div className="space-y-3">{children}</div>
    </div>
  );
}
