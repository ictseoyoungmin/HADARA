# Risks

| Risk | Mitigation |
|---|---|
| Docker/Linux smoke is mistaken for Windows coverage. | Explicitly state that Docker/Linux validation does not replace real Windows validation. |
| USB rows silently assume a drive letter or mount path. | Require explicit user-selected USB roots for USB Windows and USB WSL rows. |
| Matrix evidence leaks private paths, raw logs, USB device details, or token values. | Require reduced public evidence and keep raw logs/private paths temporary or private/local. |
| Release gate starts executing install matrix smoke too early. | Keep the T-0130 gate marker-only and read-only; future evidence-backed gates may read reduced records only. |
| Package rows run before artifacts exist. | Mark package-install rows blocked until package smoke and release artifacts exist. |
