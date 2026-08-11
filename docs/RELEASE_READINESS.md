# RELEASE_READINESS

This document is the dedicated tracked source for release, install, installer, package-smoke, package metadata, install-matrix, release-artifact, and publish/deploy readiness details.

`node --import tsx tools/dev-surfaces.ts release gate --mode strict --json` may read this document and other tracked evidence, but it must remain read-only. It must not run installer scripts, package smoke, `npm pack`, install packages, publish packages, create GitHub releases, build Docker images, mutate PATH, write shell profiles, call GitHub, execute remote CI, or perform registry mutation.

## Release Readiness Recycle Runbook

Use this canonical recycle order for release-candidate or stable publish preparation. The objective is to keep build source, evidence writes, and installed-package dogfood separated so validation does not dirty the source it is validating.

Root roles:

| Role | Purpose | Default Location |
|---|---|---|
| `sourceRoot` | Clean committed source used for build, artifact, package, gate, dry-run, and publish checks. | Container-native ext4 clone, for example `/root/hadara-release-src`. |
| `evidenceRoot` | Workspace where Task Capsule evidence is appended. | Mounted workspace, for example `/workspace`, or the reviewed release capsule root. |
| `smokeProjectRoot` | Disposable consumer project used by installed-package smoke/recycle. | Temporary ext4 directory, for example `/tmp/hadara-package-smoke-project`. |

Deterministic recycle sequence:

1. Start from a fresh Docker toolchain. If the existing image/container is suspect, pull `node:22-bookworm`, recreate `hadara-dev`, and mount the repository at `/workspace`; do not reuse stale global `hadara` binaries.
2. Commit the intended release-readiness source state before cloning. A clean clone only contains committed files.
3. Inside the container, clone `/workspace` to a container-native ext4 `sourceRoot`; use `/workspace` only as `evidenceRoot` and human review surface.
4. Build and validate the development CLI from `sourceRoot`, then confirm `package.json` version equals `node dist/cli/main.js version`.
5. Generate the release artifact from `sourceRoot` to an output directory and write a journal JSON outside the source tree. The artifact command rebuilds source and verifies the built CLI version before staging `dist`; do not attach evidence during this artifact build.
6. Attach the release artifact journal from `evidenceRoot` with `node --import tsx tools/dev-surfaces.ts release artifact --from-journal <journal.json> --evidence-root <evidenceRoot> --attach-evidence --task <task> --json`.
7. Run package smoke and clean-checkout smoke with explicit root roles: `--source-root <sourceRoot> --evidence-root <evidenceRoot>` and, for installed-package paths, a disposable `--smoke-project-root <tmp-ext4-dir>`.
8. Run `node --import tsx tools/dev-surfaces.ts release gate --mode strict --json`, `node --import tsx tools/dev-surfaces.ts release dry-run --json`, and `node --import tsx tools/dev-surfaces.ts release publish --mode dry-run ... --json` from `sourceRoot`; these checks remain read-only and must observe the evidence attached to `evidenceRoot`.
9. Only after the gates pass, run the operator-controlled npm publish helper. For release candidates use npm dist-tag `next`; for stable use `latest`.
10. In the same publish capsule, prepare the public GitHub Release note or draft before handoff. After npm/GitHub publication, run post-publish installed-package recycle from the published package in a dedicated capsule, using `node --import tsx tools/dev-surfaces.ts package recycle --execute --package hadara@next|latest --expected-version <version> --source-root <sourceRoot> --evidence-root <evidenceRoot> --smoke-project-root <tmp-ext4-dir> --attach-evidence --task <task> --json`.

Forbidden ordering:

- Do not run clean release artifact generation with `sourceRoot == evidenceRoot` and `--attach-evidence`; this self-invalidates the clean-tree preflight and now fail-closes unless explicitly overridden after review.
- Do not use the mounted `/workspace` as the heavy build/package-smoke source when Docker ext4 is available; mounted WSL/DrvFs state can be slow and can expose local-only files.
- Do not reuse the HADARA-dev repository itself as an installed-package `smokeProjectRoot`; installed smoke must use a disposable consumer project.
- Do not treat npm publish as complete release handling when a GitHub Release note or draft is still missing from the capsule.

Fresh Docker recovery example:

```bash
docker pull node:22-bookworm
docker rm -f hadara-dev
docker run -dit --name hadara-dev -v "$PWD":/workspace -w /workspace node:22-bookworm bash
docker exec -it hadara-dev bash
```

`scripts/release/prepare-publish-env.sh <TASK_ID>` is the preferred helper for preparing the ext4 clone and printing the final operator commands. It must keep the GitHub Release note path visible so an npm publish capsule can immediately proceed to a reviewed GitHub Release draft.

## Clean Checkout Package Smoke Plan

The clean-checkout consumer smoke runs from a disposable source copy and keeps consumer validation separate from the source workspace.

- `node --import tsx tools/dev-surfaces.ts smoke clean-checkout --execute --json` is the supported repo-local smoke command.
- The sequence is `npm ci`, `npm run build`, `npm run check`, `node dist/cli/main.js doctor --json`, and `node dist/cli/main.js task status --json`. Run the strict release gate after clean-checkout evidence is attached from the evidence root; keeping it outside the disposable checkout avoids a self-referential clean-evidence gate.
- The smoke must not package, publish, mutate release state, install globally, or perform any other packaging or release execution.
- Boundary: no packaging or release execution occurs in this smoke.
- `node dist/cli/main.js release gate --mode strict --json` remains a supported built-CLI compatibility form for the strict read-only gate.

## Executable Package Smoke Artifact Boundary

- Allowed workspace: `/tmp/hadara-package-smoke/<run-id>` or another explicitly selected disposable workspace outside the source checkout.
- Package artifact paths: `tasks/<task-id>/artifacts/package-smoke/`.
- Redaction and audit handling: public summaries omit raw package contents, raw npm logs, secrets, private paths, and private store paths.
- Evidence/report shape: reduced public reports use `hadara.packageSmoke.v1` and record execution, cleanup, and failure boundaries.
- The release gate performs no package-smoke execution.

## Package Smoke Command Surface

- Dry run: `node --import tsx tools/dev-surfaces.ts smoke package --dry-run --json`.
- Task evidence: `node --import tsx tools/dev-surfaces.ts smoke package --task <task-id> --json`.
- Explicit workspace: `node --import tsx tools/dev-surfaces.ts smoke package --workspace /tmp/hadara-package-smoke/<run-id> --json`.
- Retain temporary output only with `node --import tsx tools/dev-surfaces.ts smoke package --keep-temp --json`.
- Supported controls include `--timeout <seconds>`, `--attach-evidence`, and `--private-logs`; Package smoke must not be callable from MCP by default.
- Do not use `release smoke` as the primary command surface.
- The release gate must not call `node --import tsx tools/dev-surfaces.ts smoke package`.
- A versioned package input may be checked with `node --import tsx tools/dev-surfaces.ts smoke package --from ./dist-release/hadara-<version>.tgz --json`.

## External CI Observation Boundary

- Remote CI observations are task evidence, not durable release contract state.
- The local source/build/check and installed consumer smokes remain the reproducible RC2 gates; local Docker validation remains the primary reproducible check.
- Do not add run numbers, artifact URLs, or remote log paths to `DEVELOPMENT_SLICES.md` or this active contract section.
- Historical remote CI provenance is kept in `docs/VALIDATION_HISTORY.md` for the strict gate's
  compatibility check; it is not evidence that the current RC2 source was accepted by remote CI.

## Package Metadata Release Readiness

Current package metadata preparation mode:

