import type { Metadata } from "next";
import { ProbeSheet } from "@/components/probe-sheet/probe-sheet";
import { PageHeader } from "@/components/ui";

export const metadata: Metadata = { title: "Probe Sheet" };

export default function ProbeSheetPage() {
  return (
    <>
      <PageHeader
        title="Probe Sheet"
        description="Enter candidate details, rate each probe area and see the score, eligibility and recommendation update live."
      />
      <ProbeSheet />
    </>
  );
}
