# DECISIONS

## D-0001: TypeScript + Node.js for bootstrap

Reason:
- Cross-platform CLI and dashboard sharing.
- Easy packaging with portable Node runtime.
- Strong ecosystem for provider SDKs and test runners.

## D-0002: Harness-first development

Reason:
- LLM output is non-deterministic.
- Agent loop must be tested with MockProvider and ScriptedProvider before real model integration.

## D-0003: Separate portable store and project store

Reason:
- USB/portable state should not pollute project history.
- Project handoff state must be committed so external agents can continue.

## D-0004: Public evidence artifact baseline policy

Reason:
- Public Task Capsule artifacts are committed project state, so they must not copy secret-like content.
- Binary evidence needs a dedicated sanitized/private workflow; until then, public artifacts are limited to UTF-8 text.

## D-0005: MCP evidence attach operational gates

Reason:
- `hadara.evidence.attach` is the first narrow write-capable MCP tool and remains disabled by default.
- When enabled, each write requires per-call approval metadata and records success or failure in the private portable audit log.
- MCP initialize metadata must reflect whether the current server process is default read-only or evidence attach-enabled.

## D-0006: Dashboard visual baseline uses comfort dark mockup

Reason:
- The comfort dark mockup is the strongest current expression of HADARA dashboard layout, visual hierarchy, palette, card grouping, and navigation feel.
- The mockup is a visual shell baseline only; it does not define data schema, live integration, write behavior, MCP behavior, or state persistence.
- The authoritative dashboard data contract remains `hadara.ops.status.v1`.

## D-0007: Separate v1.0 planning from capsule implementation details

Reason:
- `docs/specs/HADARA_Core_v1.0_Technical_Development_Plan.md` is the broad technical plan and may include target designs that are ahead of implementation.
- Future Task Capsules need smaller, concrete references so schema details, file candidates, and acceptance notes are not lost.
- `docs/V1_0_CAPSULE_BACKLOG.md` tracks candidate slices and ordering.
- `docs/V1_0_IMPLEMENTATION_SCHEMAS.md` tracks detailed schemas, file candidates, and implementation notes.
- Existing contract docs remain authoritative for implemented stable surfaces; v1.0 reference docs describe planned or partial surfaces until promoted.

## D-0008: Generic init preserves HADARA structure, not HADARA-dev assumptions

Reason:
- `hadara init` should generate profile-aware HADARA protocol structure for new projects, not copy HADARA-dev's current optional integration roadmap.
- Generated docs use stable headings and table frames where records will grow over time so future agents can update them deterministically.
- `basic`, `standard`, and `governed` profiles must not reference docs they do not generate.
- Optional surfaces such as Hermes, MCP, dashboard, provider, release, installer, and deployment work require project-specific registration before agents rely on them.
- Generated `.gitignore` must ignore HADARA local/private state without hiding project-owned top-level paths such as `data/`.
- T-0149 locked this decision with init template changes, README entry-surface cleanup, focused init tests, built CLI profile smokes, full Docker validation, and done-level harness validation.

## D-0009: Init follow-up writes are explicit, dry-run-first maintenance surfaces

Reason:
- Projects need safe ways to inspect older scaffolds, upgrade profile docs, register local Required Reading, and enable optional integrations without re-running `hadara init` as a destructive migration.
- `hadara init doctor --json` is read-only and reports scaffold drift with stable issue codes.
- `hadara init upgrade`, `hadara init register-doc`, and `hadara init enable-integration` dry-run by default and require `--execute` for writes.
- Profile upgrades create only missing generated files; they do not overwrite user-edited docs.
- Profile upgrades create missing scaffold docs and merge known generated profile metadata in `PROJECT_STATE`, `IMPLEMENTATION_SOP`, `AGENTS`, and `ARCHITECTURE` when those files still have recognizable scaffold structure; they do not perform arbitrary user-content diff/merge.
- `hadara init register-doc --require-exists` is the strict mode for missing referenced docs; default registration keeps missing docs warning-only so planned specs can be registered deliberately.
- `hadara init enable-integration` registers guidance docs and SOP rows only; it does not enable Hermes/MCP runtime behavior or change capability gates. Multi-file integration writes use temp-file/rename commit with rollback and `INIT_ATOMIC_WRITE_FAILED` on failure.
- Runtime local/private stores should be created by the commands that need them, not eagerly by generic project initialization.
- T-0150 locked the initial decision with focused init tests, full Docker validation, built CLI follow-up smokes, and done-level harness validation. T-0151 hardened wording, validation, strict mode, and partial-write behavior after review.

## D-0010: Protocol consistency is a living-project layer, not an init extension

