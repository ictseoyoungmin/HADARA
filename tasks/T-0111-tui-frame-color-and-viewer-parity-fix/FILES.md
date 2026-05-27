# Files

| Path | Action | Reason |
|---|---|---|
| `src/tui/theme.ts` | Modified | Replaces 256-color approximation with mockup RGB palette and adds combined foreground/background swatch helper. |
| `src/tui/constants.ts` | Modified | Matches mockup compact document tab labels for the detail strip. |
| `src/tui/snapshot.ts` | Modified | Uses composed swatches for badges/keycaps and colorizes detail viewer document lines. |
| `src/tui/state.ts` | Modified | Passes document scroll state into snapshot options so keyboard scroll affects rendering. |
| `src/tui/cache.ts` | Modified | Reuses cached source-signal hashes when `mtimeMs` and `size` are unchanged during fast validation. |
| `tests/unit/tui-snapshot.test.ts` | Modified | Adds exact RGB border/badge, detail viewer color, document scroll, and compact tab-label regressions. |
| `tests/unit/tui-state.test.ts` | Modified | Covers document scroll propagation into snapshot options. |
| `tests/unit/tui-cache.test.ts` | Modified | Covers source-signal hash reuse without reading unchanged project-level files on fast hits. |
| `tests/unit/tui-cli.test.ts` | Modified | Updates interactive theme assertion for true-color ANSI output. |
| `docs/TASK_BOARD.md` | Modified | Marks T-0111 completion. |
| `docs/PROJECT_STATE.md` | Modified | Records frame color/viewer parity follow-up. |
| `docs/DEVELOPMENT_SLICES.md` | Modified | Adds the T-0111 follow-up slice. |
| `docs/V1_0_CAPSULE_BACKLOG.md` | Modified | Records T-0111 as a visual parity refinement. |
| `docs/AGENT_HANDOFF.md` | Modified | Updates validation baseline and next recommended step. |
