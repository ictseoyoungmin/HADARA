# HADARA v0.5.0-rc.4

HADARA 0.5.0-rc.4 is a prerelease candidate for the Init v1 document-routing and protocol reconciliation line.

## Highlights

- Fresh minimal, standard, and governed Init v1 projects use .hadara/project.json and .hadara/documents.json as canonical state.
- presetOrigin is retained as initialization provenance; current feature/document-pack capabilities drive compatibility diagnostics without becoming routing authority.
- Init v1 protocol/profile regressions cover divergent provenance, partial state, malformed state, and legacy compatibility behavior.
- The reviewed RC4 release artifact, checksum, and manifest were retained and verified from the T-0769 source input.

## Validation

The RC4 source candidate passed the full repository check, exact package smoke, clean-checkout smoke, strict release gate, release dry-run, and publish dry-run before operator publication.

## Release boundary

- This is a prerelease for npm dist-tag next.
- Stable npm latest remains unchanged.
- GitHub prerelease publication is a separate reviewed release surface.
- Public consumer recycle must verify the published package after mutation.
- No tokens or machine-local absolute paths are included in this note.
