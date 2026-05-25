# Decisions

Record task-local design decisions here.

- Chose the conservative private evidence policy: source artifacts must resolve inside the project boundary by default. No override flag is added in this slice.
- Kept private evidence collection successful when an external source path is provided; committed evidence remains sanitized and no private raw copy/manifest is created for that external file.
- Added schema fixtures as documentation/contract fixtures only. `hadara.privateEvidence.v1` describes a private manifest record and therefore does not require an `issues` array.
