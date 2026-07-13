export type InitProfile = 'basic' | 'standard' | 'governed';
export type InitRepositoryState = 'greenfield' | 'brownfield' | 'hadara-current' | 'hadara-partial' | 'hadara-legacy' | 'unsafe';

export interface InitProfileSpec {
  profile: InitProfile;
  generatedDocsDescription: string;
  intendedUse: string;
  specialNotes: string;
  docs: {
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
  kind: 'hadara-state' | 'agent-entry' | 'ignore-rules' | 'hadara-target-doc' | 'task-area' | 'manifest' | 'source-root';
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
