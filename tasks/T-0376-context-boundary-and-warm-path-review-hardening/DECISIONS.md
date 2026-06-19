# Decisions

| ID | Decision | Status | Rationale | Evidence |
|---|---|---|---|---|
| D-1 | Batch review items 1-4 in T-0376, then return to C6 incremental/code-index or bounded C5 work. | Accepted | The items are bounded hardening fixes across existing surfaces and should not become a new design program. | User instruction |
| D-2 | Keep acceptance parser v2 out of this task. | Accepted | Lifecycle close contract redesign needs a structured parser design rather than adding more ad-hoc incomplete status strings. | Review feedback |
| D-3 | Preserve compatibility `suggestedCommand` while adding structured `suggestedCommandArgs`. | Accepted | Existing consumers can keep rendering command strings while safer clients avoid shell quoting. | Review feedback |
| D-4 | Deny `.hadara/**` raw slices by default with a small public-context allowlist. | Accepted | Cache/private/generated local state is not source truth, while docs registry and HADARA context are canonical public project context. | `ev:T-0376:fc7d0da873a64f9b879d6f84` |
| D-5 | Test benchmark timeout hardening as a script contract rather than a timing-dependent child-process integration test. | Accepted | The benchmark remains dev-only; contract coverage avoids flaky timing while preserving SIGTERM/SIGKILL/error/killedSignal requirements. | `ev:T-0376:fc7d0da873a64f9b879d6f84` |
