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

## Clean Checkout Package Smoke Plan

This plan defines release-readiness observation, not release execution. Run it only in a disposable Docker/container filesystem copy of the repository, and keep committed source, Task Capsules, evidence, private state, generated context, package artifacts, and local cache boundaries unchanged unless a later Task Capsule explicitly approves a write path.

Sequence:

```bash
npm ci
npm run build
npm run check
node dist/cli/main.js doctor --json
node dist/cli/main.js ops status --json
node dist/cli/main.js release gate --mode strict --json
```

The current smoke plan performs no packaging or release execution. It does not run `npm pack`, publish packages, create archives, compute release checksums, call GitHub, deploy, execute MCP release/package tools, or mutate Task Capsules. If a future capsule adds executable package smoke behavior, it must define the allowed workspace, expected artifacts, redaction/audit handling, and evidence format before implementation.

## Executable Package Smoke Artifact Boundary

This boundary is a design contract for a future executable package-smoke command. It does not authorize package or release execution in the current release gate.

Allowed workspace:

- The smoke run must operate in a disposable clean checkout under a container or temporary filesystem such as `/tmp/hadara-package-smoke/<run-id>`.
- Dependency installation, build output, package installation targets, npm cache overrides, and package-smoke command logs must stay inside the disposable workspace or ignored local/private HADARA storage.
- The mounted project workspace remains source input only unless a later Task Capsule explicitly approves a narrow write path.

Package artifact paths:

- Future package artifacts such as `*.tgz`, expanded install trees, npm cache content, and raw command transcripts are temporary by default.
- No package artifact, archive, checksum file, install tree, or raw log is committed under `docs/`, `tasks/`, `.hadara/context/`, or other portable project files by default.
- Public Task Capsule artifacts may contain only reduced UTF-8 text or JSON summaries under `tasks/<task-id>/artifacts/package-smoke/` after passing the existing public evidence artifact redaction policy.

Redaction and audit handling:

- Public package-smoke evidence must use the existing public artifact policy: UTF-8 text only, high/critical secret findings blocked, and no private absolute paths.
- Private/raw logs or package artifacts must be treated as private evidence or disposable workspace content. If retained, they must live under ignored private/local HADARA storage with structured audit metadata.
- User-facing JSON must report reduced metadata only: command labels, exit codes, relative evidence paths, elapsed time, artifact names, byte counts, hashes when explicitly approved, and redaction summary counts. It must not include raw package contents, raw npm logs, private source paths, environment secrets, or private store paths.

Evidence/report shape:

```json
{
  "schemaVersion": "hadara.packageSmoke.v1",
  "command": "package.smoke",
  "ok": true,
  "workspace": {
    "kind": "disposable",
    "pathRedacted": true
  },
  "steps": [
    {
      "name": "npm ci",
      "status": "passed",
      "exitCode": 0
    }
  ],
  "artifacts": [
    {
      "kind": "summary",
      "visibility": "public",
      "evidencePath": "tasks/T-0000-example/artifacts/package-smoke/<timestamp>-summary.json"
    }
  ],
  "issues": []
}
```

The future executable package-smoke command must define approval, cleanup, and failure semantics in its own Task Capsule before implementation. Until then, `hadara release gate --mode strict --json` remains a read-only checklist and performs no package-smoke execution.

## Release Install Package Smoke Plan

Detailed remaining capsule sequencing for package smoke, package metadata, Linux/WSL and Windows installers, USB portable launchers, install matrix smoke, evidence-backed release gates, release artifacts, and final publish/deploy scripts lives in `docs/specs/HADARA_Release_Install_Package_Smoke_Capsule_Plan.md`.

Use that plan before starting T-0126 or later release/install/package-smoke capsules. Public user-facing install docs should prefer the installed `hadara` command form, while source-checkout validation may keep `node dist/cli/main.js` as an internal fallback until installer/package surfaces exist.

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