- Package name decision: `hadara`.
- Published 0.5.0-rc.2 artifact status: T-0749 current-head release artifact, checksum/manifest, package/consumer smoke, clean-checkout smoke, strict release gate, release dry-run, publish dry-run, installed lifecycle acceptance, and closed-valid proof passed before publication. npm `0.5.0-rc.2` is published on `next`; GitHub Release `v0.5.0-rc.2` is public prerelease. Post-publication fixes are outside that immutable RC2 artifact and require a new RC release-input refresh.
- RC2 post-publication recycle status: T-0754 verified public `hadara@next` resolves to `0.5.0-rc.2`, installs in an isolated consumer, applies the reviewed JSON init plan, and passes task/status, close dry-run report, and context-slice checks. The GitHub Release currently has zero assets, and the exact original RC2 tarball is not retained in the repository; this is historical debt and must not be “fixed” by uploading a regenerated artifact under the RC2 identity.
- Current post-RC2 source status: T-0751 corrected the post-publish helper dispatch; T-0753 corrected RC prerelease metadata/body truth and added tarball provenance enforcement. These changes intentionally invalidate T-0749's current-head evidence for the checkout. The next RC must regenerate artifact, package smoke, clean-checkout smoke, strict gate, release dry-run, and installed lifecycle evidence from the new release input.
- Release artifact retention: the capsule retains the reduced public release-artifact report plus checksum and manifest metadata; the binary tarball remains disposable or external to avoid one committed `.tgz` per release capsule. T-0763 records a corrective failure because the exact RC3 tarball was not retained through the secondary-upload decision point; future release capsules must retain the exact package-smoke bytes in the operator release workspace until all selected secondary uploads complete.
- Operator artifact locator: every retained release capsule must record the exact reviewed filenames under the stable logical root `$HADARA_RELEASE_WORKSPACE/<release>/` and keep the actual host path in ignored `.hadara/local/release-workspace.json`. Public evidence may include the logical locator and byte hashes, but must not include a host-private absolute path. Package smoke and any selected secondary upload must consume those same bytes.
- RC3 artifact-retention corrective record: T-0763's expected tarball/checksum/manifest hashes remain evidence of the intended release input, not proof that the files are currently recoverable. A registry tarball may be accepted as exact only after byte/hash comparison; a regenerated checksum or manifest must not be labeled as the original.
- The published `0.5.0-rc.1` and its package/GitHub/install observations remain historical release context in `docs/RELEASE_NOTES.md` and completed task evidence; they are not the active RC2 gate.
- Current 0.4.6 stable source/preparation status: T-0604 closed residual brownfield trust gaps; T-0605 improved evidence category UX and manifest inference polish; T-0606/T-0607 recorded delegated onboarding dogfood; T-0608 fixed delegated onboarding UX findings; T-0609 hardened validation execution capture; T-0610 retired stale bootstrap next-work after first close; T-0611 through T-0613 clarified current-state latest-task and trusted validation-baseline contracts; T-0614 prepared and the operator published `0.4.6-rc.0`; T-0615 dogfooded the installed rc.0 package; T-0616 through T-0619 fixed concurrent task creation, first-user docs workflow, and HADARA-dev Docker sync-build friction; T-0620 prepared and the operator published `0.4.6-rc.1`; T-0621 through T-0624 cleaned up rc.1 release/dogfood findings; T-0625 reproduced a delegated first-capsule close blocker; T-0626 and T-0627 fixed the finalize close-boundary and validation placeholder semantics; T-0628 reran delegated Codex dogfood and closed both the adoption baseline and a Quant Battle Arena MVP feature capsule without manual lifecycle-owned status edits.
- Current 0.4.6 stable readiness: package metadata, release notes, readiness docs, README release status, helper examples, and GitHub stable release note artifact targeted `hadara@0.4.6`; current-package delegated dogfood after the finalize fixes passed; source validation and release package smoke were refreshed in T-0629; T-0631 records completed operator npm/GitHub publication and installed-package recycle from public `hadara@latest` expected `0.4.6`.
- Current 0.4.5 stable source/preparation status: T-0585 defined docs-registry v3 and init cleanup; T-0586 through T-0592 implemented registry v3, mutation paths, project-authored defaults, migration cleanup, mutation hardening, and the brownfield adoption contract; T-0593 through T-0595 implemented brownfield detection, guarded adoption execute, and origin-aware doctor/idempotency cleanup; T-0596 dogfooded fresh profiles, governed lifecycle, brownfield execute, and fail-closed safety paths; T-0597 retargeted initial source metadata and release docs; T-0598 closed reviewer brownfield adoption safety blockers; T-0599 passed installed-candidate multi-shape brownfield dogfood; T-0600 recycled current-source release readiness and refreshed the GitHub stable release note artifact; T-0601 fixed clean-clone test regressions found before publish; T-0602 fixed package-smoke generated-init workspace isolation and refreshed package-smoke evidence; T-0603 records completed operator npm/GitHub publication plus installed-package recycle.
- Current 0.4.5 stable readiness: fresh `basic`, `standard`, and `governed` init all passed `init doctor`, `docs doctor --scope all`, and task status; a governed toy task closed with `task finalize --execute --auto`; brownfield adoption remained zero-write by default and wrote only after explicit `--adopt --execute --plan-hash`; missing hash, mismatched hash, partial `.hadara`, unsafe symlink, malformed marker, path type mismatch, and task-id collision cases failed closed; installed-candidate TypeScript service, Python/data, and governed web/monorepo fixtures adopted and closed baseline capsules successfully; T-0600 build, Docker build, docs/init doctor, package smoke, and strict release gate passed; T-0601 Docker build and full test suite passed with 153 files and 1096 tests; T-0602 package smoke passed with generated-init docs isolated from packaging artifacts and strict release gate recognized latest T-0602 package-smoke evidence; T-0603 verified the public `hadara@0.4.5` npm package installs, reports version `0.4.5`, initializes all profiles cleanly, closes a governed toy lifecycle, and passes installed core feature smoke.
- Current stable 0.4.4 source/readiness baseline: T-0572 defined the external-repository validation plan; T-0573 through T-0577 ran delegated/external dogfood across basic, standard, and governed profiles; T-0575 and T-0578 fixed the release-candidate UX issues found by those runs; T-0579 prepared `0.4.4-rc.0`; T-0580 published and recycled the RC; T-0581 selected stable promotion; T-0582 ran final major CLI dogfood and fixed the only blocker found; T-0583 retargeted source metadata, README release status, release notes, readiness docs, helper examples, and the GitHub stable release note artifact to `0.4.4`.
- Current 0.4.4 stable readiness: R1 basic-profile delegated dogfood closed 5 capsules with installed `hadara@0.4.3`; R2 standard-profile external validation completed ordinary lifecycle checks and documented host spawn fallback as non-blocking; R3 Claude Code independently completed 8 governed-profile capsules and the reviewer separated 0.4.3-only findings from current candidate behavior. T-0578 fixed the remaining pre-release UX issues; T-0580/T-0581 verified the published RC and consumer recycle; T-0582 exercised repo read models, fresh basic/standard/governed init, governed toy lifecycle, and fixed Development Slices currentness false-positive noise.
- Current stable 0.4.3 source/readiness baseline: T-0561 through T-0569 established structured current-state, currentness diagnostics, measurement, positioning, release smokes, fresh-init dogfood, and post-dogfood cleanup; T-0570 prepared stable release notes/readiness/helper examples; the operator published npm and GitHub Release `v0.4.3`; T-0571 verified `hadara@latest` resolves to `0.4.3` and installed-package recycle passes.
- Historical npm registry observation: `hadara@0.1.0-rc.0` was the first published HADARA release candidate.
- Published release: `0.5.0-rc.3` is public on npm `next`; stable `latest=0.4.6` remains unchanged.
- Current source version: `0.5.0-rc.4`.
- Current version is `0.5.0-rc.4` for the active RC4 source candidate; T-0766 reconciled fresh Init v1 scaffolds and protocol doctor now reports zero warnings across all three presets.
- Current release target: RC4 pre-operator artifact regeneration and publish preparation; npm `next` remains the published RC3 line until an operator publishes RC4.
- Current prerelease npm status: published `next=0.5.0-rc.3`; target `next=0.5.0-rc.4` after operator publication; stable `latest=0.4.6` remains unchanged.
- Current prerelease GitHub status: `v0.5.0-rc.3` is public with `isPrerelease=true`, `isDraft=false`, and no custom assets currently attached; RC4 GitHub publication is pending operator action.
- RC3 public consumer status: T-0763 verified registry metadata, installed version, command surface, init, task create/status, validation/evidence, close, same-close zero-write retry, fresh status idle, and no recommendation from the published `hadara@next` package.
- RC3 artifact status: the exact original `.tgz`, `.sha256`, and manifest were not retained in the capsule; T-0765 attempts read-only registry recovery and keeps each file's provenance separate.
- Previous prerelease: `hadara@0.5.0-rc.1` and `v0.5.0-rc.1` remain historical context.
- Current stable npm publish target is `0.4.6` on dist-tag `latest`.
- Current published stable npm release target is `0.4.6`.
- Current stable 0.4.6 publish status: T-0631 records completed external publication and consumer recycle. npm registry verification returned `version=0.4.6`, dist-tags `latest=0.4.6` and `next=0.4.6-rc.1`; GitHub Release `v0.4.6` was published publicly by the operator; installed-package recycle verified public `hadara@latest` installs as `0.4.6`, exposes installed command surface, initializes a disposable project, and passes task status/session/finalize/context pack/context slice smokes.
- Current stable 0.4.5 publish status: T-0603 records completed external publication and consumer recycle. npm registry installation returned `hadara@0.4.5` version `0.4.5`; GitHub Release `v0.4.5` was published publicly by the operator; installed-package recycle verified fresh `basic`, `standard`, and `governed` projects, governed toy lifecycle close, and installed core feature smoke.
- Current stable 0.4.4 publish status: T-0584 records completed external publication and consumer recycle. npm registry verification returned `hadara@0.4.4` version `0.4.4` and `hadara@latest` version `0.4.4`; GitHub Release `v0.4.4` is public stable with `isDraft=false`, `isPrerelease=false`, target `d5fd35c96bbec7976e1d032ac6adf8141ed7f17d`, and URL `https://github.com/ictseoyoungmin/HADARA/releases/tag/v0.4.4`. Installed-package recycle verified `hadara@latest` installs as `0.4.4`, exposes 68 command ids, and passes init/task status/session/finalize/context pack/context slice smokes.
- Current 0.4.4 release-candidate publish status: T-0580 records completed external publication and consumer recycle. npm registry verification returned `version=0.4.4-rc.0`, dist-tags `latest=0.4.3` and `next=0.4.4-rc.0`; GitHub Release `v0.4.4-rc.0` is public prerelease with `isDraft=false`, `isPrerelease=true`, target `5c75323e8c3a5cd22a0957ac9a88decacbd74f07`, and URL `https://github.com/ictseoyoungmin/HADARA/releases/tag/v0.4.4-rc.0`. Installed-package recycle verified `hadara@next` installs as `0.4.4-rc.0`, exposes 68 command ids, and passes init/task status/session/finalize/context pack/context slice smokes.
- Current 0.4.4 stable promotion decision: T-0581 rechecked the published RC after T-0580 and found no stable-blocking issue. npm still resolves `hadara@0.4.4-rc.0` with `latest=0.4.3` and `next=0.4.4-rc.0`; GitHub Release `v0.4.4-rc.0` remains public prerelease; installed-package recycle from `hadara@next` expected `0.4.4-rc.0` passed; docs doctor remained healthy and clean. T-0582 then dogfooded the major CLI paths, found and fixed one Development Slices currentness false positive, and left stable preparation clear to proceed.
- Current stable 0.4.3 publish status: T-0570 observed `npm view hadara@0.4.3 version` returning no published match before source preparation; after the committed publish-preparation state, the operator published `hadara@0.4.3` to npm with `latest` and published GitHub Release `v0.4.3` publicly. T-0571 verified `hadara@latest` resolves to `0.4.3`, dist-tags are `latest=0.4.3` and `next=0.4.2-rc.0`, isolated registry install reports packageVersion `0.4.3`, installed command surface exposes 68 command ids, and installed init/task status/session/finalize/context pack/context slice smokes pass.
- Current stable 0.4.2 publish status: T-0546 records completed external publication. npm registry verification returned `version=0.4.2`, dist-tags `latest=0.4.2` and `next=0.4.2-rc.0`; GitHub Release `v0.4.2` is public stable with `isDraft=false`, `isPrerelease=false`, target `e1865a71056564fe0bb1cee79fcdf50726e922a8`, and URL `https://github.com/ictseoyoungmin/HADARA/releases/tag/v0.4.2`.
- Current stable 0.4.2 installed-package status: T-0547 completed consumer-path recycle for `hadara@latest` expected `0.4.2`. The approved network recycle verified registry `observedVersion=0.4.2`, dist-tags `latest=0.4.2` and `next=0.4.2-rc.0`, isolated registry install, installed CLI `packageVersion=0.4.2`, installed command surface with 68 command ids, lifecycle help, fresh init, task create/status, session start, finalize dry-run, context pack, context slice, and cleanup. The first sandboxed execute attempt failed at npm metadata lookup after about 70s per lookup and is resolved as environment/network friction by the approved rerun.
- Current stable 0.4.2 source status: T-0545 retargets package metadata, lockfile, README release status, release notes, release readiness docs, helper examples, and a stable GitHub release note artifact to `0.4.2` after the published `0.4.2-rc.0` line, installed-package recycle, installed toy-project dogfood, T-0543 stable-preflight fixes, and T-0544 fresh profile dogfood rerun. `npm view hadara@0.4.2 version` returned no published match before this source preparation.
- Current stable 0.4.2 decision status: T-0544 reran fresh `/tmp` dogfood across `basic`, `standard`, and `governed`, confirmed the T-0542 findings fixed by T-0543 stayed fixed, closed a governed toy task through `validation run --direct-result` and `task finalize --execute --auto`, and fixed the remaining profile-specific context/status guidance issues found before stable. Decision: proceed to stable `0.4.2` publish preparation, with npm/GitHub mutation and installed-package recycle remaining separate operator-controlled follow-ups.
- Current 0.4.2 release-candidate source status: T-0539 retargeted package metadata, lockfile, README release status, release notes, release readiness docs, and a GitHub prerelease note artifact to `0.4.2-rc.0` after the T-0521 through T-0538 command-surface reduction, status performance, init structure, finalize/evidence UX, dead-code cleanup, session-start parity, and fresh pre-release dogfood line. `npm view hadara@0.4.2-rc.0 version` returned no published match before this source preparation.
- Current 0.4.2 release-candidate publish status: T-0540 records completed external publication. npm registry verification returned `version=0.4.2-rc.0`, dist-tags `next=0.4.2-rc.0` and `latest=0.4.1`; operator GitHub verification returned public prerelease `v0.4.2-rc.0` with `isDraft=false`, `isPrerelease=true`, target `bb2c10f6f2dc001cac214f35746070f06c389ca5`, and URL `https://github.com/ictseoyoungmin/HADARA/releases/tag/v0.4.2-rc.0`.
- Current 0.4.2 release-candidate installed-package status: T-0541 completed consumer-path recycle for `hadara@next` expected `0.4.2-rc.0`. The approved network recycle verified registry `observedVersion=0.4.2-rc.0`, dist-tags `next=0.4.2-rc.0` and `latest=0.4.1`, isolated registry install, installed CLI `packageVersion=0.4.2-rc.0`, installed command surface with 68 command ids, lifecycle help, fresh init, task create/status, session start, finalize dry-run, context pack, context slice, and cleanup. The first sandboxed execute attempt failed at npm metadata lookup after about 70s per lookup and is resolved as environment/network friction by the approved rerun.
- Current 0.4.2 pre-release dogfood status: T-0538 refreshed development `dist` with Docker sync-build, initialized a fresh governed `/tmp` project, closed toy task `T-0001` through validation/direct-result recovery and `task finalize --execute --auto`, checked generated docs and removed routes, and documented non-blocking residuals DF-1 through DF-4. Decision: proceed to `0.4.2-rc.0` release readiness, with npm/GitHub mutation and installed-package recycle remaining separate operator-controlled follow-ups.
- Current stable 0.4.1 publish status: T-0516 prepared stable source/readiness; the operator then published `hadara@0.4.1` to npm with `latest` and published GitHub Release `v0.4.1`; T-0519 recorded npm/GitHub evidence, and T-0520 verified `hadara@latest` installs as `0.4.1` from consumer paths.
- Current stable npm publish status: T-0490 completed the approval-gated npm publish for `hadara@0.4.0`; npm registry verification returned `version=0.4.0`, `latest=0.4.0`, `next=0.4.0-rc.0`, and shasum `6268abfd73f60ca2e1dc3b32d8196e6876065948`. Previous stable `hadara@0.3.3` is published on npm through T-0406 and recycled from installed consumer paths through T-0407.
- Current release-candidate status: `hadara@0.4.1-rc.0` is published on npm with dist-tag `next` through T-0509/T-0512, and GitHub Release `v0.4.1-rc.0` is public prerelease. Registry verification returned `version=0.4.1-rc.0`, `latest=0.4.0`, `next=0.4.1-rc.0`, and shasum `8ced2baaf6bbc6e7d407fb9525cf6080109daa8f`; GitHub verification returned `isDraft=false`, `isPrerelease=true`, and target `5380df586c8deec1c4a2e504a6203e4a2b028500`.
- Current release-candidate installed-package status: T-0513 completed consumer-path recycle for `hadara@0.4.1-rc.0`. The recycle installed `hadara@next` into an isolated temporary prefix, verified installed `packageVersion=0.4.1-rc.0`, initialized a disposable project, created task `T-0001`, and passed installed task status/session/finalize/context pack/context slice smokes with cleanup. T-0513 also fixed the recycle helper's stale installed smoke call from removed `task lifecycle` to `task status`.
- Current stable 0.4.1 decision status: T-0515 completed post-refactor adaptive dogfood for the package recycle helper after T-0514. The fresh governed toy project closed valid through installed-style lifecycle usage, and live recycle dry-run/execute proved the helper uses `task status` without falling back to removed `task lifecycle`. Decision: proceed to stable `0.4.1` publish preparation, with the actual npm publish and GitHub Release publication remaining operator-approved mutation steps.
- Current stable 0.4.1 source status: T-0516 retargeted package metadata, lockfile, README, release notes, release readiness docs, helper examples, stable GitHub release note artifact, and built `dist` to stable `0.4.1` after the T-0497 through T-0515 0.4.1-rc.0 implementation, publish, installed-package recycle, and post-recycle dogfood line. `npm view hadara@0.4.1 version` returned no published match before that source preparation.
- Previous release-candidate publish status: `hadara@0.4.0-rc.0` is published on npm with dist-tag `next` through T-0477. Registry verification returned `version=0.4.0-rc.0`, `latest=0.3.3`, and `next=0.4.0-rc.0`. T-0488 then created and verified a GitHub draft prerelease for `v0.4.0-rc.0` targeting `964a8431cc08c2e89460be46560c8a8d98b451e1`.
- Current stable 0.4 decision status: T-0489 reviewed npm rc metadata, confirmed exact `hadara@0.4.0` remains unpublished, verified the RC GitHub draft prerelease, audited required pre-stable cleanup capsules, and passed strict release gate. Decision: proceed to stable `0.4.0` publish preparation, but keep the actual publish in a separate approval-gated capsule after source metadata, release docs, artifacts, and dry-runs are retargeted to stable `0.4.0`.
- Current stable source status: T-0490 retargeted package metadata, lockfile, README, release notes, release readiness docs, helper notes, stable GitHub release note artifact, and built `dist` to stable `0.4.0` after the T-0427 through T-0452 0.4 productization implementation line, T-0453 through T-0473 agent UX cleanup, T-0474 through T-0476 final pre-release hardening, T-0477 rc publish, T-0479 installed-package dogfood, and T-0481 through T-0489 pre-stable cleanup/decision work. The clean publish clone regenerated release artifact, package smoke, and clean-checkout evidence before npm publish. T-0491 created and verified the stable GitHub Release draft `v0.4.0`; T-0493 published it publicly and verified `isDraft=false` and `isPrerelease=false`.
- Current stable installed-package status: T-0492 completed consumer-path recycle from a fresh unmounted `node:22-bookworm` container. The container installed `hadara@0.4.0` globally, verified installed `packageVersion=0.4.0`, and ran installed `hadara package recycle --execute --package hadara@latest --expected-version 0.4.0 --json` successfully with `latest=0.4.0`, `next=0.4.0-rc.0`, isolated install/init/task/session/context/finalize smokes, and cleanup passed.
- Previous published npm release candidate before the current release candidate is `0.3.4-rc.0`.
- Previous release-candidate status: `hadara@0.3.4-rc.0` is published on npm with dist-tag `next` through T-0418 and has installed-package consumer proof through T-0422. npm registry checks returned `0.3.4-rc.0`, dist-tags verified `next=0.3.4-rc.0` and `latest=0.3.3`, isolated `hadara@next` install reported `packageVersion:"0.3.4-rc.0"`, installed help lifecycle, fresh init, task-scoped Session Start, task lifecycle, finalize dry-run report, context pack, context slice, and temp cleanup passed. Stable `0.3.4` was not promoted before the 0.4 source line.
- T-0287 prepares `hadara@0.2.0-rc.3` as a source publish candidate based on the `0.2.0-rc.2` dogfooding results and the proof reliability fixes from T-0284 through T-0286; this capsule performs no npm publish, GitHub Release creation, Docker image build, registry mutation, or token loading.
- T-0289 refreshed and published `hadara@0.2.0-rc.3`; npm registry verification returned `0.2.0-rc.3`.
- T-0296 prepared `hadara@0.3.0-rc.0` as a Phase 7 source candidate after command/help, lifecycle, docs registry, managed patch, and docs cleanup surfaces were implemented; T-0297 then verified the operator npm publish. The published rc.0 tarball has current dist/README content but package metadata lacks intended discovery fields, so T-0298 prepared `hadara@0.3.0-rc.1` source metadata with hardened publish-helper metadata verification.
- T-0299 added the 0.3 protocol migration adoption path for existing projects, including dry-run-first migration, protocol version reporting, selected project/task scope, docs registry insertion, managed section marker insertion, command surface documentation refresh, Required Reading cleanup, and before-hash guarded execute plans.
- T-0300 fixed the protocol migration evidence preservation blocker: task-scoped migration now creates a missing evidence log only when needed and does not overwrite existing `evidence.jsonl`; task finish status history rows also remain inside the managed table.
- T-0301 prepared and published `hadara@0.3.0-rc.1` through the approval-gated manual helper. The helper refreshed release artifact, package smoke, and clean-checkout smoke evidence; npm publish completed; `npm view` observed `hadara@0.3.0-rc.1` after two retries; GitHub Release draft was not requested.
- T-0303 through T-0309 prepared the `0.3.0-rc.2` workflow UX hardening line: context scaffold and migration support, incremental documentation/write coordination guidance, Task Board row preservation, actionable ready/close hints, Required Reading tier docs and JSON metadata, and atomic migration/docs cleanup execute writes.
- T-0310 prepared and published `hadara@0.3.0-rc.2` through the approval-gated manual helper. The helper refreshed final validation, release artifact, package smoke, clean-checkout smoke, strict gate, dry-run, and publish dry-run evidence; npm publish completed; `npm view` verified `hadara@0.3.0-rc.2`; GitHub Release draft was not requested.
- T-0313 committed HADARA-dev's own `.hadara/docs-registry.json` and `docs/DOC_REGISTRY.md` artifacts from existing docs-registry service output so context routing no longer points at absent files.
- T-0314 hardened `docs patch --execute` by replacing direct target overwrite with the shared atomic text write helper and adding failure-preservation/temp-cleanup regression coverage.
- T-0315 prepared stable `hadara@0.3.0` source metadata and release readiness evidence after T-0313/T-0314 follow-up hardening. It performed no npm publish, GitHub Release creation, Docker image build/push, PyPI publish, registry mutation, or token loading.
- T-0316 is the approval-gated stable npm publish capsule. It intentionally staged the README as post-publish package-facing content, then the operator ran the helper; npm publish completed, `npm view` verified `0.3.0`, and GitHub Release draft was not requested.
- T-0317 completed stable `hadara@0.3.0` post-publish installed-package recycle through registry metadata, temp-prefix install, fresh init/docs, migration, finish preservation, and mini lifecycle smokes; exact npx verification remained an environment-sensitive finding.
- T-0318 through T-0325 completed the Phase 8 / 0.3.1 rc1 status-governance line: status token/document ownership policy, task handoff close-state governance, installed-package findings cleanup, state consistency projection, advisory state verify/doctor/CI integration, final rc1 hardening, and CloseState derived-state cleanup.
- T-0326 prepared `hadara@0.3.1-rc.1` source metadata, release docs, release artifact, package smoke, clean-checkout smoke, strict gate, release dry-run, publish dry-run, and full Docker validation without npm publish, GitHub Release creation, Docker image build/push, PyPI publish, registry mutation, or token loading. Package smoke first hit sandbox npm cache `EROFS`, then passed on approved escalated rerun.
- T-0327 completed the approval-gated npm publish capsule for `hadara@0.3.1-rc.1`: npm publish completed, `npm view` and tarball/README checks passed, the helper was hardened so future rc publishes default to `next`, and npm dist-tags now verify `latest=0.3.0` plus `next=0.3.1-rc.1`.
- T-0328 completed post-publish installed-package recycle for `hadara@0.3.1-rc.1`: registry/dist-tags, exact npx, temp-prefix installed bin, 71-entry command registry, broad CLI command-family matrix, source release dry-runs, MCP initialize, TUI snapshot, run scaffold/run, and disposable lifecycle surfaces passed in the `hadara-dev` container; temporary recycle folders were removed.
- T-0330 through T-0335 prepared the 0.3.2 Evidence v2 refactor line before rc0 release readiness: explicit `evidence add-command` v2 metadata, exact resolution tags, result/outcome mismatch guards, core writer append defense, durable id discovery through `evidence list`, canonical `evidence.jsonl` and non-canonical `EVIDENCE.md` rebuild boundaries, and consolidated docs/deferred-scope guidance. Rebuild preview/execute, `check-id`, `subject`, and a new add-command report schema id remain deferred candidate scope.
- T-0337 completed the approval-gated npm publish capsule for `hadara@0.3.2-rc.0`: npm publish completed, `npm view hadara@0.3.2-rc.0 version` returned `0.3.2-rc.0`, dist-tags verified `latest=0.3.0` and `next=0.3.2-rc.0`, README/tarball metadata were visible, and GitHub Release draft was not requested.
- T-0269 pre-publish dry-run recheck passed for `0.2.0-rc.0`, but `NPM_TOKEN` was missing and no publish mutation was executed; T-0275 supersedes that candidate with `0.2.0-rc.1` after recycle fixes.
- T-0275 refreshed publish-readiness evidence for `hadara@0.2.0-rc.1` and the operator published it to npm; `npm view hadara@0.2.0-rc.1 version --registry=https://registry.npmjs.org` returned `0.2.0-rc.1`.
- T-0282 refreshed and published `hadara@0.2.0-rc.2` after the init scaffold protocol guidance follow-up: package metadata/docs/helper examples target rc2; Docker `npm run dev:docker-sync-build` passed 100 files / 681 tests and refreshed `dist`; built CLI version smoke reported `0.2.0-rc.2`; strict release gate passed; rc2 package smoke and clean-checkout smoke evidence passed; `npm pack --dry-run --json` produced rc2 tarball metadata; the manual helper regenerated release artifact/package/clean-checkout evidence from a clean committed worktree, published to npm, and verified `npm view` returned `0.2.0-rc.2`.
- Current stable line status: stable `hadara@0.3.2` npm publish is complete through T-0340; post-publish installed-package recycle is the next release-line follow-up.
- Previous release-candidate line status: `hadara@0.3.2-rc.0` was published on npm with `next` dist-tag through T-0337; installed-package recycle from consumer paths is complete through T-0338.
- Stable `0.3.2` decision status: T-0339 selected stable publish after T-0336 readiness, T-0337 publish verification, T-0338 installed-package recycle, and T-0339 docker-compose dogfooding found no release-blocking issue; T-0340 source metadata targeted stable `0.3.2`, Docker check/package smoke/clean-checkout smoke/strict gate/release artifact/release dry-run/publish dry-run/direct npm tarball dry-run passed, npm publish completed, and registry/dist-tags verification passed.
- T-0342 through T-0400 completed the 0.3.3 context-routing and lifecycle preparation line: context graph/state projection, code index links, context pack, raw context slice, speed-first explicit cache warm paths, warm graph/code index consumption, bounded Session Start, performance fixtures, context-routing completion audit and hardening, task lifecycle/close-repair/finalize convenience APIs, guarded finalize execute, and finalize-first default agent lifecycle docs/help/projection. T-0401 prepared `hadara@0.3.3-rc.0` source/readiness only and performed no npm publish, GitHub Release creation, Docker image build/push, PyPI publish, registry mutation, installer execution, or token loading.
- Current release-candidate line status: `hadara@0.3.3-rc.0` is published on npm with dist-tag `next` through T-0402. Registry verification returned version `0.3.3-rc.0`, dist-tags `next=0.3.3-rc.0` and `latest=0.3.2`, tarball shasum `3088fca4b4a91b257680ffddf53ab8a0543d6264`, and installed-bin smoke passed from a temporary consumer prefix. GitHub Release creation, Docker/PyPI publish, installer execution, and MCP release/package execution did not run.
- Stable `0.3.3` status: T-0404 imported PatternForge dogfood findings and stable decision input, fixed PF-F-012 cached Task Board node classification, fixed PF-F-010 warning-only post-close handoff next actions, passed focused Docker validation with guarded dist sync, and verified built PatternForge smokes. T-0405 prepared stable `0.3.3` source/readiness without publish mutation. T-0406 completed approval-gated npm publish and registry/dist-tag verification. T-0407 completed post-publish installed-package recycle from npm consumer paths. GitHub Release draft, Docker/PyPI publish, installer execution, and MCP release/package execution did not run.
- T-0408 through T-0416 completed the 0.3.4 agent UX hardening line from HADARA development dogfooding: post-publish release closeout, package recycle artifact surfacing, stale handoff diagnostics, evidence summaries, finalize/lifecycle guidance hardening, session-start action hints, context-pack agent actions/ranking reasons, and generated init guidance cleanup.
- T-0417 prepared `hadara@0.3.4-rc.0` source/readiness; T-0418 completed approval-gated npm publish to `next`; T-0422 completed the reviewer-requested installed-package acceptance proof from consumer paths. T-0422 found a package-recycle helper residual in the extra installed `context graph --json` smoke and source-workspace environment leakage; T-0423 fixed it before stable readiness by making broad graph smoke opt-in with `--include-graph`, stripping inherited source `HADARA_PROJECT_ROOT` for installed subprocesses, and proving the default installed-agent UX path against `hadara@next`.
- T-0424 through T-0452 completed the 0.4 breaking productization implementation line: accepted specs, generated 0.4 scaffold and agent/workflow templates, registry-backed docs registration/read maps, four-file Task Capsules, 0.4 table validation, source document drift, slot registry and evidence projection, normalized close-source contracts, fail-closed legacy mutation boundaries, read-map integration for session/context, authoring guidance, command/help/schema alignment, product-default cleanup, basic/governed dogfood, lifecycle UX hardening, validation-run workflow polish, and final documentation cleanup.
- T-0453 through T-0473 completed post-implementation agent UX cleanup that directly affects release readiness: `validation run` no longer rewrites `TASK.md` by default, validation attempts auto-resolve same-check failures, task status projects latest validation attempt state, evidence help is non-mutating, validation wrapper launch errors are structured, task status/finalize report duration diagnostics, finalize execute prints progress, staged finalize plans expose deferred checks, lifecycle next actions are deduped, close repair is positioned as a conditional diagnostic, default status is fast, finalize owns close-proof repair, and broad diagnostics are explicit.
- T-0474 through T-0476 completed final pre-release cleanup: dashboard aggregate routes avoid broad scans through task-scoped timeline/cache reuse, current user-facing template/upgrade/write-preflight/TUI surfaces no longer expose removed legacy sidecar defaults, and explicit task-scoped CI gate lookup uses exact task lookup while release-line fixtures use current 0.4 capsule docs.
- README now includes a top image from `docs/assets/hadara_sub_right_name.png`; because package `files` currently excludes `docs/assets/`, publish readiness uses the GitHub raw image URL. T-0275 verified `docs/assets/hadara_sub_right_name.png` is tracked and the raw URL returned HTTP 200.
- Current package is `private: false`.
- Current package metadata includes `"license": "MIT"`.
- Current binary remains `bin.hadara` at `./dist/cli/main.js`.
- Current `files` whitelist is `dist/`, `README.md`, `LICENSE`, and `package.json`.
- Bootstrap metadata mode: version `0.0.0-bootstrap`, `private: true`, no package publishability.
- Release-candidate metadata mode: version `0.x.y-rc.N`, `private: false`, `files` whitelist present, `LICENSE` present, package smoke evidence present.
- Scoped fallback decision: do not silently switch names; choose and document an explicit scope in a later release-target capsule if `hadara` is unavailable.
- Version policy: first release-candidate target was `0.1.0-rc.0`; current npm release candidates may use patch-line versions such as `0.3.2-rc.0` after the stable `0.3.0` line. Publish remains approval-gated and belongs to a dedicated publish capsule. RC npm publishes must use the `next` dist-tag unless a capsule explicitly decides otherwise; stable publishes use `latest`.
- T-0142 transitions `private` to false only after the package files whitelist, root README, license decision, and package-smoke evidence gates exist.
- Final `files` whitelist target: `dist/`, `README.md`, `LICENSE`, `package.json`, plus installer and portable files only after those files exist.
- Do not add `files` entries for missing installer or portable paths in T-0127.
- MIT license decision: adopt MIT; `LICENSE` exists and is included in the package whitelist.
- Publish target decision: npm package first, GitHub Release second, Docker image deferred. npm publication and GitHub release publication are independent targets; a GitHub Release note/prerelease record is required for release handling, but custom GitHub asset parity is not a default acceptance gate.
- Installed CLI verification must use `hadara doctor --json`.
- Post-publish installed-package recycle should use `node --import tsx tools/dev-surfaces.ts package recycle --execute --package hadara@latest --expected-version <version> --source-root . --evidence-root . --task <task-id> --attach-evidence --json` for stable or `--package hadara@next --expected-version <version>` for release candidates from a dedicated release follow-up capsule. The command is dry-run-first by default, reports source/evidence/smoke project root roles, uses an isolated temporary prefix and disposable smoke project in execute mode, does not propagate source `HADARA_PROJECT_ROOT` into installed subprocesses, verifies registry metadata, installed version, init/task status/session/finalize/context pack/context slice surfaces, and cleanup, and must not publish packages or create release artifacts. Package smoke/recycle reports include per-step timeout policy with a 300-second npm/recycle default and timeoutStepIds for slow-step attribution. Broad installed `context graph --json` diagnostics require explicit `--include-graph`.
- T-0142 performs no publish, no GitHub Release creation, no Docker image build, and no registry mutation; it transitions metadata and regenerates reduced release evidence only.
- Before adding more T-0128+ release/install/package-smoke readiness markers, prefer moving the structured readiness source to `docs/RELEASE_READINESS.md` or `docs/release-readiness.json`.

