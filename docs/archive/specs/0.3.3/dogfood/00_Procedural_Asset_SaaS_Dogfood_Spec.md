# 0.3.3 Procedural Asset SaaS Dogfood Spec

## Purpose

This spec defines a HADARA dogfooding project for the 0.3.3 context-routing and finalize-first lifecycle release line.

The dogfood project builds a production-oriented SaaS that turns selected image regions into editable procedural material assets. The first concrete scenario is a grass/meadow source image where the user extracts a grass-like pattern model, not a pasted crop, and then changes parameters such as density, blade length, color variance, wind direction, lighting adaptation, and tile size before exporting the result for another web page.

The project has two goals:

1. Prove whether `hadara@0.3.3-rc.0` generated docs, context commands, evidence flow, and finalize lifecycle are usable in a real product build.
2. Build a credible Docker Compose runnable SaaS MVP whose architecture can grow into production without rewriting the core asset model.

## Product Thesis

Copying a region from an image usually preserves the wrong lighting, shadow, perspective, resolution, and boundary artifacts. For natural materials such as grass, sand, stone, fabric, bark, or moss, the useful asset is often not the pixels themselves but the generative pattern implied by those pixels.

The product should extract an editable material preset from an image region:

| Input | Output |
|---|---|
| Source image plus user-selected/masked region | Procedural material preset with extracted palette, orientation, frequency, density, structure, and noise parameters |
| Optional crop/brush correction | Improved segmentation/mask and confidence report |
| Parameter edits | New rendered variants that preserve the extracted material identity while adapting scale, lightness, contrast, density, tiling, and output size |
| Export request | PNG/WebP texture, JSON preset, CSS snippet, and optional SVG/canvas renderer metadata |

## Feasibility

The dogfood project is feasible if the first release is scoped to user-assisted texture-like materials.

Feasible in the first dogfood line:

- Image upload and project/asset management.
- Region crop, mask, and brush correction.
- Deterministic material analysis using local CPU image processing.
- Grass-like procedural preset v1 from a user-selected region.
- Parameterized renderer with tile preview and export.
- Docker Compose one-command local run.
- Strong HADARA lifecycle and context-routing dogfooding evidence.

Not feasible in the first dogfood line without turning it into a research project:

- Fully automatic universal object decomposition.
- Perfect semantic segmentation for arbitrary images.
- 3D asset reconstruction.
- Physically correct relighting for every material.
- Cloud-scale multi-tenant SaaS operations.
- GPU-only model dependency as the default path.

The product should therefore be framed as **assisted procedural material extraction**, not fully automatic universal asset extraction.

## Product Name

Working name: `PatternForge`.

The name is only a dogfood project label. It can change before any public release.

## Target User

| User | Need |
|---|---|
| Frontend developer | Turn visual references into reusable web backgrounds and material swatches. |
| Indie designer | Extract texture ideas from photos without manually repairing seams, shadows, and low-resolution crops. |
| Game or mockup builder | Generate tileable material variants from a reference image region. |
| Internal HADARA maintainer | Evaluate whether the 0.3.3 lifecycle and context features help real product work. |

## Core Workflow

1. User creates a project.
2. User uploads a source image.
3. System creates a reduced preview and source metadata.
4. User selects a candidate material region using crop/brush tools.
5. System analyzes the selected region.
6. System proposes one or more material presets.
7. User edits parameters and previews generated variants.
8. User exports the asset as texture files and preset metadata.
9. User applies the generated asset to a sample web page preview.
10. System preserves source/preset/export lineage for reproducibility.

## First Material Model

The first supported material family is `grass-field-v1`.

