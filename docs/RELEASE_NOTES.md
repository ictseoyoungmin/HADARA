# RELEASE_NOTES

## 0.4.5

Stable preparation line for safe brownfield adoption and docs-registry cleanup after `0.4.4`.

Highlights:

- Adds docs-registry v3 so document classification separates lifecycle state, role, origin, and profile applicability instead of overloading scaffold profile tokens.
- Adds safe brownfield `hadara init` adoption: existing non-HADARA projects get a zero-write adoption plan by default and require `--adopt --execute --plan-hash <hash>` before HADARA writes managed protocol files.
- Preserves existing project docs during adoption. Project-authored files such as an existing `AGENTS.md` or `docs/ARCHITECTURE.md` remain project-owned; HADARA adds managed blocks and registry metadata without treating those files as scaffold-owned templates.
- Removes new-project `tasks/.gitkeep` generation and keeps init-created docs aligned with the current public command surface.
- Adds docs-registry mutation hardening so failed docs update/archive/supersede/unregister paths fail with non-zero exits instead of returning `ok:false` with process success.
- Hardens `init doctor` and `docs doctor` for registry v3 origin/profile semantics and verifies adopted brownfield projects do not emit false scaffold-drift findings.
- Dogfoods the release candidate locally across fresh `basic`, `standard`, and `governed` projects, a governed task lifecycle close, brownfield dry-run/execute adoption, plan-hash mismatch refusal, partial `.hadara` refusal, unsafe symlink refusal, and installed-candidate adoption across TypeScript, Python/data, and web/monorepo brownfield shapes.
- Hardens package smoke for tool environments where child processes return a successful exit status while stdout capture is empty, using installed files as a reduced fallback for command-surface and init-doc checks.

Boundaries:

- T-0585 defines the 0.4.5 docs-registry and init-cleanup design.
- T-0586 through T-0592 implement registry v3, mutation commands, project-authored defaults, migration cleanup, docs mutation safety, and the brownfield adoption contract.
- T-0593 through T-0595 implement the brownfield detector, guarded writer, and adoption doctor/idempotency cleanup.
- T-0596 validates fresh and brownfield behavior from `/tmp` using the built CLI.
- T-0597 prepares initial source metadata, release notes, readiness docs, GitHub Release notes, and release validation evidence for `hadara@0.4.5`.
- T-0598 closes reviewer release blockers in brownfield adoption safety: explicit `--adopt`, partial-state fail-closed behavior, root-entry detection, symlink/type/marker/owner/task-collision blockers, project-authored core-doc ownership, and dynamic scaffold `createdWith`.
- T-0599 validates the installed candidate across TypeScript service, Python/data, and governed web/monorepo brownfield fixtures from init through baseline capsule close.
- T-0600 recycles release readiness from current source, refreshes package-smoke evidence, fixes package-smoke empty-stdout fallback handling, and refreshes the GitHub Release note artifact.
- T-0601 fixes clean-clone test regressions found after T-0600 by keeping empty scaffold parent directories greenfield-safe and propagating `package.json` description into adopted brownfield Project State metadata.
- T-0602 fixes package-smoke generated-init validation by running installed `hadara init` in an isolated greenfield subworkspace, then refreshes passing package-smoke and strict release-gate evidence.
- The 0.4.5 source-preparation line performs no npm publish, GitHub Release publication, Docker image push, PyPI publish, installer execution, token loading, or post-publish installed-package recycle.
- The intended npm dist-tag is `latest`; `hadara@0.4.4` remains the published stable line until the operator runs the approval-gated publish helper.
- Post-publish installed-package recycle for `hadara@latest` expected `0.4.5` remains a separate follow-up capsule after npm/GitHub publication.

## 0.4.4

Stable release for the external/delegated dogfood and generated-document currentness line after `0.4.4-rc.0` npm/GitHub prerelease publication, installed-package recycle, stable-promotion verification, and final major CLI dogfood.

Highlights:

- Promotes the 0.4.4 RC line validated by R1 basic-profile delegated dogfood, R2 standard-profile external validation, and R3 governed-profile Claude Code dogfood.
- Keeps the 0.4.4 fresh-project UX fixes from the RC: conventional version aliases, installed-package stale diagnostics in non-HADARA roots, bootstrap next-work retirement, generated read ranges, consumer context-pack guidance, finish-only status hints, and cleaner governed handoff scaffolds.
- Uses existing `package.json` `name` and `description` during `hadara init` to populate Product metadata while preserving `docs doctor` warnings for projects that leave product metadata unset after completed task history exists.
- Preserves the structured current-state and next-work model introduced in 0.4.3, including `.hadara/state/current.json`, managed Project State/Handoff projections, and currentness diagnostics.
- Adds the final T-0582 major CLI dogfood fix: legacy `docs/DEVELOPMENT_SLICES.md` is no longer treated as latest-task currentness authority unless canonical `.hadara/state/slices.json` exists.
- Confirms the stable path with repo read models, fresh `basic`/`standard`/`governed` init, governed toy lifecycle, `docs doctor`, `status --state-only`, focused state-projection tests, TypeScript build, and Docker full suite.

Boundaries:

- T-0580 records completed `0.4.4-rc.0` npm/GitHub publication and installed-package recycle from `hadara@next`.
- T-0581 records stable-promotion verification: npm/GitHub RC metadata stayed correct, installed-package recycle passed again, and docs currentness was clean.
- T-0582 records final major CLI dogfood before stable and fixes the only release-blocking issue it found.
- T-0583 prepares source metadata, release notes, readiness docs, helper examples, validation evidence, and the operator publish path for `hadara@0.4.4`; it performs no npm publish, GitHub Release publication, Docker image push, PyPI publish, installer execution, token loading, or post-publish installed-package recycle.
- The intended npm dist-tag is `latest`; `hadara@0.4.4-rc.0` remains available on `next` as prerelease history unless an operator changes dist-tags after stable publication.
- Post-publish installed-package recycle for `hadara@latest` expected `0.4.4` remains a separate follow-up capsule after npm/GitHub publication.

