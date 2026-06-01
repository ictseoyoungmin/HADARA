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

The preferred HADARA-dev helper for this repeated workflow is:

```bash
npm run dev:docker-check
```

For CLI changes that should refresh `/workspace/dist` and run a built CLI runtime-origin smoke, use:

```bash
npm run dev:docker-sync-build
```

To create a Task Capsule through the built HADARA CLI while writing to the workspace:

```bash
docker exec hadara-dev bash -lc 'cd /tmp/hadara && npm run build >/dev/null && node dist/cli/main.js task create "<title>" --project /workspace'
```

## Suites

| Suite | Command | Purpose |
|---|---|---|
| Unit | `npm run test:unit` | Core functions and schemas. |
| Focused | `npm run test:focused -- tests/unit/<file>.test.ts` | One Vitest file or explicit small set of files. |
| Contract | `npm run test:contract` | Provider/tool interface compatibility. |
| Harness | `npm run test:harness` | Task Capsule validation, replay, and fake workflow checks. |
| Full | `npm test` | All Vitest suites. |
| Check | `npm run check` | TypeScript build plus all tests. |

Run these commands inside the Docker copy-to-`/tmp/work` pattern unless `docs/AGENT_HANDOFF.md` says the host Node environment has been fixed. For focused checks, prefer `npm run test:focused -- <path>` so the file path is passed directly to Vitest.

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

## Package Smoke Command Surface

The future executable package-smoke surface is:

```bash
hadara package smoke --dry-run --json
hadara package smoke --task <task-id> --json
hadara package smoke --workspace /tmp/hadara-package-smoke/<run-id> --json
hadara package smoke --from ./dist-release/hadara-0.1.0-rc.0.tgz --json
hadara package smoke --keep-temp --json
```

Use `hadara package smoke` as the primary command name. Do not use `hadara release smoke` as the primary command surface because release wording implies publish/deploy behavior.

Required flags and semantics:

- `--dry-run`: default first-stage behavior; plans workspace, commands, artifacts, and evidence without `npm pack`, install, package artifact writes, or release execution.
- `--json`: emits a reduced `hadara.packageSmoke.v1` report.
- `--task <task-id>`: selects an optional Task Capsule for evidence attachment.
- `--workspace <dir>`: sets the disposable workspace root, which must be outside committed source unless explicitly approved.
- `--from <tarball|dir>`: selects the package source.
- `--keep-temp`: preserves the disposable workspace for debugging and warns that private paths may exist locally.
- `--timeout <seconds>`: bounds execution.
- `--no-evidence`: runs without attaching evidence.
- `--attach-evidence`: attaches reduced public evidence only when `--task <task-id>` is provided and redaction checks pass.
- `--private-logs`: retains raw logs only under ignored private/local storage, never public Task Capsule files.

Approval and boundary rules:

- Dry-run planning may run in normal assisted/dev mode.
- Real package-smoke execution must require an explicit user command in a later implementation capsule.
- Package smoke must not be callable from MCP by default; any future MCP package-smoke surface must be opt-in, approval-gated, and privately audited.
- The release gate must not call `hadara package smoke`; it may only read documented markers and later evidence records.
- On success, disposable workspace cleanup should be the default. On failure, raw package/install artifacts should be removed unless `--keep-temp` is set, and public output should remain reduced and redacted.

## Release Install Package Smoke Plan

Tracked remaining capsule sequencing for package smoke, package metadata, Linux/WSL and Windows installers, USB portable launchers, install matrix smoke, evidence-backed release gates, release artifacts, and final publish/deploy scripts lives in `docs/DEVELOPMENT_SLICES.md` and `docs/V1_0_CAPSULE_BACKLOG.md`.

T-0138 evidence freeze:

- Strict release gate reads existing passed public Task Capsule evidence for package smoke, clean-checkout smoke, and release artifact build readiness.
- Advisory release gate reports missing evidence as warnings.
- Strict release gate reports missing package-smoke, clean-checkout smoke, or release artifact evidence with stable `*_EVIDENCE_MISSING` issue codes.
- Install-matrix evidence remains non-blocking until install-matrix smoke execution exists.
- The release gate must not execute smoke, package, install, publish, GitHub, Docker, provider, or MCP release/package/install behavior.

T-0140 dry-run evidence hardening:

