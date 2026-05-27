# Decisions

- Done-level validation should reject exact scaffold/default leftovers, while draft-level validation remains structural.
- The guard should report file-specific issue codes so future agents can tell which capsule document still needs task-specific content.
- Scaffold/default detection should live beside the Task Capsule scaffold templates, so `hadara task create` and `harness validate --level done` share one source of truth.
