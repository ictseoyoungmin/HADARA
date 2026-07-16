# HADARA 0.4.6

HADARA 0.4.6 is a stable release focused on first-user trust polish, delegated-agent onboarding reliability, safer lifecycle closure, and cleaner project initialization after the 0.4.6 release-candidate line.

## Highlights

- Hardened brownfield init adoption:
  - duplicate `.gitignore` HADARA local-state managed blocks fail closed;
  - package-smoke empty-stdout fallbacks are visible in evidence;
  - best-effort project identity inference covers Node, Python, Cargo, and Go project manifests.
- Improved delegated-agent validation and evidence UX:
  - `test` and `tests` are CLI-only aliases for canonical `validation` evidence;
  - unsupported evidence category errors include allowed tokens, aliases, and schema hints;
  - validation command capture uses file-backed capture and direct-result recovery for process-capture edge cases.
- Cleaned up first-project onboarding:
  - stale bootstrap next-work is retired after the first real capsule closes;
  - init docs tell agents to keep generated/project-owned docs current;
  - optional docs can be added with `hadara docs add <type>` instead of expanding init profiles.
- Serialized task id allocation and managed Task Board writes so concurrent external agents can request capsules while HADARA applies writes safely.
- Split HADARA-dev Docker validation helpers:
  - `npm run dev:docker-sync-build` is a fast build/dist-refresh path with stage timings;
  - `npm run dev:docker-check` remains the full validation path.
- Fixed the stable-blocking first-capsule close boundary found in delegated rc.1 dogfood:
  - `task finalize --execute --auto` now treats finish writes atomically before close checks;
  - validation placeholder semantics allow deliberate pre-close validation rows;
  - delegated Codex rerun closed both an adoption baseline and a Quant Battle Arena MVP feature capsule without hand-editing lifecycle-owned status fields.

## Validation

- 0.4.6-rc.0 and 0.4.6-rc.1 were published and dogfooded before this stable preparation.
- T-0625 reproduced the delegated first-capsule close blocker from a current package candidate.
- T-0626 and T-0627 fixed the close-boundary and validation placeholder issues.
- T-0628 reran delegated Codex dogfood from a clean external governed project and produced valid close proof for both baseline and MVP feature capsules.
- T-0629 refreshed source metadata, release docs, built `dist`, package smoke, and strict release gate for stable `0.4.6`.

## Operator Notes

- npm stable target: `hadara@0.4.6` on dist-tag `latest`.
- GitHub Release target: `v0.4.6`.
- After publication, run installed-package recycle from `hadara@latest` with expected version `0.4.6`.
