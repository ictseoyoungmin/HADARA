# Context

## Required Reading Used

| Document | Why It Matters | Read Status |
|---|---|---|
| docs/PROJECT_STATE.md | Current project state and release/publish boundaries. | Read |
| docs/AGENT_HANDOFF.md | Current handoff and T-0269 separation. | Read |
| docs/TASK_BOARD.md | Task queue and T-0270 board row. | Read |
| docs/IMPLEMENTATION_SOP.md | Workflow rules and evidence requirements. | Read |
| docs/TASK_WORKFLOW_COMMANDS.md | Standard task lifecycle command order. | Read |
| docs/DEVELOPMENT_SLICES.md | Slice tracking for the cleanup capsule. | Read |

## Assumptions

| Assumption | Source | Risk If Wrong |
|---|---|---|
| Root `START.bat`, `start.sh`, `hadara`, and `hadara.cmd` are early bootstrap/dev convenience files, not current package entrypoints. | Focused reference search and package metadata check. | A local operator habit may need to switch to `npm run dev -- ...` or `node dist/cli/main.js ...`. |
| Hermes/.hadara context files are compatibility/context assets, not disposable launchers. | File inventory and examples. | Removing them would blur future Hermes/MCP compatibility context. |
| Historical spec references to portable launchers are not active current-root usage. | Focused reference search. | Search output remains noisy but intentionally documented. |

## Constraints

| Constraint | Source | Notes |
|---|---|---|
| Do not modify T-0269 publish evidence or scripts in this cleanup capsule. | Operator request and handoff. | Publish verification remains approval-gated and separate. |
| Do not publish, create GitHub Releases, build/push images, or load publish tokens. | T-0269 boundary and release governance. | T-0270 validation is local/read-only except file cleanup and docs/evidence writes. |
| Keep package publish surface unchanged. | `package.json` files/bin metadata. | `npm pack --dry-run --json --cache /tmp/hadara-npm-cache-t0270` verifies package contents without publish. |
