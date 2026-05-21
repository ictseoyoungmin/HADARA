import {
  ChatRequest,
  ChatResponse,
  ProviderCapabilities,
  ProviderClient,
  ProviderError,
  ProviderStreamEvent
} from './provider-contract';

export interface ScriptedProviderStep {
  match?: string;
  response: string;
  finishReason?: ChatResponse['finishReason'];
}

export class ScriptedProvider implements ProviderClient {
  id = 'scripted';
  displayName = 'ScriptedProvider';
  capabilities: ProviderCapabilities = {
    supportsStreaming: true,
    supportsToolCalling: false,
    supportsReasoning: false,
    supportsVision: false,
    maxContextTokens: 8192,
    localOnly: true,
    costProfile: 'free'
  };

  constructor(private readonly script: ScriptedProviderStep[]) {}

  async chat(request: ChatRequest): Promise<ChatResponse> {
    const last = request.messages.at(-1)?.content ?? '';
    const step = this.script.find((item) => !item.match || last.includes(item.match));
    if (!step) {
      throw this.normalizeError(new Error(`No scripted response matched: ${last}`));
    }

    return {
      provider: this.id,
      model: request.model ?? 'scripted-model',
      content: step.response,
      finishReason: step.finishReason ?? 'stop'
    };
  }

  async *stream(request: ChatRequest): AsyncIterable<ProviderStreamEvent> {
    yield { type: 'start', provider: this.id, model: request.model ?? 'scripted-model' };
    try {
      const response = await this.chat(request);
      for (const token of response.content.split(' ')) {
        yield { type: 'delta', text: `${token} ` };
      }
      yield { type: 'finish', finishReason: response.finishReason };
    } catch (error) {
      const normalized = this.normalizeError(error);
      yield { type: 'error', message: normalized.message, retriable: normalized.retriable };
    }
  }

  async countTokens(input: string): Promise<{ tokens: number; approximate: boolean }> {
    return { tokens: Math.ceil(input.length / 4), approximate: true };
  }

  normalizeError(error: unknown): ProviderError {
    if (isProviderError(error)) return error;
    return {
      provider: this.id,
      code: 'SCRIPTED_PROVIDER_ERROR',
      message: error instanceof Error ? error.message : String(error),
      retriable: false
    };
  }
}

function isProviderError(error: unknown): error is ProviderError {
  return Boolean(error && typeof error === 'object' && 'provider' in error && 'code' in error && 'retriable' in error);
}
