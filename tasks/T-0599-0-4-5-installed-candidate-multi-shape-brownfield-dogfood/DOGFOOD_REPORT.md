# T-0599 Installed-Candidate Brownfield Dogfood Report

## Setup

| Field | Value |
|---|---|
| Candidate | `/tmp/hadara-t0599-pack-V3sSFY/hadara-0.4.5.tgz` |
| Install Prefix | `/tmp/hadara-t0599-prefix-Lij2lv` |
| HADARA Version | `0.4.5` |
| Fixture Root | `/tmp/hadara-t0599-dogfood-3x6hGP` |

## Fixtures

| Fixture | Shape | Init Result | Lifecycle Result | Findings |
|---|---|---|---|---|
| `typescript-service` | Existing `package.json`, `src/`, README, `.gitignore` | Passed: dry-run detected `brownfield`; execute required reviewed plan hash and explicit `--adopt`; `docs doctor --scope all` passed. | Passed: baseline `T-0001` validation evidence recorded and `task finalize --execute --auto` returned `closed-valid`. | Existing `.gitignore`, README, package, and source were preserved; `tasks/.gitkeep` was not created. |
| `python-data` | Existing `pyproject.toml`, notebook/data folders, README | Passed: dry-run detected `brownfield`; execute required reviewed plan hash and explicit `--adopt`; `docs doctor --scope all` passed. | Passed: baseline `T-0001` validation evidence recorded and `task finalize --execute --auto` returned `closed-valid`. | Existing Python/data files were preserved; `tasks/.gitkeep` was not created. |
| `web-monorepo` | Existing root package, app/package workspace, docs | Passed: dry-run detected `brownfield`; execute required reviewed plan hash and explicit `--adopt`; `docs doctor --scope all` passed. | Passed: baseline `T-0001` validation evidence recorded and `task finalize --execute --auto` returned `closed-valid`. | Existing monorepo files and project `docs/ARCHITECTURE.md` were preserved; `tasks/.gitkeep` was not created. |

## Observations

| ID | Severity | Area | Observation | Disposition |
|---|---|---|---|---|
| O-1 | Info | Adoption safety | Writing dry-run output files such as `init.json` into the project root between dry-run and execute changes the root-entry signal set and correctly causes plan-hash mismatch. | Keep dogfood/release harness logs outside the adopted project root. |
| O-2 | Info | Task authoring | Fresh task capsules intentionally require replacing `HANDOFF.md` placeholder rows before finalize. This is not a release blocker, but it is a manual authoring step agents must remember. | Generated authoring guidance already reports `HARNESS_HANDOFF_PLACEHOLDER`; no code change required for 0.4.5. |
| O-3 | Info | Child process harness | Node `child_process.spawnSync` wrappers returned empty stdout/stderr for installed `hadara` in this environment, while direct shell invocation produced JSON. | Recorded local feedback in `.hadara/local/feedback/T-0598-child-process-dist-init-empty-output.md`; use direct shell invocation for installed-package dogfood. |

## Summary

The 0.4.5 installed candidate passed multi-shape brownfield adoption and baseline lifecycle dogfood. No release-blocking product defect was found. Release readiness still needs to be recycled because T-0598 changed runtime code after T-0597.
