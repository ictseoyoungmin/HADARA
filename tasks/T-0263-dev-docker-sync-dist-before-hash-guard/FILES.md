# Files

| Path | Action | Reason | Status |
|---|---|---|---|
| src/cli/dev.ts | Modified | Parse `--before-hash` and `--allow-missing-before-hash` for `dev docker-check`. | Done |
| src/dev/docker-check.ts | Modified | Enforce reviewed before-hash guard before copying Docker-built `dist`. | Done |
| src/schemas/dev-docker-check.schema.json | Modified | Expose reviewed hash, match verdict, and escape-hatch metadata. | Done |
| tests/unit/dev-docker-check.test.ts | Modified | Cover matching hash, missing hash, stale hash, and first-time escape-hatch behavior. | Done |
| docs/TASK_WORKFLOW_COMMANDS.md | Modified | Update command semantics for implemented before-hash guard. | Done |
| docs/CLI_JSON_CONTRACT.md | Modified | Update JSON contract wording for T-0263. | Done |
| docs/PROJECT_STATE.md | Modified | Record T-0263 completion state. | Done |
| docs/DEVELOPMENT_SLICES.md | Modified | Mark T-0263 Phase 6.1 capsule complete. | Done |
| docs/AGENT_HANDOFF.md | Modified | Carry forward next Phase 6.1 work after T-0263. | Done |
