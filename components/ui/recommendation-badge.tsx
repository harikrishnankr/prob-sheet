import { RECOMMENDATION_LABELS, type Recommendation } from "@/lib/algorithm";
import { Badge, type BadgeTone } from "./badge";

const recommendationTones: Record<Recommendation, BadgeTone> = {
  recommend: "success",
  "one-level-lower": "warning",
  "not-recommended": "danger",
  incomplete: "neutral",
};

export function RecommendationBadge({ recommendation }: { recommendation: Recommendation }) {
  return <Badge tone={recommendationTones[recommendation]}>{RECOMMENDATION_LABELS[recommendation]}</Badge>;
}
