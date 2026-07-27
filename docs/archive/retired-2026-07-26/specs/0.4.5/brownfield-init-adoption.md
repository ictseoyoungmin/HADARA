# HADARA 0.4.5 Brownfield Init Adoption Contract

## Status

| Field | Value |
|---|---|
| State | Proposed |
| Owner | HADARA-dev |
| Release Target | 0.4.5 |
| Source Task | T-0592 |
| Scope | Init adoption contract and implementation plan |

## Problem

`hadara init` is safe enough for an empty project, but not yet safe for an existing repository.

The current init path creates directories, skips files that already exist, and reports success. Skipping an existing file prevents overwrites, but it does not prevent semantic damage:

| Case | Risk |
|---|---|
| Existing `docs/ARCHITECTURE.md` | The file is preserved but can be registered as a HADARA scaffold document. |
| Existing `.gitignore` | The file is preserved but may never ignore `.hadara/local/` or `.hadara/private/`. |
| Existing `AGENTS.md` | Project-owned agent rules are preserved, but no HADARA entrypoint is added. |
| Existing project version | Initial current state can record HADARA package version as project release. |
| Partial `.hadara/` state | Init can treat ambiguous state as success instead of failing closed. |

The 0.4.5 release should therefore treat safe brownfield adoption as a release gate before stable publish.

## Goals

| Goal | Requirement |
|---|---|
| Classify repository state before writing | Init must distinguish greenfield, brownfield, current, partial, legacy, and unsafe repositories. |
| Make brownfield bare init zero-write | `hadara init --profile <profile> --json` must return an adoption plan without writing when existing project signals are present. |
| Preserve existing ownership | Existing project files stay project-owned; HADARA may own bounded managed sections only. |
| Use reviewed execute | Brownfield writes require `--adopt --execute --plan-hash <hash>`. |
| Keep command surface small | Use `hadara init` options, not new top-level command ids. |
| Separate project and HADARA versions | Project release/version belongs to current state; HADARA version belongs to scaffold metadata. |
| Write v3 registry for adoption | Brownfield provenance requires `hadara.docsRegistry.v3` with explicit `origin`. |

## Non-Goals

| Non-Goal | Reason |
|---|---|
| Running tests during init | Adoption only plans and writes HADARA metadata/scaffold sections. |
| Auto-creating a first Task Capsule | The operator should explicitly create the baseline capsule. |
| Domain-specific profiles such as `game-dev` | Domain behavior belongs to project-authored docs and project identity, not init profiles. |
| Dead-code or command portfolio cleanup | Defer to 0.4.6 or 0.5.0. |
| Raw content inventory | Reports should include path, type, size, hashes, and classification, not file contents. |

## Repository Classification

Init must inspect bounded signals only:

| Signal | Examples |
|---|---|
| HADARA state | `.hadara/*`, `.hadara/scaffold.json`, `.hadara/docs-registry.json`, `.hadara/state/current.json` |
| Agent entry | `AGENTS.md` |
| Ignore rules | `.gitignore` |
| HADARA target docs | `docs/HADARA_WORKFLOW.md`, `docs/PROJECT_STATE.md`, `docs/TASK_BOARD.md`, `docs/AGENT_HANDOFF.md`, `docs/ARCHITECTURE.md`, `docs/DECISIONS.md`, `docs/ROADMAP.md`, `docs/SECURITY_MODEL.md` |
| Task area | `tasks/`, `tasks/T-*` |
| Common manifests | `README.md`, `package.json`, `pyproject.toml`, `Cargo.toml`, `go.mod`, `pom.xml`, `build.gradle*` |
| Common source roots | `src/`, `app/`, `lib/`, `packages/` |

| State | Meaning | Bare Init Behavior |
|---|---|---|
| `greenfield` | No meaningful project or HADARA state exists. | Create normal scaffold. |
| `brownfield` | Project files/manifests exist, HADARA state does not. | Write nothing; return adoption dry-run. |
| `hadara-current` | Valid current HADARA scaffold exists. | Write nothing; return doctor/upgrade guidance. |
| `hadara-partial` | Some HADARA files exist but the state is incomplete or ambiguous. | Fail closed with blockers. |
| `hadara-legacy` | Older protocol/scaffold is detected. | Write nothing; route to migration/remediation. |
| `unsafe` | Symlink, wrong file type, broken JSON, or conflicting managed markers detected. | Fail closed. |

Dirty git worktree is a warning, not a blocker.

## CLI Contract

### Greenfield

```bash
hadara init --profile standard --json
```

For `greenfield`, current behavior remains compatible: scaffold files are created immediately.

### Brownfield Dry-Run

```bash
hadara init --profile standard --json
```

For `brownfield`, bare init writes zero files and returns:

```json
{
  "schemaVersion": "hadara.init.adoption.v1",
  "command": "init",
  "ok": true,
  "mode": "dry-run",
  "repositoryState": "brownfield",
  "profile": "standard",
  "project": {
    "id": "existing-library",
    "name": "Existing Library",
    "currentRelease": "1.7.0"
  },
  "detectedManifests": [],
  "actions": [],
  "blockers": [],
  "warnings": [],
  "snapshotHash": "sha256:...",
  "planHash": "sha256:...",
  "executeCommand": "hadara init --profile standard --adopt --execute --plan-hash sha256:... --json"
}
```

