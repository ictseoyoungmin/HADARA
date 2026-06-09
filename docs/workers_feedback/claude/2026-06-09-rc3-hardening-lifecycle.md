# Worker Feedback — HADARA Framework & Lifecycle

| Field | Value |
|---|---|
| Author | Claude (Opus 4.8), worker agent |
| Date | 2026-06-09 |
| HADARA version | 0.2.0-rc.3 |
| Context tasks | T-0288 rc3 proof reliability hardening patch (implement + full lifecycle close) |
| Surfaces exercised | `task create/finish/ready/close/audit-close`, `evidence add-command`, `ci gate`, `proof status`, evidence append internals, close-source hashing, Docker/`/tmp` validation baselines |

This is observed-from-use feedback, not a spec review. Each item is something that
actually helped or actually cost time during T-0288.

## Strengths (kept me honest and unblocked)

| # | Strength | Why it mattered in practice |
|---|---|---|
| S1 | Three-phase close model (validation proves → close records → audit checks). | The fixed-point problem (recording validation mutates the thing being validated) is genuinely solved. `close --execute` then `audit-close` returning `closed-valid` was unambiguous. I never had to guess whether "done" meant "validated". |
| S2 | Close-source hash scope is narrow and explicit. | The close hash covers capsule docs + `docs/TASK_BOARD.md` only. This let me update `docs/AGENT_HANDOFF.md` and `docs/PROJECT_STATE.md` *after* close and re-run `audit-close` with the verdict staying `closed-valid`. Knowing exactly what invalidates a close proof is a real productivity win. |
| S3 | Evidence idempotency keys. | Re-running the same logical check (or re-recording across retries) is a safe no-op. I leaned on this to record evidence repeatedly without polluting the capsule. The keyless-vs-keyed distinction (keyless stays append-only) is the right default. |
| S4 | Read-only vs write separation + dry-run-first. | `finish`/`close` dry-run before `--execute`, `ready` as a pure preflight. I could inspect the plan and blockers with zero risk before any mutation. |
| S5 | Evidence-backed validation with a documented `/tmp` npm-ci fallback. | When the `hadara-dev` container was initially absent, the `/tmp` copy + `npm ci` path (precedent T-0284) let me produce a genuine full-suite result (103 files / 692 tests) instead of hand-waving. The protocol anticipating "Docker unavailable" is unusually mature. |

## Improvements

### Structural

| # | Gap | Observed cost | Suggested direction |
|---|---|---|---|
| I1 | **State-doc drift across `PROJECT_STATE.md` / `AGENT_HANDOFF.md` / `TASK.md`.** | After closing T-0288, `TASK.md` and `AGENT_HANDOFF.md` said T-0288 was latest, but `PROJECT_STATE.md` still said T-0287. The reviewer caught it; the lifecycle did not. `task finish` only touches `TASK.md` + `TASK_BOARD.md` by design, so the broad prose docs silently drift. | Extend the `task finish`/`task close` advisory (the T-0237 `stateDocs` diagnostic) to detect "Latest Completed Task" mismatch between `PROJECT_STATE.md`, `AGENT_HANDOFF.md`, and the Task Board / closed task. It stays advisory and read-only, but it would have surfaced this exact drift before publish. |
| I2 | **Evidence append is lock-serialized but not crash-atomic.** | `EVIDENCE.md` and `evidence.jsonl` are two separate appends inside one lock. A crash between them leaves a half-written pair. This is fine for rc3 but is a latent integrity gap in the very subsystem rc3 is hardening. | Make `evidence.jsonl` the canonical source and treat `EVIDENCE.md` as a rebuildable human summary, or write a tiny journal entry before the pair and clear it after. An `evidence lint` check for Markdown/JSONL asymmetry would catch existing skew cheaply in the meantime. |
| I3 | **Aggregate gates need a first-class "what did I actually validate" assertion.** | `ci gate --mode strict` could return `ok:true` while validating zero tasks (the empty-scope bug fixed in T-0288). The root cause is that `ok` was derived purely from `blockers.length`, with no invariant that the scope was non-empty. | Any aggregate gate should always emit an explicit scope/coverage check and treat "validated nothing" as a non-pass unless an explicit opt-out (`--allow-empty`) is set. Worth encoding as a shared pattern so future gates do not re-introduce it. |
| I4 | **Volatile close-evidence ids vs close-source docs is a sharp edge.** | The SOP correctly warns not to paste close evidence ids into close-source docs (they change the source hash and self-invalidate the close). It is easy to trip because it is a documentation convention, not an enforced one. | A `task close`/`audit-close` lint that flags `ev:T-XXXX:...` close-evidence ids appearing inside close-source docs would convert a convention into a guard. |

### Partial / smaller

| # | Gap | Note |
|---|---|---|
| I5 | Lifecycle ceremony is long for a small patch. | `finish` (dry+execute) → `ready` → `close` (dry+execute) → `audit-close` is five-plus invocations. `task complete` compresses *reporting* but intentionally has no execute mode. A guarded `task complete --execute` that still runs each step dry-run-first would cut ceremony without weakening governance — acknowledged as deliberately deferred Phase 6 scope. |
| I6 | Source changes do not flag release-evidence staleness. | T-0288 modified `src/evidence`, `src/services`, CLI files, but nothing in the close path reminded me that package smoke / clean-checkout / release artifact evidence is now stale relative to the new source. The reviewer flagged it. A release-readiness advisory keyed on "source changed since last release artifact evidence" would close the loop. |
| I7 | Host validation requires Docker or a `/tmp` npm-ci copy. | The repo ships no committed `node_modules` and host `npm ci` on the mounted FS is unreliable, so there is no zero-setup local `npm test`. This is understandable (portability/boundary), but the friction is real for a first-time worker. The Docker workflow docs mitigate it well once found. |

## Net assessment

The proof/continuity core is strong and the close/audit model is the standout design.
The recurring theme in the gaps (I1, I3, I6) is the same shape: **bookkeeping that lives
in prose or in a human convention drifts, while bookkeeping that lives in a hashed/validated
artifact does not.** The highest-leverage improvement would be to pull "latest completed
task" continuity and "release evidence freshness vs source" into the same kind of
read-only, hash-aware advisory that already makes the close model trustworthy.
