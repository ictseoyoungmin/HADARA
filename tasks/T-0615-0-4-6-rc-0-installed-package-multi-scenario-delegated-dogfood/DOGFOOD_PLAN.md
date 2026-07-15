# Dogfood Plan

## Purpose

Validate `hadara@0.4.6-rc.0` as an installed package in fresh external projects under `/mnt/f/NowWorking/dev`.

The operator installs HADARA and runs `hadara init`. After that, delegated Codex should behave like a normal project agent: read generated docs, create Task Capsules, implement scoped work, record evidence, and close tasks.

## Delegation Mode

| Choice | Decision | Reason |
|---|---|---|
| End-to-end single prompt | Rejected | It hides lifecycle friction until the end and makes it harder to tell which capsule or output caused confusion. |
| Capsule-by-capsule reviewer loop | Selected | The reviewer can inspect each capsule result, then prompt the delegated agent for the next slice. This better tests HADARA as an agent control plane. |

## Installation

| Item | Value |
|---|---|
| HADARA version | `0.4.6-rc.0` |
| Tool prefix | `/mnt/f/NowWorking/dev/.hadara-0.4.6-rc.0-tools` |
| Binary | `/mnt/f/NowWorking/dev/.hadara-0.4.6-rc.0-tools/node_modules/hadara/dist/cli/main.js` via `node` |
| Install note | Windows-mounted prefix rejected npm bin symlink creation; installed with `--no-bin-links` and invoked the dist entrypoint directly. |

## Scenarios

| ID | Project | Profile | Purpose | Expected Capsule Budget |
|---|---|---|---|---|
| S1 | `hadara-046rc-basic-notes-agent` | `basic` | Small notes/task helper app to test minimal scaffold, task create, evidence, status, and finalize. | 1-2 |
| S2 | `hadara-046rc-standard-api-checker` | `standard` | Small API health checker to test standard docs, validation evidence, and next-work guidance. | 2-3 |
| S3 | `hadara-046rc-quant-battle-arena` | `governed` | Quant trading battle arena MVP with data ingestion, DB, API backend, frontend visualization, strategy templates, and agent accessibility. | 4-6 |

## Quant Battle Arena Spec

| Area | Requirement |
|---|---|
| Product | Local-first quant strategy battle arena for comparing simple strategies on historical market data. |
| Data | Use `yfinance` when available; provide deterministic seeded fallback data when network/data retrieval is unavailable. |
| Storage | Persist prices, strategy definitions, and backtest results in SQLite. |
| Backend | Provide an API backend for symbols, strategies, runs, and leaderboard/results. |
| Frontend | Provide a usable web frontend for selecting strategies, running/reviewing backtests, and visualizing equity/results. |
| Strategy templates | Include `.py` and `.md` templates that explain how an agent should add a new strategy safely. |
| Agent accessibility | Include concise docs/routes/scripts so a coding agent can add a strategy without reading the whole project. |
| Validation | Include seeded-data smoke tests and at least one backend/frontend or end-to-end sanity check. |

## Quant Capsule Budget

| Capsule | Goal | Expected Output |
|---|---|---|
| Q1 | Product/spec scaffold and project skeleton. | README/spec, app structure, dependency notes. |
| Q2 | Data ingestion and SQLite model. | yfinance/fallback loader, DB schema, seed command/test. |
| Q3 | Strategy templates and backtest engine. | strategy interface, sample strategies, deterministic backtest results. |
| Q4 | API backend. | endpoints for symbols, runs, results, leaderboard. |
| Q5 | Frontend visualization. | local UI for run/results/equity curve. |
| Q6 | Agent docs and validation polish. | agent strategy guide, smoke tests, HADARA close. |

## What To Observe

| Category | Questions |
|---|---|
| Init docs | Do generated docs route a normal agent without HADARA-dev knowledge? |
| Task lifecycle | Does task status/create/finalize guide the agent without stale or contradictory output? |
| Evidence | Are validation/evidence commands discoverable and ergonomic? |
| Context | Does session/context guidance avoid missing optional docs and noisy history? |
| Output length | Is JSON/text output too long, unclear, or missing actionable next steps? |
| Positive signals | Which commands or docs made the delegated agent faster or safer? |

## Non-goals

The toy projects are evidence artifacts only. Do not commit them into HADARA-dev, and do not treat their trading output as financial advice or production-grade backtesting.
