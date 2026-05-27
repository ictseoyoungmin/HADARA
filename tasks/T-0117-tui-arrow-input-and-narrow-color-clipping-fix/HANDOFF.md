# Handoff

## Last Completed

T-0117 is complete. Production TUI input decoding now handles basic cursor arrows, application-cursor arrows (`ESC O A/B/C/D`), and modifier cursor arrows such as `ESC [ 1;2A`, so Detail viewer Up/Down receives the intended local scroll keys across more terminals. Detail document scrolling now clamps to the renderer-derived bottom, so holding Down at EOF no longer accumulates hidden scroll debt before Up responds. Narrow-width colored text now uses ANSI-preserving clipping instead of stripping color sequences when content is truncated.

## Next Recommended Step

Continue with the Release and Packaging Track unless fresh operator feedback identifies another high-impact TUI parity gap.
