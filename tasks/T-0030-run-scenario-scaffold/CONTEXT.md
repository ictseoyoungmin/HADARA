# Context

Feedback identified that `hadara run` is useful as a deterministic harness, but users must understand the script and fixtures formats before trying it. A small scaffold command can lower that entry barrier by generating the two files needed for a fake-shell run.

The helper must remain deterministic and must not execute a real shell command.
