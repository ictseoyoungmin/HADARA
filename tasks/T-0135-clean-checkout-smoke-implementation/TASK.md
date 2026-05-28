# T-0135 Clean Checkout Smoke Implementation

## Goal

Implement an explicit clean-checkout source smoke command that validates a disposable source copy without mutating the current workspace.

## Scope

- Add `hadara smoke clean-checkout --execute --json`.
- Copy the project source into a disposable workspace while excluding dependency/build/local-private directories.
- Run the clean-checkout source sequence: `npm ci`, `npm run build`, `npm run check`, built CLI `doctor --json`, built CLI `ops status --json`, and built CLI strict release gate.
- Emit a reduced `hadara.cleanCheckoutSmoke.v1` report with redacted workspace/source paths, exit codes, elapsed timings, cleanup status, and no raw logs.
- Preserve source workspace immutability and default cleanup.
- Keep installed CLI smoke and package install smoke separate from this source-checkout command.

## Out of Scope

- Package smoke, `npm pack`, package install, isolated prefix install, global install, publish, GitHub Release creation, Docker image builds, install matrix execution, release artifact generation, and evidence attachment.
- Raw log retention policy for `--private-logs`; this remains T-0136 Smoke Evidence Integration.
- Windows/WSL/USB matrix execution.

## Status

Done
