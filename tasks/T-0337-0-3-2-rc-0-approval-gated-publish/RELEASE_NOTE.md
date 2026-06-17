# HADARA 0.3.2-rc.0 Release Note

`hadara@0.3.2-rc.0` is a release candidate for the Evidence v2 refactor line. It makes Evidence v2 usable as an operator-facing workflow rather than only an internal persisted record format.

## What Changed

- `evidence add-command` now accepts explicit Evidence v2 metadata: `--category`, `--outcome`, repeated `--resolves`, repeated `--supersedes`, and optional `--idempotency-key`.
- Explicit `--result` and `--outcome` values are checked for semantic agreement. Mismatched `passed`, `failed`, `blocked`, or `unknown` pairs fail with `EVIDENCE_RESULT_OUTCOME_MISMATCH` before evidence is appended.
- `recorded` and `not-applicable` outcomes are supported as Evidence v2 outcomes while keeping the legacy command result omitted or `unknown`.
- Failed evidence resolution now requires an exact marker such as `--resolves ev:T-XXXX:...` and a later evidence outcome of `passed` or `recorded`.
- `evidence list` is the supported evidence id discovery surface. Text output includes copyable ids plus category/outcome; JSON output exposes durable id metadata, persisted schema version, category, outcome, and tags.
- Task lookup for evidence writes ignores leftover task-like directories that do not contain `TASK.md`, while still rejecting ambiguous same-id valid capsules.
- Documentation now treats `evidence.jsonl` as the canonical append-only evidence source and `EVIDENCE.md` as a non-canonical human summary.
- README, CLI JSON contract docs, task workflow docs, generated init guidance, command registry metadata, release notes, and release readiness docs were consolidated around durable Evidence v2 ids and exact marker workflow.

## Operator Workflow

Use `evidence list` before writing a resolution marker:

```bash
hadara evidence list --task T-XXXX
hadara evidence add-command --task T-XXXX --summary "Fix verified" --result passed --category validation --resolves ev:T-XXXX:aaaaaaaaaaaaaaaaaaaaaaaa --json
```

Prefer durable persisted `ev:` ids for long-lived `resolves:` and `supersedes:` references. Legacy compatibility ids are inspection-only and are not the recommended durable reference format.

## Compatibility Notes

- Existing v1 evidence remains readable through mixed v1/v2 read models.
- No broad historical evidence migration is performed by this release candidate.
- `EVIDENCE.md` is not rebuilt or rewritten automatically.
- Existing lifecycle, close, release, Dashboard, TUI, and MCP read paths continue to consume mixed evidence records.

## Deferred Scope

The following remain future candidate work and are not part of `0.3.2-rc.0`:

- `evidence rebuild` preview or execute behavior.
- `check-id` evidence validation commands.
- `subject`-based evidence resolution.
- A new `evidence add-command` report schema id.
- Broad historical evidence migration.
- Shell execution through evidence commands.

## Release Boundary

This release candidate is published to npm with the `next` dist-tag. The stable `latest` npm tag should remain on the current stable release. GitHub Release creation, Docker image publishing, PyPI publishing, installer execution, and MCP release/package execution remain out of scope unless explicitly requested in a separate approved path.
