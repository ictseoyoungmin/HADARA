# Decisions

| Decision | Rationale |
|---|---|
| Keep production TUI read-model-first. | The Detail viewer and Overview cards should consume internal TUI read-model data. File reads remain inside shared services such as `createTaskReadReport`, not inside renderer code. |
| Extend only the internal TUI read model if Overview needs extra document text. | `hadara.tui.read_model.internal.v1` is not a stable public schema, so it can carry presentation-oriented document summaries without changing CLI/MCP public contracts. |
| Preserve core read-model contracts unless a focused need appears. | If `src/services/*` public report shapes need changes, record that explicitly before implementation. |
| No core shared read-model contract change was needed. | The only read-model shape change is internal to `src/tui/read-model.ts`; shared task/status/evidence service reports remain unchanged. |
| Production CLI uses async loading only for real interactive input, while injected test sessions keep synchronous startup. | This preserves existing deterministic CLI unit tests and cache assertions while enabling the built `hadara tui` path to animate during pending read-model loads. |
