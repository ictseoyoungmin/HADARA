# HADARA 0.3.0-rc.1

This release candidate focuses on 0.3 adoption for existing HADARA projects and on publish metadata correctness for npm discovery.

## Highlights

- Adds `hadara protocol migrate` for dry-run-first migration of existing projects onto the 0.3 protocol surface.
- Reports protocol version state before migration so operators can distinguish current projects from older scaffold layouts.
- Supports project/task scoped migration for docs registry insertion, managed section markers, command surface docs, and Required Reading cleanup.
- Uses before-hash guarded execute plans so migration writes are rejected if a planned file changed after dry-run.
- Preserves existing task evidence during task-scoped migration; `evidence.jsonl` is created only when missing and is never replaced.
- Keeps `task finish` status history updates inside the managed Markdown table.
- Hardens npm package discovery metadata and verifies staged tarball metadata before publish.
- Tightens the manual publish helper so the release capsule must match the package version and a successful dry-run can be followed by `--execute` from the same clean publish clone.

## Publish Status

The npm package was published through the approval-gated T-0301 helper and `npm view` verified `hadara@0.3.0-rc.1`.

GitHub Release creation remains optional and was not requested during the npm publish helper run.
