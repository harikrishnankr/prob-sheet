import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

interface SectionProps {
  title: string;
  /** Shows a numbered marker before the title, for step-by-step content. */
  step?: number;
  description?: string;
  actions?: ReactNode;
  className?: string;
  children: ReactNode;
}

/** A titled card used to group related content on a page. */
export function Section({ title, step, description, actions, className, children }: SectionProps) {
  return (
    <section className={cn("rounded-xl border border-border bg-surface", className)}>
      <div className="flex flex-wrap items-start justify-between gap-3 px-5 pt-5">
        <div className="space-y-1">
          <h2 className="flex items-center gap-2.5 text-base font-semibold">
            {step !== undefined && (
              <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-accent-soft text-xs text-accent tabular-nums">
                {step}
              </span>
            )}
            {title}
          </h2>
          {description && <p className="text-sm text-muted">{description}</p>}
        </div>
        {actions}
      </div>
      <div className="p-5">{children}</div>
    </section>
  );
}
