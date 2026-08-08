# HADARA 0.5.0-rc.2

HADARA 0.5.0-rc.2 is a public prerelease for the Init v1 task-local workflow and evidence-backed
close transaction line. It supersedes 0.5.0-rc.1 as the current prerelease candidate.

## Highlights

- Retires the legacy global project-state and agent-handoff authority in favor of Task Board and
  task-local capsule documents.
- Reduces the primary status surface and keeps `task status` as the lifecycle entry point.
- Hardens proof-last task close with operation markers, guarded writes, recovery boundaries, and
  close-plan binding.
- Adds redacted validation v2 output with bounded argv and child-output previews.
- Adds release evidence binding through a canonical `releaseInputHash`, so source-only changes
  invalidate artifact, package-smoke, and clean-checkout evidence.
- Documents automatic task Identity ownership in generated `TASK.md` and `HANDOFF.md` files.

## Validation

The final T-0749 source head passed full `npm run check`, release artifact generation with
checksum/manifest, package consumer smoke, clean-checkout smoke, installed lifecycle smoke, strict
release gate, release dry-run, and publish dry-run. The installed lifecycle result records init,
task creation, validation evidence, close execute, audit close, idempotent retry, and fresh-session
status checks.

## Boundaries

- This is a prerelease candidate intended for npm `next`.
- Published to npm on dist-tag `next`; `hadara@latest` remains the stable line at `0.4.6`.
- This GitHub Release is the prerelease companion for npm `0.5.0-rc.2`.
- Post-publish installed-package recycle verifies the public artifact separately.
- No tokens or machine-local paths are included in this note.
