# Decisions

| ID | Decision | Status | Rationale | Evidence |
|---|---|---|---|---|
| D-1 | Choose Option B: Preact + CSS tokens built to a single self-contained static asset. | Accepted | The commercial-grade bar needs a real component/token system; a single inlined bundle preserves CSP and the static serve route. | docs/DECISIONS.md D-0011. |
| D-2 | Resolve build deps via DASH_DEPS / Docker rather than in-place install. | Accepted | NTFS workspace cannot host npm install (EPERM). | scripts/dashboard-build.sh. |
