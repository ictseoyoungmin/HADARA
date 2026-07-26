# EVIDENCE

This file is a human-readable projection from `evidence.jsonl`.

Do not hand-edit this file.

## Validation Evidence

<!-- hadara:slot evidence.validation-summary -->
| Evidence ID | Outcome | Category | Summary |
|---|---|---|---|
| ev:T-0702:a1508bd12c0340fdad9da779 | passed | validation | Validation "Docker clean full check" passed; command: npm run dev:docker-check; exitCode: 0; signal: null; durationMs: 97527; stdoutHash: sha256:3772f44a69a996bfb72c2f843405040fad96e5bbb703570798d02e8fea59b4ce; stderrHash: sha256:83c0263b610c9fbf5fe51f592edadadd823a4ae988fd7360ab9fe59fb4d3e637 |
| ev:T-0702:90af75bb32cf424598a1ddab | passed | release | hadara release artifact --execute --attach-evidence --json generated tarball/checksum/manifest metadata, retained public report artifact, and emitted hadara.releaseArtifact.v1. |
| ev:T-0702:62a86a87d37144d7a81dee6f | passed | validation | Validation "Built CLI smoke and version verification" passed; command: node dist/cli/main.js version --verbose --json --project .; exitCode: 0; signal: null; durationMs: 1458; stdoutHash: sha256:c1ce089f1cf28443edf39d934216cbf07e91459ec355c54431510ee8deb9c15d; stderrHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855 |
| ev:T-0702:3cd630eb99e0451c9868ba3a | passed | validation | Validation "Repository hygiene" passed; command: git diff --check; exitCode: 0; signal: null; durationMs: 4305; stdoutHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855; stderrHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855 |
| ev:T-0702:65150d5d65734fe7874e36eb | passed | validation | Validation "Dependency metadata consistency" passed; command: node -e const fs=require("node:fs"); const p=JSON.parse(fs.readFileSync("package.json","utf8")); const l=JSON.parse(fs.readFileSync("package-lock.json","utf8")); const expected=Object.keys(p.devDependencies//{}).sort(); const actual=Object.keys((l.packages&&l.packages[""]&&l.packages[""].devDependencies)//{}).sort(); const preact=Object.keys(l.packages//{}).filter((key)=>key==="node_modules/preact"//key.endsWith("/node_modules/preact")); if(JSON.stringify(expected)!==JSON.stringify(actual)//preact.length){process.exitCode=1;} console.log(JSON.stringify({packageDevDependencies:expected,lockRootDevDependencies:actual,preactEntries:preact,esbuildVersion:l.packages?.["node_modules/esbuild"]?.version,postcssVersion:l.packages?.["node_modules/postcss"]?.version},null,2));; exitCode: 0; signal: null; durationMs: 41; stdoutHash: sha256:d81b8193076e385f4d5e39ae3ba2095b7e7dad2cb530f2c9b6cfbd8e4ef01338; stderrHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855 |
| ev:T-0702:73b8bc7d66194e5e8810ab42 | passed | validation | Task finalize done-level readiness for T-0702 passed before close evidence append; harnessOk=true; evidenceLintOk=true; protocolDoctorOk=true; validationReportHash=sha256:8e365d1287a2846c148bbfe5ef22a9fa8477c1b4eaee3d5488c0ef5319a9e3da; sourceHash=sha256:c511d586dbd7fd878d50e80061371d588958a28c6ab85da3120a651147bb3150 |
<!-- /hadara:slot -->

## Close Proof

<!-- hadara:slot evidence.close-proof -->
| Check | Result | Evidence |
|---|---|---|
| close evidence | passed | ev:T-0702:9c8ce37dd43548a3bb610f21 |
<!-- /hadara:slot -->

## Failed / Blocked / Residual Evidence

<!-- hadara:slot evidence.residuals -->
| Evidence ID | Outcome | Summary | Disposition | Reference |
|---|---|---|---|---|
| ev:T-0702:722cd96435554fc1af55bf84 | failed | Validation "Docker clean full check" failed; command: npm run dev:docker-check; exitCode: 1; signal: null; durationMs: 173; stdoutHash: sha256:c16eaa59270cbc91b1038be9c741590345f336524c6556187f275ed387f24b6f; stderrHash: sha256:d0527b91b88a4736c47893d33c0242b10f32454ed6cacf1081bc07594358dfc5 | Resolved | ev:T-0702:a1508bd12c0340fdad9da779 |
<!-- /hadara:slot -->
