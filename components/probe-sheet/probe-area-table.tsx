"use client";

import { Badge, DataTable, Select, Textarea, type Column } from "@/components/ui";
import { areaPoints, formatPoints, type Ratings } from "@/lib/algorithm";
import { probeConfig, type ProbeArea, type Role, type Score } from "@/lib/config";

const { proficiencyScale } = probeConfig;

interface ProbeAreaTableProps {
  areas: ProbeArea[];
  ratings: Ratings;
  notes: Record<string, string>;
  appliedRole: Role | undefined;
  /** `undefined` clears the rating. */
  onRate: (areaId: string, score: Score | undefined) => void;
  onNote: (areaId: string, note: string) => void;
}

function MinimumCheck({ required, actual }: { required: Score | undefined; actual: Score | undefined }) {
  if (required === undefined) return <span className="text-muted">—</span>;
  if (actual === undefined) return <Badge title="Not rated yet">≥ {required}</Badge>;
  return actual >= required ? (
    <Badge tone="success" title={`Meets minimum of ${required}`}>✓ ≥ {required}</Badge>
  ) : (
    <Badge tone="danger" title={`Below minimum of ${required}`}>✗ ≥ {required}</Badge>
  );
}

export function ProbeAreaTable({ areas, ratings, notes, appliedRole, onRate, onNote }: ProbeAreaTableProps) {
  const columns: Column<ProbeArea>[] = [
    {
      key: "area",
      header: "Probe area",
      className: "min-w-48",
      cell: (a) => (
        <div>
          <p className="font-medium">{a.name}</p>
          <p className="text-xs text-muted">Weight {a.weight}</p>
        </div>
      ),
    },
    {
      key: "rating",
      header: "Rating (0–4)",
      cell: (a) => {
        const score = ratings[a.id];
        const level = proficiencyScale.find((l) => l.score === score);
        return (
          <Select
            aria-label={`Rating for ${a.name}`}
            title={level?.definition}
            value={score ?? ""}
            onChange={(e) => onRate(a.id, e.target.value === "" ? undefined : (Number(e.target.value) as Score))}
            className="w-64"
          >
            <option value="">Not rated</option>
            {proficiencyScale.map((l) => (
              <option key={l.score} value={l.score}>
                {l.score} · {l.name}
              </option>
            ))}
          </Select>
        );
      },
    },
    {
      key: "points",
      header: "Points",
      align: "right",
      cell: (a) => (
        <span className="whitespace-nowrap tabular-nums">
          {formatPoints(areaPoints(a, ratings[a.id]))}
          <span className="text-muted"> / {a.weight}</span>
        </span>
      ),
    },
    {
      key: "min",
      header: appliedRole ? `${appliedRole.name} min` : "Role min",
      align: "center",
      cell: (a) => <MinimumCheck required={appliedRole ? a.minScores[appliedRole.id] : undefined} actual={ratings[a.id]} />,
    },
    {
      key: "notes",
      header: "Notes",
      className: "min-w-64 w-full",
      cell: (a) => (
        <Textarea
          aria-label={`Notes for ${a.name}`}
          placeholder="Evidence, examples, follow-ups…"
          className="w-full"
          value={notes[a.id] ?? ""}
          onChange={(e) => onNote(a.id, e.target.value)}
        />
      ),
    },
  ];

  return <DataTable columns={columns} rows={areas} getRowKey={(a) => a.id} />;
}
