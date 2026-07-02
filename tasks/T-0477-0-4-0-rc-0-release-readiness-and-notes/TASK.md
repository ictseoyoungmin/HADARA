# T-0477 0.4.0-rc.0 release readiness and notes

## Identity

| Field | Value |
|---|---|
| ID | T-0477 |
| Title | 0.4.0-rc.0 release readiness and notes |
| Status | Done |
| Created | 2026-07-02 |
| Updated | 2026-07-02 |

## Source Documents

| Path | Role | Authority | Status | Source Hash | Notes |
|---|---|---|---|---|---|
| package.json | implementation-source | approved | implemented | sha256:e86eb394deeed89840296c340b9c8be15676b969d792210787d1ee2e45d53973 | npm package version source. |
| package-lock.json | implementation-source | approved | implemented | sha256:8d2b8c3218e5e8710412f4da65d89e08e626c2021a300e3e50e2107354607523 | npm lockfile package version source. |
| README.md | reference | approved | implemented | sha256:3d96aff892e65a4128705199bc065c20083e825879394f0e1ba42a55ae7978f4 | Package-facing release status and install guidance. |
| docs/RELEASE_NOTES.md | reference | approved | implemented | sha256:6fe8c834167f9cb6817802b231466987ebb903352fbf5355f5ebe0f14e6e63c6 | Human release notes source. |
| docs/RELEASE_READINESS.md | reference | approved | implemented | sha256:372122d8e3cab221cf4c02cc3d1b3765dd584ec5d0543eadc3ec0ff91741a45c | Tracked release readiness state source. |
| docs/specs/0.4.0/productization-redesign/14_Worker_Agent_Capsule_Plan.md | reference | approved | approved | sha256:9fefb4d3c60f6047362303bb8ca891404ba0ac598f34c4a099428744c596b768 | Defines release-line deferral after T-04A24. |
| scripts/release/manual-publish-rc.sh | implementation-source | approved | implemented | sha256:b5516e34fdb0409f256430e2fbdde203477da4cb40720abc543866c8adc77934 | Approval-gated npm publish helper. |
| scripts/release/prepare-publish-env.sh | implementation-source | approved | implemented | sha256:4df7ed04df26fc8df351f536e953adc59242d6f6f827d36067bb8495117fb1f8 | Publish environment helper. |

## Goal

| Goal | Notes |
|---|---|
| Prepare the source tree for operator-controlled `hadara@0.4.0-rc.0` npm publish. | Update package metadata and package-facing docs, write concrete release notes, refresh readiness state, run release readiness validation/dry-runs without publish mutation, and leave the operator able to run `npm login` plus `scripts/release/manual-publish-rc.sh T-0477 --execute`. |

## Plan

| Step | Action | Status | Evidence |
|---|---|---|---|
| 1 | Define the release readiness contract and source documents. | Done | This `TASK.md` update. |
| 2 | Bump source/package metadata and package-facing docs to `0.4.0-rc.0`. | Done | `ev:T-0477:c1d07b3af38d42e2a95e2c98` |
| 3 | Add release notes with concrete 0.4 implementation, dogfood, agent UX, and preflight changes. | Done | `docs/RELEASE_NOTES.md`, `tasks/T-0477-0-4-0-rc-0-release-readiness-and-notes/GITHUB_RELEASE_NOTE.md` |
| 4 | Run focused/build/release validation and fix any discovered code or fixture issue. | Done | `ev:T-0477:d68e7155025d4ac4a2748c4e`, `ev:T-0477:e5c133488d56407286455af9` |
| 5 | Refresh Task Capsule docs and shared state so the operator can commit and publish. | Done | `ev:T-0477:a65852a1ad8143f4a150758d` |

## Acceptance

| ID | Criterion | Required | Status | Evidence | Disposition | Reference |
|---|---|---:|---|---|---|---|
| AC-1 | Source metadata reports `hadara@0.4.0-rc.0` from package metadata and built CLI output. | Yes | Met | `ev:T-0477:c1d07b3af38d42e2a95e2c98` | Required | package.json, package-lock.json, dist/cli/main.js |
| AC-2 | README and release readiness docs clearly describe `0.4.0-rc.0` as the current source release candidate and keep stable `0.3.3` as the current published stable line. | Yes | Met | `ev:T-0477:d68e7155025d4ac4a2748c4e` | Required | README.md, docs/RELEASE_READINESS.md |
| AC-3 | `docs/RELEASE_NOTES.md` contains a concrete `0.4.0-rc.0` entry covering productized 0.4 scaffolds, docs registry/read-map, 0.4 Task Capsule schema, close-source/evidence projection, legacy mutation boundary, dogfood, agent UX hardening, and final preflight fixes. | Yes | Met | `docs/RELEASE_NOTES.md` | Required | docs/RELEASE_NOTES.md |
| AC-4 | Release validation dry-runs pass without npm publish, GitHub Release creation, Docker/PyPI publish, installer execution, MCP release/package execution, or token loading. | Yes | Met | `ev:T-0477:d68e7155025d4ac4a2748c4e`, `ev:T-0477:e5c133488d56407286455af9` | Required | Expected publish-token blocker; no mutation. |
| AC-5 | The approval-gated publish helper path is ready for the operator to run after commit: `npm login`, then `bash scripts/release/manual-publish-rc.sh T-0477 --execute` from a clean publish environment. | Yes | Met | `ev:T-0477:94932d7e2ded42d1bc00a777` | Required | scripts/release/manual-publish-rc.sh |

