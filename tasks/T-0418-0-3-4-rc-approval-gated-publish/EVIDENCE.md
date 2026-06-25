# Evidence

| Time | Kind | Summary | Result | Visibility | JSONL |
|---|---|---|---|---|---|
| 2026-06-25T07:26:53.453Z | command-log | Ext4 release publish dry-run for hadara@0.3.4-rc.0 returned ok true; release dry-run prerequisites and package metadata passed, npm/GitHub remained approval/token gated, Docker deferred, and no mutation executed. | passed | public | evidence.jsonl |
| 2026-06-25T07:26:53.455Z | command-log | npm registry pre-check before 0.3.4-rc.0 publish: npm view hadara@0.3.4-rc.0 returned E404 absent; npm dist-tags reported latest=0.3.3 and next=0.3.3-rc.0. | passed | public | evidence.jsonl |
| 2026-06-25T07:26:55.470Z | command-log | Prepared /root/hadara-publish ext4 publish clone at commit d349586; npm ci and npm run build passed, built CLI reported packageVersion 0.3.4-rc.0 with distLooksStale false, and strict release gate returned ok true. | passed | public | evidence.jsonl |
| 2026-06-25T07:29:51.157Z | command-log | git diff --check passed for T-0418 pre-publish preparation docs and operator steps. | passed | public | evidence.jsonl |
