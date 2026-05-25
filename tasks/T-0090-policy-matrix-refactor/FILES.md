# Files

| Path | Action | Reason |
|---|---|---|
| `src/policy/tokenizer.ts` | Add | Focus shell tokenization logic. |
| `src/policy/presets.ts` | Add | Define exact safe command presets with command-risk metadata. |
| `src/policy/command-risk.ts` | Add | Classify shell commands into matrix risk categories. |
| `src/policy/permission-matrix.ts` | Add | Map permission mode and command risk to policy decisions. |
| `src/policy/policy.ts` | Update | Preserve public policy API while delegating to focused modules. |
| `tests/unit/policy.test.ts` | Update | Cover policy matrix categories and existing behavior. |
| `tasks/T-0090-policy-matrix-refactor/*` | Update | Track capsule scope, tests, evidence, and handoff. |
