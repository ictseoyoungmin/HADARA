# Risks

| Risk | Mitigation |
|---|---|
| Loading animation is still bounded by synchronous read-model loads. | The TUI now opens with loading frames immediately and advances ticks before each load; worker-thread loading is explicitly left as future scope. |
| Mouse coordinate mapping may vary by terminal width/layout. | Tests cover compact panel/doc-tab clicks and the mapping is constrained to known fixed layout rows. |
| Mouse mode could remain enabled after exit. | Clean shutdown writes SGR mouse disable sequences and tests assert cleanup output. |
| Resize redraw could accidentally perform reads/writes. | Resize only re-renders the current in-memory model; existing no-write terminal tests still pass. |
