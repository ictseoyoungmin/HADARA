# Decisions

Record task-local design decisions here.

## Explicit Local Execution Flag

`hadara package smoke` remains dry-run by default. Local package smoke execution requires `--execute`, which keeps the existing command surface default-safe while making package/install subprocess execution operator-explicit.

## Evidence Attachment Deferred

T-0134 emits reduced package-smoke reports only. Public evidence attachment remains deferred to T-0136, which is the dedicated smoke evidence integration slice in `docs/DEVELOPMENT_SLICES.md`.
