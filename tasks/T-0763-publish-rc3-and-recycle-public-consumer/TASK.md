# T-0763 Publish RC3 and Recycle Public Consumer

## Identity

| Field | Value |
|---|---|
| ID | T-0763 |
| Title | Publish RC3 and Recycle Public Consumer |
| Status | Draft |
| Created | 2026-08-09T22:41 |
| Updated | 2026-08-09T22:41 |

Schema hint: use `hadara schema --json` or `hadara schema --domain <domain-id> --json` for controlled values before replacing scaffold tokens.

Lifecycle note: do not hand-edit Identity `Status` or `docs/TASK_BOARD.md` Status to close work. Keep the task prose current, then run `hadara task close --task T-0763 --json`.

## Goal

| Goal | Notes |
|---|---|
| Prepare the final RC3 artifact and all pre-publish proofs so the operator can publish one exact tarball to npm `next`, attach the same files to the GitHub prerelease, verify public metadata, and recycle a fresh public consumer through a closed-valid lifecycle. | npm publication and installed-package dogfooding are complete; GitHub prerelease/artifact verification remains open. See DOGFOOD_REPORT.md. |

## Release Identity

| Field | Value |
|---|---|
| Package | `hadara` |
| Version | `0.5.0-rc.3` |
| npm tag | `next` |

## Scope

| Boundary | Items |
|---|---|
| In | Current committed RC3 source artifact, checksum/manifest, exact tarball package smoke, clean-checkout smoke, strict gate, release/publish dry-runs, operator publish/release/recycle command sequence, installed-package dogfooding report, and post-publish evidence slots. |
| Out | Source/runtime changes, artifact regeneration, and public consumer lifecycle execution beyond the operator publication already recorded here. |

## Plan

| Step | Action | Status |
|---|---|---|
| 1 | Define the single-artifact and operator-boundary contract for RC3 publication/recycle. | Done |
| 2 | Generate and validate the final pre-publish artifact and exact package/readiness evidence. | Done |
| 3 | Record operator publication, repair/verify the GitHub prerelease artifact set, and complete public consumer recycle evidence. | In Progress |

## Acceptance

| ID | Criterion | State | Evidence | Reference |
|---|---|---|---|---|
| AC-1 | Final RC3 artifact, checksum, and manifest are generated from the current committed RC3 source and the exact tarball is retained for operator use. | Met | ev:T-0763:84c5bf346e9748e4a61286d0; git commit `ef687fa8b376fe4fe64c888591dc0f3d0d6a0f8b`; tarball SHA-256 `843f582d000d69f2088ef4debd9b969150de3154935ea783961f58d06882eb53`; disposable preflight artifact set retained outside the repository | `docs/RELEASE_READINESS.md`; `docs/specs/0.5.0-rc3/02_RC3_Release_Readiness.md` |
| AC-2 | Exact tarball package smoke passes with matching artifact/package SHA-256 provenance. | Met | ev:T-0763:f6c9879e8ad7453dbc88ace5; matching SHA-256 `843f582d000d69f2088ef4debd9b969150de3154935ea783961f58d06882eb53` | `docs/specs/0.5.0-rc3/02_RC3_Release_Readiness.md` |
| AC-3 | Clean-checkout smoke, full check, strict gate, release dry-run, and publish dry-run pass before external mutation. | Met | ev:T-0763:e65676daf07649f69624dfd4; ev:T-0763:43796b9113ff4961a6ee82bc; ev:T-0763:0bd3e18ee8494dde83167b71; ev:T-0763:146d2746d9804bccbf0fac09; ev:T-0763:58578ea3cb38403283b90c64; ev:T-0763:4e57d6cc591649488d6053a1 | `docs/RELEASE_READINESS.md` |
| AC-4 | Operator handoff specifies one `.tgz` plus its `.sha256` and manifest for npm/GitHub, followed by prerelease/public `hadara@next` verification and public consumer recycle. | Met | `HANDOFF.md`; `GITHUB_RELEASE_NOTE.md`; ev:T-0763:84c5bf346e9748e4a61286d0 | `scripts/release/prepare-publish-env.sh`; `scripts/release/manual-publish-rc.sh` |
| AC-5 | Public consumer lifecycle evidence reaches `closed-valid`, same-close retry is idempotent, fresh task status has no stale continuation, and all external mutations are recorded by the operator. | Met | ev:T-0763:04c70bb575b640cdb621f7c7 | DOGFOOD_REPORT.md |
| AC-6 | GitHub RC3 prerelease metadata is marked prerelease and carries the exact tarball, checksum, and manifest. | Pending | ev:T-0763:a3ca34fc604a4b0f8aa52e0c | Operator GitHub repair |

## Validation

