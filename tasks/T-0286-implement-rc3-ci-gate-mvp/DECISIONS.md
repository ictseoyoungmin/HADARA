# Decisions

| ID | Decision | Status | Rationale | Evidence |
|---|---|---|---|---|
| D-1 | Add optional `--task` to CI gate MVP. | Accepted | It makes local/focused CI checks practical while preserving project-wide default behavior. | Built CLI smoke used `--task T-0285`. |
| D-2 | Advisory mode keeps `ok:true` even when blockers are present. | Accepted | Matches rc3 CI gate spec and lets PR automation surface findings without failing advisory jobs. | Focused tests passed. |