## CI Release Workflow Target Decision

T-0139 decides what release means before any publish or deploy script exists.

Release target decision:

- Primary release target: npm package.
- Secondary release target: GitHub Release with tarball, checksum, and manifest assets optional per release contract, as an independent public release-note/prerelease surface; if selected, each must be the exact reviewed bytes or be explicitly labeled as reconstructed/non-original.
- Deferred release target: Docker image.
- Docker image publishing is deferred unless HADARA adds a server/runtime product surface that needs container distribution.
- npm package publish is the first approval-gated mutation path because HADARA is currently a Node CLI/workbench.
- GitHub Release is secondary for public release visibility and optional portable archive distribution/checksum/manifest inspection; its asset set does not retroactively define npm package provenance.

Required secret names:

- npm publish token name: `NPM_TOKEN`.
- GitHub Release token name: `GITHUB_TOKEN` or `HADARA_GITHUB_RELEASE_TOKEN`.
- Token values must never be written to repository files, public evidence, release artifacts, logs, manifests, or context export.
- Token presence checks may report only present/missing/redacted status.

Approval and mutation boundary:

- Publish/deploy remains explicit approval only.
- T-0139 performs no publish, no GitHub Release creation, no Docker image build, no registry mutation, no GitHub API call, and no token loading.
- Release mode is required before any future publish/deploy command may consider `NPM_TOKEN`, `GITHUB_TOKEN`, or `HADARA_GITHUB_RELEASE_TOKEN`.

