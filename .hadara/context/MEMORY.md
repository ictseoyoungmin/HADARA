# MEMORY

## 2026-06-30 Docker Rebuild

- When the `hadara-dev` container is missing, recreate it with the SOP `docker run -dit --name hadara-dev ... node:22-bookworm bash`.
- On mounted `/mnt/f` workspaces, `docker exec ... tar -C /workspace .` can stall while walking the mount. A faster no-`docker cp` pattern is: create a `/tmp` workdir in the container from `git -c safe.directory=/workspace archive HEAD`, then overlay only changed source/test files with a small `tar -cf - <paths> | tar -xf - -C "$workdir"` before `npm ci`, build, and focused tests.
- Before creating a diff-based validation copy for an uncommitted capsule, ensure new source/test files are included in the overlay path list; task capsule docs usually are not needed for focused code validation.

## 2026-06-30 Legacy Boundary Dogfood

- If 0.4 mutation guards block HADARA-dev itself with `HADARA_PROTOCOL_MISSING`, check whether `.hadara/scaffold.json` exists before weakening product logic. The repository should dogfood the same generic 0.4 scaffold metadata as other supported projects.

## 2026-06-30 Read-Map Dogfood

- Context routing should prioritize read-map `active-task` and `active-spec` entries before current-state docs; otherwise the right source spec can fall outside the default `readFirst` budget even though read-map integration is technically present.

## 2026-06-30 Basic Profile Dogfood

- Finish task-owned prose and HANDOFF wording before close. If a post-close wording edit is needed, run the repair path and append a fresh close proof; otherwise audit-close correctly reports source-hash drift.

## 2026-07-01 Validation Run Dogfood

- Evidence capture and close-source prose sync should be separate by default. If `validation run` both appends evidence and rewrites `TASK.md`, agents can get trapped in a validate-edit-validate loop right before finalize.
- Same-check validation retry resolution should be automatic, but agents still need a latest-attempt projection. After T-0454, the raw evidence is cleaner, yet answering "what is the current validation state?" still requires evidence-list inspection unless `task status` or a dedicated read model groups attempts by check.
- `validation run` can be awkward for wrapping HADARA CLI checks in this sandbox because nested spawn attempts returned `spawnSync node EPERM`/`spawnSync bash EPERM` while direct commands passed. Also, `evidence add-command --task T --help` currently records default evidence instead of showing help. Treat both as agent-UX repair candidates.
- After T-0455, `task status` projects current validation attempts under `sources.evidenceList.validationAttempts`, so agents should prefer that over raw evidence-list inspection. Remaining high-signal UX repairs are command help mutation guards, validation-run wrapper error semantics, and status latency/progress on mounted workspaces.
- After T-0456, `evidence add-command --help` is non-mutating before required `--task` parsing. The remaining high-signal repair from this cluster is `validation run` wrapper error semantics for nested spawn EPERM cases.
- After T-0457, `validation run` blocked wrapper outcomes expose `execution.commandStarted`, `execution.failureKind`, structured `execution.error`, and fallback `nextActions`. Remaining high-signal UX friction is long silent `task status` / `task finalize` execution on mounted workspaces.
- After T-0458, `task status` is the default lifecycle cockpit: no-task `task status --json` selects work through `hadara.task.status.v1`, selected-task status includes `loop.phase` and `loop.primaryNextAction`, and `task next`/`task lifecycle` are compatibility commands planned for removal from the default loop. Next high-signal follow-up is aligning `session start` guidance so it no longer teaches the older split loop.
- After T-0459, `session start` now points to `task status`, `init --help` is read-only, and Source Documents hash validation tolerates Markdown-wrapped path cells. Fresh governed init currently creates 15 files and a 266-line `docs/HADARA_WORKFLOW.md`; it is doctor-clean, but a shorter quickstart view could still be useful. Another observed UX gap is global option ordering: `hadara init --project <path>` works, while `hadara --project <path> init` falls through to default help.
- After T-0461, selected-task `task status` includes read-only `authoringSuggestions` for title cleanup, Source Documents guidance/hash-row proposals, and conservative acceptance guidance. The CLI still does not write task prose or invent task-specific acceptance; agents remain responsible for final task contract wording.
- After T-0462, fresh generated `docs/HADARA_WORKFLOW.md` starts with a compact Quickstart before Minimal Loop. Governed init still creates 15 files and remains doctor-clean, but mounted-workspace `task status` / `task finalize` can still sit silent for long intervals and should be the next UX repair.
