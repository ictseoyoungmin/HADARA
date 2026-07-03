# GitHub Release Commands

Prepared command for the `v0.4.0-rc.0` draft prerelease:

```bash
gh release create v0.4.0-rc.0 \
  --repo ictseoyoungmin/HADARA-dev \
  --target 964a8431cc08c2e89460be46560c8a8d98b451e1 \
  --title "HADARA 0.4.0-rc.0" \
  --notes-file tasks/T-0488-0-4-0-rc-0-github-release-draft/artifacts/GITHUB_RELEASE_NOTE_FINAL.md \
  --prerelease \
  --draft
```

Verification commands:

```bash
npm view hadara@0.4.0-rc.0 version dist-tags dist.shasum --json
gh auth status
gh release view v0.4.0-rc.0 --repo ictseoyoungmin/HADARA-dev --json tagName,isDraft,isPrerelease,url,targetCommitish
```

Created draft verification:

- `tagName`: `v0.4.0-rc.0`
- `name`: `HADARA 0.4.0-rc.0`
- `isDraft`: `true`
- `isPrerelease`: `true`
- `targetCommitish`: `964a8431cc08c2e89460be46560c8a8d98b451e1`
- draft URL returned by GitHub: `https://github.com/ictseoyoungmin/HADARA/releases/tag/untagged-31f38a411bf618bdbb54`

Target rationale:

- `4e4014a` prepared `0.4.0-rc.0` package metadata, release notes, and package-facing docs.
- `964a843` fixed the publish helper safe-directory issue before the successful operator publish.
- `6d341d6` recorded the completed npm publish after the package was already published.
- Later commits are stable pre-release cleanup after `0.4.0-rc.0` was published and should not be used as the RC tag target.
