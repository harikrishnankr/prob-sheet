"use client";

import type { KeyboardEvent, ReactNode } from "react";
import { cn } from "@/lib/cn";

export interface SegmentedOption<T extends string> {
  value: T;
  label: string;
  icon?: ReactNode;
  /** Tooltip text; defaults to `label` when `iconOnly`. */
  title?: string;
}

interface SegmentedControlProps<T extends string> {
  options: SegmentedOption<T>[];
  /** `null` = nothing selected yet. */
  value: T | null;
  onChange: (value: T) => void;
  /** Accessible name for the group. */
  label: string;
  /** Show only icons, keeping labels for screen readers and tooltips. */
  iconOnly?: boolean;
  className?: string;
}

/** A single-choice button group with radio semantics and arrow-key navigation. */
export function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
  label,
  iconOnly = false,
  className,
}: SegmentedControlProps<T>) {
  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    const step = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[event.key];
    if (!step) return;
    event.preventDefault();
    const index = options.findIndex((o) => o.value === value);
    const next =
      index === -1
        ? options[step > 0 ? 0 : options.length - 1]
        : options[(index + step + options.length) % options.length];
    onChange(next.value);
    event.currentTarget.querySelector<HTMLButtonElement>(`[data-value="${next.value}"]`)?.focus();
  }

  return (
    <div
      role="radiogroup"
      aria-label={label}
      onKeyDown={handleKeyDown}
      className={cn("inline-flex rounded-lg border border-border bg-foreground/[.03] p-0.5", className)}
    >
      {options.map((option, i) => {
        const selected = option.value === value;
        // Keep one segment tabbable even when nothing is selected.
        const tabbable = selected || (value === null && i === 0);
        return (
          <button
            key={option.value}
            type="button"
            role="radio"
            aria-checked={selected}
            aria-label={iconOnly ? option.label : undefined}
            title={option.title ?? (iconOnly ? option.label : undefined)}
            tabIndex={tabbable ? 0 : -1}
            data-value={option.value}
            onClick={() => onChange(option.value)}
            className={cn(
              "flex flex-1 items-center justify-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-medium transition-colors",
              "focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-accent",
              selected ? "bg-surface text-foreground shadow-sm" : "text-muted hover:text-foreground",
            )}
          >
            {option.icon}
            {!iconOnly && option.label}
          </button>
        );
      })}
    </div>
  );
}
