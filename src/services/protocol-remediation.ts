export interface ManualRemediationInput {
  id: string;
  title: string;
  issueIds?: string[];
  command?: string;
  targetPaths: string[];
  summary: string;
  steps: string[];
  preview?: {
    before?: string;
    after?: string;
  };
}

export function createManualRemediation(input: ManualRemediationInput): {
  id: string;
  issueIds: string[];
  title: string;
  mode: 'manual';
  command?: string;
  targetPaths: string[];
  summary: string;
  steps: string[];
  preview?: {
    before?: string;
    after?: string;
  };
} {
  return {
    id: input.id,
    issueIds: input.issueIds ?? [],
    title: input.title,
    mode: 'manual',
    command: input.command,
    targetPaths: Array.from(new Set(input.targetPaths)),
    summary: input.summary,
    steps: input.steps,
    ...(input.preview ? { preview: input.preview } : {})
  };
}
