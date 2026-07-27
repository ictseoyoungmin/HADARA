# T-0712 Live Documentation Set and Archive

## Identity

| Field | Value |
|---|---|
| ID | T-0712 |
| Title | Live Documentation Set and Archive |
| Status | Done |
| Created | 2026-07-26T21:55 |
| Updated | 2026-07-27T15:22 |

Schema hint: use `hadara schema --json` or `hadara schema --domain <domain-id> --json` for controlled values before replacing scaffold tokens.

## Goal

| Goal | Notes |
|---|---|
| Select the live default-reading `docs/` set and move every superseded/implemented/historical document out of active routing without breaking any reference to it. | Archiving alone is not enough; every registry entry, live-doc citation, generated projection, and test that names an archived path must resolve. |

## Scope

| Boundary | Items |
|---|---|
| In | `.hadara/docs-registry.json` path/metadata correction for archived entries, `docs/DOC_REGISTRY.md` regeneration, dangling-path repair across live routing docs and `src/services/capability-registry.ts` help text, test fixups for doc-content assertions, removal of now-empty `docs/specs/*` directories, `docs doctor` and full validation. |
| Out | Re-litigating which of the 44 files should be live vs. archived (already decided and staged before this session), rewriting historical narrative in `docs/DEVELOPMENT_SLICES.md`, deleting doc-content regression tests instead of repointing them. |

## Plan

| Step | Action | Status |
|---|---|---|
| 1 | Fix `.hadara/docs-registry.json` for the 20 registered documents among the 44 archived files: new path plus historical/never-default/human-only metadata matching the existing archive convention; regenerate `docs/DOC_REGISTRY.md`. | Done |
| 2 | Find and fix every dangling reference to an archived path in live docs (`PROJECT_STATE.md`, `AGENT_HANDOFF.md`, `SCHEMAS.md`, `SECURITY_MODEL.md`, `CLI_JSON_CONTRACT.md`, `MCP_BRIDGE_CONTRACT.md`, `TEST_STRATEGY.md`, `DECISIONS.md`, `ROADMAP.md`, `OPERATIONAL_DEBT.md`, `TASK_WORKFLOW_COMMANDS.md`) and in `src/services/capability-registry.ts` command `docs:` metadata. | Done |
| 3 | Fix tests that asserted archived-document content/paths directly instead of deleting the regression coverage; fix the latent `docs/specs` emptiness assumption in `archive-boundary.test.ts`; remove the resulting empty `docs/specs/*` directory tree. | Done |
| 4 | Run full validation and `docs doctor`, close the capsule. | Done |

## Acceptance

| ID | Criterion | State | Evidence | Reference |
|---|---|---|---|---|
| AC-1 | `hadara docs doctor --json` reports zero missing registered documents and zero issues after the archive move. | Met | `ev:T-0712:d60698e5a83d416c8e8b5df1` | User instruction |
| AC-2 | No live doc, generated projection, or command-registry help string cites a pre-move path for any of the 44 archived files. | Met | `ev:T-0712:e5504113b0c6440ab27423fb` | User instruction |
| AC-3 | Full public and HADARA-dev-only validation passes after the archive move and reference repair. | Met | `ev:T-0712:93e394f3cda644919a5254c8` | Compatibility |

## Validation

| Check | Gate | Status | Detail | Evidence |
|---|---|---|---|---|
| Docs registry doctor | Yes | Passed | exit 0 in 95ms | ev:T-0712:d60698e5a83d416c8e8b5df1 |
| Dangling-reference scan | Yes | Passed | exit 0 in 462ms | ev:T-0712:e5504113b0c6440ab27423fb |
| Full repository validation | Yes | Passed | exit 0 in 33368ms | ev:T-0712:93e394f3cda644919a5254c8 |
| Diff hygiene | Yes | Passed | exit 0 in 32ms | ev:T-0712:0e8f5d39e8254b298406718e |

## Inputs / Constraints

| Source | Role | State | Notes |
|---|---|---|---|
| Prior-session file moves (44 files under `docs/archive/retired-2026-07-26/`) | background | active | Already staged as git renames before this session started; this capsule finishes the consistency work the move requires, not the selection itself. |
| `docs doctor` / docs registry archive convention | constraint | active | New archive entries follow the existing `status: historical`, `readTier: historical`, `authority: historical`, `editPolicy: human-only`, `readWhen: [never-default]` pattern already used by prior archive batches. |
| AGENTS.md doc-update rules | constraint | active | Historical narrative docs (`docs/DEVELOPMENT_SLICES.md`) are not rewritten; only live routing/citation prose is repaired. |

## Changes

| Area | Summary |
|---|---|
| Docs registry | Updated path and archive metadata for the 20 registered documents among the 44 moved files; regenerated `docs/DOC_REGISTRY.md`. |
| Live doc cross-references | Repointed archived-path citations in `PROJECT_STATE.md`, `AGENT_HANDOFF.md`, `SCHEMAS.md`, `SECURITY_MODEL.md`, `CLI_JSON_CONTRACT.md`, `MCP_BRIDGE_CONTRACT.md`, `TEST_STRATEGY.md`, `DECISIONS.md`, `ROADMAP.md`, `OPERATIONAL_DEBT.md`, `TASK_WORKFLOW_COMMANDS.md`, and command-registry `docs:` help metadata. |
| Tests | Repointed 6 test files that read archived-document content/paths directly (`current-state-docs`, `evidence-semantic-contract-docs`, `evidence-v2-plan-docs`, `primary-workflow-budget`, `status-json`, `command-portfolio-audit`); fixed `archive-boundary.test.ts`'s `docs/specs` emptiness check, which previously passed only because of stale empty directories that would not survive a fresh checkout. |
| Repo hygiene | Removed the now-empty `docs/specs/0.4.1`, `docs/specs/0.4.5`, and `docs/specs/0.5/*` directory tree; fixed a hardcoded archived path in `scripts/context-routing-e2e-smoke.mjs`. |

## Risks / Follow-ups

| ID | Type | Summary | State | Link |
|---|---|---|---|---|
| RF-1 | Follow-up | `docs/ROADMAP.md`'s "Active Program: Init v1 Redesign" section still describes `docs/specs/0.5/redesign/` (now archived) in present tense as governing three still-incomplete capsules (document routing, legacy compatibility isolation, full installed-package acceptance). This capsule repaired the citation path only; it did not judge whether that spec should have stayed live. A human should confirm whether the remaining Init v1 capsules still need it as an active source before it is treated as purely historical. | Open | ROADMAP.md:11 |
| RF-2 | Follow-up | `docs/ROADMAP.md` "Active Program" narrative is stale relative to Task Board (last mentions T-0703; T-0704-T-0711 have since landed). Unrelated to this capsule's scope but worth a future roadmap refresh. | Open | ROADMAP.md |

## Close Summary

Selected the live `docs/` set stays internally consistent after archiving 44 superseded/implemented/historical documents: the registry, generated projections, live-doc citations, command help text, and doc-content regression tests all resolve to the new `docs/archive/retired-2026-07-26/` locations, and full validation plus `docs doctor` pass clean.

## History

| Date | State | Note |
|---|---|---|
| 2026-07-26 | Draft | Initial task scaffold. |
| 2026-07-26 | In Progress | Prior session selected the 27-document live set and staged 44 file moves to `docs/archive/retired-2026-07-26/`. |
| 2026-07-27 | Done | Fixed docs registry paths/metadata, regenerated DOC_REGISTRY.md, repaired all dangling cross-references and command-registry doc citations, fixed 7 affected tests, removed empty spec directories, and passed full validation and docs doctor. |
