# Acceptance Criteria

| ID | Criterion | Status | Evidence |
|---|---|---|---|
| AC-1 | Context slice rejects `.hadara/tmp`, `.hadara/run`, `.dashboard-visual`, and non-allowlisted `.hadara/**` raw reads while preserving `.hadara/docs-registry.json` access if intentionally allowed. | Met | `tests/unit/context-slice.test.ts`; built CLI deny/allow smoke; `ev:T-0376:fc7d0da873a64f9b879d6f84` |
| AC-2 | Graph-core shard tests cover stale invalidation for representative task/project/handoff/evidence source changes, corrupt payload fallback/diagnostics, and graph-core hit with `--include-code`. | Met | `tests/unit/context-cache-store.test.ts`; `tests/unit/context-graph-builder.test.ts`; `ev:T-0376:fc7d0da873a64f9b879d6f84` |
| AC-3 | `scripts/context-routing-performance-baseline.mjs` cannot hang indefinitely after timeout because it escalates from SIGTERM to SIGKILL, records killed signal, and handles child process errors. | Met | `tests/unit/context-routing-performance-baseline-script.test.ts`; `ev:T-0376:fc7d0da873a64f9b879d6f84` |
| AC-4 | Context-pack slice candidates expose structured `suggestedCommandArgs` alongside compatibility `suggestedCommand` strings. | Met | `src/context/context-pack.ts`; `src/schemas/context-pack.schema.json`; `tests/unit/context-pack.test.ts`; `ev:T-0376:fc7d0da873a64f9b879d6f84` |
| AC-5 | Focused validation, build/smoke, evidence, and shared close-source docs are complete before lifecycle finish/ready/close. | Met | `ev:T-0376:fc7d0da873a64f9b879d6f84`; `TESTS.md`; `HANDOFF.md`; shared docs updated. |