| Parameter | Meaning |
|---|---|
| `palette.base` | Dominant green/yellow/brown color palette from the selected region. |
| `palette.variance` | Color jitter range for generated blades/clumps. |
| `density` | Number of generated blades or clusters per tile. |
| `blade.lengthMean` | Average blade length in output pixels. |
| `blade.lengthVariance` | Blade length randomness. |
| `blade.widthMean` | Average blade width. |
| `orientation.mean` | Dominant blade direction. |
| `orientation.spread` | Direction randomness. |
| `clump.scale` | Size of repeated clumps or tufts. |
| `noise.frequency` | Fine texture noise frequency. |
| `noise.amplitude` | Fine texture contrast. |
| `lighting.normalization` | Degree of shadow/highlight flattening before synthesis. |
| `tile.size` | Output texture tile size. |
| `tile.seamMode` | Edge blending / seamless generation mode. |

The renderer may start as 2D canvas/WebGL procedural rendering. The first release does not need a physically based material stack, but the preset should leave room for future normal/roughness/albedo maps.

## System Architecture

### Compose Services

| Service | Suggested Stack | Responsibility |
|---|---|---|
| `web` | Next.js or Vite React | UI, upload flow, image viewer, mask editor, preset editor, preview/export UX. |
| `api` | FastAPI or Node API | Auth/session-lite, project/asset APIs, upload orchestration, export APIs. |
| `worker` | Python worker | Image processing, material analysis, export rendering jobs. |
| `postgres` | PostgreSQL | Projects, assets, presets, jobs, exports, audit metadata. |
| `redis` | Redis | Job queue and progress events. |
| `minio` | S3-compatible object store | Source images, previews, generated textures, export bundles. |

Default `docker compose up` must run without GPU and without external model downloads.

Optional future profile:

| Profile | Service | Responsibility |
|---|---|---|
| `ml` | segmentation model service | Optional mask proposals. Must not be required for default dogfood validation. |

### Data Model

| Entity | Key Fields |
|---|---|
| `Project` | id, name, createdAt, updatedAt |
| `SourceImage` | id, projectId, objectKey, width, height, mimeType, hash, previewKey |
| `RegionMask` | id, sourceImageId, maskKey, cropRect, toolHistory, hash |
| `MaterialPreset` | id, projectId, sourceImageId, regionMaskId, family, parametersJson, confidence, analysisReportJson |
| `RenderVariant` | id, presetId, parametersJson, previewKey, exportKey, createdAt |
| `Job` | id, type, status, progress, inputJson, outputJson, errorCode, createdAt |

### Asset Lineage

Every exported asset must retain:

- source image hash
- selected region crop
- mask hash
- analyzer version
- preset schema version
- renderer version
- parameter JSON
- export format and dimensions

This is required for HADARA dogfooding because the project should prove that evidence and source-addressed context remain usable after many capsules.

## Processing Pipeline

### Upload

- Accept JPEG, PNG, and WebP.
- Enforce file size and dimension limits.
- Store original object and generate a safe preview.
- Compute content hash.
- Never store raw EXIF data in public evidence.

### Region Selection

- Provide crop rectangle and brush mask.
- Support undo/redo inside the editor.
- Save mask as object storage artifact plus compact metadata in DB.

### Analysis

Use deterministic local processing first:

- color palette extraction
- shadow/highlight normalization estimate
- edge/orientation histogram
- local frequency/periodicity estimate
- noise/texture statistics
- tileability/seam diagnostics
- confidence score and warnings

The analyzer should produce a reduced report suitable for public test evidence. It must not include raw image pixels.

### Preset Generation

- Map analysis features to `grass-field-v1`.
- Generate an initial parameter set.
- Preserve analyzer confidence and warnings.
- Let users edit all key parameters.

### Rendering

- Generate preview variants in browser or worker.
- Use deterministic seeds for reproducibility.
- Support at least PNG export and JSON preset export.
- Prefer tileable output.

## UX Requirements

