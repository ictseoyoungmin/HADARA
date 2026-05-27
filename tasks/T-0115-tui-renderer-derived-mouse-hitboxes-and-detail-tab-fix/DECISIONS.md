# Decisions

Record task-local design decisions here.

## 2026-05-27

- Keep hitbox metadata internal to the TUI snapshot result instead of introducing a public schema.
- Preserve existing rendered text and ANSI styling; hitboxes are generated alongside rendering and consumed only by the terminal shell.
- Keep mouse actions local/read-only: panel switch, task selection/detail load, and Detail document tab switch.
- Consume SGR mouse release sequences without emitting keyboard input, because release payload coordinates can contain digits such as `1` that otherwise leak into panel-number handling and bounce Help back to Overview.
- Align Task tab cursor movement with the mockup by using the same visible-window offset policy for state transitions and rendering: the task window offset moves only when the selected filtered row leaves the visible range.
- Render Overview work cards at their actual column widths before composing columns, so intermediate wide terminal sizes do not clip the Previous Work card border with trailing ellipses. Clip only the value text inside each summary line so label colors stay intact.
