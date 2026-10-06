"use client";

import { Badge, Field, Input, RecommendationBadge, Section, Select } from "@/components/ui";
import { evaluate, formatGap, formatPoints } from "@/lib/algorithm";
import { getAreasByCategory, probeConfig } from "@/lib/config";
import { FinishInterviewButton } from "./finish-interview-button";
import { ProbeAreaTable } from "./probe-area-table";
import { EligibilityTable, ResultStats } from "./result-summary";
import { useProbeSheet } from "./use-probe-sheet";

const coreAreas = getAreasByCategory("core");
const bonusAreas = getAreasByCategory("good-to-know");
const { roles } = probeConfig;

const savedTimeFormat = new Intl.DateTimeFormat(undefined, { dateStyle: "medium", timeStyle: "short" });

export function ProbeSheet() {
  const { candidate, ratings, notes, restoredAt, isEmpty, updateCandidate, rate, note, finish } = useProbeSheet();

  const appliedRole = roles.find((r) => r.id === candidate.appliedRoleId);
  const experienceYears = candidate.experience === "" ? undefined : Number(candidate.experience);
  const evaluation = evaluate(ratings, candidate.appliedRoleId);
  const ratedCoreCount = coreAreas.filter((a) => ratings[a.id] !== undefined).length;

  const tableProps = { ratings, notes, appliedRole, onRate: rate, onNote: note };

  return (
    <>
      <Section
        title="Candidate"
        description={
          (restoredAt ? `Restored unfinished interview from ${savedTimeFormat.format(new Date(restoredAt))}. ` : "") +
          "Saved automatically in this browser until you finish the interview."
        }
      >
        <div className="grid gap-4 sm:grid-cols-3">
          <Field label="Candidate name" htmlFor="candidate-name">
            <Input
              id="candidate-name"
              value={candidate.name}
              onChange={(e) => updateCandidate({ name: e.target.value })}
              placeholder="Jane Doe"
              autoComplete="off"
            />
          </Field>
          <Field label="Experience (years)" htmlFor="candidate-experience">
            <Input
              id="candidate-experience"
              type="number"
              inputMode="decimal"
              min={0}
              step={0.5}
              value={candidate.experience}
              onChange={(e) => updateCandidate({ experience: e.target.value })}
              placeholder="e.g. 5"
            />
          </Field>
          <Field
            label="Role interviewing for"
            htmlFor="candidate-role"
            hint={
              appliedRole && (
                <span className="inline-flex flex-wrap items-center gap-1.5">
                  Needs final score ≥ {appliedRole.minFinalScore} · typical {appliedRole.minExperienceYears}+ yrs
                  {experienceYears !== undefined && experienceYears < appliedRole.minExperienceYears && (
                    <Badge tone="warning">Below typical experience</Badge>
                  )}
                </span>
              )
            }
          >
            <Select
              id="candidate-role"
              value={candidate.appliedRoleId}
              onChange={(e) => updateCandidate({ appliedRoleId: e.target.value })}
            >
              <option value="" disabled>
                Select a role…
              </option>
              {roles.map((role) => (
                <option key={role.id} value={role.id}>
                  {role.level} · {role.name}
                </option>
              ))}
            </Select>
          </Field>
        </div>
      </Section>

      <Section
        title="Core probe areas"
        description={`${ratedCoreCount} of ${coreAreas.length} rated. Every core area must be rated for a recommendation.`}
      >
        <ProbeAreaTable areas={coreAreas} {...tableProps} />
      </Section>

      <Section title="Good-to-know probe areas" description="Optional bonus points; unrated areas count as 0.">
        <ProbeAreaTable areas={bonusAreas} {...tableProps} />
      </Section>

      <Section title="Result" description="Updates as you rate.">
        <div className="flex flex-col gap-5">
          <ResultStats evaluation={evaluation} appliedRole={appliedRole} />
          <EligibilityTable evaluation={evaluation} appliedRole={appliedRole} experienceYears={experienceYears} />
        </div>
      </Section>

      {/* Always-visible summary while scrolling through the areas. */}
      <div className="sticky bottom-[calc(1rem+env(safe-area-inset-bottom,0px))] flex flex-wrap items-center gap-x-6 gap-y-3 rounded-xl border border-border bg-surface/90 px-5 py-3 text-sm shadow-lg backdrop-blur">
        <div aria-live="polite" className="flex flex-1 flex-wrap items-center gap-x-6 gap-y-2">
          <span>
            Final <strong className="tabular-nums">{formatPoints(evaluation.finalScore)}</strong>
          </span>
          <span>
            Eligible <strong>{evaluation.eligibleRole?.name ?? "None"}</strong>
          </span>
          <span>
            Gap{" "}
            <strong className="tabular-nums">
              {appliedRole && evaluation.gap !== null ? formatGap(evaluation.gap) : "—"}
            </strong>
          </span>
          <span className="text-muted">
            Core rated {ratedCoreCount}/{coreAreas.length}
          </span>
          {appliedRole ? <RecommendationBadge recommendation={evaluation.recommendation} /> : <Badge>Select a role</Badge>}
        </div>
        <FinishInterviewButton onFinish={finish} disabled={isEmpty} />
      </div>
    </>
  );
}
