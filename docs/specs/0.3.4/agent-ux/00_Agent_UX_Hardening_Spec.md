# 0.3.4 Agent UX Hardening Spec

## Purpose

0.3.4 is a post-0.3.3 hardening line focused on the friction observed while using HADARA to develop HADARA itself.

0.3.3 shipped the first complete agent-facing baseline:

- context graph
- context pack
- context slice
- context cache warm/status
- session start
- task lifecycle
- task finalize
- approval-gated publish and installed-package recycle

0.3.4 should not add a new large feature family. It should make the existing surfaces easier for agents to use correctly, faster to verify, and harder to misread.

## Release Name

Working release name: **0.3.4 Agent UX Hardening**.

## Product Thesis

HADARA is strongest as an agent workbench/protocol, not as a full autonomous runtime.

The next release should optimize the ordinary loop:

1. An agent starts a session.
2. The agent selects the right next task.
3. The agent reads only the useful context.
4. The agent records evidence.
5. The agent finalizes without lifecycle confusion.
6. The next agent sees a clean handoff.

## Inputs

This line is based on friction observed during HADARA-dev work after 0.3.3:

| Input | Observed Friction |
|---|---|
| T-0406/T-0407 release closeout | Release state was spread across release readiness, release notes, project state, handoff, task board, development slices, and capsule docs. |
| Handoff known problems | Stale items can remain after resolving publish/recycle work. |
| Task finalize | The guarded close path works, but close-source edits after close can cause a subtle re-close/audit loop. |
| Evidence review | Durable v2 evidence ids are easiest to inspect through JSONL/read models, not the human `EVIDENCE.md` table. |
| Installed-package recycle | The same registry/install/disposable-project smoke is repeatedly hand-built as shell commands. |
| Session start/task next | The next action is available but not always strong enough to reduce task-selection ambiguity. |
| Context pack | Ranking and source relevance are good enough for 0.3.3, but dogfooding showed places where agent actionability matters more than graph completeness. |

## Non-Goals

0.3.4 must not include:

- full agent runtime
- scheduler or background runner
- cloud dashboard productization
- vector database or embedding layer
- default real provider execution
- broader MCP write surfaces
- release/package automation without explicit approval
- hidden cache writes from read commands

## Design Principles

| Principle | Requirement |
|---|---|
| Agent clarity beats feature count | Prefer exact next action, cause, and repair commands over new command families. |
| Read plans before writes | New write helpers must be dry-run-first or guarded by plan hash/before hash. |
| Cache is not truth | Cache diagnostics can advise, but source docs and evidence remain authoritative. |
| Package trust is part of UX | Release success is not complete until installed package paths are recycled. |
| Close proof remains strict | UX improvements can explain close-source drift, but must not weaken close/audit semantics. |
| Dogfood findings drive scope | Add only improvements observed while operating HADARA or package recycle flows. |

## Workstream A: Handoff Stale Known-Problem Detector

### Problem

`docs/AGENT_HANDOFF.md` can keep stale known problems after a later capsule resolves them. During 0.3.3 closeout, publish/recycle state had to be manually reconciled.

### Target

Add a read-only report that detects likely stale handoff known problems and suggests exact review/removal candidates.

Candidate command:

```bash
hadara handoff stale-problems --json
```

Alternative if command surface should stay smaller:

```bash
hadara handoff update --json
```

may include a read-only `staleProblemCandidates` block before execute.

### Acceptance

- Detects known-problem rows mentioning a package/version/task that later release docs or task evidence supersede.
- Does not delete rows automatically.
- Emits candidate reason, matched source, and suggested human action.
- Treats uncertainty as advisory warning, not a failure.

## Workstream B: Release Closeout Read-Only Plan

### Problem

Release closeout requires updating several documents and evidence surfaces. Agents currently infer this manually.

### Target

Add a read-only release closeout plan for a version and task.

Candidate command:

```bash
hadara release closeout --version 0.3.4 --task T-XXXX --json
```

### Acceptance

- Lists expected release-state files:
  - `docs/RELEASE_READINESS.md`
  - `docs/RELEASE_NOTES.md`
  - `docs/PROJECT_STATE.md`
  - `docs/AGENT_HANDOFF.md`
  - `docs/TASK_BOARD.md`
  - `docs/DEVELOPMENT_SLICES.md`
  - active release capsule docs
- Reports missing, stale, and current items.
- Provides suggested text fragments but does not write them in the first capsule.
- Distinguishes source readiness, publish, GitHub Release, and installed-package recycle surfaces.

## Workstream C: Evidence Compact ID UX

### Problem

Agents often need durable evidence ids after validation, but `EVIDENCE.md` keeps the human table compact and does not surface ids directly.

### Target

Improve evidence id discovery without changing evidence semantics.

Candidate command:

```bash
hadara evidence summary --task T-XXXX --json
```

or an additive mode:

```bash
hadara evidence list --task T-XXXX --compact --json
```

### Acceptance

- Shows id, time, category, outcome, summary, and tags.
- Makes latest close evidence easy to identify.
- Does not rewrite existing `EVIDENCE.md`.
- Keeps existing `evidence list` compatibility.

## Workstream D: Finalize Post-Close Drift Guidance

### Problem

`task finalize` and `task audit-close` correctly detect close-source drift, but agents need clearer guidance before they edit close-source docs after close.

### Target

Improve `task finalize --json`, `task lifecycle --json`, and close/audit diagnostics around close-source edits.

### Acceptance

- When a task is closed-valid, report whether planned edits touch close-source files.
- When close-source drift exists, show one exact command path:
  - update docs
  - rerun close execute
  - rerun audit
