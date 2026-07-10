# R1 Delegated Dogfood Report

## Run

| Field | Value |
|---|---|
| Delegated agent | Claude CLI, `sonnet`, non-interactive `-p` |
| Reviewer/coordinator | Current Codex session |
| Target path | `/mnt/f/NowWorking/dev/hadara-r1-basic-dogfood` |
| Project shape | Disposable Node CLI/library, tiny `slugify` tool |
| Profile | `basic` |
| HADARA package | `hadara@latest`, reported as `0.4.3` |
| Result | 5 attempted, 5 closed-valid |

## Capsule Summary

| Capsule | Work | Result |
|---|---|---|
| T-0001 | Wire `package.json` bin and test script | closed-valid |
| T-0002 | Add README usage docs | closed-valid |
| T-0003 | Add `--separator` flag to slugify | closed-valid |
| T-0004 | Add `maxLength` truncation option | closed-valid |
| T-0005 | Add diacritics stripping via `String.prototype.normalize` | closed-valid |

## Timing / Command Shape

| Metric | Observation |
|---|---|
| HADARA invocations | About 20 |
| `task status` / `task create` | About 0.3-0.7s each |
| `validation run` | About 0.5-0.8s each |
| `task finalize --execute --auto` | About 4-5s each |
| Total wall time | About 5-6 minutes including doc authoring |

## Good UX

- `hadara init --profile basic --json` scaffolded a usable workflow.
- Generated `docs/HADARA_WORKFLOW.md` matched the ordinary path closely enough for an independent agent to complete the loop.
- `validation run --update-task` was the strongest workflow feature because it removed manual validation-row bookkeeping.
- `task finalize --execute --auto` produced actionable blockers with concrete file/section hints and allowed straightforward recovery.

## Friction / Bugs

| Severity | Finding | Impact | Suggested Follow-up |
|---|---|---|---|
| High | `hadara --version` and `hadara -v` print full help and exit 1; `hadara version` is the actual command. | External users will try the conventional version flags first. | Add `--version` / `-v` aliases or document the intentional absence clearly. |
| Medium | Post-close `task finalize --execute --auto` response still included `authoringGuidance` with `plan` shown as pending on a `closed-valid` task. | Looks like an unresolved blocker after successful close. | Suppress stale authoring guidance for closed-valid output or mark it informational. |
| Medium | `HARNESS_TASK_SCAFFOLD_PLACEHOLDER` reported a remaining `TBD` but not the exact line/cell. | Agent had to grep manually. | Include section/row/cell or a short location hint in the blocker. |
| Medium | `evidence add-command` has no `--update-task` equivalent. | Manual TASK.md evidence-cell edit was needed for command evidence. | Consider `evidence add-command --update-task` or document asymmetry. |
| Medium | `hadara version --json` in the external toy project emitted `DIST_LOOKS_STALE` because project source files were newer than the installed CLI entry. | Looks like a HADARA-dev build-staleness diagnostic leaking into ordinary installed-package use. | Scope stale-dist diagnostics to HADARA-dev/source checkouts or rename the warning so it is not interpreted as package staleness. |
| Environment | Local `npm install hadara@latest` under `/mnt/f` failed on npm bin symlink with `EPERM`; global install worked. | WSL-on-Windows mounted drive friction. | Treat as environment note, not HADARA defect. |

## Docs vs Behavior

Generated docs matched actual behavior well. The important deviations were:

- version flag behavior (`--version` / `-v` vs `version`);
- installed-package `version --json` stale-dist warning in a normal project;
- stale-looking post-close authoring guidance;
- placeholder blocker location precision;
- evidence command/task-row update asymmetry.

## Reviewer Notes

This validates the T-0572 R1 premise: an independent agent with no HADARA-dev source paths completed a basic-profile project using only the public installed package and normal lifecycle commands.

The strongest release-blocking candidate is the version flag mismatch because it is a first-contact CLI convention. The other findings are UX polish but did not block completion.

Reviewer verification:

- `hadara version --json` reported package version `0.4.3`.
- `hadara task status --task T-0005 --json` reported `closed-valid`.
- `hadara docs doctor --json` reported `healthy` and `clean`.
