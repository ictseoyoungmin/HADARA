# Decisions

- OD-0003 is treated as mitigated by process and read-model safeguards already present in the repository: required reading, compact handoff with Historical Index, development-slice prerequisite ordering, and context export guidance.
- OD-0008 is treated as mitigated by implemented validation gates rather than by adding mutable debt state: premature acceptance warnings and done-level harness validation now catch the risky state before completion.
- This task keeps debt records static. Durable debt mutation/persistence remains deferred until the portable/project-store boundary is intentionally designed.