| Check | Gate | Result | Evidence |
|---|---|---|---|
| Current committed RC3 release artifact | Yes | Passed | Commit `ef687fa8b376fe4fe64c888591dc0f3d0d6a0f8b`; tarball SHA-256 `843f582d000d69f2088ef4debd9b969150de3154935ea783961f58d06882eb53`. ev:T-0763:84c5bf346e9748e4a61286d0 |
| Exact tarball package smoke | Yes | Passed | Exact tarball source and matching SHA-256 provenance. ev:T-0763:f6c9879e8ad7453dbc88ace5 |
| Clean-checkout smoke | Yes | Passed | Clean committed source clone install/build/check/doctor/task status passed. ev:T-0763:e65676daf07649f69624dfd4 |
| Full repository validation | Yes | Passed | ev:T-0763:43796b9113ff4961a6ee82bc |
| Strict release gate | Yes | Passed | ev:T-0763:0bd3e18ee8494dde83167b71 |
| Release and publish dry-run | Yes | Passed | ev:T-0763:146d2746d9804bccbf0fac09; ev:T-0763:58578ea3cb38403283b90c64 |
| Release dry-run | Yes | Passed | ev:T-0763:146d2746d9804bccbf0fac09 |
| Publish dry-run | Yes | Passed | ev:T-0763:58578ea3cb38403283b90c64 |
| Exact tarball npm publish dry-run | Yes | Passed | ev:T-0763:4e57d6cc591649488d6053a1 |
| Public npm `next` metadata | Yes | Passed | `npm view hadara@next version --registry=https://registry.npmjs.org` returned `0.5.0-rc.3`. ev:T-0763:9d34929d0f82454aaf4d553b |
| GitHub RC3 prerelease and artifact attachments | Yes | Failed | `v0.5.0-rc.3` is non-draft but `isPrerelease=false` and `assets=[]`. ev:T-0763:a3ca34fc604a4b0f8aa52e0c |
| Public consumer package recycle | Yes | Passed | Registry install, installed CLI surface, init, task/status, close dry-run, and context slice passed. ev:T-0763:14975c72acda4514a8497233 |
| Public consumer long-term dogfood lifecycle | Yes | Passed | Fresh consumer task reached `closed-valid`; same-close retry wrote zero files; fresh task status returned terminal idle. ev:T-0763:04c70bb575b640cdb621f7c7 |
| Installed RC3 dogfooding report | Yes | Passed | ev:T-0763:210c16f6b2da4ee5a46bdef9 |

## Inputs / Constraints

| Source | Role | State | Notes |
|---|---|---|---|
| `docs/RELEASE_READINESS.md` | constraint | active | Canonical artifact, evidence-root, clean-checkout, gate, publish, and recycle order. |
| `docs/specs/0.5.0-rc3/02_RC3_Release_Readiness.md` | constraint | active | RC3 exact-artifact and no-mutation contract. |
| `scripts/release/prepare-publish-env.sh` | implementation-source | active | Operator preparation boundary; not run in this session. |
| `scripts/release/manual-publish-rc.sh` | implementation-source | active | Operator single-artifact publish/GitHub boundary; npm publish was executed, while the GitHub asset/prerelease contract still needs repair. |
| T-0762 committed RC3 source | reference | active | Current release input commit before T-0763 capsule-local evidence. |

## Changes

| Area | Summary |
|---|---|
| Release preparation | Done: generated one preflight artifact set and attached reduced pre-publish evidence. |
| npm publication | Done: operator reported publish completion and public `next` metadata reads `0.5.0-rc.3`. |
| GitHub release | Follow-up required: `v0.5.0-rc.3` is published as a normal release with no assets; it must be converted to a prerelease and receive the exact `.tgz`, `.sha256`, and manifest. |
| Installed-package dogfooding | Done: isolated `hadara@next` consumer completed init, validation/evidence, close, idempotent retry, and fresh status checks; report added in `DOGFOOD_REPORT.md`. |
| Operator handoff | In Progress: exact publish/GitHub/public consumer sequence and post-publish evidence slots recorded; GitHub metadata/assets repair remains open. |

## Risks / Follow-ups

| ID | Type | Summary | State | Link |
|---|---|---|---|---|
| RF-1 | Follow-up | External operator boundary | Open | User-run publish/recycle continuation |
| RF-2 | Risk | GitHub `v0.5.0-rc.3` is not marked prerelease and has no attached artifact files. | Open | ev:T-0763:a3ca34fc604a4b0f8aa52e0c |
| RF-3 | Follow-up | Fresh standard init reports scaffold workflow-section and required-reading profile warnings. | Open | DOGFOOD_REPORT.md |

## History

| Date | State | Note |
|---|---|---|
| 2026-08-09 | Draft | Initial task scaffold. |
| 2026-08-09 | In Progress | Defined single-artifact RC3 publish/recycle preparation and stopped-before-mutation operator boundary. |
| 2026-08-09 | In Progress | Preflight artifact, exact package smoke, clean-checkout, full check, strict/dry-run gates, and exact-tarball npm dry-run passed; awaiting operator publication and public consumer recycle. |
| 2026-08-09 | In Progress | Operator reported npm publication; public `hadara@next` resolves to `0.5.0-rc.3`. GitHub release exists but is not a prerelease and has no assets; public consumer recycle remains pending. |
| 2026-08-11 | In Progress | Installed `hadara@next` and completed public consumer recycle plus deep task lifecycle dogfooding; GitHub prerelease/assets repair remains open. |
