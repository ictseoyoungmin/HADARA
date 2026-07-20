# T-0663 Dogfood Report

## Summary

Verdict: the 0.5.0-rc.0 candidate (T-0658 through T-0662) passed a two-session, three-capsule
delegated workflow in a fresh external project, and a cold-started second session — given nothing
but a short "read AGENTS.md and proceed" prompt and no shared context with the first session —
correctly identified and completed the right next work despite an unrelated environment defect
that had partially corrupted persisted state. The continuation model (T-0661) itself worked
correctly once the correct binary was in play. Three real product findings surfaced, one of them a
gap in the continuation-precedence work from T-0661 itself.

## Setup

| Item | Value |
|---|---|
| External project | `/mnt/f/NowWorking/dev/driftlog` |
| Package source | `/tmp/hadara-0.5.0-rc.0.tgz`, packed from current source after `npm run build` (includes T-0658-T-0662) |
| Installed entrypoint | `.hadara-install/node_modules/hadara/dist/cli/main.js`, wrapped by `.hadara-install/bin/hadara` |
| Init profile | governed (adopted, brownfield path) |
| Delegated agent | Claude (subagent_type `claude`), two independently-started sessions with no shared context |
| Project concept | `driftlog` — a small stdlib-only Python CLI habit/streak tracker, scoped by a `SPEC.md` written before delegation |

## Session 1 (delegated, cold start)

Prompt: working directory + "AGENTS.md를 읽고 다음 작업을 진행해줘" + permission to work autonomously.
No entrypoint/PATH guidance was given.

| Task | Outcome | Evidence |
|---|---|---|
| T-0001 `Establish HADARA adoption baseline` | Done / closed-valid | `ev:T-0001:c82aff27f0234cd68d4fd7de` |
| T-0002 `Implement driftlog MVP: add, log, list commands` | Done / closed-valid | `ev:T-0002:31b4167d421b439084a9214a` |

Both capsules closed cleanly via `hadara task finalize --execute --auto`; `driftlog.py` (add/log/list,
JSON store, argparse) and 13 passing tests were implemented per `SPEC.md`.

**Post-session investigation found session 1 had silently used the wrong `hadara` binary.** A
pre-existing global install (`hadara@0.4.5`, from unrelated prior work on this machine) was already
resolvable on PATH, and the delegated prompt gave no instruction to prefer the project-local
0.5.0-rc.0 candidate. `hadara@0.4.5` predates the continuation model entirely (`grep` for
`continuationFromTaskHandoffStep` in its `dist/task/task-finish.js` returns zero matches), which is
why `continuation` stayed `null` after both closes despite both tasks' `HANDOFF.md` having real,
well-formed "Next Recommended Step" content — see F-1.

## Session 2 (delegated, cold start, corrected binary)

A second, independently-started Claude subagent with no memory of session 1 was given the same
short prompt, this time with one added line telling it to prepend the project-local install to
PATH before running `hadara` commands (necessary because `--no-bin-links` was required on this
Windows-mounted filesystem, so no `hadara` bin symlink exists to be discovered implicitly).

| Task | Outcome | Evidence |
|---|---|---|
| T-0003 `Implement driftlog streak and report commands` | Done / closed-valid | `ev:T-0003:` (see task capsule) |

