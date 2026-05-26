# Risks

| Risk | Mitigation |
|---|---|
| Porting the whole 1,623-line mockup at once would mix read-model, rendering, raw terminal input, refresh, cache, and CLI behaviors. | This slice ports reusable constants/layout/Markdown rendering and updates snapshots only; interactive/runtime behavior remains separate. |
| Box-drawing terminal output can drift in narrow terminals. | Snapshot renderer enforces the mockup-style minimum frame and tests fixed line counts/widths. |
| TUI scope could accidentally introduce writes or execution behavior. | Renderer consumes only the internal read model and tests assert no project files are mutated. |
