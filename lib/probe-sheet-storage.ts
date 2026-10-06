import type { Ratings } from "@/lib/algorithm";
import { probeConfig, type Score } from "@/lib/config";

export interface Candidate {
  name: string;
  /** Kept as typed so a half-entered value survives a reload. */
  experience: string;
  appliedRoleId: string;
}

export interface ProbeSheetData {
  candidate: Candidate;
  ratings: Ratings;
  notes: Record<string, string>;
}

export interface SavedProbeSheet extends ProbeSheetData {
  /** ISO timestamp of the last save. */
  updatedAt: string;
}

// Bump the version if the stored shape changes incompatibly.
const STORAGE_KEY = "probe-sheet:v1";

export const EMPTY_SHEET: ProbeSheetData = {
  candidate: { name: "", experience: "", appliedRoleId: "" },
  ratings: {},
  notes: {},
};

export function isSheetEmpty({ candidate, ratings, notes }: ProbeSheetData): boolean {
  return (
    Object.values(candidate).every((value) => value === "") &&
    Object.keys(ratings).length === 0 &&
    Object.values(notes).every((note) => note.trim() === "")
  );
}

const asString = (value: unknown) => (typeof value === "string" ? value : "");

/**
 * Keeps only values that still match the current config, so a saved sheet
 * survives probe areas or roles being renamed/removed.
 */
function sanitize(raw: unknown): SavedProbeSheet | null {
  if (!raw || typeof raw !== "object") return null;
  const data = raw as Partial<Record<keyof SavedProbeSheet, unknown>>;
  const areaIds = new Set(probeConfig.probeAreas.map((a) => a.id));
  const scores = new Set<unknown>(probeConfig.proficiencyScale.map((l) => l.score));
  const roleIds = new Set(probeConfig.roles.map((r) => r.id));

  const candidateRaw = (data.candidate ?? {}) as Record<string, unknown>;
  const appliedRoleId = asString(candidateRaw.appliedRoleId);
  const candidate: Candidate = {
    name: asString(candidateRaw.name),
    experience: asString(candidateRaw.experience),
    appliedRoleId: roleIds.has(appliedRoleId) ? appliedRoleId : "",
  };

  const ratings: Ratings = {};
  for (const [id, score] of Object.entries((data.ratings ?? {}) as Record<string, unknown>)) {
    if (areaIds.has(id) && scores.has(score)) ratings[id] = score as Score;
  }

  const notes: Record<string, string> = {};
  for (const [id, note] of Object.entries((data.notes ?? {}) as Record<string, unknown>)) {
    if (areaIds.has(id) && typeof note === "string") notes[id] = note;
  }

  return { candidate, ratings, notes, updatedAt: asString(data.updatedAt) };
}

export function loadSheet(): SavedProbeSheet | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const sheet = raw ? sanitize(JSON.parse(raw)) : null;
    return sheet && !isSheetEmpty(sheet) ? sheet : null;
  } catch {
    return null;
  }
}

export function saveSheet(sheet: ProbeSheetData) {
  try {
    const saved: SavedProbeSheet = { ...sheet, updatedAt: new Date().toISOString() };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(saved));
  } catch {
    // Storage full or unavailable (e.g. private mode); the sheet still works in memory.
  }
}

export function clearSheet() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // Nothing to clear.
  }
}
