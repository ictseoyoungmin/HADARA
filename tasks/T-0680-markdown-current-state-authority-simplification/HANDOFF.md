# Handoff

## Identity

| Field | Value |
|---|---|
| ID | T-0680 |
| Title | Markdown current-state authority simplification |
| Status | Done |
| Created | 2026-07-22T08:47 |
| Updated | 2026-07-22T09:10 |
## Last Completed

| Item | Evidence |
|---|---|
| Markdown-first selection and compatibility-checkpoint demotion implemented. | ev:T-0680:b9c381304c98458fa5a3ada0 |
| Full Docker source check passed 166 files / 1240 tests. | ev:T-0680:d3678aba966b4b0fad7d8aa3 |
| Built CLI selected an open capsule after `current.json` was moved away. | ev:T-0680:f15442d885a4472c8397a8f9 |

## Next Recommended Step

| Step | Disposition | Create Task | Reason | Required Reading |
|---|---|---|---|---|
| Simplify basic, standard, and governed generated scaffolds, then validate fresh profile outputs before installed-package dogfood. | actionable | yes | This is the remaining accepted pre-stable simplification slice. | `docs/specs/0.5/PRE_STABLE_LIFECYCLE_SIMPLIFICATION.md`, `src/init/profiles.ts`, `src/init/templates.ts` |

## Carry Forward Warnings

| Warning | Impact | Mitigation |
|---|---|---|
| `current.json` remains a 0.5.x compatibility checkpoint. | Older readers still work, but new code could accidentally restore it as intent authority. | Keep Markdown precedence tests and do not add raw checkpoint reading to generated AGENTS/context docs. |
| Successful `task close` is terminal. | A follow-up `task status` would add a redundant lifecycle step. | Create the next accepted capsule directly after close. |