## 0.4.4-rc.0

Release candidate preparation line after stable `0.4.3`, focused on external/delegated dogfood, generated-document currentness, and pre-release continuation-state UX hardening.

Highlights:

- Validates the published 0.4.3 workflow against non-HADARA projects before cutting the 0.4.4 RC: R1 basic-profile delegated dogfood, R2 standard-profile external validation, and R3 governed-profile Claude Code dogfood all completed ordinary Task Capsule lifecycles.
- Fixes R1/R2/R3 dogfood findings that affected fresh-project agent UX: conventional version aliases, installed-package stale diagnostics in non-HADARA roots, bootstrap next-work retirement, generated read ranges, consumer context-pack guidance, and finish-only status hints.
- Keeps structured current-state guidance from 0.4.3 while hardening the generated governed handoff: new governed projects no longer start with an empty `Last 3 Completed Tasks` table or `TBD` historical index rows.
- Uses existing `package.json` `name` and `description` during `hadara init` to populate Product metadata, while `docs doctor` still warns when a project keeps unset metadata after real completed task history exists.
- Clarifies selected-task readiness output for closed-valid tasks: the fast path now reports `closed-valid-current-not-checked` when close proof is valid and current done-level checks were intentionally skipped, rather than reading like an active blocker.
- Preserves the primary release boundary: source/readiness work prepares npm `next` publication, while npm publish, GitHub Release publication, and installed-package recycle remain separate operator-controlled steps.

Boundaries:

- T-0572 defined the external-repository validation plan and release gates for v0.4.4.
- T-0573 through T-0577 ran delegated/external dogfood across basic, standard, and governed profiles, including an independent Claude Code run that completed 8 governed-profile capsules.
- T-0575 and T-0578 fixed release-candidate UX issues found by dogfood before this release-readiness capsule.
- T-0579 prepared source metadata, release notes, readiness docs, helper examples, validation evidence, and the operator publish path for `hadara@0.4.4-rc.0`; T-0580 records npm/GitHub publication and installed-package recycle; T-0581 rechecked RC stability and selected stable `0.4.4` source/release preparation as the next step.
- The npm dist-tag is `next`; stable `latest` remains `hadara@0.4.3` until a later stable promotion decision.
- Post-publish installed-package recycle for `hadara@next` expected `0.4.4-rc.0` passed in T-0580 from consumer paths and passed again during T-0581 stable-promotion verification.

## 0.4.3

Patch release focused on making HADARA's local evidence-control workflow current, resumable, and measurable without adding public commands.

Highlights:

- Adds `.hadara/state/current.json` as the compact source for release, latest/active task, next intent, current problems, and validation baseline, with managed Project State and Agent Handoff projections.
- Lets a new agent session resume from structured current state and `session start` without reconstructing the entire project from historical prose.
- Replaces loose `nextOperatorIntent` prose with a structured next-work contract so status/session recommendations can distinguish candidate work from operator guidance.
- Extends `docs doctor --json` with an explicit `summary.currentnessVerdict` of `clean`, `warning`, or `drifted`, while preserving compatibility `health` semantics.
- Detects semantic drift between the structured canon, Markdown projections, and Task Board, plus stale onboarding install versions and removed-command references.
- Measures seven product signals across basic, standard, and governed profiles: install-to-capsule, first-correct-file routing, close calls, manual doc edits, stale references, profile dropout, and recommendation acceptance/correction.
- Keeps the primary workflow frozen at four command ids and six post-init calls; all three built-CLI profile toys closed valid under the 15-second budget with zero stale references.
- Fixes fresh-init dogfood regressions found after source readiness: stale first-task recommendations now disappear after any task exists, consumer `context pack` no longer leaks HADARA-dev validation commands, read-first ranges cover full generated `TASK.md` files, and finish-only task status points at `task finalize --execute --auto`.
- Sharpens the product boundary to a local-first evidence control plane for trustworthy agentic development; full controller, provider runtime, cloud queue, and broad write surfaces remain deferred.

Boundaries:

- T-0565 retargets package/version metadata and completes local installed-tarball measurement, artifact/package/clean-checkout smokes, and final read-only release gates.
- T-0566 through T-0569 complete the current-state task-selection/session contract cleanup, structured next-work contract, fresh-init dogfood, and post-dogfood UX regression fixes before stable publication.
- T-0570 prepares stable release notes, readiness docs, helper examples, and GitHub Release notes for `hadara@0.4.3`.
- npm publish, GitHub Release publication, Docker/PyPI publication, token loading, and other deployment mutation are not performed by this source-preparation line.
- The intended npm dist-tag is `latest`; published `hadara@0.4.2` remains the stable line until the operator runs the approval-gated publish helper.
- External validation across three non-HADARA repositories and non-author workers is the v0.4.4 evidence target, not a 0.4.3 completion claim.

## 0.4.2

Stable release for the 0.4.2 command-surface reduction, status performance, init structure, and stable-preflight dogfood line after `0.4.2-rc.0` npm/GitHub prerelease publication, installed-package recycle, installed toy-project dogfood, and source-built stable-preflight rerun.

Highlights:

- Promotes the 0.4.2 command portfolio cleanup from the RC line: retired public commands and stale redirect stubs stay removed, while current lifecycle guidance is concentrated on `task status`, `task finalize`, `validation run`, and evidence list/add-command surfaces.
- Promotes status/read-model performance work, including faster default `status --json`, explicit full/detail modes, and selected-task invocation-local read memoization without persistent cache writes.
- Promotes the init implementation split and current generated-workflow guidance without changing the public init profiles.
- Keeps `task finalize --execute --auto` as the ordinary guarded close path and preserves close-plan blocker detection before partial finish writes.
- Promotes response-only evidence append-lock diagnostics and validation direct-result recovery for restricted agent environments.
- Fixes stable-preflight dogfood findings from the published RC line: consumer `context pack` no longer leaks HADARA-dev source/release readiness warnings, empty projects get first-task guidance, similar handoff text binds to open tasks instead of creating duplicates, EOF `context slice` clamps are not reported as truncation, and validation recovery keeps `--update-task`.
- Adds final profile-aware cleanup from T-0544: `basic` and `standard` projects no longer warn about optional missing `docs/AGENT_HANDOFF.md`, and task-selection required-reading recommendations include only docs that exist in the project profile.

