# Files

| Path | Action | Reason |
|---|---|---|
| src/core/paths.ts | Updated | Harden path normalization, default portable store location, project data boundary, and realpath containment. |
| tests/unit/paths.test.ts | Updated | Cover env priority, Windows normalization, symlink escape, and project data boundary behavior. |
| .gitignore | Updated | Ignore `.hadara/local/` for machine-local portable fallback state. |
