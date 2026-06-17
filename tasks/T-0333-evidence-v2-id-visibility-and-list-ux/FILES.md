# Files

| Path | Action | Reason | Status |
|---|---|---|---|
| src/services/evidence-list.ts | Modified | Expose explicit id stability fields in JSON list records. | Done |
| src/cli/evidence.ts | Modified | Render text list rows with `[id]` and `category/outcome`. | Done |
| src/schemas/evidence-list.schema.json | Modified | Capture additive JSON contract fields. | Done |
| src/tui/read-model.ts | Modified | Preserve the new evidence list record type in TUI fast reads. | Done |
| tests/unit/evidence-list.test.ts | Modified | Verify JSON list id contract fields. | Done |
| tests/unit/evidence-json.test.ts | Modified | Verify CLI text output and JSON fields. | Done |
| tests/unit/task-json.test.ts | Modified | Align task read embedded evidence expectations with additive fields. | Done |
| tests/unit/mcp-tools.test.ts | Modified | Align MCP task read expectations with additive fields. | Done |
| README.md | Modified | Document durable id discovery/resolution workflow. | Done |
| docs/CLI_JSON_CONTRACT.md | Modified | Document evidence list id contract. | Done |
| docs/TASK_WORKFLOW_COMMANDS.md | Modified | Document list -> resolve workflow and legacy caution. | Done |
| src/services/capability-registry.ts | Modified | Align evidence list help/example metadata. | Done |
| src/cli/init.ts | Modified | Align generated workflow docs with durable id guidance. | Done |
| dist/ | Modified | Refreshed by Docker sync-build. | Done |
