# T-0497 0.4.1 rc0 vocabulary diagnostics and registry correction

## Identity

| Field | Value |
|---|---|
| ID | T-0497 |
| Title | 0.4.1 rc0 vocabulary diagnostics and registry correction |
| Status | Done |
| Created | 2026-07-05 |
| Updated | 2026-07-06 |

## Goal

| Goal | Notes |
|---|---|
| Implement rc0-scope items 2 and 3 (FD-006, FD-009, FD-008): a shared controlled-vocabulary source with a read-only `hadara schema` lookup surface, structured allowed-token diagnostics on all TASK.md harness token checks, and a guarded `docs mark --correction` path for ordinary registry status corrections such as canonical -> reference. Also registers the state-first RFC and rc0-scope documents. | Capsule 1 of 3 for the `docs/specs/0.4.1/rc0-scope.md` budget. Items 1/4 land in capsule 2; items 5/6 in capsule 3. |

## Scope

| Boundary | Items |
|---|---|
| In | New `src/services/controlled-vocabulary.ts` domain registry shared by `src/harness/validate.ts` (TASK.md token sets) and re-exporting `docs-registry` allowed values; structured `field`/`received`/`allowedValues` fields on harness token issues (T-0494 pattern); new read-only `hadara schema [--domain <id>]` CLI command with registry entry, JSON schema, and SCHEMAS.md row; `docs mark --correction` guarded arbitrary status transitions (reason always required, superseded still requires `--by`, transition-to-canonical emits a conflict warning plus docs doctor recommendation); structured allowed-values diagnostics on `docs mark` unknown status; registration of `docs/specs/0.5/state-first/RFC.md` and `docs/specs/0.4.1/rc0-scope.md` plus `.gitignore` exceptions for `docs/specs/0.4.1|0.5`. |
| Out | rc0-scope items 1/4/5/6 (capsules 2-3); physical vocab data-file extraction and project-level vocab overrides (0.5 RFC section 6); auto-rewriting invalid tokens (deferred per FD queue); MCP tool schema generation from the vocabulary. |

## Plan

| Step | Action | Status |
|---|---|---|
| 1 | Define the task contract and register the state-first docs. | Done |
| 2 | Add `controlled-vocabulary.ts` and move harness token sets into it; extend `HarnessValidationIssue` and `checkToken` with structured fields. | Done |
| 3 | Add `hadara schema` CLI command, registry entry, output JSON schema, and docs. | Done |
| 4 | Add `docs mark --correction` transitions with guards and structured unknown-status diagnostics. | Done |
| 5 | Add/extend focused tests (harness validate structured issues, schema command, docs-mark corrections). | Done |
| 6 | Validate in the Docker ext4 baseline (focused tests + build + built-CLI smokes) and record evidence. | Done |
| 7 | Update shared state docs and finalize. | Done |

## Acceptance

| ID | Criterion | State | Evidence | Reference |
|---|---|---|---|---|
| AC-1 | Every TASK.md token-set violation issue from `harness validate` carries structured `field`, `received`, and `allowedValues`. | Met | `ev:T-0497:76aba15e03a9492dbb139366` | `docs/specs/0.4.1/rc0-scope.md` item 2 AC-1 |
| AC-2 | `hadara schema --json` lists all vocabulary domains; `hadara schema --domain task.risk.state --json` returns the allowed tokens; output matches the token sets the validator actually enforces (same module source). | Met | `ev:T-0497:76aba15e03a9492dbb139366` | `docs/specs/0.4.1/rc0-scope.md` item 2 AC-2/AC-3 |
| AC-3 | `docs mark --correction` completes a canonical -> reference transition through the CLI dry-run/execute flow with field diff in the report and no registry hand-editing. | Met | `ev:T-0497:76aba15e03a9492dbb139366` | `docs/specs/0.4.1/rc0-scope.md` item 3 AC-1/AC-3 |
| AC-4 | Invalid `docs mark` target status is rejected with structured `allowedValues`; correction to `canonical` emits a conflict warning plus a docs doctor recommendation when another canonical doc shares kind/scope. | Met | `ev:T-0497:76aba15e03a9492dbb139366` | `docs/specs/0.4.1/rc0-scope.md` item 3 AC-2 |
| AC-5 | State-first RFC and rc0-scope docs are registered (registry + SOP required-reading rows) and committable (`.gitignore` exceptions in place). | Met | `ev:T-0497:76aba15e03a9492dbb139366` | `docs/specs/0.4.1/rc0-scope.md` |

## Validation

| Check | Gate | Result | Evidence |
|---|---|---|---|
| Docker ext4 focused tests (harness-validate, docs-mark, schema command, command-registry) | Yes | Passed | `ev:T-0497:76aba15e03a9492dbb139366` |
| Docker ext4 TypeScript build | Yes | Passed | `ev:T-0497:76aba15e03a9492dbb139366` |
| Built-CLI smokes (`hadara schema`, `docs mark --correction` dry-run/execute fixture) | Yes | Passed | `ev:T-0497:76aba15e03a9492dbb139366` |

## Inputs / Constraints

| Source | Role | State | Notes |
|---|---|---|---|
| `docs/specs/0.4.1/rc0-scope.md` | implementation-source | approved | Items 2 and 3 contract (AC/evidence plans) this capsule implements. |
| `docs/RELEASE_0_4_1_RC0_FUNCTIONAL_DEBT.md` | constraint | approved | FD-006/FD-008/FD-009 rows; FD-011..013 registered alongside this line. |
| `src/services/docs-registry.ts` | reference | implemented | T-0494 structured-diagnostics pattern (`field`/`received`/`allowedValues`/`suggestion`) reused for harness and mark. |
| `docs/specs/0.5/state-first/RFC.md` | background | review | Long-term vocab unification direction; this capsule only ships the lookup surface and shared TS module. |

## Changes

| Area | Summary |
|---|---|
| Controlled vocabulary | Added a shared vocabulary registry for TASK.md, evidence, and docs tokens, then routed harness token checks and `hadara schema` through it. |
| CLI / schema | Added read-only `hadara schema`, command registry metadata, JSON schema fixture/index entries, and schema docs. |
| Docs registry correction | Added guarded `docs mark --correction` transitions with required reasons, structured unknown-status diagnostics, canonical-conflict warnings, and `fieldDiff` reporting. |
| Docs governance | Registered the 0.4.1 rc0 scope, 0.5 state-first RFC, and historical 0.4.0 state-first proposal; SOP and `.gitignore` route these docs explicitly. |

## Risks / Follow-ups

| ID | Type | Summary | State | Link |
|---|---|---|---|---|
| RF-1 | Follow-up | Host Windows full-suite run has 27 pre-existing path/hash-normalization test failures; Docker ext4 remains the validation baseline for this line. | Open | `docs/AGENT_HANDOFF.md` |

## History

| Date | State | Note |
|---|---|---|
| 2026-07-05 | Draft | Initial task scaffold. |
| 2026-07-05 | In Progress | Contract authored from rc0-scope items 2/3. |
| 2026-07-06 | Done | Implemented vocabulary diagnostics, schema lookup, docs registry corrections, focused validation, and docs registration. |
