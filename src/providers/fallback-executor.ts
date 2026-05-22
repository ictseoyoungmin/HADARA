import { ChatRequest, ChatResponse, ProviderClient, ProviderError } from './provider-contract';

export interface ProviderFallbackAttempt {
  provider: string;
  ok: boolean;
  model?: string;
  error?: ProviderError;
}

export interface ProviderFallbackResult {
  response: ChatResponse;
  attempts: ProviderFallbackAttempt[];
}

export class ProviderFallbackError extends Error {
  readonly attempts: ProviderFallbackAttempt[];

  constructor(attempts: ProviderFallbackAttempt[]) {
    super('All provider fallback attempts failed.');
    this.name = 'ProviderFallbackError';
    this.attempts = attempts;
  }
}

export async function chatWithProviderFallback(
  providers: ProviderClient[],
  request: ChatRequest
): Promise<ProviderFallbackResult> {
  if (providers.length === 0) {
    throw new ProviderFallbackError([]);
  }

  const attempts: ProviderFallbackAttempt[] = [];
  for (const provider of providers) {
    try {
      const response = await provider.chat(request);
      attempts.push({
        provider: provider.id,
        ok: true,
        model: response.model
      });
      return { response, attempts };
    } catch (error) {
      attempts.push({
        provider: provider.id,
        ok: false,
        error: normalizeProviderFailure(provider, error)
      });
    }
  }

  throw new ProviderFallbackError(attempts);
}

function normalizeProviderFailure(provider: ProviderClient, error: unknown): ProviderError {
  if (isProviderError(error)) return error;
  return provider.normalizeError(error);
}

function isProviderError(error: unknown): error is ProviderError {
  return Boolean(error && typeof error === 'object' && 'provider' in error && 'code' in error && 'retriable' in error);
}

