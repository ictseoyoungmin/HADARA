# HADARA 0.4.3

Stable release for the 0.4.3 current-state, session-resume, and fresh-init dogfood hardening line.

## Highlights

- Adds structured `.hadara/state/current.json` as the compact source for current release, latest/active task, next work, current problems, and validation baseline, with managed Project State and Agent Handoff projections.
- Makes new sessions resume from current state and `session start` without reconstructing project history from long-form historical docs.
- Replaces loose next-intent prose with a structured next-work contract so status/session guidance can distinguish candidate work from operator guidance.
- Adds explicit currentness diagnostics through `docs doctor --json` and drift checks for structured canon, Markdown projections, Task Board, onboarding versions, and removed-command references.
- Measures the primary workflow across basic, standard, and governed profiles while keeping the core workflow surface frozen at four command ids and six post-init calls.
- Fixes fresh-init dogfood regressions before stable publish: stale first-task recommendations, HADARA-dev validation command leakage, too-short generated `TASK.md` read ranges, and finish-only status guidance.
- Keeps HADARA scoped as a local-first evidence control plane; full controller/provider/cloud-worker expansion remains deferred.

## Verification Line

- T-0565 completed non-deployment 0.4.3 source readiness: local tarball install, artifact/package/clean-checkout smokes, strict gate, release dry-run, and installed local-tarball workflow evidence.
- T-0566 through T-0569 completed current-state/session contract cleanup, structured next-work cleanup, fresh-init dogfood, and post-dogfood UX regression fixes.
- T-0570 prepares this stable publish path and leaves npm/GitHub mutation to the approval-gated operator release scripts.

## Boundaries

- npm publish uses the `latest` tag for `0.4.3`.
- Docker image publish, PyPI publish, installer execution, MCP release/package execution, and external multi-repository validation remain out of scope.
- After publish, run a separate installed-package recycle capsule against `hadara@latest` expected `0.4.3`.
