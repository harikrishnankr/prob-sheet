/** A proficiency score on the 0–4 scale. */
export type Score = 0 | 1 | 2 | 3 | 4;

export interface ProficiencyLevel {
  score: Score;
  name: string;
  /** Fraction of an area's weight credited at this score (0–1). */
  creditFactor: number;
  definition: string;
  evidence: string;
}

export type ProbeCategory = "core" | "good-to-know";

export interface ProbeArea {
  id: string;
  name: string;
  /** Compact label used in summaries, e.g. "JS". */
  shortName: string;
  category: ProbeCategory;
  /** Core weights must total `rules.coreWeightTotal`; good-to-know weights form the bonus pool. */
  weight: number;
  /**
   * Lowest score a candidate needs in this area to be eligible for a role,
   * keyed by `Role.id`. Omitted role = no requirement.
   */
  minScores: Partial<Record<Role["id"], Score>>;
  rationale: string;
}

export interface Role {
  id: string;
  name: string;
  /** Display label only (e.g. "L11"); seniority comes from the order of `ProbeConfig.roles`. */
  level: string;
  /** Minimum final score (0–100) to clear for this role. */
  minFinalScore: number;
  minExperienceYears: number;
  bar: string;
}

export interface ConfigRules {
  coreWeightTotal: number;
  bonusPoolTotal: number;
  /** Final score (core + bonus) is capped at this value. */
  finalScoreCap: number;
  /** Largest gap (applied level − eligible level) that still recommends one level lower. */
  oneLevelLowerMaxGap: number;
}

export interface ProbeConfig {
  rules: ConfigRules;
  proficiencyScale: ProficiencyLevel[];
  probeAreas: ProbeArea[];
  /** Ordered junior → senior; this order defines seniority. */
  roles: Role[];
}
