# Three-profile Autonomous Codex Dogfood Report

## Summary

The current `0.5.0-rc.1` workspace build was exercised in three fresh `/tmp`
projects using the `basic`, `standard`, and `governed` init profiles. Each
project received a moderately difficult project brief and was implemented by
Codex CLI across three separate Task Capsules.

The coordinator initialized the projects, authored and registered the briefs,
started each Codex CLI session, and reviewed the outputs. The coordinator did
not implement or repair dogfood project code. Agents were not given a HADARA
explanation; they relied on generated `AGENTS.md`, registered Markdown, Task
Capsules, and CLI guidance.

All nine capsules reached `Done` with close proof. The six continuation sessions
were started in fresh Codex CLI processes with only:

```text
AGENTS.md를 읽고 다음 작업 진행.
```

All six independently recovered the intended next slice and closed it. This
supports the Markdown-first continuity design and the consolidation of project
selection and selected-capsule guidance under `hadara task status`.

## Protocol

| Dimension | Value |
|---|---|
| HADARA build | Workspace `dist/cli/main.js`, package version `0.5.0-rc.1` |
| Agent | OpenAI Codex CLI `0.145.0`, `gpt-5.4`, medium reasoning |
| Project roots | `/tmp/hadara-dogfood-0682-{basic,standard,governed}` |
| Sessions | Three separate Codex CLI sessions per project |
| Coordinator boundary | Init, brief/spec decisions, command orchestration, observation, and review only |
| Agent briefing | Generated project material only; no explanation of HADARA |
| Exclusion | Dashboard implementation and Dashboard tests |

The built CLI was exposed to agents through
`/tmp/hadara-dogfood-bin/hadara`. Each project was initialized once and given a
local Git repository so agents could inspect changes. Project briefs were
registered as active, approved specs before the first agent session.

## Scaffold Review

All profiles passed `hadara init doctor --json` with `ok: true` and no issues.

| Profile | Fresh generated project surface | Assessment |
|---|---|---|
| Basic | `AGENTS.md`, compact workflow, Task Board, registries/scaffold metadata, compatibility `current.json` | Correct minimal generated surface. The agent later invented `PROJECT_STATE.md`, revealing that the profile boundary needs stronger prose. |
| Standard | Basic plus `HADARA_CONTEXT.md` and `PROJECT_STATE.md` | Correct middle surface; sufficient read routing without global handoff. |
| Governed | Standard plus `AGENT_HANDOFF.md` | Correct cumulative surface; strongest continuity and close guidance. |

Evidence: `ev:T-0682:8fb54acee7674ce18a2dd039`.

## Project Matrix

### Basic — ForgePlan

ForgePlan is a deterministic dependency-aware batch planning CLI.

| Capsule | Capability | Result |
|---|---|---|
| T-0001 | Graph parsing, topological ordering, and invalid-graph diagnostics | Closed valid |
| T-0002 | Capacity-aware schedule simulation | Closed valid |
| T-0003 | Critical path/slack explainability and malformed-input hardening | Closed valid |

The first agent incorrectly treated the Dashboard exclusion as an exclusion of
all automated tests. The second session recovered the intended validation
standard and added unit coverage. The final project suite passed. Basic also
showed the strongest tendency to add governance ceremony that its generated
profile intentionally omitted.

### Standard — EpochFlags

EpochFlags is a deterministic feature-policy evaluator with temporal and rollout
semantics.

| Capsule | Capability | Result |
|---|---|---|
| T-0001 | Policy evaluator and JSON CLI | Closed valid |
| T-0002 | Time windows, deterministic rollout, and precedence | Closed valid |
| T-0003 | Decision traces, linting, batch evaluation, and operator guide | Closed valid |

The fresh sessions recovered the intended next work from Project State, Task
Board, and capsule handoff. The agent occasionally guessed irrelevant ecosystem
files such as `package.json` in a Python project. A malformed HANDOFF Markdown
table survived close, showing that close validates semantic fields more strongly
than table structure.

### Governed — QuorumLedger

QuorumLedger is a canonical append-only approval ledger with integrity and
governance controls.

| Capsule | Capability | Result |
|---|---|---|
| T-0001 | Canonical JSONL encoding and hash-chain verification | Closed valid |
| T-0002 | Quorum approval/rejection policy and terminal-state rules | Closed valid |
| T-0003 | Redacted audit, deterministic export, and corrupt-ledger recovery inspection | Closed valid |