Boundaries:

- T-0545 prepares source metadata, stable release notes, readiness docs, helper examples, release validation evidence, and the operator publish path for `hadara@0.4.2`; it performs no npm publish, GitHub Release publication, Docker image push, PyPI publish, installer execution, or token loading.
- The intended npm dist-tag is `latest`; `hadara@0.4.2-rc.0` remains available on `next` for release-candidate history unless an operator changes dist-tags after stable publication.
- Post-publish installed-package recycle for `hadara@latest` expected `0.4.2` remains a separate follow-up capsule after npm/GitHub publication.
- The full 0.5 state-first RFC remains candidate scope. This release ships only bounded 0.4.x state/projection and command-surface cleanup already validated through the RC and stable-preflight dogfood lines.

## 0.4.2-rc.0

Release candidate preparation line after stable `0.4.1`, focused on command-surface reduction, status/read-model performance, init implementation structure, finalize/evidence UX hardening, and fresh-project dogfood before the next stable decision.

Highlights:

- Removes retired public command surfaces instead of keeping compatibility clutter: duplicate proof/evidence/status commands, old state verification, obsolete task-next/show/upgrade/docs/archive/init aliases, legacy redirect stubs, and command-era dead modules/tests/schemas that no current route consumes.
- Renames the remaining internal next-work projection to task selection so source names no longer imply the removed public `task next` route.
- Makes top-level status profile-aware and faster by default, while keeping explicit `--detail full`, `--summary-json`, and `--state-only --json` paths for broader diagnostics.
- Adds invocation-local read memoization for selected-task full status reports without writing persistent cache files or weakening write/finalize freshness boundaries.
- Splits the large init CLI implementation into clearer init submodules while preserving generated Markdown wording and external behavior.
- Hardens `task finalize --execute --auto` so close-plan blockers are detected before partial finish writes, and updates stale lifecycle fix hints to current `task finalize` / `task status --detail full` guidance.
- Surfaces task-scoped evidence append-lock diagnostics in JSON responses while keeping canonical evidence records and fingerprints stable.
- Fixes session-start docs read-map preview count parity by separating returned preview counts from full registry totals.
- Dogfoods the current development `dist` in a fresh governed `/tmp` project through init, generated docs review, task create, validation/direct-result recovery, `task finalize --execute --auto`, removed-route checks, docs doctor, doctor, schema, and context surfaces.

Boundaries:

- T-0539 prepares source metadata, release notes, readiness docs, package/release validation evidence, and the operator publish path for `hadara@0.4.2-rc.0`; it performs no npm publish, GitHub Release publication, Docker image push, PyPI publish, installer execution, token loading, or installed-package recycle.
- The intended npm dist-tag is `next`; stable `latest` remains `hadara@0.4.1` until a later stable promotion decision.
- Fresh-project dogfood residuals DF-1 through DF-4 from T-0538 are documented as non-blocking for RC readiness: context-pack source/release warnings in consumer projects, status `lastCompleted` freshness, validation wrapper EPERM recovery, and slow mounted Docker tar copy.
- Post-publish installed-package recycle for `hadara@next` expected `0.4.2-rc.0` remains a separate follow-up capsule after npm/GitHub publication.

## 0.4.1

Stable release for the 0.4.1 dogfood hardening line after `0.4.1-rc.0` npm/GitHub prerelease publication, installed-package recycle, helper refactor, and post-recycle adaptive dogfood.

Highlights:

- Promotes the 0.4.1 command-surface cleanup and generated-document fixes from the RC line, including structured redirects for removed lifecycle surfaces and corrected init/help/session guidance.
- Promotes `task finalize --execute --auto` as the ordinary guarded close path while preserving dry-run review, close-source snapshot hashing, blocker refusal, and stale-plan mismatch protection.
- Promotes schema/vocabulary lookup, better controlled-token diagnostics, and docs-registry correction paths so agents can discover accepted values and repair registry metadata without hand-editing.
- Promotes direct-result validation recording for restricted agent environments and package-smoke command-surface drift checks for published packages.
- Promotes the bounded `DEVELOPMENT_SLICES.md` state/projection prototype and refreshed package recycle helper that adapts to the installed command surface.
- Includes installed-package RC recycle and post-refactor adaptive recycle dogfood through T-0513 and T-0515 before stable source preparation.

Boundaries:

- T-0516 prepares source metadata, stable release notes, readiness docs, helper notes, package/release smoke evidence, and the operator publish path for `hadara@0.4.1`; it performs no npm publish, GitHub Release publication, Docker image push, PyPI publish, installer execution, or token loading.
- The intended npm dist-tag is `latest`; `hadara@0.4.1-rc.0` remains available on `next` for release-candidate history unless an operator changes dist-tags after stable publication.
- Removed command redirect stubs remain in place for the compatibility window described by FD-013.
- The 0.5 state-first RFC remains candidate scope. This stable release only ships the bounded slices prototype and supporting diagnostics already validated in the RC line.

## 0.4.1-rc.0

Release candidate preparation line after stable `0.4.0`, focused on dogfood-driven command-surface cleanup, generated-document correctness, and lower-ceremony but still guarded Task Capsule closure.

Highlights:

