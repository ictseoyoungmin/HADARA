# Acceptance Criteria

| ID | Criterion | Status | Evidence |
|---|---|---|---|
| AC-1 | `hadara context pack --task T-XXXX --json` emits schema-valid `hadara.contextPack.v1` output. | Met | CLI tests and built smoke `ev:T-0362:b9c56d667eb144f08d44ab03`. |
| AC-2 | `--include-code` is supported by building the underlying graph with code projection, while default output remains graph-only. | Met | CLI tests and include-code built smoke `ev:T-0362:b9c56d667eb144f08d44ab03`. |
| AC-3 | Budget options are bounded and explicit: `--budget` maps to `targetTokens`, and item caps can be supplied without hidden writes. | Met | Context pack budget CLI test in `tests/unit/context-graph-cli.test.ts`. |
| AC-4 | Command registry and CLI JSON contract docs include `context.pack`. | Met | `src/services/capability-registry.ts`, `docs/CLI_JSON_CONTRACT.md`, `docs/COMMAND_SURFACE.md`, `tests/unit/command-registry.test.ts`. |
| AC-5 | Focused and full Docker validation pass, with evidence attached. | Met | Failed first run preserved as `ev:T-0362:aed570d4fdc3459ea8ddc876`; corrected Docker check passed as `ev:T-0362:80274e2e6d864599ad68a161`; sync-build passed as `ev:T-0362:7532361940774df48a734813`. |
| AC-6 | Shared state docs route the next capsule toward C4 raw slicing or C6 source manifest without claiming either is implemented. | Met | Project State, Agent Handoff, Development Slices. |
