# T-0129 Installer Dry-run Implementation

## Goal

Implement the first read-only installer dry-run planner that emits schema-valid `hadara.install.plan.v1` output without creating installer scripts or mutating install locations.

## Scope

- Add `hadara install plan --json` as a read-only CLI command.
- Build a shared install-plan report service that validates against `hadara.install.plan.v1`.
- Support `--platform posix|windows|wsl|usb`, `--source`, `--source-kind`, `--prefix`, `--launcher`, and `--mode dry-run|execute`.
- Support explicit `--platform linux` while retaining `posix` as a compatibility alias.
- Require `--usb-root` or `--target` for USB planning.
- Document `wouldWrite: true` as future confirmed execute/apply behavior, not a dry-run write.
- Emit redacted public path references for source and target paths.
- Keep execution disabled; `--mode execute` must return an `INSTALL_EXECUTION_DISABLED` issue instead of mutating anything.
- Align package metadata with the MIT license decision while keeping `private: true`.
- Register the command in capability discovery as read-only.
- Cover schema validity, redaction, execute-disabled behavior, and CLI JSON output with focused tests.

## Out of Scope

- Creating `scripts/install.sh`, `scripts/install.ps1`, or `portable/bin/*` launchers.
- Copying packages, creating directories, symlinks, launchers, or shell profile edits.
- Running install smoke, package smoke, `npm pack`, `npm install`, publish/deploy, GitHub Release, Docker image build, or registry mutation.
- Adding MCP install/package/release execution tools.
- Storing raw private paths, raw logs, environment values, npm tokens, or machine-local install state in committed files.

## Status

Done
