# T-0564 0.4.3 positioning onboarding and session resume

## Identity

| Field | Value |
|---|---|
| ID | T-0564 |
| Title | 0.4.3 positioning onboarding and session resume |
| Status | Done |
| Created | 2026-07-10 |
| Updated | 2026-07-10 |

Schema hint: use `hadara schema --json` or `hadara schema --domain <domain-id> --json` for controlled values before replacing scaffold tokens.

## Goal

| Goal | Notes |
|---|---|
| Define HADARA consistently as a local-first evidence control plane and make fast cross-session resume a first-class user benefit. | Align package-facing, onboarding, architecture, roadmap, and 0.4.3 release prose without expanding the command surface. |

## Scope

| Boundary | Items |
|---|---|
| In | README/package description; Getting Started; project/architecture/roadmap positioning; 0.4.3 release-note/readiness draft; metadata guards; wording regression tests. |
| Out | New commands; agent-controller/provider/runtime expansion; package version bump; npm/GitHub publication; deployment execution; external-repository study. |

## Plan

| Step | Action | Status |
|---|---|---|
| 1 | Audit conflicting product definitions and define one positioning/session-resume contract. | Done |
| 2 | Align package-facing, onboarding, architecture, roadmap, and release prose. | Done |
| 3 | Run focused docs/metadata validation and full Docker regression. | Done |

## Acceptance

| ID | Criterion | State | Evidence | Reference |
|---|---|---|---|---|
| AC-1 | README and package metadata define HADARA as a local-first evidence control plane for trustworthy agentic development. | Met | Exact wording assertions and release metadata tests passed. | `ev:T-0564:f044cd06cd674977a473c5c9` |
| AC-2 | Onboarding explains that structured current state lets a new session resume without reconstructing full history. | Met | README and Getting Started fast-resume assertions passed. | `ev:T-0564:f044cd06cd674977a473c5c9` |
| AC-3 | Architecture keeps controller/provider/runtime expansion explicitly deferred and describes the evidence-control boundary. | Met | Product Boundary and revised layer diagram are covered by positioning tests. | `ev:T-0564:f044cd06cd674977a473c5c9` |
| AC-4 | v0.4.3 notes describe currentness, structured state, seven metrics, and no-command-growth boundaries; v0.4.4 remains external validation. | Met | Roadmap/release wording assertions and full docs tests passed. | `ev:T-0564:f044cd06cd674977a473c5c9`, `ev:T-0564:fe7f2a90beb045e793a8a63d` |
| AC-5 | Focused and full Docker validation pass with docs doctor currentness clean. | Met | Docker 36/36 focused and 1052/1052 full passed; doctor is clean with zero semantic drift. | `ev:T-0564:f044cd06cd674977a473c5c9`, `ev:T-0564:fe7f2a90beb045e793a8a63d` |

## Validation

| Check | Gate | Result | Evidence |
|---|---|---|---|
| Positioning/onboarding focused tests | Yes | Passed | ev:T-0564:f044cd06cd674977a473c5c9 |
| Full Docker sync-build and docs currentness | Yes | Passed | ev:T-0564:fe7f2a90beb045e793a8a63d |

## Inputs / Constraints

| Source | Role | State | Notes |
|---|---|---|---|
| User positioning and session-resume request | constraint | active | Sharpen around evidence trust and continuity, not controller breadth. |
| `README.md`, `docs/GETTING_STARTED.md` | implementation-source | active | Primary package/user onboarding surfaces. |
| `docs/ARCHITECTURE.md`, `docs/ROADMAP.md` | implementation-source | active | Product boundary and release sequencing. |
| T-0561 through T-0563 | reference | active | Structured state, currentness, and measured workflow are the 0.4.3 substance. |

## Changes

| Area | Summary |
|---|---|
| package-facing | Sharpened README and package metadata around local-first evidence control; aligned release artifact and publish metadata guards. |
| onboarding | Added session resume guidance based on `.hadara/state/current.json` and bounded `session start`. |
| product boundary | Reframed architecture and project state around state/evidence/docs/policy; kept controller/provider/runtime/cloud breadth deferred. |
| release planning | Added the 0.4.3 source-preparation narrative and separated v0.4.4 external repository proof. |
| validation | Added dedicated positioning tests and resolved an initial clean-copy fixture assumption before the passing full rerun. |

## Risks / Follow-ups

| ID | Type | Summary | State | Link |
|---|---|---|---|---|
| RF-1 | Follow-up | Actual external repositories and non-HADARA operators remain v0.4.4 evidence work. | Deferred | v0.4.4 roadmap |

## History

| Date | State | Note |
|---|---|---|
| 2026-07-10 | Draft | Initial task scaffold. |
| 2026-07-10 | In Progress | Positioning, fast resume, release-boundary, and documentation scope accepted. |
| 2026-07-10 | Done | Product positioning, fast-resume onboarding, release sequence, metadata guards, and validation completed. |
