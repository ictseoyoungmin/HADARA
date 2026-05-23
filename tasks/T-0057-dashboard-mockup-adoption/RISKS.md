# Risks

| Risk | Mitigation |
|---|---|
| Mockup demo data becomes mistaken for product data. | Bind visible values from `hadara.ops.status.v1` fixture/fallback and document that schema remains authoritative. |
| Visual adoption accidentally adds live behavior. | Keep and expand static boundary token tests. |
| Inline fallback drifts from sample fixture. | Add a test comparing fallback JSON with the fixture. |
| UI grows into dashboard routing or full app scope. | Limit T-0057 to the Operations Home shell and defer fixture smoke/CLI serving. |
