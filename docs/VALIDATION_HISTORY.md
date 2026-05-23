# VALIDATION_HISTORY

Historical validation entries moved out of `docs/AGENT_HANDOFF.md` during T-0040 handoff compaction.

## Baseline Notes

- Docker is the working validation path in this environment.
- Host WSL Node/npm shims are unreliable.
- Copying the `/mnt/f` workspace into the container filesystem before `npm ci` avoids mounted-filesystem symlink issues.
- Current dev dependencies report 5 moderate npm audit findings; do not run `npm audit fix --force` without reviewing version impact.

## Historical Validation Entries

- Verified Docker `npm ci && npm run check`: 16 test files passed, 64 tests passed.
- Verified Docker `hadara harness validate --task T-0019 --json`: `ok: true` after capsule doc normalization.
- Verified Docker `hadara harness validate --task T-0020 --json`: `ok: true`.
- Verified Docker `hadara run ... --json`: `ok: true` with fake shell observation.
- Verified Docker `hadara harness validate --task T-0021 --json`: `ok: true`, including `evidence.jsonl` in `checkedFiles`.
- Verified Docker `hadara harness validate --task T-0022 --json`: `ok: true`, including `evidence.jsonl` in `checkedFiles`.
- Verified Docker read-only mount `npm ci && npm run check`: 18 test files passed, 74 tests passed.
- Verified Docker `node dist/cli/main.js harness validate --task T-0023 --json`: `ok: true`, including `evidence.jsonl` in `checkedFiles`.
- Verified Docker read-only mount `npm ci && npm run check`: 18 test files passed, 78 tests passed.
- Verified Docker `node dist/cli/main.js harness validate --task T-0024 --json`: `ok: true`, including `evidence.jsonl` in `checkedFiles`.
- Verified Docker read-only mount `npm ci && npm run check`: 19 test files passed, 84 tests passed.
- Verified built CLI JSON smoke for malformed `run --script --json --json`: stable `agent.loop` JSON issue returned.
- Verified Docker `node dist/cli/main.js harness validate --task T-0025 --json`: `ok: true`, including `evidence.jsonl` in `checkedFiles`.
- Docker check after T-0033: 21 test files passed, 97 tests passed.
- Built CLI evidence collect JSON/text smokes passed after extraction.
- Docker `node dist/cli/main.js harness validate --task T-0033 --level done --json`: `ok: true`, including `evidence.jsonl` in `checkedFiles`.
- Docker check after T-0034: 21 test files passed, 97 tests passed.
- Built CLI policy check-shell/preflight-shell JSON/text smokes passed after extraction.
- Docker `node dist/cli/main.js harness validate --task T-0034 --level done --json`: `ok: true`, including `evidence.jsonl` in `checkedFiles`.
- Docker check after T-0035: 21 test files passed, 97 tests passed.
- Built CLI Hermes detect/export-context JSON/text smokes and handoff update smoke passed after extraction.
- Docker `node dist/cli/main.js harness validate --task T-0035 --level done --json`: `ok: true`, including `evidence.jsonl` in `checkedFiles`.
- Docker check after T-0036: 21 test files passed, 97 tests passed.
- Built CLI init, doctor, task, mcp, run scaffold, and scaffolded run smokes passed after extraction.
- Docker `node dist/cli/main.js harness validate --task T-0036 --level done --json`: `ok: true`, including `evidence.jsonl` in `checkedFiles`.
- Docker check after T-0037: 21 test files passed, 105 tests passed.
- Built CLI hardening smokes passed for invalid mode, invalid evidence result, duplicate scaffold, and non-zero fake-shell run failure.
- Docker `node dist/cli/main.js harness validate --task T-0037 --level done --json`: `ok: true`, including `evidence.jsonl` in `checkedFiles`.
- Docker check after T-0038: 22 test files passed, 108 tests passed.
- Built CLI JSON error smokes passed for invalid mode, result, level, project, and missing task inputs.
- Docker `node dist/cli/main.js harness validate --task T-0038 --level done --json`: `ok: true`, including `evidence.jsonl` in `checkedFiles`.
- Docker check after T-0039: 22 test files passed, 109 tests passed.
- Built CLI policy exactness smoke passed for `npm run check extra --mode auto --json`.
- Docker `node dist/cli/main.js harness validate --task T-0039 --level done --json`: `ok: true`, including `evidence.jsonl` in `checkedFiles`.
- Docker check after T-0040: 22 test files passed, 109 tests passed.
- Docker `node dist/cli/main.js harness validate --task T-0040 --level done --json`: `ok: true`, including `evidence.jsonl` in `checkedFiles`.
- Docker check after T-0041: 22 test files passed, 109 tests passed.
- Docker `node dist/cli/main.js harness validate --task T-0041 --level done --json`: `ok: true`, including `evidence.jsonl` in `checkedFiles`.
- Docker check after T-0042: 22 test files passed, 109 tests passed.
- Docker `node dist/cli/main.js harness validate --task T-0042 --level done --json`: `ok: true`, including `evidence.jsonl` in `checkedFiles`.
- Docker check after T-0042 follow-up contract/schema changes: 22 test files passed, 109 tests passed.
- Docker `node dist/cli/main.js harness validate --task T-0042 --level done --json` after follow-up changes: `ok: true`, including `evidence.jsonl` in `checkedFiles`.
- Docker check after T-0050/T-0051/T-0052: 27 test files passed, 142 tests passed.
- Docker focused MCP tests after T-0050/T-0051/T-0052: guard, safety, and server metadata suites passed with 20 tests.
- Docker `node dist/cli/main.js harness validate --task T-0050 --level done --json`, `--task T-0051 --level done --json`, and `--task T-0052 --level done --json` returned `ok: true`.
- Docker check after T-0053: 28 test files passed, 144 tests passed.
- Docker built CLI `status --json` and `ops status --json` returned `hadara.ops.status.v1`.
- Docker `node dist/cli/main.js harness validate --task T-0053 --level done --json` returned `ok: true`.
- Docker check after T-0054: 28 test files passed, 147 tests passed.
- Docker built CLI `status --json` returned stable counts, `rawStatusCounts`, and `issues`.
- Docker `node dist/cli/main.js harness validate --task T-0054 --level done --json` returned `ok: true`.
- Docker check after T-0055: 28 test files passed, 148 tests passed.
- Docker built CLI `status --json` returned `health`, `rawStatusCounts`, and `normalizedStatusCounts`.
- Docker `node dist/cli/main.js harness validate --task T-0055 --level done --json` returned `ok: true`.
