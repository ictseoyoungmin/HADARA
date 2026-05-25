import { redactSecrets } from '../core/redaction';
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

const SECRET_VALUE_KEYS = new Set(['apiKey', 'apiKeyValue', 'token', 'secret', 'password', 'authorization']);
const ENV_NAME_PATTERN = /^[A-Z_][A-Z0-9_]*$/;

export function createProviderConfig(input: ProviderConfigInput): ProviderConfig {
  const providers = input.providers.map(normalizeProviderConfig);
  const defaultProvider = input.defaultProvider ?? null;
  if (defaultProvider && !providers.some((provider) => provider.id === defaultProvider)) {
    throw new ProviderConfigError(`Default provider "${defaultProvider}" is not configured.`);
  }
  return {
    schemaVersion: 'hadara.provider.config.v1',
    providers,
    defaultProvider
  };
}

export function normalizeProviderConfig(input: ProviderAdapterConfigInput): ProviderAdapterConfig {
  rejectSecretValueFields(input);
  const id = requireNonEmptyString(input.id, 'provider id');
  const model = requireNonEmptyString(input.model, 'provider model');
  const config: ProviderAdapterConfig = {
    id,
    kind: input.kind,
    enabled: input.enabled ?? false,
    model,
    capabilities: {
      streaming: input.capabilities?.supportsStreaming ?? false,
      toolCalling: input.capabilities?.supportsToolCalling ?? false,
      reasoning: input.capabilities?.supportsReasoning ?? false,
      vision: input.capabilities?.supportsVision ?? false
    },
    localOnly: input.localOnly ?? input.kind !== 'openai-compatible',
    costProfile: input.costProfile ?? 'unknown'
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
  const provider = requireNonEmptyString(input.provider, 'provider');
  const model = input.model ?? input.response?.model;
  const issues = input.error ? [normalizeProviderCallIssue(input.error)] : [];
  return {
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

function normalizeEnvName(value: string, fieldName: string): string {
  const envName = requireNonEmptyString(value, fieldName);
  if (!ENV_NAME_PATTERN.test(envName)) {
    throw new ProviderConfigError(`${fieldName} must be an environment variable name.`);
  }
  return envName;
}

function requireNonEmptyString(value: string, label: string): string {
  if (typeof value !== 'string' || value.trim().length === 0) {
    throw new ProviderConfigError(`${label} must be a non-empty string.`);
  }
  return value.trim();
}

function approximateTokens(input: string): number {
  return Math.max(1, Math.ceil(input.length / 4));
}

function isProviderError(error: unknown): error is ProviderError {
  return Boolean(error && typeof error === 'object' && 'provider' in error && 'code' in error && 'retriable' in error);
}
