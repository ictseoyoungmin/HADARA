# Handoff

## Last Completed

T-0090 split shell policy internals into focused tokenizer, safe preset, command-risk, and permission-matrix modules. `src/policy/policy.ts` remains the compatibility facade for existing callers. Policy tests now cover read/test/build/write/network/destructive/release categories. Review follow-up tightened release risk so `npm publish` is denied in auto/trusted mode and requires approval in release mode, made auto/trusted network commands approval-gated, and made strict release-gate CLI failures set exit code 6.

## Next Recommended Step

Continue with Private Evidence Manifest or Active Run Runtime Schema Validation before provider adapters, live dashboard APIs, or release/package execution work.
