"use client";

import { useEffect, useLayoutEffect, useState } from "react";
import { SegmentedControl, type SegmentedOption } from "@/components/ui";
import {
  applyTheme,
  DEFAULT_THEME,
  readThemePreference,
  storeThemePreference,
  watchSystemTheme,
  type ThemePreference,
} from "@/lib/theme";

const iconProps = {
  width: 14,
  height: 14,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round",
  strokeLinejoin: "round",
  "aria-hidden": true,
} as const;

const options: SegmentedOption<ThemePreference>[] = [
  {
    value: "light",
    label: "Light",
    icon: (
      <svg {...iconProps}>
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
      </svg>
    ),
  },
  {
    value: "system",
    label: "System",
    icon: (
      <svg {...iconProps}>
        <rect x="2" y="3" width="20" height="14" rx="2" />
        <path d="M8 21h8M12 17v4" />
      </svg>
    ),
  },
  {
    value: "dark",
    label: "Dark",
    icon: (
      <svg {...iconProps}>
        <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
      </svg>
    ),
  },
];

export function ThemeSwitcher() {
  // Server render has no access to storage, so start at the default and sync after mount.
  // The page colours are already correct via the inline script in <head>; only the
  // selected segment updates here.
  const [preference, setPreference] = useState<ThemePreference>(DEFAULT_THEME);

  useLayoutEffect(() => {
    const stored = readThemePreference();
    // Also re-applies the theme after React's dev-mode remount clears <html> attributes.
    applyTheme(stored);
    // eslint-disable-next-line react-hooks/set-state-in-effect -- syncing from localStorage on mount
    setPreference(stored);
  }, []);

  useEffect(() => {
    if (preference !== "system") return;
    return watchSystemTheme(() => applyTheme("system"));
  }, [preference]);

  function handleChange(next: ThemePreference) {
    setPreference(next);
    storeThemePreference(next);
    applyTheme(next);
  }

  return <SegmentedControl label="Theme" options={options} value={preference} onChange={handleChange} iconOnly />;
}