- `hadara release dry-run --json` emits `hadara.releaseDryRun.v1` without publishing, creating GitHub Releases, building Docker images, loading token values, or mutating release state.
- The dry-run cross-checks passed public package-smoke, clean-checkout smoke, and release-artifact evidence records.
- Evidence artifact cross-checks require: `evidence.jsonl` record exists, `evidencePath` artifact exists, artifact schema is valid, source/report `ok` is true, and category/mode/result match the expected release check.
- Release artifact freshness requires the attached release artifact report or manifest to expose the current package version and a manifest hash; git commit freshness is checked when the artifact includes git commit metadata.
- Release artifact evidence has an explicit user path: build with `hadara release artifact --execute --json --output dist-release --attach-evidence --task <task-id>`, which attaches the reduced `hadara.releaseArtifact.v1` public report under `tasks/<task-id>/artifacts/release-artifact/`.

The local-only ignored file `docs/specs/HADARA_Release_Install_Package_Smoke_Capsule_Plan.md` may exist in this workspace as supporting planning context for agents, but it is intentionally not committed. Public user-facing install docs should prefer the installed `hadara` command form, while source-checkout validation may keep `node dist/cli/main.js` as an internal fallback until installer/package surfaces exist.

Installer dry-run planning now uses `hadara install plan --json`. This command emits `hadara.install.plan.v1`, reports planned writes without performing them, redacts public source/target paths, and returns `INSTALL_EXECUTION_DISABLED` for execute mode until a later capsule explicitly authorizes installer mutation. `--platform linux` is the user-facing Linux option; `posix` remains a compatibility alias. USB planning must be explicit with `--usb-root` or `--target`, and missing USB roots return `USB_ROOT_REQUIRED`. `wouldWrite: true` means a future confirmed execute/apply mode would write; dry-run JSON never prompts and never writes.

## Install Matrix Smoke Plan

T-0130 defines the install matrix before any executable install-matrix smoke runner exists. The matrix must distinguish source-checkout validation, package-install validation, USB portable validation, and installed-CLI feature validation.

Required rows:

- Linux source checkout: disposable clean checkout, Node 22, `npm ci`, `npm run check`, `hadara install plan --platform linux --json`, and core source CLI smoke.
- Linux package install: future package artifact, isolated prefix, installed `hadara` command, `hadara doctor --json`, and core smoke profile.
- WSL source checkout: Linux Node.js only, no Windows `node.exe` shim, `hadara install plan --platform wsl --json`, and core source CLI smoke.
- Windows source checkout: real Windows or explicitly documented Windows runner, Node 22, clean install/check, `hadara install plan --platform windows --json`, and source CLI smoke.
- Windows package install: future package artifact, `%LOCALAPPDATA%\HADARA` suggestion or explicit target, installed `hadara` command, `hadara doctor --json`, and core smoke profile.
- USB portable on Windows: explicit user-selected USB root such as `E:\HADARA`, portable launcher command form, no drive-letter assumption, no PATH/profile mutation, and core smoke profile.
- USB portable on WSL: explicit user-selected mounted removable root such as `/mnt/e/HADARA`, portable launcher command form, Linux Node.js where needed, no mount-path assumption, and core smoke profile.
- Installed CLI major-feature smoke: future shared smoke runner with `--profile core`, covering doctor, status, task read/list, evidence list, release-gate advisory read, and package/install-independent read-only surfaces.

Matrix boundaries:

- Docker/Linux validation does not replace real Windows validation.
- Package-install rows are blocked until package smoke and release artifacts exist.
- USB rows must require explicit user-selected USB roots.
- Matrix evidence must record platform, source kind, installer/package form, command form, and reduced public result.
- Raw logs and private paths must stay temporary or private/local.
- The release gate must not execute install matrix smoke; it may only check this plan now and later read reduced evidence records.

Structured matrix follow-up:

- T-0130 keeps rows as planning markers.
- Before row count or row status grows, promote the matrix into `docs/release-readiness.json` or `src/fixtures/install-matrix.v1.json`.
- The fixture should use `schemaVersion: "hadara.installMatrix.plan.v1"` and row fields such as `id`, `platform`, `sourceKind`, `commandForm`, and `status`.

## Major Feature Smoke Runner Plan

T-0131 adds the shared core feature smoke runner before package-smoke execution. The first profile is `core`, intentionally avoiding package-smoke execution and strict evidence-gate cycles.

Current T-0131 is not an installed-binary/PATH/launcher smoke. It calls internal service/read-model surfaces directly and reports `executionMode: "service-read-model"`, `binaryExecuted: false`, `launcherChecked: false`, and `packageInstallChecked: false`.

