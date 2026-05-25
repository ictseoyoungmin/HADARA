import { redactSecrets } from '../core/redaction';
import { validateSchema } from '../core/schema';
import { ChatRequest, ChatResponse, ProviderCapabilities, ProviderError } from './provider-contract';

export type ProviderAdapterKind = 'openai-compatible' | 'ollama' | 'llama-cpp';

export interface ProviderAdapterConfigInput {
  id: string;
  kind: ProviderAdapterKind;
  enabled?: boolean;
  baseUrlEnv?: string;
  apiKeyEnv?: string;
  model: string;
  capabilities?: Partial<Pick<ProviderCapabilities, 'supportsStreaming' | 'supportsToolCalling' | 'supportsReasoning' | 'supportsVision'>>;
  localOnly?: boolean;
  costProfile?: ProviderCapabilities['costProfile'];
}

export interface ProviderAdapterConfig {
  id: string;
  kind: ProviderAdapterKind;
  enabled: boolean;
  baseUrlEnv?: string;
  apiKeyEnv?: string;
  model: string;
  capabilities: {
    streaming: boolean;
    toolCalling: boolean;
    reasoning: boolean;
    vision: boolean;
  };
  localOnly: boolean;
  costProfile: ProviderCapabilities['costProfile'];
}

export interface ProviderConfigInput {
  providers: ProviderAdapterConfigInput[];
  defaultProvider?: string | null;
}

export interface ProviderConfig {
  schemaVersion: 'hadara.provider.config.v1';
  providers: ProviderAdapterConfig[];
  defaultProvider: string | null;
}

export interface ProviderCallIssue {
  severity: 'warning' | 'error';
  code: string;
  message: string;
  retriable?: boolean;
}

export interface ProviderCallReport {
  schemaVersion: 'hadara.provider.call.v1';
  provider: string;
  model?: string;
  ok: boolean;
  input: {
    messages: number;
    approxTokens: number;
  };
  output?: {
    finishReason: ChatResponse['finishReason'];
    approxTokens: number;
  };
  issues: ProviderCallIssue[];
}

export class ProviderConfigError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ProviderConfigError';
  }
}

export class ProviderCallReportError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ProviderCallReportError';
  }
}

const SECRET_VALUE_KEYS = new Set(['apiKey', 'apiKeyValue', 'token', 'secret', 'password', 'authorization']);
const PROVIDER_CONFIG_INPUT_KEYS = new Set(['providers', 'defaultProvider']);
const PROVIDER_ADAPTER_CONFIG_INPUT_KEYS = new Set([
  'id',
  'kind',
  'enabled',
  'baseUrlEnv',
  'apiKeyEnv',
  'model',
  'capabilities',
  'localOnly',
  'costProfile'
]);
const PROVIDER_CAPABILITY_INPUT_KEYS = new Set(['supportsStreaming', 'supportsToolCalling', 'supportsReasoning', 'supportsVision']);
const PROVIDER_KIND_VALUES = new Set<ProviderAdapterKind>(['openai-compatible', 'ollama', 'llama-cpp']);
const COST_PROFILE_VALUES = new Set<ProviderCapabilities['costProfile']>(['free', 'low', 'medium', 'high', 'unknown']);
const PROVIDER_ID_PATTERN = /^[A-Za-z0-9_.:-]+$/;
const ENV_NAME_PATTERN = /^[A-Z_][A-Z0-9_]*$/;

export function createProviderConfig(input: ProviderConfigInput): ProviderConfig {
  rejectUnknownFields(input as unknown, PROVIDER_CONFIG_INPUT_KEYS, 'provider config');
  if (!Array.isArray(input.providers)) {
    throw new ProviderConfigError('provider config providers must be an array.');
  }
  const providers = input.providers.map(normalizeProviderConfig);
  const defaultProvider = input.defaultProvider ?? null;
  if (defaultProvider && !providers.some((provider) => provider.id === defaultProvider)) {
    throw new ProviderConfigError(`Default provider "${defaultProvider}" is not configured.`);
  }
  const config: ProviderConfig = {
    schemaVersion: 'hadara.provider.config.v1',
    providers,
    defaultProvider
  };
  return assertProviderConfigSchema(config);
}

