# DOC_REGISTRY

Schema: `hadara.docs.registry.v1`

<!-- hadara:managed:start doc-registry-summary {"schema":"hadara.managedSection.v1","owner":"docs.registry","kind":"markdown-table","mode":"replace","version":1,"required":true,"closeSourceRole":"included"} -->
| Path | Kind | Status | Read When | Required | Owner |
|---|---|---|---|---|---|
| `.hadara/context/HADARA_CONTEXT.md` | project-context | canonical | session-start | yes | hadara-docs |
| `AGENTS.md` | protocol | canonical | session-start | yes | hadara-docs |
| `docs/IMPLEMENTATION_SOP.md` | protocol | canonical | session-start | yes | hadara-docs |
| `docs/TASK_WORKFLOW_COMMANDS.md` | workflow-guide | canonical | task-start | yes | hadara-docs |
| `docs/PROJECT_STATE.md` | project-state | canonical | session-start | yes | hadara-docs |
| `docs/AGENT_HANDOFF.md` | handoff | canonical | session-start | yes | hadara-docs |
| `docs/TASK_BOARD.md` | task-board | active | task-start | yes | hadara-docs |
| `docs/ARCHITECTURE.md` | architecture | reference | only-when-linked | no | hadara-docs |
| `docs/DEVELOPMENT_SLICES.md` | roadmap | active | task-start | yes | hadara-docs |
| `docs/DECISIONS.md` | decision-log | reference | only-when-linked | no | hadara-docs |
| `docs/TEST_STRATEGY.md` | test-strategy | reference | debugging | no | hadara-docs |
| `docs/SECURITY_MODEL.md` | security-model | reference | only-when-linked | no | hadara-docs |
| `docs/REFACTOR_LOG.md` | historical-plan | historical | never-default | no | hadara-docs |
| `docs/ROADMAP.md` | roadmap | reference | only-when-linked | no | hadara-docs |
| `docs/specs/0.3.1/00_HADARA_0_3_1_Phase_8_State_Governance_Program.md` | roadmap | reference | only-when-linked | no | hadara-dev |
| `docs/specs/0.3.1/rc1/00_HADARA_0_3_1_rc1_Status_Governance_Implementation_Plan.md` | roadmap | reference | only-when-linked | no | hadara-dev |
| `docs/specs/0.3.3/context-routing/00_Context_Routing_Architecture_Overview.md` | spec | reference | only-when-linked | no | hadara-dev |
| `docs/specs/0.3.3/context-routing/01_Project_Context_Graph_Foundation_and_State_Projection_Spec.md` | spec | reference | only-when-linked | no | hadara-dev |
| `docs/specs/0.3.3/context-routing/02_Code_Link_Layer_Spec.md` | spec | reference | only-when-linked | no | hadara-dev |
| `docs/specs/0.3.3/context-routing/03_Context_Pack_and_Session_Start_Spec.md` | spec | reference | only-when-linked | no | hadara-dev |
| `docs/specs/0.3.3/context-routing/04_Deterministic_Context_Slice_Raw_Adapter_Spec.md` | spec | reference | only-when-linked | no | hadara-dev |
| `docs/specs/0.3.3/context-routing/05_Indexing_Cache_Invalidation_and_Performance_Spec.md` | spec | reference | only-when-linked | no | hadara-dev |
| `docs/specs/0.3.3/context-routing/06_Worker_Agent_Implementation_Plan.md` | implementation-guide | reference | only-when-linked | no | hadara-dev |
| `docs/specs/0.3.3/context-routing/07_C6_Fast_Context_Cache_and_Performance_Implementation_Spec.md` | spec | reference | only-when-linked | no | hadara-dev |
| `docs/specs/0.3.3/context-routing/08_C6_Speed_First_Graph_Build_and_Warm_Path_Spec.md` | spec | reference | only-when-linked | no | hadara-dev |
| `docs/specs/0.3.3/context-routing/09_Context_Routing_Implementation_Completion_Audit.md` | implementation-audit | reference | only-when-linked | no | hadara-dev |
| `docs/specs/0.3.3/lifecycle/00_Lifecycle_Workflow_Agent_Convenience_Spec.md` | spec | reference | only-when-linked | no | hadara-dev |
| `docs/specs/0.3.3/dogfood/00_Procedural_Asset_SaaS_Dogfood_Spec.md` | spec | reference | only-when-linked | no | hadara-dev |
| `docs/specs/0.3.4/agent-ux/00_Agent_UX_Hardening_Spec.md` | spec | reference | only-when-linked | no | hadara-dev |
| `docs/CONTEXT_ROUTING_PERFORMANCE_BASELINE.md` | performance-baseline | reference | only-when-linked | no | hadara-dev |
| `docs/CONTEXT_ROUTING_PERFORMANCE_THRESHOLDS.json` | performance-thresholds | reference | only-when-linked | no | hadara-dev |
| `docs/specs/0.4.0/productization-redesign/README.md` | spec | reference | task-start | no | hadara-dev |
| `docs/specs/0.4.0/productization-redesign/00_Decision_and_Productization_Principles.md` | spec | reference | only-when-linked | no | hadara-dev |
| `docs/specs/0.4.0/productization-redesign/01_Project_Scaffold_Model.md` | spec | reference | only-when-linked | no | hadara-dev |
| `docs/specs/0.4.0/productization-redesign/02_Agent_Entry_and_Workflow_Document.md` | spec | reference | only-when-linked | no | hadara-dev |
| `docs/specs/0.4.0/productization-redesign/03_Design_Source_Documents_Read_Map_and_Drift.md` | spec | reference | only-when-linked | no | hadara-dev |
| `docs/specs/0.4.0/productization-redesign/04_Task_Capsule_Schema.md` | spec | reference | only-when-linked | no | hadara-dev |
| `docs/specs/0.4.0/productization-redesign/05_TASK_MD_Table_Schema_and_Controlled_Values.md` | spec | reference | only-when-linked | no | hadara-dev |
| `docs/specs/0.4.0/productization-redesign/06_Managed_Slot_v2_and_Schema_Registry.md` | spec | reference | only-when-linked | no | hadara-dev |
| `docs/specs/0.4.0/productization-redesign/07_Evidence_Plane_and_Close_Proof_Projection.md` | spec | reference | only-when-linked | no | hadara-dev |
| `docs/specs/0.4.0/productization-redesign/08_Project_State_Task_Board_and_Handoff.md` | spec | reference | only-when-linked | no | hadara-dev |
| `docs/specs/0.4.0/productization-redesign/09_Close_Source_Contract.md` | spec | reference | only-when-linked | no | hadara-dev |
| `docs/specs/0.4.0/productization-redesign/10_Context_Routing_and_Session_Start_Integration.md` | spec | reference | only-when-linked | no | hadara-dev |
| `docs/specs/0.4.0/productization-redesign/11_Legacy_Project_Boundary.md` | spec | reference | only-when-linked | no | hadara-dev |
| `docs/specs/0.4.0/productization-redesign/12_CLI_JSON_Contracts_and_Diagnostics.md` | spec | reference | only-when-linked | no | hadara-dev |
| `docs/specs/0.4.0/productization-redesign/13_Test_Dogfood_and_Release_Plan.md` | spec | reference | only-when-linked | no | hadara-dev |
| `docs/specs/0.4.0/productization-redesign/14_Worker_Agent_Capsule_Plan.md` | implementation-guide | reference | task-start | no | hadara-dev |
| `docs/specs/0.4.0/productization-redesign/15_Current_CLI_Surface_Audit.md` | implementation-guide | reference | only-when-linked | no | hadara-dev |
| `docs/specs/0.4.0/productization-redesign/templates/0.4/AGENTS.md` | protocol | reference | only-when-linked | no | hadara-dev |
| `docs/specs/0.4.0/productization-redesign/templates/0.4/EVIDENCE.md` | task-capsule | reference | only-when-linked | no | hadara-dev |
| `docs/specs/0.4.0/productization-redesign/templates/0.4/HADARA_CONTEXT.md` | project-context | reference | only-when-linked | no | hadara-dev |
| `docs/specs/0.4.0/productization-redesign/templates/0.4/HADARA_WORKFLOW.md` | workflow-guide | reference | only-when-linked | no | hadara-dev |
| `docs/specs/0.4.0/productization-redesign/templates/0.4/HANDOFF.md` | task-capsule | reference | only-when-linked | no | hadara-dev |
| `docs/specs/0.4.0/productization-redesign/templates/0.4/TASK.md` | task-capsule | reference | only-when-linked | no | hadara-dev |
<!-- hadara:managed:end doc-registry-summary -->