| View | Required Behavior |
|---|---|
| Project list | Create/open/delete project locally. |
| Image upload | Drag/drop upload, progress, validation failures. |
| Image workbench | Source preview, crop, brush mask, analyze action, confidence report. |
| Preset editor | Parameter controls, live preview, reset to analysis, duplicate variant. |
| Export panel | PNG/WebP/JSON options, dimensions, tile preview, sample CSS snippet. |
| Dogfood findings | A developer-only page or Markdown report collecting HADARA friction notes. |

UI must feel like an actual working tool, not a marketing landing page. The first screen after launch should be the project/workbench surface.

## Security and Privacy

| Area | Requirement |
|---|---|
| Uploads | Enforce MIME, size, dimension, and decode validation. |
| Object storage | Store raw source images in local object storage only; no external uploads. |
| Public evidence | Never attach raw user images, private paths, or unredacted logs. |
| Jobs | Avoid raw stack traces in public UI; keep detailed diagnostics private/local. |
| Docker | Default compose must not require privileged containers. |
| Network | Default app should not call external AI/image APIs. |

## Performance Targets

| Operation | Target |
|---|---|
| Docker compose initial boot after images built | Under 30 seconds on a normal dev machine. |
| Upload preview generation for 5 MB image | Under 5 seconds. |
| Region analysis for 1024 px crop | Under 10 seconds CPU path. |
| Preview parameter update | Under 200 ms for browser-side changes when possible. |
| Export 1024 x 1024 PNG | Under 10 seconds. |

Targets are advisory for the dogfood line. Evidence should record actual timings.

## HADARA Dogfood Requirements

The project must be created from the published package, not from the HADARA-dev source checkout:

```bash
tmp="$(mktemp -d)"
npm --prefix "$tmp" install hadara@0.3.3-rc.0
"$tmp/node_modules/.bin/hadara" init --profile governed --project ./patternforge
```

The dogfood project must evaluate:

| Surface | Evaluation |
|---|---|
| `hadara init` generated docs | Are required-reading docs correct, current, and actionable for a real SaaS? |
| `task next` / `task status` | Does task selection avoid stale or self-referential guidance? |
| `task lifecycle` | Does it identify the current phase and useful next action quickly? |
| `task finalize` | Does the finalize-first loop reduce close friction without hiding proof boundaries? |
| `evidence add-command` / `evidence list` | Are durable evidence ids ergonomic enough during product work? |
| `session start` | Does bounded default guidance help resume work? |
| `context graph` / `context pack` / `context slice` | Do they route agents to the right source, task, and decision context without excessive latency? |
| `context cache warm` | Does explicit warm improve daily work enough to justify the command? |
| generated `AGENTS.md` | Does it guide agents toward the new lifecycle and context features? |
| generated `IMPLEMENTATION_SOP.md` | Does it explain read/write boundaries and validation timing well enough? |

Each capsule should include a `FINDINGS.md` section or task-local finding table when HADARA friction is observed.

## Capsule Budget

Fifteen capsules are enough for a demo-grade MVP. For a production-oriented SaaS plus HADARA dogfood findings, this spec allocates **22 capsules**. The first 15 build the product MVP; the remaining 7 harden, validate, and extract HADARA findings.

