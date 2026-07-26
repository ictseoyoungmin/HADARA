# T-0702 Trust Boundary Normalization

## Identity

| Field | Value |
|---|---|
| ID | T-0702 |
| Title | Trust Boundary Normalization |
| Status | Done |
| Created | 2026-07-26T16:29 |
| Updated | 2026-07-26T17:17 |

## Goal

| Goal | Notes |
|---|---|
| Restore trust-boundary invariants before RC2 readiness | Release artifacts must be built from the current source, successful acceptance claims must be backed by successful evidence, Docker validation must see tracked HADARA state, and task status surfaces must not drift. |

## Scope

| Boundary | Items |
|---|---|
| In | Make the release artifact builder own build/version freshness; enforce acceptance/evidence outcome consistency; preserve tracked `.hadara` files in Docker validation; synchronize stale task handoff status; cover rollback recovery branches; simplify or correctly aggregate repo-local TUI availability; run focused and full Docker validation. |
| Out | Publishing RC2, changing the package version, broad task/evidence schema redesign, Init upgrade or re-init support, restoring the removed Dashboard. |

## Plan

| Step | Action | Status |
|---|---|---|
| 1 | Define the normalization contract and reproduce the reported gaps. | Done |
| 2 | Fix the shared release, evidence, Docker, and task-state boundaries. | Done |
| 3 | Add focused regressions for each repaired invariant. | Done |
| 4 | Run focused and full Docker validation and record evidence. | Done |
| 5 | Update shared state, close guidance, and proof-last task evidence. | Done |

## Acceptance

| ID | Criterion | State | Evidence | Reference |
|---|---|---|---|---|
| AC-1 | Every executed release artifact build compiles the current source and verifies the built CLI version before copying `dist`. | Met | ev:T-0702:90af75bb32cf424598a1ddab | `tools/dev-surface/release-artifact.ts` |
| AC-2 | A `Met` acceptance row cannot pass close/lint when its cited evidence is missing, unsuccessful, or has an unresolved failed/blocked outcome. | Met | ev:T-0702:a1508bd12c0340fdad9da779 | `src/evidence/semantics.ts` |
| AC-3 | Docker workspace synchronization includes tracked `.hadara` state while excluding machine-local HADARA data. | Met | ev:T-0702:a1508bd12c0340fdad9da779 | `scripts/dev-docker-sync-build.sh` |
| AC-4 | Finish/close repairs a stale HANDOFF status even when TASK and Task Board already say `Done`. | Met | ev:T-0702:a1508bd12c0340fdad9da779 | `src/task/task-finish.ts` |
| AC-5 | Init rollback tests cover both an already-restored pre-existing file and an externally modified newly-created file. | Met | ev:T-0702:a1508bd12c0340fdad9da779 | `tests/unit/init-v1-transaction.test.ts` |
| AC-6 | TUI issue/availability output does not omit operational-debt unavailability. | Met | ev:T-0702:a1508bd12c0340fdad9da779 | `src/tui/read-model.ts` |
| AC-7 | Focused regressions, full Docker checks, built CLI smoke, and repository hygiene pass with durable evidence. | Met | ev:T-0702:a1508bd12c0340fdad9da779, ev:T-0702:62a86a87d37144d7a81dee6f, ev:T-0702:3cd630eb99e0451c9868ba3a, ev:T-0702:65150d5d65734fe7874e36eb | Task evidence |

## Validation

| Check | Gate | Result | Evidence |
|---|---|---|---|
| Focused unit regressions in Docker | Yes | Passed | ev:T-0702:a1508bd12c0340fdad9da779 |
| Full `npm run check` in Docker: 140 files/1094 tests plus 16 files/129 tests; clean `npm ci` found 0 vulnerabilities | Yes | Passed | ev:T-0702:a1508bd12c0340fdad9da779 |
| Executed release artifact: source build, built version, pack, checksum, manifest, and 261-file content verification | Yes | Passed | ev:T-0702:90af75bb32cf424598a1ddab |
| Built CLI smoke and version verification | Yes | Passed | ev:T-0702:62a86a87d37144d7a81dee6f |
| Repository hygiene | Yes | Passed | ev:T-0702:3cd630eb99e0451c9868ba3a |
| Dependency metadata consistency | Yes | Passed | ev:T-0702:65150d5d65734fe7874e36eb |

## Inputs / Constraints

| Source | Role | State | Notes |
|---|---|---|---|
| Human normalization review dated 2026-07-26 | requirement | active | Identifies release freshness, lockfile, TUI availability, evidence quality, and rollback verification concerns. |
| `.hadara/context/HADARA_CONTEXT.md` | reference | active | Project-local routing and operating context. |
| `docs/RELEASE_READINESS.md` | constraint | active | Canonical build, artifact, and publish boundary. |
| `docs/TEST_STRATEGY.md` | constraint | active | Validation and evidence expectations. |
| `docs/TASK_WORKFLOW_COMMANDS.md` | constraint | active | Close, evidence, and lifecycle semantics. |
| `docs/ARCHITECTURE.md` | reference | active | Runtime and developer-surface boundaries. |

## Changes

| Area | Summary |
|---|---|
| Task Capsule | Defined the cross-boundary normalization contract and acceptance gates. |
| Release trust | Artifact execution now builds current source, verifies the built CLI version, then stages and packs `dist`; schema, tests, README, and readiness guidance use the clean-source journal/evidence-root flow. |
| Evidence trust | Acceptance semantics now reject missing, unsuccessful, or unresolved-negative evidence behind `Met` rows; lifecycle fixtures persist real evidence ids. |
| State trust | Docker validation copies tracked `.hadara` state without `.hadara/local`; finish independently synchronizes canonical HANDOFF identity and is idempotent. |
| Recovery and UI | Rollback branch regressions cover already-restored and externally modified files; TUI top-level issues now include operational-debt unavailability. |
| Dependencies | Lock metadata was re-resolved to match package metadata, remove the Dashboard dependency residue, and produce a clean `npm ci` with zero reported vulnerabilities. |

## Risks / Follow-ups

| ID | Type | Summary | State | Link |
|---|---|---|---|---|
| RF-1 | Risk | Release artifact changes must keep dry-run and test runner injection deterministic; closed by injected-runner regressions and executed artifact evidence. | Closed | `tools/dev-surface/release-artifact.ts` |
| RF-2 | Risk | Stronger acceptance semantics may expose invalid historical or fixture claims; fixtures now use persisted outcome-consistent evidence ids. | Closed | `src/evidence/semantics.ts` |
| RF-3 | Risk | Docker synchronization must never copy `.hadara/local` or untracked private/runtime state; tracked-file allowlisting and Docker regressions enforce the boundary. | Closed | `scripts/dev-docker-sync-build.sh` |

## History

| Date | State | Note |
|---|---|---|
| 2026-07-26 | Draft | Initial task scaffold. |
| 2026-07-26 | In Progress | Defined normalization scope after reproducing release freshness, evidence/status drift, and Docker tracked-state gaps. |
| 2026-07-26 | Done | Restored release, evidence, Docker, task-state, rollback, TUI, dependency, and validation trust boundaries; clean Docker and executed artifact evidence passed. |
