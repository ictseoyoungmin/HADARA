# HADARA r3 Dogfood Report — Governed Profile (Claude, external agent)

**Date:** 2026-07-12
**Project:** `/tmp/hadara-r3-claude-governed-dogfood` (disposable, git-tracked)
**Install path:** `npm install --save-dev hadara@latest` → `./node_modules/.bin/hadara`

## Install result

| Field | Value |
|---|---|
| npm `latest` dist-tag | `0.4.3` |
| npm `next` dist-tag | `0.4.2-rc.0` |
| Installed version | `0.4.3` |
| `hadara version --json` | reports `packageVersion: 0.4.3`, `build.distLooksStale: false`, `issues: []` |

**v0.4.4 is not published to npm.** The `latest` dist-tag resolves to `0.4.3`, and `0.4.4` does not appear anywhere in `npm view hadara versions`. Everything below was validated against **0.4.3**, the actual currently-shipping version — not 0.4.4. If 0.4.4 is meant to be the release under evaluation, it has not reached npm yet and this run cannot speak to any diff between the two.

## Project shape

Small Node/ESM checkout-pricing library (`src/pricing.js`, `node --test` in `test/`), with `PLANNING.md`, `SECURITY.md`, and `RELEASE.md` written and git-committed **before** `hadara init`, specifically to give the governed profile real project history to reason about.

## Capsule table

All 8 capsules reached `closed-valid` via `task finalize --execute --auto`.

| Task | Title | Final State | Evidence ID(s) |
|---|---|---|---|
| T-0001 | Add bulk-quantity discount support | Done / closed-valid | `ev:T-0001:2fd0af2dc5714318bcb63e58` |
| T-0002 | Add coupon code validation | Done / closed-valid | `ev:T-0002:c4d2345ba7ea4f1db854b162` |
| T-0003 | Add order total composition (subtotal+discounts+tax+shipping) | Done / closed-valid | `ev:T-0003:dccaa43f403d4237bbdb66cc` |
| T-0004 | Add tiered shipping cost calculation | Done / closed-valid | `ev:T-0004:fe8c861a7db643d4af6519e0` |
| T-0005 | Validate item inputs at the pricing trust boundary | Done / closed-valid | `ev:T-0005:bbb66153f9ea406f99e353e1` |
| T-0006 | Fix round2 floating-point boundary rounding bug | Done / closed-valid | `ev:T-0006:18b1080a62bb4e6cb36423fa` |
| T-0007 | Add currency-aware rounding for non-decimal currencies | Done / closed-valid | `ev:T-0007:213ee0a8db4d40719c8a447b` |
| T-0008 | Document the pricing module public API | Done / closed-valid | `ev:T-0008:3a37268d8c9949dc8ba2e960` |

`npm test` grew from 3 → 14 passing tests across the run; every capsule's validation ran real `npm test`, not a fabricated result. No `--direct-result` fallback was needed — the `validation run` wrapper launched `npm test` successfully every time.

## Bugs / confusing output

1. **Stale "Next Work" recommendation after real work exists (biggest finding).** After all 8 capsules closed, `docs/PROJECT_STATE.md`, `docs/AGENT_HANDOFF.md`, and `hadara task status --json`'s `.hadara/state/current.json`-derived fields still read:
   - `Next Work: Create first Task Capsule`
   - `Operator Guidance: Create or select the first bounded Task Capsule.`
   - `hadara task status --json` returns `mode: "select-work"`, `recommendations: []`, and issues with `TASK_SELECTION_NO_RECOMMENDATION`.

   Meanwhile `Latest Completed Task` correctly shows `T-0008 ...`. So the CLI knows the last task closed, but never refreshes (or clears) the bootstrap-era "create your first capsule" recommendation, and doesn't fall back to "recommend the next TASK_BOARD row" or anything project-aware. A fresh agent picking up this project cold, reading only `docs/PROJECT_STATE.md` per the workflow's own Quickstart, would be told to create a *first* capsule on a project that already has 8 done ones. This is exactly the "wrong next-work recommendation" failure mode the workflow doc explicitly warns agents to avoid causing.

2. **`AGENT_HANDOFF.md`'s "Last 3 Completed Tasks" table and "Historical Index" never populate.** After 8 finalized capsules, the table is still empty (header only) and `Historical Index → Completed tasks → TBD`. This is the doc a resuming agent is told to read for compact continuation state, and it has no record that anything happened.

