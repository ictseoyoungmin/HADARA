# T-0501 Dogfood Report

## Environment

| Field | Value |
|---|---|
| Source workspace | `/mnt/f/NowWorking/HADARA-dev` |
| Built CLI | `node /mnt/f/NowWorking/HADARA-dev/dist/cli/main.js` |
| Initial temp project | `/tmp/hadara-t0501-DVsjQo` |
| Fixed temp project | `/tmp/hadara-t0501-fixed-HZFcr8` |
| Profile | `governed` |
| Date | 2026-07-07 |

## Summary

Fresh `hadara init --profile governed` was exercised from a temporary project through generated Markdown review, task lifecycle, evidence, docs registry, slices, context slice, policy, Hermes export, help, and removed-command stubs.

The dogfood found and fixed four current-surface defects:

| ID | Finding | Resolution |
|---|---|---|
| F-1 | Generated `docs/HADARA_WORKFLOW.md` still taught removed low-level lifecycle commands and plan-hash-only execution. | Updated init workflow guidance to prefer `task finalize --execute --auto`, classify explicit `--plan-hash` as external-review flow, and document removed lifecycle stubs. |
| F-2 | Fresh governed init was `init doctor` clean but `protocol doctor --scope all` reported missing old profile docs (`DEVELOPMENT_SLICES`, `TEST_STRATEGY`, `REFACTOR_LOG`). | Aligned protocol profile detection with the current slim init profile. `DEVELOPMENT_SLICES` is now slice-state on demand, not a governed init requirement. |
| F-3 | `AGENTS.md` Required Reading parser treated task-local `HANDOFF.md` and `EVIDENCE.md` text as missing root files. | Restricted Required Reading path checks to path-like tokens. |
| F-4 | `task finalize` and `task status` reports still exposed removed lifecycle commands as copyable guidance. | Replaced report command strings with `task finalize --execute --auto`, `task finalize --json`, or `task status --detail full`; changed `task lifecycle` metadata from planned to removed. |

## Generated Markdown Review

| File | Result | Notes |
|---|---|---|
| `AGENTS.md` | Pass after parser fix | Required Reading is compact and no longer produces false missing-root warnings for task-local `HANDOFF.md`/`EVIDENCE.md`. |
| `.hadara/context/HADARA_CONTEXT.md` | Pass | Correctly points to `AGENTS.md`, `PROJECT_STATE`, `TASK_BOARD`, and `HADARA_WORKFLOW`; no SOP reference found. |
| `docs/HADARA_WORKFLOW.md` | Fixed | Initial generated copy contained stale low-level lifecycle commands; fixed generated output now points to `--execute --auto` and removed-command stubs. |
| `docs/PROJECT_STATE.md` | Pass with note | Bootstrap content is minimal; `status` still reports advisory missing slices/release-readiness until those domains are used. |
| `docs/AGENT_HANDOFF.md` | Pass | Compact scaffold only. `task status` correctly warns if active/latest rows are stale after task work. |
| `docs/TASK_BOARD.md` | Pass | `task create` and `finalize` updated task rows as expected. |
| `docs/ARCHITECTURE.md`, `docs/DECISIONS.md`, `docs/ROADMAP.md`, `docs/SECURITY_MODEL.md` | Pass | Conditional-reference scaffolds; not default command guides. |

No generated `docs/IMPLEMENTATION_SOP.md` or `docs/TASK_WORKFLOW_COMMANDS.md` appeared in the fresh scaffold.

## CLI Matrix

| Area | Commands Exercised | Result | Notes |
|---|---|---|---|
| Init | `init --profile governed --json`, `init doctor --json` | Passed | Generated 15 files and doctor returned `ok:true`. |
| Protocol/docs health | `protocol doctor --scope all --json`, `docs doctor --json`, `doctor --json` | Passed | After fixes, protocol issues are empty; stateConsistency still reports advisory missing slices/release readiness before those domains are initialized. |
| Help/registry | `help lifecycle`, `help command task.finalize`, `commands --json`, `schema --domain task.risk.state --json` | Passed | Help now shows `--execute --auto`; command docs point to `docs/HADARA_WORKFLOW.md`. |
| Lifecycle | `task create`, `task status --detail full`, `task finalize --json`, `task finalize --execute --auto` | Passed | Temp T-0001 reached `closed-valid` and evidence summary showed close evidence `ev:T-0001:76110ba7e5dc4fee9c3caf7c`. |
| Validation/evidence | `validation run -- node --version`, direct `node --version`, `evidence add-command`, `evidence summary` | Passed with friction | `validation run` could not spawn `node` in this environment (`EPERM`) and correctly recorded blocked evidence. Direct command passed and a resolving evidence row was added. |
| Removed lifecycle stubs | `task ready --task T-0001 --json` | Passed | Returned `hadara.commandRemoved.v1` with `replacementCommand` and `diagnosticCommand`. |
| Docs registry | `docs register --execute`, `docs mark --execute`, `docs list`, `docs doctor` | Passed | General status correction path works with before-hash execute guard. |
| Slices | `slice list`, `slice add`, `slice list` | Passed | Missing state is a warning; `slice add` created `.hadara/state/slices.json` and generated `docs/DEVELOPMENT_SLICES.md`. |
| Context/Hermes | `context slice`, `hermes export-context` | Passed | Context slice returned exact text with hashes; Hermes export wrote `.hadara/context/HADARA_CONTEXT.md`. |
| Policy | `policy check-shell "node --version"`, `policy check-shell "rm -rf ."` | Passed | Non-dangerous command allowed; destructive command denied. |

