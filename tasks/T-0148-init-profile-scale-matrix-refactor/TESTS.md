# Tests

## Required

- Docker focused `npx vitest run tests/unit/init.test.ts` passed with 1 file and 8 tests.
- Docker `npm run check` passed with 57 files and 410 tests.
- Built CLI `hadara init` smoke for `basic`, default `standard`, and `governed` passed; unsupported profile rejection was also confirmed.
- Docker grep check found no old init profile-name references outside excluded backlog files.
- Built CLI done-level harness validation for T-0148 passed with `ok: true` and no issues.
- Final clean-copy validation repeated Docker `npm run check`, built CLI init smoke, grep check, and done-level harness validation successfully after compatibility aliases were removed.

## Optional

- Generated file lists were inspected during the built CLI smoke.