T-0131 validates:

- Core service/read-model surfaces are healthy.
- Reduced report summaries are safe.
- `hadara.featureSmoke.v1` output is schema-valid.
- TUI snapshot read-model/rendering does not break.
- Advisory release gate is callable as a service.

T-0131 does not validate:

- Installed `hadara` binary execution.
- PATH or launcher wiring.
- Package-installed CLI behavior.
- Subprocess command execution.
- Actual package-smoke execution.

Recommended `core` profile:

- `hadara doctor --json`
- `hadara status --json`
- `hadara task list --json`
- `hadara tools list --json`
- `hadara tui --snapshot --json`
- `hadara release gate --mode advisory --json`

`hadara smoke run --profile core --json` emits a reduced schema-valid `hadara.featureSmoke.v1` report. For registered sub-report schemas, the runner validates the reduced report before marking the step passed; unregistered sub-report schemas are marked as not registered rather than treated as installed CLI proof. T-0131 is the Core Feature Smoke Runner; future capsules own Installed CLI Smoke and Package Smoke Execution. The reserved `release-readiness` profile currently returns `FEATURE_SMOKE_PROFILE_DEFERRED`; later it may add strict release gate checks, package smoke evidence, install matrix evidence, release artifact evidence, and explicit installed-binary smoke once those surfaces exist.

## Package Metadata Release Readiness

T-0127 recorded package metadata decisions without making the package publishable. T-0142 transitions the package metadata to release-candidate mode while still performing no publish/deploy mutation.

Current package metadata is release-candidate stage:

- Package name decision: `hadara`.
- npm registry observation: `npm view hadara name version --registry=https://registry.npmjs.org` returned 404 on 2026-05-28; recheck immediately before publish because name availability can change.
- Current version is `0.1.0-rc.0`.
- Current package is `private: false`.
- Current binary remains `bin.hadara` at `./dist/cli/main.js`.
- Current `files` whitelist is `dist/`, `README.md`, `LICENSE`, and `package.json`.

Release metadata modes:

- Bootstrap metadata mode: version `0.0.0-bootstrap`, `private: true`, no package publishability.
- Release-candidate metadata mode: version `0.1.0-rc.N`, `private: false`, `files` whitelist present, `LICENSE` present, package smoke evidence present.

Release-candidate transition policy:

- Scoped fallback decision: do not silently switch names; choose and document an explicit scope in a later release-target capsule if `hadara` is unavailable.
- Version policy: first release-candidate target is `0.1.0-rc.0`; first stable target is `0.1.0` after package smoke, install matrix, release-gate evidence freeze, public docs alignment, and license finalization.
- T-0142 transitions `private` to false only after the package files whitelist, root README, license decision, and package-smoke evidence gates exist.
- Final `files` whitelist target: `dist/`, `README.md`, `LICENSE`, `package.json`, plus installer and portable files only after those files exist.
- Do not add `files` entries for missing installer or portable paths in T-0127.
- MIT license decision: adopt MIT; `LICENSE` exists and is included in the package whitelist.
- Publish target decision: npm package first, GitHub Release second, Docker image deferred.

CLI verification forms:

- Source checkout validation may use `node dist/cli/main.js doctor --json`.
- Installed CLI verification must use `hadara doctor --json`.
- Linked development CLI checks may use `npm link` only in a disposable workspace in later package-smoke work.

T-0127 performs no publish, no `npm pack`, no install smoke, no release artifact build, no GitHub Release, no Docker image build, and no registry mutation.

Release readiness marker debt:

- T-0124 through T-0127 release-gate readiness checks currently read planning markers from `docs/TEST_STRATEGY.md`.
- T-0128 introduced `docs/RELEASE_READINESS.md` as the dedicated structured readiness source for installer/package readiness details.
- A dedicated readiness source should preserve read-only release gate behavior while reducing strict-gate fragility from wording-only edits.

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

## Protocol Consistency Validation

Project Protocol Consistency Phase 2 must stay read-first and evidence-backed. Use the detailed source plan in `docs/specs/HADARA_Project_Protocol_Consistency_Layer_Phase2_Development_Plan.md` and the assimilated implementation notes in `docs/V1_0_IMPLEMENTATION_SCHEMAS.md`.

Required checks by slice:

