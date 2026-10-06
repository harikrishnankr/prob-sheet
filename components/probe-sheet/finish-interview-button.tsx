"use client";

import { useState } from "react";
import { Button } from "@/components/ui";

interface FinishInterviewButtonProps {
  onFinish: () => void;
  disabled?: boolean;
}

/** Two-step button: asks inline before clearing the saved interview. */
export function FinishInterviewButton({ onFinish, disabled }: FinishInterviewButtonProps) {
  const [confirming, setConfirming] = useState(false);

  if (!confirming) {
    return (
      <Button variant="primary" onClick={() => setConfirming(true)} disabled={disabled}>
        Finish interview
      </Button>
    );
  }

  return (
    <div role="group" aria-label="Confirm finish interview" className="flex flex-wrap items-center gap-2">
      <span className="text-sm text-muted">Clear all ratings and notes?</span>
      <Button variant="ghost" onClick={() => setConfirming(false)} autoFocus>
        Cancel
      </Button>
      <Button
        variant="danger"
        onClick={() => {
          setConfirming(false);
          onFinish();
        }}
      >
        Finish &amp; clear
      </Button>
    </div>
  );
}
