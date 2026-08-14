# Current-build Init and Task Capsule document audit

## Audit identity

| Field | Observation |
|---|---|
| CLI | `/home/ymin/HADARA-dev/dist/cli/main.js` |
| Package | `hadara@0.5.0-rc.6` |
| Build freshness | `distLooksStale=false` |
| Main disposable project | `/tmp/hadara-doc-audit.MIVWnS` |
| Additional preset roots | `/tmp/hadara-minimal-audit.k8oFut`, `/tmp/hadara-governed-audit.H3yVyV`, `/tmp/hadara-default-audit.zl0LFy` |
| Repository mutation | No runtime/site source changed by the disposable runs; this audit artifact and T-0790 task-local evidence are the durable record. |

## Scenarios exercised

1. Ran plain init dry-run and confirmed the default preset is `standard` with nine planned scaffold actions.
2. Ran `--preset minimal`, `standard`, and `governed` dry-runs. Minimal planned eight core actions; standard added `docs/PROJECT_OVERVIEW.md`; governed additionally planned `docs/ARCHITECTURE.md`, `docs/SECURITY.md`, and `docs/GOVERNANCE.md`.
3. Applied standard Init v1 through dry-run plus reviewed plan hash.
4. Inspected `AGENTS.md`, `.hadara/project.json`, `.hadara/documents.json`, `.hadara/context/READ_MAP.md`, `docs/HADARA_WORKFLOW.md`, `docs/TASK_BOARD.md`, `docs/PROJECT_OVERVIEW.md`, and `.gitignore`.
5. Created three Task Capsules:
   - T-0001: successful validation followed by a post-write close blocker and recovery-marker conflict.
   - T-0002: failed evidence, automatic same-identity resolution, explicit cross-identity resolution, `closed-valid`, and zero-write close retry.
   - T-0003: intentionally open Draft capsule inspected through full selected-task status.
6. Ran `init doctor`, `docs read-map`, evidence lint, close dry-run, reviewed close execute, and idempotent close retry.

## Descriptions that match generated behavior

- The public preset table matches the actual action sets. Plain init defaults to `standard`.
- Init creates the documented shared core: `AGENTS.md`, `.gitignore`, the two canonical Init v1 JSON files, generated `READ_MAP.md`, workflow, Task Board, and `tasks/`.
- `.hadara/project.json` records lifecycle version, `presetOrigin`, features, and document packs; `.hadara/documents.json` is the registry read by document routing.
- Task Capsule anatomy matches the site: `TASK.md`, `HANDOFF.md`, canonical append-only `evidence.jsonl`, and generated `EVIDENCE.md`.
- `TASK.md` contains identity, Goal, Scope, Plan, Acceptance, Validation, Inputs / Constraints, Changes, Risks / Follow-ups, Close Summary, and History. Close owns identity and Task Board status changes.
- `HANDOFF.md` contains Last Completed, Pre-Close Operator Action, Post-Close Continuation, and Carry Forward Warnings; done-level validation requires the pre-close row to be terminal.
- `EVIDENCE.md` preserves resolved failures in the residual table and adds readiness plus close-proof rows after successful close.
- `TASK_BOARD.md` is a compact projection with `ID`, `Title`, `Status`, `Targets`, `Capsule`, and `Result`; close projects `Close Summary` into `Result`.
- A clean T-0002 close reached `closed-valid`; an identical retry performed zero writes and appended no new close proof.

## P1 findings

### P1-1: fresh generated workflow uses stale profile terminology

The current public site and actual Init v1 command path use `--preset minimal|standard|governed`. Fresh `docs/HADARA_WORKFLOW.md` and the current CLI help still show `--profile basic|standard|governed` and refer to profile-specific required reading. Compatibility may accept the old form, but a newly initialized repository immediately contradicts the current public onboarding.

Required correction: make generated workflow/help use the current preset vocabulary and describe profile only as a compatibility/diagnostic view when needed.

### P1-2: fresh `AGENTS.md` contradicts canonical read routing

The generated session steps say `READ_MAP.md` and `TASK_BOARD.md` are Markdown fallbacks used only when the CLI is unavailable or routing needs investigation. Its Required Reading table then says both are read every session. Meanwhile `.hadara/documents.json` marks both `explicit-only`, and `hadara docs read-map --task T-0003 --json` places both under `doNotReadByDefault` with `readTier=excluded`.

Required correction: generate one consistent status-first rule. Session-start should route through `AGENTS.md`, workflow, selected status, and the active capsule; Task Board/Markdown read map should not simultaneously be mandatory and excluded.

