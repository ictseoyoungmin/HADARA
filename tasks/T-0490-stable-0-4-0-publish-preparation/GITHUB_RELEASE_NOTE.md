# HADARA 0.4.0

Stable release for the breaking 0.4 productization protocol after the published `0.4.0-rc.0` package, installed-package dogfood, and pre-stable friction cleanup.

## Highlights

- Productized 0.4 project scaffold with compact `AGENTS.md`, routing-only `.hadara/context/HADARA_CONTEXT.md`, workflow-owned docs, docs registry seed files, and profile-aware doctor checks.
- Four-file Task Capsule model for new 0.4 projects: `TASK.md`, `HANDOFF.md`, `EVIDENCE.md`, and canonical append-only `evidence.jsonl`.
- Human-readable `TASK.md` v2 layout with Goal/Scope/Plan before Inputs, evidence only where it proves Acceptance/Validation, hash-free Inputs, and manual Date/State/Note History.
- Registry-backed docs read maps and integration for `session start` and `context pack`.
- Normalized close-source contracts, evidence projection behavior, close-proof placement rules, and fail-closed legacy mutation boundaries.
- Agent-loop UX hardening from dogfood: top-level `taskId` JSON envelopes, clearer doctor install-origin output, monotonic timing paths, safer task-id allocation, compact `task status --summary-json`, and clearer `validation run` output boundaries.

## Boundaries

- This release promotes the 0.4 protocol line. It does not silently migrate older 0.3.x projects.
- The existing `0.4.0-rc.0` GitHub Release remains a draft prerelease unless an operator publishes it separately.
- Docker image build/push, PyPI publish, installer execution, MCP release/package execution, full agent runtime, scheduler/background runner, provider execution, vector retrieval, dashboard productization, and evidence rebuild execute remain out of scope.

## Validation

- `0.4.0-rc.0` was published and verified on npm with `next=0.4.0-rc.0`.
- Fresh-container installed-package dogfood built a usable FlowForge MVP and produced structured UX findings.
- T-0481 through T-0488 addressed the required pre-stable findings.
- T-0489 selected stable publish preparation after npm/GitHub/release-gate/capsule audit review.
