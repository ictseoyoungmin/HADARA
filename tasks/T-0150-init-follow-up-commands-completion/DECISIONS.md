# Decisions

| Decision | Rationale |
|---|---|
| Keep follow-up init write commands dry-run by default with explicit `--execute`. | The follow-ups operate on scaffold docs and must not overwrite user edits. |
| Consolidate the five Phase 1 follow-ups into one command-family capsule. | They share init profile/doc-table helpers and are safer to validate together. |
| Make default `hadara init` lazy for runtime stores. | Project scaffold generation should not create private/local runtime data until a runtime feature needs it. |