### P1-3: post-write close blocker can create a non-resumable recovery trap

T-0001 close dry-run reported an executable plan and did not surface that Post-Close Continuation used `Disposition=actionable` with `Create Task=no`. Execute first projected TASK/HANDOFF/Task Board identity to `Done`, then blocked on `HANDOFF_CONTINUATION_SEMANTIC_CONFLICT` before close proof. Correcting the reported HANDOFF blocker changed a marker-bound source. A new dry-run became ready, but reviewed execute refused with `TASK_CLOSE_OPERATION_RECOVERY_REQUIRED` because the valid recovery marker now observed a conflicting HANDOFF write. The returned action only said to inspect/rerun dry-run; no supported repair command completed recovery.

This contradicts the public Task Lifecycle statement that partial close recovery completes by rerunning task close.

Required correction: validate virtual post-write HANDOFF semantics before lifecycle mutation, or provide a bounded reviewed recovery operation that can adopt the explicitly repaired source and complete proof-last close. Public docs must distinguish resumable prefix recovery from conflict recovery.

### P1-4: selected status mislabels an evidence append as read-only

T-0003 full status returned an `add-command-evidence` next action whose command appends canonical evidence, while the action reported `writeBoundary=read-only`, `writes=false`, and `requiresReview=false`.

Required correction: classify this action as a task-local/evidence-append write so agents and policy layers do not treat a mutating recommendation as read-only.

### P1-5: compact close dry-run routes its execute action back to dry-run

Executable compact close dry-runs for T-0001/T-0002 returned a primary action whose summary said to apply guarded writes but whose command was again `hadara task close ... --dry-run --json`. The full report used the expected execute command.

Required correction: compact and full reports must project the same executable next action, using the reviewed plan-hash form where that boundary is requested.

## P2 documentation and projection findings

### P2-1: the public READ_MAP description attributes CLI tiers to the Markdown file

Fresh `.hadara/context/READ_MAP.md` contains only `Document`, `Read Policy`, and `Status`. Rich `readTier`, authority, edit policy, active-task injection, and `readFirst/readIfNeeded/doNotReadByDefault` grouping appear in `hadara docs read-map --json`, not in the Markdown projection itself.

Correction options: enrich the Markdown projection or say explicitly that the CLI read-map report supplies the richer tiered routing view.

### P2-2: generated evidence summaries are much denser than the public example

The public example shows a concise result such as “14 focused retry tests passed.” Actual `validation run` projection rows include command preview, argv hash, exit/signal/duration, and stdout/stderr hashes in one long table cell. The projection is truthful, but the site currently overstates its immediate human readability.

Correction options: project a concise primary summary with details elsewhere, or show a more representative abridged example and explain the omitted machine detail.

### P2-3: Task Board `Targets` and `Result` lineage is underexplained

The site correctly calls Task Board a compact index, but does not explain that `Targets` comes from task creation and `Result` is projected from exact `TASK.md` Close Summary during close. `TASK.md` documentation also omits Close Summary from its section table.

### P2-4: HANDOFF controlled relationships need one explicit table

Runtime validation requires `actionable` continuation to use `Create Task=yes`. A continuation to an already-created capsule cannot use `actionable/no`; the tested compatible representation was `waiting-for-operator/no`. The site lists continuation vocabulary but does not explain the `Disposition`/`Create Task` invariant.

### P2-5: “same check” automatic resolution means same check identity, not name alone

Two validation attempts named `Recovery probe` did not auto-resolve when their argv changed. Re-running `Stable recovery probe` with the identical `node recovery-probe.js` argv did auto-resolve after the script state changed. Fresh generated workflow describes this as the same check name, which is too broad.

### P2-6: Task Board management metadata is inconsistent across init outputs

The init plan labels `docs/TASK_BOARD.md` as `command-managed`, generated `AGENTS.md` treats it as command-managed, but `.hadara/documents.json` records `management: hadara-managed`. The public site avoids the exact token, but canonical ownership should not disagree with the reviewed plan.

## Overall conclusion

The public site's high-level model and file anatomy are substantially correct, and the preset/init file list was verified against the current build. It is not yet fully faithful to fresh generated output. The routing contradictions, write-boundary metadata, compact execute recommendation, and non-resumable post-write close trap are structural P1 issues. The remaining gaps are documentation/projection fidelity improvements and should be addressed together with regenerated scaffold tests before stable promotion.
