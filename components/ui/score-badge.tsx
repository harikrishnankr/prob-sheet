import { getProficiencyLevel, type Score } from "@/lib/config";
import { Badge, type BadgeTone } from "./badge";

const scoreTones: Record<Score, BadgeTone> = {
  0: "danger",
  1: "warning",
  2: "neutral",
  3: "accent",
  4: "success",
};

interface ScoreBadgeProps {
  score: Score;
  /** Show the proficiency name (e.g. "Guided Practitioner") next to the number. */
  showLabel?: boolean;
}

export function ScoreBadge({ score, showLabel = false }: ScoreBadgeProps) {
  const level = getProficiencyLevel(score);
  return (
    <Badge tone={scoreTones[score]} title={level ? `${level.name}: ${level.definition}` : undefined}>
      {score}
      {showLabel && level && <span className="ml-1 font-normal">· {level.name}</span>}
    </Badge>
  );
}
