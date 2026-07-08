# T-0522 remove duplicate proof and evidence summary commands

## Identity

| Field | Value |
|---|---|
| ID | T-0522 |
| Title | remove duplicate proof and evidence summary commands |
| Status | Done |
| Created | 2026-07-08 |
| Updated | 2026-07-08 |

Schema hint: use `hadara schema --json` or `hadara schema --domain <domain-id> --json` for controlled values before replacing scaffold tokens.

## Goal

| Goal | Notes |
|---|---|
| Remove the duplicate public `proof.status`, `proof.explain`, `evidence.summary`, and `ci.gate` command surfaces. | Route users to `task status --detail full`, `task finalize --json`, `evidence list`, `state verify`, and `release gate` instead. |

## Scope

| Boundary | Items |
|---|---|
| In | Remove the four command ids from registry/help/routing, delete command-specific services/schemas/tests where no longer needed, and update current user-facing docs/init templates. |
| Out | Historical task capsules and old specs remain historical records. |

## Plan

| Step | Action | Status |
|---|---|---|
| 1 | Define the task contract and removal boundaries. | Done |
| 2 | Remove public command routing, registry entries, schemas, tests, and current docs. | Done |
| 3 | Validate registry/help/build behavior and record evidence. | Done |

## Acceptance

| ID | Criterion | State | Evidence | Reference |
|---|---|---|---|---|
| AC-1 | `proof.status`, `proof.explain`, `evidence.summary`, and `ci.gate` are absent from current command registry, help, and schema surfaces. | Done | `ev:T-0522:9f87a75fe15649e9bd445710` | `src/services/capability-registry.ts`; `src/cli/main.ts`; `src/cli/evidence.ts` |
| AC-2 | Current user-facing docs and generated init workflow guidance no longer recommend the removed commands. | Done | `ev:T-0522:9f87a75fe15649e9bd445710` | `README.md`; `docs/HADARA_WORKFLOW.md`; `docs/CLI_JSON_CONTRACT.md`; `src/cli/init.ts` |
| AC-3 | Focused validation passes, including registry/schema/help coverage and TypeScript build. | Done | `ev:T-0522:9f87a75fe15649e9bd445710` | `tests/unit/command-registry.test.ts`; `tests/unit/schema-fixtures.test.ts`; `tests/unit/lifecycle-guide.test.ts` |

## Validation

| Check | Gate | Result | Evidence |
|---|---|---|---|
| Focused Vitest: command registry, schema fixtures, lifecycle/help/docs surfaces | Yes | Passed | `ev:T-0522:9f87a75fe15649e9bd445710` |
| TypeScript build | Yes | Passed | `ev:T-0522:9f87a75fe15649e9bd445710` |
| Built CLI registry smoke for removed ids | Yes | Passed | `ev:T-0522:9f87a75fe15649e9bd445710` |

## Inputs / Constraints

| Source | Role | State | Notes |
|---|---|---|---|
| User request | reference | active | Fully remove `proof.status`, `proof.explain`, `evidence.summary`, and `ci.gate`, including related tests and docs. |
| `tasks/T-0521-command-portfolio-reduction-inventory/COMMAND_PORTFOLIO.md` | reference | active | Identifies the duplicate proof/evidence summary commands as first reduction candidates. |
| `docs/TASK_WORKFLOW_COMMANDS.md` | reference | active | Defines `task status`, `task finalize`, and `evidence list` as current replacements. |

## Changes

| Area | Summary |
|---|---|
| Command surface | Removed public routing, registry metadata, schemas, and command-specific services for the four duplicate diagnostics. |
| Docs/tests | Updated current docs, generated init workflow guidance, registry/schema/lifecycle/help tests, and deleted obsolete command-specific tests. |

## Risks / Follow-ups

| ID | Type | Summary | State | Link |
|---|---|---|---|---|
| RF-1 | Follow-up | Historical specs and task capsules still mention removed commands as history; do not mass-edit those records. | Closed | T-0521 portfolio inventory |

## History

| Date | State | Note |
|---|---|---|
| 2026-07-08 | Draft | Initial task scaffold. |
| 2026-07-08 | In Progress | Removed duplicate proof/evidence/CI diagnostics and recorded focused validation evidence. |
| 2026-07-08 | Done | Ready for close with current docs, tests, build, and command-surface smokes passing. |