Release target provider model:

- T-0244 introduces release target descriptors so release readiness can name ecosystem-specific targets without claiming every ecosystem is executable.
- The active primary descriptor is `npm-package` with ecosystem `npm`, manifest `package.json`, artifact kind `npm-tarball`, smoke profile `npm-package-smoke`, and publish provider `npm`.
- The active secondary descriptor is `github-release` with ecosystem `github-release`, an optional exact-asset set selected by the release capsule, and approval-gated publishing still blocked by the current implementation. npm and GitHub are verified independently.
- The deferred descriptor is `docker-image` with ecosystem `docker`; Docker build and publish execution remain deferred.
- If `pyproject.toml` is present, release dry-run may surface `python-package-preview` with ecosystem `python`, artifact kinds `wheel` and `sdist`, smoke profile `python-package-preview`, and publish provider `pypi`.
- Python release target detection is read-only preview only. HADARA does not currently run `python -m build`, create wheels or sdists, run `pip install` smoke, run `twine check`, load PyPI credentials, or publish to PyPI.
- The existing `package-smoke` evidence category remains the historical npm package smoke evidence channel; new provider metadata identifies the current implementation as npm-specific through `npm-package-smoke`.
- Future release ecosystems such as Python, Cargo, Maven, Docker, or generic archives must add provider-specific smoke/readiness behavior in their own capsules and preserve the no-mutation-by-default release boundary.

