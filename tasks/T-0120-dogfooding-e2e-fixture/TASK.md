# T-0120 Dogfooding E2E Fixture

## Goal

Add a deterministic HADARA-on-HADARA fixture that replays the core protocol path from in-memory context export through Task Capsule work, policy continuity, evidence attachment, handoff update, and done-level harness validation.

## Scope

- Add a fixture describing the dogfooding flow expectations.
- Add a harness test that creates a temporary HADARA project, exports context in memory, creates and completes a Task Capsule, checks policy for the validation command, attaches public evidence, updates handoff, and runs done-level harness validation.
- Assert the generated temporary capsule's key files in detail: `TASK.md`, `EVIDENCE.md`, `HANDOFF.md`, and `evidence.jsonl`.
- Add a built CLI smoke replay that uses CLI JSON surfaces only for generated context export compatibility, task read, policy, evidence, handoff write preflight, and harness validation checks.
- Keep the primary dogfooding fixture on in-memory context export; treat `hermes export-context --json` smoke as generated context export JSON surface compatibility.
- Keep the fixture deterministic and local-only.
- Update capsule and roadmap tracking docs with evidence.

## Out of Scope

- Real shell execution, provider calls, MCP writes, release/package execution, remote CI observation, or generated release artifacts.
- A public `hadara dogfood` command or new CLI surface.
- Broad schema strictness or release-gate promotion for the fixture format.

## Status

Done
