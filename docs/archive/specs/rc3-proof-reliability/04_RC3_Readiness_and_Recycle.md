# rc3 Readiness and Installed-Package Recycle

## Goal

Prepare `hadara@0.2.0-rc.3` as a trust/readiness release candidate after evidence writer hardening, proof MVP, and CI gate MVP.

## Scope

- Version and release-facing documentation update to rc3.
- Focused and full validation.
- Package smoke and clean-checkout smoke.
- Fresh `basic`, `standard`, and `governed` init smokes.
- Proof status smoke.
- CI gate smoke.
- Disposable installed-package recycle after package availability, if publishing is performed by the operator.

## Publish Boundary

This plan does not imply automatic publish. Registry mutation remains operator-gated and approval-gated.

## Recycle Commands

After publish, run in a disposable workspace:

```bash
npm install -g hadara@0.2.0-rc.3
hadara init --profile standard --json
hadara task create "rc3 recycle task" --json
hadara evidence add-command --task T-0001 --summary "rc3 recycle evidence" --result passed --idempotency-key "recycle:T-0001:evidence" --json
hadara proof status --task T-0001 --json
hadara ci gate --mode advisory --json
```

## Success Criteria

- rc3 package contents include the proof reliability surfaces.
- Installed package can initialize a project and write idempotent evidence.
- Installed package can report proof status.
- Installed package can run CI gate advisory mode.
