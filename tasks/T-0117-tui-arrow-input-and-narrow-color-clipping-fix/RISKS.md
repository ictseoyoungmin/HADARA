# Risks

| Risk | Mitigation |
|---|---|
| Additional escape sequence parsing could consume unrelated escape codes. | Match only known arrow forms and keep existing fallback behavior for unknown escape sequences. |
| ANSI-aware clipping could break fixed-width snapshots. | Add a direct `fitAnsi()` visible-width regression and keep snapshot width tests in the focused suite. |
| Detail scroll bounds could drift from renderer sizing and clamp too early or too late. | Compute bounds in `src/tui/snapshot.ts` from the same terminal size, document tab, panel width, row count, and Markdown renderer path used by Detail rendering. |
