# Decisions

| ID | Decision | Status | Rationale | Evidence |
|---|---|---|---|---|
| D-1 | Treat T-0385 as docs/readiness alignment only. | Accepted | T-0382/T-0383/T-0384 already handled runtime JSON/UX, smoke, and diagnostics; this capsule should remove drift without changing behavior. | `ev:T-0385:502833bf598b4d31b22d27db` |
| D-2 | Classify mounted broad cache/graph/pack latency as an explicit-command residual for 0.3.3. | Accepted | Default Session Start is bounded and cache-preferential; slow mounted broad commands remain explicit diagnostic/warm/full-profile operations. | `ev:T-0385:502833bf598b4d31b22d27db` |
| D-3 | Route remaining hardening to T-0386 and T-0387. | Accepted | Acceptance parser v2 and final slice/pack security audit are separate approved capsules. | `ev:T-0385:502833bf598b4d31b22d27db` |