- Adds schema/vocabulary lookup and better controlled-token diagnostics so agents can discover accepted TASK.md, evidence, and docs-registry values before failing finalize or docs commands.
- Adds guarded docs-registry correction paths and the `docs complete-spec` lifecycle command for completed specs.
- Removes broken or obsolete public command surfaces behind structured redirects or registry cleanup, including the removed low-level task lifecycle commands, obsolete next/show/collect aliases, stale handoff helpers, and old package-smoke aliases.
- Adds `task finalize --execute --auto` as the ordinary low-ceremony close path while preserving dry-run review, close-source snapshot hashing, blocker refusal, and stale-plan mismatch protection.
- Makes `validation run` easier to use in restricted agent environments through direct-result evidence recording after a command was already run directly.
- Adds package-smoke command-surface drift checks so published packages cannot silently contain CLI surfaces that differ from source registry/routing behavior.
- Adds generated-project and toy-project dogfood fixes for init docs, help routing, session-start guidance, validation wrapper behavior, and fresh Task Capsule closure.
- Adds the first bounded state-first prototype for `DEVELOPMENT_SLICES.md`: task-local canonical state stays separate from generated Markdown projection and drift checks.
- Accepts human-friendly TASK.md aliases where dogfood showed avoidable friction: `Acceptance State=Done` and `Inputs / Constraints State=active`.

Boundaries:

- T-0509 prepares source metadata, release notes, readiness docs, package/release smoke evidence, and the operator publish path for `hadara@0.4.1-rc.0`; it performs no npm publish, GitHub Release publication, Docker image push, PyPI publish, installer execution, or token loading.
- The intended npm dist-tag is `next`; stable `latest` remains `hadara@0.4.0` until a later stable promotion decision.
- The `0.4.1-rc.0` line does not adopt the full 0.5 state-first RFC. It keeps the bounded slices prototype and uses its evidence as input for later 0.5 adoption decisions.
- Removed command stubs are retained for at least one minor release where specified, so automation can read `replacementCommand` instead of receiving an unknown-command failure.
- GitHub Release draft creation is optional in the publish helper and remains operator-controlled after npm publish verification.

## 0.4.0

Stable release for the breaking 0.4 productization protocol after `0.4.0-rc.0` publish verification, installed-package dogfood, and pre-stable friction cleanup.

Highlights:

- Promotes the productized 0.4 project scaffold, docs registry/read-map model, four-file Task Capsule, evidence projection, normalized close-source contract, and fail-closed legacy mutation boundaries from the rc line.
- Keeps the context-routing, context cache, session-start, and finalize-first lifecycle baseline from stable `0.3.3` while making the new 0.4 project protocol the stable default.
- Includes the post-rc dogfood hardening line: lean human-readable `TASK.md` v2 scaffolds, top-level JSON `taskId` envelopes, `doctor` install-origin output, monotonic timing fixes, task-id counter hardening, compact `task status --summary-json`, and clearer `validation run` output boundaries.
- Adds stable package-facing documentation and a stable GitHub release note artifact for the approval-gated publish path.

Boundaries:

- T-0489 selected stable publish preparation after reviewing npm rc metadata, the RC GitHub draft, strict release gate output, and required pre-stable capsule audits.
- T-0490 prepares source/readiness for `hadara@0.4.0`; npm publish and stable GitHub Release creation remain explicit operator actions.
- The previous `0.4.0-rc.0` package remains available on `next` for release-candidate evaluation.
- `0.4.0` does not silently migrate or mutate 0.3.x projects.
- Docker image build/push, PyPI publish, installer execution, MCP release/package execution, full agent runtime, scheduler/background runner, provider execution, vector retrieval, dashboard productization, and evidence rebuild execute remain out of scope.
- Stable installed-package recycle remains the next post-publish capsule after npm `latest=0.4.0` is verified.

## 0.4.0-rc.0

Release candidate line for the breaking 0.4 productization protocol after stable `0.3.3`, the published `0.3.4-rc.0` agent UX hardening line, and the completed 0.4 implementation budget. `hadara@0.4.0-rc.0` is published on npm with the `next` dist-tag; `latest` remains `0.3.3`.

Highlights:

- Introduces the productized 0.4 project scaffold: compact `AGENTS.md`, routing-only `.hadara/context/HADARA_CONTEXT.md`, workflow-owned `docs/HADARA_WORKFLOW.md`, `.hadara/scaffold.json`, `.hadara/slot-registry.json`, docs registry seed files, and profile-aware 0.4 doctor checks.
- Makes the default Task Capsule a four-file model: `TASK.md`, `HANDOFF.md`, `EVIDENCE.md`, and canonical append-only `evidence.jsonl`; removed legacy sidecar defaults are not generated for new 0.4 capsules.
- Validates the 0.4 `TASK.md` table schema and controlled values, including TaskStatus, Source Documents, Plan, Acceptance, Validation, Change Summary, Risks/Follow-ups, and close-proof leakage checks.
- Adds Source Document hash/drift validation so concrete source paths cannot reach Done with stale or placeholder hashes.
- Adds registry-backed docs registration, docs read maps, docs inbox diagnostics, and read-map integration for `session start` and `context pack`, so agents can read active task/spec context without broad raw spec scans.
- Adds managed slot v2 registry handling and evidence projection behavior so `EVIDENCE.md` remains a generated projection over `evidence.jsonl` without becoming the canonical evidence source.
- Adds a normalized 0.4 close-source contract and close proof placement rules: close proof stays out of `TASK.md`/`HANDOFF.md`, task-local `HANDOFF.md` is continuation guidance, and close-source hashing avoids raw evidence and whole Task Board churn.
- Fails closed on legacy or unsupported projects for 0.4 mutation surfaces, including task mutations, init/register-doc mutation paths, docs register/patch execute, evidence append/migration execute, and release artifact/publish execute.
- Aligns command registry, structured help, lifecycle docs, and schemas with current 0.4 surfaces while explicitly marking proposed-but-unimplemented 0.4 docs governance commands as planned/disabled.
- Removes HADARA-dev-specific defaults from generated product docs; static checks reject generated Node/npm/Docker/release/repository history leakage while preserving generic release safety wording.
- Dogfoods the new product path through disposable basic and governed projects, including init/doctor, docs read-map, context pack/session start, task create, validation/evidence projection, finalize, close-source repair, and final audit-close.
- Improves the agent execution loop after dogfood: `validation run` records evidence without default `TASK.md` row mutation, same-check validation retries auto-resolve earlier failed/blocked attempts, task status projects latest validation attempt state, and evidence help is non-mutating.
- Improves long-running agent UX: validation launch failures expose structured error metadata, task status/finalize report duration diagnostics, finalize execute prints stage progress, staged finalize plans expose deferred checks and partial execution risk, lifecycle next actions are deduped, default task status is fast, and finalize owns close-proof repair.
- Completes final release-line preflight hardening: dashboard aggregate routes avoid broad scans where task-scoped data is available, current user-facing surfaces no longer expose legacy sidecar defaults, and task-scoped CI gate lookup uses exact task lookup.