T-0141 publish/deploy command boundary:

- `node --import tsx tools/dev-surfaces.ts release publish --mode dry-run|execute --json` emits `hadara.releasePublish.v1`.
- The command checks release dry-run readiness, package publishability metadata, approval metadata, and token presence without including token values.
- Execute mode requires `--approval-actor`, `--approval-reason`, and `--confirm publish-deploy`, and execute requests are privately audited before returning a blocked report.
- The current implementation never runs `npm publish`, creates a GitHub Release, builds a Docker image, mutates registries, uploads artifacts, calls GitHub APIs, or exposes an MCP release execution surface.

Evidence freshness and cross-check implementation for T-0140:

- `node --import tsx tools/dev-surfaces.ts release dry-run --json` is read-only and emits `hadara.releaseDryRun.v1`.
- The dry-run verifies the strict release gate, then cross-checks package-smoke, clean-checkout smoke, and release-artifact public evidence records.
- Release gate strictness means evidence existence, artifact schema validity, source/report `ok`, and expected category/mode/result.
- Release dry-run strictness is release gate strictness plus freshness checks for current package version, release artifact manifest hash, and git commit when public evidence artifacts include git commit metadata.
- T-0260 decomposes release dry-run internals into target configuration, provider advisory, evidence validation, readiness, and diagnostics services without changing the `hadara.releaseDryRun.v1` report shape or adding release mutation.
- Release artifact evidence flow is explicit and must avoid self-invalidating clean-tree loops. Build from a clean source clone with a separate evidence sink: `node --import tsx tools/dev-surfaces.ts release artifact --execute --source-root /tmp/hadara-release-src --output /tmp/hadara-release-out --journal /tmp/hadara-release-results/artifact.json --json`, then attach from the workspace with `node --import tsx tools/dev-surfaces.ts release artifact --from-journal /tmp/hadara-release-results/artifact.json --evidence-root . --attach-evidence --task <task-id> --json`. Same-root `--attach-evidence` with a clean git preflight fail-closes with `RELEASE_ARTIFACT_SELF_INVALIDATION_RISK` unless explicitly overridden after review.
- T-0140 still performs no publish, no GitHub Release creation, no Docker image build, no registry mutation, no GitHub API call, and no token loading.

