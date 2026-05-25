# Acceptance Criteria

- [x] Policy tokenizer, presets, command-risk classification, and permission matrix live in focused modules.
- [x] Existing `src/policy/policy.ts` exports remain compatible for current callers.
- [x] Policy tests cover read/test/build/write/network/destructive/release classifications and existing decision behavior.
- [x] Release-risk commands are denied outside release mode and require explicit approval in release mode.
- [x] Auto/trusted network commands require approval.
- [x] Strict release-gate CLI failures set a non-zero process exit code.
- [x] Required tests are recorded.
- [x] Evidence is attached.
- [x] Handoff is updated.