## Validation

| Check | Command / Method | Required | Latest Result | Evidence |
|---|---|---:|---|---|
| Built version smoke | node dist/cli/main.js version --json | Yes | Passed | `ev:T-0477:c1d07b3af38d42e2a95e2c98` |
| Docker build / dist refresh | clean Docker copy: npm ci, npm run check, npm run build, cp dist to /workspace/dist | Yes | Passed | `ev:T-0477:d68e7155025d4ac4a2748c4e` |
| Release helper syntax | bash -n scripts/release/manual-publish-rc.sh scripts/release/prepare-publish-env.sh | Yes | Passed | `ev:T-0477:94932d7e2ded42d1bc00a777` |
| Publish dry-run | node dist/cli/main.js release publish --mode dry-run --approval-actor local-operator --approval-reason "Manual approval-gated npm publish for 0.4.0-rc.0" --confirm publish-deploy --json | Yes | Blocked | `ev:T-0477:e5c133488d56407286455af9` |
| Diff hygiene | git diff --check | Yes | Passed | `ev:T-0477:a65852a1ad8143f4a150758d` |
| Done-level harness | node dist/cli/main.js harness validate --task T-0477 --level done --json | Yes | Passed | `ev:T-0477:d8567a139d9f450797f36c11` |
| Full manual publish helper | bash scripts/release/manual-publish-rc.sh T-0477 --execute | No | Skipped | RF-1 |

## Change Summary

| Path | Area | Change | Reason | Evidence |
|---|---|---|---|---|
| package.json, package-lock.json | release metadata | Bumped version to `0.4.0-rc.0`. | Align source candidate with requested release. | `ev:T-0477:c1d07b3af38d42e2a95e2c98` |
| README.md, docs/RELEASE_READINESS.md, docs/RELEASE_NOTES.md | release docs | Updated release status, readiness state, and concrete 0.4.0-rc.0 notes. | Make npm package and operator docs match the 0.4.0-rc.0 candidate. | `ev:T-0477:d68e7155025d4ac4a2748c4e` |
| src/context/task-extractors.ts, src/handoff/handoff-stale-problems.ts, src/handoff/handoff-suggestion.ts, src/services/operations-status-service.ts | 0.4 status parsing | Added `## Identity` status-table support while retaining legacy status reads. | Fix release preflight failures caused by 0.4 Task Capsule schema drift. | `ev:T-0477:d68e7155025d4ac4a2748c4e` |
| tests/**, docs/LIFECYCLE_GUIDE.md | release preflight fixtures/docs | Aligned tests and lifecycle docs with current 0.4 capsule/docs behavior and `validation.run` primary path. | Keep full release-line validation green. | `ev:T-0477:d68e7155025d4ac4a2748c4e` |
| scripts/release/manual-publish-rc.sh, scripts/release/prepare-publish-env.sh | release helper docs | Updated examples/default comments for T-0477 and `0.4.0-rc.0`. | Make the operator publish path copy-paste ready after commit. | `ev:T-0477:94932d7e2ded42d1bc00a777` |
| tasks/T-0477-0-4-0-rc-0-release-readiness-and-notes/TASK.md, HANDOFF.md, EVIDENCE.md | task capsule | Updated capsule contract, validation, evidence, and handoff. | Keep release work evidenced under one capsule. | `ev:T-0477:a65852a1ad8143f4a150758d` |
| docs/TASK_BOARD.md, docs/PROJECT_STATE.md, docs/AGENT_HANDOFF.md, docs/DEVELOPMENT_SLICES.md | shared state | Updated final release-readiness state before close. | Keep current project state aligned before finalize. | `ev:T-0477:a65852a1ad8143f4a150758d` |

## Risks / Follow-ups

| ID | Kind | Summary | State | Reference |
|---|---|---|---|---|
| RF-1 | Follow-up | Actual npm publish remains operator-controlled and must run only after this source/readiness commit is clean and the operator has completed `npm login`. | Open | scripts/release/manual-publish-rc.sh |
| RF-2 | Follow-up | Post-publish installed-package recycle remains a separate capsule after `hadara@0.4.0-rc.0` is visible on npm. | Open | docs/RELEASE_READINESS.md |
