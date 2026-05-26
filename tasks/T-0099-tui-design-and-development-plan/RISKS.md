# Risks

| Risk | Mitigation |
|---|---|
| TUI scope accidentally becomes another dashboard or write surface. | Document it as a read-only terminal work console that consumes existing CLI/shared read models and never mutates state in the initial implementation. |
| TUI framework choice adds heavy dependency or terminal portability risk. | Start with TypeScript + Node standard ANSI rendering and small internal modules; defer Ink/Blessed adoption until a later capsule proves the dependency is worth it. |
| TUI docs drift from dashboard/API boundaries. | Link TUI docs to dashboard notes, CLI JSON/read models, and roadmap slices rather than inventing a separate source of truth. |
| Mockup cache writes are mistaken for committed project state. | Production plan keeps any terminal UI cache under ignored local state and excludes it from Task Capsule evidence unless explicitly attached. |
