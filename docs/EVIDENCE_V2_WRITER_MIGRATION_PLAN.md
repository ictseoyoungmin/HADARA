# EVIDENCE_V2_WRITER_MIGRATION_PLAN

## Purpose

This document defines the planned persisted `hadara.evidence.v2` writer and migration path after Phase 4 semantic read surfaces are in place.

The plan is deliberately dry-run-first and compatibility-first. Existing `hadara.evidence.v1` records remain valid, semantic read models continue to normalize both versions, and no existing `evidence.jsonl` or `EVIDENCE.md` file is rewritten automatically by init, lint, protocol doctor, harness validation, task finish, task close, Dashboard, TUI, MCP, release, or package commands.

## Persisted v2 Record Shape

`hadara.evidence.v2` should be a persisted JSONL writer format, not merely the normalized read model.

| Field | Requirement |
|---|---|
| `schemaVersion` | Literal `hadara.evidence.v2`. |
| `id` | Stable evidence id generated at write time. |
| `sourceLine` | Optional migration/read-model metadata for the source JSONL line; useful for v1 compatibility diagnostics, not durable identity. |
| `fingerprint` | Content fingerprint for migration reports and compatibility read models. |
| `idSource` / `idStability` | Read-model metadata that distinguishes persisted ids from content or line fallback ids and tells consumers whether reorder/edit can change the id. |
| `time` | ISO timestamp. |
| `taskId` | Owning Task Capsule id. |
| `category` | Semantic category such as `validation`, `implementation`, `release`, `security`, `policy`, `operation`, `decision`, `handoff`, `audit`, `note`, or `observation`. |
| `outcome` | Semantic outcome such as `passed`, `failed`, `blocked`, `unknown`, `recorded`, or `not-applicable`. |
| `visibility` | `public` or `private`. |
| `summary` | Redacted human summary safe for committed evidence when visibility is public. |
| `artifacts` | Public artifact refs only when safe; private raw/store paths must not be committed. |
| `tags` | Exact machine markers such as `supersedes:<evidenceId>` and `resolves:<evidenceId>`. |
| `legacy` | Optional compatibility payload for source v1 `kind`, `result`, and original line id during migration. |

Proof `strength` should remain derived by the semantic analyzer, not persisted as source-of-truth writer data.

## Writer Plan

| Step | Behavior |
|---|---|
| Dual-read foundation | Readers accept v1 and v2 records through one normalizer/analyzer path. |
| Opt-in writer | Evidence write commands may gain an explicit opt-in writer mode before v2 becomes default. |
| Default transition | Default v2 writes happen only after dual-read tests, migration dry-run reports, and consumer contracts are stable. |
| Markdown frame | `EVIDENCE.md` keeps a human table first; any richer frame is planned separately and must preserve readable history. |
| Exact resolution markers | Writer help should document `supersedes:<id>` and `resolves:<id>` exact markers; human summary wording must not create semantic resolution. |
| Subject-aware resolution | Later passed same-category evidence remains a v1 compatibility-only transitional fallback; v2 should add subject/scope metadata so failure resolution can narrow to same category plus same subject. |
| Private evidence | Private artifacts stay in private portable storage/manifests; public committed records may include safe summaries and manifest metadata only. |

## Migration Plan

Future migration should be per-task, dry-run-first, and hash-guarded:

```bash
hadara evidence migrate --task T-XXXX --to v2 --json
hadara evidence migrate --task T-XXXX --to v2 --execute --before-hash <sha256:...> --json
```

The command names are proposed design, not implemented behavior.

| Requirement | Rule |
|---|---|
| Dry-run default | Reports planned line transforms, before hashes, skipped records, and warnings without writing. |
| Execute guard | Requires matching before hash and refuses concurrent drift. |
| Mixed-version tolerance | Readers tolerate v1/v2 mixed JSONL during transition. |
| Reversibility | Migration report records enough legacy metadata to explain the v1 source. |
| Scope | Migrate one task at a time first; no repository-wide automatic migration in the first implementation. |
| Markdown | Do not rewrite `EVIDENCE.md` automatically in the first migration command; plan any table/frame rewrite as a separate dry-run-first task. |
| Init | Do not change init scaffolds until v2 writer behavior is implemented and documented. |

## Validation Requirements

| Area | Required Proof |
|---|---|
| Dual-read | Unit tests normalize v1, v2, and mixed JSONL consistently. |
| Writer | Focused tests prove public/private artifact policy, exact marker preservation, and no private path leakage. |
| Migration dry-run | Tests prove no writes by default and stable before-hash reporting. |
| Migration execute | Tests prove hash-guarded writes and no unrelated file mutation. |
| Protocol/harness | Existing semantic gates behave the same over v1, v2, and mixed evidence. |
| Identity hardening | Tests prove actual JSONL source lines are preserved for v1 normalization and generated ids expose stability metadata. |

## Explicit Non-Goals

- No automatic rewrite of existing `evidence.jsonl`.
- No automatic rewrite of existing `EVIDENCE.md`.
- No init scaffold change in the design capsule.
- No MCP write expansion.
- No Dashboard or TUI rendering work.
- No release/package execution or strict release-gate enforcement.
- No failed-evidence resolution unless an exact marker, v1 compatibility-only later passed same-category evidence, or explicit residual-risk documentation provides the signal.
