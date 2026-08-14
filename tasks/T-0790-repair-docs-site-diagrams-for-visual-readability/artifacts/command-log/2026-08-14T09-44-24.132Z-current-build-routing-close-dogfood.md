# Current-build routing and close dogfood

## Scope

This report reduces the current rebuilt CLI checks run on 2026-08-14. The disposable project lived under `/tmp` and was not retained. Paths below are project-relative or logical placeholders; no private machine state is required to interpret the result.

## Runtime identity

| Field | Value |
|---|---|
| Package version | `0.5.0-rc.6` |
| CLI entry | rebuilt `dist/cli/main.js` |
| Source HEAD observed by version smoke | `7c03767f519ab86ab3b69dda9c7c975f17f99ef8` |
| Dist stale check | `false` |
| Isolation | fresh standard Init v1 project under `/tmp` |

The source changes in T-0791 intentionally invalidate the previously prepared RC6 release-input identity. The version remains `0.5.0-rc.6` only because this is pre-publication development dogfood, not a publishable retained candidate.

## Init and routing checks

| Check | Result |
|---|---|
| `init --preset standard` dry-run | Passed; 9 planned artifacts; reviewed plan hash `sha256:189b683cdcf01c20cd21a30263146b40766072275343184eb8544b8485409c2a`. |
| Reviewed Init execute | Passed; 9 artifacts created and transaction state cleaned. |
| `init doctor --json` | Passed with zero issues. |
| Generated workflow vocabulary | Contains `--preset minimal`, `--preset standard`, and `--preset governed`; contains no current `hadara init --profile` example. |
| Generated AGENTS routing | Workflow is every-session; Task Board and READ_MAP are CLI-unavailable/audit fallbacks. |
| `docs read-map --task T-0001 --json` | AGENTS, workflow, and active Task Capsule are `readFirst`; Task Board and READ_MAP are `doNotReadByDefault`. |

## Selected status mutation metadata

Before evidence existed, full selected-task status returned the following `add-command-evidence` action:

```json
{
  "id": "add-command-evidence",
  "writeBoundary": "evidence-append",
  "requiresReview": true,
  "writes": true
}
```

This agrees with the command's append-only mutation boundary and no longer describes the evidence command as read-only.

## T-0001 reviewed close and idempotent retry

| Stage | Result |
|---|---|
| Canonical validation evidence | `ev:T-0001:5c4b51fa2573402e94ac424a` |
| Close dry-run | Returned reviewed execute command with plan hash `sha256:a9281a6d3c7fd2ed347db5326ec6bcf6e8cdc998693b2fe9bff1b012af136a12`; no `--dry-run` or internal `--auto` leaked into the public action. |
| Reviewed execute | `closed-valid`, terminal, proof last, three task-local files updated, two evidence appends, close proof appended. |
| Same-close retry | `closed-valid`; executed writes `0`; executed file writes `0`; evidence appends `0`; `closeProofAppended=false`; `idempotentNoop=true`. |
| Fresh selected status | `phase=closed-valid`, terminal, zero next actions, no primary next action. |
| Evidence lint | Passed; 3 records, 0 errors, 0 warnings. |

## T-0002 virtual post-write HANDOFF preflight

The fixture used a valid terminal/no pre-close row and a deliberately invalid post-close `actionable/no` row.

| File | SHA-256 before dry-run | SHA-256 after dry-run |
|---|---|---|
| `TASK.md` | `778e0780fb87f351f1dbb643a2f6b9b24947c0548b3ee0c5246921a0d6f83827` | same |
| `HANDOFF.md` | `1415d6aadb3fd5b0c827530a018252d998a51f8c4590bf534ca2985b9dca8ce4` | same |
| `evidence.jsonl` | `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855` | same |
| `docs/TASK_BOARD.md` | `1a793034aa8d08250ed641839e333f38f5325e899da405b9464810e23f57063a` | same |

The close report returned `HANDOFF_CONTINUATION_SEMANTIC_CONFLICT`, `plannedWrites=0`, `executedWrites=0`, `evidenceAppends=0`, and no `.hadara/local/task-close/T-0002.json` operation marker. After changing the post-close row to terminal/no, canonical evidence `ev:T-0002:6cd225b73ac142dea3d4c5c5` was recorded and ordinary compact close returned `closed-valid` with close proof appended.

## Repository validation attempts

| Attempt | Outcome | Resolution |
|---|---|---|
| Host `npm run build` | Failed: workspace `dist/` is container-owned; the same attempt also exposed one TypeScript boundary mismatch, which was fixed. | `npx tsc -p tsconfig.json --noEmit` passed; Docker sync build passed and refreshed `dist`. |
| First Docker `npm run check` | Failed 1 of 1,070 core tests: an existing proof-guard assertion was missing `stoppedAt` under that loaded run. | The test passed alone, the complete 61-test close file passed, and the repeated full gate passed. |
| Final Docker `npm run check` | Passed. | Build and tools typecheck passed; core suite 131 files / 1,070 tests passed; HADARA-dev suite 18 files / 145 tests passed. |

## Conclusion

All five T-0791 P1 findings are resolved in current source and rebuilt CLI behavior. Fresh generated documents now agree with canonical routing, evidence mutation metadata is explicit, public close guidance carries the reviewed plan hash, invalid post-close continuation semantics fail before durable lifecycle writes, and repaired work closes and retries idempotently.
