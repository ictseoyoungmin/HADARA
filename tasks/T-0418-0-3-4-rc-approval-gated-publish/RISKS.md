# Risks

| Risk | Impact | Likelihood | Mitigation | Status |
|---|---|---|---|---|
| Exact version already published. | npm versions are immutable; publish would fail or indicate stale state. | Low | Check `npm view hadara@0.3.4-rc.0 version` before publish. | Mitigated pre-publish: npm returned E404 |
| Wrong dist-tag replaces stable. | Users could install RC through `latest`. | Low | Use helper default for rc versions or pass `--npm-tag next`; verify dist-tags after publish. | Open until post-publish verification |
| Missing npm authentication. | Publish cannot proceed. | Medium | Operator runs `npm login` or configures `NPM_TOKEN` in the prepared ext4 clone. | Blocking external dependency |
| Publishing from mounted `/workspace`. | Build/package tooling can be stale or slow. | Medium | Use prepared `/root/hadara-publish` ext4 clone. | Mitigated |
| Interrupted publish-env preparation can leave the clone in an invalid git index state. | Prepared clone may falsely look present while missing `dist` or having D/?? status. | Low | Recreated `/root/hadara-publish` from scratch, rebuilt, and verified version/gate before documenting operator steps. | Mitigated |
