# Plan

1. Read protocol, release-smoke planning, and T-0134/T-0135 handoff context.
2. Add a shared reduced smoke evidence writer that emits public summaries under smoke-specific artifact directories and updates `EVIDENCE.md`/`evidence.jsonl`.
3. Wire package-smoke local execution and clean-checkout smoke execution to `--attach-evidence --task <task-id>` while keeping default behavior unchanged.
4. Add focused tests for package and clean-checkout evidence attachment plus schema compatibility.
5. Run focused Docker validation, full Docker check, built CLI attach-evidence smoke, strict release gate, and done-level harness validation.
