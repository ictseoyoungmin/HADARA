# HADARA v0.4.3

HADARA 0.4.3 sharpens the project into a local-first evidence control plane for trustworthy agentic development. The patch focuses on currentness, cross-session continuation, and measurable workflow friction without adding public commands.

Highlights:

- Adds `.hadara/state/current.json` as the compact current release/task/intent/problem/validation source with managed Markdown projections.
- Lets new sessions resume through structured current state and `hadara session start --json` instead of reconstructing the project from historical prose.
- Adds `docs doctor` currentness verdicts and semantic drift detection for state projections, Task Board status, install versions, and removed commands.
- Measures seven product signals across basic, standard, and governed workflows while keeping the normal close path to six primary calls.
- Keeps full agent-controller, default provider runtime, cloud queue, and broad write-capable MCP expansion deferred.

Validation summary:

- Full Docker suite passed 153 files / 1052 tests with 0.4.3 dist current.
- The local tarball installed in 1082ms; installation-to-first-capsule took 1334.44ms and the standard six-call workflow closed-valid.
- Final artifact contents (264 files), package smoke, clean-checkout smoke, strict gate, release dry-run, and docs currentness passed.

Publication boundary:

This note is prepared source content only. npm publish, npm dist-tag changes, GitHub Release creation/publication, Docker/PyPI publication, credential loading, and other deployment mutation require a separate operator-controlled action.
