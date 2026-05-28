# T-0136 Smoke Evidence Integration

## Goal

Connect existing smoke runners to HADARA evidence by attaching reduced public smoke summaries while keeping raw logs, package contents, and private paths out of committed files.

## Scope

- Add public evidence attachment for explicit local `hadara package smoke --execute --attach-evidence --task <task-id>`.
- Add public evidence attachment for explicit `hadara smoke clean-checkout --execute --attach-evidence --task <task-id>`.
- Store reduced UTF-8 JSON summaries under task-local `artifacts/package-smoke/` or `artifacts/clean-checkout-smoke/`.
- Reuse the existing public evidence artifact redaction policy before writing committed artifacts.
- Preserve reduced report boundaries: no raw stdout/stderr, no package contents, no private absolute paths, no private store paths, no release/publish mutation.

## Out of Scope

- Running smoke commands by default or from release gate.
- MCP package/install/clean-checkout smoke execution surfaces.
- Raw log retention with `--private-logs` manifests.
- Install matrix evidence, release artifact building, publish/deploy scripts, GitHub Release creation, Docker image builds, or registry mutation.

## Status

Done
