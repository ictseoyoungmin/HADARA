# Decisions

| ID | Decision | Status | Rationale | Evidence |
|---|---|---|---|---|
| D-1 | Extend `src/services/capability-registry.ts` rather than creating a separate command registry file. | Accepted | Phase 7.1 requires exactly one authoritative inventory and explicitly disallows `src/cli/command-registry.ts`. | `docs/specs/0.3.0/02_Phase_7_1_Command_Surface_Registry_and_Structured_Help.md` |
| D-2 | Keep existing command handlers behavior-compatible and route only discovery/help surfaces through new helpers. | Accepted | Phase 7.1 non-goal is changing command behavior; this capsule should be discovery/help focused. | `TASK.md` scope |
