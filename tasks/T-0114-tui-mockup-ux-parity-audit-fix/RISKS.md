# Risks

| Risk | Mitigation |
|---|---|
| Fixed mouse coordinate logic can still drift from future renderer layout changes. | This capsule aligns current coordinates with rendered task windows and adds regressions; a later renderer-derived hitbox capsule remains the stronger long-term design. |
| Fast-profile deferred labels may reduce perceived completeness of Overview signals. | The label is intentional: operator trust is better served by showing deferred/pending state than false zero/ok advisory reads. |
| Task-list window sizing differs between compact and wide terminal layouts. | Renderer and terminal mouse selection now share the same visible-row/window calculation, and focused tests cover compact and wide row clicks. |