Compatibility markers retained for the read-only strict release gate:

- Evidence freshness must compare evidence to the release candidate window.
- Evidence cross-check should follow this order: record exists, artifact exists, artifact schema valid, `sourceReport.ok` true when present, category/mode/result match the expected check.
- Release artifact evidence flow must be explicit: run `node --import tsx tools/dev-surfaces.ts release artifact --execute --source-root <clean-source> --output <artifact-output> --journal <result.json> --json`, then attach the journal from `evidenceRoot`.

## Installer Script Surface and Schema

T-0128 defines installer and portable launcher contracts only. It does not create installer scripts, portable launchers, install trees, symlinks, shell profile edits, package copies, package artifacts, or registry mutations.

Reserved installer script paths:

- `scripts/install.sh`
- `scripts/install.ps1`

Reserved portable launcher paths:

- `portable/bin/hadara`
- `portable/bin/hadara.cmd`
- `portable/bin/hadara.ps1`

Installer responsibilities:

- Installer scripts install or plan installation from a tarball or directory.
- Installer scripts must support dry-run planning before mutation.
- Installer scripts must emit `hadara.install.plan.v1` JSON for dry-run planning.
- Installer scripts must not use `sudo` by default.
- Installer scripts must not force `npm install -g`.
- Installer scripts must not mutate shell profiles or PATH by default.
- Installer scripts must not print full environment values, npm tokens, private absolute paths, raw npm logs, or private store paths.

