import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

type AlertTone = "info" | "warning" | "danger";

const toneClasses: Record<AlertTone, string> = {
  info: "border-accent/30 bg-accent-soft text-foreground",
  warning: "border-amber-500/30 bg-amber-500/10 text-amber-900 dark:text-amber-200",
  danger: "border-rose-500/30 bg-rose-500/10 text-rose-900 dark:text-rose-200",
};

interface AlertProps {
  tone?: AlertTone;
  title: string;
  children?: ReactNode;
}

export function Alert({ tone = "info", title, children }: AlertProps) {
  return (
    <div role={tone === "info" ? "status" : "alert"} className={cn("rounded-lg border px-4 py-3 text-sm", toneClasses[tone])}>
      <p className="font-medium">{title}</p>
      {children && <div className="mt-1">{children}</div>}
    </div>
  );
}
