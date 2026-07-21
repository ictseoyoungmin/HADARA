# HADARA 0.5.0-rc.1

HADARA 0.5.0-rc.1 is a prerelease for the 0.5 status-ingress and task-continuation line.
It supersedes `0.5.0-rc.0` on the npm `next` dist-tag.

## What changed since 0.5.0-rc.0

- Improves task status and close guidance for governed HADARA projects.
- Preserves explicit project continuation after task close, so the next session can resume intended work instead of falling through to idle.
- Fixes stale first-task or adoption-baseline guidance after real task work has completed.
- Fixes schema validation for `anyOf`, improving validation accuracy for structured project state.
- Avoids offering "no follow-up work" handoff text as a new task suggestion.
- Keeps npm `latest` on stable `0.4.6`; this prerelease is published on `next`.

## Validation

Before publication, the release candidate passed package smoke, clean-checkout smoke, release artifact generation, strict release gates, and publish dry-run checks.
After publication, the package was installed from npm as `hadara@next` and passed the installed-package recycle checks.


## Notes

- `hadara@next` resolves to `0.5.0-rc.1`.
- `hadara@latest` remains `0.4.6`.
- This is a release candidate; use it to evaluate the 0.5 task-status and continuation behavior before stable promotion.