Portable launcher responsibilities:

- Portable launchers invoke an installed or portable HADARA bundle.
- Portable launchers do not install dependencies.
- Portable launchers do not mutate PATH.
- Portable launchers do not modify project files.
- Portable launchers must prefer the installed `hadara` command form for user-facing validation.

Default install location suggestions:

- Linux/POSIX/WSL prefix suggestion: `~/.local/share/hadara`
- Linux/POSIX/WSL bin link suggestion: `~/.local/bin/hadara`
- Windows prefix suggestion: `%LOCALAPPDATA%\HADARA`
- Windows cmd launcher suggestion: `%LOCALAPPDATA%\HADARA\bin\hadara.cmd`
- Windows PowerShell launcher suggestion: `%LOCALAPPDATA%\HADARA\bin\hadara.ps1`
- Default POSIX/WSL/Windows install paths are suggestions, not silent decisions.
- Windows USB portable root: user-selected removable drive, for example `L:\HADARA`.
- WSL USB portable root for `--platform usb`: user-selected mounted removable drive, for example `/mnt/l/HADARA`.
- The drive letter or mount path must not be assumed.
- USB install roots must be explicitly provided.
- Install planning must require an explicit `--usb-root` or `--target` value for USB, or return a structured issue asking the user to choose one.
- `--platform wsl` uses Linux-style default install suggestions; mounted removable drives belong to `--platform usb`.

Node and WSL checks:

- Installer plans must validate Node 22.
- Missing Node 22 must produce a friendly remediation message.
- WSL install plans must reject Windows `node.exe` shims.
- WSL install plans must require Linux Node.js.

Dry-run report schema:

- Schema id: `hadara.install.plan.v1`
- Command: `install.plan`
- Modes: `dry-run`, `execute`
- Platforms: `linux`, `windows`, `wsl`, `usb`; `posix` remains a compatibility alias for Linux-style installs.
- Actions must describe planned writes without performing them.
- `wouldWrite: true` means the action would write only in a future confirmed execute/apply mode; it does not mean the dry-run command wrote anything.
- Public output must be reduced and redacted.
- Target paths must be public path references, not raw absolute path strings.
- `target.prefix.displayPath` is a redacted or portable display path for humans, not a private raw path.
- `target.prefix.pathRedacted: true` is required for public install-plan output.
- `target.launcher.displayPath` is a redacted or portable display path for humans, not a private raw path.
- `target.launcher.pathRedacted: true` is required for public install-plan output.
- `source.pathRedacted: true` is required when source path details appear in public install-plan output.
- Optional `relativePath` values must be project-relative, bundle-relative, or portable-relative; they must not be private absolute paths.
- `execution.executeEnabled` must state whether mutation is available to the current command implementation.
- `mode: execute` is schema-reserved only until an explicit later capsule implements mutation.
- T-0129 dry-run implementation must reject execute mode or return `INSTALL_EXECUTION_DISABLED`.
- The schema fixture documents a future execute mode but does not authorize installer execution.
- Raw logs must be temporary or private/local only.

