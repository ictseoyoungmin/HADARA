# Context

## Required Reading Used

| Document | Why It Matters | Read Status |
|---|---|---|
| .hadara/context/HADARA_CONTEXT.md | Current-state entry point and read routing. | Read |
| docs/PROJECT_STATE.md | Current project state. | Read |
| docs/AGENT_HANDOFF.md | Current handoff. | Read |
| docs/TASK_BOARD.md | Task queue and status. | Read |
| docs/IMPLEMENTATION_SOP.md | Workflow rules and context-routing spec registry. | Read |
| docs/TASK_WORKFLOW_COMMANDS.md | Finish/ready/close workflow boundaries. | Read |
| docs/DEVELOPMENT_SLICES.md | Slice order and C6/C5 routing. | Read |
| docs/TEST_STRATEGY.md | Validation baseline. | Read |
| docs/SECURITY_MODEL.md | Local cache boundary and write constraints. | Read |
| docs/specs/0.3.3/context-routing/08_C6_Speed_First_Graph_Build_and_Warm_Path_Spec.md | C6 speed-first targets and required measurement fields. | Read |

## Assumptions

| Assumption | Source | Risk If Wrong |
|---|---|---|
| `/mnt/f/NowWorking/HADARA-dev` is the mounted workspace under test. | Environment context. | Mounted timings are local to this WSL/filesystem profile. |
| `/tmp/hadara-context-perf-t0373` is an ext4 copy used only for comparison. | T-0373 setup. | It excludes `node_modules`, `.git`, and `.hadara/local`; source count differs slightly from the mounted workspace. |
| Cache warm is measured as dry-run. | C6 non-negotiable read/write boundary. | Warm execute performance remains unmeasured in this capsule. |

## Constraints

| Constraint | Source | Notes |
|---|---|---|
| Read commands must not write `.hadara/local/cache/context`. | C6 spec. | Benchmark invokes `context cache warm --json`, not `--execute`. |
| Do not store raw graph JSON payloads in committed docs. | Practical output boundary. | Baseline script records summary fields and output byte counts only. |
| Mounted broad small-file reads are known to be slow. | Prior dashboard/TUI history and T-0373 measurements. | Next C6 work must optimize for mounted paths, not just ext4. |
