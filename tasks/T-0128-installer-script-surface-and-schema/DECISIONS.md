# Decisions

- Introduce `docs/RELEASE_READINESS.md` as the dedicated tracked source for T-0128+ release/install/package readiness details.
- Reserve installer script paths `scripts/install.sh` and `scripts/install.ps1`, but do not create them in T-0128.
- Reserve portable launcher paths `portable/bin/hadara`, `portable/bin/hadara.cmd`, and `portable/bin/hadara.ps1`, but do not create them in T-0128.
- POSIX default install target is `~/.local/share/hadara`; POSIX launcher link target is `~/.local/bin/hadara`.
- Windows default install target is `%LOCALAPPDATA%\HADARA`; launcher paths are `%LOCALAPPDATA%\HADARA\bin\hadara.cmd` and `%LOCALAPPDATA%\HADARA\bin\hadara.ps1`.
- USB portable examples are `L:\HADARA` for Windows and `/mnt/l/HADARA` for WSL.
- Installers must validate Node 22 and WSL must reject Windows `node.exe` shims in favor of Linux Node.js.
- Future dry-run installer reports use `hadara.install.plan.v1`.
- Public install-plan target paths use path-reference objects, not raw strings: `target.prefix.displayPath`, `target.prefix.pathRedacted: true`, `target.launcher.displayPath`, and `target.launcher.pathRedacted: true`.
- Source path details in public install-plan output must use `source.pathRedacted: true`; raw private absolute paths, private store paths, raw logs, and environment values stay out of public output.
- `mode: execute` remains schema-reserved only. T-0129 dry-run implementation must reject execute mode or return `INSTALL_EXECUTION_DISABLED` until a later capsule explicitly authorizes installer mutation.
- T-0128 performs no install mutation, package execution, publish, registry login, token handling, or release deployment.
