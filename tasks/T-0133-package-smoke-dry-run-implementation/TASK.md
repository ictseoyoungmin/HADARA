# T-0133 Package Smoke Dry-run Implementation

## Goal

Implement `hadara package smoke --dry-run --json` as a read-only package-smoke planner using `hadara.packageSmoke.v1`.

## Scope

- Add a shared package-smoke dry-run report builder.
- Add a `hadara package smoke` CLI handler that defaults to dry-run planning.
- Preview disposable workspace, package source, planned steps, artifact/evidence destinations, and package metadata issues.
- Keep all execution markers false: no `npm pack`, package install, feature-smoke subprocess, release mutation, publish, artifact write, or evidence attachment.
- Preserve the T-0131 boundary: core feature smoke remains service/read-model validation, while installed CLI/package execution remains future work.

## Out of Scope

- No package-smoke execution.
- No subprocess execution of `hadara`, `npm pack`, `npm install`, or installed CLI commands.
- No package artifact writes, install tree writes, public evidence attachment, private log retention, release artifact build, publish, GitHub Release, Docker image build, MCP package-smoke tool, provider call, or install mutation.

## Status

Done
