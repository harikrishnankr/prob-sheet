# Interview Probe

Next.js app for configuring and running structured interview probes.

## Pages

- `/configuration` — proficiency scale, probe area weights, must-have minimums, role thresholds.
- `/algorithm` — step-by-step recommendation algorithm with a live worked example.
- `/probe-sheet` — enter candidate details, rate each area with notes; live score, eligibility per role, gap and recommendation.

## Structure

- `config/probe-config.ts` — editable probe config (scale, weights, minimums, role thresholds).
- `config/downloads.ts` + `public/downloads/` — files offered by the top-bar download button (e.g. the FE probe sheet).
- `lib/config/` — config types, helpers and `validateConfig` (core weights = 100, bonus pool = 10, valid role ids).
- `components/ui/` — reusable UI: `PageHeader`, `Section`, `DataTable`, `Badge`, `ScoreBadge`, `Alert`, `EmptyState`.
- `lib/algorithm.ts` — `evaluate()`: points, scores, eligibility, gap, recommendation.
- `components/probe-sheet/` — probe sheet form, area table, result summary; `useProbeSheet` autosaves to localStorage until "Finish interview".
- `lib/probe-sheet-storage.ts` — load/save/clear for the in-progress sheet (validated against the current config on load).
- `components/layout/` — `AppShell` (top bar), `MainNav`, `ThemeSwitcher`.

## Development

```bash
npm run dev
```
