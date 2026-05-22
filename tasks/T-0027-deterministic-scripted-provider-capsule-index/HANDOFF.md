# Handoff

## Last Completed

- Updated `ScriptedProvider` to consume script steps sequentially.
- Added current-step mismatch errors as non-retriable structured provider errors.
- Updated Task Capsule creation to create empty `evidence.jsonl`.
- Updated regressions for provider sequence behavior, missing evidence index validation, and no-tool evidence attachment behavior.
- Docker `npm ci && npm run check` passed: 20 test files passed, 89 tests passed.
- Docker built CLI `harness validate --task T-0027 --json` returned `ok: true`.
- Docker built CLI smoke confirmed new capsules have an empty `evidence.jsonl`.

## Next Recommended Step

Consider P1 feedback next: init profiles or done-level harness validation.
