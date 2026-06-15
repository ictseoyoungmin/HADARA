# rc1 Capsule 3 - Installed-Package Findings Cleanup

## Capsule Goal

Resolve or clarify the T-0317 installed-package recycle findings before a 0.3.1 release candidate is prepared.

## Scope

| In Scope | Notes |
|---|---|
| Document temp-prefix installed-bin validation as canonical when PATH may be stale. | Prevents exact npx ambiguity from blocking valid package proof. |
| Investigate whether runtime version output can better explain executed path trust. | Optional if documentation is sufficient. |
| Fix governed generated docs doctor warnings if they are avoidable. | Historical docs should not be default Required Reading. |
| Update known problems after findings are resolved or reclassified. | Keep handoff current. |

## Out of Scope

| Out of Scope | Reason |
|---|---|
| npm publish. | Findings are not release mutation. |
| Network-dependent test as required close proof. | Network may be unavailable. |
| Replacing npx behavior. | npm/npx behavior is external. |

## Files Likely to Change

```text
README.md or release validation docs
docs/TEST_STRATEGY.md
src/cli/init.ts or docs registry seed files
tests/unit/docs-doctor.test.ts
tests/unit/docs-required-reading.test.ts
tests/unit/init.test.ts
docs/AGENT_HANDOFF.md
```

## Tests

```bash
npm run test:focused -- tests/unit/init.test.ts tests/unit/docs-doctor.test.ts tests/unit/docs-required-reading.test.ts
git diff --check
```

Optional installed-package smoke:

```bash
tmp="$(mktemp -d)"
npm --prefix "$tmp" install hadara@0.3.0
"$tmp/node_modules/.bin/hadara" version --json
```

Record network failures honestly as environment evidence.

## Done Criteria

| ID | Criterion |
|---|---|
| DC-1 | T-0317 exact npx finding is resolved or documented as environment/path-trust behavior. |
| DC-2 | Temp-prefix installed-bin path is documented as canonical consumer proof. |
| DC-3 | Fresh governed docs doctor warning is removed or intentionally documented. |
| DC-4 | Handoff known problems reflect the new state. |