Boundaries:

- T-0477 prepared source/readiness for `hadara@0.4.0-rc.0`; the operator then completed the approval-gated npm publish, and `npm view` verified `version=0.4.0-rc.0`, `next=0.4.0-rc.0`, and `latest=0.3.3`.
- T-0488 created and verified a GitHub draft prerelease for `v0.4.0-rc.0` after the npm publish. Docker image build/push, PyPI publish, installer execution, and MCP release/package execution remain out of scope.
- The stable npm package remains `hadara@0.3.3` on the `latest` dist-tag; use `hadara@next` or `hadara@0.4.0-rc.0` for explicit RC evaluation.
- `0.4.0-rc.0` is a breaking project protocol line. It does not silently migrate or mutate 0.3.x projects; use the 0.3.x package line for old projects or initialize a new 0.4 project.
- The 0.4 release does not add a full agent runtime, scheduler, background runner, provider execution, vector retrieval, dashboard productization, MCP write expansion by default, evidence rebuild preview/execute, or non-npm publish target execution.
- Post-publish installed-package recycle, stable 0.4.0 decision, stable readiness, stable publish preparation, and stable recycle remain separate capsules.

## 0.3.4-rc.0

Release candidate preparation line for agent UX hardening after stable `0.3.3`.

Highlights:

- Keeps the 0.3.3 context graph, context pack, context slice, context cache warm, session start, and finalize-first lifecycle surfaces as the baseline agent workflow.
- Improves the commands used most during HADARA development: `session start`, `context pack`, `task finalize`, `evidence summary`, `handoff stale-problems`, `release closeout`, and `package recycle`.
- Adds explicit action hints and argument arrays where agents previously had to infer the next command from prose.
- Hardens stale handoff and release closeout diagnostics so post-publish and post-close work can be verified without editing proof-source docs after close.
- Improves context pack recommendation quality with concrete ranking reasons, task-local/source bonuses, and `agentActions` guidance.
- Updates generated init guidance so new projects start from the context-aware finalize-first lifecycle loop rather than older low-level command sequences.

Boundaries:

- T-0417 prepares source/readiness only for `hadara@0.3.4-rc.0`; it performs no npm publish, GitHub Release creation, Docker image build/push, PyPI publish, registry mutation, installer execution, MCP release/package execution, or token loading.
- The stable npm package remains `hadara@0.3.3` until a later approval-gated publish capsule completes.
- GitHub Release creation, Docker image publish, PyPI publish, installer execution, and MCP release/package execution remain out of scope unless a future capsule explicitly approves them.
- Full agent runtime, scheduler/background runner, dashboard productization, vector DB, local LLM embedding, and provider/plugin write-surface expansion remain deferred.

## 0.3.3

Stable release for context routing, speed-first context cache paths, bounded session-start context, and the finalize-first agent lifecycle after `0.3.3-rc.0` publish verification and PatternForge dogfood hardening.

Highlights:

- Promotes the `0.3.3-rc.0` context-routing and lifecycle behavior to the stable line.
- Adds 0.3.3 context routing surfaces: `hadara context graph`, `hadara context pack`, `hadara context slice`, `hadara context cache status`, `hadara context cache warm`, and `hadara session start`.
- Builds project context graph/state projection over tasks, docs registry, command registry, evidence, managed sections, decisions, handoff known problems, and release readiness sources.
- Adds code link/index extraction for imports, exports, symbols, command/test file hints, and optional code-aware graph reads.
- Adds deterministic context pack and raw context slice support with path denylist/allowlist hardening, byte-budget enforcement, bounded ranges/windows, and source-addressed output.
- Adds explicit context cache warm paths for source manifests, graph-core shards, code-index shards, incremental per-file code-index reuse, and read-only warm cache consumption.
- Adds bounded `session start` guidance with degraded fast default behavior and explicit `--live` opt-in for broader graph/context-pack work.
- Adds lifecycle convenience surfaces: `task lifecycle`, `task close-repair-plan`, read-only `task finalize`, and guarded `task finalize --execute --plan-hash`.
- Makes the 0.3.3 finalize-first path the default agent-facing lifecycle while preserving low-level `task finish`, `task ready`, `task close`, and `task audit-close` as proof-boundary commands for debugging and recovery.
- Incorporates PatternForge dogfood findings hardening before stable: cached Task Board node classification no longer depends only on graph-node `kind`, and warning-only handoff drift no longer becomes a required next action once a task is closed-valid.

Boundaries:

- T-0406 published stable `hadara@0.3.3` to npm with `latest`; T-0407 verified the published package from installed consumer paths.
- GitHub Release creation, Docker image publish, PyPI publish, installer execution, and MCP release/package execution remain out of scope unless a future capsule explicitly approves them.
- Context cache writes remain explicit warm actions under `.hadara/local/cache/context`; ordinary read commands do not update cache.
- Mounted-filesystem broad graph/cache/pack latency remains an explicit-command residual; default Session Start stays bounded/cache-preferential.
- Real provider integration, dashboard productization, full agent-controller work, evidence rebuild preview/execute, and non-npm release targets remain deferred candidate scope.

## 0.3.3-rc.0

Release candidate preparation line for context routing, speed-first context cache paths, bounded session-start context, and the finalize-first agent lifecycle after stable `0.3.2`.

Highlights:

