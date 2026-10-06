import type { Metadata } from "next";
import {
  Badge,
  DataTable,
  Formula,
  PageHeader,
  RecommendationBadge,
  ScoreBadge,
  Section,
  Stat,
  type Column,
} from "@/components/ui";
import { areaPoints, evaluate, formatGap, formatPoints, type Ratings, type Recommendation, type RoleEligibility } from "@/lib/algorithm";
import { CATEGORY_LABELS, getAreasByCategory, probeConfig, type ProbeArea, type Role, type Score } from "@/lib/config";

export const metadata: Metadata = { title: "Algorithm" };

const { proficiencyScale, probeAreas, roles, rules } = probeConfig;
const coreAreas = getAreasByCategory("core");
const bonusAreas = getAreasByCategory("good-to-know");

/** e.g. "Framework, JS ≥ 3 · TS, Perf ≥ 2" — grouped by required score, highest first. */
function summariseMinimums(role: Role): string {
  const byScore = new Map<Score, string[]>();
  for (const area of probeAreas) {
    const min = area.minScores[role.id];
    if (min !== undefined) byScore.set(min, [...(byScore.get(min) ?? []), area.shortName]);
  }
  if (byScore.size === 0) return "None";
  return [...byScore.entries()]
    .sort(([a], [b]) => b - a)
    .map(([score, names]) => `${names.join(", ")} ≥ ${score}`)
    .join(" · ");
}

const roleBarColumns: Column<Role>[] = [
  { key: "level", header: "Level", align: "center", cell: (r) => <Badge>{r.level}</Badge>, className: "w-16" },
  { key: "role", header: "Role", cell: (r) => <span className="font-medium whitespace-nowrap">{r.name}</span> },
  { key: "score", header: "Final score needed", align: "right", cell: (r) => <span className="tabular-nums">{r.minFinalScore}</span> },
  { key: "minimums", header: "Must-have minimums", cell: (r) => <span className="text-muted">{summariseMinimums(r)}</span> },
];

interface RecommendationRule {
  condition: string;
  recommendation: Recommendation;
}

const lowerGap = rules.oneLevelLowerMaxGap;
const recommendationRules: RecommendationRule[] = [
  { condition: "Gap is 0 or less", recommendation: "recommend" },
  { condition: `Gap is ${lowerGap > 1 ? `1–${lowerGap}` : "1"}`, recommendation: "one-level-lower" },
  { condition: `Gap is ${lowerGap + 1} or more, or not eligible for any role`, recommendation: "not-recommended" },
  { condition: "Not all core areas rated", recommendation: "incomplete" },
];

const recommendationColumns: Column<RecommendationRule>[] = [
  { key: "condition", header: "When", cell: (r) => r.condition },
  { key: "result", header: "Result", cell: (r) => <RecommendationBadge recommendation={r.recommendation} /> },
];

// Worked example: applied for Lead, but ratings only clear the Analyst bar.
const EXAMPLE_APPLIED_ROLE_ID = "lead";
const exampleRatings: Ratings = {
  framework: 2,
  javascript: 2,
  typescript: 1,
  performance: 1,
  "unit-testing": 1,
  accessibility: 1,
  ssr: 1,
  styling: 1,
  seo: 0,
  nodejs: 1,
  graphql: 1,
};
const example = evaluate(exampleRatings, EXAMPLE_APPLIED_ROLE_ID);
const exampleAppliedRole = roles.find((r) => r.id === EXAMPLE_APPLIED_ROLE_ID);

const exampleAreaColumns: Column<ProbeArea>[] = [
  { key: "area", header: "Probe area", cell: (a) => <span className="font-medium">{a.name}</span> },
  { key: "category", header: "Category", cell: (a) => <Badge tone={a.category === "core" ? "accent" : "neutral"}>{CATEGORY_LABELS[a.category]}</Badge> },
  { key: "weight", header: "Weight", align: "right", cell: (a) => <span className="tabular-nums">{a.weight}</span> },
  {
    key: "rating",
    header: "Rating",
    align: "center",
    cell: (a) => {
      const score = exampleRatings[a.id];
      return score === undefined ? <span className="text-muted">—</span> : <ScoreBadge score={score} />;
    },
  },
  {
    key: "points",
    header: "Points",
    align: "right",
    cell: (a) => <span className="tabular-nums">{formatPoints(areaPoints(a, exampleRatings[a.id]))}</span>,
  },
];

const exampleRoleColumns: Column<RoleEligibility>[] = [
  { key: "role", header: "Role", cell: (r) => <span className="font-medium whitespace-nowrap">{r.role.name}</span> },
  {
    key: "score",
    header: "Score bar",
    cell: (r) => (
      <Badge tone={r.meetsScore ? "success" : "danger"}>
        {formatPoints(example.finalScore)} {r.meetsScore ? "≥" : "<"} {r.role.minFinalScore}
      </Badge>
    ),
  },
  {
    key: "minimums",
    header: "Must-haves",
    cell: (r) =>
      r.unmetMinimums.length === 0 ? (
        <Badge tone="success">All met</Badge>
      ) : (
        <span className="text-muted">
          Short on {r.unmetMinimums.map((m) => `${m.area.shortName} (${m.actual ?? 0}/${m.required})`).join(", ")}
        </span>
      ),
  },
  {
    key: "eligible",
    header: "Eligible",
    align: "center",
    cell: (r) => <Badge tone={r.eligible ? "success" : "danger"}>{r.eligible ? "Yes" : "No"}</Badge>,
  },
];