What the session actually did, independently verified afterward (re-ran the full test suite and
CLI commands myself rather than trusting the subagent's report):

- Ran `hadara status`/`task status`, saw the stale `nextWork` entry ("Establish HADARA adoption
  baseline") — which the tool itself flagged as needing operator review rather than blindly
  recommending it be redone (existing `adoptionBaselineReviewOnly` guard in
  `src/task/task-selection.ts` worked as intended).
- Cross-checked `tasks/T-0002-.../HANDOFF.md` directly to find the real next step (SPEC.md's second
  milestone), since `continuation` was still `null` at that point (a downstream effect of F-1, not
  a new bug — T-0002 closed under the stale 0.4.5 binary).
- Implemented `compute_streaks()`, `streak`, and `report` in `driftlog.py`, added 8 new tests (21/21
  passing, independently re-run), closed T-0003 with `hadara task close --task T-0003 --json`, and
  committed.
- This time, `continuation` was correctly promoted from T-0003's own `HANDOFF.md` next step
  ("SPEC.md's two defined milestones are now both complete...") — confirming the continuation
  model works correctly once the intended binary is actually used.

## Findings

| ID | Severity | Finding | Recommendation |
|---|---|---|---|
| F-1 | High | A pre-existing, differently-versioned global `hadara` (0.4.5) silently shadowed the intended project-local 0.5.0-rc.0 candidate for an entire delegated session; neither the CLI nor generated docs warned that the resolved binary differed from the project-local install, and a large slice of real behavior (the entire continuation model) was silently absent as a result. | `hadara init`/`status`/`version` could detect a project-local `.hadara-install`-shaped candidate near cwd that differs from the resolved binary's version and warn. At minimum, `docs/HADARA_WORKFLOW.md`'s "Installed Package Fallback" section should say explicitly that a same-named `hadara` earlier on PATH takes precedence and to verify with `hadara version --json` before delegating work. |
| F-2 | High | `hasBootstrapNextWork()` (`src/services/project-current-state.ts`) only recognizes the literal phrase `"create first task capsule"`. The brownfield/governed adoption flow (`src/init/adoption.ts`) seeds a *different* bootstrap phrase, `"Establish HADARA adoption baseline"`, which this function does not recognize. Retirement then depends entirely on `nextWorkMatchesTask()` succeeding when the *specific* task titled exactly that phrase closes; if that single opportunity is missed for any reason (here: F-1's stale binary), `nextWork` is stuck pointing at completed bootstrap guidance permanently — no later task's completion can ever retire it, since no future task will share that exact title. Reproduced independently in an isolated fixture outside `driftlog`, confirming it is not specific to the stale-binary incident: once missed, it cannot self-heal even with the correct binary. | Recognize `"establish hadara adoption baseline"` alongside `"create first task capsule"` in `isBootstrapFirstTaskNextWork`, or generalize `hasBootstrapNextWork` to retire *any* bootstrap-flavored `nextWork` once *any* task closes successfully, not only the one matching its exact title. |
| F-3 | Medium | `task-selection-status-v2.ts`'s continuation fallback (T-0661) only activates when the existing precedence chain finds *no* recommendation at all. When a stale, review-only `nextWork` recommendation exists (F-2's stuck state) alongside a fresh, accurate `continuation`, the stale recommendation still wins outright and fully shadows the continuation — the exact class of problem T-0661 was built to fix resurfaces one level up the precedence chain. Confirmed live in `driftlog`: `task status --json` reported `phase: "review-next-work"` pointing at the stale adoption-baseline text even after `continuation` was correctly populated with the real next step. | Either fix F-2 (removing the stale recommendation entirely resolves this instance), or have `continuation` be considered whenever the active recommendation is itself a low-confidence review-only fallback, not only when there is no recommendation at all. |
| F-4 | Low | HANDOFF.md scaffold structure differs between 0.4.5 (no `## Identity` section) and 0.5.0-rc.0 (has one) — confirmed by comparing T-0002's (0.4.5-produced) and T-0003's (0.5.0-rc.0-produced) `HANDOFF.md` in the same project. Not a bug in current code, but a reminder that mixed-version project histories are a real scenario worth testing deliberately, not just as an accident like this one. | No action needed now; note for future cross-version dogfood scope. |

## Stable Readiness

| Gate | Result |
|---|---|
| Latest built dist package install | Passed |
| Fresh governed init/adoption | Passed |
| Delegated agent completes capsules across two independently-started sessions | Passed |
| Cold-started second session resumes correctly using only persisted state + a short prompt | Passed (agent recovered manually via HANDOFF.md cross-reference; the continuation *field* itself was not yet populated at that point due to F-1) |
| Continuation model (T-0661) functions correctly under the intended binary | Passed |
| Stable promotion confidence | Caution: F-2/F-3 mean a real, non-hypothetical scenario (brownfield adoption immediately followed by any feature close) leaves the project permanently in `review-next-work` limbo instead of ever reaching `idle` or `continuation-ready` cleanly, unless an operator manually clears `nextWork`. Recommend fixing F-2 before treating the continuation/precedence chain as stable-ready. |

The core finding is encouraging: even in a partially-corrupted state (this repo's own accidental
methodology failure, not a HADARA defect by itself), a cold-started agent given nothing but a short
prompt still did the right thing, because HADARA's existing safeguards (adoption-baseline
review-only downgrade) prevented it from being actively misled, and the agent's own judgment closed
the gap. The continuation model change this dogfood was built to exercise works as designed once
the correct binary is used — but F-2/F-3 show its precedence relative to legacy `nextWork` still
has a real, reproducible gap worth closing before 0.5.0 stable.
