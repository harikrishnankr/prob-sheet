import type { ReactNode } from "react";

/** A monospace block for formulas and expressions. */
export function Formula({ children }: { children: ReactNode }) {
  return (
    <div className="overflow-x-auto rounded-lg border border-border bg-foreground/[.03] px-4 py-3 font-mono text-sm">
      {children}
    </div>
  );
}
