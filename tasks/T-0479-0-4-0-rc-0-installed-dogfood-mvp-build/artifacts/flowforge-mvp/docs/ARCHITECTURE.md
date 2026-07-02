# ARCHITECTURE

## Overview

| Field | Value |
|---|---|
| HADARA Profile | governed |
| Summary | Describe the current system architecture. |

## Boundaries

| Boundary | Rule | Notes |
|---|---|---|
| Project state | Keep project source, docs, and Task Capsules in the repository. | Reproducible state only. |
| Local state | Keep portable/local machine state under `.hadara/local/`. | Must be ignored. |
| Secrets | Do not commit secrets, private logs, or machine-local state. | Use local/private stores. |

## Current Components

| Component | Path / Surface | Responsibility | Status |
|---|---|---|---|
| Task Capsules | `tasks/T-*/` | Task-local scope, evidence, decisions, and handoff. | Active |
| Evidence records | `EVIDENCE.md`, `evidence.jsonl` | Validation evidence and artifact references. | Active |
| Handoff | `docs/PROJECT_STATE.md` or `docs/AGENT_HANDOFF.md` | Next-session continuation state. | Active |
