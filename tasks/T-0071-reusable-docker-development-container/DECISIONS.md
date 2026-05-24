# Decisions

- New Task Capsules should be created with HADARA CLI by default.
- The reusable container is named `hadara-dev`.
- Dependency-heavy work should happen in `/tmp/hadara`, while CLI writes target `/workspace` with `--project /workspace`.
