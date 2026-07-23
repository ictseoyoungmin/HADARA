# RC2 Developer Surface Report

## Purpose

This report narrows the active RC2 path to HADARA-dev-only developer surfaces. It is the input for the next implementation capsule, not a request to resume DAG or status redesign work.

## Corrected Drift

| Area | Problem | Alignment in T-0687 |
|---|---|---|
| Continuation semantics | `T-0686` left a `terminal` continuation even though the prose still instructed a next capsule. | T-0687 will close with an `actionable` next step so shared continuity and command selection agree again. |
| Capsule ownership | Root `AGENTS.md` still instructed fragment files such as `PLAN.md`, `DECISIONS.md`, `TESTS.md`, and `ACCEPTANCE.md` as if they were required task sidecars. | Root guidance now points back to one human-authored `TASK.md`, one compact `HANDOFF.md`, and generated evidence. |
| Development slices | `docs/DEVELOPMENT_SLICES.md` carried a malformed four-column `T-0686` row. | The slice row is restored to the five-column table and T-0687 is added explicitly. |
| RC2 scope | Shared docs split RC2 between developer-surface reduction and a DAG/status redesign track. | Shared docs now treat `operational debt`, release/readiness, and development verification surfaces as the first RC2 targets. |

## Priority 1 Code Inventory

### A. Operational debt surface

These files are HADARA-dev-facing and should be considered before user-facing lifecycle code:

| File | Why it is first-scope |
|---|---|
| `src/cli/debt.ts` | Public command root for debt-only inspection. |
| `src/services/operational-debt.ts` | Carries the static debt registry, aggregate math, capsule-size indicators, and strict release-gate debt coupling. |
| `src/tui/read-model.ts` | Pulls debt and release-gate reports into the TUI; changing debt services without this consumer map will leave dead UI dependencies. |
| `src/cli/dashboard.ts` | Exposes debt routes used by the dashboard; removal or extraction must account for the legacy `/api/debt` and `/api/dashboard/debt` paths. |

### B. Release and readiness surface

These files are primarily operator or HADARA-dev release tooling, not ordinary end-user Capsule workflow:

| File | Why it is first-scope |
|---|---|
| `src/cli/release-artifact.ts` | Entry point for explicit artifact generation and evidence attachment. |
| `src/cli/release-dry-run.ts` | Read-only release planning root. |
| `src/cli/release-gate.ts` | Strict or advisory release gate entry; currently coupled to operational debt. |
| `src/cli/release-publish.ts` | Approval-gated publish planning root. |
| `src/cli/release-closeout.ts` | Release closeout planning root. |
| `src/cli/smoke.ts` | Hosts `smoke clean-checkout`, which belongs to release-readiness rather than ordinary task work. |
| `src/services/release-artifact.ts` | Artifact builder and clean-worktree enforcement. |
| `src/services/release-dry-run.ts` | Release planning aggregator with provider, evidence, and target-model coupling. |
| `src/services/release-publish.ts` | Publish-readiness report logic. |
| `src/services/release-closeout.ts` | Release closeout planning logic. |
| `src/services/release-evidence.ts` | Release evidence reader and artifact validation support. |
| `src/services/release-evidence-validation.ts` | Freshness and gating logic for package smoke, clean checkout, and artifacts. |
| `src/services/release-readiness-summary.ts` | Dry-run readiness summary and next-actions. |
| `src/services/release-targets.ts` | Release target descriptors and provider capabilities. |
| `src/services/release-target-configuration.ts` | Preview config model for alternate release targets. |
| `src/services/release-provider-advisories.ts` | Python preview advisories and provider-specific release surface coupling. |
| `src/services/release-diagnostics.ts` | Stage timing and advisory reporting for release dry-run. |
| `src/services/package-smoke.ts` | Local package-smoke execution path. |
| `src/services/package-recycle.ts` | Installed-package recycle flow. |
| `src/services/clean-checkout-smoke.ts` | Clean-checkout smoke execution path. |
| `src/services/feature-smoke.ts` | Includes the `release-readiness` profile and release-gate dependency. |
| `src/services/smoke-evidence.ts` | Reduced smoke evidence attachment support. |

### C. HADARA-dev verification roots

These are development-only helpers that likely belong in `tools/` or scripts, not the installed CLI:

| File | Why it is first-scope |
|---|---|
| `src/cli/dev.ts` | Public `hadara dev` root. |
| `src/dev/docker-check.ts` | Docker temp-copy validation wrapper used for HADARA-dev CLI development. |

## Coupled Metadata And Registries

Any removal or extraction capsule must update these surfaces in the same diff:

| File | Coupling |
|---|---|
| `src/cli/main.ts` | Imports and dispatches `debt`, `release`, `smoke`, and `dev` roots. |
| `src/cli/help.ts` | Still advertises advanced release/package/dev roots. |
| `src/context/code-index.ts` | Maps release command ids to source files for context routing. |
| `src/context/release-extractors.ts` | Reads `docs/RELEASE_READINESS.md` into context/state signals. |
| `src/schemas/schema-index.json` | Registers release and smoke report schemas. |
| `src/schemas/*.schema.json` for release, smoke, package, install, and dev docker-check | Removal or demotion of command roots requires schema ownership cleanup. |

## Explicit Non-Targets For The Next Capsule

| Area | Why it stays out |
|---|---|
| `task status`, project current-state parsing, continuation selection, and status-model logic | T-0687 only re-aligns scope and shared docs; it does not reopen the lifecycle redesign. |
| DAG or fact-model work from the T-0660/T-0661 line | Shared docs no longer treat that as the active RC2 path. |
| Fresh-session dogfood and validation-baseline promotion | Required later, but they depend on the RC2 scope being stable first. |

## Recommended Next Capsule

Start one implementation capsule that changes only the Priority 1 file groups and their coupled registries. Keep the acceptance narrow:

1. Remove or extract one developer-only root at a time.
2. Prove the ordinary end-user Capsule loop still reaches `closed-valid`.
3. Leave status-selection and DAG-related files untouched.
