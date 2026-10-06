import type { ComponentProps } from "react";
import { cn } from "@/lib/cn";
import { controlClass } from "./field";

/**
 * Native select with a custom chevron (the browser's arrow ignores padding and
 * sits flush against the border). `className` sizes the wrapper, e.g. `w-64`.
 */
export function Select({ className, ...props }: ComponentProps<"select">) {
  return (
    <div className={cn("relative", className)}>
      <select className={cn(controlClass, "w-full appearance-none pr-9")} {...props} />
      <svg
        aria-hidden
        viewBox="0 0 16 16"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.75}
        strokeLinecap="round"
        strokeLinejoin="round"
        className="pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 text-muted"
      >
        <path d="m4 6 4 4 4-4" />
      </svg>
    </div>
  );
}