export default function AlgorithmPage() {
  return (
    <>
      <PageHeader
        title="Recommendation algorithm"
        description="How interview ratings turn into a final score, an eligible level and a recommendation. Values come from the Configuration page."
      />

      <Section step={1} title="Rate each area" description="Every probe area gets a score on the proficiency scale.">
        <ul className="flex flex-wrap gap-2">
          {proficiencyScale.map((level) => (
            <li key={level.score}>
              <ScoreBadge score={level.score} showLabel />
            </li>
          ))}
        </ul>
      </Section>

      <Section step={2} title="Points per area" description="Each rating earns a share of the area's weight.">
        <Formula>Points = Weight × Credit factor &nbsp;(= Weight × Rating ÷ 4)</Formula>
        <p className="mt-3 text-sm text-muted">
          e.g. {coreAreas[0].shortName} (weight {coreAreas[0].weight}) rated 3 → {formatPoints(areaPoints(coreAreas[0], 3))} points.
        </p>
      </Section>

      <Section step={3} title="Scores">
        <Formula>
          <p>Core Score = sum of {coreAreas.length} core areas&apos; points &nbsp;(max {rules.coreWeightTotal})</p>
          <p>Bonus &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;= sum of {bonusAreas.length} good-to-know areas&apos; points &nbsp;(max {rules.bonusPoolTotal})</p>
          <p>Final Score = Core + Bonus &nbsp;(capped at {rules.finalScoreCap})</p>
        </Formula>
      </Section>

      <Section step={4} title="Role bars" description="Final score and must-have minimums required per role. Edit these on the Configuration page.">
        <DataTable columns={roleBarColumns} rows={roles} getRowKey={(r) => r.id} />
      </Section>

      <Section step={5} title="Eligible?">
        <Formula>Eligible = Final Score ≥ role bar &nbsp;AND&nbsp; all must-haves met</Formula>
      </Section>

      <Section
        step={6}
        title="Eligible level"
        description="The most senior role the candidate is eligible for. Seniority follows the order roles are listed in the config (junior → senior), not the level label."
      >
        <ol className="flex flex-wrap items-center gap-2 text-sm">
          {roles.map((role, i) => (
            <li key={role.id} className="flex items-center gap-2">
              {i > 0 && <span aria-hidden className="text-muted">→</span>}
              <Badge>
                {role.name} · {role.level}
              </Badge>
            </li>
          ))}
        </ol>
      </Section>

      <Section
        step={7}
        title="Gap"
        description="How many roles the eligible role sits below the applied role in that order."
      >
        <Formula>Gap = position of Applied Role − position of Eligible Role</Formula>
        <p className="mt-3 text-sm text-muted">
          e.g. applied for {roles.at(-1)?.name}, eligible for {roles.at(-2)?.name} → Gap = {formatGap(1)}.
        </p>
      </Section>

      <Section step={8} title="Recommendation">
        <DataTable columns={recommendationColumns} rows={recommendationRules} getRowKey={(r) => r.recommendation} />
      </Section>

      <Section
        title="Worked example"
        description={`Applied for ${exampleAppliedRole?.name} (${exampleAppliedRole?.level}). Computed live with the current configuration.`}
      >
        <div className="flex flex-col gap-5">
          <DataTable columns={exampleAreaColumns} rows={probeAreas} getRowKey={(a) => a.id} />

          <dl className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
            <Stat label="Core score" value={formatPoints(example.coreScore)} hint={`of ${rules.coreWeightTotal}`} />
            <Stat label="Bonus" value={formatPoints(example.bonus)} hint={`of ${rules.bonusPoolTotal}`} />
            <Stat label="Final score" value={formatPoints(example.finalScore)} hint={`capped at ${rules.finalScoreCap}`} />
            <Stat
              label="Eligible level"
              value={example.eligibleRole?.name ?? "None"}
              hint={example.eligibleRole?.level}
            />
            <Stat
              label="Gap"
              value={example.gap === null ? "—" : formatGap(example.gap)}
              hint={example.eligibleRole ? `${exampleAppliedRole?.name} → ${example.eligibleRole.name}` : "Not eligible for any role"}
            />
            <Stat label="Result" value={<RecommendationBadge recommendation={example.recommendation} />} />
          </dl>

          <DataTable columns={exampleRoleColumns} rows={example.roles} getRowKey={(r) => r.role.id} />
        </div>
      </Section>
    </>
  );
}
