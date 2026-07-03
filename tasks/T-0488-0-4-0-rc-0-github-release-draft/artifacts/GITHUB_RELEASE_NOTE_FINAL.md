# HADARA 0.4.0-rc.0

`hadara@0.4.0-rc.0` is the first release candidate for the breaking 0.4 productization protocol line.

Install the release candidate:

```bash
npm install -g hadara@0.4.0-rc.0
```

Registry state:

- npm package: `hadara@0.4.0-rc.0`
- npm dist-tag: `next`
- current stable dist-tag: `latest=0.3.3`
- npm tarball shasum: `e983a13ccce5acfd4ab58d0a3a8f837bdd06acc4`
- conservative release target commit: `964a8431cc08c2e89460be46560c8a8d98b451e1` (`T-0478 fix publish env safe-directory clone`)

## Highlights

- Productized 0.4 project scaffold with compact `AGENTS.md`, routing-only `.hadara/context/HADARA_CONTEXT.md`, workflow-owned `docs/HADARA_WORKFLOW.md`, scaffold metadata, slot registry, docs registry seed, and 0.4 doctor checks.
- Four-file Task Capsule model for new 0.4 projects: `TASK.md`, `HANDOFF.md`, `EVIDENCE.md`, and canonical append-only `evidence.jsonl`.
- 0.4 `TASK.md` table validation for TaskStatus, Source Documents, Plan, Acceptance, Validation, Change Summary, and Risks / Follow-ups.
- Source Document hash/drift checks so concrete source paths cannot reach Done with stale or placeholder hashes.
- Registry-backed `docs register`, `docs read-map`, and `docs inbox` surfaces, with read-map integration in `session start` and `context pack`.
- Generated evidence projection rules that keep `EVIDENCE.md` derived from `evidence.jsonl`, not the evidence source of truth.
- Normalized 0.4 close-source contract and close proof placement outside close-source prose.
- Fail-closed legacy mutation boundary for 0.4 write surfaces on unsupported or older projects.
- Command registry/help/schema alignment for current 0.4 surfaces plus planned/disabled future docs governance commands.
- Product-default cleanup so generated scaffolds avoid HADARA-dev-specific Node/npm/Docker/release/repository history.
- Basic and governed profile dogfood from init through finalized, audited tasks.
- Agent UX hardening after dogfood: validation retry resolution, latest-attempt projection, non-mutating evidence help, structured validation launch errors, status/finalize latency diagnostics, finalize progress output, staged finalize risk reporting, fast task status, and finalize-owned close-proof repair.
- Final release-line preflight hardening for dashboard aggregate route latency, legacy sidecar cleanup, and task-scoped CI gate lookup.

## Boundaries

- This release candidate is a breaking 0.4 project protocol line and does not silently mutate 0.3.x projects.
- Stable npm remains `hadara@0.3.3`; use `hadara@next` or `hadara@0.4.0-rc.0` for explicit RC evaluation.
- Docker image publish, PyPI publish, installer execution, MCP release/package execution, and non-npm publish targets are out of scope.
- Stable 0.4.0 promotion remains separate from this RC draft and must run through stable readiness, stable publish, and installed-package recycle capsules.

## After This RC

The stable promotion line should continue with:

1. Stable readiness decision after reviewing the pre-stable cleanup capsules.
2. Approval-gated `hadara@0.4.0` stable npm publish if the readiness decision is promote.
3. Fresh unmounted installed-package recycle for `hadara@0.4.0`.
