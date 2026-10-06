"use client";

import { useEffect, useState } from "react";
import type { Score } from "@/lib/config";
import {
  clearSheet,
  EMPTY_SHEET,
  isSheetEmpty,
  loadSheet,
  saveSheet,
  type Candidate,
  type ProbeSheetData,
} from "@/lib/probe-sheet-storage";

/**
 * Probe sheet state, saved to localStorage on every change and restored on
 * load, until `finish()` clears it.
 */
export function useProbeSheet() {
  const [sheet, setSheet] = useState<ProbeSheetData>(EMPTY_SHEET);
  // Storage isn't readable during server render; hold off saving until it has been read,
  // otherwise the empty initial state would overwrite the saved sheet.
  const [loaded, setLoaded] = useState(false);
  const [restoredAt, setRestoredAt] = useState<string | null>(null);

  useEffect(() => {
    const saved = loadSheet();
    if (saved) {
      const { updatedAt, ...data } = saved;
      // eslint-disable-next-line react-hooks/set-state-in-effect -- restoring from localStorage on mount
      setSheet(data);
      setRestoredAt(updatedAt || null);
    }
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (!loaded) return;
    if (isSheetEmpty(sheet)) clearSheet();
    else saveSheet(sheet);
  }, [sheet, loaded]);

  const updateCandidate = (patch: Partial<Candidate>) =>
    setSheet((s) => ({ ...s, candidate: { ...s.candidate, ...patch } }));

  const rate = (areaId: string, score: Score | undefined) =>
    setSheet((s) => {
      const ratings = { ...s.ratings };
      if (score === undefined) delete ratings[areaId];
      else ratings[areaId] = score;
      return { ...s, ratings };
    });

  const note = (areaId: string, text: string) => setSheet((s) => ({ ...s, notes: { ...s.notes, [areaId]: text } }));

  function finish() {
    clearSheet();
    setSheet(EMPTY_SHEET);
    setRestoredAt(null);
  }

  return { ...sheet, loaded, restoredAt, isEmpty: isSheetEmpty(sheet), updateCandidate, rate, note, finish };
}
