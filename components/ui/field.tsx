import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

/**
 * Shared look for text inputs, selects and textareas. No width here so callers
 * can set one (`cn` doesn't resolve conflicting classes); inside `Field` controls
 * stretch to full width via the flex column.
 */
export const controlClass = cn(
  "rounded-md border border-border bg-surface px-3 py-2 text-sm text-foreground",
  "placeholder:text-muted focus:outline-2 focus:outline-offset-0 focus:outline-accent",
);

interface FieldProps {
  label: string;
  htmlFor: string;
  hint?: ReactNode;
  className?: string;
  children: ReactNode;
}

/** Label + control + optional hint. */
export function Field({ label, htmlFor, hint, className, children }: FieldProps) {
  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <label htmlFor={htmlFor} className="text-sm font-medium">
        {label}
      </label>
      {children}
      {hint && <div className="text-xs text-muted">{hint}</div>}
    </div>
  );
}
