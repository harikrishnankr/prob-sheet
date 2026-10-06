import type { ReactNode } from "react";

interface StatProps {
  label: string;
  value: ReactNode;
  hint?: ReactNode;
}

/** A labelled value tile; wrap several in a grid. */
export function Stat({ label, value, hint }: StatProps) {
  return (
    <div className="rounded-lg border border-border px-4 py-3">
      <dt className="text-xs font-medium uppercase tracking-wide text-muted">{label}</dt>
      <dd className="mt-1 text-lg font-semibold tabular-nums">{value}</dd>
      {hint && <dd className="text-xs text-muted">{hint}</dd>}
    </div>
  );
}
