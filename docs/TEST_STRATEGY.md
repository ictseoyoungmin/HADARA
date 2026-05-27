# TEST_STRATEGY

## Current Validation Environment

Docker is the primary validation path in this repository.

The host WSL environment does not currently expose a reliable Linux `node` binary, and Windows Node/npm shims on PATH fail under this sandbox. Direct `npm ci` on the `/mnt/f` workspace has also failed because npm could not create symlinks in `node_modules`.

For reliable validation, copy the repository into the container filesystem before running npm commands:

```bash
docker run --rm -v /mnt/f/NowWorking/HADARA-dev:/src:ro -w /tmp node:22-bullseye sh -lc 'cp -a /src /tmp/work && cd /tmp/work && npm ci && npm run check'
```

This pattern keeps the source mount read-only and runs dependency installation/build/test work in `/tmp/work` inside the container.

For repeated local development, a reusable container can stay running:

```bash
docker run -dit --name hadara-dev -v /mnt/f/NowWorking/HADARA-dev:/workspace -w /tmp node:22-bookworm bash
```

Run dependency-heavy work in `/tmp/hadara` inside that container, not directly on the mounted workspace:

```bash
docker exec hadara-dev bash -lc 'rm -rf /tmp/hadara && mkdir -p /tmp/hadara && tar --exclude=node_modules --exclude=dist -cf - -C /workspace . | tar -xf - -C /tmp/hadara && cd /tmp/hadara && npm ci && npm run check'
```

To create a Task Capsule through the built HADARA CLI while writing to the workspace:

```bash
docker exec hadara-dev bash -lc 'cd /tmp/hadara && npm run build >/dev/null && node dist/cli/main.js task create "<title>" --project /workspace'
```

## Suites

| Suite | Command | Purpose |
|---|---|---|
| Unit | `npm run test:unit` | Core functions and schemas. |
| Contract | `npm run test:contract` | Provider/tool interface compatibility. |
| Harness | `npm run test:harness` | Task Capsule validation, replay, and fake workflow checks. |
| Full | `npm test` | All Vitest suites. |
| Check | `npm run check` | TypeScript build plus all tests. |

Run these commands inside the Docker copy-to-`/tmp/work` pattern unless `docs/AGENT_HANDOFF.md` says the host Node environment has been fixed.

## Remote CI Observation

Remote CI observation and GitHub Actions observation are release-readiness signals, not replacements for local reproducible Docker validation. The release-gate readiness marker is: local Docker validation remains the primary reproducible check. The local Docker `npm run check` plus done-level harness validation remain the primary evidence required to complete Task Capsules.

When remote CI is observed, record the exact workflow, branch, commit SHA, run URL, conclusion, and relevant job steps in `docs/VALIDATION_HISTORY.md` or the active Task Capsule evidence. The release gate checks that this observation has been documented, but it does not call GitHub, create releases, deploy, or execute remote jobs.

## Required Session Checks

Before marking a development Task Capsule Done:

1. Run Docker `npm ci && npm run check`.
2. Run `hadara harness validate --task <task-id> --json` after building the CLI.
3. Record meaningful results in the Task Capsule `EVIDENCE.md` and `evidence.jsonl`.
4. Update `docs/AGENT_HANDOFF.md` with the validation outcome and next step.

Example Task Capsule validation:

```bash
docker run --rm -v /mnt/f/NowWorking/HADARA-dev:/src:ro -w /tmp node:22-bullseye sh -lc 'cp -a /src /tmp/work && cd /tmp/work && npm ci >/tmp/npm-ci.log && npm run build >/tmp/build.log && node dist/cli/main.js harness validate --task T-0023 --json'
```

## JSON CLI Smoke Checks

When a slice changes a CLI JSON surface, include at least one Docker-based smoke command that exercises the generated `dist/cli/main.js` command with `--json`.

Examples:

```bash
node dist/cli/main.js doctor --json
node dist/cli/main.js task list --json
node dist/cli/main.js policy preflight-shell "npm run check" --mode auto --json
node dist/cli/main.js harness validate --task <task-id> --json
```

## TUI Validation Strategy

The full TUI mockup parity and HADARA-native runtime design is preserved without omission in `docs/V1_0_IMPLEMENTATION_SCHEMAS.md`. TUI slices should use that section as the detailed source for validation requirements.

### TUI Unit Suites

Current and planned TUI unit suites:

```text
tests/unit/tui-state.test.ts
tests/unit/tui-snapshot.test.ts
tests/unit/tui-markdown.test.ts
tests/unit/tui-terminal.test.ts
tests/unit/tui-cli.test.ts
tests/unit/tui-cache.test.ts
tests/unit/tui-theme.test.ts
tests/unit/tui-mouse.test.ts
```

### TUI Performance Fixture

Future cache/performance work should add:

```text
tests/fixtures/tui-large-project.ts
```

The fixture should generate:

```text
- 1000 Task Capsules
- minimal TASK.md
- minimal PLAN.md
- minimal evidence.jsonl
- TASK_BOARD.md with all rows
```

The first performance report should be advisory and record:

```json
{
  "taskCount": 1000,
  "coldLoadMs": 1200,
  "cachedLoadMs": 120,
  "tabSwitchMs": 1,
  "searchMs": 8,
  "detailRefreshMs": 15
}
```

### TUI Boundary Tests

Every TUI slice must prove:

```text
- no Task Capsule mutation
- no evidence writes
- no handoff writes
- no shell execution
- no provider calls
- no MCP calls
- no release/package execution
```

Cache slices may write only:

```text
.hadara/local/tui/**
```

Cache slices must prove these paths are not written:

```text
docs/**
tasks/**
.hadara/context/**
committed evidence files
```

## Known Constraints

- `npm ci` currently reports 5 moderate audit findings from dev dependencies. Do not run `npm audit fix --force` without reviewing version impact.
- GitHub Actions has now been observed on remote `main`; keep future observations recorded with run URLs and exact commit SHAs.
- Host validation is not the source of truth until the Node/npm environment is fixed and recorded in `docs/AGENT_HANDOFF.md`.
- Do not commit `node_modules`, machine-local logs, secrets, or private state produced during validation.

## Harness-First Rule

Real provider integration must not be implemented until MockProvider, ScriptedProvider, policy preflight, fake tool harnesses, Task Capsule validation, and evidence recording workflows are stable.
