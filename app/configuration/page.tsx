import type { Metadata } from "next";
import { Alert, Badge, DataTable, PageHeader, ScoreBadge, Section, type Column } from "@/components/ui";
import {
  getAreasByCategory,
  probeConfig,
  sumWeights,
  validateConfig,
  type ProbeArea,
  type ProficiencyLevel,
  type Role,
} from "@/lib/config";

export const metadata: Metadata = { title: "Configuration" };

const { rules, proficiencyScale, roles } = probeConfig;

const scaleColumns: Column<ProficiencyLevel>[] = [
  { key: "score", header: "Score", align: "center", cell: (l) => <ScoreBadge score={l.score} />, className: "w-16" },
  { key: "name", header: "Rating", cell: (l) => <span className="font-medium whitespace-nowrap">{l.name}</span> },
  { key: "credit", header: "Credit", align: "right", cell: (l) => `${Math.round(l.creditFactor * 100)}%` },
  { key: "definition", header: "Definition", cell: (l) => l.definition },
  { key: "evidence", header: "Typical evidence", cell: (l) => <span className="text-muted">{l.evidence}</span> },
];

function areaColumns(areas: ProbeArea[], { withMinScores }: { withMinScores: boolean }): Column<ProbeArea>[] {
  return [
    {
      key: "name",
      header: "Probe area",
      cell: (a) => <span className="font-medium">{a.name}</span>,
      footer: "Total",
    },
    {
      key: "weight",
      header: "Weight",
      align: "right",
      cell: (a) => <span className="tabular-nums">{a.weight}</span>,
      footer: <span className="tabular-nums">{sumWeights(areas)}</span>,
    },
    ...(withMinScores
      ? roles.map<Column<ProbeArea>>((role) => ({
          key: role.id,
          header: `${role.name} min`,
          align: "center",
          cell: (a) => {
            const min = a.minScores[role.id];
            return min === undefined ? <span className="text-muted">—</span> : <ScoreBadge score={min} />;
          },
        }))
      : []),
    { key: "rationale", header: "Why this weight", cell: (a) => <span className="text-muted">{a.rationale}</span> },
  ];
}

const roleColumns: Column<Role>[] = [
  { key: "level", header: "Level", align: "center", cell: (r) => <Badge>{r.level}</Badge>, className: "w-16" },
  { key: "name", header: "Role", cell: (r) => <span className="font-medium whitespace-nowrap">{r.name}</span> },
  { key: "minScore", header: "Min final score", align: "right", cell: (r) => <span className="tabular-nums">{r.minFinalScore}</span> },
  { key: "experience", header: "Min experience", align: "right", cell: (r) => `${r.minExperienceYears} yrs` },
  { key: "bar", header: "What the bar means", cell: (r) => <span className="text-muted">{r.bar}</span> },
];

export default function ConfigurationPage() {
  const errors = validateConfig();
  const coreAreas = getAreasByCategory("core");
  const bonusAreas = getAreasByCategory("good-to-know");

  return (
    <>
      <PageHeader
        title="Configuration"
        description="Proficiency scale, probe area weights, must-have minimums and role thresholds. Edit config/probe-config.ts to change these values."
      />

      {errors.length > 0 && (
        <Alert tone="danger" title="Configuration has problems">
          <ul className="list-disc pl-5">
            {errors.map((error) => (
              <li key={error}>{error}</li>
            ))}
          </ul>
        </Alert>
      )}

      <Section title="Proficiency scale" description="Score (0–4) awarded per probe area and the share of its weight credited.">
        <DataTable columns={scaleColumns} rows={proficiencyScale} getRowKey={(l) => String(l.score)} />
      </Section>

      <Section
        title="Core probe areas"
        description={`Weights must total ${rules.coreWeightTotal}. Min columns are the lowest score needed in that area to be eligible for the role; — means no requirement.`}
      >
        <DataTable columns={areaColumns(coreAreas, { withMinScores: true })} rows={coreAreas} getRowKey={(a) => a.id} />
      </Section>

      <Section
        title="Good-to-know probe areas"
        description={`Bonus pool on top of the core score, totalling ${rules.bonusPoolTotal}. No minimums.`}
      >
        <DataTable columns={areaColumns(bonusAreas, { withMinScores: false })} rows={bonusAreas} getRowKey={(a) => a.id} />
      </Section>

      <Section title="Role thresholds" description="Minimum final score and experience required for each role, listed junior → senior. The order defines seniority; Level is just a label.">
        <DataTable columns={roleColumns} rows={roles} getRowKey={(r) => r.id} />
      </Section>
    </>
  );
}
