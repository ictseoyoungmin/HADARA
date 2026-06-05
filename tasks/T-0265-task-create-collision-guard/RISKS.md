# Risks

| Risk | Impact | Likelihood | Mitigation | Status |
|---|---|---|---|---|
| Parallel task create chooses the same candidate id. | Duplicate or missing Task Board/capsule state can confuse workers. | Medium | Use non-recursive mkdir as collision point, block the id, and retry bounded times. | Mitigated |
| Task Board already has the candidate id but the capsule dir is missing. | A new capsule could reuse an existing queue id. | Medium | Check Task Board ids before mkdir and skip blocked ids. | Mitigated |
| Retries spin indefinitely under repeated collisions. | CLI may hang or keep mutating partial state. | Low | Bound retries and return `TASK_CREATE_COLLISION_RETRIES_EXHAUSTED`. | Mitigated |
| Template behavior changes. | Task template users may get non-Draft or missing template files. | Low | Reuse existing template write path after directory creation succeeds. | Mitigated |