- Avoid suggesting redundant ready/lint checks when current validation already passes.
- Preserve strict close proof.

## Workstream E: Installed-Package Recycle Script/Report

### Problem

T-0407 recycle checks were assembled manually. This is repeatable release work and should become a standard dev-only helper.

### Target

Add a script/report for installed package recycle.

Candidate script:

```bash
node scripts/release/installed-package-recycle.mjs --version 0.3.4 --tag latest --json
```

### Acceptance

- Verifies npm version and dist-tags.
- Installs into a temporary prefix.
- Runs installed `version`, `help lifecycle`, `init`, lifecycle/finalize read model, context graph/pack/slice/cache/session-start smokes.
- Cleans up temp paths.
- Emits a compact JSON/Markdown summary suitable for Task Capsule artifacts.
- Performs no publish mutation.

## Workstream F: Session Start Primary-Action Hardening

### Problem

`session start` is fast and bounded, but agents still sometimes need to infer the one best next action from broader guidance.

### Target

Strengthen session-start guidance.

### Acceptance

`hadara session start --json` should include:

- `guidance.primaryAction`
- `guidance.whyThisNow`
- `guidance.avoidForNow`
- `guidance.nextCommandArgs`
- a clear reason when no active task exists
- a clear reason when a recommended task is only a backlog candidate

## Workstream G: Context Pack Agent Actionability

### Problem

Context pack can be graph-relevant but not always agent-actionable.

### Target

Improve ranking/reporting toward useful agent reads.

### Acceptance

- Rank task-local files and exact source docs above broad historical context when task evidence points there.
- Make `readFirst` reasons more concrete.
- Preserve raw slice boundary metadata.
- Keep cache/read commands non-mutating.

## Workstream H: Init and Generated Docs Agent Guidance Cleanup

### Problem

0.3.3 generated docs mostly explain the finalize-first lifecycle, but consumer projects can still receive broad protocol text before they have useful task history.

### Target

Tune generated docs for new projects.

### Acceptance

- Generated `AGENTS.md` and `docs/TASK_WORKFLOW_COMMANDS.md` prioritize:
  - `task next`
  - `session start`
  - `task lifecycle`
  - reviewed `task finalize`
- Avoid stale low-level lifecycle-first wording.
- Keep low-level proof-boundary commands documented for debugging/recovery.

## Workstream I: 0.3.4 Release Readiness, Publish, and Recycle

### Target

Preserve 0.3.3 release discipline.

Required sequence:

1. Source/readiness capsule.
2. Approval-gated npm publish capsule.
3. Installed-package recycle capsule.

GitHub Release draft remains optional and explicit.

## Capsule Budget

| Order | Capsule | Type | Goal |
|---|---|---|---|
| 1 | T-0408 0.3.4 Agent UX Hardening Spec and Capsule Budget | docs/spec | Define this line, register docs, and lock scope boundaries. |
| 2 | T-0409 Handoff Stale Known-Problem Detector | implementation | Add read-only stale known-problem candidates. |
| 3 | T-0410 Release Closeout Read-Only Plan | implementation | Add release closeout planning report. |
| 4 | T-0411 Evidence Compact ID UX | implementation | Improve task evidence id discovery/reporting. |
| 5 | T-0412 Finalize Post-Close Drift Guidance | implementation | Make close-source drift and reclose guidance clearer. |
| 6 | T-0413 Installed-Package Recycle Script | implementation | Standardize T-0407-style consumer package recycle checks. |
| 7 | T-0414 Session Start Primary-Action Hardening | implementation | Strengthen session-start next-action guidance. |
| 8 | T-0415 Context Pack Agent Actionability | implementation | Improve context pack ranking/reasons for agent work. |
| 9 | T-0416 Init Generated Docs Agent Guidance Cleanup | implementation | Improve generated docs for new projects. |
| 10 | T-0417 0.3.4 RC Readiness Preparation | release | Prepare `0.3.4-rc.0` source/readiness without publish mutation. |
| 11 | T-0418 0.3.4 RC Approval-Gated Publish | release | Publish RC to npm `next` if readiness passes. |
| 12 | T-0419 0.3.4 RC Installed-Package Recycle | release | Verify RC from installed consumer paths. |
| 13 | T-0420 Stable 0.3.4 Decision | decision | Decide stable publish, rc1, or deferral from recycle findings. |
| 14 | T-0421 Stable 0.3.4 Readiness/Publish/Recycling | release | Split into separate capsules if the decision chooses stable publish. |

## Done Criteria for 0.3.4

0.3.4 is ready to promote only when:

- installed package recycle is scripted or otherwise standardized;
- session start has stronger primary-action guidance;
- handoff stale problem detection exists or is explicitly deferred with evidence;
- release closeout state can be planned from one read-only report or equivalent artifact;
- evidence id discovery is easier than manually reading JSONL;
- finalize drift guidance is clearer without weakening close proof;
- generated init docs match the 0.3.3+ lifecycle;
- package publish and recycle repeat the T-0406/T-0407 discipline.

## Explicit Deferrals

| Deferred Item | Reason |
|---|---|
| Workbench/dashboard productization | Too much UI/product scope for a UX-hardening patch release. |
| Full multi-agent runtime | Requires stronger run-state and write-boundary design. |
| MCP write expansion | Would broaden safety surface before agent UX is stable. |
| Vector retrieval | Not needed for the observed 0.3.3 friction. |
| Default provider execution | Outside HADARA workbench/protocol core. |
| Release target config stabilization | Still valid future work, but not core to this UX line unless release closeout planning requires a small read-only adapter. |
