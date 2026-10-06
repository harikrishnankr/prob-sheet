/**
 * Interview probe configuration — edit this file to add, change or remove
 * proficiency levels, probe areas and roles.
 *
 * - Core weights must total `rules.coreWeightTotal` (100).
 * - Good-to-know weights form a bonus pool totalling `rules.bonusPoolTotal` (10).
 * - `minScores` keys must be role ids from `roles`; leave a role out for "no requirement".
 * - `roles` must be listed junior → senior. That order defines seniority (eligible
 *   level, gap); `level` is only a display label and can be anything, e.g. "L11".
 *
 * These rules are checked by `validateConfig` and surfaced on the Configuration page.
 */
import type { ProbeConfig } from "@/lib/config/types";

export const probeConfig = {
  rules: {
    coreWeightTotal: 100,
    bonusPoolTotal: 10,
    finalScoreCap: 100,
    /** Largest gap (applied level − eligible level) that still recommends one level lower. */
    oneLevelLowerMaxGap: 1,
  },

  proficiencyScale: [
    {
      score: 0,
      name: "No Exposure",
      creditFactor: 0,
      definition: "Has not used it and cannot describe it meaningfully.",
      evidence: "Guesses, or says 'never worked on it'.",
    },
    {
      score: 1,
      name: "Conceptual Awareness",
      creditFactor: 0.25,
      definition: "Can explain what it is and why it matters; little or no applied use.",
      evidence: "Textbook answers; struggles with 'how would you implement…'.",
    },
    {
      score: 2,
      name: "Guided Practitioner",
      creditFactor: 0.5,
      definition: "Has applied it in real work with support, references or existing patterns.",
      evidence: "Can describe what they did but not trade-offs or failure modes.",
    },
    {
      score: 3,
      name: "Independent Practitioner",
      creditFactor: 0.75,
      definition: "Delivers production work unaided; debugs, makes and defends trade-offs.",
      evidence: "Concrete war stories, edge cases, measured outcomes.",
    },
    {
      score: 4,
      name: "Expert / Multiplier",
      creditFactor: 1,
      definition: "Designs approaches, sets standards, reviews and mentors others on it.",
      evidence: "Talks in principles + governance; has changed how a team works.",
    },
  ],

  probeAreas: [
    // Core
    {
      id: "framework",
      name: "Framework (React / Angular / Vue)",
      shortName: "Framework",
      category: "core",
      weight: 18,
      minScores: { analyst: 1, "senior-analyst": 2, lead: 3, architect: 3 },
      rationale: "Day-one productivity; most code written here.",
    },
    {
      id: "javascript",
      name: "Core JavaScript",
      shortName: "JS",
      category: "core",
      weight: 18,
      minScores: { analyst: 1, "senior-analyst": 2, lead: 3, architect: 3 },
      rationale: "Foundation for debugging anything the framework hides.",
    },
    {
      id: "typescript",
      name: "TypeScript",
      shortName: "TS",
      category: "core",
      weight: 10,
      minScores: { "senior-analyst": 1, lead: 2, architect: 3 },
      rationale: "Type design drives API contracts & refactor safety.",
    },
    {
      id: "performance",
      name: "Performance",
      shortName: "Perf",
      category: "core",
      weight: 10,
      minScores: { "senior-analyst": 1, lead: 2, architect: 3 },
      rationale: "Differentiates senior/lead; direct business impact.",
    },
    {
      id: "unit-testing",
      name: "Unit Testing",
      shortName: "Testing",
      category: "core",
      weight: 9,
      minScores: { "senior-analyst": 1, lead: 2, architect: 2 },
      rationale: "Quality culture; leads must set the bar.",
    },
    {
      id: "accessibility",
      name: "Accessibility",
      shortName: "A11y",
      category: "core",
      weight: 8,
      minScores: { "senior-analyst": 1, lead: 2, architect: 2 },
      rationale: "Legal/compliance risk; often weak in candidates.",
    },
    {
      id: "ssr",
      name: "SSR (Next.js or other)",
      shortName: "SSR",
      category: "core",
      weight: 8,
      minScores: { lead: 2, architect: 3 },
      rationale: "Rendering strategy is an architectural decision.",
    },
    {
      id: "styling",
      name: "Styling (CSS / design systems)",
      shortName: "Styling",
      category: "core",
      weight: 7,
      minScores: { analyst: 1, "senior-analyst": 2, lead: 2, architect: 2 },
      rationale: "Everyone needs it; ceiling matters less than floor.",
    },
    {
      id: "seo",
      name: "SEO",
      shortName: "SEO",
      category: "core",
      weight: 5,
      minScores: { lead: 1, architect: 2 },
      rationale: "Important for public sites; narrower scope.",
    },
    {
      id: "nodejs",
      name: "Node.js (runtime & tooling)",
      shortName: "Node.js",
      category: "core",
      weight: 7,
      minScores: { lead: 1, architect: 2 },
      rationale: "Build tooling, BFFs, scripts.",
    },

    // Good to know (bonus pool)
    {
      id: "node-backend",
      name: "Node Backend (Express / Fastify / NestJS)",
      shortName: "Node Backend",
      category: "good-to-know",
      weight: 3,
      minScores: {},
      rationale: "Bonus: full-stack reach.",
    },
    {
      id: "graphql",
      name: "GraphQL",
      shortName: "GraphQL",
      category: "good-to-know",
      weight: 2.5,
      minScores: {},
      rationale: "Bonus: API layer breadth.",
    },
    {
      id: "ui-ux-figma",
      name: "UI/UX & Figma",
      shortName: "UI/UX",
      category: "good-to-know",
      weight: 2,
      minScores: {},
      rationale: "Bonus: design collaboration.",
    },
    {
      id: "mobile",
      name: "Mobile App Development",
      shortName: "Mobile",
      category: "good-to-know",
      weight: 2.5,
      minScores: {},
      rationale: "Bonus: cross-platform reach.",
    },
  ],

  // Junior → senior. Order matters: it drives eligible level and gap.
  roles: [
    {
      id: "analyst",
      name: "Analyst",
      level: "L11",
      minFinalScore: 30,
      minExperienceYears: 0,
      bar: "Conceptual everywhere, guided in framework/JS/CSS.",
    },
    {
      id: "senior-analyst",
      name: "Senior Analyst",
      level: "L10",
      minFinalScore: 50,
      minExperienceYears: 3,
      bar: "Guided practitioner across the board.",
    },
    {
      id: "lead",
      name: "Specialist/Lead",
      level: "L9",
      minFinalScore: 68,
      minExperienceYears: 5,
      bar: "Independent in most core areas; can own a feature area.",
    },
    {
      id: "architect",
      name: "Architect",
      level: "L8",
      minFinalScore: 82,
      minExperienceYears: 9,
      bar: "Independent everywhere, expert in several.",
    },
  ],
} satisfies ProbeConfig;
