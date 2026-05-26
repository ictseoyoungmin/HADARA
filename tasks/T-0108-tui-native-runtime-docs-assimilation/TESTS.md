# Tests

## Required

- Documentation parity check: verify the unabridged imported TUI design section in `docs/V1_0_IMPLEMENTATION_SCHEMAS.md` exactly matches `docs/specs/HADARA_TUI_Mockup_Parity_HADARA_Native_Runtime_Design.md`.
- Docker full check: `npm run check`
- Done-level harness validation: `node dist/cli/main.js harness validate --task T-0108 --level done --json --project /workspace`

## Optional

- `git diff --check`
