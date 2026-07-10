# v0.4.4 External Repository Validation Plan

## Goal

Prove whether the ordinary HADARA workflow holds outside HADARA-dev before adding new capabilities.

## Repositories

| Slot | Shape | Profile | Requirement |
|---|---|---|---|
| R1 | Small library or CLI | basic | No existing HADARA files; simple test command available. |
| R2 | Application or service | standard | Existing docs and at least one realistic feature/change task. |
| R3 | Long-lived or governance-heavy project | governed | Existing planning/security/release docs and multi-step work. |

Rules:

- Use real non-HADARA repositories.
- Work in disposable branches or copies.
- Do not publish, deploy, rotate secrets, or rewrite project history.
- Use installed `hadara@latest` only, expected `0.4.3` unless a later capsule retargets the package.
- Do not use HADARA-dev source-only commands, paths, or validation scripts.

## Capsule Budget

| Repo | Minimum | Target | Stop Condition |
|---|---:|---:|---|
| R1 | 5 capsules | 10 capsules | First serious product-blocking UX issue or target complete. |
| R2 | 8 capsules | 10 capsules | Same. |
| R3 | 8 capsules | 10 capsules | Same. |

Roadmap target is 20-30 real capsules total. Stop early only for a release-blocking defect.

## Required Workflow

For each repository:

1. `npm install -g hadara@latest` or isolated `npx hadara@latest`.
2. `hadara init --profile <profile> --json`.
3. `hadara task status --json`.
4. Create and complete real Task Capsules using:
   - `hadara task create ... --json`
   - real project validation
   - `hadara validation run ...` or `hadara evidence add-command ...`
   - `hadara task finalize --task ... --execute --auto --json`
5. Use diagnostics only when the normal path blocks.

## Metrics

| Metric | Target |
|---|---|
| Install-to-first-capsule time | Measured, not gated. |
| Normal command count per capsule | Report median and worst case. |
| Manual HADARA doc edits | Zero unless task content requires it. |
| Wrong next-work recommendation | Zero tolerance. |
| Removed-command/version drift | Zero tolerance. |
| Profile dropout | Record where the user/agent leaves the intended path. |
| Advanced/diagnostic command use | Allowed only with reason. |

## Output Artifacts

Each repo gets one report:

| Artifact | Content |
|---|---|
| `R*-DOGFOOD_REPORT.md` | Repo shape, profile, capsule list, metrics, good UX, friction, bugs. |
| `R*-evidence-summary.md` | Evidence ids or command summaries safe to commit here. |

Raw private logs, repository secrets, and target repository source dumps stay out of HADARA-dev.

## Release Decision

| Decision | Requirement |
|---|---|
| Ship 0.4.4 | All three reports complete, no zero-tolerance defect open, and ordinary workflow remains enough for most capsules. |
| Patch before 0.4.4 | Any wrong next-work recommendation, removed-command/version drift, generated-doc contradiction, or close/finalize blocker caused by HADARA itself. |
| Defer capability expansion | Any request for controller/provider/cloud/MCP-write features unless the ordinary evidence-control workflow is already validated. |
