# Decisions

- Public artifacts are copied only when their content is text and no configured secret-like pattern is detected.
- Secret-bearing public artifacts are rejected rather than sanitized in T-0024.
- Binary public artifacts are rejected until a dedicated screenshot/binary artifact policy is implemented.
- Private evidence continues to avoid committed artifact copies.
