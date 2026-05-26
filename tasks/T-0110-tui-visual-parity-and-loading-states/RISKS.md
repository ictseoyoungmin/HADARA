# Risks

| Risk | Mitigation |
|---|---|
| ANSI styling can break fixed-width terminal layout. | Added ANSI-aware fit/pad helpers and snapshot tests that assert visible width under color and no-color modes. |
| Keyboard state can update internally without visible row changes. | Passed selected task/search state into snapshot rendering and covered it with terminal/state tests. |
| Color output could destabilize existing snapshot checks. | Kept snapshot mode no-color by default and made color opt-in through `--color` or interactive TUI. |
| Loading frames could imply writes or background execution. | Loading is a render-only frame before existing read-model reloads; no shell/provider/MCP/write behavior was introduced. |
