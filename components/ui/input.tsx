import type { ComponentProps } from "react";
import { cn } from "@/lib/cn";
import { controlClass } from "./field";

export function Input({ className, ...props }: ComponentProps<"input">) {
  return <input className={cn(controlClass, className)} {...props} />;
}