Reason:
- Phase 1 made initial `hadara init` scaffolds generic, profile-aware, and table-framed.
- Long-running HADARA projects drift after initialization: Task Board status can diverge from `TASK.md`, evidence Markdown can diverge from `evidence.jsonl`, handoff can point at stale work, and profile metadata can lag behind upgraded doc sets.
- Living-project consistency should use `hadara protocol ...` read-first surfaces rather than overloading `hadara init doctor`, so users understand the protocol applies throughout the project lifecycle.
- New Task Capsules should move to table-first v2 frames, while existing capsules remain valid until an explicit non-destructive upgrade/remediation command inserts missing frames.
- Any remediation must be dry-run by default, `--execute` gated, low-risk, bounded to exact table/row/file operations, and must not delete user-authored content.

## D-0011: Dashboard UI/UX reset (Phase 5.6) builds a Preact single-asset bundle on the Phase 5.5 read models

Reason:
- Phase 5.5 (`T-0197`–`T-0206`) made the dashboard fast, cached, observable, and governed, but optimized backend latency/provenance rather than perceived product quality; the served surface still read as a read-model inspector. See `docs/specs/dashboard/HADARA_Dashboard_Phase5_6_UIUX_Reset_Proposal.md`.
- Phase 5.6 is a visual/interaction layer only: it consumes the existing `hadara.dashboard.bootstrap.v1` and `hadara.dashboard.task_detail.v1` aggregates and adds no backend authority and no mutation.
- Decision (T-0208 spike): chose Option B — author the console in Preact + a CSS token system and build to a single self-contained static asset, over Option A (hand-refactored vanilla). Rationale: the "commercial-grade" bar needs a real component/token system; a single inlined bundle preserves the existing CSP (self-only, no CDN), the `dashboard serve` static route, and the read-only model.
- Build runs out of the workspace `node_modules` because NTFS-mounted workspaces cannot host an npm install (EPERM); `dashboard/build.mjs` resolves esbuild/preact via `DASH_DEPS`, and `scripts/dashboard-build.sh` runs it in `node:22-bookworm`. Output is the generated `docs/design/dashboard/index.html`.
- Boundaries carried forward and verified: read-only, copy-only commands, no localStorage/sessionStorage/indexedDB/cookies, no WebSocket/EventSource/interval-timer streaming, private-only remains an auditability warning, project root stays redacted/fingerprinted. A stalled read now degrades via an AbortController timeout instead of freezing the console.
- Validation: full Docker `npm ci && npm run build && vitest` passed (84 files / 562 tests) with the rewritten `dashboard-static.test.ts`; `scripts/dashboard-visual-check.sh` (Playwright + axe-core) passed home/detail/empty/degraded with no critical/serious a11y violations.
- Not yet locked: this is uncommitted reviewer work; capsules `T-0207`–`T-0214` are not closed and may be revised or rolled back after review.
- 2026-06-02 fix pass (post hands-on UX review, `docs/specs/dashboard/HADARA_Dashboard_Phase5_6_UX_Diagnosis.md`): sidebar tabs now render distinct per-view content (no dead tabs); the data layer separates **live** reads (`loadLiveRuntime`: bootstrap→status) from **non-live fallback** (`loadFallbackRuntime`: fixture→inline) so a refresh that loses live retains the last good live view and raises the degraded banner instead of silently showing stale sample data; loading is optimized (per-source timeout 6s→2.5s, instant inline preview at 350 ms, `syncing` indicator); proof gains an evidence drill link; offline empty states are labelled "Unavailable offline"; mobile uses a compact horizontal nav strip. Re-validated: Docker 84 files / 562 tests, dashboard visual+a11y gate all pass.

## D-0012: 0.3.0 surface refactor uses Phase 7.x internal implementation labels

Reason:
- The project already has Phase 6 and Phase 6.1 planning/history, so reusing rc4-rc9 as internal implementation phase labels would confuse implementation sequencing with external npm prerelease labels.
- Phase 7.x labels are internal Task Capsule implementation phases only; they do not authorize per-phase external publishing.
- The next external 0.3.0 release may be prepared only after all required Phase 7.x slices pass Phase 7.6 release hardening and installed-package recycle.
- Evidence: `docs/specs/0.3.0/00_HADARA_0_3_0_Phase_7_Surface_Refactor_Program.md` and T-0290.

## D-0013: Work Item A/F form the 0.3.1 Phase 8 state governance line

Reason:
- Stable `hadara@0.3.0` publish and consumer recycle are complete, so follow-up status/document consistency work should not extend the 0.3.0 release-hardening line.
- Work Item A and Work Item F both address state coherence: canonical status tokens, document ownership/write boundaries, handoff close-state clarity, installed-package findings cleanup, state consistency projection, and advisory verification.
- The implementation order should lock vocabulary and write ownership before introducing projection or gate surfaces; otherwise projections will encode the same ambiguous status strings they are meant to detect.
- Evidence: `docs/specs/0.3.1/00_HADARA_0_3_1_Phase_8_State_Governance_Program.md`, `docs/specs/0.3.1/rc1/00_HADARA_0_3_1_rc1_Status_Governance_Implementation_Plan.md`, and T-0318.
