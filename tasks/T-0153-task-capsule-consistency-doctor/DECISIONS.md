# Decisions

| ID | Decision | Status | Rationale | Evidence |
|---|---|---|---|---|
| D-1 | Implement `hadara protocol doctor --task <id> --json` as the first protocol consistency surface. | Accepted | The Phase 2 plan recommends `protocol doctor` for living-project consistency while keeping `init doctor` scoped to bootstrap scaffolds. | `src/cli/protocol.ts` and focused CLI tests. |
| D-2 | Keep T-0153 read-only and task-scoped. | Accepted | Project-wide docs checks, profile drift guidance, remediation, and schema fixture hardening are already split into T-0154 through T-0157. | `docs/DEVELOPMENT_SLICES.md` and T-0153 acceptance. |
| D-3 | Treat warning-only protocol reports as `ok: true` while still rendering warnings in text mode. | Accepted | The Phase 2 exit policy allows warnings-only reports to exit 0, but operators still need visible diagnostics. | `src/cli/protocol.ts`. |
