import type { ComponentProps } from "react";
import { cn } from "@/lib/cn";

export type ButtonVariant = "primary" | "secondary" | "ghost";

const variantClasses: Record<ButtonVariant, string> = {
  primary: "bg-accent text-white hover:opacity-90 dark:text-background",
  secondary: "border border-border bg-surface text-foreground hover:bg-foreground/5",
  ghost: "text-muted hover:bg-foreground/5 hover:text-foreground",
};

/** Button styles, for elements that should look like a button (e.g. links). */
export function buttonClass(variant: ButtonVariant = "secondary", className?: string) {
  return cn(
    "inline-flex items-center justify-center gap-1.5 rounded-md px-3 py-2 text-sm font-medium transition-colors",
    "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent disabled:pointer-events-none disabled:opacity-50",
    "aria-disabled:opacity-50",
    variantClasses[variant],
    className,
  );
}

interface ButtonProps extends ComponentProps<"button"> {
  variant?: ButtonVariant;
}

export function Button({ variant = "secondary", type = "button", className, ...props }: ButtonProps) {
  return <button type={type} className={buttonClass(variant, className)} {...props} />;
}
