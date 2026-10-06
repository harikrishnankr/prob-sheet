export interface NavRoute {
  href: "/configuration" | "/algorithm" | "/probe-sheet";
  label: string;
  description: string;
}

export const NAV_ROUTES: NavRoute[] = [
  {
    href: "/configuration",
    label: "Configuration",
    description: "Role ratings, score mappings and minimum ratings.",
  },
  {
    href: "/algorithm",
    label: "Algorithm",
    description: "How probe scores are turned into a final rating.",
  },
  {
    href: "/probe-sheet",
    label: "Probe Sheet",
    description: "Run an interview and record scores per probe area.",
  },
];
