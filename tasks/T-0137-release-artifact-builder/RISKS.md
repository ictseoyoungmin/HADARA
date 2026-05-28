# Risks

| Risk | Mitigation |
|---|---|
| Artifact build accidentally includes source, tasks, docs, private/local state, or caches. | Build from a staging package copied from a fixed whitelist and verify reported npm package contents. |
| Release artifact command is mistaken for publish/deploy. | Require explicit `--execute`, set publish/GitHub/Docker markers to false, and keep release gate read-only. |
| Public report leaks raw npm logs or private paths. | Serialize reduced metadata only; command stdout/stderr are never copied into the report. |
| Default artifact output creates committed files. | Use a disposable temp output by default; explicit `--output` is required for retained local files. |
| T-0138 reads unregistered smoke evidence summaries. | Carry forward a T-0138 note to register `hadara.smokeEvidenceSummary.v1` before evidence-freeze reads. |
| Retained release artifacts are accidentally committed. | Add `dist-release/` to `.gitignore` and document it as the recommended retained local output directory. |
| Release artifact metadata keeps bootstrap wording. | Staged package description uses release-facing wording and tests guard against "bootstrap skeleton". |
| Future release gate reads manifest files without a schema. | Carry forward a T-0138 note to register `hadara.releaseArtifact.manifest.v1` before direct manifest reads. |
