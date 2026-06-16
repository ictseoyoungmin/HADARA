# Plan

| Step | Action | Status | Evidence |
|---|---|---|---|
| 1 | Read required project, workflow, release, security, roadmap, and task docs. | Done | AGENTS, context, Project State, Agent Handoff, Task Board, SOP, Task Workflow Commands, Development Slices, Test Strategy, Release Readiness, Release Notes, Security Model, Roadmap, README, release helper scripts. |
| 2 | Create T-0326 and define release-readiness scope. | Done | `node dist/cli/main.js task create "0.3.1-rc.1 Release Readiness Preparation" --json`; capsule docs updated. |
| 3 | Align package metadata, lockfile, README, release notes/readiness, helper guidance, and tests to `0.3.1-rc.1`. | Done | `package.json`, lockfile, README, release notes/readiness, helper scripts, release policy tests, and T-0327/T-0328 scaffolds updated. |
| 4 | Run Docker build/full validation and refresh release evidence without publish mutation. | Done | Docker sync-build passed on rerun; release artifact, package smoke, clean-checkout smoke, strict gate, release dry-run, publish dry-run, and final `git diff --check` passed. |
| 5 | Finalize capsule/shared docs and prepare the capsule for ready/close/audit. | Done | `task finish --execute`; shared state docs updated; close-source docs finalized before ready/close. |
