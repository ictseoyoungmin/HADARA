# T-0780 Implement command-generated terminal lifecycle acceptance

## Identity

| Field | Value |
|---|---|
| ID | T-0780 |
| Title | Implement command-generated terminal lifecycle acceptance |
| Status | Done |
| Created | 2026-08-12T18:22 |
| Updated | 2026-08-12T18:35 |

> Command-owned identity: do not hand-edit `ID`, `Title`, `Status`, `Created`, or `Updated`; use `task create` and `task close`.

Schema hint: use `hadara schema --json` or `hadara schema --domain <domain-id> --json` for controlled values before replacing scaffold tokens.

## Goal

| Goal | Notes |
|---|---|
| Add an opt-in command-generated terminal lifecycle acceptance path whose passed result requires real fresh-plan execute idempotency. | Preserve ordinary package recycle compatibility while separating stale-plan fencing from fresh-plan success. |

## Scope

| Boundary | Items |
|---|---|
| In | `package recycle --terminal-lifecycle`; deterministic disposable fixture preparation; initial close, stale-plan, fresh-plan, audit, and idle observations; registered report schema; semantic reducer; focused regressions and evidence attachment behavior. |
| Out | npm/GitHub/Docker mutation; package version bump; RC6 artifact generation; structured reference and HANDOFF/release projection changes owned by T-0781/T-0782. |

## Plan

| Step | Action | Status |
|---|---|---|
| 1 | Define the terminal lifecycle command/report contract from the frozen RC6 spec. | Done |
| 2 | Implement the opt-in package recycle path, schema, reducer, and fixture preparation. | Done |
| 3 | Validate nested-failure semantics, schema/runtime integration, and Docker build. | Done |

## Acceptance

| ID | Criterion | State | Evidence | Reference |
|---|---|---|---|---|
| AC-1 | Ordinary package recycle remains dry-run-close compatible; `--terminal-lifecycle` explicitly opts into real terminal lifecycle execution. | Met | ev:T-0780:9b87c685bbb24c0489511132 | `tools/dev-surface/package-recycle.ts` |
| AC-2 | Stale initial plan reuse is reported as expected zero-write fencing, separately from fresh terminal plan execute success. | Met | ev:T-0780:9b87c685bbb24c0489511132 | `hadara.publicLifecycleAcceptance.v1` |
| AC-3 | Fresh-plan acceptance requires `closed-valid`, terminal, zero writes, no new close proof, and `idempotentNoop=true`. | Met | ev:T-0780:9b87c685bbb24c0489511132 | semantic reducer regression |
| AC-4 | Audit must be `closed-valid` and fresh status must be idle with zero recommendations. | Met | ev:T-0780:9b87c685bbb24c0489511132 | command-generated lifecycle report |
| AC-5 | Any failed required nested assertion makes the lifecycle report and attached package-recycle evidence fail. | Met | ev:T-0780:9b87c685bbb24c0489511132 | focused negative regression |
| AC-6 | Schema, focused tests, typechecks, Docker build/dist refresh, and task evidence pass. | Met | ev:T-0780:afb1645a283c44bc9d177f70; ev:T-0780:4487dbadfedb4947bdb7a4cd | validation evidence |

## Validation

| Check | Gate | Status | Detail | Evidence |
|---|---|---|---|---|
| Package recycle terminal lifecycle tests | Yes | Passed | exit 0 in 6262ms | ev:T-0780:9b87c685bbb24c0489511132 |
| Schema fixtures and source/tools typechecks | Yes | Passed | exit 0 in 13491ms | ev:T-0780:afb1645a283c44bc9d177f70 |
| Docker sync build | Yes | Passed | npm run dev:docker-sync-build passed; Docker build completed, dist synchronized, built CLI version smoke reported distLooksStale=false. | ev:T-0780:4487dbadfedb4947bdb7a4cd |

## Inputs / Constraints

| Source | Role | State | Notes |
|---|---|---|---|
| `docs/specs/0.5.0-rc6/00_TERMINAL_LIFECYCLE_EVIDENCE_AND_CLOSE_CURRENTNESS_HARDENING.md` | design | active | Normative Contract A and regression matrix. |
| T-0778 lifecycle artifact | background | implemented | Demonstrates stale old-plan refusal and missing fresh-plan execute proof. |
| `docs/SECURITY_MODEL.md` | constraint | active | Reduced report excludes raw logs, secrets, and private consumer paths. |

## Changes

| Area | Summary |
|---|---|
| Package recycle | Added explicit terminal lifecycle option and command-generated observation flow. |
| Semantic report | Added reducer distinguishing stale fencing from fresh-plan idempotency. |
| Schema | Registered strict `hadara.publicLifecycleAcceptance.v1`. |
| Tests/docs | Added focused reducer/schema coverage and command discovery guidance. |

## Risks / Follow-ups

| ID | Type | Summary | State | Link |
|---|---|---|---|---|
| RF-1 | Follow-up | Structured evidence-reference integrity remains T-0781. | Deferred | T-0781 after this capsule. |
| RF-2 | Risk | Packaged runtime changed after RC5 publication. | Accepted | RC6 regeneration is mandatory after T-0782. |

## Close Summary

Implemented an opt-in installed-package acceptance flow whose generated report separately proves initial close, stale-plan fencing, fresh-plan zero-write idempotency, closed-valid audit, and idle routing. Required nested assertion failures now deterministically fail the public lifecycle report and therefore the containing package-recycle result. The strict schema, focused tests, source/tools typechecks, and Docker-built CLI refresh all passed. RC6 regeneration remains mandatory after the remaining hardening capsules because this task changes packaged behavior.

## History

| Date | State | Note |
|---|---|---|
| 2026-08-12 | Draft | Initial task scaffold. |
| 2026-08-12 | In Progress | Implemented opt-in command-generated terminal lifecycle report and strict schema; focused validation in progress. |
| 2026-08-12 | Done | Focused lifecycle/schema tests, typechecks, and Docker build/dist refresh passed; capsule prepared for proof-last close. |
