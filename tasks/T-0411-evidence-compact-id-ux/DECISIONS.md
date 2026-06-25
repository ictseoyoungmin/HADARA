# Decisions

| ID | Decision | Status | Rationale | Evidence |
|---|---|---|---|---|
| D-1 | Add `evidence summary` instead of overloading `evidence list`. | Accepted | Keeps the detailed list schema stable while providing a compact copy-hint surface. | `src/services/evidence-summary.ts` |
| D-2 | Keep text output abbreviated and JSON complete. | Accepted | Agents need readable terminal output, while automation needs full tags and summaries. | `src/cli/evidence.ts`, built CLI smoke |
