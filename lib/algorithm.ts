import { getRoleRank, probeConfig, type ProbeArea, type ProbeConfig, type Role, type Score } from "@/lib/config";

/** Scores given per probe area, keyed by `ProbeArea.id`. Unrated areas are omitted. */
export type Ratings = Partial<Record<ProbeArea["id"], Score>>;

export type Recommendation = "recommend" | "one-level-lower" | "not-recommended" | "incomplete";

export const RECOMMENDATION_LABELS: Record<Recommendation, string> = {
  recommend: "Recommend for applied role",
  "one-level-lower": "Recommend one level lower",
  "not-recommended": "Not recommended",
  incomplete: "Incomplete",
};

export interface UnmetMinimum {
  area: ProbeArea;
  required: Score;
  actual: Score | undefined;
}

export interface RoleEligibility {
  role: Role;
  meetsScore: boolean;
  unmetMinimums: UnmetMinimum[];
  eligible: boolean;
}

export interface Evaluation {
  coreScore: number;
  bonus: number;
  finalScore: number;
  /** True when every core area has a rating. */
  complete: boolean;
  roles: RoleEligibility[];
  /** Highest role the candidate is eligible for, or null if none. */
  eligibleRole: Role | null;
  /** Role steps from the eligible role up to the applied role (by config order); null when not eligible for any role. */
  gap: number | null;
  recommendation: Recommendation;
}

/** Points = Weight × credit factor of the rating (i.e. Weight × Rating ÷ 4 on the default scale). */
export function areaPoints(area: ProbeArea, score: Score | undefined, config: ProbeConfig = probeConfig): number {
  if (score === undefined) return 0;
  const factor = config.proficiencyScale.find((level) => level.score === score)?.creditFactor ?? 0;
  return area.weight * factor;
}

function sumPoints(areas: ProbeArea[], ratings: Ratings, config: ProbeConfig) {
  return areas.reduce((total, area) => total + areaPoints(area, ratings[area.id], config), 0);
}

export function getUnmetMinimums(role: Role, ratings: Ratings, config: ProbeConfig = probeConfig): UnmetMinimum[] {
  return config.probeAreas.flatMap((area) => {
    const required = area.minScores[role.id];
    const actual = ratings[area.id];
    return required !== undefined && (actual ?? 0) < required ? [{ area, required, actual }] : [];
  });
}

export function evaluate(ratings: Ratings, appliedRoleId: Role["id"], config: ProbeConfig = probeConfig): Evaluation {
  const { probeAreas, roles, rules } = config;
  const coreAreas = probeAreas.filter((a) => a.category === "core");
  const bonusAreas = probeAreas.filter((a) => a.category === "good-to-know");

  const coreScore = sumPoints(coreAreas, ratings, config);
  const bonus = sumPoints(bonusAreas, ratings, config);
  const finalScore = Math.min(coreScore + bonus, rules.finalScoreCap);
  const complete = coreAreas.every((area) => ratings[area.id] !== undefined);

  // `roles` is ordered junior → senior; seniority is the position in that list.
  const roleResults = roles.map<RoleEligibility>((role) => {
    const meetsScore = finalScore >= role.minFinalScore;
    const unmetMinimums = getUnmetMinimums(role, ratings, config);
    return { role, meetsScore, unmetMinimums, eligible: meetsScore && unmetMinimums.length === 0 };
  });

  const eligibleRank = roleResults.findLastIndex((r) => r.eligible);
  const eligibleRole = eligibleRank === -1 ? null : roles[eligibleRank];
  const appliedRank = getRoleRank(appliedRoleId, config);
  const gap = eligibleRank !== -1 && appliedRank !== -1 ? appliedRank - eligibleRank : null;

  let recommendation: Recommendation;
  if (!complete) recommendation = "incomplete";
  else if (gap === null) recommendation = "not-recommended";
  else if (gap <= 0) recommendation = "recommend";
  else if (gap <= rules.oneLevelLowerMaxGap) recommendation = "one-level-lower";
  else recommendation = "not-recommended";

  return { coreScore, bonus, finalScore, complete, roles: roleResults, eligibleRole, gap, recommendation };
}

/** e.g. "2 levels", "1 level". */
export function formatGap(gap: number): string {
  return `${gap} ${Math.abs(gap) === 1 ? "level" : "levels"}`;
}

/** Formats points with up to two decimals, e.g. 13.5, 2.25, 30. */
export function formatPoints(value: number): string {
  return Number(value.toFixed(2)).toString();
}
