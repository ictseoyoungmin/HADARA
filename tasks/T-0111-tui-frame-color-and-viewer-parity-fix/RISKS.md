# Risks

| Risk | Mitigation |
|---|---|
| True-color ANSI sequences could break width calculations. | Existing ANSI stripping handles `38;2`/`48;2`; focused tests assert visible width for color snapshots. |
| Viewer styling could alter no-color snapshots. | Detail colorization returns original lines when theme is `none`; deterministic no-color snapshot tests still pass. |
| Badge background/foreground composition could reset incorrectly. | Added a single `tuiSwatch()` helper and regression tests for RGB badge sequences. |
| Rendering full documents before slicing could be heavier for very large capsule docs. | Scope is selected-task detail only; future optimization can cache rendered document rows if needed. |
| Compact tab labels could reduce discoverability. | Key letters and file names remain visible in active document/title context, matching the mockup's dense detail strip. |
| Reusing source-signal hashes on unchanged `mtimeMs`/`size` could miss content changes where both metadata fields are deliberately preserved. | This matches the intended fast-path tradeoff; files are rehashed whenever `mtimeMs` or `size` differs, preserving normal correctness while avoiding unnecessary reads. |
