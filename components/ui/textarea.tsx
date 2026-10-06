import type { ComponentProps } from "react";
import { cn } from "@/lib/cn";
import { controlClass } from "./field";

export function Textarea({ className, rows = 2, ...props }: ComponentProps<"textarea">) {
  return <textarea rows={rows} className={cn(controlClass, "resize-y", className)} {...props} />;
}
