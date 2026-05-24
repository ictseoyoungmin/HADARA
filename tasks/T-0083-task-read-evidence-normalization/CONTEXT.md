# Context

Relevant documents and files read:

- `docs/AGENT_HANDOFF.md`
- `src/services/evidence-list.ts`
- `src/services/task-read-model.ts`
- `tests/unit/evidence-list.test.ts`
- `tests/unit/task-json.test.ts`
- `tests/unit/mcp-tools.test.ts`

T-0082 recorded that `task.read` embedded `evidenceIndex` still used raw parsed JSON instead of the evidence-list normalization path. While implementing this, focused tests showed that raw `files["evidence.jsonl"]` would still leak private evidence paths and unredacted summaries even if `evidenceIndex` was normalized, so this capsule also normalizes that file view in the read model.

Validation should use Docker because host Node/npm remain unreliable in the current WSL environment.
