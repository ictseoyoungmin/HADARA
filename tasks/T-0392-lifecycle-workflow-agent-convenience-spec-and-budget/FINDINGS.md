# FINDINGS

| Finding | Impact | Proposed Improvement |
|---|---|---|
| The canonical lifecycle split is correct, but agent use benefits from a normalized phase API. | Agents currently infer state by composing several reports and can repeat validation unnecessarily. | Add `task lifecycle --task T --json` as read-only state projection. |
| Close repair is conceptually well-defined but not exposed as a direct command. | Stale or invalid close proof requires manual interpretation. | Add `task close-repair-plan --task T --json`. |
| High-level orchestration is useful only if it preserves explicit review. | A hidden all-in-one command would conflict with HADARA proof boundaries. | Add dry-run-first `task finalize`, with execute gated by a reviewed plan hash. |
