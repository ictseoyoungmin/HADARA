export type InitProfile = 'basic' | 'standard' | 'governed';

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

export interface InitReport {
  schemaVersion: 'hadara.init.v1';
  command: 'init';
  ok: true;
  profile: InitProfile;
  actions: InitAction[];
  issues: [];
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
}

export interface InitCommandInput {
  args: string[];
  projectRoot: string;
  jsonOutput?: boolean;
}
