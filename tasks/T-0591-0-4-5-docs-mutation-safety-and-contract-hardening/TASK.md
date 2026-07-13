# T-0591 0.4.5 docs mutation safety and contract hardening

## Identity

| Field | Value |
|---|---|
| ID | T-0591 |
| Title | 0.4.5 docs mutation safety and contract hardening |
| Status | Done |
| Created | 2026-07-13 |
| Updated | 2026-07-13 |

Schema hint: use `hadara schema --json` or `hadara schema --domain <domain-id> --json` for controlled values before replacing scaffold tokens.

## Goal

| Goal | Notes |
|---|---|
| Harden 0.4.5 docs registry mutation commands before release. | Fix reviewer-identified safety gaps in exit codes, protected registry entries, schema contracts, help routing, boolean parsing, self-supersede, and `docs register` write guards. |

## Scope

| Boundary | Items |
|---|---|
| In | `docs register/update/archive/supersede/unregister/render` mutation contracts, docs registry schemas, command help/registry metadata, focused unit tests, built CLI smoke. |
| Out | New docs registry correction override command, broad docs registry UX redesign, installed-package recycle. |

## Plan

| Step | Action | Status |
|---|---|---|
| 1 | Define the hardening contract from release-blocker feedback. | Done |
| 2 | Implement mutation safety fixes and schema fixtures. | Done |
| 3 | Validate with build, focused tests, and built CLI smoke. | Done |

## Acceptance

| ID | Criterion | State | Evidence | Reference |
|---|---|---|---|---|
| AC-1 | Failed docs mutation reports set a nonzero CLI exit code. | Done | ev:T-0591:11aee056c4484c4d95fc5e3f | Release-blocker feedback item 1. |
| AC-2 | Canonical, required-reading, scaffold, projection, generated, and profile-seed entries are protected from generic mutation commands. | Done | ev:T-0591:0fa54024a1eb43b98daa82a0 | Release-blocker feedback item 2. |
| AC-3 | `hadara.docs.registryMutation.v1` and `hadara.docsRegistry.v3` are registered schema fixtures. | Done | ev:T-0591:0fa54024a1eb43b98daa82a0 | Release-blocker feedback item 3. |
| AC-4 | `docs supersede --path A --by A` and invalid boolean updates are rejected. | Done | ev:T-0591:0fa54024a1eb43b98daa82a0 | Feedback items 4 and 5. |
| AC-5 | Mutation command `--help` is handled before required-argument validation. | Done | ev:T-0591:11aee056c4484c4d95fc5e3f | Feedback item 6. |
| AC-6 | `docs register --execute` uses the same reviewed before-hash guard as other registry writes. | Done | ev:T-0591:11aee056c4484c4d95fc5e3f | Feedback item 7. |

## Validation

| Check | Gate | Result | Evidence |
|---|---|---|---|
| Host TypeScript build | Yes | Passed | ev:T-0591:ccddbbe0e36944b9a5ce6162 |
| Focused docs mutation tests | Yes | Passed | ev:T-0591:0fa54024a1eb43b98daa82a0 |
| Docker build | Yes | Passed | ev:T-0591:0d08c5ad5f89422981fa956b |
| Built CLI docs mutation smoke | Yes | Passed | ev:T-0591:11aee056c4484c4d95fc5e3f |
| Full test suite | No | Blocked | ev:T-0591:ed80ef8cae3c4bc390ffef66 |

## Inputs / Constraints

| Source | Role | State | Notes |
|---|---|---|---|
| `/home/ymin/.codex/attachments/94b3dd81-2200-42e0-831b-b32634834ea6/pasted-text.txt` | constraint | active | Release-blocker feedback driving this hardening capsule. |
| `docs/specs/0.4.5/docs-registry-v3-and-init-cleanup.md` | reference | active | Docs registry v3 and mutation command design. |
| `src/services/docs-registry.ts` | implementation-source | active | Registry read model and mutation service. |
| `src/cli/docs.ts` | implementation-source | active | Docs CLI routing and report exit behavior. |

## Changes

| Area | Summary |
|---|---|
| Docs CLI | Failed `ok:false` reports now set `process.exitCode = 6`; mutation help routes before required args. |
| Docs registry service | Generic mutation commands block protected seed/canonical entries; self-supersede and typo booleans are rejected; `docs register --execute` requires reviewed `--before-hash`. |
| Schema contracts | Added `hadara.docs.registryMutation.v1` and `hadara.docsRegistry.v3` fixtures and registered them in schema runtime/index/docs. |
| Tests | Added focused contract coverage for the release blockers and updated register/CLI tests for before-hash execute. |

## Risks / Follow-ups

| ID | Type | Summary | State | Link |
|---|---|---|---|---|
| RF-1 | Follow-up | Full sync script tar stage can hang on mounted workspace. | Open | Use direct Docker build for this capsule; consider a separate dev-workflow hardening task if it recurs. |

## History

| Date | State | Note |
|---|---|---|
| 2026-07-13 | Draft | Initial task scaffold. |
| 2026-07-13 | In Progress | Implemented docs mutation safety and schema-contract hardening. |
| 2026-07-13 | Done | Validation completed with focused gates passed and full suite environment-blocked. |