- Adds 0.3.3 context routing surfaces: `hadara context graph`, `hadara context pack`, `hadara context slice`, `hadara context cache status`, `hadara context cache warm`, and `hadara session start`.
- Builds project context graph/state projection over tasks, docs registry, command registry, evidence, managed sections, decisions, handoff known problems, and release readiness sources.
- Adds code link/index extraction for imports, exports, symbols, command/test file hints, and optional code-aware graph reads.
- Adds deterministic context pack and raw context slice support with path denylist/allowlist hardening, byte-budget enforcement, bounded ranges/windows, and source-addressed output.
- Adds explicit context cache warm paths for source manifests, graph-core shards, code-index shards, incremental per-file code-index reuse, and read-only warm cache consumption.
- Adds bounded `session start` guidance with degraded fast default behavior and explicit `--live` opt-in for broader graph/context-pack work.
- Adds context-routing performance fixtures for mounted/ext4 observations, advisory thresholds, and fast E2E smoke profiles.
- Adds lifecycle convenience surfaces: `task lifecycle`, `task close-repair-plan`, read-only `task finalize`, and guarded `task finalize --execute --plan-hash`.
- Makes the 0.3.3 finalize-first path the default agent-facing lifecycle while preserving low-level `task finish`, `task ready`, `task close`, and `task audit-close` as proof-boundary commands for debugging and recovery.

Boundaries:

- T-0401 prepared source/readiness only. T-0402 then published `hadara@0.3.3-rc.0` to npm with the `next` dist-tag, verified registry visibility, verified `latest` remains `0.3.2`, and passed a temporary-prefix installed-bin smoke.
- GitHub Release creation, Docker image publish, PyPI publish, installer execution, and MCP release/package execution remain out of scope unless a future capsule explicitly approves them.
- Context cache writes remain explicit warm actions under `.hadara/local/cache/context`; ordinary read commands do not update cache.
- Mounted-filesystem broad graph/cache/pack latency remains an explicit-command residual; default Session Start stays bounded/cache-preferential.
- Real provider integration, dashboard productization, full agent-controller work, evidence rebuild preview/execute, and non-npm release targets remain deferred candidate scope.

## 0.3.2

Stable release for the Evidence v2 refactor line after `0.3.2-rc.0` publish verification, installed-package recycle, and T-0339 dogfooding found no release-blocking issue.

Highlights:

- Promotes the `0.3.2-rc.0` Evidence v2 behavior to the stable line.
- Adds explicit Evidence v2 command metadata to `evidence add-command`: `--category`, `--outcome`, `--resolves`, `--supersedes`, and optional `--idempotency-key`.
- Rejects incompatible explicit `--result`/`--outcome` combinations at both CLI and core writer append boundaries with `EVIDENCE_RESULT_OUTCOME_MISMATCH`.
- Makes `evidence list` the supported durable evidence id discovery surface: text output includes copyable ids and category/outcome, while JSON records expose id stability and persisted schema metadata.
- Documents exact marker workflow for durable persisted `ev:` ids and cautions that legacy compatibility ids are inspection-only.
- Documents the evidence rebuild boundary: canonical append-only `evidence.jsonl`, non-canonical `EVIDENCE.md`, no 0.3.2 rebuild preview/execute, and future drift-class plus before-hash requirements.

Boundaries:

- T-0340 published stable `hadara@0.3.2` to npm with `latest`; `next` remains on `0.3.2-rc.0`.
- Rebuild preview/execute, `check-id`, `subject`, and a new add-command report schema id remain deferred candidate scope.
- Broad historical migration, shell execution through evidence commands, and non-npm release mutations remain outside this release.

## 0.3.2-rc.0

Release candidate preparation line for Evidence v2 writer stabilization, id discovery, and docs consolidation after `0.3.1-rc.1` post-publish recycle.

Highlights:

- Adds explicit Evidence v2 command metadata to `evidence add-command`: `--category`, `--outcome`, `--resolves`, `--supersedes`, and optional `--idempotency-key`.
- Rejects incompatible explicit `--result`/`--outcome` combinations at both CLI and core writer append boundaries with `EVIDENCE_RESULT_OUTCOME_MISMATCH`.
- Makes `evidence list` the supported durable evidence id discovery surface: text output includes copyable ids and category/outcome, while JSON records expose id stability and persisted schema metadata.
- Documents exact marker workflow for durable persisted `ev:` ids and cautions that legacy compatibility ids are inspection-only.
- Documents the evidence rebuild boundary: canonical append-only `evidence.jsonl`, non-canonical `EVIDENCE.md`, no 0.3.2 rebuild preview/execute, and future drift-class plus before-hash requirements.

Boundaries:

- Rebuild preview/execute, `check-id`, `subject`, and a new add-command report schema id remain deferred candidate scope.
- Broad historical migration, shell execution through evidence commands, and release/publish mutation remain outside this docs consolidation line.

## 0.3.1-rc.1

Release candidate for the Phase 8 State Governance line after stable `0.3.0` publish/recycle and the T-0325 CloseState derived-state cleanup.

Highlights:

- Defines persistent `TaskStatus`, derived `CloseState`, document registry `DocStatus`, and evidence outcome token families in root and generated workflow docs.
- Removes persistent `CloseState` from task-local close-source handoff current-state tables and keeps close proof state derived through status, audit, proof, and state read models.
- Adds done-level validation for stale pending-close wording, persisted handoff `CloseState`, and `PLAN.md` rows left `In Progress`.
- Resolves installed-package recycle findings by documenting temp-prefix installed-bin proof as canonical when PATH, global installs, `npx`, or DNS/cache behavior is ambiguous.
- Adds read-only state consistency projection and `hadara state verify --json`, with advisory protocol doctor/status/CI integration.
- Hardens task discovery so task-like leftover directories without `TASK.md` are ignored rather than projected as real capsules.
- Expands npm publishable metadata checks from the previous `0.x.0[-rc.N]` release pattern to patch-line versions such as `0.3.1-rc.1`.

Boundaries:

