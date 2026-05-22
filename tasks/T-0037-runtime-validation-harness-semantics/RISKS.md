# Risks

| Risk | Mitigation |
|---|---|
| Tightening fake-shell semantics may change expected run outcomes. | Add explicit regression tests for successful and failed fake-shell observations. |
| Stale scaffold rejection changes repeated command behavior. | Preserve first-run behavior and add a clear duplicate scenario error. |
| Evidence enum validation could flag old malformed records. | The stricter behavior is intentional and covered by harness tests. |