| Capsule | Title | Primary Outcome |
|---|---|---|
| PF-001 | Initialize PatternForge with `hadara@0.3.3-rc.0` | Fresh governed project, generated docs audit, Docker Compose skeleton decision. |
| PF-002 | Product requirements and UX workflow | Product spec, user journeys, acceptance scenarios, non-goals. |
| PF-003 | Compose platform skeleton | `web`, `api`, `worker`, `postgres`, `redis`, `minio` start with health checks. |
| PF-004 | Project and asset persistence | DB schema, object storage adapter, source image metadata. |
| PF-005 | Upload and preview pipeline | Upload UI/API, validation, preview generation, safe storage. |
| PF-006 | Image workbench and region tools | Crop/mask editor MVP with persisted mask metadata. |
| PF-007 | Deterministic texture analysis engine | Palette, orientation, frequency, noise, lighting normalization report. |
| PF-008 | `grass-field-v1` preset schema | Versioned preset schema, analyzer-to-preset mapping, confidence/warnings. |
| PF-009 | Procedural renderer MVP | Canvas/WebGL or worker renderer, seeded preview, parameter updates. |
| PF-010 | Preset editor UX | Controls for density, palette, orientation, scale, noise, tile size. |
| PF-011 | Export pipeline | PNG/WebP/JSON preset export, sample CSS snippet, lineage metadata. |
| PF-012 | Async jobs and progress | Queue, job status, retries, reduced diagnostics. |
| PF-013 | Asset library and variants | Project asset list, duplicate variant, versioned preset history. |
| PF-014 | Demo scenario: meadow to web background | End-to-end grass extraction, generated variant, sample webpage application. |
| PF-015 | Baseline product hardening | Upload limits, error UX, cleanup, basic security, compose reset. |
| PF-016 | Installed-package HADARA recycle inside dogfood | Verify generated docs, lifecycle, context, evidence, and close loop from installed `hadara`. |
| PF-017 | Context-routing dogfood audit | Use `session start`, `context pack`, `context slice`, and cache warm during real product work; record latency/friction. |
| PF-018 | Lifecycle dogfood audit | Compare finalize-first flow against low-level commands across several capsules. |
| PF-019 | Evidence and handoff dogfood audit | Check evidence id ergonomics, handoff quality, and generated docs drift. |
| PF-020 | Production-readiness review | Threat model, data-retention policy, failure modes, performance report, known residuals. |
| PF-021 | HADARA improvement findings | Consolidated findings with proposed fixes back to HADARA-dev. |
| PF-022 | Stable 0.3.3 decision input | Decide whether dogfood found blockers, rc1 needs, or stable 0.3.3 can proceed. |

## Definition of Done for Dogfood Line

| Area | Done Criteria |
|---|---|
| Product | User can upload a meadow image, select grass, generate an editable grass preset, tune parameters, export an asset, and apply it in a sample web page. |
| Deployment | `docker compose up` starts the app and dependencies from a clean checkout with documented seed/demo flow. |
| Evidence | Each capsule records command evidence without raw private logs or raw image uploads. |
| Lifecycle | Capsules close through `task lifecycle` and `task finalize --execute --plan-hash`. |
| Context | At least five capsules use `session start` or context-routing commands and record whether they helped. |
| Findings | HADARA init/lifecycle/context/evidence findings are captured with proposed fixes. |
| Release Input | PF-022 states whether stable `0.3.3` should proceed, require `0.3.3-rc.1`, or defer. |

## Stable 0.3.3 Release Gate Impact

The dogfood line is not required to ship the first stable `0.3.3` if the operator chooses a smaller release path. It becomes release-blocking only if it finds one of these issues:

- generated `hadara init` docs give materially wrong lifecycle instructions
- `task finalize` cannot reliably close normal product capsules
- context-routing commands produce incorrect unsafe raw-source guidance
- installed `hadara@0.3.3-rc.0` cannot support ordinary governed project workflows
- evidence or handoff behavior creates misleading release proof

If none of those blockers appear, product-specific shortcomings in PatternForge should be recorded as dogfood findings, not as automatic HADARA release blockers.

## Open Questions

| Question | Default Decision |
|---|---|
| Should auth be included in the first dogfood line? | No. Use local projects first; add auth only after core workflow works. |
| Should ML segmentation be default? | No. Optional profile only. User-assisted masks are the default. |
| Should the first renderer target CSS, PNG, or shader export? | PNG plus JSON preset first; CSS snippet second; shader export deferred. |
| Should raw uploaded demo images be committed as evidence? | No. Use generated/synthetic fixtures or reduced metadata only. |
| Should this run in HADARA-dev or a separate repo? | Separate dogfood project initialized with installed `hadara@0.3.3-rc.0`; HADARA-dev receives only findings/specs. |
