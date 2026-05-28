# Decisions

- T-0130 is a planning and release-gate marker capsule, not an executable smoke runner.
- The required matrix rows are Linux source, Linux package, WSL source, Windows source, Windows package, USB portable on Windows, USB portable on WSL, and installed-CLI major-feature smoke.
- `--platform wsl` remains a Linux-style install plan; USB on WSL belongs to the USB matrix row with an explicit mounted removable root.
- Docker/Linux validation is acceptable for local reproducible evidence but cannot replace real Windows validation.
- Package-install matrix rows are planned but blocked until package smoke and release artifacts exist.
- Public matrix evidence must be reduced and must omit raw logs, private absolute paths, private portable-store paths, token values, environment dumps, and USB serial/device identifiers.
- The release gate checks T-0130 markers only; it must not execute install matrix smoke.
- Matrix rows remain Markdown planning markers in T-0130, but T-0131/T-0132 should move growing row/status data into `docs/release-readiness.json` or `src/fixtures/install-matrix.v1.json` with schema `hadara.installMatrix.plan.v1`.
- T-0131 should start with a `core` smoke profile covering `hadara doctor --json`, `hadara status --json`, `hadara task list --json`, `hadara tools list --json`, `hadara tui --snapshot --json`, and `hadara release gate --mode advisory --json`.
- A future `release-readiness` smoke profile can add strict release gate, package smoke evidence, install matrix evidence, and release artifact evidence after those exist.
