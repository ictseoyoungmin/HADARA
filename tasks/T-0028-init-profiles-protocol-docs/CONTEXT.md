# Context

Feedback after T-0027 called out that `hadara init` is too thin for toy projects:

- `docs/ARCHITECTURE.md` may be missing even though Hermes context export reads it.
- `docs/IMPLEMENTATION_SOP.md` and `docs/DEVELOPMENT_SLICES.md` are important to the HADARA protocol but are not generated for new projects.
- Current recommendation: use `hadara init --profile basic|standard|governed`.

This task focuses on initialization ergonomics only.
