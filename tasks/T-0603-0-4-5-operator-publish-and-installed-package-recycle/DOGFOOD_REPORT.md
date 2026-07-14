# 0.4.5 Installed Package Recycle

## Summary

| Area | Result | Notes |
|---|---|---|
| npm package install | Passed | Installed `hadara@0.4.5` from npm into `/tmp/hadara-045-installed-dogfood/prefix`. |
| Installed version | Passed | `hadara --version` returned `0.4.5`. |
| Profile init | Passed | `basic`, `standard`, and `governed` profiles initialized in fresh `/tmp` projects. |
| Generated docs doctor | Passed | All three fresh profiles passed `docs doctor --scope all --json` immediately after init. |
| Generated file shape | Passed | `tasks/.gitkeep` was not generated; profile-specific docs matched expectations. |
| Task lifecycle | Passed | Governed toy project created T-0001, recorded validation evidence, and finalized to `closed-valid`. |
| Feature smoke | Passed | Installed `hadara smoke run --profile core --json` passed in the governed toy project. |

## Commands Exercised

| Command | Project | Result | Observation |
|---|---|---|---|
| `hadara --version` | install prefix | Passed | Returned `0.4.5`. |
| `hadara doctor --json` | no project | Expected non-zero | Correctly reported missing docs/tasks/context outside a HADARA project and included installation metadata. |
| `hadara init --profile basic --json` | fresh basic | Passed | Generated compact basic scaffold. |
| `hadara init --profile standard --json` | fresh standard | Passed | Generated standard docs without governed-only handoff/security docs. |
| `hadara init --profile governed --json` | fresh governed | Passed | Generated governed docs including `AGENT_HANDOFF.md` and `SECURITY_MODEL.md`. |
| `hadara docs doctor --scope all --json` | all fresh profiles | Passed | Registry and generated docs were clean immediately after init. |
| `hadara task status --json` | fresh basic | Passed | Required reading excluded absent governed-only docs. |
| `hadara session start --json` | fresh standard | Passed | Bounded mode gave task-selection guidance without live broad discovery. |
| `hadara context pack --json` | basic/governed without task | Expected non-zero | Fail-fast task-required behavior was clear and actionable. |
| `hadara context pack --task T-0001 --json` | governed toy | Passed | Returned task-scoped read-first and slice guidance. |
| `hadara validation run --task T-0001 --check "Sum module smoke" --update-task -- node test-sum.mjs` | governed toy | Blocked | Tool host returned `spawnSync node EPERM`; HADARA reported `failureKind: permission-denied` and emitted direct-result next actions. |
| `node test-sum.mjs` | governed toy | Passed | Direct command printed `sum checks passed`. |
| `hadara validation run --direct-result passed --update-task --json` | governed toy | Passed | Resolved the blocked wrapper attempt and updated TASK.md Validation row. |
| `hadara task finalize --task T-0001 --execute --auto --json` | governed toy | Passed | Closed the toy capsule to `closed-valid`. |
| `hadara smoke run --profile core --json` | governed toy | Passed | Core feature smoke passed; command registry reported 76 CLI surfaces. |

## Findings

| ID | Severity | Finding | Disposition |
|---|---|---|---|
| F-1 | Info | `validation run` still hits `spawnSync node EPERM` in this Codex tool host, but 0.4.5 handles it correctly as `Blocked` with structured fallback commands. | No release blocker; this is the known tool-host boundary and the direct-result UX worked. |
| F-2 | Info | After closing the governed toy task, `docs doctor` reports `DOC_PROJECT_METADATA_PLACEHOLDER` because the fresh scaffold still has placeholder Product Name/Purpose. | No release blocker; expected currentness warning for an intentionally unnamed toy project. |
| F-3 | Info | Running `context pack` without `--task` exits non-zero with task-required guidance. | Expected 0.4.5 compact-default behavior. |

## Verdict

`hadara@0.4.5` installed from npm behaves correctly for fresh init, docs registry health, task selection, task-scoped context pack, validation fallback, finalize `--execute --auto`, and core feature smoke.
