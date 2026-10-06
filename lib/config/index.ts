import { probeConfig as rawConfig } from "@/config/probe-config";
import type { ProbeArea, ProbeCategory, ProbeConfig, ProficiencyLevel, Role, Score } from "./types";

export * from "./types";

export const probeConfig: ProbeConfig = rawConfig;

export const CATEGORY_LABELS: Record<ProbeCategory, string> = {
  core: "Core",
  "good-to-know": "Good to know",
};

export function getProficiencyLevel(score: Score): ProficiencyLevel | undefined {
  return probeConfig.proficiencyScale.find((level) => level.score === score);
}

/** Position of a role in the junior → senior order (0 = most junior), or -1 if unknown. */
export function getRoleRank(roleId: Role["id"], config: ProbeConfig = probeConfig): number {
  return config.roles.findIndex((role) => role.id === roleId);
}

export function getAreasByCategory(category: ProbeCategory): ProbeArea[] {
  return probeConfig.probeAreas.filter((area) => area.category === category);
}

export function sumWeights(areas: ProbeArea[]): number {
  // Round to avoid float drift from fractional weights like 2.5.
  return Math.round(areas.reduce((total, area) => total + area.weight, 0) * 100) / 100;
}

/** Returns human-readable problems with the config; empty when valid. */
export function validateConfig(config: ProbeConfig = probeConfig): string[] {
  const errors: string[] = [];
  const { rules, probeAreas, roles, proficiencyScale } = config;

  const coreTotal = sumWeights(probeAreas.filter((a) => a.category === "core"));
  if (coreTotal !== rules.coreWeightTotal) {
    errors.push(`Core weights total ${coreTotal}, expected ${rules.coreWeightTotal}.`);
  }

  const bonusTotal = sumWeights(probeAreas.filter((a) => a.category === "good-to-know"));
  if (bonusTotal !== rules.bonusPoolTotal) {
    errors.push(`Bonus pool totals ${bonusTotal}, expected ${rules.bonusPoolTotal}.`);
  }

  const findDuplicates = (ids: string[]) => ids.filter((id, i) => ids.indexOf(id) !== i);
  for (const id of findDuplicates(probeAreas.map((a) => a.id))) {
    errors.push(`Duplicate probe area id "${id}".`);
  }
  for (const id of findDuplicates(roles.map((r) => r.id))) {
    errors.push(`Duplicate role id "${id}".`);
  }

  const roleIds = new Set(roles.map((r) => r.id));
  for (const area of probeAreas) {
    for (const roleId of Object.keys(area.minScores)) {
      if (!roleIds.has(roleId)) {
        errors.push(`"${area.name}" has a minimum for unknown role "${roleId}".`);
      }
    }
  }

  // Roles are ordered junior → senior, so score bars should never go down.
  roles.forEach((role, i) => {
    const previous = roles[i - 1];
    if (previous && role.minFinalScore < previous.minFinalScore) {
      errors.push(
        `"${role.name}" is listed after "${previous.name}" but has a lower min final score. Roles must be ordered junior → senior.`,
      );
    }
  });

  for (const level of proficiencyScale) {
    if (level.creditFactor < 0 || level.creditFactor > 1) {
      errors.push(`Credit factor for "${level.name}" must be between 0 and 1.`);
    }
  }

  return errors;
}