- T-0326 prepared `hadara@0.3.1-rc.1` source metadata, release docs, and release readiness evidence without publish mutation.
- T-0327 published `hadara@0.3.1-rc.1` through the approval-gated helper and corrected npm dist-tags so stable `0.3.0` remains `latest` while rc1 is available as `next`.
- T-0328 verified the published package through installed-package recycle, including registry/dist-tags, exact npx, temp-prefix installed bin, command registry, broad CLI command-family, release dry-run, MCP, TUI, run scaffold, lifecycle, and cleanup surfaces.
- GitHub Release creation remains optional; Docker image publishing, PyPI publishing, installer execution, MCP release/package execution, and token loading remain deferred unless a future capsule explicitly enables them.

## 0.3.0

Stable release for the Phase 7 Surface Refactor after `0.3.0-rc.2` post-publish recycle, HADARA-dev docs registry artifact dogfooding, and docs patch atomic write hardening.

Highlights:

- Adds structured command help and a machine-readable command registry so agents can distinguish primary lifecycle commands from diagnostics, advanced, release-only, UI, integration, and compatibility surfaces.
- Adds canonical lifecycle guidance and command portfolio audit rules for confusable command boundaries.
- Adds document registry, docs doctor, Required Reading tiers, and HADARA-dev registry artifact dogfooding.
- Adds managed Markdown section discovery and hash-guarded patch plans.
- Hardens `docs patch --execute` through the shared atomic text write helper with target-preservation failure coverage.
- Adds dry-run-first docs cleanup status marking and archive planning without moving or deleting historical files by default.
- Preserves release, publish, Docker, PyPI, MCP write, and shell execution boundaries.

Boundaries:

- T-0315 prepared stable `hadara@0.3.0` source metadata, release docs, and release readiness evidence.
- T-0316 published stable `hadara@0.3.0` to npm through the approval-gated helper, verified `npm view` returned `0.3.0`, and did not request a GitHub Release draft.
- This release is not a full agent runtime, Rack/enterprise release, broad document rewrite engine, automatic historical deletion release, or release automation expansion.
- Publish mutation, GitHub Release creation, Docker image publishing, and PyPI publication remain explicit operator-approved actions.

## 0.3.0-rc.2

Release candidate published after the `0.3.0-rc.1` installed-package recycle found workflow UX issues in fresh init, task completion, Required Reading, and migration safety.

Highlights:

- Adds `.hadara/context/HADARA_CONTEXT.md` as a generated and migration-managed project context anchor so fresh projects and migrated projects have a compact current-state entry point.
- Clarifies documentation timing and write coordination in root and generated workflow docs: keep capsule docs current during implementation, parallelize read-only discovery/validation, and serialize evidence, shared-doc, before-hash, finish/close, and release writes.
- Preserves human-authored Task Board `Notes` and extra cells when `task finish --execute` updates command-owned task row fields.
- Adds actionable remediation hints to harness, ready, and close blockers while preserving existing issue codes.
- Documents semantic Required Reading tiers and exposes additive `tier` metadata from `docs required-reading --json`.
- Hardens `protocol migrate --execute` so project-scoped multi-file migration writes are preflighted, prepared, committed, and rolled back on failure.
- Writes `docs mark --execute` registry updates through temp-file/rename atomic writes.
- Adds project-root containment validation to the shared atomic text write helper so future callers cannot escape through parent traversal or absolute outside paths.

Boundaries:

- T-0310 prepared `hadara@0.3.0-rc.2` source metadata, release docs, and release readiness evidence; the operator then ran the approval-gated helper, published to npm, and verified `npm view` returned `0.3.0-rc.2`.
- T-0311 added atomic helper path-containment hardening before publish/recycle.
- Post-publish installed-package recycle is deferred to T-0312 after `hadara@0.3.0-rc.2` is visible on npm.
- GitHub Release creation remains optional; Docker image publishing, PyPI publishing, installer execution, and MCP release/package execution remain deferred.

## 0.3.0-rc.1

Release candidate published after the 0.3.0-rc.0 publish exposed two adoption problems: existing projects need a safe path onto the new 0.3 protocol surface, and npm package discovery metadata must be present in the published tarball before the next registry mutation.

Highlights:

- Adds `hadara protocol migrate` as a dry-run-first upgrade path for existing HADARA projects that were initialized before the 0.3 surface refactor.
- Reports protocol version state and planned changes before mutation so operators can see whether a project is already current or still on an older scaffold.
- Supports selected project/task scoped migration for docs registry insertion, managed section markers, command surface documentation refresh, and Required Reading cleanup.
- Uses before-hash guarded execute plans so migration writes are rejected when a target file changed after the dry-run plan.
- Preserves task evidence during task-scoped migration: existing `evidence.jsonl` files are never overwritten, and a missing task evidence log is created only when needed.
- Keeps task status history rows inside the managed status table when finishing capsules, preventing malformed Markdown from release and migration workflows.
- Hardens npm publish metadata by validating the staged tarball `package/package.json` for description, keywords, repository, homepage, and bugs fields before publish.
- Tightens the manual rc publish helper so the release capsule must match the package version and a successful dry-run can be followed by `--execute` in the same clean `/tmp` clone.

Boundaries:

- npm publish was completed as an operator-confirmed release mutation through the T-0301 helper; `npm view` verified `hadara@0.3.0-rc.1`.
- Protocol migration is scoped and hash-guarded; it is not a broad historical rewrite engine and does not delete archived or superseded documents.
- GitHub Release creation remains optional and was not requested during the npm publish helper run; Docker image publishing, PyPI publishing, and installer mutation remain deferred.

## 0.3.0-rc.0

Source candidate prepared during Phase 7.6 after the Phase 7 surface-refactor slices completed. This entry describes implemented behavior only; npm publish remains approval-gated and is not performed by the source-candidate documentation update.

Highlights:

