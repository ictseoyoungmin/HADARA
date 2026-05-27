# Context

Relevant documents and constraints:

- `docs/AGENT_HANDOFF.md` recommends reducing high operational debt OD-0003/OD-0008 before treating strict release gate as green.
- `docs/OPERATIONAL_DEBT.md` currently lists OD-0003 and OD-0008 as tracked high debt.
- `src/services/operational-debt.ts` stores debt records statically; debt mutation and persistence remain deferred.
- OD-0003 is mitigated by current required-reading protocol, roadmap slice ordering, active handoff guidance, and context export guidance that steer agents beyond the last capsule.
- OD-0008 is mitigated by premature acceptance detection plus done-level harness validation requiring Done status, completed acceptance, evidence records, handoff sections, Task Board consistency, and scaffold/default-content guards.
- Host Node/npm remains unreliable; use Docker copy-to-`/tmp/hadara` validation.
