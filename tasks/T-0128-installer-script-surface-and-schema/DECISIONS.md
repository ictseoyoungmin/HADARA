# Decisions

- Introduce `docs/RELEASE_READINESS.md` as the dedicated tracked source for T-0128+ release/install/package readiness details.
- Reserve installer script paths `scripts/install.sh` and `scripts/install.ps1`, but do not create them in T-0128.
- Reserve portable launcher paths `portable/bin/hadara`, `portable/bin/hadara.cmd`, and `portable/bin/hadara.ps1`, but do not create them in T-0128.
- POSIX default install target is `~/.local/share/hadara`; POSIX launcher link target is `~/.local/bin/hadara`.
- Windows default install target is `%LOCALAPPDATA%\HADARA`; launcher paths are `%LOCALAPPDATA%\HADARA\bin\hadara.cmd` and `%LOCALAPPDATA%\HADARA\bin\hadara.ps1`.
- USB portable examples are `L:\HADARA` for Windows and `/mnt/l/HADARA` for WSL.
- Installers must validate Node 22 and WSL must reject Windows `node.exe` shims in favor of Linux Node.js.
- Future dry-run installer reports use `hadara.install.plan.v1`.
- T-0128 performs no install mutation, package execution, publish, registry login, token handling, or release deployment.
