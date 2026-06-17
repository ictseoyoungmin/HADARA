# FINDINGS

## Dogfood Project

| Field | Value |
|---|---|
| Temporary project | `/tmp/hadara-dogfood-asteroid-ops` |
| Subject | Asteroid Ops Drill: simulated planetary-defense operations console |
| Shape | Docker Compose backend/frontend project |
| HADARA runtime | Local built CLI `packageVersion:"0.3.2-rc.0"`, `distLooksStale:false` |
| HADARA profile | `governed` |

The temporary app is intentionally surprising but non-operational: it presents simulated near-miss asteroid telemetry for civic alert rehearsal. It does not use real astronomical alert data.

## Project Implemented

| Area | What Was Built | Validation |
|---|---|---|
| Backend | Dependency-free Node HTTP API with `/api/health` and `/api/threats`. | `node --check backend/server.js`; local runtime smoke returned 3 threats. |
| Frontend | Static operations console that fetches and renders the threat simulation. | `node --check frontend/app.js`. |
| Compose | `backend` and `frontend` services with backend health dependency. | `docker compose -f /tmp/hadara-dogfood-asteroid-ops/docker-compose.yml config`. |
| HADARA project | Governed scaffold, task capsule, evidence, finish, ready, close, audit. | T-0001 reached `closed-valid`. |

## HADARA Flow Exercised

| Step | Result | Notes |
|---|---|---|
| `init --profile governed` | Passed | Created context, docs registry, core docs, governed docs, and root `AGENTS.md`. |
| `init doctor --json` | Passed | Reported scaffold matches current expectations. |
| `task create` | Passed | Created T-0001 capsule and Task Board row. |
| `evidence add-command` | Passed | Wrote v2 evidence with durable id `ev:T-0001:bf0cbeafd58e47ed9a53ee23`. |
| `evidence list --json` | Passed | Exposed durable id, category, outcome, id source, and stability. |
| `task finish --json` | Passed | Dry-run showed bounded writes and shared-doc advisories. |
| `task finish --execute --json` | Passed | Updated only `TASK.md` status and Task Board row. |
| First `task ready --level done --json` | Failed usefully | Blocked unchanged scaffold docs and pending acceptance. Diagnostics included path, heading, fix hint, example, and remediation hint. |
| Second `task ready --level done --json` | Passed | Done validation, evidence lint, and protocol doctor passed after capsule docs were completed. |
| `task close --json` | Passed | Produced close evidence plan with no blockers. |
| `task close --execute --json` | Passed | Appended close evidence through canonical evidence writer. |
| `task audit-close --json` | Passed | Returned `closed-valid`, source hash match, report hash match, and no blockers. |
| `task status --json` after close | Passed with warnings | Correctly reported `closed-valid`; docs-scope warnings remained for generated handoff/test-strategy baseline drift. |

## Stability Assessment

| Finding | Severity | Evidence | Interpretation |
|---|---|---|---|
| Core task lifecycle completed end-to-end in a fresh governed project. | Positive | T-0001 reached `closed-valid`. | No stability blocker found in init/task/evidence/finish/ready/close/audit for this dogfood path. |
| Evidence v2 operator flow was clear and machine-readable. | Positive | `evidence add-command` created durable `ev:` id; `evidence list --json` exposed `idStability:"durable"`. | Supports stable 0.3.2 decision from the evidence-id UX perspective. |
| Done-level validation caught incomplete capsule docs before close. | Positive | First ready run blocked unchanged `CONTEXT.md`, `FILES.md`, `RISKS.md`, `DECISIONS.md`, and pending acceptance. | Guardrails prevented a superficial Done state from closing. |
| Finish write boundary behaved as advertised. | Positive | Finish execute changed bounded task status and Task Board row; shared docs remained advisory. | Safe for worker/coordinator split. |
| Local server runtime smoke needed sandbox escalation. | Environment | Sandboxed Node listen failed with `EPERM`; approved local-only rerun passed. | Not a HADARA product blocker, but dogfood runtime checks should distinguish sandbox limits from app failures. |

## UX Findings

| Finding | Impact | Suggested Follow-up |
|---|---|---|
| Fresh governed projects require several shared-doc updates before ready/close feels natural. | Medium for first-time users; good for rigor but high ceremony for small first tasks. | Consider a guided "first task state-doc checklist" or generated examples that mention T-0001 after task creation. |
| Ready blockers were strong and actionable. | Positive; blockers were easy to fix without reading source code. | Keep the path/heading/fixHint/example/remediationHint style. |
| `task close --json` dry-run listed `append-close-evidence`, but `primaryNextAction` still pointed at done validation. | Low; report was still correct, but the primary action was less direct after validation already passed. | Consider prioritizing `append-close-evidence` as primary when close dry-run has no blockers. |
| `task status --json` after valid close still surfaced generated project docs warnings. | Low/Medium; not blocking, but can distract during a successful first dogfood. | Consider clearer grouping for "non-blocking generated scaffold cleanup" versus task readiness/close proof. |
| Dependency-free app worked well for restricted environments. | Positive; dogfood avoided npm install/network ambiguity. | Keep recommending dependency-light fixtures for release-line dogfooding when network is not the subject under test. |

## Release Decision Signal

| Question | Answer |
|---|---|
| Did dogfooding find a release-blocking bug in `0.3.2-rc.0`? | No. |
| Did dogfooding support the T-0338 package recycle result? | Yes, for local built CLI lifecycle behavior and Evidence v2 ergonomics. |
| Does dogfooding replace npm installed-package recycle? | No. It is an additional operator workflow signal. |
| Stable decision impact | Supports stable `0.3.2` consideration, with non-blocking UX follow-ups around first-task guidance, close primary next action, and warning grouping. |

## Commands And Evidence

| Check | Result |
|---|---|
| `node /mnt/f/NowWorking/HADARA-dev/dist/cli/main.js init --profile governed --project /tmp/hadara-dogfood-asteroid-ops --json` | Passed |
| `node /mnt/f/NowWorking/HADARA-dev/dist/cli/main.js init doctor --project /tmp/hadara-dogfood-asteroid-ops --json` | Passed |
| `docker compose -f /tmp/hadara-dogfood-asteroid-ops/docker-compose.yml config` | Passed |
| `node --check /tmp/hadara-dogfood-asteroid-ops/backend/server.js` | Passed |
| `node --check /tmp/hadara-dogfood-asteroid-ops/frontend/app.js` | Passed |
| Local backend runtime smoke | Passed after sandbox escalation; returned `{"ok":true,"count":3,"top":"Apophis Echo","level":"critical","attempts":1}` |
| T-0001 evidence | `ev:T-0001:bf0cbeafd58e47ed9a53ee23` |
| T-0001 close audit | `closed-valid`; close evidence `ev:T-0001:ff653fa5f1f34f218b0cc5c6` |
