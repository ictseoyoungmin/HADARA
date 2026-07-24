export type InitProfile = 'basic' | 'standard' | 'governed';
export type InitRepositoryState = 'greenfield' | 'brownfield' | 'hadara-current' | 'hadara-partial' | 'hadara-legacy' | 'unsafe';

export interface InitProfileSpec {
  profile: InitProfile;
  generatedDocsDescription: string;
  intendedUse: string;
  specialNotes: string;
  docs: {
    contextRouter: boolean;
    projectState: boolean;
    architecture: boolean;
    developmentSlices: boolean;
    decisions: boolean;
    refactorLog: boolean;
    securityModel: boolean;
    testStrategy: boolean;
    roadmap: boolean;
    agentHandoff: boolean;
  };
}

export type InitFollowUpMode = 'dry-run' | 'execute';
export type InitActionStatus = 'planned' | 'created' | 'updated' | 'exists' | 'skipped';
export type InitIssueSeverity = 'warning' | 'error';

export interface InitAction {
  action: string;
  path?: string;
  status: InitActionStatus;
  summary: string;
}

export interface InitIssue {
  severity: InitIssueSeverity;
  code: string;
  path?: string;
  message: string;
}

export interface InitAdoptionSignal {
  path: string;
  kind: 'hadara-state' | 'agent-entry' | 'ignore-rules' | 'hadara-target-doc' | 'task-area' | 'manifest' | 'source-root' | 'root-entry';
  type: 'file' | 'directory' | 'symlink' | 'other' | 'missing';
  size: number | null;
  hash: string | null;
}

export interface InitAdoptionAction {
  path: string;
  role: string;
  existingType: InitAdoptionSignal['type'];
  ownership: 'project' | 'hadara' | 'unknown';
  disposition: 'create' | 'preserve' | 'patch-managed-section' | 'register-existing' | 'already-managed' | 'block';
  beforeHash: string | null;
  preservesExistingContent: boolean;
  reason: string;
}

export interface InitAdoptionProject {
  id: string;
  name: string;
  purpose?: string;
  currentRelease: string;
}

export interface InitReport {
  schemaVersion: 'hadara.init.v1';
  command: 'init';
  ok: true;
  profile: InitProfile;
  actions: InitAction[];
  issues: [];
}

export interface InitAdoptionReport {
  schemaVersion: 'hadara.init.adoption.v1';
  command: 'init';
  ok: boolean;
  mode: 'dry-run' | 'execute';
  repositoryState: InitRepositoryState;
  profile: InitProfile;
  project: InitAdoptionProject;
  detectedManifests: InitAdoptionSignal[];
  actions: InitAdoptionAction[];
  preservedPaths: string[];
  managedPatches: InitAdoptionAction[];
  registeredExistingDocs: InitAdoptionAction[];
  blockers: InitIssue[];
  warnings: InitIssue[];
  snapshotHash: string;
  planHash: string;
  executeCommand?: string;
  writes: string[];
  issues: InitIssue[];
}

export interface InitFollowUpReport {
  schemaVersion: 'hadara.init.followup.v1';
  command: string;
  ok: boolean;
  summary?: string;
  mode?: InitFollowUpMode;
  profile?: InitProfile;
  integration?: string;
  actions: InitAction[];
  issues: InitIssue[];
}

export interface GeneratedScaffoldFile {
  path: string;
  content: string;
}

export interface InitProjectMetadata {
  name?: string;
  purpose?: string;
}

export interface InitWriteOperation {
  path: string;
  content: string;
}

export interface InitProjectOptions {
  silent?: boolean;
  adopt?: boolean;
  execute?: boolean;
  planHash?: string;
}

export interface InitCommandInput {
  args: string[];
  projectRoot: string;
  jsonOutput?: boolean;
}

