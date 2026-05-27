# Context

## Report

Operator feedback after T-0116:

- The mockup Markdown viewer responds well to Up/Down, but production TUI viewer Up/Down can fail.
- When the terminal width is reduced, some colored TUI output appears broken or loses color.

## Findings

Production already handles the basic cursor sequences `ESC [ A` and `ESC [ B`, but it did not handle common alternatives such as application cursor mode `ESC O A/B/C/D` or modifier cursor sequences like `ESC [ 1;2A`.

Production `fitAnsi()` stripped all ANSI escape sequences whenever text exceeded the available width. This kept visible width stable, but clipped colored content lost color in narrow windows. The fix should preserve ANSI sequences while truncating visible cells and appending an ellipsis.

Production Detail document scroll used an unbounded local counter. Rendering clipped the visible slice at the document bottom, but repeated Down after EOF kept increasing the hidden counter, so Up appeared unresponsive until the hidden over-scroll was consumed. The fix should derive the current rendered document max scroll from the same Markdown renderer sizing path and clamp the reducer to that value.

## Constraints

- Keep the TUI read-only.
- Preserve fixed visible terminal widths in snapshot output.
- Keep no-color output deterministic.
