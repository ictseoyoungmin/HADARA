# Risks

| Risk | Mitigation |
|---|---|
| Profile rename breaks existing scripts that still pass unsupported names. | Make the rejection explicit through focused tests, CLI error text, and current docs. |
| SOP still references docs that a smaller profile did not generate. | Build SOP required-reading and scaffold structure sections from the selected profile spec and add regression tests. |
| HADARA-dev-specific contracts leak into generic init scaffolds. | Keep project-specific docs only in root SOP conditional rows; generated scaffolds instruct manual registration instead. |