T-0128 release-gate boundary:

- The release gate checks installer surface and schema markers only.
- The release gate must not execute `scripts/install.sh`.
- The release gate must not execute `scripts/install.ps1`.
- The release gate must not create or invoke `portable/bin/hadara`.
- The release gate must not mutate install locations, PATH, shell profiles, package artifacts, GitHub Releases, Docker images, npm registry state, or user machines.

## Release Artifact Output Boundary

T-0137 introduces explicit local release artifact building through `node --import tsx tools/dev-surfaces.ts release artifact --execute --json`.

- Default artifact output is disposable and removed after the reduced report is created.
- Retained output requires an explicit `--output <dir>`.
- The recommended retained local output directory is `dist-release/`.
- `dist-release/` is ignored by git and should not be committed.
- Release artifact outputs may include tarballs, checksum files, and manifest files, but public reports must stay reduced and redacted.
- Release artifact building must not publish to npm, create GitHub Releases, build Docker images, call GitHub, mutate registries, or execute install-matrix behavior.
- The generated release artifact manifest currently uses `hadara.releaseArtifact.manifest.v1`; register that manifest schema before a future release gate reads manifest files directly.

## Installer Dry-run Implementation

T-0129 implements installer planning only.

- Public command: `hadara install plan --json`.
- Supported flags: `--platform linux|windows|wsl|usb|posix`, `--source <path>`, `--source-kind tarball|directory|portable-bundle`, `--target <path>`, `--usb-root <path>`, `--prefix <path>`, `--launcher <path>`, and `--mode dry-run|execute`.
- Successful dry-run output uses schema `hadara.install.plan.v1`.
- Dry-run actions describe planned writes with `wouldWrite: true` but perform no filesystem, PATH, profile, package, registry, or release mutation.
- `wouldWrite: true` means execute/apply mode would write if later confirmed; it is not evidence that dry-run wrote files.
- Public source and target path fields use `pathRedacted: true`.
- User-supplied private absolute source, prefix, and launcher paths are not echoed in public output.
- USB dry-run planning without `--usb-root` or `--target` returns issue `USB_ROOT_REQUIRED`.
- `--mode execute` returns issue `INSTALL_EXECUTION_DISABLED` and does not execute installer behavior.
- Dry-run JSON must never prompt.
- Future install execution must require either interactive confirmation or an explicit `--yes`.
- Capability discovery marks `hadara install plan --json` as read-only.
- T-0129 creates no installer scripts, no portable launchers, no install directories, no package artifacts, and no MCP installer execution surface.

## Install Matrix Smoke Plan

T-0130 defines install-matrix smoke planning only. It does not run installer scripts, run package smoke, call `npm pack`, install packages, create portable bundles, mutate PATH, mutate shell profiles, call GitHub, publish packages, create release artifacts, or write install-matrix evidence.

Required matrix rows:

- Matrix row: Linux source checkout
- Matrix row: Linux package install
- Matrix row: WSL source checkout
- Matrix row: Windows source checkout
- Matrix row: Windows package install
- Matrix row: USB portable on Windows
- Matrix row: USB portable on WSL
- Matrix row: installed CLI major-feature smoke

Matrix execution boundaries:

- Docker/Linux validation does not replace real Windows validation.
- Linux source-checkout rows may use Docker or native Linux as reproducible local evidence.
- WSL source-checkout rows must prove Linux Node.js is used, not a Windows `node.exe` shim.
- Windows rows must be observed on real Windows or an explicitly documented Windows runner.
- USB rows must require explicit user-selected USB roots.
- USB rows must not assume a drive letter or mount path.
- Package-install rows are blocked until package smoke and release artifacts exist.
- Source-checkout rows may keep `node dist/cli/main.js` as an internal fallback.
- Package/install/USB rows must prefer the installed `hadara` command form.
- Installed CLI major-feature smoke should use the future core smoke profile before release-readiness checks.

Matrix evidence boundaries:

- Matrix evidence must record platform, source kind, installer/package form, command form, and reduced public result.
- Public matrix evidence must not include raw install logs, npm token values, environment dumps, private absolute paths, private portable-store paths, or USB serial/device identifiers.
- Raw logs and private paths must stay temporary or private/local.
- Failure evidence should record stable issue codes, exit codes, and reduced remediation text.
- The release gate must not execute install matrix smoke.
- The release gate may only check this plan now and later read reduced evidence records.

Structured matrix follow-up:

- T-0130 keeps install matrix rows as planning markers only.
- Before adding more matrix rows or executable matrix results, move the matrix row list into a structured fixture such as `docs/release-readiness.json` or `src/fixtures/install-matrix.v1.json`.
- The future structured fixture schema should be `hadara.installMatrix.plan.v1`.
- The future fixture should include row fields such as `id`, `platform`, `sourceKind`, `commandForm`, and `status`.
- The read-only release gate should prefer the structured fixture over wording-sensitive Markdown markers once the fixture exists.

## Major Feature Smoke Runner Plan

T-0131 implements the core major-feature smoke runner before package-smoke or install-matrix execution. The first profile is `core`, so package smoke can reuse the same reduced feature checks without creating release-gate evidence cycles.

Current T-0131 boundary:

- The core profile calls internal service/read-model surfaces directly.
- It does not spawn `hadara`, resolve PATH, verify launcher wiring, install a package artifact, or prove a USB/Windows/Linux installed binary.
- Report fields must make this explicit with `executionMode: "service-read-model"`, `binaryExecuted: false`, `launcherChecked: false`, and `packageInstallChecked: false`.
- Future installed-CLI smoke belongs after package artifacts, install apply/launcher wiring, and explicit subprocess policy exist.
- T-0131 is the Core Feature Smoke Runner; Installed CLI Smoke and Package Smoke Execution are future package/install smoke scopes.

Recommended `core` profile command set:

- `hadara doctor --json`
- `hadara task status --json`
- `hadara task list --json`
- `hadara tools list --json`
- `hadara tui --snapshot --json`
- `node --import tsx tools/dev-surfaces.ts release gate --mode advisory --json`

Profile boundaries:

- The `core` profile must avoid package-smoke execution and strict release-gate evidence requirements.
- `node --import tsx tools/dev-surfaces.ts smoke run --profile core --json` emits a reduced `hadara.featureSmoke.v1` report over service/read-model surfaces.
- The `release-readiness` profile is reserved but currently returns `FEATURE_SMOKE_PROFILE_DEFERRED`.
- A later `release-readiness` profile may include strict release gate checks, package smoke evidence, install matrix evidence, and release artifact evidence after those surfaces exist.
- Smoke runner output must stay reduced and redacted, with raw logs temporary or private/local only.

## Release Gate Evidence Freeze

T-0138 keeps `node --import tsx tools/dev-surfaces.ts release gate --mode advisory|strict --json` read-only while allowing it to read existing Task Capsule evidence records.

Evidence-backed checks:

- `PACKAGE_SMOKE_EVIDENCE` reads passed public package-smoke execution evidence.
- `CLEAN_CHECKOUT_SMOKE_EVIDENCE` reads passed public clean-checkout smoke evidence.
- `RELEASE_ARTIFACT_EVIDENCE` reads passed public release artifact build evidence.
- `REMOTE_CI_OBSERVATION` remains a documented remote-CI observation check.
- `INSTALL_MATRIX_SMOKE_EVIDENCE` is reserved but non-blocking until an executable install-matrix smoke surface exists.

The release gate must not execute package smoke, clean-checkout smoke, install matrix smoke, `npm pack`, installer scripts, package installs, publish/deploy, GitHub Releases, Docker builds, provider calls, or MCP release/package/install tools.
