# Risks

| Risk | Mitigation |
|---|---|
| Cache is mistaken for committed source of truth. | Cache is constrained to `.hadara/local/tui/`, documented as local acceleration only, excluded from context export, and not registered as a public release-gated schema. |
| Cache writes leak outside the local TUI boundary. | `assertTuiCachePath` rejects roots outside `.hadara/local/tui/`; focused tests cover rejection. |
| Fast cache returns stale task data. | Task index entries include mtime, size, and SHA-256 hash; fast cache invalidates when a task `TASK.md` changes. |
| Detail refresh still scans all capsules. | Detail refresh uses cached task summaries and selected capsule paths; focused tests assert no directory scans during detail refresh. |
| Default read-only TUI behavior starts writing cache unexpectedly. | Cache is opt-in through `--cache`; default interactive mode, `--no-cache`, and snapshot mode stay cache-free. |