3. **Global docs keep TBD placeholders despite real, registered project docs.** `docs/PROJECT_STATE.md`'s `Product` table still shows `Name: TBD` and `Purpose: Describe the project in one or two sentences.` at the end of the run, even though `PLANNING.md` (with a real name/goal/milestones) existed before `init` and was registered via `hadara docs register`. Nothing in the workflow (`init`, `docs register`, or `task finalize`) ever offers to populate these from existing project docs or asks the operator to fill them in — they're silently skipped forever unless a human manually edits the managed block through the "init-upgrade projection path" the doc points to but never surfaces as an action.

4. **`hadara version --json` (and `version --json` generally) exits with status 1 despite `ok: true` and `issues: []`.** For scripting/CI use, a non-machine-readable exit code on an unambiguously successful, issue-free command is a footgun — anything doing `hadara version --json && ...` will treat a healthy install as a failure.

5. **`hadara -v` silently falls through to the generic help screen** instead of erroring or printing a version. Minor, but surprising for a flag that's a near-universal CLI convention.

6. **Confusing dual-signal readiness/authoring output.** `hadara task status --task <id> --json` uses `"closeState": "closed-valid"` at the top level but a nested `readiness.status` string like `"closed-valid-current-blocked"` on the plain (non-detail) status call, with `currentReady: false`. The summary text clarifies it ("fast task status skipped current done-level readiness checks; existing close proof is valid"), but the label alone reads as an active blocker on an already-closed, valid task. Separately, on a closed T-0001, `authoringGuidance.items[Acceptance].status = "current"` while the independent `authoringSuggestions.acceptance.status = "placeholder"` for the same section — two advisory layers disagreeing about the same TASK.md section on a task that already finalized cleanly. Neither blocked anything, but both cost a few minutes of "is this actually a problem?" investigation.

## Good UX

- **Finalize gating is real and useful, not ceremony for its own sake.** The first `task finalize --task T-0001 --json` dry-run correctly blocked on a placeholder `HANDOFF.md` and a not-yet-Done `TASK_BOARD.md` row, with an exact fix hint and example row for each. Filling in `HANDOFF.md` and re-running `--execute --auto` closed cleanly every time, 8/8, with zero flakiness or unexpected blockers once the docs were real.
- **`validation run` + `--update-task` is a genuinely good ergonomic loop**: one command ran the real `npm test`, recorded a durable evidence id, and auto-patched the TASK.md Validation row — no hand-editing of evidence data at any point.
- **`docs register` is clean and additive** — registering `PLANNING.md`, `SECURITY.md`, `RELEASE.md`, and `README.md` never touched `AGENTS.md`/workflow prose, matching the doc's stated boundary.
- **`hadara docs doctor --json` gave an honest, specific, and correct "healthy/clean" verdict** with zero registry drift across 15 registered documents at the end of the run.
- **Command/friction load per capsule was reasonable, not excessive**: create → write TASK.md → write HANDOFF.md → `validation run` → `finalize --execute --auto` is 5 steps and matches the documented Minimal Loop almost exactly; no redundant commands were required beyond that once the pattern was learned from the T-0001 dry-run block.

## Release decision

**Ship, with one strong follow-up recommendation, not a hard blocker.**

Nothing in this run corrupted evidence, produced a false "passed" validation, or let a capsule close without real gating — the core evidence/finalize contract that governed mode exists to guarantee held up across all 8 capsules with zero exceptions. The exit-code and CLI-cosmetic issues (#4, #5, #6) are minor.

The one issue worth treating as near-blocker-severity for a *governed* profile specifically is #1/#2/#3: the profile's entire pitch is "a fresh agent/session can resume without reconstructing history from scratch" (the workflow doc's own words), and the two documents built for exactly that purpose (`PROJECT_STATE.md`, `AGENT_HANDOFF.md`) both give actively stale or empty guidance after a full, successful 8-capsule run. That's the scenario governed mode is supposed to be best at, and it's the one where continuation state visibly rotted. I'd patch that before calling governed-profile continuation state "done," but it does not need to block a 0.4.4 release if the fix is already planned for a point release — nothing here is a correctness or data-integrity defect.

Confirmed **not** a 0.4.4-specific finding either way: this run only exercised the published 0.4.3.