export type InitPreset = 'minimal' | 'standard' | 'governed';
export type InitFeature = 'task-lifecycle' | 'evidence' | 'document-routing' | 'project-documentation' | 'governance-documentation';
export type InitDocumentPack = 'core' | 'project' | 'governance';
export type InitArtifactManagement =
  | 'hadara-managed'
  | 'mixed-managed-block'
  | 'command-managed'
  | 'scaffold-once'
  | 'generated-projection'
  | 'mixed-append';
export type InitDocumentManagement =
  | 'hadara-managed'
  | 'user-authored'
  | 'mixed-managed-block'
  | 'generated-projection'
  | 'external-reference';
export type InitDocumentStatus = 'draft' | 'active' | 'superseded' | 'archived';
export type InitReadPolicy = 'session-start' | 'on-target' | 'on-task-explicit' | 'explicit-only';

export type TargetRef =
  | { namespace: 'project' }
  | { namespace: 'release'; id: string }
  | { namespace: 'milestone'; id: string }
  | { namespace: 'component'; id: string }
  | { namespace: 'task'; id: string };

export interface InitPresetSpecV1 {
  preset: InitPreset;
  features: InitFeature[];
  documentPacks: InitDocumentPack[];
  optionalDocuments: string[];
}

export interface InitArtifactV1 {
  path: string;
  type: 'file' | 'directory';
  management: InitArtifactManagement;
  presets: InitPreset[];
}

export interface InitProjectConfigV1 {
  schemaVersion: 'hadara.project.v1';
  projectId: string;
  lifecycleVersion: '1';
  presetOrigin: InitPreset;
  features: InitFeature[];
  documentPacks: InitDocumentPack[];
}

export interface InitDocumentV1 {
  id: string;
  path: string;
  management: InitDocumentManagement;
  status: InitDocumentStatus;
  readPolicy: InitReadPolicy;
  appliesTo?: TargetRef[];
  supersedes?: string[];
}

export interface InitDocumentsV1 {
  schemaVersion: 'hadara.documents.v1';
  documents: InitDocumentV1[];
}

export type InitPlanActionKind =
  | 'create'
  | 'insert-managed-block'
  | 'update-managed-block'
  | 'replace-hadara-managed'
  | 'append-line'
  | 'register'
  | 'migrate'
  | 'regenerate'
  | 'preserve'
  | 'skip'
  | 'conflict';

export interface InitPlanActionV1 {
  path: string;
  kind: InitPlanActionKind;
  management: InitArtifactManagement;
  reason: string;
  beforeHash?: string;
}

export interface InitPlanSummaryV1 {
  create: number;
  updateManaged: number;
  append: number;
  register: number;
  migrate: number;
  preserve: number;
  skip: number;
  conflict: number;
  delete: 0;
}

export interface InitPlanV1 {
  schemaVersion: 'hadara.init.plan.v1';
  operation: 'init';
  projectMode: 'greenfield' | 'brownfield' | 'initialized' | 'partial' | 'legacy' | 'unsafe';
  preset: InitPreset;
  actions: InitPlanActionV1[];
  summary: InitPlanSummaryV1;
  planHash: string;
}

export interface InitReportSummaryV1 {
  planned: number;
  created: number;
  updated: number;
  appended: number;
  preserved: number;
  conflicts: number;
  applied: number;
}

export interface InitReportV1 {
  schemaVersion: 'hadara.init.report.v1';
  ok: boolean;
  operation: 'init';
  mode: 'dry-run' | 'applied' | 'no-op' | 'error';
  projectMode: InitPlanV1['projectMode'];
  preset: InitPreset;
  summary: InitReportSummaryV1;
  planHash: string;
  plan: InitPlanV1;
  reason?: 'already-initialized' | 'user-declined';
  results?: {
    created: string[];
    updated: string[];
    appended: string[];
    preserved: string[];
    failed: string[];
  };
  recovery?: {
    required: boolean;
    instruction: string;
  };
  issues: InitIssue[];
}
