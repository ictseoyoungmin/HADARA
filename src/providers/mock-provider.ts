import {
  ChatRequest,
  ChatResponse,
  ProviderCapabilities,
  ProviderClient,
  ProviderError,
  ProviderStreamEvent
} from './provider-contract';

export class MockProvider implements ProviderClient {
  id = 'mock';
  displayName = 'MockProvider';
  capabilities: ProviderCapabilities = {
    supportsStreaming: true,
    supportsToolCalling: false,
    supportsReasoning: false,
    supportsVision: false,
    maxContextTokens: 8192,
    localOnly: true,
    costProfile: 'free'
  };

  async chat(request: ChatRequest): Promise<ChatResponse> {
    const last = request.messages.at(-1)?.content ?? '';
    return {
      provider: this.id,
      model: request.model ?? 'mock-model',
      content: `Mock response for: ${last}`,
      finishReason: 'stop',
      usage: {
        inputTokens: (await this.countTokens(JSON.stringify(request.messages))).tokens,
        outputTokens: 8
      }
    };
  }

  async *stream(request: ChatRequest): AsyncIterable<ProviderStreamEvent> {
    yield { type: 'start', provider: this.id, model: request.model ?? 'mock-model' };
    const response = await this.chat(request);
    for (const token of response.content.split(' ')) {
      yield { type: 'delta', text: `${token} ` };
    }
    yield { type: 'finish', finishReason: response.finishReason };
  }

  async countTokens(input: string): Promise<{ tokens: number; approximate: boolean }> {
    return { tokens: Math.ceil(input.length / 4), approximate: true };
  }

  normalizeError(error: unknown): ProviderError {
    return {
      provider: this.id,
      code: 'MOCK_PROVIDER_ERROR',
      message: error instanceof Error ? error.message : String(error),
      retriable: false
    };
  }
}