## Friction

| ID | Area | Detail | Disposition |
|---|---|---|---|
| UX-1 | Validation wrapper | `validation run -- node --version` recorded blocked evidence because child process launch returned `EPERM`, while direct `node --version` passed. The nextActions were useful and made the recovery path clear. | Leave as observed environment friction; report documents it. |
| UX-2 | State advisory | Fresh init still shows advisory missing `docs/DEVELOPMENT_SLICES.md` and `docs/RELEASE_READINESS.md` in `stateConsistency`/`status`. This is not blocking, but the fix hint still says restore/init remediation for slices even though the current path is `slice add` or `slice migrate`. | Follow-up candidate for stateConsistency wording. |
| UX-3 | Docs mark ceremony | `docs mark` dry-run plus `--before-hash` execute is safe but a little heavy for simple typo correction. | Acceptable for now; matches registry write safety. |

## Good Points

| Area | Observation |
|---|---|
| `--auto` lifecycle | Once the task contract and evidence were ready, `task finalize --execute --auto` closed the capsule in one command and preserved close proof checks. |
| Evidence resolution | Blocked validation evidence was not hidden; resolving passed evidence linked back with `resolves:`. |
| Removed stubs | Removed lifecycle command stubs are machine-readable and include replacement fields. |
| Slice state | `slice add` cleanly created both canonical state and generated projection with hash metadata. |
| Docs registry | Register/mark/list/doctor are coherent and no longer require direct registry editing for ordinary status correction. |

## Follow-Up Candidates

| ID | Summary | Suggested Owner |
|---|---|---|
| FU-1 | Improve stateConsistency missing-slices wording to suggest `hadara slice add` or `hadara slice migrate --execute`, not generic restore/init remediation. | 0.4.1 cleanup |
| FU-2 | Investigate why `validation run` child process spawn returned `EPERM` in the Codex/tool environment while direct command execution passed. | Environment or validation wrapper hardening |

## Secondary Reviewer Addendum

After the initial T-0501 close, a second reviewer independently exercised the candidate and reported additional UX and command-surface issues. Some findings overlap with fixes already made during T-0501, but they are retained here because they define the regression surface for the next capsule.

| ID | Severity | Observation | T-0502 Handling |
|---|---|---|---|
| RV-1 | Critical | Generated `docs/HADARA_WORKFLOW.md` from `init` can contradict removed lifecycle surfaces by teaching `task finish`, `task ready`, `task close`, and `task audit-close` as normal guidance. | Verify current T-0501 fix in both init template blocks and add generated-doc regression coverage so removed commands cannot reappear as primary guidance. |
| RV-2 | Critical | Generated docs under-expose `task finalize --execute --auto` and `hadara slice`, making FD-010 and FD-012 invisible to new projects. | Add explicit generated workflow guidance and tests for `--auto` and slice state commands. |
| RV-3 | Critical | `help lifecycle` says low-level proof-boundary commands are available through a help family even though those commands were removed from the agent-facing surface. | Remove or reword the false promise; verify help output points to `task status --detail full` and `task finalize`. |
| RV-4 | High | Session-start guidance can leak `node dist/cli/main.js ...` developer command forms to installed users. | Audit session-start report/guidance command strings and replace product-facing copyable commands with `hadara ...`, preserving source-checkout-only docs where appropriate. |
| RV-5 | High | `validation run` records failed child evidence but returns wrapper exit code 0, which can hide failures in shell chaining and CI. | Make wrapper exit non-zero when the child command fails or launch fails, while preserving evidence append semantics and JSON report shape. |
| RV-6 | High | `--help` is inconsistent: several commands validate required args or execute before showing help. | Add a central or shared early-help path and regression tests for validation, finalize, slice, harness, and session commands. |
| RV-7 | High | Handoff-first selected-work guidance can get stuck on scaffold text such as "Create or select first Task Capsule", even after task creation/close, and can propose that sentence as a task title. | Harden task-next/status selection against scaffold/meta handoff text and prefer concrete active/open work or release-gate guidance. |
| RV-8 | Minor | Task status readiness notes can keep `T-XXXX` placeholders even when the selected task id is known. | Replace selected-task placeholders in emitted guidance where task id is available. |
| RV-9 | Minor | `closed-valid` status can still show "Ready for Done: no", which reads contradictory even if caused by a fast-path skip. | Clarify closed-valid readiness copy or omit the ready-for-done line in closed-valid fast status. |
| RV-10 | Minor | `task create` scaffolds `Created`/`Updated` as `TBD` even though the CLI knows the date, and generated TASK.md lacks schema/token hints. | Fill known dates at create time and add compact schema/vocabulary hint where it helps without bloating the scaffold. |
| RV-11 | Minor | `state verify` can return `ok:true` with `consistent:false`, which is internally consistent but confusing for first-time users. | Clarify JSON/text semantics so `ok` means report generation and `consistent` means state health. |

Next capsule owner: `T-0502 0.4.1 rc0 post-dogfood critical UX hardening`.