export function normalizeProviderConfig(input: ProviderAdapterConfigInput): ProviderAdapterConfig {
  rejectUnknownFields(input as unknown, PROVIDER_ADAPTER_CONFIG_INPUT_KEYS, 'provider adapter config');
  rejectSecretValueFields(input);
  const id = normalizeProviderId(input.id, 'provider id', ProviderConfigError);
  const kind = normalizeProviderKind(input.kind);
  const model = requireNonEmptyString(input.model, 'provider model', ProviderConfigError);
  const capabilities = normalizeCapabilities(input.capabilities);
  const config: ProviderAdapterConfig = {
    id,
    kind,
    enabled: optionalBoolean(input.enabled, 'enabled') ?? false,
    model,
    capabilities,
    localOnly: optionalBoolean(input.localOnly, 'localOnly') ?? kind !== 'openai-compatible',
    costProfile: normalizeCostProfile(input.costProfile)
  };
  if (input.baseUrlEnv) config.baseUrlEnv = normalizeEnvName(input.baseUrlEnv, 'baseUrlEnv');
  if (input.apiKeyEnv) config.apiKeyEnv = normalizeEnvName(input.apiKeyEnv, 'apiKeyEnv');
  return config;
}

export function createProviderCallReport(input: {
  provider: string;
  model?: string;
  request: ChatRequest;
  response?: ChatResponse;
  error?: ProviderError | Error | unknown;
}): ProviderCallReport {
  const provider = normalizeProviderId(input.provider, 'provider', ProviderCallReportError);
  const model = input.model ?? input.response?.model;
  const issues = input.error ? [normalizeProviderCallIssue(input.error)] : [];
  const report: ProviderCallReport = {
    schemaVersion: 'hadara.provider.call.v1',
    provider,
    ...(model ? { model } : {}),
    ok: issues.length === 0,
    input: {
      messages: input.request.messages.length,
      approxTokens: approximateTokens(JSON.stringify(input.request.messages))
    },
    ...(input.response
      ? {
          output: {
            finishReason: input.response.finishReason,
            approxTokens: input.response.usage?.outputTokens ?? approximateTokens(input.response.content)
          }
        }
      : {}),
    issues
  };
  return assertProviderCallSchema(report);
}

export function assertProviderConfigSchema(config: ProviderConfig): ProviderConfig {
  const result = validateSchema('hadara.provider.config.v1', config);
  if (!result.ok) {
    throw new ProviderConfigError(formatSchemaIssues('Provider config', result.issues));
  }
  return config;
}

export function assertProviderCallSchema(report: ProviderCallReport): ProviderCallReport {
  const result = validateSchema('hadara.provider.call.v1', report);
  if (!result.ok) {
    throw new ProviderCallReportError(formatSchemaIssues('Provider call report', result.issues));
  }
  return report;
}

function normalizeProviderCallIssue(error: ProviderError | Error | unknown): ProviderCallIssue {
  if (isProviderError(error)) {
    return {
      severity: 'error',
      code: error.code,
      message: redactSecrets(error.message),
      retriable: error.retriable
    };
  }
  return {
    severity: 'error',
    code: 'PROVIDER_UNKNOWN',
    message: redactSecrets(error instanceof Error ? error.message : String(error)),
    retriable: false
  };
}

function rejectSecretValueFields(input: ProviderAdapterConfigInput): void {
  const candidate = input as unknown as Record<string, unknown>;
  for (const key of SECRET_VALUE_KEYS) {
    if (Object.prototype.hasOwnProperty.call(candidate, key)) {
      throw new ProviderConfigError(`Provider config must reference secret environment variable names, not "${key}" values.`);
    }
  }
}

