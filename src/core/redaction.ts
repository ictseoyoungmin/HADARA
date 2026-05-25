export type RedactionSeverity = 'low' | 'medium' | 'high' | 'critical';

export interface RedactionPattern {
  id: string;
  description: string;
  regex: RegExp;
  severity: RedactionSeverity;
  replacement: string;
  enabledByDefault: boolean;
}

export interface RedactionFinding {
  patternId: string;
  severity: RedactionSeverity;
  /**
   * Per-pattern match count. Counts may overlap when multiple patterns match
   * the same input span.
   */
  count: number;
}

export interface RedactionReport {
  schemaVersion: 'hadara.redaction.report.v1';
  ok: boolean;
  inputBytes: number;
  outputBytes: number;
  findings: RedactionFinding[];
  redactedText?: string;
}

export interface RedactionReportOptions {
  includeRedactedText?: boolean;
  patterns?: RedactionPattern[];
}

export const REDACTION_PATTERNS: RedactionPattern[] = [
  {
    id: 'openai-api-key',
    description: 'OpenAI-style API key',
    regex: /sk-[A-Za-z0-9_-]{16,}/g,
    severity: 'critical',
    replacement: '[REDACTED]',
    enabledByDefault: true
  },
  {
    id: 'slack-token',
    description: 'Slack token',
    regex: /xox[baprs]-[A-Za-z0-9-]{10,}/g,
    severity: 'high',
    replacement: '[REDACTED]',
    enabledByDefault: true
  },
  {
    id: 'aws-access-key-id',
    description: 'AWS access key id',
    regex: /AKIA[0-9A-Z]{16}/g,
    severity: 'high',
    replacement: '[REDACTED]',
    enabledByDefault: true
  },
  {
    id: 'aws-secret-access-key',
    description: 'AWS secret access key assignment',
    regex: /(aws[_-]?secret[_-]?access[_-]?key\s*=\s*)[A-Za-z0-9/+=]{32,}/gi,
    severity: 'critical',
    replacement: '$1[REDACTED]',
    enabledByDefault: true
  },
  {
    id: 'github-token',
    description: 'GitHub personal access token',
    regex: /(?:ghp|gho|ghu|ghs|ghr)_[A-Za-z0-9_]{20,}|github_pat_[A-Za-z0-9_]{20,}/g,
    severity: 'critical',
    replacement: '[REDACTED]',
    enabledByDefault: true
  },
  {
    id: 'gitlab-token',
    description: 'GitLab personal access token',
    regex: /glpat-[A-Za-z0-9_-]{20,}/g,
    severity: 'critical',
    replacement: '[REDACTED]',
    enabledByDefault: true
  },
  {
    id: 'google-api-key',
    description: 'Google API key',
    regex: /AIza[0-9A-Za-z_-]{35}/g,
    severity: 'critical',
    replacement: '[REDACTED]',
    enabledByDefault: true
  },
  {
    id: 'private-key-block',
    description: 'Private key block',
    regex: /-----BEGIN [A-Z ]*PRIVATE KEY-----[\s\S]*?-----END [A-Z ]*PRIVATE KEY-----/g,
    severity: 'critical',
    replacement: '[REDACTED]',
    enabledByDefault: true
  },
  {
    id: 'openssh-private-key',
    description: 'OpenSSH private key payload',
    regex: /openssh-key-v1[A-Za-z0-9+/=\s-]*/gi,
    severity: 'critical',
    replacement: '[REDACTED]',
    enabledByDefault: true
  },
  {
    id: 'jwt',
    description: 'JWT-like bearer token',
    regex: /eyJ[A-Za-z0-9_-]{8,}\.[A-Za-z0-9_-]{8,}\.[A-Za-z0-9_-]{8,}/g,
    severity: 'high',
    replacement: '[REDACTED]',
    enabledByDefault: true
  },
  {
    id: 'azure-connection-string',
    description: 'Azure storage connection string with account key',
    regex: /DefaultEndpointsProtocol=[^;\s]+;AccountName=[^;\s]+;AccountKey=[^;\s]+(?:;EndpointSuffix=[^;\s]+)?/gi,
    severity: 'critical',
    replacement: '[REDACTED]',
    enabledByDefault: true
  },
  {
    id: 'npm-token',
    description: 'npm access token',
    regex: /npm_[A-Za-z0-9]{20,}/g,
    severity: 'critical',
    replacement: '[REDACTED]',
    enabledByDefault: true
  },
  {
    id: 'sensitive-assignment',
    description: 'Sensitive key assignment',
    regex: /((?:api[_-]?key|token|password|secret|private[_-]?key)\s*=\s*)[^\s]+/gi,
    severity: 'high',
    replacement: '$1[REDACTED]',
    enabledByDefault: true
  },
  {
    id: 'authorization-bearer',
    description: 'Authorization bearer token',
    regex: /(authorization:\s*bearer\s+)[^\s]+/gi,
    severity: 'high',
    replacement: '$1[REDACTED]',
    enabledByDefault: true
  }
];

export function redactSecrets(input: string): string {
  return createRedactionReport(input, { includeRedactedText: true }).redactedText ?? input;
}

export function containsSecret(input: string): boolean {
  return createRedactionReport(input).findings.length > 0;
}

export function hasBlockingRedactionFinding(
  report: RedactionReport,
  minimumSeverity: RedactionSeverity = 'high'
): boolean {
  const minimumRank = redactionSeverityRank(minimumSeverity);
  return report.findings.some((finding) => redactionSeverityRank(finding.severity) >= minimumRank);
}

export function createRedactionReport(
  input: string,
  options: RedactionReportOptions = {}
): RedactionReport {
  const enabledPatterns = (options.patterns ?? REDACTION_PATTERNS).filter((pattern) => pattern.enabledByDefault);
  const findings = scanRedactionFindings(input, enabledPatterns);
  const redactedText = options.includeRedactedText ? redactWithPatterns(input, enabledPatterns) : undefined;
  const output = redactedText ?? input;

  return {
    schemaVersion: 'hadara.redaction.report.v1',
    ok: findings.length === 0,
    inputBytes: Buffer.byteLength(input, 'utf8'),
    outputBytes: Buffer.byteLength(output, 'utf8'),
    findings,
    ...(options.includeRedactedText ? { redactedText: output } : {})
  };
}

function scanRedactionFindings(input: string, patterns: RedactionPattern[]): RedactionFinding[] {
  const findings: RedactionFinding[] = [];
  for (const pattern of patterns) {
    const regex = cloneGlobalRegex(pattern.regex);
    const matches = input.match(regex);
    if (matches?.length) {
      findings.push({
        patternId: pattern.id,
        severity: pattern.severity,
        count: matches.length
      });
    }
  }
  return findings;
}

function redactWithPatterns(input: string, patterns: RedactionPattern[]): string {
  return patterns.reduce((text, pattern) => text.replace(cloneGlobalRegex(pattern.regex), pattern.replacement), input);
}

function redactionSeverityRank(severity: RedactionSeverity): number {
  switch (severity) {
    case 'low':
      return 1;
    case 'medium':
      return 2;
    case 'high':
      return 3;
    case 'critical':
      return 4;
  }
}

function cloneGlobalRegex(regex: RegExp): RegExp {
  return new RegExp(regex.source, regex.flags.includes('g') ? regex.flags : `${regex.flags}g`);
}
