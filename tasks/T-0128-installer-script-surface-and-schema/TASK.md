# T-0128 Installer Script Surface and Schema

## Goal

Define installer script surfaces, portable launcher responsibilities, default install locations, Node 22/WSL checks, and install report schemas before any install mutation implementation.

## Scope

- Introduce a tracked dedicated release-readiness source for T-0128+ installer/package readiness details.
- Document POSIX, Windows, WSL, and USB portable installer/launcher surfaces.
- Register a `hadara.install.plan.v1` schema fixture for future dry-run install planning reports.
- Add a read-only release-gate readiness check for installer surface/schema markers.
- Cover the new check and schema fixture with focused tests.

## Out of Scope

- Creating `scripts/install.sh`, `scripts/install.ps1`, or `portable/bin/*` launcher files.
- Running install scripts, mutating PATH, creating symlinks, copying packages, or modifying shell profiles.
- Running package smoke, install smoke, `npm pack`, publish/deploy, GitHub Release, Docker image build, or registry mutation.
- Adding MCP installer/package/release execution tools.
- Storing secrets, npm tokens, private logs, or machine-local install paths in committed files.

## Status

Done
