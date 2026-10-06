import { Badge, DataTable, RecommendationBadge, Stat, type Column } from "@/components/ui";
import { formatGap, formatPoints, type Evaluation, type RoleEligibility } from "@/lib/algorithm";
import { probeConfig, type Role } from "@/lib/config";

interface ResultProps {
  evaluation: Evaluation;
  appliedRole: Role | undefined;
  experienceYears: number | undefined;
}

function Recommendation({ evaluation, appliedRole }: Omit<ResultProps, "experienceYears">) {
  if (!appliedRole) return <Badge>Select a role</Badge>;
  return <RecommendationBadge recommendation={evaluation.recommendation} />;
}

/** Headline numbers: scores, eligible level, gap and recommendation. */
export function ResultStats({ evaluation, appliedRole }: Omit<ResultProps, "experienceYears">) {
  const { rules } = probeConfig;
  const { eligibleRole, gap } = evaluation;

  return (
    <dl className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
      <Stat label="Core score" value={formatPoints(evaluation.coreScore)} hint={`of ${rules.coreWeightTotal}`} />
      <Stat label="Bonus" value={formatPoints(evaluation.bonus)} hint={`of ${rules.bonusPoolTotal}`} />
      <Stat label="Final score" value={formatPoints(evaluation.finalScore)} hint={`capped at ${rules.finalScoreCap}`} />
      <Stat
        label="Eligible level"
        value={eligibleRole?.name ?? "None"}
        hint={eligibleRole?.level ?? "Below every role bar"}
      />
      <Stat
        label="Gap"
        value={appliedRole && gap !== null ? formatGap(gap) : "—"}
        hint={
          !appliedRole
            ? "Select a role"
            : eligibleRole
              ? `${appliedRole.name} → ${eligibleRole.name}`
              : "Not eligible for any role"
        }
      />
      <Stat
        label="Recommendation"
        value={<Recommendation evaluation={evaluation} appliedRole={appliedRole} />}
        hint={evaluation.complete ? undefined : "Rate every core area to finish"}
      />
    </dl>
  );
}

/** Per-role breakdown: score bar, must-have minimums, experience and eligibility. */
export function EligibilityTable({ evaluation, appliedRole, experienceYears }: ResultProps) {
  const columns: Column<RoleEligibility>[] = [
    {
      key: "role",
      header: "Role",
      cell: ({ role }) => (
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="font-medium whitespace-nowrap">
            {role.level} · {role.name}
          </span>
          {role.id === appliedRole?.id && <Badge tone="accent">Applied</Badge>}
          {role.id === evaluation.eligibleRole?.id && <Badge tone="success">Eligible level</Badge>}
        </div>
      ),
    },
    {
      key: "score",
      header: "Score bar",
      cell: (r) => (
        <Badge tone={r.meetsScore ? "success" : "danger"}>
          {formatPoints(evaluation.finalScore)} {r.meetsScore ? "≥" : "<"} {r.role.minFinalScore}
        </Badge>
      ),
    },
    {
      key: "minimums",
      header: "Must-have minimums",
      cell: (r) =>
        r.unmetMinimums.length === 0 ? (
          <Badge tone="success">All met</Badge>
        ) : (
          <span className="text-muted">
            Short on {r.unmetMinimums.map((m) => `${m.area.shortName} (${m.actual ?? "–"}/${m.required})`).join(", ")}
          </span>
        ),
    },
    {
      key: "experience",
      header: "Typical experience",
      cell: ({ role }) => {
        const label = `${role.minExperienceYears}+ yrs`;
        if (experienceYears === undefined) return <span className="text-muted">{label}</span>;
        return <Badge tone={experienceYears >= role.minExperienceYears ? "success" : "warning"}>{label}</Badge>;
      },
    },
    {
      key: "eligible",
      header: "Eligible",
      align: "center",
      cell: (r) => <Badge tone={r.eligible ? "success" : "danger"}>{r.eligible ? "Yes" : "No"}</Badge>,
    },
  ];

  return <DataTable columns={columns} rows={evaluation.roles} getRowKey={(r) => r.role.id} />;
}
