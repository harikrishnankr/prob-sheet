"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/cn";
import { NAV_ROUTES } from "@/lib/routes";

export function MainNav({ className }: { className?: string }) {
  const pathname = usePathname();

  return (
    <nav aria-label="Main" className={cn("flex gap-1 overflow-x-auto", className)}>
      {NAV_ROUTES.map((route) => {
        const active = pathname === route.href || pathname.startsWith(`${route.href}/`);
        return (
          <Link
            key={route.href}
            href={route.href}
            aria-current={active ? "page" : undefined}
            className={cn(
              "relative whitespace-nowrap px-3 py-4 text-sm font-medium transition-colors",
              // Underline indicator aligned to the bar's bottom border.
              "after:absolute after:inset-x-3 after:-bottom-px after:h-0.5 after:rounded-full",
              active
                ? "text-foreground after:bg-accent"
                : "text-muted hover:text-foreground after:bg-transparent",
            )}
          >
            {route.label}
          </Link>
        );
      })}
    </nav>
  );
}