| Slice | Required Focus |
|---|---|
| T-0152 Task Capsule scaffold frames | Unit or harness tests must assert new Task Capsule canonical table headers, legacy placeholder detection compatibility, and `evidence.jsonl` creation. |
| T-0153 Task Capsule consistency doctor | Tests must cover missing files, task/board status mismatch, Done with pending acceptance, missing evidence JSONL, stale task handoff, and placeholder drift. |
| T-0154 Project docs consistency doctor | Tests must cover Task Board row drift, duplicate rows, missing capsule paths, stale project handoff, missing Required Reading docs, and Development Slices evidence drift. |
| T-0155 Profile drift remediation guide | Tests must cover detected `basic`, `standard`, `governed`, `mixed`, and `unknown` profile states plus remediation hints for mismatched PROJECT_STATE/SOP/AGENTS metadata. |
| T-0156 Safe remediation MVP | Tests must prove dry-run writes nothing, `--execute` changes only whitelisted target files, and safe remediation never deletes user content. |
| T-0159 Protocol JSON contract | Contract tests must validate `hadara.protocol.consistency.v1`, remediation reports, stable issue-code registration, and existing JSON error-envelope behavior. |
| T-0160 Protocol doctor all scope | Tests must validate `--scope all`, default `protocol doctor --json`, schema-valid output, and no write/runtime side effects. |
| T-0161 Markdown table helper extraction | Tests must cover shared table parsing/formatting helpers, malformed-table skip behavior, safe cell validation, and unchanged protocol/harness issue-code behavior after extraction. |
| T-0162 Doctor remediation hint unification | Tests must cover additive doctor remediation hints for existing safe-auto fixes, schema-valid reports, no writes from doctor commands, and unchanged dry-run/execute semantics for `protocol remediate --fix`. |
| T-0163 Task upgrade-scaffold command | Tests must cover dry-run no-write behavior, execute idempotence, legacy prose preservation, malformed-file skip warnings, and no deletion or status/acceptance mutation. |
| T-0164 Protocol surface docs alignment | Tests or smokes must verify CLI help, schema notes, and JSON contract docs agree on implemented protocol doctor scopes and the current `protocol remediate --fix` surface. |

Protocol doctor and remediation surfaces must not enable Hermes/MCP runtime capabilities, execute shell commands, call providers, publish packages, mutate release state, or silently rewrite user-authored docs.

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

## Evidence Proof Semantics Validation

Phase 4 evidence work should validate proof meaning without changing persisted evidence writes in the first slice.

Focused semantic checks should cover:

```bash
npm run test:focused -- tests/unit/evidence-normalizer.test.ts
npm run test:focused -- tests/unit/evidence-semantics.test.ts
npm run test:focused -- tests/unit/evidence-lint.test.ts
npm run test:focused -- tests/unit/protocol-consistency.test.ts
npm run test:focused -- tests/harness/harness-validate.test.ts
```

Required scenarios:

| Scenario | Expected Result |
|---|---|
| Done task with only note/weak evidence | Semantic error. |
| Done task with unresolved failed evidence | Semantic error. |
| Failed evidence followed only by free-text `resolved`/`fixed`/`rerun passed`/`superseded` wording | Still unresolved; do not use conservative keyword matching. Require exact `supersedes:<id>` / `resolves:<id>` marker, later passed same-category evidence, or explicit residual-risk documentation. |
| Done task with unexplained blocked evidence | Semantic error. |
| Done task with substantive passed validation or implementation evidence | No semantic blocker. |
| Done task with private-only substantive evidence | Warning for normal tasks, not first-rollout harness failure. |
| Ambiguous passed command-log | Not over-classified as validation proof. |
| Release proof candidate with arbitrary passed command-log | Predicate rejects it. |

Full validation remains:

```bash
npm run dev:docker-sync-build
```

The first evidence semantics slice must not convert writers to `hadara.evidence.v2`, rewrite `EVIDENCE.md`, mass-migrate `evidence.jsonl`, change `hadara init`, execute release/package behavior, or add MCP writes.

Evidence v2 writer/migration work must begin as a design and dry-run-first migration plan. Required future validation includes dual-read v1/v2 normalization, no-write migration previews, hash-guarded execute behavior, private path non-leakage, and unchanged protocol/harness semantic behavior over mixed v1/v2 evidence.

## Harness-First Rule

Real provider integration must not be implemented until MockProvider, ScriptedProvider, policy preflight, fake tool harnesses, Task Capsule validation, and evidence recording workflows are stable.