### Brownfield Execute

```bash
hadara init --profile standard --adopt --execute --plan-hash sha256:... --json
```

Execute must recompute the bounded snapshot and plan immediately before writing.

| Condition | Result |
|---|---|
| Missing `--plan-hash` | `ok:false`, code `INIT_ADOPTION_PLAN_HASH_REQUIRED`, writes 0. |
| Recomputed plan differs | `ok:false`, code `INIT_ADOPTION_PLAN_MISMATCH`, writes 0. |
| Any blocker remains | `ok:false`, writes 0. |
| Plan matches and no blockers | Apply atomic planned writes only. |

## Report Schema

Register schema id: `hadara.init.adoption.v1`.

| Field | Type | Meaning |
|---|---|---|
| `schemaVersion` | const | `hadara.init.adoption.v1` |
| `command` | const | `init` |
| `ok` | boolean | True only when planning/execution is safe for the requested mode. |
| `mode` | enum | `dry-run` or `execute` |
| `repositoryState` | enum | `greenfield`, `brownfield`, `hadara-current`, `hadara-partial`, `hadara-legacy`, `unsafe` |
| `profile` | enum | `basic`, `standard`, `governed` |
| `project` | object | Project id/name/current release inferred or supplied. |
| `detectedManifests` | array | Bounded manifest signals with path, type, size, and hash. |
| `actions` | array | Planned path-level actions. |
| `preservedPaths` | array | Existing project-owned paths left untouched. |
| `managedPatches` | array | Managed section patches planned/applied. |
| `registeredExistingDocs` | array | Existing docs registered as project-authored. |
| `blockers` | array | Fail-closed reasons. |
| `warnings` | array | Non-blocking concerns. |
| `snapshotHash` | string | Hash of bounded target metadata, not raw contents. |
| `planHash` | string | Hash of action plan and snapshot hash. |
| `executeCommand` | string | Copyable execute command for dry-run reports. |
| `writes` | array | Paths actually written in execute mode. |

## Action Dispositions

Every target path must receive one disposition:

| Disposition | Meaning |
|---|---|
| `create` | Safe to create because no project-owned path exists. |
| `preserve` | Existing path is left byte-for-byte unchanged. |
| `patch-managed-section` | Existing file remains project-owned; HADARA updates only a bounded managed section. |
| `register-existing` | Existing project doc is registered as `project-authored`. |
| `already-managed` | Existing HADARA-managed target is valid and current. |
| `block` | Target is unsafe or semantically ambiguous. |

Action entries include:

```json
{
  "path": "AGENTS.md",
  "role": "agent-entry",
  "existingType": "file",
  "ownership": "project",
  "disposition": "patch-managed-section",
  "beforeHash": "sha256:...",
  "preservesExistingContent": true,
  "reason": "Existing project-owned AGENTS.md will retain all content outside the HADARA managed section."
}
```

## Path Contracts

### `.hadara/*`

| Situation | Behavior |
|---|---|
| Missing in greenfield | Create scaffold state. |
| Missing in brownfield dry-run | Plan creation only. |
| Valid current scaffold | Classify `hadara-current`. |
| Partial files | Classify `hadara-partial`; write nothing. |
| Invalid JSON | Block. |
| Symlink or wrong target type | Block. |

### `.gitignore`

Existing `.gitignore` must not be replaced.

Managed section:

```gitignore
# hadara:managed:start local-state
.hadara/local/
.hadara/private/
.hadara/cache/
# hadara:managed:end local-state
```

| Situation | Behavior |
|---|---|
| Missing | Create file. |
| Existing file without block | Append managed block; preserve all existing bytes outside insertion point. |
| Existing block | Validate or update block. |
| Conflicting/unclosed marker, symlink, or binary | Block. |

### `AGENTS.md`

Existing project rules are project-owned. Add only a bounded entry section:

```markdown
<!-- hadara:managed:start agent-entry {"schema":"hadara.managedSection.v1","owner":"init.adoption","kind":"single-block","mode":"replace","version":1} -->
## HADARA Workflow

Before starting work:

1. Read `.hadara/context/HADARA_CONTEXT.md`.
2. Run `hadara task status --json`.
3. Use `hadara session start --task T-XXXX --json` for the selected capsule.
<!-- hadara:managed:end agent-entry -->
```

Registry entry:

```json
{
  "path": "AGENTS.md",
  "owner": "project",
  "origin": { "type": "project-authored" },
  "managedSections": [{ "id": "agent-entry", "owner": "hadara-init" }]
}
```

### Core Projections

These may be merged into existing files as managed sections:

| Path | Managed Role |
|---|---|
| `docs/PROJECT_STATE.md` | `current-state-canon` projection |
| `docs/TASK_BOARD.md` | HADARA task table |
| `docs/AGENT_HANDOFF.md` | compact handoff projection |

Existing prose outside managed sections remains project-owned.

### `docs/HADARA_WORKFLOW.md`

