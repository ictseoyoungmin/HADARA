# T-0016 Evidence Artifact Copy

## Goal

Expand Evidence Store artifact handling by copying public attached evidence files into managed Task Capsule artifact storage while preserving private path suppression.

## Scope

- Copy public attached evidence files into `tasks/T-*/artifacts/<kind>/`.
- Store managed project-relative artifact paths in `evidence.jsonl`.
- Keep private evidence paths suppressed and uncopied.
- Preserve Markdown evidence summaries and JSON collect output.
- Add focused tests and Docker CLI smokes.

## Out of Scope

- Binary-specific preview generation.
- Artifact deduplication.
- Encrypted private evidence storage.
- Session-level artifact copying.
- Dashboard evidence browser.

## Status

Done
