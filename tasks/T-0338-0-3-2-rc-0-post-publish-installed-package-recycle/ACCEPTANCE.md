# Acceptance Criteria

| ID | Criterion | Status | Evidence |
|---|---|---|---|
| AC-1 | Installed package reports `0.3.2-rc.0`. | Done | temp-prefix installed bin reported `packageVersion: "0.3.2-rc.0"` |
| AC-2 | Installed `evidence list` text output exposes ids/category/outcome. | Done | `[ev:T-0001:05029b568eb84972838e4b79] ... validation/failed` |
| AC-3 | Installed JSON evidence list exposes id/idSource/idStability/category/outcome/tags. | Done | JSON records exposed `id`, `idSource`, `idStability`, `persistedSchemaVersion`, `category`, `outcome`, and `tags` |
| AC-4 | Installed exact resolution workflow works using durable `ev:` id. | Done | `--resolves ev:T-0001:05029b568eb84972838e4b79` appended passed evidence with exact `resolves:` tag |
| AC-5 | Fresh init/docs smoke passes. | Done | governed init plus `docs required-reading`, `docs list`, and `init doctor` returned `ok:true` |
| AC-6 | Disposable lifecycle smoke passes. | Done | installed-bin lifecycle smoke reached `auditVerdict.verdict: "closed-valid"` |
| AC-7 | Findings are documented. | Done | exact `npx` stale-shim finding recorded in `TESTS.md`, `RISKS.md`, and `HANDOFF.md` |
| AC-8 | Temp folders are removed. | Done | `/tmp/hadara-t0338-recycle` and `/tmp/hadara-npm-cache` removed; follow-up `find` returned no paths |
