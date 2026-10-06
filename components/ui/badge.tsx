import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

export type BadgeTone = "neutral" | "accent" | "success" | "warning" | "danger";

const toneClasses: Record<BadgeTone, string> = {
  neutral: "bg-foreground/5 text-foreground",
  accent: "bg-accent-soft text-accent",
  success: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400",
  warning: "bg-amber-500/10 text-amber-700 dark:text-amber-400",
  danger: "bg-rose-500/10 text-rose-700 dark:text-rose-400",
};

interface BadgeProps {
  tone?: BadgeTone;
  title?: string;
  className?: string;
  children: ReactNode;
}

export function Badge({ tone = "neutral", title, className, children }: BadgeProps) {
  return (
    <span
      title={title}
      className={cn(
        "inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium tabular-nums",
        toneClasses[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}
