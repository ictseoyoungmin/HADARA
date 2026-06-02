# Decisions

| ID | Decision | Status | Rationale | Evidence |
|---|---|---|---|---|
| D-1 | Close T-0207 through T-0214 as Done before starting Phase 5.7. | Accepted | Phase 5.6 has implementation and validation evidence; leaving it Partial would blur UI reset work with projection architecture work. | T-0207 through T-0214 close/audit-close outputs. |
| D-2 | Stage Phase 5.7 as T-0216 through T-0223, beginning with the projection contract. | Accepted | Contract-first sequencing prevents local projection storage, core routes, and frontend merge behavior from diverging. | `docs/specs/dashboard/HADARA_Dashboard_Read_Model_Performance_Redesign.md`. |
