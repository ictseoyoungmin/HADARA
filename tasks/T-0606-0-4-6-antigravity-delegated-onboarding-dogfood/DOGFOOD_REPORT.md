# T-0606 Antigravity Delegated Onboarding Dogfood

## Setup

Goal: evaluate whether an external agent can use HADARA like an ordinary user, without receiving HADARA internals from the HADARA developer.

Projects:

| Path | Purpose | Outcome |
|---|---|---|
| `/tmp/hadara-agy-onboarding` | First toy Node CLI project. | Antigravity initialized HADARA and partially edited the project, but drifted outside the intended project boundary and did not complete the lifecycle. |
| `/tmp/hadara-agy-onboarding-v2` | Clean retry after installing public `hadara@0.4.5`. | Retry was blocked by Antigravity quota before meaningful work. |

## Findings

| ID | Severity | Finding | Evidence / Detail |
|---|---|---|---|
| F-1 | High | Antigravity did not reliably honor shell cwd as the project boundary. | Even when launched from `/tmp/hadara-agy-onboarding` and later told to work only there, it inspected Antigravity scratch/worktree paths and another repository. |
| F-2 | High | Stale global HADARA install materially changed onboarding output. | Initial global `hadara` was `0.4.3`; the generated scaffold reported `createdWith: hadara@0.4.0`, registry v2, `hadara-dev` profile tokens, and `tasks/.gitkeep`. |
| F-3 | Medium | `doctor` and `init doctor` did not flag the stale scaffold version/registry shape when checked by the latest workspace CLI. | Latest CLI reported init doctor ok for the old scaffold. This weakens recovery when an agent uses an old global binary. |
| F-4 | Medium | External agent filled `TASK.md` with an invalid Inputs / Constraints Role token. | `source-document` was written; latest `task status --detail full` correctly flagged allowed values, but the generated docs did not prevent the error early. |
| F-5 | Medium | The delegated agent implemented code/tests but did not record validation evidence or close the capsule. | The project changed `index.js` and `test.js`; `npm test` then failed, and T-0001 remained Draft with no evidence. |
| F-6 | Low | `agy` quota prevented the clean retry after installing public `hadara@0.4.5`. | Fresh absolute-path prompt could not run: `Individual quota reached`. |

## Good Signals

| Signal | Detail |
|---|---|
| HADARA task status diagnostics were useful after the delegated agent stalled. | `task status --detail full` clearly identified missing evidence, invalid role token, pending plan/acceptance rows, handoff placeholders, and Task Board status. |
| Global install metadata is visible in `hadara doctor --json`. | `doctor` showed executable path, package root, packageVersion, and install command, which made the stale-install diagnosis straightforward. |
| Antigravity could create a plausible first task. | It created T-0001 and scoped a sensible help-option feature before drifting. |

## Follow-Up Recommendations

| Priority | Recommendation |
|---|---|
| P0 | Add a scaffold-version/registry-version currentness diagnostic: latest `doctor` or `init doctor` should warn when `.hadara/scaffold.json createdWith` and docs registry schema are older than the installed CLI expects. |
| P0 | Add a first-user delegated prompt recipe to docs: absolute project path, install/version check, `pwd` confirmation, and "do not inspect parent/home" boundary. |
| P1 | Consider making `hadara init` or `task create` seed a short "common controlled tokens" hint near `Inputs / Constraints` so external agents avoid `source-document`. |
| P1 | Add a `hadara doctor --expect-version current` or similar check if the public package and scaffold protocol drift. |

## Current Status

This capsule did not prove Antigravity can complete the HADARA lifecycle. It proved the opposite for the current environment: Antigravity delegated onboarding needs a stricter project-boundary recipe and reliable installed HADARA version before it can be trusted as an external-agent dogfood harness.