- Adds structured command help and a machine-readable command registry so agents can distinguish primary lifecycle commands from diagnostics, advanced, release-only, UI, integration, and compatibility surfaces.
- Adds canonical capsule lifecycle guidance and command portfolio audit documentation for non-overlap rules and confusable command boundaries.
- Adds a document registry and docs doctor for canonical/active/reference/historical/superseded document classification, required-reading drift, canonical conflicts, and cleanup diagnostics.
- Adds managed Markdown section discovery and hash-guarded managed patch plans for command-owned sections while keeping user-authored prose outside automated writes.
- Adds docs cleanup status marking, required-reading pruning, and dry-run archive planning without deleting or moving historical files by default.
- Runs Phase 7.6 installed-package recycle and fresh-init validation before any external 0.3.0 publish can be considered.

Boundaries:

- 0.3.0 is not a full agent runtime, Rack/enterprise release, Dashboard/TUI redesign, broad document rewrite engine, automatic historical deletion release, or release automation expansion.
- `docs archive` remains dry-run planning only; cleanup status changes are registry metadata unless a separate managed patch is applied.
- Publish mutation, GitHub Release creation, Docker image publishing, and PyPI publication remain explicit operator-approved actions.

## 0.2.0-rc.3

Release candidate published to npm after the `0.2.0-rc.2` dogfooding findings around proof reliability, evidence append races, and CI gate visibility, followed by the T-0289 post-hardening readiness refresh.

Highlights:

- Hardens evidence append writes with task-scoped locking and explicit idempotency keys so parallel evidence writes do not create duplicate failed records for the same logical command.
- Adds `hadara proof status` and `hadara proof explain` for evidence sufficiency, close-audit freshness, and operator-readable proof diagnostics.
- Adds `hadara ci gate --mode advisory|strict` as an aggregating local gate over protocol, evidence, proof, and deferred release checks.
- Refreshes package metadata, README release status, and release-readiness docs for the rc3 source candidate.
- Publishes `hadara@0.2.0-rc.3` to npm through the approval-gated manual helper and verifies `npm view` returned `0.2.0-rc.3`.

Boundaries:

- npm publish was completed as an operator-confirmed release mutation after T-0289 re-proved package smoke, clean-checkout, release gate, release dry-run, publish dry-run, and full Docker-suite readiness.
- GitHub Release creation remains optional and was not requested during the npm publish helper run; Docker image publishing, installer execution, PyPI publishing, and MCP release/package execution remain deferred unless a future capsule explicitly enables them.

## 0.2.0-rc.2

Release candidate published to npm after the init scaffold lifecycle/protocol guidance hardening from T-0279 through T-0281 and the T-0282 publish-readiness refresh.

Highlights:

- Updates generated `hadara init` docs so new projects get current task workflow guidance, evidence integrity rules, project-specific document registration guidance, and direct `harness validate --level done` diagnostics.
- Adds common multi-language local artifact hygiene to generated `.gitignore`, including Python virtualenv/cache/SQLite patterns needed by FastAPI/pytest-style dogfooding projects.
- Clarifies close-source stability before `task close` so agents avoid repeated close/audit churn from post-close documentation edits.
- Refreshes npm package metadata, README install examples, release readiness docs, and manual publish helper examples for `hadara@0.2.0-rc.2`.
- Publishes `hadara@0.2.0-rc.2` to npm through the approval-gated manual helper and verifies `npm view` returned `0.2.0-rc.2`.

Boundaries:

- npm publish was completed as an operator-confirmed release mutation after the helper regenerated release artifact, package smoke, and clean-checkout smoke evidence.
- The Python bridge remains the separately published preview package `hadara==0.2.0rc1` and is not changed by this npm RC.
- GitHub Release creation remains optional and was not requested during the npm publish helper run; Docker image publishing, installer execution, PyPI publishing, and MCP release/package execution remain deferred unless a future capsule explicitly enables them.

## 0.2.0-rc.1

Release candidate published to npm after the npm-installed recycle fixes from T-0272 through T-0274 and publish-readiness refresh in T-0275.

Highlights:

- Fixes generated deterministic `run scaffold` scripts so fake-shell JSON observations match successfully.
- Hardens fresh initialized project UX for `init --json`, init doctor, status/TUI phase parsing, handoff update JSON, generic handoff suggestions, and context artifact paths.
- Improves lifecycle status clarity and mounted-workspace performance for single-task finish/read/evidence commands.
- Adds redacted failed-step diagnostics to `dev docker-check` reports while continuing to omit raw subprocess logs.
- Refreshes package metadata, README install examples, package smoke, clean-checkout smoke, release artifact, release dry-run, and publish dry-run evidence for the rc.1 source state.
- Publishes `hadara@0.2.0-rc.1` to npm through the approval-gated manual helper and verifies `npm view hadara@0.2.0-rc.1 version` returns `0.2.0-rc.1`.

Boundaries:

- npm publish was completed as an operator-confirmed release mutation after the readiness capsule was closed.
- GitHub Release creation remains optional and was not requested during the npm publish helper run.
- Docker image publishing, PyPI publishing, installer execution, and MCP release/package execution remain deferred.

## 0.2.0-rc.0

Release-candidate freeze target for Phase 6 and Phase 6.1 work. T-0269 prepared the approval-gated npm publish path, but this candidate was superseded by `0.2.0-rc.1` in T-0275 before any publish mutation.

Highlights:

- Adds workflow compression primitives for task completion, finish/ready/close, handoff suggestions, and operator-facing command reports.
- Adds multi-agent-compatible metadata foundations, including actor context fields, mutation vocabulary separation, sync-dist before-hash guarding, close evidence race recheck, and task create collision guarding.
- Refreshes package, clean-checkout, release-artifact, release dry-run, and publish dry-run evidence for the current source checkout.
- Updates README install and npx examples for the `0.2.0-rc.0` publish candidate.

Boundaries:

- This RC target does not claim full multi-agent runtime safety, lock-safe shared execution across all commands, or a complete multi-agent controller.
- Publish execution, registry mutation, GitHub Release creation, Docker image build/push, PyPI publish/token loading, and release mutation remain out of scope.
- Actual npm publish for this rc.0 candidate should not proceed; use the superseding `0.2.0-rc.1` T-0275 helper path instead.

## 0.1.0-rc.0

First npm release candidate for early CLI evaluation.
