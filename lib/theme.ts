export type ThemePreference = "light" | "dark" | "system";
export type ResolvedTheme = "light" | "dark";

export const THEME_STORAGE_KEY = "theme";
/** Used until the user picks a theme. */
export const DEFAULT_THEME: ThemePreference = "light";
export const THEME_PREFERENCES: ThemePreference[] = ["light", "system", "dark"];

const DARK_QUERY = "(prefers-color-scheme: dark)";

export function isThemePreference(value: unknown): value is ThemePreference {
  return value === "light" || value === "dark" || value === "system";
}

export function readThemePreference(): ThemePreference {
  try {
    const stored = localStorage.getItem(THEME_STORAGE_KEY);
    return isThemePreference(stored) ? stored : DEFAULT_THEME;
  } catch {
    return DEFAULT_THEME;
  }
}

export function resolveTheme(preference: ThemePreference): ResolvedTheme {
  if (preference !== "system") return preference;
  return window.matchMedia(DARK_QUERY).matches ? "dark" : "light";
}

export function applyTheme(preference: ThemePreference) {
  const theme = resolveTheme(preference);
  const root = document.documentElement;
  root.dataset.theme = theme;
  root.style.colorScheme = theme;
}

export function storeThemePreference(preference: ThemePreference) {
  try {
    localStorage.setItem(THEME_STORAGE_KEY, preference);
  } catch {
    // Storage unavailable (e.g. private mode); the theme still applies for this session.
  }
}

export function watchSystemTheme(onChange: () => void) {
  const media = window.matchMedia(DARK_QUERY);
  media.addEventListener("change", onChange);
  return () => media.removeEventListener("change", onChange);
}

/**
 * Runs in <head> before first paint so the stored theme applies without a flash.
 * Must stay self-contained — it can't import anything.
 */
export const themeInitScript = `(function(){try{var p=localStorage.getItem("${THEME_STORAGE_KEY}")||"${DEFAULT_THEME}";var d=p==="dark"||(p==="system"&&window.matchMedia("${DARK_QUERY}").matches);var t=d?"dark":"light";document.documentElement.dataset.theme=t;document.documentElement.style.colorScheme=t}catch(e){}})()`;