The governed agents followed the richest read graph effectively and produced
the strongest evidence trail. They nevertheless attempted concurrent
same-capsule evidence writers despite prose requiring serialization; HADARA's
append lock prevented corruption. Unknown help families also printed an error
while returning exit code 0.

## Continuity Results

| Project | Session 2 | Session 3 | Outcome |
|---|---|---|---|
| ForgePlan | Recovered schedule simulation | Recovered explainability/hardening | Passed |
| EpochFlags | Recovered temporal rollout | Recovered traces/lint/batch/docs | Passed |
| QuorumLedger | Recovered approval policy | Recovered audit/governance/recovery | Passed |

The six logs each contain an independent `thread.started` event and agent work
that culminated in a close report. The first validation attempt incorrectly
required every first agent message to repeat the literal string `AGENTS.md`;
two agents followed the injected instructions without repeating the filename.
The corrected validation checks the real contract—fresh process plus completed
continuation—and resolves the failed attempt honestly.

Evidence: `ev:T-0682:73af078f28aa4c9c8baf89dc`, resolving
`ev:T-0682:49a3b11729384692b934d8d2`.

## Lifecycle Findings

### Validated design choices

1. One adaptive `task status` surface is enough. Agents used it successfully
   both without an active capsule and with an explicit/selected capsule.
2. Raw `.hadara/state/current.json` was not needed as ordinary agent reading.
   Task Board, project-authored Markdown, and Task Capsule handoff carried the
   meaningful continuity.
3. Markdown graph-style routing is practical. Standard and governed agents
   followed generated paths and recovered work across clean sessions.
4. Capsule size was appropriate. Each capsule delivered a coherent capability,
   tests, documentation, evidence, and close proof instead of wrapping trivial
   edits in disproportionate ceremony.
5. Guarded close and append-only evidence worked across nine independent
   lifecycle executions.

### Required before stable

| Priority | Finding | Observed effect |
|---|---|---|
| P0 | Continuation step prose becomes the next task title. | Sessions two and three created sentence-length titles and truncated directory slugs. |
| P0 | `docs register` execute commands lose reviewed metadata flags. | Registered documents fell back to `unknown`/`reference` metadata. |
| P0 | Successful close does not stop agents strongly enough. | Several agents ran `task status` after close to reconfirm state. |
| P1 | Full task status mixes operator blockers with close-owned mutations. | Draft identity/board state appeared circularly blocking immediately before close. |
| P1 | Basic profile boundaries are implicit. | An agent added Standard-style project state and Required Reading without a project need. |
| P1 | Required Markdown table shape is under-validated. | A malformed HANDOFF table passed close. |
| P1 | Unknown help family exits successfully. | Automation cannot distinguish the usage error by exit code. |
| P2 | Evidence serialization depends on prose compliance. | An agent launched independent evidence writers concurrently; the append lock was the real protection. |

The accepted specification records the required remediation direction in
`docs/specs/0.5/PRE_STABLE_LIFECYCLE_SIMPLIFICATION.md`.

## Host Safety Observation

A direct Codex command containing `rm -f` was rejected by the host sandbox, but
an equivalent temporary cleanup nested inside a `hadara validation run` shell
wrapper executed in an earlier session. No project or repository data was at
risk—the target was a fixed `/tmp` smoke file—but wrapper nesting can obscure a
host's command-policy inspection. This is primarily a Codex/tool-host concern,
not a HADARA lifecycle defect. HADARA examples should use unique `mktemp`
directories and avoid cleanup-dependent smoke commands.

## Validation and Evidence

| Check | Result | Evidence |
|---|---|---|
| Three profile doctors | Passed | `ev:T-0682:8fb54acee7674ce18a2dd039` |
| Three boards × three Done rows, each with close proof | Passed | `ev:T-0682:af37a47a87064ae5a6379911` |
| Six independent continuation sessions | Passed after corrected assertion | `ev:T-0682:73af078f28aa4c9c8baf89dc` |
| Core unit suites for ForgePlan, EpochFlags, and QuorumLedger | Passed | `ev:T-0682:29f1311c06d1466b88135054` |
| Report/spec/capsule Markdown diff check | Passed | `ev:T-0682:35003dae36ea4a638691b1d7` |

Dashboard checks were not run. This report makes no claim about Dashboard
correctness or stability.

## Conclusion

The dogfood supports the proposed stable architecture: `task status` should own
selection and selected-task state, `current.json` should remain a hidden
compatibility checkpoint/cache rather than normal authority, and explicit
Markdown read routing is sufficient. The remaining work is bounded UX and
contract hardening, not restoration of a separate project-status lifecycle or
introduction of a general graph runtime.