This path is HADARA-specific.

| Situation | Behavior |
|---|---|
| Missing | Create. |
| Existing current/legacy HADARA workflow | Preserve or migrate. |
| Existing unrelated project doc | Block. |

### Project Reference Docs

If these already exist, register them as project-authored:

| Path | Brownfield Behavior |
|---|---|
| `docs/ARCHITECTURE.md` | `register-existing`, owner `project`, origin `project-authored` |
| `docs/DECISIONS.md` | `register-existing`, owner `project`, origin `project-authored` |
| `docs/ROADMAP.md` | `register-existing`, owner `project`, origin `project-authored` |
| `docs/SECURITY_MODEL.md` | `register-existing`, owner `project`, origin `project-authored` |

`docs doctor` must be origin-aware and must not require HADARA scaffold table frames for `project-authored` docs.

### `tasks/`

| Situation | Behavior |
|---|---|
| Missing | Create directory only. |
| Existing directory | Preserve. |
| Existing regular file | Block. |
| Existing `T-*` HADARA capsule | Recognize. |
| Existing non-HADARA `T-*` directory | Warn or block, depending on collision severity. |

Do not create `tasks/.gitkeep`.

## Project State and Versioning

Project release/version is not HADARA package version.

Inference order:

1. Explicit `--project-version`.
2. Manifest version, such as `package.json.version`.
3. `"unversioned"`.

HADARA version belongs in `.hadara/scaffold.json`:

```json
{
  "schemaVersion": "hadara.projectScaffold.v1",
  "profile": "standard",
  "initializationMode": "brownfield",
  "createdWith": "hadara@0.4.5",
  "projectId": "existing-library",
  "adoptionPlanHash": "sha256:..."
}
```

Remove hardcoded `createdWith: "hadara@0.4.0"`.

## Initial Brownfield Current State

Adoption should not pretend the next step is starting a new empty project.

```json
{
  "nextWork": {
    "title": "Establish HADARA adoption baseline",
    "state": "candidate",
    "operatorGuidance": "Review existing project docs, validation commands, known problems, and authoritative sources before normal feature work.",
    "createCommandAllowed": true
  },
  "validationBaseline": {
    "summary": "Existing project adopted; no HADARA validation baseline has been recorded yet.",
    "evidence": []
  }
}
```

Recommended command:

```bash
hadara task create "Establish HADARA adoption baseline" --json
```

## Fail-Closed Conditions

| Code Area | Blocker |
|---|---|
| Filesystem | Target path is symlink or wrong file type. |
| State | `.hadara/scaffold.json`, `.hadara/docs-registry.json`, or `.hadara/state/current.json` is invalid JSON. |
| Managed sections | Marker is duplicated, unclosed, or owned by another protocol. |
| Plan review | Target metadata changed after dry-run. |
| Workflow | Existing `docs/HADARA_WORKFLOW.md` is not a HADARA workflow doc. |
| Partial state | `.hadara/` ownership cannot be safely classified. |

## Implementation Capsules

| Capsule | Scope | Acceptance |
|---|---|---|
| T-0593 Brownfield Detector and Dry-run Planner | Repository classification, bounded path inspection, zero-write brownfield plan, snapshot/plan hashing. | Brownfield bare init writes 0 files; greenfield compatibility remains; current/partial/legacy/unsafe states classify correctly. |
| T-0594 Managed Merge and v3 Adoption Writer | `.gitignore`, `AGENTS.md`, core projection managed sections, reference-doc registration, v3 writer, atomic execute. | Execute requires matching plan hash; managed-section outside content preserved byte-for-byte; existing docs are project-authored. |
| T-0595 Project State and Adoption Doctor Cleanup | Project version vs HADARA version split, dynamic scaffold metadata, brownfield next work, origin-aware doctor, idempotent repeated adoption. | External project current release is not HADARA version; doctor accepts project-authored docs without scaffold table frames. |
| T-0596 Brownfield Installed-package Dogfood | Candidate package on TypeScript, Python/data, and web/monorepo brownfields. | Existing source/config changes 0; managed-section outside changes 0; 3/3 adoptions pass; baseline capsules close valid. |
| T-0597 Release Readiness | Version bump, release notes, package smoke, clean-checkout, installed candidate recycle. | Only starts after brownfield gates pass. |

## Validation Plan

| Check | Evidence |
|---|---|
| Unit tests for classifier states | Init adoption service tests. |
| Unit tests for brownfield zero-write plan | Snapshot of temp repo before/after bare init. |
| Unit tests for plan mismatch | Mutate a target after dry-run, then assert execute writes 0. |
| Unit tests for managed section merge | Existing content outside block preserved byte-for-byte. |
| Unit tests for v3 writer provenance | Existing docs become `origin.type = project-authored`; generated docs remain HADARA-owned. |
| `/tmp` brownfield smokes | Basic TypeScript, Python/data, and monorepo fixtures. |

## Decision

0.4.5 stable must not ship until safe brownfield init adoption is implemented and dogfooded. Registry mutation hardening remains a prerequisite, but release readiness is blocked until init adoption can safely plan and execute on existing repositories.