function rejectUnknownFields(input: unknown, allowedKeys: Set<string>, label: string): void {
  if (!isPlainObject(input)) {
    throw new ProviderConfigError(`${label} must be an object.`);
  }
  const unknownKeys = Object.keys(input).filter((key) => !allowedKeys.has(key));
  if (unknownKeys.length > 0) {
    throw new ProviderConfigError(`${label} contains unsupported field(s): ${unknownKeys.join(', ')}.`);
  }
}

function normalizeProviderId<T extends Error>(
  value: string,
  label: string,
  ErrorClass: new (message: string) => T
): string {
  const id = requireNonEmptyString(value, label, ErrorClass);
  if (!PROVIDER_ID_PATTERN.test(id)) {
    throw new ErrorClass(`${label} must match ${PROVIDER_ID_PATTERN.source}.`);
  }
  return id;
}

function normalizeProviderKind(value: ProviderAdapterKind): ProviderAdapterKind {
  if (!PROVIDER_KIND_VALUES.has(value)) {
    throw new ProviderConfigError(`provider kind must be one of ${Array.from(PROVIDER_KIND_VALUES).join(', ')}.`);
  }
  return value;
}

function normalizeCostProfile(value: ProviderCapabilities['costProfile'] | undefined): ProviderCapabilities['costProfile'] {
  const costProfile = value ?? 'unknown';
  if (!COST_PROFILE_VALUES.has(costProfile)) {
    throw new ProviderConfigError(`costProfile must be one of ${Array.from(COST_PROFILE_VALUES).join(', ')}.`);
  }
  return costProfile;
}

function normalizeCapabilities(input: ProviderAdapterConfigInput['capabilities']): ProviderAdapterConfig['capabilities'] {
  if (input !== undefined) {
    rejectUnknownFields(input as unknown, PROVIDER_CAPABILITY_INPUT_KEYS, 'provider capabilities');
  }
  return {
    streaming: optionalBoolean(input?.supportsStreaming, 'supportsStreaming') ?? false,
    toolCalling: optionalBoolean(input?.supportsToolCalling, 'supportsToolCalling') ?? false,
    reasoning: optionalBoolean(input?.supportsReasoning, 'supportsReasoning') ?? false,
    vision: optionalBoolean(input?.supportsVision, 'supportsVision') ?? false
  };
}

function optionalBoolean(value: boolean | undefined, label: string): boolean | undefined {
  if (value === undefined) return undefined;
  if (typeof value !== 'boolean') {
    throw new ProviderConfigError(`${label} must be a boolean.`);
  }
  return value;
}

function normalizeEnvName(value: string, fieldName: string): string {
  const envName = requireNonEmptyString(value, fieldName, ProviderConfigError);
  if (!ENV_NAME_PATTERN.test(envName)) {
    throw new ProviderConfigError(`${fieldName} must be an environment variable name.`);
  }
  return envName;
}

function requireNonEmptyString<T extends Error>(value: string, label: string, ErrorClass: new (message: string) => T): string {
  if (typeof value !== 'string' || value.trim().length === 0) {
    throw new ErrorClass(`${label} must be a non-empty string.`);
  }
  return value.trim();
}

function approximateTokens(input: string): number {
  return Math.max(1, Math.ceil(input.length / 4));
}

function isProviderError(error: unknown): error is ProviderError {
  return Boolean(error && typeof error === 'object' && 'provider' in error && 'code' in error && 'retriable' in error);
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function formatSchemaIssues(label: string, issues: Array<{ path: string; code: string; message: string }>): string {
  const firstIssue = issues[0];
  if (!firstIssue) return `${label} failed schema validation.`;
  return `${label} failed schema validation: ${firstIssue.path} ${firstIssue.code} ${firstIssue.message}`;
}
